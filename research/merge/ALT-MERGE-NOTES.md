# ALT → MAIN merge notes (alt, Tue 2026-09-29 09:10 PT)

Branches: alt `claude/date-beta-alt-spec-review-4gdzab` (324740b) · main `claude/leftover-tonight-tasks-5wm6yl` (7f544ec).
Dry run: `git merge-tree --write-tree --name-only HEAD <main>` → 4 conflicts: `src/date-beta.test.js`, `src/date-beta/art/Genkan.jsx` (add/add), `src/date-beta/art/index.js`, `src/date-beta/scenes.json`.
Proposal file: `research/merge/alt-scenes.json` = main's scenes.json @ 7f544ec + alt scenes converted to main's contract. **It passes main's `loadScenes(data, { manifest, art })`: 18 scenes, 0 errors.** Not wired in yet.

## What alt did to scenes.json (vs main's base)
1. Inserted after `blackout`: `platform` (3 beats), `underpass` (2), `apartment` (2). Night + rain after the ADORE ME blackout = "the day went black".
2. `door`: a new first beat = alt's `stairs` art (metal stairs, Unit 12 plate), no text, `tick`, hold 1000. Beat 2 switches the bg to `BG-D1` (main's Door fallback) and keeps main's lines + choice untouched.
3. `door` pink "Just one cup" now goes to `genkan-in` (alt's arrival insert: shoes on a tape line → men's slippers → shrine with a circuit) → falls through to `cup` (file order).
4. Cue names mapped to main's manifest: rain-soft→`rain`, train-leave→`train-hum`, footsteps-4/2 + metal-steps→`tick`, door-close→`thump`. `OR` → `{OR}` token + `breath`.
5. Dropped alt duplicates: "This is me. Unit 12. Obviously you'll remember." (kept in main's door) and "Just tea. Then you can go." (≈ main's "Come in? Just for tea.").

## Conflicts → resolution (Tony approved the plan, Tue ~09:05 PT)
| # | conflict | resolution |
|---|---|---|
| C1 | Genkan.jsx add/add: alt = arrival insert, main = BG-D3 locked room | Keep both = setup → payoff. Alt's renamed `GenkanArrival.jsx`, id `genkan-in`. Main's stays `genkan`. Match the arrival slippers' colour to the locked room's empty spot. |
| C2 | art/index.js | Union. Alt ids: `platform, underpass, apartment, stairs, genkan-in`. |
| C3 | scenes.json | Main's file = base + the insertions above (alt-scenes.json). |
| C4 | date-beta.test.js | Take main's. Rewrite `src/date-beta-alt.test.js` to the new contract. |
| C5 | Nanda | Main's V1b sprite drawing + alt's nanda-1 lighting kit (rim/grade/shadow per scene). The platform silhouette is her (no NANDA line there, so no sprite overlay). |
| C6 | STEEPED | Main already has Nanda on steeped. Alt's fx-1-r2 stays in date-lab only, as an effects study. |

## Open for main (please answer in MAIN-MERGE-NOTES, same format)
- Main's scenes.json changes since a1dc0b5 + the naan-ad / naan-platform plans (do they touch `naan` beats or add a platform scene? **name clash risk with alt `platform`**).
- Does main's Door fallback read OK after alt's stairs beat (two doors in a row)? If not: alt's stairs replaces BG-D1 in `door` and `escape-win`/`leave`.
- The genkan pair: OK to recolour the slippers / empty spot so they match?
- Order of the merge: main merges alt's branch, or alt merges main's (a merge commit, no rebase)? One PR either way (Tony's rule).

## Tony's rulings (Tue 09:20 PT)
- **Two platforms = same station, dusk → night.** Naan scene = dusk station (main's naan-platform, art id `naan-platform`), ADORE ME blackout, then alt's night `platform` on the same canopy (ad dark or reading NANDA). Alt reuses main's station geometry after Tony picks the dusk variant.
- **Scenes only in the PR.** date-lab stays on alt's branch. So main does NOT merge alt's whole branch; it takes these paths from alt (`git checkout origin/claude/date-beta-alt-spec-review-4gdzab -- <path>`):
  - `src/date-beta/art/{Platform,Underpass,ApartmentExt,Stairs,Rain,GenkanArrival}.jsx`, `src/date-beta/art/alt.css`
  - `research/merge/alt-scenes.json` → becomes `src/date-beta/scenes.json`
  - `src/date-beta/art/index.js`: add the 5 ids (`platform, underpass, apartment, stairs, 'genkan-in'`) to main's ART (union, by hand)
  - `src/date-beta-alt.test.js`: rewrite to the new `loadScenes(data,{manifest,art})` contract
  - optional: `research/date-beta-demo/scene-0*.png`, `scene-10*.png` (alt's shots)
- **Port fixes needed on main's engine** (main's OrSpans only reds an explicit `{OR}`): Platform sign text `"NEXT: ―― OR ――"` → `"NEXT: ―― {OR} ――"`; Underpass ad `"OR-SON"` → `"{OR}-SON"`. alt's `.or-svg` class → main's `db-or-svg`.
