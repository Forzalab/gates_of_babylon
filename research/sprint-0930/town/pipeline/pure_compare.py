# PURE compare per shot: HAND-HYBRID (old live art) | PURE vtrace + cels (new live art) | REF (the same 16:9 crop, faces /
# logos / watermarks blurred by pure.py) -> research/sprint-0930/town/pure-compare/<id>.png.
# --scrub-old also blurs the REF panel (x 0-480) of the earlier compare/<id>.png, so no real face / logo stays in the repo.
# usage: python3 pure_compare.py <refs dir> <hybrid art png dir> <pure art png dir> [--scrub-old]   (from the repo root)
import sys, os
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0, os.path.dirname(__file__))
import pure  # noqa: E402

REF, HYB, PUR = sys.argv[1:4]
OUT = 'research/sprint-0930/town/pure-compare'
os.makedirs(OUT, exist_ok=True)
PW, PH = 640, 360
for k in pure.SHOTS:
    ref = pure.prep(REF, k).filter(ImageFilter.GaussianBlur(2))  # the blurred crop, one more soft pass for the thumb
    Cv = Image.new('RGB', (3 * PW + 20, PH + 44), 'white'); d = ImageDraw.Draw(Cv)
    for i, (im, t) in enumerate([(Image.open(f'{HYB}/{k}.png'), 'HAND-HYBRID (old: trace > hand repaint > trace)'),
                                 (Image.open(f'{PUR}/{k}.png'), 'PURE VTRACE + cels (live)'),
                                 (ref, f'REF {pure.SHOTS[k][0]} (16:9 crop, faces/logos blurred, graded)')]):
        Cv.paste(im.convert('RGB').resize((PW, PH), Image.LANCZOS), (i * (PW + 10), 40))
        d.text((i * (PW + 10) + 8, 14), t, fill='black')
    Cv.save(f'{OUT}/{k}.png'); print('pure-compare', k)

if '--scrub-old' in sys.argv:
    for k in pure.SHOTS:
        f = f'research/sprint-0930/town/compare/{k}.png'
        im = Image.open(f).convert('RGB'); box = (0, 36, 480, 306)
        r = im.crop(box); r = r.resize((r.width // 8, r.height // 8), Image.BILINEAR).resize(r.size, Image.BILINEAR)
        im.paste(r.filter(ImageFilter.GaussianBlur(4)), box[:2])
        ImageDraw.Draw(im).text((8, 290), 'ref blurred (real faces / logos)', fill='white')
        im.save(f); print('scrubbed', f)
