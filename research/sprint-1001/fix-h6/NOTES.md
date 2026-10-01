# H6 + H7 fix (main, Oct 1)

Base: ccr-8b4548b6-08uz6t @ b2ef695. Shots: frozen build + preview, clock 12:20, 1920x1080, `?scene=&beat=&run=&seed=1` (`shoot.mjs`; log.json = Nanda top / box top in stage px). `pairs.jpg` = before | after.

## H6: dialogue box over Nanda's face
| item | before | fix | after |
|---|---|---|---|
| v2-train:8 | `cut.plant 100` (plant wins over the floor): sprite top 524, box 773, only her hair | drop the plant in `packs/r3-station.json` -> the existing `platform-rain` floor (y 698, wet) applies | full body on the platform edge, black eye on, face clear |
| v2-home:1 | `cut.plant 70`: top 494, only her hair | `cut.frame: "close"` in `packs/r5.json` (she kneels, face up close, `reach` arm = the slippers) | face clear. `peek` was tried: it draws Scene A's bento, rejected |
| v2-curry:13 | R6 made the line 2 rows (box 773) but the floor stayed 790: shoes behind the rivets | new floor `curry-street-up` (y 748, same walk pose + sun) in `art/floors.js`; that beat only via `props.cut.floor` in `packs/r6.json` (keeps `frame: medium`, `face: heart-laugh`) | shoes clear; float audit gap -1 px |
| v2-shop:10 / 11 | crop pose, gap 349 / 337 | none | face clear on head: VERIFIED |
| station-talk:1 / 3 raised (run 2 + 3) | hem at the box top (6809100) | none | face clear on head: VERIFIED |
| leave-yeah:4 | no Nanda in frame | skip (9b56b9e) | - |

Other R6 beats: R6 changed text on v2-park 3, v2-shop 0 + 2, v2-curry 13, v2-train 0 + 1, v2-street 0/1/3 (bg). Only curry 13 has a floored Nanda; katsu 11 + alone 3 (1-line box, 826) stay on the 790 floor, clear.

## H7: v3-train:3 "Rain on the window" over a sunny window
- `v3-train` lives in `packs/variant-v3.json`, which is NOT in PLAY (main.jsx): only reachable via `?pack=`. Not in the demo path.
- Fixed anyway (1 line): beat 3 `bg: "train-rain"`. Text unchanged, so no voice change.

## Not done
- M3 (v2-train:7 black eye): beat 7 is `frame: off`; the sleeping girl is drawn by the bg art (TrainRainSleepy), so the fix is art work in TrainRain.jsx. Left for after the freeze.

## Verify
npm test 437/437 · voice-gaps 96 live lines, 0 silent · vite build ok · float audit 93 Nanda beats, 0 flags.

## Round 2 (06:30 PT, from reviewer A partial on review-a)
| item | before | fix | after |
|---|---|---|---|
| v2-town:3 | `plant 90` + 2-line box: only her eyes/hair | `plant 40` in `packs/town.json` (beat 3 only; town 1-2 have 1-line boxes, fine) | face clear, head still under the board girl's face |
| v2-shop:7, v2-home:4 | - | none | face clear on head: VERIFIED |
| WT03 plaster gone at tea | `injury.js` stopped after v2-home | `injuryLayer(scene, beat, path)`: plaster-20 on cup/steeped/unknown/escape* only if `pos.path` went through v2-home (cup is also reached from genkan-talk, never hurt) | plaster on at cup:0 / cup:4 |
Verify: npm test 440/440, voice-gaps 0 silent, build ok, float audit 0 flags (also covers M1/M2).
