#!/usr/bin/env python3
"""Crowd chant v2: 5-6 layered voices (pitch/formant/offset/detune/chorus), flattened to mono mp3.
Reads orig/*.mp3.orig, overwrites public/date-beta/voice/narration/<scene>/<file>.mp3.
  python3 research/sprint-1001/crowd-voice/mix_v2.py
Formant shift trick (ffmpeg has no formant scale): asetrate F st, rubberband tempo 1/F, pitch P-F, formant=preserved.
"""
import os, random, re, subprocess, sys, tempfile

FF = os.environ.get("FFMPEG", "/usr/bin/ffmpeg")
HERE = os.path.dirname(os.path.abspath(__file__))
VOICE = os.path.join(HERE, "../../../public/date-beta/voice/narration")
# v1 reference (LUFS, true peak dBFS, duration s, voices) measured on the v1 files before replacing them
TAKES = {
    "leave-fu/380_2": (-26.1, -9.8, 2.507755, 5),
    "leave-fu/381_3": (-26.1, -9.1, 3.395918, 6),
    "leave-yeah/383_2": (-25.3, -9.8, 2.429388, 5),
    "leave-yeah/384_3": (-26.4, -10.0, 3.395918, 6),
}
# (pitch st, formant st, delay ms, gain dB, chorus)
VOICES = [(0, 0, 0, -3, 0), (2.1, 1.5, 18, -5, 0), (-2.1, -2, 27, -6, 1), (3, 0, 35, -8, 0),
          (-3, 1, 23, -9, 1), (1.1, -2, 40, -7, 0)]


def run(a):
    r = subprocess.run([FF, "-hide_banner", "-nostats", "-y"] + a, capture_output=True, text=True)
    if r.returncode:
        sys.exit(r.stderr[-2000:])
    return r.stderr


def measure(p):
    e = run(["-i", p, "-af", "ebur128=peak=true", "-f", "null", "-"])
    s = e[e.rfind("Summary"):]
    return float(re.search(r"I:\s+(-?[\d.]+) LUFS", s).group(1)), float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", s).group(1))


def build(src, wav, n, dur, seed):
    rnd = random.Random(seed)
    ch, lab = [], []
    for i, (p, f, d, g, cho) in enumerate(VOICES[:n]):
        d = d + (rnd.randint(-2, 2) if i else 0)
        tempo = 1 + (rnd.uniform(-0.01, 0.01) if i else 0)
        fr = 2 ** (f / 12)
        c = f"[a{i}]"
        if p or f:
            if f:
                c += f"asetrate={44100 * fr:.1f},aresample=44100,"
            c += f"rubberband=tempo={tempo / fr:.4f}:pitch={2 ** ((p - f) / 12):.4f}:formant=preserved,"
        if cho:
            c += "chorus=0.6:0.9:38:0.35:0.25:2,"
        c += "highpass=f=90,equalizer=f=320:t=q:w=1.2:g=-3,equalizer=f=3500:t=q:w=1:g=2,"
        if i >= 3:
            c += "lowpass=f=6500,"
        c += (f"adelay={d}," if d else "") + f"volume={g}dB[v{i}]"
        ch.append(c)
        lab.append(f"[v{i}]")
    g = ("[0:a]asplit=%d%s;" % (n, "".join(f"[a{i}]" for i in range(n))) + ";".join(ch) + ";" +
         "".join(lab) + f"amix=inputs={n}:normalize=0:duration=longest[bus];"
         "[bus]asplit=2[d][r];[r]lowpass=f=3000,aecho=0.8:0.6:23|41|67:0.3|0.2|0.12,volume=0.35[w];"
         f"[d][w]amix=inputs=2:normalize=0:duration=longest,atrim=0:{dur:.3f},afade=t=out:st={dur - 0.16:.3f}:d=0.14[out]")
    run(["-i", src, "-filter_complex", g, "-map", "[out]", "-ac", "1", "-ar", "44100", wav])


def encode(wav, dst, gain, peak):
    lim = 10 ** (peak / 20)
    run(["-i", wav, "-af", f"volume={gain:.2f}dB,alimiter=limit={lim:.4f}:level=0:attack=2:release=40",
         "-ac", "1", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "128k", dst])


def main():
    tmp = tempfile.mkdtemp()
    for rel, (lufs, peak, dur, n) in TAKES.items():
        src = os.path.join(HERE, "orig", rel.replace("/", "_") + ".mp3.orig")
        dst = os.path.join(VOICE, rel + ".mp3")
        wav = os.path.join(tmp, "m.wav")
        build(src, wav, n, dur, sum(map(ord, rel)))
        gain = lufs - measure(wav)[0]
        for _ in range(5):
            encode(wav, dst, gain, peak)
            i1, p1 = measure(dst)
            if abs(i1 - lufs) <= 0.3:
                break
            gain += lufs - i1
        print(f"{rel}: {n} voices, target {lufs} LUFS/{peak} dBFS -> {i1} LUFS/{p1} dBFS")


if __name__ == "__main__":
    main()
