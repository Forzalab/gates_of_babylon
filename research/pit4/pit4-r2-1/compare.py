# compare.py: side-by-sides of the f3 gate (1440x810) against Tony's three mockups (scaled to 1440x810), plus the
# rubric numbers for each. Writes shots/sbs-<mockup>.png and prints a table. Mockups are read from the scratchpad refs
# (never committed). usage: python3 compare.py <refs_dir>
import sys, os
from PIL import Image, ImageDraw
from measure import measure

REFS = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(HERE, 'shots')
MOCK = {'M1 ee486fef': 'ee486fef-image.png', 'M2 c20f7340': 'c20f7340-image.png', 'M3 8c0d1049': '8c0d1049-image.png'}
ours = Image.open(os.path.join(S, 'gate-1440.png')).convert('RGB')
for name, f in MOCK.items():
    m = Image.open(os.path.join(REFS, f)).convert('RGB').resize((1440, 810), Image.LANCZOS)
    sheet = Image.new('RGB', (2900, 870), '#111')
    sheet.paste(m, (0, 60)); sheet.paste(ours, (1460, 60))
    d = ImageDraw.Draw(sheet)
    d.text((10, 15), f'{name} (mockup, scaled)', fill='#fff', font_size=34)
    d.text((1470, 15), 'f3 gate 1440x810 (t=3.5s)', fill='#fff', font_size=34)
    # guide lines at the rubric's modal targets: x .23/.77, WARNING cap band
    for ox in (0, 1460):
        for fx in (.23, .77):
            d.line([(ox + 1440 * fx, 60), (ox + 1440 * fx, 870)], fill='#ffe51f', width=1)
    sheet.save(os.path.join(S, f'sbs-{f[:8]}.png'))
print('ours', measure(os.path.join(S, 'gate-1440.png'), [619, 253, 1096, 359]))
