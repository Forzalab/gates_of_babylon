# Report: Builder X, Date mode variants x1–x3

Live at `date.html?v=x1|x2|x3` (dev and production build). `?still` forces the reduced-motion still.

The CS surprise lands about 1.5–1.8 s after load (instantly under reduced motion). Before that, each page reads as a straight copy of its mockup.

**Shared by all three variants:**
- **Grid:** Every tile is a live pair of real `Shape` gates (switches a, b → gate A → gate B). Lit values come from `sim.evaluate` and step through the 4 truth-table rows every 1.1 s.
- **Tile compat and hover:** Compat = matching rows / 4 (`src/date/compat.js`, tested in `src/date-compat.test.js`). The view badge is compat % × a fake number, so the AND→NOT pair honestly shows 0. The pair is blurred under a crisp gate icon; hovering unblurs it and shows "A ♥ B · N% compat".
- **Buttons:** Every "not 18" exit (I'M NOT 18, NO THANKS, the close X, the footer link) goes to `/`, which is Logic mode. Every ENTER goes to the `#enter` stub.
- **Fonts:** Self-hosted OFL fonts via @fontsource: Bangers, Yellowtail, Roboto Condensed, and JetBrains Mono (already a dependency).
- **Art:** No people, no photos, no AI art. The portrait is our AND gate plus a hand-drawn wink, blush, smile and heart bubble.

## x1: faithful to M1, surprise "Closed as duplicate" (Stack Overflow)
- **The surprise:** A Stack Overflow-style yellow notice drops over the top of the modal: "This question already has an answer here: *Am I 18+ if I'm 10010 in binary?* (47 answers). Closed 11 years ago by 3 users with 100k rep. Also: why would you date a gate? Use a flip-flop." It carries a −3 vote counter, and an orange CLOSED AS DUPLICATE stamp slams across the headline.
- **Design choices:**
  - The M1 layout: neon "Date" in the logo on a pink grid, two pills.
  - It keeps M1's best trait: the headline is the biggest thing (cap .091 H vs .098).
  - Per research (a), the chrome stays in utility sans and the loud type lives only in the modal. The SO notice copies SO's own look (a pale yellow box with an orange left rule and plain sans), so it reads as a third genre crashing in.
- **Known gaps:**
  - The stamp covers part of "18+ ...BITS!", on purpose.
  - The SO notice hides the top of two tiles, so the Pillow tile scan merges them (the tile_ratio w/gap row for x1 is a measurement artefact, not a layout error).
  - The ENTER and I'M NOT 18 pills are equal, as in M1. I kept that faithful and did not apply the "one big yes" convention.

## x2: faithful to M2, surprise "Merge conflict"
- **The surprise:** The WARNING headline turns into an unresolved git conflict, complete with the editor's lens line "Accept Current Change | Accept Incoming Change | Accept Both Changes | Compare Changes":
  - `<<<<<<< HEAD (logic-mode)` over **WARNING: THESE GATES ARE 18+** (green band)
  - `=======`
  - **WARNING: THESE GATES ARE 0b10010+** over `>>>>>>> date-mode` (blue band)

  A short glitch plays as it lands.
- **Design choices:**
  - The M2 layout: a neon sign with two tube hearts on a grid plate over the modal, the portrait, and the AND/OR/XOR : ENTER pills (the best parody of the original gate's three-way ENTER row).
  - I added the "I'm not 18" exit to the parental-controls footer, because M2 had no exit.
  - Research (c) says both genres centre on a choice, so the joke is literally a choice between two versions of the headline.
- **Known gaps:**
  - The conflict headline is smaller than M2's WARNING (cap .080 → about .027 H), so the headline scan reports n/a. That is a deliberate trade to fit both sides.
  - The lens line is small (0.78 u).
  - The three pills are equal weight, as in M2.

## x3: faithful to M3, surprise "Segmentation fault (core dumped)"
- **The surprise:** The modal jolts, and a terminal window drops in over the lower left:

  ```
  $ ./date --enter
  Segmentation fault (core dumped)
  $ gdb ./date core
  (gdb) bt
  #0 heart_deref (h=0x0) at date.c:18
  #1 love_bomb (n=4294967295) at date.c:42 // UINT_MAX texts
  #2 enter_anyway () at date.c:69
  ```

  The love_bomb line is the plan's one allowed love-bombing gag.
- **Design choices:**
  - The M3 layout: neon "Date" on a dark grid plate inside the panel with tube hearts, the close X, a yellow 18+ (the only yellow, per research a), plain sans fine print, and a wide filled ENTER ANYWAY over a narrow pale NO THANKS (the primary/secondary pattern from the original gate).
  - The panel gets M3's magenta outer glow.
- **Known gaps:**
  - The terminal covers the lower-left tiles and the bottom corner of the portrait. It never covers the buttons.
  - At 1440 the Pillow panel scan starts below the dark neon plate (y .29). The DOM box is y .181, h .698 against M3's .174 / .659, so the panel is about 30 px taller than M3.

## Checks
- **npm test:** 131/131 pass (4 new compat tests).
- **npm run build:** passes, with two entries (index.html, date.html).
- **npm run e2e:** "All e2e checks passed" (101 ok). Logic mode is unchanged: the only change outside `src/date` is `export` on `Shape` and `GATE_GEOM` in `src/nodes/index.jsx`.
- **Shots** (`node research/x/shots.mjs` against `vite preview --port 5471`):
  - 0 page errors, no horizontal scroll at 1440 or 1024.
  - ENTER → `#enter` stub shown; NO THANKS → `/` (title "Logic").
  - Files: `shots/x{1,2,3}-1440.png`, `x{1,2,3}-1024.png`, `x{1,2,3}-1440-still.png` (reduced motion), `stub-1440.png`, and side-by-sides `side-x{1,2,3}.png` (ref | ours).
- **Decision:** I did not commit the two original adult-site screenshots. They contain explicit labels and blurred thumbnails, and the class and the professor read this repo. They are measured from scratchpad; the numbers are in ANALYSIS.md and below.

## Pillow deltas: ref vs ours (1440×810 shots; `python3 research/x/compare.py <refdir>`)
- **What each metric is:** Colours are RGB distance (dE). Ratios are fractions of W or H. "original gate" is the hand-measured 9dce964e (the automatic scan can't find a blue modal on a blue page).
- **Small:** chrome, badge and panel colours (dE ≤ 15), header ratio (≤ .007), modal x/w (≤ .006), x1/x2 modal y/h (≤ .02), tile geometry (≤ .005).
- **Larger, by choice:** The bevel follows the Wenrexa kit's lilac rim (#ec86f4), not M1/M3's purple. The x2 headline is a conflict block. The x3 panel scan starts below the dark plate (DOM numbers above).
- **Larger against the original gate:** everything, on purpose. The mockups deliberately move away from it: bright blue, not navy; a pink panel, not a blue one; a 4× bigger headline.

#### x1 vs mockup `ee486fef-image.png` and the original gate

| metric | mockup | ours | delta vs mockup | original gate | delta vs original |
|---|---|---|---|---|---|
| bg | #003ab7 | #003ec5 | dE(rgb) 15 | #00016c | dE(rgb) 108 |
| navy | #011a5e | #001b62 | dE(rgb) 4 | #090d56 | dE(rgb) 21 |
| header_ratio | 0.0956 | 0.0889 | -0.0067 | 0.1333 | -0.0444 |
| modal_ratio | {'x': 0.231, 'y': 0.237, 'w': 0.537, 'h': 0.53} | {'x': 0.228, 'y': 0.228, 'w': 0.542, 'h': 0.516} | x -0.003, y -0.009, w +0.005, h -0.014 | {'x': 0.25, 'y': 0.247, 'w': 0.5, 'h': 0.505} | x -0.022, y -0.019, w +0.042, h +0.011 |
| modal_fill | #fdf2fc | #fdf6fd | dE(rgb) 4 | #00008f | dE(rgb) 370 |
| bevel | #ab34ea | #e987f4 | dE(rgb) 104 | n/a | n/a |
| head_cap_ratio | 0.0978 | 0.0914 | -0.0064 | 0.0233 | +0.0681 |
| head_ink | 0.34 | 0.329 | -0.0110 | n/a | n/a |
| head_pink | #ed1d83 | #ec1a86 | dE(rgb) 4 | n/a | n/a |
| tile_ratio | {'x': 0.024, 'y': 0.124, 'w': 0.227, 'h': 0.242, 'gap': 0.0138} | {'x': 0.023, 'y': 0.117, 'w': 0.477, 'h': 0.238, 'gap': 0.0} | x -0.001, y -0.007, w +0.250, h -0.004, gap -0.014 | n/a | n/a |
| badge | #0140c3 | None | n/a | #093ea9 | n/a |
| badge_ratio | {'w': 0.065, 'h': 0.04, 'inset_r': 0.0245, 'inset_b': 0.0043} | None | n/a | n/a | n/a |
| yellow | None | None | n/a | #ffff00 | n/a |
| neon | #fb4dcf | #f26ecd | dE(rgb) 34 | n/a | n/a |

#### x2 vs mockup `c20f7340-image.png` and the original gate

| metric | mockup | ours | delta vs mockup | original gate | delta vs original |
|---|---|---|---|---|---|
| bg | #0040c5 | #003ec5 | dE(rgb) 2 | #00016c | dE(rgb) 108 |
| navy | #001b62 | #001b62 | dE(rgb) 0 | #090d56 | dE(rgb) 21 |
| header_ratio | 0.0871 | 0.0889 | +0.0018 | 0.1333 | -0.0444 |
| modal_ratio | {'x': 0.222, 'y': 0.272, 'w': 0.556, 'h': 0.57} | {'x': 0.219, 'y': 0.291, 'w': 0.562, 'h': 0.556} | x -0.003, y +0.019, w +0.006, h -0.014 | {'x': 0.25, 'y': 0.247, 'w': 0.5, 'h': 0.505} | x -0.031, y +0.044, w +0.062, h +0.051 |
| modal_fill | #fefbfd | #fdf6fd | dE(rgb) 5 | #00008f | dE(rgb) 370 |
| bevel | #f19dfd | #e986f4 | dE(rgb) 26 | n/a | n/a |
| head_cap_ratio | 0.0797 | 0.0012 | -0.0785 | 0.0233 | -0.0221 |
| head_ink | 0.236 | 0.095 | -0.1410 | n/a | n/a |
| head_pink | #e52180 | #e64aa6 | dE(rgb) 56 | n/a | n/a |
| tile_ratio | {'x': 0.023, 'y': 0.116, 'w': 0.224, 'h': 0.223, 'gap': 0.0161} | {'x': 0.023, 'y': 0.117, 'w': 0.227, 'h': 0.238, 'gap': 0.0153} | x +0.000, y +0.001, w +0.003, h +0.015, gap -0.001 | n/a | n/a |
| badge | #0244c9 | #0142c8 | dE(rgb) 2 | #093ea9 | dE(rgb) 32 |
| badge_ratio | {'w': 0.063, 'h': 0.039, 'inset_r': 0.0317, 'inset_b': 0.0043} | {'w': 0.047, 'h': 0.046, 'inset_r': 0.0347, 'inset_b': 0.0074} | w -0.016, h +0.007, inset_r +0.003, inset_b +0.003 | n/a | n/a |
| yellow | None | None | n/a | #ffff00 | n/a |
| neon | #fc44d5 | #ff4fc7 | dE(rgb) 18 | n/a | n/a |

#### x3 vs mockup `8c0d1049-image.png` and the original gate

| metric | mockup | ours | delta vs mockup | original gate | delta vs original |
|---|---|---|---|---|---|
| bg | #003ed1 | #003ec5 | dE(rgb) 12 | #00016c | dE(rgb) 108 |
| navy | #001e6f | #001b62 | dE(rgb) 13 | #090d56 | dE(rgb) 21 |
| header_ratio | 0.0871 | 0.0889 | +0.0018 | 0.1333 | -0.0444 |
| modal_ratio | {'x': 0.231, 'y': 0.174, 'w': 0.536, 'h': 0.659} | {'x': 0.233, 'y': 0.29, 'w': 0.534, 'h': 0.584} | x +0.002, y +0.116, w -0.002, h -0.075 | {'x': 0.25, 'y': 0.247, 'w': 0.5, 'h': 0.505} | x -0.017, y +0.043, w +0.034, h +0.079 |
| modal_fill | #fdf6fd | #fdf6fd | dE(rgb) 0 | #00008f | dE(rgb) 370 |
| bevel | #cc31e6 | #f37ce6 | dE(rgb) 85 | n/a | n/a |
| head_cap_ratio | 0.0893 | 0.0753 | -0.0140 | 0.0233 | +0.0520 |
| head_ink | 0.107 | 0.251 | +0.1440 | n/a | n/a |
| head_pink | #f705bd | #ec1a86 | dE(rgb) 60 | n/a | n/a |
| tile_ratio | {'x': 0.019, 'y': 0.112, 'w': 0.222, 'h': 0.237, 'gap': 0.0156} | {'x': 0.023, 'y': 0.117, 'w': 0.227, 'h': 0.238, 'gap': 0.0153} | x +0.004, y +0.005, w +0.005, h +0.001, gap -0.000 | n/a | n/a |
| badge | #0140d2 | #0142c9 | dE(rgb) 9 | #093ea9 | dE(rgb) 33 |
| badge_ratio | {'w': 0.065, 'h': 0.041, 'inset_r': 0.015, 'inset_b': 0.0064} | {'w': 0.056, 'h': 0.046, 'inset_r': 0.0264, 'inset_b': 0.0074} | w -0.009, h +0.005, inset_r +0.011, inset_b +0.001 | n/a | n/a |
| yellow | #fee51f | #fee51f | dE(rgb) 0 | #ffff00 | dE(rgb) 40 |
| neon | #fc66cd | #f06cd2 | dE(rgb) 14 | n/a | n/a |
