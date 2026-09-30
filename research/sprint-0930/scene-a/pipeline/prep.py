# Scene A prep: Tony's refs -> PNGs ready for vtracer (romance/pipeline recipe: LANCZOS upscale + light smoothing).
#   rooftop-noon  = ref 05, cover-cropped to 16:9 at 1920x1080
#   rooftop-warm  = ref 07, cover-cropped to 16:9 (anchored low: keep the tiles, lose sky)
#   bento-pink    = ref 10, the box INTERIOR rectified to a flat 1000x620 top-down plate (cv2 perspective warp from
#                   the 4 inner rim corners, measured on a 2x grid), the umeboshi inpainted away (it is hand-drawn as a
#                   button on top, and the lifted state must show bare rice + a stain). The rim, the hand and the dark
#                   background are gone: the component draws its own crisp rim.
#                 Only the right half (x 455-1000 = sausages, salad on lettuce, kinpira, tamagoyaki slot) is kept.
# usage: python3 prep.py <refs dir> <out dir>
import sys, os
import numpy as np, cv2
from PIL import Image, ImageFilter

W, H = 1920, 1080
REF, OUT = sys.argv[1], sys.argv[2]
ld = lambda f: Image.open(os.path.join(REF, f)).convert('RGB')


def cover(im, fy=0.5):
    w, h = im.size
    if w / h > W / H:
        nw = round(h * W / H); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
    else:
        nh = round(w * H / W); y = round((h - nh) * fy); im = im.crop((0, y, w, y + nh))
    return im.resize((W, H), Image.LANCZOS)


def bento():
    im = np.array(ld('10.jpg').resize((1176, 660), Image.LANCZOS))
    src = np.float32([[172, 100], [990, 50], [1032, 600], [232, 642]])   # inner rim corners, 2x ref px
    dst = np.float32([[0, 0], [1000, 0], [1000, 620], [0, 620]])
    a = cv2.warpPerspective(im, cv2.getPerspectiveTransform(src, dst), (1000, 620), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REPLICATE)
    m = np.zeros(a.shape[:2], np.uint8)
    cv2.ellipse(m, (250, 296), (66, 56), 0, 0, 360, 255, -1)            # the ref's umeboshi
    a = cv2.inpaint(a, m, 9, cv2.INPAINT_TELEA)
    return Image.fromarray(a).crop((455, 0, 1000, 620))  # the sides only: the rice half is hand-drawn (the trace
    # turned black sesame into brown dirt), the umeboshi inpaint is kept for a full-plate A/B if ever needed


SMOOTH = lambda im: im.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.SMOOTH_MORE)
jobs = {
    'rooftop-noon': lambda: SMOOTH(cover(ld('05.jpg'))),
    'rooftop-warm': lambda: SMOOTH(cover(ld('07.jpg'), fy=0.7)),
    'bento-pink': lambda: bento().filter(ImageFilter.MedianFilter(3)),
}
os.makedirs(OUT, exist_ok=True)
for k, f in jobs.items():
    f().save(os.path.join(OUT, k + '.png'))
    print('prep', k)
