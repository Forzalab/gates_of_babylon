# T6 LOCK-GAME (branch sprint/lockgame, off sprint/mech)

## Files
- `src/date-beta/game/compat.js`: copy of aleph `src/date/compat.js` (import path fixed). Aleph untouched.
- `src/date-beta/game/LockGame.jsx` + `lockgame.css`: 4x4 match (jar / slipper / bento / NAND, 4 of each).
  Tap a tile, then another of the same kind: the pair unlocks. 8 pairs clear = win. NAND face shows its output
  column (`1110`) off the real simulator via compat `pairRow`.
- `src/date-beta/game/index.js`: `export const GAME = { 'lock-game': LockGame }`.
- `src/date-beta/packs/lockgame.json`: patches `escape` beat 13 (the heavy door): `bg: lock-game`, `text`/`timer`
  removed, `props { win: 1, lose: 0, secs: 40 }`. Beat choices stay (0 = Wait -> escape-timeout, 1 = Leave -> escape-win).

## Component contract
- Props `{ props, rm, onStart, onPick }`. `onPick(i)` plays beat choice `i` (bypasses the choice hold).
- props: `secs` (default 40), `win` (default 1), `lose` (default 0), `seed` (deal, default 7).
- Win -> `onPick(win)` after 1.2 s on the "open" frame. Time 0 -> `onPick(lose)` after 400 ms.

## main.jsx (3 small edits)
- `ART = { ...art/index ART, ...GAME }` so the loader accepts `lock-game` as a bg.
- Art gets `onPick`. On a GAME bg the `<Choices>` bar is hidden and the focus blur is off.

## Motion
- No transitions / keyframes. Timer steps once per second; mismatch frame held 400 ms (>= 334). Same path with `?still`.
- Projector: tiles 15vh, title 5vh, labels 1.9vh, all colours from tokens.css.

## Preview
`date-beta.html?pack=lockgame&scene=escape&beat=13`. Shots: `shots/start|mid|win.png` (1920x1080, 256 colours).
