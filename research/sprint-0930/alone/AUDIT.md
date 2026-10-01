# M3: the not-hungry path (v2-curry-alone)

Path: `v2-curry 1` (the pick, "I am not hungry") -> react "Then you watch me eat." -> `v2-curry-alone 0..3` -> `v2-train 0`.
No scene is reached only from v2-curry-alone: it ends on "Walk to the station" -> `v2-train` (shared with every curry path).
The pick and train 0 are shot for context (the timeline in and out).

Shots: `before/` (base `f88d931`), `after/` (the fixes). `?fx=full`, 1920x1080, UI on, seed 1.
Re-shoot: `node shoot.mjs before|after [port]` against `npx vite preview --port 5234`. One settled beat: `node one.mjs <scene> <beat> <out.png>`.

## Timeline (against the umeboshi route, R6)

| Beat | Shows | Says |
|---|---|---|
| v2-curry 0/1 (curry-choice) | pole clock 2:55, stamp CURRY STREET 2:55 PM | "It is 2:55 PM." |
| alone 1 | stamp OR OR CURRY · 3:00 PM | (inside) |
| alone 3 (curry-street) | pole clock 3:40, afternoon sun from the left | "We walk out to the street. It is 3:40 PM." |
| v2-train 0 | stamp STATION · 4:30 PM, board 4:30 | "4:30 PM. Her station." |

The ume route runs the same clock: 2:55 pick, 3:00 inside, 3:40 out (`v2-curry 13`), 4:30 at her station. So the
alone path's "It is 3:40 PM" is consistent, and the clocks in the art agree with every line. What R6 flagged is only the
wording: R6 rewrote ume's exit to bridge to the station ("We walk out of the curry shop. It is 3:40 PM. Lunch is done.
Now we walk to her station."); the alone exit keeps the short line, and the bridge is the NEXT pill ("Walk to the
station") + train 0 ("4:30 PM. Her station."). It reads in order. LOW, left as is (the recorded take stays valid; "Lunch
is done" would also be wrong-footed on the path where you got no lunch).

## Findings

| # | Beat | Sev | Area | Finding |
|---|---|---|---|---|
| 1 | alone 1 | HIGH | art vs line | "She eats alone. You get no food. She looks at you the whole time." over `curry-katsu-int` (the TV room): no plate, no food, no counter seat. Nothing in frame says she is eating. |
| 2 | alone 1 | MED | art vs line, face | face `hate` = shut bar eyes, while the line says she looks at you the whole time. |
| 3 | alone 2 | HIGH | Nanda canon (lock) | `curry-napkin-fold`: her hand is a 5-finger human hand with pink nails on a lavender sleeve. Lock: pin hands. Her close-up hand canon since R5 is the pin nub (the key close-up, `fx/Cels.jsx` KeyPalm). |
| 4 | alone 2 | MED | art vs line | the katsu plate next to the napkin is full (whole fanned cutlet, rice untouched) right after "She eats alone"; the shot's own label says "her empty katsu plate". |
| 5 | alone 3 | LOW | time | see Timeline: consistent; wording differs from ume's R6 exit. Not changed. |
| 6 | alone 0 | LOW | art vs line | "She opens the yellow door": an insert of the door, she is out of frame (same as katsu 0). Reads as her POV; left. |
| 7 | alone 3 | ok | feet / legs | `curry-street` floor (R7): walk pose, soles ~775 clear of the one-line box rivets (~810), left sun rim + cast right, warm bounce. Matches the legs canon. |
| 8 | all | ok | box / HUD | stamp clear of the HUD band; insert art keeps the hands above the box line; the pick's raised sprite is cropped at the skirt hem (R6 mask). |
| 9 | all | ok | typos / tone | no typos. Lines are grade-2 literal, matching the curry chain. |
| 10 | pick, react | ok | Nanda canon | pin legs (cropped), pin hands, no side-pony. |

### Off this path (for the lead, not fixed here)
- `v2-curry 13` (ume route): R6 made the exit line two lines, so the box top rises to ~775 and its rivets now cover her
  shoes on `curry-street` (floor y 790 was set for the one-line box). The alone + katsu exits still use the one-liner and
  are clear. Fix candidate: a per-beat `cut.plant` / higher floor for that beat in `r6.json`.
- The butter + katsu inserts (`curry-napkin`, `curry-katsu-napkin`, cut/close/feed shots) still draw her hand as a
  5-finger hand on a sleeve (draw.py `hand(..., 'her')`). Same canon question as #3; not on this path.
