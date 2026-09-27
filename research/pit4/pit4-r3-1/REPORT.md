# pit4/r3-1: h1 (`date.html?v=h1`, `&next=1`)
Base g2 (r2-2, 73). h1 reuses g2's code paths with `.v-h1` overrides in `src/date/h1.css`; f1 and g2 are unchanged.

## Surprise
The ONE surprise is still Prof. Kerney's red pen ("B+ bold choice. see me after class. – K."), which is fully landed in
the reduced-motion still. K7 is its punchline, and it fires only on interaction. With motion on, NO THANKS hops away
from the cursor 3 times (it stays inside the copy column). On the 4th approach it gives up, parks at the right, tips
over and squashes ("lies down"), and its label becomes "fine." in the pen's script. Under reduced motion it teleports
instantly (no transition) and then says "fine." It keeps the same box height, so nothing reflows. Keyboard focus never
flees.

## Continue screen
The MATCH FEED (4×2, real Shape and sim) with g3's HIGH SCORES strip below it, including the "5TH the age gate B+ – K."
row. A ≥75% ♡ opens the JRPG "Tony learned AND!" window. It is docked over the scores band (≤ .125 H), never open on
load, and doesn't dim the feed. An on-page credits line (Kenney CC0 and fonts) links to `sfx/CREDITS.md`.

## Fix list (VERDICT-r2, g2)
| # | fix | result |
|---|---|---|
| 1 | WARNING cap ≥ .115 | .128 H @1440, .124 H @1024 (pink rows; `measure.py`) |
| 2 | modal + sign ≤ .70 | .689 H @1440, .620 H @1024 |
| 3 | MATCH window | docked to the bottom band, ≤ .125 H, opens only on a ≥75% ♡ |
| 4 | yellow digits | agreeing rows are pink, digits white; the 18+ is the only yellow |
| 5 | credits | visible line, 12 px floor, link to `sfx/CREDITS.md` |
| 6 | HIGH SCORES | ported from g3, with Kerney's 5th row |
| 7 | compat pill | 13 px floor |

Modal width is now .575 W (it was .544), so the bigger WARNING fits at 4:3. That is still inside .52–.58.

## Checks
- `npm test` 131/131, `npm run build`, `npm run e2e` all pass.
- 0 page errors, no horizontal scroll, 0 running animations in every reduced-motion still.
- Shots in `shots/`, reduced motion first (`*-still.png`): gate, K7, next, next-match, clean at 1440 and 1024, then
  the same with motion on.

## Remaining deltas
- The WARNING cap is at the top of its band (.128 at 1440).
- K7 needs a hover, so the still shows only the pen (by design).
- The docked match window covers the HIGH SCORES strip while it is open.
