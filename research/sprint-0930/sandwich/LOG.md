# SANDWICH (Tony, 09-30): back trace, then a mid blur, then crisp front cels, for the faraway / establishing shots

**The layers:**
- **BACK:** a pure vtrace of the ref.
- **MID:** `<Haze>` in `src/date-beta/art/sandwich.jsx`. It is the same trace with a gaussian blur of 3, laid over it at 0.5 opacity, plus a 5-10% air wash in the time-of-day colour.
- **FRONT:** crisp hand cels, saturated.
- **On top:** Nanda, the BOOK and the HUD.

Sandwich scenes carry `.sw-mid`, so the player's focus blur only dims them (`beta.css`). The mid layer carries the depth, and the front stays crisp under a line of dialogue.

**Files:**
- Compare: `compare/<shot>.png` shows BEFORE | SANDWICH | REF. The town shots use the stock refs, cropped. The other shots have no ref in the session, so their third panel is the back trace alone.
- Shots: `shots/`, from the real player.
- Pipeline: `pipeline/` (`back.py`, `shots.mjs`, `backs.mjs`, `compare.py`).

## Decisions per shot

| Shot | Kept | Why / what |
|---|---|---|
| v2-town street (0, 1) | **SANDWICH** | **Back:** new `trace/town/street-sw.svg`, a pure trace of ref 04. Only small face blurs and brand scrubs, and the ad clutter stays. **Front:** a ゲートちゃん poster and the NANDでも推せる！ banner leaning with the left facade (skewY +9). Five 縦看板: 萌えゲート, メイド・イン・NAND, まんが館, オア電, ゲーセン. The オア電 roof sign sits at the VP. On the right: カードゲート王国 (the カードキングダム parody, skew -13), ANDロイド, 推し活グッズ, and カレー → 200m. Three のぼり: 新作入荷, 推し活, 中古NAND. Three far walker cels with contact shadows. It reads as Akiba now, where the before was colour mush. |
| v2-town crossing (2) | **SANDWICH** | The back is the traced real crowd, with heads softened. The front signs sit above the crowd: カラオケAND, ゲーセン, 推し活グッズ, カレー →, ANDロイド, メイド・イン・NAND and まんが 中古. |
| v2-town board (3, 4) | **SANDWICH** | The ゲートちゃん board is kept. Added: ANDロイド, オア電, 推し活, a メイド・イン・NAND MAID CAFE board, a 質 circle and a 買取 board on the orange building. |
| rooftop-noon | SANDWICH (marginal) | Mid haze, plus a red-white radio mast and a small NAND生命 roof billboard on the skyline. Noon, so the saturation is modest. The difference is small. |
| station-gate-r3 | SANDWICH | Added a yellow hanging ↑ 出口 EXIT sign and a NAND駅 plate at the far end. The crowd, the vending gag and the 4:30 board are kept. |
| crossing-night (v2-rain 0) | **SANDWICH** | Neon with bloom: カラオケAND, ゲーセン, オア電, メイド・イン・NAND and OR-SON 24h. It sells "the signs glow" in the line. The heart and ずっと一緒 screens are kept. |
| street-bluehour | SANDWICH (marginal) | Two red 居酒屋 lanterns and a スナックAND neon plate. The dusk colours are kept. |
| escape-night | SANDWICH (marginal) | A スナックOR neon 縦看板 and a neon rim on OR-SON. The crossing, the stars and the lit window are kept. |
| curry-street | **SANDWICH** | The red paper lanterns strung across the street are redrawn crisp and large, with 祭 カ レ ー 祭. The noren, the 3:40 clock, そば and 花や are kept. |
| shop 00/01 (shop-vending, shop-doors) | **BEFORE** (not touched) | Both are fully hand-drawn with `trace={null}`, so there is no back layer to sandwich. Another agent is also rebuilding the shop. |

## Weak spots
- The perspective is a simple skewY per facade, not true keystoning. The big slanted boards read right, but the small 縦看板 are frontal.
- The town backs trace at speckle 32-38 to fit the 700 KB limit, so the back is blobby.
- rooftop, bluehour and escape change only a little. There are no refs in the session for the non-town shots, so those compares use the back trace instead.
