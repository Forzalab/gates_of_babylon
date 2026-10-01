#!/usr/bin/env python3
"""BGM for date-beta: src-bgm_1.mp3 -> bgm-sweet.mp3, src-bgm_2.mp3 -> bgm-dark.mp3 (psychological-horror pass).

Both: mono 44.1 kHz, HPF 60 Hz, made loopable (last 3 s crossfaded into the first 3 s, equal power),
-30 LUFS / TP -3 dB, mp3 96 kbps. A bed under the voice, never in your face.

Dark chain (sweet on the surface, wrong underneath), see NOTES.md:
  varispeed -1.5 st -> wow 0.25 Hz + flutter 4 Hz, then 4 parallel layers mixed:
  dry through-the-wall (LPF 3.2 kHz, soft tanh clip) | ghost double -40 cents +25 ms -9 dB |
  sub octave-down LPF 180 Hz -14 dB | bitcrush 6-bit -18 dB
  -> dark multi-tap room (0.4/0.75/1.2 s) -> LPF 6 kHz -> breathing tremolo 0.1 Hz 15%.
Run from the repo root: python3 research/sprint-1001/bgm/process.py   (needs ffmpeg with rubberband, numpy)
"""
import subprocess, numpy as np
from pathlib import Path

HERE = Path(__file__).parent
OUT = Path('public/date-beta/music')
SR, XF = 44100, 3.0

SWEET = 'aformat=channel_layouts=mono,aresample=44100,highpass=f=60,lowpass=f=9000'
DARK = (
    f'[0:a]aformat=channel_layouts=mono,asetrate={SR}*0.917004,aresample={SR},'  # 2^(-1.5/12): slowed tape
    'vibrato=f=0.25:d=0.12,vibrato=f=4:d=0.04,asplit=4[a][b][c][d];'           # seasick wow + flutter
    '[a]lowpass=f=3200,asoftclip=type=tanh[dry];'                               # heard through a wall
    '[b]rubberband=pitch=0.97716,adelay=25,volume=-9dB[ghost];'                 # -40 cents: beats against dry
    '[c]rubberband=pitch=0.5,lowpass=f=180,volume=-14dB[sub];'                  # dread, felt not heard
    '[d]acrusher=bits=6:mode=log:aa=1,lowpass=f=5000,volume=-18dB[crush];'      # worn, decayed
    '[dry][ghost][sub][crush]amix=inputs=4:normalize=0,'
    'aecho=0.8:0.55:400|750|1200:0.35|0.25|0.18,lowpass=f=6000,'               # long distant room
    'tremolo=f=0.1:d=0.15,highpass=f=60[out]'                                   # slow breathing
)


def render(src, graph, complex_=False):
    cmd = ['ffmpeg', '-v', 'error', '-i', str(src)]
    cmd += ['-filter_complex', graph, '-map', '[out]'] if complex_ else ['-af', graph]
    cmd += ['-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, check=True, capture_output=True).stdout, dtype=np.float32).copy()


def loopable(x):
    n = int(XF * SR)
    t = np.linspace(0, np.pi / 2, n, dtype=np.float32)
    y = x[:-n].copy()
    y[:n] = x[:n] * np.sin(t) + x[-n:] * np.cos(t)  # the tail fades out over the head fading in: no seam at the wrap
    return y


def encode(x, dst):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-',
                    '-af', 'loudnorm=I=-30:TP=-3:LRA=11', '-ar', str(SR), '-b:a', '96k', str(dst)],
                   input=x.tobytes(), check=True)


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    encode(loopable(render(HERE / 'src-bgm_1.mp3', SWEET)), OUT / 'bgm-sweet.mp3')
    encode(loopable(render(HERE / 'src-bgm_2.mp3', DARK, True)), OUT / 'bgm-dark.mp3')
    print('ok', *(OUT / f for f in ('bgm-sweet.mp3', 'bgm-dark.mp3')))
