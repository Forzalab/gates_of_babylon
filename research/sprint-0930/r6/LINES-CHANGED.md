# R6: dialogue lines changed (for the ElevenLabs re-record)

Source of truth: `src/date-beta/packs/r6.json` (applied last). Old text = `variant-v2.json` / `shop.json` / `curry.json` before R6.
"Old VO file" = the take in `src/date-beta/voice/manifest.json` that now says the wrong thing (drop or replace it).

| # | Beat id | Speaker | Old line | New line | Old VO file |
|---|---|---|---|---|---|
| 1 | v2-park 4 | Narrator | Two pairs of shoes walk out of the park. Hers stay close to yours. | **REMOVED** (beat cut, no new take) | `narration/v2-park/253_4.mp3` (delete) |
| 2 | v2-shop 0 | Narrator | SHOP STREET · 2:00 PM. Sunny. Vending machines hum. Nanda pulls you to a shop. | SHOP STREET · 2:00 PM. Sunny. Vending machines hum. Nanda pulls you into a shop. You are here to buy her groceries. | `narration/v2-shop/254_0.mp3` |
| 3 | v2-shop 2 | Nanda | Carrots, eggs, three cups, and you. My whole list. ♡ | We are here to shop. You buy what is on my list: carrots, eggs, three cups. And you. ♡ | none (no take in the manifest yet; record new) |
| 4 | v2-curry 13 | Narrator | We walk out to the street. It is 3:40 PM. | We walk out of the curry shop. It is 3:40 PM. Lunch is done. Now we walk to her station. | `narration/v2-curry/281_13.mp3` |
| 5 | v2-train 0 | Narrator, with Nanda's quote | 4:30 PM. Lunch is done. She takes your hand. 'Now we go to MY home. On MY train.' | 4:30 PM. Her station. She takes your hand. 'Now we go to MY home. On MY train.' | `06-v2-train/239_1-quote.mp3` |
| 6 | v2-train 1 | Narrator | STATION · 4:30 PM. The station is full. Everyone is going home. | The station is full. Everyone is going home. | `narration/v2-train/297_1.mp3` |

Notes for the session
- Only the narration lead-in changes in #5; Nanda's quoted half ("Now we go to MY home. On MY train.") is the same words. If her quote is a separate Nanda take, it can be kept; re-record the narrator part only.
- #6 drops the "STATION · 4:30 PM" lead-in because train 0 now shows it as the on-screen stamp.
- Not changed in R6 (same old line still used, no re-record): `v2-curry-katsu 11` and `v2-curry-alone 3` ("We walk out to the street. It is 3:40 PM.").
- No other spoken line changed in R6. Rooftop mini-choices, the street dusk bg, the curry shadow and the R6 critic fix (skirt mask) are visual only.
