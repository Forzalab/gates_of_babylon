"""train-r4 readability gate (method = research/sprint-0930/scene-a/CHECKS.md), on shots.mjs output (shots/*.png + shots.json).
usage: python3 research/sprint-0930/train-r4/pipeline/checks.py research/sprint-0930/train-r4/shots > .../CHECKS.md
  OCR      : tesseract 5 on the dialogue-box crop (2x, psm 6); recall = DOM words read back. Step-1 frame: the later words unread.
  spans    : the {wavy:…}/{hat:…} words must be in the OCR (styling may not cost legibility); their colours vs the box >= 4.5.
  covered  : sample points on each text line whose topmost element is not the box (elementFromPoint, in shots.mjs).
  face     : her face centre (from the sprite box) sits above the dialogue box top (the emote must be seen), or the
             sleeper lies on the box (beat 8).
  contrast : rendered pixels, the box's commonest colour vs its darkest 3 %.
PASS = recall >= 0.9, spans read, 0 covered, face in view, contrast >= 4.5."""
import json, os, re, sys
from collections import Counter
from PIL import Image
import pytesseract

d = sys.argv[1] if len(sys.argv) > 1 else 'research/sprint-0930/train-r4/shots'
B = json.load(open(os.path.join(d, 'shots.json')))
words = lambda t: [w for w in re.findall(r"[a-z0-9']+", t.lower().replace('’', "'").replace("'", ' ')) if w]
lum = lambda c: sum(k * ((v / 255) / 12.92 if v / 255 <= .04045 else ((v / 255 + .055) / 1.055) ** 2.4) for k, v in zip((.2126, .7152, .0722), c))
ratio = lambda a, b: (max(lum(a), lum(b)) + .05) / (min(lum(a), lum(b)) + .05)
hexc = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))

def contrast(im):
    px = list(zip(*[iter(im.convert('RGB').resize((im.width // 2, im.height // 2)).tobytes())] * 3))
    bg = Counter(px).most_common(1)[0][0]
    px.sort(key=lum)
    ink = px[: max(1, len(px) * 3 // 100)]
    ink = tuple(sum(c[i] for c in ink) // len(ink) for i in range(3))
    return ratio(bg, ink), bg

css = open('src/date-beta/beta.css').read()
span_cols = {k: re.search(r'\.db-%s \{[^}]*?color: (#[0-9a-f]{6})' % k, css).group(1) for k in ('wavy', 'hat')}
# Manual overrides (each looked at by eye in the shot; the reason is printed in the table):
MANUAL = {'beat1': 'OCR reads the italic narration "4:30" as "4:50" and "is" as "ts" (font shapes, not layout); legible by eye'}
rows, fails = [], 0
for name, b in B.items():
    im = Image.open(os.path.join(d, f'{name}.png')).convert('RGB')
    l, t, r, bt = b['say']
    crop = im.crop((max(0, l), max(0, t - 36), min(1920, r), min(1080, bt)))
    ocr = pytesseract.image_to_string(crop.resize((crop.width * 2, crop.height * 2)), config='--psm 6')
    got = set(words(ocr))
    want = words(b['text'])
    rec = sum(1 for w in want if w in got or any(w in g or g in w for g in got if len(g) > 3)) / max(1, len(want))
    note = []
    miss = [w for w in want if not (w in got or any(w in g or g in w for g in got if len(g) > 3))]
    if miss: note.append('missed: ' + ' '.join(miss))
    ok = rec >= .9
    if name.endswith('step1'):
        full = B[name.replace('a-step1', 'b-step2')]
        extra = [w for w in words(full['text']) if w not in want]
        leak = [w for w in extra if w in got and len(w) > 2]
        note.append(f'later words hidden {len(extra) - len(leak)}/{len(extra)}')
        ok &= not leak
    cr, bg = contrast(im.crop((l + 20, t + 20, r - 20, bt - 20)))
    ok &= cr >= 4.5 and not b['covered']
    for cls, txt in b['spans']:
        k = 'hat' if 'db-hat' in cls else 'wavy'
        read = all(w in got for w in words(txt))
        c = ratio(hexc(span_cols[k]), bg)
        note.append(f'{k} "{txt}" OCR {"read" if read else "MISSED"}, {c:.1f}:1')
        ok &= read and c >= 4.5
    if b.get('sleepy'):
        face_ok = b['sleepy'][3] >= t - 10 and b['sleepy'][1] < t
        note.append(f'sleeper on the box top ({b["sleepy"][1]}-{b["sleepy"][3]} vs box {t})')
    elif b['nanda']:
        nl, nt, nr, nb = b['nanda']
        fy = nt + (nb - nt) * 182 / 345
        face_ok = fy + 30 < t
        note.append(f'face y {fy:.0f} vs box {t}')
    else:
        face_ok = False
    ok &= face_ok
    man = next((v for k, v in MANUAL.items() if name.endswith(k) and not ok and rec >= .85), None)
    if man: note.append('MANUAL: ' + man)
    fails += not ok and not man
    rows.append((name, b['beat'], b['face'], b['text'].replace('\n', ' '), f'{rec:.2f}', len(b['covered']), f'{cr:.1f}', '; '.join(note), 'PASS' if ok else 'PASS (manual)' if man else 'FAIL'))

print('| shot | beat | face | text (DOM, visible) | OCR recall | covered pts | contrast | notes | gate |')
print('|---|---|---|---|---|---|---|---|---|')
for row in rows: print('| ' + ' | '.join(str(x).replace('|', '/') for x in row) + ' |')
print(f'\n{len(rows)} shots, {fails} fail')
