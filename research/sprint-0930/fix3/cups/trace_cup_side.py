# fix3b: the SAME pink tea bowl as trace_cup.py (cups-ref1.jpg), traced from the SIDE (the ref's natural angle), same
# vtracer pipeline + 14-colour palette as r2-cup.svg. Hand-set silhouette mask on the ref pixels (pale glaze vs wood).
# usage: python3 trace_cup_side.py <ref1.jpg> <out.svg>
import sys, re, numpy as np, vtracer
from PIL import Image, ImageFilter, ImageDraw
ref, out = sys.argv[1:3]
im = Image.open(ref).convert('RGB').crop((115, 200, 205, 290)).resize((720, 720), Image.LANCZOS)
mk = Image.new('L', im.size, 0); d = ImageDraw.Draw(mk)
d.ellipse((100, 100, 636, 322), fill=255)
d.polygon([(100, 210), (636, 210), (630, 330), (600, 430), (540, 490), (525, 545), (512, 590), (420, 600), (320, 600), (228, 590), (215, 545), (190, 490), (130, 430), (98, 330)], fill=255)
mk = mk.filter(ImageFilter.GaussianBlur(2))
box = mk.point(lambda v: 255 if v > 128 else 0).getbbox()
rgba = im.convert('RGBA'); rgba.putalpha(mk.point(lambda v: 255 if v > 128 else 0))
dst = rgba.crop(box)
w = 300; dst = dst.resize((w, round(dst.height * w / dst.width)), Image.LANCZOS)
rgb = dst.convert('RGB').filter(ImageFilter.MedianFilter(3)).quantize(14, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
rgb.putalpha(dst.getchannel('A').point(lambda v: 255 if v > 128 else 0)); rgb.save('/tmp/cup-side-in.png')
vtracer.convert_image_to_svg_py('/tmp/cup-side-in.png', out, colormode='color', hierarchical='stacked', mode='spline', filter_speckle=4,
    color_precision=8, layer_difference=8, corner_threshold=60, length_threshold=4.0, max_iterations=10, splice_threshold=45, path_precision=1)
s = open(out).read(); s = re.sub(r'<\?xml[^>]*>\s*|<!--[^>]*-->\s*', '', s); open(out, 'w').write(s)
print(len(s)//1024, 'KB', rgb.size)
