# CURRY r2 (Tony's orders 1 + 2): HAND-DRAWN hybrid SVGs, flat cel (base + one shade + one highlight, thin dark line),
# composed after the anime refs a1342f38 / 9fbdfc30 / 2ece11eb (steel thali, teardrop naan draped over the edge, char
# blisters, butter pat) and cfaf5b97 / 7350552b (stemmed lassi glass, straw, mint + mango slice). No ref pixels are used.
# Out: <out>/thali.svg, <out>/lassi.svg (1920x1080). Then render.mjs -> PNG -> vt.py (vtracer) -> public trace.
# usage: python3 hand.py <out dir>
import sys, os, random, math

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
LINE = '#5a3620'


def svg(body, defs=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080"><defs>{defs}</defs>{body}</svg>'


def wood(y0=0):
    r = random.Random(3)
    s = f'<rect width="1920" height="1080" fill="#b87a44"/>'
    for i in range(9):  # planks, slightly diagonal (3/4 view)
        y = y0 + i * 132
        s += f'<path d="M0 {y}L1920 {y - 70}" stroke="#8e5a2e" stroke-width="6"/>'
        for _ in range(4):
            yy = y + r.randint(18, 110); x = r.randint(-200, 1500); w = r.randint(260, 700)
            s += f'<path d="M{x} {yy}l{w} {-w * 0.036:.0f}" stroke="{r.choice(["#c98c52", "#a86a38"])}" stroke-width="{r.randint(4, 10)}" stroke-linecap="round" opacity=".7"/>'
    return s


def katori(cx, cy, rx, ry, food, food2, top, extra=''):
    """a steel cup: back rim, the food surface, the front wall (cel: base + shade band + a white glint)."""
    h = ry * 1.25
    return f'''<g>
  <ellipse cx="{cx + 14}" cy="{cy + h + 10}" rx="{rx * 0.95}" ry="{ry * 0.8}" fill="#6a6f78" opacity=".35"/>
  <path d="M{cx - rx} {cy}V{cy + h * 0.75}C{cx - rx} {cy + h + ry * 0.45} {cx + rx} {cy + h + ry * 0.45} {cx + rx} {cy + h * 0.75}V{cy}z" fill="#b9bfc8" stroke="#6f7680" stroke-width="3"/>
  <path d="M{cx + rx * 0.35} {cy + ry * 0.9}V{cy + h + ry * 0.2}C{cx + rx * 0.7} {cy + h + ry * 0.05} {cx + rx} {cy + h} {cx + rx} {cy + h * 0.75}V{cy}z" fill="#8e96a1"/>
  <path d="M{cx - rx * 0.7} {cy + ry * 0.6}V{cy + h + ry * 0.1}" stroke="#f4f7fb" stroke-width="{rx * 0.09:.0f}" stroke-linecap="round" opacity=".9"/>
  <ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#dfe3e8" stroke="#6f7680" stroke-width="3"/>
  <ellipse cx="{cx}" cy="{cy + ry * 0.06}" rx="{rx * 0.86}" ry="{ry * 0.78}" fill="{food}"/>
  <path d="M{cx - rx * 0.86} {cy + ry * 0.06}A{rx * 0.86} {ry * 0.78} 0 0 1 {cx + rx * 0.86} {cy + ry * 0.06}A{rx * 0.86} {ry * 0.5} 0 0 0 {cx - rx * 0.86} {cy + ry * 0.06}z" fill="{food2}"/>
  <ellipse cx="{cx - rx * 0.3}" cy="{cy + ry * 0.25}" rx="{rx * 0.22}" ry="{ry * 0.16}" fill="{top}" opacity=".9"/>
  {extra}
</g>'''


def naan(pts_seed, d, clip_id, bubbles, spots, butter=None, base='#f4dca6', lit='#fcecc8', rim='#d59a52'):
    r = random.Random(pts_seed)
    s = f'<clipPath id="{clip_id}"><path d="{d}"/></clipPath>'
    s += f'<path d="{d}" transform="translate(6 22)" fill="{rim}" stroke="{LINE}" stroke-width="4"/>'  # the thick underside
    s += f'<path d="{d}" fill="{base}" stroke="{LINE}" stroke-width="4" stroke-linejoin="round"/>'
    g = f'<g clip-path="url(#{clip_id})">'
    def blob(x, y, k, sx=1.8, sy=0.8):  # a soft irregular splotch: 10 points, gentle radius noise, smooth curve
        pts = [(x + math.cos(i / 10 * math.tau) * k * sx * (0.7 + r.random() * 0.5), y + math.sin(i / 10 * math.tau) * k * sy * (0.7 + r.random() * 0.5)) for i in range(10)]
        m = [((pts[i][0] + pts[(i + 1) % 10][0]) / 2, (pts[i][1] + pts[(i + 1) % 10][1]) / 2) for i in range(10)]
        return f'M{m[-1][0]:.0f} {m[-1][1]:.0f}' + ''.join(f'Q{pts[i][0]:.0f} {pts[i][1]:.0f} {m[i][0]:.0f} {m[i][1]:.0f}' for i in range(10)) + 'z'
    for (x, y, rx, ry) in bubbles:  # puffed domes (ref 2ece11eb): a soft lit top, a thin toasted outline, a charred crown
        g += f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{lit}" stroke="#c98a48" stroke-width="3"/>'
        g += f'<path d="{blob(x + rx * 0.15, y - ry * 0.3, rx * 0.32, 1.4, 0.6)}" fill="#c07632"/>'
        g += f'<path d="{blob(x + rx * 0.2, y - ry * 0.35, rx * 0.16, 1.4, 0.6)}" fill="#6a3210"/>'
    for (x, y, k) in spots:  # char spots between the domes (refs a1342f38 / 9fbdfc30): a burnt halo + a dark core
        g += f'<path d="{blob(x, y, k)}" fill="#b86c30"/>'
        g += f'<path d="{blob(x + k * 0.2, y, k * 0.5)}" fill="#5e2c0e"/>'
    g += f'<path d="{d}" fill="none" stroke="#fff6de" stroke-width="10" opacity=".55" transform="translate(-4 -6)" clip-path="url(#{clip_id})"/>'
    g += '</g>'
    s += g
    if butter:
        bx, by, bw = butter
        s += f'''<ellipse cx="{bx}" cy="{by + bw * 0.35}" rx="{bw * 1.05}" ry="{bw * 0.5}" fill="#ffd24a" opacity=".75"/>
<ellipse cx="{bx - bw * 0.3}" cy="{by + bw * 0.3}" rx="{bw * 0.45}" ry="{bw * 0.14}" fill="#fff6c8" opacity=".9"/>
<g transform="translate({bx} {by}) rotate(-8)">
  <rect x="{-bw * 0.5}" y="{-bw * 0.2}" width="{bw}" height="{bw * 0.5}" rx="{bw * 0.12}" fill="#f2c64a" stroke="{LINE}" stroke-width="3"/>
  <rect x="{-bw * 0.5}" y="{-bw * 0.5}" width="{bw}" height="{bw * 0.5}" rx="{bw * 0.12}" fill="#ffe98c" stroke="{LINE}" stroke-width="3"/>
  <rect x="{-bw * 0.38}" y="{-bw * 0.42}" width="{bw * 0.34}" height="{bw * 0.1}" rx="{bw * 0.05}" fill="#fffbe6"/>
</g>'''
    return s


def thali():
    random.seed(1)
    b = wood()
    # the tray: contact shadow, rim, floor, the inner-wall shade (the light comes from the top-left window)
    b += '<ellipse cx="900" cy="590" rx="730" ry="370" fill="#4a2a14" opacity=".38"/>'
    b += '<ellipse cx="870" cy="540" rx="720" ry="360" fill="#c3c8cf" stroke="#636a74" stroke-width="4"/>'
    b += '<path d="M150 540A720 360 0 0 0 1590 540A720 330 0 0 1 150 540z" fill="#9aa1ab"/>'
    b += '<ellipse cx="870" cy="528" rx="650" ry="318" fill="#e4e8ec" stroke="#8a919b" stroke-width="3"/>'
    b += '<path d="M220 528A650 318 0 0 1 1520 528A650 280 0 0 0 220 528z" fill="#c9ced5"/>'
    b += '<path d="M330 760C520 850 900 870 1180 840" stroke="#ffffff" stroke-width="14" fill="none" stroke-linecap="round" opacity=".85"/>'
    b += '<path d="M300 300C420 240 560 214 700 204" stroke="#ffffff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/>'
    # three katoris across the back: butter chicken | saag | dal (cilantro + cream on the butter chicken)
    cream = '<path d="M{0} {1}c30-14 60-6 80 6" stroke="#fff3dc" stroke-width="9" fill="none" stroke-linecap="round"/>'
    leaves = ''.join(f'<circle cx="{x}" cy="{y}" r="6" fill="#3e7a22"/>' for x, y in [(520, 300), (560, 316), (600, 296), (545, 286)])
    b += katori(560, 320, 170, 66, '#e2641c', '#b8420e', '#ffb070', cream.format(500, 330) + leaves)
    b += katori(900, 250, 160, 60, '#4f7d26', '#355a18', '#8fbf4a', '<circle cx="930" cy="262" r="12" fill="#fff3dc"/>')
    b += katori(1230, 300, 150, 58, '#e8b43a', '#c38a1e', '#ffe08a', '<circle cx="1200" cy="296" r="6" fill="#b8420e"/><circle cx="1260" cy="310" r="6" fill="#b8420e"/>')
    # rice mound (front-left): cel dome + grain ticks
    r = random.Random(9)
    b += '<path d="M230 560C240 470 380 430 470 450C560 470 590 530 570 590C500 630 300 630 230 560z" fill="#fbf7ec" stroke="#8a7a5a" stroke-width="3"/>'
    b += '<path d="M230 560C300 620 500 630 570 590C530 565 380 575 230 560z" fill="#e3dac4"/>'
    b += ''.join(f'<path d="M{x} {y}l{r.choice([-9, 9])} 4" stroke="#d8ceb4" stroke-width="5" stroke-linecap="round"/>' for x, y in [(r.randint(270, 540), r.randint(470, 590)) for _ in range(40)])
    # the spoon (steel), right of the cups
    b += '<path d="M1330 420L1600 330" stroke="#8e96a1" stroke-width="22" stroke-linecap="round"/><path d="M1330 420L1600 330" stroke="#e8ecf0" stroke-width="10" stroke-linecap="round"/>'
    b += '<ellipse cx="1300" cy="432" rx="58" ry="32" transform="rotate(-18 1300 432)" fill="#c9ced5" stroke="#636a74" stroke-width="3"/><ellipse cx="1290" cy="428" rx="22" ry="10" transform="rotate(-18 1290 428)" fill="#ffffff"/>'
    # THE NAAN: one long teardrop, tip at the left, the round end draped over the right edge of the tray
    d = 'M520 730C640 610 900 560 1200 520C1460 486 1720 470 1790 600C1840 700 1720 800 1480 812C1180 828 820 800 600 770C600 770 540 760 520 730z'
    # the drape: the part past the rim (x > 1560) falls away, so it is darker and bends down
    b += '<path d="M1580 520C1700 500 1800 540 1810 640C1820 760 1760 860 1640 900L1560 820z" fill="#4a2a14" opacity=".35"/>'
    bub = [(720, 650, 80, 34), (900, 700, 70, 30), (980, 620, 90, 36), (1150, 660, 100, 40), (1180, 760, 70, 26),
           (1340, 600, 90, 40), (1420, 720, 110, 42), (1600, 600, 90, 44), (1650, 730, 80, 34), (820, 760, 60, 20)]
    sp = [(640, 700, 12), (600, 730, 9), (840, 740, 12), (1380, 540, 12), (1600, 680, 12), (1760, 640, 12), (1120, 790, 10), (1450, 790, 14), (1640, 560, 14), (780, 690, 16), (880, 640, 10), (1040, 690, 18), (1110, 600, 12), (1260, 700, 20), (1300, 780, 12),
          (1480, 650, 16), (1540, 770, 14), (1700, 650, 18), (1730, 560, 10), (980, 770, 12), (700, 740, 10)]
    # the hanging lip: past the rim the naan bends down over the tray edge, its toasted underside shows
    b += f'<path d="M1560 800C1690 806 1790 740 1812 640C1840 770 1790 900 1660 950C1610 910 1590 860 1560 800z" fill="#c98640" stroke="{LINE}" stroke-width="4"/>'
    b += '<path d="M1700 860l40-20M1660 900l30-6" stroke="#6a3410" stroke-width="10" stroke-linecap="round"/>'
    b += naan(5, d, 'naan-c', bub, sp, butter=(1240, 640, 96), base='#f1cf8a', lit='#fbe5b4', rim='#c98640')
    b += '<path d="M1560 500C1600 600 1600 740 1560 820" stroke="#b57a3a" stroke-width="10" fill="none" opacity=".55"/>'  # the fold on the rim
    # window light: one soft warm glint across the top-left
    b += '<path d="M0 0H760L0 420z" fill="#fff4d8" opacity=".12"/>'
    return svg(b)


def lassi():
    b = '<rect width="1920" height="1080" fill="#f1d7b0"/>'
    # the back wall + the window (bokeh = flat discs: the shot is focused on the glass)
    b += '<rect x="1180" y="0" width="740" height="520" fill="#fff4dc"/><rect x="1180" y="0" width="740" height="520" fill="none" stroke="#c9a47a" stroke-width="18"/>'
    b += ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#ffffff" opacity=".45"/>' for x, y, r in [(1300, 140, 60), (1500, 260, 80), (1720, 120, 50), (1640, 380, 70), (200, 180, 70), (420, 90, 40)])
    b += '<rect x="0" y="0" width="1180" height="540" fill="#e9c79a" opacity=".6"/>'
    # the orange tablecloth (same cloth as curry-butter-table), a lit front edge
    b += '<path d="M0 560H1920V1080H0z" fill="#d6603a"/><path d="M0 560H1920V586H0z" fill="#ee8a52"/>'
    b += '<path d="M0 820C600 800 1300 800 1920 830V1080H0z" fill="#c24f2e"/>'
    # scale: the steel tray's rim + the naan tip, cut by the left frame edge (the tray is much wider than the glass)
    b += '<ellipse cx="-60" cy="780" rx="560" ry="230" fill="#4a2a14" opacity=".3"/>'
    b += '<ellipse cx="-80" cy="750" rx="560" ry="230" fill="#c3c8cf" stroke="#636a74" stroke-width="4"/>'
    b += '<ellipse cx="-80" cy="740" rx="500" ry="200" fill="#e4e8ec" stroke="#8a919b" stroke-width="3"/>'
    b += naan(7, 'M-40 700C120 620 300 620 420 660C470 690 440 740 360 760C200 790 40 790 -40 760z', 'naan-l',
              [(120, 690, 70, 28), (300, 690, 60, 24)], [(200, 700, 12), (360, 700, 10), (80, 730, 12)])
    # the glass: contact shadow + a long cast shadow to the right (window light from the top-left)
    cx = 960
    b += f'<path d="M{cx - 60} 772L{cx + 420} 790L{cx + 380} 740L{cx + 40} 752z" fill="#8a2f18" opacity=".35"/>'
    b += f'<ellipse cx="{cx + 10}" cy="770" rx="150" ry="26" fill="#5a1c0c" opacity=".55"/>'
    # foot + stem
    b += f'<ellipse cx="{cx}" cy="758" rx="128" ry="24" fill="#e8f0f2" stroke="#7a8a90" stroke-width="3" opacity=".95"/>'
    b += f'<ellipse cx="{cx}" cy="752" rx="96" ry="14" fill="#cfdde2"/>'
    b += f'<path d="M{cx - 18} 600L{cx - 14} 748H{cx + 14}L{cx + 18} 600z" fill="#dfe9ec" stroke="#7a8a90" stroke-width="3"/>'
    b += f'<path d="M{cx - 6} 610V742" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>'
    # the tulip bowl: glass outline, then the lassi clipped inside (cel: lit left, base, shade right, a thick foam top)
    bowl = f'M{cx - 150} 190C{cx - 172} 300 {cx - 176} 420 {cx - 120} 520C{cx - 80} 588 {cx - 40} 606 {cx} 606C{cx + 40} 606 {cx + 80} 588 {cx + 120} 520C{cx + 176} 420 {cx + 172} 300 {cx + 150} 190z'
    b += f'<clipPath id="bowl"><path d="{bowl}"/></clipPath>'
    b += f'<path d="{bowl}" fill="#fff8ec" opacity=".35"/>'
    b += '<g clip-path="url(#bowl)">'
    b += f'<rect x="{cx - 200}" y="238" width="400" height="400" fill="#f7a21e"/>'
    b += f'<path d="M{cx + 60} 238C{cx + 110} 350 {cx + 110} 480 {cx + 40} 620H{cx + 220}V238z" fill="#e0800e"/>'
    b += f'<path d="M{cx - 150} 238C{cx - 150} 360 {cx - 120} 470 {cx - 70} 560L{cx - 110} 620H{cx - 220}V238z" fill="#ffc24e"/>'
    b += f'<ellipse cx="{cx}" cy="238" rx="164" ry="24" fill="#ffd57a"/><ellipse cx="{cx - 20}" cy="236" rx="120" ry="14" fill="#ffe3a0"/>'
    b += ''.join(f'<path d="M{x} {y}l12 -3" stroke="{c}" stroke-width="5" stroke-linecap="round"/>' for x, y, c in [(cx - 60, 238, '#6aa640'), (cx + 30, 232, '#c8401a'), (cx - 10, 244, '#6aa640'), (cx + 70, 240, '#c8401a'), (cx - 100, 240, '#6aa640')])
    b += '</g>'
    # the glass skin: the rim ellipse, one long gloss stripe on the left, a short one on the right
    b += f'<path d="{bowl}" fill="none" stroke="#7a8a90" stroke-width="4"/>'
    b += f'<ellipse cx="{cx}" cy="190" rx="150" ry="22" fill="none" stroke="#ffffff" stroke-width="6"/><ellipse cx="{cx}" cy="190" rx="150" ry="22" fill="none" stroke="#7a8a90" stroke-width="2"/>'
    b += f'<path d="M{cx - 124} 250C{cx - 138} 340 {cx - 130} 430 {cx - 96} 500" stroke="#ffffff" stroke-width="22" fill="none" stroke-linecap="round" opacity=".9"/>'
    b += f'<path d="M{cx - 96} 540l14 18" stroke="#ffffff" stroke-width="12" stroke-linecap="round" opacity=".8"/>'
    b += f'<path d="M{cx + 124} 270C{cx + 132} 320 {cx + 132} 360 {cx + 126} 400" stroke="#fff6e0" stroke-width="10" fill="none" stroke-linecap="round" opacity=".75"/>'
    # the straw: yellow with white stripes, in the drink, leaning right
    b += f'<g transform="rotate(20 {cx + 40} 230)"><rect x="{cx + 26}" y="20" width="30" height="300" rx="10" fill="#ffd92e" stroke="{LINE}" stroke-width="3"/>'
    b += ''.join(f'<path d="M{cx + 26} {y}l30 -14" stroke="#ffffff" stroke-width="8"/>' for y in range(50, 240, 34)) + '</g>'
    # mint on the left of the rim, a mango slice cut onto the right of the rim
    b += f'<path d="M{cx - 90} 214C{cx - 170} 130 {cx - 90} 80 {cx - 40} 150C{cx - 50} 190 {cx - 70} 210 {cx - 90} 214z" fill="#3f8a2c" stroke="#24541a" stroke-width="3"/><path d="M{cx - 70} 214C{cx - 120} 150 {cx - 60} 110 {cx - 30} 170C{cx - 40} 196 {cx - 56} 210 {cx - 70} 214z" fill="#4c9a34" stroke="#24541a" stroke-width="3"/><path d="M{cx - 66} 206L{cx - 40} 150" stroke="#8fd060" stroke-width="4"/>'
    b += f'<path d="M{cx - 60} 216C{cx - 10} 170 {cx + 10} 120 {cx - 20} 110C{cx - 50} 150 {cx - 60} 190 {cx - 60} 216z" fill="#5fb040" stroke="#24541a" stroke-width="3"/>'
    b += f'<path d="M{cx + 110} 196C{cx + 130} 110 {cx + 220} 90 {cx + 250} 140C{cx + 240} 200 {cx + 190} 230 {cx + 140} 230L{cx + 150} 196z" fill="#ffae2a" stroke="#b8600e" stroke-width="4"/>'
    b += f'<path d="M{cx + 150} 196C{cx + 170} 140 {cx + 210} 126 {cx + 236} 144" stroke="#ffd98a" stroke-width="10" fill="none" stroke-linecap="round"/>'
    b += f'<path d="M{cx + 250} 140C{cx + 240} 200 {cx + 190} 230 {cx + 140} 230" stroke="#e8820e" stroke-width="10" fill="none"/>'
    b += '<path d="M0 0H700L0 380z" fill="#fff4d8" opacity=".14"/>'
    return svg(b)


open(os.path.join(OUT, 'thali.svg'), 'w').write(thali())
open(os.path.join(OUT, 'lassi.svg'), 'w').write(lassi())
print('ok')
