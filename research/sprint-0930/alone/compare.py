# before | after side by side for every shot in before/ + after/ (same names): compare/<name>.jpg + compare/sheet.jpg
# usage: python3 compare.py   (from anywhere)
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
B, A, OUT = (os.path.join(HERE, d) for d in ('before', 'after', 'compare'))
os.makedirs(OUT, exist_ok=True)
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
except OSError: font = ImageFont.load_default()
W, H, LAB = 960, 540, 34
names = sorted(f for f in os.listdir(B) if f.endswith('.png') and os.path.exists(os.path.join(A, f)))
pairs = []
for f in names:
    im = Image.new('RGB', (W * 2 + 12, H + LAB), '#ffffff')
    d = ImageDraw.Draw(im)
    for i, (tag, src) in enumerate((('BEFORE', B), ('AFTER', A))):
        im.paste(Image.open(os.path.join(src, f)).convert('RGB').resize((W, H)), (i * (W + 12), LAB))
        d.text((i * (W + 12) + 8, 6), f'{tag}  {f}', fill='#000000', font=font)
    p = os.path.join(OUT, f.replace('.png', '.jpg'))
    im.save(p, quality=86)
    pairs.append(im)
sheet = Image.new('RGB', (pairs[0].width, sum(p.height for p in pairs)), '#ffffff')
y = 0
for p in pairs:
    sheet.paste(p, (0, y)); y += p.height
sheet.resize((sheet.width // 2, sheet.height // 2)).save(os.path.join(OUT, 'sheet.jpg'), quality=82)
print(len(pairs), 'pairs')
