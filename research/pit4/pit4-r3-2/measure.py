# Pillow check of the h2 gate stills: WARNING pink-row cap height / H (inside the .warn box from boxes.json),
# lowest Dejting tube pixel vs WARNING top (clearance), modal+sign span, L/R luminance.
# usage: python3 measure.py   (after shots.mjs wrote shots/*.png and boxes.json)
import json, os
import numpy as np
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__))
boxes = json.load(open(os.path.join(D, 'boxes.json')))
for f, b in boxes.items():
    im = np.asarray(Image.open(os.path.join(D, 'shots', f)).convert('RGB')).astype(int)
    H, W = im.shape[:2]
    x0, y0, x1, y1 = [int(v) for v in b['warn']]
    c = im[y0:y1 + 10, x0:x1]
    # solid headline pink (#f01a88 +-), navy shadow and white stroke excluded
    pink = (abs(c[..., 0] - 238) < 24) & (c[..., 1] < 70) & (abs(c[..., 2] - 136) < 40)
    rows = np.where(pink.sum(1) > 6)[0]
    top, bot = rows.min() + y0, rows.max() + y0
    # Dejting tube core: near-white pink pixels between the plate and WARNING, over the headline's x-span
    nx0, ny0, nx1, ny1 = [int(v) for v in b['neon']]
    z = im[ny0:top, x0:x1]
    # the tube's own #ff7fe0 edge stroke (the panel is near-white, so white alone can't find the glyph)
    tube = (z[..., 0] > 235) & (abs(z[..., 1] - 135) < 40) & (z[..., 2] > 200)
    tr = np.where(tube.sum(1) > 2)[0]
    low = ny0 + tr.max() if len(tr) else None
    g = np.asarray(Image.open(os.path.join(D, 'shots', f)).convert('L'), float)
    print(f, 'cap/H', round((bot - top) / H, 3),
          'span', round((b['modal'][3] - b['neon'][1]) / H, 3), 'L/R', round(g[:, :W // 2].mean() / g[:, W // 2:].mean(), 3))
