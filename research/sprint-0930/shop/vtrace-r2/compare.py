# Side-by-sides (old hand-drawn shot @957d696 | new vtrace shot | Tony's ref) -> compare/, and the 24-shot chain.png.
# usage: python3 compare.py <old shots dir> <refs dir>      (run from the repo root; refs are NOT committed)
import sys, os
from PIL import Image, ImageDraw

OLD, REF = sys.argv[1], sys.argv[2]
NEW, OUT = 'research/sprint-0930/shop/shots', 'research/sprint-0930/shop/vtrace-r2/compare'
PAIRS = {'03-beat3': ['15.jpg', '13.jpg'], '04-game-r1-shelf': ['12.jpg'], '08-game-r2-wrong-ocpd': ['11.jpg'],
         '11-game-r3-wrong-bpd': ['09.jpg', '10.jpg'], '14-game-end-card': ['05.gif'], '16-beat5': ['03.gif']}
os.makedirs(OUT, exist_ok=True)
for shot, refs in PAIRS.items():
    C = Image.new('RGB', (1920, 400), 'white'); d = ImageDraw.Draw(C)
    for i, f in enumerate([f'{OLD}/{shot}.png', f'{NEW}/{shot}.png']):
        C.paste(Image.open(f).convert('RGB').resize((640, 360)), (i * 640, 40))
    x = 1280
    for r in refs:
        im = Image.open(f'{REF}/{r}').convert('RGB'); im.thumbnail((640 // len(refs), 360))
        C.paste(im, (x, 40)); x += im.width
    for i, t in enumerate(['OLD hand-drawn (957d696)', 'NEW vtrace r2', 'REF ' + ' + '.join(refs)]):
        d.text((i * 640 + 10, 12), t, fill='black')
    C.save(f'{OUT}/{shot}.png'); print(shot)
fs = sorted(f for f in os.listdir(NEW) if f.endswith('.png'))
C = Image.new('RGB', (6 * 320, ((len(fs) + 5) // 6) * 180))
for i, f in enumerate(fs):
    C.paste(Image.open(f'{NEW}/{f}').convert('RGB').resize((320, 180)), ((i % 6) * 320, (i // 6) * 180))
C.quantize(256).save('research/sprint-0930/shop/chain.png'); print('chain', len(fs))
