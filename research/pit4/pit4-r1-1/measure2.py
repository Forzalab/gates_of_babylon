"""measure2.py: rubric numbers for f1 that measure.py can't see (tilted cut-out headline, neon in the y-span,
overlap of the red pen with text/buttons via the &clean=1 diff, left/right luminance balance, yellow-only-on-18+).
usage: python3 measure2.py research/pit4/pit4-r1-1   (needs boxes.json from headcap.mjs and the shots)"""
import json, math, sys
from PIL import Image, ImageChops
D = sys.argv[1]; B = json.load(open(f'{D}/boxes.json'))
def hx(c): return '#%02x%02x%02x' % c
for w, h in [(1440, 810), (1024, 768)]:
    b = B[str(w)]
    im = Image.open(f'{D}/shots/f1-gate-{w}-still.png').convert('RGB'); cl = Image.open(f'{D}/shots/f1-gate-clean-{w}-still.png').convert('RGB')
    p = im.load()
    x0, y0, x1, y1 = b['w1']
    hot = [(x, y) for x in range(x0, x1) for y in range(y0, y1 + 10) if p[x, y][0] > 200 and p[x, y][1] < 80 and 90 < p[x, y][2] < 170]
    ys = sorted(y for _, y in hot); cap = ys[int(len(ys) * .99)] - ys[int(len(ys) * .01)]
    derot = cap - (x1 - x0) * math.sin(math.radians(3))  # the -3deg tilt adds width*sin(3deg) to the ink height
    px = [p[x, y] for x, y in hot]
    med = tuple(sorted(c[i] for c in px)[len(px) // 2] for i in range(3))
    top = b['neon'][1]; span = (b['modal'][3] - min(top, b['modal'][1])) / h
    ye = sum(1 for x in range(0, w, 2) for y in range(0, h, 2) if p[x, y][0] > 220 and p[x, y][1] > 180 and p[x, y][2] < 80)
    diff = ImageChops.difference(im, cl).convert('L').point(lambda v: 255 if v > 24 else 0)
    area = cov = 0
    for k in ['h1', 'plain', 'wide', 'narrow']:
        crop = diff.crop(tuple(b[k])); area += crop.size[0] * crop.size[1]; cov += sum(1 for v in crop.getdata() if v)
    g = im.convert('L'); L = sum(g.crop((0, 0, w // 2, h)).getdata()) / (w // 2 * h); R = sum(g.crop((w // 2, 0, w, h)).getdata()) / (w // 2 * h)
    print(json.dumps({'vw': w, 'head_cap_ratio_raw': round(cap / h, 3), 'head_cap_ratio_derot': round(derot / h, 3), 'head_pink_median': hx(med),
      'modal_w_ratio': round((b['modal'][2] - b['modal'][0]) / w, 3), 'modal_centre_off': round(((b['modal'][0] + b['modal'][2]) / 2 - w / 2) / w, 3),
      'modal_span_incl_neon': [round(min(top, b['modal'][1]) / h, 3), round(b['modal'][3] / h, 3), round(span, 3)],
      'neon_above_modal_frac': round((b['modal'][1] - top) / (b['neon'][3] - top), 2), 'header_ratio': round(b['hdr'][3] / h, 3),
      'yellow_px_sampled': ye, 'pen_overlap_text_btn_pct': round(100 * cov / area, 2), 'lum_L': round(L, 1), 'lum_R': round(R, 1), 'lum_diff_pct': round(100 * abs(L - R) / max(L, R), 1)}))
