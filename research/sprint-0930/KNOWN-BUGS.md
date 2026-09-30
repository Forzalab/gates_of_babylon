# sprint-0930 KNOWN BUGS (OBBP integration, untested MVP; alt tests)

`npm run build` OK. `npm test`: 282/282 pass (no failures recorded). No playthrough was run (Tony's rule).

1. `park` has no art yet: `art/index.js` maps it to `Rooftop` (clock tower, not a park).
2. Crowdwork tricks 2-3 and Tony's line are inserted mid-`town` (town 4-6); pacing unreviewed.
3. Loop lines (meta-loop) sit in `station-talk` 1-3 on every run; on run 1 they read as filler.
4. Story 3-way neutral picks were moved from `side:"pink"+default` to `side:"mid"` (loader rule); visual order unchecked on every beat.
5. Echo-lint word "sweet" in `errand-library` 1 choice 0 changed to "cute".
6. Lock game: mech reordered escape 13 choices (0 = Leave/escape-win, 1 = Wait/escape-timeout), so obbp.json sets `props.win:0, lose:1`. Win/lose routing not clicked through.
7. Nanda is centred via `.db-nanda { left: 730px }`; overlap with chips/react bubbles on raised choice beats not checked on every bg.
8. `fake` flash timing on walk-home 5 vs. the following scene not tested.
