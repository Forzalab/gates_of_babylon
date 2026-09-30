# SHOP: cel-over-vtrace (multiplane) log

Technique: brain `_drift/2026-09-30T0515-alt-TECHNIQUE-cel-over-vtrace.md`.
- **Far plane:** each art id uses a PURE vtrace of one of Tony's refs (`public/date-beta/trace/shop/cel-<id>.svg`). Before tracing, the only changes are a crop/scale (and a mirror for the exit), a soften/inpaint of people, lettering and watermarks, and the 2:00 PM grade. Pipeline: `cel/prep.py` and `vtrace-r2/prep.py`, then `cel/trace.py` (0.5x, 48 colours, ≤700 KB). The bgs get no hand repaint.
- **Mid and character planes:** flat cels (`ShopScene` children) with a per-scene **tint** (a multiply grade in the colour of the traced light). Shadows fall down-left in the sunny street shots (`LIGHT`) and straight down under the overhead shop lights (`Shadow dx`).
- **BOOK:** `ShopScene book=`, drawn in front of everything after the wash. It is used for the snacks price-tag rail (17) and the inside door frame and bell (23).
- **Game (Tony's extra):** the answer cards and the aisle chips now use JP shop POP. Items: 単品 / ペア / 3客セット, にんじん 1袋, たまご 10個入. Aisle chips: 本日のおすすめ, 特売. The English stays as a small subtitle. The art signs follow the same style: 3客セット 特価！, 特売 · 赤いのだけ！, and the gate pun たまご AND たまご = たまご. The two player hands and the red cart rail are gone from every game frame.
- Side-by-sides (CURRENT | NEW | REF) are in `cel-compare/`. The rule is a bias to the trace: when a cel looks worse than the plain trace, the cel is dropped.

| shot | far (ref) | cels kept | decision |
|---|---|---|---|
| 00 street | 16 whole | 3 vending machines (GATE-COLA, 故障中, 1011) | keep: the machines carry the gags; flat on the pavement, shadow down-left |
| 01 doors | 16 closer | NAND MART band on the traced sign, たまご A-board | **dropped** the OPEN card (it floated on the glass) |
| 02 list | 15 blurred | the clipboard list, a blurred cart | keep: the list beat still reads |
| 03 cart | 15 | cart, basket, handle, 2 hands + her hand | keep (same as r2) |
| 04-06, 08-12 game aisles | 12 / 11 / 09 | POP signs, floor band, THE 3 cups, straight-edge | keep; the signs are now JP POP |
| 06 carrots right | 12 tight | the POP card only | new trace replaces the hand-drawn crate: better |
| 09 eggs right | 11 tight | 2 price boards, a おすすめ header | new trace: better |
| 13-15 cups right | 10 | one plank + 3 cups + ¥880 tags | keep the cel plank (it is the answer); the rest is trace |
| 16 basket | 03 | carrots + THE cups (r2-cup as-is) | keep |
| 17 snacks | 04 | NAND BITES card, リスト外 card, BOOK tag rail | keep: the rail gives depth |
| 18 checkout | 07 | LANE 2 board, basket | keep; the basket is small (see weak) |
| 19 register | 06 | LED ¥1,011, the shop lady + wave, basket | keep: the lady cel stands over the traced uniform |
| 20 nails | 05 | her hand on the traced grip | keep: the nails land on the traced bar |
| 21/22 self | 08 | screen NO LADY HERE, lane-0 flag | keep: the screen covers the inpainted promo text |
| 23 way out | 16 mirrored | BOOK door frame + bell, bags + hands | keep |

Weak: 21/22 still show an inpaint smear right of the screen. The BOOK cannot pass in front of Nanda, because she is a DOM sprite above the scene layer. 03 keeps the r2 cart cel over a murky trace. The 18 basket is tiny on the rack. On 19, the traced torso shows around the lady cel.
