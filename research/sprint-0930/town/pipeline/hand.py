# TOWN hand pass (step 2 of "auto trace -> hand -> auto trace"): over each FIRST trace, draw
#   - straight verticals + one vanishing point (VP, the same one prep.py placed the ref on): road, curbs, crosswalk,
#     paving lines and every side-wall board run to it; every building edge / sign edge is vertical;
#   - ALL signs + billboards redrawn as OUR art + text (no ref brand survives): the logic-gate puns (NOTES.md),
#   - a crowd of flat silhouettes (no faces anywhere), heads on the eye line (= the VP height),
#   - the brighter 2:45 PM grade (a warm screen wash + lifted blacks),
#   - per shot: the AKIBA street (1), your arm with her hands on it in the crossing (2), the giant billboard of our own
#     character ゲートちゃん with the NANDでも推せる！ pun (3).
# No art text above y 140 (the HUD band); nothing that must read sits under the dialogue box (y > 770) or in Nanda's
# column (x 730-1190, y > 420).
# usage: python3 hand.py <trace1 png dir> <out dir>   -> <out>/<id>.svg (1920x1080, then render.mjs DIRECT=1 -> png)
import sys, os, math

T1, OUT = os.path.abspath(sys.argv[1]), sys.argv[2]
JP = "font-family=\"'IPAGothic','IPAPGothic','Noto Sans CJK JP',sans-serif\" font-weight=\"700\""
EN = "font-family=\"'DejaVu Sans','Arial Black',sans-serif\" font-weight=\"900\""
HUD = 140

# flat palette (48-colour safe: few, far-apart colours)
C = dict(ink='#2b2433', white='#fffaf2', pink='#ff5fa2', pinkHi='#ffb3cf', red='#e8363c', orange='#ff8a2a', yellow='#ffd23f',
         teal='#3fc4bb', tealLo='#23918a', tealHi='#a8efe6', navy='#2b2a55', violet='#7b5cff', sky='#bfe6ff', skin='#fde0cf',
         skinLo='#f0b8a0', blush='#ff9fb8', pave='#d9d0cc', paveLo='#b9aeb0', road='#9fa0ac', roadLo='#83849a', knit='#3d6b4a',
         knitLo='#2a4a34', her='#ffb3cf', herLo='#e58cb0', nail='#e0467f', green='#2e8a4a', blue='#2f6fd6', cream='#fff1c4')
SIL = ['#2d3450', '#4a3a5c', '#3e4a63', '#5a4540', '#34303f', '#4d566e']


def P(pts): return ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)


def toward(vp, x, y, xt):
    """the y at x = xt on the line from (x, y) to the VP"""
    vx, vy = vp
    return y + (vy - y) * (xt - x) / (vx - x)


def vsign(x, y, w, chars, bg, fg, stroke=C['ink'], rim=None, size=None):
    """a vertical 縦看板 sticking out of a facade = it faces the camera, so it is a plain upright rect; one char per cell"""
    size = size or w * 0.72
    h = len(chars) * size * 1.08 + size * 0.5
    assert y >= HUD, ('HUD band', chars)
    o = [f'<rect x="{x}" y="{y}" width="{w}" height="{h:.0f}" rx="6" fill="{bg}" stroke="{stroke}" stroke-width="5"/>']
    if rim: o.append(f'<rect x="{x + 7}" y="{y + 7}" width="{w - 14}" height="{h - 14:.0f}" rx="4" fill="none" stroke="{rim}" stroke-width="4"/>')
    for i, ch in enumerate(chars):
        ch = {'ー': '｜', '・': '・'}.get(ch, ch)  # vertical writing: the long vowel mark stands up
        cy = y + size * 0.3 + (i + 0.82) * size * 1.08
        f = EN if ch.isascii() else JP
        s = size * (0.86 if ch.isascii() else 1)
        o.append(f'<text x="{x + w / 2}" y="{cy:.0f}" text-anchor="middle" font-size="{s:.0f}" fill="{fg}" {f}>{ch}</text>')
    return '\n'.join(o)


def hsign(x, y, w, h, text, bg, fg, size, stroke=C['ink'], font=JP, rim=None, sub=None):
    assert y >= HUD, ('HUD band', text)
    o = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{bg}" stroke="{stroke}" stroke-width="6"/>']
    if rim: o.append(f'<rect x="{x + 8}" y="{y + 8}" width="{w - 16}" height="{h - 16}" rx="5" fill="none" stroke="{rim}" stroke-width="4"/>')
    ty = y + h / 2 + size * 0.36 - (size * 0.3 if sub else 0)
    o.append(f'<text x="{x + w / 2}" y="{ty:.0f}" text-anchor="middle" font-size="{size}" fill="{fg}" {font}>{text}</text>')
    if sub: o.append(f'<text x="{x + w / 2}" y="{ty + size * 0.72:.0f}" text-anchor="middle" font-size="{size * 0.42:.0f}" fill="{fg}" {JP}>{sub}</text>')
    return '\n'.join(o)


def person(x, head_y, h, col, stride=0, bag=None, back=True):
    """a flat walking silhouette, head top at head_y, h tall (feet at head_y + h); no face, no detail"""
    s = h / 100
    g = [f'<g transform="translate({x} {head_y}) scale({s:.3f})" fill="{col}">',
         '<ellipse cx="0" cy="8" rx="7.2" ry="8.4"/>',                                   # head
         '<path d="M-4 15 h8 v4 h-8z"/>',                                                  # neck
         '<path d="M-13 20 Q0 16 13 20 L15 52 Q0 56 -15 52 Z"/>',                          # coat
         f'<path d="M-9 51 L{-9 - stride} 98 L{-3 - stride} 98 L-1 55 Z"/>',              # legs
         f'<path d="M9 51 L{9 + stride} 98 L{3 + stride} 98 L1 55 Z"/>',
         '<path d="M-13 21 L-17 48 L-13 49 L-10 26 Z"/><path d="M13 21 L17 48 L13 49 L10 26 Z"/>']  # arms
    if bag: g.append(f'<rect x="12" y="38" width="11" height="13" rx="2" fill="{bag}"/>')
    g.append('</g>')
    return ''.join(g)


def crowd(spec, head_y):
    """spec = [(x, h, colour index, stride, bag?)]; heads all on the eye line (eye-level camera), so nearer = taller"""
    return '\n'.join(person(x, head_y - h * 0.02, h, SIL[c % len(SIL)], st, C['pinkHi'] if b else None) for x, h, c, st, b in spec)


def paving(vp, y0, fill, line, n=14, rows=8, spread=5200):
    """a floor from the eye line down, with seams running to the VP and cross seams spaced in perspective"""
    vx, vy = vp
    o = [f'<rect x="0" y="{y0}" width="1920" height="{1080 - y0}" fill="{fill}"/>']
    for i in range(n + 1):
        bx = vx - spread / 2 + spread * i / n
        # seam from where it crosses y0 to the bottom
        t0 = (y0 - vy) / (1080 - vy)
        o.append(f'<line x1="{vx + (bx - vx) * t0:.0f}" y1="{y0}" x2="{bx:.0f}" y2="1080" stroke="{line}" stroke-width="3"/>')
    for j in range(1, rows + 1):
        y = vy + (1080 - vy) * (j / rows) ** 2
        if y > y0: o.append(f'<line x1="0" y1="{y:.0f}" x2="1920" y2="{y:.0f}" stroke="{line}" stroke-width="2"/>')
    return '\n'.join(o)


def wall_board(vp, xn, xf, yt, yb, fill, stroke=C['ink'], cid=None, inner=''):
    """a board flat on a side wall: vertical near + far edges, top + bottom run to the VP; `inner` is clipped to it"""
    q = [(xn, yt), (xf, toward(vp, xn, yt, xf)), (xf, toward(vp, xn, yb, xf)), (xn, yb)]
    o = []
    if cid:
        o.append(f'<clipPath id="{cid}"><polygon points="{P(q)}"/></clipPath>')
    o.append(f'<polygon points="{P(q)}" fill="{fill}" stroke="{stroke}" stroke-width="6" stroke-linejoin="round"/>')
    if inner and cid: o.append(f'<g clip-path="url(#{cid})">{inner}</g>')
    return '\n'.join(o), q


def sparkle(x, y, r, col=C['white']):
    return f'<path d="M{x} {y - r} L{x + r * .25} {y - r * .25} L{x + r} {y} L{x + r * .25} {y + r * .25} L{x} {y + r} L{x - r * .25} {y + r * .25} L{x - r} {y} L{x - r * .25} {y - r * .25}Z" fill="{col}"/>'


def gate_chan(cx, cy, s, wink=False):
    """ゲートちゃん: OUR original idol character (not a copy of any ref): mint twin tails, blunt bangs, violet eyes, a
    yellow AND-gate hair clip, a navy sailor collar with a pink ribbon. Face radius ~100 * s, centre (cx, cy)."""
    eye = lambda ex, flip: (
        f'<ellipse cx="{ex}" cy="18" rx="25" ry="31" fill="{C["white"]}"/>'
        f'<ellipse cx="{ex}" cy="21" rx="19" ry="26" fill="{C["violet"]}"/>'
        f'<ellipse cx="{ex}" cy="12" rx="19" ry="13" fill="#4b2fc2"/>'
        f'<ellipse cx="{ex}" cy="24" rx="8" ry="12" fill="#231654"/>'
        f'<circle cx="{ex + 7 * flip}" cy="9" r="7" fill="{C["white"]}"/><circle cx="{ex - 6 * flip}" cy="34" r="3.5" fill="{C["white"]}"/>'
        f'<path d="M{ex - 30} {6} Q{ex} {-22} {ex + 30} {4} L{ex + 30} {-2} Q{ex} {-28} {ex - 30} {0}Z" fill="{C["ink"]}"/>'
        f'<path d="M{ex - 16} -26 Q{ex} -32 {ex + 16} -27" stroke="{C["tealLo"]}" stroke-width="4" fill="none" stroke-linecap="round"/>')
    right = eye(42, -1) if not wink else f'<path d="M20 22 Q42 6 64 22" stroke="{C["ink"]}" stroke-width="7" fill="none" stroke-linecap="round"/>'
    return f'''<g transform="translate({cx} {cy}) scale({s})">
  <path d="M-118 -70 Q-215 40 -190 300 L-120 300 Q-150 80 -96 -10Z" fill="{C['teal']}" stroke="{C['tealLo']}" stroke-width="5"/>
  <path d="M118 -70 Q215 40 190 300 L120 300 Q150 80 96 -10Z" fill="{C['teal']}" stroke="{C['tealLo']}" stroke-width="5"/>
  <ellipse cx="0" cy="-14" rx="128" ry="136" fill="{C['teal']}"/>
  <rect x="-22" y="92" width="44" height="46" fill="{C['skinLo']}"/>
  <path d="M-170 300 Q-160 170 -52 132 L0 196 L52 132 Q160 170 170 300Z" fill="{C['white']}" stroke="{C['ink']}" stroke-width="5"/>
  <path d="M-52 132 L0 196 L52 132 L96 150 L0 250 L-96 150Z" fill="{C['navy']}"/>
  <path d="M-34 214 L0 232 L34 214 L30 262 L0 240 L-30 262Z" fill="{C['pink']}" stroke="{C['ink']}" stroke-width="3"/>
  <path d="M-96 -24 Q-94 70 0 116 Q94 70 96 -24 Q90 -112 0 -116 Q-90 -112 -96 -24Z" fill="{C['skin']}" stroke="{C['skinLo']}" stroke-width="3"/>
  {eye(-42, 1)}{right}
  <ellipse cx="-60" cy="60" rx="17" ry="8" fill="{C['blush']}"/><ellipse cx="60" cy="60" rx="17" ry="8" fill="{C['blush']}"/>
  <path d="M-16 70 Q0 92 16 70 Q0 78 -16 70Z" fill="#c0405a" stroke="{C['ink']}" stroke-width="2.5"/>
  <path d="M-116 -26 Q-112 -150 0 -152 Q112 -150 116 -26 L96 -36 L80 0 L60 -46 L34 -10 L10 -52 L-14 -12 L-40 -50 L-62 -6 L-82 -44 L-98 -2Z" fill="{C['teal']}" stroke="{C['tealLo']}" stroke-width="4"/>
  <path d="M-60 -128 Q-20 -142 30 -130" stroke="{C['tealHi']}" stroke-width="9" fill="none" stroke-linecap="round"/>
  <g transform="translate(-112 -118) rotate(-18)">
    <path d="M-18 8 h-16 M-18 30 h-16 M40 19 h16" stroke="{C['ink']}" stroke-width="5"/>
    <path d="M-18 -4 h26 a23 23 0 0 1 0 46 h-26Z" fill="{C['yellow']}" stroke="{C['ink']}" stroke-width="5"/>
  </g>
</g>'''


def svg(id, body, wash=0.10):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
<image href="file://{T1}/{id}.png" width="1920" height="1080"/>
{body}
<rect width="1920" height="1080" fill="{C['cream']}" opacity="{wash}"/>
</svg>'''


# ---------------------------------------------------------------- 1. the AKIBA street (ref 04 + 02/03) ----
def street():
    vp = (960, 560)
    o = []
    # the street floor from the eye line: sidewalks + the road wedge, all seams on the VP
    o.append(paving(vp, 600, C['pave'], C['paveLo'], n=26, rows=9))
    o.append(f'<polygon points="{P([(930, 600), (990, 600), (1560, 1080), (360, 1080)])}" fill="#c4b3ad"/>')
    for x0 in (360, 1560):
        o.append(f'<line x1="{x0}" y1="1080" x2="{930 if x0 < 960 else 990}" y2="600" stroke="{C["roadLo"]}" stroke-width="10"/>')
    # bollards, verticals, on the curbs (they shrink toward the VP)
    for t in (0.35, 0.55, 0.75):
        for side in (-1, 1):
            bx = 960 + side * (600 * t + 10)
            by = 560 + 520 * t
            hh = 80 * t
            o.append(f'<rect x="{bx - 7 * t:.0f}" y="{by - hh:.0f}" width="{14 * t + 2:.0f}" height="{hh:.0f}" fill="{C["ink"]}"/>')
    # left facade: the giant side-wall billboard (ours: ゲートちゃん + her title) over the ref's
    inner = (f'<rect x="0" y="0" width="700" height="700" fill="{C["pinkHi"]}"/>'
             f'<path d="M0 60 L700 420 L700 700 L0 700Z" fill="{C["sky"]}" opacity=".7"/>'
             f'<g transform="rotate(12 260 400)">{gate_chan(270, 380, 0.9)}</g>'
             + ''.join(sparkle(x, y, 26) for x, y in ((80, 260), (520, 420), (160, 480))))
    b, _ = wall_board(vp, 0, 600, 150, 700, C['pinkHi'], cid='lb', inner=inner)
    o.append(b)
    # its title, a vertical banner on the near edge
    o.append(vsign(24, 190, 92, 'ゲートちゃん', C['navy'], C['white'], rim=C['pink']))
    # the store row under it: a flat fascia run to the VP
    b, q = wall_board(vp, 0, 700, 700, 800, C['orange'])
    o.append(b)
    o.append(f'<text x="70" y="772" font-size="54" fill="{C["white"]}" {JP} transform="rotate(-11 70 772)">推し活グッズ</text>')
    # protruding vertical signs (facing us), left side
    o.append(vsign(640, 170, 70, 'メイド・イン・NAND', C['pink'], C['white'], rim=C['white'], size=44))
    o.append(vsign(520, 200, 78, 'まんが', C['yellow'], C['ink'], size=56))
    # the end of the street: the white roof sign of オア電 (OR + オノデン), front on, over the VP
    o.append(f'<rect x="800" y="330" width="320" height="230" fill="{C["white"]}" stroke="{C["ink"]}" stroke-width="4"/>')
    for i in range(4):
        o.append(f'<rect x="{820 + i * 76}" y="440" width="56" height="34" fill="{C["sky"]}" stroke="{C["ink"]}" stroke-width="3"/>')
    o.append(hsign(790, 250, 340, 96, 'オア電', C['white'], C['red'], 76, stroke=C['red'], rim=C['red']))
    # right facade: the ANDロイド board on the wall + protruding signs
    inner = (f'<rect x="1200" y="0" width="720" height="800" fill="{C["blue"]}"/>'
             f'<g transform="rotate(-9 1620 420)">'
             f'<rect x="1740" y="250" width="110" height="200" rx="20" fill="{C["ink"]}"/><rect x="1752" y="268" width="86" height="160" rx="8" fill="{C["tealHi"]}"/>'
             f'<text x="1560" y="470" text-anchor="middle" font-size="80" fill="{C["white"]}" {JP}>ANDロイド</text></g>')
    b, _ = wall_board(vp, 1920, 1320, 160, 640, C['blue'], cid='rb', inner=inner)
    o.append(b)
    o.append(vsign(1240, 180, 76, '推し', C['red'], C['white'], rim=C['yellow'], size=58))
    o.append(vsign(1130, 230, 64, 'カレー', C['orange'], C['white'], size=46))
    b, _ = wall_board(vp, 1920, 1200, 640, 760, C['yellow'])
    o.append(b)
    # the crowd far down the street: heads on the eye line (y 560)
    o.append(crowd([(700, 90, 0, 3, 0), (760, 110, 1, -3, 1), (1180, 100, 2, 4, 0), (1250, 130, 3, -4, 0), (560, 170, 4, 5, 1),
                    (1400, 190, 5, -5, 0), (860, 70, 2, 2, 0), (1080, 76, 0, -2, 0)], 562))
    return svg('street', '\n'.join(o))


# ---------------------------------------------------------------- 2. the crossing (refs 05 + 01) ----
def crossing():
    vp = (960, 520)
    o = []
    # buildings: straight verticals, flat facades over the mush of the first trace
    o.append(f'<rect x="0" y="0" width="330" height="560" fill="#e9e1ea"/>')
    o.append(f'<rect x="330" y="60" width="330" height="500" fill="{C["yellow"]}"/>')
    for r in range(4):
        for c in range(3):
            o.append(f'<rect x="{360 + c * 100}" y="{150 + r * 95}" width="70" height="60" fill="{C["sky"]}" stroke="{C["ink"]}" stroke-width="3"/>')
    o.append(f'<rect x="1300" y="0" width="620" height="560" fill="#f0e6d8"/>')
    # signs (ours)
    o.append(vsign(60, 160, 96, 'オア電', C['white'], C['red'], stroke=C['red'], rim=C['red'], size=74))
    o.append(vsign(190, 170, 80, 'まんが館', C['blue'], C['white'], size=58))
    o.append(vsign(690, 160, 84, '萌え', C['pink'], C['white'], rim=C['white'], size=62))
    o.append(hsign(1330, 150, 560, 300, 'ANDロイド', C['blue'], C['white'], 84, rim=C['tealHi'], sub='最新スマホ あります'))
    o.append(f'<rect x="1812" y="180" width="60" height="110" rx="12" fill="{C["ink"]}"/><rect x="1820" y="190" width="44" height="88" rx="5" fill="{C["tealHi"]}"/>')
    o.append(hsign(1000, 330, 250, 84, 'カレー →', C['orange'], C['white'], 58))
    # the road + the crosswalk, stripes running to the VP
    o.append(paving(vp, 560, C['road'], C['roadLo'], n=6, rows=6, spread=9000))
    for i in range(-9, 10, 2):
        a0, a1 = 960 + i * 330, 960 + (i + 1) * 330
        t0 = (600 - 520) / (1080 - 520)
        o.append(f'<polygon points="{P([(960 + (a0 - 960) * t0, 600), (960 + (a1 - 960) * t0, 600), (a1, 1080), (a0, 1080)])}" fill="{C["white"]}"/>')
    # the crowd: dozens of flat silhouettes, heads on the eye line, near = big (their legs run off the frame)
    spec = [(40, 520, 0, 8, 0), (230, 430, 1, -8, 1), (400, 360, 2, 6, 0), (560, 300, 3, -6, 0), (680, 250, 4, 5, 1),
            (1250, 260, 5, -5, 0), (1380, 330, 0, 6, 1), (1540, 400, 1, -7, 0), (1720, 470, 2, 8, 0), (1880, 560, 3, -8, 0),
            (620, 180, 5, 3, 0), (800, 150, 2, -3, 0), (880, 120, 0, 2, 0), (1040, 130, 1, -2, 1), (1130, 170, 3, 3, 0),
            (500, 200, 4, -4, 0), (1450, 210, 2, 4, 0), (330, 240, 5, 4, 0), (1620, 250, 4, -4, 1)]
    spec.sort(key=lambda s: s[1])  # far (short) first, near (tall) on top
    o.append(crowd(spec, 522))
    # your arm (dark green knit) in from the left, and her two hands wrapped round it (pink sleeves, pink nails)
    o.append(f'<path d="M-20 600 Q360 588 760 628 L760 712 Q360 690 -20 740Z" fill="{C["knit"]}" stroke="{C["knitLo"]}" stroke-width="6"/>')
    for k in range(6):
        x = 60 + k * 110
        o.append(f'<path d="M{x} {606 + k * 3} q10 50 0 {110 - k * 3}" stroke="{C["knitLo"]}" stroke-width="4" fill="none"/>')
    for hx, hy, rot in ((600, 640, -8), (700, 668, 6)):
        o.append(f'<g transform="translate({hx} {hy}) rotate({rot})">'
                 f'<path d="M40 -40 L150 -52 L160 30 L50 40Z" fill="{C["pink"]}" stroke="{C["ink"]}" stroke-width="5"/>'
                 f'<path d="M50 -38 Q-10 -46 -46 -20 Q-60 0 -40 18 Q0 30 50 36Z" fill="{C["skin"]}" stroke="{C["skinLo"]}" stroke-width="4"/>'
                 + ''.join(f'<path d="M{-40 + j * 6} {-18 + j * 11} q-14 4 -12 12" stroke="{C["skinLo"]}" stroke-width="3" fill="none"/>'
                           f'<ellipse cx="{-50 + j * 6}" cy="{-12 + j * 11}" rx="7" ry="5" fill="{C["red"]}"/>' for j in range(4))
                 + '</g>')
    return svg('crossing', '\n'.join(o))


# ---------------------------------------------------------------- 3. the billboard (refs 06 + 07) ----
def board():
    vp = (1000, 600)
    o = []
    # left: the corner building, a flat facade with the GIANT billboard on it (straight verticals)
    o.append(f'<rect x="0" y="0" width="820" height="760" fill="#e7ddd6"/>')
    o.append(f'<rect x="40" y="0" width="760" height="140" fill="#cfc2bd"/>')
    inner = (f'<rect x="70" y="150" width="700" height="480" fill="{C["pinkHi"]}"/>'
             f'<circle cx="330" cy="330" r="230" fill="{C["white"]}" opacity=".6"/>'
             + ''.join(sparkle(x, y, r) for x, y, r in ((120, 200, 30), (560, 210, 22), (140, 520, 18), (600, 330, 16)))
             + gate_chan(330, 330, 0.95, wink=False))
    o.append(f'<clipPath id="bb"><rect x="70" y="150" width="700" height="480"/></clipPath>')
    o.append(f'<rect x="56" y="140" width="728" height="504" rx="6" fill="{C["ink"]}"/>')
    o.append(f'<g clip-path="url(#bb)">{inner}</g>')
    o.append(vsign(640, 168, 104, 'ゲートちゃん', C['navy'], C['white'], rim=C['yellow'], size=62))
    o.append(f'<rect x="70" y="552" width="570" height="78" fill="{C["pink"]}"/>')
    o.append(f'<text x="355" y="610" text-anchor="middle" font-size="54" fill="{C["white"]}" stroke="{C["ink"]}" stroke-width="3" paint-order="stroke" {JP}>NANDでも推せる！</text>')
    # the shop under it: our pawn shop (質 = the generic pawn-shop kanji, no brand)
    o.append(f'<rect x="0" y="644" width="820" height="116" fill="{C["orange"]}" stroke="{C["ink"]}" stroke-width="5"/>')
    o.append(f'<circle cx="110" cy="702" r="48" fill="{C["white"]}" stroke="{C["ink"]}" stroke-width="6"/>')
    o.append(f'<text x="110" y="724" text-anchor="middle" font-size="62" fill="{C["ink"]}" {JP}>質</text>')
    o.append(f'<text x="420" y="722" text-anchor="middle" font-size="56" fill="{C["white"]}" {JP}>買取 ゲーム・まんが</text>')
    # centre: the maid café sign above her head
    o.append(hsign(830, 170, 460, 110, 'メイド・イン・NAND', C['pink'], C['white'], 42, rim=C['white']))
    o.append(f'<rect x="830" y="280" width="460" height="10" fill="{C["ink"]}"/>')
    # right: tall buildings + protruding signs
    o.append(f'<rect x="1300" y="0" width="620" height="620" fill="#efe4d2"/>')
    for r in range(5):
        for c in range(4):
            o.append(f'<rect x="{1560 + c * 88}" y="{160 + r * 90}" width="60" height="56" fill="{C["sky"]}" stroke="{C["ink"]}" stroke-width="3"/>')
    o.append(vsign(1340, 160, 92, 'オア電', C['white'], C['red'], stroke=C['red'], rim=C['red'], size=70))
    o.append(vsign(1460, 170, 80, 'ANDロイド', C['blue'], C['white'], size=52))
    # the street from the eye line down, seams on the VP
    o.append(paving(vp, 620, C['pave'], C['paveLo'], n=20, rows=8))
    o.append(crowd([(880, 110, 0, 3, 0), (1120, 120, 2, -3, 1), (1240, 170, 1, 4, 0), (760, 150, 3, -4, 0),
                    (1650, 380, 4, 6, 1), (1820, 470, 5, -7, 0), (120, 460, 2, 7, 0), (300, 360, 0, -6, 1)], 602))
    return svg('board', '\n'.join(o), wash=0.08)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for k, f in {'street': street, 'crossing': crossing, 'board': board}.items():
        open(os.path.join(OUT, k + '.svg'), 'w').write(f()); print('hand', k)
