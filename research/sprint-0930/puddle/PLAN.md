# Puddle beat: v2-rain 2 re-render (PLAN)

Beat: `v2-rain` beat 2, "Close-up. Her shoes are wet. She walks in the puddles for you." (packs/variant-v2.json
~l.589). Today: bg `rain-alley` (r3-rain pack) + the r5 `feet-wet` insert (a shoe item over the blurred alley).
Only this beat is touched; the other v2-rain beats (and research/sprint-0930/r6) belong to other agents.

## Ref notes (refs live in the session scratchpad, NOT committed)
- 01 (Shinkai): the whole frame is the reflection. The sky is upside down: a utility pole + wires cut diagonally,
  a bright cloud bank, and the water edge is broken into jagged dark asphalt islands with white specular crumbs.
  One small ellipse ripple. Lesson: the reflection is brighter than the real world; the asphalt is the dark frame.
- 02: a puddle in pebbles at sunset; soft rounded rim, the sky gradient inside, a twig + leaves floating ON the
  surface (not reflected: they sit on top, sharp). Lesson: floaters are the only sharp things on the water.
- 03: an iced puddle path at dusk seen top-down-ish; warm sky band in the water, tree and figure reflections as
  soft dark shapes, fallen leaves on the rim. Lesson: dusk = pink/peach reflection vs blue-violet ground.
- 04: a boy's upside-down reflection, dark blue night, many concentric rain rings (white thin ellipses, 2-4 rings
  each) that break the image into bands. Lesson: rings = light strokes, the image under them shifts sideways.
- 05 + 06 (THE composition): camera looks DOWN; the real sneakers at the top-left edge standing IN the water, the
  reflection hangs below them: legs -> skirt -> body -> face at the bottom, the umbrella a big warm disc behind her.
  Grass tufts + petals + leaves at the edges, ripples around the shoes and on the umbrella.

## Composition (1920x1080, 16:9)
- Camera straight down. Wet dark asphalt (blue-violet, speckled) frames the frame; one big puddle fills ~70%.
- TOP edge: the real shoes, cropped at the ankle. Nanda's (her shoe colour) stepping in, left of centre; yours
  (plain dark sneakers) at the right. Wet: specular dots, dark wet toe, a ring around each sole.
- In the puddle, upside down (hung from her shoes, like 05/06): her legs -> skirt -> body -> hands on the umbrella
  shaft (the pin hands) -> face. Her head is in the UPPER-MIDDLE band (y ~ 380-620) so the dialogue box (bottom)
  stays off her face. The umbrella canopy spreads wide behind her head. The NOT circle kept; no side-pony.
  Plan to get her face upper-middle: the reflection is a vertical flip of her sprite, scaled so the legs are short
  (foreshortened from above), the umbrella disc centred ~y 520.
- Behind her in the water: the evening rain sky (upside down): cloud bank, a utility pole + wires across (01),
  one or two street lamps (warm dots with a glow), the pink-violet dusk grade of v2-rain.
- Rain rings: 6-9 static concentric ring sets (2-4 ellipses), two of them over her reflection; under each ring the
  reflection is displaced (SVG feTurbulence + feDisplacementMap on the reflection group, static seed).
- Floaters (sharp, on top): petals + a few leaves, one on the rim, one near her reflected hair.
- Rain FX: the existing rain overlay (props.rain medium) + props.underUmbrella near-lens rim (the rules); no new
  motion. The only motion allowed is the stepped clock (>= 500 ms): the ring set can swap pose with useStep (2 poses).

## Technique (the sandwich, multiplane)
1. Back: a vtraced plate (romance/scenes-r3 pipeline: prep -> 0.3 scale, median, 24-colour quantize, vtracer
   spline, <= 600 KB) built from a composited source: the refs' water/sky/asphalt textures (01 sky+wires, 03 ground),
   people inpainted out. Trace id `rain-puddle` in public/date-beta/trace/.
2. Mid: a blur layer (the reflection plane is slightly soft: feGaussianBlur 2-3 px) + the flipped Nanda sprite with
   the displacement filter + the grade (pink-violet dusk, darker lower).
3. Front: hand-drawn cels (sharp): the puddle rim, the shoes, rain rings, petals/leaves, specular crumbs.
New component src/date-beta/art/r3-rain/RainPuddle.jsx (id `rain-puddle`), beat 2 bg -> rain-puddle, the r5
feet-wet insert on this beat removed (the bg IS the close-up), her standing sprite hidden (she is the reflection).
floors.js: `rain-puddle: { crop: true }` (a close-up insert, no feet-floor check).

## FALLBACK (if the ambitious version fails: the reflected Nanda looks wrong / the trace is mush / tests fight)
Keep the current rain-alley shot (bg rain-alley unchanged) and add a simpler puddle-reflection overlay: one big
dark puddle ellipse in the lower half with an upside-down, blurred, displaced copy of the sky + lamps + a flipped,
low-opacity Nanda silhouette, 4 static ring sets, 3 petals. Beat 2 keeps its bg id, only an overlay prop is added.
Decision point: after step 2 (mid layer) - if the reflected Nanda is not readable at 1920 and at 390 px wide,
switch to the fallback.

## Deliverables
- research/sprint-0930/puddle/compare/ (ref | before | after), shots, npm test + build green, Impeccable pass.
