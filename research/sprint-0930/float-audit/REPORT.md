# Float audit (Nanda's feet vs the floor)

`audit.mjs` walks every beat of both routes (v2-*, rooftop, cup, steeped, escape*, town, shop, curry*) through
`?scene=&beat=` on `vite preview --port 5218`. It measures her lowest painted pixel (a sprite on/off diff) against the
floor line from `src/date-beta/art/floors.js`. It flags a gap of more than 12 px, a missing `.db-plant`, or a bg with no
floor entry. It skips beats where the dialogue box or the frame crops her feet.

**Before: 14 flags** (14 beats show her feet; none had a floor entry. The 8 with no plant floated 150-300 px.)
**After: 0 flags** (105 Nanda beats, 6 with feet visible; all within 8 px of the floor, all with a contact shadow).

| Beat | Floor key | Before | Fix |
|---|---|---|---|
| v2-rain 4 (Tony's) | rain-ending | feet 598 / road 760: floating 162 px | floor y 760 |
| v2-street 5 | her-building | 598 / 790 | floor y 790 |
| v2-shop 12 | shop-way-out | 614 / 760 | floor y 760 |
| v2-curry 13, v2-curry-katsu 11, v2-curry-alone 3 | curry-street | 598, ground behind the box | floor under the box (840): feet tucked behind it |
| v2-town 4 | town-board | 704 (plant 90), ground behind the box | cut.plant dropped, floor under the box |
| v2-park 5 | feet-park (insert card) | 614, floating over the card | floor under the box |
| v2-library 5 | hands-lock (insert) | 614 | floor under the box |
| v2-home 4 | tea-pour (insert) | 614 | floor under the box |
| steeped 2 | bedroom | skirt at 816, box at 823 (really cropped: tolerance fixed to 10 px) | crop entry |
| v2-train 4, 6, 8 | station-ads / train-sun / platform-rain | already planted (cut.plant) | floor entries added at the approved lines (690/690/698) |

## Mechanism
- `art/floors.js` is the one place: `FLOORS[bg or insert-shot] = { y }` or `{ crop: true }`, read with `floorOf(bg, shot)`.
- `main.jsx` gives Nanda `.floored` with `--floor` whenever the beat has no explicit `cut.plant`. Her feet sit on `y`, and
  `.db-plant.floored` sits under them. New beats on a listed bg get this automatically.
- `beta.css`: the town shadow fix (SHADOWS.md) now applies to every bg. `.db-plant` has no z-index, so it draws behind
  her and the box. It has no offset or rotation, sits centred under her feet, and is a soft radial fill.
- `src/date-beta-floors.test.js`: every bg or insert shot used by a medium-frame Nanda beat on the routes must have a
  floor entry (a `y`, or `crop: true`).

Shots: `shots/` = the 6 beats where her feet show, after the fix (`--all`); `result.json` = every row.
