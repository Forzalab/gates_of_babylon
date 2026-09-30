# One round shot: hand render (left) | its vtrace (right) per id, stacked, 256 colours.
# usage: python3 rounds.py <png dir> <traced png dir> <out.png> id [id ...]
import sys
from PIL import Image, ImageDraw, ImageFont
P, T, OUT, *ids = sys.argv[1:]
w, h = 960, 540
sh = Image.new('RGB', (2 * w, len(ids) * (h + 30)), '#ffffff')
d = ImageDraw.Draw(sh)
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
except OSError: font = ImageFont.load_default()
for i, k in enumerate(ids):
    y = i * (h + 30)
    for j, (dd, tag) in enumerate(((P, 'hand'), (T, 'vtraced'))):
        sh.paste(Image.open(f'{dd}/{k}.png').convert('RGB').resize((w, h), Image.LANCZOS), (j * w, y + 30))
        d.text((j * w + 8, y + 5), f'{k} ({tag})', fill='#3a2e2c', font=font)
sh.quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(OUT, optimize=True)
