# Plan R4: Station + Train rebuild (v2-train), script rewrite, crowd, emotes, vending payoff

## Context
Tony reviewed G1 (the station and train). Problems:
- No reason to go to the station.
- An empty platform: no crowd, no bullying.
- The curly-hair and gringo line has no text styling.
- "12 stops / fingers" has no context.
- The 5:20 line is flat.
- One emote for the whole scene.
- **The vending machine got lost.** The v1 spine (`scenes.json` beats 56 and 235) has a vending machine that echoes the bento pick with an umeboshi or tamagoyaki drink. G1 dropped it, and alt never asked about it.

New refs (16):
- 01–06: vending machines on real platforms
- 07–08: crowded sunny platforms
- 09: a kawaii vending machine with a girl pointing
- 10: sleepy drool face
- 11–15: emote sheets (Anya, yummies multi-sheet, chibi 16, heart-laugh, pout)
- 16: shadow-eyes

Files:
- `packs/variant-v2.json` v2-train (7 beats)
- `packs/r3-station.json`
- `art/r3-station/`
- faces in `art/nanda.js` and `art/emotion/`

## 1. Script rewrite (grade 2, spoken, talk mode; every line says who, where, why)
The story reason, told as HERS: she rides this train home every day, alone, 12 stops. Today she takes YOU home on it. It's her "first time not alone".

| # | shot | line (draft; Tony edits) | emote |
|---|---|---|---|
| 1 | match cut: empty plate → station clock | "4:30 PM. Lunch is done. She takes your hand. 'Now we go to MY home. On MY train.'" | heart-laugh |
| 2 | STATION · 4:30 PM, a crowded platform | "The station is full. Everyone is going home." | nervous (sweat drop) |
| 3 | vending machine insert (the bento payoff) | ume path: "She buys a plum drink. Sour. 'Like the one you picked. I remember.'" / tama path: "Egg pudding drink. Sweet. 'Like the one you picked. I remember.'" | Anya smile |
| 4 | the crowd bumps her; she's "bullied" | "Two men bump her bag. They laugh." (NANDA's styled line below) | ticked off → puff |
| 5 | Nanda to the crowd (styled spans) | "Hey, you. **Wavy hair.** And you. **Hat boy, the gringo.** Stop pushing. He is MINE." | very angry (the vein layer) |
| 6 | card tap insert | "She taps her card. Beep. Then she taps it again. For you. 'I pay. You are my guest.'" | content |
| 7 | train, sunny, 4:40 | "12 stops to her home. She counts them on her fingers. 'Every day I count alone. Today I count with you.'" | happy |
| 8 | train, rain, 5:20 | "It's raining. She lays her head on yours. She drifts away." + she lies ON the dialogue bar, half asleep, with drool (ref 10) | dazed/sleepy |
| 9 | her stop, doors, 5:25 | "Stop 12. Her stop. She wakes up fast. She pulls your sleeve. 'Home. Come.'" | smug / gloating (the plan is working) |

The loop lines (the run 2/3 variants) keep the same structure. Run 2 changes line 7 to: "12 stops. Second time today. You forgot. I did not."

**Text styling:**
- "Wavy hair" gets a wavy-underline, italic, teal-coloured span.
- "Hat boy, the gringo" gets a cap-icon chip, bold, orange span.
- This needs a new inline-span markup in the Say renderer (`src/date-beta/Say.jsx`), e.g. `{wavy:…}` and `{hat:…}`, with an accessible plain-text fallback.

## 2. Art (Opus medium)
- **Crowded platform:** redo `station-gate-r3` and `station-ads` with a background crowd, using refs 07–08 composition. Silhouette-flat commuters, 2 depth layers, sunlit shafts, and two named bumpers matching the line: a wavy-hair guy and a guy in a cap.
- **Vending machine (NEW):** a platform vending machine from refs 01, 02 and 06. Its drink row swaps by the `bento` flag (a plum drink or an egg-pudding drink), with ref 09's kawaii drink labels. Its own insert close-up comes from ref 09.
- **Sleepy train beat:** Nanda lies across the dialogue bar, half asleep, with a drool drop (ref 10) and the train-rain background.
- **Emotes:** every beat has a different face (the table above). Trace the missing faces from the multi-emote sheets (refs 12–13):
  - nervous
  - ticked-off
  - very-angry
  - happy
  - dazed/sleepy + drool
  - smug / gloating
- All faces keep Nanda's palette, and go in `art/nanda.js` next to anya-smile, content, heart-laugh and blush-embarrassed.

## 3. Rules and gates
- Shared rules: Opus only, reduced motion first, ≥500 ms stepped swaps. The voice lookup still matches: new lines have no takes, so list them for a re-record in the appendix kit style (Irohauta).
- Pillow side-by-side against each ref, OCR/readability check on every beat, Impeccable, and a shot of every beat on both bento paths → `research/sprint-0930/train-r4/`.
- Commit and push each stage to `ccr-8b4548b6-08uz6t`.

## Execution
- **One Opus medium agent, two stages:** (A) script + span styling + emotes, then (B) crowd + vending machine + sleepy art.
- **Before building,** Tony signs off on the section 1 script table. He can edit lines inline.

## Verification
- Beats 1–9 are shot on both bento paths.
- Each emote shows up exactly where the table puts it.
- The styled spans render and pass OCR.
- The vending drink changes with the bento pick.
- Tests pass and the build is green.
