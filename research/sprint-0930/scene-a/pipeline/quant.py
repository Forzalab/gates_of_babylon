# Shrink review shots: 256-colour median-cut PNGs (same as the romance shots). usage: python3 quant.py <dir>
import sys, os
from PIL import Image
d = sys.argv[1]
for f in sorted(os.listdir(d)):
    if f.endswith('.png'):
        p = os.path.join(d, f)
        Image.open(p).convert('RGB').quantize(256, method=Image.Quantize.MEDIANCUT).save(p, optimize=True)
