# SHOP vtrace r2 (research/sprint-0930/shop/vtrace-r2): the romance trace.py (color / stacked / spline) at a higher
# fidelity than the old murky shop traces (0.3x / 24 colours): 0.5x pre-pass (960x540), median 3, median-cut to
# COLORS (default 40, no dither), then vtracer; speckle grows until the SVG is <= 700 KB. Writes <out>/r2-<id>.svg.
# usage: [SCALE=0.5 COLORS=40] python3 trace.py <prep dir> <out dir> [id ...]
import sys, os, re, tempfile
import vtracer
from PIL import Image, ImageFilter

PREP, OUT = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
SCALE = float(os.environ.get("SCALE", 0.5)); COLORS = int(os.environ.get("COLORS", 40))
BASE = dict(colormode='color', hierarchical='stacked', mode='spline', filter_speckle=6, color_precision=8,
            layer_difference=8, corner_threshold=60, length_threshold=4.0, max_iterations=10, splice_threshold=45, path_precision=1)
LIMIT = 700_000

for f in sorted(os.listdir(PREP)):
    k = f[:-4]
    if ONLY and k not in ONLY: continue
    im = Image.open(os.path.join(PREP, f)).convert('RGB')
    w, h = round(1920 * SCALE), round(1080 * SCALE)
    im = im.resize((w, h), Image.LANCZOS).filter(ImageFilter.MedianFilter(3))
    im = im.quantize(COLORS, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    tmp = os.path.join(tempfile.gettempdir(), f'shop-r2-{k}-{COLORS}-{os.getpid()}.png'); im.save(tmp)
    p = dict(BASE)
    out = os.path.join(OUT, 'r2-' + k + '.svg')
    while True:
        vtracer.convert_image_to_svg_py(tmp, out, **p)
        s = open(out).read()
        s = re.sub(r'<\?xml[^>]*>\s*|<!--[^>]*-->\s*', '', s).replace('<svg ', f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="none" ', 1)
        open(out, 'w').write(s)
        n = len(s.encode())
        if n <= LIMIT: break
        p['filter_speckle'] += 2
    print(k, n // 1024, 'KB speckle', p['filter_speckle'], flush=True)
