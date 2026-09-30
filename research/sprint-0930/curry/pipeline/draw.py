# CURRY r2: every food / hand / face shot, HAND-DRAWN as flat-cel SVG (base + one shade + one highlight, a thin dark line),
# after Tony's anime refs (REF-NOTES-R2.md). No ref pixels are used, and nothing is vtraced: the flat SVG is crisper
# than a trace (vt.py stays for photo backgrounds only). Written straight to public/date-beta/trace/curry/<id>.svg.
#
# PHYSICS (SHOP-PHYSICS-CRITIQUE.md, applied to curry):
# - ONE light for the whole visit: the 3:00 PM sun comes through the shop window at the upper LEFT. Highlights sit on
#   top-left edges, shades on bottom-right edges, and every cast shadow falls to the lower RIGHT (+dx, +dy).
# - ONE vanishing point per drawing (cloth weave / counter planks radiate from VP). Close shots are CROPS of the hero
#   drawing (a scale/translate of the SAME group), so the dish is the same sprite in every shot.
# - Hands have 5 fingers, joined to a wrist and a sleeve that runs off the frame edge. Food touches fingers or a surface.
# - No text is drawn here (the shop signs are JSX, below the y=140 HUD band). Faces + hands stay above y=740 (the box).
# usage: python3 draw.py <out dir>
import sys, os, random, math

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
LINE = '#5a3620'
SH = '#3a1606'          # the cast-shadow ink (multiplied by opacity)
SDX, SDY = 26, 34       # every cast shadow: down-right of its object (window light from the upper left)


def svg(body, defs=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080"><defs>{defs}</defs>{body}</svg>'


def blobpath(r, x, y, k, sx=1.8, sy=0.8, n=10):
    pts = [(x + math.cos(i / n * math.tau) * k * sx * (0.7 + r.random() * 0.5), y + math.sin(i / n * math.tau) * k * sy * (0.7 + r.random() * 0.5)) for i in range(n)]
    m = [((pts[i][0] + pts[(i + 1) % n][0]) / 2, (pts[i][1] + pts[(i + 1) % n][1]) / 2) for i in range(n)]
    return f'M{m[-1][0]:.0f} {m[-1][1]:.0f}' + ''.join(f'Q{pts[i][0]:.0f} {pts[i][1]:.0f} {m[i][0]:.0f} {m[i][1]:.0f}' for i in range(n)) + 'z'


def bumpy(pts, step=24, bulge=9, seed=1):
    """a scalloped (crumb) outline through a clockwise polygon: small outward bumps along every edge."""
    r = random.Random(seed)
    d = f'M{pts[0][0]:.1f} {pts[0][1]:.1f}'
    for i in range(len(pts)):
        (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % len(pts)]
        L = math.hypot(x1 - x0, y1 - y0); n = max(1, round(L / step))
        nx, ny = (y1 - y0) / L, -(x1 - x0) / L       # outward normal for a clockwise (screen) polygon
        for j in range(n):
            a, b = j / n, (j + 1) / n
            mx, my = x0 + (x1 - x0) * (a + b) / 2, y0 + (y1 - y0) * (a + b) / 2
            k = bulge * (0.6 + r.random() * 0.8)
            d += f'Q{mx - nx * k:.1f} {my - ny * k:.1f} {x0 + (x1 - x0) * b:.1f} {y0 + (y1 - y0) * b:.1f}'
    return d + 'z'


# ---------------------------------------------------------------- surfaces (one VP each)
def cloth(vp=(960, -1500)):
    """the NAND HOUSE orange tablecloth (the same cloth as the two-shot + the lassi): a weave radiating from one VP."""
    s = '<rect width="1920" height="1080" fill="#d6603a"/>'
    for i in range(-14, 30):
        x = i * 90
        s += f'<path d="M{vp[0]} {vp[1]}L{x} 1080" stroke="#c9552f" stroke-width="3" opacity=".55"/>'
    for y in (140, 330, 560, 830):
        s += f'<path d="M0 {y}H1920" stroke="#e57446" stroke-width="3" opacity=".45"/>'
    s += '<path d="M0 0H900L0 520z" fill="#fff0d0" opacity=".14"/>'   # the window light pool, upper left
    return s


def counter(vp=(960, -1700)):
    """OR OR CURRY's pale wood counter: planks radiating from one VP, warm grain, the window pool upper left."""
    r = random.Random(4)
    s = '<rect width="1920" height="1080" fill="#d9ad74"/>'
    for i in range(-10, 22):
        x = i * 150
        s += f'<path d="M{vp[0]} {vp[1]}L{x} 1080" stroke="#b98a52" stroke-width="5"/>'
    for _ in range(40):
        x = r.randint(-100, 1900); y = r.randint(0, 1060); t = (x - vp[0]) / (1080 - vp[1])
        s += f'<path d="M{x} {y}l{t * 160:.0f} 160" stroke="{r.choice(["#e6bf88", "#c69a60"])}" stroke-width="{r.randint(3, 7)}" stroke-linecap="round" opacity=".7"/>'
    s += '<path d="M0 0H900L0 520z" fill="#fff6e0" opacity=".16"/>'
    return s


def shadow(d, o=.32, blur=False):
    return f'<path d="{d}" transform="translate({SDX} {SDY})" fill="{SH}" opacity="{o}"/>'


# ---------------------------------------------------------------- the butter thali (hero) + its parts
def katori(cx, cy, rx, ry, food, food2, top, extra=''):
    h = ry * 1.25
    return f'''<g>
  <ellipse cx="{cx + SDX}" cy="{cy + h + 14}" rx="{rx * 0.98}" ry="{ry * 0.8}" fill="#5a606a" opacity=".38"/>
  <path d="M{cx - rx} {cy}V{cy + h * 0.75}C{cx - rx} {cy + h + ry * 0.45} {cx + rx} {cy + h + ry * 0.45} {cx + rx} {cy + h * 0.75}V{cy}z" fill="#b9bfc8" stroke="#6f7680" stroke-width="3"/>
  <path d="M{cx + rx * 0.35} {cy + ry * 0.9}V{cy + h + ry * 0.2}C{cx + rx * 0.7} {cy + h + ry * 0.05} {cx + rx} {cy + h} {cx + rx} {cy + h * 0.75}V{cy}z" fill="#8e96a1"/>
  <path d="M{cx - rx * 0.7} {cy + ry * 0.6}V{cy + h + ry * 0.1}" stroke="#f4f7fb" stroke-width="{rx * 0.09:.0f}" stroke-linecap="round" opacity=".9"/>
  <ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#dfe3e8" stroke="#6f7680" stroke-width="3"/>
  <ellipse cx="{cx}" cy="{cy + ry * 0.06}" rx="{rx * 0.86}" ry="{ry * 0.78}" fill="{food}"/>
  <path d="M{cx - rx * 0.86} {cy + ry * 0.06}A{rx * 0.86} {ry * 0.78} 0 0 1 {cx + rx * 0.86} {cy + ry * 0.06}A{rx * 0.86} {ry * 0.5} 0 0 0 {cx - rx * 0.86} {cy + ry * 0.06}z" fill="{food2}"/>
  <ellipse cx="{cx - rx * 0.3}" cy="{cy + ry * 0.25}" rx="{rx * 0.22}" ry="{ry * 0.16}" fill="{top}" opacity=".9"/>
  {extra}
</g>'''


def naan(seed, d, cid, bubbles, spots, butter=None, base='#f1cf8a', lit='#fbe5b4', rim='#c98640'):
    r = random.Random(seed)
    s = f'<clipPath id="{cid}"><path d="{d}"/></clipPath>'
    s += f'<path d="{d}" transform="translate(6 22)" fill="{rim}" stroke="{LINE}" stroke-width="4"/>'
    s += f'<path d="{d}" fill="{base}" stroke="{LINE}" stroke-width="4" stroke-linejoin="round"/>'
    g = f'<g clip-path="url(#{cid})">'
    for (x, y, rx, ry) in bubbles:
        g += f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{lit}" stroke="#c98a48" stroke-width="3"/>'
        g += f'<path d="{blobpath(r, x + rx * 0.15, y - ry * 0.3, rx * 0.32, 1.4, 0.6)}" fill="#c07632"/>'
        g += f'<path d="{blobpath(r, x + rx * 0.2, y - ry * 0.35, rx * 0.16, 1.4, 0.6)}" fill="#6a3210"/>'
    for (x, y, k) in spots:
        g += f'<path d="{blobpath(r, x, y, k)}" fill="#b86c30"/><path d="{blobpath(r, x + k * 0.2, y, k * 0.5)}" fill="#5e2c0e"/>'
    g += f'<path d="{d}" fill="none" stroke="#fff6de" stroke-width="10" opacity=".55" transform="translate(-4 -6)"/>'
    s += g + '</g>'
    if butter:
        bx, by, bw = butter
        s += f'''<ellipse cx="{bx + 8}" cy="{by + bw * 0.38}" rx="{bw * 1.05}" ry="{bw * 0.5}" fill="#ffd24a" opacity=".75"/>
<g transform="translate({bx} {by}) rotate(-8)">
  <rect x="{-bw * 0.5}" y="{-bw * 0.2}" width="{bw}" height="{bw * 0.5}" rx="{bw * 0.12}" fill="#f2c64a" stroke="{LINE}" stroke-width="3"/>
  <rect x="{-bw * 0.5}" y="{-bw * 0.5}" width="{bw}" height="{bw * 0.5}" rx="{bw * 0.12}" fill="#ffe98c" stroke="{LINE}" stroke-width="3"/>
  <rect x="{-bw * 0.38}" y="{-bw * 0.42}" width="{bw * 0.34}" height="{bw * 0.1}" rx="{bw * 0.05}" fill="#fffbe6"/>
</g>'''
    return s


NAAN_D = 'M520 730C640 610 900 560 1200 520C1460 486 1720 470 1790 600C1840 700 1720 800 1480 812C1180 828 820 800 600 770C600 770 540 760 520 730z'
RAG = 'M676 600L692 648L724 662L712 700L752 716L740 752L786 772L778 830'
TORN = RAG.replace('M', 'M2000 300L676 300L', 1) + 'L2000 1000z'   # the notch she tore off the tip


def butter_curry(cx, cy, rx, ry):
    """the butter chicken surface detail (chicken chunks, cream swirl, cilantro): shared by the thali + every close-up."""
    r = random.Random(11)
    s = ''
    for (dx, dy, k) in [(-0.42, 0.05, 1), (0.1, -0.12, 1.1), (0.36, 0.2, .9), (-0.1, 0.34, .8), (0.5, -0.05, .7)]:
        x, y = cx + dx * rx, cy + dy * ry
        s += f'<path d="{blobpath(r, x, y, rx * 0.12 * k, 1.3, 0.75)}" fill="#c24a14" stroke="#8a2e08" stroke-width="2"/>'
        s += f'<ellipse cx="{x - rx * 0.04 * k:.0f}" cy="{y - ry * 0.06 * k:.0f}" rx="{rx * 0.05 * k:.0f}" ry="{ry * 0.04 * k:.0f}" fill="#ff9a50"/>'
    s += f'<path d="M{cx - rx * 0.5} {cy + ry * 0.1}c{rx * .2} {-ry * .25} {rx * .45} {-ry * .1} {rx * .55} {ry * .08}" stroke="#fff3dc" stroke-width="{max(4, rx * .05):.0f}" fill="none" stroke-linecap="round"/>'
    for (dx, dy) in [(-0.25, -0.2), (0.0, -0.3), (0.25, -0.15), (-0.05, 0.22), (0.3, 0.3)]:
        s += f'<path d="{blobpath(r, cx + dx * rx, cy + dy * ry, rx * 0.028, 1.2, 1)}" fill="#3e7a22"/>'
    s += f'<ellipse cx="{cx - rx * 0.28}" cy="{cy - ry * 0.18}" rx="{rx * 0.16}" ry="{ry * 0.07}" fill="#fff3d8" opacity=".75"/>'  # the sheen, upper left
    return s


def thali_group(torn=False):
    """the whole steel thali in hero coordinates (no background). Crops use it with a transform."""
    b = f'<ellipse cx="{870 + SDX}" cy="{540 + SDY + 16}" rx="728" ry="366" fill="{SH}" opacity=".36"/>'
    b += '<ellipse cx="870" cy="540" rx="720" ry="360" fill="#c3c8cf" stroke="#636a74" stroke-width="4"/>'
    b += '<path d="M150 540A720 360 0 0 0 1590 540A720 330 0 0 1 150 540z" fill="#9aa1ab"/>'
    b += '<ellipse cx="870" cy="528" rx="650" ry="318" fill="#e4e8ec" stroke="#8a919b" stroke-width="3"/>'
    b += '<path d="M220 528A650 318 0 0 1 1520 528A650 280 0 0 0 220 528z" fill="#c9ced5"/>'   # inner wall shade (upper left: away from the light)
    b += '<path d="M330 760C520 850 900 870 1180 840" stroke="#ffffff" stroke-width="14" fill="none" stroke-linecap="round" opacity=".85"/>'
    b += katori(560, 320, 170, 66, '#e2641c', '#b8420e', '#ffb070', butter_curry(560, 326, 146, 52))
    b += katori(900, 250, 160, 60, '#4f7d26', '#355a18', '#8fbf4a', '<circle cx="930" cy="262" r="12" fill="#fff3dc"/>')
    b += katori(1230, 300, 150, 58, '#e8b43a', '#c38a1e', '#ffe08a', '<circle cx="1200" cy="296" r="6" fill="#b8420e"/><circle cx="1260" cy="310" r="6" fill="#b8420e"/>')
    r = random.Random(9)
    b += '<path d="M252 574C262 484 402 444 492 464C582 484 612 544 592 604Z" fill="#3a1606" opacity=".2"/>'
    b += '<path d="M230 560C240 470 380 430 470 450C560 470 590 530 570 590C500 630 300 630 230 560z" fill="#fbf7ec" stroke="#8a7a5a" stroke-width="3"/>'
    b += '<path d="M230 560C300 620 500 630 570 590C530 565 380 575 230 560z" fill="#e3dac4"/>'
    b += ''.join(f'<path d="M{x} {y}l{r.choice([-9, 9])} 4" stroke="#d8ceb4" stroke-width="5" stroke-linecap="round"/>' for x, y in [(r.randint(270, 540), r.randint(470, 590)) for _ in range(40)])
    b += '<path d="M1356 432L1626 342" stroke="#3a1606" stroke-width="22" stroke-linecap="round" opacity=".18"/>'
    b += '<path d="M1330 420L1600 330" stroke="#8e96a1" stroke-width="22" stroke-linecap="round"/><path d="M1330 420L1600 330" stroke="#e8ecf0" stroke-width="10" stroke-linecap="round"/>'
    b += '<ellipse cx="1300" cy="432" rx="58" ry="32" transform="rotate(-18 1300 432)" fill="#c9ced5" stroke="#636a74" stroke-width="3"/><ellipse cx="1290" cy="428" rx="22" ry="10" transform="rotate(-18 1290 428)" fill="#ffffff"/>'
    b += '<path d="M1580 520C1700 500 1800 540 1810 640C1820 760 1760 860 1640 900L1560 820z" fill="#3a1606" opacity=".35"/>'
    bub = [(720, 650, 80, 34), (900, 700, 70, 30), (980, 620, 90, 36), (1150, 660, 100, 40), (1180, 760, 70, 26),
           (1340, 600, 90, 40), (1420, 720, 110, 42), (1600, 600, 90, 44), (1650, 730, 80, 34), (820, 760, 60, 20)]
    sp = [(640, 700, 12), (600, 730, 9), (840, 740, 12), (1380, 540, 12), (1600, 680, 12), (1760, 640, 12), (1120, 790, 10), (1450, 790, 14), (1640, 560, 14), (780, 690, 16), (880, 640, 10), (1040, 690, 18), (1110, 600, 12), (1260, 700, 20), (1300, 780, 12),
          (1480, 650, 16), (1540, 770, 14), (1700, 650, 18), (1730, 560, 10), (980, 770, 12), (700, 740, 10)]
    b += f'<path d="M1560 800C1690 806 1790 740 1812 640C1840 770 1790 900 1660 950C1610 910 1590 860 1560 800z" fill="#c98640" stroke="{LINE}" stroke-width="4"/>'
    b += '<path d="M1700 860l40-20M1660 900l30-6" stroke="#6a3410" stroke-width="10" stroke-linecap="round"/>'
    if torn: b += '<clipPath id="torn"><path d="' + TORN + '"/></clipPath><g clip-path="url(#torn)">'
    b += naan(5, NAAN_D, 'naan-c' + ('t' if torn else ''), bub, sp, butter=(1240, 640, 96))
    if torn: b += '</g>'
    b += '<path d="M1560 500C1600 600 1600 740 1560 820" stroke="#b57a3a" stroke-width="10" fill="none" opacity=".55"/>'
    if torn:  # the tip is gone: a ragged edge of pale, fluffy crumb (clipped to the naan)
        b += f'<clipPath id="naanonly"><path d="{NAAN_D}"/></clipPath><g clip-path="url(#naanonly)"><path d="{RAG}" fill="none" stroke="#fbf0d4" stroke-width="22" stroke-linejoin="round"/><path d="{RAG}" fill="none" stroke="{LINE}" stroke-width="4" stroke-linejoin="round"/></g>'
    return b


def piece(x, y, s=1.0, rot=0, sauce=None, drip=0, bite=False):
    """the torn piece of naan (the SAME piece from the tear to the bite): a ragged edge on the torn side, one char blister.
    sauce = colour of the curry coat on its dipped end; drip = drip length."""
    r = random.Random(21)
    d = 'M-80 10C-70 -40 -10 -58 40 -50L60 -30L78 -44L92 -18L110 -26L112 4L96 20L104 40C60 60 -40 62 -80 10z'
    g = f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">'
    g += f'<path d="{d}" transform="translate(4 12)" fill="#c98640" stroke="{LINE}" stroke-width="4"/>'
    g += f'<path d="{d}" fill="#f1cf8a" stroke="{LINE}" stroke-width="4" stroke-linejoin="round"/>'
    g += '<ellipse cx="-20" cy="-8" rx="36" ry="18" fill="#fbe5b4" stroke="#c98a48" stroke-width="3"/>'
    g += f'<path d="{blobpath(r, -14, -14, 9, 1.4, .7)}" fill="#6a3210"/><path d="{blobpath(r, 30, 20, 8)}" fill="#b86c30"/>'
    g += '<path d="M60 -30L78 -44L92 -18L110 -26L112 4" fill="none" stroke="#fbf0d4" stroke-width="7" stroke-linejoin="round"/>'  # the fluffy torn crumb
    if sauce:
        base, dark, hi = sauce
        g += f'<path d="M20 -48C60 -40 110 -30 112 4L104 40C80 54 40 58 10 56C30 20 10 -10 20 -48z" fill="{base}" stroke="{dark}" stroke-width="3"/>'
        g += f'<path d="M48 -30c20 4 40 12 48 26" stroke="{hi}" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="-20" rx="8" ry="5" fill="#ffffff" opacity=".9"/>'
        if drip:
            g += f'<path d="M70 50C74 {50 + drip * .5} 66 {50 + drip * .8} 70 {50 + drip}C78 {50 + drip * 1.1} 84 {50 + drip * .8} 80 50z" fill="{base}" stroke="{dark}" stroke-width="3"/>'
            g += f'<ellipse cx="74" cy="{54 + drip * 1.05}" rx="12" ry="15" fill="{base}" stroke="{dark}" stroke-width="3"/><ellipse cx="70" cy="{48 + drip * 1.05}" rx="4" ry="5" fill="#ffffff"/>'
    return g + '</g>'


BUTTER = ('#e2641c', '#9a3208', '#ffb070')
ROUX = ('#6a3414', '#3a1a08', '#e8862a')


# ---------------------------------------------------------------- hands (5 fingers, joined, from a sleeve at the frame edge)
POSES = {
    # wrist at 0,0, the hand points +x. finger = (polyline, width); the thumb is first. Tip P (the pinch) ~ (168,-78).
    'pinch': [([(22, -40), (82, -82), (160, -86)], 30), ([(110, -38), (168, -44), (172, -72)], 27), ([(122, -12), (186, -8), (196, 22)], 27),
              ([(120, 14), (176, 20), (182, 44)], 25), ([(108, 38), (152, 48), (156, 64)], 21)],
    'open': [([(22, -40), (80, -86), (128, -104)], 30), ([(110, -38), (230, -48)], 27), ([(122, -12), (250, -14)], 27),
             ([(120, 14), (238, 18)], 25), ([(108, 38), (204, 52)], 21)],
    'grip': [([(22, -40), (86, -78), (150, -70)], 30), ([(110, -38), (170, -44), (176, -14)], 27), ([(122, -12), (180, -8), (184, 18)], 27),
             ([(120, 14), (172, 20), (176, 42)], 25), ([(108, 38), (150, 48), (152, 62)], 21)],
}
PALM = [(0, -46), (96, -54), (124, -30), (128, 20), (112, 52), (0, 50)]
SKIN = {'you': ('#f2c9a8', '#d59f80', '#fbe4d2', '#7a3e2a'), 'her': ('#fde6e4', '#efb8be', '#ffffff', '#a0305e')}


def hand(tx, ty, ang, s, pose, who, flip=False, held='', nails=True):
    skin, shade, lit, line = SKIN[who]
    fy = -1 if flip else 1
    g = f'<g transform="translate({tx} {ty}) rotate({ang}) scale({s} {s * fy})">'
    # the forearm + sleeve, running to the frame edge (the arm is never cut off inside the frame)
    if who == 'you':
        g += f'<path d="M4 -44L-1400 -120L-1400 150L4 50z" fill="#26305a" stroke="#141a36" stroke-width="5"/><path d="M-60 -48L-1400 -110" stroke="#3c4a80" stroke-width="10"/>'
        g += f'<path d="M-6 -46L-70 -50L-70 54L-6 52z" fill="#f4f1ea" stroke="#9a9488" stroke-width="4"/>'
    else:
        g += f'<path d="M4 -44L-1400 -140L-1400 150L4 50z" fill="#c9b8ec" stroke="#6a4a9a" stroke-width="5"/><path d="M-80 -50L-1400 -130" stroke="#e2d8f8" stroke-width="12"/>'
        g += f'<path d="M-6 -46L-78 -52L-78 56L-6 52z" fill="#ffffff" stroke="#d0307a" stroke-width="5"/><path d="M-78 -52V56" stroke="#e0307a" stroke-width="10"/>'
    fingers = POSES[pose]
    pl = lambda p: 'M' + 'L'.join(f'{x} {y}' for x, y in p)
    pal = 'M' + 'L'.join(f'{x} {y}' for x, y in PALM) + 'z'
    # outline layer, then the fill layer (so the fingers merge into the palm with no seams)
    g += f'<path d="{pal}" fill="{line}" stroke="{line}" stroke-width="10" stroke-linejoin="round"/>'
    g += ''.join(f'<path d="{pl(p)}" stroke="{line}" stroke-width="{w + 10}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' for p, w in fingers)
    if held: g += held   # the food/napkin sits in the grip: fingers close over it
    g += f'<path d="{pal}" fill="{skin}"/>'
    g += ''.join(f'<path d="{pl(p)}" stroke="{skin}" stroke-width="{w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' for p, w in fingers[1:])
    p, w = fingers[0]
    g += f'<path d="{pl(p)}" stroke="{line}" stroke-width="{w + 10}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="{pl(p)}" stroke="{skin}" stroke-width="{w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
    # cel shade on the lower (away-from-light) side + knuckle creases + nails
    g += f'<path d="M4 30L112 36L124 18" stroke="{shade}" stroke-width="16" fill="none" stroke-linecap="round" opacity=".8"/>'
    g += f'<path d="M20 -30L96 -40" stroke="{lit}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".8"/>'
    for (pp, w) in fingers[1:]:
        (ax, ay), (bx, by) = pp[0], pp[1]
        g += f'<path d="M{ax + (bx - ax) * .45:.0f} {ay + (by - ay) * .45 - w * .3:.0f}l0 {w * .6:.0f}" stroke="{shade}" stroke-width="3" stroke-linecap="round"/>'
    if nails:
        nc = '#ffd2dc' if who == 'you' else '#f06aa8'
        for (pp, w) in fingers:
            (ax, ay), (bx, by) = pp[-2], pp[-1]
            L = math.hypot(bx - ax, by - ay); ux, uy = (bx - ax) / L, (by - ay) / L
            g += f'<ellipse cx="{bx - ux * w * .25:.0f}" cy="{by - uy * w * .25:.0f}" rx="{w * .32:.0f}" ry="{w * .24:.0f}" transform="rotate({math.degrees(math.atan2(uy, ux)):.0f} {bx - ux * w * .25:.0f} {by - uy * w * .25:.0f})" fill="{nc}" stroke="{line}" stroke-width="2"/>'
    return g + '</g>'


# ---------------------------------------------------------------- her face, extreme close-up (Nanda's IC-chip face)
def face(mode, food, food_piece=''):
    """mode 'open' = mouth open, waiting (Feed me); 'bite' = lips closed on the food, the curry smear at the corner."""
    base, dark, hi = food
    b = '<rect width="1920" height="1080" fill="#fff4f9"/>'
    b += '<radialGradient id="fg" cx=".42" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#fbe3ee"/></radialGradient><rect width="1920" height="1080" fill="url(#fg)"/>'
    # the chip body: magenta edge bars with lavender pins (left + right), the silver fringe with its zigzag rim (top)
    for x in (40, 1830):
        b += f'<rect x="{x}" y="0" width="50" height="1080" fill="#d4197e"/>'
        b += ''.join(f'<rect x="{x - 26 if x < 900 else x + 50}" y="{y}" width="26" height="22" rx="3" fill="#cfc4e6" stroke="#7a5aa0" stroke-width="3"/>' for y in (180, 330, 480, 630))
    zz = 'M90 0V130' + ''.join(f'L{90 + i * 145 + 72} {215 if i % 2 else 180}L{90 + (i + 1) * 145} 130' for i in range(12)) + 'V0z'
    b += f'<path d="{zz}" fill="#e4e6f2" stroke="#d4197e" stroke-width="16" stroke-linejoin="round"/>'
    b += '<path d="M300 20C340 60 360 100 350 140M760 20C800 70 810 110 800 150M1240 30C1270 70 1280 110 1270 150" stroke="#b9bdd8" stroke-width="8" fill="none" stroke-linecap="round"/>'
    # eyes: open, looking straight at you (the camera). The catchlight is upper LEFT, the window side.
    for ex in (620, 1300):
        if mode == 'bite':  # heavy, pleased lids: the eye stays on you
            b += f'<ellipse cx="{ex}" cy="310" rx="78" ry="104" fill="#6b0f42"/><ellipse cx="{ex - 26}" cy="282" rx="26" ry="26" fill="#ffffff"/>'
            b += f'<path d="M{ex - 110} 196H{ex + 110}V268C{ex + 60} 242 {ex - 60} 242 {ex - 110} 268z" fill="#fdf0f6"/><path d="M{ex - 96} 266C{ex - 40} 238 {ex + 40} 238 {ex + 96} 266" stroke="#6b0f42" stroke-width="20" fill="none" stroke-linecap="round"/>'
        else:
            b += f'<ellipse cx="{ex}" cy="300" rx="80" ry="116" fill="#6b0f42"/><ellipse cx="{ex - 26}" cy="254" rx="30" ry="30" fill="#ffffff"/><ellipse cx="{ex + 28}" cy="350" rx="10" ry="10" fill="#ffffff" opacity=".8"/>'
    blush = '#ffa6cf'
    b += f'<ellipse cx="400" cy="470" rx="190" ry="84" fill="{blush}"/><ellipse cx="1520" cy="470" rx="190" ry="84" fill="{blush}"/>'
    b += '<path d="M330 430l30 -40M390 430l30 -40M450 430l30 -40M1450 430l30 -40M1510 430l30 -40M1570 430l30 -40" stroke="#ff7cb4" stroke-width="8" stroke-linecap="round"/>'
    mx, my = 960, 520
    if mode == 'open':
        b += f'<path d="M{mx - 86} {my - 30}C{mx - 60} {my - 60} {mx + 60} {my - 60} {mx + 86} {my - 30}C{mx + 90} {my + 60} {mx - 90} {my + 60} {mx - 86} {my - 30}z" fill="#6b0f42"/>'
        b += f'<path d="M{mx - 56} {my + 34}C{mx - 20} {my + 4} {mx + 30} {my + 4} {mx + 60} {my + 34}C{mx + 30} {my + 50} {mx - 30} {my + 50} {mx - 56} {my + 34}z" fill="#f06a8a"/>'
        b += f'<path d="M{mx - 86} {my - 30}C{mx - 60} {my - 60} {mx + 60} {my - 60} {mx + 86} {my - 30}" stroke="#4a0a2e" stroke-width="10" fill="none" stroke-linecap="round"/>'
        b += food_piece
    else:
        b += f'<path d="M{mx - 70} {my - 16}C{mx - 30} {my + 30} {mx + 30} {my + 30} {mx + 70} {my - 16}C{mx + 40} {my + 6} {mx - 40} {my + 6} {mx - 70} {my - 16}z" fill="#6b0f42"/>'
        b += food_piece
        # the lips close over the far end of the piece (drawn after it): upper lip line + the soft cheek bulge
        b += f'<path d="M{mx - 120} {my - 26}C{mx - 80} {my - 2} {mx - 40} {my - 26} {mx} {my - 12}C{mx + 40} {my - 26} {mx + 80} {my - 2} {mx + 120} {my - 26}" stroke="#4a0a2e" stroke-width="12" fill="none" stroke-linecap="round"/>'
        b += f'<path d="M{mx - 30} {my + 44}C{mx} {my + 56} {mx + 30} {my + 56} {mx + 50} {my + 40}" stroke="#d27a9c" stroke-width="8" fill="none" stroke-linecap="round"/>'
        # the curry at the corner of her mouth (the window glint on it, upper left) + one small drop on her chin
        b += f'<path d="M{mx + 104} {my - 30}C{mx + 150} {my - 44} {mx + 176} {my - 10} {mx + 160} {my + 20}C{mx + 150} {my + 40} {mx + 120} {my + 30} {mx + 112} {my + 8}C{mx + 100} {my - 6} {mx + 92} {my - 20} {mx + 104} {my - 30}z" fill="{base}" stroke="{dark}" stroke-width="4"/>'
        b += f'<ellipse cx="{mx + 128}" cy="{my - 18}" rx="12" ry="7" fill="#ffffff" opacity=".9"/><path d="M{mx + 140} {my + 28}C{mx + 142} {my + 60} {mx + 150} {my + 70} {mx + 142} {my + 84}C{mx + 130} {my + 70} {mx + 136} {my + 50} {mx + 140} {my + 28}z" fill="{base}" stroke="{dark}" stroke-width="3"/>'
    return b


def feed_pov(food, piece_svg_open, piece_svg_bite, mode):
    """your hand from the bottom-left holds the food at her mouth. Everything that matters sits above y=740 (the box)."""
    if mode == 'open':
        held = piece_svg_open
        return face('open', food) + hand(300, 750, -10, 2.2, 'pinch', 'you', held=held)
    return face('bite', food, hand(360, 750, -8, 2.2, 'pinch', 'you', held=piece_svg_bite))


# ---------------------------------------------------------------- a gravy boat (steel), tilted, pouring a ribbon
def boat(x, y, rot, s, food, ribbon_to):
    base, dark, hi = food
    tx, ty = ribbon_to
    g = f'<path d="M{x - 40} {y + 30}C{x - 70} {(y + ty) / 2} {tx - 40} {ty - 120} {tx - 30} {ty}L{tx + 30} {ty}C{tx + 20} {ty - 140} {x - 10} {(y + ty) / 2 + 20} {x + 10} {y + 40}z" fill="{base}" stroke="{dark}" stroke-width="4"/>'
    g += f'<path d="M{x - 38} {y + 60}C{x - 56} {(y + ty) / 2} {tx - 30} {ty - 130} {tx - 20} {ty - 40}" stroke="{hi}" stroke-width="9" fill="none" stroke-linecap="round"/>'
    g += f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">'
    g += '<path d="M-60 -40C-40 60 160 70 200 -40z" fill="#b9bfc8" stroke="#5a616b" stroke-width="5"/>'
    g += '<path d="M60 20C120 20 170 0 190 -30L200 -40C160 30 100 50 60 40z" fill="#8e96a1"/>'
    g += '<ellipse cx="70" cy="-40" rx="130" ry="26" fill="#dfe3e8" stroke="#5a616b" stroke-width="5"/>'
    g += f'<ellipse cx="70" cy="-38" rx="112" ry="18" fill="{base}"/>'
    g += '<path d="M-60 -40L-110 -30L-58 -20z" fill="#c3c8cf" stroke="#5a616b" stroke-width="5" stroke-linejoin="round"/>'
    g += '<path d="M200 -20C260 -30 270 40 210 40" stroke="#8e96a1" stroke-width="14" fill="none" stroke-linecap="round"/>'
    g += '<path d="M-20 0C20 30 80 38 120 30" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".85"/>'
    return g + '</g>'


# ================================================================ BUTTER-CHICKEN shots
def thali():
    return svg(cloth() + thali_group())


def naan_lift():
    """crop x1.9 on the naan tip: her hand (from the right) lifts the torn piece; a pull of dough still joins them."""
    g = f'<g transform="translate(-535 -848) scale(1.9)">{thali_group(torn=True)}</g>'
    return svg(cloth() + g + '<path d="M770 420C820 380 860 340 900 310" stroke="#f8ebc8" stroke-width="14" fill="none" stroke-linecap="round"/>'
               + hand(1177, 476, 180 + 8, 1.7, 'pinch', 'her', flip=True, held=f'<g transform="translate(176 -80) rotate(180) scale(1 -1)">{piece(0, 0, 1.1, 0)}</g>'))


def sauce():
    g = f'<g transform="translate(-1040 -560) scale(3.2)">{thali_group()}</g>'
    return svg(cloth() + g + boat(1380, 330, -28, 1.6, BUTTER, (820, 540)))


def naan_dip():
    g = f'<g transform="translate(-1580 -900) scale(4.2)">{thali_group()}</g>'
    return svg(cloth() + g + '<ellipse cx="830" cy="600" rx="130" ry="30" fill="#b8420e"/><path d="M710 600c40-20 200-20 240 0" stroke="#ffb070" stroke-width="8" fill="none"/>'
               + hand(1062, 761, 180 + 18, 1.7, 'pinch', 'her', flip=True, held=f'<g transform="translate(176 -80) rotate(180) scale(1 -1)">{piece(0, 0, 1.1, 0, BUTTER, 60)}</g>'))


def naan_feed():
    return svg(feed_pov(BUTTER, f'<g transform="translate(176 -82) rotate(14)">{piece(0, 0, 1.0, 0, BUTTER, 40)}</g>', '', 'open'))


def butter_bite():
    return svg(feed_pov(BUTTER, '', f'<g transform="translate(200 -84) rotate(2)">{piece(0, 0, 1.0, 0, BUTTER)}</g>', 'bite'))


def lassi_glass(cx, base_y, kind='lassi'):
    """the tulip glass (lassi) or a tall tumbler (katsu's lemon water). base_y = where the foot touches the table."""
    b = f'<path d="M{cx - 40} {base_y}L{cx + 420} {base_y + 30}L{cx + 390} {base_y - 16}L{cx + 60} {base_y - 18}z" fill="{SH}" opacity=".28"/>'
    b += f'<ellipse cx="{cx + 14}" cy="{base_y + 4}" rx="150" ry="26" fill="{SH}" opacity=".45"/>'
    if kind == 'lassi':
        top = base_y - 568
        b += f'<ellipse cx="{cx}" cy="{base_y - 10}" rx="128" ry="24" fill="#e8f0f2" stroke="#7a8a90" stroke-width="3"/><ellipse cx="{cx}" cy="{base_y - 16}" rx="96" ry="14" fill="#cfdde2"/>'
        b += f'<path d="M{cx - 18} {base_y - 168}L{cx - 14} {base_y - 20}H{cx + 14}L{cx + 18} {base_y - 168}z" fill="#dfe9ec" stroke="#7a8a90" stroke-width="3"/><path d="M{cx - 6} {base_y - 158}V{base_y - 26}" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>'
        bowl = f'M{cx - 150} {top}C{cx - 172} {top + 110} {cx - 176} {top + 230} {cx - 120} {top + 330}C{cx - 80} {top + 398} {cx - 40} {top + 416} {cx} {top + 416}C{cx + 40} {top + 416} {cx + 80} {top + 398} {cx + 120} {top + 330}C{cx + 176} {top + 230} {cx + 172} {top + 110} {cx + 150} {top}z'
        drink, dk, lt, fz = '#f7a21e', '#e0800e', '#ffc24e', '#ffd57a'
    else:
        top = base_y - 520
        bowl = f'M{cx - 130} {top}L{cx - 110} {base_y - 14}C{cx - 60} {base_y + 2} {cx + 60} {base_y + 2} {cx + 110} {base_y - 14}L{cx + 130} {top}z'
        drink, dk, lt, fz = '#dff1f4', '#bcdde4', '#f4fbfc', '#eef8fa'
    b += f'<clipPath id="bowl{cx}"><path d="{bowl}"/></clipPath><path d="{bowl}" fill="#fff8ec" opacity=".35"/>'
    lvl = top + 48
    b += f'<g clip-path="url(#bowl{cx})"><rect x="{cx - 200}" y="{lvl}" width="400" height="700" fill="{drink}"/>'
    b += f'<path d="M{cx + 60} {lvl}C{cx + 110} {lvl + 110} {cx + 110} {lvl + 240} {cx + 40} {lvl + 700}H{cx + 220}V{lvl}z" fill="{dk}"/>'
    b += f'<path d="M{cx - 150} {lvl}C{cx - 150} {lvl + 120} {cx - 120} {lvl + 230} {cx - 70} {lvl + 320}L{cx - 110} {lvl + 700}H{cx - 220}V{lvl}z" fill="{lt}"/>'
    b += f'<ellipse cx="{cx}" cy="{lvl}" rx="164" ry="24" fill="{fz}"/>'
    if kind == 'water':
        b += ''.join(f'<rect x="{cx + dx}" y="{lvl + dy}" width="70" height="60" rx="12" transform="rotate({rt} {cx + dx + 35} {lvl + dy + 30})" fill="#ffffff" stroke="#9ccad4" stroke-width="4" opacity=".9"/>' for dx, dy, rt in [(-90, 10, 12), (0, 30, -8), (-40, 110, 20)])
    b += '</g>'
    b += f'<path d="{bowl}" fill="none" stroke="#7a8a90" stroke-width="4"/>'
    rw = 150 if kind == 'lassi' else 130
    b += f'<ellipse cx="{cx}" cy="{top}" rx="{rw}" ry="22" fill="none" stroke="#ffffff" stroke-width="6"/><ellipse cx="{cx}" cy="{top}" rx="{rw}" ry="22" fill="none" stroke="#7a8a90" stroke-width="2"/>'
    b += f'<path d="M{cx - rw + 26} {top + 60}C{cx - rw + 12} {top + 150} {cx - rw + 20} {top + 240} {cx - rw + 54} {top + 310}" stroke="#ffffff" stroke-width="22" fill="none" stroke-linecap="round" opacity=".9"/>'
    # ONE straw, leaning right
    b += f'<g transform="rotate(20 {cx + 40} {top + 40})"><rect x="{cx + 26}" y="{top - 170}" width="30" height="300" rx="10" fill="#ff7cb4" stroke="{LINE}" stroke-width="3"/>'
    b += ''.join(f'<path d="M{cx + 26} {y}l30 -14" stroke="#ffffff" stroke-width="8"/>' for y in range(top - 140, top + 50, 34)) + '</g>'
    if kind == 'lassi':
        b += f'<path d="M{cx - 90} {top + 24}C{cx - 170} {top - 60} {cx - 90} {top - 110} {cx - 40} {top - 40}C{cx - 50} {top} {cx - 70} {top + 20} {cx - 90} {top + 24}z" fill="#3f8a2c" stroke="#24541a" stroke-width="3"/><path d="M{cx - 66} {top + 16}L{cx - 40} {top - 40}" stroke="#8fd060" stroke-width="4"/>'
        b += f'<path d="M{cx + 110} {top + 6}C{cx + 130} {top - 80} {cx + 220} {top - 100} {cx + 250} {top - 50}C{cx + 240} {top + 10} {cx + 190} {top + 40} {cx + 140} {top + 40}L{cx + 150} {top + 6}z" fill="#ffae2a" stroke="#b8600e" stroke-width="4"/>'
    else:  # a lime wheel on the rim
        b += f'<circle cx="{cx + 150}" cy="{top - 10}" r="62" fill="#8fcf3a" stroke="#4a7a14" stroke-width="5"/><circle cx="{cx + 150}" cy="{top - 10}" r="48" fill="#dff59a"/>'
        b += ''.join(f'<path d="M{cx + 150} {top - 10}l{math.cos(a) * 44:.0f} {math.sin(a) * 44:.0f}" stroke="#b6e060" stroke-width="5"/>' for a in [i * math.tau / 8 for i in range(8)])
    return b


def room_back(window=True):
    """the back of the shop at table height: a cream wall, the WINDOW on the LEFT (the one light source)."""
    b = '<rect width="1920" height="600" fill="#f1d7b0"/>'
    if window:
        b += '<rect x="0" y="0" width="760" height="560" fill="#fff4dc"/><rect x="0" y="0" width="760" height="560" fill="none" stroke="#c9a47a" stroke-width="18"/>'
        b += ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#ffffff" opacity=".5"/>' for x, y, r in [(180, 180, 70), (420, 300, 90), (620, 150, 50)])
        b += '<path d="M760 0H1920V600H760z" fill="#e9c79a" opacity=".5"/>'
    return b


def lassi():
    b = room_back()
    b += '<path d="M0 560H1920V1080H0z" fill="#d6603a"/><path d="M0 560H1920V586H0z" fill="#ee8a52"/>'
    b += ''.join(f'<path d="M{960 + (i * 120 - 960) * 1460 / 1980:.0f} 560L{i * 120} 1080" stroke="#c9552f" stroke-width="3" opacity=".5"/>' for i in range(-6, 24))
    b += f'<g transform="translate(-900 380) scale(1.0)">{thali_group()}</g>'   # the same thali, cut by the left edge
    b += lassi_glass(1100, 780)
    return svg(b)


def napkin_shape(stain, fold=False):
    base, dark, hi = stain
    if fold:
        return f'<path d="M-40 -90L150 -60L60 90z" fill="#ffffff" stroke="#9aa0aa" stroke-width="4" stroke-linejoin="round"/><path d="M-40 -90L150 -60L100 -20z" fill="#eceff4"/><path d="M40 -40c14 -6 26 0 30 10" stroke="{base}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/>'
    return (f'<path d="M-120 -80C-40 -110 80 -100 150 -70C170 -20 160 50 130 90C40 110 -60 100 -130 70C-150 20 -140 -40 -120 -80z" fill="#ffffff" stroke="#9aa0aa" stroke-width="4"/>'
            f'<path d="M-100 40C-40 60 60 60 120 40" stroke="#dde1e8" stroke-width="10" fill="none"/><path d="M-60 -60L-20 60M40 -70L70 60" stroke="#eceff4" stroke-width="6"/>'
            f'<path d="{blobpath(random.Random(3), 10, -10, 22, 1.6, .7)}" fill="{base}" opacity=".85"/><path d="{blobpath(random.Random(4), 60, 30, 14, 1.6, .7)}" fill="{base}" opacity=".7"/>')


def napkin_shot(surface, dish, stain):
    """your fingers (from the bottom-left, curry on the tips) + her hand from the right wiping them with the napkin."""
    base, dark, hi = stain
    b = surface + dish
    # your open hand, palm down, fingertips with curry; contact shadow on the table under it
    b += f'<ellipse cx="{700 + SDX}" cy="{600 + SDY}" rx="300" ry="70" fill="{SH}" opacity=".25"/>'
    b += hand(560, 610, -10, 1.5, 'open', 'you')
    b += ''.join(f'<ellipse cx="{x}" cy="{y}" rx="16" ry="10" fill="{base}" stroke="{dark}" stroke-width="2"/>' for x, y in [(880, 480), (910, 520), (905, 565)])
    # her hand wraps the napkin over your index + middle fingers (napkin on top = it touches them)
    b += hand(1084, 642, 180 + 10, 1.5, 'grip', 'her', flip=True, held=f'<g transform="translate(150 -70) rotate(180) scale(1 -1)">{napkin_shape(stain)}</g>')
    return svg(b)


def napkin_fold(surface, dish, stain):
    b = surface + dish
    b += f'<ellipse cx="{1080 + SDX}" cy="{640 + SDY}" rx="260" ry="50" fill="{SH}" opacity=".22"/>'
    b += hand(1300, 520, 180 + 6, 1.7, 'grip', 'her', flip=True, held=f'<g transform="translate(150 -40) rotate(180) scale(1.7 -1.7)">{napkin_shape(stain, True)}</g>')
    return svg(b)


def butter_table():
    """the two-shot: the window on the LEFT, a booth for her in the middle (her seat + back + cast shadow to the right),
    our table at the left front with the SAME thali on it. Her sprite (x740-1150) sits on the booth seat at y~740."""
    b = '<rect width="1920" height="1080" fill="#f1d7b0"/>'
    b += '<path d="M0 0H1920V120H0z" fill="#e2bf92"/>'  # the ceiling band (no art text: HUD-safe)
    # the window, the only light: bright panes, a warm light pool on the floor + booth
    b += '<rect x="30" y="150" width="560" height="440" fill="#fff4dc" stroke="#9a6a3e" stroke-width="16"/><path d="M310 150V590M30 370H590" stroke="#9a6a3e" stroke-width="12"/>'
    b += ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#ffffff" opacity=".55"/>' for x, y, r in [(140, 250, 60), (430, 300, 80), (200, 480, 50)])
    b += '<path d="M590 150L1300 520V760L590 590z" fill="#fff4d0" opacity=".22"/>'
    # the booth: one VP at (960, 380) for its top edge + seat
    b += '<path d="M620 300H1320C1340 300 1350 312 1350 330V760H590V330C590 312 600 300 620 300z" fill="#8a2a3a" stroke="#4a1018" stroke-width="6"/>'
    b += ''.join(f'<path d="M{x} 320V740" stroke="#6e1e2c" stroke-width="6"/>' for x in (740, 900, 1060, 1210))
    b += '<path d="M620 300H1320" stroke="#c0485a" stroke-width="12" stroke-linecap="round"/>'  # lit top edge
    # her cast shadow on the booth back: to her RIGHT (away from the window)
    b += '<path d="M1110 360C1210 380 1260 470 1250 600L1230 760H1100z" fill="#2a0a10" opacity=".35"/>'
    b += '<path d="M560 740H1400L1440 790H520z" fill="#a8384a" stroke="#4a1018" stroke-width="5"/><path d="M560 740H1400" stroke="#d45a6e" stroke-width="8"/>'
    b += '<path d="M540 790H1420V1080H540z" fill="#5a1a26"/>'
    # the floor
    b += '<path d="M0 760H1920V1080H0z" fill="#9a6a3e"/><path d="M0 760H1920" stroke="#7a4e2a" stroke-width="6"/>'
    b += ''.join(f'<path d="M{960 + (x - 960) * 380 / 700:.0f} 760L{x} 1080" stroke="#8a5c32" stroke-width="4"/>' for x in range(-1200, 3200, 260))
    b += '<path d="M540 790H1420V1080H540z" fill="#5a1a26"/>'
    # our table at the front-left (orange cloth), the thali on it (the same sprite, small)
    b += '<path d="M-20 620H560L520 1080H-20z" fill="#d6603a" stroke="#8a3218" stroke-width="5"/><path d="M-20 620H560" stroke="#ee8a52" stroke-width="12"/>'
    b += f'<g transform="translate(-30 560) scale(.34)">{thali_group()}</g>'
    # her lassi on the right edge of the booth table (a small tray table at the right, same cloth)
    b += '<path d="M1440 640H1940V1080H1400z" fill="#d6603a" stroke="#8a3218" stroke-width="5"/><path d="M1440 640H1940" stroke="#ee8a52" stroke-width="12"/>'
    b += f'<g transform="translate(1100 330) scale(.42)">{lassi_glass(1100, 780)}</g>'
    return svg(b)


# ================================================================ KATSU shots
def cutlet(cut=False, seed=2):
    """the sliced cutlet (KATSU-ANALYSIS rules 1-3): one oval cut in 6 fanned strips. Scalloped crumb, gold dots, a lit top
    band, a dark underside (thickness), and a pink cut face in a crumb ring on the right of every strip."""
    r = random.Random(seed)
    RX, RY, N, FAN, T = 330, 125, 6, 30, 26
    yt = lambda x: -RY * math.sqrt(max(0.02, 1 - (x / RX) ** 2))
    g = ''
    for i in range(N):
        if cut and i == N - 1: break
        a, b = -RX + i * 2 * RX / N, -RX + (i + 1) * 2 * RX / N
        ox, oy = i * FAN - FAN * N / 2, -i * 5
        xs = [a + (b - a) * k / 8 for k in range(9)]
        top = [(x + ox, yt(x) + oy) for x in xs]
        bot = [(x + ox, -yt(x) + oy) for x in reversed(xs)]
        pts = top + bot
        g += f'<path d="{bumpy([(x, y + T) for x, y in pts], step=20, bulge=7, seed=i)}" fill="#8a4a16" stroke="#5a2c0a" stroke-width="4"/>'  # the side (thickness)
        g += f'<path d="{bumpy(pts, step=20, bulge=8, seed=i + 10)}" fill="#dc9c44" stroke="#8a4a16" stroke-width="4"/>'
        g += f'<path d="M{top[1][0]:.0f} {top[1][1] + 12:.0f}' + ''.join(f'L{x:.0f} {y + 12:.0f}' for x, y in top[2:-1]) + '" stroke="#f7d27a" stroke-width="12" fill="none" stroke-linecap="round"/>'
        for _ in range(16):
            px = a + ox + 10 + r.random() * (b - a - 20); lim = -yt(px - ox) * 0.8
            py = oy + (r.random() * 2 - 1) * lim
            g += f'<circle cx="{px:.0f}" cy="{py:.0f}" r="{r.choice([4, 5, 6, 7])}" fill="{r.choice(["#f3c66e", "#a8641e", "#f3c66e", "#c47a2a"])}"/>'
        if i < N - 1 or cut:  # the cut face: pink meat + a pale fat line inside a crumb ring
            x1, y1, y2 = b + ox, yt(b) + oy, -yt(b) + oy
            face_ = f'M{x1:.0f} {y1:.0f}L{x1 + 24:.0f} {y1 + 8:.0f}L{x1 + 24:.0f} {y2 + T:.0f}L{x1:.0f} {y2 + T - 6:.0f}z'
            g += f'<path d="{face_}" fill="#f4b8b0" stroke="#c47a2a" stroke-width="10" stroke-linejoin="round"/>'
            g += f'<path d="M{x1 + 12:.0f} {y1 + 20:.0f}C{x1 + 16:.0f} {(y1 + y2) / 2:.0f} {x1 + 8:.0f} {(y1 + y2) / 2 + 20:.0f} {x1 + 12:.0f} {y2 + T - 16:.0f}" stroke="#fbe2d6" stroke-width="5" fill="none"/>'
    return g


def katsu_plate(cut=False):
    """the hero plate (3/4 top view): rice on the right, roux on the left, the cutlet across the seam, fukujinzuke."""
    r = random.Random(7)
    cx, cy = 960, 560
    b = f'<ellipse cx="{cx + SDX}" cy="{cy + SDY + 14}" rx="740" ry="372" fill="{SH}" opacity=".34"/>'
    b += f'<ellipse cx="{cx}" cy="{cy}" rx="730" ry="366" fill="#fbfbfd" stroke="#7a8494" stroke-width="5"/>'
    b += f'<path d="M{cx - 730} {cy}A730 366 0 0 1 {cx + 730} {cy}A730 330 0 0 0 {cx - 730} {cy}z" fill="#d5dde8"/>'   # blue-grey rim shade, far side
    b += f'<ellipse cx="{cx}" cy="{cy + 10}" rx="600" ry="290" fill="#f4f6fa" stroke="#b9c2d0" stroke-width="3"/>'
    b += f'<path d="M{cx - 600} {cy + 10}A600 290 0 0 1 {cx + 200} {cy - 276}A600 250 0 0 0 {cx - 600} {cy + 10}z" fill="#dfe6ef"/>'  # inner wall shade (upper left)
    # rice (right): a lumpy dome with grain outlines, its shade on the lower right
    rpts = [(960 + math.cos(t) * 300 * (1 + .05 * math.sin(5 * t)), 560 + math.sin(t) * 230 * (1 + .05 * math.cos(4 * t))) for t in [k / 28 * math.tau for k in range(28)]]
    rpts = [(x + 230, y - 10) for x, y in rpts]
    rice = bumpy(rpts[::-1][::-1], step=34, bulge=14, seed=3)
    b += f'<path d="{rice}" transform="translate(16 20)" fill="#d8d2c2"/><path d="{rice}" fill="#fbfaf4" stroke="#b8b0a0" stroke-width="3"/>'
    b += '<path d="M1540 580C1520 700 1400 790 1200 800C1320 740 1460 680 1540 580z" fill="#e6e0d0"/>'
    for _ in range(90):
        x = r.randint(1000, 1440); y = r.randint(380, 740)
        b += f'<ellipse cx="{x}" cy="{y}" rx="12" ry="7" transform="rotate({r.randint(-40, 40)} {x} {y})" fill="none" stroke="#cfc8b6" stroke-width="3"/>'
    # roux (left): a glossy plane, dark rim where it meets the rice, ridges, orange glints, white blobs
    roux = 'M420 430C520 350 760 330 930 360C890 460 900 640 1000 760C1100 800 1200 810 1300 800C1100 850 800 860 600 820C420 790 300 640 330 540C340 490 380 460 420 430z'
    b += f'<path d="{roux}" fill="#6a3414" stroke="#3a1a08" stroke-width="6"/>'
    b += '<path d="M930 360C890 460 900 640 1000 760C1100 800 1200 810 1300 800" stroke="#3a1a08" stroke-width="14" fill="none" stroke-linecap="round"/>'
    for (x, y, w) in [(470, 520, 160), (560, 640, 200), (700, 450, 150), (480, 720, 140), (760, 740, 120)]:
        b += f'<path d="M{x} {y}c{w * .3} -24 {w * .6} 20 {w} -6" stroke="#8a4a1c" stroke-width="16" fill="none" stroke-linecap="round"/>'
        b += f'<path d="M{x + 6} {y - 8}c{w * .25} -20 {w * .45} -8 {w * .6} -12" stroke="#e8862a" stroke-width="6" fill="none" stroke-linecap="round"/>'
    for (x, y) in [(560, 470), (640, 600), (470, 640)]:
        b += f'<ellipse cx="{x}" cy="{y}" rx="16" ry="9" fill="#ffffff" opacity=".9"/>'
    for (x, y, k, c, s_) in [(520, 580, 34, '#f2d27a', '#d9ae4a'), (700, 700, 30, '#f2d27a', '#d9ae4a'), (820, 560, 28, '#e8762a', '#b8520e'), (600, 760, 24, '#e8762a', '#b8520e'), (440, 560, 22, '#f2d27a', '#d9ae4a')]:
        b += f'<rect x="{x - k}" y="{y - k * .8}" width="{k * 2}" height="{k * 1.6}" rx="{k * .35}" fill="{c}" stroke="#5a3010" stroke-width="3"/><path d="M{x + k * .2} {y - k * .8}H{x + k}V{y + k * .8}" stroke="{s_}" stroke-width="{k * .5:.0f}" fill="none"/>'
    # the cutlet across the seam (rotated a little; one VP holds because it lies flat on the plate)
    b += f'<g transform="translate(900 520) rotate(-10)">{cutlet(cut)}</g>'
    if cut:   # the end strip is cut off: the small piece lies apart on the rice, its pink face up
        b += f'<g transform="translate(1250 520) rotate(-10)">{katsu_piece()}</g>'
    # fukujinzuke (red pickles) on the rice edge, front right
    for (x, y) in [(1330, 700), (1360, 690), (1350, 720), (1384, 712), (1318, 726), (1372, 736)]:
        b += f'<rect x="{x}" y="{y}" width="30" height="18" rx="5" transform="rotate({r.randint(-30, 30)} {x} {y})" fill="#c8202e" stroke="#7a1018" stroke-width="2"/>'
    return b


def katsu_side():
    """the set around the plate: a spoon on a white napkin (right) and the lemon water glass (top left: no text)."""
    b = f'<g transform="rotate(-14 1780 700)"><rect x="{1680 + SDX}" y="{520 + SDY}" width="200" height="420" rx="8" fill="{SH}" opacity=".25"/><rect x="1680" y="520" width="200" height="420" rx="8" fill="#ffffff" stroke="#b9c2d0" stroke-width="4"/><path d="M1780 520V940" stroke="#e6ebf2" stroke-width="10"/>'
    b += '<path d="M1780 600V900" stroke="#8e96a1" stroke-width="22" stroke-linecap="round"/><path d="M1780 600V900" stroke="#e8ecf0" stroke-width="9" stroke-linecap="round"/><ellipse cx="1780" cy="590" rx="44" ry="64" fill="#c9ced5" stroke="#636a74" stroke-width="4"/><ellipse cx="1770" cy="572" rx="14" ry="22" fill="#ffffff"/></g>'
    return b


def katsu_dish():
    return svg(counter() + katsu_plate() + katsu_side())


def katsu_cut():
    """crop x1.7 on the cutlet's end: her hand (from the right) holds the spoon; its edge has cut off one small piece."""
    g = f'<g transform="translate(-900 -290) scale(1.7)">{katsu_plate(cut=True)}</g>'
    C, H = (1250, 470), (1420, 340)
    sp = f'<path d="M{C[0] + 40} {C[1] - 30}L{H[0] + 120} {H[1] - 92}" stroke="#5a616b" stroke-width="32" stroke-linecap="round"/><path d="M{C[0] + 40} {C[1] - 30}L{H[0] + 120} {H[1] - 92}" stroke="#dfe3e8" stroke-width="18" stroke-linecap="round"/>'
    sp += f'<ellipse cx="{C[0]}" cy="{C[1]}" rx="40" ry="74" transform="rotate(36 {C[0]} {C[1]})" fill="#c9ced5" stroke="#5a616b" stroke-width="6"/><ellipse cx="{C[0] - 10}" cy="{C[1] - 18}" rx="12" ry="24" transform="rotate(36 {C[0] - 10} {C[1] - 18})" fill="#ffffff"/>'
    crunch = f'<path d="M{C[0] - 70} {C[1] - 60}l-40-40M{C[0] - 20} {C[1] - 90}l-6-56M{C[0] - 110} {C[1] - 10}l-56-10" stroke="#fff6de" stroke-width="10" stroke-linecap="round"/>'
    return svg(counter() + g + sp + crunch + hand(H[0] + 171, H[1] + 242, 210, 1.6, 'pinch', 'her', flip=True))


def katsu_pour():
    g = f'<g transform="translate(-2580 -1156) scale(2.6)">{katsu_plate()}</g>'
    return svg(counter() + g + '<path d="M620 560C640 500 900 490 960 560C980 620 860 650 760 640C680 634 610 610 620 560z" fill="#6a3414" stroke="#3a1a08" stroke-width="10"/><path d="M680 540c50-24 140-24 200-6" stroke="#e8862a" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="720" cy="570" rx="14" ry="8" fill="#fff"/>'
               + boat(1380, 300, -30, 1.6, ROUX, (800, 560)))


def katsu_piece(dip=0):
    """the small piece she cut: crumb on top, the pink face toward us; dip = roux coat + drip length (0 = clean)."""
    g = f'<path d="{bumpy([(-60, -40), (60, -46), (66, 40), (-54, 46)], step=18, bulge=7, seed=5)}" fill="#dc9c44" stroke="#8a4a16" stroke-width="4"/>'
    g += '<path d="M-50 -30L50 -36" stroke="#f7d27a" stroke-width="10" stroke-linecap="round"/>'
    g += ''.join(f'<circle cx="{x}" cy="{y}" r="5" fill="{c}"/>' for x, y, c in [(-30, -10, '#a8641e'), (0, 6, '#f3c66e'), (30, -14, '#a8641e'), (-10, 26, '#f3c66e'), (36, 20, '#a8641e')])
    g += '<path d="M-44 20H50L54 50H-40z" fill="#f4b8b0" stroke="#b8702a" stroke-width="7" stroke-linejoin="round"/><path d="M-30 34H40" stroke="#fbe2d6" stroke-width="4"/>'
    if dip:
        base, dark, hi = ROUX
        g += f'<path d="M-4 -44C30 -40 64 -30 66 40L54 50C30 60 0 60 -20 50C-10 20 -20 -10 -4 -44z" fill="{base}" stroke="{dark}" stroke-width="3"/><path d="M20 -30c14 6 26 16 30 30" stroke="{hi}" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="18" cy="-18" rx="7" ry="4" fill="#ffffff"/>'
        if dip > 1:
            g += f'<path d="M30 54C34 {54 + dip * .5} 26 {54 + dip * .8} 30 {54 + dip}C38 {54 + dip * 1.1} 44 {54 + dip * .8} 40 54z" fill="{base}" stroke="{dark}" stroke-width="3"/><ellipse cx="34" cy="{58 + dip * 1.05}" rx="11" ry="14" fill="{base}" stroke="{dark}" stroke-width="3"/><ellipse cx="30" cy="{52 + dip * 1.05}" rx="3" ry="4" fill="#ffffff"/>'
    return g


def katsu_close():
    """ECU: she dips the cut piece in the roux on the plate; the roux strings off it."""
    g = f'<g transform="translate(-600 -1100) scale(3.2)">{katsu_plate(cut=True)}</g>'
    return svg(counter() + g + '<ellipse cx="800" cy="600" rx="120" ry="28" fill="#3a1a08" opacity=".5"/>' + hand(1049, 744, 180 + 18, 1.7, 'pinch', 'her', flip=True, held=f'<g transform="translate(180 -80) rotate(180) scale(1.1 -1.1)">{katsu_piece(60)}</g>'))


def katsu_feed():
    return svg(feed_pov(ROUX, f'<g transform="translate(180 -84) rotate(14)">{katsu_piece(40)}</g>', '', 'open'))


def katsu_bite():
    return svg(feed_pov(ROUX, '', f'<g transform="translate(200 -84) rotate(2)">{katsu_piece(1)}</g>', 'bite'))


def katsu_water():
    b = '<rect width="1920" height="600" fill="#efe2c8"/>'
    b += '<rect x="0" y="0" width="760" height="520" fill="#fff6e0"/><rect x="0" y="0" width="760" height="520" fill="none" stroke="#a88a5a" stroke-width="18"/>'
    b += ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#ffffff" opacity=".5"/>' for x, y, r in [(200, 160, 70), (460, 280, 90), (640, 120, 50)])
    b += '<path d="M0 540H1920V1080H0z" fill="#d9ad74"/><path d="M0 540H1920V566H0z" fill="#ecc893"/>'
    b += ''.join(f'<path d="M{960 + (i * 150 - 960) * 1440 / 1980:.0f} 540L{i * 150} 1080" stroke="#b98a52" stroke-width="5"/>' for i in range(-6, 20))
    b += f'<g transform="translate(-980 360) scale(1.0)">{katsu_plate()}</g>'
    b += lassi_glass(1100, 780, 'water')
    return svg(b)


def katsu_counter():
    """the counter two-shot: the counter runs from the front left to the back right (one VP, right), a kitchen wall with
    blank menu boards (their text is JSX, below y=140), her round stool top under her sprite, her shadow to the right."""
    vp = (1700, 420)
    b = '<rect width="1920" height="1080" fill="#efe2c8"/><path d="M0 0H1920V120H0z" fill="#d8c29a"/>'
    b += '<rect x="30" y="150" width="440" height="360" fill="#fff6e0" stroke="#a88a5a" stroke-width="16"/><path d="M250 150V510M30 330H470" stroke="#a88a5a" stroke-width="10"/>'
    b += '<path d="M470 150L1200 480V760L470 510z" fill="#fff6e0" opacity=".2"/>'
    # blank menu boards on the wall, one row
    for x in (560, 780, 1400, 1620):
        b += f'<rect x="{x}" y="170" width="190" height="130" rx="6" fill="#fbf6ea" stroke="#8a6a3a" stroke-width="5"/>'
    # the counter, square to the camera (one VP at the centre, 960/420): the lit top, the darker front face
    b += '<path d="M0 560H1920V640H0z" fill="#d9ad74" stroke="#8a5c32" stroke-width="5"/><path d="M0 562H1920" stroke="#f0cf98" stroke-width="10"/>'
    b += '<path d="M0 640H1920V760H0z" fill="#7a4e2c"/>' + ''.join(f'<path d="M{x} 646V760" stroke="#6a4226" stroke-width="6"/>' for x in range(120, 1920, 240))
    # her katsu plate on the counter (the same sprite, small), in front of her place
    b += f'<g transform="translate(30 440) scale(.26)">{katsu_plate()}</g>'
    # the floor + her stool: the red seat top at y~740 under her sprite, the shadow to her right
    b += '<path d="M0 760H1920V1080H0z" fill="#8a6a4a"/>'
    b += ''.join(f'<path d="M{960 + (x - 960) * 340 / 660:.0f} 760L{x} 1080" stroke="#7a5a3a" stroke-width="4"/>' for x in range(-1600, 3600, 240))
    b += '<path d="M1120 330C1220 350 1270 450 1260 560H1120z" fill="#3a2410" opacity=".22"/>'
    b += '<ellipse cx="950" cy="752" rx="230" ry="36" fill="#c8202e" stroke="#6a1010" stroke-width="6"/><ellipse cx="930" cy="744" rx="150" ry="16" fill="#e84a52"/>'
    b += '<path d="M940 788V1080" stroke="#8e96a1" stroke-width="30"/><ellipse cx="990" cy="1060" rx="200" ry="30" fill="#3a2410" opacity=".3"/>'
    return svg(b)


SHOTS = {
    'thali': thali, 'naan-lift': naan_lift, 'sauce': sauce, 'naan-dip': naan_dip, 'naan-feed': naan_feed, 'butter-bite': butter_bite,
    'lassi': lassi, 'butter-table': butter_table,
    'napkin': lambda: napkin_shot(cloth(), f'<g transform="translate(-700 560) scale(.8)">{thali_group()}</g>', BUTTER),
    'katsu-dish': katsu_dish, 'katsu-cut': katsu_cut, 'katsu-pour': katsu_pour, 'katsu-close': katsu_close,
    'katsu-feed': katsu_feed, 'katsu-bite': katsu_bite, 'katsu-water': katsu_water, 'katsu-counter': katsu_counter,
    'katsu-napkin': lambda: napkin_shot(counter(), f'<g transform="translate(-700 560) scale(.8)">{katsu_plate()}</g>', ROUX),
    'napkin-fold': lambda: napkin_fold(counter(), f'<g transform="translate(-600 520) scale(.8)">{katsu_plate()}</g>', ROUX),
}
only = sys.argv[2:]
for k, f in SHOTS.items():
    if only and k not in only: continue
    s = f()
    open(os.path.join(OUT, k + '.svg'), 'w').write(s)
    print(k, len(s) // 1024, 'KB')
