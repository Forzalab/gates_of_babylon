#!/usr/bin/env python3
"""Audio QA for every voice take (Nanda + narrator): showreel standard, not "the file exists".

python3 scripts/narration/qa.py [--fix] [--asr]
  measures per take: integrated loudness (EBU R128 LUFS), sample peak + clipped samples, leading/trailing silence,
  speech span, words/second (narrator), and with --asr a round-trip transcript (ElevenLabs scribe) -> word error rate
  and the pronunciation words it missed.
  --fix: loudness-normalise outliers (> 1.5 dB from the common target) and give clipped starts/ends a 40 ms pad
  (re-encoded 44.1 kHz / 128 kbps mp3, same path). Run the timing table again after a fix.
Writes research/sprint-0930/narration/qa/qa.json (the node test fails on its hard errors) + prints a summary.
Needs ffmpeg: $FFMPEG, else imageio-ffmpeg's bundled binary (pip install imageio-ffmpeg).
"""
import json, os, re, subprocess, sys, statistics as st, pathlib
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'research/sprint-0930/narration/qa'
MAN = json.loads((ROOT / 'src/date-beta/voice/manifest.json').read_text())
FULL = {e['file'].removeprefix('public/'): e for e in json.loads((ROOT / 'research/sprint-0930/voice/audio-manifest.json').read_text())}
TOL_DB, PAD_S, SIL_DB = 1.5, 0.040, -45.0
# words the TTS is likely to get wrong (JP / puns / brand names): checked in the ASR round trip
RISKY = ['nand', 'or', 'akiba', 'itadakimasu', 'umeboshi', 'tamagoyaki', 'katsu', 'saag', 'naan', 'lassi', 'oshi',
         'onigiri', 'konbini', 'yen', 'pm', 'ne', 'senpai', 'bento', 'forecast', 'shibuya', 'genkan', 'ume']


def ffmpeg():
    if os.environ.get('FFMPEG'): return os.environ['FFMPEG']
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


FF = ffmpeg()


def pcm(path, sr=44100):
    raw = subprocess.run([FF, '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32), sr


def lufs(path):
    err = subprocess.run([FF, '-hide_banner', '-nostats', '-i', str(path), '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.findall(r'I:\s+(-?[\d.]+|-inf) LUFS', err)
    return float(m[-1]) if m and m[-1] != '-inf' else None


def edges(x, sr):
    """leading / trailing silence (s) at SIL_DB on 10 ms windows, and the speech span."""
    w = int(sr * 0.01)
    n = len(x) // w
    if n == 0: return 0, 0, 0
    rms = np.sqrt(np.mean(x[: n * w].reshape(n, w) ** 2, axis=1) + 1e-12)
    loud = np.nonzero(20 * np.log10(rms) > SIL_DB)[0]
    if not len(loud): return n / 100, 0, 0
    return loud[0] / 100, (n - 1 - loud[-1]) / 100, (loud[-1] - loud[0] + 1) / 100


def words(t):
    return re.findall(r"[a-z0-9']+", re.sub(r'\[[^\]]*\]', ' ', t.lower().replace('-', '')))


def wer(ref, hyp):
    r, h = words(ref), words(hyp)
    d = list(range(len(h) + 1))
    for i, a in enumerate(r, 1):
        prev, d[0] = d[0], i
        for j, b in enumerate(h, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (a != b))
    return d[len(h)] / max(1, len(r))


def key():
    if os.environ.get('ELEVENLABS_API_KEY'): return os.environ['ELEVENLABS_API_KEY']
    m = re.search(r'ELEVENLABS_API_KEY\s*=\s*["\']?([^"\'\s]+)', pathlib.Path(os.environ['ELEVEN_ENV']).read_text())
    return m.group(1)


def asr(path, cache):
    if path in cache: return cache[path]
    import requests
    with open(ROOT / 'public' / path, 'rb') as f:
        r = requests.post('https://api.elevenlabs.io/v1/speech-to-text', headers={'xi-api-key': key()},
                          data={'model_id': 'scribe_v1', 'language_code': 'en'}, files={'file': f}, timeout=120)
    if r.status_code in (401, 402) or re.search('quota|credits', r.text[:300], re.I):
        sys.exit(f'STOP: ElevenLabs {r.status_code}: {r.text[:200]}')
    r.raise_for_status()
    cache[path] = r.json().get('text', '')
    return cache[path]


def fix(path, gain_db, pad_head, pad_tail):
    src = ROOT / 'public' / path
    tmp = src.with_suffix('.tmp.mp3')
    af = [f'volume={gain_db:.2f}dB'] if gain_db else []
    if pad_head: af.append(f'adelay={int(PAD_S * 1000)}:all=1')
    if pad_tail: af.append(f'apad=pad_dur={PAD_S}')
    af.append('alimiter=limit=0.95:attack=2:release=50')
    subprocess.run([FF, '-v', 'error', '-y', '-i', str(src), '-af', ','.join(af), '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '128k', str(tmp)], check=True)
    tmp.replace(src)


def main():
    do_fix, do_asr = '--fix' in sys.argv, '--asr' in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    cache_p = OUT / 'asr.json'
    cache = json.loads(cache_p.read_text()) if cache_p.exists() else {}
    rows = []
    for e in MAN:
        p = ROOT / 'public' / e['file']
        x, sr = pcm(p)
        head, tail, span = edges(x, sr)
        who = 'narrator' if FULL.get(e['file'], {}).get('voice') == 'narrator' else 'nanda'
        row = dict(file=e['file'], scene=e['scene'], beat=e['beat'], who=who, text=e['text'], ms=round(len(x) / sr * 1000),
                   lufs=lufs(p), peak=float(np.max(np.abs(x))) if len(x) else 0, clipped=int(np.sum(np.abs(x) >= 0.999)),
                   head=head, tail=tail, span=span, wps=round(len(words(e['text'])) / span, 2) if span else 0)
        if do_asr and who == 'narrator':
            row['asr'] = asr(e['file'], cache)
            row['wer'] = round(wer(e['text'], row['asr']), 3)
            hyp = set(words(row['asr']))
            row['missed'] = [w for w in words(e['text']) if w in RISKY and w not in hyp]
        rows.append(row)
        print(f"{e['file']:60s} {row['lufs']} LUFS  peak {row['peak']:.2f}  head {head:.2f}s tail {tail:.2f}s  {row['wps']} w/s {row.get('wer', '')}", flush=True)
    cache_p.write_text(json.dumps(cache, indent=1))
    target = st.median([r['lufs'] for r in rows if r['lufs'] is not None])
    nar = [r['wps'] for r in rows if r['who'] == 'narrator' and r['wps']]
    wmed = st.median(nar)
    wq = np.percentile(nar, [25, 75])
    band = (wq[0] - 1.5 * (wq[1] - wq[0]), wq[1] + 1.5 * (wq[1] - wq[0]))  # Tukey fence: the speed band
    fixed = []
    for r in rows:
        r['dLufs'] = round(r['lufs'] - target, 2) if r['lufs'] is not None else None
        r['clippedStart'] = r['head'] < 0.02
        r['clippedEnd'] = r['tail'] < 0.02
        r['speedOutlier'] = r['who'] == 'narrator' and not (band[0] <= r['wps'] <= band[1])
        need_gain = r['dLufs'] is not None and abs(r['dLufs']) > TOL_DB
        if do_fix and (need_gain or r['clippedStart'] or r['clippedEnd'] or r['clipped']):
            fix(r['file'], -r['dLufs'] if need_gain else 0, r['clippedStart'], r['clippedEnd'])
            fixed.append(r['file'])
    if fixed:  # re-measure what was touched
        for r in rows:
            if r['file'] in fixed:
                p = ROOT / 'public' / r['file']
                x, sr = pcm(p)
                r['head'], r['tail'], r['span'] = edges(x, sr)
                r.update(lufs=lufs(p), peak=float(np.max(np.abs(x))), clipped=int(np.sum(np.abs(x) >= 0.999)), ms=round(len(x) / sr * 1000), fixed=True)
                r['dLufs'] = round(r['lufs'] - target, 2)
                r['clippedStart'], r['clippedEnd'] = r['head'] < 0.02, r['tail'] < 0.02
    hard = []
    for r in rows:
        if r['clipped']: hard.append(f"{r['file']}: {r['clipped']} clipped samples")
        if r['clippedStart'] or r['clippedEnd']: hard.append(f"{r['file']}: speech touches the {'start' if r['clippedStart'] else 'end'}")
        if r['dLufs'] is not None and abs(r['dLufs']) > TOL_DB: hard.append(f"{r['file']}: loudness {r['dLufs']:+} dB off target")
    # spot-listen: the riskiest takes (ASR misses, word error, speed outliers, loudness edits, risky words)
    def risk(r):
        return (3 * len(r.get('missed', [])) + 4 * r.get('wer', 0) + (2 if r['speedOutlier'] else 0)
                + abs(r['dLufs'] or 0) / 3 + (1 if any(w in RISKY for w in words(r['text'])) else 0))
    spot = sorted(rows, key=risk, reverse=True)[:10]
    (OUT / 'qa.json').write_text(json.dumps(dict(targetLufs=round(target, 2), tolDb=TOL_DB, wpsMedian=wmed, wpsBand=[round(b, 2) for b in band],
                                                 fixed=fixed, hard=hard, spot=[r['file'] for r in spot], rows=rows), indent=1, default=lambda o: o.item()))
    print(f'target {target:.1f} LUFS, narrator w/s median {wmed:.2f} band {band[0]:.2f}..{band[1]:.2f}, fixed {len(fixed)}, hard {len(hard)}')
    for h in hard[:20]: print('HARD', h)


if __name__ == '__main__':
    main()
