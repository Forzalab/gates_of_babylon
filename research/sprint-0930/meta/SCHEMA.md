# T3 META-LOOP (branch sprint/meta, on sprint/mech)

## Tokens (any beat text, vary text, choice text, react)
`{RUN}` run count · `{TIME}` live clock "2:41 PM" · `{DAYPART}` morning 5-12 / afternoon 12-17 / evening 17-21 / night
· `{CLOTHES}` · `{CROWD.1}`..`{CROWD.4}`. Filled at render, so {TIME} is the real clock when the line shows.
- `engine.js`: `TOKEN_RE` export; `orParts` ignores these tokens in its stray-brace check (other braces still fail).
- `Say.jsx`: `Parts` runs `fill()` on every text part (lines, reacts, choice labels) + choice aria-label.

## src/date-beta/meta.js
- `fill(text, {now, n, c})`, `clock(d)`, `daypart(d)`, `getRun()`, `runBucket(n)` -> "1" | "2" | "3" (3 = 3+),
  `bumpRun()`, `setCrowd(obj)`, re-export `TOKEN_RE`. Plain JS (node --test safe); main.jsx calls `setCrowd(crowd.json)`.
- Run counter: localStorage `date-beta.run` (try/catch; memory fallback). `bumpRun()` fires in main.jsx each time
  `pos.s` becomes 0 (boot, PLAY AGAIN, "Back to start"). `?run=N` pins the run (no bump, no write).
- main.jsx: `beatView(beat, { ...pos.flags, run: runBucket() })` so any pack can `vary` on flag `run`.

## packs/crowd.json (Tony edits at the demo; excluded from the ?pack glob)
`{ "CLOTHES": "cute jacket", "CROWD": ["you in the back row", "you by the window", "you with the laptop open", "you pretending not to watch"] }`

## packs/meta.json (pack shape; `flags.run = ["1","2","3"]`)
- `meta-park` (PARK): beat 0 = "I love your {CLOTHES}…" 3-way pick (love/fx/emote/react); beat 1 filler.
- `meta-crowd` (CROWD): beats 0-2 magic-trick crowdwork ({TIME} {DAYPART} {CROWD.1-4}); beat 3 = Tony's line verbatim.
- `meta-loop` (LOOP): 3 beats (NANDA, MC, NANDA), each `vary.run` 1 subtle / 2 "why is everything the same?" / 3 both know.
- Scenes are standalone (appended, unreachable in normal play). Integration once story.json exists: copy the texts
  into `park` 0, `town` 3, `station-talk` 0.. via `patch`, and add `vary.run` to any [T3] beat. Keep `run` declared
  (meta.json loaded, or move `flags.run` into story.json).
- Preview: `date-beta.html?pack=meta&scene=meta-loop&beat=0&run=3`.

## Tests / shots
`src/date-beta-meta.test.js` (pack loads, clock/daypart/bucket, fill, loop vary differs). Shots: `shots/clothes,
crowd-magic, crowd-tony, loop-run1, loop-run3, loop-run3-nanda.png` (1920x1080, 256 colours).
