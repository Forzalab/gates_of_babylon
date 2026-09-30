# art/shots: shot ids for writers (branch sprint/seq-visual)

Camera tricks on EXISTING art. No new backgrounds needed. Use a shot id as a beat's `bg` and pass its `props`:

```json
{ "bg": "insert", "props": { "item": "butter-chicken", "of": "cafe", "tone": "dusk" }, "text": "..." }
```

`of` / `to` = any art id already in `ART`: `rooftop, park, street-day, street-dusk, shop-street, rail-crossing,
crossing-day, crossing-night, train, naan, blackout, basement, platform, underpass, apartment, stairs, genkan-in, door,
genkan, teatable, cafe`. `tone` = `day | dusk | night` (the Your-Name grade). Coordinates are in the 1920x1080 stage.

All motion is stepped (>= 334 ms per step, no tweening). Reduced motion (`?still`) holds the last frame of a move,
except `establish`, which holds its first frame.

## Shot types (RUBRIC grammar -> id)
| grammar | id | props (defaults) |
|---|---|---|
| close-up / extreme close-up | `closeup` | `of`, `x`=960, `y`=540, `zoom`=2 (3+ = extreme), `tone`? |
| insert (object) | `insert` | `item` (see below), `of`=crossing-day (blurred behind), `caption`? (default = item name), `tone`=day, `tilt`=-3 |
| reaction | `reaction` | `emote` = heart, hearts, sweat, pout, or, crack or hate; `of`=street-dusk (blurred behind), `tone`? (default per emote) |
| establishing / pan reveal | `establish` | `of`, `from`=[480,540], `to`=[1440,540], `zoom`=1.35, `steps`=6, `every`=400, `tone`? |
| push-in (dread) / pull-out (loneliness) | `push` | `of`, `x`, `y`, `from`=1, `to`=1.6 (to < from = pull-out), `steps`=5, `every`=400, `tone`? |
| rack focus / bokeh shift | `rack` | `of`, `emote`, `focus` = `her` or `bg` (the end state), `every`=600 |
| POV (player's eyes) | `pov` | `of`, `x`, `y`, `zoom`=1.15, `blink`=true (the eyelids open in 3 steps) |
| over-the-shoulder / two-shot | `ots` | `of`, `emote`, `tone`=dusk |
| time-lapse sky | `timelapse` | `of`, `tones`=[day, dusk, night], `every`=700 |
| dutch tilt (use ONCE) | `dutch` | `of`=basement, `x`, `y`, `zoom`=1.4, `tilt`=-9 |
| match cut | `match` | `of`, `to`, `x`, `y` (the shared shape), `every`=360: an iris closes on `of`, then opens on `to` |
| place/time stamp | `stamp` | `of`, `place`, `time` ("SHOP STREET · 3:10 PM" over the art) |
| medium / wide | use the plain art id as `bg` (Nanda is drawn by the scene) |

Insert `item`s (hand-drawn SVG): `curry, butter-chicken, katsu, book, grocery, teacup, bento, hands, cups3, ic-card,
umbrella, key, cups-end`. Shortcut ids: `insert-<item>` (e.g. `insert-katsu`) need no props.

## Named shots (sequences.json `props.shot` ids)
Each is registered as an art id and also resolves from `props.shot` (the beat keeps its `bg` as the fallback).
Source: `src/date-beta/art/shots/aliases.js`. "borrowed" = the place has no art of its own yet.

`bento-lid, nanda-watch, park-wide (borrowed street), hands-lock, three-cups-basket, shop-exit, library-int (borrowed,
book insert), book-slot, crossing-bell, curry-house-int (borrowed cafe), curry-house-ext (borrowed shop-street),
dish-butter, dish-katsu, nanda-eat-butter, nanda-eat-katsu, station-gate, ic-card-tap, train-door, umbrella-shoulder,
key-in-hand, kitchen-wide (borrowed teatable), tea-pour, hatch-dark, cups-end, street-night-window, cafe-cups`.

## Preview
`date-beta.html?pack=shots-demo&scene=shots-demo&beat=<n>&still` (packs/shots-demo.json). Shots: `sequences/shots/`.
