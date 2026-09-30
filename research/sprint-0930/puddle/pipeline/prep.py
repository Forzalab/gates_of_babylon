# Puddle beat (v2-rain 2) back plate: composite the refs' textures into one 1920x1080 top-down source for vtracer.
#   asphalt = ref 03 (the blue dusk ground, its fallen leaves), gradient-mapped to the rain-dusk slate
#   water   = ref 01 (Shinkai: the upside-down sky, the pole + wires), gradient-mapped to the dusk sky, a warm lamp break
#   puddle  = a hand-set noisy blob (top edge under the shoes, asphalt margins + islands like ref 01), a lit wet rim
# People: none in the used crops (ref 03's figure reflection sits under the puddle mask). Refs are NOT committed.
# usage: python3 prep.py <refs dir> <out png> [<mask png>]      then: python3 ../../romance/pipeline/trace.py <dir> <out>
import sys
import numpy as np
from PIL import Image, ImageFilter

W, H = 1920, 1080
REF, OUT = sys.argv[1], sys.argv[2]
MASK = sys.argv[3] if len(sys.argv) > 3 else None
rng = np.random.default_rng(7)


def cover(im, fy=0.5, fx=0.5):
    w, h = im.size
    if w / h > W / H:
        nw = round(h * W / H); x = round((w - nw) * fx); im = im.crop((x, 0, x + nw, h))
    else:
        nh = round(w * H / W); y = round((h - nh) * fy); im = im.crop((0, y, w, y + nh))
    return im.resize((W, H), Image.LANCZOS)


def gmap(im, stops):
    """Gradient map by luminance: stops = [(t, '#rrggbb'), ...] (t in 0..1)."""
    a = np.asarray(im.convert('L'), np.float32) / 255
    ts = np.array([t for t, _ in stops]); cs = np.array([[int(c[i:i + 2], 16) for i in (1, 3, 5)] for _, c in stops], np.float32)
    out = np.stack([np.interp(a, ts, cs[:, k]) for k in range(3)], -1)
    return out


def fbm(scale, oct=4, seed=0):
    r = np.random.default_rng(seed); acc = np.zeros((H, W), np.float32); amp = 1.0; tot = 0
    for o in range(oct):
        s = max(2, int(scale / 2 ** o))
        g = r.random((H // s + 2, W // s + 2)).astype(np.float32)
        acc += amp * np.asarray(Image.fromarray((g * 255).astype(np.uint8)).resize((W + 2 * s, H + 2 * s), Image.BICUBIC), np.float32)[s:s + H, s:s + W] / 255
        tot += amp; amp *= 0.5
    return acc / tot


# ---- asphalt (ref 03): slate-violet wet ground; its orange leaves kept as muted rust (they are floaters on the rim)
a3 = cover(Image.open(f'{REF}/03.jpg').convert('RGB'), fy=0.85).filter(ImageFilter.GaussianBlur(1.2))
asph = gmap(a3, [(0, '#121622'), (0.25, '#1e2434'), (0.5, '#30384e'), (0.8, '#4a5470'), (1, '#7a84a0')])
src = np.asarray(a3, np.float32)
leaf = ((src[..., 0] - src[..., 2]) > 38) & (src[..., 0] > 70)
asph[leaf] = asph[leaf] * 0.35 + np.array([150, 78, 78], np.float32) * 0.65
# grit: fine speckle so the ground reads as asphalt, not ice
grit = rng.random((H, W)) > 0.985
asph[grit] = asph[grit] * 0.5 + np.array([120, 132, 160], np.float32) * 0.5

# ---- water (ref 01, flipped left-right so the pole leans out of her side): the sky upside down, graded to rain-dusk
a1 = cover(Image.open(f'{REF}/01.jpg').convert('RGB').transpose(Image.FLIP_LEFT_RIGHT), fy=0.5)
wat = gmap(a1, [(0, '#121828'), (0.25, '#28314c'), (0.5, '#4b5878'), (0.72, '#7a84a6'), (0.9, '#aeaccb'), (1, '#dcd3e3')])
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
# the lamp break: a warm peach glow low-left in the sky (the street lamp side), and a pink wash toward the bottom
warm = np.exp(-(((xx - 520) / 420) ** 2 + ((yy - 760) / 300) ** 2))[..., None]
wat = wat * (1 - 0.5 * warm) + np.array([238, 186, 150], np.float32) * 0.5 * warm
pink = np.clip((yy - 300) / 780, 0, 1)[..., None] * 0.22
wat = wat * (1 - pink) + np.array([196, 150, 186], np.float32) * pink

# ---- the puddle: a noisy blob (top edge under the shoes, margins left/right/bottom-left, 3 islands)
n = fbm(260, 5, 3)
d = ((xx - 960) / 920) ** 2 + ((yy - 600) / 700) ** 2
field = 1.0 - d + (n - 0.5) * 0.9
n2 = fbm(40, 3, 11)
for cx, cy, r in [(1560, 330, 80), (300, 880, 110), (1640, 960, 70), (560, 1040, 60)]:
    field -= 1.1 * np.exp(-(((xx - cx) / r) ** 2 + ((yy - cy) / (r * 0.7)) ** 2)) * (0.6 + n2)
field += (n2 - 0.5) * 0.18  # small-scale crumbs on the edge (ref 01's broken shoreline)
m = (field > 0.08).astype(np.float32)
mimg = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(9))
m = np.asarray(mimg, np.float32) / 255
if MASK: mimg.save(MASK)
# the wet rim: a lit band just inside the edge (the sky catches the meniscus), a dark lip just outside
inner = np.asarray(mimg.filter(ImageFilter.MinFilter(5)), np.float32) / 255
outer = np.asarray(mimg.filter(ImageFilter.MaxFilter(11)), np.float32) / 255
rim_in = ((m - inner) * np.clip(fbm(90, 3, 5) * 1.6 - 0.35, 0, 1))[..., None]; rim_out = (outer - m)[..., None]

img = asph * (1 - m[..., None]) + wat * m[..., None]
img = img * (1 - rim_in * 0.6) + np.array([214, 214, 232], np.float32) * rim_in * 0.6
img = img * (1 - rim_out * 0.5) + np.array([8, 10, 18], np.float32) * rim_out * 0.5
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(OUT)
print('wrote', OUT, 'water', round(float(m.mean()) * 100), '%')
