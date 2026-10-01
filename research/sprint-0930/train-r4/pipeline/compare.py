"""train-r4 Pillow gate: each new/changed bg (bare render, shots/compare/*-bare.png, from bare.mjs) against its refs.
Metrics imported from research/date-beta-demo/compare.py (as the G1 gate does):
  palette dE = area-weighted CIE76 distance from each of the ref's 8 median-cut colours to our nearest one;
  layout dE  = mean dE over a 6x4 grid of the top 80%.
Crops: the machine rows compare OUR machine crop against the ref's machine crop (the refs are photos of one machine).
Writes shots/compare/R4-<name>-vs-<ref>.png (ref | ours) and prints a markdown table.
usage: python3 research/sprint-0930/train-r4/pipeline/compare.py research/sprint-0930/train-r4"""
import sys, os, importlib.util
from PIL import Image, ImageDraw

spec = importlib.util.spec_from_file_location('cmp', os.path.join(os.path.dirname(__file__), '../../../date-beta-demo/compare.py'))
src = open(spec.origin).read().split("hexc = lambda")[0]
cmp = {'__file__': spec.origin}
exec(compile(src, spec.origin, 'exec'), cmp)
palette, crop169, grid, de = cmp['palette'], cmp['crop169'], cmp['grid'], cmp['de']

R = sys.argv[1] if len(sys.argv) > 1 else 'research/sprint-0930/train-r4'
W, H = 1920, 1080
def cover(im, w=W, h=H):
    iw, ih = im.size
    if iw / ih > w / h:
        nw = round(ih * w / h); x = (iw - nw) // 2; im = im.crop((x, 0, x + nw, ih))
    else:
        nh = round(iw * h / w); y = (ih - nh) // 2; im = im.crop((0, y, iw, y + nh))
    return im.resize((w, h), Image.LANCZOS)
ref = lambda n: Image.open(os.path.join(R, 'refs', n)).convert('RGB')
bare = lambda n: Image.open(os.path.join(R, 'shots/compare', n)).convert('RGB')
# (label, ours(), ref(), ref name)
MACH_GATE = (322 - 40, 390, 322 + 190 + 10, 404 + 362 + 20)   # PlatformVending in station-gate-r3
MACH_ADS = (66 - 50, 300, 66 + 286 + 10, 316 + 516 + 20)       # PlatformVending in station-ads
PAIRS = [
  ('station-gate-r3 (crowd)', lambda: bare('station-gate-r3-drink-umeboshi-bare.png'), lambda: cover(ref('07.jpg')), '07'),
  ('station-gate-r3 (crowd)', lambda: bare('station-gate-r3-drink-umeboshi-bare.png'), lambda: cover(ref('08.jpg')), '08'),
  ('station-ads laugh (crowd + bumpers)', lambda: bare('station-ads-drink-umeboshi-bump-laugh-bare.png'), lambda: cover(ref('07.jpg')), '07'),
  ('station-ads named', lambda: bare('station-ads-drink-tamagoyaki-bump-named-bare.png'), lambda: cover(ref('08.jpg')), '08'),
  ('machine (ads crop)', lambda: bare('station-ads-drink-umeboshi-bump-laugh-bare.png').crop(MACH_ADS).resize((540, 960)), lambda: ref('01.jpg').crop((150, 20, 300, 290)).resize((540, 960)), '01 machine'),
  ('machine (ads crop)', lambda: bare('station-ads-drink-umeboshi-bump-laugh-bare.png').crop(MACH_ADS).resize((540, 960)), lambda: ref('02.jpg').crop((175, 35, 305, 275)).resize((540, 960)), '02 machine'),
  ('machine (gate crop)', lambda: bare('station-gate-r3-drink-umeboshi-bare.png').crop(MACH_GATE).resize((540, 960)), lambda: ref('06.jpg').crop((120, 190, 250, 420)).resize((540, 960)), '06 machine'),
  ('vending-insert ume', lambda: bare('vending-insert-drink-umeboshi-bare.png'), lambda: cover(ref('09.jpg')), '09'),
  ('vending-insert tama', lambda: bare('vending-insert-drink-tamagoyaki-bare.png'), lambda: cover(ref('09.jpg')), '09'),
  ('train-rain-sleepy', lambda: bare('train-rain-sleepy-face-dazed-sleepy-bare.png'), lambda: cover(ref('10.jpg')), '10'),
]
print('| art | ref | palette dE | layout dE |\n|---|---|---|---|')
for i, (name, of, rf, rn) in enumerate(PAIRS):
    ours, theirs = of(), rf()
    if ours.size != theirs.size: theirs = theirs.resize(ours.size)
    pa, pb = palette(crop169(ours) if ours.width > ours.height else ours), palette(theirs)
    pal = sum(wt * min(de(c, oc) for _, oc in pa) for wt, c in pb)
    lay = sum(de(p, q) for p, q in zip(grid(ours), grid(theirs))) / 24
    print(f'| {name} | {rn} | {pal:.1f} | {lay:.1f} |')
    w = 956 if ours.width > ours.height else 300
    h = round(w * ours.height / ours.width)
    side = Image.new('RGB', (w * 2 + 8, h + 40), '#1c1c24')
    side.paste(theirs.resize((w, h)), (0, 40)); side.paste(ours.resize((w, h)), (w + 8, 40))
    d = ImageDraw.Draw(side)
    d.text((10, 12), f'ref {rn}', fill='#ffffff'); d.text((w + 18, 12), f'{name}  palette dE {pal:.1f}  layout dE {lay:.1f}', fill='#ffffff')
    side.quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(os.path.join(R, 'shots/compare', f'R4-{i:02d}-vs-{rn.split()[0]}.png'))
