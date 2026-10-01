# shrink the shots for git: 256-colour PNGs (OCR / checks run on the full-colour originals first)
import sys, glob
from PIL import Image
for f in glob.glob(sys.argv[1] + '/*.png'):
    Image.open(f).convert('RGB').quantize(256, method=Image.Quantize.MEDIANCUT).save(f, optimize=True)
