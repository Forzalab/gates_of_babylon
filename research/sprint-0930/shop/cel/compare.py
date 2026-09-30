# Side-by-sides per shot (CURRENT before cel | NEW multiplane | Tony's ref) -> ../cel-compare/, + the 24-shot chain.png.
# usage: python3 compare.py <old shots dir> <refs dir>      (run from the repo root; refs are NOT committed)
import sys, os
from PIL import Image, ImageDraw

OLD, REF = sys.argv[1], sys.argv[2]
NEW, OUT = 'research/sprint-0930/shop/shots', 'research/sprint-0930/shop/cel-compare'
REFS = ['16', '16', '15', '15', '12', '12', '12', '11', '11', '11', '09', '09', '09', '10', '05', '05', '03', '04', '07', '06',
        '05', '08', '08', '16']
os.makedirs(OUT, exist_ok=True)
fs = sorted(f for f in os.listdir(NEW) if f.endswith('.png'))
for f, r in zip(fs, REFS):
    C = Image.new('RGB', (1920, 400), 'white'); d = ImageDraw.Draw(C)
    for i, src in enumerate([f'{OLD}/{f}', f'{NEW}/{f}']):
        C.paste(Image.open(src).convert('RGB').resize((640, 360)), (i * 640, 40))
    rf = next(x for x in os.listdir(REF) if x.startswith(r))
    im = Image.open(f'{REF}/{rf}').convert('RGB'); im.thumbnail((640, 360)); C.paste(im, (1280, 40))
    for i, t in enumerate(['CURRENT (before cel)', 'NEW multiplane (vtrace + cels)', 'REF ' + rf]):
        d.text((i * 640 + 10, 12), t, fill='black')
    C.save(f'{OUT}/{f}'); print(f)
C = Image.new('RGB', (6 * 320, ((len(fs) + 5) // 6) * 180))
for i, f in enumerate(fs):
    C.paste(Image.open(f'{NEW}/{f}').convert('RGB').resize((320, 180)), ((i % 6) * 320, (i // 6) * 180))
C.quantize(256).save('research/sprint-0930/shop/chain.png'); print('chain', len(fs))
