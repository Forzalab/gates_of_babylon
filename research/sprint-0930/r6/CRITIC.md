# R6 critic pass (umeboshi route, after/ re-shot at ?fx=full, 1920x1080)

Shots: `after/001..094` + contact sheets `after/sheet-1..8.png` (12 beats each). Re-shoot script: `shoot.mjs ume` (port 5232).

## First re-shoot (0d1fa5c): fixed in 922d952, 4b046d0, 75f89d3
- HIGH rooftop "Take neither" under the dialogue box -> mini-choices moved up (`.sa-mini.left` 420, timebar 330). Verified 004/010/013.
- HIGH train 0 line ran to 3 lines over her face -> shortened to 2 lines. Verified 055.
- MED curry 7 ribbon cast a second "stream" shadow -> only the boat casts. Verified 048.
- MED street 0/1/3 said "6:00 PM, low sun" on a noon-blue sky -> `street-dusk` bg. Verified 070-072.

## Second re-shoot (75f89d3)
- HIGH (lock: float audit 0) the audit came back with 2 flags: `town 12` and `errand-shop 8` (the "WALK TO ..." choice beats).
  She is raised over the box and the R5 skirt mask cut at 80.5%, which left ~10 px of pin-leg stubs under the skirt,
  hanging ~60 px above the box. Fixed: mask cut moved to 78% (exactly the skirt hem, a clean waist-up crop,
  `beta.css .db-nanda.raised`), and the audit now counts a masked raised sprite as cropped. Audit: 0 flags.
- No other HIGH or MED. Checked: park 2 pulse, shop 4-12, curry 0-13, train 0-8, rain, street, home, cup, steeped, end.
- LOW train 0: the STATION · 4:30 PM stamp covers part of the "いつも いっしょ NAND LINE" poster (055). Left as is.
- LOW `v2-curry-katsu 11` / `v2-curry-alone 3` still say "We walk out to the street. It is 3:40 PM." (not on this route; reads fine before train 0).

## Locks
- Cel-over-vtrace: held (all bgs vtrace, Nanda + UI cel on top).
- Nanda: pin legs, pin hands, no side-pony on every shot.
- No stitched white cards: `src/date-beta-r6.test.js` green; none in the shots.
- Float audit: 0 flags (95 Nanda beats).
