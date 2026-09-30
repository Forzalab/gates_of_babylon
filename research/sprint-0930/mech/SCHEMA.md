# T5 ENGINE + CHOICE-MECH (branch sprint/mech)

## packs (src/date-beta/packs/)
- `index.js` exports `applyPacks(baseData, packs[]) -> data` (raw JSON; `loadScenes` validates after). Order per pack:
  `scenes` appended, `flags` merged, `insert:[{after, ids}]` moves scenes to sit after `after`, `patch:[{scene, beat, set}]`
  shallow-sets beat fields (`null` deletes a field; `choices` is replaced whole). Throws `date-beta packs: ...` on unknown scene/beat/key/duplicate id.
- Preview: `date-beta.html?pack=a,b` loads `packs/<name>.json` in that order (main.jsx, `import.meta.glob`). Unknown name throws.
- `mech.json` = movement beats as choices. `mech-demo.json` = shot scene (`?pack=mech-demo&scene=mech-demo&beat=0..2`).

## engine.js (choice contract)
- `SIDES = pink|purple|mid`. 1..3 choices; with 3 the default sides are pink, mid, purple (left, centre, right).
- Choice fields added: `fx` = `love-burst | hate-quake | chosen-flash | none` (`FX`), `fake` (bool).
- `emote` gains `hate` (default emote of a `hate-quake` choice with non-zero love). `love` unchanged (-5..5).
- `fake: true` (not on choice 0): the loader copies choice 0's go/set/love/emote/react into it; `choose()` plays choice 0.
- `choose()` returns pos with `fx: { kind, action, fake }` (dropped by next()/reaction close). fake => kind `chosen-flash`,
  action = choice 0's plain text.
- `MIN_TIMER = 12`: any beat `timer` below 12 is raised to 12 at load. Default option = `default:true`, else pink (`timeoutPick`).

## UI
- `Say.jsx`: `Choices({choices,onPick,on,left,total,def})`, `LoveChip({love})` (shown when any option has non-zero love).
- `Fx.jsx`: `Fx({fx, rm, stageRef})` overlay; quake adds `fx-quake` to the stage for 3x334 ms.
- `art/nanda.js`: emote `hate` (pal 5 cold grey, flat eyes, dark aura `.nd-aura`, X bubble).
- CSS `fx.css`: `.db-choices.n3 .db-choice.mid`, `.db-chip(.up|.down|.zero)`, `.db-timebar` (+ `i` fill, `.db-timer` number),
  `.db-choice.is-default`, `.db-deftag`, `.db-fx(.still)`, `.fx-pinkflash`, `.fx-heart`, `.fx-vignette`, `.fx-card`, `.stage.fx-quake`.
- Reduced motion (`?still` or OS setting): overlays are static frames, no quake, no bar transition.

## Tests
`src/date-beta-packs.test.js`, `src/date-beta-mech.test.js`. Old timer asserts (10, 5) now 12; empty-choices message says `1..3`.
