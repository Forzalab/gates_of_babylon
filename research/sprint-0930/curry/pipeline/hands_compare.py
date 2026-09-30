# NAAN-HANDS cross-check sheets: ref grip (the vtraced silhouette from hands.py, NOT the watermarked stock photo)
# | before (r3) | after, per shot -> hands-compare/<id>.png.
# usage: python3 hands_compare.py <before png dir> <after png dir> <out dir>
import sys, os, subprocess
from PIL import Image, ImageDraw
B, A, OUT = sys.argv[1:4]
HERE = os.path.dirname(os.path.abspath(__file__)); SPR = os.path.join(HERE, '..', 'sprites')
IDS = {'naan-lift': 'press', 'naan-dip': 'scoop', 'naan-feed': 'hold', 'butter-bite': 'hold', 'katsu-cut': None,
       'katsu-close': 'pinch', 'katsu-feed': 'hold', 'katsu-bite': 'hold'}
os.makedirs(OUT, exist_ok=True)
args = []
for g in set(v for v in IDS.values() if v):
    args += [os.path.join(SPR, f'hand-{g}.svg'), os.path.join(B, f'ref-{g}.png')]
subprocess.run(['node', os.path.join(HERE, 'render.mjs')] + args, check=True)
for k, g in IDS.items():
    o = Image.new('RGB', (1920, 390), 'white'); d = ImageDraw.Draw(o)
    if g:
        r = Image.open(os.path.join(B, f'ref-{g}.png')).convert('RGB'); bb = Image.eval(r, lambda v: 255 - v).getbbox()
        r = r.crop(bb) if bb else r; r.thumbnail((630, 355)); o.paste(r, (0, 32))
    d.text((6, 8), f'ref grip: {g} (traced silhouette)' if g else 'no ref (spoon grip)', fill='black')
    for i, (p, t) in enumerate(((B, 'before (r3)'), (A, 'after (naan-hands)'))):
        o.paste(Image.open(os.path.join(p, k + '.png')).convert('RGB').resize((636, 358)), (642 * (i + 1), 32))
        d.text((642 * (i + 1) + 6, 8), t, fill='black')
    o.quantize(256).save(os.path.join(OUT, k + '.png'), optimize=True)
    print(k)
