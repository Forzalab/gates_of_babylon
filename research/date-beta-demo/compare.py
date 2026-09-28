"""compare.py: check the hand-authored date-beta scenes against Tony's CC0 reference images (palette + layout).
The references are NOT in git. usage: python3 research/date-beta-demo/compare.py <dir with the reference files>
palette: 8-colour median-cut palette of each image; for every ref colour, the CIE76 dE to our nearest colour
         (weighted by the ref colour's area). < 10 = same family, < 20 = recognisably related.
layout:  both images centre-cropped to 16:9, top 80% (the caption box lives below), 6x4 cells;
         mean dE between matching cells. Lower = the big colour masses sit in the same places."""
import sys, os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PAIRS = [('02-rooftop-live-clock.png', 'b231b884-image.jpg', 'rooftop vs pink tower + sakura'),
         ('02-rooftop-live-clock.png', '7e92a1a5-image.jpg', 'rooftop vs tower + doves'),
         ('03-train-window.png', '7a955d70-image.jpg', 'train vs train window, day'),
         ('04-naan-billboard.png', '217e8bc1-image.webp', 'billboard vs curry river')]

def lab(c):
    def lin(v):
        v /= 255
        return ((v + .055) / 1.055) ** 2.4 if v > .04045 else v / 12.92
    r, g, b = map(lin, c)
    x, y, z = (r * .4124 + g * .3576 + b * .1805) / .95047, r * .2126 + g * .7152 + b * .0722, (r * .0193 + g * .1192 + b * .9505) / 1.08883
    f = lambda t: t ** (1 / 3) if t > .008856 else 7.787 * t + 16 / 116
    return (116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z)))

def de(a, b):
    return sum((p - q) ** 2 for p, q in zip(lab(a), lab(b))) ** .5

def palette(im, n=8):
    q = im.convert('RGB').resize((320, 180)).quantize(n, method=Image.Quantize.MEDIANCUT)
    p, total = q.getpalette(), 320 * 180
    return [(cnt / total, tuple(p[i * 3:i * 3 + 3])) for cnt, i in sorted(q.getcolors(), reverse=True)]

def crop169(im, top=0.8):
    w, h = im.size
    if w / h > 16 / 9: nw = int(h * 16 / 9); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else: nh = int(w * 9 / 16); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    w, h = im.size
    return im.crop((0, 0, w, int(h * top)))

def grid(im):
    g = crop169(im.convert('RGB')).resize((6, 4), Image.Resampling.BOX)
    return [g.getpixel((x, y)) for y in range(4) for x in range(6)]

hexc = lambda c: '#%02x%02x%02x' % c
refdir = sys.argv[1] if len(sys.argv) > 1 else '.'
for ours, ref, label in PAIRS:
    a, b = Image.open(os.path.join(HERE, ours)), Image.open(os.path.join(refdir, ref))
    pa, pb = palette(crop169(a)), palette(b)
    pal = sum(wt * min(de(c, oc) for _, oc in pa) for wt, c in pb)
    lay = sum(de(p, q) for p, q in zip(grid(a), grid(b))) / 24
    print(f'{label}: palette dE {pal:.1f}, layout dE {lay:.1f}')
    print('   ref :', ' '.join(f'{hexc(c)}:{wt:.0%}' for wt, c in pb[:6]))
    print('   ours:', ' '.join(f'{hexc(c)}:{wt:.0%}' for wt, c in pa[:6]))
