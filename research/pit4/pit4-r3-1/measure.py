# measure.py: WARNING cap (pink rows only, navy shadow excluded) and modal+sign height, from the reduced-motion stills.
# usage: python3 measure.py shots/h1-gate-1440-still.png x0 y0 x1 y1(warn box) modal_bottom
import sys
from PIL import Image
f, x0, y0, x1, y1, mb = sys.argv[1], *map(int, sys.argv[2:7])
im = Image.open(f).convert('RGB'); p = im.load(); W, H = im.size
pink = lambda c: c[0] > 200 and c[1] < 90 and c[2] > 90
ys = [y for y in range(y0, y1) if sum(1 for x in range(x0, x1) if pink(p[x, y])) > 30]
run = [ys[0]]
for y in ys[1:]:
    if y - run[-1] > 3: break
    run.append(y)
tube = lambda c: c[0] > 240 and c[1] > 200 and c[2] > 235
top = next(y for y in range(int(H * .12), y0) if sum(1 for x in range(int(W * .3), int(W * .7)) if tube(p[x, y])) > 3)
print(f'cap {run[0]}-{run[-1]} = {(run[-1] - run[0]) / H:.3f} H; sign top {top}, modal+sign {(mb - top) / H:.3f} H')
