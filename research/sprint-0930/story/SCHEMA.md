# T2a story: SCHEMA

## Files
- `research/sprint-0930/story/BIBLE.md` is the only source.
  - §1 voice bible, §2 roadmap + flags + T3 hooks, §3 beat table.
- T2b writes `src/date-beta/packs/story.json` from §3. T2a writes no code.

## Pack shape (plan contract)
`{ scenes:[...], insert:[{after, ids}], patch:[{scene, beat, set}] }`

## New scene ids (insert order)
- `park` after `rooftop`
- `errand-shop` after `park`
- `errand-library` after `errand-shop`
- `hungry` after `errand-library`
- `town` after `hungry`
- `station-talk` after `platform`
- `rain-crossing` after `station-talk`
- `walk-home` after `underpass`
- `genkan-talk` after `genkan-in`

## Art ids used (T1a)
`park`, `shop-street`, `rail-crossing`, `crossing-day`, `crossing-night`, `street-day`, `street-dusk`. Existing: `platform`, `genkan-in`.

## Patched existing beats
`rooftop` 1/3/6 · `naan` 1 (vary) · `door` 1/3 · `cup` 0/3 · `leave` 2/3 · MOVE marks on `unknown` 1/2 and `escape` 0/5/13

## Beat fields used
`text`, `speaker` (`"NANDA"`/`"MC"`/`false`), `bg`, `choices`, `timer` (12), `vary`

## Choice fields used
- `text`, `side`, `default`, `set`, `go`, `love` (−5..+5), `react`
- new (T5): `emote` (`hearts`/`heart`/`sweat`/`hate`), `fx` (`love-burst`/`hate-quake`/`chosen-flash`/`none`), `fake`

## Flags (new)
- `errand`: groceries | library
- `food`: butter | katsu
- `cold`: no | yes. Every pick sets it; the next beat's `vary.cold.yes` = hate line 2.
- Existing: `bento`.

## Tokens (T3 fills)
`{TIME}` park4, rain0, door3 · `{DAYPART}` walk-home3 · `{CLOTHES}` park0 · `{CROWD.1}` town3 · `{RUN}` end cards. Rows tagged `[T3]` may be overridden by `packs/meta.json`.

## Contract gaps for T5
- text/react max 12 words → ≤30
- 3 choices per beat
- `emote:"hate"`, `fx`, `fake`

## Picking conventions
- ♥ = pink, set cold:no
- neutral = pink, default, set cold:no
- 💔 = purple, set cold:yes
