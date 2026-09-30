"""G2 + G3 Pillow gate: each bg (bare art render, shots/compare/<id>-bare.png, from bare.mjs) against its ref.
Metrics from research/date-beta-demo/compare.py (imported, not copied), as G1 does:
  palette dE = area-weighted CIE76 distance from each of the ref's 8 median-cut colours to our nearest one;
  layout dE  = mean dE over a 6x4 grid of the top 80% (the dialogue box lives below). Target < 10.
Portrait refs (04, 07, 15, 16) sit in the middle of the frame with hand-built wings: the row 'mid' compares only the
columns where the ref sits (4x6 grid, top 80%) against the ref rows prep.py used (the wings have no ref to match; a
16:9 cover crop of a portrait is a thin band, so a whole-frame row would measure nothing). rain-eave's wings come
from ref 06, so it also gets a whole-frame row against 06. The deliberate regrade (05 pink sunset -> 3:40 afternoon)
also gets a row against the ref after the same prep grade, so the trace itself is judged fairly.
Writes shots/compare/G23-<id>-vs-<ref>.png (ref | ours) and prints a markdown table.
usage: python3 compare.py research/sprint-0930/scenes-r3"""
import sys, os, importlib.util
from PIL import Image, ImageDraw

spec = importlib.util.spec_from_file_location('cmp', os.path.join(os.path.dirname(__file__), '../../../date-beta-demo/compare.py'))
cmp = {'__file__': spec.origin}
exec(compile(open(spec.origin).read().split("hexc = lambda")[0], spec.origin, 'exec'), cmp)
palette, crop169, grid, de = cmp['palette'], cmp['crop169'], cmp['grid'], cmp['de']

R = sys.argv[1] if len(sys.argv) > 1 else 'research/sprint-0930/scenes-r3'
W, H = 1920, 1080
prep = {'__file__': 'prep.py'}
_argv, sys.argv = sys.argv, [sys.argv[0], os.path.join(R, 'refs'), '/tmp']
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'prep.py')).read().split('jobs = {')[0], prep)
sys.argv = _argv
ld = lambda n: Image.open(os.path.join(R, 'refs', n)).convert('RGB')


def cover(im):
    w, h = im.size
    if w / h > W / H:
        nw = round(h * W / H); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
    else:
        nh = round(w * H / W); y = (h - nh) // 2; im = im.crop((0, y, w, y + nh))
    return im.resize((W, H), Image.LANCZOS)


def strip_grid(im, cols=4, rows=6):
    w, h = im.size
    return [im.crop((0, 0, w, int(h * 0.8))).resize((cols, rows), Image.Resampling.BOX).getpixel((x, y)) for y in range(rows) for x in range(cols)]


def rows_of(n, top, bot, right=None):
    im = ld(n)
    return im.crop((0, top, right or im.width, bot))


def mid(ours, ref_rows):
    k = H / ref_rows.height; mw = round(ref_rows.width * k); x0 = (W - mw) // 2
    return ours.crop((x0, 0, x0 + mw, H)), ref_rows.resize((mw, H), Image.LANCZOS)


# (bg, ref label, ref image, mode) mode: 'frame' = whole 16:9 | 'mid' = the ref's columns only
PAIRS = [
    ('rain-sidewalk', '04 mid', lambda: rows_of('04.jpg', 40, 566), 'mid'),
    ('rain-alley', '01', lambda: cover(ld('01.jpg')), 'frame'),
    ('rain-eave', '07 mid', lambda: rows_of('07.webp', 70, 640), 'mid'), ('rain-eave', '06 frame', lambda: cover(ld('06.jpg')), 'frame'),
    ('rain-ending', '02', lambda: prep['cover'](ld('02.jpg'), fy=0.42), 'frame'),
    ('street-bluehour', '16 mid', lambda: rows_of('16.jpg', 52, 299), 'mid'),
    ('her-building', '03', lambda: prep['cover'](ld('03.jpg'), fy=1), 'frame'),
    ('curry-street', '05', lambda: cover(ld('05.jpg')), 'frame'), ('curry-street', '05 graded (prep)', lambda: prep['curry_street'](), 'frame'),
    ('escape-night', '15 mid', lambda: rows_of('15.jpg', 120, 1060), 'mid'),
]

print('| bg | ref | palette dE | layout dE |\n|---|---|---|---|')
os.makedirs(os.path.join(R, 'shots/compare'), exist_ok=True)
for bid, rname, rf, mode in PAIRS:
    ours, theirs = Image.open(os.path.join(R, 'shots/compare', bid + '-bare.png')).convert('RGB'), rf()
    if mode == 'mid':
        a, b = mid(ours, theirs)
        lay = sum(de(p, q) for p, q in zip(strip_grid(a), strip_grid(b))) / 24
    else:
        a, b = ours, theirs
        lay = sum(de(p, q) for p, q in zip(grid(a), grid(b))) / 24
    pa, pb = palette(a), palette(b)
    pal = sum(wt * min(de(c, oc) for _, oc in pa) for wt, c in pb)
    print(f'| {bid} | {rname} | {pal:.1f} | {lay:.1f} |')
    side = Image.new('RGB', (1920, 580), '#1c1c24')
    fit = lambda im: im.resize((round(im.width * 538 / im.height), 538)) if im.width / im.height < 1.7 else im.resize((956, 538))
    side.paste(fit(b), (0, 40)); side.paste(fit(a), (964, 40))
    d = ImageDraw.Draw(side)
    d.text((10, 12), f'ref {rname}', fill='#ffffff'); d.text((974, 12), f'{bid} ({mode})   palette dE {pal:.1f}  layout dE {lay:.1f}', fill='#ffffff')
    tag = rname.split()[0] + ('-mid' if mode == 'mid' else '') + ('-graded' if 'prep' in rname else '')
    side.save(os.path.join(R, 'shots/compare', f'G23-{bid}-vs-{tag}.png'))
