# Analysis: 3 GATEXX mockups + the original gate (Builder X)

Every number comes from Pillow, using `research/x/measure.py` (automatic scans) plus hand probes on single pixel rows and columns.
Ratios are fractions of the image width (W) or height (H), so a 1672×941 mockup compares directly with a 900×600 original and a 1440×810 shot.

| ref | file | notes |
|---|---|---|
| M1 | `refs/ee486fef` | 1672×941, neon logo in the bar, no portrait, 2 buttons |
| M2 | `refs/c20f7340` | 1672×941, neon sign over the modal, portrait, AND/OR/XOR buttons |
| M3 | `refs/8c0d1049` | 1672×941, neon on a grid plate inside the modal, portrait, ENTER ANYWAY / NO THANKS, close X |
| O | `9dce964e` (not committed, see `refs/README.md`) | 900×600, the original adult-site age gate |
| O' | `87c8193f` (not committed) | 759×535, the same gate as a rounded, blurred screenshot. Too soft to measure; used only to confirm O's layout |
| K | `refs/1eb8144a`, `refs/4c7ee95b` | 2560×1440, Wenrexa anime UI kit |

## Measurements

| metric | M1 | M2 | M3 | O |
|---|---|---|---|---|
| page blue | #003ab7 | #0040c5 | #003ed1 | #00016c (near-black navy) |
| bar navy | #011a5e | #001b62 | #001e6f | #090d56 top bar + a brighter nav strip |
| header height / H | .096 | .087 | .087 | .133 (2 bars) |
| modal x, y, w, h (/W, /H) | .231 .237 .537 .530 | .222 .272 .556 .570 | .231 .174 .536 .659 | .250 .247 .500 .505 |
| modal fill | #fdf2fc | #fefbfd | #fdf6fd | #00008f (a blue box on blue) |
| bevel just outside the panel | #ab34ea (purple) | #f19dfd (lilac) | #cc31e6 (magenta-purple) | 1 px darker line, no bevel |
| headline cap / H | .098 | .080 | .089 | .023 |
| headline ink share (weight proxy) | .34 | .24 | .11 (outlined 18+) | bold Arial-like sans |
| headline pink | #ed1d83 | #e52180 | #f705bd | yellow #ffff00 on the keyword only |
| first tile x, y, w, h | .024 .124 .227 .242 | .023 .116 .224 .223 | .019 .112 .222 .237 | 4-col grid, ~.26 W each |
| tile gap / W | .014 | .016 | .016 | ~.02 |
| badge colour | #0140c3 | #0244c9 | #0140d2 | #093ea9 |
| badge w, h; inset right, bottom | .065 .040; .025 .004 | .063 .039; .032 .004 | .065 .041; .015 .006 | small, bottom-right, flush |
| neon magenta | #fb4dcf | #fc44d5 | #fc66cd | none |
| yellow | none | none | #fee51f (the 18+) | #ffff00 |
| O primary button | | | | 38 px / 600 = .063 H, filled #004be8, 1 px lighter rim |
| O secondary buttons | | | | 37 px, outlined (#2039d5 rim), same fill as the modal |

Wenrexa kit (K, `1eb8144a`, the "I LOVE YOU AND YOU LOVE ME?" panel, 2560 px wide):
- **Panel:** #ffffff with a 2–3 px #ec86f4 rim. The top lip is thicker (8 px #e986f3 under a 3 px white line). The bottom has a 4 px lilac lip plus a 2 px plum #c0478c drop.
- **Pill buttons:** fill #fef2fc, 3 px #ec95f4 rim, 3 px white ring, then a 4 px #ea87f4 lip offset downward. They look pressed-in, not glossy.
- **Text:** italic condensed comic caps in #f24898. Bangers (OFL) is the closest free match.
- **Corners:** small lilac corner curls, low contrast.

## Good and bad

### M1 (neon in the logo, two buttons)
- **Good:** The strongest hierarchy. WARNING is .098 H with ink .34, so it reads first, then the "...BITS!" punchline, then the fine print, then the pills. The joke lives in the headline. Putting the neon in the logo keeps the modal clean.
- **Bad:** ENTER and I'M NOT 18 are the same size, which weakens the "one big yes" convention (see O). The purple outer bevel (#ab34ea) fights K's lilac. With no portrait, it reads as "pink adult site", not "VN".

### M2 (neon sign on top, portrait, three ENTER buttons)
- **Good:** The fullest collision: tube-site chrome, VN portrait and heart bubble, and the Wenrexa pill row. AND/OR/XOR : ENTER is the best CS joke in the set, because it parodies O's three-way ENTER row with gates.
- **Bad:** Five stacked copy lines at three sizes make the eye bounce. The headline shrinks to .080 H and ink .24. The portrait is AI art, which is a hard no for us. The three pills are equal, and there is no "I'm not 18" exit.

### M3 (grid plate, portrait, big ENTER ANYWAY)
- **Good:**
  - The best button semantics: a wide filled ENTER ANYWAY over a narrower pale NO THANKS. That matches O's filled primary over outlined secondaries.
  - The yellow 18+ (#fee51f) is the only yellow on the page, a callback to O's yellow keyword.
  - The neon plate sits inside the panel, so the sign and the modal read as one object.
- **Bad:**
  - The thinnest headline (ink .11).
  - A third type style: the plain sans body copy (legible, but one more voice).
  - A suggestive AI portrait, which we drop.

### O (the original gate)
- **Good:** Pure function. A blue box on blue (#00008f on #00016c) with bold system sans, and one yellow keyword carries all the emphasis. It has one filled primary with outlined secondaries, and the modal is centred at .25/.247/.50/.505. System fonts and flat fills mean nothing to download, so it paints instantly.
- **Bad:** Poor contrast: grey fine print on #00008f. It has no personality, which is the point for them and the opposite of ours.

## What we carry into the build
1. **Geometry:** Modal ≈ .54 W centred, header ≈ .09 H, 4×3 tiles at ≈ .225 W with ≈ .015 W gaps, badges bottom-right. All in `--u` (1% of a 16:9 frame).
2. **Colour tokens:** page #003ec5, bar #001b62, badge #0142c9, panel #fdf6fd, headline #ec1a86, fine print #f24898 (K), rims #ec86f4/#e987f4 (K), neon #fc4dd0, yellow #fee51f.
3. **Buttons:** One filled primary and one pale secondary (O and M3), styled as K's pill (ring + rim + lip).
4. **Joke placement:** The joke goes where the eye lands first: it replaces the headline (x2) or lands on top of it (x1, x3).
