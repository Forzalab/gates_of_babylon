# Prep Tony's romance refs -> 1920x1080 PNGs ready for vtracer (reuses alt's PLAN-main.md recipe:
# LANCZOS upscale, light smoothing, portrait refs placed full-height with stretched+blurred+darkened wings).
# People are removed here (cv2 inpaint) or cropped out; the component's hand overlay redraws what the inpaint smears.
# usage: python3 prep.py <refs dir> <out dir>      (refs are NOT committed; see SCHEMA.md for the id -> file map)
import sys, os
import numpy as np, cv2
from PIL import Image, ImageFilter, ImageEnhance

W, H = 1920, 1080
REF, OUT = sys.argv[1], sys.argv[2]
ld = lambda f: Image.open(os.path.join(REF, f + '-image.jpg')).convert('RGB')


def cover(im, fy=0.5):
    """Center-crop to 16:9 (fy = vertical anchor) then LANCZOS to 1920x1080."""
    w, h = im.size
    if w / h > W / H:
        nw = round(h * W / H); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
    else:
        nh = round(w * H / W); y = round((h - nh) * fy); im = im.crop((0, y, w, y + nh))
    return im.resize((W, H), Image.LANCZOS)


def inpaint(im, boxes):
    a = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    m = np.zeros(a.shape[:2], np.uint8)
    for x0, y0, x1, y1 in boxes: m[y0:y1, x0:x1] = 255
    a = cv2.inpaint(a, m, 7, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB))


def wings(im, top, bot):
    """Portrait ref: rows top..bot at full height in the middle, wings = outer columns stretched + blurred + darkened."""
    im = im.crop((0, top, im.width, bot))
    k = H / im.height; mid = im.resize((round(im.width * k), H), Image.LANCZOS)
    wing = (W - mid.width) // 2 + 2
    canvas = Image.new('RGB', (W, H))
    for side, box in (('l', (0, 0, 24, H)), ('r', (mid.width - 24, 0, mid.width, H))):
        strip = mid.crop(box).resize((wing, H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(18))
        strip = ImageEnhance.Brightness(strip).enhance(0.62)
        canvas.paste(strip, (0 if side == 'l' else W - wing, 0))
    canvas.paste(mid, ((W - mid.width) // 2, 0))
    return canvas


def dusk_in_day_frame():
    """The dusk ref is the same street at 1/1.256 scale (ORB + partial affine, 307 inliers): warp it onto the day frame."""
    day, dusk = ld('2ccd9914'), ld('45e8b853')
    M = np.float32([[1.25613, 0, 0.154], [0, 1.25613, 0.807]])
    a = cv2.warpAffine(np.array(dusk), M, day.size, flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)
    return Image.fromarray(a)


SMOOTH = lambda im: im.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.SMOOTH_MORE)

jobs = {
    'street-day': lambda: cover(ld('2ccd9914')),
    'street-dusk': lambda: cover(dusk_in_day_frame()),
    # the girl + bike at the gate (ref px) are inpainted; the overlay redraws the striped gate arm she stood in front of
    'rail-crossing': lambda: cover(inpaint(ld('e953c7ae'), [(330, 200, 432, 312)])),
    'shop-street': lambda: cover(ld('ee7d97e8')),
    # the crowd fills the bottom half: keep it (it gets covered by the hand-drawn crossing), inpaint heads above the curb
    'crossing-day': lambda: cover(inpaint(ld('605636e1'), [(0, 150, 588, 200)])),
    'crossing-night': lambda: wings(ld('608bf512'), 0, 268),
}

os.makedirs(OUT, exist_ok=True)
for k, f in jobs.items():
    SMOOTH(f()).save(os.path.join(OUT, k + '.png'))
    print('prep', k)
