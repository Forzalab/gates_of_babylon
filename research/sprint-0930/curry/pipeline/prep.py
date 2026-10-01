# CURRY pre-pass (scenes-r3/PLAN.md "Art style" 1; helpers from the shop agent's shop/pipeline/prep.py): Tony's curry
# refs -> 1920x1080 PNGs for trace.py. Per shot: inpaint people / watermarks / captions / signs (boxes in REF px, before
# the crop), crop a 16:9 box (REF px), resize, then median + SMOOTH_MORE. Inserts of one path are Lab-matched to that
# path's hero dish, so every insert sits on the same table in the same light (coherence rule "one table per path").
# The hand overlay (src/date-beta/art/curry/) redraws every sign in our own words and whatever the inpaint smears.
# usage: python3 prep.py <refs dir> <out dir> [id ...]      refs dir = Tony's uploads (<id8>-image.*; NOT committed)
# then:  python3 ../../romance/pipeline/trace.py <out dir> public/date-beta/trace/curry [id ...]
import sys, os, glob
import numpy as np, cv2
from PIL import Image, ImageFilter, ImageEnhance

W, H = 1920, 1080
REF, OUT = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
os.makedirs(OUT, exist_ok=True)


def ld(k):
    return Image.open(glob.glob(os.path.join(REF, k + '-image.*'))[0]).convert('RGB')


def inpaint(im, boxes, r=7):
    a = np.array(im)
    m = np.zeros(a.shape[:2], np.uint8)
    for x0, y0, x1, y1 in boxes: m[y0:y1, x0:x1] = 255
    f = cv2.inpaint(cv2.cvtColor(a, cv2.COLOR_RGB2BGR), m, r, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(f, cv2.COLOR_BGR2RGB))


def flat(im, boxes, color):
    """A hole the overlay redraws anyway (a sign, a TV screen): one flat cel, so the trace keeps it as one region."""
    a = np.array(im)
    for x0, y0, x1, y1 in boxes: a[y0:y1, x0:x1] = color
    return Image.fromarray(a)


def box(im, b, w=W, h=H):
    return im.crop(b).resize((w, h), Image.LANCZOS)


def lab_match(src, ref, k=0.6):
    """Reinhard colour transfer (k = strength): src's Lab mean/std -> ref's."""
    s = cv2.cvtColor(np.asarray(src), cv2.COLOR_RGB2LAB).astype(np.float32)
    r = cv2.cvtColor(np.asarray(ref), cv2.COLOR_RGB2LAB).astype(np.float32)
    o = s.copy()
    for c in range(3):
        o[..., c] = (s[..., c] - s[..., c].mean()) / (s[..., c].std() + 1e-6) * r[..., c].std() + r[..., c].mean()
    o = s * (1 - k) + o * k
    return Image.fromarray(cv2.cvtColor(np.clip(o, 0, 255).astype(np.uint8), cv2.COLOR_LAB2RGB))


def warm(im, k=1.04, t=0.05):
    """2:55-3:40 PM, one light for the whole visit: a touch brighter and warmer."""
    im = ImageEnhance.Brightness(im).enhance(k)
    return Image.blend(im, Image.new('RGB', im.size, (255, 222, 176)), t)


def finish(im):
    return im.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.SMOOTH_MORE)


def street():
    # left half: the Indian shop (37f7e6cf); right half: the katsu shop (da264766). Seam hidden by a drawn pole.
    a = ld('37f7e6cf')
    a = inpaint(a, [(0, 420, 170, 452)])                         # the photo credit
    a = flat(a, [(60, 210, 330, 305)], (236, 236, 232))           # インデアン / カレーショップ lettering -> NAND HOUSE (overlay)
    a = flat(a, [(465, 150, 545, 200)], (238, 236, 232))          # the "indian CURRY SHOP" logo over the awning
    a = inpaint(a, [(372, 330, 400, 350)])                       # the 営業中 plate (redrawn)
    L = box(a, (20, 0, 422, 452), W // 2, H)
    b = ld('da264766')
    b = flat(b, [(150, 145, 400, 200)], (246, 208, 20))           # ゴーゴーカレー -> the OR OR sign (overlay)
    b = flat(b, [(150, 205, 400, 240)], (246, 212, 30))           # the promo strip
    b = flat(b, [(345, 285, 375, 420)], (238, 190, 20))           # 2階席アリマス
    b = flat(b, [(0, 280, 70, 421)], (60, 48, 40))                # the photo-menu poster (people-free, redrawn)
    b = flat(b, [(465, 0, 561, 60)], (238, 238, 238))             # "Figu..." sign
    b = flat(b, [(465, 80, 540, 190)], (236, 236, 236))           # "CONO..." sign
    b = flat(b, [(0, 170, 70, 235)], (40, 44, 60))                # SHINOYA signs
    b = flat(b, [(185, 285, 335, 421)], (70, 50, 36))             # the doorway: people inside -> dark, overlay draws a glass door
    R = box(b, (90, 0, 464, 421), W // 2, H)
    out = Image.new('RGB', (W, H)); out.paste(L, (0, 0)); out.paste(R, (W // 2, 0))
    return warm(out)


def butter_door():
    a = ld('37f7e6cf')
    a = flat(a, [(465, 150, 545, 200)], (238, 236, 232))
    a = inpaint(a, [(372, 330, 400, 350)])
    return warm(box(a, (330, 190, 610, 347)))


def butter_int():
    a = ld('1774ff02')
    a = flat(a, [(22, 85, 75, 195)], (120, 60, 40))               # the actress poster -> a flat panel (overlay: a poster)
    a = inpaint(a, [(395, 150, 560, 175)])                       # the phone number on the glass
    return warm(box(a, (0, 0, 640, 360)))


def butter_table():
    a = ld('a0202261')
    a = inpaint(a, [(180, 150, 225, 190)])                       # the napkin box + sauce bottles (overlay: our cruet)
    return warm(box(a, (0, 55, 225, 182)), 1.08)


HERO = None


def thali():
    a = ld('b6b74858')
    return warm(box(a, (0, 12, 588, 343)))


def naan_lift():
    a = ld('acc8479f')
    a = inpaint(a, [(145, 340, 305, 390), (0, 525, 80, 549)])     # Getty credit + the stock id
    return lab_match(warm(box(a, (0, 115, 364, 320))), HERO)


def sauce():
    a = ld('59cee883')
    a = inpaint(a, [(115, 255, 480, 305), (0, 0, 45, 80)])       # the menu14 caption + the finger at the top-left
    return lab_match(warm(box(a, (0, 0, 588, 330))), HERO, 0.35)


def naan_dip():
    a = ld('c8b36373')
    return lab_match(warm(box(a, (0, 0, 547, 308))), HERO, 0.5)


def naan_feed():
    a = ld('d791b70f')
    a = inpaint(a, [(40, 0, 180, 18)])                           # the fingers at the top edge (the overlay draws YOUR hand, bottom-left)
    return lab_match(warm(box(a, (0, 8, 275, 163))), HERO, 0.5)


def lassi():
    # the glass (1d87c4f1) pasted onto the butter shop: a blurred 1774ff02 wall + the orange tablecloth
    bg = ld('1774ff02').crop((300, 60, 620, 240)).resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(28))
    bg = np.array(warm(bg)); bg[600:] = (214, 96, 52)             # tablecloth band (same orange as the interior tables)
    bg[600:612] = (176, 70, 40)
    g = ld('1d87c4f1').crop((40, 185, 222, 400))                  # cup + lid, no straw (the overlay draws it)
    k = 560 / g.height; g = g.resize((round(g.width * k), 560), Image.LANCZOS)
    ga = np.asarray(g).astype(np.int32)
    m = ((ga[..., 0] - ga[..., 2] > 55) & (ga[..., 0] > 140)).astype(np.uint8) * 255   # mango + the lid rim in its colour
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
    m = cv2.GaussianBlur(m, (0, 0), 2)[..., None] / 255.0
    x0, y0 = 560, 190
    reg = bg[y0:y0 + 560, x0:x0 + g.width].astype(np.float32)
    bg[y0:y0 + 560, x0:x0 + g.width] = (ga * m + reg * (1 - m)).astype(np.uint8)
    return Image.fromarray(bg)


def katsu_door():
    b = ld('da264766')
    b = flat(b, [(150, 205, 400, 240)], (246, 212, 30))
    b = flat(b, [(345, 285, 375, 420)], (238, 190, 20))
    b = flat(b, [(185, 285, 335, 421)], (70, 50, 36))
    return warm(box(b, (120, 190, 440, 370)))


def katsu_int():
    a = ld('0da0fa86')
    a = flat(a, [(207, 75, 305, 142)], (40, 44, 56))               # the TV's anime still -> dark screen (overlay: our show)
    a = flat(a, [(130, 110, 170, 165), (290, 125, 330, 170)], (120, 96, 70))   # portrait posters
    a = inpaint(a, [(170, 0, 205, 70)])                          # the red ribbon
    return warm(box(a, (0, 20, 516, 310)))


KHERO = None


def katsu_dish():
    a = ld('d612440e')
    a = inpaint(a, [(125, 250, 520, 330)])                       # the menu13 / Curry Rice caption
    return warm(box(a, (0, 0, 640, 360)))


def katsu_close():
    return lab_match(warm(box(ld('eb6e7a8f'), (0, 0, 640, 360))), KHERO, 0.3)


def katsu_spoon():
    a = ld('21dbf8f4')
    a = inpaint(a, [(500, 290, 588, 312)])                       # the oishi-des credit
    a = flat(a, [(20, 205, 95, 280)], (236, 240, 244))            # the milk brand (overlay: our carton text)
    return lab_match(warm(box(a, (0, 0, 588, 312))), KHERO, 0.3)


SHOTS = {
    'choice': street, 'butter-door': butter_door, 'butter-int': butter_int, 'butter-table': butter_table,
    'thali': thali, 'naan-lift': naan_lift, 'sauce': sauce, 'naan-dip': naan_dip, 'naan-feed': naan_feed, 'lassi': lassi,
    'katsu-door': katsu_door, 'katsu-int': katsu_int, 'katsu-dish': katsu_dish, 'katsu-close': katsu_close, 'katsu-spoon': katsu_spoon,
}
HERO = thali()
KHERO = katsu_dish()
for k, f in SHOTS.items():
    if ONLY and k not in ONLY: continue
    finish(f()).save(os.path.join(OUT, k + '.png'))
    print('prep', k, flush=True)
