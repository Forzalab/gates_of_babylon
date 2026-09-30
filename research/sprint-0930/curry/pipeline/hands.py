# NAAN-HANDS: grip silhouettes vtraced from Tony's hand refs (NAAN-HANDS-AUDIT.md), cleaned into flat CELS in Nanda's
# skin palette. Cel-over-vtrace: the SHAPE (finger count, joints, thumb opposition, the gap the food sits in) comes from
# the ref photo; the colour is 3 flat cel tones + one line, no photo pixels. The watermark band is lifted + its text
# inpainted + blurred before the cut, and the skin-colour gate drops any text pixel that is left.
# Out: <out>/hand-<k>.svg (viewBox = the cut box, ref px x UP) + hands.json {k: {w, h, pxcm, pinch, wrist, cuff}}.
# The refs are stock photos (watermarked): they are NOT committed; only the traced + recoloured silhouettes are.
# usage: python3 hands.py <naan-hands refs dir> <out dir>
import sys, os, re, json, tempfile
import numpy as np, cv2, vtracer

REF, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
UP = 4   # trace at 4x the ref (the refs are ~550 px)
# Nanda's hand = her SWEET palette (nanda.js body #ffffff / body2 #ffe3f1 / rim #d1177f) as skin: lit, base, shade + line
TONES = [(255, 246, 244), (253, 230, 228), (239, 184, 190)]
LINE = '#a0305e'

# per ref (ref px): the rough hand polygon (GrabCut's probable foreground), the watermark box, the finger width (px of
# one ~1.6 cm index finger = the ref's own px/cm), the pinch / contact point, the wrist (may sit outside the frame), and
# the cuff line (two points where the hand leaves the ref frame: the sleeve is drawn from there).
CFG = {
    'pinch': dict(src='01.jpg', poly=[(118, 0), (290, 0), (322, 58), (340, 80), (338, 112), (300, 124), (200, 136), (146, 142), (130, 108), (112, 40)],
                  wm=None, fw=22, pinch=(336, 100), wrist=(170, -40), cuff=[(112, 0), (292, 0)]),
    'hold':  dict(src='02.jpg', poly=[(382, 34), (470, 28), (547, 36), (547, 365), (428, 365), (404, 322), (392, 270), (378, 176), (384, 116)],
                  wm=(322, 216, 547, 270), fw=36, pinch=(392, 214), wrist=(600, 330), cuff=[(547, 36), (547, 365)]),
    'press': dict(src='03.jpg', poly=[(380, 162), (462, 160), (542, 176), (542, 322), (470, 320), (378, 308), (370, 282), (384, 236)],
                  wm=(322, 225, 542, 266), fw=24, pinch=(384, 296), wrist=(600, 250), cuff=[(542, 176), (542, 322)]),
    'scoop': dict(src='04.jpg', poly=[(260, 214), (298, 158), (364, 138), (364, 362), (330, 356), (306, 300), (300, 262), (262, 246)],
                  wm=(140, 340, 364, 392), fw=24, pinch=(264, 232), wrist=(420, 300), cuff=[(364, 138), (364, 362)]),
}


def clean_wm(im, box):
    """lift the watermark band (a grey overlay) back to its surroundings, inpaint its white text, blur the band."""
    if not box: return im
    x0, y0, x1, y1 = box
    out = im.astype(float)
    ref = np.concatenate([out[max(0, y0 - 6):y0 - 1, x0:x1].reshape(-1, 3), out[y1 + 1:y1 + 6, x0:x1].reshape(-1, 3)]).mean(0)
    k = ref / np.maximum(np.median(out[y0 + 2:y1 - 2, x0:x1].reshape(-1, 3), 0), 1)
    out[y0:y1, x0:x1] *= k
    out = np.clip(out, 0, 255).astype('uint8')
    hsv = cv2.cvtColor(out, cv2.COLOR_BGR2HSV)
    txt = np.zeros(out.shape[:2], 'uint8')
    sub = hsv[y0:y1, x0:x1]
    txt[y0:y1, x0:x1] = ((sub[..., 2] > 225) & (sub[..., 1] < 50)).astype('uint8') * 255
    txt = cv2.dilate(txt, np.ones((3, 3), 'uint8'), iterations=2)
    out = cv2.inpaint(out, txt, 5, cv2.INPAINT_TELEA)
    blur = cv2.GaussianBlur(out, (0, 0), 2.5)
    out[y0:y1, x0:x1] = blur[y0:y1, x0:x1]
    return out


def cut(k, c):
    im = clean_wm(cv2.imread(os.path.join(REF, c['src'])), c['wm'])
    H, W = im.shape[:2]
    pr = np.zeros((H, W), 'uint8'); cv2.fillPoly(pr, [np.array(c['poly'], np.int32)], 1)
    mask = np.where(cv2.dilate(pr, np.ones((25, 25), 'uint8')) > 0, cv2.GC_PR_BGD, cv2.GC_BGD).astype('uint8')
    mask[pr > 0] = cv2.GC_PR_FGD
    bg, fg = np.zeros((1, 65), float), np.zeros((1, 65), float)
    cv2.grabCut(im, mask, None, bg, fg, 8, cv2.GC_INIT_WITH_MASK)
    m = ((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)).astype('uint8')
    # skin only (drops the naan / curry that GrabCut left in), then keep the big pieces
    ycc = cv2.cvtColor(im, cv2.COLOR_BGR2YCrCb)
    skin = (ycc[..., 1] > 136) & (ycc[..., 1] < 180) & (ycc[..., 2] > 85) & (ycc[..., 2] < 130)
    skin = cv2.morphologyEx(skin.astype('uint8'), cv2.MORPH_CLOSE, np.ones((7, 7), 'uint8'))
    m &= skin
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), 'uint8'))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), 'uint8'))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    keep = [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 0.08 * m.sum()]
    m = np.isin(lab, keep).astype('uint8')
    inv = (1 - m).astype('uint8'); n, lab, st, _ = cv2.connectedComponentsWithStats(inv)
    for i in range(1, n):   # fill small holes (watermark remnants, specular spots) inside the hand
        if st[i, cv2.CC_STAT_AREA] < 400: m[lab == i] = 1
    return im, m


def trace(k, im, m, c):
    H, W = m.shape
    big = cv2.resize(m * 255, (W * UP, H * UP), interpolation=cv2.INTER_LINEAR)
    big = (cv2.GaussianBlur(big, (0, 0), UP * 1.6) > 127).astype('uint8')       # a smooth cel silhouette
    lum = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(float)
    lum = cv2.GaussianBlur(cv2.resize(lum, (W * UP, H * UP), interpolation=cv2.INTER_CUBIC), (0, 0), UP * 2.2)
    v = lum[big > 0]; lo, hi = np.percentile(v, 30), np.percentile(v, 80)
    tone = np.where(lum > hi, 0, np.where(lum > lo, 1, 2))                      # 3 flat cel tones from the ref's light
    img = np.zeros((H * UP, W * UP, 4), 'uint8')
    for i, col in enumerate(TONES): img[(tone == i) & (big > 0), :3] = col
    edge = big - cv2.erode(big, np.ones((5, 5), 'uint8'), iterations=2)          # the thin dark cel line
    img[edge > 0, :3] = tuple(int(LINE[j:j + 2], 16) for j in (1, 3, 5))
    img[..., 3] = big * 255
    ys, xs = np.where(big > 0); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    img = img[y0:y1, x0:x1]
    tmp = os.path.join(tempfile.gettempdir(), f'hand-{k}.png'); cv2.imwrite(tmp, cv2.cvtColor(img, cv2.COLOR_RGBA2BGRA))
    out = os.path.join(OUT, f'hand-{k}.svg')
    vtracer.convert_image_to_svg_py(tmp, out, colormode='color', hierarchical='stacked', mode='spline', filter_speckle=40,
                                    color_precision=6, layer_difference=10, corner_threshold=70, length_threshold=6.0,
                                    max_iterations=10, splice_threshold=45, path_precision=1)
    body = re.search(r'<svg[^>]*>(.*)</svg>', open(out).read(), re.S).group(1)
    body = re.sub(r'<\?xml[^>]*>|<!--[^>]*-->', '', body).strip()
    w, h = int(x1 - x0), int(y1 - y0)
    open(out, 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">{body}</svg>')
    loc = lambda p: [round(p[0] * UP - int(x0), 1), round(p[1] * UP - int(y0), 1)]
    print(k, w, h, len(body) // 1024, 'KB')
    return dict(w=w, h=h, pxcm=c['fw'] * UP / 1.6, pinch=loc(c['pinch']), wrist=loc(c['wrist']), cuff=[loc(p) for p in c['cuff']])


meta = {}
for k, c in CFG.items():
    im, m = cut(k, c)
    cv2.imwrite(os.path.join(tempfile.gettempdir(), f'hand-{k}-mask.png'), np.hstack([im, cv2.cvtColor(m * 255, cv2.COLOR_GRAY2BGR)]))
    meta[k] = trace(k, im, m, c)
json.dump(meta, open(os.path.join(OUT, 'hands.json'), 'w'), indent=1)
