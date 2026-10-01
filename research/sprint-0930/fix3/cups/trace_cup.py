# fix3: ONE tea-bowl traced (vtracer) from cups-ref1.jpg (the pink bowl of the pastel set), re-projected to the basket's
# top-down camera: the rim ellipse (aspect .41 in the shelf photo) is stretched to a near-circle, the wall is squashed
# (from above you see the rim, the inside and a sliver of the near wall), the foot is hidden. The three cups in the
# basket are the SAME sprite (matching). usage: python3 trace_cup.py <ref1.jpg> <out.svg>
import sys, re, numpy as np, vtracer
from PIL import Image, ImageFilter
from scipy import ndimage

ref, out = sys.argv[1:3]
im = Image.open(ref).convert('RGB').crop((110, 200, 290, 290))
im = im.resize((im.width * 6, im.height * 6), Image.LANCZOS).crop((90, 60, 530, 480))
a = np.asarray(im).astype(int)
# the colour of the pale glaze is too close to the wood / wall to key reliably, so the silhouette is a hand-set mask
# (rim ellipse + wall polygon, read off the 6x crop) on the ref pixels; the pixels themselves are the trace source
from PIL import ImageDraw
mk = Image.new('L', im.size, 0); d = ImageDraw.Draw(mk)
d.ellipse((14, 16, 416, 178), fill=255)
d.polygon([(14, 96), (416, 96), (414, 190), (384, 262), (318, 318), (128, 318), (46, 262), (16, 190)], fill=255)
m = np.asarray(mk) > 0
ys = np.where(m.any(1))[0]; y0, y1 = ys.min(), ys.max()
print('bowl rows', y0, y1)
rgba = np.dstack([a.astype(np.uint8), (m * 255).astype(np.uint8)])
src = Image.fromarray(rgba, 'RGBA')
# piecewise vertical re-projection: rim band -> tall, wall band -> short, foot dropped
rim_end = y0 + int((y1 - y0) * 0.50); wall_end = y1
top = src.crop((0, y0, src.width, rim_end)).resize((src.width, 330), Image.LANCZOS)
wall = src.crop((0, rim_end, src.width, wall_end)).resize((src.width, 90), Image.LANCZOS)
dst = Image.new('RGBA', (src.width, 420), (0, 0, 0, 0))
dst.paste(top, (0, 0)); dst.alpha_composite(wall, (0, 330))
# small: the traced SVG is drawn ~150 px wide in the scene
w = 300; dst = dst.resize((w, round(dst.height * w / dst.width)), Image.LANCZOS)
rgb = dst.convert('RGB').filter(ImageFilter.MedianFilter(3)).quantize(14, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
al = dst.getchannel('A').point(lambda v: 255 if v > 128 else 0)
rgb.putalpha(al); rgb.save('/tmp/cup-in.png')
vtracer.convert_image_to_svg_py('/tmp/cup-in.png', out, colormode='color', hierarchical='stacked', mode='spline', filter_speckle=4,
                                color_precision=8, layer_difference=8, corner_threshold=60, length_threshold=4.0,
                                max_iterations=10, splice_threshold=45, path_precision=1)
s = open(out).read()
s = re.sub(r'<\?xml[^>]*>\s*|<!--[^>]*-->\s*', '', s)
open(out, 'w').write(s)
print(len(s) // 1024, 'KB', rgb.size)
