# T1b INTERIORS+BASEMENT: schema (branch sprint/interiors, base 9ac093c)

## Exports
- `art/interiors/index.js` -> `INTERIORS` (also default): `cellar, park, 'apartment-trace', 'sitting-room', bedroom,
  'genkan-in', 'genkan-v2'`, each an art component `({ props, rm })`. `art/index.js` spreads `...INTERIORS` LAST in `ART`
  (merge: keep it after obbp's `park: Rooftop` fallback; it also overrides `genkan-in`).
- `interiors/kit.jsx`: `camera({vx, vy, f, eye})` -> `{ P(X,Y,Z)->[x,y], pts }` (metres -> stage px, matched to each
  trace's vanishing point), `hull`, `inside`, `ptsOf`, `Trace`, `traceUrl`, `preloadTrace`,
  `Grade({ id, tone: 'magic'|'horror'|'night', sun, sparkles, petals, flareR, rm })` (Your-Name grade; horror = dimmed).
- `interiors/room.jsx`: `SidePanes`, `Curtain` (16:9 window-wall extension for the portrait refs).

## Art ids (props)
- `cellar` (`shelf`: null|jars|bentos|usu|newest = warm pool there, rest dimmed; `jar` = bento pick on the newest jar):
  her basement. Shelf wall of labelled jars/bentos/usu left, high rainy window + cold shaft onto ONE chair centre, box
  stairs to a CLOSED hatch (warm seam) right, columns, faint bulb. Shadows follow the shaft; contact shadows everywhere.
- `park`: KNOWN-BUGS #1 fix. Sakura park, magic hour, pink path to the gazebo, bench for two, koi pond, far pink tower.
- `apartment-trace`: rainy walk-up (ref left, hand-built street right on its VP), ONE lit top-floor window (hers).
- `sitting-room` (`plate`/`feed`: umeboshi|tamagoyaki): night window wall + curtains, low table with 3 cups (3rd empty,
  right), teapot, plate; the table sits above the dialogue box.
- `bedroom`: dusk window, curtains, fairy lights, duvet across the bottom, her plush on the pillow (you are in her bed).
- `genkan-in` = `genkan-v2`: alt's v2 (cb1ed9a) as `GenkanV2.jsx` + `genkan2.css` (class `.genkan2`; BG-D3 untouched).
  `insert`: camera crop onto slippers + shrine. Exports VP/F/CAM/ROOM/PAL as on alt's branch.

## Pack `packs/interiors.json` (bg patches only; no scenes, no copy; order: anywhere after `mech`)
- `apartment` 0 -> `apartment-trace`; `cup` 0 + `unknown` 0 -> `sitting-room`; `steeped` 0 -> `bedroom`;
  `escape` 0, 8, 10, 12 -> `cellar` (arrival + each return from `blackout`); `escape` 13 stays `lock-game`.
- No patch needed: `park` (story's park scene already uses it), `genkan-in` + story's `genkan-talk` (id override).
- Old art (`basement`, `apartment`, BG-D2 teatable) stays registered for A/B; nothing points at it after the pack.

## Files
- Traces `public/date-beta/trace/`: basement, park (576x324), apartment (812x1080 src), sitting-room + bedroom (767x1080 src).
- Pipeline `research/sprint-0930/interiors/pipeline/`: `prep.py` (refs -> PNG; Tony's 50-53 NOT committed), `trace.py`
  (vtracer stacked/spline, per-id scale/colours), `render.mjs`, `shots.mjs` + `quant.py` (1920x1080, 256 colours).
- Preview (dev only): `research/sprint-0930/interiors/preview.html?bg=<id>&still[&nanda][&line=..][&props={..}]`.
- Test: `src/date-beta-interiors.test.js`. Shots: `research/sprint-0930/interiors/shots/`.

## Motion (all stepped or CSS; rm = still / hard cut)
park sparkles + petals 500 ms; apartment + bedroom Rain 2 x 500 ms; cellar rain 2 poses + bulb dip 1 in 8 (625 ms);
genkan insert = CSS transition (global `.rm` = hard cut). Engine, scenes.json, HUD: untouched.
