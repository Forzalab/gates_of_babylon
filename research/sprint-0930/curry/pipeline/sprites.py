# CURRY r3: food SPRITES vtraced from Tony's refs (R3-AUDIT.md). Each food is cut out of its ref (a colour or a geometric
# mask), re-graded to the shop palette, upscaled, and vtraced (trace.py style: spline, stacked, ~48 colours).
# One SVG per sprite; draw.py nests the SAME sprite in every shot (the same naan, the same bowl, the same plate).
# usage: python3 sprites.py <refs dir> <out dir>
import sys, os, re, json, tempfile
import numpy as np, vtracer
from PIL import Image, ImageFilter
from scipy import ndimage as nd

REF, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
ref = lambda n: np.array(Image.open(os.path.join(REF, n)).convert('RGB')).astype(float)


def grad(lum, stops):
    """map luminance 0..1 through colour stops [(t, (r,g,b))]."""
    ts = np.array([t for t, _ in stops]); cs = np.array([c for _, c in stops], float)
    return np.stack([np.interp(lum, ts, cs[:, k]) for k in range(3)], -1)


def trace(name, rgb, mask, width, speckle=4, ld=6, med=0, cp=6):
    """rgb HxWx3 float, mask HxW bool -> OUT/name.svg (viewBox = the cut's own box at `width` px wide)."""
    ys, xs = np.where(mask); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rgb, mask = rgb[y0:y1, x0:x1], mask[y0:y1, x0:x1]
    h = round((y1 - y0) * width / (x1 - x0))
    im = Image.fromarray(np.clip(rgb, 0, 255).astype('uint8')).resize((width, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
    if med: im = im.filter(ImageFilter.MedianFilter(med))
    im = im.quantize(48, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')   # ~48 colours
    a = Image.fromarray((mask * 255).astype('uint8')).resize((width, h), Image.LANCZOS).filter(ImageFilter.GaussianBlur(width / 180)).point(lambda v: 255 if v > 127 else 0)   # a smooth silhouette, no stair steps
    im.putalpha(a)
    tmp = os.path.join(tempfile.gettempdir(), f'spr-{name}.png'); im.save(tmp)
    out = os.path.join(OUT, name + '.svg')
    vtracer.convert_image_to_svg_py(tmp, out, colormode='color', hierarchical='stacked', mode='spline', filter_speckle=speckle,
                                    color_precision=cp, layer_difference=ld, corner_threshold=60,
                                    length_threshold=4.0, max_iterations=10, splice_threshold=45, path_precision=1)
    s = open(out).read()
    body = re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1)
    body = re.sub(r'<\?xml[^>]*>|<!--[^>]*-->', '', body).strip()
    open(out, 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {h}">{body}</svg>')
    print(name, width, h, len(body) // 1024, 'KB')
    return [width, h]


lumof = lambda im: (0.3 * im[..., 0] + 0.59 * im[..., 1] + 0.11 * im[..., 2]) / 255
meta = {}
# ---- the NAAN: images(179) (the Japan-shop teardrop that droops off the tray) ------------------------------------------
im = ref('images(179).jpg'); R, G, B = im[..., 0], im[..., 1], im[..., 2]
m = (R > 175) & (R - B > 40) & (G > 140)
m = nd.binary_opening(m, iterations=2); lab, _ = nd.label(m); m = lab == lab[250, 300]
m = nd.binary_closing(m, iterations=6); m = nd.binary_fill_holes(m); m = nd.binary_opening(m, iterations=3)
yy, xx = np.mgrid[:im.shape[0], :im.shape[1]]
m &= ~((yy < 34) & (xx > 440))                                             # the grey cup behind the tip
m &= (xx < 470) | (((xx - 470) / 112) ** 2 + ((yy - 128) / 104) ** 2 < 1)  # round the fat end the frame cut off
lum = lumof(im)
butter = (lum > 0.86) & (np.abs(xx - 408) < 40) & (np.abs(yy - 152) < 34)
lum2 = nd.gaussian_filter(lum, 0.7)
col = grad(lum2, [(0.30, (92, 44, 16)), (0.52, (170, 96, 40)), (0.66, (222, 170, 102)), (0.78, (244, 214, 160)), (0.9, (252, 240, 214)), (1, (255, 250, 236))])
col[butter] = grad(lum[butter], [(0.8, (240, 196, 70)), (1, (255, 236, 150))])
edge = m & ~nd.binary_erosion(m, iterations=3)
col[edge] = (90, 54, 32)                                                    # the thin dark cel line
meta['naan'] = trace('naan', col, m, 480, 6, 8, 0, 5)

# ---- the KATORI: images(181), the orange cup (geometric cut: rim ellipse + tapered body) ------------------------------
im = ref('images(181).jpg'); yy, xx = np.mgrid[:im.shape[0], :im.shape[1]]
cx, cy, rx, ry = 375, 100, 71, 37
rim = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 < 1
t = (yy - cy) / (176 - cy)
body = (yy >= cy) & (yy < 176) & (np.abs(xx - cx) < rx - 20 * t)
bot = ((xx - cx) / 51) ** 2 + ((yy - 174) / 9) ** 2 < 1
km = rim | body | bot
lum = lumof(im)
food = ((xx - 378) / 60) ** 2 + ((yy - 115) / 22) ** 2 < 1
for k, stops in {'katori-butter': [(0.2, (130, 40, 8)), (0.45, (206, 84, 22)), (0.65, (236, 122, 44)), (0.9, (255, 196, 130))],
                 'katori-saag': [(0.2, (40, 64, 18)), (0.45, (72, 118, 36)), (0.65, (110, 150, 56)), (0.9, (190, 214, 120))],
                 'katori-rice': [(0.2, (200, 194, 178)), (0.5, (234, 230, 218)), (0.8, (250, 248, 240)), (1, (255, 255, 255))]}.items():
    c = im.copy()
    c[food] = grad(lum[food], stops)
    ed = km & ~nd.binary_erosion(km, iterations=2); c[ed] = (90, 96, 106)
    meta[k] = trace(k, c, km, 260, 6, 12, 0, 5)

# ---- the KATSU PLATE: images(183) (plate, roux left, fanned cutlet, rice right) + its fukujinzuke dish ----------------
from PIL import ImageEnhance
im = np.array(ImageEnhance.Contrast(ImageEnhance.Color(Image.open(os.path.join(REF, 'images(183).jpg')).convert('RGB')).enhance(1.1)).enhance(1.3)).astype(float)
from PIL import ImageDraw
cm_ = Image.new('L', (im.shape[1], im.shape[0])); ImageDraw.Draw(cm_).polygon([(165, 110), (215, 88), (300, 118), (362, 165), (394, 215), (388, 266), (338, 268), (280, 215), (200, 172), (165, 140)], fill=255)
cut = np.array(cm_) > 0                                                     # the cutlet (images 183): golden crumb
roux = (lumof(im) < 0.8) & ~cut
im[roux] *= (0.84, 0.74, 0.66)                                              # the roux reads BROWN (Japanese roux), the rice stays white
im[cut & (lumof(im) < 0.85)] *= (1.08, 0.98, 0.78)                          # the crumb stays golden, apart from the roux
yy, xx = np.mgrid[:im.shape[0], :im.shape[1]]
pm = ((xx - 272) / 226) ** 2 + ((yy - 245) / 138) ** 2 < 1
c = im.copy(); ed = pm & ~nd.binary_erosion(pm, iterations=2); c[ed] = (122, 132, 148)
meta['katsu-plate'] = trace('katsu-plate', c, pm, 520, 12, 16, 3, 6)
from PIL import ImageDraw
pm_ = Image.new('L', (im.shape[1], im.shape[0])); ImageDraw.Draw(pm_).polygon([(262, 88), (300, 33), (510, 70), (520, 85), (495, 128), (290, 112)], fill=255)
fm = np.array(pm_) > 0
c = im.copy()
meta['fukujinzuke'] = trace('fukujinzuke', c, fm, 210, 6, 12, 0, 5)

# ---- the BACKGROUNDS (Tony's cel-over-vtrace technique: the bg is a pure vtrace of the ref; food/hands sit on it).
# The empty table in each ref is mirror-tiled to a 960x540 (0.5x) frame, the window light (upper left) graded in,
# then traced: NAND HOUSE = images(181)'s wood table, OR OR CURRY = images(183)'s pale plank counter.
from PIL import ImageOps
def tiled(n, box, up, W=960, H=540):
    p = Image.open(os.path.join(REF, n)).convert('RGB').crop(box); p = p.resize((int(p.width * up), int(p.height * up)), Image.LANCZOS)
    out = Image.new('RGB', (W, H))
    for j in range(0, H, p.height):
        for i in range(0, W, p.width):
            q = ImageOps.mirror(p) if (i // p.width) % 2 else p
            out.paste(ImageOps.flip(q) if (j // p.height) % 2 else q, (i, j))
    a = np.array(out).astype(float); yy, xx = np.mgrid[:H, :W]
    light = np.clip(1.12 - 0.22 * (xx / W + yy / H), 0.85, 1.12)[..., None]   # the window, upper left
    return a * light
for k, (n, box, up, mul, ld) in {'bg-nand': ('images(181).jpg', (0, 0, 700, 62), 1.6, (0.92, 0.8, 0.66), 3),
                                 'bg-oror': ('images(183).jpg', (360, 0, 588, 26), 2.6, (1.0, 0.96, 0.9), 6)}.items():
    a = tiled(n, box, up) * mul
    if k == 'bg-nand': a = (a - a.mean((0, 1))) * 1.8 + a.mean((0, 1))   # the 181 grain is faint: lift it so the trace keeps it
    meta[k] = trace(k, a, np.ones(a.shape[:2], bool), 960, 16, ld, 3, 6 if k == 'bg-nand' else 5)
json.dump(meta, open(os.path.join(OUT, 'sprites.json'), 'w'))
