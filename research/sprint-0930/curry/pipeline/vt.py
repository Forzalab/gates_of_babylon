# vtrace the rendered HAND art (hand.py -> render.mjs PNG). Flat cel art traces clean, so it runs at 0.5 scale / 32
# colours (the photo refs needed 0.3 / 24, trace.py). A light grain before quantising gives the traced edge its
# painterly wobble. usage: python3 vt.py <png dir> <out dir> [id ...]
import sys, os, re, tempfile, random
import vtracer
from PIL import Image, ImageFilter

PNG, OUT = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
SCALE, COLORS, LIMIT = 0.5, 48, 600_000
BASE = dict(colormode='color', hierarchical='stacked', mode='spline', filter_speckle=4, color_precision=6,
            layer_difference=6, corner_threshold=60, length_threshold=4.0, max_iterations=10, splice_threshold=45, path_precision=1)
for f in sorted(os.listdir(PNG)):
    k = f[:-4]
    if not f.endswith('.png') or (ONLY and k not in ONLY): continue
    im = Image.open(os.path.join(PNG, f)).convert('RGB')
    w, h = round(1920 * SCALE), round(1080 * SCALE)
    im = im.resize((w, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
    tmp = os.path.join(tempfile.gettempdir(), f'hand-{k}.png'); im.save(tmp)
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
