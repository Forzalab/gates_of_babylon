# Side-by-sides per shot: REF (thumb, watermark strip cropped) | TRACE 1 | HAND | TRACE 2 (final) -> compare/<id>.png
# usage: python3 compare.py <refs dir> <trace1 png dir> <hand png dir> <trace2 png dir>   (run from the repo root)
import sys, os
from PIL import Image, ImageDraw

REF, T1, HAND, T2 = sys.argv[1:5]
OUT = 'research/sprint-0930/town/compare'
PAIRS = {'street': ['04.jpg', '02.jpg'], 'crossing': ['05.jpg', '01.jpg'], 'board': ['07.jpg', '06.jpg']}
CUT = {'07.jpg': 60}  # the alamy strip at the bottom of ref 07 stays out of the repo
os.makedirs(OUT, exist_ok=True)
for k, refs in PAIRS.items():
    Cv = Image.new('RGB', (4 * 480, 310), 'white'); d = ImageDraw.Draw(Cv)
    x = 0
    for r in refs:
        im = Image.open(f'{REF}/{r}').convert('RGB'); im = im.crop((0, 0, im.width, im.height - CUT.get(r, 0)))
        im.thumbnail((480 // len(refs), 270)); Cv.paste(im, (x, 36)); x += im.width
    for i, src in enumerate([T1, HAND, T2]):
        Cv.paste(Image.open(f'{src}/{k}.png').convert('RGB').resize((480, 270)), ((i + 1) * 480, 36))
    for i, t in enumerate(['REF ' + ' + '.join(refs), 'TRACE 1 (auto)', 'HAND (fixed)', 'TRACE 2 (final, in game)']):
        d.text((i * 480 + 8, 12), t, fill='black')
    Cv.save(f'{OUT}/{k}.png'); print(k)
