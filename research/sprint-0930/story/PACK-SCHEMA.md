# story.json pack schema (T2b)

File: `src/date-beta/packs/story.json`. Generated mechanically from BIBLE.md section 3.
Check: `node research/sprint-0930/story/check-pack.mjs`

## Top-level keys
- `flags`: new flags to declare: `errand`, `food`, `cold` (values as BIBLE section 2). Extra key beyond the plan shape.
- `scenes`: 9 new scenes (`park`, `errand-shop`, `errand-library`, `hungry`, `town`, `station-talk`, `rain-crossing`, `walk-home`, `genkan-talk`).
- `insert`: `[{after, ids}]`: rooftop+5, platform+2, underpass+1, genkan-in+1.
- `patch`: `[{scene, beat, set}]`; `set` is shallow-merged into the base beat. `vary` in a patch is already merged with the base beat's vary.
- `notes`: existing MOVE beats (not patched); T5 owns them.

## Scene / beat
- Scene: `id short title bg enter`. `bg` is an art name. `walk-home` beat 2 switches `bg` to `street-dusk`.
- Beat: `speaker` ("NANDA" / "MC" / false), `text` (no `NAME:` prefix), `timer` (12 on 3-way picks), `choices`, `vary`.

## Choice
- Normal: `text side love emote fx react set go default fake`.
  - ♥: pink. Neutral: pink + `default:true`. 💔: purple.
  - Every pick sets `cold` ("no" for pink, "yes" for purple). Some also set `errand` / `food`.
  - `fake:true` only on `leave` 3 neutral.
- MOVE placeholder: `{label:"MOVE", note}`, with the beat `speaker:false`. `note` carries the `go:` target; the choice has no `go`, so T5 must copy it from `note`.

## Hate line 2
The beat after a pick has `vary.cold.yes = {text, speaker:"NANDA"}` (her cold second line).
Cross-scene: rooftop 6 to `park` 0, `park` 4 to `errand-shop` 0, `hungry` 2 to `town` 0.

## Tokens (text only, T3 fills)
`{TIME} {DAYPART} {CLOTHES} {CROWD.1}`; `{OR}` where BIBLE had it.

## Loader limits still hit (T5 lifts)
Beat/react text over 12 words, 3 choices, `emote:"hate"`, `fx`, `fake`, `flags` in a pack.
