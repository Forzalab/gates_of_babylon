# CURRY r3: every food / hand / face shot. The FOOD is vtraced from Tony's refs (sprites.py -> ../sprites/, R3-AUDIT.md):
# the naan, the katori, the katsu plate + fukujinzuke are one sprite each, nested into every shot. Hands, faces, the
# tray, surfaces and props stay hand-drawn flat cel. Written straight to public/date-beta/trace/curry/<id>.svg.
# SCALE: every shot has a px/cm (the food's real size); hands are 18 cm long = 250 hand units, so a hand's scale and a
# held piece's scale follow from it (HS_*, PK_*): the piece in her fingers is the same size as where it was torn.
#
# PHYSICS (SHOP-PHYSICS-CRITIQUE.md, applied to curry):
# - ONE light for the whole visit: the 3:00 PM sun comes through the shop window at the upper LEFT. Highlights sit on
#   top-left edges, shades on bottom-right edges, and every cast shadow falls to the lower RIGHT (+dx, +dy).
# - ONE vanishing point per drawing (cloth weave / counter planks radiate from VP). Close shots are CROPS of the hero
#   drawing (a scale/translate of the SAME group), so the dish is the same sprite in every shot.
# - YOUR hands have 5 fingers, joined to a wrist and a sleeve that runs off the frame edge. HER hands are always her PINS
#   (pin_hold: a lead + a round nub, Nanda canon; H2 10-01). Food touches fingers, a nub or a surface.
# - No text is drawn here (the shop signs are JSX, below the y=140 HUD band). Faces + hands stay above y=740 (the box).
# usage: python3 draw.py <out dir>
import sys, os, re, json, random, math

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
LINE = '#5a3620'
SH = '#3a1606'          # the cast-shadow ink (multiplied by opacity)
SDX, SDY = 26, 34       # every cast shadow: down-right of its object (window light from the upper left)


TINT = {'b': '#ffe4c8', 'k': '#fff0da'}   # the per-scene grade on every cel (NAND's warm lamp, OR OR's pale noon)
SIL = f'<filter id="sil" x="-5%" y="-5%" width="110%" height="110%"><feFlood flood-color="{SH}"/><feComposite operator="in" in2="SourceAlpha"/></filter>'   # a sprite's own silhouette = its cast shadow
# a lifted cel's shadow: the same silhouette, softened (a hand 5-8 cm above the naan throws a soft-edged shadow)
SIL += f'<filter id="silb" x="-10%" y="-10%" width="120%" height="120%"><feFlood flood-color="{SH}"/><feComposite operator="in" in2="SourceAlpha"/><feGaussianBlur stdDeviation="9"/></filter>'
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import grip   # NAAN-HANDS: the anatomical cel hand in cm (grips from Tony's hand refs)


def svg(body, defs=''):
    defs += ''.join(f'<filter id="tint-{k}"><feFlood flood-color="{c}"/><feBlend mode="multiply" in2="SourceGraphic"/><feComposite operator="in" in2="SourceAlpha"/></filter>' for k, c in TINT.items())
    defs += ''.join(f'<g id="S-{k}">{RAW[k]}</g>' for k in META if f'href="#S-{k}"' in body)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080"><defs>{SIL}{defs}</defs>{body}</svg>'


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
def cloth():
    """NAND HOUSE's table: the pure vtrace of images(181)'s wood table (sprites.py bg-nand). No hand repaint."""
    return spr('bg-nand', 0, 0, 1920, shadow=0)


def counter():
    """OR OR CURRY's counter: the pure vtrace of images(183)'s pale plank table (sprites.py bg-oror)."""
    return spr('bg-oror', 0, 0, 1920, shadow=0)


def shadow(d, o=.32, blur=False):
    return f'<path d="{d}" transform="translate({SDX} {SDY})" fill="{SH}" opacity="{o}"/>'


# ---------------------------------------------------------------- the butter thali (hero) + its parts
# ---------------------------------------------------------------- r3: the TRACED food sprites (sprites.py, from the refs)
# The naan (images 179), the steel katori (181), the katsu plate + its fukujinzuke dish (183) are vtraced from Tony's
# refs, so their shape / proportion / colour / texture follow the ref. Each is ONE sprite, nested (<svg x y w h viewBox>)
# into every shot that shows it, so the dish is identical from the hero shot to the bite.
SPR_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sprites')
META = json.load(open(os.path.join(SPR_DIR, 'sprites.json')))
RAW = {k: re.search(r'<svg[^>]*>(.*)</svg>', open(os.path.join(SPR_DIR, k + '.svg')).read(), re.S).group(1) for k in META}
BODY = {k: f'<use href="#S-{k}"/>' for k in META}   # every use points at ONE copy in <defs> (svg() adds the ones used)


def spr(name, x, y, w, inner=None, shadow=0.34):
    """the sprite at (x, y), w px wide, with its cast shadow (its own silhouette, down-right: the window light)."""
    W, H = META[name]; h = w * H / W
    body = inner if inner is not None else BODY[name]
    s = ''
    if shadow:
        s += f'<svg x="{x + SDX}" y="{y + SDY}" width="{w}" height="{h:.1f}" viewBox="0 0 {W} {H}" overflow="visible" filter="url(#sil)" opacity="{shadow}">{body}</svg>'
    return s + f'<svg x="{x}" y="{y}" width="{w}" height="{h:.1f}" viewBox="0 0 {W} {H}" overflow="visible">{body}</svg>'


# ---- the butter thali, hero coordinates. Real sizes: the naan ~40 cm = 1400 px (35 px/cm), the katori ~13 cm,
# the tray ~40 cm; your / her hand is ~18 cm long = 250 hand units, so the hero hand scale is HS_B = 35 * 18 / 250.
NAAN = (470, 250, 1400)                 # x, y, w: the naan droops off the tray on the right (images 179)
NK = NAAN[2] / META['naan'][0]          # hero px per naan-sprite unit
HS_B = 35 * 18 / 250                    # 2.52: the hand scale in hero px
PK_B = NK / HS_B                        # the torn piece, in hand units (same physical size as on the naan)
KAT = {'butter': (240, 150, 470), 'saag': (730, 96, 390), 'rice': (1130, 130, 360)}   # x, y, w (the SAME katori sprite)
KK = lambda w: w / META['katori-butter'][0]
KFOOD = tuple(v * META['katori-butter'][0] / 260 for v in (135.5, 95.2, 110, 40))   # the curry surface in the katori sprite (cx, cy, rx, ry)
RAG = [(118, 150), (108, 166), (121, 184), (104, 202), (117, 222), (103, 242), (112, 258)]   # the tear, naan-sprite units
TIPC = 'M-20 100L118 140' + ''.join(f'L{x} {y}' for x, y in RAG) + 'L104 290L-20 290Z'
BODYC = 'M118 -20L118 140' + ''.join(f'L{x} {y}' for x, y in RAG) + 'L104 290L500 290L500 -20Z'
TIP_O = (62, 212)                       # the piece's centre (sprite units)


def kfood(name):
    """the hero-px centre + radii of a katori's curry surface."""
    x, y, w = KAT[name]; k = KK(w)
    return x + KFOOD[0] * k, y + KFOOD[1] * k, KFOOD[2] * k, KFOOD[3] * k


def rice_dome(name):
    """the rice in its katori: a lumpy white dome over the rim, grain outlines (katsu-lift rice), shade lower right."""
    cx, cy, rx, ry = kfood(name); r = random.Random(12)
    pts = [(cx + math.cos(t) * rx * 0.98, cy - 10 + math.sin(t) * (ry * 0.9 if math.sin(t) > 0 else ry * 2.4)) for t in [k / 22 * math.tau for k in range(22)]]
    d = bumpy(pts, step=26, bulge=8, seed=4)
    s = f'<path d="{d}" fill="#fbfaf4" stroke="#a8a090" stroke-width="3"/>'
    s += f'<path d="M{cx + rx * .2} {cy - ry * 1.9}C{cx + rx * .8} {cy - ry * 1.4} {cx + rx} {cy - ry * .4} {cx + rx * .9} {cy + ry * .4}C{cx + rx * .6} {cy + ry * .9} {cx} {cy + ry * .8} {cx - rx * .2} {cy + ry * .6}C{cx + rx * .5} {cy} {cx + rx * .6} {cy - ry} {cx + rx * .2} {cy - ry * 1.9}z" fill="#e2dccb"/>'
    for _ in range(46):
        a = r.random() * math.tau; q = r.random() ** .6
        x = cx + math.cos(a) * rx * .85 * q; y = cy - ry * .6 + math.sin(a) * ry * 1.3 * q
        s += f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="11" ry="6" transform="rotate({r.randint(-50, 50)} {x:.0f} {y:.0f})" fill="none" stroke="#cfc8b6" stroke-width="3"/>'
    return s


def naan_body(torn=False):
    """the naan sprite (sprite units). torn = the tip is gone: the rest is clipped along RAG, a pale crumb edge on it."""
    if not torn: return BODY['naan']
    return (f'<clipPath id="nbody"><path d="{BODYC}"/></clipPath><g clip-path="url(#nbody)">{BODY["naan"]}</g>'
            + '<path d="M' + 'L'.join(f'{x + 2} {y}' for x, y in RAG[1:-1]) + '" fill="none" stroke="#fbf0d4" stroke-width="5" stroke-linejoin="round"/>'
            + '<path d="M' + 'L'.join(f'{x} {y}' for x, y in RAG[1:-1]) + f'" fill="none" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')


# NAAN-HANDS: the held food is THE piece that left the notch: the traced sprite itself, clipped by the tear outline
# (naan) / the cut slice (katsu), so its size + shape + char match the hole it left, exactly (R3 drew a separate
# smaller cel: 65 % of the notch's area). All in SCREEN px: G = where the held (torn / near) edge sits, rot = the turn
# of the piece (its far end points along 180 + rot deg), k = screen px per sprite unit.
TIPPOLY = [(0, 209), (12, 188), (35, 172), (70, 160), (118, 152)] + RAG[1:] + [(104, 266), (60, 266), (25, 252), (6, 232)]
PIECES = {   # sprite, outline (sprite units), held point, far end, the sauce coat on the far end
    'naan': ('naan', TIPPOLY, (112, 210), (0, 209), 'M-6 186C18 160 52 164 50 198C54 232 42 262 12 262C-8 250 -12 214 -6 186z'),
    'katsu': ('katsu-plate', None, (388, 140), (318, 118), 'M306 60C330 56 344 80 342 110C344 140 338 170 318 178C300 170 300 90 306 60z'),
}


def piece_xf(kind, G, rot, k, fold=1.0):
    spr_, poly, grip_, far, _c = PIECES[kind]
    return f'translate({G[0]:.1f} {G[1]:.1f}) rotate({rot:.1f}) scale({k:.3f} {k * fold:.3f}) translate({-grip_[0]} {-grip_[1]})'


def piece_pt(kind, G, rot, k, p, fold=1.0):
    """a sprite-unit point of the placed piece -> screen."""
    grip_ = PIECES[kind][2]
    x, y = (p[0] - grip_[0]) * k, (p[1] - grip_[1]) * k * fold
    a = math.radians(rot)
    return (G[0] + x * math.cos(a) - y * math.sin(a), G[1] + x * math.sin(a) + y * math.cos(a))


def food_piece(kind, G, rot, k, sauce=None, fold=1.0, drip=0, uid='p', hide=None):
    """the piece, placed. sauce = the coat on the far end; fold < 1 = folded into a scoop (squashed across, its folded-
    under half shows as a toasted band); drip = a drop falling STRAIGHT DOWN (screen) off the far end, px; hide = a
    screen polygon the piece is hidden inside (the curry it is dipped into: the submerged part)."""
    spr_, poly, grip_, far, coat = PIECES[kind]
    if poly is None: poly = SLICE
    pd = 'M' + 'L'.join(f'{x} {y}' for x, y in poly) + 'Z'
    xf = piece_xf(kind, G, rot, k, fold)
    g = f'<clipPath id="pc{uid}"><path d="{pd}"/></clipPath>'
    body = ''
    if fold < 1:   # the folded-under half: a toasted band below the top layer (the fold's lip)
        body += f'<path d="{pd}" transform="translate(0 {26 if kind == "naan" else 12})" fill="#c98a4a" stroke="{LINE}" stroke-width="{3 / k * 1.2:.2f}"/>'
    body += f'<path d="{pd}" fill="{"#f4d6a0" if kind == "naan" else "#c47c34"}"/><g clip-path="url(#pc{uid})"><use href="#S-{spr_}"/></g>'
    if kind == 'naan':   # the fluffy torn crumb along the tear (pale) + the cel line
        body += '<path d="M' + 'L'.join(f'{x - 2} {y}' for x, y in RAG) + f'" fill="none" stroke="#fdf4e0" stroke-width="{7 / k * 1.4:.2f}" stroke-linejoin="round"/>'
    body += f'<path d="{pd}" fill="none" stroke="{LINE}" stroke-width="{3.2 / k * 1.4:.2f}" stroke-linejoin="round"/>'
    if sauce:
        base, dark, hi = sauce
        body += f'<g clip-path="url(#pc{uid})"><path d="{coat}" fill="{base}" stroke="{dark}" stroke-width="{3 / k * 1.4:.2f}"/></g>'
        c0 = (far[0] + 14, far[1] - 18) if kind == 'naan' else (far[0] + 6, far[1] - 30)
        body += f'<ellipse cx="{c0[0]}" cy="{c0[1]}" rx="{5}" ry="{3}" fill="#ffffff" opacity=".9"/>'
    g += f'<g transform="{xf}">{body}</g>'
    if hide:
        hd = 'M-100 -100H2100V1200H-100Z M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in hide) + 'Z'
        g = f'<clipPath id="hd{uid}"><path d="{hd}" clip-rule="evenodd"/></clipPath><g clip-path="url(#hd{uid})">{g}</g>'
    if sauce and drip:
        base, dark, hi = sauce
        t = piece_pt(kind, G, rot, k, (far[0] + 8, far[1] + (20 if kind == 'naan' else 10)), fold)
        g += (f'<path d="M{t[0] - 9:.0f} {t[1]:.0f}C{t[0] - 8:.0f} {t[1] + drip * .6:.0f} {t[0] - 12:.0f} {t[1] + drip * .8:.0f} {t[0] - 2:.0f} {t[1] + drip:.0f}'
              f'C{t[0] + 8:.0f} {t[1] + drip * .8:.0f} {t[0] + 6:.0f} {t[1] + drip * .6:.0f} {t[0] + 7:.0f} {t[1]:.0f}z" fill="{base}" stroke="{dark}" stroke-width="3"/>'
              f'<ellipse cx="{t[0] - 2:.0f}" cy="{t[1] + drip + 8:.0f}" rx="11" ry="14" fill="{base}" stroke="{dark}" stroke-width="3"/><ellipse cx="{t[0] - 6:.0f}" cy="{t[1] + drip + 2:.0f}" rx="3" ry="4" fill="#ffffff"/>')
    return g


def piece_sil(kind, G, rot, k, fold=1.0):
    """the placed piece's outline (for its cast shadow)."""
    poly = PIECES[kind][1] or SLICE
    return f'<path d="M' + 'L'.join(f'{x} {y}' for x, y in poly) + f'Z" transform="{piece_xf(kind, G, rot, k, fold)}" fill="#000"/>'


def surface_hide(cx, cy, rx, ry, ye, down=260):
    """the region under a curry surface (ellipse) below the line y = ye, down through the bowl's front wall: a dipped
    piece is hidden there (it is under the curry / behind the wall)."""
    yy = min(max(ye, cy), cy + ry * .98)
    hw = rx * math.sqrt(max(0, 1 - ((yy - cy) / ry) ** 2))
    return [(cx + hw, ye), (cx + hw, cy + ry + down), (cx - hw, cy + ry + down), (cx - hw, ye)]


def meniscus(x, y, w, food):
    """the curry rising round the piece where it goes in (a lit lip) + a ring on the surface."""
    base, dark, hi = food
    return (f'<ellipse cx="{x:.0f}" cy="{y + 4:.0f}" rx="{w * .95:.0f}" ry="{w * .26:.0f}" fill="none" stroke="{hi}" stroke-width="7" opacity=".8"/>'
            f'<path d="M{x - w * .55:.0f} {y:.0f}Q{x:.0f} {y - w * .22:.0f} {x + w * .55:.0f} {y:.0f}" stroke="{base}" stroke-width="{w * .18:.0f}" fill="none" stroke-linecap="round"/>'
            f'<path d="M{x - w * .45:.0f} {y - 2:.0f}Q{x:.0f} {y - w * .2:.0f} {x + w * .4:.0f} {y - 2:.0f}" stroke="{hi}" stroke-width="5" fill="none" stroke-linecap="round"/>')


def tray():
    """the round steel thali tray (hero): a rim ellipse, its underside shade, the inner well (upper-left wall in shade)."""
    b = f'<ellipse cx="{820 + SDX}" cy="{560 + SDY + 16}" rx="708" ry="352" fill="{SH}" opacity=".36"/>'
    b += '<ellipse cx="820" cy="560" rx="700" ry="350" fill="#c3c8cf" stroke="#636a74" stroke-width="4"/>'
    b += '<path d="M120 560A700 350 0 0 0 1520 560A700 320 0 0 1 120 560z" fill="#9aa1ab"/>'
    b += '<ellipse cx="820" cy="548" rx="632" ry="310" fill="#e4e8ec" stroke="#8a919b" stroke-width="3"/>'
    b += '<path d="M188 548A632 310 0 0 1 1452 548A632 272 0 0 0 188 548z" fill="#c9ced5"/>'
    b += '<path d="M300 780C480 860 860 880 1140 850" stroke="#ffffff" stroke-width="14" fill="none" stroke-linecap="round" opacity=".85"/>'
    return b


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


def thali_group(torn=False, part='all'):
    """the whole steel thali in hero coordinates (no background). Crops use it with a transform.
    part: 'all' | 'base' (tray + katori, no naan) | 'naan' (the naan alone): R5 draws the tear hands BETWEEN them."""
    b = ''
    if part != 'naan':
        b = tray()
        for k in ('saag', 'rice', 'butter'):
            x, y, w = KAT[k]
            b += spr('katori-' + k, x, y, w, shadow=.3)
            if k == 'butter': cx, cy, rx, ry = kfood(k); b += butter_curry(cx, cy, rx * .9, ry * .8)
            if k == 'rice': b += rice_dome(k)
    if part != 'base':
        x, y, w = NAAN
        b += spr('naan', x, y, w, inner=naan_body(torn), shadow=.36)
    return b


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


def cel(markup, scene, lift=(0, 0), op=.3):
    """a cel on the traced bg: graded with the scene tint; its cast shadow (its silhouette) falls down-right like the
    food's, further when it is lifted off the table (lift = extra offset)."""
    sh = f'<g transform="translate({SDX + lift[0]} {SDY + lift[1]})" filter="url(#sil)" opacity="{op}">{markup}</g>' if op else ''
    return sh + f'<g filter="url(#tint-{scene})">{markup}</g>'


def boat_cel(rb, scene):
    """the boat casts its shadow; the ribbon is drawn (tinted) with none."""
    rib, b = rb
    sh = f'<g transform="translate({SDX + 80} {SDY + 140})" filter="url(#sil)" opacity="0.2">{b}</g>'
    return sh + f'<g filter="url(#tint-{scene})">{rib}{b}</g>'


def hand_at(P, ang, s, pose, who, flip=False, held='', nails=True, on_top=False):
    """hand() placed by its PINCH point P (fingertip contact) instead of its wrist. on_top = the held piece is drawn over
    the fingers (a small piece the long fingers would hide), still pinned to the same pinch point."""
    fy = -1 if flip else 1
    px, py = 168 * s, -78 * s * fy
    a = math.radians(ang)
    wx = P[0] - (px * math.cos(a) - py * math.sin(a)); wy = P[1] - (px * math.sin(a) + py * math.cos(a))
    if on_top:
        return hand(round(wx), round(wy), ang, s, pose, who, flip, '', nails) + f'<g transform="translate({round(wx)} {round(wy)}) rotate({ang}) scale({s} {s * fy})">{held}</g>'
    return hand(round(wx), round(wy), ang, s, pose, who, flip, held, nails)


def aim(ang, target, flip=False):
    """the held_piece rot that points a piece's far tip (its -x end) at screen angle `target` in a hand at `ang`."""
    return (180 + ang - target) if flip else (target - ang - 180)


def held_piece(svg_piece, k, rot=0, grip=(50, -4)):
    """a food piece in a hand's own units: its HELD edge (grip, piece units) sits in the pinch (168,-78)."""
    return f'<g transform="translate(168 -78) rotate({rot}) scale({k}) translate({-grip[0]} {-grip[1]})">{svg_piece}</g>'


# ---------------------------------------------------------------- her face, extreme close-up (Nanda's IC-chip face)
# r3: the ECU keeps her SPRITE proportions (nanda.js): eye spacing : eye-to-mouth = 24 : 16, the cheeks between them,
# hatch blush; the eyes are the sprite's own faces (feed = 'anya-smile' glossy eyes, bite = 'big-eyes-peek' stare with
# raised brows). EX/EY = the eyes, MX/MY = the mouth (above the box line y=740).
EX, EY, MX, MY = (680, 1240), 300, 960, 560


def big_eye(ex, ey, rx, ry, ink='#6b0f42'):
    return (f'<ellipse cx="{ex}" cy="{ey}" rx="{rx}" ry="{ry}" fill="{ink}"/><ellipse cx="{ex}" cy="{ey + ry * .35}" rx="{rx * .7}" ry="{ry * .45}" fill="#a0306a"/>'
            f'<ellipse cx="{ex - rx * .32}" cy="{ey - ry * .38}" rx="{rx * .36}" ry="{rx * .36}" fill="#ffffff"/><ellipse cx="{ex + rx * .35}" cy="{ey + ry * .3}" rx="{rx * .14}" ry="{rx * .14}" fill="#ffffff" opacity=".85"/>'
            f'<path d="M{ex + rx * .7} {ey - ry * .8}l{rx * .5} {-ry * .3}" stroke="{ink}" stroke-width="12" stroke-linecap="round"/>')


def face(mode, food, food_piece=''):
    """mode 'open' = mouth open, waiting (Feed me); 'bite' = her lips close ON the food: the part inside is hidden behind
    the lips (clipped), and no lip line crosses the food."""
    base, dark, hi = food
    b = '<rect width="1920" height="1080" fill="#fff4f9"/>'
    b += '<radialGradient id="fg" cx=".42" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#fbe3ee"/></radialGradient><rect width="1920" height="1080" fill="url(#fg)"/>'
    for x in (40, 1830):
        b += f'<rect x="{x}" y="0" width="50" height="1080" fill="#d4197e"/>'
        b += ''.join(f'<rect x="{x - 26 if x < 900 else x + 50}" y="{y}" width="26" height="22" rx="3" fill="#cfc4e6" stroke="#7a5aa0" stroke-width="3"/>' for y in (180, 330, 480, 630))
    zz = 'M90 0V110' + ''.join(f'L{90 + i * 145 + 72} {180 if i % 2 else 150}L{90 + (i + 1) * 145} 110' for i in range(12)) + 'V0z'
    b += f'<path d="{zz}" fill="#e4e6f2" stroke="#d4197e" stroke-width="16" stroke-linejoin="round"/>'
    # cheeks (between the eyes and the mouth, as on the sprite): a soft flush + the vertical hatch
    for cx in (500, 1420):
        b += f'<ellipse cx="{cx}" cy="470" rx="150" ry="62" fill="#ffa6cf" opacity=".75"/>'
        b += ''.join(f'<path d="M{cx + dx} 438v56" stroke="#6b0f42" stroke-width="7" stroke-linecap="round" opacity=".5"/>' for dx in (-60, -20, 20, 60))
    for ex in EX:
        if mode == 'bite':   # 'big-eyes-peek': bigger eyes, raised brows, on you the whole time
            b += big_eye(ex, EY, 92, 118) + f'<path d="M{ex - 80} {EY - 140}Q{ex} {EY - 172} {ex + 80} {EY - 140}" stroke="#6b0f42" stroke-width="14" fill="none" stroke-linecap="round"/>'
        else:                # 'anya-smile' eyes: glossy, two highlights, a lash flick
            b += big_eye(ex, EY, 78, 100)
    b += f'<path d="M{MX - 4} {MY - 110}v26" stroke="#6b0f42" stroke-width="8" stroke-linecap="round"/>'   # the nose tick
    if mode == 'open':
        b += f'<path d="M{MX - 86} {MY - 26}C{MX - 60} {MY - 50} {MX + 60} {MY - 50} {MX + 86} {MY - 26}C{MX + 90} {MY + 64} {MX - 90} {MY + 64} {MX - 86} {MY - 26}z" fill="#6b0f42" stroke="#4a0a2e" stroke-width="8" stroke-linejoin="round"/>'
        b += f'<path d="M{MX - 52} {MY + 36}C{MX - 20} {MY + 8} {MX + 30} {MY + 8} {MX + 56} {MY + 36}C{MX + 30} {MY + 50} {MX - 30} {MY + 50} {MX - 52} {MY + 36}z" fill="#f06a8a"/>'
        b += food_piece
    else:
        # the lips close on the piece: a small dark mouth, the piece (clipped OUTSIDE the mouth oval) enters it
        b += f'<ellipse cx="{MX}" cy="{MY}" rx="74" ry="30" fill="#6b0f42"/>'
        b += f'<clipPath id="lips"><path d="M0 0H1920V1080H0z M{MX - 74} {MY}a74 30 0 1 0 148 0a74 30 0 1 0 -148 0z" clip-rule="evenodd"/></clipPath><g clip-path="url(#lips)">{food_piece}</g>'
        b += f'<path d="M{MX - 96} {MY - 22}C{MX - 60} {MY - 40} {MX + 60} {MY - 40} {MX + 96} {MY - 22}" stroke="#4a0a2e" stroke-width="10" fill="none" stroke-linecap="round"/>'   # upper lip, ABOVE the food
        b += f'<path d="M{MX - 60} {MY + 38}C{MX - 20} {MY + 52} {MX + 20} {MY + 52} {MX + 60} {MY + 38}" stroke="#d27a9c" stroke-width="8" fill="none" stroke-linecap="round"/>'   # lower lip, BELOW it
        # the sauce at the corner of her mouth (the right corner, away from the food) + one drop on the chin
        b += f'<path d="M{MX + 84} {MY - 18}C{MX + 120} {MY - 24} {MX + 136} {MY} {MX + 124} {MY + 24}C{MX + 110} {MY + 36} {MX + 90} {MY + 20} {MX + 86} {MY + 4}C{MX + 80} {MY - 6} {MX + 78} {MY - 14} {MX + 84} {MY - 18}z" fill="{base}" stroke="{dark}" stroke-width="4"/>'
        b += f'<ellipse cx="{MX + 104}" cy="{MY - 10}" rx="9" ry="5" fill="#ffffff" opacity=".9"/>'
    return b


PXCM_F = 34                             # her mouth ~5 cm = 170 px -> 34 px/cm at her face


def hand_cel(markup, scene, s, h_cm, extra_sil='', op=.26):
    """a hand (+ what it holds) on the traced bg: the scene grade + its soft cast shadow, offset by its height above the
    surface along the window light (lower right)."""
    dx, dy = grip.lift_off(s, h_cm)
    return grip.shadow(markup + extra_sil, dx, dy, op) + f'<g filter="url(#tint-{scene})">{markup}</g>'


def feed_pov(food, kind, mode, uid):
    """YOUR right hand from the bottom-left (the navy sleeve off the frame), grip 'hold' (ref 02: the piece between the
    thumb pad on top and the index / middle under it), held out at her mouth. The piece is THE torn tip (or THE cut
    slice), sauce on its far end: 'open' = the tip stops at the corner of her open mouth; 'bite' = the tip is inside her
    lips (clipped), the lips close on it. Scale: 34 px/cm, the hand 16.5 cm = 560 px, the naan piece 10 cm."""
    s = PXCM_F
    k = (NK if kind == 'naan' else PKK) * s / (35 if kind == 'naan' else 52)   # sprite unit -> px at her face
    far, gp = PIECES[kind][3], PIECES[kind][2]
    L = math.dist(far, gp) * k
    th = math.radians(-14 if mode == 'open' else -10)            # the piece points at her mouth, slightly up
    tip = (MX - 150, MY + 18) if mode == 'open' else (MX - 20, MY + 4)
    G = (tip[0] - L * math.cos(th), tip[1] - L * math.sin(th))
    rot = math.degrees(th) - 180 + math.degrees(math.atan2(far[1] - gp[1], gp[0] - far[0]))
    held = food_piece(kind, G, rot, k, food, 1.0, 22 if mode == 'open' else 0, uid)
    h, H = grip.hand(G, math.degrees(th) - 28, s, 'hold', 'you', held=held, uid=uid)
    if mode == 'open':
        return face('open', food) + h
    return face('bite', food, h)


# ---------------------------------------------------------------- a gravy boat (steel), tilted, pouring a ribbon
def boat(x, y, rot, s, food, ribbon_to):
    """R6 physics fix (Tony: curry 7): the ribbon leaves the SPOUT (not the boat's belly) and FALLS: it drops almost
    straight down into the katori (a little forward drift from the tilt), thinning as it falls, a ripple where it lands.
    The boat is placed from the target: its spout sits ~260 px above the landing point. Returns the boat markup; x, y are
    ignored for the position (kept for the call sites) but rot / s still set the tilt + size."""
    base, dark, hi = food
    tx, ty = ribbon_to
    import math as _m
    c, sn = _m.cos(_m.radians(rot)), _m.sin(_m.radians(rot))
    spx, spy = (-110 * c + 30 * sn) * s, (-110 * sn - 30 * c) * s      # the spout tip, relative to the boat origin
    sx, sy = tx + 34, ty - 260                                        # the spout: above the landing point
    x, y = round(sx - spx), round(sy - spy)
    rib = f'<path d="M{sx - 16:.0f} {sy - 4:.0f}C{sx - 22:.0f} {sy + 70:.0f} {tx - 8:.0f} {ty - 140:.0f} {tx - 9:.0f} {ty:.0f}L{tx + 9:.0f} {ty:.0f}C{tx + 10:.0f} {ty - 140:.0f} {sx + 10:.0f} {sy + 70:.0f} {sx + 12:.0f} {sy + 2:.0f}z" fill="{base}" stroke="{dark}" stroke-width="4"/>'
    rib += f'<path d="M{sx - 8:.0f} {sy + 20:.0f}C{sx - 12:.0f} {sy + 90:.0f} {tx - 3:.0f} {ty - 120:.0f} {tx - 3:.0f} {ty - 30:.0f}" stroke="{hi}" stroke-width="5" fill="none" stroke-linecap="round"/>'
    rib += f'<ellipse cx="{tx:.0f}" cy="{ty + 4:.0f}" rx="46" ry="12" fill="none" stroke="{hi}" stroke-width="5"/><ellipse cx="{tx:.0f}" cy="{ty + 2:.0f}" rx="20" ry="6" fill="{dark}" opacity=".5"/>'
    g = f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">'
    g += '<path d="M-60 -40C-40 60 160 70 200 -40z" fill="#b9bfc8" stroke="#5a616b" stroke-width="5"/>'
    g += '<path d="M60 20C120 20 170 0 190 -30L200 -40C160 30 100 50 60 40z" fill="#8e96a1"/>'
    g += '<ellipse cx="70" cy="-40" rx="130" ry="26" fill="#dfe3e8" stroke="#5a616b" stroke-width="5"/>'
    g += f'<ellipse cx="70" cy="-38" rx="112" ry="18" fill="{base}"/>'
    g += '<path d="M-60 -40L-110 -30L-58 -20z" fill="#c3c8cf" stroke="#5a616b" stroke-width="5" stroke-linejoin="round"/>'
    g += '<path d="M200 -20C260 -30 270 40 210 40" stroke="#8e96a1" stroke-width="14" fill="none" stroke-linecap="round"/>'
    g += '<path d="M-20 0C20 30 80 38 120 30" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".85"/>'
    return rib, g + '</g>'   # R6: (ribbon, boat); only the boat casts a shadow (a stream throws no second stream)


def crop(c, src, dst):
    """a crop of a hero drawing: scale c, with hero point src landing on frame point dst."""
    return f'translate({dst[0] - c * src[0]:.1f} {dst[1] - c * src[1]:.1f}) scale({c})'


def at(c, src, dst, p):
    """where hero point p lands in that crop."""
    return (dst[0] + c * (p[0] - src[0]), dst[1] + c * (p[1] - src[1]))


def tip_hero():
    x, y, w = NAAN
    return x + TIP_O[0] * NK, y + TIP_O[1] * NK


# ================================================================ BUTTER-CHICKEN shots
def thali():
    return svg(cloth() + thali_group())


LIFT = (1.2, (800, 850), (980, 600))   # crop, hero src, frame dst: the naan's torn end in the middle, above the box


def naan_lift():
    """THE TEAR (ref 03 + 05): a two-hand pinch-pull. Her left hand ('press', ref 03: palm down, the thumb under the
    naan, the index + middle tips pinning the naan body right of the tear) holds the naan down; her right hand ('pinch')
    holds the torn tip by its torn edge and pulls it up-left, 5 cm off the notch, dough strands still joining them.
    The piece is the sprite's own tip, so it matches the notch exactly. 42 px/cm (the 1.2 crop), hands 16.5 cm.
    R5 (Tony's pick V2, 09-30): BOTH hands sit BEHIND the naan. Paint order = tray -> the anchor hand -> the naan ->
    the pulling hand -> the piece: the naan overlaps the anchor fingers and the piece overlaps the pinch, so no finger
    floats in front of the bread (V1 had the pinch hand pasted over the piece)."""
    c, s0, d0 = LIFT
    s = 35 * c; k = NK * c
    g = f'<g transform="{crop(c, s0, d0)}">{thali_group(torn=True, part="base")}</g>'
    gn = f'<g transform="{crop(c, s0, d0)}">{thali_group(torn=True, part="naan")}</g>'
    on = lambda p: at(c, s0, d0, (NAAN[0] + p[0] * NK, NAAN[1] + p[1] * NK))
    g0 = on((112, 210))                                       # the held edge, where it was
    G = (g0[0] - 150, g0[1] - 170); rot = -14                  # pulled up-left + tilted (lifted off the naan)
    pc = food_piece('naan', G, rot, k, uid='l')
    # dough strands: from the notch's crumb edge on the naan to the same points on the piece's torn edge
    strands = ''
    for i, (x, y) in enumerate(RAG[1:-1:2]):
        a, b = on((x + 2, y)), piece_pt('naan', G, rot, k, (x - 2, y))
        m = ((a[0] + b[0]) / 2 + 12, (a[1] + b[1]) / 2 + 22)
        strands += f'<path d="M{a[0]:.0f} {a[1]:.0f}Q{m[0]:.0f} {m[1]:.0f} {b[0]:.0f} {b[1]:.0f}" stroke="#fbf0d4" stroke-width="{11 - i * 2}" fill="none" stroke-linecap="round"/>'
        strands += f'<path d="M{a[0]:.0f} {a[1]:.0f}Q{m[0]:.0f} {m[1]:.0f} {b[0]:.0f} {b[1]:.0f}" stroke="#d9b27a" stroke-width="2" fill="none" opacity=".7" transform="translate(2 4)"/>'
    # H2 (SLOP 10-01, Nanda canon: PIN hands, never 5 fingers; as katsu_close / napkin_fold): her two input pins.
    # The anchor pin comes in from the right frame edge and its nub presses the naan 2 cm right of the tear (drawn
    # over the naan: it holds it down); the pulling pin comes in from the left edge and its nub pinches the torn piece
    # by its torn edge (the piece is drawn under the nub, so the nub closes over it).
    A = on((150, 196))
    P = piece_pt('naan', G, rot, k, (98, 196))
    ra, rb = round(1.25 * s), round(1.35 * s)
    ha = pin_hold((round(A[0]), round(A[1])), ra, ((2000, round(A[1]) + 260), (round(A[0]) + 360, round(A[1]) + 120)))
    hb = pin_hold((round(P[0]), round(P[1])), rb, ((-80, round(P[1]) - 150), (round(P[0]) - 380, round(P[1]) - 230)), held=pc)   # from the left edge, under the HUD band
    return svg(cloth() + g + gn + strands + cel(ha, 'b', lift=(20, 30), op=.22)
               + grip.shadow(piece_sil('naan', G, rot, k), *grip.lift_off(s, 5), .28) + cel(hb, 'b', lift=(60, 110), op=.2))


SAUCE = (1.6, None, (880, 540))        # the butter katori, big


def sauce_crop():
    c, _, d0 = SAUCE
    cx, cy, rx, ry = kfood('butter')
    return c, (cx, cy), d0


def sauce():
    c, s0, d0 = sauce_crop()
    g = f'<g transform="{crop(c, s0, d0)}">{thali_group()}</g>'
    # M1 (SLOP 10-01, "She pours more butter sauce"): the boat is held, as katsu_pour. boat() places itself from the
    # landing point; her pin nub grips the belly (boat-local (50, 22): this boat is smaller than katsu's, so the nub sits
    # higher, over the belly line, to read as holding, not touching), the lead from the right frame edge under the HUD
    # column, over the saag katori. The nub top stays below the y=140 HUD band.
    rot, sc, to = -28, 1.9, (d0[0] + 40, d0[1] - 10)
    c_, s_ = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    bx = to[0] + 34 - (-110 * c_ + 30 * s_) * sc; by = to[1] - 260 - (-110 * s_ - 30 * c_) * sc
    hx, hy = bx + (50 * c_ - 22 * s_) * sc, by + (50 * s_ + 22 * c_) * sc
    arm = pin_hold((round(hx), round(hy)), 58, ((2000, 600), (1600, 420)))
    return svg(cloth() + g + boat_cel(boat(1500, 240, rot, sc, BUTTER, to), 'b') + cel(arm, 'b', lift=(60, 120), op=.2))


def naan_dip():
    """THE DIP (ref 01 + 04): her right hand ('scoop', ref 04: the torn piece folded over the index into a scoop, the
    thumb on top) pushes the piece's far end 2.5 cm INTO the butter curry: the submerged end is hidden under the
    surface + behind the katori's front wall, the curry rises round it, a coat of sauce on the part that came out, one
    drop falling straight down. 56 px/cm (the 1.6 crop): the katori 13 cm = 730 px, her hand 16.5 cm = 925 px."""
    c, s0, d0 = sauce_crop()
    s = 35 * c; k = NK * c
    g = f'<g transform="{crop(c, s0, d0)}">{thali_group(torn=True)}</g>'
    cx, cy, rx, ry = kfood('butter'); cx, cy, rx, ry = d0[0], d0[1], rx * c * .9, ry * c * .8
    far, gp = PIECES['naan'][3], PIECES['naan'][2]
    L = math.dist(far, gp) * k
    entry = (cx - 40, cy - 30); depth = 2.5 * s                # the far end goes 2.5 cm under
    th = math.radians(146)                                     # the scoop leans in from the right, far end down-left
    tip = (entry[0] + depth * math.cos(th), entry[1] + depth * math.sin(th))
    G = (tip[0] - L * math.cos(th), tip[1] - L * math.sin(th))
    rot = math.degrees(th) - 180
    hide = surface_hide(cx, cy, rx, ry, entry[1])
    pc = food_piece('naan', G, rot, k, BUTTER, .62, 0, 'd', hide)
    # H2: her pin (not a 5-finger hand), from the right frame edge, the nub on the piece's held end (piece under the nub)
    h = pin_hold((round(G[0]), round(G[1])), round(1.25 * s), ((2000, round(G[1]) + 60), (round(G[0]) + 420, round(G[1]) - 60)), held=pc)   # under the HUD column
    return svg(cloth() + g + cel(h, 'b', lift=(50, 90), op=.2) + meniscus(entry[0] + 1.2 * s, entry[1], 3.6 * s, BUTTER))


def naan_feed():
    return svg(feed_pov(BUTTER, 'naan', 'open', 'f'))


def butter_bite():
    return svg(feed_pov(BUTTER, 'naan', 'bite', 'b'))   # the same piece, the same hand, 5 cm further: into her lips


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
    b = cloth() + room_back()   # the traced NAND table (bg-nand) under the drawn back wall
    b += '<path d="M0 560H1920V586H0z" fill="#b08254"/>'
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


def napkin_shot(surface, dish, stain, pin=False, scene='k'):
    """your fingers (from the bottom-left, curry on the tips) + her hand from the right wiping them with the napkin.
    pin = her hand is her pin (M1 route B, katsu): the nub presses the napkin over your fingertips."""
    base, dark, hi = stain
    b = surface + dish
    # your open hand, palm down, fingertips with curry; contact shadow on the table under it
    b += f'<ellipse cx="{700 + SDX}" cy="{600 + SDY}" rx="300" ry="70" fill="{SH}" opacity=".25"/>'
    b += hand(560, 610, -10, 1.5, 'open', 'you')
    b += ''.join(f'<ellipse cx="{x}" cy="{y}" rx="16" ry="10" fill="{base}" stroke="{dark}" stroke-width="2"/>' for x, y in [(880, 480), (910, 520), (905, 565)])
    # her hand wraps the napkin over your index + middle fingers (napkin on top = it touches them)
    if pin:
        nap = f'<g transform="translate(930 470) rotate(170) scale(1.25 -1.25)">{napkin_shape(stain)}</g>'
        b += cel(pin_hold((1010, 430), 84, ((2000, 560), (1500, 330)), held=nap), scene, lift=(30, 60), op=.2)
        return svg(b)
    b += hand(1084, 642, 180 + 10, 1.5, 'grip', 'her', flip=True, held=f'<g transform="translate(150 -70) rotate(180) scale(1 -1)">{napkin_shape(stain)}</g>')
    return svg(b)


# M3 alone (not hungry): HER hand is her pin (Nanda canon, R5 Tony 09-30: the input pin with a round nub, as in the key
# close-up fx/Cels.jsx KeyPalm). Her palette: rim / lit (art/nanda.js SWEET). The pin lead comes in from the right frame
# edge (her side), the nub pinches the folded napkin's corner (the napkin is drawn first, so the nub closes over it).
PIN_RIM, PIN_LIT = '#d1177f', '#ffc4e6'


def pin_hold(nub, r, lead, held=''):
    """her pin hand: a lead (rim stroke + lit core) from `lead` (a frame-edge point + its control point) to the nub at
    `nub`, radius r. `held` is drawn under the nub (the nub grips its corner). Light from the upper left: the sheen sits
    top-left on the nub; grip ticks on the shaded (lower-right) side."""
    (x0, y0), (cx, cy) = lead
    nx, ny = nub
    d = f'M{x0} {y0}Q{cx} {cy} {nx} {ny}'
    g = held
    g += f'<path d="{d}" fill="none" stroke="{PIN_RIM}" stroke-width="{r * .62:.0f}" stroke-linecap="round"/>'
    g += f'<path d="{d}" fill="none" stroke="{PIN_LIT}" stroke-width="{r * .27:.0f}" stroke-linecap="round"/>'
    g += f'<circle cx="{nx}" cy="{ny}" r="{r}" fill="{PIN_LIT}" stroke="{PIN_RIM}" stroke-width="{r * .14:.0f}"/>'
    g += f'<path d="M{nx - r * .1:.0f} {ny + r * .62:.0f}A{r * .66:.0f} {r * .66:.0f} 0 0 0 {nx + r * .62:.0f} {ny + r * .08:.0f}" fill="none" stroke="#efb0d2" stroke-width="{r * .16:.0f}" stroke-linecap="round"/>'
    g += f'<ellipse cx="{nx - r * .36:.0f}" cy="{ny - r * .38:.0f}" rx="{r * .3:.0f}" ry="{r * .2:.0f}" transform="rotate(-30 {nx - r * .36:.0f} {ny - r * .38:.0f})" fill="#ffffff" opacity=".8"/>'
    g += ''.join(f'<path d="M{nx + r * a:.0f} {ny + r * b:.0f}l{r * c:.0f} {r * e:.0f}" stroke="{PIN_RIM}" stroke-width="{r * .07:.0f}" stroke-linecap="round"/>'
                 for a, b, c, e in [(1.12, -.2, .26, -.08), (1.06, .26, .26, .1), (.86, .7, .2, .2)])
    return g


def plate_eaten(stain):
    """the katsu plate after she ate it all, in plate-sprite units (520 x 317, the traced plate's own oval): a clean
    white plate, roux smears where the curry was, a few grains, one pickle shred, the spoon left on it."""
    base, dark, hi = stain
    r = random.Random(21)
    b = '<ellipse cx="262" cy="160" rx="258" ry="152" fill="#b9a284"/>'
    b += '<ellipse cx="258" cy="154" rx="254" ry="148" fill="#fbf8f1" stroke="#c8b69c" stroke-width="3"/>'
    b += '<ellipse cx="252" cy="152" rx="206" ry="118" fill="#f2ece0"/>'
    b += '<path d="M60 150C80 90 180 60 250 70" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/>'
    for (x0, y0, x1, y1, w) in [(90, 190, 300, 230, 26), (120, 140, 280, 180, 18), (170, 100, 330, 120, 12), (300, 210, 410, 170, 14)]:
        b += f'<path d="M{x0} {y0}Q{(x0 + x1) / 2:.0f} {(y0 + y1) / 2 + 18:.0f} {x1} {y1}" stroke="{base}" stroke-width="{w}" fill="none" stroke-linecap="round" opacity=".55"/>'
    for _ in range(9):
        gx, gy, ga = r.randint(150, 430), r.randint(90, 230), r.randint(0, 180)
        b += f'<ellipse cx="{gx}" cy="{gy}" rx="5" ry="3" transform="rotate({ga} {gx} {gy})" fill="#ffffff" stroke="#a8a090" stroke-width="1"/>'
    b += '<path d="M400 110l16 -6l4 10l-16 5z" fill="#c8202e"/>'
    # the spoon, bowl down on the plate, handle off to the upper right
    b += '<path d="M250 150L470 70" stroke="#8e96a1" stroke-width="16" stroke-linecap="round"/><path d="M250 150L470 70" stroke="#e8edf2" stroke-width="6" stroke-linecap="round"/>'
    b += '<ellipse cx="226" cy="160" rx="44" ry="28" transform="rotate(-20 226 160)" fill="#d6dce3" stroke="#8e96a1" stroke-width="5"/>'
    b += '<ellipse cx="218" cy="154" rx="20" ry="9" transform="rotate(-20 218 154)" fill="#ffffff" opacity=".8"/>'
    return b


def napkin_fold(surface, dish, stain):
    """not hungry: she holds up her folded napkin in her pin (she keeps it), over the counter, by her eaten plate."""
    b = surface + dish
    nap = f'<g transform="translate(1000 420) rotate(-12) scale(2.6)">{napkin_shape(stain, True)}</g>'
    arm = pin_hold((1270, 320), 96, ((2000, 740), (1580, 700)), held=nap)
    b += cel(arm, 'k', lift=(70, 230), op=.2)
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
    b += '<path d="M-20 620H560L520 1080H-20z" fill="#9a7048" stroke="#5a3a1c" stroke-width="5"/><path d="M-20 620H560" stroke="#c89a64" stroke-width="12"/>'   # the same wood table as bg-nand
    b += f'<g transform="translate(-30 560) scale(.34)">{thali_group()}</g>'
    # her lassi on the right edge of the booth table (a small tray table at the right, same cloth)
    b += '<path d="M1440 640H1940V1080H1400z" fill="#9a7048" stroke="#5a3a1c" stroke-width="5"/><path d="M1440 640H1940" stroke="#c89a64" stroke-width="12"/>'
    b += f'<g transform="translate(1100 330) scale(.42)">{lassi_glass(1100, 780)}</g>'
    return svg(b)


# ================================================================ KATSU shots
# The plate is the traced images(183) sprite: roux left, the fanned sliced cutlet across the seam, rice right. Real
# sizes: the plate ~26 cm = 1350 px (52 px/cm); the spoon ~18 cm; the hand ~18 cm (HS_K); the fukujinzuke dish ~12 cm.
PLATE = (170, 110, 1350)
PKK = PLATE[2] / META['katsu-plate'][0]    # hero px per plate-sprite unit
HS_K = 52 * 18 / 250                       # 3.74
PK_K = PKK / HS_K                          # the cut slice, in hand units
SLICE = [(318, 120), (350, 72), (398, 118), (392, 168), (345, 172)]   # the end slice of the cutlet (plate-sprite units)
SLICE_O = (358, 124)
ROUX_FILL = '#7a4420'


def P(p):
    """plate-sprite units -> hero px."""
    return PLATE[0] + p[0] * PKK, PLATE[1] + p[1] * PKK


def katsu_plate(cut=False):
    """the hero plate + its fukujinzuke dish (behind, upper right). cut = the end slice is gone (roux shows there)."""
    b = spr('fukujinzuke', 1250, 30, 620, shadow=.28)
    if not cut:
        return b + spr('katsu-plate', *PLATE, shadow=.34)
    sl = 'M' + 'L'.join(f'{x} {y}' for x, y in SLICE) + 'Z'
    inner = (f'<clipPath id="nosl"><path d="M-10 -10H600V400H-10Z{sl}" clip-rule="evenodd"/></clipPath>'
             f'<path d="{sl}" fill="{ROUX[0]}" stroke="#4a2410" stroke-width="2"/>'
             f'<path d="M330 112Q352 92 380 112" stroke="#c07a3c" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>'
             f'<ellipse cx="342" cy="104" rx="7" ry="4" fill="#ffffff" opacity=".7"/>'
             f'<path d="M336 150Q360 160 384 146" stroke="#5a2e12" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>'
             f'<g clip-path="url(#nosl)">{BODY["katsu-plate"]}</g>')
    return b + spr('katsu-plate', *PLATE, inner=inner, shadow=.34)


def katsu_piece(dip=0, uid='k'):
    """THE end slice as a flat CEL, in plate-sprite units, centred: crumb on top (the traced crumb's browns), the white
    pork face with its pink rim + pale fat line toward us (katsu-lift ref). dip = roux coat on the far (-x) end + drip."""
    g = '<g transform="scale(.6)">'
    g += f'<path d="{bumpy([(-60, -40), (60, -46), (66, 40), (-54, 46)], step=18, bulge=7, seed=5)}" fill="#c47c34" stroke="#6a3a14" stroke-width="4"/>'
    g += '<path d="M-50 -30L50 -36" stroke="#e8b060" stroke-width="10" stroke-linecap="round"/>'
    g += ''.join(f'<circle cx="{x}" cy="{y}" r="5" fill="{c}"/>' for x, y, c in [(-30, -10, '#8a4a1c'), (0, 6, '#f0c070'), (30, -14, '#8a4a1c'), (-10, 26, '#f0c070'), (36, 20, '#8a4a1c')])
    g += '<path d="M-44 20H50L54 50H-40z" fill="#f8ece4" stroke="#b8702a" stroke-width="7" stroke-linejoin="round"/><path d="M-36 30H44" stroke="#f2c4b8" stroke-width="6"/><path d="M-30 40H40" stroke="#fffaf4" stroke-width="3"/>'
    if dip:
        base, dark, hi = ROUX
        g += f'<path d="M-56 -44C-64 -10 -64 20 -50 50L-40 50C-30 20 -30 -20 -20 -46z" fill="{base}" stroke="{dark}" stroke-width="3"/><ellipse cx="-44" cy="-20" rx="5" ry="8" fill="#ffffff" opacity=".9"/>'
        if dip > 1:
            g += f'<path d="M-50 50C-48 {50 + dip * .5} -54 {50 + dip * .8} -50 {50 + dip}C-42 {50 + dip * 1.1} -38 {50 + dip * .8} -40 50z" fill="{base}" stroke="{dark}" stroke-width="3"/><ellipse cx="-46" cy="{54 + dip * 1.05}" rx="11" ry="14" fill="{base}" stroke="{dark}" stroke-width="3"/>'
    return g + '</g>'


KGRIP = (36, 0)   # she holds the slice by its near (+x) end


def spoon(x0, y0, x1, y1, bowl_w):
    """a steel spoon: the bowl at (x0,y0), the handle to (x1,y1); bowl_w = the bowl's width (~4 cm)."""
    a = math.degrees(math.atan2(y1 - y0, x1 - x0))
    return (f'<path d="M{x0} {y0}L{x1} {y1}" stroke="#5a616b" stroke-width="{bowl_w * .24:.0f}" stroke-linecap="round"/><path d="M{x0} {y0}L{x1} {y1}" stroke="#dfe3e8" stroke-width="{bowl_w * .13:.0f}" stroke-linecap="round"/>'
            f'<ellipse cx="{x0}" cy="{y0}" rx="{bowl_w * .78:.0f}" ry="{bowl_w * .5:.0f}" transform="rotate({a:.0f} {x0} {y0})" fill="#c9ced5" stroke="#5a616b" stroke-width="5"/>'
            f'<ellipse cx="{x0 - bowl_w * .15:.0f}" cy="{y0 - bowl_w * .15:.0f}" rx="{bowl_w * .3:.0f}" ry="{bowl_w * .14:.0f}" transform="rotate({a:.0f} {x0} {y0})" fill="#ffffff"/>')


def katsu_side():
    """the spoon (18 cm = 940 px) on a white napkin at the right of the plate: it runs off the bottom of the frame."""
    b = f'<g transform="rotate(-8 1800 700)"><rect x="{1690 + SDX}" y="{300 + SDY}" width="260" height="900" rx="8" fill="{SH}" opacity=".25"/><rect x="1690" y="300" width="260" height="900" rx="8" fill="#ffffff" stroke="#b9c2d0" stroke-width="4"/><path d="M1820 300V1200" stroke="#e6ebf2" stroke-width="10"/>'
    b += spoon(1820, 400, 1820, 1300, 208) + '</g>'
    return b


def katsu_dish():
    return svg(counter() + katsu_plate() + cel(katsu_side(), 'k', op=0))


def katsu_cut():
    """her left hand (mirrored, from the right) holds the spoon ('spoon' grip: the handle between the thumb pad and the
    side of the index, the handle end under the heel of the hand); the spoon's edge presses down through the end
    slice. 52 px/cm: the spoon 18 cm = 940 px, the hand 16.5 cm = 860 px, the grip 6 cm up the handle from its end."""
    e = P(SLICE_O)
    bowl = (e[0] + 30, e[1] - 10); a = math.radians(-14)
    end = (bowl[0] + 940 * math.cos(a), bowl[1] + 940 * math.sin(a))
    G = (bowl[0] + 600 * math.cos(a), bowl[1] + 600 * math.sin(a))
    crunch = f'<path d="M{e[0] - 80} {e[1] - 70}l-40-40M{e[0] - 20} {e[1] - 100}l-6-56M{e[0] - 120} {e[1] - 10}l-56-10" stroke="#fff6de" stroke-width="10" stroke-linecap="round"/>'
    sp = spoon(bowl[0], bowl[1], end[0], end[1], 208)
    # M1 route B: her pin (Nanda canon, as napkin-fold) closes over the handle 6 cm up from its end; the lead comes in
    # from the right frame edge, low (clear of the HUD column top right); the nub top stays below y 200.
    Gp = (bowl[0] + 430 * math.cos(a), bowl[1] + 430 * math.sin(a))   # the grip, nearer the bowl: clear of the HUD column
    arm = pin_hold((round(Gp[0]), round(Gp[1]) + 6), 70, ((2000, 640), (1800, 420)))
    return svg(counter() + katsu_plate() + crunch + cel(sp, 'k', (30, 50), .22) + cel(arm, 'k', lift=(60, 120), op=.2))


def katsu_pour():
    c = 2.0; rice = P((440, 170)); d0 = (760, 480)
    g = f'<g transform="{crop(c, rice, d0)}">{katsu_plate()}</g>'
    pool = f'<path d="M{d0[0] - 140} {d0[1] + 20}C{d0[0] - 120} {d0[1] - 50} {d0[0] + 140} {d0[1] - 60} {d0[0] + 200} {d0[1] + 10}C{d0[0] + 220} {d0[1] + 70} {d0[0] + 100} {d0[1] + 100} {d0[0]} {d0[1] + 90}C{d0[0] - 80} {d0[1] + 84} {d0[0] - 150} {d0[1] + 60} {d0[0] - 140} {d0[1] + 20}z" fill="{ROUX[0]}" stroke="{ROUX[1]}" stroke-width="10"/><path d="M{d0[0] - 60} {d0[1] - 10}c50-24 140-24 200-6" stroke="{ROUX[2]}" stroke-width="8" fill="none" stroke-linecap="round"/><ellipse cx="{d0[0] - 40}" cy="{d0[1] + 20}" rx="14" ry="8" fill="#fff"/>'
    to = (d0[0] + 40, d0[1] + 10)
    # M1 route B: the boat is held. boat() places itself from the landing point (spout ~260 px above it); its handle is
    # off the top of this crop, so her pin nub cradles the belly from below (boat-local (40, 40), on the belly line), lead from the right.
    rot, sc = -30, 2.6
    c_, s_ = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    bx = to[0] + 34 - (-110 * c_ + 30 * s_) * sc; by = to[1] - 260 - (-110 * s_ - 30 * c_) * sc
    hx, hy = bx + (40 * c_ - 40 * s_) * sc, by + (40 * s_ + 40 * c_) * sc
    arm = pin_hold((round(hx), round(hy)), 58, ((2000, 660), (1640, 470)))
    return svg(counter() + g + pool + boat_cel(boat(1460, 250, rot, sc, ROUX, to), 'k') + cel(arm, 'k', lift=(60, 120), op=.2))


CLOSE = (1.0, (170 + 150 * 1350 / 520, 110 + 200 * 1350 / 520), (760, 540))   # the roux, left half of the plate


def katsu_close():
    """ECU: her right hand pinches THE cut slice (the plate sprite's own end slice, so it fits the gap it left) and
    presses its far end into the roux: the roux is ~1 cm deep on the plate, so only the end 1 cm goes under; the roux
    rings round it and coats the end. 52 px/cm: the slice 3.7 x 4.6 cm, her hand 16.5 cm."""
    c, s0, d0 = CLOSE
    s = 52 * c; k = PKK * c
    g = f'<g transform="{crop(c, s0, d0)}">{katsu_plate(cut=True)}</g>'
    far, gp = PIECES['katsu'][3], PIECES['katsu'][2]
    L = math.dist(far, gp) * k
    entry = (d0[0] - 30, d0[1] + 30); th = math.radians(112)
    tip = (entry[0] + 1.0 * s * math.cos(th), entry[1] + 1.0 * s * math.sin(th))
    G = (tip[0] - L * math.cos(th), tip[1] - L * math.sin(th))
    rot = math.degrees(th) - 180 + math.degrees(math.atan2(far[1] - gp[1], gp[0] - far[0]))
    hide = [(entry[0] + 120, entry[1]), (entry[0] + 120, entry[1] + 200), (entry[0] - 120, entry[1] + 200), (entry[0] - 120, entry[1])]
    pc = food_piece('katsu', G, rot, k, ROUX, 1.0, 0, 'c', hide)
    # M1 route B: her pin nub pinches the slice's near end (the slice is drawn first, the nub closes over it); the lead
    # comes in from the right frame edge, above the plate, never into the HUD band (nub top > 200).
    arm = pin_hold((round(G[0]), round(G[1])), 64, ((2000, 300), (1500, 160)), held=pc)
    return svg(counter() + g + cel(arm, 'k', lift=(50, 90), op=.2) + meniscus(entry[0], entry[1], 1.9 * s, ROUX))


def katsu_feed():
    return svg(feed_pov(ROUX, 'katsu', 'open', 'kf'))


def katsu_bite():
    return svg(feed_pov(ROUX, 'katsu', 'bite', 'kb'))


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
    'napkin': lambda: napkin_shot(cloth(), f'<g transform="translate(-700 560) scale(.8)">{thali_group()}</g>', BUTTER, pin=True, scene='b'),
    'katsu-dish': katsu_dish, 'katsu-cut': katsu_cut, 'katsu-pour': katsu_pour, 'katsu-close': katsu_close,
    'katsu-feed': katsu_feed, 'katsu-bite': katsu_bite, 'katsu-water': katsu_water, 'katsu-counter': katsu_counter,
    'katsu-napkin': lambda: napkin_shot(counter(), f'<g transform="translate(-700 560) scale(.8)">{katsu_plate()}</g>', ROUX, pin=True),
    'napkin-fold': lambda: napkin_fold(counter(), f'<g transform="translate(-600 520) scale(.8)">{spr("fukujinzuke", 1250, 30, 620, shadow=.28)}{spr("katsu-plate", *PLATE, inner=plate_eaten(ROUX), shadow=.34)}</g>', ROUX),
}
only = sys.argv[2:]
for k, f in SHOTS.items():
    if only and k not in only: continue
    s = f()
    open(os.path.join(OUT, k + '.svg'), 'w').write(s)
    print(k, len(s) // 1024, 'KB')
