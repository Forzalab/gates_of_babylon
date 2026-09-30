# KNOWN BUGS (sprint-0930, V2 build)

`npm test` run once on sprint/v2-build (V2 on the default play path): 283 tests, 283 pass, 0 fail.

Open notes (not test failures, not fixed here):
- Time budget is thin: table says 5:25, plus ~12 react lines after picks (~35 s) → real ≈ 6:00.
- `cup` keeps its blank-text beats and "For Input B. Silly." (SELF-CHECK). A HER KITCHEN · 7:20 PM stamp beat now opens `cup`, so every later `cup` beat index is +1 (the storyboard's `cup:3` override is now `cup:4`).
- Rooftop f{OR}ecast word jokes stay (Tony's call).
- Old date scenes (park, errand-shop, town, ...) remain in data, off-path; the Tree/debug view still lists them.
- The crowdwork line is 29 words (rubric ideal ≤15, max 30). Kept verbatim per Tony.
- Status after alt's PR #27 fixes (alt-test/BUGS-FOUND.md; evidence in alt-test/fixes/):
  - FIXED: B-03 497a6da (katsu pick +3; every errand x food route now reaches 100%, test src/date-beta-winroutes.test.js; the groceries 99% was already gone in the V2 build, katsu was the short route). B-02 18066c1 (town crowd beats split to 2 box lines, two 3-choice picks; Tony's curly-haired sentences verbatim, in two beats). B-06 18066c1 (crowd tokens mid-sentence). B-04 9158719 (?love=N). B-05 60c2846 + 18066c1 (no {DAYPART} in town:3 / walk-home:3). B-07 641ad0d (leave:3 react lines).
  - OPEN: B-01 (see below, main merges sprint/interiors). B-08 (16 s of black auto beats in `blackout`, scenes.json:61: pacing tied to sfx, Tony's call). B-09 (every page load at scene 1 bumps the run counter: that is the "she remembers replays" design; changing it needs a decision; ?run=N pins it for demos).
  - meta.json:14 still has the old "sleepy {DAYPART}" copy but that pack is dropped from play.
- #1/B-01: fixed by merging sprint/interiors (e7b7b37): add 'interiors' to the pack list, INTERIORS spread last in art/index.js. (Main owns the merge; park still draws the rooftop until then.)
