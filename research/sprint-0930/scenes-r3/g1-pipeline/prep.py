# G1 STATION + TRAIN pre-pass (scenes-r3/PLAN.md "Art style" 1): refs/NN -> 1920x1080 PNGs for trace.py.
# Same recipe as the romance set (research/sprint-0930/romance/pipeline/prep.py): cover-crop to 16:9 + LANCZOS,
# cv2 inpaint for people / watermarks, median + SMOOTH_MORE. Boxes are in 1920x1080 space (after the cover crop).
# The hand overlay (src/date-beta/art/r3-station/) redraws whatever the inpaint smears (the 09 train side, signs).
# usage: python3 prep.py <refs dir> <out dir> [id ...]
# then:  python3 ../../romance/pipeline/trace.py <out dir> <trace dir> [id ...]   (0.3x, 24 colours, vtracer stacked, <=600 KB)
import sys, os
import numpy as np, cv2
from PIL import Image, ImageFilter, ImageEnhance

W, H = 1920, 1080
REF, OUT = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
ld = lambda n: Image.open(os.path.join(REF, n + '.jpg')).convert('RGB')


def cover(im, fy=0.5):
    w, h = im.size
    if w / h > W / H:
        nw = round(h * W / H); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
    else:
        nh = round(w * H / W); y = round((h - nh) * fy); im = im.crop((0, y, w, y + nh))
    return im.resize((W, H), Image.LANCZOS)


def inpaint(im, boxes, r=9):
    """Inpaint at half size (smoother fill over big holes), paste back only the holes."""
    a = np.array(im)
    m = np.zeros(a.shape[:2], np.uint8)
    for x0, y0, x1, y1 in boxes: m[y0:y1, x0:x1] = 255
    sa, sm = cv2.resize(a, (W // 2, H // 2), interpolation=cv2.INTER_AREA), cv2.resize(m, (W // 2, H // 2), interpolation=cv2.INTER_NEAREST)
    f = cv2.inpaint(cv2.cvtColor(sa, cv2.COLOR_RGB2BGR), sm, r, cv2.INPAINT_TELEA)
    f = cv2.cvtColor(cv2.resize(f, (W, H), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2RGB)
    a[m > 0] = f[m > 0]
    return Image.fromarray(a)


def derain(im, boxes):
    """Dry the air: the refs' thin light rain streaks go under a vertical-structure-free median (only inside boxes)."""
    a = np.array(im)
    med = np.array(im.filter(ImageFilter.MedianFilter(9)))
    for x0, y0, x1, y1 in boxes: a[y0:y1, x0:x1] = med[y0:y1, x0:x1]
    return Image.fromarray(a)


def rainy_train(im):
    """Ref 14 at 5:20 PM: windows -> flat grey-blue rain sky, floor sun patches filled, then a cool grey grade."""
    a = np.array(im).astype(np.float32)
    L = a.mean(axis=2)
    yy, xx = np.mgrid[0:H, 0:W]
    # the window glass zones (hand-picked, 1920 space); inside them anything lighter than the frames is sky
    zone = np.zeros((H, W), bool)
    for x0, y0, x1, y1 in [(0, 10, 505, 615), (590, 240, 730, 450), (780, 300, 905, 575), (1630, 0, 1920, 450)]:
        zone[y0:y1, x0:x1] = True
    win = ((L > 150) & zone).astype(np.uint8)
    win = cv2.morphologyEx(win, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8)).astype(bool) & zone & (L > 110)
    sky = np.stack([150 - yy * 0.035, 160 - yy * 0.03, 172 - yy * 0.025], axis=2)
    a[win] = sky[win]
    img = Image.fromarray(a.clip(0, 255).astype(np.uint8))
    sun = ((L > 175) & (yy > 620) & (xx > 280) & (xx < 1320)).astype(np.uint8) * 255
    sun = cv2.dilate(sun, np.ones((9, 9), np.uint8))
    b = cv2.inpaint(cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR), sun, 15, cv2.INPAINT_TELEA)
    img = Image.fromarray(cv2.cvtColor(b, cv2.COLOR_BGR2RGB))
    img = ImageEnhance.Color(img).enhance(0.7)
    img = ImageEnhance.Contrast(img).enhance(1.15)
    img = ImageEnhance.Brightness(img).enhance(0.9)
    tint = Image.new('RGB', (W, H), (120, 132, 150))
    return Image.blend(img, tint, 0.1)


SMOOTH = lambda im: im.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.SMOOTH_MORE)

jobs = {
    # ref 12: no people. Dry at 4:30: the rain haze over the tracks is de-streaked; board + ad are redrawn on top.
    'station-gate-r3': lambda: derain(cover(ld('12')), [(1140, 150, 1920, 1080), (980, 380, 1140, 1080)]),
    # ref 11: no people. De-streak the whole frame (it rains in the ref); signs + posters + vending are redrawn.
    'station-ads': lambda: derain(cover(ld('11')), [(0, 0, 1920, 1080)]),
    # ref 13: no people, no watermark: the sunlit pink carriage as is.
    'train-sun': lambda: cover(ld('13')),
    # ref 14: the エル watermark (bottom right) inpainted, then the rain grade.
    'train-rain': lambda: rainy_train(inpaint(cover(ld('14')), [(1790, 955, 1910, 1070)])),
    # ref 09: the umbrella girl (+ her reflection) and the far umbrella people inpainted; the overlay redraws the
    # train side and the wet floor over the hole, so her spot is EMPTY (Nanda stands there).
    'platform-rain': lambda: inpaint(cover(ld('09')), [(225, 165, 670, 1080), (1020, 450, 1110, 575)]),
}

os.makedirs(OUT, exist_ok=True)
for k, f in jobs.items():
    if ONLY and k not in ONLY: continue
    SMOOTH(f()).save(os.path.join(OUT, k + '.png'))
    print('prep', k)
