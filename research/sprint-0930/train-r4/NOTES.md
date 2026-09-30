# train-r4 notes: refs, face gaps, and what was built

Brief: `PLAN.md`, where Tony approved the 9-line table. Refs: `refs/01-16`. Shots and gates: `shots/` and `CHECKS.md`.

## Per-ref notes (what each ref is used for)
| # | what it is | taken | not taken |
|---|---|---|---|
| 01 | A white drink machine on a covered platform. It stands against the wall, has a side coin/IC panel, 4 drink rows and a dark take-out slot, with the platform edge and rails behind. | The frontal box proportions (about 1:1.9) and the side panel. It stands on the platform floor against a wall or pillar. | Real brand logos. |
| 02 | A single machine in the middle of an open platform, head-on, under a canopy, with the vanishing point behind it. | The *platform* setting: the machine sits on the tactile-strip side, facing the viewer. | The empty platform (our platform is crowded). |
| 03 | A 自動販売機コーナー row of 4 machines under a teal banner. | The banner idea, drawn as a small header strip on our machine (じどうはんばいき). | The row. We draw one machine, so it reads as *hers*. |
| 04 | Red Coca-Cola "Welcome to Japan" machines with ukiyo-e panels. | The loud lower-panel art, used for our kawaii lower panel. | The brand and the red (red is her rage colour). |
| 05 | An anime still of a vending machine beside the escalator, with commuters and a flat cel look. | The cel shading of the machine: flat fills, one highlight band, the glow of the drink window. | Nothing else. |
| 06 | A lone machine at the end of a platform: blue and white, "acure", hard sun, a long shadow. | The colour scheme (white and sky blue, orange drink rows), the sun and the long shadow for the 4:30 light. | The empty platform. |
| 07 | A crowded platform illustration: flat dark commuters, sun shafts through the roof, a yellow train. | The crowd grammar: silhouettes with few interior details, 2 depth layers (the near crowd dark and larger, the far crowd lighter and smaller), and light shafts as translucent diagonal bands. | The dreamstime watermark and the yellow train. |
| 08 | A real crowded platform in low sun, with backlit people and long shadows on the floor. | The shadow direction (long, diagonal, towards the viewer) and a warmer 4:30 key light. | The photo detail. |
| 09 | A kawaii vending machine insert: pastel pink machine, cute packaged labels (SPICY, SWEET, a tofu face, "Pole de Fruit", RAMEN), and a green-haired girl pointing at a bottle. | The insert composition: the machine's glass fills the frame, the girl sits in the lower-right third pointing up-left at *one* bottle, and the labels have faces or animals, fat outlines and sparkles. We use it for the drink labels and the close-up. | Her character (Nanda points instead), and the snack rows (our machine sells drinks). |
| 10 | An anime girl asleep on someone's shoulder, mouth open, a drool strand with a drop. | The drool as a thin strand plus a drop at the mouth corner, the slack open mouth and the heavy closed lids. Used for the dazed-sleepy face and the sleeper pose. | Nothing else. |
| 11 | A manga Anya smile: huge glossy eyes, a tiny nose tick, a wide flat smile. | Already built as `anya-smile` (scene-a). | - |
| 12 | The "expressions yummies" 24-face sheet (dark hair, grey scarf). | A cross-check for sweat and nervous, the smug side-eye, and the sleepy droop. | - |
| 13 | The chibi 16-face sheet (Normal … Confused/Dazed). | The main trace source for the six missing faces (see below). | - |
| 14 | A heart-laugh pair: >< eyes, open mouths, red blush, floating hearts. | Already built as `heart-laugh`. | - |
| 15 | A pout: puffed cheeks, glare, a tear. | Already built as `puff` (gacha anger). The ticked-off → puff step uses it. | - |
| 16 | Shadow-eyes (the eye band hidden under the fringe). | The `shadow-eyes` gacha layer already exists. Not needed on this beat list. | - |

## Face gap analysis (the table's emote column against `art/nanda.js`)
| beat | table emote | before r4 | gap | r4 face (id) | traced from |
|---|---|---|---|---|---|
| 1 | heart-laugh | exists (scene-a) | none | `heart-laugh` | ref 14 |
| 2 | nervous (sweat drop) | `sweat` emote only (a flustered smile) | the face was missing; the sweat drop lives only in the bubble | `nervous` + a big head drop (decor) | ref 13 "Nervous" |
| 3 | Anya smile | exists | none | `anya-smile` | ref 11 |
| 4 | ticked off → puff | `puff` exists; ticked-off missing | ticked-off | `ticked-off` (flat heavy lids, dot pupils, tension ticks), then `puff` at "They laugh." | ref 13 "Ticked Off", ref 15 |
| 5 | very angry (the vein layer) | `hate` (the cold stage-5 palette) and the `vein` gacha layer (only on gacha pops) | an angry face in her sweet palette with the vein on a normal beat | `very-angry` + a 💢 on her fringe and one in the air (the same VEIN4 mark as the gacha layer) | ref 13 "Very Angry" |
| 6 | content | exists | none | `content` | ref 13 |
| 7 | happy | missing | happy | `happy` (closed arcs, open D mouth, tongue) | ref 13 "Happy" |
| 8 | dazed/sleepy | missing | the face and the drool | `dazed-sleepy` (droopy lids, slack mouth, drool strand and drop, z z) | ref 13 "Dazed/Hungry" + ref 10 |
| 9 | smug / gloating | missing | smug | `smug-gloating` (half lids, pupils to the corner, one brow up, a lopsided cat grin, a gold sparkle) | ref 13 "Smug" + "Gloating" |

- **Palette.** Every face keeps her palette: ink `#6b0f45`, blush `#ff5fa8` and the tongue pink `#ff7fa8`. The only extras are the sweat and drool blues (`#8fd3ff`/`#1f5f96`, already used by `sweat`) and the vein red.
- **Motion.** The faces are still. Decor is drawn outside her body clip.
- **Side-by-side.** `shots/faces-sheet.png` puts each face next to its ref 13 cell.

## Stage A: the script, spans and emotes
- **Script.** v2-train is now the 9 beats of the table, in `packs/variant-v2.json`, patched by `packs/r3-station.json`.
  - The props sit in the r3 patch.
  - The vending beat varies on `bento`: its text, and `props.drink` = umeboshi|tamagoyaki.
  - The loop beat (7) keeps its run variants.
    - Run 1 is the new line.
    - Runs 2 and 3 are unchanged, so their takes still play.
    - I kept "Twelve stops" spelled out in run 2 (not "12") so its recorded take still matches.
- **Emotes.** One face per beat through `props.cut.face`. Beat 4 steps from ticked-off to puff at "They laugh." (700 ms, one stepped swap).
  - Beats 5 and 7 have 3-line boxes, which covered her face. They set `cut.raise`: her raised pose, the same one choice beats use, so the face stays in view.
- **Styled spans.** The engine's `orParts` parses `{wavy:…}` and `{hat:…}` into `{ t, span }`, so the plain text is the words only (voice, aria and OCR). Any other brace still fails.
  - `Say.jsx` draws the spans.
  - `wavy` = italic, teal `#0a6670`, wavy underline `#12a3ac` (6.1:1 on the box).
  - `hat` = bold, orange `#a3400a`, plus a cap-icon chip (5.8:1). The chip is aria-hidden.
- **Deep link for shots.** `?bento=umeboshi|tamagoyaki` (main.jsx). An unknown value is ignored.
