# compare.py: before/after side-by-sides for every beat on the umeboshi path (matched by scene:beat + tag, in order).
# python3 research/sprint-0930/r5-ume/compare.py   -> r5-ume/compare/<after-name>.png (a beat with no 'before' = new)
import json, os
from PIL import Image, ImageDraw, ImageFont
R = os.path.dirname(os.path.abspath(__file__))
B, A, C = [json.load(open(f'{R}/{d}/log.json')) for d in ('before', 'after')] + [None]
os.makedirs(f'{R}/compare', exist_ok=True)
key = lambda r: (r['scene'], r['text'][:40])
bmap = {}
for r in B: bmap.setdefault(key(r), r)
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
except Exception: font = None
n = 0
for r in A:
    b = bmap.get(key(r))
    im = Image.new('RGB', (1920, 580), 'white')
    d = ImageDraw.Draw(im)
    if b: im.paste(Image.open(f"{R}/before/{b['nm']}").convert('RGB').resize((960, 540)), (0, 40))
    im.paste(Image.open(f"{R}/after/{r['nm']}").convert('RGB').resize((960, 540)), (960, 40))
    d.text((8, 6), f"BEFORE {b['nm'] if b else '(none)'}", fill='black', font=font)
    d.text((968, 6), f"AFTER {r['nm']}", fill='black', font=font)
    im.save(f"{R}/compare/{r['nm']}"); n += 1
print(n, 'pairs; before-only (removed):', [b['nm'] for b in B if key(b) not in {key(r) for r in A}])
