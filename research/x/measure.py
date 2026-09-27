"""measure.py: the same Pillow measurements on a reference and on our screenshot, so deltas are apples to apples.

usage: python3 measure.py IMG [IMG ...]        prints one JSON object per image
       python3 measure.py --table REF MINE     prints a markdown delta table
Every size is also given as a ratio of the image width or height, since the refs and our shots differ in pixel size.
"""
import json, sys
from statistics import median
from PIL import Image

def hx(c): return '#%02x%02x%02x' % tuple(int(v) for v in c)
def dist(a, b): return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5
def med(px):
    if not px: return None
    return tuple(median(p[i] for p in px) for i in range(3))

def measure(path):
    im = Image.open(path).convert('RGB')
    W, H = im.size
    p = im.load()
    out = {'file': path.split('/')[-1], 'size': [W, H]}
    # 1. background blue: the left gutter, mid height
    gut = [p[x, y] for x in range(int(W * .003), int(W * .012) + 1) for y in range(int(H * .2), int(H * .8), 3)]
    bg = med(gut); out['bg'] = hx(bg)
    # 2. header height: down the gutter column until we reach the bg blue
    x = int(W * .008); hh = 0
    for y in range(H // 3):
        if dist(p[x, y], bg) < 28 and all(dist(p[x, y + k], bg) < 28 for k in range(1, 6)):
            hh = y; break
    out['header_h'] = hh; out['header_ratio'] = round(hh / H, 4)
    # 3. navy bar: median of the header band (most header pixels are the bar colour)
    band = [p[x, y] for x in range(0, W, 4) for y in range(int(hh * .1), max(int(hh * .9), 1), 3)]
    out['navy'] = hx(med(band)) if band else None
    # 4. modal: light pink/white panel (R, B > 235; G > 200): rows and columns that are mostly panel
    def light(c): return c[0] > 235 and c[2] > 235 and c[1] > 200
    rows = [sum(light(p[x, y]) for x in range(0, W, 2)) * 2 for y in range(H)]
    ys = [y for y in range(H) if rows[y] > W * .25]
    if ys:
        y0, y1 = ys[0], ys[-1]
        cols = [sum(light(p[x, y]) for y in range(y0, y1 + 1, 2)) * 2 for x in range(W)]
        xs = [x for x in range(W) if cols[x] > (y1 - y0) * .35]
        x0, x1 = xs[0], xs[-1]
        out['modal'] = [x0, y0, x1, y1]
        out['modal_ratio'] = {'x': round(x0 / W, 3), 'y': round(y0 / H, 3), 'w': round((x1 - x0) / W, 3), 'h': round((y1 - y0) / H, 3)}
        fill = [p[x, y] for x in range(x0, x1, 5) for y in range(y0, y1, 5) if light(p[x, y])]
        out['modal_fill'] = hx(med(fill))
        # lilac bevel: the ring 1..9 px outside the panel's light box
        ring = [p[x, y] for x in range(x0, x1, 3) for y in list(range(max(y0 - 9, 0), y0)) + list(range(y1 + 1, min(y1 + 10, H)))]
        ring = [c for c in ring if c[0] > 150 and c[2] > 180 and c[1] < 215]
        out['bevel'] = hx(med(ring)) if ring else None
        # headline: first run of rows inside the panel dense with hot pink ink = cap height + weight (ink share)
        def hot(c): return c[0] > 200 and c[1] < 90 and 90 < c[2] < 200
        hr = [sum(hot(p[x, y]) for x in range(x0, x1)) for y in range(y0, y1)]
        run = []
        for i, n in enumerate(hr):
            if n > (x1 - x0) * .05: run.append(i)
            elif run and i - run[-1] > 3: break
        if run:
            ch = run[-1] - run[0]
            out['head_cap'] = ch; out['head_cap_ratio'] = round(ch / H, 4)
            out['head_ink'] = round(sum(hr[run[0]:run[-1] + 1]) / ((x1 - x0) * (ch + 1)), 3)
            hp = [p[x, y0 + run[0] + ch // 2] for x in range(x0, x1) if hot(p[x, y0 + run[0] + ch // 2])]
            out['head_pink'] = hx(med(hp)) if hp else None
    # 5. first grid tile: scan right along a row just under the header, then down its middle column
    yy = hh + int(H * .06)
    def off(c): return dist(c, bg) > 60
    xs = [x for x in range(W // 2) if off(p[x, yy])]
    if xs:
        tx0 = xs[0]; tx1 = tx0
        while tx1 < W // 2 and not all(not off(p[tx1 + k, yy]) for k in range(4)): tx1 += 1
        nx = tx1
        while nx < W - 1 and not off(p[nx, yy]): nx += 1
        cx = tx0 + 8
        ty0 = next((y for y in range(hh, H) if off(p[cx, y])), hh)
        ty1 = ty0
        while ty1 < H - 5 and not all(not off(p[cx, ty1 + k]) for k in range(4)): ty1 += 1
        out['tile'] = [tx0, ty0, tx1, ty1]
        out['tile_ratio'] = {'x': round(tx0 / W, 3), 'y': round(ty0 / H, 3), 'w': round((tx1 - tx0) / W, 3), 'h': round((ty1 - ty0) / H, 3), 'gap': round((nx - tx1) / W, 4)}
        # badge: strongly blue pixels in the tile's bottom-right quarter
        def blue(c): return c[2] > 150 and c[0] < 60 and c[1] < 110
        bp = [(x, y) for x in range((tx0 + tx1) // 2, tx1) for y in range((ty0 + ty1) // 2, ty1) if blue(p[x, y])]
        if len(bp) > 30:
            bx0 = min(a for a, _ in bp); by0 = min(b for _, b in bp); bx1 = max(a for a, _ in bp); by1 = max(b for _, b in bp)
            out['badge_ratio'] = {'w': round((bx1 - bx0) / W, 3), 'h': round((by1 - by0) / H, 3), 'inset_r': round((tx1 - bx1) / W, 4), 'inset_b': round((ty1 - by1) / H, 4)}
            out['badge'] = hx(med([p[x, y] for x, y in bp]))
    # 6. accent inks anywhere: yellow and neon magenta
    ye, mg = [], []
    for x in range(0, W, 3):
        for y in range(0, H, 3):
            c = p[x, y]
            if c[0] > 220 and c[1] > 180 and c[2] < 80: ye.append(c)
            if c[0] > 220 and c[1] < 120 and c[2] > 190: mg.append(c)
    out['yellow'] = hx(med(ye)) if len(ye) > 40 else None
    out['neon'] = hx(med(mg)) if len(mg) > 40 else None
    return out

KEYS = ['bg', 'navy', 'header_ratio', 'modal_ratio', 'modal_fill', 'bevel', 'head_cap_ratio', 'head_ink', 'head_pink',
        'tile_ratio', 'badge', 'badge_ratio', 'yellow', 'neon']

def delta(a, b):
    if a is None or b is None: return 'n/a'
    if isinstance(a, str) and a.startswith('#'):
        ca = [int(a[i:i + 2], 16) for i in (1, 3, 5)]; cb = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
        return f'dE(rgb) {dist(ca, cb):.0f}'
    if isinstance(a, dict): return ', '.join(f'{k} {b[k] - a[k]:+.3f}' for k in a if k in b)
    return f'{b - a:+.4f}'

if __name__ == '__main__':
    if sys.argv[1] == '--table':
        r, m = measure(sys.argv[2]), measure(sys.argv[3])
        print(f"| metric | ref `{r['file']}` | ours `{m['file']}` | delta |\n|---|---|---|---|")
        for k in KEYS:
            print(f'| {k} | {r.get(k)} | {m.get(k)} | {delta(r.get(k), m.get(k))} |')
    else:
        for f in sys.argv[1:]: print(json.dumps(measure(f)))
