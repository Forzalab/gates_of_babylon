# TOWN PURE vtrace prep (research/sprint-0930/town/NOTES.md "PURE"): ref -> 1920x1080 PNG for ONE vtracer pass, no hand
# repaint. The only steps: a 16:9 crop + scale, a strong blur of real faces / brand logos / watermarks / other people's
# key visuals (unrecognisable), and the light 2:45 PM grade. Our pun signs + the ゲートちゃん board are cels in Town.jsx.
# usage: python3 pure.py <refs dir> <out dir> [--boxes]   (--boxes also writes <id>-boxes.png with the blur boxes drawn)
import sys, os
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
import numpy as np

W, H = 1920, 1080
# id: (ref, 16:9 crop box in ref px, blur boxes in ref px). Crops keep the street + the board we cover.
SHOTS = {
    'street': ('04.jpg', (0, 57, 547, 365), [
        (40, 0, 205, 75),      # PACHINKO / ESPACE / エヌガイツ
        (0, 60, 195, 250),     # the left anime key visuals
        (0, 250, 170, 365),    # the poster row + its shop name
        (240, 150, 290, 300),  # LAOX + the far signs at the end of the street
        (500, 295, 547, 345),  # the right shop's notice board
        (160, 55, 250, 300),   # the vertical brand signs, left of the VP
        (280, 195, 345, 300),  # オノデン roof + far boards (our オア電 cel goes here)
        (335, 0, 547, 300),    # the right boards: key visuals, カードキングダム, the shop fascias
        (180, 290, 345, 318),  # far pedestrians (faces)
    ]),
    'crossing': ('05.jpg', (0, 59, 588, 390), [
        (410, 0, 588, 250),    # amiami + its key visual (our ANDロイド cel goes here)
        (0, 0, 140, 250),      # WATTS / the vertical brand signs
        (120, 0, 275, 285),    # GiGO + signs, left of centre
        (270, 100, 420, 285),  # the shop signs + 吉野家, right of centre
        (410, 235, 588, 275),  # COMIC ZIN
        (0, 240, 140, 280),    # the small far-left signs
        (0, 270, 588, 335),    # the crowd's heads (faces)
        (495, 300, 588, 380),  # the car's badge
    ]),
    'board': ('07.jpg', (0, 40, 437, 286), [
        (160, 50, 340, 250),   # the anime billboard (our ゲートちゃん cel goes here)
        (60, 0, 130, 286),     # the tall vertical brand signs (AKKY, tax-free ...)
        (0, 200, 60, 286),     # the far-left signs
        (120, 0, 280, 55),     # the top boards
        (330, 100, 437, 286),  # right-side signs
        (330, 40, 437, 110),   # the stock watermark (top right)
        (150, 235, 420, 286),  # the maid board (drawn faces) under it
    ]),
}


def grade(im, bright=1.08, sat=1.05):
    """the light 2:45 PM grade: a little brighter, black point lifted ~6%, a touch warm"""
    im = ImageEnhance.Color(ImageEnhance.Brightness(im).enhance(bright)).enhance(sat)
    a = np.asarray(im).astype(np.float32); a = 16 + a * (239 / 255)
    a[..., 0] *= 1.02; a[..., 2] *= 0.98
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def blur(im, boxes):
    """pixelate to 1/6 then gaussian: no face / logo / watermark survives"""
    im = im.copy()
    for b in boxes:
        r = im.crop(b)
        r = r.resize((max(1, r.width // 6), max(1, r.height // 6)), Image.BILINEAR).resize(r.size, Image.BILINEAR)
        im.paste(r.filter(ImageFilter.GaussianBlur(3)), b[:2])
    return im


def prep(ref_dir, k):
    f, crop, boxes = SHOTS[k]
    im = blur(Image.open(os.path.join(ref_dir, f)).convert('RGB'), boxes)
    return grade(im.crop(crop).resize((W, H), Image.LANCZOS))


if __name__ == '__main__':
    REF, OUT = sys.argv[1], sys.argv[2]
    os.makedirs(OUT, exist_ok=True)
    for k, (f, crop, boxes) in SHOTS.items():
        im = prep(REF, k)
        im.save(os.path.join(OUT, k + '.png'))
        if '--boxes' in sys.argv:
            d = ImageDraw.Draw(im); s = W / (crop[2] - crop[0])
            for x0, y0, x1, y1 in boxes:
                d.rectangle(((x0 - crop[0]) * s, max(0, (y0 - crop[1]) * s), (x1 - crop[0]) * s, (y1 - crop[1]) * s), outline='red', width=4)
            im.save(os.path.join(OUT, k + '-boxes.png'))
        print('pure prep', k)
