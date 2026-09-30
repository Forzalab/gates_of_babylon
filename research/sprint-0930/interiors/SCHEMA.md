# T1b INTERIORS+BASEMENT: schema (branch sprint/interiors, base 9ac093c)

## Exports
- `src/date-beta/art/interiors/index.js` -> `INTERIORS` (also default) = `{ cellar, park, 'apartment-trace', 'sitting-room', bedroom }`. Each is an art component `({ props, rm })`.
- `art/index.js` spreads `...INTERIORS` LAST in `ART` (merge: keep it after obbp's `park: Rooftop` fallback).
- `interiors/kit.jsx`: `camera({vx, vy, f, eye})` -> `{ P(X,Y,Z) -> [x,y], pts(list) }` (metres -> stage px, one-point
  perspective matched to each trace), `hull`, `inside`, `ptsOf`, `Trace({id})`, `preloadTrace`, `traceUrl`,
  `Grade({ id, tone: 'magic'|'horror'|'night', sun, sparkles, petals, flareR, rm })` (Your-Name grade; horror = dimmed).

## Art ids
| id | what | props |
|---|---|---|
| `park` | KNOWN-BUGS #1 fix: sakura park at magic hour (trace of research/refs/sakura-park + overlay: near canopy, pink path to the gazebo where Nanda stands, bench for two with cans + her bento bundle, lit lantern, koi pond, far pink clock tower); one low sun right-back, long shadows front-left | none |
| `apartment-trace` | "Four floors. One window lit.": trace of research/refs/rainy-apartment-street full height on the left (812 px, own viewBox, right edge feathered) + hand fixes (lamps, rails, stair flights, shelter roof edge, Figur vending machine, ONE lit top-floor window = hers, sign コーポ NAND); right 1108 px hand-built on the ref's VP (739,626): houses, block wall, wet road + reflections, pole + lamp + wires, far towers; Rain.jsx | none |
| `sitting-room` | the `cup` tea room: trace of research/refs/desk-window-night centred (767 px) + side window panes (city bokeh), lilac curtains, low wall/floor, a low table against the window with 3 cups (2 poured left, the 3rd empty right), teapot, plate; lamp warm top-right, city cool behind; table sits above the dialogue box | `plate` / `feed`: umeboshi / tamagoyaki on the plate |
| `bedroom` | `steeped` ending: trace of research/refs/bed-window-dusk centred + side panes (dusk), curtains, the rumpled navy duvet + pillows across the bottom, fairy lights, her plush on the pillow; you are in her bed | none |
| `cellar` | her basement: shelf wall of labelled jars + bentos + usu (left), high rainy window + cold shaft onto ONE chair (centre, pink bow), box stairs up to a CLOSED hatch with a warm seam (right), 2 steel columns + a post, faint bulb | `shelf`: null/`jars`/`bentos`/`usu`/`newest` (warm pool on that part, others dim); `jar` = bento pick written on the newest jar |

## Pack `src/date-beta/packs/interiors.json` (patch only; no new scenes, no copy)
- `apartment` beat 0: `bg: "apartment-trace"` (carries to beat 1). Old `apartment` (ApartmentExt) stays registered.
- `cup` beat 0 + `unknown` beat 0: `bg: "sitting-room"` (BG-D2 teatable fallback no longer shown there).
- `steeped` beat 0: `bg: "bedroom"`.
- `escape` beats 0, 8, 10, 12: `bg: "cellar"` (arrival + each return from `blackout`). Beat 13 stays `lock-game`.
- `park`: no patch needed; story pack's `park` scene already uses `bg: "park"` -> this art once the map is merged.
- Old `basement` art stays registered (A/B), nothing points at it after the pack.
- Pack order: anywhere after `mech` (it patches bg only; no beat inserts).

## Files
- Traces: `public/date-beta/trace/basement.svg`, `park.svg` (vtracer, 576x324 viewBox stretched to 1920x1080).
- `room.jsx`: `SidePanes`, `Curtain` (window-wall extension for the portrait refs).
- Pipeline `research/sprint-0930/interiors/pipeline/`: `prep.py` (ref 52 mirrored, floor patch + post top inpainted,
  over-bright ceiling darkened), `trace.py` (T1a recipe: 0.3 scale, median, 20-24 colours, vtracer stacked/spline),
  `render.mjs` (raw SVG -> PNG), `shots.mjs` + `quant.py` (stage shots, 256 colours).
- Preview (dev only, not a build entry): `research/sprint-0930/interiors/preview.html?bg=<id>&still[&nanda][&line=...][&props={...}]`.
- Test: `src/date-beta-interiors.test.js` (ids registered, patches hit real beats, patched script loads).
- Tony's basement refs 50-53 are NOT committed (composition/palette only).

## Motion
Stepped only: park = Grade sparkles + drifting petals (500 ms per pose); apartment = Rain.jsx (2 poses x 500 ms); cellar rain on the glass 2 poses + a bulb dip 1 pose in 8 (625 ms each, 1.6 Hz max). `rm` = pose 0 (still).

## Engine / scenes.json
Untouched. HUD untouched.
