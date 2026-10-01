# SLOP review: date-beta, demo Thu Oct 1 noon PT

Sources: research/sprint-0930/replay/after + compare (main M4 WIP), research/sprint-1001/playtest/A/png (local),
branch playtest-1001 @ c378e5c (worktree agent-a73e4fffbac40bdd3): routes A, B, alone, leave, escape, run2, run3, gacha.
Reference for "fixed": research/sprint-0930/legs/compare, float-audit/REPORT.md.
Shot ids: `A/054` = playtest route A shot 054; `replay/v2train-r1/09` = replay after shot.
Proof crops: `crops/` (one per HIGH, named after the finding).

Clock note: the playtest pinned the clock to 12:20 PM. The demo is at noon PT, so the story-clock offset (meta.js storyOffset,
12:00-14:00 window) WILL be live during the demo. Every clock finding below will reproduce on stage.

## HIGH (a demo viewer notices within 2 s)

| # | Sev | Route / shot / scene:beat | What is wrong | Likely source | Fix (one line) |
|---|---|---|---|---|---|
| H1 | HIGH | A/008, A/009, gacha/026-027, run2+run3/008-009, rooftop:5 bento-lift + rooftop:6 "Itadakimasu" | **Food on chopsticks held by nobody.** A giant tamagoyaki hangs on a pink chopstick that comes out of the frame edge; there is no hand. In rooftop:6, Nanda stands in the background, so the chopsticks belong to nobody on screen. This is Tony's exact example. | `art/scene-a/foods.jsx`, `art/scene-a/Bento.jsx` (bento-lift-tama/ume); packs/scene-a.json rooftop 4/5 `cut.food` | Add the MC's hand (5-finger, MC sleeve) gripping the chopsticks from bottom-right, or crop the shot so the sticks exit through a visible hand. |
| H2 | HIGH | Butter route A/026 shop:3, A/038+A/085 shop:9, A/054 curry:6, A/056 curry:8, A/060 curry:12 (napkin) | **Nanda gets five-finger human hands, which breaks the PIN-hands lock.** In "Her hand slides on top of yours", "Her nails press into the basket handle", "She tears off naan", "She dips the naan" and "She wipes your fingers", HER hand is a human 5-finger hand with a pink or purple sleeve and pink nails. The katsu route (B/008-014) draws the same actions correctly with her pink pin and ball. | `art/shop/parts.jsx` `Hand({her})` (comment: "5 fingers"), `art/shop/Street.jsx` cart, `art/shop/Checkout.jsx:99`, `art/curry/Butter.jsx` (comment line 96: "5-finger hands on sleeves"; NaanLift/NaanDip/Napkin) | Replace every `her` hand with the pin arm + ball the Katsu shots use; keep 5-finger only for MC hands. |
| H3 | HIGH | A/041, A/088 shop:12 (also in legs/compare 07 "AFTER") | **A disembodied pink arm comes down from the ceiling** at the top right and grips the MC's green sleeve by the NAND MART bags. Nanda stands at centre, nowhere near it. This is "she holds your sleeve" drawn as a floating limb. | `art/shop/Front.jsx` ShopExit (~line 93), mapped `shop-way-out` in `art/shop/index.js` | Delete the ceiling arm; draw her pin arm from her own body to the sleeve, or move the bags + sleeve next to her. |
| H4 | HIGH | Story clock (all routes). A/042 "AKIBA 3:06 PM" then A/047 "CURRY STREET 2:55 PM" (time runs backwards); A/062 + B/016 + alone/008 "STATION 4:50/4:51 PM" over the line "4:30 PM. Her station." and a platform board reading 4:30; B/035 "HER STREET 7:21 PM" over "7:00 PM. The sky goes orange"; B/039 "HER HOME 7:26 PM" then B/042 text "HER KITCHEN · 7:10 PM" then B/044 "7:41 PM" | **Clock contradictions.** storyStamp shifts the stamp chip by the real-time offset, but times written into the line text, the curry stamps (`fixed`), the station board and the wall clocks do not shift. Within one beat, the chip and the text disagree, and the walk from Akiba to curry runs backwards. | `meta.js` storyStamp/storyOffset; `main.jsx:391`; `packs/town.json:12-13` (stamp 2:45 not fixed); `packs/curry.json` (stamps `fixed`); packs/r6.json:104 + variant-v2 text times | For the demo, either turn the offset off (`storyOffset` return 0) or also fill the times in the text; at minimum mark the town stamp `fixed` like curry. |
| H5 | HIGH | leave/007 door:3 react (night, rain, HER HOME) "…Goodnight? It's only 12:20 PM."; run2/020 + run3/020 station-talk:1 "Same 12:20 PM" / "It's 12:20 PM again" on the 4:50 PM rainy platform; run2/024 + run3/024 rain-crossing:0 "It's 12:20 PM" | **The `{TIME}` token prints the real clock** into scenes whose own stamps say evening or night. At the noon demo it will say "12:0x PM" at the door at night. (In the replay shots taken at night it printed "5:58 AM" / "6:54 AM".) | `meta.js` fill() `TIME` → clock(now); `packs/story.json:1399`; obbp.json station-talk patch 9; rain-crossing line | Make `{TIME}` return the scene's story time (storyStamp of the scene stamp), not the raw clock. |
| H6 | HIGH | B/025 + replay/v2train-r1..r3/09 + run2/027 + run3/027 v2-train:8; A/039 shop:10; A/040 shop:11; B/040 home:1; leave/018 + leave/037 leave-yeah:4; replay/station-talk-r2/03 + r3/05 (raised beats) | **The dialogue box covers Nanda's face.** Only the hair, or the eyes, show above the box. Worst case: v2-train:8 "She wakes up fast. She pulls your sleeve", where only the top of her head pokes over the box. On station-talk loop beats, the box cuts her at the eyes. | `packs/r3-station.json` patch 9 (v2-train 8 `plant: 100`); `art/floors.js` entries (shop-self-checkout, genkan, cafe) put her floor under the box; obbp.json patches 20/22 (`raise`) | Lower `plant` or raise her floor so her chin clears the box top (~y 770); for raised beats use the `close`/`pov` frame instead. |
| H7 | HIGH | replay/v3-train-r1..r3/04 v3-train:3 "5:20 PM. Rain on the window. Her stop." | **The line says rain, the window shows a sunny blue sky** with white clouds and green fields (the same daytime train bg as v3-train:1). | `packs/variant-v3.json:510` beat 3 (`shot: stamp`, bg = train) | Swap to the rain train bg (`train-rain-sleepy` / TrainRain) for beat 3. |

## MED

| # | Sev | Route / shot / scene:beat | What is wrong | Likely source | Fix |
|---|---|---|---|---|---|
| M1 | MED | A/055 curry:7 "She pours more butter sauce" | Sauce jug pours from the top edge with no hand; katsu:5 (B/009) shows her pin arm holding it. | `art/curry/Butter.jsx` CurrySauce | Add her pin arm on the jug. |
| M2 | MED | A/034 + A/081 shop:5 "Her hand puts one cup in the basket" | No hand in the shot at all; blurred basket only. Line and visual do not match. | `art/shop/Checkout.jsx` (shop-basket-cups, "her hand lowers cup 3") | Draw the hand (as a pin) lowering cup 3 above the box. |
| M3 | MED | replay/v2train-r1..r3/08, B/024, run2/026, run3/026 v2-train:7 | Continuity: she has the black eye + plaster on beats 4, 6, 8 but not on beat 7 (sleeping). Also "She lays her head on yours" with no MC in frame; she lies diagonally in mid-air. | `packs/r3-station.json` patch 8 (`cut.face dazed-sleepy`, no `layers`); injury.js | Add the black-eye layer on beat 7; show the MC's shoulder under her head. |
| M4 | MED | HUD on gacha pops: A/012, A/016, gacha/002-010, B/046, leave/013, run2/016 | Badge "CRITICAL +10" / "LOVE BOMB +15" is cut off by the fullscreen/voice buttons ("ITICAL +", "CRITICAL +"). With capSwing, a crit10 shows "+8" next to a "+10" label (crit10 = crit5 = +8 on screen), which looks like a bug. | `beta.css` badge position vs HUD buttons; `engine.js:425,525` capSwing | Move the badge left of the button stack; show the capped number in the badge or drop the number. |
| M5 | MED | Run 1/2/3 sameness: run2/001-017 and run3/001-017 rooftop are pixel-identical to A; replay crowd/loop beats | The loop has no visual escalation (repeats AUDIT G1). Under-delivers on "same day again". | packs/meta.json, obbp.json vary.run | Grade shift or ghost frame on run 2/3. |
| M6 | MED | B/029 v2-rain:2 "Close-up. Her shoes are wet" (= legs/compare 01 AFTER) | Reads as Nanda's upright head and body directly under her own upside-down shoes (puddle reflection staging), so it looks like a head under the feet. | r3-rain pack v2-rain 2 insert; `fx/RainOverlay.jsx` | Flip the reflected body or crop to shoes + water only. |
| M7 | MED | replay/v3-train-r1..r3/03 v3-train:2 (window reflection) | Grey ghost figures + flat grey rectangles; reads as placeholder boxes, not reflections. Run 3 line "three of you sit in a row" fits the 3 ghosts, but run 1/2 "you see your face. And hers" also shows 3 heads and no Nanda. | `packs/variant-v3.json` beat 2 (`closeup of train-window, ofProps you:1`) | Per-run reflection count (1 MC + Nanda, then 3); give the boxes seat detail. |
| M8 | MED | escape/025 escape:9, escape/026 escape:11 "⏳ Her clock is running…" | Pure black frame with only a box (escape:9 box also greyed out); reads as a missing bg. Escape beats 7/8/10 were not shot. | interiors.json note (blackout beats), ux-six.json | Confirm it is the intended blackout; if so add a faint clock or tick so it does not read as a load failure. |
| M9 | MED | replay/v3-train-r1..r3/05 + v3 4 "Her umbrella snaps open" | Iris-cut shot with no umbrella in it. | `packs/variant-v3.json` beat 4 (match → crossing-night) | Add the umbrella-open cel or change the line. |
| M10 | MED | leave/032 leave:3 react "YOU CHOSE TO UHMMM YEAH IG." | Big black card covers Nanda's face during her react line. | leave pack choice card (ux-six / love.json) | Offset the card left or shrink it. |
| M11 | MED | A/005 rooftop:3 choice, run2/run3/005 | Choice pills ("umeboshi", "tamagoyaki") float over the bento and Nanda's arms; the pill layout overlaps the art. | rooftop:3 handout frame (scene-a.json) | Fine for the demo if accepted; otherwise move the pills under the box. |
| M12 | MED | B/040 v2-home:1 "She kneels. She puts slippers on your feet." | Nanda behind the box, standing; no kneel, no slippers in hand (the slippers sit on the shelf). | interiors genkan beat 1 | Insert shot of the slippers + pin arm. |

## LOW

| # | Sev | Where | What | Source | Fix |
|---|---|---|---|---|---|
| L1 | LOW | A/045-046 v2-town:3-4 | Nanda stands over the billboard girl's face; the box hides most of Nanda. | town.json `plant: 90` | Shift her x or drop plant. |
| L2 | LOW | Platform: replay station-talk + crowd/loop say "Hot NANDA in your area", v2/v3-train platforms say "Hot NAAN" | Billboard text changes between platform shots (fine if meta; looks inconsistent otherwise). | `art/NaanAd.jsx`, PlatformRain | Confirm intended. |
| L3 | LOW | B/038 v2-street:5 | "カチッ" SFX lettering overlaps the メゾン XNOR sign. | r3-rain HerBuilding insert | Nudge the SFX. |
| L4 | LOW | leave/008 leave:0 | HUD chapter says CAFÉ over the door bg. | love.json chapter map | Chapter = HER HOME. |
| L5 | LOW | replay crowd:0 "this is a classroom" on a platform; leave choice "FUCK YOU. I'm leaving" | Copy, not art; flag for the demo audience. | meta.json, leave pack | Tony's call. |

## Clean (checked, no findings)
- Replay compare/: the crowd lowercase-token bug ("you by the window") is FIXED in after/ (capitalised).
- Replay loop: the end beat now lands on a GAME OVER card ("You left a crumb"), not a black frame (AUDIT HIGH fixed).
- v2-train 1-6 (station, vending, bump, named, IC tap, carriage): feet on floor, contact shadows, legs fine.
- B katsu 0-11 (pin arms used correctly), v2-rain 0/1/3/4, v2-street 0-4, v2-home 0/2-4, cup 0-4, steeped 0-4 + end card.
- escape: cup/unknown 0-4, cellar 0-6, 12-14, lock game 15 (9 frames), escape-win 0-7, escape-timeout 0-7 (except M8).
- leave: door 0-3, leave 0-3, leave-yeah 0-5, leave-fu 0-4, leave-long: all ok except H5/M10/L4.
- alone 0-3 + v2-train 0 (except the H4 stamp).
- gacha tiers: crit5 +8, anger -5, rage -8 and pity +18 all sane given capSwing; crit10 only differs by label (M4). Forced anger/rage on a +3 pick correctly does nothing (force applies only to same-sign picks).
- A: rooftop 0-4, 7-11; park 0-3; shop game 4 (all right + A2 wrong-pick legs, split frames); town 0; curry 0-5, 9-11, 13.

## Coverage
- Phase 1: replay/after 87 PNGs (all 8 folders) + compare 3 sheets + playtest/A/png 11; legs/compare 9 strips + 3 contact sheets (reference).
  Note: a batch of my full-size reads returned no pixels (tool limit), so I re-reviewed every one of those shots through 2x2 montages
  (sheets/s1-s21, m1, m2, cmpall). Each replay shot was seen at least at 960x540.
- Phase 2: all 8 routes on playtest-1001: A 8 sheets (89 shots), B 5 (55), alone 1 (8), leave 4 (38), escape 5 (54), run2 3 (28), run3 3 (28), gacha 3 (35) = 335 shots.
- Missing, not shot: escape beats 7, 8, 10; escape-win 4; escape-timeout 1. Run >= 4 not shot.
- Repo untouched (`git status` clean).
