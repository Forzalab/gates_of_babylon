# SHOP vtrace r2: Tony's refs -> 1920x1080 PNGs for trace.py (the romance/scenes-r3 recipe, higher fidelity).
# Hand pass here is limited to: one vanishing point (the cart ref is placed so its VP lands on the shared VP 960,330),
# removing watermarks / people / brand marks (cv2 inpaint or a soft median patch), blanking the price card so the
# overlay redraws it in our text, and the 2:00 PM grade (brighter, warmer, black point lifted).
# usage: python3 prep.py <refs dir> <out dir>        (refs are NOT committed)
import sys, os
import numpy as np, cv2
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw, ImageOps

W, H = 1920, 1080
REF, OUT = sys.argv[1], sys.argv[2]
ld = lambda f: Image.open(os.path.join(REF, f)).convert('RGB')


def inpaint(im, boxes, r=7):
    a = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    m = np.zeros(a.shape[:2], np.uint8)
    for x0, y0, x1, y1 in boxes: m[y0:y1, x0:x1] = 255
    a = cv2.inpaint(a, m, r, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB))


def soften(im, boxes, k=9):
    """brand labels: a strong median inside the box keeps the colour blocks, loses the lettering"""
    for b in boxes:
        im.paste(im.crop(b).filter(ImageFilter.MedianFilter(k)), b[:2])
    return im


def cover(im, box):
    """crop box (ref px, ~16:9) -> 1920x1080"""
    return im.crop(box).resize((W, H), Image.LANCZOS)


def placed(im, k, vx, vy, at=(960, 330), wing_blur=16):
    """scale the ref by k and put ref point (vx, vy) at `at`; the empty sides get the neighbouring strip mirrored + blurred
    (the romance wings, mirrored so the shelves carry on). Nothing is stretched on one axis only, so verticals stay straight and there is one VP."""
    big = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    ox, oy = round(at[0] - vx * k), round(at[1] - vy * k)
    canvas = Image.new('RGB', (W, H))
    band = big.crop((0, -oy, big.width, -oy + H))
    lw, rw = max(ox, 0), max(W - (ox + big.width), 0)
    if lw:
        canvas.paste(ImageOps.mirror(band.crop((0, 0, lw + 4, H))).filter(ImageFilter.GaussianBlur(wing_blur)), (0, 0))
    if rw:
        canvas.paste(ImageOps.mirror(band.crop((band.width - rw - 4, 0, band.width, H))).filter(ImageFilter.GaussianBlur(wing_blur)), (W - rw - 4, 0))
    canvas.paste(band, (ox, 0))
    return canvas


def grade(im, bright=1.12, sat=1.08, warm=1.0):
    """2:00 PM: brighter, a touch warmer, black point lifted ~8%"""
    im = ImageEnhance.Brightness(im).enhance(bright)
    im = ImageEnhance.Color(im).enhance(sat)
    a = np.asarray(im).astype(np.float32)
    a = 20 + a * (235 / 255)
    a[..., 0] *= 1.0 + 0.04 * warm
    a[..., 2] *= 1.0 - 0.04 * warm
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def cart():
    # ref 15: VP ~ (152, 75); logo (top right) + the far shopper inpainted; rows above the ref cart only (the cart,
    # handle and hands are the hand-drawn overlay on the same VP)
    im = inpaint(ld('15.jpg'), [(278, 14, 318, 66), (130, 92, 146, 150)])
    return grade(placed(im, 4.4, 152, 75), 1.1)


def produce():
    # ref 12: the carrot pile + the handwritten card. The card is blanked (the overlay writes ¥99 in our text); the
    # watermark and the mushroom-bag brand labels softened.
    im = ld('12.jpg')
    im = inpaint(im, [(10, 570, 130, 625)])
    im = soften(im, [(240, 20, 481, 200), (90, 0, 175, 130)], 11)
    ImageDraw.Draw(im).polygon([(170, 140), (326, 150), (318, 306), (170, 294)], fill=(250, 248, 242))
    return grade(cover(im, (0, 120, 481, 391)), 1.08)


def eggs():
    # ref 11: the 幸福タマゴ egg display. The dark shopper (left) inpainted, the store name band + the tall text
    # banner + the price boards softened (the overlay hangs our cards on them).
    im = ld('11.jpg')
    im = inpaint(im, [(55, 85, 98, 132), (0, 0, 150, 16)])
    im = soften(im, [(300, 0, 372, 190), (395, 20, 450, 40), (240, 310, 330, 371), (360, 320, 440, 371)], 9)
    return grade(cover(im, (0, 26, 539, 329)), 1.12)


def cups():
    # ref 09: the tea-ware stand, placed so its cup row lands at y 440-520 (above the game card row). The shopper
    # (left edge) is cropped out; the 茶 poster softened. The overlay replaces the 4 odd cups with THE three.
    im = ld('09.jpg')
    im = soften(im, [(300, 360, 387, 480)], 9)
    return grade(placed(im.crop((60, 0, 387, 516)), 3.1, 163, 240, at=(820, 241)), 1.1)


def basket():
    # ref 03: the green basket full of groceries, 3/4 from above. The shopper's hands (top) inpainted, the pack
    # lettering softened, the watermark (bottom left) removed.
    im = ld('03.gif')
    im = inpaint(im, [(195, 0, 262, 52), (262, 0, 352, 40), (0, 312, 40, 325)])
    im = soften(im, [(110, 80, 400, 290)], 5)
    return grade(cover(im, (0, 0, 500, 281)), 1.08)


def basket_full():
    # ref 05: the grey basket packed with groceries (top view). The hand (top) + watermark (bottom right) removed,
    # the pack lettering softened.
    im = ld('05.gif')
    im = inpaint(im, [(200, 0, 320, 72), (470, 285, 540, 304)])
    im = soften(im, [(20, 20, 470, 300)], 5)
    return grade(cover(im, (0, 0, 540, 304)), 1.06)


jobs = {'cart': cart, 'produce': produce, 'eggs': eggs, 'cups': cups, 'basket': basket, 'basket-full': basket_full}
os.makedirs(OUT, exist_ok=True)
for k, f in jobs.items():
    if len(sys.argv) > 3 and k not in sys.argv[3:]: continue
    f().filter(ImageFilter.MedianFilter(3)).save(os.path.join(OUT, k + '.png'))
    print('prep', k)
