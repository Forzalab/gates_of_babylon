# pit4/r1-2: variant f2 (mockup-faithful minimum)
`date.html?v=f2` (gate) and `date.html?v=f2&next=1&you=AND|OR|XOR` (continue). Files: `src/date/f2.jsx`, `f2.css`, `sfx.js`, `compat.js` (+`gateTT/agree/gateCompat`, tested), `public/sfx/`.
(Folder is `research/pit4/r1-2/` to avoid the slash in the branch name.)

## What it is
- **Base = c20f7340:** GATEXX bar, 4x3 blurred gate tiles with badges, black-grid neon plate saying **Dejting** (j and g hang past the plate rule), Wenrexa panel, XOR gate-mascot portrait (real `Shape`), mockup copy, x2's **AND : ENTER / OR : ENTER / XOR : ENTER** row (AND primary), PARENTAL CONTROLS (NOT GATE) foot.
- **y3's compat bar** as the kit's progress pill: "XOR & you (AND): 25% compatible"; hovering OR/XOR retargets it (75% / 100%) from the real sim.
- **ONE surprise: the class chat as the site's own LIVE CHAT tile** in grid col 4, rows 2-3: navy strip = top bar, blue count badge = tile badges, kit-magenta body. jay "wait is THIS the assignment??", priya "25% with XOR. still beats my lab partner" (computed), mo "is this a captcha? select all squares with a NAND gate" (M7), Prof. Kerney [PROF] "I can see who is online." + "is typing...". Lands by 1.6 s; the still shows all of it.
- **Continue: Tinder swipe on gates.** Kit title-panel cards with the real truth table vs yours (a heart per agreeing row), compat = agreeing rows / 4. Drag, buttons or arrow keys; LIKE/NOPE stamps. >=50% = IT'S A MATCH with the **M1 filing status** choice (FILE JOINTLY = AND, FILE SINGLY = OR); <50% = LEFT ON READ. HUD "MATCHES n/6 · REFUND $0". The chat tile reacts. Back to the gate + Logic links.

## School S2: Sakurai / Nijman / Swink (what I took)
- Readability first (Sakurai, "Creating Games"): one focal panel, the % always in the same pill.
- Instant feedback (Swink, *Game Feel*): hover lift, press squash 1.07x.88 in 50 ms, the card tracks the pointer 1:1.
- Hit-stop (Sakurai): a 90 ms freeze at 1.05 before a swipe flies; ENTER holds 260 ms with a heart burst.
- Screenshake sparingly (Nijman, "The Art of Screenshake"): one 6 px shake, only on a match.
- Overshoot on arrivals: modal pop, chat bubbles, next card, the % number.
- Sound (Kenney CC0, SOUND.md): tick/select per chat message, rollover, confirmation on ENTER, card-slide on NOPE, pluck +8%/streak on LIKE, PIZZI on a match (powerUp on a streak), error + phaserDown on HURT. Gesture unlock, SOUND ON/OFF in the bar, Logic silent, 140 KB.
- Reduced motion / `&still=1`: no animation, landed stills.

## Deltas vs c20f7340 (Pillow `measure.py`, 1440x810)
| metric | mockup c20f7340 | f2 @1440 | target |
|---|---|---|---|
| top bar hex | #001a61 | #001b62 | #001b62 ±15 |
| grid bg hex | #0040c4 | #003ec5 | #003ec5 ±15 |
| header h / H | 0.088 | 0.089 | .085-.10 |
| WARNING cap / H | 0.072 | 0.105 | .11-.13 |
| headline pink | #ed167f | #ea1b87 | #f01a88 ±20 |
| modal x-span | .22-.78 | 0.220-0.780 (w 0.560) | w .52-.58, centred |
| modal y-span incl sign | .14-.85 (h .71) | 0.152-0.847 (h 0.695) | h .55-.70 |
| tile w/W, h/H, grid bottom | .225, .24, .90 | 0.227, 0.246, 0.906 | ≈.225 × .24, ≥.90 |
| sign overlap of own h | ≈.38 | 0.37 | .30-.40 |
| L/R luminance | - | 137.3 / 144.0 (4.6%) | ≤12% |
| chat mean colour | - | #bf9ccb | within ΔRGB 40 of a token |
| surprise over text/buttons | - | 0.03% | ≤2% |

Iteration: modal y-span .76 -> .695, WARNING .098 -> .105, grid bottom .899 -> .906, button overflow fixed, chat body beige -> kit magenta.
The mockup's own WARNING cap is .072 H by this method (not the rubric's .114); I stopped at .105 because a bigger word overflows the copy column.
Side-by-sides: `shots/sbs-c20f7340.png`, `sbs-ee486fef.png`, `sbs-8c0d1049.png`, `blend-c20f7340.png`.

## Remaining deltas
- WARNING .105 vs the .11 floor.
- Chat mean colour #bf9ccb, about ΔRGB 45 from rim #ec86f4 (white bubbles + navy strip).
- Tiles are pit3's gradient blur; the portrait is a gate mascot (by rule).
- The chat takes 2 of 12 tile slots by design; the modal overlaps its inner 43 px, so its content is inset.

## Checks
`npm test` 132/132, build, `npm run e2e` pass; 0 page errors; no horizontal scroll at 1440/1024.
