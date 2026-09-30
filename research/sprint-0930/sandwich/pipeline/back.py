# SANDWICH back layer for v2-town: a PURE vtrace of the ORIGINAL ref. No big pre-blur (unlike town/pipeline/pure.py):
# only real human faces get a small blur, and real brand names get a small scrub. The ad clutter stays.
# usage: python3 back.py <refs dir> <out png dir>   then: python3 ../../town/pipeline/trace.py <out png dir> public/date-beta/trace/town
#        (the pngs are named <id>-sw.png so the traces land as town/<id>-sw.svg next to the old ones)
import sys, os
from PIL import Image, ImageFilter

W, H = 1920, 1080
# id: (ref, 16:9 crop, faces (small blur), brand names (scrub)) in ref px; same crops as town/pipeline/pure.py
SHOTS = {
    'street': ('04.jpg', (0, 57, 547, 365), [(180, 296, 345, 318)], [
        (70, 0, 165, 66),      # PACHINKO & SLOT / ESPACE / the name under it
        (163, 18, 198, 108),   # the red vertical brand sign
        (288, 205, 340, 224),  # オノデン (our オア電 cel covers it)
        (430, 60, 547, 165),   # カードキングダム / cardkingdom
        (0, 262, 160, 290),    # the anniversary banner lettering
        (378, 250, 440, 272),  # the shop fascia name
    ]),
    'crossing': ('05.jpg', (0, 59, 588, 390), [(0, 278, 588, 312)], [
        (418, 18, 560, 64),    # amiami
        (108, 70, 132, 170),   # GiGO
        (22, 118, 70, 152),    # WATTS
        (0, 28, 22, 165),      # the left vertical brand
        (438, 236, 545, 266),  # COMIC ZIN
        (268, 244, 342, 272),  # 吉野家
        (510, 330, 588, 372),  # the car badge
    ]),
    'board': ('07.jpg', (0, 40, 437, 286), [], [
        (88, 10, 128, 420),    # the tall vertical brand signs
        (72, 185, 98, 395),    # AKKY / tax-free
        (330, 40, 437, 110),   # the stock watermark (top right)
        (185, 175, 305, 200),  # the key visual's date / title lettering
    ]),
}


def soft(im, boxes, k, r):
    im = im.copy()
    for b in boxes:
        c = im.crop(b)
        c = c.resize((max(1, c.width // k), max(1, c.height // k)), Image.BILINEAR).resize(c.size, Image.BILINEAR)
        im.paste(c.filter(ImageFilter.GaussianBlur(r)), b[:2])
    return im


if __name__ == '__main__':
    REF, OUT = sys.argv[1], sys.argv[2]
    os.makedirs(OUT, exist_ok=True)
    for k, (f, crop, faces, brands) in SHOTS.items():
        im = Image.open(os.path.join(REF, f)).convert('RGB')
        im = soft(soft(im, faces, 2, 1), brands, 4, 1.5)
        im.crop(crop).resize((W, H), Image.LANCZOS).save(os.path.join(OUT, k + '-sw.png'))
        print('back', k)
