# OCR readability gate: tesseract on the dialogue box of every v2-town beat shot; word recall vs the pack text.
# usage: python3 ocr.py <shots dir>     (run from the repo root)
import sys, os, re, json, subprocess
from PIL import Image

SHOTS = sys.argv[1]
beats = json.load(open('src/date-beta/packs/town.json'))['scenes'][0]['beats']
words = lambda t: re.findall(r"[a-z0-9']+", t.lower().replace('akiba · 2:45 pm.', ''))
for i, b in enumerate(beats):
    im = Image.open(f'{SHOTS}/{i:02d}-beat{i}.png').convert('L').crop((250, 740, 1680, 1060))
    im = im.resize((im.width * 2, im.height * 2))
    tmp = f'/tmp/town-ocr-{i}.png'; im.save(tmp)
    got = subprocess.run(['tesseract', tmp, '-', '--psm', '6'], capture_output=True, text=True).stdout
    want = words(b['text']); seen = set(words(got))
    r = sum(w in seen for w in want) / len(want)
    print(f'| {i} | {r:.0%} | {" ".join(got.split())[:90]} |')
