"""Scene A readability gate (CHECKS.md): OCR + occlusion + contrast on every beat shot (beats.mjs -> beats/*.png + boxes.json).
usage: python3 research/sprint-0930/scene-a/pipeline/checks.py research/sprint-0930/scene-a/beats
  OCR      : tesseract 5 (pytesseract) on the dialogue box crop, 2x upscale, psm 6. recall = the words the DOM shows
             that OCR reads back (lowercased letters/digits; OR tokens and ♡ dropped). step 1 frames also check that
             the not-yet-shown words are NOT readable (the reveal really hides them).
  covered  : text-line sample points whose topmost painted element is not the dialogue box (DOM elementFromPoint).
  contrast : rendered pixels: box background = the most common colour in the box, ink = the darkest 3 % (or the
             lightest 3 % on the dark OR box); WCAG ratio between them.
PASS = recall >= 0.9, hidden words unread, covered = 0, contrast >= 4.5."""
import json, os, re, sys
from collections import Counter
from PIL import Image
import pytesseract

d = sys.argv[1] if len(sys.argv) > 1 else 'research/sprint-0930/scene-a/beats'
B = json.load(open(os.path.join(d, 'boxes.json')))
words = lambda t: [w for w in re.findall(r"[a-z0-9']+", t.lower().replace('’', "'")) if w not in ('or',)]
lum = lambda c: sum(k * ((v / 255) / 12.92 if v / 255 <= .04045 else ((v / 255 + .055) / 1.055) ** 2.4) for k, v in zip((.2126, .7152, .0722), c))
ratio = lambda a, b: (max(lum(a), lum(b)) + .05) / (min(lum(a), lum(b)) + .05)

def contrast(im):
    px = list(zip(*[iter(im.convert('RGB').resize((im.width // 2, im.height // 2)).tobytes())] * 3))
    bg = Counter(px).most_common(1)[0][0]
    dark = lum(bg) < .2
    px.sort(key=lum, reverse=dark)
    ink = px[: max(1, len(px) * 3 // 100)]
    ink = tuple(sum(c[i] for c in ink) // len(ink) for i in range(3))
    return ratio(bg, ink), bg, ink

rows, fails = [], 0
for name, b in B.items():
    im = Image.open(os.path.join(d, f'{name}.png')).convert('RGB')
    if b['stamp']:
        l, t, r, bt = b['stamp']
        o = pytesseract.image_to_string(im.crop((l, t, r, bt)).resize(((r - l) * 2, (bt - t) * 2)), config='--psm 7')
        ok = 'school rooftop' in o.lower() and '12' in o and not b['say']
        rows.append((name, b['beat'], 'stamp: ' + o.strip(), '1.00' if ok else '0', '-', 0, '-', 'PASS' if ok else 'FAIL'))
        fails += not ok
        continue
    if not b['say'] or not b['text']:
        rows.append((name, b['beat'], '(no dialogue: art-only beat)', '-', '-', 0, '-', 'n/a'))
        continue
    l, t, r, bt = b['say']
    crop = im.crop((max(0, l), max(0, t - 36), min(1920, r), min(1080, bt)))
    ocr = pytesseract.image_to_string(crop.resize((crop.width * 2, crop.height * 2)), config='--psm 6')
    got, want = set(words(ocr)), [w for w in words(b['text']) if w not in ('smile',)]
    rec = sum(1 for w in want if w in got or any(w in g or g in w for g in got if len(g) > 3)) / max(1, len(want))
    hidden = ''
    if b['step'] == '1':
        full = B.get(re.sub(r'^(\d+)a-', r'\1b-', name).replace('step1', 'step2'))
        extra = [w for w in words(full['text']) if w not in words(b['text'])] if full else []
        leak = [w for w in extra if w in got and len(w) > 2]
        hidden = f"hidden {len(extra) - len(leak)}/{len(extra)}"
    else:
        leak = []
    cr, bg, ink = contrast(im.crop((l + 20, t + 20, r - 20, bt - 20)))
    ok = rec >= .9 and not leak and not b['covered'] and cr >= 4.5
    fails += not ok
    rows.append((name, b['beat'], b['text'], f'{rec:.2f}', hidden or '-', len(b['covered']), f'{cr:.1f}', 'PASS' if ok else 'FAIL'))

print('| shot | beat | text (DOM, visible) | OCR recall | step-1 hidden words | covered pts | contrast | gate |')
print('|---|---|---|---|---|---|---|---|')
for row in rows: print('| ' + ' | '.join(str(x).replace('|', '/') for x in row) + ' |')
print(f'\n{len(rows)} shots, {fails} fail')
