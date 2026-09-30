"""Scene A faces vs refs 12-15: side-by-sides (ref | new | old closest face) + a deltas table for FACES.md.
Run faces.mjs first (renders png/). usage: python3 research/sprint-0930/scene-a/faces/compare.py
ink IoU : both face crops -> grey, dark strokes (the ink) as a mask, 48x48, dilated 1 px; intersection / union.
          Higher = the eyes / mouth / blush hatching sit in the same shapes and places. The refs are hand-drawn
          heads with hair, so 0.2-0.35 is a close match here; what matters is new vs old against the same ref.
palette : compare.py's area-weighted CIE76 dE (ref colours -> our nearest). Refs 12-14 are greyscale manga, so their
          palette dE mostly measures "Nanda is pink"; only ref 15 (colour anime) is a real colour target.
blush   : share of the cheek band that is blush pink (hue 300-360/0-20, sat > .25), ref vs ours."""
import os, sys, colorsys
from PIL import Image, ImageFilter, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
REFS = os.path.join(HERE, '../refs')

# lab / de / palette: the same maths as research/date-beta-demo/compare.py (that file runs its own pairs on import)
def lab(c):
    def lin(v):
        v /= 255
        return ((v + .055) / 1.055) ** 2.4 if v > .04045 else v / 12.92
    r, g, b = map(lin, c)
    x, y, z = (r * .4124 + g * .3576 + b * .1805) / .95047, r * .2126 + g * .7152 + b * .0722, (r * .0193 + g * .1192 + b * .9505) / 1.08883
    f = lambda t: t ** (1 / 3) if t > .008856 else 7.787 * t + 16 / 116
    return (116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z)))

def de(a, b):
    return sum((p - q) ** 2 for p, q in zip(lab(a), lab(b))) ** .5

def palette(im, n=8):
    q = im.convert('RGB').resize((320, 180)).quantize(n, method=Image.Quantize.MEDIANCUT)
    p, total = q.getpalette(), 320 * 180
    return [(cnt / total, tuple(p[i * 3:i * 3 + 3])) for cnt, i in sorted(q.getcolors(), reverse=True)]

# face id -> (ref file, show crop, metric crop (eyes..mouth), cheek band in the metric crop (fractions), old face png, ref label)
PAIRS = [
    ('anya-smile', '14.png', (60, 640, 1020, 1420), (120, 840, 960, 1380), (0.0, 0.45, 1.0, 0.75), 'stage-1_heart_', 'ref 14 Anya smile'),
    ('blush-embarrassed', '13.jpg', (530, 15, 660, 160), (556, 60, 646, 132), (0.0, 0.45, 1.0, 0.8), 'pout', 'ref 13 >_< embarrassed (+ flicks)'),
    ('heart-laugh', '15.jpg', (40, 220, 210, 400), (60, 290, 190, 390), (0.0, 0.25, 1.0, 0.6), 'hearts', 'ref 15 heart-laugh (left girl)'),
    ('heart-laugh', '13.jpg', (285, 15, 405, 150), (300, 60, 390, 135), (0.0, 0.35, 1.0, 0.7), 'hearts', 'ref 13 laugh (tall open mouth)'),
    ('content', '12.jpg', (0, 305, 128, 425), (20, 350, 108, 415), (0.0, 0.3, 1.0, 0.7), 'stage-1_heart_', 'ref 12 Content'),
    ('big-eyes-peek', '12.jpg', (128, 5, 256, 128), (145, 45, 240, 115), (0.0, 0.5, 1.0, 0.8), 'sweat', 'ref 12 Puppy Eyes (the stare)'),
]
# our face crop inside the faces.mjs head png (520x460 of viewBox -150 -290 300 265): face centre ~ (277, 246)
OURS_FACE = (167, 170, 387, 330)

def ink(im, thr):
    g = im.convert('L').resize((48, 48), Image.Resampling.BOX)
    m = g.point(lambda v: 255 if v < thr else 0)
    return m.filter(ImageFilter.MaxFilter(3))

def iou(a, b):
    pa, pb = list(a.tobytes()), list(b.tobytes())
    i = sum(1 for x, y in zip(pa, pb) if x and y)
    u = sum(1 for x, y in zip(pa, pb) if x or y)
    return i / u if u else 0

def blush(im, band):
    w, h = im.size
    c = im.convert('RGB').crop((int(band[0] * w), int(band[1] * h), int(band[2] * w), int(band[3] * h))).resize((60, 30))
    n = 0
    for r, g, b in zip(*[iter(c.tobytes())] * 3):
        hh, ll, ss = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        if ss > .25 and .2 < ll < .92 and (hh > 300 / 360 or hh < 20 / 360): n += 1
    return n / (60 * 30)

def pal(ref, ours):
    pa, pb = palette(ours), palette(ref)
    return sum(wt * min(de(c, oc) for _, oc in pa) for wt, c in pb)

os.makedirs(os.path.join(HERE, 'compare'), exist_ok=True)
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
except OSError: font = ImageFont.load_default()
rows = []
for face, rf, show, met, band, old, label in PAIRS:
    ref = Image.open(os.path.join(REFS, rf)).convert('RGB')
    new = Image.open(os.path.join(HERE, 'png', f'{face}.png')).convert('RGB')
    was = Image.open(os.path.join(HERE, 'png', f'{old}.png')).convert('RGB')
    r_m, n_m, o_m = ref.crop(met), new.crop(OURS_FACE), was.crop(OURS_FACE)
    ri = ink(r_m, 110)
    i_new, i_old = iou(ri, ink(n_m, 110)), iou(ri, ink(o_m, 110))
    b_ref, b_new, b_old = blush(r_m, band), blush(n_m, (0, .45, 1, .8)), blush(o_m, (0, .45, 1, .8))
    p_new, p_old = pal(r_m, n_m), pal(r_m, o_m)
    rows.append((face, label, i_new, i_old, p_new, p_old, b_ref, b_new, b_old))
    sheet = Image.new('RGB', (1560, 560), 'white')
    for k, (im, cap) in enumerate([(ref.crop(show), label), (new, f'NEW {face}'), (was, f'before: {old.strip("_")}')]):
        k0 = min(500 / im.width, 500 / im.height); im = im.resize((round(im.width * k0), round(im.height * k0)), Image.Resampling.LANCZOS)
        sheet.paste(im, (20 + k * 520 + (500 - im.width) // 2, 50 + (500 - im.height) // 2))
        ImageDraw.Draw(sheet).text((20 + k * 520, 12), cap, fill=(90, 20, 60), font=font)
    sheet.save(os.path.join(HERE, 'compare', f'{face}_vs_{rf.split(".")[0]}.png'))

print('| face | ref | ink IoU new | ink IoU before | palette dE new | palette dE before | blush ref / new / before | side-by-side |')
print('|---|---|---|---|---|---|---|---|')
for face, label, i_new, i_old, p_new, p_old, b_ref, b_new, b_old in rows:
    print(f'| {face} | {label} | {i_new:.2f} | {i_old:.2f} | {p_new:.1f} | {p_old:.1f} | {b_ref:.0%} / {b_new:.0%} / {b_old:.0%} | faces/compare/{face}_vs_{label.split()[1]}.png |')
