# Quantise stage shots to 256 colours (PNG P mode). usage: python3 quant.py <dir> [file ...]
import sys, os
from PIL import Image
d = sys.argv[1]
for f in (sys.argv[2:] or sorted(os.listdir(d))):
    if not f.endswith('.png'): continue
    p = os.path.join(d, f)
    Image.open(p).convert('RGB').quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(p, optimize=True)
