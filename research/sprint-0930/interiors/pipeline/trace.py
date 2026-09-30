# vtracer (color / stacked / spline), T1a's painterly recipe (romance/pipeline/trace.py on sprint/obbp):
# downscale to 0.3 (576x324), median 3, median-cut to N colours (no dither), trace with small speckle + low layer diff.
# The SVG keeps its small viewBox; the scene stretches it to 1920x1080 (preserveAspectRatio none).
# usage: python3 trace.py <prep dir> <out dir> [id ...]
import sys, os, re, tempfile
import vtracer
from PIL import Image, ImageFilter

PREP, OUT = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
SCALE = {'apartment': 0.5, 'sitting-room': 0.6, 'bedroom': 0.6}  # of the prep PNG's own size (default 0.3 of 1920x1080 = 576x324)
COLORS = {'basement': 20, 'apartment': 48, 'sitting-room': 48, 'bedroom': 40}  # dark basement: fewer colours keep the concrete clean
MEDIAN = {'apartment': 0, 'sitting-room': 0, 'bedroom': 0}  # small detailed refs lose their thin structure to the median pass
BASE = dict(colormode='color', hierarchical='stacked', mode='spline', filter_speckle=6, color_precision=8,
            layer_difference=8, corner_threshold=60, length_threshold=4.0, max_iterations=10, splice_threshold=45, path_precision=1)
LIMIT = {'apartment': 700_000, 'sitting-room': 650_000, 'bedroom': 650_000}  # default 560 KB

for f in sorted(os.listdir(PREP)):
    k = f[:-4]
    if ONLY and k not in ONLY: continue
    im = Image.open(os.path.join(PREP, f)).convert('RGB')
    sc = SCALE.get(k, 0.3)
    w, h = round(im.width * sc), round(im.height * sc)
    im = im.resize((w, h), Image.LANCZOS)
    if MEDIAN.get(k, 3): im = im.filter(ImageFilter.MedianFilter(MEDIAN.get(k, 3)))
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
        if n <= LIMIT.get(k, 560_000): break
        p['filter_speckle'] += 2
    print(k, n // 1024, 'KB speckle', p['filter_speckle'], flush=True)
