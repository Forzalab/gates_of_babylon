# vtracer, romance/pipeline/trace.py recipe (color / stacked / spline, median-cut pre-pass, speckle raised until the
# SVG fits the budget). Rooftops trace at 0.3 of 1920x1080 (576x324: the refs are only ~300 px wide, so nothing is
# lost), the bento sides plate (545x620) at full size with 32 colours (sausage gloss + kinpira strands need them).
# usage: python3 trace.py <prep dir> <out dir> [id ...]
import sys, os, re, tempfile
import vtracer
from PIL import Image, ImageFilter

PREP, OUT = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
CFG = {'rooftop-noon': (0.3, 24, 420_000), 'rooftop-warm': (0.3, 24, 420_000), 'bento-pink': (1.0, 32, 460_000)}
BASE = dict(colormode='color', hierarchical='stacked', mode='spline', filter_speckle=4, color_precision=8,
            layer_difference=8, corner_threshold=60, length_threshold=4.0, max_iterations=10, splice_threshold=45, path_precision=1)

for f in sorted(os.listdir(PREP)):
    k = f[:-4]
    if (ONLY and k not in ONLY) or k not in CFG: continue
    scale, colors, limit = CFG[k]
    im = Image.open(os.path.join(PREP, f)).convert('RGB')
    w, h = round(im.width * scale), round(im.height * scale)
    im = im.resize((w, h), Image.LANCZOS).filter(ImageFilter.MedianFilter(3))
    im = im.quantize(colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    tmp = os.path.join(tempfile.gettempdir(), f'sa-{k}.png'); im.save(tmp)
    p = dict(BASE)
    out = os.path.join(OUT, k + '.svg')
    while True:
        vtracer.convert_image_to_svg_py(tmp, out, **p)
        s = open(out).read()
        s = re.sub(r'<\?xml[^>]*>\s*|<!--[^>]*-->\s*', '', s).replace('<svg ', f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="none" ', 1)
        open(out, 'w').write(s)
        n = len(s.encode())
        if n <= limit: break
        p['filter_speckle'] += 2
    print(k, n // 1024, 'KB speckle', p['filter_speckle'], flush=True)
