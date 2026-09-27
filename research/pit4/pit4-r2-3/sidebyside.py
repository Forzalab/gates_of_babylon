"""sidebyside.py: each mockup next to our g3 shot at the same height, plus a 3-up with the continue screen."""
import sys
from PIL import Image, ImageDraw
D = sys.argv[1]; R = sys.argv[2]
def fit(p, h):
    im = Image.open(p).convert('RGB'); return im.resize((round(im.width * h / im.height), h))
H = 540
ours = fit(f'{D}/shots/g3-gate-1440-still.png', H)
for ref in ['8c0d1049', 'c20f7340', 'ee486fef']:
    m = fit(f'{R}/{ref}-image.png', H)
    out = Image.new('RGB', (m.width + ours.width + 12, H + 30), '#111')
    out.paste(m, (0, 30)); out.paste(ours, (m.width + 12, 30))
    d = ImageDraw.Draw(out); d.text((6, 8), f'mockup {ref}', fill='white'); d.text((m.width + 18, 8), 'g3 1440 (reduced-motion still)', fill='white')
    out.save(f'{D}/sbs-{ref}.png')
nx = fit(f'{D}/shots/g3-next-1440-still.png', H)
out = Image.new('RGB', (ours.width + nx.width + 12, H), '#111'); out.paste(ours, (0, 0)); out.paste(nx, (ours.width + 12, 0))
out.save(f'{D}/sbs-gate-next.png')
