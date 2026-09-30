# train-r4 checks: readability, occlusion, faces, Pillow deltas, Impeccable

**Shots.** Beats 1-9 (table rows 1-9 = engine indexes 0-8) on **both** bento paths are in `shots/`.
- Files are `ume-beatN.png` and `tama-beatN.png`, played in the real player at 1920×1080 with reduced motion (`?still&bento=…`).
- Beat 4 is shot twice under Playwright's paused clock: `4a-step1` (ticked-off) and `4b-step2` (puff at "They laugh.").
- `shots/faces-sheet.png` shows each beat face next to the ref 13 cell it was traced from.
- `shots/compare/` holds the bare art renders and the `R4-*` side-by-sides against the refs.
- All PNGs are quantized to 256 colours for git. The checks run on the full-colour originals.

To regenerate (dev server on 5199):
```
node research/sprint-0930/train-r4/pipeline/shots.mjs http://localhost:5199 research/sprint-0930/train-r4/shots
python3 research/sprint-0930/train-r4/pipeline/checks.py research/sprint-0930/train-r4/shots
node research/sprint-0930/train-r4/pipeline/bare.mjs && python3 research/sprint-0930/train-r4/pipeline/compare.py research/sprint-0930/train-r4
node research/sprint-0930/train-r4/pipeline/faces.mjs
python3 research/sprint-0930/train-r4/pipeline/quant.py research/sprint-0930/train-r4/shots
```

## Readability gate
The method is the one in `scene-a/CHECKS.md`, plus two train-r4 checks:
- **Styled spans:** the span words must be in the OCR read, and each span colour must be ≥ 4.5:1 against the box.
- **Face in view:** her face centre must sit above the box top, so the table's emote is actually seen. On beat 8 the sleeper must lie on the box top.

**PASS** = recall ≥ 0.9, span words read, 0 covered points, face in view, and contrast ≥ 4.5.

| shot | beat | face | text (DOM, visible) | OCR recall | covered pts | contrast | notes | gate |
|---|---|---|---|---|---|---|---|---|
| ume-beat1 | v2-train:0 | heart-laugh | 4:30 PM. Lunch is done. She takes your hand. 'Now we go to MY home. On MY train.' | 0.89 | 0 | 11.3 | missed: 30 is; face y 686 vs box 773; MANUAL: OCR reads the italic narration "4:30" as "4:50" and "is" as "ts" (font shapes, not layout); legible by eye | PASS (manual) |
| ume-beat2 | v2-train:1 | nervous | STATION · 4:30 PM. The station is full. Everyone is going home. | 1.00 | 0 | 11.0 | face y 686 vs box 773 | PASS |
| ume-beat3 | v2-train:2 | anya-smile | She buys a plum drink. Sour. 'Like the one you picked. I remember.' | 1.00 | 0 | 11.1 | face y 686 vs box 773 | PASS |
| ume-beat4a-step1 | v2-train:3 | ticked-off | Two men bump her bag.  | 1.00 | 0 | 8.1 | later words hidden 2/2; face y 686 vs box 826 | PASS |
| ume-beat4b-step2 | v2-train:3 | puff | Two men bump her bag. They laugh. | 1.00 | 0 | 10.4 | face y 686 vs box 826 | PASS |
| ume-beat5 | v2-train:4 | very-angry | Hey, you. Wavy hair. And you.  Hat boy, the gringo. Stop pushing. He is MINE. | 0.93 | 0 | 11.9 | missed: is; wavy "Wavy hair." OCR read, 6.1:1; hat "Hat boy, the gringo." OCR read, 5.8:1; face y 376 vs box 692 | PASS |
| ume-beat6 | v2-train:5 | content | She taps her card. Beep. Then she taps it again. For you. 'I pay. You are my guest.' | 1.00 | 0 | 11.3 | face y 686 vs box 773 | PASS |
| ume-beat7 | v2-train:6 | happy | 12 stops to her home. She counts them on her fingers. 'Every day I count alone. Today I count with you.' | 1.00 | 0 | 11.3 | face y 376 vs box 704 | PASS |
| ume-beat8 | v2-train:7 | dazed-sleepy | 5:20 PM. It's raining. She lays her head on yours. She drifts away. | 1.00 | 0 | 11.1 | sleeper on the box top (344-985 vs box 773) | PASS |
| ume-beat9 | v2-train:8 | smug-gloating | Stop 12. Her stop. She wakes up fast. She pulls your sleeve. 'Home. Come.' | 1.00 | 0 | 11.3 | face y 376 vs box 773 | PASS |
| tama-beat1 | v2-train:0 | heart-laugh | 4:30 PM. Lunch is done. She takes your hand. 'Now we go to MY home. On MY train.' | 0.89 | 0 | 11.3 | missed: 30 is; face y 686 vs box 773; MANUAL: OCR reads the italic narration "4:30" as "4:50" and "is" as "ts" (font shapes, not layout); legible by eye | PASS (manual) |
| tama-beat2 | v2-train:1 | nervous | STATION · 4:30 PM. The station is full. Everyone is going home. | 1.00 | 0 | 11.0 | face y 686 vs box 773 | PASS |
| tama-beat3 | v2-train:2 | anya-smile | Egg pudding drink. Sweet. 'Like the one you picked. I remember.' | 1.00 | 0 | 11.1 | face y 686 vs box 773 | PASS |
| tama-beat4a-step1 | v2-train:3 | ticked-off | Two men bump her bag.  | 1.00 | 0 | 8.1 | later words hidden 2/2; face y 686 vs box 826 | PASS |
| tama-beat4b-step2 | v2-train:3 | puff | Two men bump her bag. They laugh. | 1.00 | 0 | 10.4 | face y 686 vs box 826 | PASS |
| tama-beat5 | v2-train:4 | very-angry | Hey, you. Wavy hair. And you.  Hat boy, the gringo. Stop pushing. He is MINE. | 0.93 | 0 | 11.9 | missed: is; wavy "Wavy hair." OCR read, 6.1:1; hat "Hat boy, the gringo." OCR read, 5.8:1; face y 376 vs box 692 | PASS |
| tama-beat6 | v2-train:5 | content | She taps her card. Beep. Then she taps it again. For you. 'I pay. You are my guest.' | 1.00 | 0 | 11.3 | face y 686 vs box 773 | PASS |
| tama-beat7 | v2-train:6 | happy | 12 stops to her home. She counts them on her fingers. 'Every day I count alone. Today I count with you.' | 1.00 | 0 | 11.3 | face y 376 vs box 704 | PASS |
| tama-beat8 | v2-train:7 | dazed-sleepy | 5:20 PM. It's raining. She lays her head on yours. She drifts away. | 1.00 | 0 | 11.1 | sleeper on the box top (344-985 vs box 773) | PASS |
| tama-beat9 | v2-train:8 | smug-gloating | Stop 12. Her stop. She wakes up fast. She pulls your sleeve. 'Home. Come.' | 1.00 | 0 | 11.3 | face y 376 vs box 773 | PASS |

20 shots, 0 fail

**Manual pass on beat 1.** Tesseract reads the italic narration "4:30" as "4:50" and "is" as "ts". Recall is 8/9 = 0.89. The line is plain in the shot, and the same italic narration style passes on every other beat, so this is a font-shape miss by the OCR, not a layout problem.

**Fixed during the gate.** Beats 5 and 7 have 3-line boxes, which hid her face (the very-angry and happy faces). They now use `cut.raise` (her raised pose), and the face check passes.

## Pillow deltas (bare art vs refs; the metrics are `date-beta-demo/compare.py`, as in G1)
| art | ref | palette dE | layout dE |
|---|---|---|---|
| station-gate-r3 (crowd) | 07 | 9.7 | 27.5 |
| station-gate-r3 (crowd) | 08 | 11.3 | 23.5 |
| station-ads laugh (crowd + bumpers) | 07 | 10.4 | 21.1 |
| station-ads named | 08 | 9.4 | 23.2 |
| machine (ads crop) | 01 machine | 12.3 | 35.3 |
| machine (ads crop) | 02 machine | 8.5 | 26.6 |
| machine (gate crop) | 06 machine | 15.4 | 34.3 |
| vending-insert ume | 09 | 15.9 | 17.8 |
| vending-insert tama | 09 | 20.8 | 19.7 |
| train-rain-sleepy | 10 | 26.2 | 40.6 |

**How to read the deltas.**
- **Palette** stays at or under about 12 against the crowd refs 07/08 and the machine refs 01/02, so it is the same family.
- **The machine against ref 06 (15.4)** is our white/sky-blue box set against a photo in hard sun.
- **Layout dE** against the platform photos is 21-35. That is expected: the composition is G1's traced station (refs 11/12), and the crowd is layered on top. What we took from 07/08 was the crowd grammar, not the camera.
- **The insert against ref 09** is dE 16-21. It is the same pastel pink and lilac family, but our shelves are frontal where ref 09's are in perspective, and we sell drinks where it sells snacks.
- **The sleeper against ref 10** is high by design. Ref 10 is a warm close-up of a face; ours is the rainy train with her on the bar. Only the drool and the slack face were taken.

## Impeccable (`npx impeccable detect`, 1920×1080)
- **Static** (`Say.jsx`, `beta.css`, `art/r3-station/`): 0 findings.
- **Live, beats 1, 2, 4 and 7** (`?scene=v2-train&beat=N&still`): `layout-transition: width` on every beat. This is the choice timer bar in `fx.css`, which predates this work and is not touched here.
- **Live, beat 4:** `low-contrast 1.6:1` on the NAND駅 sign. That is the G1 sign under the dialogue focus blur (bg signage is blurred on purpose). The named-bumper chip sits beside it, not on it.
- **Advisory** `shape-assembled-illustration` on her sprite and the train scene: this is judged, not fixed. It is the house style: flat SVG cels over vtracer traces.
