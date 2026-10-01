# TOWN trace (both passes of "auto trace -> hand -> auto trace"): the shop's vtrace-r2 trace.py, 48 colours.
# 0.5x pre-pass (960x540), median 3, median-cut to COLORS (default 48, no dither), then vtracer (color / stacked /
# spline); speckle grows until the SVG is <= 700 KB. Writes <out>/<PREFIX><id>.svg.
# usage: [SCALE=0.5 COLORS=48 PREFIX=] python3 trace.py <png dir> <out dir> [id ...]
import sys, os, re, tempfile
import vtracer
from PIL import Image, ImageFilter

PREP, OUT = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
SCALE = float(os.environ.get("SCALE", 0.5)); COLORS = int(os.environ.get("COLORS", 48)); PREFIX = os.environ.get("PREFIX", "")
BASE = dict(colormode='color', hierarchical='stacked', mode='spline', filter_speckle=6, color_precision=8,
            layer_difference=8, corner_threshold=60, length_threshold=4.0, max_iterations=10, splice_threshold=45, path_precision=1)
LIMIT = 700_000

for f in sorted(os.listdir(PREP)):
    k = f[:-4]
    if not f.endswith('.png') or (ONLY and k not in ONLY): continue
    im = Image.open(os.path.join(PREP, f)).convert('RGB')
    w, h = round(1920 * SCALE), round(1080 * SCALE)
    im = im.resize((w, h), Image.LANCZOS).filter(ImageFilter.MedianFilter(3))
    im = im.quantize(COLORS, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    tmp = os.path.join(tempfile.gettempdir(), f'town-{k}-{COLORS}-{os.getpid()}.png'); im.save(tmp)
    p = dict(BASE)
    out = os.path.join(OUT, PREFIX + k + '.svg')
    while True:
        vtracer.convert_image_to_svg_py(tmp, out, **p)
        s = open(out).read()
        s = re.sub(r'<\?xml[^>]*>\s*|<!--[^>]*-->\s*', '', s).replace('<svg ', f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="none" ', 1)
        open(out, 'w').write(s)
        n = len(s.encode())
        if n <= LIMIT: break
        p['filter_speckle'] += 2
    print(k, n // 1024, 'KB speckle', p['filter_speckle'], flush=True)
