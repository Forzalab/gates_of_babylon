# REPORT-A (shop route, seed=1, 1920x1080). Facts from the shots; no code touched.
Lenses: 1 teacher, 2 dating-sim norms, 3 yandere craft, 4 Your-Name look, 5 common sense/consistency, 6 impeccable.
Shot numbers = ux-pass/A/NN-*.png (see ROUTE-A.md). Egg shots = A/egg/, reduced motion = A/rm/.

## Top 5 worst
1. P0 (5,1) Four different places use the SAME crosswalk background: park 1:00 PM (15), shop street 2:00 PM (23), rain 5:30 PM "heavy rain" (43), her street 6:00 PM (50). No trees, no shops, no rain, no wet road. The stamps are the only proof of place.
2. P0 (5) Egg verdict below: the bento pick is not on screen when you pick it, and the close-up is identical for both picks.
3. P0 (1,5) Rooftop beats 1-9 (02-13) show a shop alley (kanji shop signs), not a rooftop, under a "SCHOOL ROOFTOP" stamp. The only rooftop art is the goal card (01).
4. P1 (5,4) Curry house 3:00 PM (29-35) is drawn as XOR Coffee with a menu board "drip/latte/or/xor" and a wall clock at about 7:00; the station at 4:30 PM (37) is the same coffee shop; train windows at 4:30-5:20 show a bright sunny sky while the line says "Rain hits the window" (41).
5. P1 (2,3) All-heart run (one broken-heart pick at 17) ends in "GAME OVER, She does not love you enough, 75%" (75-76) right after the horror payoff line. The steeped ending reads as a fail; the teacher cannot tell it is the "good bad" ending. The goal card (01) promised only "+3 she liked it / -2 she did not", the pick cost -9 with a "FURIOUS -5" card (18).

## Egg verdict (Tony's bug)
A bento IS drawn, but only on rooftop beat 3 (close-up, shots 06 and egg/*-04): a lunch box with rice + red umeboshi dot on the left and yellow layered tamagoyaki + green on the right. Problems:
- Beat 2 (the pick, 03 / egg/*-02) shows NO bento or egg; the choice text names food that is not on screen. Beat 5-6 ("Sweet, ne? I rolled it myself.") also has no food; the bg is a giant blurred Nanda face + huge grey heart bubble.
- The close-up is the SAME picture for umeboshi and tamagoyaki (compare egg/tama-04 and egg/ume-04). The box holds both items either way; only the caption changes ("Tamagoyaki, rolled in gold layers" vs "One red umeboshi on white rice"). Rubric A7 (pick visibly changes what we see) fails.
- The close-up is blurred by the focus filter and Nanda's sprite sits on top of the box, covering the food.
- Later echoes: the cup scene says "Tamagoyaki on its saucer" (66) but no egg is drawn; "I made tamagoyaki" (64) is the same regardless of the bento pick (only tested with tamagoyaki).
Fix direction (not done): draw the picked item alone in the close-up, show it on beat 2, hide Nanda behind close-ups, and put a small tamagoyaki on the cup saucer.

## All issues (shot · lens · issue · severity)
01 · 2,5 · Goal card says goal 100% and legend "+3 / -2"; real deltas go to -9 and "CRITICAL +5"/"FURIOUS -5" cards. Rules on the card do not match what happens · P1
01 · 2 · Boot is direct to the goal card; there is no title or "chapter" frame before it (Logic Figur click is upstream). Fine, but no place stamp on the goal card · P2
02 · 1 · Place/time stamp appears twice at once: banner "SCHOOL ROOFTOP · 12:00 NOON" plus the same words in the dialogue box · P2
02-05 · 5 · Bg is a shop alley, stamp says rooftop (see Top 3) · P0
03 · 2 · Emote bubble (heart) covers the end of the time stamp "12:00 NO" · P2
03 · 2 · Unlabelled countdown bar with number "11"/"12" across the choices; nothing says it is a timer · P1
03,09,17,20,30,51,68 · 2 · Choice chips show "+3/+1/-3" on the first choice beat but "??" on later ones with no explanation; the player cannot weigh picks · P1
04,10,14,21 · 2 · The "+3 She liked that" pop is crossed by falling hearts (text hard to read), and covers the stamp text · P2
06,07,08,09 · 5 · Close-up plane is blurred and Nanda sprite overlaps the item; beats 07-09 show only a giant blurred face and grey heart bubble, the scene looks broken · P1
09-11 · 3 · Rooftop is 12 beats of pure sweet; the only crack is "She doesn't eat hers" (07). Escalation starts late · P2
10 · 4 · "CRITICAL +5" card swaps the whole scene for a flat pink bubble sky; lens/light discontinuity, then back to a dusky alley · P2
12,13 · 1 · "f-OR-ecast" / "fORever" letter gags read as typos to a literal reader; the "OR" glyph is never explained · P1
15 · 5 · "PARK · 1:00 PM ... cherry trees, petals" over a crosswalk (see Top 1) · P0
16,24,26 · 5 · Nanda sprite stands in front of every insert card (feet, basket, nails), hiding the object the line is about · P1
18 · 3 · Gacha penalty FX (lightning, "FURIOUS -5", angry Nanda) lines up with mood, but her line is "Okay. My hand can wait." (calm) and the pop shows -9 vs card -5 · P1
18 · 3 · Good craft: FX goes from sweet to horror in one beat, no explanation. Keep · P2
20 · 1 · Choice "One job before lunch" but she already said lunch is at the curry house later; meaning of "before lunch" at 1 PM is fine, the "Return her book" pick is never seen · P2
22,28,35,42,49,57,62 · 2 · Single-button "Walk with her / Walk to lunch / Step off the train..." is drawn like a choice with no chip but has no alternative; also NEXT is missing on those beats (only the button) · P2
23 · 5 · SHOP STREET stamp with no shops (see Top 1) · P0
25 · 4 · Shop lady is a flat black silhouette in a warm orange street; palette jumps from cool blue to orange inside one scene · P2
25,27 · 3 · Good craft: "The shop lady smiles at you. Nanda sees it." then "Do not look at her. Look at me." lands without explanation · P2
29-35 · 5 · Curry house drawn as coffee shop; clock about 7:00 under stamp 3:00 PM (see Top 4) · P1
32 · 5 · Butter chicken close-up is fine, but Nanda sprite again covers half of the plate · P2
33-35 · 3 · "Feed me with your hand", "keeps the napkin for her collection" are strong yandere beats; keep · P2
36 · 1 · Narration leaks the shot direction: "Now: a round clock. 4:30 PM." No clock is drawn, the frame is a dark circle with a station and a "Hot NAN(DA)" ad · P1
37 · 5 · STATION 4:30 PM shown as XOR Coffee · P1
38 · 1 · Four-line, 31-word speech with in-joke ("curly-haired guy", "gringo wearing a cap", "eternal bond with my lover"), addressed to strangers; too long for the box and unclear who "you all" is · P1
40,41,42 · 4 · Windows show a bright noon sky while it is 4:30-5:20 and raining; sky never moves toward evening until the street · P1
41 · 1 · Ad "NOT Sweet SOUR!" fills the screen, mixes English and kanji, nothing points to Nanda or the player · P2
43 · 5 · "Heavy rain. The signs glow" over a sunny crosswalk · P0
44 · 2 · Best choice screen of the run: 3 clear buttons, +4/+1/-4 chips, DEFAULT tag · P2
45,46 · 5 · Same frame twice (pop then settled); the +4 pop also lands on the "ROOF" trail dot · P2
50 · 5 · "Wet road. Low sun." over the same dry, hazy crosswalk (see Top 1) · P0
51-53 · 5 · Rain umbrella card is still on screen at 6:00 PM after "the rain stops" (prop persistence) · P1
54 · 4 · Orange sky line "then dark blue" is correct for the first time; the bg is the only warm-light frame of the run. Good · P2
55,56 · 3 · "Red marks on her palm", "I held it since noon" is the best crack of the run · P2
58 · 5 · HER HOME 7:05 PM shown as the shop alley with no interior; the entrance (59) finally shows shoes and slippers · P1
59-62 · 5 · Three chairs, three cups (61) shows two blue slippers/one chair; the kitchen card (62) is a "tea" label card · P2
63 · 5 · "Three cups" but only two cups are drawn on the table · P1
64 · 5 · "I made tamagoyaki" with no egg drawn, and the pick from rooftop is not honoured in the text when umeboshi was chosen (not tested here; flag echo) · P1
66 · 5 · "Tamagoyaki on its saucer" with no egg on any saucer · P1
68 · 2 · Choices "Drink / Hold the cup / Stand up" show "??" and the bar reads 12; nothing says Stand up leads to the basement route · P2
69,70 · 3 · Gacha FX for drink is a plain +3 pop while the face turns flat; nice reveal, but the mood change (face) is not flagged by any FX · P2
70 · 1 · First steeped line is the single word "OR" in a black box; teacher asks "why does it say OR?" · P1
73 · 1 · Japanese line "いつまでも一緒。…FORever. ね？" has no translation on screen (the voice is the only cue) · P1
74 · 3 · "Your cup, empty. Hers, full. She never drank." lands hard without explanation. Keep · P2
75,76 · 2,3 · GAME OVER card with a stitched-mouth Nanda after a 75% run: an ending that is the horror payoff is labelled a loss; no "STEEPED" ending name on the card · P1
75,76 · 2 · TRY AGAIN is the only button; no ending title or run number visible · P2
all · 2 · Top-right chips (LOGIC / fullscreen / voice / skip) are about 12 px on a 1920 projector and low contrast over art; skip, pause and mute were not exercised in this pass · P1
all · 6 · Impeccable on 3 key frames (below): low contrast 1.8:1 on white-on-pink text, layout-transition on width, clipped overflow, 1.1:1 kanji sign · P1
rm/01-03 · 5 · Reduced motion: same frames appear, no pan or bounce; the timer bar still shows and the choice beat reads the same; forward motion carried by text only. No fault found in 3 frames · P2
egg/* · 5 · See egg verdict · P0

## Impeccable (npx impeccable detect --viewport 1920x1080, --no-advisory)
- rooftop beat 2 (`?scene=rooftop&beat=2`, shot 03): 5 findings: layout-transition (transition: width, the love bar), low-contrast 1.8:1 white on #ffa6d6 (chips, pink buttons) x2, ai-color-palette purple gradient, layout-transition x2.
- v2-park beat 2 (`?scene=v2-park&beat=2`, shot 17): 9 findings: same four plus clipped-overflow-container on div.stage.focus, div.art.shot.insert, div.shot-cam.shot-blur, and pixel contrast 1.1:1 on the "24時間" sign under the blur.
- cup beat 1 (`?scene=cup&beat=1`, shot 64): 5 findings: same as rooftop.
Judge: purple gradient = the "Take neither" button, on-brand. White on #ffa6d6 (1.8:1) is real and sits on the pink choice buttons and chips; fix with darker text.

## Counts
Route shots 76 in ux-pass/A + 16 in A/egg + 3 in A/rm = 95. Console errors: 0 in all three runs.
