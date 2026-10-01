# G1 STATION + TRAIN (Agent 4)

Six backgrounds, one per line of `v2-train` beats 1–6. They are built from refs 08–14 with the "Art style" recipe in PLAN.md.

- **Code**
  - Art: `src/date-beta/art/r3-station/`. The index exports `R3_STATION`, which `art/index.js` spreads in.
  - Pack: `src/date-beta/packs/r3-station.json`. It is in the PLAY order right after `variant-v2`.
- **Traces:** `public/date-beta/trace/{station-gate-r3,station-ads,train-sun,train-rain,platform-rain}.svg`, 496–543 KB each.
- **Pipeline:** `g1-pipeline/`
  - `prep.py` does the cover-crop, the inpaint and the grade.
  - Tracing reuses `../romance/pipeline/trace.py` unchanged: 0.3x, 24 colours, stacked vtracer, ≤600 KB.
  - `shots.mjs` takes the player shots and the bare renders, and checks that the HUD, the dialogue box and Nanda stay clear of the key props.
  - `compare.py` runs the Pillow gate. It imports the metrics from `research/date-beta-demo/compare.py`.
- **Dev preview:** `g1-preview.html?bg=<id>[&bare][&sharp][&ref=NN&op=.5]`. The `ref` option lays the ref over the art, which is how the overlays were aligned. It is not a build entry.
- **Test:** `src/date-beta-r3-station.test.js`.

## Ref analysis (08–14)
| ref | what it is | what we take | what we drop / change |
|---|---|---|---|
| 08 | Lo-fi rainy platform at blue dusk. A lit train on the left with warm windows, the platform running to a VP on the right of centre, an orange LED sign (`DR 8…`) hanging from the canopy, a girl with a black umbrella centre-right, rails and houses in the rain. | Composition only: train left, platform to the VP, sign under the canopy, rain beyond the roof edge. | The girl, and the blue grade (5:20 is rain-dusk, not night). Palette dE 17.7 vs 08, so it is a layout cousin, not a colour source. |
| 09 | **The platform-rain source.** An orange train (JR-Chuo style) on the left under a cream canopy, a lit wet platform with orange window reflections, a yellow tactile strip to the VP at about (1090, 550), a dark rainy right side with trees, a fence and a lit hut, a yellow hanging sign. The girl with a red umbrella and backpack stands left of centre. | The whole trace. The train side redrawn as cels with the same long lines, vertical reflection bands under every window, puddles, the teal stripe, the lamp post. | The girl and the far umbrella figures are inpainted. Her spot is EMPTY, and Nanda stands mid-platform. The sign becomes 「OR駅」, the stop the board's train goes to. It hangs left of the ref's spot so Nanda's raised choice pose never hides it. |
| 10 | Two blue trains on both sides with a girl with a red umbrella dead centre on wet tracks under a pink dusk sky. | The idea that her spot is the frame centre, which is why ours is empty in the middle. | Everything else. The palette is blue/pink (dE 18.6) and belongs to the later rain beats. |
| 11 | 如月站 (the "Kisaragi station" urban legend): a covered platform with benches, an ad wall of five posters, a green "Chilsung Cider" vending machine, a red 灭火器 box, the board `G1 次 00:00 开往 幻想乡`, the steel canopy, a yellow tactile strip, rails and a hedge, all in the rain. | The layout 1:1: the posters, the benches, the vending machine, the pillars and the strip, with the verticals straightened. **The red "WATCHING YOU" poster is kept**, redrawn as a cream face whose pupils look straight out, with a small heart (the yandere wink). | Sign 如月站 → 「NAND駅」 (the station-name gag). The board shows **4:30 → OR / つぎ NEXT / 1ばんせん**. Chilsung → おちゃ TEA. 灭火器 → FIRE しょうか. The other posters become カレー CURRY (the curry-beat callback), はる SPRING, ♪♪ and SALE. The rain is de-streaked, because 4:30 is dry. |
| 11 crop | The vending machine and the left end of the ad wall. | The insert framing: the same art at 1.9x, left half. | There is no gate in the ref, so a ticket gate with a glowing IC reader and two ピッ beeps is drawn in the left third, clear of Nanda and above the box (y 706–756). |
| 12 | Platform 2: a big wall ad with a Chinese slogan, steel seats, potted plants, a vending machine, a green-LED departure board (`K998 13:04 开往 海拉尔`) with a big "2", catenary poles, a yellow strip, houses and pink trees in rain haze. | The trace and the board. The board **reads 4:30 → OR**, with つぎ NEXT / 12 stops, and the "2" is kept. The wall ad, the canopy underside, the floor as one dry cel with joints to the VP, the strip and the poles are all redrawn. | The slogan ad becomes our own poster (いつも いっしょ / NAND LINE ♡, with a pink train on a hill). The board hangs at y 150–290 instead of the ref's top edge, because the HUD bar covers y < 110. Rain haze is removed (4:30 is dry, clouds building), and the grade is `overcast`. |
| 13 | A sunlit pink-walled commuter carriage: a big side window, a door with two tall windows, purple seats, a poster of an orange-haired girl, a red route strip above the door, sun patches on a glossy floor, and a light beam from the far right door. | The trace. Windows as **flat warm yellow with a soft glow**, the sun patches as clean cel parallelograms, the beam, one warm floor cel for the aisle, straight poles. | The girl poster becomes のってね RIDE WITH ME. The route strip becomes our map: **12 stops, NAND → OR ♡**, which is the "Twelve stops" line on this beat. A small 4:40 plate. Grade `afternoon`. |
| 14 | The same kind of carriage, with green seats, heavy magic-hour light, hanging ads, and the watermark **エル** bottom right. | The trace, graded grey in prep: the windows become rain sky, the floor sun patches are filled, and the image is desaturated and cooled. Hand cels: window glass with a far grey town, the seat back pads and cushion, the frosted partitions, the ceiling with muted ads, the rack and poles in front. | The watermark is inpainted. Sun (4:40, train-sun) → rain (5:20, train-rain) is the time passing. |

## Rules check
- **One background per line:** beats 1–6 use `station-gate-r3 | station-ads | station-ads-insert | train-sun | train-rain | platform-rain`. `station-gate` was already a SHOT alias that seq-station and variant-v1 use, so this bg is registered as `station-gate-r3` and the old noon establish is untouched.
- **No animation:**
  - The pack replaces each beat's props, so the old camera moves are gone: the establish pan, the OTS, the closeup of `train` and the `train-door` closeup.
  - Rain is 2 static streak layers. `RainPair` uses `useStep(2, 6)`, which swaps them every 750 ms. With reduced motion (`?still` or the OS setting) only layer 0 shows.
  - A test asserts ≥ 600 ms, and asserts there is no `animation`, `transition` or `<animate` in the G1 files.
- **Nanda-centre clearance:**
  - Nanda sits at x 730–1190, y 424–920, or y 114–610 raised on the choice beat.
  - Behind her in every bg is open floor or aisle: the platform floor (gate), the pillar and bench wall (ads), the aisle (both trains) and mid-platform (platform-rain).
- **Key props clear** (`shots.mjs`, measured in the real player):
  - Box y ≥ 773, or 624 for the long crowd line and 519 on the choice beat.
  - HUD y ≤ 94.
  - Boards at y 150–290 (gate) and 126–288 (ads). IC reader at y 706–756. OR駅 at x 540–688, y 300–352.
  - Result: no overlap with the box, the HUD or Nanda.
- **Gags:** 「NAND駅」 (station-ads), "4:30 → OR" (station-gate and the station-ads board), 「OR駅」 at her stop (platform-rain), and the 12-stop NAND → OR route map (train-sun).
- **Palette tokens** (`parts.jsx` `TOD`):
  - Five tokens: `afternoon | overcast | rain-dusk | bluehour | night`.
  - Each token has a static top/bottom wash, a vignette, a window colour, a glow colour and a rain colour.
  - G1 uses overcast (4:30), afternoon (4:40) and rain-dusk (5:20 and her stop).

## Pillow gate (target < 10; `python3 g1-pipeline/compare.py research/sprint-0930/scenes-r3`)
Side-by-sides: `shots/compare/G1-<id>-vs-<ref>.png`, with the ref on the left and ours on the right.

| bg | ref | palette dE | layout dE |
|---|---|---|---|
| station-gate-r3 | 12 | 6.8 | 7.8 |
| station-ads | 11 | 6.8 | 9.7 |
| station-ads-insert | 11 crop | 10.9 | 18.0 |
| train-sun | 13 | 8.2 | 8.2 |
| train-rain | 14 | 23.4 | 27.0 |
| train-rain | 14 graded (prep) | 8.1 | 9.7 |
| platform-rain | 09 | 5.3 | 8.2 |
| platform-rain | 08 (composition) | 17.7 | 34.3 |
| platform-rain | 10 (composition) | 18.6 | 35.1 |

- The five main pairs are all under 10.
- **train-rain vs raw 14** is far off on purpose. The plan asks for a grey rain grade over a sunlit ref. Against the same ref after the prep grade it scores 8.1 / 9.7, which is the fair check of the trace.
- **The insert** is 10.9 / 18.0 because it adds a ticket gate that the ref does not have, over the bottom-left third.
- **08 and 10** are composition refs only.

## Impeccable (1920x1080, live player, `?scene=v2-train&beat=N&still`)
| beat | warnings | advisories |
|---|---|---|
| 1–4 | 1 `layout-transition` (chrome) | 1 (Nanda's SVG) |
| 5 | 1 `layout-transition` (chrome) | 2: Nanda, plus the train-rain overlay (69 shapes) |
| 6 | 1 `layout-transition` (chrome) | 2: Nanda, plus the platform-rain overlay (62 shapes) |

- **0 real findings in G1 code.**
- `layout-transition` is `fx.css .db-timebar { transition: width }`, which is engine chrome. It shows on every page, for example `?scene=v2-curry&beat=1`.
- `shape-assembled-illustration` is advisory. As in the romance set, the trace underneath is the real illustration, and the overlay is its cel pass.
- One real finding was fixed during the run. The first insert scaled a CSS div past the stage, which gave `clipped-overflow-container`. The camera is now an SVG transform inside the scene's own viewBox.

## Shots
- `shots/G1-beat{1..6}-<id>.png`: the real player at 1920x1080 with reduced motion, seed 7. These are the beats as played: HUD, Nanda, the line, the focus blur (beat 3 is sharp) and the choice on beat 6.
- `shots/compare/<id>-bare.png`: the art only.
- `shots/G1-boxes.json`: the measured box, Nanda and HUD rects per beat.
- All PNGs are quantised to 256 colours.

## Known issues / hand-off
- The traces are painterly and blotchy close up, by design and the same as the romance set. The redrawn cels (boards, posters, floors, seats, the train side) are crisper than the trace around them. The station-ads benches and canopy and the train-rain side walls are still trace-only.
- The train-rain prep window mask leaves a few ragged warm edges at the glass border. The overlay glass covers the panes, but a sliver shows at the top-left rack.
- The `TOD` tokens live in `art/r3-station/parts.jsx`. If G2/G3 define their own, merge them into one shared module (same names, as the plan says).
