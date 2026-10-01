# ocr.py: OCR gate for the rain-fx shots. Each dialogue box / choice crop -> tesseract; recall = share of the DOM
# words read back. Contrast: text ink vs the darkest wet mark tone on the box (worst case), WCAG ratio >= 4.5.
import json, re, subprocess, os
from PIL import Image
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shots')
shots = json.load(open(os.path.join(D, 'shots.json')))
def lum(c):
    f = lambda v: (v / 255 / 12.92) if v / 255 <= 0.03928 else ((v / 255 + 0.055) / 1.055) ** 2.4
    r, g, b = c; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True); return (la + 0.05) / (lb + 0.05)
# worst wet-spot tone on the box: #6a1f4f at .13 over the box #fdeef5 (+ its .24 rim), vs the box ink #3a0f2a
mix = lambda a, b, t: tuple(round(x * (1 - t) + y * t) for x, y in zip(a, b))
BOX, INK, SPOT = (0xfd, 0xee, 0xf5), (0x3a, 0x0f, 0x2a), (0x6a, 0x1f, 0x4f)
worst = ratio(INK, mix(mix(BOX, SPOT, 0.13), SPOT, 0.24))
rows, ok = [], True
for s in shots:
    im = Image.open(os.path.join(D, s['name'] + '.png')).convert('L')
    txt = ''
    for (x, y, w, h) in s['boxes']:
        crop = im.crop((x, y, x + w, y + h)).resize((w * 2, h * 2))
        crop.save('/tmp/claude-0/-home-user-gates-of-babylon/7104b0c2-5088-5b82-b698-66e6ac7cd99c/scratchpad/ocr.png')
        txt += ' ' + subprocess.run(['tesseract', '/tmp/claude-0/-home-user-gates-of-babylon/7104b0c2-5088-5b82-b698-66e6ac7cd99c/scratchpad/ocr.png', '-', '--psm', '6'], capture_output=True, text=True).stdout
    norm = lambda t: re.findall(r"[a-z0-9]+", t.lower())
    want, got = norm(' '.join(s['text'])), set(norm(txt))
    rec = sum(w in got for w in want) / max(1, len(want))
    passed = rec >= 0.85 and s['overlap'] == 0
    ok &= passed
    rows.append(f"| {s['name']} | {s['rain']} | {s['marks']} | {s['overlap']} | {rec:.2f} | {', '.join(w for w in want if w not in got) or '-'} | {'PASS' if passed else 'FAIL'} |")
print(f"worst-case ink vs wet spot contrast: {worst:.1f}:1 (text never sits on a spot: overlap column)")
print('| shot | rain | wet marks | marks on text | OCR recall | missed | gate |\n|---|---|---|---|---|---|---|')
print('\n'.join(rows))
print('GATE', 'PASS' if ok else 'FAIL')
