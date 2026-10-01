#!/usr/bin/env python3
"""sfx-wire audio QA: every sfx file's loudness at its in-game level vs the voice takes, plus the bed loop seams.

python3 research/sprint-0930/sfx-wire/levels.py
  per sfx id: EBU R128 integrated LUFS (I) and momentary max (M, 400 ms) of the file (ffmpeg ebur128), the manifest gain
  trim applied -> in-game level; beds (loop: true) also ducked (-8 dB, the bus under a voice take).
  voice: the median integrated LUFS of the shipped takes (the showreel QA target, scripts/narration/qa.py).
  loop seam (beds): the jump across the wrap (last sample -> first sample) and the RMS of the last vs first 50 ms.
Needs numpy + ffmpeg (FFMPEG, else imageio-ffmpeg's binary). Prints a table + writes levels.json next to this file.
"""
import json, os, re, subprocess, pathlib, statistics as st
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parents[3]
MAN = json.loads((ROOT / 'src/date-beta/assets.json').read_text())
DUCK_DB = 20 * np.log10(0.398)
FF = os.environ.get('FFMPEG') or __import__('imageio_ffmpeg').get_ffmpeg_exe()


def ebur(path):
    r = subprocess.run([FF, '-hide_banner', '-nostats', '-i', str(path), '-af', 'apad=whole_dur=2,ebur128=peak=sample', '-f', 'null', '-'], capture_output=True, text=True).stderr
    i = float(re.findall(r'I:\s+(-?[\d.]+|-inf) LUFS', r)[-1])
    ms = [float(m) for m in re.findall(r'M:\s*(-?[\d.]+)', r) if float(m) > -70]
    return i, max(ms) if ms else float('-inf')


def pcm(path):
    raw = subprocess.run([FF, '-v', 'error', '-i', str(path), '-ac', '1', '-ar', '44100', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def seam(x, n=2205):
    rms = lambda v: 20 * np.log10(np.sqrt(np.mean(v ** 2)) + 1e-9)
    step = abs(float(x[-1]) - float(x[0]))
    typ = float(np.percentile(np.abs(np.diff(x)), 99))  # a normal sample-to-sample step inside the file
    return step, typ, float(rms(x[-n:]) - rms(x[:n]))


def main():
    voice = sorted((ROOT / 'public/date-beta/voice').rglob('*.mp3'))
    vm_ = [ebur(p) for p in voice[::6]]  # every 6th take: the takes are normalised to one target (QA.md), a sample is enough
    vi, vm = [x[0] for x in vm_], [x[1] for x in vm_]
    vt, vmm = st.median(vi), st.median(vm)
    rows = []
    for id_, a in MAN['assets'].items():
        if a.get('kind') != 'sfx' or not a.get('path'):
            continue
        p = ROOT / 'public' / a['path']
        i, m = ebur(p)
        g = float(20 * np.log10(a.get('gain', 1)))
        row = {'id': id_, 'bed': bool(a.get('loop')), 'gain_db': round(g, 1), 'I': round(i + g, 1), 'M': round(m + g, 1)}
        if a.get('loop'):
            row['I_ducked'] = round(i + g + DUCK_DB, 1)
            step, typ, drift = seam(pcm(p))
            row['seam_step'], row['seam_typ99'], row['seam_rms_db'] = round(step, 4), round(typ, 4), round(drift, 1)
        rows.append(row)
    out = {'voice_takes_sampled': len(vi), 'voice_I_median': round(vt, 1), 'voice_M_max_median': round(vmm, 1), 'duck_db': round(DUCK_DB, 1), 'sfx': rows}
    (pathlib.Path(__file__).parent / 'levels.json').write_text(json.dumps(out, indent=1) + '\n')
    print(f'voice median I = {vt:.1f} LUFS, median M max = {vmm:.1f} ({len(vi)} takes sampled); duck {DUCK_DB:.1f} dB')
    print(f'{"id":14s} {"bed":3s} {"gain":>6s} {"I":>6s} {"M max":>6s} {"I duck":>6s}  seam')
    for r in rows:
        s = f"step {r['seam_step']:.4f} (99% {r['seam_typ99']:.4f}) rms {r['seam_rms_db']:+.1f} dB" if r['bed'] else ''
        print(f"{r['id']:14s} {'Y' if r['bed'] else '':3s} {r['gain_db']:6.1f} {r['I']:6.1f} {r['M']:6.1f} {r.get('I_ducked', ''):>6}  {s}")


if __name__ == '__main__':
    main()
