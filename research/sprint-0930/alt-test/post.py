#!/usr/bin/env python3
"""post.py: raw walker PNGs -> shots/<run>/*.png, 256-colour, size-capped. Skips identical consecutive frames.
usage: RAW=/tmp/.../raw python3 post.py   (evidence.json = [{run, file}] is also copied at full 1920x1080)"""
import os, sys, json, hashlib, shutil
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.environ.get('RAW', os.path.join(HERE, 'raw'))
OUT = os.path.join(HERE, 'shots')
KEY = {'steeped__butter', 'escape-win__butter', 'all-hate', 'all-love', 'reduced-motion__steeped', 'vp1024__escape-win', 'loop3__leave-yeah'}
W_KEY, W_REST = int(os.environ.get('W_KEY', 480)), int(os.environ.get('W_REST', 320))


def save(src, dst, width):
    im = Image.open(src).convert('RGB')
    if width and im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(dst, optimize=True)


shutil.rmtree(OUT, ignore_errors=True)
os.makedirs(OUT)
skipped = 0
for run in sorted(os.listdir(RAW)):
    d = os.path.join(RAW, run)
    if not os.path.isdir(d):
        continue
    os.makedirs(os.path.join(OUT, run))
    last = None
    for f in sorted(os.listdir(d)):
        h = hashlib.md5(open(os.path.join(d, f), 'rb').read()).hexdigest()
        if h == last:
            skipped += 1
            continue
        last = h
        save(os.path.join(d, f), os.path.join(OUT, run, f), W_KEY if run in KEY else W_REST)
ev = os.path.join(HERE, 'evidence.json')
if os.path.exists(ev):
    os.makedirs(os.path.join(OUT, '_evidence-1920'), exist_ok=True)
    for e in json.load(open(ev)):
        src = os.path.join(RAW, e['run'], e['file'])
        if os.path.exists(src):
            save(src, os.path.join(OUT, '_evidence-1920', f"{e['run']}__{e['file']}"), 0)
tot = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(OUT) for f in fs)
print(f'shots: {tot / 1e6:.1f} MB, skipped identical {skipped}')
