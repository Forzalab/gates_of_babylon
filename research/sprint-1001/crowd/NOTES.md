# Crowd eyes (sprint 1001)

Tony: "add ppl silhouettes with red eyes, a LOT of silhouettes at different depth, from very near bokeh to faraway, and dogfood it."

## Crowd beats (every beat whose speaker is CROWD, after all packs)

Grep over `src/date-beta/scenes.json`, `src/date-beta/packs/*.json` and `src/date-beta/**` for a `CROWD:` text prefix or a `speaker: "CROWD"`, then checked against the loaded game (`loadScenes(applyPacks(...PLAY))`, `line.who === 'CROWD'`):

| beat | line | bg | layer |
|---|---|---|---|
| leave-fu 2 | CROWD: f{OR}ever and ever | BG-X1 (cafe) | crowd density 1 (50 heads) |
| leave-fu 3 | CROWD: f{OR}ever and ever and ever | BG-X1 (cafe) | crowd density 1.4 (71 heads) |
| leave-yeah 2 | CROWD: f{OR}ever and ever | BG-X1 (cafe) | crowd density 1 (50 heads) |
| leave-yeah 3 | CROWD: f{OR}ever and ever and ever | BG-X1 (cafe) | crowd density 1.4 (71 heads) |

There are no others. `{CROWD.1..4}` in story/meta/obbp is a token (crowd.json names), spoken by NANDA, not a crowd speaker.
`r3-station` `props.near: "crowd"` is the station commuter near-lens. It is not a speaker, so it was left alone.

## Design

- `src/date-beta/art/crowd/crowd.js` holds the plain-JS data, so node --test can check it: `crowdOf(props)`, `buildCrowd({density, seed})` (mulberry32, seeded, no randomness at render), `personPath`, `grinPath`, and the keep-outs `CLEAR` (her column x 700-1220), `FAR_CLEAR` (820-1100), `EYE_TOP` 140 (under the ribbon) and `EYE_BOTTOM` 760 (over the box top, about 800-823).
- `src/date-beta/art/crowd/CrowdLayer.jsx` draws two DOM layers, so the depth reads right:
  - `CrowdBack` paints after the scene and before Nanda, so she stands in front of it. It has a dark radial dim (the clear centre stays lighter), then:
    - far: about 34 x density small flat heads on a back row (y 385-460), dot eyes, low tone, 1.1px haze blur plus a haze gradient.
    - mid: about 14 x density head-and-shoulders figures in the left and right wings. The fill is flat near-black with two crossed hatch patterns and a turbulence displacement for the scribbled edge (ref3). Glowing eyes have an iris gradient, a pupil and a small bloom. About 28% have a faint jagged grin.
  - `CrowdNear` paints where NearLens paints: over the scene and Nanda, under the HUD. It has 2 huge heads cut by the frame edges, plus a 3rd at density > 1.15. The bodies take an 18px CSS blur (bokeh). The eyes take a 1.6px blur plus a red drop-shadow bloom, so the ring detail still reads. The ring eyes (ref1/ref2) have a dark lid, an iris gradient, a light ring, a dark ring, a pin pupil, a white catch-light and a wet streak.
- Motion: a staggered blink (steps, 3% of a 5-12s cycle), the pupils drifting ±3px and a slow ±3px sway on mid. `.rm` (the game's own reduced-motion and `?still` switch) and `prefers-reduced-motion` both stop it. The shot confirms 0 animated nodes.
- Wiring is pack data only. `packs/crowd-eyes.json` patches `props.crowd: {density}` onto the 4 beats. It sits in PLAY after `town` and before `love`, because the gacha test pins love/ux-six/r5/r6/gacha as the tail, and no later pack touches leave-fu or leave-yeah 0-3. `main.jsx` renders the layer when `crowdOf(beat.props)` is set, not on an end card and not on a mini-game bg. `engine.js carried()` drops `crowd`, so it never carries to the LEAVE end beat.
- On a crowd beat the cafe menu board's joke lines are hidden (`.stage:has(.cw-back) .art.cafe .menu`). The right wing stands over the board, so the lines only peeked out as half-words. This was the impeccable low-contrast x4 finding.

## Dogfood (`shots/`, 1920x1080 plus 390x844)

- r0 = before (no layer). r1 = first build. r2 = after the fixes.
- `shoot.mjs <round>` shoots leave-fu and leave-yeah 0-4 (the layer must be absent on 0, 1 and 4), mobile shots of fu-2 and yeah-3, a reduced-motion shot, and a play-through from the `leave 3` choice: pick "FUCK YOU" and click to the crowd beat.
- r1 findings:
  - The far band was almost invisible. It sat at y 470-540, hidden behind mid, and its clear column was the same as mid's.
  - The mid eyes were a bit small.
  - The menu board's words peeked out between heads as noise.
  - Face, box, name tag and NEXT were clear. Mobile letterboxes the stage as before, and the crowd scales with it.
- r2 fixes:
  - The far row moved up to y 385-460 and fills across the back. Its own clear column is 820-1100, high over her head and never at face height.
  - The mid eyes went from 0.20r to 0.23r.
  - The haze moved with the far row.
  - The menu text is hidden on crowd beats.
- r2 checks:
  - The face, box, tag and choices are clear in all 4 beats at 1920 and at 390.
  - All 3 bands are present: 50 and 71 heads.
  - Beats 0, 1 and 4 have no layer.
  - No page errors.
- Best shots: `shots/r2-leave-yeah-3.png`, `shots/r2-leave-fu-2.png`, `shots/r2-leave-yeah-3-mobile.png`.
- About blinks: in some frames one mid head is caught mid-blink, which shows as a thin red slit. That is the blink, not a stray mark.

## Impeccable (`npx impeccable detect`, IMPECCABLE_BROWSER=/tmp/chrome-ns.sh, a no-sandbox wrapper)

| target | before (r1) | after (r2) |
|---|---|---|
| changed files (CrowdLayer.jsx, crowd.css, crowd.js, main.jsx, engine.js, test) | 0 | 0 |
| live `?scene=leave-fu&beat=3` @1920x1080 | 6 | 2 |
| live `?scene=leave-yeah&beat=2` @1920x1080 | - | 2 |
| baseline non-crowd `?scene=leave-fu&beat=1` @1920x1080 | 2 | 2 |

- The 4 fixed findings were low-contrast on the menu board lines ("drip ... 0", "latte ... 1", "or ... both ..?", "xor .. one only"), with the crowd standing over them.
- The 2 left are pre-existing and show on non-crowd beats too:
  - `layout-transition` (a width transition in the HUD).
  - low-contrast on "Click anywhere to continue". On crowd beats the median rose from 1.4:1 to 13.8:1, because the dim sits under it.
- There are 2 advisory notes, not counted. One is `shape-assembled-illustration` on Nanda's sprite svg (pre-existing). The other is on the near-eyes svg, which is deliberate cel art.

## Checks

- `npm test`: 438/438 (437 plus the new `src/date-beta-crowd.test.js`). The new test checks:
  - crowd beats render the layer and no other beat does;
  - 3 bands;
  - 30-80 heads at density 0.8-1.6;
  - seeded output;
  - eyes out of her column and the HUD.
- `npm run build` passes.
- `scripts/voice-gaps.mjs`: 96 live lines, 0 silent.

## Open

- "Click anywhere to continue" low contrast and the HUD width transition were already there. They are outside this layer and not touched.
