# TOWN walk (research/sprint-0930/town/NOTES.md): Tony's stock refs -> 1920x1080 PNGs for the FIRST auto trace.
# Per ref: keystone fix (straight verticals), placed so its street vanishing point lands on the shot's one VP, the
# empty sides / bottom filled (mirrored + blurred wings, a flat pavement), watermarks + people + brand text knocked
# down (inpaint / strong median; hand.py then covers every sign with our own art), and the brighter 2:45 PM grade.
# usage: python3 prep.py <refs dir> <out dir>        (refs are NOT committed)
import sys, os
import numpy as np, cv2
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

W, H = 1920, 1080
REF, OUT = sys.argv[1], sys.argv[2]
ld = lambda f: Image.open(os.path.join(REF, f)).convert('RGB')
# the one vanishing point of every shot (hand.py draws on the same points)
VPS = {'street': (960, 560), 'crossing': (960, 520), 'board': (1000, 600)}


def keystone(im, top_in):
    """straight verticals: the camera looks up, so verticals lean in at the top; pull the top corners OUT by top_in*W."""
    w, h = im.size; d = top_in * w
    src = np.float32([[d, 0], [w - d, 0], [w, h], [0, h]]); dst = np.float32([[0, 0], [w, 0], [w, h], [0, h]])
    M = cv2.getPerspectiveTransform(src, dst)
    a = cv2.warpPerspective(np.array(im), M, (w, h), borderMode=cv2.BORDER_REPLICATE)
    return Image.fromarray(a)


def inpaint(im, boxes, r=7):
    a = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR); m = np.zeros(a.shape[:2], np.uint8)
    for x0, y0, x1, y1 in boxes: m[y0:y1, x0:x1] = 255
    return Image.fromarray(cv2.cvtColor(cv2.inpaint(a, m, r, cv2.INPAINT_TELEA), cv2.COLOR_BGR2RGB))


def soften(im, boxes, k=11):
    for b in boxes: im.paste(im.crop(b).filter(ImageFilter.MedianFilter(k)), b[:2])
    return im


def placed(im, k, vx, vy, at, pave=(214, 206, 196), wing_blur=14):
    big = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    ox, oy = round(at[0] - vx * k), round(at[1] - vy * k)
    canvas = Image.new('RGB', (W, H), pave)
    band = Image.new('RGB', (big.width, H), pave); band.paste(big, (0, oy))
    lw, rw = max(ox, 0), max(W - (ox + big.width), 0)
    if lw: canvas.paste(ImageOps.mirror(band.crop((0, 0, lw + 4, H))).filter(ImageFilter.GaussianBlur(wing_blur)), (0, 0))
    if rw: canvas.paste(ImageOps.mirror(band.crop((band.width - rw - 4, 0, band.width, H))).filter(ImageFilter.GaussianBlur(wing_blur)), (W - rw - 4, 0))
    canvas.paste(band, (ox, 0))
    return canvas


def grade(im, bright=1.16, sat=1.1):
    """2:45 PM: brighter than the refs, a touch warm, black point lifted ~9% (the shop's 2:00 PM grade, one notch up)"""
    im = ImageEnhance.Color(ImageEnhance.Brightness(im).enhance(bright)).enhance(sat)
    a = np.asarray(im).astype(np.float32); a = 24 + a * (231 / 255)
    a[..., 0] *= 1.03; a[..., 2] *= 0.97
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def street():
    # ref 04: the billboard canyon, no people. VP (283, 312). The ESPACE / PACHINKO / カードキングダム / オノデン marks and
    # every billboard are median-softened (hand.py redraws them all as ours).
    im = keystone(ld('04.jpg'), 0.035)
    im = soften(im, [(0, 0, 250, 300), (280, 200, 340, 300), (330, 0, 547, 330)], 9)
    return grade(placed(im, 2.8, 283, 312, VPS['street']))


def crossing():
    # ref 05: the Akiba crossing. VP (300, 295). The people are knocked flat (a strong median) so hand.py's flat
    # silhouettes sit on colour, not on faces; amiami / COMIC ZIN / GiGO / WATTS + the car softened.
    im = ld('05.jpg')
    im = soften(im, [(0, 250, 588, 390)], 21)
    im = soften(im, [(410, 0, 588, 300), (0, 0, 130, 250), (120, 0, 270, 280)], 11)
    return grade(placed(keystone(im, 0.02), 3.27, 300, 295, VPS['crossing']))


def board():
    # ref 07: the vertical Akiba street under a big billboard. VP (230, 470). The alamy watermark (bottom) is cut off
    # by the band, the people (faces!) are knocked flat, the billboards + tall signs softened.
    im = ld('07.jpg').crop((0, 0, 437, 640))
    im = inpaint(im, [(0, 620, 437, 640)])
    im = soften(im, [(0, 430, 437, 640)], 25)
    im = soften(im, [(60, 0, 437, 440)], 11)
    return grade(placed(im, 2.0, 230, 470, VPS['board']))


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for k, f in {'street': street, 'crossing': crossing, 'board': board}.items():
        f().filter(ImageFilter.MedianFilter(3)).save(os.path.join(OUT, k + '.png')); print('prep', k)
