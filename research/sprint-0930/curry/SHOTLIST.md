# CURRY scene: shot list (plan fizzy-dreaming-clover, alt's _drift 2026-09-30T0145 CURRY-SCENE)

Each dialogue line is one image. The choice happens on the street, between the two shop fronts. Each path is one continuous visit: street, door, inside, table, dish, eating, exit. Time runs 2:55 → 3:00 → 3:40 PM, and every shot uses the same `afternoon` grade. There are place/time stamps at the street (2:55) and at each interior (3:00). The exit reuses alt's `curry-street`, which has a 3:40 clock. Your hand enters from the bottom-left. Hers enters from the right. Nanda is on screen in every two-shot.

Art ids live in `src/date-beta/art/curry/` (Butter.jsx, Katsu.jsx, parts.jsx). Traces live in `public/date-beta/trace/curry/<id minus curry->.svg`. Refs are Tony's uploads by 8-char id and are **not committed**.

## Shared: the street (v2-curry 0–1)
| # | line | shot | ref | art id |
|---|---|---|---|---|
| 0 | CURRY STREET · 2:55 PM. Two curry shops, side by side. | establishing + stamp | 37f7e6cf (left) + da264766 (right) | curry-choice |
| 1 | NANDA: I am hungry. You pick my lunch. Pick the right one. → Butter chicken / Katsu curry / I am not hungry | medium (her between the doors) | same | curry-choice |

## Butter-chicken path (v2-curry 2–12): NAND HOUSE, a Nepali-run Indian shop
| # | line | shot | ref | art id |
|---|---|---|---|---|
| 2 | Insert. She pushes the glass door. A bell rings. | insert | 37f7e6cf (entrance) | curry-butter-door |
| 3 | Inside NAND HOUSE. A dance video plays on the TV. | wide + stamp 3:00 | 1774ff02 (+ TV from 0da0fa86) | curry-butter-int |
| 4 | Two seats by the window. She sits at your right. Her knee touches yours. | two-shot | a0202261 | curry-butter-table |
| 5 | The lunch set. Butter chicken, saag, rice, and one giant naan. | HERO insert, 3/4 | b6b74858 | curry-thali |
| 6 | Close-up. She tears the naan with two fingers. | close-up, her hand from the right | acc8479f | curry-naan-lift |
| 7 | More butter sauce. Thick, orange, and shiny. | insert | 59cee883 | curry-sauce |
| 8 | Extreme close-up. She dips the naan. The sauce drips. | ECU | c8b36373 | curry-naan-dip |
| 9 | NANDA: Feed me. With your hand. Not the spoon. Your hand. | POV, your hand bottom-left + her close | d791b70f | curry-naan-feed |
| 10 | She eats from your fingers. Her eyes never leave your face. | ECU eyes | (her eyes frame over the table) | curry-butter-table |
| 11 | Her mango lassi. She pushes it to you. One straw. | insert | 1d87c4f1 (glass only, pasted onto the shop) | curry-lassi |
| 12 | She wipes your fingers with her napkin. Then she keeps the napkin for her collection. → Walk to the station | exit, 3:40 clock | alt's ref 05 | curry-street |

## Katsu path (v2-curry-katsu): OR OR CURRY, a Japanese curry shop
| # | line | shot | ref | art id |
|---|---|---|---|---|
| 0 | Insert. She pushes the yellow door. A bell rings. | insert | da264766 (entrance) | curry-katsu-door |
| 1 | Two seats at the counter. She sits at your right. Her knee touches yours. | two-shot + stamp 3:00 | 0da0fa86 (drawn as a counter) | curry-katsu-int |
| 2 | Close-up. Katsu curry. She cuts one small piece. Crunch. | HERO insert | d612440e (+ cutlet, fukujinzuke) | curry-katsu-dish |
| 3 | Extreme close-up. Brown curry. Soft potato. Hot rice. | ECU | eb6e7a8f | curry-katsu-close |
| 4 | NANDA: Feed me. With your hand. Not the spoon. Your hand. | medium over the tray (the spoon is on it) | 21dbf8f4 | curry-katsu-spoon |
| 5 | She eats from your fingers. Her eyes never leave your face. | ECU eyes | (her eyes frame) | curry-katsu-int |
| 6 | She wipes your fingers with her napkin. Then she keeps the napkin for her collection. → Walk to the station | exit | alt's ref 05 | curry-street |

## Not-hungry path (v2-curry-alone): no new art
| # | line | shot | ref | art id |
|---|---|---|---|---|
| 0 | Insert. She pushes the yellow door. A bell rings. | insert | da264766 | curry-katsu-door |
| 1 | She eats alone. You get nothing. She stares at you the whole time. | close, hate face + stamp 3:00 (the hate-quake plays on the pick) | 0da0fa86 | curry-katsu-int |
| 2 | She folds her napkin and keeps it. For her collection. → Walk to the station | exit | alt's ref 05 | curry-street |

**Dropped:** 6d217010 (a US deli case of lassis). It would break the Japan setting. b74c46d3 (CoCo壱番屋) is the backup facade and is not used.

## Signs (all ours)
- **NAND HOUSE** replaces インデアン. The gate pun: NAND, and naan.
- **OR OR カレー** replaces ゴーゴーカレー.
- Also redrawn: 営業中 OPEN, カツカレー, ナマステ (the poster panel), CURRY TIME (the TV), カレー ¥980 and カツ KATSU (the posters), LASSI マンゴー ¥300, ぎゅうにゅう MILK.
- Removed: people (the katsu doorway, the actress poster, the TV's anime still, the portrait posters), the Getty credits (acc8479f), the photo credit (37f7e6cf), and the oishi-des credit and menu captions (21dbf8f4, 59cee883, d612440e).

## Pipeline
1. `pipeline/prep.py <uploads> <out>`: inpaint and flat-fill, a 16:9 crop, the warm 3 PM grade, and a Lab-match of each insert to its path's hero dish.
2. `../romance/pipeline/trace.py <out> public/date-beta/trace/curry`: 0.3 scale, 24 colours, vtracer stacked, ≤600 KB each.
3. The hand pass happens in `src/date-beta/art/curry/`.
4. `pipeline/shots.mjs` takes a shot of every beat, and `pipeline/sheet.py` builds the 256-colour shots plus chain-butter.png and chain-katsu.png.

## Voice
Takes are keyed by scene and words. So every recorded v2-curry line stays in v2-curry with its words unchanged: 027, 028 (the butter react), 030 (the not-hungry react), and 031 ("Feed me").
- The katsu react (029) plays on the street, on the pick.
- The katsu path's "Feed me" is in v2-curry-katsu, so it has no take.

## Impeccable (1920x1080, `pipeline/impeccable.sh`, all 23 beats)
- **Art:** 0 real findings in the curry art.
  - Two contrast hits were flagged, and neither is in this sprint's art:
    - 「そば」 on v2-curry[12] is alt's `curry-street` plate. It is not ours to touch.
    - 「KATSU」 on katsu[5] is the poster sitting under the full-screen eyes frame, so it is hidden in play.
- **Chrome:** the shared HUD issues were already there before this sprint: layout-transition on every beat, plus the usual choice and close-frame findings.
