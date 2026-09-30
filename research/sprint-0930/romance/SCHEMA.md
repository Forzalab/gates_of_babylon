# T1a ROMANCE-SCENES: schema

## Exports
- `src/date-beta/art/romance/index.js` → `ROMANCE` (also the default export) = `{ 'street-day', 'street-dusk', 'shop-street', 'rail-crossing', 'crossing-day', 'crossing-night' }`, each an art component `({ props, rm })`. The integrator spreads it into `ART` in `art/index.js`. Use the ids as `bg` in pack scenes.
- `props` is not read yet: every scene is a plain background.
- `Grade.jsx`:
  - `Grade({ id, tone: 'day'|'dusk'|'night', sun: [x,y], petals, sparkles, rm })` draws the Your-Name grade: a magic-hour wash, a lens flare (sun, streak, ghosts), a vignette, sparkles and petals.
  - `TraceScene({ id, trace, label, grade, rm, children })` = trace `<image>` + your overlay + the grade.
  - `traceUrl(id)` and `preloadTrace(id)` load the traced SVG.
- Motion is `useStep(6, 4)`, one pose per 500 ms: sparkles twinkle and petals drift. Under `rm` it holds still on pose 0. Rain in `crossing-night` uses `Rain.jsx`, also stepped at 500 ms.

## Files
- Components:
  - `Street.jsx` holds `StreetDay` and `StreetDusk`. Both use one overlay, so the geometry is identical; only the trace colours, the lights and the tone change.
  - `RailCrossing.jsx`, `ShopStreet.jsx`
  - `Crossings.jsx` holds `CrossingDay` and `CrossingNight`.
- Traces: `public/date-beta/trace/<id>.svg`, 490–585 KB each. Each SVG has a 576×324 viewBox and is stretched to 1920×1080.
- Pipeline: `research/sprint-0930/romance/pipeline/`
  - `prep.py`: cover-crop to 16:9, inpaint people, wings for portrait refs. Dusk is warped onto the day frame with ORB matching and a partial affine (scale 1.256).
  - `trace.py`: downscale to 0.3, median filter, median-cut to 24 colours, then vtracer (stacked, spline, speckle 6–10, layer diff 8, path precision 1). This recipe replaced full-res traces, which needed speckle 50 to fit the size budget and came out grey mush.
  - `shots.mjs`: preview → PNG. `render.mjs`: raw SVG → PNG.
- Dev preview: `romance-preview.html?bg=<id>[&still][&bare][&line=NANDA: …]`. It is not a build entry and is safe to delete when integrating. It centres Nanda with a CSS override, as in the sprint contract.
- Shots: `shots/<id>.png` shows Nanda centred with a line under the player's focus blur. `shots/<id>-bare.png` is the art only. Both are 256 colours, 1920×1080.

## Ref → id (Tony's uploads, not committed)
| id | ref | people removed |
|---|---|---|
| street-day | 2ccd9914 | poster face → OR-SON menu board + drinks poster |
| street-dusk | 45e8b853 (warped to the day frame) | same overlay |
| rail-crossing | e953c7ae | girl + bike inpainted; road, hedge, gate arm and rails redrawn |
| shop-street | ee7d97e8 | none; kanji mush → clean signs 八百屋 / 和菓子 / パン / 団子 |
| crossing-day | 605636e1 | crowd: everything below the building line is hand-drawn |
| crossing-night | 608bf512 (top 268 px + wings) | crowd cropped; billboard faces → heart / ずっと一緒 / moon |

The optional `town-street` (91f57e4d) was skipped.

## Known issues
- The traces are painterly and blocky close up by design. The hand-drawn signs and panels are crisper than the trace around them.
- The crossing-night wings are blurred stretched columns, darkened by the vignette.
- Impeccable (1920×1080, live, all 6 scenes): 0 findings, 9 advisories. All are `shape-assembled-illustration`, on the overlay and on Nanda's own SVG; the trace underneath is the real illustration.
