# contact.py: contact sheet of every playthrough shot (results.json order). usage: python3 contact.py
import json, os
from PIL import Image, ImageDraw
D = os.path.dirname(os.path.abspath(__file__))
runs = json.load(open(os.path.join(D, 'results.json')))
TW, TH, LAB, COLS = 240, 135, 16, 14
rows = []
for r in runs:
    shots = [b for b in r['beats'] if b.get('shot')]
    for i in range(0, len(shots), COLS): rows.append((r['name'] if i == 0 else '', shots[i:i + COLS]))
W, H = 150 + COLS * TW, len(rows) * (TH + LAB)
sheet = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(sheet)
for y, (name, shots) in enumerate(rows):
    top = y * (TH + LAB)
    d.text((4, top + 4), name.replace('__', '\n'), fill='black')
    for x, b in enumerate(shots):
        im = Image.open(os.path.join(D, b['shot'])).convert('RGB'); im.thumbnail((TW - 4, TH))
        left = 150 + x * TW
        sheet.paste(im, (left, top))
        d.text((left, top + TH + 1), b['beat'][:30], fill='red' if b.get('fail') else 'black')
        if b.get('fail'): d.rectangle([left, top, left + im.width - 1, top + im.height - 1], outline='red', width=4)
sheet.save(os.path.join(D, 'contact-sheet.png'), optimize=True)
print(os.path.join(D, 'contact-sheet.png'), sheet.size)
