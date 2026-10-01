"""G1 Pillow gate: each G1 bg (bare art render, shots/compare/<id>-bare.png) against its ref (refs/NN.jpg).
Same metrics as research/date-beta-demo/compare.py (imported, not copied):
  palette dE = area-weighted CIE76 distance from each of the ref's 8 median-cut colours to our nearest one;
  layout dE  = mean dE over a 6x4 grid of the top 80% (the dialogue box lives below). Target < 10 for both.
Writes shots/compare/G1-<id>-side.png (ref | ours) and prints a markdown table.
usage: python3 compare.py research/sprint-0930/scenes-r3"""
import sys, os, importlib.util
from PIL import Image, ImageDraw

spec = importlib.util.spec_from_file_location('cmp', os.path.join(os.path.dirname(__file__), '../../../date-beta-demo/compare.py'))
src = open(spec.origin).read().split("hexc = lambda")[0]  # the metric functions only (the rest runs the old pairs)
cmp = {'__file__': spec.origin}
exec(compile(src, spec.origin, 'exec'), cmp)
palette, crop169, grid, de = cmp['palette'], cmp['crop169'], cmp['grid'], cmp['de']

R = sys.argv[1] if len(sys.argv) > 1 else 'research/sprint-0930/scenes-r3'
W, H = 1920, 1080


def cover(im):
    w, h = im.size
    if w / h > W / H:
        nw = round(h * W / H); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
    else:
        nh = round(w * H / W); y = (h - nh) // 2; im = im.crop((0, y, w, y + nh))
    return im.resize((W, H), Image.LANCZOS)


ref = lambda n: cover(Image.open(os.path.join(R, 'refs', n + '.jpg')).convert('RGB'))
# insert framing = StationAdsInsert's camera: scale 1.9, translate (0, -260) -> the ref's (0, 260)-(1010, 828) box
insert_ref = lambda: ref('11').crop((0, 260, 1011, 828)).resize((W, H), Image.LANCZOS)
# train-rain is graded grey on purpose (PLAN: "grey grade"); the fair trace check is against the ref after the same
# prep grade (prep.py rainy_train: windows -> rain sky, sun patches filled, cool grade), so that row is printed too.
_argv, sys.argv = sys.argv, [sys.argv[0], os.path.join(R, 'refs'), '/tmp']
prep = {'__file__': 'prep.py'}
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'prep.py')).read().split('jobs = {')[0], prep)
sys.argv = _argv
graded14 = lambda: prep['rainy_train'](prep['inpaint'](ref('14'), [(1790, 955, 1910, 1070)]))
PAIRS = [('station-gate-r3', '12', lambda: ref('12')), ('station-ads', '11', lambda: ref('11')),
         ('station-ads-insert', '11 crop', insert_ref), ('train-sun', '13', lambda: ref('13')),
         ('train-rain', '14', lambda: ref('14')), ('train-rain', '14 graded (prep)', graded14), ('platform-rain', '09', lambda: ref('09')),
         ('platform-rain', '08 (composition)', lambda: ref('08')), ('platform-rain', '10 (composition)', lambda: ref('10'))]

print('| bg | ref | palette dE | layout dE |\n|---|---|---|---|')
for i, (bid, rname, rf) in enumerate(PAIRS):
    ours, theirs = Image.open(os.path.join(R, 'shots/compare', bid + '-bare.png')).convert('RGB'), rf()
    pa, pb = palette(crop169(ours)), palette(theirs)
    pal = sum(wt * min(de(c, oc) for _, oc in pa) for wt, c in pb)
    lay = sum(de(p, q) for p, q in zip(grid(ours), grid(theirs))) / 24
    print(f'| {bid} | {rname} | {pal:.1f} | {lay:.1f} |')
    side = Image.new('RGB', (1920, 580), '#1c1c24')
    side.paste(theirs.resize((956, 538)), (0, 40)); side.paste(ours.resize((956, 538)), (964, 40))
    d = ImageDraw.Draw(side)
    d.text((10, 12), f'ref {rname}', fill='#ffffff'); d.text((974, 12), f'{bid}   palette dE {pal:.1f}  layout dE {lay:.1f}', fill='#ffffff')
    side.quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(os.path.join(R, 'shots/compare', f'G1-{bid}-vs-{rname.split()[0]}{"-graded" if "graded" in rname else ""}.png'))
