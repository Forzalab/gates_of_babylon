"""measure.py: rubric numbers for g3 from the shots + DOM boxes (boxes.txt from box.mjs).
usage: python3 research/pit4/pit4-r2-3/measure.py research/pit4/pit4-r2-3"""
import json, math, sys
from PIL import Image, ImageChops
D = sys.argv[1]
box = {}
for line in open(f'{D}/boxes.txt'):
    w, rest = line.split(' ', 1); box[int(w)] = json.loads(rest.split(' span')[0])
for w, h in [(1440, 810), (1024, 768)]:
    b = box[w]
    im = Image.open(f'{D}/shots/g3-gate-{w}-still.png').convert('RGB'); cl = Image.open(f'{D}/shots/g3-gate-clean-{w}-still.png').convert('RGB'); p = im.load()
    x0, y0, x1, y1 = b['w1']
    hot = [(x, y) for x in range(x0, x1) for y in range(y0 - 10, y1 + 10) if p[x, y][0] > 200 and p[x, y][1] < 80 and 90 < p[x, y][2] < 170]
    ys = sorted(y for _, y in hot); cap = ys[int(len(ys) * .99)] - ys[int(len(ys) * .01)]
    derot = cap - (x1 - x0) * math.sin(math.radians(3))
    px = [p[x, y] for x, y in hot]; med = tuple(sorted(c[i] for c in px)[len(px) // 2] for i in range(3))
    vis = min(y for x in range(b['neon'][0], b['neon'][2]) for y in range(b['neon'][1], b['modal'][1]) if p[x, y][0] > 230 and p[x, y][2] > 200 and p[x, y][1] > 150)
    diff = ImageChops.difference(im, cl).convert('L').point(lambda v: 255 if v > 24 else 0)
    area = cov = 0
    for k in ['h1', 'plain', 'wide', 'narrow']:
        c = diff.crop(tuple(b[k])); area += c.size[0] * c.size[1]; cov += sum(1 for v in c.getdata() if v)
    ye = sum(1 for x in range(0, w, 2) for y in range(0, h, 2) if p[x, y][0] > 220 and p[x, y][1] > 180 and p[x, y][2] < 80)
    g = im.convert('L'); L = sum(g.crop((0, 0, w // 2, h)).getdata()) / (w // 2 * h); R = sum(g.crop((w // 2, 0, w, h)).getdata()) / (w // 2 * h)
    print(json.dumps({'vw': w, 'cap_derot': round(derot / h, 3), 'cap_raw': round(cap / h, 3), 'pink': '#%02x%02x%02x' % med,
      'modal_w': round((b['modal'][2] - b['modal'][0]) / w, 3), 'centre_off': round(((b['modal'][0] + b['modal'][2]) / 2 - w / 2) / w, 3),
      'span_incl_sign': round((b['modal'][3] - vis) / h, 3), 'header': round(b['hdr'][3] / h, 3) if 'hdr' in b else None,
      'pen_overlap_pct': round(100 * cov / area, 2), 'yellow_px': ye, 'lum_diff_pct': round(100 * abs(L - R) / max(L, R), 1)}))
