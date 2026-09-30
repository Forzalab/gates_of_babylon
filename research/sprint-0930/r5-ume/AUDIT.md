# R5 UMEBOSHI path audit (before)

Shots: `before/` (96 PNGs + log.json). Re-shot fresh with `r5-ume/shoot.mjs ume` (a copy of `paths/shoot.mjs` on port 5220, writing into `before/`), seed=1, 1920x1080, vite build + preview.
Criteria: A physics · B common sense · C render/layer order · D coherence · E emotes · F figure sizing · G line↔visual · H sprite sanity · I UI text.
**GLOBAL** items (G1–G8 below) are on almost every beat. They are NOT repeated in each row. A row lists only what is specific to that beat. "—" = nothing beyond the globals.

## Per beat

| file | scene/beat | line (first 50) | fails | fix | pri |
|---|---|---|---|---|---|
| 001-rooftop-0-card | rooftop/0 card | CARD: GOAL Make Nanda like you | I (big pill hint under the card) | G2 | LOW |
| 002-rooftop-1 | rooftop/1 | (title SCHOOL ROOFTOP 12:00) | — | — | LOW |
| 003-rooftop-2 | rooftop/2 | Her shoes by the fence. Toes pointed at you. | G (a medium shot of all of her, no shoes, no fence close-up); A (the box hides her feet) | a low insert: 2 loafers by the fence mesh, toes to camera, her legs cut at the knee | HIGH |
| 004-rooftop-3 | rooftop/3 choice | I made two. One's for you. Don't look at me li | A/C (her head floats above the bento card; the card sits mid-air on the sky bg); E (the same wink as 003) | hold the bento in 2 cel hands in front of her body; a shy/blush face | MED |
| 005-rooftop-3-react | rooftop/3 react | Sour. Brave. I'll remember you like sour. | A (the box covers her feet, she floats) | G3 | LOW |
| 006-rooftop-4 | rooftop/4 | Close-up. The lid lifts. One red umeboshi on wh | D (a purple insert bg, not the rooftop); G (no lid, no lifting) | the rooftop bg blurred behind + a lid cel tilted up in her hand | MED |
| 007-rooftop-5 | rooftop/5 | (no line: the chopsticks lift the umeboshi) | I (a beat with no text, so it reads like a stall) | add "You pick it up." | LOW |
| 008-rooftop-6 | rooftop/6 | MC: Itadakimasu. | A/F (a giant umeboshi floats in the sky; Nanda hangs mid-air behind it, a mixed scale); C (a near-lens prop over a wide shot) | a POV: the chopsticks + the umeboshi at the bottom of the frame, Nanda seated on the bench behind, her feet on the floor | HIGH |
| 009-rooftop-7 | rooftop/7 | She doesn't eat hers. She watches you chew. | G (an eyes ECU is fine, but her own bento isn't shown) | add her closed bento at the bottom edge | LOW |
| 010-rooftop-8-choice | rooftop/8 choice | Sour. Hm. You like things that bite? | I ("♥ ??" chips + "?? = hidden, find out" read as broken) | show them as "♥ ?" with a tooltip, or a lock icon | MED |
| 011-rooftop-8-react | rooftop/8 react | …Obviously. Don't stare. | D (a pink void insert bg); I ("CRITICAL" tag is clipped under the voice/skip buttons); E (a >< face for a tsundere "don't stare"; wants a blush+look-away) | the rooftop bg + a blush look-away face; move CRITICAL below y=140, clear of the right HUD column | MED |
| 012-rooftop-10-react | rooftop/10 react | MC: Technically, rain wasn't f-OR-ecast. | G/B (a clear sunny sky; no rain cue at all) | a cloud bank + the first drops on the rooftop; or cut the line | MED |
| 013-rooftop-11-choice | rooftop/11 choice | Stay fORever? The rain can wait. | B (still no rain); F (a close-up that is a different size from 010's close-up) | lock one close-up scale | LOW |
| 014-rooftop-11-react | rooftop/11 react | A minute. Then another. Then the whole day. | D (a pink void bg + a random flower cel); I (CRITICAL clipped again); F (a huge Nanda, feet on a void) | the rooftop bg; drop the flower | MED |
| 015-v2-park-0 | v2-park/0 | PARK · 1:00 PM. A path under cherry trees. Pet | C (an establishing shot, yet the whole bg is blurred); A (the box covers her feet) | G4 (the sandwich for the wide shots: a crisp back trace + mid blur); G3 | MED |
| 016-v2-park-1 | v2-park/1 | Close-up. Her feet. Two small steps for each of | Tony item 4: REMOVE; G (full-body Nanda in front of an insert card) | delete the beat | HIGH |
| 017-v2-park-2-choice | v2-park/2 choice | Hold my hand. My hand is shaking. Only yours ca | B/D (a blurred insert card bg, not the park); G/E (Nanda is HIDDEN behind the box, only her bubble shows; no hand) | Tony item 5: the real park bg + Nanda reaching a foreshortened hand cel to the viewer | HIGH |
| 018-v2-park-2-react | v2-park/2 react | It stopped. See? It only needed you. | B/D (the same insert card); G (no held hands) | the park bg + the 2 hands joined (a cel insert, 5 fingers) | HIGH |
| 019-v2-park-3 | v2-park/3 | Her thumb is on your wrist. She is counting you | G (no wrist, no thumb: only her standing); E (the wink again) | an ECU: your wrist + her thumb on the pulse; a counting face | HIGH |
| 020-v2-park-4-choice | v2-park/4 choice | One job before lunch. My groceries, or my libra | A (she floats at the top, the box under her, no floor) | G3; hold a grocery list / a book as emotive props | MED |
| 021-v2-park-4-react | v2-park/4 react | Groceries. For our dinner. | D (a DOUBLE: a huge blurred ghost Nanda behind the small one); I (a heart covers the NANDA tag) | remove the ghost layer; keep the hearts off the name tag | HIGH |
| 022-v2-park-5 | v2-park/5 | Two pairs of shoes walk out of the park. Hers s | G (an insert card with shoes + a full Nanda on top; a copy of 016) | a low tracking shot: 2 pairs of shoes on the park path, no full-body Nanda | MED |
| 023-v2-shop-0 | v2-shop/0 | SHOP STREET · 2:00 PM. Sunny. Vending machines | G ("pulls you to a shop": no pull); E (the wink again) | her hand tugging your sleeve at the frame edge | MED |
| 024-v2-shop-1 | v2-shop/1 | The shop doors slide open. A little tune plays. | G (the doors are closed); E (the wink again) | doors half open + a ♪ glyph | LOW |
| 025-v2-shop-2 | v2-shop/2 | Carrots, eggs, three cups, and you. My whole li | — (good: the emotive list prop); H only | — | LOW |
| 026-v2-shop-3 | v2-shop/3 | Your hands push the cart. Her hand slides on to | A/G (her pink sleeve reaches in from the right but her hand isn't ON yours; your hands are small mittens) | her 5-finger hand overlapping your right hand on the bar | MED |
| 027-v2-shop-4 | v2-shop/4 (minigame) | (the list game) | — | — | LOW |
| 028-v2-shop-4-react | v2-shop/4 react | She is done waiting… Ehehe. Try again, ne? | E (a −2 "she did not like that" with a sparkle wink: it contradicts); D (a painted shelf bg, another family) | a pout/puff face on a −; the same shop trace | MED |
| 029-v2-shop-5 | v2-shop/5 | Close-up. Her hand puts one cup in the basket. | G (NO hand in the shot; the basket only) | her hand cel placing a cup, the fingers behind the cup rim | HIGH |
| 030-v2-shop-6 | v2-shop/6 | You walk past the sweets. She does not look at | E (the wink again; the line wants a stare); A (floats) | a wide-eyed stare face at the camera | MED |
| 031-v2-shop-7 | v2-shop/7 | Checkout. Lane 2 is open. You put the basket on | G (no basket on the counter); E (the wink again) | the basket cel on the counter | MED |
| 032-v2-shop-8 | v2-shop/8 | The shop lady smiles at you. Nanda sees it. | E (a >< face; it wants the jealous vein/puff) | the anger vein + a side-eye | MED |
| 033-v2-shop-9 | v2-shop/9 | Close-up. Her nails press into the basket handle | A (the hand floats top-right, not gripping the handle); H (the wrist is cut) | the fingers wrapped around the handle, the handle over the finger pads | HIGH |
| 034-v2-shop-10 | v2-shop/10 | She pulls you to the self-checkout. No shop lad | G (no pull); E (the wink again) | a sleeve-tug cel | MED |
| 035-v2-shop-11 | v2-shop/11 | Do not look at her. Look at me. I bought you a | E (a heart bubble + the wink on a jealous order) | the possessive stare, a stage-2 face; hold the cup | MED |
| 036-v2-shop-12 | v2-shop/12 | The shop bell rings. You carry the bags. She ho | A (a disembodied hand grabs a sleeve at top-right; Nanda floats full-body); B (no bags) | a medium: the bags in your hand at the frame edge + her hand on your sleeve | HIGH |
| 037-v2-town-0 | v2-town/0 | Big signs. Big screens. She holds your hand. | G (no Nanda, no hand); B (the bags from 036 are gone) | a joined-hands cel at the bottom + the bags | MED |
| 038-v2-town-1 | v2-town/1 | We are going out for curry. Just you and me. | F/A (only her head above the box, sunk) | G3; a medium shot | MED |
| 039-v2-town-2 | v2-town/2 | So many people. I will hold your arm. Tight. | G (no crowd, no arm hold) | crowd silhouettes (the train crowd cel) + her arm hooked on yours | HIGH |
| 040-v2-town-3 | v2-town/3 | Wow! A giant oshi board. Oshi means "my favorit | F/I (Nanda half hidden behind the box; the bubble covers her face) | lift her above the box; a wow face | MED |
| 041-v2-town-4 | v2-town/4 | But not one of them is as cute as me. Right? | A (her feet on the box edge) | G3 | LOW |
| 042-v2-curry-0 | v2-curry/0 | It is 2:55 PM. Two curry shops stand side by si | — | — | LOW |
| 043-v2-curry-1-choice | v2-curry/1 choice | I am hungry. You pick my lunch. Pick the right | E (the wink again); I (?? chips) | a hungry face (drool/tummy); G5 | MED |
| 044-v2-curry-1-react | v2-curry/1 react | With naan! You know me. | A (floats) | G3 | LOW |
| 045-v2-curry-2 | v2-curry/2 | She opens the glass door. A bell rings. | G (no her, no hand on the door) | her hand on the door handle | LOW |
| 046-v2-curry-3 | v2-curry/3 | We go inside NAND HOUSE. A TV plays a dance vid | — | — | LOW |
| 047-v2-curry-4 | v2-curry/4 | We sit at a table by the window. She sits on yo | A/F (a tiny Nanda floats above the booth, not seated); C (a pink glow halo = pasted); G (no knee) | seat her in the booth, the table edge as BOOK over her legs; a knee-touch insert | HIGH |
| 048-v2-curry-5 | v2-curry/5 | Lunch comes on a steel tray. Butter chicken, gr | — (good) | — | LOW |
| 049-v2-curry-6 | v2-curry/6 | She tears off a piece of naan with two fingers. | A (Tony item 1: the pinch hand is IN FRONT of the piece, the fingers float) | variants/naan-V1 / V2 | HIGH |
| 050-v2-curry-7 | v2-curry/7 | She pours more butter sauce. It is thick, orang | A (the sauce boat floats; no hand holds it) | her hand on the boat handle | MED |
| 051-v2-curry-8 | v2-curry/8 | She dips the naan in the sauce. The sauce drips | A (check: the naan sits over the fingers, OK, but the thumb is unclear) | apply the item-1 pick here too | LOW |
| 052-v2-curry-9 | v2-curry/9 | Feed me. With your hand. Not the spoon. Your ha | I (the NANDA tag overlaps your hand) | shift the tag or the hand | LOW |
| 053-v2-curry-10 | v2-curry/10 | She eats the naan from your fingers. She looks | — | — | LOW |
| 054-v2-curry-11 | v2-curry/11 | She pushes her mango lassi to you. It has only | G (no push, no hand) | her fingertips on the glass base | LOW |
| 055-v2-curry-12 | v2-curry/12 | She wipes your fingers with her napkin. Then sh | — (ok) | — | LOW |
| 056-v2-curry-13 | v2-curry/13 | We walk out to the street. It is 3:40 PM. | A (floats: her feet above the street, no shadow) | G3 | MED |
| 057-v2-train-0 | v2-train/0 | 4:30 PM. Lunch is done. She takes your hand. 'N | D (a BLACK void bg + a stray blue hat on her head); G (no hand) | the station entrance trace; drop the hat | HIGH |
| 058-v2-train-1 | v2-train/1 | STATION · 4:30 PM. The station is full. Everyon | — (a good wide) | — | LOW |
| 059-v2-train-2 | v2-train/2 | She buys a plum drink. Sour. 'Like the one you | A (Nanda stands INSIDE the vending grid) | put her in front of the machine with the can in her hand | MED |
| 060-v2-train-3 | v2-train/3 | Two men bump her bag. They laugh. | A/C (Tony item 2: floaty, the whole bg blurred); G (no bag, no bump) | G6 the focus plane (variants/focus-*) + a bag cel + a bump pose | HIGH |
| 061-v2-train-4 | v2-train/4 | Hey, you. Wavy hair. And you. Hat boy, the grin | B (the black eye appears here with no hit shown; 060 had none) | show the hit (a POW panel) or start the eye at 062 | MED |
| 062-v2-train-5 | v2-train/5 | She taps her card. Beep. Then she taps it again | F (she sinks behind the box) | a hand + card on the reader insert | MED |
| 063-v2-train-6 | v2-train/6 | 12 stops to her home. She counts them on her fi | G (no fingers counting); E (the wink again) | a hand cel with the fingers up (5-finger) | MED |
| 064-v2-train-7 | v2-train/7 | 5:20 PM. It's raining. She lays her head on you | B (no rain on the train windows); G (no MC shoulder) | rain streaks on the glass; your shoulder cel under her head | MED |
| 065-v2-train-8 | v2-train/8 | Stop 12. Her stop. She wakes up fast. She pulls | A/C (floaty on the platform, item 2); G (no sleeve pull) | G6 + a sleeve-tug | HIGH |
| 066-v2-rain-0 | v2-rain/0 | BIG CROSSING · 5:30 PM. Heavy rain. The signs g | A (the box covers her feet) | G3 | LOW |
| 067-v2-rain-1-choice | v2-rain/1 choice | Share my umbrella. It is small. Our arms have t | — (the umbrella over her head, good) | — | LOW |
| 068-v2-rain-1-react | v2-rain/1 react | Our arms touch. Now I am warm. | G (no arms touching) | your sleeve at the frame edge touching hers | LOW |
| 069-v2-rain-2 | v2-rain/2 | Close-up. Her shoes are wet. She walks in the p | G (NOT a close-up of shoes: upper-body Nanda) | a shoes-in-puddle insert with splash rings | HIGH |
| 070-v2-rain-3 | v2-rain/3 | She looks up at you. Then down. Then up again. | E (the wink again; wants a shy up-glance) | the look-up face | MED |
| 071-v2-rain-4 | v2-rain/4 | The rain stops. Two pairs of wet shoes walk tow | B (it is still raining hard); G (no shoes) | stop the rain overlay; a wet-shoes shot | HIGH |
| 072-v2-street-0 | v2-street/0 | HER STREET · 6:00 PM. Wet road. Low sun. Long s | B (a grey overcast, no low sun, no long shadows) | a warm grade + long cel shadows | MED |
| 073-v2-street-1-choice | v2-street/1 choice | Take small steps. Small steps make the day long | D (an insert card with a rain glyph, a blurred bg) | the street bg | MED |
| 074-v2-street-1-react | v2-street/1 react | Smaller. Smaller. There. We are almost still. | D (the insert card again) | the street bg + shoes | MED |
| 075-v2-street-2 | v2-street/2 | 7:00 PM. The sky goes orange, then dark blue. Y | E (the wink again) | a content, tired face | LOW |
| 076-v2-street-3 | v2-street/3 | Close-up. Her house key. Her fist opens. Red ma | G (a tiny key on an insert card above her head; no fist, no palm marks) | an ECU: the open palm with red marks + the key | HIGH |
| 077-v2-street-4 | v2-street/4 | I held it since noon. So I would be ready. For | D (a blurred brown void bg) | the street bg | MED |
| 078-v2-street-5 | v2-street/5 | Close-up. The key turns. Click. Door 12 opens. | G (a full-body Nanda floats on the street; no key, no lock) | an ECU: the key in the lock, door 12 | HIGH |
| 079-v2-home-0 | v2-home/0 | Very clean. Her shoes in a perfect line. | G (the shoes aren't in the frame) | shoes in a line at the genkan | MED |
| 080-v2-home-1 | v2-home/1 | She kneels. She puts slippers on your feet. You | G (she stands, not kneels; no slippers on feet) | a kneel pose + slippers at your feet | HIGH |
| 081-v2-home-2 | v2-home/2 | Every choice you made today led here. I planned | E (a heart + a wink on a creepy reveal line) | the OR-glasses face / a dark stare | MED |
| 082-v2-home-3 | v2-home/3 | HER KITCHEN · 7:10 PM. Three chairs. Three cups | G (1 cup visible, no 3 chairs) | a wide of the table with 3 chairs + 3 cups | MED |
| 083-v2-home-4 | v2-home/4 | Her hand on your back. She sits you in the midd | B (an insert card with a TEA CUP; the wrong prop); G (no hand, no chair) | the kitchen bg + her hand pushing, the middle chair | HIGH |
| 084-cup-0 | cup/0 | The tea is poured. Three cups. | A (she seems to stand on the table) | put her behind the table, the table as BOOK | MED |
| 085-cup-1-choice | cup/1 choice | I bought umeboshi. For no reason. Eat. | A (floats) | G3 | LOW |
| 086-cup-1-react | cup/1 react | See? You needed me. | E (the wink again) | a smug face | LOW |
| 087-cup-2 | cup/2 | Third teacup. Nobody poured it. One umeboshi on | G (not a close-up of the 3rd cup) | a cup + saucer insert | MED |
| 088-cup-3 | cup/3 | MC: Who's the third cup for? | — | — | LOW |
| 089-cup-4-choice | cup/4 choice | For Input B. Silly. It's always three of us. | I (?? chips) | G5 | LOW |
| 090-cup-4-react | cup/4 react | Drink. It's warm. It makes the thinking stop. | — | — | LOW |
| 091-steeped-0 | steeped/0 | Rest. I'll do the remembering. | E (the OR face, same for 091–093) | vary: a soft smile / a dead stare / a head tilt | MED |
| 092-steeped-1 | steeped/1 | Bitter cup, sour hour. Every hour is ours. | E (the same face) | see 091 | MED |
| 093-steeped-2 | steeped/2 | いつまでも一緒。…FORever. ね？ | E (the same face) | see 091 | MED |
| 094-steeped-3 | steeped/3 | Close-up. Your cup, empty. Hers, full. She neve | G (an insert card, Nanda in front of the cups) | a cup-pair ECU, no Nanda | MED |
| 095-steeped-4-end | steeped/4 end | END: YOU WIN 100% She loves you | — | — | LOW |
| 096-END-settled | end | (settled) | — | — | LOW |

## GLOBAL (fix once, every beat inherits)
- **G1 THE KNIFE (H):** the white curved side-pony (`art/nanda.js` PONYB, l.15/273) reads as a blade on EVERY Nanda beat, most at thumbnail size (058, 066, 095). The fix is in `variants/knife-sidepony-A-B.png`: A = a rounded 3-lock tuft + a scrunchie, B = drop the pony and use a ribbon bow. Note that A's scrunchie is mostly hidden behind the NOT bubble, so it needs to sit lower (y≈72) to show.
- **G2 THE HINT = A BUTTON (I):** "Click anywhere to continue" (`main.jsx:348` .db-hint, `beta.css:358`) is a dark pill on every beat (and huge on 001). Make it plain subtitle text with a thin dark outline/shadow and no bg, dimmer. It applies to every similar hint.
- **G3 THE BOX EATS HER FEET (A/F/I):** on ~45 beats, the dialogue box covers her feet/legs, so she floats with no floor contact (003, 005, 015, 020, 023, 024, 030, 031, 034, 035, 038, 040, 066, 070, 075, 079–090…). Fix: in medium shots raise her so the feet + shadow sit above the box top (y≈620), or frame her as a deliberate knee-up medium shot with a BOOK cel at the box line.
- **G4 WIDE SHOTS BLURRED (C):** the establishing shots (015, 066, 072, 079) blur the entire trace. Apply the SANDWICH: a crisp back trace, a mid blur, crisp front signage cels.
- **G5 "??" CHIPS (I):** "♥ ??" on the hidden choices + "?? = hidden, find out" read as broken text.
- **G6 THE FOCUS PLANE (A/C):** when a standing figure is over a blurred bg, she floats (060, 065, 056, 036, 047, 078). See `variants/focus-V1-ellipse-*` / `focus-V2-band-*`. A stronger contact shadow is needed with either one.
- **G7 THE WINK FACE (E):** the same wink face on ~20 beats (003, 004, 015, 016, 019, 020, 022–024, 030, 031, 034, 035, 043, 063, 070, 075, 079, 080, 086). It needs an emote-per-beat table keyed to the line's emotion.
- **G8 INSERT CARDS (B/D):** the beige dashed "insert card" on a blurred bg (006, 016–018, 022, 073, 074, 076, 083, 094) replaces the real scene bg and usually shows the wrong/tiny prop. Replace each with a real traced close-up or the scene bg + a prop cel.
- **G9 THE PINK GLOW HALO (C):** Nanda's pink outer glow (047, 060, 065) makes her read pasted-on, not lit by the scene. Drop it or tint it per scene.
- **G10 MISSING HAND SHOTS (G):** ~15 lines name a hand action (hold hand, thumb on wrist, nails on handle, key in fist, counting fingers, sleeve pull) with no hand on screen. Build one reusable 5-finger hand-cel kit (from the curry naan-hands) and use it per beat.

## Summary
- Rows: 96. **HIGH 22 · MED 42 · LOW 32**.
- Fails per criterion (rows citing the letter, globals excluded): A 24 · B 11 · C 6 · D 11 · E 21 · F 7 · G 36 · H 2 (+G1 on every Nanda beat) · I 10 (+G2 on every beat).

### Top 15 HIGH
1. 049 naan tear: the hand in front of the piece (Tony item 1) → variants/naan-V1 or V2.
2. 060 "Two men bump her bag": floats over the blurred bg (Tony item 2) → the focus plane + a bag/bump.
3. 016 park feet close-up: remove (Tony item 4).
4. 017 "Hold my hand": Nanda hidden behind the box, an insert bg (Tony item 5) → the park bg + a reaching foreshortened hand.
5. 021 the double Nanda ghost behind the real one.
6. 057 train/0: a black void bg + a stray blue hat.
7. 076 the house key close-up: a tiny key on a card, no fist/palm.
8. 078 "The key turns": a full-body Nanda instead of the key in the lock.
9. 071 "The rain stops": still raining.
10. 083 "Her hand on your back": an insert card with a tea cup.
11. 080 "She kneels…slippers": she stands.
12. 029 "Her hand puts one cup": no hand.
13. 033 "Her nails press into the handle": the hand floats.
14. 069 "Close-up. Her shoes are wet": the upper body instead.
15. 008 "Itadakimasu": a giant umeboshi in the sky + Nanda floating.
(Also HIGH: 003, 018, 019, 036, 039, 047, 065.)

## Variants (for Tony)
- Item 1 naan: `variants/naan-V1-one-hand-behind.png` (the pinch hand moved BEHIND the torn piece: the naan overlaps the fingertips and the thumb sits under it; the second hand is dropped) · `variants/naan-V2-two-hands.png` (the same pinch-behind + the other hand pressing the big naan down). These are built by layer reorder from `public/date-beta/trace/curry/naan-lift.svg` (`variants/naan.py`). V1 reads cleanest. In V2 the pressing hand is still on top of the naan, which is correct for pressing down.
- Item 2 focus: `variants/focus-V1-ellipse-train3.png`, `focus-V1-ellipse-train8.png` (an unblurred ellipse at her feet, a soft fade) · `focus-V2-band-train3.png`, `focus-V2-band-train8.png` (a tilt-shift band at her foot level). V2 grounds her more visibly (the yellow platform line, the legs of the crowd sharp). V1 is subtle on train3, because that floor is plain. Made by DOM injection (`variants/focus.mjs`: an unfiltered clone of `.scene` with a CSS mask). These mockups were shot via `?scene=v2-train&beat=N`, so the HUD shows 0% and train3 has no black eye. That is a URL-jump artefact, not part of the design.
- Knife: `variants/knife-sidepony-A-B.png` (the current / A tuft+scrunchie / B ribbon bow, each at full size + thumbnail; `knife.mjs` patches the nandaSVG output). At the thumbnail, B reads unambiguously. A reads as hair but is a bit sack-like.
