# measure.py: Pillow numbers for f2 vs mockup c20f7340 (rubric table) + side-by-sides.
# usage: python3 research/pit4/r1-2/measure.py '<metrics json from shots.mjs gate 1440>'
import json, sys, os
from PIL import Image, ImageChops, ImageStat

HERE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(HERE, 'shots')
REFS = '/tmp/claude-0/-home-user-gates-of-babylon/63c52f04-baa1-549c-a2ad-a7fd8a659ba1/scratchpad/refs'
W, H = 1440, 810
me = Image.open(os.path.join(SHOTS, 'f2-gate-1440.png')).convert('RGB')
mock = Image.open(os.path.join(REFS, 'c20f7340-image.png')).convert('RGB').resize((W, H), Image.LANCZOS)
m = json.loads(sys.argv[1]) if len(sys.argv) > 1 else None

hexs = lambda c: '#%02x%02x%02x' % tuple(int(v) for v in c)
def mean(img, box): return ImageStat.Stat(img.crop(box)).mean
def pink(p): r, g, b = p; return r > 190 and g < 90 and b > 90
def header_h(img):
    x = 8
    for y in range(4, 200):
        r, g, b = img.getpixel((x, y))
        if b > 150: return y
def cap(img, box):
    x0, y0, x1, y1 = box; rows = []
    for y in range(y0, y1):
        n = sum(1 for x in range(x0, x1, 2) if pink(img.getpixel((x, y))))
        rows.append(n > 3)
    # first contiguous run of ink rows
    s = rows.index(True); e = s
    while e < len(rows) and rows[e]: e += 1
    return e - s
def ink_mean(img, box):
    x0, y0, x1, y1 = box; px = [img.getpixel((x, y)) for y in range(y0, y1, 2) for x in range(x0, x1, 2)]
    px = [p for p in px if pink(p)]
    return [sum(c[i] for c in px) / len(px) for i in range(3)]

out = []
row = lambda k, a, b, t: out.append(f'| {k} | {a} | {b} | {t} |')
row('top bar hex', hexs(mean(mock, (720, 10, 800, 20))), hexs(mean(me, (680, 5, 800, 12))), '#001b62 ±15')
row('grid bg hex', hexs(mean(mock, (2, 300, 14, 500))), hexs(mean(me, (4, 300, 20, 500))), '#003ec5 ±15')
mh, eh = header_h(mock), header_h(me)
row('header h / H', f'{mh / H:.3f}', f'{eh / H:.3f}', '.085-.10')
mc = cap(mock, (int(.54 * W), int(.28 * H), int(.73 * W), int(.40 * H)))
if m:
    wx0, wy0, wx1, wy1 = m['warn']
    ec = cap(me, (wx0, wy0, wx1, wy0 + 110))
    row('WARNING cap / H', f'{mc / H:.3f}', f'{ec / H:.3f}', '.11-.13')
    row('headline pink', hexs(ink_mean(mock, (int(.54 * W), int(.29 * H), int(.76 * W), int(.45 * H)))), hexs(ink_mean(me, (wx0, wy0, wx1, wy1))), '#f01a88 ±20')
    x0, y0, x1, y1 = m['modal']; sy0 = m['sign'][1]
    row('modal x-span', '.22-.78', f'{x0 / W:.3f}-{x1 / W:.3f} (w {(x1 - x0) / W:.3f})', 'w .52-.58, centred')
    row('modal y-span incl sign', '.14-.85 (h .71)', f'{sy0 / H:.3f}-{y1 / H:.3f} (h {(y1 - sy0) / H:.3f})', 'h .55-.70')
    t0, t11 = m['tile0'], m['tile11']
    row('tile w/W, h/H, grid bottom', '.225, .24, .90', f'{(t0[2] - t0[0]) / W:.3f}, {(t0[3] - t0[1]) / H:.3f}, {t11[3] / H:.3f}', '≈.225 × .24, ≥.90')
    sx0, sx1 = m['sign'][0], m['sign'][2]
    ov = (m['modal'][1] - sy0) / (m['sign'][3] - sy0)
    row('sign overlap of own h', '≈.38', f'{1 - ov:.2f}', '.30-.40')
# C5 balance: mean luminance halves
L = me.convert('L'); lh, rh = ImageStat.Stat(L.crop((0, 0, W // 2, H))).mean[0], ImageStat.Stat(L.crop((W // 2, 0, W, H))).mean[0]
row('L/R luminance', '-', f'{lh:.1f} / {rh:.1f} ({abs(lh - rh) / max(lh, rh) * 100:.1f}%)', '≤12%')
if m and m['chat']:
    cx0, cy0, cx1, cy1 = m['chat']
    row('chat mean colour', '-', hexs(mean(me, (int(m['modal'][2]) + 4, cy0, cx1, cy1))), 'within ΔRGB 40 of a token')
    clean = Image.open(os.path.join(SHOTS, 'f2-gate-1440-clean.png')).convert('RGB')
    still = Image.open(os.path.join(SHOTS, 'f2-gate-1440-still.png')).convert('RGB')
    bx = m['btns']; wx = m['warn']
    tot = cov = 0
    for box in (bx, (wx[0], wx[1], wx[2], bx[1])):
        d = ImageChops.difference(still.crop(box), clean.crop(box)).convert('L').point(lambda v: 255 if v > 24 else 0)
        cov += ImageStat.Stat(d).sum[0] / 255; tot += (box[2] - box[0]) * (box[3] - box[1])
    row('surprise over text/buttons', '-', f'{cov / tot * 100:.2f}%', '≤2%')
print('| metric | mockup c20f7340 | f2 @1440 | target |\n|---|---|---|---|')
print('\n'.join(out))

# side-by-side + blend
sbs = Image.new('RGB', (W * 2 + 20, H), 'black'); sbs.paste(mock, (0, 0)); sbs.paste(me, (W + 20, 0)); sbs.save(os.path.join(SHOTS, 'sbs-c20f7340.png'))
Image.blend(mock, me, .5).save(os.path.join(SHOTS, 'blend-c20f7340.png'))
for ref in ('ee486fef', '8c0d1049'):
    r = Image.open(os.path.join(REFS, f'{ref}-image.png')).convert('RGB').resize((W, H), Image.LANCZOS)
    s = Image.new('RGB', (W * 2 + 20, H), 'black'); s.paste(r, (0, 0)); s.paste(me, (W + 20, 0)); s.save(os.path.join(SHOTS, f'sbs-{ref}.png'))
