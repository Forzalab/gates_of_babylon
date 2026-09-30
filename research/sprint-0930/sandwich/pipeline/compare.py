# before | SANDWICH | ref, one PNG per shot. The town refs are Tony's stock photos (scratchpad, not committed, cropped as
# in back.py); the other shots have no ref in the session, so their third panel is the BACK layer alone (the pure trace).
# usage: python3 compare.py <before dir> <sandwich dir> <town refs dir> <trace png dir> <out dir>
import sys, os
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(__file__))
from back import SHOTS as TOWN

B, S, REF, TR, OUT = sys.argv[1:6]
os.makedirs(OUT, exist_ok=True)
REFOF = {'town-0': 'street', 'town-1': 'street', 'town-2': 'crossing', 'town-3': 'board', 'town-4': 'board'}
W, H = 960, 540
for f in sorted(os.listdir(S)):
    k = f[:-4]
    if k in REFOF:
        rf, crop, _, _ = TOWN[REFOF[k]]
        ref, lab = Image.open(os.path.join(REF, rf)).convert('RGB').crop(crop), f'REF {rf}'
    else:
        ref, lab = Image.open(os.path.join(TR, k + '.png')).convert('RGB'), 'BACK (pure trace; no ref in session)'
    c = Image.new('RGB', (W * 3 + 20, H + 30), 'white'); d = ImageDraw.Draw(c)
    for i, (im, t) in enumerate([(Image.open(os.path.join(B, f)), 'BEFORE'), (Image.open(os.path.join(S, f)), 'SANDWICH'), (ref, lab)]):
        c.paste(im.convert('RGB').resize((W, H)), (i * (W + 10), 30)); d.text((i * (W + 10) + 6, 8), t, fill='black')
    c.save(os.path.join(OUT, k + '.png')); print(k)
