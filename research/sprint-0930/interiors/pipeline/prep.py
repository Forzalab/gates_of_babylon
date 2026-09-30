# T1b INTERIORS: prep refs -> 1920x1080 PNGs for vtracer (alt's PLAN-main.md recipe, same as romance/pipeline/prep.py:
# LANCZOS upscale, light smoothing, portrait refs full-height with stretched+blurred+darkened wings).
# usage: python3 prep.py <tony refs dir> <out dir> [id ...]
#   Tony's basement refs (50-53) are NOT committed (composition/palette only); research/refs/* are.
# Basement composite = ref 52 (skylight shaft) MIRRORED so the window sits right of centre and the beam can land on the
# centre chair while the stairs (hand overlay, right) stay out of it; the ref's own floor light patch is inpainted
# (the overlay draws the new shaft + patch); darkened ~25% so the overlay's single shaft reads as the key light.
import sys, os
import numpy as np, cv2
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

W, H = 1920, 1080
REF, OUT = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
HERE = os.path.dirname(os.path.abspath(__file__))
REPO_REFS = os.path.normpath(os.path.join(HERE, '../../../refs'))
tony = lambda f: Image.open(os.path.join(REF, f)).convert('RGB')
repo = lambda f: Image.open(os.path.join(REPO_REFS, f)).convert('RGB')


def cover(im, fy=0.5):
    w, h = im.size
    if w / h > W / H:
        nw = round(h * W / H); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
    else:
        nh = round(w * H / W); y = round((h - nh) * fy); im = im.crop((0, y, w, y + nh))
    return im.resize((W, H), Image.LANCZOS)


def inpaint(im, boxes, r=7):
    a = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    m = np.zeros(a.shape[:2], np.uint8)
    for x0, y0, x1, y1 in boxes: m[y0:y1, x0:x1] = 255
    a = cv2.inpaint(a, m, r, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(a, cv2.COLOR_BGR2RGB))


def wings(im, top=0, bot=None):
    """Portrait ref: rows top..bot full height in the middle; wings = outer columns stretched + blurred + darkened."""
    im = im.crop((0, top, im.width, bot or im.height))
    k = H / im.height; mid = im.resize((round(im.width * k), H), Image.LANCZOS)
    wing = (W - mid.width) // 2 + 2
    canvas = Image.new('RGB', (W, H))
    for side, box in (('l', (0, 0, 24, H)), ('r', (mid.width - 24, 0, mid.width, H))):
        strip = mid.crop(box).resize((wing, H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(18))
        strip = ImageEnhance.Brightness(strip).enhance(0.62)
        canvas.paste(strip, (0 if side == 'l' else W - wing, 0))
    canvas.paste(mid, ((W - mid.width) // 2, 0))
    return canvas


def basement():
    im = ImageOps.mirror(tony('52-basement-skylight-shaft.jpg'))  # 736x414
    # the ref's floor light patch (mirrored: x 330..590, y 300..394 incl. its soft edge) -> concrete; the ref's ceiling lamp -> joist
    # + the ref's timber post (mirrored x 468..536): the overlay box stairs cover it below y 92 (ref px); inpaint only the ceiling part
    im = inpaint(im, [(330, 300, 590, 394), (395, 14, 420, 34), (466, 0, 538, 92)], 9)
    # the ceiling boards over the window are over-bright in the ref (they trace as a second window): feathered darken
    a = np.array(im).astype(np.float32)
    m = np.zeros(a.shape[:2], np.float32); m[40:128, 320:480] = 1
    m = cv2.GaussianBlur(m, (0, 0), 14)[..., None]
    a = a * (1 - 0.5 * m)
    im = Image.fromarray(a.clip(0, 255).astype(np.uint8))
    im = ImageEnhance.Brightness(im).enhance(0.78)
    return cover(im)


def park():
    """Sakura park (ref 9, 374x534 portrait): a 16:9 band (rows ~200..410: canopy hem, trunks, lamp, gazebo, bench,
    path, pond) cover-cropped to the stage; Craiyon mark (bottom-right) is outside the band. The hand overlay adds the
    near canopy, the bench for two, the path edge, the far pink clock tower (ref 10 idea, redrawn) and the grade."""
    im = cover(repo('sakura-park_5f5f46b7.jpg'), 0.62)
    return ImageEnhance.Color(im).enhance(1.3)


SMOOTH = lambda im: im.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.SMOOTH_MORE)
jobs = {'basement': basement, 'park': park}

os.makedirs(OUT, exist_ok=True)
for k, f in jobs.items():
    if ONLY and k not in ONLY: continue
    SMOOTH(f()).save(os.path.join(OUT, k + '.png'))
    print('prep', k)
