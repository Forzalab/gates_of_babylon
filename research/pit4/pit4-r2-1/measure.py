# measure.py: Pillow numbers for the f3 gate vs the rubric's target table (ratios of the viewport).
# usage: python3 measure.py shots/gate-1440.png [modal_left top right bottom] -> prints a JSON-ish table
import sys, json
from PIL import Image

def med(px):
    px = sorted(px, key=lambda c: sum(c))
    return px[len(px) // 2] if px else None

def hexc(c): return '#%02x%02x%02x' % c[:3] if c else None

def measure(path, dom=None):
    im = Image.open(path).convert('RGB'); W, H = im.size; p = im.load()
    out = {'size': [W, H]}
    # top bar: median of the bar row band between the search button and the nav (no text)
    out['bar'] = hexc(med([p[x, y] for x in range(int(W * .50), int(W * .54)) for y in range(4, int(H * .02))]))
    # bar height: first row from the top whose colour leaves the bar colour at x=4
    b = p[4, 4]; y = 0
    while y < H and sum(abs(a - c) for a, c in zip(p[4, y], b)) < 30: y += 1
    out['bar_h'] = round(y / H, 3)
    # grid bg: left gutter, mid height
    out['grid_bg'] = hexc(med([p[x, y] for x in range(2, int(W * .018)) for y in range(int(H * .4), int(H * .6))]))
    # headline pink + WARNING cap height: hot-pink ink rows inside the warn box
    if dom:
        l, t, r, bt = dom
        pink = [(x, y) for x in range(l, r) for y in range(t, bt) if (lambda c: c[0] > 200 and c[1] < 90 and 90 < c[2] < 190)(p[x, y])]
        ys = sorted(y for _, y in pink)
        # robust extent: rows holding >= 1.5% of the box width in pink
        rows = {}
        for _, yy in pink: rows[yy] = rows.get(yy, 0) + 1
        good = [yy for yy, n in rows.items() if n >= (r - l) * .015]
        out['warn_cap'] = round((max(good) - min(good) + 1) / H, 3) if good else None
        out['headline'] = hexc(med([p[x, y] for x, y in pink]))
    # grid reach: lowest tile pixel in the left column (non-blue)
    x = int(W * .1); y = H - 1
    while y > 0 and (lambda c: c[2] > 150 and c[0] < 60)(p[x, y]): y -= 1
    out['grid_bottom'] = round(y / H, 3)
    # left/right luminance balance
    def lum(x0, x1):
        s = n = 0
        for xx in range(x0, x1, 4):
            for yy in range(0, H, 4):
                c = p[xx, yy]; s += .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; n += 1
        return s / n
    L, R = lum(0, W // 2), lum(W // 2, W)
    out['lum_lr'] = [round(L, 1), round(R, 1), round(abs(L - R) / max(L, R) * 100, 1)]
    return out

if __name__ == '__main__':
    dom = [int(v) for v in sys.argv[2:6]] if len(sys.argv) > 5 else None
    print(json.dumps(measure(sys.argv[1], dom)))
