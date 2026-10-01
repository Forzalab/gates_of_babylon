# SHOP pre-pass (scenes-r3/PLAN.md "Art style" 1, same recipe as g1-pipeline/prep.py): Tony's shop refs -> 1920x1080
# PNGs for trace.py. Cover-crop to 16:9 (portrait refs: a 16:9 band), cv2 inpaint for people / watermarks / caption
# text, median + SMOOTH_MORE. Boxes are in 1920x1080 space (after the crop). The hand overlay (src/date-beta/art/shop/)
# redraws every sign in our own words and whatever the inpaint smears.
# usage: python3 prep.py <refs dir> <out dir> [id ...]      refs dir = <id8>.png first frames (NOT committed; SHOTLIST.md)
# then:  python3 ../../romance/pipeline/trace.py <out dir> public/date-beta/trace/shop [id ...]
import sys, os
import numpy as np, cv2
from PIL import Image, ImageFilter, ImageEnhance

W, H = 1920, 1080
REF, OUT = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
ld = lambda n: Image.open(os.path.join(REF, n + '.png')).convert('RGB')


def cover(im, fy=0.5):
    w, h = im.size
    if w / h > W / H:
        nw = round(h * W / H); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
    else:
        nh = round(w * H / W); y = round((h - nh) * fy); im = im.crop((0, y, w, y + nh))
    return im.resize((W, H), Image.LANCZOS)


def inpaint(im, boxes, r=9):
    a = np.array(im)
    m = np.zeros(a.shape[:2], np.uint8)
    for x0, y0, x1, y1 in boxes: m[y0:y1, x0:x1] = 255
    sa, sm = cv2.resize(a, (W // 2, H // 2), interpolation=cv2.INTER_AREA), cv2.resize(m, (W // 2, H // 2), interpolation=cv2.INTER_NEAREST)
    f = cv2.inpaint(cv2.cvtColor(sa, cv2.COLOR_RGB2BGR), sm, r, cv2.INPAINT_TELEA)
    f = cv2.cvtColor(cv2.resize(f, (W, H), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2RGB)
    a[m > 0] = f[m > 0]
    return Image.fromarray(a)


def maskpaint(im, box, test, grow=7, r=7):
    """Inpaint only the pixels test(R, G, B) marks inside box (caption letters, rings, a sleeve), grown by `grow` px."""
    a = np.array(im).astype(np.int32)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    m = np.zeros(a.shape[:2], np.uint8)
    x0, y0, x1, y1 = box
    sel = test(R, G, B).astype(np.uint8)
    m[y0:y1, x0:x1] = sel[y0:y1, x0:x1] * 255
    m = cv2.dilate(m, np.ones((grow * 2 + 1, grow * 2 + 1), np.uint8))
    f = cv2.inpaint(cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR), m, r, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(f, cv2.COLOR_BGR2RGB))


def flat(im, boxes, color):
    """A big hole the overlay redraws anyway: one flat cel, so the trace keeps it as one clean region (no smear)."""
    a = np.array(im)
    for x0, y0, x1, y1 in boxes: a[y0:y1, x0:x1] = color
    return Image.fromarray(a)


def sunny(im, k=1.08):
    """2:00 PM: a touch brighter and warmer so every shop beat grades like the afternoon street."""
    im = ImageEnhance.Brightness(im).enhance(k)
    return Image.blend(im, Image.new('RGB', (W, H), (255, 226, 180)), 0.06)


SMOOTH = lambda im: im.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.SMOOTH_MORE)

jobs = {
    # c91399ad vending machines under the arcade roof: the red shopper at the left edge out.
    'shop-vending': lambda: sunny(inpaint(cover(ld('c91399ad'), 0.35), [(0, 760, 130, 1080)])),
    # 16981cdc konbini doors: the man, the girl, the far clerk and the watermark out (the overlay redraws the doors).
    'shop-doors': lambda: sunny(inpaint(flat(cover(ld('16981cdc')), [(440, 230, 1160, 1080), (1250, 520, 1450, 800)], (214, 222, 206)), [(1560, 1020, 1920, 1080)])),
    # 48d536e4 cart POV: the shopper's hand + sleeve and the cart contents out (the overlay draws the empty cart wires).
    'shop-cart': lambda: sunny(flat(maskpaint(cover(ld('48d536e4')), (1180, 0, 1920, 1080), lambda R, G, B: ((R > 150) & (B < 120)) | ((R > 200) & (G < 150)) | ((R > 190) & (G > 150) & (B > 120) & (R - B > 40)), 12, 11), [(640, 200, 1210, 930)], (206, 204, 200))),
    # 7eeb457b tomatoes: the "Oh! Wonderful" caption and the yellow rings out (the overlay redraws the price cards).
    'aisle-produce': lambda: sunny(maskpaint(maskpaint(cover(ld('7eeb457b'), 0.6), (0, 0, 1920, 1080), lambda R, G, B: (R > 190) & (G > 170) & (B < 90), 9), (1040, 470, 1900, 860), lambda R, G, B: (R < 55) & (G < 55) & (B < 55), 5)),
    # (then the caption's black outline, only where the caption was)
    # 3e2c3f6b carrots (portrait): the crate band under the sign.
    'produce-carrots': lambda: sunny(cover(ld('3e2c3f6b'), 0.62)),
    # cc81cb95 egg stand: the far shopper at the aisle end out.
    'aisle-eggs': lambda: sunny(inpaint(cover(ld('cc81cb95'), 0.4), [(1330, 380, 1420, 560)])),
    # 28b1b12e egg racks: no people.
    'eggs-rack': lambda: sunny(cover(ld('28b1b12e'), 0.5)),
    # 708a5c2b tableware (portrait): the bowls band + the "Enjoy Tea!" card (redrawn).
    'aisle-cups': lambda: sunny(cover(ld('708a5c2b'), 0.52)),
    # ebc36ef4 tea bowls front-on (portrait): the two bowl shelves.
    'cups-front': lambda: sunny(cover(ld('ebc36ef4'), 0.55)),
    # a2a61ba4 tea tins: no people (the blank card becomes her "ALIGN" card).
    'tea-tins': lambda: sunny(cover(ld('a2a61ba4'), 0.5)),
    # 8d83db1f basket (first frame): the watermark out; her hands stay (story hands, not a passer-by).
    'basket-cups': lambda: sunny(inpaint(cover(ld('8d83db1f'), 0.4), [(0, 1010, 260, 1080)])),
    # 8873611d basket handle (first frame): the watermark out; her hand stays.
    'basket-handle': lambda: sunny(inpaint(cover(ld('8873611d')), [(1600, 1010, 1920, 1080)])),
    # 0a536433 snack shelf: the watermark out.
    'shop-snacks': lambda: sunny(inpaint(cover(ld('0a536433')), [(0, 0, 420, 70)])),
    # d110f421 checkout wide: shoppers + cashiers out; median kills the faint pngtree marks.
    'checkout-wide': lambda: sunny(inpaint(cover(ld('d110f421')).filter(ImageFilter.MedianFilter(7)), [(80, 450, 220, 800), (740, 470, 1000, 560), (1110, 470, 1250, 580), (1500, 470, 1560, 540)]), 1.0),
    # c6ec0ec2 retro register: the shop lady's hands + apron stay (she is in the story).
    'register': lambda: sunny(cover(ld('c6ec0ec2'), 0.28), 1.05),
    # b56aeeaa self-checkout: the man and the big caption out (the overlay redraws the machine tops).
    'self-checkout': lambda: sunny(inpaint(maskpaint(cover(ld('b56aeeaa')), (500, 120, 1460, 640), lambda R, G, B: ((R > 238) & (G > 238) & (B > 238)) | ((R < 60) & (G < 60) & (B < 60)), 5), [(1500, 300, 1920, 1080)])),
}

os.makedirs(OUT, exist_ok=True)
for k, f in jobs.items():
    if ONLY and k not in ONLY: continue
    SMOOTH(f()).save(os.path.join(OUT, k + '.png'))
    print('prep', k)
