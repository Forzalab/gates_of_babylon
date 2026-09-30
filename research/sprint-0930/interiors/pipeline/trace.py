# vtracer (color / stacked / spline), T1a's painterly recipe (romance/pipeline/trace.py on sprint/obbp):
# downscale to 0.3 (576x324), median 3, median-cut to N colours (no dither), trace with small speckle + low layer diff.
# The SVG keeps its small viewBox; the scene stretches it to 1920x1080 (preserveAspectRatio none).
# usage: python3 trace.py <prep dir> <out dir> [id ...]
import sys, os, re, tempfile
import vtracer
from PIL import Image, ImageFilter

PREP, OUT = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
SCALE = 0.3
COLORS = {'basement': 20}  # dark room: fewer colours keep the concrete from speckling
BASE = dict(colormode='color', hierarchical='stacked', mode='spline', filter_speckle=6, color_precision=8,
            layer_difference=8, corner_threshold=60, length_threshold=4.0, max_iterations=10, splice_threshold=45, path_precision=1)
LIMIT = 560_000

for f in sorted(os.listdir(PREP)):
    k = f[:-4]
    if ONLY and k not in ONLY: continue
    im = Image.open(os.path.join(PREP, f)).convert('RGB')
    w, h = round(1920 * SCALE), round(1080 * SCALE)
    im = im.resize((w, h), Image.LANCZOS).filter(ImageFilter.MedianFilter(3))
    im = im.quantize(COLORS.get(k, 24), method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    tmp = os.path.join(tempfile.gettempdir(), f'int-{k}.png'); im.save(tmp)
    p = dict(BASE)
    out = os.path.join(OUT, k + '.svg')
    while True:
        vtracer.convert_image_to_svg_py(tmp, out, **p)
        s = open(out).read()
        s = re.sub(r'<\?xml[^>]*>\s*|<!--[^>]*-->\s*', '', s).replace('<svg ', f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="none" ', 1)
        open(out, 'w').write(s)
        n = len(s.encode())
        if n <= LIMIT: break
        p['filter_speckle'] += 2
    print(k, n // 1024, 'KB speckle', p['filter_speckle'], flush=True)
