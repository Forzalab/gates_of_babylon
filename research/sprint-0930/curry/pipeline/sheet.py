# Quantise the beat shots to 256 colours (shots/) and build the chain sheets (chain-butter.png, chain-katsu.png):
# every beat of one path in play order, labelled, so the whole visit reads street -> door -> inside -> table -> dish
# -> eating -> exit at a glance. usage: python3 sheet.py <raw shots dir> <curry research dir>
import sys, os
from PIL import Image, ImageDraw, ImageFont

RAW, OUT = sys.argv[1], sys.argv[2]
os.makedirs(os.path.join(OUT, 'shots'), exist_ok=True)
q = lambda im: im.convert('RGB').quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
names = sorted(f for f in os.listdir(RAW) if f.endswith('.png') and f.split('-')[0] in ('butter', 'katsu', 'alone'))
for f in names: q(Image.open(os.path.join(RAW, f))).save(os.path.join(OUT, 'shots', f), optimize=True)
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
except OSError: font = ImageFont.load_default()
for chain, pre in (('butter', ('butter',)), ('katsu', ('katsu', 'alone'))):
    fs = [f for f in names if f.split('-')[0] in pre]
    cols, w, h = 4, 640, 360
    rows = (len(fs) + cols - 1) // cols
    sh = Image.new('RGB', (cols * w, rows * (h + 34)), '#ffffff')
    d = ImageDraw.Draw(sh)
    for i, f in enumerate(fs):
        x, y = (i % cols) * w, (i // cols) * (h + 34)
        sh.paste(Image.open(os.path.join(RAW, f)).convert('RGB').resize((w - 8, h - 4), Image.LANCZOS), (x + 4, y + 32))
        d.text((x + 8, y + 6), f"{i + 1}. {f[:-4]}", fill='#3a2e2c', font=font)
    q(sh).save(os.path.join(OUT, f'chain-{chain}.png'), optimize=True)
    print(chain, len(fs), 'shots')
