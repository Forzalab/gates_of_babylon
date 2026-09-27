# pit4/r2-1: g1 (`date.html?v=g1`, `&next=1`)
Base f3 (r1-3, 71). f3 still works unchanged; g1 lives in `src/date/g1/`.

## The ONE surprise (S4 gacha blended into f3's VN creep, M9 lens kept)
~1.2 s in, AND-chan's portrait card is "pulled": white flip-flash, a spinning white star burst behind her, an
`SSR ★★★★★` band drops in, the card gets a pulsing pink rarity glow, and the heart meter stamps down as a huge
`QUEUE #47`. Textbox: "You're #47 in the office-hours queue, senpai. I'LL ALWAYS WAIT. ♡" (last words in Bangers 1.4×).
You pulled an SSR, and the SSR is a queue ticket. M4/M11 not used: either would be a second gag.

## Continue screen
Gacha pull card first (SSR AND-chan: real `Shape`, her real truth table, compat %, NOPE / LIKE, arrow keys). NOPE gives
Prof. Kerney's textbox line "Swiping is not a valid proof. Build the circuit." Then the real editor: compat pill in the
Raggningstabell header, IT'S A MATCH popup + stamp after a gate-to-gate wire, BACK TO THE GATE + LOGIC MODE pills,
neon glow clipped to row 01 (descenders still cross the rule).

## Fix list status
| # | fix | done |
|---|---|---|
| 1 | sign clear of WARNING >=10 px | yes, ~12-15 px at 1440 and 1024 (crop-checked) |
| 2 | NO THANKS readable | tear only 600 ms, then clean |
| 3 | surprise size | `#47` .084 H @1440 / .063 H @1024; line on one row; ALWAYS WAIT 1.4x |
| 4 | dead band | grid bottom .967 H (was .912) |
| 5 | payoff | compat pill + match stamp; glow clipped |
| 6 | LOGIC link | LOGIC MODE pill |
| 7 | f2 swipe intro | as the gacha pull card |
| 8 | Kerney line | on NOPE |

## Pillow deltas (1440 unless noted)
| item | g1 | target | |
|---|---|---|---|
| top bar | #001b62 | #001b62 | ok |
| grid bg | #003ec5 | #003ec5 | ok |
| headline | #f01a88 | #f01a88 | ok |
| WARNING cap | .117 (1024: .087) | .11-.13 | 1024 low |
| header | .096 | .085-.10 | ok |
| modal width | .545 W | .52-.58 | ok |
| modal+sign height | .70 H | .55-.70 | at edge |
| grid bottom | .967 | >=.90 | ok |
| L/R luminance | 2.5% | <=12% | ok |
| yellow | 18+ only (stars white) | | ok |
| textbox reflow on landing | 0 px | | ok |

Checks: npm test 131/131, build, e2e pass; 0 page errors; no h-scroll. Shots in shots/.
Remaining: WARNING cap at 1024 is .087 (4:3 width limits the copy column); modal height at .70.
