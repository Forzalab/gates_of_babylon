# date-lab — Round 2 Verdict (2026-09-29)

Scored against `R1-RUBRIC.md` as-is (shared core /50 + track /50). Sources: every `shots/<id>-*.png` of the r2 variants, `R2-A-LOG.md`, `R2-B-LOG.md`, and a live run (`npm run build`, `vite preview --port 5483`, Playwright + `/opt/pw-browsers/chromium`, preview killed by PID). `node --test` on both r2 suites: 19/19 pass.

**Scored:** MENU trial 2 (menu-3-r2, menu-1-r2, menu-h1-r2 by A; menu-4-r2, menu-h2-r2 by B), CAMERA hybrid (cam-h-r2-a vs cam-h-r2-b), anim-3-r2 (crowd mode). **Not yet built (not scored):** fx-1-r2, closeup-3-r2, closeup-1-r2.

## Live-run findings (real browser, not builder shots)
| check | menu-3-r2 | menu-1-r2 | menu-h1-r2 | menu-4-r2 | menu-h2-r2 |
|---|---|---|---|---|---|
| timeout at ~8.5 s resolves to pink | PASS: label "take your time", 2 = "It's late. Stay.", her line "No rush. The kettle can wait." | PASS: "You didn't say no. So I drew for you." | PASS: same line, purple slip already retyped "It's late. Stay." | PASS: lands on the slippers insert ("Men's slippers. Already set out.") | PASS: same insert, `R · her cut` offered |
| press 2 at 4.2 s | "It's late. lea—", "Right. Goodnight. That's… fine." | "Your card came out upside down." | "It's late. lea—", same upside-down line | "You're allowed. Text me when you're home." + `R · her rewind` | already past her edit, so 2 reads as Stay and the stay ending plays (by design: leave is reachable only in the first 3 s) |
| replay, previous pick disabled, timer live | PASS: purple struck through "you already tried that", timer "4 s" running | PASS: `DRAWN you picked this. keep it.` | PASS: pink `DRAWN`, purple slip struck, "I fixed yours to match" | PASS: `LOCKED` on pink, "round 2 · replay" | PASS: `CUT` on purple, "Take two. From the door." |
| `?still` parity | PASS: t=2 s text identical to live; end text identical (`take your time ♡`, "Let me. You're slow.") | PASS | PASS | PASS | PASS |
| page errors | 0 | 0 | 0 | 0 | 0 |

- **Flicker (<=3 Hz):** both camera pieces use the same `HANDHELD` table, all sines <= 3 Hz, asserted in tests. Hold floors asserted (AF/face count >= 500 ms, dropout >= 334 ms). One literal-wording nit on the menus: typing steps are 250 ms/key (h1) and 125 ms/key (h2), tiny glyph swaps rather than flashes, but the rubric's "<=2 glyph swaps/s" text is exceeded. Not a hard-gate item; ask r3 to keep retypes at >= 334 ms/key or a whole-word swap.
- **anim-3-r2 hands-off (no pointer input at all):** t=0 "THE ROOM IS WATCHING", t=4 "GLANCES AWAY", t=8 "GETTING TIRED" + caption `[the room blinks] [something shifted]` and the platform dot 1 lit, t=16 dot 2, t=20 dot 3 with the blink caption again. So one creep step every ~6-8 s with the mouse untouched, no page errors. Mouse-move switches to "YOU ARE WATCHING/you looked away" and it falls back to room mode after idle. `?still` at 9 s: still steps (dot 1), eye pill in hard poses. **PASS.**

## MENU trial 2

| id | builder | shared /50 | menu /50 | total | R1 total | delta |
|---|---|---|---|---|---|---|
| **menu-h1-r2** "The Cup That Types" | A | 45 | 46 | **91** | new | hybrid |
| **menu-3-r2** DDLC | A | 45 | 44 | **89** | 88 | +1 |
| **menu-h2-r2** "Her Time, Her Cut" | B | 44 | 44 | **88** | new | hybrid |
| **menu-1-r2** Tarot | A | 45 | 43 | **88** | 86 | +2 |
| **menu-4-r2** Bandersnatch | B | 45 | 41 | **86** | 85 | +1 |

Shared-core receipts (common to all five unless noted): legibility 7/8 (choice text >= 45 px on every variant; smallest live text is the "NANDA is typing…" tag and h2's edit line at ~22 px, and menu-3-r2's ECU chrome, see below); RM 7/8 (live `?still` end-states equal the full-motion end-states, hard cuts held 1 s per the logs); flicker 5/6 (4/6 for h2: 125 ms/key typing plus a 375 ms glitch hold; 5/6 for h1); words 6/6; OR/pink-purple 8/8 (the literal OR between options is red `#F0243F` in menu-4-r2 and h2 in shots `menu-4-r2-1`, `menu-h2-r2-4`; pink = stay/toward her, purple = leave, never swapped); brand 4/4 (Figur/AND Line/OR-SON, tea never named); feasibility 5/6 (all CSS/SVG, B imports A's pure `integrate.js` read-only); consistency 4/4 for the tarot table and letterbox (both reuse the door/staircase art), 3/4 for menu-3-r2 (its ECU layer is a new face drawing flatter than main's bust, own log admits).

**menu-h1-r2 (91).** Illusion of control 12/12: in `menu-h1-r2-2` the purple slip reads "It's late. G|" with her arrow parked at the caret, "NANDA is typing…" under the card, and the card back already warming purple to pink, all with the spoken line off the critical path; a cold room sees the object being rewritten inside the tarot table without a caption. Timer 9/10: candle pips count down (5 dots in shot 2 have gone to 2 lit), timeout slides THE CUP to you, live line "You didn't say no. So I drew for you." Replay 8/8: `menu-h1-r2-9` puts a 380 px pin with red puncture ring, `DRAWN` stamp and her struck-through retype on the dead card, readable from the back row; she also retypes YOUR pink card while you watch (`-6`), the sharpest replay beat of the round. Crowd 8/10: cards are the biggest targets of any menu, but the slips are 40 px on a 400 px card and the "NANDA is typing…" tag is ~25 px. RM 9/10. Answers its R1 criticisms: menu-1 "caption-dependent" (yes, the cursor carries it), menu-1 "pin reads as a stray mark" (yes), menu-3 "first 3 s plain" (yes, cursor parked on the card at the deal).

**menu-3-r2 (89).** Illusion 12/12: the cold-open is the best answer to a round-1 criticism this round: `menu-3-r2-1` shows MC's own line "It's late. I should |" with her red caret, red box border and a "NANDA is typing…" tab on the box, so the room sees her rewrite the game before any menu exists (live: t=2 s text already "Nanda is editing your line."). Timer 8/10 (bar plus "take your time" relabel, but the label is small). Replay 8/8 (`-11`: struck "It's late. Goodnight." + "you already tried that" + "NANDA is typing…" + "You stayed last time. …Didn't you?"). **Crowd 7/10:** the ECU fix worked (`-6`: eyes are clean, heavy line weights, iris/pupil crisp at 3x) but the ECU layer parks the menu (timer, "Just one cup.", "Just one cup.") in the bottom-left corner and the dialogue box clips it (the timer label reads "take yo"); at that moment the presenter cannot read the options. RM 9/10. R1 criticisms: "first 3 s nothing scary" answered; "thin line at 3x ECU" answered; new defect: menu occluded during ECU.

**menu-h2-r2 (88).** Illusion 11/12: from frame 1 her red `NANDA` flag sits at the end of "Goodnight." with "✎ NANDA is editing…" under the box; at 3.0 s glitch, 3.375 s select, 3.875 s types "Stay." and `✎ NANDA edited: ~~Goodnight.~~ → Stay.` stays on screen (`menu-h2-r2-4`), a permanent record that reads as "the game was changed" without audio. Timer 10/10: the pour-into-pink timer with a NAND-gate nozzle is still the best timer mechanic of the round (pink box fills as the bar drains, live). Replay 7/8 (`-9`: purple struck with her grease-pencil `CUT`, dashed border, timer live, pink NOT disabled, which is correct since purple was the earlier pick). Crowd 7/10: purple label is a thin outline box with white text at ~34 px, dimmer than the fat pink slab; the edit line is 22 px. RM 9/10. Answers menu-4 "neutral until first timeout": yes. One design consequence to keep: leave is effectively unreachable after 3 s, which is the joke, but the presenter must be told.

**menu-1-r2 (88).** Illusion 11/12: `menu-1-r2-2` shows her sleeve and two red-nailed fingertips resting on your face-down card, your card lifts 6 px vs THE CUP 22 px on hover, and the third empty "III" slot keeps the third cup. Reads without words now. Timer 9/10. Replay 8/8 (`-10`: giant steel pin, puncture ring, `DRAWN`, red strike, "you already tried that" in script). Crowd 8/10, RM 9/10 (hard-cut table). **It is a strict subset of menu-h1-r2 (h1 = this table + her cursor)**, and A's own log calls them siblings, so the slot is redundant.

**menu-4-r2 (86).** Illusion 9/12 (3 -> 4/5 on the criterion): `menu-4-r2-1` at t=0 shows the pink box already larger (730 vs 530 px), pre-poured (30 %), a spout bending the bar down into it and the purple box squeezed; the lean is now readable before the first timeout, but it is a size/glow lean, nothing is being done to the room's control in front of us. Timer 10/10 (unchanged best-in-class). Replay 8/8 (`LOCKED`, "round 2 · replay", live). Reaction cut: `-4` is her real bust at half brightness, blank eyes, backlit; a real face, but dim and drained on a projector. Crowd 7/10, RM 8/10. The best ideas live on in h2 (same engine, pour timer, room tally `THE ROOM CHOSE PINK n OF N`).

### Trial-2 ranking and prune
**menu-h1-r2 (91) > menu-3-r2 (89) > menu-h2-r2 (88) = menu-1-r2 (88) > menu-4-r2 (86).**

**PRUNE: menu-4-r2 and menu-1-r2.**
- menu-4-r2 is lowest (86), and everything that scored in it (pour timer, room tally, pre-pour, real-face cut) is already inside menu-h2-r2, which shares its code.
- menu-1-r2 ties h2 at 88 but loses the tie-break on theme differentiation: h1 is menu-1-r2 plus her cursor, so keeping both spends two slots on one table. h2 is the only letterbox/pour timer left and the only B-flavoured object.

**3 survivors for trial 3:** menu-h1-r2 (A), menu-3-r2 (A), menu-h2-r2 (B).

**FLAG for Tony (content, not craft):** all three survivors are "she edits your text" menus, and in the demo path she also breaks the wall in cam-h and the cold-open. Film-research caps 4th-wall breaks at 2 per film. Both trial-3 hybrids below are therefore specified to move away from the visible text-edit (one is non-edit, one makes the edit diegetic on MC's phone), so the final pick is not three copies of one gag.

### Trial-3 slate (5 slots)
| slot id | builder | what |
|---|---|---|
| menu-3-r3 | A | menu-3-r2 refined: fix ECU occlusion (menu must stay full-size and above the box in the ECU shot; timer label >= 34 px "take your time"), keep cold-open rewrite |
| menu-h1-r3 | A | menu-h1-r2 refined: retype steps >= 334 ms per glyph (or whole-word swaps), restore the Figur Arcana print, her arrow rendered as a hand-drawn pointer not a UI glyph (the "mixed grammar" self-critique), slip text >= 44 px |
| menu-h2-r3 | B | menu-h2-r2 refined: purple box gets the same fat, high-contrast slab as pink (only its colour and squeeze differ), edit line >= 32 px, retype in word swaps or >= 334 ms/key, add the room tally line |
| menu-h3-r3 | B | HYBRID "Her Hold" (see spec 1) |
| menu-h4-r3 | A | HYBRID "The Draft Folder" (see spec 2) |
Balance: A = 3 (two of its own survivors + one hybrid), B = 2 (its own survivor + one hybrid).

**Hybrid spec 1 — menu-h3-r3 "Her Hold" (B; menu-h2 letterbox/pour × menu-1-r2 hand-on-card × menu-3-r2 lens gaze; NO visible text edit).** Base: menu-h2's letterbox, pre-poured pink slab and gate-nozzle pour timer. Instead of retyping "Goodnight.", her physical hand (A's `menu1` hand art, imported read-only) reaches in from the bar's right edge at frame 0 and rests two red-nailed fingertips on the purple box, holding it down (box stays squeezed and 6 px lower, her hand lifts pink 22 px on hover like menu-1-r2). Timer pours into pink. At timeout, hard cut to ECU with menu-3-r2's dedicated eye layer: pupils start on the purple box, one held cut later snap into the lens on "Not him. You." ("The one clicking." stays under the bar, options remain visible). Replay: her pin goes through the picked box (menu-1-r2 kit), `THE ROOM CHOSE PINK n OF N` from menu-4-r2 stays in the top bar. Zero glyph swaps, so it also removes the flicker nit.

**Hybrid spec 2 — menu-h4-r3 "The Draft Folder" (A; menu-h1 diegetic-object edit × menu-3-r2 cold-open × menu-h2 pour timer; the edit becomes in-world).** Table stays (candle, third card slot), but the two choices are two drafted replies on MC's phone lying face-up between the cards (A already drew the phone for cam-h-r2-a and closeup-2). Before the menu, the phone shows MC's unsent draft "go home." and "NANDA is typing…" replaces it with "stay." in her red (menu-3-r2 cold open, now diegetic: she is on his phone, one gag, no game-UI cursor). Timer: the send bar on the phone pours into the pink draft (h2), the candle only marks pips. Purple = reply "goodnight" bounces with "Not delivered" and her pin in the screen; timeout = "Delivered ♡, read 12:00". Replay: the picked draft is greyed with "Message already sent" and the phone is nailed to the cloth by her pin. Chosen because it keeps h1's object-edit read (the strongest illusion-of-control image) while making the wall-break diegetic.

## CAMERA hybrid: cam-h-r2-a vs cam-h-r2-b

| | shared /50 | cam /50 | total |
|---|---|---|---|
| **cam-h-r2-a** (A) | 45 | 48 | **93** (R1 parents: cam-3 87, cam-5 85) |
| **cam-h-r2-b** (B) | 44 | 46 | **90** |

**cam-h-r2-a receipts.** Cinema grammar 5/5: `cam-h-r2-a-03` (D.ZOOM 90.0x, red iris filling frame, AF box "FACE 1" on the umeboshi that is not a face) -> `-04` (201x, macro of her red iris with catchlights, readable blurred at the back of a room) -> `-07` (D.ZOOM 2.2x, the train is a poster in the underpass with her face on the poster ad, AF box on it): a real nested pull-back with one continuous readout, the cleverest use of "camcorder automation motivates the Kon slip". Motivated 5/5: AF hunting then locking, the zoom pushing by itself, AF dropping the poster and jumping to the tunnel. School 5/5: this is Kon match-cutting inside Ju-On's device. Horror 4/5: the count to 12 on an empty floor (`-11`, D.ZOOM 1.8x, FACES: 7, Face 4/5/6 boxes on nothing, rolled 86 deg) is strong, but the payoff is her phone ("Rewind it. I'm on the train.", `-13`), a joke beat more than a scare, and the tunnel silhouette is big and flat. Differentiation 5/5. RM 8/10: `cam-h-r2-a-rm-her-ad` is a clean hard-cut frame with her real face in the train ad. Shared: uses real Nanda bust art (consistency), 32.5 s runtime.

**cam-h-r2-b receipts.** Horror 5/5: `cam-h-r2-b-t37.75` (D.ZOOM 2.4x, FACE 12 red box on her at full frame with IR eyeshine, "Twelve. Keep filming.") is the round's single scariest frame, and it IS the opening frame (`-t00.00`, rolled face, same size and roll, tested seam), so the loop is invisible. Route coverage: train reflection ("Someone in the window. Nobody in the seat."), platform with `D.ZOOM 4.8x` at 1:1 as the tell (`-t10.55`, red OR in the NEXT sign), underpass poster reveal (`-t16.80`, "This one's me."), apartment night-shot match cut, stairs (`-t28.60`, red `FACE 3`, eyeshine) - the whole demo route in 37.8 s. Grammar 5/5, motivated 5/5. School 4/5: Ju-On reads perfectly, the Kon slip is a little less obvious than A's iris rhyme. Differentiation 4/5. Shared: she is a flat silhouette everywhere (own log), the "SOUND: click to start" pill sits on the top-right OSD corner, and 37.8 s is near the 40 s cap.

**WINNER: cam-h-r2-a (93 vs 90).** It wins on the criteria that define the hybrid (motivated Kon logic, honest D.ZOOM continuity, real face, existing-art consistency); B wins horror and route coverage but not by enough.

**Graft from the loser (round 3 for A):** B's ending. Replace the phone push with B's final beat: after the floor count, the camera is nudged toward the door and FACE 12 is HER at full frame with IR eyeshine (draw it from A's `EyesEcu` layer, not a silhouette), line "Twelve. Keep filming." (5 words), and close the loop the way B does: that face, same screen spot/size/roll, is the "face in the window" reflection of the opening train (B's "Someone in the window. Nobody in the seat."). Keep A's D.ZOOM readout continuous through it. Secondary graft: B's apartment night-shot window (her as the one lit silhouette) as a 4 s beat between tunnel and floor, keeping A under 40 s.

## anim-3-r2 (B, crowd mode): 88 (R1 anim-3: 83)

Shared 43/50, anim 45/50. 8 fps/holds 11/12 (eye poses are stepped 1.5 s holds, ink at stage change is a hard cut). Life vs noise 12/13 (the top pill is big, high-contrast and away from the dialogue box; `anim-3-r2-2` shows "THE ROOM IS WATCHING ●●●●" beside the dialogue "The sign says NEXT: this OR that. It never picks." with the sign's OR red). School 12/13 (`anim-3-r2-5` the genkan re-inked to paper, hatch and pen line with the red slipper masked in is a real Ito look; R1 "stacked overlays" criticism answered; cost: the day scenes go mostly paper). Differentiation 10/12 (unchanged structurally, but the hands-off tour is now a different piece for a projector). **The blocking item is closed:** live hands-off run above passes with zero pointer events. Remaining nit: the eye pill is UI chrome, not in-world.

## Theme-collision checks (round 2)
- menu-1-r2 vs menu-h1-r2: near-identical stills (same table, pin, stamp); collision resolved by the prune.
- menu-3-r2 / menu-h1-r2 / menu-h2-r2: same "NANDA is typing…" gag, three skins; a blind test on the timer-drain frame tells them apart, but the gag itself repeats (see the 4th-wall flag).
- cam-h-r2-a vs cam-h-r2-b: shared OSD, distinguishable at a glance (A: white/red, macro iris and nested posters; B: night-shot green silhouettes).
