# Replay audit, runs 2/3 (M4 capture only, nothing fixed)

Shots: `shots/<name>/NN-<scene>-<beat>[-choice|-react|-end].png` + `log.json` (text per shot). Driver: `shoot.mjs <name> "<query>" [choiceIdx] [max]` (same logic as paths/shoot.mjs, URL-driven: `?pack=meta&scene=..&run=N&seed=1`), 1920x1080, vite dev port 5231, seed=1.
Rubric A-I (r5-ume/AUDIT.md was reverted from this branch; recovered from git a22d917): A physics, B common sense, C render/layer order, D coherence, E emotes, F figure sizing, G line-visual match, H sprite sanity, I UI text. Pri = HIGH/MED/LOW.

Captured: meta-park r1 + r3 (hate pick), meta-crowd r1-3, meta-loop r1-3, live station-talk r1-3 (where the loop lines play live), v2-train r1-3 (live Groundhog train line), v1-train and v3-train r2/r3 (preview packs), fail card ({RUN} lines) on leave-fu for run 1/2/3 and several seeds. Every beat was reachable; nothing skipped.
Note: meta-park/crowd/loop are DROPPED by obbp.json (`drop`), so they exist only via `?pack=meta`; live play gets the loop words through station-talk 1-3 (vary.run). `{TIME}` reads 4:4x AM because the box clock is at night.

## Global
- G1 (G, MED) Run 1 / 2 / 3 look identical in every replay beat: same bg, same sprite, same grade, only the words change. A loop that "escalates" has no visual cue (idea: run 2 slight desaturation / ghost frame, run 3 flat grade).
- G2 (I, LOW) `{TIME}`/`{DAYPART}` come from the real clock: "4:45 AM, a sleepy night, and this is a classroom" is odd at night; wording only.

## Per beat
| beat id | scene (run) | fails | note / suggested fix | pri |
|---|---|---|---|---|
| meta-park:0 choice | rooftop-type bg (preview only) | A/C (Nanda sits high and half-hidden behind the dialog box, her body and feet cut); I (the TIME bar + 3 pills crowd the bottom) | keep the box off her | MED |
| meta-park:0 react (+3) | run 1 | E (a flat smile on "I know everything about you"; wants the stare) | yandere face | LOW |
| meta-park:0 react (-4, hate pick) | run 3 | D (pink cherry bg against a hate line "Everything is about me") | darker grade on the -4 react | LOW |
| meta-park:1 | run 1 | E (calm closed-eye smile for "the same perfect date, ehehe") | creepy stare | LOW |
| meta-crowd:0-3 | platform bg, runs 1-3 | A/C (Nanda cut by the box down to the eyes for the whole crowd monologue); G (she faces left while saying "I see you"); E (the same face on 0 and 3) | a medium shot looking into camera | HIGH |
| meta-crowd:1, 2 | all runs | I (crowd tokens fill lowercase at a sentence start: "Trick two. you by the window is...", "Trick three. you pretending...") | capitalise tokens at sentence start or reword crowd.json | MED |
| meta-crowd:3 | all runs | I (ends on the roast line, then straight to a black frame; no closing beat) | add an end beat | LOW |
| meta-loop:0 | run 2/3 | G/E ("Why is everything the same? / Run 3. Same day" over a calm wide-eye face) | tired/flat face on run 3 | MED |
| meta-loop:1 (MC) | run 2/3 | H (MC speaks, only Nanda is shown, smiling "^ ^") | hide/dim Nanda on MC lines | MED |
| meta-loop:2 | run 3 | E (sweat / X-eyes face on the proud "That's love") | proud yandere face | MED |
| meta-loop:2 (4th shot) | all runs | C (a pure BLACK frame with only the HUD buttons after the last line: no card, no way back; the player can be stuck) | add an end / loop card | HIGH |
| station-talk:1-3 | run 2/3 (live) | E (the same smile on all three lines); H (:2 is an MC line, Nanda smiling on screen) | per-run faces; MC treatment as above | MED |
| v2-train:6 | run 2 | G/E ("Twelve stops. Second time today. You forgot. I did not." over the same wink + plaster face as run 1; a happy emote on a threat) | stare face | MED |
| v2-train:6 | run 3 | I/D ("Three fingers. Three times today." has no setup; run 1 counts stops on her fingers, run 2 says "Twelve stops", run 3 drops them) | "Third time today. Twelve stops. Same you." | MED |
| v2-train:3 | run 2/3 | I ("Two men bump into her." then an empty second line / blank stall frame in the log) | check the beat has no empty line | LOW |
| v1-train:2 | run 2/3 | E (happy closed-eye smile for "You forgot. I did not." / "Same you"); A (box covers her feet) | stare face | LOW |
| v3-train:1 | run 2/3 | G/D (line NOT varied: still "I counted them this morning" on run 2 and 3; only the window beat changes) | add vary.run to v3-train 1 | MED |
| v3-train:2 | run 3 | G/F ("three of you sit in a row. You, you, you." but the shot is a blurred cloud + ad zoom, no reflections, Nanda tiny) | an insert with 3 faint reflections in the window | HIGH |
| fail card (leave-fu) | run 1/2/3 | I ("Day 2 / Day 3. You still don't know which door." vs "Run N" on the loop lines; the other pool line says "This is 2"): three words for the counter | pick one word | LOW |
| fail card (leave-fu) | all seeds tried | all `{RUN}` tokens filled correctly (Day N, One jar... This is N); no raw `{RUN}` seen | - | - |

## Not reachable / open
- None blocked. Run >= 4 not captured (buckets are 1/2/3+; run 7 text = run 3 by design).
- The meta lines have no recorded voice takes (silent); voice not audited.
- Only leave-fu was shot for the fail card; other endings share the same card component and pool.
