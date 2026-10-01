# M1: Route B (library -> katsu -> escape-win / escape-timeout)

Path: `v2-park 3` (the errand pick: "Return her book") -> `v2-library 0..5` -> (v2-town, shared) -> `v2-curry 1` (the
lunch pick: "Katsu curry") -> `v2-curry-katsu 0..11` -> (train / rain / street / home / cup, shared) -> `escape 0..15`
(the basement + the lock game) -> win: `escape-win 0..7`, timeout: `escape-timeout 0..7`.
The two picks, `v2-town 0` and `v2-train 0` are shot for context only (not scored).

Shots: `before/` (base `ae91803`), `after/` (the fixes). `?fx=full`, 1920x1080 (stored as 1280px JPG), UI on, seed 1.
Legs: A = the library, B = katsu, C = the basement (bento umeboshi, the ♡ picks) + the lock game solved -> escape-win,
D = the lock game left to time out (bento tamagoyaki) -> escape-timeout.
Re-shoot: `node shoot.mjs before|after [port] [ABCD]` against `npx vite preview --port 5241`. One settled beat:
`node one.mjs <scene> <beat> <out.png>`. Compares (changed beats only): `compare/*.jpg`, all of them: `compare/sheet.jpg`.

Rubric (r5-ume): A physics · B common sense · C render/layer order · D coherence · E emotes · F figure sizing ·
G line <-> visual · H sprite sanity / Nanda canon · I UI text. Sev: HIGH / MED / LOW.

## Score

45 route-B beats (library 6, katsu 12, basement 13 incl. the lock game, escape-win 7, escape-timeout 7; the auto
blackouts that show nothing are not counted). A beat is clean when it has no HIGH or MED finding.

| | clean beats | HIGH | MED |
|---|---|---|---|
| before | **22 / 45 (49%)** | 9 | 14 |
| after | **40 / 45 (89%)** | 2 (open: art) | 3 (open: art / partial: library 1 train, lock-game scene, timeout 3 treat) |

## Findings (before) and what happened

| # | Beat | Rubric | Sev | Finding | Result |
|---|---|---|---|---|---|
| 1 | library 1 | G, E | HIGH | "A train passes. Her hand grabs your sleeve": the crossing close-up with her standing still, no grab, a calm face. | **fixed (partial)**: her pin reaches out at you (the R5 park reach), a nervous face. Still no train cel in frame (open, art). |
| 2 | library 2 | D, G | HIGH | "LIBRARY · 2:00 PM": no library. A blurred shop-street (`street-day`, alias `library-int` is marked `borrowed`) behind a floating book. | **open (art)**: needs a library interior trace (a new ref + vtrace). |
| 3 | library 3 | D, G, E | HIGH | Her line "Right here" over the same borrowed street + the same book; she is out of frame, no face. | **open (art)**: same library bg. |
| 4 | library 4 | G | HIGH | "The book drops into the slot. Thunk.": the same book card a third time, no slot. | **fixed**: a new insert item `book-return` (alias `book-return`): the library's green return post (返却), the same blue book half into its slot, the steel lip over it, speed lines. |
| 5 | library 5 | H, G | MED | "Her empty hand finds your hand": a card of two 5-finger hands on a stick arm (`hands-lock`). Her canon hand is the pin. | **fixed**: the street (`street-day`, crop floor), her pin reaches for your hand, a blush face. |
| 6 | katsu 4 | H, I | HIGH | Her hand holding the spoon is a 5-finger human hand on a sleeve (lock: pin hands); it runs up into the HUD column (skip / voice). | **fixed**: her pin nub closes over the spoon handle, the lead from the right frame edge, low (nub top ~250). Same pin as M3 napkin-fold (`pin_hold`). |
| 7 | katsu 5 | A | MED | "She pours more curry": the steel boat floats, nothing holds it. | **fixed**: her pin nub cradles the boat's belly (the boat itself, alt's R6 `boat()`, is untouched). |
| 8 | katsu 6 | H, C | HIGH | 5-finger hand pinching the slice; the gap the slice left is a flat grey-brown pentagon. | **fixed**: the pin nub pinches the slice (drawn under the nub). The gap is roux-coloured with a sheen now; still reads a bit flat (LOW). |
| 9 | katsu 10 | H | HIGH | "She wipes your fingers": 5-finger hand, pink nails, lavender sleeve. | **fixed**: her pin presses the napkin over your fingertips (`napkin_shot(..., pin=True)`, katsu only). |
| 10 | katsu 2 | G | LOW | "Her knee touches your knee": the two-shot shows her at the counter, no knees. | open (LOW) |
| 11 | katsu 9 | G | LOW | "She pushes her lemon water to you": no push / hand. | open (LOW) |
| 12 | katsu 11 | legs | - | the walk-out on `curry-street` (walk pose, shared with ume + alone). | **legs lane** (not touched) |
| 13 | escape 1..6 | G | MED x6 | Jars / dates / bentos / the oldest / mortar + mochi / the newest jar: six beats on the SAME wide frame; the `shelf` highlight is a faint opacity change. | **fixed**: each beat pushes in on what it names (`props.shot: closeup` of `cellar` with `ofProps.shelf`): the jar labels, the dates, the bento row, the bento + the mortar, an ECU of the mortar + mochi above the choice box, the newest jar (its label keeps the bento pick via `vary`). |
| 14 | escape 5 react | D | LOW | "You're looking too long" (she is upstairs) pops the pink polka-dot ANGRY panel over the basement. | open (LOW; the shared gacha pop) |
| 15 | escape 15 (lock game) | I | MED | "THE DOOR IS LOCKED" + the timer sit at y ~120, inside the HUD band (no art text above y ~140). | **fixed**: `lockgame.css` pads the game down 14vh, tiles 15 -> 13vh: the title is at y ~240, the grid ends above the bottom. |
| 16 | escape 15 (lock game) | D, G | MED | A plain purple panel: no door, no basement, no sign of her (M6 "lock-game scene art"). | **open (art, M6)** |
| 17 | escape-win 1..5 | E | MED x2 | The face alternates smug / wide / smug / smug (win 3 + win 5 repeat). | **fixed**: smug-gloating, ticked-off (vein), blush (><), the stage-3 grin, content (win 6). |
| 18 | escape-win 6 | G | LOW | "One window lit": a street of many lit windows; she stands in the "wide". | open (LOW) |
| 19 | escape-timeout 0 | D, B | HIGH | "The ladder creaks. She's coming down." plays in a hallway with shoes (`BG-D3`), and she is already in frame with a sweat drop. | **fixed**: the basement (`cellar`, the steep stairs up to the hatch, the shelf near-lens), she is not in frame yet. |
| 20 | escape-timeout 0 | B | LOW | "ladder": the basement has steep stairs. | open: proposed line "The stairs creak. She's coming down." Not changed (no re-record in this pass; the narration test pins every narrator line to a take). |
| 21 | escape-timeout 2 | G | HIGH | "Four cups now." The sitting room always draws three (it ignored `props.cups`). | **fixed**: `SittingRoom.jsx` honours `props.cups` (4 = one more empty cup, front right, clear of her + the plate). |
| 22 | escape-timeout 3 | G | MED | "She holds out the tamagoyaki": the treat stays on its plate, her pins at her sides. | **fixed (partial)**: her pin reaches out (anya-smile). The treat is still on the plate, not on her nub (open: a cel of the treat on the reach nub). |
| 23 | escape-timeout 2..6 | E | MED x2 | smug / wide / smug / wide (5 + 6 repeat 3 + 4). | **fixed**: content, anya-smile (+ reach), big-eyes-peek, blush (><), smug-gloating. |
| 24 | escape-win 7, escape-timeout 7 | legs | - | the end cards show her standing (legs + shoes). | **legs lane** (not touched) |
| 25 | all | I | ok | No typos. Lines are grade-2 literal; the JP lines (甘いでしょ。…ね？ / すっぱいでしょ。…ね？) read native. Stamps clear of the HUD band. |  |
| 26 | all | H | ok | Her sprite: pin hands, no side-pony; offstage in the basement ("NANDA (ABOVE)"). |  |
| 27 | all | stitched cards | ok | No white / beige stitched card anywhere on the route (`date-beta-r6.test.js` green). |  |

## Fixes, where

| Fix | Files |
|---|---|
| katsu cut / pour / close / napkin: her pin, not a 5-finger hand; the cut gap roux | `research/sprint-0930/curry/pipeline/draw.py` (`katsu_cut`, `katsu_pour`, `katsu_close`, `katsu_plate(cut)`, `napkin_shot(pin=)`), regenerated `public/date-beta/trace/curry/katsu-{cut,pour,close,napkin}.svg` (`python3 draw.py public/date-beta/trace/curry katsu-cut katsu-pour katsu-close katsu-napkin`) |
| book-return insert | `src/date-beta/art/shots/items.jsx`, `src/date-beta/art/shots/aliases.js` |
| four cups | `src/date-beta/art/interiors/SittingRoom.jsx` |
| lock game below the HUD band | `src/date-beta/game/lockgame.css` |
| beat data (library 1/4/5, escape 1..6 close-ups, escape-win faces, escape-timeout 0 room + faces + reach) | `src/date-beta/packs/r5.json` (main's pass pack, appended patches + a note) |

No dialogue line changed (nothing appended to `r6/LINES-CHANGED.md`; every recorded take still matches).
The butter path's own hand inserts (`curry-naan-lift`, `curry-naan-dip`, `curry-napkin`) still draw her 5-finger hand:
same canon question, not on this route, not touched (`curry-7 sauce` is alt's).

## Open

- **Art (needs new image generation)**: a library interior trace (library 2, 3; the alias `library-int` is still
  `borrowed`); a passing-train cel for the crossing (library 1); the M6 lock-game scene (door-lock close-up + her at the
  door slit); the treat on her reach nub (escape-timeout 3).
- **Voice / lines**: escape-timeout 0 "ladder" -> "stairs" (proposed, not changed; would need a narration re-record).
- **Legs (alt's legs lane)**: katsu 11 (the walk-out on `curry-street`), the escape-win and escape-timeout end cards
  (her standing pose, legs + shoes).
- LOW: katsu 2 (knees), katsu 9 (no push), the cut gap still flat, escape 5 react pop, escape-win 6 "one window lit".

## Float audit (end of M1)
`research/sprint-0930/float-audit/audit.mjs` on this build: **94 Nanda beats, 6 feet visible, 0 flags** (`result.json`
regenerated). Run unchanged except the port (a temp copy pointed at this branch's own build on 5241, removed after).
