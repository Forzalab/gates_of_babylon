# pit4/r1-1: f1 (`date.html?v=f1`, continue `&v=f1&next=1`)

## What it is
- **Base:** x3's layout, as in M3. The neon plate sits over the panel. The portrait is our AND-gate mascot (the real `Shape`). WARNING is followed by "THESE GATES ARE **18+**" (the yellow 18+ is the only yellow on the page, verified by Pillow: every yellow pixel falls inside the 18+ box) and "... AND A FEW BITS NAUGHTY ♡". A wide ENTER ANYWAY sits over a narrow NO THANKS, and there is a ✕.
- **Neon:** "Dejting", a Yellowtail tube on a black grid plate. The j and g descenders hang below the plate rule into the panel. 39% of the sign's height rises above the modal top (target 30–40%).
- **ONE surprise: Prof. Kerney has already graded the age gate.** A red-pen ring around "B+", the note "bold choice. see me after class. – K.", and a red tick next to ENTER ANYWAY.
  - It lives in the portrait column, under the portrait, so its left and right edges are the portrait's edges. The tick sits in the column gutter.
  - It covers no text and no button: the `&clean=1` diff inside the h1, fine-print and button boxes is **0.00%**. `&clean=1` hides the ink but keeps the box, so nothing reflows.
  - The pen is the one non-palette ink (#d8102e, per the rubric). The note uses the page's own Yellowtail script, so there is no new font, and the ring is a hand-drawn SVG path.
  - Timing: it lands at 1.5 s (the ring draws, B+ slams in, the note inks, then the tick). The reduced-motion still shows it fully drawn.
- **Tiles fixed:** pit3's tile blobs used `hsl(calc(330 + var(--h)*1deg))`, which is invalid CSS (number + angle), so every tile rendered flat #a4707e. f1 uses valid calcs, warm blotches per tile, and SVG film grain. The grid now fills to .95 H, with no dead band.

## Continue screen: MATCH FEED (`&next=1`)
- A 4×3 tube-grid of Wenrexa cards. Each card has a black neon-grid "tube" running a **live gate pair** (the real `Shape` and `sim.evaluate` via `compat.js`, stepping through truth-table rows), a compat % badge, a meter, and a one-liner ("same truth table. soulmates.", "total opposites (hot)").
- ♡ is swipe right: an "IT'S A MATCH!" P5 stamp and "please take a number: A-1xx".
- **Mundane lens M2 (the DMV):** a tear-off queue ticket in the header strip shows NOW SERVING A-042 (it ticks up live), YOUR NUMBER A-117, and EST. WAIT n clock cycles. Kerney's red pen appears again under it: "still B+. show your truth tables. – K."
- **Navigation:** ◀ BACK TO GATE returns to `?v=f1` and LOGIC MODE goes to `/`. ENTER on the gate leads here through a P5 slash wipe. Playwright verified all three.

## Design school: Atlus / Persona 5 "UI as character" (Masayoshi Suto)
What I took, kept inside the GATEXX palette:
- **Cut-out, tilted type:** WARNING / MATCH FEED is rotated −3°, skewed −8°, with a white knock-out edge and a hard navy offset shadow, like a sticker pasted on the panel. The 18+ gets the same navy shadow.
- **Menus with attitude:** the dialog *slams* in (from the right, rotated and skewed, with overshoot), and the headline punches in after it. The B+ slams in with the same overshoot curve.
- **Every transition is a performance:** ENTER and BACK do not simply navigate. Two tilted slashes (hot pink, then navy) cross the screen first (P5's menu-to-menu wipe). Feed cards deal in, staggered by 45 ms.
- What I did not take: P5's red/black palette and its ransom-note mixed fonts. Both would break the rubric's palette and type-scale checks.

## Sound (Kenney CC0, `public/sfx`, 12 files, 124 KB; `src/date/sfx.js`)
- glitch on entering Dejting (silent if autoplay is blocked)
- `jingles_HIT00` when the red-pen grade lands. Coordinator round 2 allowed this in place of `drop_`, since the rule is one sound per event.
- confirmation, then chips, on ENTER
- error on NO THANKS / ✕, before the bounce to Logic
- `jingles_SAX00` on a feed match, pitched up +8% per extra match (capped at 1.6)
- a click on unmatch and on BACK
- a debounced rollover on button hover
- **Mute:** a Web-1.0 button in the site bar, matching the Search button's chrome, remembered in localStorage. The Kenney UI pack has no speaker icon, so the glyph is inline SVG.
- **Logic stays silent:** only `date-*.js` references sfx.
- **Not used:**
  - neon-flicker `spaceTrash`: a sound every 6 s would nag in a classroom
  - emote PNGs: the portrait already has a heart bubble, and a Kenney emote read as tacked on

## Measured deltas (Pillow; `measure2.py` + `research/x/measure.py`; 1440×810 reduced-motion still vs M3 `8c0d1049`)
| target (rubric) | ref M3 | f1 1440 | f1 1024 | status |
|---|---|---|---|---|
| top bar #001b62 ±15 | #001e6f | #001b62 | #001b62 | in |
| grid bg #003ec5 ±15 | #003ed1 | #003ec5 | #003ec5 | in |
| headline pink #f01a88 ±20 | #f705bd* | #ec1a86 (median of WARNING ink) | #ec1986 | in (ΔRGB 5) |
| WARNING cap / H .11–.13 | .089 (measure.py) | .117 de-rotated (.142 raw ink incl. tilt) | .093 de-rot / .112 raw | in at 1440; 1024 is width-bound (16:9 units on 4:3) |
| header / H .085–.10 | .087 | .089 | .089 | in (1024 was .066 in pit3; now `max(5u, 8.8vh)`) |
| modal width .52–.58, centred ±1% | .536 | .550, off 0.0% | .551, off 0.0% | in |
| modal y-span incl. neon .55–.70 | .659 | .710 (.151–.860) | .534 | 1440 +.01 over, 1024 −.016 under (both within 25%) |
| tile .225 W × .24 H, gap .015, grid ≥ .90 H | .222/.237/.0156 | .227/.26/.0153, grid ends .954 H | .227/.279/.0156 | in (tile h +.02 because the grid fills to the bottom) |
| badges blue, bottom-right | #0140d2 | #0142c9 | same | in |
| yellow only on 18+ | – | all yellow px inside the 18+ box | same | in |
| neon: Dejting, j/g below the rule, 30–40% above modal | – | 39% | 39% | in |
| surprise overlap of text/buttons (clean diff) | – | 0.00% | 0.00% | in |
| L/R luminance balance ≤12% | – | 3.8% | 2.9% | in |
| page errors (incl. favicon) | – | 0 | 0 | in (inline SVG heart favicon) |

*`measure.py` samples the M3 headline mid-row, where the anime-style ink is magenta; our WARNING median is the pure token.

## Remaining deltas / honest notes
- At 1024×768 the modal is a touch short (.534 H) and the WARNING cap is .093, because every size is in 16:9 `u` units and 1024×768 is 4:3. Growing the panel there would break the width target.
- The tiles are still a little pinker and brighter than M3's brown-pink photo blur (same family). There are no photos, by rule.
- The neon g's descender ends just above the right end of WARNING. It is intentional (the descender hangs past the rule), but it is close.
- The measure.py "bevel" metric reads #e481e6 vs M3 #cc31e6 because its ring sampler catches our lilac rim before the violet outer bevel.

## Files
- `src/date/f1.jsx`, `src/date/f1.css`, `src/date/sfx.js`, `public/sfx/*`, plus small `export`s and the `f1` route in `src/date/main.jsx`, and the favicon in `date.html`.
- Shots: `research/pit4/pit4-r1-1/shots/` (gate and next at 1440 and 1024, animated and reduced-motion stills, `gate-clean`, `next-liked`).
- Side-by-sides: `sbs-8c0d1049.png`, `sbs-c20f7340.png`, `sbs-ee486fef.png`, `sbs-gate-next.png`.
- Tools: `shots.mjs`, `headcap.mjs` (DOM boxes → `boxes.json`), `measure2.py`, `sidebyside.py`.
- `npm test` 131/131, `npm run build` OK, `npm run e2e` "All e2e checks passed" (Logic unchanged).
