# Scene A art: ids + props (Agent 1 → Agent 2)

Everything is exported from `src/date-beta/art/scene-a/index.js` and spread into `ART` in `art/index.js` as `...SCENE_A`. All of it is **still art**: no timers, no stepped clocks, no CSS animation (a test checks this). It is reduced-motion safe as it stands.

## Background ids (`bg` in scenes / packs; each takes `{ props, rm }`)
| id | what | props |
|---|---|---|
| `rooftop-noon` | Ref 05 trace + hand overlay: glass fence, stairwell box with antenna, pale tiles, far skyline, and the distant Figur clock tower behind the glass, reading 12:00. | `tower: [h, m]`, default `[12, 0]` |
| `rooftop-warm` | Ref 07 trace + hand overlay: magic hour, brick stairwell box with a lit door, benches, lilac city, and the Figur tower in the skyline gap. | `tower: [h, m]`, default `[5, 0]` |
| `bento-insert` | The whole pink box on her (dark lavender) lap, tilted −3°. | `focus: null\|'both'\|'ume'\|'tama'` (glow those, dim the rest); `lift: null\|'ume'\|'tama'` (that food is gone from the box) |
| `bento-lift` | Extreme close-up: one piece up in her pink chopsticks, the box big and low, with the gap it left in view. | `lift: 'tama'` (default) or `'ume'` |
| `bento-lift-tama` / `bento-lift-ume` | `bento-lift` with the food fixed (no props needed). | — |

Safe zones:
- The foods sit above y ≈ 800, so the dialogue box (top ≈ 780) never covers the umeboshi or the tamagoyaki in `bento-insert`.
- On the rooftops, the tower is left of centre (x ≈ 560–700 noon, 400–480 warm), above Nanda's head line.

## Components for custom layouts (the handout beat)
- `BentoBox` is an SVG `<g>` in a **1160 × 812** local box, origin top-left. Props:
  - `lift`: as above.
  - `focus`: as above. Glow = a static pink blur plus a white ring; the rest = saturate .3 and brightness .5 (PLAN-main step 7).
  - `onPick(food)`: when given, the umeboshi and the tamagoyaki become `role="button"`, `tabIndex=0` and work on Enter / Space / click, with `food = 'ume' | 'tama'`. Map them to choices 0 and 1 yourself.
  - `labels: { ume, tama }`: aria-labels (the choice text), defaulting to `'Umeboshi'` / `'Tamagoyaki'`.
  - `uid`: the SVG id prefix. Give each instance on screen its own.
- `BentoSvg`: `BentoBox` in its own `<svg>` (viewBox `-20 -20 1200 872`) plus `className` / `style`. Drop it in HTML in place of `<Choices>`.
- The food parts, each an SVG `<g>` centred at 0,0:
  - `Umeboshi({ r, uid, stems, leaf })`
  - `UmeStain({ r, gone })`
  - `ShisoLeaf`
  - `TamaSlice({ w, h, uid, notch })`: cut face up
  - `TamaLog`: the uncut roll
  - `TamaBlock({ w, h, uid })`: the lifted piece in 3/4 view
  - `Chopstick({ from, to })`
  - `Glint`
- Geometry constants:
  - `BOX`
  - `UME = { x: 296, y: 380, r: 54 }` (box-local)
  - `TAMA` (cell, slice centres)

## The circuit gag (subtle, food first)
- **Umeboshi:** 2 tiny brown stem nubs with round pads on its flat-ish left side (the AND inputs), and a shiso leaf out of the right side (the output). On the lifted close-up the nubs read as pins.
- **Tamagoyaki:** a pin-1 dimple in the top edge of every cut face. The lifted piece shows a nori band on its side stamped **SN74181**, with a row of 6 sesame "pins" along the bottom edge.

## Staging notes for the beats
- **Do not put `.focus` (the blur under the dialogue) on the insert or lift beats.** That blur was half of the "blurry egg" bug. The preview's `&sharp` flag shows the intended look (shot 09).
- Hide Nanda's sprite on `bento-insert` / `bento-lift*`. Her sprite covered the food in the old close-up (UX-pass A, shots 06–09).
- The two picks now look different: `bento-lift-ume` shows the plum up and a red stain plus the leaf left on the rice; `bento-lift-tama` shows the swirl slice up and an empty slot with crumbs.

## Files
| path | what |
|---|---|
| `src/date-beta/art/rooftop/{parts,Noon,Warm}.jsx`, `index.js` | rooftop plates, `FigurTower`, `TileJoints`, `ROOFTOP` map |
| `src/date-beta/art/scene-a/{Bento,foods}.jsx`, `index.js` | bento + foods, `SCENE_A` map |
| `src/date-beta/art/scene-a/preview.jsx` + `research/sprint-0930/scene-a/preview.html` | dev preview, not a build entry: `?bg=<id>[&bare][&sharp][&nanda][&line=…][&props=<json>]` |
| `public/date-beta/trace/{rooftop-noon,rooftop-warm,bento-pink}.svg` | vtracer plates (378 / 344 / 443 KB) |
| `research/sprint-0930/scene-a/pipeline/` | `prep.py`, `trace.py`, `shots.mjs`, `compare.py`, `quant.py` |
| `src/date-beta-scene-a-art.test.js` | registry, trace budget, no-motion, button a11y |

### Pipeline
1. **prep.py:**
   - Refs 05 and 07 are cover-cropped to 1920×1080. Ref 07 is anchored low to keep the tiles.
   - Ref 10's box interior is perspective-rectified to a flat 1000×620 plate, using cv2 and the 4 inner rim corners.
   - The umeboshi is inpainted away and only the sides half is kept. The traced rice turned the sesame into brown dirt, so the rice is hand-drawn.
2. **trace.py:** the romance recipe (median-cut, then vtracer stacked/spline, raising the speckle until it fits the budget).
   - Rooftops: 0.3 scale, 24 colours.
   - Bento sides: full scale, 32 colours.
3. **Hand overlay:** everything with an edge.

Run it:
```
python3 research/sprint-0930/scene-a/pipeline/prep.py research/sprint-0930/scene-a/refs <tmp>
python3 research/sprint-0930/scene-a/pipeline/trace.py <tmp> public/date-beta/trace
npx vite --port 5193 --strictPort   # then:
node research/sprint-0930/scene-a/pipeline/shots.mjs http://localhost:5193 research/sprint-0930/scene-a/shots
python3 research/sprint-0930/scene-a/pipeline/quant.py research/sprint-0930/scene-a/shots
python3 research/sprint-0930/scene-a/pipeline/compare.py
```

## Shots (1920×1080, `shots/`)
- `01-rooftop-noon`
- `02-rooftop-noon-staged`
- `03-rooftop-warm`
- `04-rooftop-warm-staged`
- `05-bento-whole`
- `06-bento-lift-tama`
- `07-bento-lift-ume`
- `08-bento-pick` (focus both)
- `08b-bento-pick-tama`
- `09-bento-staged` (sharp, with a line)

The side-by-sides are in `shots/compare/`: ref | new | before, where the before is the UX-pass shot of the old art.

## Deltas (research/date-beta-demo/compare.py metrics; palette dE < 10 = same family, < 20 = related)
| pair | palette dE new | layout dE new | palette dE before | layout dE before | side-by-side |
|---|---|---|---|---|---|
| rooftop noon vs 05 | 8.4 | 3.8 | 17.8 | 37.3 | shots/compare/rooftop-noon_vs_05.png |
| rooftop noon vs 06 (labels) | 9.7 | 4.8 | - | - | shots/compare/rooftop-noon_vs_06.png |
| rooftop warm vs 07 | 7.8 | 7.1 | - | - | shots/compare/rooftop-warm_vs_07.png |
| bento whole vs 10 | 9.7 | 15.4 | 17.5 | 32.2 | shots/compare/bento-whole_vs_10.png |
| bento whole vs 01 | 13.5 | 40.4 | 16.3 | 34.2 | shots/compare/bento-whole_vs_01.png |
| bento whole vs 04 | 14.5 | 40.0 | - | - | shots/compare/bento-whole_vs_04.png |
| lift tama vs 01 | 15.9 | 32.6 | 16.3 | 34.2 | shots/compare/lift-tama_vs_01.png |
| lift ume vs 03 | 20.0 | 31.2 | 24.7 | 32.2 | shots/compare/lift-ume_vs_03.png |
| tama swirl vs 02 (crop) | 27.1 | - | - | - | shots/compare/tama-swirl_vs_02.png |
| lifted tama vs 09 (crop) | 37.2 | - | - | - | shots/compare/lifted-tama_vs_09.png |
| umeboshi vs 08 (crop) | 9.5 | - | - | - | shots/compare/umeboshi_vs_08.png |
| bento glints vs 11 | 16.7 | 34.1 | - | - | shots/compare/bento-glints_vs_11.png |

How to read it:
- Both rooftops and the primary bento ref (10) land in the same colour family. The rooftop layout drops from 37 to 4.
- Refs 01, 03 and 04 are framed differently: a 3/4 shot, a tray, and an oval box on a pink card. Their layout dE is high by design, so compare them for colour and detail only.
- The high scores on the crops come from the ref's own background, not from the food. Ref 02 is 50 % dark plate and photo; ref 09 is 66 % pink board. By eye, the swirl matches ref 02's anime spiral (see its side-by-side).
- Changes made because of this table:
  - The lap backdrop moved from light lavender to a dark pleated uniform, like refs 10 and 01. Palette dE vs ref 10 went from 16.0 to 9.7.
  - The tamagoyaki cell got the uncut roll behind the slices, so the egg fills its slot the way it does in ref 10.

## Impeccable (v4.1.0, 1920×1080, live via the preview + static)
| page | before (old art) | after |
|---|---|---|
| static `src/date-beta/art/{scene-a,rooftop}` | — | 0 |
| rooftop (old `date-beta.html?scene=rooftop`) → `rooftop-noon` bare | 1 finding + 1 advisory | 0 findings + 1 advisory |
| rooftop staged (Nanda + line) | — | 0 + 2 advisories |
| `rooftop-warm` bare | — | 0 + 1 advisory |
| bento close-up (old `?scene=rooftop&beat=3`) → `bento-insert` | 4 findings (3 clipped-overflow on `.focus` / `.shot-blur`, 1 layout-transition) + 3 advisories | 0 + 1 advisory |
| `bento-lift-tama` / `bento-lift-ume` | — | 0 + 1 advisory each |
| `bento-insert` staged, sharp | — | 0 + 1 advisory |

- Every remaining advisory is `shape-assembled-illustration`. It fires on the hand overlay and on Nanda's own SVG, and the romance scenes get the same one. The traced plate underneath is the illustration, so these advisories are judged, not fixed.
- The old findings were engine chrome (the width transition and the blur wrappers). The new shots don't use either.
