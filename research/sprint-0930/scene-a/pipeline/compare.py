# Scene A deltas: palette + layout dE per shot vs its ref (research/date-beta-demo/compare.py metrics, loaded from
# that file), plus a Pillow side-by-side PNG per pair. Before = the UX-pass shots of the old art (shop-alley
# "rooftop", blurred R1 bento close-up), so each row shows old -> new against the same ref.
# usage: python3 compare.py            (writes shots/compare/*.png and prints the markdown table)
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
SA = os.path.join(ROOT, 'research/sprint-0930/scene-a')
src = open(os.path.join(ROOT, 'research/date-beta-demo/compare.py')).read()
ns = {'__file__': os.path.join(ROOT, 'research/date-beta-demo/compare.py')}
exec(src[:src.index('hexc =')], ns)            # lab / de / palette / crop169 / grid, without its hard-coded PAIRS loop
palette, grid, crop169, de = ns['palette'], ns['grid'], ns['crop169'], ns['de']

UX = os.path.join(ROOT, 'research/sprint-0930/ux-pass/A')
PAIRS = [  # (label, ours, ref, before or None, crop box on ours or None)
    ('rooftop noon vs 05', 'shots/01-rooftop-noon.png', 'refs/05.jpg', f'{UX}/02-rooftop-rooftop_1.png', None),
    ('rooftop noon vs 06 (labels)', 'shots/01-rooftop-noon.png', 'refs/06.jpg', None, None),
    ('rooftop warm vs 07', 'shots/03-rooftop-warm.png', 'refs/07.jpg', None, None),
    ('bento whole vs 10', 'shots/05-bento-whole.png', 'refs/10.jpg', f'{UX}/egg/tama-04-rooftop-rooftop_3.png', None),
    ('bento whole vs 01', 'shots/05-bento-whole.png', 'refs/01.png', f'{UX}/egg/tama-04-rooftop-rooftop_3.png', None),
    ('bento whole vs 04', 'shots/05-bento-whole.png', 'refs/04.jpg', None, None),
    ('lift tama vs 01', 'shots/06-bento-lift-tama.png', 'refs/01.png', f'{UX}/egg/tama-04-rooftop-rooftop_3.png', None),
    ('lift ume vs 03', 'shots/07-bento-lift-ume.png', 'refs/03.jpg', f'{UX}/egg/ume-04-rooftop-rooftop_3.png', None),
    ('tama swirl vs 02 (crop)', 'shots/06-bento-lift-tama.png', 'refs/02.jpg', None, (790, 250, 1070, 490)),
    ('lifted tama vs 09 (crop)', 'shots/06-bento-lift-tama.png', 'refs/09.png', None, (790, 250, 1070, 490)),
    ('umeboshi vs 08 (crop)', 'shots/07-bento-lift-ume.png', 'refs/08.png', None, (745, 285, 985, 515)),
    ('bento glints vs 11', 'shots/05-bento-whole.png', 'refs/11.jpg', None, None),
]

def score(a, b, crop):
    if crop:  # a crop of ours vs the whole ref: palette only (layout needs the same framing)
        pa, pb = palette(a), palette(b)
        return sum(wt * min(de(c, oc) for _, oc in pa) for wt, c in pb), None
    pa, pb = palette(crop169(a)), palette(b)
    pal = sum(wt * min(de(c, oc) for _, oc in pa) for wt, c in pb)
    lay = sum(de(p, q) for p, q in zip(grid(a), grid(b))) / 24
    return pal, lay

def fit(im, h):
    return im.resize((round(im.width * h / im.height), h), Image.LANCZOS)

def side(label, ims, out):
    H = 540
    tiles = [fit(i.convert('RGB'), H) for i in ims]
    W = sum(t.width for t in tiles) + 16 * (len(tiles) + 1)
    c = Image.new('RGB', (W, H + 64), '#2a1a2a')
    d = ImageDraw.Draw(c)
    try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
    except OSError: f = ImageFont.load_default()
    x = 16
    for t, cap in zip(tiles, ['ref', 'new'] + (['before'] if len(tiles) > 2 else [])):
        c.paste(t, (x, 48)); d.text((x, 12), cap, fill='#ffd6e8', font=f); x += t.width + 16
    d.text((W - 16 - d.textlength(label, font=f), 12), label, fill='#ffffff', font=f)
    c.save(out)

os.makedirs(os.path.join(SA, 'shots/compare'), exist_ok=True)
print('| pair | palette dE new | layout dE new | palette dE before | layout dE before | side-by-side |')
print('|---|---|---|---|---|---|')
for label, ours, ref, before, crop in PAIRS:
    a = Image.open(os.path.join(SA, ours)).convert('RGB'); r = Image.open(os.path.join(SA, ref)).convert('RGB')
    if crop: a = a.crop(crop)
    pn, ln = score(a, r, crop)
    pbf = lbf = None
    ims = [r, a]
    if before:
        bi = Image.open(before).convert('RGB'); pbf, lbf = score(bi, r, None); ims.append(bi)
    name = label.split(' vs ')[0].replace(' ', '-') + '_vs_' + os.path.basename(ref).split('.')[0] + '.png'
    side(label, ims, os.path.join(SA, 'shots/compare', name))
    f = lambda v: '-' if v is None else f'{v:.1f}'
    print(f'| {label} | {f(pn)} | {f(ln)} | {f(pbf)} | {f(lbf)} | shots/compare/{name} |')
