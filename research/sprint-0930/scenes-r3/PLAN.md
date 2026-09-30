# Scenes R3: one background per dialogue line (Tony's 16 refs, Tue 9/30 ~01:30 PT)

Refs: `refs/01–16` (upload order).

## Timeline these must respect
Timeline:
- station 4:30, dry, clouds building
- train 4:40 sun → 5:20 rain on the windows
- crossing 5:30, heavy rain
- rain stops
- her street 6:00, wet, low sun
- 7:00 orange → dark blue
- 7:05 home
- escape-win: night, 8 PM+, clear sky and stars

## Placement (grouped by place, each group = one coherent set)

### G1 STATION + TRAIN (Agent 4)
| beat | line | ref | art id |
|---|---|---|---|
| v2-train 1 | STATION · 4:30 PM. Many feet walk past. | 12 (platform 2, departure board, seats) | `station-gate`: dry, overcast grade; board reads 4:30 |
| v2-train 2 | crowd line (curly hair / gringo) | 11 (如月站 benches + ad wall; one poster says "WATCHING YOU") | `station-ads`: keep "WATCHING YOU" as a yandere wink; station sign → our own name |
| v2-train 3 | she taps her card, twice | 11 crop (vending + gate side) | re-uses `station-ads`, insert framing |
| v2-train 4 | loop | 13 (sunlit carriage, pink walls) | `train-sun`: 4:40, sun shafts on the floor |
| v2-train 5 | 5:20 PM. Her head on your shoulder. Rain hits the window. | 14 (green seats) | `train-rain`: same trace family, grey grade, rain streaks on the glass. The sun → rain change shows time passing |
| v2-train 6 | Her stop. Doors open. She pulls you out. | 09 (orange train, wet platform) + 08 + 10 composition | `platform-rain`: the girl with the umbrella becomes an EMPTY spot where Nanda stands; the red umbrella comes back in v2-rain 1 |

### G2 RAIN WALK (Agent 5)
| beat | line | ref | art id |
|---|---|---|---|
| v2-rain 0 | BIG CROSSING · 5:30 PM | existing `crossing-night` (romance) | keep |
| v2-rain 1 | Share my umbrella. Our arms touch. | 04 (tree sidewalk, tactile paving; portrait → 16:9 wings) | `rain-sidewalk` |
| v2-rain 2 | Her shoes are wet. Puddles. | 01 (wet wall alley, reflections; low angle) | `rain-alley` |
| v2-rain 3 | She looks up at you. Then down. | 06 + 07 (shop front with noren, lanterns, eave shelter) | `rain-eave`: they shelter under the shop eave |
| v2-rain 4 | The rain stops. Wet shoes walk to her street. | 02 (suburban curve, lighter rain) | `rain-ending`: drizzle, the sky brightens at the top |

### G3 HER STREET → NIGHT (Agent 5)
| beat | line | ref | art id |
|---|---|---|---|
| v2-street 0–1 | HER STREET · 6:00 PM. Wet road, low sun | existing `street-day` | keep |
| v2-street 2 | 7:00 PM. Orange, then dark blue. | 16 (riverside street, blue dusk, lamps; portrait → wings) | `street-bluehour` |
| v2-street 5 | The key turns. Door 12 opens. | 03 (night street, lit windows, her building) | `her-building` |
| v2-curry 5 | napkin → her collection (exit, 3:40) | 05 (lantern street), graded to afternoon | `curry-street` |
| escape-win | you run out into the night | 15 (starry street + RAIL CROSSING = the library route, seen at night) | `escape-night`: the night-street job from main's render queue, now alt's |

**Total: 12 new backgrounds.**

## Art style (the same for every trace, so the romance set stays one family)
1. **Pre-pass:**
   - Downscale 0.3x and quantise to 24 colours.
   - Remove people, watermarks (ref 04 Weibo, ref 14 エル) and the umbrella girls (08–10).
   - Then run vtracer, stacked hierarchical mode, and keep each file ≤600 KB.
2. **Hand pass ("Shinkai-lite flat cel"):**
   - Straighten verticals: poles, pillars, door frames.
   - Merge noisy blobs into clean cel regions, and redraw every sign in our own text: JP and simple English, grade-2. Hide one logic gag per group:
     - the station name 「NAND駅」
     - the departure board "4:30 → OR"
   - Windows are flat warm yellow with a soft glow.
3. **Time-of-day palette tokens:** `afternoon`, `overcast`, `rain-dusk`, `bluehour`, `night`. They are shared across scenes so neighbouring beats match.
4. **Rain:** 2 static streak layers, swapped in steps of 600 ms or more. With reduced motion, one still layer.
   - Wet ground = hand-drawn vertical reflection bands.
   - Puddles = mirrored, darker shapes.
5. **Composition:**
   - Nanda stands centre, and each background keeps a clear space for her. Build 16:9 wings for the portrait refs (04, 07, 15, 16).
   - Horizon about 45%. The dialogue box never covers the key prop (board, door 12, crossing).
6. **Gates:**
   - Pillow side-by-side against the ref: palette and layout distance, with 10 as the target.
   - Impeccable at 1920x1080: 0 real findings.
   - Shots of every beat.
