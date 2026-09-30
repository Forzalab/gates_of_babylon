# SHOP cel-over-vtrace (CEL-LOG.md): Tony's refs -> 1920x1080 PNGs for trace.py (the far plane of every shop shot).
# Pre-trace ONLY: a crop/scale (+ a mirror for the reverse angle), a soften/inpaint of real faces, people and brand
# lettering, and the light 2:00 PM grade. Everything that must read (signs, prices, cups, hands, the cashier) is a cel
# on top (art/shop). The ref mapping follows FIX-LOG.md. The six vtrace-r2 bgs (cart, produce, eggs, cups, basket,
# basket-full) are re-prepped by ../vtrace-r2/prep.py and re-traced here at 48 colours.
# usage: python3 prep.py <refs dir> <out dir> [id ...]      (refs are NOT committed)
import sys, os
import numpy as np, cv2
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

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
    for b in boxes: im.paste(im.crop(b).filter(ImageFilter.MedianFilter(k)), b[:2])
    return im


def blur(im, boxes, r=6):
    for b in boxes: im.paste(im.crop(b).filter(ImageFilter.GaussianBlur(r)), b[:2])
    return im


cover = lambda im, box: im.crop(box).resize((W, H), Image.LANCZOS)


def grade(im, bright=1.1, sat=1.08, warm=1.0):
    """2:00 PM: brighter, a touch warmer, black point lifted ~8%"""
    im = ImageEnhance.Brightness(im).enhance(bright)
    im = ImageEnhance.Color(im).enhance(sat)
    a = np.asarray(im).astype(np.float32)
    a = 20 + a * (235 / 255)
    a[..., 0] *= 1.0 + 0.04 * warm
    a[..., 2] *= 1.0 - 0.04 * warm
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def vending():  # ref 16: the sunny konbini face, the whole frame (the shop name + side banners softened)
    im = soften(ld('16.jpg'), [(315, 190, 410, 210), (0, 215, 90, 240), (680, 205, 739, 235)], 7)
    return grade(cover(im, (0, 0, 739, 415)), 1.04)


def doors():  # ref 16, closer: the entrance lands right of Nanda's slot (x ~1230-1550)
    im = soften(ld('16.jpg'), [(315, 190, 410, 210)], 7)
    return grade(cover(im, (110, 118, 470, 321)), 1.04)


def exit_():  # the way out: the same shop face mirrored (screen direction reversed: the door is now on the LEFT)
    return ImageOps.mirror(doors())


def carrots():  # ref 12, tight on the pile (below the card); the mushroom-bag brands + watermark removed
    im = soften(ld('12.jpg'), [(240, 20, 481, 200)], 11)
    im = inpaint(im, [(10, 570, 130, 625)])
    return grade(cover(im, (0, 300, 481, 571)), 1.06)


def eggs_rack():  # ref 11, tight on the egg-pack stack; the header boards softened (the cels hang our prices)
    im = ld('11.jpg')
    im = inpaint(im, [(55, 85, 98, 132)])
    im = soften(im, [(80, 60, 330, 100), (90, 140, 330, 180), (240, 310, 330, 371)], 9)
    return grade(cover(im, (60, 110, 316, 254)), 1.1)


def cups_front():  # ref 10, the tea-bowl shelf, its top two rows
    return grade(cover(ld('10.jpg'), (0, 0, 225, 127)), 1.12)


def snacks():  # ref 04, the strawberry snack shelf; the pack lettering softened
    im = soften(ld('04.jpg'), [(0, 0, 399, 226)], 5)
    return grade(cover(im, (0, 0, 399, 224)), 1.06)


def checkout():  # ref 07, the real checkout lanes; the far shoppers blurred, the watermark softened
    im = ld('07.png')
    im = blur(im, [(0, 330, 90, 520), (200, 350, 420, 480), (0, 600, 60, 800)], 8)
    im = soften(im, [(380, 340, 1200, 800)], 5)
    return grade(cover(im, (0, 70, 1200, 745)), 1.06)


def register():  # ref 06, the retro register + goods; the cashier's hand inpainted (the cel lady waves instead)
    im = ld('06.jpg')
    im = inpaint(im, [(285, 150, 425, 235)], 9)
    im = soften(im, [(0, 170, 110, 330), (300, 320, 400, 400), (355, 380, 470, 470)], 9)
    return grade(cover(im, (0, 20, 554, 332)), 1.08)


def handle():  # ref 05, the grey basket packed with goods; the hand removed (her hand is the cel), labels softened
    im = ld('05.gif')
    im = inpaint(im, [(200, 0, 320, 72), (470, 285, 540, 304)])
    im = soften(im, [(20, 20, 470, 300)], 5)
    return grade(cover(im, (60, 0, 500, 247)), 1.06)


def self_():  # ref 08, the self-checkout lanes; the promo lettering inpainted, the presenter cropped out
    im = ld('08.jpg')
    # a mask of the lettering only (white fill + its dark outline), not the whole box, so the machines survive
    a = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    g = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
    m = np.zeros(g.shape, np.uint8)
    for x0, y0, x1, y1 in [(150, 45, 440, 122), (160, 140, 440, 195)]:
        m[y0:y1, x0:x1] = ((g[y0:y1, x0:x1] > 225) | (g[y0:y1, x0:x1] < 45)) * 255
    m = cv2.dilate(m, np.ones((5, 5), np.uint8))
    im = Image.fromarray(cv2.cvtColor(cv2.inpaint(a, m, 5, cv2.INPAINT_TELEA), cv2.COLOR_BGR2RGB))
    return grade(cover(im, (0, 20, 460, 279)), 1.08)


jobs = {'vending': vending, 'doors': doors, 'exit': exit_, 'carrots': carrots, 'eggs-rack': eggs_rack,
        'cups-front': cups_front, 'snacks': snacks, 'checkout': checkout, 'register': register, 'handle': handle, 'self': self_}
os.makedirs(OUT, exist_ok=True)
for k, f in jobs.items():
    if len(sys.argv) > 3 and k not in sys.argv[3:]: continue
    f().filter(ImageFilter.MedianFilter(3)).save(os.path.join(OUT, k + '.png'))
    print('prep', k)
