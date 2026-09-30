# LEAVE routes audit (M2, 09-30)

Rubric: `r5-ume/AUDIT.md` (commit a22d917): **A** physics · **B** common sense · **C** render/layer order · **D** coherence · **E** emotes · **F** figure sizing · **G** line↔visual · **H** sprite sanity · **I** UI text.
Score = criteria passed out of 9 for that beat. As in the R5 audit, the GLOBAL items are not counted per row (G3 the box eats her feet, G5 the "♥ ??" chips, G7 the wink on reaction frames, G9 the pink glow): they are on almost every beat of the game.

## 1. Reachability (the bug)

| ending | before M2 (live play) | after M2 |
|---|---|---|
| leave (the café scene) | unreachable | rooftop **Leave before the rain**, or v2-home 4 **Say goodnight** |
| leave-fu | unreachable | leave 3 **FUCK YOU. I'm leaving** |
| leave-yeah | unreachable | leave 3 **uhmmm yeah ig** (or the fake **Forever sounds long**) |

Why: rooftop 11 "Leave before the rain" had `go: v2-park` like "Stay a minute"; v2-home 4 had one choice, `Sit down → cup`. "Say goodnight" lived only on the old `door` scene, which is off the live path (the v2 day never falls through to it). The old captures (`paths/leave-a`, `leave-b`) had to jump with `?scene=door`.
Fix: `src/date-beta/packs/leave-route.json` (in main.jsx PLAY after r5, before gacha). Proof: `src/date-beta-leave.test.js` plays the shipped graph from a fresh start with the real engine to all three leave endings, and still to steeped / escape-win / escape-timeout.

## 2. Beats

Shots: before = `leave/before/` (5 key PNGs + the four `*-log.json`, taken right after the routing commit 1a02b86, before the fixes); after = `paths/leave-live/` (INDEX.md there). Same seed 1, same picks.

| beat (route) | line | before | fails before | after | fix / still open |
|---|---|---|---|---|---|
| rooftop/11 choice | Stay fORever? The rain can wait. | 9 | — (now consequential, so the chips are ♥ ?? like every branch) | 9 | — |
| rooftop/11 react (Leave) | …Fine. The rain can have you. Later. | 9 | — | 9 | — |
| v2-home/4 choice (home) | Her hand on your back. She sits you in the middle chair. | 9 | new 2nd option "Say goodnight" (was the missing branch) | 9 | — |
| v2-home/4 react (Say goodnight) | …Goodnight? It is only 7:10. | 9 | — (new line) | 9 | — |
| leave/0 (roof) | Leaving is not an option. | 8 | E: the smug stage-3 grin + OR bubble, the same face as leave-fu 0/2 and leave-yeah 1/3 | 9 | face `ticked-off` (anger mark). bg = the rooftop (flag `left=roof`), not her door she never showed you |
| leave/0 (home) | Leaving is not an option. | 7 | E (as above); B: the plaster she wore one beat before (kitchen) is gone | 9 | face; `injury.js` keeps `plaster-20` on the leave scenes when `left=home` |
| leave/1 | XOR Coffee. 7:00 AM. | 8 | D: no "next morning" cue (the wall clock at 7:00 is the only one) | 8 | face `happy` (was OK). OPEN: "Next morning." needs a new narration take, so the line is left as is |
| leave/2 choice | He wakes at 7:00. | 9 | — | 9 | face `smug-gloating` (she knows your alarm) |
| leave/2 react | Good morning! Same as yesterday. Same as always. | 9 | (G7 global wink) | 9 | — |
| leave/3 choice | From now on… can we be fORever? | 9 | — | 9 | face `blush-embarrassed` (a confession) |
| leave/3 react (FU / yeah) | Leave, then… / Yeah? Say it again… | 9 | — | 9 | — |
| leave-fu/0 | Her hand rises. Time freezes. The café turns. | 6 | G: no hand; G: nobody in the café turns (no crowd); E: a smug grin on "time freezes" | 8 | her upper pin reaches out (`cut.reach`) + `very-angry`. OPEN: no café crowd art |
| leave-fu/1 | You said leave. I heard 'lea—'. | 8 | E: the 2-face flip (smug grin / smirk) for the whole ending | 9 | `big-eyes-peek` (the innocent mishearing) |
| leave-fu/2 | CROWD: fORever and ever | 7 | G: a CROWD line, no crowd on screen; E: flip | 8 | `heart-laugh`. OPEN: crowd |
| leave-fu/3 | CROWD: fORever and ever and ever | 7 | G, E (as above) | 8 | `content`. OPEN: crowd |
| leave-fu/4 end | GAME OVER card | 9 | — | 9 | — |
| leave-yeah/0 | Hooray! FORever and ever! | 9 | — | 9 | `heart-laugh` pinned |
| leave-yeah/1 | Good input. | 8 | E: flip | 9 | `content` |
| leave-yeah/2 | CROWD: fORever and ever | 7 | G: no crowd; E: flip | 8 | `anya-smile`. OPEN: crowd |
| leave-yeah/3 | CROWD: fORever and ever and ever | 7 | G, E | 8 | `smug-gloating`. OPEN: crowd |
| leave-yeah/4 | Wide. The café. Every table has two cups. Every cup has your name. | 7 | G: "Wide" is a 1.35x push-in; one cup, no names; E: flip | 8 | `big-eyes-peek` (she stares at you). OPEN: the `cafe-cups` shot needs the cups art (two per table, names) |
| leave-yeah/5 end (home, 100%) | YOU WIN card | 7 | G/I: the win card says "You drank all her tea." on a route with no tea | 9 | `endcard.js winLine`: "You said yes. She wrote it on every cup." (leave-fu: "You said leave. She only heard forever.") |

**Totals (22 rows, 198 max): before 177 (89%) → after 191 (96%).** Fixed 14 points: 10 E (a face per beat), 2 G (the hand, the win line), 1 I (the win line), 1 B (the plaster), plus the routing itself (section 1). Open 7: the café crowd ×5 (leave-fu 0/2/3, leave-yeah 2/3), the cups shot, the next-morning cue.

Text overflow: none (the longest labels, "OR Leave before the rain" and "FUCK YOU. I'm leaving", wrap to 2 lines inside the button). Float audit: nothing new (every leave beat is a medium shot on the global G3 rule). No stitched card anywhere on these routes.

## 3. Still open (not mine to fix here, or needs art / a VO take)
- **Café crowd** for "The café turns" + the two CROWD lines on both endings: an art cel (the train crowd silhouettes, re-tinted for the café) would make them read.
- **`cafe-cups` shot** (leave-yeah 4): the line promises every table with two cups and your name on each; the shot is the empty café pushed in.
- **"Next morning."** on leave/1 would help a grade-2 reader across the time jump; the narration test wants a take for every narration line, so it waits for a VO session.
- The escape endings at 100% also show "You drank all her tea" on the win card (no tea on that route either). Left alone: outside the leave routes.
- The route trail says CAFÉ on leave/0 while the rooftop / her door is on screen (the scene's `short`); harmless.
