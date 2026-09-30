# G2 RAIN WALK + G3 HER STREET → NIGHT (Agent 5)

8 new background ids. Each one is live on its own beat through `packs/r3-rain.json`, which runs right after `variant-v2` / `r3-station` in `main.jsx` PLAY:

| beat | line | ref | art id | time token |
|---|---|---|---|---|
| v2-rain 1 | Share my umbrella. Our arms have to touch. | 04 | `rain-sidewalk` | rain-dusk |
| v2-rain 2 | Her shoes are wet. Puddles. | 01 | `rain-alley` | rain-dusk |
| v2-rain 3 | She looks up at you. Then down. | 06 + 07 | `rain-eave` | rain-dusk |
| v2-rain 4 | The rain stops. Wet shoes walk to her street. | 02 | `rain-ending` | overcast |
| v2-street 2 | 7:00 PM. Orange, then dark blue. (stamp HER STREET · 7:00 PM) | 16 | `street-bluehour` | bluehour |
| v2-street 5 | The key turns. Click. Door 12 opens. | 03 | `her-building` | night |
| v2-curry 5 | napkin → her collection (the exit, 3:40) | 05 | `curry-street` | afternoon |
| escape-win 6 | Wide. Her street at night. One window lit. (stamp HER STREET · 8:40 PM) | 15 | `escape-night` | night |

The following beats stay as they were: v2-rain 0 (`crossing-night`), v2-street 0–1 (`street-day`) and 3–4, and escape-win 0–1 (her door, BG-D1).

- **Code**: `src/date-beta/art/r3-rain/`
  - `index.js` exports `R3_RAIN`, which is spread into ART.
  - `parts.jsx` holds the perspective helpers, rain, wet bands, puddles, windows, lamps, stars, canopy, plates and `R3Scene`.
  - One file per scene.
  - `preview.jsx` is dev-only.
- **Traces**: `public/date-beta/trace/<id>.svg`, 300–585 KB each.
- **Pipeline**: `research/sprint-0930/scenes-r3/pipeline-g23/`
  - `prep.py` → `../romance/pipeline/trace.py` (reused as-is) → hand overlay.
  - `bare.mjs` renders the bare art.
  - `shots.mjs` captures the in-game beats.
  - `compare.py` runs the Pillow gate.
  - `impeccable.sh` runs the live scan.
- **Test**: `src/date-beta-r3-rain.test.js`.

## Per-ref analysis (read before tracing)

**01 → rain-alley.** A low-angle lane at rain-dusk.
- Left: a long block wall under a house with one lit window. Right: a green pipe pole, a red vertical shop sign and a lit doorway.
- Wet asphalt fills the bottom third, with warm vertical reflections under the wall lamps and the window.
- The vanishing point sits right of centre at (1330, 640), which puts the horizon at about 59%. It is a low angle on purpose ("Close-up, her shoes"), so I kept it.
- Palette: navy-slate `#2d3a55`, wall greys, warm `#ffd27a` lights.
- Hand pass:
  - Straightened the grey pole, the green pole, the utility pole and the far pole, and redrew the wires.
  - Made the lights flat warm windows with a soft glow and gave them broken vertical reflection bands.
  - Added 3 mirrored puddles with ring marks.
  - Replaced the kanji mush on the red sign with こめや / RICE.

**02 → rain-ending.** A suburban curve in light rain.
- Big hedges and trees on the left. On the right: houses, an orange corner mirror and a utility pole.
- The sky gap at the top is grey-white: that is where "the sky brightens" goes.
- Cover-cropped with fy 0.42, which puts the horizon at about 45%.
- Hand pass:
  - A warm gradient and a lit cloud rim in the sky gap.
  - Straightened the pole and the lamp arm.
  - Redrew the orange mirror, and added a 止まれ / STOP sign (止 is grade 2) above the dialogue box.
  - Redrew the white road lines and added pale mirrored puddles.
  - Drizzle only: 70 short streaks at 70%.

**03 → her-building.** A night street after rain, with her block on the right: two lit windows and a raised ground floor.
- The ref is still raining. The timeline says the rain stopped before 6:00, so prep removes the streaks (`derain`) and no rain layer is drawn. The road is still wet.
- Bottom-anchored crop, horizon at about 48%.
- Hand pass:
  - **Door 12** on the raised floor at x 1306–1428, y 300–544. It is open a crack and lit, with a lamp and steps.
  - The door is right of Nanda (x 740–1160) and fully above the choice-beat box (y 560+). The shot proves it.
  - Added the **メゾン XNOR** plate, which is G3's hidden logic gag: XNOR says 1 when both inputs are the same.
  - Redrew the no-parking disc, straightened the poles, and added reflections under the windows. A few stars sit in the top gap.

**04 → rain-sidewalk.** Portrait, 335×597.
- A tree-lined sidewalk: white railing and trees on the left, the yellow tactile strip, and a red-brick wall with white pillars on the right. Rain-dusk.
- The **Weibo watermark** (@少女之物, bottom rows 566+) is cropped away in prep.
- Rows 40–566 give the 688 px middle. The vanishing point is at (1090, 545).
- **Hand-built wings.** Prep's `wing_ray` fills each wing by sampling along rays to the vanishing point, so the kerb and wall lines continue. The overlay then builds the real structure on those rays:
  - Left: the far block with lit windows, the road, a parked car nose, the white railing (posts spaced evenly in depth), and a near tree in its grate.
  - Right: the tall block, the hedge, the white pillars with iron bars, and the brick wall.
- A clean sidewalk (tiles on rays), the yellow tactile strip and wet bands replace the trace mush in the middle.
- **The red umbrella** from the platform plan comes back here, open over Nanda's spot, so she holds it.

**05 → curry-street.** A lantern street under a pink sunset: paper lanterns strung across, old shop houses, and neon mush at the bottom right.
- The plan wants it graded to afternoon (the curry-house exit, 3:40). Prep does this:
  1. Removes the magenta cast.
  2. Masks the sky and the pink mountain (h 165–178, s 70–140, sampled) to a blue gradient.
  3. Leaves the lanterns alone (orange hue or s > 180).
- Hand pass:
  - Straightened 5 poles.
  - Added a 3:40 clock on the left pole.
  - Hung the curry house's indigo noren **カ・レ・ー** (the same shop as `curry-house`) on the left shop, where neither the box nor the button covers it.
  - Redrew the signs as そば and 花や / FLOWERS.

**06 + 07 → rain-eave.**
- 07 (portrait 403×839) is an old two-storey noodle shop: bamboo blinds, a balcony, a tiled eave with plants, a blue noren, red stools and red lanterns, in teal rain.
- 06 (landscape) is the same lane wider: a big blue banner on the left and three diamond boards on the right.
- **The wings are 06.** Its left and right thirds are Reinhard colour-matched in Lab to 07 and feathered 60 px into 07's middle (rows 70–640).
- Hand pass:
  - Merged the shop front into clean cel regions.
  - Straightened the posts.
  - Our own eave edge runs across the top, with hanging drops: they shelter under it.
  - Every sign is ours: 雨やどり / REST HERE (the banner; rain skips it, it is a dry spot), 茶 / TEA, うどん, そば, 毎日, あんどん, and だ・ん・ご on the diamonds.
- **G2's hidden logic gag**: the red paper lantern (an *andon*) reads **AND-ON**.
- All text sits clear of the HUD (y < 110), Nanda and the box. The noren behind Nanda has a wave crest instead of text.

**15 → escape-night.** Portrait, 675×1200: a starry blue street.
- Tall blocks on both sides, a street lamp, wires, and a **rail crossing** at the far end with a lit block beyond it and a big cumulus. This is the library route at night.
- Rows 120–1060 give the 776 px middle. The vanishing point is at (1100, 620).
- The ref is already night. Prep lifts it slightly (gamma 0.9), because the shared night wash and vignette take about 12 L.
- Hand-built wings:
  - Left: a near block with its roof on a ray, a sky wedge with stars, a window grid with **one window lit** (the line), and a としょかん / LIBRARY signpost.
  - Right: a tall block.
- Middle, merged into clean cel:
  - The road, lane lines and the diamond; the straightened utility pole and wires; the far block with its windows dark (the line says ONE window); the cumulus with a warm rim.
  - The crossing, redrawn crisp: yellow/black posts, crossbucks, unlit red lamps, and gates **up** (no train, the way is open).
  - The OR-SON neon, a callback to her street's konbini.
- **Time continuity**: it replaces the sunset street-dusk closeup. It is 8:40 PM, clear, with stars and lamps. The beat carries the **stamp HER STREET · 8:40 PM** (shot `stamp` over its own bg, set in the pack; no scenes.json edit).

**16 → street-bluehour.** Portrait and tiny (168×299): a riverside street at blue hour.
- Old shop houses with a vertical cafe sign on the left. On the right, a walkway with a lamp row, a river, the far bank lit up, and a pink band under dark blue clouds.
- Rows 52–299 give the 735 px middle. The vanishing point is at (1000, 640).
- The trace of so small a ref is mush, so the hand pass carries more here.
- The colours of the hand-built wings are **sampled from the trace's seam columns** (sky `#2a4c73` → pink band `#ab9ca9` → water `#1f3e5d`), so the seams do not jump.
  - Left: a facade on rays (a lit cafe window, an awning, upper windows with 2 lit), and a 本 / BOOKS plate.
  - Right: the orange band under dark blue, cloud masses, the far bank's lit blocks with broken reflections, the parapet on rays, and 2 more lamps toward us.
- Middle: the ref's lamps straightened, and a clean walkway floor across the frame.
- Signs: 茶 / CAFE.
- The beat keeps its time readout as the stamp HER STREET · 7:00 PM.

## Art style (PLAN "Art style"), as applied
- **Pre-pass**: `trace.py` (the romance recipe, not copied): 0.3×, median 3, 24 colours median-cut, vtracer stacked spline, ≤600 KB.
  - Prep removes the ref 04 watermark (crop) and the rain streaks on 01, 02, 03, 06 and 07 (a horizontal opening).
  - None of these refs has people in it.
- **Time-of-day tokens are shared with G1.**
  - `r3-rain/tokens.js` imports G1's `TOD` (`r3-station/parts.jsx`), and `CelGrade` is G1's `Wash`, so the platform at 5:20 and the rain walk after it grade identically.
  - G2/G3 add only lamp, rain opacity and wet colours.
  - The grade is static: no flare, no sparkles.
- **Rain**: `RainLayers` = 2 seeded static streak paths, swapped by `useStep(2, 5)`, which is 625 ms per pose (≥ 600).
  - Under reduced motion only layer A is rendered, and it never swaps.
  - A `hole` prop leaves a dry area (the banner under the eave).
  - No `<animate>`, keyframes or transitions (asserted in the test).
- **Wet ground**: `WetBand` = broken vertical reflection slices under each light. `Puddle` = a darker mirrored shape with a light rim.
- **Composition**:
  - Nanda's centre is kept clear.
  - Every readable prop was checked against the live shots: door 12, the crossing, the clock, the noren, the umbrella and the stop sign.
  - Sign text never sits under the HUD, the dialogue box, the choice button or Nanda.
- **Sign legibility**: `r3-rain.css` gives the art's text a dark outline (paint-order stroke), so it survives the player's focus blur (blur 3 px + brightness .78).

## Gate 1: Pillow side-by-sides + deltas
Run `python3 pipeline-g23/compare.py .` after `node pipeline-g23/bare.mjs <dev url> shots/compare`.
- The metrics are research/date-beta-demo/compare.py's, imported the same way G1 does.
- For portrait refs, **mid** compares only the columns where the ref sits. The wings have no ref, and a 16:9 cover crop of a portrait is a thin band, so a whole-frame row would measure nothing.
- Side-by-sides: `shots/compare/G23-<id>-vs-<ref>.png`.

| bg | ref | palette dE | layout dE |
|---|---|---|---|
| rain-sidewalk | 04 mid | 5.7 | 10.2 |
| rain-alley | 01 | 3.2 | 4.8 |
| rain-eave | 07 mid | 5.7 | 9.4 |
| rain-eave | 06 frame | 5.7 | 10.1 |
| rain-ending | 02 | 3.6 | 6.3 |
| street-bluehour | 16 mid | 4.5 | 8.3 |
| her-building | 03 | 3.5 | 6.3 |
| curry-street | 05 | 13.4 | 16.4 |
| curry-street | 05 graded (prep) | 4.3 | 5.6 |
| escape-night | 15 mid | 8.0 | 8.4 |
(measured on the committed 256-colour renders)

Every palette dE is under 10 except curry-street against the raw ref, and every layout dE is under 10 except the four rows below. These are deliberate:
- **rain-sidewalk 10.2**: the red umbrella the plan brings back is in 2 of the 24 cells (dE 48 and 52; the ref has no umbrella). The other 22 cells average 6.6.
- **rain-eave vs 06 frame 10.1**: only the wings come from 06. The middle is 07's shop front, and our eave edge is across the top.
- **curry-street vs raw 05 (13.4 / 16.4)**: the plan grades the pink sunset to afternoon. Against the ref after that same grade, it is 4.3 / 5.6.

## Gate 2: Impeccable (1920×1080, live, every affected beat)
Run `sh pipeline-g23/impeccable.sh <dev url> <out>` with `IMPECCABLE_BROWSER` set to the no-sandbox wrapper.

| beat | findings in our art | chrome findings (not ours) | advisories |
|---|---|---|---|
| v2-rain[1] | 0 | 4: choice-button contrast ×2, purple choice gradient, HUD `transition: width` | 2 |
| v2-rain[2] | 0 | 1: `transition: width` | 1 |
| v2-rain[3] | 0 | 1 | 1 |
| v2-rain[4] | 0 | 1 | 2 |
| v2-street[2] | 0 | 1 | 1 |
| v2-street[5] | 0 | 1 | 1 |
| v2-curry[5] | 0 | 1 | 1 |
| escape-win[6] | 0 | 1 | 1 |

- **0 real findings in the art.** On the first pass, the scan caught sign text under the dialogue box, the HUD or Nanda (REST HERE, 茶, そば, あんどん, the curry noren's カ, the clock). All of it was moved, and the outline was added.
- The chrome findings come from beta.css and the HUD, and appear on G1 beats too. v2-rain[1] **before** this pack had 8 findings: the same 4 plus 3 clipped-overflow findings from the borrowed insert shot, and 1 more low-contrast finding.
- Some runs also flag the NEXT pill / `.db-choice` / `.shot-stamp` as `side-tab`. This is flaky and from authored chrome CSS.
- The advisories are `shape-assembled-illustration` on Nanda's own SVG (17 shapes) and on the overlay. The trace underneath is the illustration.

## Gate 3: shots (live beats, 1920×1080, `?still` = reduced motion)
The shots in `shots/` are:
- G2-1-rain-sidewalk
- G2-2-rain-alley
- G2-3-rain-eave
- G2-4-rain-ending
- G3-2-street-bluehour
- G3-5-her-building
- G3-curry5-curry-street
- G3-escape6-escape-night

Bare art for each is in `shots/compare/<id>-bare.png`. To reproduce: `node pipeline-g23/shots.mjs http://localhost:5198 shots`.

## Decisions + known issues
- The borrowed camera shots on these beats are gone. Before, the umbrella and feet inserts framed `crossing-night`, the rack sat over it, the timelapse was over `street-day`, a zoom-3 closeup hid the door, and the curry-house exit was a borrowed `shop-street` closeup. Each beat now shows its own place.
  - The umbrella now lives in the art.
  - The two time jumps keep a stamp.
- `curry-street`: on its choice beat, the clock and the noren sit in the only corners the box and the button leave free.
- The trace is painterly and blocky close up by design (the romance family). The hand-built wings and signs are crisper than the trace; they were colour-matched at the seams to limit the jump. `street-bluehour`'s middle comes from a 168 px ref and stays the softest.
- `tokens.js` and `parts.jsx` import from `r3-station/parts.jsx` (G1's tokens and Wash). If G1 renames them, G2/G3 fail loudly at import, and `npm run build` catches it.
