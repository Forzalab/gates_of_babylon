"""compare.py: side-by-side PNGs (ref | ours) and ref-vs-ours delta tables for each variant.
usage: python3 compare.py REFDIR   (REFDIR holds the refs; the adult-site gate refs live outside the repo)
"""
import sys, os
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(__file__))
from measure import measure, KEYS, delta

HERE = os.path.dirname(os.path.abspath(__file__)); SHOTS = os.path.join(HERE, 'shots')
REF = sys.argv[1]
PAIRS = {'x1': 'ee486fef-image.png', 'x2': 'c20f7340-image.png', 'x3': '8c0d1049-image.png'}
# The original gate (9dce964e), hand-measured with Pillow (the auto scan can't find a dark-blue modal on a dark-blue page):
XNXX = {'bg': '#00016c', 'navy': '#090d56', 'header_ratio': 0.1333, 'modal_ratio': {'x': 0.25, 'y': 0.247, 'w': 0.5, 'h': 0.505},
        'modal_fill': '#00008f', 'head_cap_ratio': 0.0233, 'badge': '#093ea9', 'yellow': '#ffff00'}

for v, ref in PAIRS.items():
    a = Image.open(os.path.join(REF, ref)).convert('RGB').resize((1440, 810))
    b = Image.open(os.path.join(SHOTS, f'{v}-1440.png')).convert('RGB')
    sb = Image.new('RGB', (2890, 850), '#111')
    sb.paste(a, (0, 40)); sb.paste(b, (1450, 40))
    d = ImageDraw.Draw(sb); d.text((10, 10), f'REF {ref}', fill='#fff'); d.text((1460, 10), f'OURS date.html?v={v} @1440x810', fill='#fff')
    sb.save(os.path.join(SHOTS, f'side-{v}.png'))
    r, m = measure(os.path.join(REF, ref)), measure(os.path.join(SHOTS, f'{v}-1440.png'))
    print(f'\n#### {v} vs mockup `{ref}` and the original gate\n')
    print('| metric | mockup | ours | delta vs mockup | original gate | delta vs original |\n|---|---|---|---|---|---|')
    for k in KEYS:
        x = XNXX.get(k)
        print(f'| {k} | {r.get(k)} | {m.get(k)} | {delta(r.get(k), m.get(k))} | {x if x is not None else "n/a"} | {delta(x, m.get(k)) if x is not None else "n/a"} |')
