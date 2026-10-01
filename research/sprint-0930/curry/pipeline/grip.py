# NAAN-HANDS (NAAN-HANDS-AUDIT.md): the anatomical CEL hand for every shot where a hand touches food.
# Built in CENTIMETRES, so its size comes from the shot's px/cm (R3-AUDIT scale), never from a guess:
#   an adult girl's hand, wrist crease -> middle fingertip = 16.5 cm; palm 9.5 x 7.2 cm; fingers index 6.5 / middle 7.0
#   / ring 6.6 / pinky 5.2 cm, 1.25-1.55 cm wide, tapering; 3 phalanges each (46 / 30 / 24 %); the thumb = metacarpal
#   4.2 + proximal 3.0 + distal 2.6 cm, 1.85 cm wide, from the base of the palm.
# The GRIPS are read off Tony's hand refs (scratchpad naan-hands/01-05; pipeline/hands.py vtraces their silhouettes,
# sprites/hand-*.svg, the fit check): 'pinch' = 01 (fingertip pinch, the dip), 'scoop' = 04 (the naan folded over the
# index, the thumb on top, the dip), 'hold' = 02 (a strip held between the thumb and index/middle, held out: the feed),
# 'press' = 03 (palm down, the fingertips pin the naan, the thumb under it: the anchor hand of the tear), 'spoon' = a
# handle held between the thumb pad and the side of the index (katsu cut).
# The thumb is solved by 2-link IK onto its contact (the index pad / the far face of the piece), so the thumb always
# OPPOSES the index and its IP joint bulges outward (never bent backwards). Every point is mapped to screen px here,
# so the cel shade (lower right) and the light (upper left) are true screen directions (the window is upper left).
import math

SKIN = {
    # Nanda: her SWEET palette as skin (nanda.js body #ffffff / body2 #ffe3f1, rim #d1177f), her violet collar (col
    # #8a7ff0 / col2 #6152cf) as the sleeve, a white cuff with her rim-pink stripe
    'her': dict(lit='#fff7f5', base='#fde6e4', shade='#efb8be', deep='#d4909c', line='#a0305e', nail='#ffeef3',
                cuff='#ffffff', trim='#d1177f', sleeve='#8a7ff0', sleeve2='#6152cf', slit='#b3aaf7'),
    # you (the POV feed): the r2 skin + your navy jacket and shirt cuff
    'you': dict(lit='#fbe4d2', base='#f2c9a8', shade='#d59f80', deep='#b47a5c', line='#7a3e2a', nail='#fbe6de',
                cuff='#f4f1ea', trim='#9a9488', sleeve='#26305a', sleeve2='#141a36', slit='#3c4a80'),
}
FING = [('index', (9.2, -2.4), 6.5, 1.50), ('middle', (9.5, -0.8), 7.0, 1.55), ('ring', (9.2, 0.8), 6.6, 1.45), ('pinky', (8.5, 2.3), 5.2, 1.25)]
SEG = (.46, .30, .24)
CMC, META, PROX, DIST, TW = (1.4, -2.3), 4.2, 3.0, 2.6, 1.85
LW = .16   # the cel line, cm

# pose: kn = the knuckle row's foreshortening (1 = seen from straight above the back of the hand, .5 = a 3/4 side view)
# f = per finger (spread deg, flex1, flex2, flex3); the flex curls toward +y (the palm side in this view).
# thumb = (metacarpal angle, contact): contact = (finger, segment, t along it, gap cm) -> the thumb pad meets that point
# across a gap (the food's thickness). pinch = where the food is held (between the thumb pad and the contact).
POSES = {
    'pinch': dict(kn=.55, view='side', f={'index': (-4, 28, 48, 18), 'middle': (0, 40, 62, 24), 'ring': (4, 52, 72, 28), 'pinky': (8, 60, 78, 30)},
                  thumb=(-18, ('index', 2, .7, .45))),
    'scoop': dict(kn=.55, view='side', f={'index': (-2, 22, 40, 16), 'middle': (1, 34, 56, 22), 'ring': (5, 50, 70, 28), 'pinky': (9, 58, 76, 30)},
                  thumb=(-16, ('index', 2, .35, 1.3))),
    'hold':  dict(kn=.5, view='side', f={'index': (-2, 12, 22, 10), 'middle': (1, 18, 30, 12), 'ring': (5, 58, 78, 30), 'pinky': (9, 66, 80, 30)},
                  thumb=(-14, ('index', 1, .55, .5))),
    'press': dict(kn=1.0, view='dorsal', f={'index': (-9, 10, 16, 8), 'middle': (-3, 10, 16, 8), 'ring': (3, 12, 18, 8), 'pinky': (9, 14, 18, 8)},
                  thumb=(22, None)),
    'spoon': dict(kn=.55, view='side', f={'index': (-2, 30, 44, 20), 'middle': (1, 55, 70, 30), 'ring': (5, 66, 80, 30), 'pinky': (9, 72, 82, 30)},
                  thumb=(-20, ('index', 1, .6, .55))),
}


def _rot(v, a):
    c, s = math.cos(a), math.sin(a)
    return (v[0] * c - v[1] * s, v[0] * s + v[1] * c)


def _add(a, b, k=1): return (a[0] + b[0] * k, a[1] + b[1] * k)


def skeleton(pose):
    """the posed hand in hand-frame cm (wrist crease at 0,0, the fingers point +x, the thumb on the -y side)."""
    P = POSES[pose]; kn = P['kn']; yk = lambda y: y * (.45 + .55 * kn)
    fing = {}
    for name, (kx, ky), L, w in FING:
        spread, *flex = P['f'][name]
        p = (kx, yk(ky)); a = math.radians(spread); segs = []
        for i, fl in enumerate(flex):
            a += math.radians(fl)
            q = _add(p, (math.cos(a), math.sin(a)), L * SEG[i])
            segs.append((p, q, w * (1 - .07 * i), w * (1 - .07 * (i + 1)), a)); p = q
        fing[name] = segs
    ma, contact = P['thumb']
    c = (CMC[0], yk(CMC[1])); m = _add(c, (math.cos(math.radians(ma)), math.sin(math.radians(ma))), META)
    if contact:
        fn, si, t, gap = contact
        p0, p1, w0, w1, a = fing[fn][si]
        q = (p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t)
        n = (-math.sin(a), math.cos(a))            # the pad side of that segment (the flex side)
        T = _add(q, n, (w0 + TW) / 2 + gap - .1)
    else:                                          # the thumb tucked under the palm (press): straight along its line
        T = _add(m, (math.cos(math.radians(ma + 30)), math.sin(math.radians(ma + 30))), (PROX + DIST) * .9)
    D = min(max(math.dist(m, T), abs(PROX - DIST) + .2), PROX + DIST - .05)
    th = math.atan2(T[1] - m[1], T[0] - m[0])
    al = math.acos((PROX ** 2 + D ** 2 - DIST ** 2) / (2 * PROX * D))
    best = None
    for sg in (1, -1):                             # the IP joint bulges AWAY from the fingers (-y): never hyper-extended
        j = _add(m, (math.cos(th + sg * al), math.sin(th + sg * al)), PROX)
        if best is None or j[1] < best[1]: best = j
    j = best; tip = _add(j, (T[0] - j[0], T[1] - j[1]), DIST / max(math.dist(j, T), 1e-6))
    thumb = [(c, m, TW * 1.25, TW * 1.05, 0), (m, j, TW * 1.05, TW, 0), (j, tip, TW, TW * .9, 0)]
    for k, (a0, a1, *_r) in enumerate(thumb):
        thumb[k] = (a0, a1, thumb[k][2], thumb[k][3], math.atan2(a1[1] - a0[1], a1[0] - a0[0]))
    if contact:
        pin = ((q[0] + T[0]) / 2, (q[1] + T[1]) / 2)
    else:
        e = fing['index'][2][1]; pin = e
    palm = [(0, yk(-2.6)), (2.6, yk(-3.3)), (5.6, yk(-3.3)), (9.2, yk(-2.4) - .75), (9.6, yk(-.8)), (9.3, yk(.8)), (8.6, yk(2.3) + .65), (4.5, yk(3.4)), (0, yk(2.6))]
    return dict(f=fing, t=thumb, pin=pin, palm=palm, yk=yk, view=P['view'])


class Hand:
    """screen mapping: hand cm -> screen px: the PINCH lands on P, the fingers point along `ang` deg, flip = the mirror
    (her left hand), s = the shot's px per cm."""
    def __init__(self, P, ang, s, pose, who='her', flip=False, wrist=0):
        self.S = skeleton(pose); self.P, self.a, self.s, self.fy, self.C = P, math.radians(ang), s, (-1 if flip else 1), SKIN[who]
        self.wrist = math.radians(wrist); self.pose = pose

    def m(self, p):
        x, y = p[0] - self.S['pin'][0], (p[1] - self.S['pin'][1]) * self.fy
        x, y = _rot((x * self.s, y * self.s), self.a)
        return (self.P[0] + x, self.P[1] + y)

    def dir(self, a):   # a hand-frame angle -> a screen unit vector
        return _rot((math.cos(a), math.sin(a) * self.fy), self.a)

    def pt(self, name, seg=2, t=1.0):
        p0, p1, *_r = self.S['f'][name][seg] if name != 'thumb' else self.S['t'][seg]
        return self.m((p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t))

    def forearm_dir(self):
        return self.dir(math.pi + self.wrist)


def _ln(a, b, w, col, cap='round', op=None):
    o = f' opacity="{op}"' if op else ''
    return f'<path d="M{a[0]:.1f} {a[1]:.1f}L{b[0]:.1f} {b[1]:.1f}" stroke="{col}" stroke-width="{w:.1f}" stroke-linecap="{cap}"{o}/>'


def _poly(pts, fill, stroke=None, sw=0, extra=''):
    d = 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + 'Z'
    st = f' stroke="{stroke}" stroke-width="{sw:.1f}" stroke-linejoin="round"' if stroke else ''
    return f'<path d="{d}" fill="{fill}"{st}{extra}/>'


LIGHT = (-.6, -.8)   # toward the window (upper left), screen


def _finger(H, segs, nails, creases=True):
    """one finger (or the thumb) as a cel: a line, the shade body, the lit body shifted to the light, joint creases, a nail."""
    C, s = H.C, H.s
    out = ''
    sc = [(H.m(p0), H.m(p1), w0 * s, w1 * s, a) for p0, p1, w0, w1, a in segs]
    out += ''.join(_ln(a, b, (w0 + w1) / 2 + 2 * LW * s, C['line']) for a, b, w0, w1, _ in sc)
    out += ''.join(_ln(a, b, (w0 + w1) / 2, C['shade']) for a, b, w0, w1, _ in sc)
    for a, b, w0, w1, _ in sc:
        w = (w0 + w1) / 2; o = (LIGHT[0] * w * .13, LIGHT[1] * w * .13)
        out += _ln(_add(a, o), _add(b, o), w * .74, C['base'])
    a, b, w0, w1, _ = sc[0]; w = (w0 + w1) / 2; o = (LIGHT[0] * w * .3, LIGHT[1] * w * .3)
    out += _ln(_add(a, o), _add(b, o, .85), w * .16, C['lit'], op=.9)
    if creases:   # the PIP / DIP creases on the pad side (a short line from the joint toward the flex side)
        for (p0, p1, w0, w1, ang) in segs[1:]:
            n = H.dir(ang + math.pi / 2)
            j = H.m(p0)
            out += _ln(_add(j, n, w0 * s * .08), _add(j, n, w0 * s * .46), LW * s * .8, C['deep'], op=.8)
    if nails:
        p0, p1, w0, w1, ang = segs[-1]
        a, b = H.m(p0), H.m(p1); d = H.dir(ang); w = w1 * s
        if H.S['view'] == 'dorsal':   # seen from above: the nail plate on the back of the distal segment
            c = _add(a, (b[0] - a[0], b[1] - a[1]), .62); rx, ry = math.dist(a, b) * .34, w * .32
            out += f'<ellipse cx="{c[0]:.1f}" cy="{c[1]:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" transform="rotate({math.degrees(math.atan2(d[1], d[0])):.1f} {c[0]:.1f} {c[1]:.1f})" fill="{C["nail"]}" stroke="{C["line"]}" stroke-width="{LW * s * .7:.1f}"/>'
        else:                         # a 3/4 side view: only a sliver of nail on the BACK edge (away from the pad)
            n = H.dir(ang - math.pi / 2)
            c = _add(_add(a, (b[0] - a[0], b[1] - a[1]), .6), n, w * .3)
            out += f'<ellipse cx="{c[0]:.1f}" cy="{c[1]:.1f}" rx="{math.dist(a, b) * .3:.1f}" ry="{w * .15:.1f}" transform="rotate({math.degrees(math.atan2(d[1], d[0])):.1f} {c[0]:.1f} {c[1]:.1f})" fill="{C["nail"]}" stroke="{C["line"]}" stroke-width="{LW * s * .6:.1f}"/>'
    return out


def _sleeve(H):
    """the wrist skin, the cuff and the sleeve, straight back along the forearm and off the frame (60 cm)."""
    C, s, S = H.C, H.s, H.S
    d = H.forearm_dir(); n = (-d[1], d[0])
    w0 = S['yk'](2.6) * s; w1 = S['yk'](3.4) * s
    base = H.m((0, 0))
    # the wrist runs from the palm's wrist edge: its centre is the mid of the palm's wrist corners
    wc = H.m((0, (S['palm'][0][1] + S['palm'][-1][1]) / 2))
    q = lambda t, hw, side: _add(_add(wc, d, t * s), n, side * hw)
    skin = [q(-.3, w0, 1), q(1.4, w0 * 1.02, 1), q(1.4, w0 * 1.02, -1), q(-.3, w0, -1)]
    cuff = [q(1.2, w0 * 1.1, 1), q(3.6, w0 * 1.14, 1), q(3.6, w0 * 1.14, -1), q(1.2, w0 * 1.1, -1)]
    slv = [q(3.4, w0 * 1.2, 1), q(60, w1 * 1.5, 1), q(60, w1 * 1.5, -1), q(3.4, w0 * 1.2, -1)]
    lw = LW * s * 2
    lit_side = 1 if (n[0] * LIGHT[0] + n[1] * LIGHT[1]) > 0 else -1
    out = _poly(slv, C['sleeve'], C['sleeve2'], lw)
    out += _ln(q(4.2, w0 * 1.2 * .72, lit_side), q(60, w1 * 1.5 * .72, lit_side), 1.0 * s, C['slit'], cap='butt', op=.9)
    out += _ln(q(4.2, w0 * 1.2 * .78, -lit_side), q(60, w1 * 1.5 * .78, -lit_side), 1.2 * s, C['sleeve2'], cap='butt', op=.7)
    out += _poly(skin, C['base'], C['line'], lw)
    out += _poly(cuff, C['cuff'], C['trim'], lw)
    out += _ln(q(3.1, w0 * 1.13, 1), q(3.1, w0 * 1.13, -1), .45 * s, C['trim'], cap='butt')
    return out


def _palm(H, uid):
    C, s = H.C, H.s
    pts = [H.m(p) for p in H.S['palm']]
    d = 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + 'Z'
    o = (LIGHT[0] * .5 * s, LIGHT[1] * .5 * s)
    out = f'<path d="{d}" fill="{C["shade"]}" stroke="{C["line"]}" stroke-width="{2 * LW * s:.1f}" stroke-linejoin="round"/>'
    out += f'<clipPath id="pc-{uid}"><path d="{d}"/></clipPath><path d="{d}" transform="translate({o[0]:.1f} {o[1]:.1f})" fill="{C["base"]}" clip-path="url(#pc-{uid})"/>'
    # the back-of-hand tendon highlight (lit, toward the window) + the knuckle bumps
    a, b = H.m((2.4, H.S['yk'](-1.2))), H.m((7.6, H.S['yk'](-1.6)))
    out += _ln(a, b, .35 * s, C['lit'], op=.9)
    return out


def hand(P, ang, s, pose, who='her', flip=False, wrist=0, held='', uid='h', front=''):
    """the whole hand: sleeve, back fingers, palm, index, [the held food], thumb. `front` = drawn over everything (a
    fingertip that rests ON the food). Returns (markup, Hand)."""
    H = Hand(P, ang, s, pose, who, flip, wrist)
    S = H.S
    out = _sleeve(H)
    if S['view'] == 'dorsal':   # seen from above: the thumb is under the palm (drawn first), the fingers on top
        out += _finger(H, S['t'], False, False) + _palm(H, uid)
        out += ''.join(_finger(H, S['f'][n], True) for n in ('pinky', 'ring', 'middle', 'index'))
        out += held
    else:                       # a 3/4 side view: the curled fingers behind the palm edge, the index + thumb in front
        out += ''.join(_finger(H, S['f'][n], False) for n in ('pinky', 'ring', 'middle'))
        out += _palm(H, uid) + _finger(H, S['f']['index'], True) + held + _finger(H, S['t'], True)
    return out + front, H


def shadow(markup, dx, dy, op=.28, blur='silb'):
    """the cast shadow of a cel: its silhouette, down-right (the window is upper left), softer when it is higher."""
    return f'<g transform="translate({dx:.0f} {dy:.0f})" filter="url(#{blur})" opacity="{op}">{markup}</g>'


def lift_off(s, h_cm):
    """the shadow offset (px) for a thing h_cm above the surface: the sun is high (the katori, 5 cm tall, throws ~40 px
    at 35 px/cm), so 0.24 px of shadow per px of height, along the window light."""
    k = h_cm * s * .24
    return (k * .6, k * .8)
