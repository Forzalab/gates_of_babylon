"""Pillow ref-vs-ours: side-by-side PNGs + a delta table (markdown) for each Y variant.
Run from the repo root: python3 research/y/compare.py  (needs research/y/shots/*-1440.png)."""
from PIL import Image, ImageDraw
from collections import Counter

R = 'research/refs/'
REF = {'y1': 'ee486fef-image.png', 'y2': 'c20f7340-image.png', 'y3': '8c0d1049-image.png'}
XNXX = '9dce964e-image.webp'
W, H = 1440, 810


def load(p):
    return Image.open(p).convert('RGB').resize((W, H))


def dom(im, box, n=3):
    c = im.crop(tuple(int(v * (W if i % 2 == 0 else H)) for i, v in enumerate(box))).quantize(n).convert('RGB')
    return Counter(c.get_flattened_data()).most_common(1)[0][0]


def hx(c):
    return '#%02x%02x%02x' % c


def dist(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** .5


def pale_box(im):
    """Bounding box of the pink modal (rows/cols that are mostly pale pink)."""
    s = im.resize((W // 4, H // 4)); P = s.load(); w, h = s.size
    pale = lambda p: p[0] > 235 and p[2] > 230 and p[1] > 200
    rows = [y for y in range(h) if sum(pale(P[x, y]) for x in range(w)) > w * .25]
    cols = [x for x in range(w) if sum(pale(P[x, y]) for y in range(h)) > h * .25]
    return (min(cols) * 4 / W, min(rows) * 4 / H, max(cols) * 4 / W, max(rows) * 4 / H)


def header_h(im):
    """First row (scanning down the left gutter) where the bright grid blue starts."""
    P = im.load()
    for y in range(2, H // 3):
        r, g, b = P[8, y]
        if b > 150 and r < 40 and g > 40: return y / H
    return None


def hot_pink(im, box):
    """Most saturated pink in the modal (the headline ink)."""
    c = im.crop((int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H))).quantize(10).convert('RGB')
    cands = [k for k, _ in Counter(c.get_flattened_data()).most_common(10) if k[0] > 200 and k[1] < 110 and k[2] > 90]
    return cands[0] if cands else None


def neon(im):
    """Brightest magenta in the top 25% (the neon tube)."""
    c = im.crop((0, 0, W, int(H * .3))).quantize(16).convert('RGB')
    ks = [k for k, _ in Counter(c.get_flattened_data()).most_common(16) if k[0] > 180 and k[1] < 90 and k[2] > 150]
    return max(ks, key=lambda k: k[0] + k[2]) if ks else None


def headline_cap(im, box):
    """Height of the first run of rows dense with hot-pink ink inside the modal (= the WARNING: line), as a fraction of H."""
    P = im.load(); x0, x1 = int(box[0] * W), int(box[2] * W); run = []; best = None
    for y in range(int(box[1] * H), int(box[3] * H)):
        n = sum(1 for x in range(x0, x1, 2) if (lambda p: p[0] > 200 and p[1] < 110 and p[2] > 90)(P[x, y]))
        if n > (x1 - x0) / 2 * .06: run.append(y)
        elif run:
            if len(run) > 12: best = len(run); break
            run = []
    return best / H if best else None


def tile_rows(im):
    """Top/bottom of the first grid tile down the x=0.06 column: (top, height) as fractions of H."""
    P = im.load(); x = int(W * .06); ys = [y for y in range(int(H * .08), int(H * .5)) if not (P[x, y][2] > 150 and P[x, y][0] < 40)]
    if not ys: return None
    top = ys[0]; end = top
    for y in ys[1:]:
        if y != end + 1: break
        end = y
    return top / H, (end - top) / H


rows = []
for v, f in REF.items():
    ref, ours = load(R + f), load(f'research/y/shots/{v}-1440.png')
    clean = load(f'research/y/shots/{v}-1440-clean.png')
    sb = Image.new('RGB', (W * 2 + 20, H + 40), '#111')
    sb.paste(ref, (0, 40)); sb.paste(ours, (W + 20, 40))
    d = ImageDraw.Draw(sb); d.text((10, 10), f'REF {f}', fill='white'); d.text((W + 30, 10), f'OURS date.html?v={v}', fill='white')
    sb.resize((sb.width // 2, sb.height // 2)).save(f'research/y/shots/sbs-{v}.png')
    m = {}
    for name, im in (('ref', ref), ('ours', clean)):
        box = pale_box(im)
        m[name] = {
            'bar navy': dom(im, (.62, .005, .99, .03), 2),
            'grid bg blue': dom(im, (.0, .93, .015, .95), 2) if False else dom(im, (.25, .1, .26, .12), 2),
            'badge blue': dom(im, (.94, .885, .955, .895), 2),
            'modal paper': dom(im, (box[0] + .03, box[3] - .06, box[0] + .08, box[3] - .04), 2),
            'headline pink': hot_pink(im, box),
            'neon magenta': neon(im),
            'modal box': box,
            'header h': header_h(im),
            'WARNING cap h': headline_cap(im, box) if v == 'y1' else None,
        }
    for k in m['ref']:
        a, b = m['ref'][k], m['ours'][k]
        if a is None and b is None: continue
        if k == 'modal box':
            dd = max(abs(x - y) for x, y in zip(a, b))
            rows.append((v, k, 'x0 %.3f y0 %.3f x1 %.3f y1 %.3f' % a, 'x0 %.3f y0 %.3f x1 %.3f y1 %.3f' % b, 'max %.3f of frame' % dd))
        elif k == 'tile 1 top,h':
            rows.append((v, k, '%.3f, %.3f H' % a if a else '?', '%.3f, %.3f H' % b if b else '?', '%.3f' % max(abs(a[0]-b[0]), abs(a[1]-b[1])) if a and b else '?'))
        elif k in ('header h', 'WARNING cap h'):
            rows.append((v, k, '%.3f H' % a if a else '?', '%.3f H' % b if b else '?', '%.3f' % abs(a - b) if a and b else '?'))
        else:
            rows.append((v, k, hx(a) if a else '-', hx(b) if b else '-', 'ΔRGB %.0f' % dist(a, b) if a and b else '-'))

# XNXX original gate vs ours (chrome only; the modal is intentionally different: navy vs pink)
x = load(R + XNXX)
xb = {'bar navy': dom(x, (.62, .005, .99, .03), 2), 'nav blue': dom(x, (.3, .09, .6, .12), 2), 'modal navy': dom(x, (.3, .5, .35, .55), 2)}
print('| variant | measure | ref | ours | delta |\n|---|---|---|---|---|')
for r in rows: print('| %s | %s | %s | %s | %s |' % r)
print('\nXNXX original (9dce964e, 900x600 scaled):', {k: hx(c) for k, c in xb.items()})
