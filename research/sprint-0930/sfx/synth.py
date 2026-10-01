#!/usr/bin/env python3
"""Synthesize every date-beta sound effect from scratch (no samples). Deterministic, 44.1 kHz mono 16-bit WAV.
Run: python3 research/sprint-0930/sfx/synth.py  -> public/date-beta/sfx/<id>.wav
Beds are loudness-normalised to ~-16 LUFS (approx: RMS-based) and crossfade-looped; one-shots peak at -1 dBFS."""
import os, wave
import numpy as np
from scipy import signal

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'public', 'date-beta', 'sfx')
rng = np.random.default_rng(930)


def t_(d): return np.arange(int(d * SR)) / SR
def noise(d): return rng.standard_normal(int(d * SR))
def bp(x, lo, hi, o=2): return signal.sosfilt(signal.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, 'high', fs=SR, output='sos'), x)
def expdecay(d, tau): return np.exp(-t_(d) / tau)
def adsr(d, a, r):
    t = t_(d); e = np.minimum(1, t / max(a, 1e-4)); return e * np.clip((d - t) / max(r, 1e-4), 0, 1)
def sine(f, d, ph=0): return np.sin(2 * np.pi * np.cumsum(np.broadcast_to(f, (int(d * SR),))) / SR + ph)
def place(buf, x, at):
    i = int(at * SR); n = min(len(x), len(buf) - i); buf[i:i + n] += x[:n]; return buf
def bell(f, d, partials=((1, 1, 1), (2.76, .35, .4), (5.4, .15, .2), (0.5, .2, 1.5))):
    return sum(a * sine(f * r, d) * expdecay(d, d * k / 3) for r, a, k in partials)
def slow_lfo(d, rate, depth, seed):
    # a smooth random wander, periodic over d so beds loop
    r = np.random.default_rng(seed); t = t_(d); out = np.zeros_like(t)
    for k in range(1, 5):
        out += r.uniform(.3, 1) / k * np.sin(2 * np.pi * max(1, round(rate * d * k)) * t / d + r.uniform(0, 6.28))
    return 1 + depth * out / np.max(np.abs(out))


# ---------- beds (loopable) ----------
def rain(d=8):
    x = bp(noise(d), 800, 7000) * 0.6 + lp(noise(d), 500) * 0.5
    for _ in range(int(d * 60)):
        f = rng.uniform(1500, 5000); dur = .03
        place(x, bp(noise(dur), f * .7, min(f * 1.3, 20000)) * expdecay(dur, .006) * rng.uniform(1, 4), rng.uniform(0, d - dur))
    return x
def wind(d=8): return bp(noise(d), 250, 1200) * slow_lfo(d, .25, .6, 1) + hp(noise(d), 3000) * .05
def train_hum(d=8):
    t = t_(d); x = lp(signal.sawtooth(2 * np.pi * 55 * t) + .5 * sine(110, d), 400) * .6 + lp(noise(d), 200) * .4
    for s in np.arange(.3, d, 1.0):  # rail joints, clack-clack
        for o in (0, .14): place(x, bp(noise(.08), 300, 1500) * expdecay(.08, .015) * 2, s + o)
    return x
def drone(d=8):
    return lp(sum(signal.sawtooth(2 * np.pi * f * t_(d)) for f in (55, 55.25, 82.5)), 600) * slow_lfo(d, .2, .3, 2)
def static(d=4): return hp(noise(d), 1500) * slow_lfo(d, .5, .5, 3) * .6 + (rng.random(int(d * SR)) > .9995) * rng.standard_normal(int(d * SR)) * 4
def umbrella(d=8):  # rain drumming on a taut canopy: low thuds + dull patter
    x = lp(noise(d), 1200) * .3
    for _ in range(int(d * 45)):
        dur = .06; f = rng.uniform(180, 420)
        place(x, (sine(f, dur) * .6 + bp(noise(dur), 400, 2500) * .5) * expdecay(dur, .012) * rng.uniform(.5, 2), rng.uniform(0, d - dur))
    return x
def kettle(d=6):
    t = t_(d); ramp = np.minimum(1, t / (d * .8))
    x = bp(noise(d), 900, 4000) * ramp * .6 + sine(2400 + 300 * ramp, d) * np.clip((t - d * .6) / (d * .4), 0, 1) * .25
    return x
BEDS = {'rain': rain, 'wind': wind, 'train-hum': train_hum, 'drone': drone, 'static': static, 'umbrella-rain': umbrella, 'kettle': kettle}


# ---------- one-shots ----------
def tick(): d = .08; return bp(noise(d), 2000, 6000) * expdecay(d, .004) + sine(1800, d) * expdecay(d, .006) * .5
def thump():  # heartbeat lub-dub
    d = 1.0; x = np.zeros(int(d * SR))
    for at, f, a in ((0, 60, 1), (.26, 70, .7)):
        n = .18; place(x, sine(np.linspace(f * 1.6, f, int(n * SR)), n) * expdecay(n, .05) * a, at)
    return x
def bell_door(): d = 2.4; x = np.zeros(int(d * SR)); place(x, bell(1319, 2), 0); place(x, bell(1047, 2), .35); return x
def breath():
    d = 2.6; t = t_(d); e = np.interp(t, [0, 1, 1.15, 2.6], [0, 1, .2, 0]) ** 1.5
    return bp(noise(d), 500, 2500) * e
def crunch():
    d = .35; x = np.zeros(int(d * SR))
    for _ in range(25): place(x, bp(noise(.02), 800, 6000) * expdecay(.02, .004) * rng.uniform(.3, 1), rng.uniform(0, .3))
    return x
def heart_pop(): d = .25; return sine(np.linspace(400, 900, int(d * SR)), d) * expdecay(d, .05) + bp(noise(d), 1000, 3000) * expdecay(d, .005) * .3
def arp(notes, step, dur=.5, fm=0):
    x = np.zeros(int((len(notes) * step + dur) * SR))
    for i, f in enumerate(notes):
        mod = fm * sine(f * 2, dur) if fm else 0
        place(x, np.sin(2 * np.pi * f * t_(dur) + mod) * expdecay(dur, .12), i * step)
    return x
def love_up(): return arp([784, 988, 1175, 1568], .07, fm=1.5)
def love_down(): return arp([988, 784, 622], .09, fm=.8)
def sparkle(n=18, span=.8):
    x = np.zeros(int((span + .4) * SR))
    for i in range(n):
        f = rng.uniform(2000, 6000); place(x, sine(f, .3) * expdecay(.3, .05) * rng.uniform(.3, 1), i * span / n)
    return x
def gacha_crit(): x = sparkle(); place(x, arp([1047, 1319, 1568, 2093], .05, .6, fm=2) * .8, 0); return x
def love_bomb(): x = sparkle(30, 1.0); place(x, bell(523, 1.2, ((1, 1, 1), (2, .5, .6), (3, .3, .4))) * .6, 0); return x
def anger_pop(): d = .18; return signal.square(2 * np.pi * np.linspace(300, 120, int(d * SR)).cumsum() / SR) * expdecay(d, .04) * .5
def rage_thunder():
    d = 3.0; t = t_(d); x = lp(noise(d), 300) * (np.exp(-t / .8) + .3 * np.exp(-t / 2))
    place(x, hp(noise(.1), 2000) * expdecay(.1, .02) * 1.5, 0); return x
def hate_quake():
    d = 2.5; t = t_(d); return (lp(noise(d), 90, 4) * 3 + sine(38 + 4 * np.sin(2 * np.pi * 6 * t), d) * .6) * adsr(d, .2, 1.2)
def lock_click(): d = .06; return bp(noise(d), 1500, 5000) * expdecay(d, .003) + sine(3200, d) * expdecay(d, .004) * .4
def lock_win(): x = arp([659, 880, 1319], .08, .6); place(x, lock_click(), 0); return x
def lock_fail(): d = .45; t = t_(d); return signal.square(2 * np.pi * np.where(t < .2, 180, 140) * t) * adsr(d, .005, .1) * .4
def vending_clunk():
    d = .7; x = np.zeros(int(d * SR))
    place(x, (lp(noise(.25), 400) * 2 + sine(90, .25)) * expdecay(.25, .05), 0)
    place(x, bp(noise(.3), 600, 3000) * expdecay(.3, .06) * .6, .12); return x
def ic_beep(): d = .16; return sine(2000, d) * adsr(d, .003, .01) * .6
def collapse_tilt(): d = .2; return bp(noise(d), 900, 4000) * expdecay(d, .02)
def collapse_slip(): d = .45; x = signal.square(2 * np.pi * 1200 * t_(d)) * expdecay(d, .01) * .3; return x + bp(noise(d), 800, 2500) * adsr(d, .05, .3) * .4
def collapse_fall():
    x = np.zeros(int(.4 * SR))
    for i in range(9): place(x, bp(noise(.05), 700, 4000) * expdecay(.05, .01) * (1 - i * .09), i * .028)
    return x
def collapse_glitch():
    d = .4; t = t_(d); x = signal.square(2 * np.pi * (400 + 300 * (np.floor(t / .03) * 7 % 11)) * t) * .4
    return np.round(x * 4) / 4 * adsr(d, .002, .05)
SHOTS = {'tick': tick, 'thump': thump, 'bell': bell_door, 'breath': breath, 'crunch': crunch, 'heart-pop': heart_pop,
         'love-up': love_up, 'love-down': love_down, 'gacha-crit': gacha_crit, 'love-bomb': love_bomb,
         'anger-pop': anger_pop, 'rage-thunder': rage_thunder, 'hate-quake': hate_quake,
         'lock-click': lock_click, 'lock-win': lock_win, 'lock-fail': lock_fail, 'vending-clunk': vending_clunk,
         'ic-beep': ic_beep, 'collapse-tilt': collapse_tilt, 'collapse-slip': collapse_slip,
         'collapse-fall': collapse_fall, 'collapse-glitch': collapse_glitch}


def loopify(x, xf=0.5):
    n = int(xf * SR); head, tail = x[:n], x[-n:]; w = np.linspace(0, 1, n)
    y = x[n:].copy(); y[-n:] = tail * (1 - w) + head * w  # tail fades into the head -> seamless wrap
    return y
def norm_bed(x, lufs=-16.0):
    rms = np.sqrt(np.mean(hp(x, 60) ** 2)) + 1e-12; x = x * 10 ** ((lufs + 0.7) / 20) / rms  # RMS approx of LUFS for noise beds
    pk = np.max(np.abs(x)); lim = 10 ** (-1 / 20)
    return x * (lim / pk) if pk > lim else x
def norm_shot(x):
    t = np.arange(len(x)) / SR; x = x * np.minimum(1, t / .001) * np.clip((len(x) / SR - t) / .01, 0, 1)  # click-free edges
    return x * 10 ** (-1 / 20) / (np.max(np.abs(x)) + 1e-12)
def write(name, x):
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, name + '.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())


if __name__ == '__main__':
    for k, f in BEDS.items():
        x = f(); write(k, norm_bed(x if k == 'kettle' else loopify(x)))
    for k, f in SHOTS.items(): write(k, norm_shot(f()))
    print(len(BEDS) + len(SHOTS), 'files ->', os.path.abspath(OUT))
