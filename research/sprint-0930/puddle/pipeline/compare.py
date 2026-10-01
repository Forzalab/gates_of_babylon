"""Puddle beat compare sheet: ref | before | after (v2-rain 2), 2 rows, labelled; + quantise the shots to 256 colours.
Row 1: ref 06 (the key composition) | before (rain-alley + the feet-wet insert) | after (still, pose 0)
Row 2: ref 01 (the Shinkai sky / wires reflection) | after pose 1 (live, stepped) | after on a phone (844x390)
usage: python3 compare.py <refs dir> <puddle dir>      (refs are NOT committed; the sheet carries a small thumbnail)"""
import sys, os
from PIL import Image, ImageDraw

REF, D = sys.argv[1], sys.argv[2]
S = os.path.join(D, 'shots'); OUT = os.path.join(D, 'compare'); os.makedirs(OUT, exist_ok=True)
H, PAD = 400, 16
for f in os.listdir(S):
    if f.endswith('.png'):
        p = os.path.join(S, f); im = Image.open(p)
        if im.mode != 'P': im.convert('RGB').quantize(256).save(p, optimize=True)


def fit(p):
    im = Image.open(p).convert('RGB'); return im.resize((round(im.width * H / im.height), H), Image.LANCZOS)


rows = [[(f'{REF}/06.jpg', 'ref 06: feet at the top, reflection below'), (f'{S}/before-v2-rain-2.png', 'before: rain-alley + feet insert'), (f'{S}/after-v2-rain-2.png', 'after: rain-puddle (still)')],
        [(f'{REF}/01.jpg', 'ref 01: Shinkai sky + wires in water'), (f'{S}/after-v2-rain-2-live.png', 'after: pose 1 (stepped 625 ms)'), (f'{S}/after-v2-rain-2-phone.png', 'after: phone 844x390')]]
ims = [[(fit(p), t) for p, t in r] for r in rows]
W = max(sum(i.width for i, _ in r) + PAD * (len(r) + 1) for r in ims)
sheet = Image.new('RGB', (W, (H + 44) * len(ims) + PAD), '#14121c')
d = ImageDraw.Draw(sheet)
y = PAD
for r in ims:
    x = PAD
    for im, t in r:
        sheet.paste(im, (x, y + 28)); d.text((x, y + 6), t, fill='#f4e8f0'); x += im.width + PAD
    y += H + 44
sheet.quantize(256).save(os.path.join(OUT, 'v2-rain-2-ref-before-after.png'), optimize=True)
print('wrote', os.path.join(OUT, 'v2-rain-2-ref-before-after.png'))
