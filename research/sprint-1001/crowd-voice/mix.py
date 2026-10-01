#!/usr/bin/env python3
"""Crowd-chant processor for the 4 CROWD takes (leave-fu / leave-yeah, beats 2-3).

Re-runnable: always reads the pristine takes from orig/*.mp3.orig and overwrites
public/date-beta/voice/narration/<scene>/<file>.mp3 (mono, 44.1k, mp3 128k).
Pure ffmpeg (rubberband, adelay, aecho, lowpass, asoftclip); deterministic (seeded).
  FFMPEG=/usr/bin/ffmpeg python3 research/sprint-1001/crowd-voice/mix.py [--restore]
"""
import os, random, re, shutil, subprocess, sys, tempfile

FF = os.environ.get("FFMPEG", "/usr/bin/ffmpeg")
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "../../.."))
VOICE = os.path.join(ROOT, "public/date-beta/voice/narration")
ORIG = os.path.join(HERE, "orig")
TAIL = 0.12  # extra room so the smeared copies + reverb tail fade out clear of the file end (qa: tail >= 0.02 s)

# name -> (rel path, dense?)  dense = beat 3 (71 figures): more layers, wider, closer
TAKES = {
    "leave-fu/380_2": 0, "leave-fu/381_3": 1,
    "leave-yeah/383_2": 0, "leave-yeah/384_3": 1,
}
# (layers, delay spread ms, far-layer share)
DENSITY = {0: dict(n=7, spread=55, far=3, rev=0.30, low=0.35),
           1: dict(n=11, spread=75, far=5, rev=0.38, low=0.45)}


def run(args):
    r = subprocess.run([FF, "-hide_banner", "-nostats", "-y"] + args, capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr[-2000:])
    return r.stderr


def measure(path):
    err = run(["-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"])
    s = err[err.rfind("Summary"):]
    return float(re.search(r"I:\s+(-?[\d.]+) LUFS", s).group(1)), float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", s).group(1))


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True).stdout
    return float(out)


def build(src, dst_wav, dens, seed, dur):
    cfg = DENSITY[dens]
    rnd = random.Random(seed)
    n, far_n = cfg["n"], cfg["far"]
    chains, labels = [], []
    # layer 0: dry original, loudest, center (intelligibility anchor)
    chains.append("[a0]highpass=f=90,volume=1.0[L0]"); labels.append("L0")
    # pitch set: small +/- semitone offsets so each reads as a different body
    semis = [-3.5, -2, -1, 1, 2, 3, 4, -4, 2.5, -1.5, 1.5, -2.5]
    rnd.shuffle(semis)
    for i in range(1, n):
        st = semis[(i - 1) % len(semis)]
        far = i > n - 1 - far_n               # last layers are far
        pitch = 2 ** (st / 12)
        tempo = 1 + rnd.uniform(-0.035, 0.035)  # slight stretch so the chant smears
        delay = int(rnd.uniform(10, cfg["spread"]) if not far else rnd.uniform(25, cfg["spread"] + 30))
        formant = "preserved" if i % 2 else "shifted"
        f = (f"[a{i}]rubberband=pitch={pitch:.4f}:tempo={tempo:.4f}:formant={formant}:transients=smooth,"
             f"adelay={delay},")
        if far:   # far: dull, quiet, wetter
            f += f"lowpass=f={rnd.randint(2200, 3400)},highpass=f=140,aecho=0.7:0.5:{rnd.randint(70,110)}|{rnd.randint(150,230)}:0.35|0.25,volume={rnd.uniform(0.22,0.32):.3f}"
        else:     # near / mid: nearly full band
            f += f"highpass=f=100,lowpass=f={rnd.randint(5200, 7500)},volume={rnd.uniform(0.38,0.58):.3f}"
        chains.append(f + f"[L{i}]"); labels.append(f"L{i}")
    # low "mass" layers: an octave down (and 7 st down for a fifth under), dark and wide
    nlow = 2 if dens else 1
    for j in range(nlow):
        pitch = 0.5 if j == 0 else 0.5 * 2 ** (-0.5 / 12) * 1.0
        d = int(rnd.uniform(20, cfg["spread"]))
        chains.append(f"[a{n+j}]rubberband=pitch={pitch:.4f}:tempo=0.99:formant=shifted,adelay={d},"
                      f"lowpass=f=1500,volume={cfg['low']:.2f}[L{n+j}]")
        labels.append(f"L{n+j}")
    nsrc = n + nlow
    split = "[0:a]asplit=%d%s" % (nsrc, "".join(f"[a{i}]" for i in range(nsrc)))
    mix = "".join(f"[{l}]" for l in labels) + f"amix=inputs={len(labels)}:normalize=0:duration=longest,asoftclip=type=tanh:param=1.4[crowd]"
    # dark room: lowpassed multi-tap echo as a send, mixed under the crowd
    room = ("[crowd]asplit=2[c1][c2];"
            "[c2]lowpass=f=2400,aecho=0.8:0.7:47|83|131|197|283:0.5|0.4|0.32|0.24|0.16,"
            f"volume={cfg['rev']}[wet]")
    # slow breath pad: pink-ish noise, band-limited, tremolo ~0.35 Hz swell
    breath = (f"anoisesrc=color=brown:r=44100:d={dur + 0.3}:seed={seed},lowpass=f=500,highpass=f=70,"
              f"tremolo=f=0.45:d=0.7,volume=0.18,afade=t=in:d=0.5[breath]")
    final = (f"[c1][wet][breath]amix=inputs=3:normalize=0:duration=longest,"
             f"atrim=0:{dur:.3f},afade=t=out:st={dur-0.16:.3f}:d=0.14,alimiter=limit=0.8:level=0[out]")
    graph = ";".join([split] + chains + [mix, room, breath, final])
    run(["-i", src, "-filter_complex", graph, "-map", "[out]", "-ac", "1", "-ar", "44100", dst_wav])


def encode(wav, dst, gain_db):
    run(["-i", wav, "-af", f"volume={gain_db:.2f}dB,alimiter=limit=0.84:level=0:attack=2:release=40",
         "-ac", "1", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "128k", dst])


def main():
    restore = "--restore" in sys.argv
    os.makedirs(ORIG, exist_ok=True)
    tmp = tempfile.mkdtemp()
    for rel, dens in TAKES.items():
        dst = os.path.join(VOICE, rel + ".mp3")
        bak = os.path.join(ORIG, rel.replace("/", "_") + ".mp3.orig")
        if not os.path.exists(bak):
            shutil.copy(dst, bak)
        if restore:
            shutil.copy(bak, dst); print("restored", rel); continue
        tgt_i, _ = measure(bak)
        dur = duration(bak)
        wav = os.path.join(tmp, "m.wav")
        build(bak, wav, dens, seed=sum(map(ord, rel)), dur=dur + TAIL)
        i0, _ = measure(wav)
        gain = tgt_i - i0
        for _ in range(4):   # converge on target LUFS through the limiter + mp3 encode
            encode(wav, dst, gain)
            i1, p1 = measure(dst)
            if abs(i1 - tgt_i) <= 0.3:
                break
            gain += tgt_i - i1
        print(f"{rel}: target {tgt_i:.1f} LUFS -> {i1:.1f} LUFS, peak {p1:.1f} dBFS, dur {duration(bak):.3f}s -> {duration(dst):.3f}s")
    shutil.rmtree(tmp)


if __name__ == "__main__":
    main()
