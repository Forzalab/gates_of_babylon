# OBBP: One Big Beautiful Patch (branch sprint/obbp)

## Merged (merge commits)
sprint/mech (base) <- story-pack (includes story) <- meta <- lockgame <- romance.

## Pack order (normal play, no ?pack)
`main.jsx` PLAY = story -> meta -> mech -> lockgame -> obbp (each only if the file exists).
`?pack=a,b` still replaces the list for previews (validation on).

## packs/index.js (applyPacks) additions
- Keys: `notes` (ignored), `drop: [sceneId]` (removed after patch).
- `patch` with `beats: [...]` inserts beats before index `beat` (no `set`).

## packs/obbp.json (integration glue)
- `park` 0 = meta {CLOTHES} opener (story sides/set/vary kept).
- `town` 3 = crowd trick 1; crowd trick 2, 3 + Tony's line inserted at town 4.
- `station-talk` 1..3 = meta loop lines (vary.run 1/2/3).
- MOVE placeholders: errand-shop 5, errand-library 4 (cute synonym), town 6, rain-crossing 4
  ("...and nothing else"), walk-home 5 (fake opposite "Run home alone"). Basement MOVE beats come from mech.json.
- `escape` 13 lock game: `props.win 0 / lose 1` (mech's choice order).
- Drops meta-park, meta-crowd, meta-loop from play.

## Art
`art/index.js`: `...ROMANCE` (street-day/dusk, shop-street, rail-crossing, crossing-day/night) + `park: Rooftop` fallback.
Game bg `lock-game` from `game/index.js`.

## Engine / CSS
- engine.js: a react on the pick that sets an echo flag is not echo-linted.
- beta.css: Nanda centred; right side on goal card (`.stage.is-goal`) and end cards (`.hud-scrim ~`).

## Shots / bugs
`obbp/shots/01..13` (1920x1080, 256 colours). Bugs: `KNOWN-BUGS.md`.

## packs/love.json (love audit + hidden chips, last in play order)
- Keys: `patch` only. Beat numbers are the final ones (after sequences and variant-v2).
- New patch form `{scene, beat, choice: i, set: {...}}` merges into `choices[i]` (used for love values).
- Love audit: `love` on every option of the 10 move-pick beats that had none. See `alt-test/LOVE-AUDIT.md`.
- `loveHidden: true` on ~50% of choice beats + every consequential one (chip shows `??`; documented in `src/date-beta/SCENES.md`).

