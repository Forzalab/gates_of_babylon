# G2 RAIN WALK + G3 HER STREET -> NIGHT: Tony's R3 refs -> 1920x1080 PNGs for trace.py (romance recipe, PLAN.md "Art style" 1).
# Per ref: 16:9 crop with the horizon near 45%, watermark crop (ref 04 Weibo), portrait refs (04, 07, 15, 16) get wing
# BASES here (edge colour per row, soft); the component's hand overlay builds the real wings (trees, facades, river, rail).
# rain-eave = ref 07's shop front in the middle, ref 06's banner + diamond signs as its wings (colour-matched in Lab).
# curry-street = ref 05 graded from pink sunset to afternoon; escape-night = ref 15 pushed to night.
# usage: python3 prep.py <refs dir> <out dir> [id ...]
import sys, os
import numpy as np, cv2
from PIL import Image, ImageFilter

W, H = 1920, 1080
REF, OUT = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
ld = lambda f: Image.open(os.path.join(REF, f)).convert('RGB')
A = lambda im: np.asarray(im, np.float32)
I = lambda a: Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def cover(im, fy=0.5, fx=0.5):
    w, h = im.size
    if w / h > W / H:
        nw = round(h * W / H); x = round((w - nw) * fx); im = im.crop((x, 0, x + nw, h))
    else:
        nh = round(w * H / W); y = round((h - nh) * fy); im = im.crop((0, y, w, y + nh))
    return im.resize((W, H), Image.LANCZOS)


def wing_base(im, top, bot, band=10, blur=24):
    """Portrait rows top..bot at full height, centred. Wings = each row's edge colour (mean of `band` px), then a soft
    vertical blur: a flat colour continuation (sky stays sky, road stays road) for the hand overlay to build on."""
    im = im.crop((0, top, im.width, bot))
    k = H / im.height; mid = im.resize((round(im.width * k), H), Image.LANCZOS)
    a = A(mid); x0 = (W - mid.width) // 2
    out = np.zeros((H, W, 3), np.float32)
    left = a[:, :band].mean(1, keepdims=True); right = a[:, -band:].mean(1, keepdims=True)
    out[:, :x0] = left; out[:, x0 + mid.width:] = right
    out = cv2.GaussianBlur(out, (0, 0), blur)
    out[:, x0:x0 + mid.width] = a
    # feather the seams 24 px so the trace does not get a hard vertical edge
    for x in list(range(x0 - 12, x0 + 12)) + list(range(x0 + mid.width - 12, x0 + mid.width + 12)):
        out[:, x] = cv2.GaussianBlur(out[:, x - 6:x + 7], (0, 0), 4)[:, 6]
    return I(out), x0, mid.width


def wing_ray(im, top, bot, vp, m=6):
    """Portrait rows top..bot at full height, centred. One-point street views are close to self-similar about the
    vanishing point, so each wing pixel samples the frame along its ray to vp, compressed to land just inside the ref
    (s = distance to vp / distance from vp to the ref edge). Lines stay on their rays; the near edge grows outward.
    vp is in ref px. The hand overlay then redraws the wings' structure (trees, facades, rail) in cel shapes."""
    im = im.crop((0, top, im.width, bot))
    k = H / im.height; mid = im.resize((round(im.width * k), H), Image.LANCZOS)
    x0 = (W - mid.width) // 2
    canvas = np.zeros((H, W, 3), np.uint8); canvas[:, x0:x0 + mid.width] = np.asarray(mid)
    vx, vy = x0 + vp[0] * k, (vp[1] - top) * k
    X, Y = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
    dl, dr = vx - (x0 + m), (x0 + mid.width - m) - vx
    s = np.maximum(1, np.where(X < vx, (vx - X) / dl, (X - vx) / dr))
    mx, my = vx + (X - vx) / s, vy + (Y - vy) / s
    out = cv2.remap(canvas, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    # soften with distance so the far-out (heavily stretched) wing is a smooth base, not jaggies
    soft = cv2.GaussianBlur(out, (0, 0), 6)
    t = np.clip((s - 1) / 1.5, 0, 1)[..., None]
    out = (out * (1 - t) + soft * t).astype(np.uint8)
    return Image.fromarray(out), x0, mid.width


def lab_match(src, ref):
    """Reinhard colour transfer: src's Lab mean/std -> ref's."""
    s = cv2.cvtColor(np.asarray(src), cv2.COLOR_RGB2LAB).astype(np.float32)
    r = cv2.cvtColor(np.asarray(ref), cv2.COLOR_RGB2LAB).astype(np.float32)
    for c in range(3):
        s[..., c] = (s[..., c] - s[..., c].mean()) / (s[..., c].std() + 1e-6) * r[..., c].std() + r[..., c].mean()
    return Image.fromarray(cv2.cvtColor(np.clip(s, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB))


def derain(im, k=5):
    """Rain streaks are thin bright near-vertical lines: an opening with a short horizontal kernel removes them."""
    a = np.asarray(im)
    op = cv2.morphologyEx(a, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_RECT, (k, 1)))
    return Image.fromarray(np.minimum(a, np.maximum(op, a - 18)))


def rain_sidewalk():
    im = ld('04.jpg').crop((0, 0, 335, 566))  # rows 566+ = the Weibo watermark: cropped away
    return wing_ray(derain(im, 3), 40, 566, (245, 292))[0]


def rain_alley():
    return cover(derain(ld('01.jpg'), 3))


def rain_eave():
    shop, _, mw = wing_base(derain(ld('07.webp'), 3), 70, 640)
    x0 = (W - mw) // 2
    street = lab_match(cover(derain(ld('06.jpg'), 3)), ld('07.webp').crop((0, 70, 403, 640)))
    a, s = A(shop), A(street)
    ramp = lambda n: np.linspace(0, 1, n, dtype=np.float32)[None, :, None]
    f = 60  # 06's left third (the blue noren banner) and right third (diamond signs) become the wings
    a[:, :x0 - f] = s[:, :x0 - f]
    a[:, x0 - f:x0 + f] = s[:, x0 - f:x0 + f] * (1 - ramp(2 * f)) + a[:, x0 - f:x0 + f] * ramp(2 * f)
    e = x0 + mw
    a[:, e + f:] = s[:, e + f:]
    a[:, e - f:e + f] = a[:, e - f:e + f] * (1 - ramp(2 * f)) + s[:, e - f:e + f] * ramp(2 * f)
    return I(a)


def rain_ending():
    return cover(derain(ld('02.jpg'), 3), fy=0.42)


def street_bluehour():
    return wing_ray(ld('16.jpg'), 52, 299, (104, 186))[0]


def her_building():
    return cover(derain(ld('03.jpg'), 5), fy=1)


def curry_street():
    """Pink sunset -> 3:40 PM: remove the magenta cast, the pink sky + mountain become a pale blue sky + blue ridge."""
    im = cover(ld('05.jpg'))
    a = A(im)
    # the rest first: pull the magenta cast toward warm neutral daylight
    a[..., 0] *= 0.97; a[..., 1] = a[..., 1] * 1.06 + 4; a[..., 2] *= 0.92
    hsv = cv2.cvtColor(np.asarray(im), cv2.COLOR_RGB2HSV).astype(np.float32)
    y = np.linspace(0, 1, H, dtype=np.float32)[:, None]
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    # sky = magenta-pink, mid saturation, bright (sampled: h 165-178, s 85-125); the peach mountain glow at the very top.
    # Lanterns (orange h<8 or saturated red s>180) and the grey-pink walls (s<40) stay.
    sky = ((h > 160) & (s > 70) & (s < 140) & (v > 180) & (y < 0.6)) | ((h < 8) & (s < 110) & (v > 235) & (y < 0.14))
    sky = cv2.morphologyEx(sky.astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8)).astype(np.float32)
    sky = cv2.GaussianBlur(sky, (0, 0), 2)[..., None]
    lum = (A(im).mean(2) / 255)[..., None]
    grad = (1 - y / 0.6).clip(0, 1)[..., None]  # deeper blue at the top
    blue = np.concatenate([118 + 90 * lum - 40 * grad, 170 + 60 * lum - 20 * grad, 232 + 18 * lum], -1)
    a = a * (1 - sky) + blue * sky
    return I(a)


def escape_night():
    im = ld('15.jpg')
    a = A(im)
    # the ref is blue-hour haze: deepen toward night (darker, more saturated navy), keep the lit windows / lamps bright
    lum = a.mean(2, keepdims=True)
    lit = np.clip((a[..., :1] - a[..., 2:3] + 10) / 60, 0, 1) * (lum > 150)
    # deepen with a contrast curve (the ref's haze lifts the blacks) rather than a flat multiply, so the trace keeps detail
    # pre-compensated: the shared night wash + vignette darken ~12 L, so the trace starts a touch brighter than the ref
    night = 255 * (a / 255) ** 0.9 * np.array([1.0, 1.02, 1.06], np.float32)
    a = night * (1 - lit) + a * lit
    return wing_ray(I(a), 120, 1060, (452, 640))[0]


jobs = {'rain-sidewalk': rain_sidewalk, 'rain-alley': rain_alley, 'rain-eave': rain_eave, 'rain-ending': rain_ending,
        'street-bluehour': street_bluehour, 'her-building': her_building, 'curry-street': curry_street, 'escape-night': escape_night}

SMOOTH = lambda im: im.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.SMOOTH_MORE)
os.makedirs(OUT, exist_ok=True)
for k, f in jobs.items():
    if ONLY and k not in ONLY: continue
    SMOOTH(f()).save(os.path.join(OUT, k + '.png'))
    print('prep', k)
