# PR #27 (sprint/obbp) click-through test, alt

- Commit tested: `c851871` (origin/sprint/obbp), fresh `npm ci`.
- `npm test`: tests 282, pass 282, fail 0, cancelled 0, skipped 0, todo 0.
- `npm run build`: OK (vite, "built in 1.29s", 0 errors).
- Served with `npx vite preview --port 5493 --strictPort`; entry `index.html?demo`, click `h1.wordmark`, then click through. Chromium, Playwright, 1920x1080 unless noted.
- Walker: `walk.mjs` (runs come from the applied scene graph, `graph.json`, made by `graph.mjs` with the main.jsx PLAY order story, meta, mech, lockgame, obbp). Probes: `extra.mjs`, `timer.mjs`. `post.py` makes the 256-colour shots; `report.py` makes this file. Raw results: `results.json`.
- Shots: `shots/<run>/NNN-<scene>-<beat>.png`, 256 colours. Full 1920x1080 evidence frames in `shots/_evidence-1920/`. To stay under 60 MB the per-beat shots are scaled: 384 px wide for the 7 key runs (steeped__butter, escape-win__butter, all-hate, all-love, reduced-motion, vp1024, loop3), 256 px wide for the rest. The 1024 run is scaled the same way. 5 identical consecutive frames were dropped (the row then says "dup").
- Beat rows are one per new screen state (a beat, its reaction frame, a lock-game stage), so rows exceed scene beat counts.

## Scene graph (after packs)

- Endings found: steeped, escape-win, escape-timeout, leave-fu, leave-yeah (5, no new ids). Love goal (auto): 69. Flags: bento, cold, errand, food, run.
- Routing choice beats: `park:4 -> errand-shop / errand-library / errand-shop`; `errand-shop:5 -> hungry / hungry`; `errand-library:4 -> hungry / hungry`; `town:9 -> train / train`; `rain-crossing:4 -> underpass / underpass`; `walk-home:5 -> apartment / apartment / (next)`; `door:3 -> genkan-in / genkan-in / leave`; `cup:3 -> steeped / steeped / unknown`; `steeped:4 -> rooftop`; `escape:13 -> escape-win / escape-timeout / (next)`; `escape-win:6 -> rooftop`; `escape-timeout:7 -> rooftop`; `leave:3 -> leave-yeah / leave-yeah / leave-fu`; `leave-fu:4 -> rooftop`; `leave-yeah:4 -> rooftop`

## Runs

| run | viewport | beats | console err/warn, pageerror, failed req, http>=400 | grey BG boxes | unfilled {TOKEN} | overflow flag (spec metric) | glyphs leave box | Nanda over choice/chip/pop | hung | ending, love |
|---|---|---|---|---|---|---|---|---|---|---|
| steeped__butter | 1920x1080 | 112 | 0 | 0 | 0 | 100 of 112 | 0 | 0 | no | GAME OVER 99% |
| steeped__katsu | 1920x1080 | 112 | 0 | 0 | 0 | 100 of 112 | 0 | 0 | no | GAME OVER 97% |
| escape-win__butter | 1920x1080 | 131 | 0 | 0 | 0 | 112 of 131 | 0 | 0 | no | GAME OVER 86% |
| escape-win__katsu | 1920x1080 | 132 | 0 | 0 | 0 | 112 of 132 | 0 | 0 | no | GAME OVER 84% |
| escape-timeout__butter | 1920x1080 | 131 | 0 | 0 | 0 | 112 of 131 | 0 | 0 | no | GAME OVER 91% |
| escape-timeout__katsu | 1920x1080 | 132 | 0 | 0 | 0 | 113 of 132 | 0 | 0 | no | GAME OVER 90% |
| leave-fu__butter | 1920x1080 | 103 | 0 | 0 | 0 | 91 of 103 | 0 | 0 | no | GAME OVER 68% |
| leave-fu__katsu | 1920x1080 | 103 | 0 | 0 | 0 | 91 of 103 | 0 | 0 | no | GAME OVER 67% |
| leave-yeah__butter | 1920x1080 | 103 | 0 | 0 | 0 | 91 of 103 | 0 | 0 | no | GAME OVER 77% |
| leave-yeah__katsu | 1920x1080 | 103 | 0 | 0 | 0 | 91 of 103 | 0 | 0 | no | GAME OVER 75% |
| errand-groceries__steeped | 1920x1080 | 112 | 0 | 0 | 0 | 100 of 112 | 0 | 0 | no | GAME OVER 96% |
| errand-library__steeped | 1920x1080 | 111 | 0 | 0 | 0 | 99 of 111 | 0 | 0 | no | GAME OVER 96% |
| all-hate | 1920x1080 | 103 | 0 | 0 | 0 | 91 of 103 | 0 | 0 | no | GAME OVER 0% |
| all-love | 1920x1080 | 111 | 0 | 0 | 0 | 99 of 111 | 0 | 0 | no | YOU WIN 100% |
| reduced-motion__steeped | 1920x1080 RM | 108 | 0 | 0 | 0 | 99 of 108 | 0 | 0 | no | YOU WIN 100% |
| vp1024__escape-win | 1024x768 | 131 | 0 | 0 | 0 | 112 of 131 | 0 | 0 | no | GAME OVER 84% |
| loop3__leave-yeah | 1920x1080 | 308 | 0 | 0 | 0 | 272 of 308 | 0 | 0 | no | GAME OVER 77% (x3 loops) |

Overflow flag: `scrollHeight > clientHeight + 2` fires on `.db-say` (and `.db-choice`, `.hud-card`, `.hud-end`) on most beats with the same +22..+40 px every time. `extra.json` `overflowProbe`: with the absolutely positioned `.pins` / `.db-chip` decorations hidden, `scrollHeight == clientHeight` (245 = 245, 150 = 150), so the flag measures those decorations. The glyph-range check (text leaves its box or the screen) found 0 in all 17 runs. No text overflow was found.

Other things checked and clean in all runs: no `data:image/svg+xml` BG placeholder, no `{TOKEN}` text on screen, no console error or warning, no pageerror, no failed request, no HTTP >= 400, no run hung (longest 415 s wall for the 3-loop run, 3 concurrent browsers).

Timers: 421 timed choice beats seen; every one drew the bar and a seconds number (12, or 11 at first look); no untimed beat drew a bar. `timer.mjs`: on rooftop:1, door:3 and leave:3 the count ran 10 -> 4 -> expiry, and expiry picked the default (rooftop: umeboshi +1 "She liked that."; door: "One cup, then home"; leave:3: the default is the fake, which plays "uhmmm yeah ig"). Lock game shows its own seconds (40s -> 37s -> 10s low).

## RUN loop (second run in the same browser context)

`loop3__leave-yeah`: one context, localStorage kept. Loop 1 (page load, run 1), "Back to start" (run 2), then a page reload after the second ending.

| loop | station-talk:1 | station-talk:2 | park:0 react `{RUN}` |
|---|---|---|---|
| 1 (run 1) | "Hey... have we stood here before? No. Silly. It's just a nice day. It's 3:31 AM. Remember that." | "(Weird. Feels like I've heard that before.)" | not shown (no hate pick) |
| 2 (run 2) | "Wait. Why is everything the same? Same rain. Same 3:33 AM. You said that exact thing last time. I remember. Do you?" | "Didn't we already do this? The bento, the train, the tea... Nanda, are we in a loop?" | not shown |
| 3 (page reload, shows run 4) | "Run 4. Same day. You know, I know. Skip the small talk. It's 3:36 AM again. Hold my hand." | "Run 4. I know every line. So do you." | not shown |

The run-1 hate token: all-hate park:0 react reads "You always learn, around run 1." (`{RUN}` filled). `{RUN}=2` variants (PASS) and run-3+ variants (PASS) both replace the base lines. The reload counted as another arrival at scene 1 (the ending's "Back to start" was arrival 3, the reload arrival 4), see B-09.

## KNOWN-BUGS #1-#8

| # | item | verdict | evidence |
|---|---|---|---|
| 1 | park has no art (Rooftop stand-in) | **FAIL (still true)** | Park beats 0-4 draw the rooftop clock tower with the "FIGUR WEATHER / Today's f-OR-ecast" sign and cherry blossom. `shots/_evidence-1920/steeped__butter__010-park-park_0.png` |
| 2 | Crowd tricks 2-3 + Tony line inside town | **FAIL (MED)** | town:2-6 is 5 click beats in a row with no choice; town:3-6 are 28/30/27/29 words. On town:4-6 the dialogue box grows to 302 px tall and covers Nanda (only her hair tip and bubble show). `shots/_evidence-1920/steeped__butter__036-town-town_4.png`, `shots/_evidence-1920/steeped__butter__038-town-town_6.png`. Also at 1024x768: `shots/_evidence-1920/vp1024__escape-win__036-town-town_4.png`. No crash, no overflow. |
| 3 | Loop lines in station-talk 1-3 on every run | **FAIL (LOW)** | Run 1 shows "Hey... have we stood here before? No. Silly." / "(Weird. Feels like I've heard that before.)" / "Deja vu is just your heart remembering me early." then station-talk:4: 5 click beats in a row (station-talk:1 to rain-crossing:0). Run 2 and run 3+ variants swap in correctly (see RUN table). `shots/_evidence-1920/loop3__leave-yeah__062-station-talk-station_talk_1.png` (run 1), `shots/_evidence-1920/loop3__leave-yeah__164-L2-station-talk-station_talk_1.png` (run 2), `shots/_evidence-1920/loop3__leave-yeah__267-L3-station-talk-station_talk_1.png` (run 4, see B-09). |
| 4 | Story 3-way neutral picks now side "mid" | **PASS** | 440 three-choice beats seen across 17 runs (77 two-choice): every one lays out left to right pink, mid, purple, one row, y=860 (x=90 / 683 / 1277). `shots/_evidence-1920/steeped__butter__001-rooftop-rooftop_1.png`, `shots/_evidence-1920/steeped__butter__010-park-park_0.png`. 2-choice MOVE beats: pink left, purple right. |
| 5 | Echo-lint: "sweet" -> "cute" in errand-library 1 | **PASS** | errand-library:1 choice 0 reads "That's so cute" (chip +3), no "sweet"; loads with no lint error. `shots/_evidence-1920/errand-library__steeped__019-errand-library-errand_library_1.png` |
| 6 | Lock game win/lose routing (props.win 0 / lose 1) | **PASS** | Solving all 8 pairs shows "THE DOOR IS OPEN" and goes to escape-win (escape-win__butter/katsu, vp1024). Letting 40 s run out (time shown 40s, then 10s with the low style) goes to escape-timeout (both foods). `shots/_evidence-1920/escape-win__butter__122-escape-escape_13.png`, `shots/_evidence-1920/escape-timeout__butter__121-escape-escape_13.png`, `shots/_evidence-1920/escape-win__butter__123-escape-win-escape_win_0.png`, `shots/_evidence-1920/escape-timeout__butter__122-escape-timeout-escape_timeout_0.png`. Works at 1024x768 too. Note: the choice buttons are not drawn on the lock-game beat (by design), so the "Stay right here" fake is unreachable. |
| 7 | Nanda centred: overlap with chips / react bubbles | **PASS (chips) / see B-02 (dialogue box)** | Across every beat of 17 runs the walker found 0 overlaps between Nanda's art and any choice button, chip, or the +N/tell pop. Raised choice beats and reaction beats (big bubble) are clear: `shots/_evidence-1920/steeped__butter__010-park-park_0.png`, `shots/_evidence-1920/steeped__butter__011-park-park_0.png`. The only overlap is the dialogue box covering her lower body on every beat, and almost all of her on town:4-6. |
| 8 | fake flash on walk-home 5 vs next scene | **PASS** | Picking "Run home alone" plays choice 0: apartment:0 opens with the chosen-flash card "YOU CHOSE TO FOLLOW HER INSIDE." over the beat; dialogue "Four floors. One window lit." is readable under it and a click moves on to apartment:1 (no stall, no error). `shots/_evidence-1920/all-hate__083-apartment-apartment_0.png` (pick: `shots/_evidence-1920/all-hate__082-walk-home-walk_home_5.png`). |

## Endings and love (facts)

| run | love at end card | card |
|---|---|---|
| steeped__butter | 99% | GAME OVER / She does not love you enough. |
| steeped__katsu | 97% | GAME OVER / She does not love you enough. |
| escape-win__butter | 86% | GAME OVER / She does not love you enough. |
| escape-win__katsu | 84% | GAME OVER / She does not love you enough. |
| escape-timeout__butter | 91% | GAME OVER / She does not love you enough. |
| escape-timeout__katsu | 90% | GAME OVER / She does not love you enough. |
| leave-fu__butter | 68% | GAME OVER / She does not love you enough. |
| leave-fu__katsu | 67% | GAME OVER / She does not love you enough. |
| leave-yeah__butter | 77% | GAME OVER / She does not love you enough. |
| leave-yeah__katsu | 75% | GAME OVER / She does not love you enough. |
| errand-groceries__steeped | 96% | GAME OVER / She does not love you enough. |
| errand-library__steeped | 96% | GAME OVER / She does not love you enough. |
| all-hate | 0% | GAME OVER / She does not love you enough. |
| all-love | 100% | YOU WIN / She loves you. |
| reduced-motion__steeped | 100% | YOU WIN / She loves you. |
| vp1024__escape-win | 84% | GAME OVER / She does not love you enough. |
| loop3__leave-yeah | 77% | GAME OVER / She does not love you enough. |

Only all-love (butter chicken, library, all top picks) and the reduced-motion run (same picks) reach 100% and the win card: `shots/_evidence-1920/all-love__zz-settled-endcard-L1.png`. The best groceries-route run (steeped__butter, every top pick, groceries) ends at 99% with GAME OVER: `shots/_evidence-1920/steeped__butter__zz-settled-endcard-L1.png`. Lowest: all-hate 0%: `shots/_evidence-1920/all-hate__zz-settled-endcard-L1.png`. Goal card: `shots/_evidence-1920/steeped__butter__zz-settled-goalcard.png`.

## Per-run ordered beat lists

### steeped__butter (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/steeped__butter/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/steeped__butter/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 2 | [png](shots/steeped__butter/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/steeped__butter/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/steeped__butter/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/steeped__butter/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/steeped__butter/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/steeped__butter/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/steeped__butter/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 9 | [png](shots/steeped__butter/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/steeped__butter/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/steeped__butter/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:12 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/steeped__butter/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/steeped__butter/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/steeped__butter/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/steeped__butter/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/steeped__butter/016-park-park_4.png) | park:4 | NANDA: It's 3:12 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/steeped__butter/017-park-park_4.png) | park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 18 | [png](shots/steeped__butter/018-errand-shop-errand_shop_0.png) | errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 19 | [png](shots/steeped__butter/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 20 | [png](shots/steeped__butter/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/steeped__butter/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 22 | [png](shots/steeped__butter/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 23 | [png](shots/steeped__butter/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 24 | [png](shots/steeped__butter/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 25 | [png](shots/steeped__butter/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 26 | [png](shots/steeped__butter/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 27 | [png](shots/steeped__butter/027-hungry-hungry_0.png) | hungry:0 | NANDA: With naan! You know me so well. ♡ [fx love-burst] |  | 36% |  |
| 28 | [png](shots/steeped__butter/028-hungry-hungry_1.png) | hungry:1 | NANDA: Tear the naan. Give me the soft part. Always the soft part. |  | 36% |  |
| 29 | [png](shots/steeped__butter/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 36% | 12 |
| 30 | [png](shots/steeped__butter/030-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 41% |  |
| 31 | [png](shots/steeped__butter/031-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 41% |  |
| 32 | [png](shots/steeped__butter/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 41% | 12 |
| 33 | [png](shots/steeped__butter/033-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 45% |  |
| 34 | [png](shots/steeped__butter/034-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 45% |  |
| 35 | [png](shots/steeped__butter/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:13 AM, a sleepy night, and this is a cl |  | 45% |  |
| 36 | [png](shots/steeped__butter/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 45% |  |
| 37 | [png](shots/steeped__butter/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 45% |  |
| 38 | [png](shots/steeped__butter/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 45% |  |
| 39 | [png](shots/steeped__butter/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 45% | 12 |
| 40 | [png](shots/steeped__butter/040-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 49% |  |
| 41 | [png](shots/steeped__butter/041-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 49% |  |
| 42 | [png](shots/steeped__butter/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 49% |  |
| 43 | [png](shots/steeped__butter/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/steeped__butter/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 45 | [png](shots/steeped__butter/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/steeped__butter/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not our lunch. |  |  |  |
| 47 | [png](shots/steeped__butter/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/steeped__butter/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/steeped__butter/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/steeped__butter/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/steeped__butter/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/steeped__butter/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/steeped__butter/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/steeped__butter/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/steeped__butter/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | [png](shots/steeped__butter/056-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 57 | [png](shots/steeped__butter/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/steeped__butter/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/steeped__butter/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/steeped__butter/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 49% | 12 |
| 61 | [png](shots/steeped__butter/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 54% |  |
| 62 | [png](shots/steeped__butter/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:1 |  | 54% |  |
| 63 | [png](shots/steeped__butter/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 54% |  |
| 64 | [png](shots/steeped__butter/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 54% |  |
| 65 | [png](shots/steeped__butter/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 54% |  |
| 66 | [png](shots/steeped__butter/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:14 AM. |  | 54% |  |
| 67 | [png](shots/steeped__butter/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 54% | 12 |
| 68 | [png](shots/steeped__butter/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 59% |  |
| 69 | [png](shots/steeped__butter/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 59% |  |
| 70 | [png](shots/steeped__butter/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 59% | 12 |
| 71 | [png](shots/steeped__butter/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 65% |  |
| 72 | [png](shots/steeped__butter/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 65% |  |
| 73 | [png](shots/steeped__butter/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 65% |  |
| 74 | [png](shots/steeped__butter/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 65% |  |
| 75 | [png](shots/steeped__butter/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 65% |  |
| 76 | [png](shots/steeped__butter/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 65% | 12 |
| 77 | [png](shots/steeped__butter/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 70% |  |
| 78 | [png](shots/steeped__butter/078-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 70% |  |
| 79 | [png](shots/steeped__butter/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 70% | 12 |
| 80 | [png](shots/steeped__butter/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 74% |  |
| 81 | [png](shots/steeped__butter/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 74% |  |
| 82 | [png](shots/steeped__butter/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 74% |  |
| 83 | [png](shots/steeped__butter/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 74% |  |
| 84 | [png](shots/steeped__butter/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 74% |  |
| 85 | [png](shots/steeped__butter/085-door-door_0.png) | door:0 |  |  | 74% |  |
| 86 | [png](shots/steeped__butter/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 74% | 12 |
| 87 | [png](shots/steeped__butter/087-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 77% |  |
| 88 | [png](shots/steeped__butter/088-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 77% |  |
| 89 | [png](shots/steeped__butter/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 77% | 12 |
| 90 | [png](shots/steeped__butter/090-door-door_3.png) | door:3 | NANDA: One cup. I'll pour it slow. [fx love-burst] |  | 81% |  |
| 91 | [png](shots/steeped__butter/091-genkan-in-genkan_in_0.png) | genkan-in:0 | Her shoes. Lined up to the millimetre. |  |  |  |
| 92 | [png](shots/steeped__butter/092-genkan-in-genkan_in_1.png) | genkan-in:1 | Men's slippers. Already set out. |  |  |  |
| 93 | [png](shots/steeped__butter/093-genkan-in-genkan_in_2.png) | genkan-in:2 | A tiny shrine. Inside: a circuit you built. |  |  |  |
| 94 | [png](shots/steeped__butter/094-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: おかえり。Welcome home. I mean my home. I mean our home. Same thing. | ただいま ♥ +4; Thanks for having me ♥ +1; This isn't my home ♡ −5 | 81% | 12 |
| 95 | [png](shots/steeped__butter/095-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: You said it! ただいま! I'm keeping that. [fx love-burst] |  | 87% |  |
| 96 | [png](shots/steeped__butter/096-genkan-talk-genkan_talk_1.png) | genkan-talk:1 | NANDA: Slippers on. I bought them in your size. Last year. Before we met. Don't  |  | 87% |  |
| 97 | [png](shots/steeped__butter/097-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I made a list of things you like. Forty things. I'm number one. I checked | You're number one ♥ +3; What's number two? ♥ +1; Burn the list ♡ −5 | 87% | 12 |
| 98 | [png](shots/steeped__butter/098-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I knew it. The list is never wrong. [fx love-burst] |  | 91% |  |
| 99 | [png](shots/steeped__butter/099-genkan-talk-genkan_talk_3.png) | genkan-talk:3 | NANDA: Kitchen's this way. Don't open the other doors. They're shy. |  | 91% |  |
| 100 | [png](shots/steeped__butter/100-cup-cup_0.png) | cup:0 | NANDA: I made tamagoyaki. For no reason. Eat. | Eat it all ♥ +2; Eat a little ♥ +1; I'm not hungry ♡ −3 | 91% | 12 |
| 101 | [png](shots/steeped__butter/101-cup-cup_0.png) | cup:0 | NANDA: See? You needed me. [fx love-burst] |  | 94% |  |
| 102 | [png](shots/steeped__butter/102-cup-cup_1.png) | cup:1 | Third teacup. Nobody poured it. Tamagoyaki on its saucer. |  | 94% |  |
| 103 | [png](shots/steeped__butter/103-cup-cup_2.png) | cup:2 | MC: Who's the third cup for? |  | 94% |  |
| 104 | [png](shots/steeped__butter/104-cup-cup_3.png) | cup:3 | NANDA: For Input B. Silly. It's always three of us. | Drink ♥ +3; Hold the cup ♥ +1; Stand up ♡ −3 | 94% | 12 |
| 105 | [png](shots/steeped__butter/105-cup-cup_3.png) | cup:3 | NANDA: Drink. It's warm. It makes the thinking stop. [fx love-burst] |  | 99% |  |
| 106 | [png](shots/steeped__butter/106-steeped-steeped_0.png) | steeped:0 | OR |  | 99% |  |
| 107 | [png](shots/steeped__butter/107-steeped-steeped_1.png) | steeped:1 | NANDA: Rest. I'll do the remembering. |  | 99% |  |
| 108 | [png](shots/steeped__butter/108-steeped-steeped_2.png) | steeped:2 | NANDA: Warm cup, sweet sleep. You're mine to keep. |  | 99% |  |
| 109 | [png](shots/steeped__butter/109-steeped-steeped_3.png) | steeped:3 | NANDA: いつまでも一緒。…FORever. ね？ |  | 99% |  |
| 110 | [png](shots/steeped__butter/110-steeped-steeped_4.png) | steeped:4 | [END CARD] GAME OVER 99% |  | 99% |  |
| 111 | [png](shots/steeped__butter/111-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### steeped__katsu (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/steeped__katsu/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/steeped__katsu/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 2 | [png](shots/steeped__katsu/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/steeped__katsu/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/steeped__katsu/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/steeped__katsu/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/steeped__katsu/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/steeped__katsu/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/steeped__katsu/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 9 | [png](shots/steeped__katsu/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/steeped__katsu/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 11 |
| 11 | [png](shots/steeped__katsu/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:12 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/steeped__katsu/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/steeped__katsu/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/steeped__katsu/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/steeped__katsu/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/steeped__katsu/016-park-park_4.png) | park:4 | NANDA: It's 3:12 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/steeped__katsu/017-park-park_4.png) | park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 18 | [png](shots/steeped__katsu/018-errand-shop-errand_shop_0.png) | errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 19 | [png](shots/steeped__katsu/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 20 | [png](shots/steeped__katsu/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/steeped__katsu/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 22 | [png](shots/steeped__katsu/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 23 | [png](shots/steeped__katsu/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 24 | [png](shots/steeped__katsu/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 25 | [png](shots/steeped__katsu/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 26 | [png](shots/steeped__katsu/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 27 | [png](shots/steeped__katsu/027-hungry-hungry_0.png) | hungry:0 | NANDA: Crunchy! You chose. I'll pretend I did. |  | 35% |  |
| 28 | [png](shots/steeped__katsu/028-hungry-hungry_1.png) | hungry:1 | NANDA: Cut the katsu. Blow on it. I like it when you work for me. |  | 35% |  |
| 29 | [png](shots/steeped__katsu/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 35% | 12 |
| 30 | [png](shots/steeped__katsu/030-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 39% |  |
| 31 | [png](shots/steeped__katsu/031-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 39% |  |
| 32 | [png](shots/steeped__katsu/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 39% | 12 |
| 33 | [png](shots/steeped__katsu/033-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 43% |  |
| 34 | [png](shots/steeped__katsu/034-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 43% |  |
| 35 | [png](shots/steeped__katsu/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:13 AM, a sleepy night, and this is a cl |  | 43% |  |
| 36 | [png](shots/steeped__katsu/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 43% |  |
| 37 | [png](shots/steeped__katsu/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 43% |  |
| 38 | [png](shots/steeped__katsu/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 43% |  |
| 39 | [png](shots/steeped__katsu/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 43% | 12 |
| 40 | [png](shots/steeped__katsu/040-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 48% |  |
| 41 | [png](shots/steeped__katsu/041-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 48% |  |
| 42 | [png](shots/steeped__katsu/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 48% |  |
| 43 | [png](shots/steeped__katsu/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/steeped__katsu/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 45 | [png](shots/steeped__katsu/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/steeped__katsu/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not bread. |  |  |  |
| 47 | [png](shots/steeped__katsu/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/steeped__katsu/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/steeped__katsu/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/steeped__katsu/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/steeped__katsu/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/steeped__katsu/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/steeped__katsu/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/steeped__katsu/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/steeped__katsu/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | [png](shots/steeped__katsu/056-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 57 | [png](shots/steeped__katsu/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/steeped__katsu/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/steeped__katsu/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/steeped__katsu/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 48% | 12 |
| 61 | [png](shots/steeped__katsu/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 52% |  |
| 62 | [png](shots/steeped__katsu/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:1 |  | 52% |  |
| 63 | [png](shots/steeped__katsu/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 52% |  |
| 64 | [png](shots/steeped__katsu/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 52% |  |
| 65 | [png](shots/steeped__katsu/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 52% |  |
| 66 | [png](shots/steeped__katsu/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:14 AM. |  | 52% |  |
| 67 | [png](shots/steeped__katsu/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 52% | 12 |
| 68 | [png](shots/steeped__katsu/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 58% |  |
| 69 | [png](shots/steeped__katsu/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 58% |  |
| 70 | [png](shots/steeped__katsu/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 58% | 12 |
| 71 | [png](shots/steeped__katsu/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 64% |  |
| 72 | [png](shots/steeped__katsu/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 64% |  |
| 73 | [png](shots/steeped__katsu/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 64% |  |
| 74 | [png](shots/steeped__katsu/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 64% |  |
| 75 | [png](shots/steeped__katsu/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 64% |  |
| 76 | [png](shots/steeped__katsu/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 64% | 12 |
| 77 | [png](shots/steeped__katsu/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 68% |  |
| 78 | [png](shots/steeped__katsu/078-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 68% |  |
| 79 | [png](shots/steeped__katsu/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 68% | 12 |
| 80 | [png](shots/steeped__katsu/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 72% |  |
| 81 | [png](shots/steeped__katsu/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 72% |  |
| 82 | [png](shots/steeped__katsu/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 72% |  |
| 83 | [png](shots/steeped__katsu/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 72% |  |
| 84 | [png](shots/steeped__katsu/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 72% |  |
| 85 | [png](shots/steeped__katsu/085-door-door_0.png) | door:0 |  |  | 72% |  |
| 86 | [png](shots/steeped__katsu/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 72% | 12 |
| 87 | [png](shots/steeped__katsu/087-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 75% |  |
| 88 | [png](shots/steeped__katsu/088-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 75% |  |
| 89 | [png](shots/steeped__katsu/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 75% | 12 |
| 90 | [png](shots/steeped__katsu/090-door-door_3.png) | door:3 | NANDA: One cup. I'll pour it slow. [fx love-burst] |  | 80% |  |
| 91 | [png](shots/steeped__katsu/091-genkan-in-genkan_in_0.png) | genkan-in:0 | Her shoes. Lined up to the millimetre. |  |  |  |
| 92 | [png](shots/steeped__katsu/092-genkan-in-genkan_in_1.png) | genkan-in:1 | Men's slippers. Already set out. |  |  |  |
| 93 | [png](shots/steeped__katsu/093-genkan-in-genkan_in_2.png) | genkan-in:2 | A tiny shrine. Inside: a circuit you built. |  |  |  |
| 94 | [png](shots/steeped__katsu/094-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: おかえり。Welcome home. I mean my home. I mean our home. Same thing. | ただいま ♥ +4; Thanks for having me ♥ +1; This isn't my home ♡ −5 | 80% | 12 |
| 95 | [png](shots/steeped__katsu/095-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: You said it! ただいま! I'm keeping that. [fx love-burst] |  | 86% |  |
| 96 | [png](shots/steeped__katsu/096-genkan-talk-genkan_talk_1.png) | genkan-talk:1 | NANDA: Slippers on. I bought them in your size. Last year. Before we met. Don't  |  | 86% |  |
| 97 | [png](shots/steeped__katsu/097-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I made a list of things you like. Forty things. I'm number one. I checked | You're number one ♥ +3; What's number two? ♥ +1; Burn the list ♡ −5 | 86% | 12 |
| 98 | [png](shots/steeped__katsu/098-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I knew it. The list is never wrong. [fx love-burst] |  | 90% |  |
| 99 | [png](shots/steeped__katsu/099-genkan-talk-genkan_talk_3.png) | genkan-talk:3 | NANDA: Kitchen's this way. Don't open the other doors. They're shy. |  | 90% |  |
| 100 | [png](shots/steeped__katsu/100-cup-cup_0.png) | cup:0 | NANDA: I made tamagoyaki. For no reason. Eat. | Eat it all ♥ +2; Eat a little ♥ +1; I'm not hungry ♡ −3 | 90% | 12 |
| 101 | [png](shots/steeped__katsu/101-cup-cup_0.png) | cup:0 | NANDA: See? You needed me. [fx love-burst] |  | 93% |  |
| 102 | [png](shots/steeped__katsu/102-cup-cup_1.png) | cup:1 | Third teacup. Nobody poured it. Tamagoyaki on its saucer. |  | 93% |  |
| 103 | [png](shots/steeped__katsu/103-cup-cup_2.png) | cup:2 | MC: Who's the third cup for? |  | 93% |  |
| 104 | [png](shots/steeped__katsu/104-cup-cup_3.png) | cup:3 | NANDA: For Input B. Silly. It's always three of us. | Drink ♥ +3; Hold the cup ♥ +1; Stand up ♡ −3 | 93% | 12 |
| 105 | [png](shots/steeped__katsu/105-cup-cup_3.png) | cup:3 | NANDA: Drink. It's warm. It makes the thinking stop. [fx love-burst] |  | 97% |  |
| 106 | [png](shots/steeped__katsu/106-steeped-steeped_0.png) | steeped:0 | OR |  | 97% |  |
| 107 | [png](shots/steeped__katsu/107-steeped-steeped_1.png) | steeped:1 | NANDA: Rest. I'll do the remembering. |  | 97% |  |
| 108 | [png](shots/steeped__katsu/108-steeped-steeped_2.png) | steeped:2 | NANDA: Warm cup, sweet sleep. You're mine to keep. |  | 97% |  |
| 109 | [png](shots/steeped__katsu/109-steeped-steeped_3.png) | steeped:3 | NANDA: いつまでも一緒。…FORever. ね？ |  | 97% |  |
| 110 | [png](shots/steeped__katsu/110-steeped-steeped_4.png) | steeped:4 | [END CARD] GAME OVER 97% |  | 97% |  |
| 111 | [png](shots/steeped__katsu/111-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### escape-win__butter (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/escape-win__butter/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/escape-win__butter/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 2 | [png](shots/escape-win__butter/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/escape-win__butter/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/escape-win__butter/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/escape-win__butter/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/escape-win__butter/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/escape-win__butter/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/escape-win__butter/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 9 | [png](shots/escape-win__butter/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/escape-win__butter/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/escape-win__butter/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:12 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/escape-win__butter/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/escape-win__butter/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/escape-win__butter/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/escape-win__butter/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/escape-win__butter/016-park-park_4.png) | park:4 | NANDA: It's 3:12 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 11 |
| 17 | [png](shots/escape-win__butter/017-park-park_4.png) | park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 18 | [png](shots/escape-win__butter/018-errand-shop-errand_shop_0.png) | errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 19 | [png](shots/escape-win__butter/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 20 | [png](shots/escape-win__butter/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/escape-win__butter/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 22 | [png](shots/escape-win__butter/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 23 | [png](shots/escape-win__butter/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 24 | [png](shots/escape-win__butter/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 25 | [png](shots/escape-win__butter/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 26 | [png](shots/escape-win__butter/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 27 | [png](shots/escape-win__butter/027-hungry-hungry_0.png) | hungry:0 | NANDA: With naan! You know me so well. ♡ [fx love-burst] |  | 36% |  |
| 28 | [png](shots/escape-win__butter/028-hungry-hungry_1.png) | hungry:1 | NANDA: Tear the naan. Give me the soft part. Always the soft part. |  | 36% |  |
| 29 | [png](shots/escape-win__butter/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 36% | 12 |
| 30 | [png](shots/escape-win__butter/030-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 41% |  |
| 31 | [png](shots/escape-win__butter/031-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 41% |  |
| 32 | [png](shots/escape-win__butter/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 41% | 12 |
| 33 | [png](shots/escape-win__butter/033-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 45% |  |
| 34 | [png](shots/escape-win__butter/034-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 45% |  |
| 35 | [png](shots/escape-win__butter/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:13 AM, a sleepy night, and this is a cl |  | 45% |  |
| 36 | [png](shots/escape-win__butter/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 45% |  |
| 37 | [png](shots/escape-win__butter/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 45% |  |
| 38 | [png](shots/escape-win__butter/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 45% |  |
| 39 | [png](shots/escape-win__butter/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 45% | 12 |
| 40 | [png](shots/escape-win__butter/040-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 49% |  |
| 41 | [png](shots/escape-win__butter/041-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 49% |  |
| 42 | [png](shots/escape-win__butter/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 49% |  |
| 43 | [png](shots/escape-win__butter/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/escape-win__butter/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 45 | [png](shots/escape-win__butter/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/escape-win__butter/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not our lunch. |  |  |  |
| 47 | [png](shots/escape-win__butter/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/escape-win__butter/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/escape-win__butter/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/escape-win__butter/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/escape-win__butter/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/escape-win__butter/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/escape-win__butter/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/escape-win__butter/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/escape-win__butter/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | [png](shots/escape-win__butter/056-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 57 | [png](shots/escape-win__butter/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/escape-win__butter/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/escape-win__butter/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/escape-win__butter/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 49% | 12 |
| 61 | [png](shots/escape-win__butter/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 54% |  |
| 62 | [png](shots/escape-win__butter/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:1 |  | 54% |  |
| 63 | [png](shots/escape-win__butter/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 54% |  |
| 64 | [png](shots/escape-win__butter/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 54% |  |
| 65 | [png](shots/escape-win__butter/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 54% |  |
| 66 | [png](shots/escape-win__butter/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:14 AM. |  | 54% |  |
| 67 | [png](shots/escape-win__butter/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 54% | 12 |
| 68 | [png](shots/escape-win__butter/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 59% |  |
| 69 | [png](shots/escape-win__butter/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 59% |  |
| 70 | [png](shots/escape-win__butter/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 59% | 12 |
| 71 | [png](shots/escape-win__butter/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 65% |  |
| 72 | [png](shots/escape-win__butter/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 65% |  |
| 73 | [png](shots/escape-win__butter/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 65% |  |
| 74 | [png](shots/escape-win__butter/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 65% |  |
| 75 | [png](shots/escape-win__butter/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 65% |  |
| 76 | [png](shots/escape-win__butter/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 65% | 12 |
| 77 | [png](shots/escape-win__butter/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 70% |  |
| 78 | [png](shots/escape-win__butter/078-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 70% |  |
| 79 | [png](shots/escape-win__butter/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 70% | 12 |
| 80 | [png](shots/escape-win__butter/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 74% |  |
| 81 | [png](shots/escape-win__butter/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 74% |  |
| 82 | [png](shots/escape-win__butter/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 74% |  |
| 83 | [png](shots/escape-win__butter/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 74% |  |
| 84 | [png](shots/escape-win__butter/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 74% |  |
| 85 | [png](shots/escape-win__butter/085-door-door_0.png) | door:0 |  |  | 74% |  |
| 86 | [png](shots/escape-win__butter/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 74% | 12 |
| 87 | [png](shots/escape-win__butter/087-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 77% |  |
| 88 | [png](shots/escape-win__butter/088-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 77% |  |
| 89 | [png](shots/escape-win__butter/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 77% | 12 |
| 90 | [png](shots/escape-win__butter/090-door-door_3.png) | door:3 | NANDA: One cup. I'll pour it slow. [fx love-burst] |  | 81% |  |
| 91 | [png](shots/escape-win__butter/091-genkan-in-genkan_in_0.png) | genkan-in:0 | Her shoes. Lined up to the millimetre. |  |  |  |
| 92 | [png](shots/escape-win__butter/092-genkan-in-genkan_in_1.png) | genkan-in:1 | Men's slippers. Already set out. |  |  |  |
| 93 | [png](shots/escape-win__butter/093-genkan-in-genkan_in_2.png) | genkan-in:2 | A tiny shrine. Inside: a circuit you built. |  |  |  |
| 94 | [png](shots/escape-win__butter/094-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: おかえり。Welcome home. I mean my home. I mean our home. Same thing. | ただいま ♥ +4; Thanks for having me ♥ +1; This isn't my home ♡ −5 | 81% | 12 |
| 95 | [png](shots/escape-win__butter/095-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: You said it! ただいま! I'm keeping that. [fx love-burst] |  | 87% |  |
| 96 | [png](shots/escape-win__butter/096-genkan-talk-genkan_talk_1.png) | genkan-talk:1 | NANDA: Slippers on. I bought them in your size. Last year. Before we met. Don't  |  | 87% |  |
| 97 | [png](shots/escape-win__butter/097-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I made a list of things you like. Forty things. I'm number one. I checked | You're number one ♥ +3; What's number two? ♥ +1; Burn the list ♡ −5 | 87% | 12 |
| 98 | [png](shots/escape-win__butter/098-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I knew it. The list is never wrong. [fx love-burst] |  | 91% |  |
| 99 | [png](shots/escape-win__butter/099-genkan-talk-genkan_talk_3.png) | genkan-talk:3 | NANDA: Kitchen's this way. Don't open the other doors. They're shy. |  | 91% |  |
| 100 | [png](shots/escape-win__butter/100-cup-cup_0.png) | cup:0 | NANDA: I made tamagoyaki. For no reason. Eat. | Eat it all ♥ +2; Eat a little ♥ +1; I'm not hungry ♡ −3 | 91% | 12 |
| 101 | [png](shots/escape-win__butter/101-cup-cup_0.png) | cup:0 | NANDA: See? You needed me. [fx love-burst] |  | 94% |  |
| 102 | [png](shots/escape-win__butter/102-cup-cup_1.png) | cup:1 | Third teacup. Nobody poured it. Tamagoyaki on its saucer. |  | 94% |  |
| 103 | [png](shots/escape-win__butter/103-cup-cup_2.png) | cup:2 | MC: Who's the third cup for? |  | 94% |  |
| 104 | [png](shots/escape-win__butter/104-cup-cup_3.png) | cup:3 | NANDA: For Input B. Silly. It's always three of us. | Drink ♥ +3; Hold the cup ♥ +1; Stand up ♡ −3 | 94% | 12 |
| 105 | [png](shots/escape-win__butter/105-cup-cup_3.png) | cup:3 | NANDA: Sit. The tea isn't finished. [fx hate-quake] |  | 90% |  |
| 106 | [png](shots/escape-win__butter/106-unknown-unknown_0.png) | unknown:0 | You stand. The floor tilts a little. |  |  |  |
| 107 | [png](shots/escape-win__butter/107-unknown-unknown_1.png) | unknown:1 | Under the table: a floor hatch. Too big for storage. | Open the hatch; Gently open the hatch ♡ |  |  |
| 108 | [png](shots/escape-win__butter/108-unknown-unknown_2.png) | unknown:2 | A steep wooden ladder. Down into the dark. | Climb down; Tippy-toe down ♡ |  |  |
| 109 | [png](shots/escape-win__butter/109-escape-escape_0.png) | escape:0 | Concrete. One bulb. Rain at a high window. | Look at the shelves; Peek at the pretty shelves ♡ |  |  |
| 110 | [png](shots/escape-win__butter/110-escape-escape_1.png) | escape:1 | Jars on the shelves. Each one: a date, a name. |  |  |  |
| 111 | [png](shots/escape-win__butter/111-escape-escape_2.png) | escape:2 | The dates go back years. The names are all different. |  |  |  |
| 112 | [png](shots/escape-win__butter/112-escape-escape_3.png) | escape:3 | Bento boxes, one per day. Your name on each. Untouched. |  |  |  |
| 113 | [png](shots/escape-win__butter/113-escape-escape_4.png) | escape:4 | The oldest is dated before you met. |  |  |  |
| 114 | [png](shots/escape-win__butter/114-escape-escape_5.png) | escape:5 | A mortar and a mallet. One fresh mochi. Hers only. | Keep looking; Keep looking… and nothing else |  |  |
| 115 | [png](shots/escape-win__butter/115-escape-escape_6.png) | escape:6 | Newest jar: today, your name, tamagoyaki. Lid off. Empty. |  |  |  |
| 116 | [png](shots/escape-win__butter/116-escape-escape_8.png) | escape:8 |  |  |  |  |
| 117 | [png](shots/escape-win__butter/117-escape-escape_9.png) | escape:9 |  |  |  |  |
| 118 | dup | escape:11 |  |  |  |  |
| 119 | [png](shots/escape-win__butter/119-escape-escape_12.png) | escape:12 | Minutes gone. A clock upstairs chimed. You lost count. |  |  |  |
| 120 | [png](shots/escape-win__butter/120-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS LOCKED pins 0/8 |  |  | 40s |
| 121 | [png](shots/escape-win__butter/121-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS LOCKED pins 4/8 |  |  | 37s |
| 122 | [png](shots/escape-win__butter/122-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS OPEN pins 8/8 |  |  | 35s |
| 123 | [png](shots/escape-win__butter/123-escape-win-escape_win_0.png) | escape-win:0 | She's waiting at the outside door. |  | 86% |  |
| 124 | [png](shots/escape-win__butter/124-escape-win-escape_win_1.png) | escape-win:1 | NANDA: You took the long way. |  | 86% |  |
| 125 | [png](shots/escape-win__butter/125-escape-win-escape_win_2.png) | escape-win:2 | NANDA: Home is warm, and sweet. |  | 86% |  |
| 126 | [png](shots/escape-win__butter/126-escape-win-escape_win_3.png) | escape-win:3 | NANDA: Sleep now. You're mine to keep. |  | 86% |  |
| 127 | [png](shots/escape-win__butter/127-escape-win-escape_win_4.png) | escape-win:4 |  |  |  |  |
| 128 | [png](shots/escape-win__butter/128-escape-win-escape_win_5.png) | escape-win:5 | NANDA: Mine. |  |  |  |
| 129 | [png](shots/escape-win__butter/129-escape-win-escape_win_6.png) | escape-win:6 | [END CARD] GAME OVER 86% |  |  |  |
| 130 | [png](shots/escape-win__butter/130-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### escape-win__katsu (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/escape-win__katsu/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/escape-win__katsu/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 11 |
| 2 | [png](shots/escape-win__katsu/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/escape-win__katsu/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/escape-win__katsu/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/escape-win__katsu/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/escape-win__katsu/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/escape-win__katsu/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/escape-win__katsu/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 9 | [png](shots/escape-win__katsu/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/escape-win__katsu/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/escape-win__katsu/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:16 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/escape-win__katsu/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/escape-win__katsu/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/escape-win__katsu/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/escape-win__katsu/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/escape-win__katsu/016-park-park_4.png) | park:4 | NANDA: It's 3:16 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/escape-win__katsu/017-park-park_4.png) | park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 18 | [png](shots/escape-win__katsu/018-errand-shop-errand_shop_0.png) | errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 19 | [png](shots/escape-win__katsu/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 20 | [png](shots/escape-win__katsu/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/escape-win__katsu/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 22 | [png](shots/escape-win__katsu/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 23 | [png](shots/escape-win__katsu/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 24 | [png](shots/escape-win__katsu/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 25 | [png](shots/escape-win__katsu/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 26 | [png](shots/escape-win__katsu/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 27 | [png](shots/escape-win__katsu/027-hungry-hungry_0.png) | hungry:0 | NANDA: Crunchy! You chose. I'll pretend I did. |  | 35% |  |
| 28 | [png](shots/escape-win__katsu/028-hungry-hungry_1.png) | hungry:1 | NANDA: Cut the katsu. Blow on it. I like it when you work for me. |  | 35% |  |
| 29 | [png](shots/escape-win__katsu/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 35% | 12 |
| 30 | [png](shots/escape-win__katsu/030-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 39% |  |
| 31 | [png](shots/escape-win__katsu/031-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 39% |  |
| 32 | [png](shots/escape-win__katsu/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 39% | 12 |
| 33 | [png](shots/escape-win__katsu/033-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 43% |  |
| 34 | [png](shots/escape-win__katsu/034-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 43% |  |
| 35 | [png](shots/escape-win__katsu/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:16 AM, a sleepy night, and this is a cl |  | 43% |  |
| 36 | [png](shots/escape-win__katsu/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 43% |  |
| 37 | [png](shots/escape-win__katsu/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 43% |  |
| 38 | [png](shots/escape-win__katsu/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 43% |  |
| 39 | [png](shots/escape-win__katsu/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 43% | 12 |
| 40 | [png](shots/escape-win__katsu/040-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 48% |  |
| 41 | [png](shots/escape-win__katsu/041-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 48% |  |
| 42 | [png](shots/escape-win__katsu/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 48% |  |
| 43 | [png](shots/escape-win__katsu/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/escape-win__katsu/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 45 | [png](shots/escape-win__katsu/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/escape-win__katsu/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not bread. |  |  |  |
| 47 | [png](shots/escape-win__katsu/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/escape-win__katsu/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/escape-win__katsu/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/escape-win__katsu/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/escape-win__katsu/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/escape-win__katsu/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/escape-win__katsu/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/escape-win__katsu/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/escape-win__katsu/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | [png](shots/escape-win__katsu/056-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 57 | [png](shots/escape-win__katsu/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/escape-win__katsu/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/escape-win__katsu/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/escape-win__katsu/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 48% | 12 |
| 61 | [png](shots/escape-win__katsu/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 52% |  |
| 62 | [png](shots/escape-win__katsu/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:1 |  | 52% |  |
| 63 | [png](shots/escape-win__katsu/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 52% |  |
| 64 | [png](shots/escape-win__katsu/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 52% |  |
| 65 | [png](shots/escape-win__katsu/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 52% |  |
| 66 | [png](shots/escape-win__katsu/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:17 AM. |  | 52% |  |
| 67 | [png](shots/escape-win__katsu/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 52% | 12 |
| 68 | [png](shots/escape-win__katsu/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 58% |  |
| 69 | [png](shots/escape-win__katsu/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 58% |  |
| 70 | [png](shots/escape-win__katsu/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 58% | 12 |
| 71 | [png](shots/escape-win__katsu/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 64% |  |
| 72 | [png](shots/escape-win__katsu/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 64% |  |
| 73 | [png](shots/escape-win__katsu/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 64% |  |
| 74 | [png](shots/escape-win__katsu/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 64% |  |
| 75 | [png](shots/escape-win__katsu/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 64% |  |
| 76 | [png](shots/escape-win__katsu/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 64% | 12 |
| 77 | [png](shots/escape-win__katsu/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 68% |  |
| 78 | [png](shots/escape-win__katsu/078-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 68% |  |
| 79 | [png](shots/escape-win__katsu/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 68% | 12 |
| 80 | [png](shots/escape-win__katsu/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 72% |  |
| 81 | [png](shots/escape-win__katsu/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 72% |  |
| 82 | [png](shots/escape-win__katsu/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 72% |  |
| 83 | [png](shots/escape-win__katsu/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 72% |  |
| 84 | [png](shots/escape-win__katsu/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 72% |  |
| 85 | [png](shots/escape-win__katsu/085-door-door_0.png) | door:0 |  |  | 72% |  |
| 86 | [png](shots/escape-win__katsu/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 72% | 12 |
| 87 | [png](shots/escape-win__katsu/087-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 75% |  |
| 88 | [png](shots/escape-win__katsu/088-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 75% |  |
| 89 | [png](shots/escape-win__katsu/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 75% | 12 |
| 90 | [png](shots/escape-win__katsu/090-door-door_3.png) | door:3 | NANDA: One cup. I'll pour it slow. [fx love-burst] |  | 80% |  |
| 91 | [png](shots/escape-win__katsu/091-genkan-in-genkan_in_0.png) | genkan-in:0 | Her shoes. Lined up to the millimetre. |  |  |  |
| 92 | [png](shots/escape-win__katsu/092-genkan-in-genkan_in_1.png) | genkan-in:1 | Men's slippers. Already set out. |  |  |  |
| 93 | [png](shots/escape-win__katsu/093-genkan-in-genkan_in_2.png) | genkan-in:2 | A tiny shrine. Inside: a circuit you built. |  |  |  |
| 94 | [png](shots/escape-win__katsu/094-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: おかえり。Welcome home. I mean my home. I mean our home. Same thing. | ただいま ♥ +4; Thanks for having me ♥ +1; This isn't my home ♡ −5 | 80% | 12 |
| 95 | [png](shots/escape-win__katsu/095-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: You said it! ただいま! I'm keeping that. [fx love-burst] |  | 86% |  |
| 96 | [png](shots/escape-win__katsu/096-genkan-talk-genkan_talk_1.png) | genkan-talk:1 | NANDA: Slippers on. I bought them in your size. Last year. Before we met. Don't  |  | 86% |  |
| 97 | [png](shots/escape-win__katsu/097-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I made a list of things you like. Forty things. I'm number one. I checked | You're number one ♥ +3; What's number two? ♥ +1; Burn the list ♡ −5 | 86% | 12 |
| 98 | [png](shots/escape-win__katsu/098-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I knew it. The list is never wrong. [fx love-burst] |  | 90% |  |
| 99 | [png](shots/escape-win__katsu/099-genkan-talk-genkan_talk_3.png) | genkan-talk:3 | NANDA: Kitchen's this way. Don't open the other doors. They're shy. |  | 90% |  |
| 100 | [png](shots/escape-win__katsu/100-cup-cup_0.png) | cup:0 | NANDA: I made tamagoyaki. For no reason. Eat. | Eat it all ♥ +2; Eat a little ♥ +1; I'm not hungry ♡ −3 | 90% | 12 |
| 101 | [png](shots/escape-win__katsu/101-cup-cup_0.png) | cup:0 | NANDA: See? You needed me. [fx love-burst] |  | 93% |  |
| 102 | [png](shots/escape-win__katsu/102-cup-cup_1.png) | cup:1 | Third teacup. Nobody poured it. Tamagoyaki on its saucer. |  | 93% |  |
| 103 | [png](shots/escape-win__katsu/103-cup-cup_2.png) | cup:2 | MC: Who's the third cup for? |  | 93% |  |
| 104 | [png](shots/escape-win__katsu/104-cup-cup_3.png) | cup:3 | NANDA: For Input B. Silly. It's always three of us. | Drink ♥ +3; Hold the cup ♥ +1; Stand up ♡ −3 | 93% | 12 |
| 105 | [png](shots/escape-win__katsu/105-cup-cup_3.png) | cup:3 | NANDA: Sit. The tea isn't finished. [fx hate-quake] |  | 88% |  |
| 106 | [png](shots/escape-win__katsu/106-unknown-unknown_0.png) | unknown:0 | You stand. The floor tilts a little. |  |  |  |
| 107 | [png](shots/escape-win__katsu/107-unknown-unknown_1.png) | unknown:1 | Under the table: a floor hatch. Too big for storage. | Open the hatch; Gently open the hatch ♡ |  |  |
| 108 | [png](shots/escape-win__katsu/108-unknown-unknown_2.png) | unknown:2 | A steep wooden ladder. Down into the dark. | Climb down; Tippy-toe down ♡ |  |  |
| 109 | [png](shots/escape-win__katsu/109-escape-escape_0.png) | escape:0 | Concrete. One bulb. Rain at a high window. | Look at the shelves; Peek at the pretty shelves ♡ |  |  |
| 110 | [png](shots/escape-win__katsu/110-escape-escape_1.png) | escape:1 | Jars on the shelves. Each one: a date, a name. |  |  |  |
| 111 | [png](shots/escape-win__katsu/111-escape-escape_2.png) | escape:2 | The dates go back years. The names are all different. |  |  |  |
| 112 | [png](shots/escape-win__katsu/112-escape-escape_3.png) | escape:3 | Bento boxes, one per day. Your name on each. Untouched. |  |  |  |
| 113 | [png](shots/escape-win__katsu/113-escape-escape_4.png) | escape:4 | The oldest is dated before you met. |  |  |  |
| 114 | [png](shots/escape-win__katsu/114-escape-escape_5.png) | escape:5 | A mortar and a mallet. One fresh mochi. Hers only. | Keep looking; Keep looking… and nothing else |  |  |
| 115 | [png](shots/escape-win__katsu/115-escape-escape_6.png) | escape:6 | Newest jar: today, your name, tamagoyaki. Lid off. Empty. |  |  |  |
| 116 | [png](shots/escape-win__katsu/116-escape-escape_8.png) | escape:8 |  |  |  |  |
| 117 | [png](shots/escape-win__katsu/117-escape-escape_9.png) | escape:9 |  |  |  |  |
| 118 | [png](shots/escape-win__katsu/118-escape-escape_10.png) | escape:10 |  |  |  |  |
| 119 | [png](shots/escape-win__katsu/119-escape-escape_11.png) | escape:11 |  |  |  |  |
| 120 | [png](shots/escape-win__katsu/120-escape-escape_12.png) | escape:12 | Minutes gone. A clock upstairs chimed. You lost count. |  |  |  |
| 121 | [png](shots/escape-win__katsu/121-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS LOCKED pins 0/8 |  |  | 40s |
| 122 | [png](shots/escape-win__katsu/122-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS LOCKED pins 4/8 |  |  | 38s |
| 123 | [png](shots/escape-win__katsu/123-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS OPEN pins 8/8 |  |  | 36s |
| 124 | [png](shots/escape-win__katsu/124-escape-win-escape_win_0.png) | escape-win:0 | She's waiting at the outside door. |  | 84% |  |
| 125 | [png](shots/escape-win__katsu/125-escape-win-escape_win_1.png) | escape-win:1 | NANDA: You took the long way. |  | 84% |  |
| 126 | [png](shots/escape-win__katsu/126-escape-win-escape_win_2.png) | escape-win:2 | NANDA: Home is warm, and sweet. |  | 84% |  |
| 127 | [png](shots/escape-win__katsu/127-escape-win-escape_win_3.png) | escape-win:3 | NANDA: Sleep now. You're mine to keep. |  | 84% |  |
| 128 | [png](shots/escape-win__katsu/128-escape-win-escape_win_4.png) | escape-win:4 |  |  |  |  |
| 129 | [png](shots/escape-win__katsu/129-escape-win-escape_win_5.png) | escape-win:5 | NANDA: Mine. |  |  |  |
| 130 | [png](shots/escape-win__katsu/130-escape-win-escape_win_6.png) | escape-win:6 | [END CARD] GAME OVER 84% |  |  |  |
| 131 | [png](shots/escape-win__katsu/131-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### escape-timeout__butter (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/escape-timeout__butter/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/escape-timeout__butter/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 2 | [png](shots/escape-timeout__butter/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/escape-timeout__butter/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/escape-timeout__butter/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/escape-timeout__butter/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/escape-timeout__butter/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/escape-timeout__butter/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/escape-timeout__butter/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 9 | [png](shots/escape-timeout__butter/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/escape-timeout__butter/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/escape-timeout__butter/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:16 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/escape-timeout__butter/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/escape-timeout__butter/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/escape-timeout__butter/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/escape-timeout__butter/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/escape-timeout__butter/016-park-park_4.png) | park:4 | NANDA: It's 3:16 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/escape-timeout__butter/017-park-park_4.png) | park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 18 | [png](shots/escape-timeout__butter/018-errand-shop-errand_shop_0.png) | errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 19 | [png](shots/escape-timeout__butter/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 20 | [png](shots/escape-timeout__butter/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/escape-timeout__butter/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 22 | [png](shots/escape-timeout__butter/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 23 | [png](shots/escape-timeout__butter/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 24 | [png](shots/escape-timeout__butter/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 25 | [png](shots/escape-timeout__butter/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 26 | [png](shots/escape-timeout__butter/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 27 | [png](shots/escape-timeout__butter/027-hungry-hungry_0.png) | hungry:0 | NANDA: With naan! You know me so well. ♡ [fx love-burst] |  | 36% |  |
| 28 | [png](shots/escape-timeout__butter/028-hungry-hungry_1.png) | hungry:1 | NANDA: Tear the naan. Give me the soft part. Always the soft part. |  | 36% |  |
| 29 | [png](shots/escape-timeout__butter/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 36% | 12 |
| 30 | [png](shots/escape-timeout__butter/030-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 41% |  |
| 31 | [png](shots/escape-timeout__butter/031-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 41% |  |
| 32 | [png](shots/escape-timeout__butter/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 41% | 11 |
| 33 | [png](shots/escape-timeout__butter/033-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 45% |  |
| 34 | [png](shots/escape-timeout__butter/034-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 45% |  |
| 35 | [png](shots/escape-timeout__butter/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:16 AM, a sleepy night, and this is a cl |  | 45% |  |
| 36 | [png](shots/escape-timeout__butter/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 45% |  |
| 37 | [png](shots/escape-timeout__butter/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 45% |  |
| 38 | [png](shots/escape-timeout__butter/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 45% |  |
| 39 | [png](shots/escape-timeout__butter/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 45% | 12 |
| 40 | [png](shots/escape-timeout__butter/040-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 49% |  |
| 41 | [png](shots/escape-timeout__butter/041-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 49% |  |
| 42 | [png](shots/escape-timeout__butter/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 49% |  |
| 43 | [png](shots/escape-timeout__butter/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/escape-timeout__butter/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 45 | [png](shots/escape-timeout__butter/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/escape-timeout__butter/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not our lunch. |  |  |  |
| 47 | [png](shots/escape-timeout__butter/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/escape-timeout__butter/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/escape-timeout__butter/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/escape-timeout__butter/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/escape-timeout__butter/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/escape-timeout__butter/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/escape-timeout__butter/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/escape-timeout__butter/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/escape-timeout__butter/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | [png](shots/escape-timeout__butter/056-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 57 | [png](shots/escape-timeout__butter/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/escape-timeout__butter/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/escape-timeout__butter/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/escape-timeout__butter/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 49% | 12 |
| 61 | [png](shots/escape-timeout__butter/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 54% |  |
| 62 | [png](shots/escape-timeout__butter/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:1 |  | 54% |  |
| 63 | [png](shots/escape-timeout__butter/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 54% |  |
| 64 | [png](shots/escape-timeout__butter/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 54% |  |
| 65 | [png](shots/escape-timeout__butter/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 54% |  |
| 66 | [png](shots/escape-timeout__butter/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:17 AM. |  | 54% |  |
| 67 | [png](shots/escape-timeout__butter/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 54% | 12 |
| 68 | [png](shots/escape-timeout__butter/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 59% |  |
| 69 | [png](shots/escape-timeout__butter/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 59% |  |
| 70 | [png](shots/escape-timeout__butter/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 59% | 12 |
| 71 | [png](shots/escape-timeout__butter/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 65% |  |
| 72 | [png](shots/escape-timeout__butter/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 65% |  |
| 73 | [png](shots/escape-timeout__butter/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 65% |  |
| 74 | [png](shots/escape-timeout__butter/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 65% |  |
| 75 | [png](shots/escape-timeout__butter/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 65% |  |
| 76 | [png](shots/escape-timeout__butter/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 65% | 12 |
| 77 | [png](shots/escape-timeout__butter/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 70% |  |
| 78 | [png](shots/escape-timeout__butter/078-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 70% |  |
| 79 | [png](shots/escape-timeout__butter/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 70% | 11 |
| 80 | [png](shots/escape-timeout__butter/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 74% |  |
| 81 | [png](shots/escape-timeout__butter/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 74% |  |
| 82 | [png](shots/escape-timeout__butter/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 74% |  |
| 83 | [png](shots/escape-timeout__butter/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 74% |  |
| 84 | [png](shots/escape-timeout__butter/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 74% |  |
| 85 | [png](shots/escape-timeout__butter/085-door-door_0.png) | door:0 |  |  | 74% |  |
| 86 | [png](shots/escape-timeout__butter/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 74% | 12 |
| 87 | [png](shots/escape-timeout__butter/087-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 77% |  |
| 88 | [png](shots/escape-timeout__butter/088-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 77% |  |
| 89 | [png](shots/escape-timeout__butter/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 77% | 12 |
| 90 | [png](shots/escape-timeout__butter/090-door-door_3.png) | door:3 | NANDA: One cup. I'll pour it slow. [fx love-burst] |  | 81% |  |
| 91 | [png](shots/escape-timeout__butter/091-genkan-in-genkan_in_0.png) | genkan-in:0 | Her shoes. Lined up to the millimetre. |  |  |  |
| 92 | [png](shots/escape-timeout__butter/092-genkan-in-genkan_in_1.png) | genkan-in:1 | Men's slippers. Already set out. |  |  |  |
| 93 | [png](shots/escape-timeout__butter/093-genkan-in-genkan_in_2.png) | genkan-in:2 | A tiny shrine. Inside: a circuit you built. |  |  |  |
| 94 | [png](shots/escape-timeout__butter/094-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: おかえり。Welcome home. I mean my home. I mean our home. Same thing. | ただいま ♥ +4; Thanks for having me ♥ +1; This isn't my home ♡ −5 | 81% | 12 |
| 95 | [png](shots/escape-timeout__butter/095-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: You said it! ただいま! I'm keeping that. [fx love-burst] |  | 87% |  |
| 96 | [png](shots/escape-timeout__butter/096-genkan-talk-genkan_talk_1.png) | genkan-talk:1 | NANDA: Slippers on. I bought them in your size. Last year. Before we met. Don't  |  | 87% |  |
| 97 | [png](shots/escape-timeout__butter/097-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I made a list of things you like. Forty things. I'm number one. I checked | You're number one ♥ +3; What's number two? ♥ +1; Burn the list ♡ −5 | 87% | 12 |
| 98 | [png](shots/escape-timeout__butter/098-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I knew it. The list is never wrong. [fx love-burst] |  | 91% |  |
| 99 | [png](shots/escape-timeout__butter/099-genkan-talk-genkan_talk_3.png) | genkan-talk:3 | NANDA: Kitchen's this way. Don't open the other doors. They're shy. |  | 91% |  |
| 100 | [png](shots/escape-timeout__butter/100-cup-cup_0.png) | cup:0 | NANDA: I made tamagoyaki. For no reason. Eat. | Eat it all ♥ +2; Eat a little ♥ +1; I'm not hungry ♡ −3 | 91% | 12 |
| 101 | [png](shots/escape-timeout__butter/101-cup-cup_0.png) | cup:0 | NANDA: See? You needed me. [fx love-burst] |  | 94% |  |
| 102 | [png](shots/escape-timeout__butter/102-cup-cup_1.png) | cup:1 | Third teacup. Nobody poured it. Tamagoyaki on its saucer. |  | 94% |  |
| 103 | [png](shots/escape-timeout__butter/103-cup-cup_2.png) | cup:2 | MC: Who's the third cup for? |  | 94% |  |
| 104 | [png](shots/escape-timeout__butter/104-cup-cup_3.png) | cup:3 | NANDA: For Input B. Silly. It's always three of us. | Drink ♥ +3; Hold the cup ♥ +1; Stand up ♡ −3 | 94% | 12 |
| 105 | [png](shots/escape-timeout__butter/105-cup-cup_3.png) | cup:3 | NANDA: Sit. The tea isn't finished. [fx hate-quake] |  | 90% |  |
| 106 | [png](shots/escape-timeout__butter/106-unknown-unknown_0.png) | unknown:0 | You stand. The floor tilts a little. |  |  |  |
| 107 | [png](shots/escape-timeout__butter/107-unknown-unknown_1.png) | unknown:1 | Under the table: a floor hatch. Too big for storage. | Open the hatch; Gently open the hatch ♡ |  |  |
| 108 | [png](shots/escape-timeout__butter/108-unknown-unknown_2.png) | unknown:2 | A steep wooden ladder. Down into the dark. | Climb down; Tippy-toe down ♡ |  |  |
| 109 | [png](shots/escape-timeout__butter/109-escape-escape_0.png) | escape:0 | Concrete. One bulb. Rain at a high window. | Look at the shelves; Peek at the pretty shelves ♡ |  |  |
| 110 | [png](shots/escape-timeout__butter/110-escape-escape_1.png) | escape:1 | Jars on the shelves. Each one: a date, a name. |  |  |  |
| 111 | [png](shots/escape-timeout__butter/111-escape-escape_2.png) | escape:2 | The dates go back years. The names are all different. |  |  |  |
| 112 | [png](shots/escape-timeout__butter/112-escape-escape_3.png) | escape:3 | Bento boxes, one per day. Your name on each. Untouched. |  |  |  |
| 113 | [png](shots/escape-timeout__butter/113-escape-escape_4.png) | escape:4 | The oldest is dated before you met. |  |  |  |
| 114 | [png](shots/escape-timeout__butter/114-escape-escape_5.png) | escape:5 | A mortar and a mallet. One fresh mochi. Hers only. | Keep looking; Keep looking… and nothing else |  |  |
| 115 | [png](shots/escape-timeout__butter/115-escape-escape_6.png) | escape:6 | Newest jar: today, your name, tamagoyaki. Lid off. Empty. |  |  |  |
| 116 | [png](shots/escape-timeout__butter/116-escape-escape_8.png) | escape:8 |  |  |  |  |
| 117 | [png](shots/escape-timeout__butter/117-escape-escape_9.png) | escape:9 |  |  |  |  |
| 118 | [png](shots/escape-timeout__butter/118-escape-escape_10.png) | escape:10 |  |  |  |  |
| 119 | [png](shots/escape-timeout__butter/119-escape-escape_11.png) | escape:11 |  |  |  |  |
| 120 | [png](shots/escape-timeout__butter/120-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS LOCKED pins 0/8 |  |  | 40s |
| 121 | [png](shots/escape-timeout__butter/121-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS LOCKED pins 0/8 |  |  | 10s |
| 122 | [png](shots/escape-timeout__butter/122-escape-timeout-escape_timeout_0.png) | escape-timeout:0 | The ladder creaks. She's coming down. |  | 91% |  |
| 123 | [png](shots/escape-timeout__butter/123-escape-timeout-escape_timeout_1.png) | escape-timeout:1 |  |  |  |  |
| 124 | [png](shots/escape-timeout__butter/124-escape-timeout-escape_timeout_2.png) | escape-timeout:2 | You wake at the tea table. Four cups now. |  | 91% |  |
| 125 | [png](shots/escape-timeout__butter/125-escape-timeout-escape_timeout_3.png) | escape-timeout:3 | She holds out the tamagoyaki. You eat. |  | 91% |  |
| 126 | [png](shots/escape-timeout__butter/126-escape-timeout-escape_timeout_4.png) | escape-timeout:4 | NANDA: 甘いでしょ。…ね？ |  | 91% |  |
| 127 | [png](shots/escape-timeout__butter/127-escape-timeout-escape_timeout_5.png) | escape-timeout:5 | NANDA: One sweet bite… |  | 91% |  |
| 128 | [png](shots/escape-timeout__butter/128-escape-timeout-escape_timeout_6.png) | escape-timeout:6 | NANDA: …then sleep. You're mine to keep. |  | 91% |  |
| 129 | [png](shots/escape-timeout__butter/129-escape-timeout-escape_timeout_7.png) | escape-timeout:7 | [END CARD] GAME OVER 91% |  | 91% |  |
| 130 | [png](shots/escape-timeout__butter/130-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### escape-timeout__katsu (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/escape-timeout__katsu/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/escape-timeout__katsu/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 2 | [png](shots/escape-timeout__katsu/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/escape-timeout__katsu/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/escape-timeout__katsu/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/escape-timeout__katsu/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/escape-timeout__katsu/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/escape-timeout__katsu/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/escape-timeout__katsu/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 11 |
| 9 | [png](shots/escape-timeout__katsu/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/escape-timeout__katsu/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/escape-timeout__katsu/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:16 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/escape-timeout__katsu/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/escape-timeout__katsu/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 11 |
| 14 | [png](shots/escape-timeout__katsu/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/escape-timeout__katsu/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/escape-timeout__katsu/016-park-park_4.png) | park:4 | NANDA: It's 3:16 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/escape-timeout__katsu/017-park-park_4.png) | park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 18 | [png](shots/escape-timeout__katsu/018-errand-shop-errand_shop_0.png) | errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 19 | [png](shots/escape-timeout__katsu/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 20 | [png](shots/escape-timeout__katsu/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/escape-timeout__katsu/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 22 | [png](shots/escape-timeout__katsu/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 23 | [png](shots/escape-timeout__katsu/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 24 | [png](shots/escape-timeout__katsu/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 25 | [png](shots/escape-timeout__katsu/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 26 | [png](shots/escape-timeout__katsu/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 27 | [png](shots/escape-timeout__katsu/027-hungry-hungry_0.png) | hungry:0 | NANDA: Crunchy! You chose. I'll pretend I did. |  | 35% |  |
| 28 | [png](shots/escape-timeout__katsu/028-hungry-hungry_1.png) | hungry:1 | NANDA: Cut the katsu. Blow on it. I like it when you work for me. |  | 35% |  |
| 29 | [png](shots/escape-timeout__katsu/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 35% | 12 |
| 30 | [png](shots/escape-timeout__katsu/030-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 39% |  |
| 31 | [png](shots/escape-timeout__katsu/031-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 39% |  |
| 32 | [png](shots/escape-timeout__katsu/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 39% | 12 |
| 33 | [png](shots/escape-timeout__katsu/033-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 43% |  |
| 34 | [png](shots/escape-timeout__katsu/034-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 43% |  |
| 35 | [png](shots/escape-timeout__katsu/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:17 AM, a sleepy night, and this is a cl |  | 43% |  |
| 36 | [png](shots/escape-timeout__katsu/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 43% |  |
| 37 | [png](shots/escape-timeout__katsu/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 43% |  |
| 38 | [png](shots/escape-timeout__katsu/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 43% |  |
| 39 | [png](shots/escape-timeout__katsu/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 43% | 12 |
| 40 | [png](shots/escape-timeout__katsu/040-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 48% |  |
| 41 | [png](shots/escape-timeout__katsu/041-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 48% |  |
| 42 | [png](shots/escape-timeout__katsu/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 48% |  |
| 43 | [png](shots/escape-timeout__katsu/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/escape-timeout__katsu/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 45 | [png](shots/escape-timeout__katsu/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/escape-timeout__katsu/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not bread. |  |  |  |
| 47 | [png](shots/escape-timeout__katsu/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/escape-timeout__katsu/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/escape-timeout__katsu/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/escape-timeout__katsu/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/escape-timeout__katsu/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/escape-timeout__katsu/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/escape-timeout__katsu/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/escape-timeout__katsu/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/escape-timeout__katsu/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | [png](shots/escape-timeout__katsu/056-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 57 | [png](shots/escape-timeout__katsu/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/escape-timeout__katsu/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/escape-timeout__katsu/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/escape-timeout__katsu/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 48% | 12 |
| 61 | [png](shots/escape-timeout__katsu/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 52% |  |
| 62 | [png](shots/escape-timeout__katsu/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:1 |  | 52% |  |
| 63 | [png](shots/escape-timeout__katsu/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 52% |  |
| 64 | [png](shots/escape-timeout__katsu/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 52% |  |
| 65 | [png](shots/escape-timeout__katsu/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 52% |  |
| 66 | [png](shots/escape-timeout__katsu/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:18 AM. |  | 52% |  |
| 67 | [png](shots/escape-timeout__katsu/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 52% | 11 |
| 68 | [png](shots/escape-timeout__katsu/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 58% |  |
| 69 | [png](shots/escape-timeout__katsu/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 58% |  |
| 70 | [png](shots/escape-timeout__katsu/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 58% | 12 |
| 71 | [png](shots/escape-timeout__katsu/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 64% |  |
| 72 | [png](shots/escape-timeout__katsu/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 64% |  |
| 73 | [png](shots/escape-timeout__katsu/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 64% |  |
| 74 | [png](shots/escape-timeout__katsu/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 64% |  |
| 75 | [png](shots/escape-timeout__katsu/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 64% |  |
| 76 | [png](shots/escape-timeout__katsu/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 64% | 12 |
| 77 | [png](shots/escape-timeout__katsu/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 68% |  |
| 78 | [png](shots/escape-timeout__katsu/078-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 68% |  |
| 79 | [png](shots/escape-timeout__katsu/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 68% | 12 |
| 80 | [png](shots/escape-timeout__katsu/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 72% |  |
| 81 | [png](shots/escape-timeout__katsu/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 72% |  |
| 82 | [png](shots/escape-timeout__katsu/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 72% |  |
| 83 | [png](shots/escape-timeout__katsu/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 72% |  |
| 84 | [png](shots/escape-timeout__katsu/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 72% |  |
| 85 | [png](shots/escape-timeout__katsu/085-door-door_0.png) | door:0 |  |  | 72% |  |
| 86 | [png](shots/escape-timeout__katsu/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 72% | 12 |
| 87 | [png](shots/escape-timeout__katsu/087-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 75% |  |
| 88 | [png](shots/escape-timeout__katsu/088-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 75% |  |
| 89 | [png](shots/escape-timeout__katsu/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 75% | 12 |
| 90 | [png](shots/escape-timeout__katsu/090-door-door_3.png) | door:3 | NANDA: One cup. I'll pour it slow. [fx love-burst] |  | 80% |  |
| 91 | [png](shots/escape-timeout__katsu/091-genkan-in-genkan_in_0.png) | genkan-in:0 | Her shoes. Lined up to the millimetre. |  |  |  |
| 92 | [png](shots/escape-timeout__katsu/092-genkan-in-genkan_in_1.png) | genkan-in:1 | Men's slippers. Already set out. |  |  |  |
| 93 | [png](shots/escape-timeout__katsu/093-genkan-in-genkan_in_2.png) | genkan-in:2 | A tiny shrine. Inside: a circuit you built. |  |  |  |
| 94 | [png](shots/escape-timeout__katsu/094-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: おかえり。Welcome home. I mean my home. I mean our home. Same thing. | ただいま ♥ +4; Thanks for having me ♥ +1; This isn't my home ♡ −5 | 80% | 12 |
| 95 | [png](shots/escape-timeout__katsu/095-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: You said it! ただいま! I'm keeping that. [fx love-burst] |  | 86% |  |
| 96 | [png](shots/escape-timeout__katsu/096-genkan-talk-genkan_talk_1.png) | genkan-talk:1 | NANDA: Slippers on. I bought them in your size. Last year. Before we met. Don't  |  | 86% |  |
| 97 | [png](shots/escape-timeout__katsu/097-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I made a list of things you like. Forty things. I'm number one. I checked | You're number one ♥ +3; What's number two? ♥ +1; Burn the list ♡ −5 | 86% | 12 |
| 98 | [png](shots/escape-timeout__katsu/098-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I knew it. The list is never wrong. [fx love-burst] |  | 90% |  |
| 99 | [png](shots/escape-timeout__katsu/099-genkan-talk-genkan_talk_3.png) | genkan-talk:3 | NANDA: Kitchen's this way. Don't open the other doors. They're shy. |  | 90% |  |
| 100 | [png](shots/escape-timeout__katsu/100-cup-cup_0.png) | cup:0 | NANDA: I made tamagoyaki. For no reason. Eat. | Eat it all ♥ +2; Eat a little ♥ +1; I'm not hungry ♡ −3 | 90% | 12 |
| 101 | [png](shots/escape-timeout__katsu/101-cup-cup_0.png) | cup:0 | NANDA: See? You needed me. [fx love-burst] |  | 93% |  |
| 102 | [png](shots/escape-timeout__katsu/102-cup-cup_1.png) | cup:1 | Third teacup. Nobody poured it. Tamagoyaki on its saucer. |  | 93% |  |
| 103 | [png](shots/escape-timeout__katsu/103-cup-cup_2.png) | cup:2 | MC: Who's the third cup for? |  | 93% |  |
| 104 | [png](shots/escape-timeout__katsu/104-cup-cup_3.png) | cup:3 | NANDA: For Input B. Silly. It's always three of us. | Drink ♥ +3; Hold the cup ♥ +1; Stand up ♡ −3 | 93% | 12 |
| 105 | [png](shots/escape-timeout__katsu/105-cup-cup_3.png) | cup:3 | NANDA: Sit. The tea isn't finished. [fx hate-quake] |  | 88% |  |
| 106 | [png](shots/escape-timeout__katsu/106-unknown-unknown_0.png) | unknown:0 | You stand. The floor tilts a little. |  |  |  |
| 107 | [png](shots/escape-timeout__katsu/107-unknown-unknown_1.png) | unknown:1 | Under the table: a floor hatch. Too big for storage. | Open the hatch; Gently open the hatch ♡ |  |  |
| 108 | [png](shots/escape-timeout__katsu/108-unknown-unknown_2.png) | unknown:2 | A steep wooden ladder. Down into the dark. | Climb down; Tippy-toe down ♡ |  |  |
| 109 | [png](shots/escape-timeout__katsu/109-escape-escape_0.png) | escape:0 | Concrete. One bulb. Rain at a high window. | Look at the shelves; Peek at the pretty shelves ♡ |  |  |
| 110 | [png](shots/escape-timeout__katsu/110-escape-escape_1.png) | escape:1 | Jars on the shelves. Each one: a date, a name. |  |  |  |
| 111 | [png](shots/escape-timeout__katsu/111-escape-escape_2.png) | escape:2 | The dates go back years. The names are all different. |  |  |  |
| 112 | [png](shots/escape-timeout__katsu/112-escape-escape_3.png) | escape:3 | Bento boxes, one per day. Your name on each. Untouched. |  |  |  |
| 113 | [png](shots/escape-timeout__katsu/113-escape-escape_4.png) | escape:4 | The oldest is dated before you met. |  |  |  |
| 114 | [png](shots/escape-timeout__katsu/114-escape-escape_5.png) | escape:5 | A mortar and a mallet. One fresh mochi. Hers only. | Keep looking; Keep looking… and nothing else |  |  |
| 115 | [png](shots/escape-timeout__katsu/115-escape-escape_6.png) | escape:6 | Newest jar: today, your name, tamagoyaki. Lid off. Empty. |  |  |  |
| 116 | [png](shots/escape-timeout__katsu/116-escape-escape_8.png) | escape:8 |  |  |  |  |
| 117 | [png](shots/escape-timeout__katsu/117-escape-escape_9.png) | escape:9 |  |  |  |  |
| 118 | [png](shots/escape-timeout__katsu/118-escape-escape_10.png) | escape:10 |  |  |  |  |
| 119 | [png](shots/escape-timeout__katsu/119-escape-escape_11.png) | escape:11 |  |  |  |  |
| 120 | [png](shots/escape-timeout__katsu/120-escape-escape_12.png) | escape:12 | Minutes gone. A clock upstairs chimed. You lost count. |  |  |  |
| 121 | [png](shots/escape-timeout__katsu/121-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS LOCKED pins 0/8 |  |  | 40s |
| 122 | [png](shots/escape-timeout__katsu/122-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS LOCKED pins 0/8 |  |  | 10s |
| 123 | [png](shots/escape-timeout__katsu/123-escape-timeout-escape_timeout_0.png) | escape-timeout:0 | The ladder creaks. She's coming down. |  | 90% |  |
| 124 | [png](shots/escape-timeout__katsu/124-escape-timeout-escape_timeout_1.png) | escape-timeout:1 |  |  |  |  |
| 125 | [png](shots/escape-timeout__katsu/125-escape-timeout-escape_timeout_2.png) | escape-timeout:2 | You wake at the tea table. Four cups now. |  | 90% |  |
| 126 | [png](shots/escape-timeout__katsu/126-escape-timeout-escape_timeout_3.png) | escape-timeout:3 | She holds out the tamagoyaki. You eat. |  | 90% |  |
| 127 | [png](shots/escape-timeout__katsu/127-escape-timeout-escape_timeout_4.png) | escape-timeout:4 | NANDA: 甘いでしょ。…ね？ |  | 90% |  |
| 128 | [png](shots/escape-timeout__katsu/128-escape-timeout-escape_timeout_5.png) | escape-timeout:5 | NANDA: One sweet bite… |  | 90% |  |
| 129 | [png](shots/escape-timeout__katsu/129-escape-timeout-escape_timeout_6.png) | escape-timeout:6 | NANDA: …then sleep. You're mine to keep. |  | 90% |  |
| 130 | [png](shots/escape-timeout__katsu/130-escape-timeout-escape_timeout_7.png) | escape-timeout:7 | [END CARD] GAME OVER 90% |  | 90% |  |
| 131 | [png](shots/escape-timeout__katsu/131-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### leave-fu__butter (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/leave-fu__butter/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/leave-fu__butter/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 2 | [png](shots/leave-fu__butter/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/leave-fu__butter/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/leave-fu__butter/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/leave-fu__butter/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/leave-fu__butter/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/leave-fu__butter/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/leave-fu__butter/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 9 | [png](shots/leave-fu__butter/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/leave-fu__butter/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/leave-fu__butter/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:20 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/leave-fu__butter/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/leave-fu__butter/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/leave-fu__butter/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/leave-fu__butter/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/leave-fu__butter/016-park-park_4.png) | park:4 | NANDA: It's 3:20 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/leave-fu__butter/017-park-park_4.png) | park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 18 | [png](shots/leave-fu__butter/018-errand-shop-errand_shop_0.png) | errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 19 | [png](shots/leave-fu__butter/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 20 | [png](shots/leave-fu__butter/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/leave-fu__butter/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 22 | [png](shots/leave-fu__butter/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 23 | [png](shots/leave-fu__butter/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 24 | [png](shots/leave-fu__butter/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 25 | [png](shots/leave-fu__butter/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 26 | [png](shots/leave-fu__butter/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 27 | [png](shots/leave-fu__butter/027-hungry-hungry_0.png) | hungry:0 | NANDA: With naan! You know me so well. ♡ [fx love-burst] |  | 36% |  |
| 28 | [png](shots/leave-fu__butter/028-hungry-hungry_1.png) | hungry:1 | NANDA: Tear the naan. Give me the soft part. Always the soft part. |  | 36% |  |
| 29 | [png](shots/leave-fu__butter/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 36% | 12 |
| 30 | [png](shots/leave-fu__butter/030-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 41% |  |
| 31 | [png](shots/leave-fu__butter/031-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 41% |  |
| 32 | [png](shots/leave-fu__butter/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 41% | 12 |
| 33 | [png](shots/leave-fu__butter/033-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 45% |  |
| 34 | [png](shots/leave-fu__butter/034-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 45% |  |
| 35 | [png](shots/leave-fu__butter/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:20 AM, a sleepy night, and this is a cl |  | 45% |  |
| 36 | [png](shots/leave-fu__butter/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 45% |  |
| 37 | [png](shots/leave-fu__butter/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 45% |  |
| 38 | [png](shots/leave-fu__butter/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 45% |  |
| 39 | [png](shots/leave-fu__butter/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 45% | 12 |
| 40 | [png](shots/leave-fu__butter/040-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 49% |  |
| 41 | [png](shots/leave-fu__butter/041-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 49% |  |
| 42 | [png](shots/leave-fu__butter/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 49% |  |
| 43 | [png](shots/leave-fu__butter/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/leave-fu__butter/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 45 | [png](shots/leave-fu__butter/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/leave-fu__butter/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not our lunch. |  |  |  |
| 47 | [png](shots/leave-fu__butter/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/leave-fu__butter/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/leave-fu__butter/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/leave-fu__butter/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/leave-fu__butter/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/leave-fu__butter/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/leave-fu__butter/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/leave-fu__butter/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/leave-fu__butter/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | [png](shots/leave-fu__butter/056-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 57 | [png](shots/leave-fu__butter/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/leave-fu__butter/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/leave-fu__butter/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/leave-fu__butter/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 49% | 11 |
| 61 | [png](shots/leave-fu__butter/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 54% |  |
| 62 | [png](shots/leave-fu__butter/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:2 |  | 54% |  |
| 63 | [png](shots/leave-fu__butter/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 54% |  |
| 64 | [png](shots/leave-fu__butter/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 54% |  |
| 65 | [png](shots/leave-fu__butter/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 54% |  |
| 66 | [png](shots/leave-fu__butter/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:21 AM. |  | 54% |  |
| 67 | [png](shots/leave-fu__butter/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 54% | 12 |
| 68 | [png](shots/leave-fu__butter/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 59% |  |
| 69 | [png](shots/leave-fu__butter/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 59% |  |
| 70 | [png](shots/leave-fu__butter/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 59% | 12 |
| 71 | [png](shots/leave-fu__butter/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 65% |  |
| 72 | [png](shots/leave-fu__butter/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 65% |  |
| 73 | [png](shots/leave-fu__butter/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 65% |  |
| 74 | [png](shots/leave-fu__butter/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 65% |  |
| 75 | [png](shots/leave-fu__butter/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 65% |  |
| 76 | [png](shots/leave-fu__butter/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 65% | 12 |
| 77 | [png](shots/leave-fu__butter/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 70% |  |
| 78 | [png](shots/leave-fu__butter/078-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 70% |  |
| 79 | [png](shots/leave-fu__butter/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 70% | 12 |
| 80 | [png](shots/leave-fu__butter/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 74% |  |
| 81 | [png](shots/leave-fu__butter/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 74% |  |
| 82 | [png](shots/leave-fu__butter/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 74% |  |
| 83 | [png](shots/leave-fu__butter/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 74% |  |
| 84 | [png](shots/leave-fu__butter/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 74% |  |
| 85 | [png](shots/leave-fu__butter/085-door-door_0.png) | door:0 |  |  | 74% |  |
| 86 | [png](shots/leave-fu__butter/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 74% | 12 |
| 87 | [png](shots/leave-fu__butter/087-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 77% |  |
| 88 | [png](shots/leave-fu__butter/088-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 77% |  |
| 89 | [png](shots/leave-fu__butter/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 77% | 12 |
| 90 | [png](shots/leave-fu__butter/090-door-door_3.png) | door:3 | NANDA: …Goodnight? It's only 3:22 AM. [fx hate-quake] |  | 72% |  |
| 91 | [png](shots/leave-fu__butter/091-leave-leave_0.png) | leave:0 | NANDA: Leaving is not an option. |  | 72% |  |
| 92 | [png](shots/leave-fu__butter/092-leave-leave_1.png) | leave:1 | XOR Coffee. 7:00 AM. |  | 72% |  |
| 93 | [png](shots/leave-fu__butter/093-leave-leave_2.png) | leave:2 | NANDA: He wakes at 7:00. | Good morning, Nanda ♥ +2; Who's 'he'? ♥ +1; Stop following me ♡ −3 | 72% | 12 |
| 94 | [png](shots/leave-fu__butter/094-leave-leave_2.png) | leave:2 | NANDA: Good morning! Same as yesterday. Same as always. [fx love-burst] |  | 75% |  |
| 95 | [png](shots/leave-fu__butter/095-leave-leave_3.png) | leave:3 | NANDA: From now on… can we be fORever? | uhmmm yeah ig ♥ +1; Forever sounds long ♥ +1; FUCK YOU. I'm leaving ♡ −5 | 75% | 12 |
| 96 | [png](shots/leave-fu__butter/096-leave-leave_3.png) | leave:3 | NANDA: だめ。You already said forever. I heard it. [fx hate-quake] |  | 68% |  |
| 97 | [png](shots/leave-fu__butter/097-leave-fu-leave_fu_0.png) | leave-fu:0 | Her hand rises. Time freezes. The café turns. |  | 68% |  |
| 98 | [png](shots/leave-fu__butter/098-leave-fu-leave_fu_1.png) | leave-fu:1 | NANDA: You said leave. I heard 'lea—'. |  | 68% |  |
| 99 | [png](shots/leave-fu__butter/099-leave-fu-leave_fu_2.png) | leave-fu:2 | CROWD: fORever and ever |  | 68% |  |
| 100 | [png](shots/leave-fu__butter/100-leave-fu-leave_fu_3.png) | leave-fu:3 | CROWD: fORever and ever and ever |  | 68% |  |
| 101 | [png](shots/leave-fu__butter/101-leave-fu-leave_fu_4.png) | leave-fu:4 | [END CARD] GAME OVER 68% |  | 68% |  |
| 102 | [png](shots/leave-fu__butter/102-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### leave-fu__katsu (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/leave-fu__katsu/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/leave-fu__katsu/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 2 | [png](shots/leave-fu__katsu/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/leave-fu__katsu/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/leave-fu__katsu/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/leave-fu__katsu/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/leave-fu__katsu/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/leave-fu__katsu/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/leave-fu__katsu/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 9 | [png](shots/leave-fu__katsu/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/leave-fu__katsu/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/leave-fu__katsu/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:20 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/leave-fu__katsu/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/leave-fu__katsu/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/leave-fu__katsu/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/leave-fu__katsu/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/leave-fu__katsu/016-park-park_4.png) | park:4 | NANDA: It's 3:21 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/leave-fu__katsu/017-park-park_4.png) | park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 18 | [png](shots/leave-fu__katsu/018-errand-shop-errand_shop_0.png) | errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 19 | [png](shots/leave-fu__katsu/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 20 | [png](shots/leave-fu__katsu/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/leave-fu__katsu/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 22 | [png](shots/leave-fu__katsu/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 23 | [png](shots/leave-fu__katsu/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 24 | [png](shots/leave-fu__katsu/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 25 | [png](shots/leave-fu__katsu/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 26 | [png](shots/leave-fu__katsu/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 27 | [png](shots/leave-fu__katsu/027-hungry-hungry_0.png) | hungry:0 | NANDA: Crunchy! You chose. I'll pretend I did. |  | 35% |  |
| 28 | [png](shots/leave-fu__katsu/028-hungry-hungry_1.png) | hungry:1 | NANDA: Cut the katsu. Blow on it. I like it when you work for me. |  | 35% |  |
| 29 | [png](shots/leave-fu__katsu/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 35% | 12 |
| 30 | [png](shots/leave-fu__katsu/030-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 39% |  |
| 31 | [png](shots/leave-fu__katsu/031-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 39% |  |
| 32 | [png](shots/leave-fu__katsu/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 39% | 12 |
| 33 | [png](shots/leave-fu__katsu/033-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 43% |  |
| 34 | [png](shots/leave-fu__katsu/034-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 43% |  |
| 35 | [png](shots/leave-fu__katsu/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:21 AM, a sleepy night, and this is a cl |  | 43% |  |
| 36 | [png](shots/leave-fu__katsu/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 43% |  |
| 37 | [png](shots/leave-fu__katsu/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 43% |  |
| 38 | [png](shots/leave-fu__katsu/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 43% |  |
| 39 | [png](shots/leave-fu__katsu/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 43% | 12 |
| 40 | [png](shots/leave-fu__katsu/040-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 48% |  |
| 41 | [png](shots/leave-fu__katsu/041-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 48% |  |
| 42 | [png](shots/leave-fu__katsu/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 48% |  |
| 43 | [png](shots/leave-fu__katsu/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/leave-fu__katsu/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 45 | [png](shots/leave-fu__katsu/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/leave-fu__katsu/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not bread. |  |  |  |
| 47 | [png](shots/leave-fu__katsu/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/leave-fu__katsu/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/leave-fu__katsu/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/leave-fu__katsu/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/leave-fu__katsu/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/leave-fu__katsu/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/leave-fu__katsu/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/leave-fu__katsu/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/leave-fu__katsu/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | [png](shots/leave-fu__katsu/056-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 57 | [png](shots/leave-fu__katsu/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/leave-fu__katsu/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/leave-fu__katsu/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/leave-fu__katsu/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 48% | 12 |
| 61 | [png](shots/leave-fu__katsu/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 52% |  |
| 62 | [png](shots/leave-fu__katsu/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:2 |  | 52% |  |
| 63 | [png](shots/leave-fu__katsu/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 52% |  |
| 64 | [png](shots/leave-fu__katsu/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 52% |  |
| 65 | [png](shots/leave-fu__katsu/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 52% |  |
| 66 | [png](shots/leave-fu__katsu/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:22 AM. |  | 52% |  |
| 67 | [png](shots/leave-fu__katsu/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 52% | 12 |
| 68 | [png](shots/leave-fu__katsu/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 58% |  |
| 69 | [png](shots/leave-fu__katsu/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 58% |  |
| 70 | [png](shots/leave-fu__katsu/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 58% | 12 |
| 71 | [png](shots/leave-fu__katsu/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 64% |  |
| 72 | [png](shots/leave-fu__katsu/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 64% |  |
| 73 | [png](shots/leave-fu__katsu/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 64% |  |
| 74 | [png](shots/leave-fu__katsu/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 64% |  |
| 75 | [png](shots/leave-fu__katsu/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 64% |  |
| 76 | [png](shots/leave-fu__katsu/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 64% | 12 |
| 77 | [png](shots/leave-fu__katsu/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 68% |  |
| 78 | [png](shots/leave-fu__katsu/078-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 68% |  |
| 79 | [png](shots/leave-fu__katsu/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 68% | 12 |
| 80 | [png](shots/leave-fu__katsu/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 72% |  |
| 81 | [png](shots/leave-fu__katsu/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 72% |  |
| 82 | [png](shots/leave-fu__katsu/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 72% |  |
| 83 | [png](shots/leave-fu__katsu/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 72% |  |
| 84 | [png](shots/leave-fu__katsu/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 72% |  |
| 85 | [png](shots/leave-fu__katsu/085-door-door_0.png) | door:0 |  |  | 72% |  |
| 86 | [png](shots/leave-fu__katsu/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 72% | 11 |
| 87 | [png](shots/leave-fu__katsu/087-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 75% |  |
| 88 | [png](shots/leave-fu__katsu/088-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 75% |  |
| 89 | [png](shots/leave-fu__katsu/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 75% | 12 |
| 90 | [png](shots/leave-fu__katsu/090-door-door_3.png) | door:3 | NANDA: …Goodnight? It's only 3:23 AM. [fx hate-quake] |  | 71% |  |
| 91 | [png](shots/leave-fu__katsu/091-leave-leave_0.png) | leave:0 | NANDA: Leaving is not an option. |  | 71% |  |
| 92 | [png](shots/leave-fu__katsu/092-leave-leave_1.png) | leave:1 | XOR Coffee. 7:00 AM. |  | 71% |  |
| 93 | [png](shots/leave-fu__katsu/093-leave-leave_2.png) | leave:2 | NANDA: He wakes at 7:00. | Good morning, Nanda ♥ +2; Who's 'he'? ♥ +1; Stop following me ♡ −3 | 71% | 12 |
| 94 | [png](shots/leave-fu__katsu/094-leave-leave_2.png) | leave:2 | NANDA: Good morning! Same as yesterday. Same as always. [fx love-burst] |  | 74% |  |
| 95 | [png](shots/leave-fu__katsu/095-leave-leave_3.png) | leave:3 | NANDA: From now on… can we be fORever? | uhmmm yeah ig ♥ +1; Forever sounds long ♥ +1; FUCK YOU. I'm leaving ♡ −5 | 74% | 12 |
| 96 | [png](shots/leave-fu__katsu/096-leave-leave_3.png) | leave:3 | NANDA: だめ。You already said forever. I heard it. [fx hate-quake] |  | 67% |  |
| 97 | [png](shots/leave-fu__katsu/097-leave-fu-leave_fu_0.png) | leave-fu:0 | Her hand rises. Time freezes. The café turns. |  | 67% |  |
| 98 | [png](shots/leave-fu__katsu/098-leave-fu-leave_fu_1.png) | leave-fu:1 | NANDA: You said leave. I heard 'lea—'. |  | 67% |  |
| 99 | [png](shots/leave-fu__katsu/099-leave-fu-leave_fu_2.png) | leave-fu:2 | CROWD: fORever and ever |  | 67% |  |
| 100 | [png](shots/leave-fu__katsu/100-leave-fu-leave_fu_3.png) | leave-fu:3 | CROWD: fORever and ever and ever |  | 67% |  |
| 101 | [png](shots/leave-fu__katsu/101-leave-fu-leave_fu_4.png) | leave-fu:4 | [END CARD] GAME OVER 67% |  | 67% |  |
| 102 | [png](shots/leave-fu__katsu/102-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### leave-yeah__butter (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/leave-yeah__butter/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/leave-yeah__butter/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 2 | [png](shots/leave-yeah__butter/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/leave-yeah__butter/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/leave-yeah__butter/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/leave-yeah__butter/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/leave-yeah__butter/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/leave-yeah__butter/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/leave-yeah__butter/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 9 | [png](shots/leave-yeah__butter/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/leave-yeah__butter/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/leave-yeah__butter/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:21 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/leave-yeah__butter/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/leave-yeah__butter/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/leave-yeah__butter/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/leave-yeah__butter/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/leave-yeah__butter/016-park-park_4.png) | park:4 | NANDA: It's 3:21 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/leave-yeah__butter/017-park-park_4.png) | park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 18 | [png](shots/leave-yeah__butter/018-errand-shop-errand_shop_0.png) | errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 19 | [png](shots/leave-yeah__butter/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 20 | [png](shots/leave-yeah__butter/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/leave-yeah__butter/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 22 | [png](shots/leave-yeah__butter/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 23 | [png](shots/leave-yeah__butter/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 24 | [png](shots/leave-yeah__butter/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 25 | [png](shots/leave-yeah__butter/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 26 | [png](shots/leave-yeah__butter/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 27 | [png](shots/leave-yeah__butter/027-hungry-hungry_0.png) | hungry:0 | NANDA: With naan! You know me so well. ♡ [fx love-burst] |  | 36% |  |
| 28 | [png](shots/leave-yeah__butter/028-hungry-hungry_1.png) | hungry:1 | NANDA: Tear the naan. Give me the soft part. Always the soft part. |  | 36% |  |
| 29 | [png](shots/leave-yeah__butter/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 36% | 12 |
| 30 | [png](shots/leave-yeah__butter/030-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 41% |  |
| 31 | [png](shots/leave-yeah__butter/031-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 41% |  |
| 32 | [png](shots/leave-yeah__butter/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 41% | 12 |
| 33 | [png](shots/leave-yeah__butter/033-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 45% |  |
| 34 | [png](shots/leave-yeah__butter/034-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 45% |  |
| 35 | [png](shots/leave-yeah__butter/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:21 AM, a sleepy night, and this is a cl |  | 45% |  |
| 36 | [png](shots/leave-yeah__butter/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 45% |  |
| 37 | [png](shots/leave-yeah__butter/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 45% |  |
| 38 | [png](shots/leave-yeah__butter/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 45% |  |
| 39 | [png](shots/leave-yeah__butter/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 45% | 12 |
| 40 | [png](shots/leave-yeah__butter/040-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 49% |  |
| 41 | [png](shots/leave-yeah__butter/041-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 49% |  |
| 42 | [png](shots/leave-yeah__butter/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 49% |  |
| 43 | [png](shots/leave-yeah__butter/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/leave-yeah__butter/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 45 | [png](shots/leave-yeah__butter/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/leave-yeah__butter/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not our lunch. |  |  |  |
| 47 | [png](shots/leave-yeah__butter/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/leave-yeah__butter/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/leave-yeah__butter/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/leave-yeah__butter/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/leave-yeah__butter/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/leave-yeah__butter/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/leave-yeah__butter/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/leave-yeah__butter/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/leave-yeah__butter/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | dup | blackout:9 |  |  |  |  |
| 57 | [png](shots/leave-yeah__butter/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/leave-yeah__butter/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/leave-yeah__butter/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/leave-yeah__butter/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 49% | 12 |
| 61 | [png](shots/leave-yeah__butter/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 54% |  |
| 62 | [png](shots/leave-yeah__butter/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:2 |  | 54% |  |
| 63 | [png](shots/leave-yeah__butter/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 54% |  |
| 64 | [png](shots/leave-yeah__butter/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 54% |  |
| 65 | [png](shots/leave-yeah__butter/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 54% |  |
| 66 | [png](shots/leave-yeah__butter/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:22 AM. |  | 54% |  |
| 67 | [png](shots/leave-yeah__butter/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 54% | 12 |
| 68 | [png](shots/leave-yeah__butter/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 59% |  |
| 69 | [png](shots/leave-yeah__butter/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 59% |  |
| 70 | [png](shots/leave-yeah__butter/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 59% | 12 |
| 71 | [png](shots/leave-yeah__butter/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 65% |  |
| 72 | [png](shots/leave-yeah__butter/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 65% |  |
| 73 | [png](shots/leave-yeah__butter/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 65% |  |
| 74 | [png](shots/leave-yeah__butter/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 65% |  |
| 75 | [png](shots/leave-yeah__butter/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 65% |  |
| 76 | [png](shots/leave-yeah__butter/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 65% | 12 |
| 77 | [png](shots/leave-yeah__butter/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 70% |  |
| 78 | [png](shots/leave-yeah__butter/078-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 70% |  |
| 79 | [png](shots/leave-yeah__butter/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 70% | 12 |
| 80 | [png](shots/leave-yeah__butter/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 74% |  |
| 81 | [png](shots/leave-yeah__butter/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 74% |  |
| 82 | [png](shots/leave-yeah__butter/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 74% |  |
| 83 | [png](shots/leave-yeah__butter/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 74% |  |
| 84 | [png](shots/leave-yeah__butter/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 74% |  |
| 85 | [png](shots/leave-yeah__butter/085-door-door_0.png) | door:0 |  |  | 74% |  |
| 86 | [png](shots/leave-yeah__butter/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 74% | 12 |
| 87 | [png](shots/leave-yeah__butter/087-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 77% |  |
| 88 | [png](shots/leave-yeah__butter/088-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 77% |  |
| 89 | [png](shots/leave-yeah__butter/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 77% | 12 |
| 90 | [png](shots/leave-yeah__butter/090-door-door_3.png) | door:3 | NANDA: …Goodnight? It's only 3:23 AM. [fx hate-quake] |  | 72% |  |
| 91 | [png](shots/leave-yeah__butter/091-leave-leave_0.png) | leave:0 | NANDA: Leaving is not an option. |  | 72% |  |
| 92 | [png](shots/leave-yeah__butter/092-leave-leave_1.png) | leave:1 | XOR Coffee. 7:00 AM. |  | 72% |  |
| 93 | [png](shots/leave-yeah__butter/093-leave-leave_2.png) | leave:2 | NANDA: He wakes at 7:00. | Good morning, Nanda ♥ +2; Who's 'he'? ♥ +1; Stop following me ♡ −3 | 72% | 12 |
| 94 | [png](shots/leave-yeah__butter/094-leave-leave_2.png) | leave:2 | NANDA: Good morning! Same as yesterday. Same as always. [fx love-burst] |  | 75% |  |
| 95 | [png](shots/leave-yeah__butter/095-leave-leave_3.png) | leave:3 | NANDA: From now on… can we be fORever? | uhmmm yeah ig ♥ +1; Forever sounds long ♥ +1; FUCK YOU. I'm leaving ♡ −5 | 75% | 12 |
| 96 | [png](shots/leave-yeah__butter/096-leave-leave_3.png) | leave:3 | NANDA: From now on… can we be fORever? [fx love-burst] |  | 77% |  |
| 97 | [png](shots/leave-yeah__butter/097-leave-yeah-leave_yeah_0.png) | leave-yeah:0 | NANDA: Hooray! FORever and ever! |  | 77% |  |
| 98 | [png](shots/leave-yeah__butter/098-leave-yeah-leave_yeah_1.png) | leave-yeah:1 | NANDA: Good input. |  | 77% |  |
| 99 | [png](shots/leave-yeah__butter/099-leave-yeah-leave_yeah_2.png) | leave-yeah:2 | CROWD: fORever and ever |  | 77% |  |
| 100 | [png](shots/leave-yeah__butter/100-leave-yeah-leave_yeah_3.png) | leave-yeah:3 | CROWD: fORever and ever and ever |  | 77% |  |
| 101 | [png](shots/leave-yeah__butter/101-leave-yeah-leave_yeah_4.png) | leave-yeah:4 | [END CARD] GAME OVER 77% |  | 77% |  |
| 102 | [png](shots/leave-yeah__butter/102-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### leave-yeah__katsu (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/leave-yeah__katsu/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/leave-yeah__katsu/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 2 | [png](shots/leave-yeah__katsu/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/leave-yeah__katsu/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/leave-yeah__katsu/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/leave-yeah__katsu/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/leave-yeah__katsu/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/leave-yeah__katsu/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/leave-yeah__katsu/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 11 |
| 9 | [png](shots/leave-yeah__katsu/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/leave-yeah__katsu/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/leave-yeah__katsu/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:23 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/leave-yeah__katsu/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/leave-yeah__katsu/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/leave-yeah__katsu/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/leave-yeah__katsu/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/leave-yeah__katsu/016-park-park_4.png) | park:4 | NANDA: It's 3:23 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/leave-yeah__katsu/017-park-park_4.png) | park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 18 | [png](shots/leave-yeah__katsu/018-errand-shop-errand_shop_0.png) | errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 19 | [png](shots/leave-yeah__katsu/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 20 | [png](shots/leave-yeah__katsu/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/leave-yeah__katsu/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 22 | [png](shots/leave-yeah__katsu/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 23 | [png](shots/leave-yeah__katsu/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 24 | [png](shots/leave-yeah__katsu/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 25 | [png](shots/leave-yeah__katsu/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 26 | [png](shots/leave-yeah__katsu/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 27 | [png](shots/leave-yeah__katsu/027-hungry-hungry_0.png) | hungry:0 | NANDA: Crunchy! You chose. I'll pretend I did. |  | 35% |  |
| 28 | [png](shots/leave-yeah__katsu/028-hungry-hungry_1.png) | hungry:1 | NANDA: Cut the katsu. Blow on it. I like it when you work for me. |  | 35% |  |
| 29 | [png](shots/leave-yeah__katsu/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 35% | 12 |
| 30 | [png](shots/leave-yeah__katsu/030-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 39% |  |
| 31 | [png](shots/leave-yeah__katsu/031-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 39% |  |
| 32 | [png](shots/leave-yeah__katsu/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 39% | 12 |
| 33 | [png](shots/leave-yeah__katsu/033-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 43% |  |
| 34 | [png](shots/leave-yeah__katsu/034-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 43% |  |
| 35 | [png](shots/leave-yeah__katsu/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:23 AM, a sleepy night, and this is a cl |  | 43% |  |
| 36 | [png](shots/leave-yeah__katsu/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 43% |  |
| 37 | [png](shots/leave-yeah__katsu/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 43% |  |
| 38 | [png](shots/leave-yeah__katsu/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 43% |  |
| 39 | [png](shots/leave-yeah__katsu/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 43% | 12 |
| 40 | [png](shots/leave-yeah__katsu/040-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 48% |  |
| 41 | [png](shots/leave-yeah__katsu/041-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 48% |  |
| 42 | [png](shots/leave-yeah__katsu/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 48% |  |
| 43 | [png](shots/leave-yeah__katsu/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/leave-yeah__katsu/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 45 | [png](shots/leave-yeah__katsu/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/leave-yeah__katsu/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not bread. |  |  |  |
| 47 | [png](shots/leave-yeah__katsu/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/leave-yeah__katsu/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/leave-yeah__katsu/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/leave-yeah__katsu/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/leave-yeah__katsu/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/leave-yeah__katsu/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/leave-yeah__katsu/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/leave-yeah__katsu/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/leave-yeah__katsu/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | [png](shots/leave-yeah__katsu/056-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 57 | [png](shots/leave-yeah__katsu/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/leave-yeah__katsu/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/leave-yeah__katsu/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/leave-yeah__katsu/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 48% | 12 |
| 61 | [png](shots/leave-yeah__katsu/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 52% |  |
| 62 | [png](shots/leave-yeah__katsu/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:2 |  | 52% |  |
| 63 | [png](shots/leave-yeah__katsu/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 52% |  |
| 64 | [png](shots/leave-yeah__katsu/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 52% |  |
| 65 | [png](shots/leave-yeah__katsu/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 52% |  |
| 66 | [png](shots/leave-yeah__katsu/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:24 AM. |  | 52% |  |
| 67 | [png](shots/leave-yeah__katsu/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 52% | 12 |
| 68 | [png](shots/leave-yeah__katsu/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 58% |  |
| 69 | [png](shots/leave-yeah__katsu/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 58% |  |
| 70 | [png](shots/leave-yeah__katsu/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 58% | 12 |
| 71 | [png](shots/leave-yeah__katsu/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 64% |  |
| 72 | [png](shots/leave-yeah__katsu/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 64% |  |
| 73 | [png](shots/leave-yeah__katsu/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 64% |  |
| 74 | [png](shots/leave-yeah__katsu/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 64% |  |
| 75 | [png](shots/leave-yeah__katsu/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 64% |  |
| 76 | [png](shots/leave-yeah__katsu/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 64% | 12 |
| 77 | [png](shots/leave-yeah__katsu/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 68% |  |
| 78 | [png](shots/leave-yeah__katsu/078-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 68% |  |
| 79 | [png](shots/leave-yeah__katsu/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 68% | 12 |
| 80 | [png](shots/leave-yeah__katsu/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 72% |  |
| 81 | [png](shots/leave-yeah__katsu/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 72% |  |
| 82 | [png](shots/leave-yeah__katsu/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 72% |  |
| 83 | [png](shots/leave-yeah__katsu/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 72% |  |
| 84 | [png](shots/leave-yeah__katsu/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 72% |  |
| 85 | [png](shots/leave-yeah__katsu/085-door-door_0.png) | door:0 |  |  | 72% |  |
| 86 | [png](shots/leave-yeah__katsu/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 72% | 12 |
| 87 | [png](shots/leave-yeah__katsu/087-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 75% |  |
| 88 | [png](shots/leave-yeah__katsu/088-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 75% |  |
| 89 | [png](shots/leave-yeah__katsu/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 75% | 12 |
| 90 | [png](shots/leave-yeah__katsu/090-door-door_3.png) | door:3 | NANDA: …Goodnight? It's only 3:25 AM. [fx hate-quake] |  | 71% |  |
| 91 | [png](shots/leave-yeah__katsu/091-leave-leave_0.png) | leave:0 | NANDA: Leaving is not an option. |  | 71% |  |
| 92 | [png](shots/leave-yeah__katsu/092-leave-leave_1.png) | leave:1 | XOR Coffee. 7:00 AM. |  | 71% |  |
| 93 | [png](shots/leave-yeah__katsu/093-leave-leave_2.png) | leave:2 | NANDA: He wakes at 7:00. | Good morning, Nanda ♥ +2; Who's 'he'? ♥ +1; Stop following me ♡ −3 | 71% | 12 |
| 94 | [png](shots/leave-yeah__katsu/094-leave-leave_2.png) | leave:2 | NANDA: Good morning! Same as yesterday. Same as always. [fx love-burst] |  | 74% |  |
| 95 | [png](shots/leave-yeah__katsu/095-leave-leave_3.png) | leave:3 | NANDA: From now on… can we be fORever? | uhmmm yeah ig ♥ +1; Forever sounds long ♥ +1; FUCK YOU. I'm leaving ♡ −5 | 74% | 12 |
| 96 | [png](shots/leave-yeah__katsu/096-leave-leave_3.png) | leave:3 | NANDA: From now on… can we be fORever? [fx love-burst] |  | 75% |  |
| 97 | [png](shots/leave-yeah__katsu/097-leave-yeah-leave_yeah_0.png) | leave-yeah:0 | NANDA: Hooray! FORever and ever! |  | 75% |  |
| 98 | [png](shots/leave-yeah__katsu/098-leave-yeah-leave_yeah_1.png) | leave-yeah:1 | NANDA: Good input. |  | 75% |  |
| 99 | [png](shots/leave-yeah__katsu/099-leave-yeah-leave_yeah_2.png) | leave-yeah:2 | CROWD: fORever and ever |  | 75% |  |
| 100 | [png](shots/leave-yeah__katsu/100-leave-yeah-leave_yeah_3.png) | leave-yeah:3 | CROWD: fORever and ever and ever |  | 75% |  |
| 101 | [png](shots/leave-yeah__katsu/101-leave-yeah-leave_yeah_4.png) | leave-yeah:4 | [END CARD] GAME OVER 75% |  | 75% |  |
| 102 | [png](shots/leave-yeah__katsu/102-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### errand-groceries__steeped (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/errand-groceries__steeped/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/errand-groceries__steeped/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 11 |
| 2 | [png](shots/errand-groceries__steeped/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sour. Brave. I'll remember you like sour. |  | 1% |  |
| 3 | [png](shots/errand-groceries__steeped/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sour. Hm. You like things that bite? |  | 1% |  |
| 4 | [png](shots/errand-groceries__steeped/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sour, ne? | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 1% | 12 |
| 5 | [png](shots/errand-groceries__steeped/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 4% |  |
| 6 | [png](shots/errand-groceries__steeped/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her anyway. |  | 4% |  |
| 7 | [png](shots/errand-groceries__steeped/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 4% |  |
| 8 | [png](shots/errand-groceries__steeped/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 4% | 12 |
| 9 | [png](shots/errand-groceries__steeped/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 9% |  |
| 10 | [png](shots/errand-groceries__steeped/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 9% | 12 |
| 11 | [png](shots/errand-groceries__steeped/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:23 AM. ♡ [fx love-burst] |  | 13% |  |
| 12 | [png](shots/errand-groceries__steeped/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 13% |  |
| 13 | [png](shots/errand-groceries__steeped/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 13% | 12 |
| 14 | [png](shots/errand-groceries__steeped/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 17% |  |
| 15 | [png](shots/errand-groceries__steeped/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 17% |  |
| 16 | [png](shots/errand-groceries__steeped/016-park-park_4.png) | park:4 | NANDA: It's 3:24 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 17% | 12 |
| 17 | [png](shots/errand-groceries__steeped/017-park-park_4.png) | park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 20% |  |
| 18 | [png](shots/errand-groceries__steeped/018-errand-shop-errand_shop_0.png) | errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 20% |  |
| 19 | [png](shots/errand-groceries__steeped/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 20% | 12 |
| 20 | [png](shots/errand-groceries__steeped/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 25% |  |
| 21 | [png](shots/errand-groceries__steeped/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 25% |  |
| 22 | [png](shots/errand-groceries__steeped/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 25% | 12 |
| 23 | [png](shots/errand-groceries__steeped/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 29% |  |
| 24 | [png](shots/errand-groceries__steeped/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 29% |  |
| 25 | [png](shots/errand-groceries__steeped/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 29% |  |
| 26 | [png](shots/errand-groceries__steeped/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 29% | 12 |
| 27 | [png](shots/errand-groceries__steeped/027-hungry-hungry_0.png) | hungry:0 | NANDA: With naan! You know me so well. ♡ [fx love-burst] |  | 33% |  |
| 28 | [png](shots/errand-groceries__steeped/028-hungry-hungry_1.png) | hungry:1 | NANDA: Tear the naan. Give me the soft part. Always the soft part. |  | 33% |  |
| 29 | [png](shots/errand-groceries__steeped/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 33% | 12 |
| 30 | [png](shots/errand-groceries__steeped/030-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 38% |  |
| 31 | [png](shots/errand-groceries__steeped/031-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 38% |  |
| 32 | [png](shots/errand-groceries__steeped/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 38% | 12 |
| 33 | [png](shots/errand-groceries__steeped/033-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 42% |  |
| 34 | [png](shots/errand-groceries__steeped/034-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 42% |  |
| 35 | [png](shots/errand-groceries__steeped/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:24 AM, a sleepy night, and this is a cl |  | 42% |  |
| 36 | [png](shots/errand-groceries__steeped/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 42% |  |
| 37 | [png](shots/errand-groceries__steeped/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 42% |  |
| 38 | [png](shots/errand-groceries__steeped/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 42% |  |
| 39 | [png](shots/errand-groceries__steeped/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 42% | 12 |
| 40 | [png](shots/errand-groceries__steeped/040-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 46% |  |
| 41 | [png](shots/errand-groceries__steeped/041-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 46% |  |
| 42 | [png](shots/errand-groceries__steeped/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 46% |  |
| 43 | [png](shots/errand-groceries__steeped/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/errand-groceries__steeped/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says すっぱい！ SOUR! |  |  |  |
| 45 | [png](shots/errand-groceries__steeped/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/errand-groceries__steeped/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not our lunch. |  |  |  |
| 47 | [png](shots/errand-groceries__steeped/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/errand-groceries__steeped/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/errand-groceries__steeped/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/errand-groceries__steeped/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/errand-groceries__steeped/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/errand-groceries__steeped/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/errand-groceries__steeped/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/errand-groceries__steeped/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/errand-groceries__steeped/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | [png](shots/errand-groceries__steeped/056-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 57 | [png](shots/errand-groceries__steeped/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/errand-groceries__steeped/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/errand-groceries__steeped/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/errand-groceries__steeped/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 46% | 12 |
| 61 | [png](shots/errand-groceries__steeped/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 51% |  |
| 62 | [png](shots/errand-groceries__steeped/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:2 |  | 51% |  |
| 63 | [png](shots/errand-groceries__steeped/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 51% |  |
| 64 | [png](shots/errand-groceries__steeped/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 51% |  |
| 65 | [png](shots/errand-groceries__steeped/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 51% |  |
| 66 | [png](shots/errand-groceries__steeped/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:25 AM. |  | 51% |  |
| 67 | [png](shots/errand-groceries__steeped/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 51% | 12 |
| 68 | [png](shots/errand-groceries__steeped/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 57% |  |
| 69 | [png](shots/errand-groceries__steeped/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 57% |  |
| 70 | [png](shots/errand-groceries__steeped/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 57% | 12 |
| 71 | [png](shots/errand-groceries__steeped/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 62% |  |
| 72 | [png](shots/errand-groceries__steeped/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 62% |  |
| 73 | [png](shots/errand-groceries__steeped/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 62% |  |
| 74 | [png](shots/errand-groceries__steeped/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 62% |  |
| 75 | [png](shots/errand-groceries__steeped/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 62% |  |
| 76 | [png](shots/errand-groceries__steeped/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 62% | 12 |
| 77 | [png](shots/errand-groceries__steeped/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 67% |  |
| 78 | [png](shots/errand-groceries__steeped/078-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 67% |  |
| 79 | [png](shots/errand-groceries__steeped/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 67% | 12 |
| 80 | [png](shots/errand-groceries__steeped/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 71% |  |
| 81 | [png](shots/errand-groceries__steeped/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 71% |  |
| 82 | [png](shots/errand-groceries__steeped/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 71% |  |
| 83 | [png](shots/errand-groceries__steeped/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 71% |  |
| 84 | [png](shots/errand-groceries__steeped/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 71% |  |
| 85 | [png](shots/errand-groceries__steeped/085-door-door_0.png) | door:0 |  |  | 71% |  |
| 86 | [png](shots/errand-groceries__steeped/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 71% | 12 |
| 87 | [png](shots/errand-groceries__steeped/087-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 74% |  |
| 88 | [png](shots/errand-groceries__steeped/088-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 74% |  |
| 89 | [png](shots/errand-groceries__steeped/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 74% | 12 |
| 90 | [png](shots/errand-groceries__steeped/090-door-door_3.png) | door:3 | NANDA: One cup. I'll pour it slow. [fx love-burst] |  | 78% |  |
| 91 | [png](shots/errand-groceries__steeped/091-genkan-in-genkan_in_0.png) | genkan-in:0 | Her shoes. Lined up to the millimetre. |  |  |  |
| 92 | [png](shots/errand-groceries__steeped/092-genkan-in-genkan_in_1.png) | genkan-in:1 | Men's slippers. Already set out. |  |  |  |
| 93 | [png](shots/errand-groceries__steeped/093-genkan-in-genkan_in_2.png) | genkan-in:2 | A tiny shrine. Inside: a circuit you built. |  |  |  |
| 94 | [png](shots/errand-groceries__steeped/094-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: おかえり。Welcome home. I mean my home. I mean our home. Same thing. | ただいま ♥ +4; Thanks for having me ♥ +1; This isn't my home ♡ −5 | 78% | 12 |
| 95 | [png](shots/errand-groceries__steeped/095-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: You said it! ただいま! I'm keeping that. [fx love-burst] |  | 84% |  |
| 96 | [png](shots/errand-groceries__steeped/096-genkan-talk-genkan_talk_1.png) | genkan-talk:1 | NANDA: Slippers on. I bought them in your size. Last year. Before we met. Don't  |  | 84% |  |
| 97 | [png](shots/errand-groceries__steeped/097-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I made a list of things you like. Forty things. I'm number one. I checked | You're number one ♥ +3; What's number two? ♥ +1; Burn the list ♡ −5 | 84% | 11 |
| 98 | [png](shots/errand-groceries__steeped/098-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I knew it. The list is never wrong. [fx love-burst] |  | 88% |  |
| 99 | [png](shots/errand-groceries__steeped/099-genkan-talk-genkan_talk_3.png) | genkan-talk:3 | NANDA: Kitchen's this way. Don't open the other doors. They're shy. |  | 88% |  |
| 100 | [png](shots/errand-groceries__steeped/100-cup-cup_0.png) | cup:0 | NANDA: I bought umeboshi. For no reason. Eat. | Eat it all ♥ +2; Eat a little ♥ +1; I'm not hungry ♡ −3 | 88% | 12 |
| 101 | [png](shots/errand-groceries__steeped/101-cup-cup_0.png) | cup:0 | NANDA: See? You needed me. [fx love-burst] |  | 91% |  |
| 102 | [png](shots/errand-groceries__steeped/102-cup-cup_1.png) | cup:1 | Third teacup. Nobody poured it. One umeboshi on its saucer. |  | 91% |  |
| 103 | [png](shots/errand-groceries__steeped/103-cup-cup_2.png) | cup:2 | MC: Who's the third cup for? |  | 91% |  |
| 104 | [png](shots/errand-groceries__steeped/104-cup-cup_3.png) | cup:3 | NANDA: For Input B. Silly. It's always three of us. | Drink ♥ +3; Hold the cup ♥ +1; Stand up ♡ −3 | 91% | 12 |
| 105 | [png](shots/errand-groceries__steeped/105-cup-cup_3.png) | cup:3 | NANDA: Drink. It's warm. It makes the thinking stop. [fx love-burst] |  | 96% |  |
| 106 | [png](shots/errand-groceries__steeped/106-steeped-steeped_0.png) | steeped:0 | OR |  | 96% |  |
| 107 | [png](shots/errand-groceries__steeped/107-steeped-steeped_1.png) | steeped:1 | NANDA: Rest. I'll do the remembering. |  | 96% |  |
| 108 | [png](shots/errand-groceries__steeped/108-steeped-steeped_2.png) | steeped:2 | NANDA: Bitter cup, sour hour. Every hour is ours. |  | 96% |  |
| 109 | [png](shots/errand-groceries__steeped/109-steeped-steeped_3.png) | steeped:3 | NANDA: いつまでも一緒。…FORever. ね？ |  | 96% |  |
| 110 | [png](shots/errand-groceries__steeped/110-steeped-steeped_4.png) | steeped:4 | [END CARD] GAME OVER 96% |  | 96% |  |
| 111 | [png](shots/errand-groceries__steeped/111-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### errand-library__steeped (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/errand-library__steeped/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/errand-library__steeped/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 11 |
| 2 | [png](shots/errand-library__steeped/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sour. Brave. I'll remember you like sour. |  | 1% |  |
| 3 | [png](shots/errand-library__steeped/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sour. Hm. You like things that bite? |  | 1% |  |
| 4 | [png](shots/errand-library__steeped/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sour, ne? | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 1% | 12 |
| 5 | [png](shots/errand-library__steeped/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 4% |  |
| 6 | [png](shots/errand-library__steeped/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her anyway. |  | 4% |  |
| 7 | [png](shots/errand-library__steeped/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 4% |  |
| 8 | [png](shots/errand-library__steeped/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 4% | 12 |
| 9 | [png](shots/errand-library__steeped/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 9% |  |
| 10 | [png](shots/errand-library__steeped/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 9% | 12 |
| 11 | [png](shots/errand-library__steeped/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:24 AM. ♡ [fx love-burst] |  | 13% |  |
| 12 | [png](shots/errand-library__steeped/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 13% |  |
| 13 | [png](shots/errand-library__steeped/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 13% | 12 |
| 14 | [png](shots/errand-library__steeped/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 17% |  |
| 15 | [png](shots/errand-library__steeped/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 17% |  |
| 16 | [png](shots/errand-library__steeped/016-park-park_4.png) | park:4 | NANDA: It's 3:24 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 17% | 12 |
| 17 | [png](shots/errand-library__steeped/017-park-park_4.png) | park:4 | NANDA: The book! It's late. Like you. But you came. |  | 20% |  |
| 18 | [png](shots/errand-library__steeped/018-errand-library-errand_library_0.png) | errand-library:0 | A rail crossing. Bells ring. Sakura on the tracks. |  | 20% |  |
| 19 | [png](shots/errand-library__steeped/019-errand-library-errand_library_1.png) | errand-library:1 | NANDA: This book is forty days late. I kept it because you touched it once. | That's so cute ♥ +3; I don't remember that ♥ +1; That's creepy ♡ −4 | 20% | 12 |
| 20 | [png](shots/errand-library__steeped/020-errand-library-errand_library_1.png) | errand-library:1 | NANDA: I knew you'd say that. I wrote it down. [fx love-burst] |  | 25% |  |
| 21 | [png](shots/errand-library__steeped/021-errand-library-errand_library_2.png) | errand-library:2 | NANDA: The gate is down. The train is a big metal door. I hate doors. Stand clos |  | 25% |  |
| 22 | [png](shots/errand-library__steeped/022-errand-library-errand_library_3.png) | errand-library:3 | NANDA: Book's back. Now the library can't keep you either. Only I can. | Only you ♥ +4; Let's go eat ♥ +1; Nobody keeps me ♡ −5 | 25% | 12 |
| 23 | [png](shots/errand-library__steeped/023-errand-library-errand_library_3.png) | errand-library:3 | NANDA: Only me. Say it at the station too. [fx love-burst] |  | 30% |  |
| 24 | [png](shots/errand-library__steeped/024-errand-library-errand_library_4.png) | errand-library:4 | WALK TO THE FOOD STALLS | Walk to the food stalls; Stroll to the yummy stalls ♡ | 30% |  |
| 25 | [png](shots/errand-library__steeped/025-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 30% | 12 |
| 26 | [png](shots/errand-library__steeped/026-hungry-hungry_0.png) | hungry:0 | NANDA: Crunchy! You chose. I'll pretend I did. |  | 33% |  |
| 27 | [png](shots/errand-library__steeped/027-hungry-hungry_1.png) | hungry:1 | NANDA: Cut the katsu. Blow on it. I like it when you work for me. |  | 33% |  |
| 28 | [png](shots/errand-library__steeped/028-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 33% | 12 |
| 29 | [png](shots/errand-library__steeped/029-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 38% |  |
| 30 | [png](shots/errand-library__steeped/030-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 38% |  |
| 31 | [png](shots/errand-library__steeped/031-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 38% | 12 |
| 32 | [png](shots/errand-library__steeped/032-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 42% |  |
| 33 | [png](shots/errand-library__steeped/033-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 42% |  |
| 34 | [png](shots/errand-library__steeped/034-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:25 AM, a sleepy night, and this is a cl |  | 42% |  |
| 35 | [png](shots/errand-library__steeped/035-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 42% |  |
| 36 | [png](shots/errand-library__steeped/036-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 42% |  |
| 37 | [png](shots/errand-library__steeped/037-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 42% |  |
| 38 | [png](shots/errand-library__steeped/038-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 42% | 12 |
| 39 | [png](shots/errand-library__steeped/039-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 46% |  |
| 40 | [png](shots/errand-library__steeped/040-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 46% |  |
| 41 | [png](shots/errand-library__steeped/041-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 46% |  |
| 42 | [png](shots/errand-library__steeped/042-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 43 | [png](shots/errand-library__steeped/043-train-train_1.png) | train:1 | Nobody reads the ads. This one says すっぱい！ SOUR! |  |  |  |
| 44 | [png](shots/errand-library__steeped/044-naan-naan_0.png) | naan:0 |  |  |  |  |
| 45 | [png](shots/errand-library__steeped/045-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not bread. |  |  |  |
| 46 | [png](shots/errand-library__steeped/046-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 47 | [png](shots/errand-library__steeped/047-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 48 | [png](shots/errand-library__steeped/048-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 49 | [png](shots/errand-library__steeped/049-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 50 | [png](shots/errand-library__steeped/050-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 51 | [png](shots/errand-library__steeped/051-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 52 | [png](shots/errand-library__steeped/052-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 53 | [png](shots/errand-library__steeped/053-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 54 | [png](shots/errand-library__steeped/054-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 55 | [png](shots/errand-library__steeped/055-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 56 | [png](shots/errand-library__steeped/056-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 57 | [png](shots/errand-library__steeped/057-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 58 | [png](shots/errand-library__steeped/058-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 59 | [png](shots/errand-library__steeped/059-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 46% | 12 |
| 60 | [png](shots/errand-library__steeped/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 51% |  |
| 61 | [png](shots/errand-library__steeped/061-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:2 |  | 51% |  |
| 62 | [png](shots/errand-library__steeped/062-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 51% |  |
| 63 | [png](shots/errand-library__steeped/063-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 51% |  |
| 64 | [png](shots/errand-library__steeped/064-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 51% |  |
| 65 | [png](shots/errand-library__steeped/065-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:25 AM. |  | 51% |  |
| 66 | [png](shots/errand-library__steeped/066-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 51% | 12 |
| 67 | [png](shots/errand-library__steeped/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 57% |  |
| 68 | [png](shots/errand-library__steeped/068-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 57% |  |
| 69 | [png](shots/errand-library__steeped/069-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 57% | 12 |
| 70 | [png](shots/errand-library__steeped/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 62% |  |
| 71 | [png](shots/errand-library__steeped/071-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 62% |  |
| 72 | [png](shots/errand-library__steeped/072-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 62% |  |
| 73 | [png](shots/errand-library__steeped/073-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 62% |  |
| 74 | [png](shots/errand-library__steeped/074-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 62% |  |
| 75 | [png](shots/errand-library__steeped/075-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 62% | 12 |
| 76 | [png](shots/errand-library__steeped/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 67% |  |
| 77 | [png](shots/errand-library__steeped/077-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 67% |  |
| 78 | [png](shots/errand-library__steeped/078-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 67% | 12 |
| 79 | [png](shots/errand-library__steeped/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 71% |  |
| 80 | [png](shots/errand-library__steeped/080-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 71% |  |
| 81 | [png](shots/errand-library__steeped/081-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 71% |  |
| 82 | [png](shots/errand-library__steeped/082-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 71% |  |
| 83 | [png](shots/errand-library__steeped/083-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 71% |  |
| 84 | [png](shots/errand-library__steeped/084-door-door_0.png) | door:0 |  |  | 71% |  |
| 85 | [png](shots/errand-library__steeped/085-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 71% | 12 |
| 86 | [png](shots/errand-library__steeped/086-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 74% |  |
| 87 | [png](shots/errand-library__steeped/087-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 74% |  |
| 88 | [png](shots/errand-library__steeped/088-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 74% | 12 |
| 89 | [png](shots/errand-library__steeped/089-door-door_3.png) | door:3 | NANDA: One cup. I'll pour it slow. [fx love-burst] |  | 78% |  |
| 90 | [png](shots/errand-library__steeped/090-genkan-in-genkan_in_0.png) | genkan-in:0 | Her shoes. Lined up to the millimetre. |  |  |  |
| 91 | [png](shots/errand-library__steeped/091-genkan-in-genkan_in_1.png) | genkan-in:1 | Men's slippers. Already set out. |  |  |  |
| 92 | [png](shots/errand-library__steeped/092-genkan-in-genkan_in_2.png) | genkan-in:2 | A tiny shrine. Inside: a circuit you built. |  |  |  |
| 93 | [png](shots/errand-library__steeped/093-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: おかえり。Welcome home. I mean my home. I mean our home. Same thing. | ただいま ♥ +4; Thanks for having me ♥ +1; This isn't my home ♡ −5 | 78% | 12 |
| 94 | [png](shots/errand-library__steeped/094-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: You said it! ただいま! I'm keeping that. [fx love-burst] |  | 84% |  |
| 95 | [png](shots/errand-library__steeped/095-genkan-talk-genkan_talk_1.png) | genkan-talk:1 | NANDA: Slippers on. I bought them in your size. Last year. Before we met. Don't  |  | 84% |  |
| 96 | [png](shots/errand-library__steeped/096-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I made a list of things you like. Forty things. I'm number one. I checked | You're number one ♥ +3; What's number two? ♥ +1; Burn the list ♡ −5 | 84% | 11 |
| 97 | [png](shots/errand-library__steeped/097-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I knew it. The list is never wrong. [fx love-burst] |  | 88% |  |
| 98 | [png](shots/errand-library__steeped/098-genkan-talk-genkan_talk_3.png) | genkan-talk:3 | NANDA: Kitchen's this way. Don't open the other doors. They're shy. |  | 88% |  |
| 99 | [png](shots/errand-library__steeped/099-cup-cup_0.png) | cup:0 | NANDA: I bought umeboshi. For no reason. Eat. | Eat it all ♥ +2; Eat a little ♥ +1; I'm not hungry ♡ −3 | 88% | 12 |
| 100 | [png](shots/errand-library__steeped/100-cup-cup_0.png) | cup:0 | NANDA: See? You needed me. [fx love-burst] |  | 91% |  |
| 101 | [png](shots/errand-library__steeped/101-cup-cup_1.png) | cup:1 | Third teacup. Nobody poured it. One umeboshi on its saucer. |  | 91% |  |
| 102 | [png](shots/errand-library__steeped/102-cup-cup_2.png) | cup:2 | MC: Who's the third cup for? |  | 91% |  |
| 103 | [png](shots/errand-library__steeped/103-cup-cup_3.png) | cup:3 | NANDA: For Input B. Silly. It's always three of us. | Drink ♥ +3; Hold the cup ♥ +1; Stand up ♡ −3 | 91% | 12 |
| 104 | [png](shots/errand-library__steeped/104-cup-cup_3.png) | cup:3 | NANDA: Drink. It's warm. It makes the thinking stop. [fx love-burst] |  | 96% |  |
| 105 | [png](shots/errand-library__steeped/105-steeped-steeped_0.png) | steeped:0 | OR |  | 96% |  |
| 106 | [png](shots/errand-library__steeped/106-steeped-steeped_1.png) | steeped:1 | NANDA: Rest. I'll do the remembering. |  | 96% |  |
| 107 | [png](shots/errand-library__steeped/107-steeped-steeped_2.png) | steeped:2 | NANDA: Bitter cup, sour hour. Every hour is ours. |  | 96% |  |
| 108 | [png](shots/errand-library__steeped/108-steeped-steeped_3.png) | steeped:3 | NANDA: いつまでも一緒。…FORever. ね？ |  | 96% |  |
| 109 | [png](shots/errand-library__steeped/109-steeped-steeped_4.png) | steeped:4 | [END CARD] GAME OVER 96% |  | 96% |  |
| 110 | [png](shots/errand-library__steeped/110-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### all-hate (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/all-hate/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/all-hate/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 11 |
| 2 | [png](shots/all-hate/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: …I woke up at four for this. [fx hate-quake] |  | 0% |  |
| 3 | [png](shots/all-hate/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sour. Hm. You like things that bite? |  | 0% |  |
| 4 | [png](shots/all-hate/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sour, ne? | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 0% | 12 |
| 5 | [png](shots/all-hate/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Say that again. Slowly. So I can write it down. [fx hate-quake] |  | 0% |  |
| 6 | [png](shots/all-hate/006-rooftop-rooftop_4.png) | rooftop:4 | NANDA: Salty. Noted. Forever. |  | 0% |  |
| 7 | [png](shots/all-hate/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 0% |  |
| 8 | [png](shots/all-hate/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 0% | 12 |
| 9 | [png](shots/all-hate/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: …Fine. The rain can have you. Later. [fx hate-quake] |  | 0% |  |
| 10 | [png](shots/all-hate/010-park-park_0.png) | park:0 | NANDA: Park. Now. Hold my hand on the way. | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 0% | 12 |
| 11 | [png](shots/all-hate/011-park-park_0.png) | park:0 | NANDA: …Everything is about me. You'll learn. You always learn, around run 1. [fx hate-quake] |  | 0% |  |
| 12 | [png](shots/all-hate/012-park-park_1.png) | park:1 | NANDA: Don't say that again. The petals are listening. |  | 0% |  |
| 13 | [png](shots/all-hate/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 0% | 12 |
| 14 | [png](shots/all-hate/014-park-park_2.png) | park:2 | NANDA: Oh. …Your hand is cold anyway. [fx hate-quake] |  | 0% |  |
| 15 | [png](shots/all-hate/015-park-park_3.png) | park:3 | NANDA: I'll warm it later. I have ways. |  | 0% |  |
| 16 | [png](shots/all-hate/016-park-park_4.png) | park:4 | NANDA: It's 3:26 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 0% | 12 |
| 17 | [png](shots/all-hate/017-park-park_4.png) | park:4 | NANDA: Alone? There's no alone today. Groceries. Now. [fx hate-quake] |  | 0% |  |
| 18 | [png](shots/all-hate/018-errand-shop-errand_shop_0.png) | errand-shop:0 | NANDA: Carrots first. Then you can talk. |  | 0% |  |
| 19 | [png](shots/all-hate/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 0% | 12 |
| 20 | [png](shots/all-hate/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Normal people are lonely. Do you want lonely? [fx hate-quake] |  | 0% |  |
| 21 | [png](shots/all-hate/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: Three. Say it. Three. |  | 0% |  |
| 22 | [png](shots/all-hate/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 0% | 12 |
| 23 | [png](shots/all-hate/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: …Okay. I'll carry everything. I always do. [fx hate-quake] |  | 0% |  |
| 24 | [png](shots/all-hate/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I carry a lot. You don't even know. |  | 0% |  |
| 25 | [png](shots/all-hate/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 0% |  |
| 26 | [png](shots/all-hate/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 0% | 12 |
| 27 | [png](shots/all-hate/027-hungry-hungry_0.png) | hungry:0 | NANDA: You don't eat? Then you watch me eat. [fx hate-quake] |  | 0% |  |
| 28 | [png](shots/all-hate/028-hungry-hungry_1.png) | hungry:1 | NANDA: Cut the katsu. Blow on it. I like it when you work for me. |  | 0% |  |
| 29 | [png](shots/all-hate/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 0% | 12 |
| 30 | [png](shots/all-hate/030-hungry-hungry_2.png) | hungry:2 | NANDA: …I can. I just won't. [fx hate-quake] |  | 0% |  |
| 31 | [png](shots/all-hate/031-town-town_0.png) | town:0 | NANDA: Wipe my mouth. …Thank you. See? Easy. |  | 0% |  |
| 32 | [png](shots/all-hate/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 0% | 12 |
| 33 | [png](shots/all-hate/033-town-town_1.png) | town:1 | NANDA: Then get lost in one. See who finds you. [fx hate-quake] |  | 0% |  |
| 34 | [png](shots/all-hate/034-town-town_2.png) | town:2 | NANDA: Me. Only me finds you. |  | 0% |  |
| 35 | [png](shots/all-hate/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:27 AM, a sleepy night, and this is a cl |  | 0% |  |
| 36 | [png](shots/all-hate/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 0% |  |
| 37 | [png](shots/all-hate/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 0% |  |
| 38 | [png](shots/all-hate/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 0% |  |
| 39 | [png](shots/all-hate/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 0% | 12 |
| 40 | [png](shots/all-hate/040-town-town_7.png) | town:7 | NANDA: Fine. You're nothing. …That's how they'd say it. [fx hate-quake] |  | 0% |  |
| 41 | [png](shots/all-hate/041-town-town_8.png) | town:8 | NANDA: See? You need me to be nice to you. |  | 0% |  |
| 42 | [png](shots/all-hate/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 0% |  |
| 43 | [png](shots/all-hate/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/all-hate/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says すっぱい！ SOUR! |  |  |  |
| 45 | [png](shots/all-hate/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/all-hate/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not bread. |  |  |  |
| 47 | [png](shots/all-hate/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/all-hate/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/all-hate/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/all-hate/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/all-hate/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/all-hate/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/all-hate/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/all-hate/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/all-hate/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | [png](shots/all-hate/056-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 57 | [png](shots/all-hate/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/all-hate/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/all-hate/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/all-hate/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 0% | 12 |
| 61 | [png](shots/all-hate/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: The pole won't miss you. I will. [fx hate-quake] |  | 0% |  |
| 62 | [png](shots/all-hate/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:2 |  | 0% |  |
| 63 | [png](shots/all-hate/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 0% |  |
| 64 | [png](shots/all-hate/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 0% |  |
| 65 | [png](shots/all-hate/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: Every night. At this stop. Waiting. |  | 0% |  |
| 66 | [png](shots/all-hate/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:27 AM. |  | 0% |  |
| 67 | [png](shots/all-hate/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 0% | 12 |
| 68 | [png](shots/all-hate/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Then get wet. Sick boys stay home. My home. [fx hate-quake] |  | 0% |  |
| 69 | [png](shots/all-hate/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: Don't run. It's slippery. People fall. |  | 0% |  |
| 70 | [png](shots/all-hate/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 0% | 12 |
| 71 | [png](shots/all-hate/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Too long? …It hasn't even started. [fx hate-quake] |  | 0% |  |
| 72 | [png](shots/all-hate/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | NANDA: Walk me home. That's not a question. | Walk her home; Walk her home… and nothing else | 0% |  |
| 73 | [png](shots/all-hate/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 0% |  |
| 74 | [png](shots/all-hate/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 0% |  |
| 75 | [png](shots/all-hate/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 0% |  |
| 76 | [png](shots/all-hate/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 0% | 12 |
| 77 | [png](shots/all-hate/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: A lot is how much I love you. Get used to it. [fx hate-quake] |  | 0% |  |
| 78 | [png](shots/all-hate/078-walk-home-walk_home_2.png) | walk-home:2 | NANDA: You'll get used to it. Everyone does. |  | 0% |  |
| 79 | [png](shots/all-hate/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 0% | 12 |
| 80 | [png](shots/all-hate/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Home? You're walking me home. That's where you're going. [fx hate-quake] |  | 0% |  |
| 81 | [png](shots/all-hate/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Don't look back at the station. It's gone for you. |  | 0% |  |
| 82 | [png](shots/all-hate/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 0% |  |
| 83 | [png](shots/all-hate/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. [fx chosen-flash: YOU CHOSE TO FOLLOW HER INSIDE.] |  | 0% |  |
| 84 | [png](shots/all-hate/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 0% |  |
| 85 | [png](shots/all-hate/085-door-door_0.png) | door:0 |  |  | 0% |  |
| 86 | [png](shots/all-hate/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 0% | 12 |
| 87 | [png](shots/all-hate/087-door-door_1.png) | door:1 | NANDA: Twelve. Twelve. Twelve. Say it back. [fx hate-quake] |  | 0% |  |
| 88 | [png](shots/all-hate/088-door-door_2.png) | door:2 | NANDA: Say it. …Good. |  | 0% |  |
| 89 | [png](shots/all-hate/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 0% | 12 |
| 90 | [png](shots/all-hate/090-door-door_3.png) | door:3 | NANDA: …Goodnight? It's only 3:28 AM. [fx hate-quake] |  | 0% |  |
| 91 | [png](shots/all-hate/091-leave-leave_0.png) | leave:0 | NANDA: Leaving is not an option. |  | 0% |  |
| 92 | [png](shots/all-hate/092-leave-leave_1.png) | leave:1 | XOR Coffee. 7:00 AM. |  | 0% |  |
| 93 | [png](shots/all-hate/093-leave-leave_2.png) | leave:2 | NANDA: He wakes at 7:00. | Good morning, Nanda ♥ +2; Who's 'he'? ♥ +1; Stop following me ♡ −3 | 0% | 12 |
| 94 | [png](shots/all-hate/094-leave-leave_2.png) | leave:2 | NANDA: I was here first. [fx hate-quake] |  | 0% |  |
| 95 | [png](shots/all-hate/095-leave-leave_3.png) | leave:3 | NANDA: だめ。You already said forever. I heard it. | uhmmm yeah ig ♥ +1; Forever sounds long ♥ +1; FUCK YOU. I'm leaving ♡ −5 | 0% | 12 |
| 96 | [png](shots/all-hate/096-leave-leave_3.png) | leave:3 | NANDA: だめ。You already said forever. I heard it. [fx hate-quake] |  | 0% |  |
| 97 | [png](shots/all-hate/097-leave-fu-leave_fu_0.png) | leave-fu:0 | Her hand rises. Time freezes. The café turns. |  | 0% |  |
| 98 | [png](shots/all-hate/098-leave-fu-leave_fu_1.png) | leave-fu:1 | NANDA: You said leave. I heard 'lea—'. |  | 0% |  |
| 99 | [png](shots/all-hate/099-leave-fu-leave_fu_2.png) | leave-fu:2 | CROWD: fORever and ever |  | 0% |  |
| 100 | [png](shots/all-hate/100-leave-fu-leave_fu_3.png) | leave-fu:3 | CROWD: fORever and ever and ever |  | 0% |  |
| 101 | [png](shots/all-hate/101-leave-fu-leave_fu_4.png) | leave-fu:4 | [END CARD] GAME OVER 0% |  | 0% |  |
| 102 | [png](shots/all-hate/102-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### all-love (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/all-love/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/all-love/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 11 |
| 2 | [png](shots/all-love/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/all-love/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/all-love/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/all-love/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/all-love/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/all-love/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/all-love/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 9 | [png](shots/all-love/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/all-love/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/all-love/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:27 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/all-love/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/all-love/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/all-love/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/all-love/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/all-love/016-park-park_4.png) | park:4 | NANDA: It's 3:27 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/all-love/017-park-park_4.png) | park:4 | NANDA: The book! It's late. Like you. But you came. |  | 23% |  |
| 18 | [png](shots/all-love/018-errand-library-errand_library_0.png) | errand-library:0 | A rail crossing. Bells ring. Sakura on the tracks. |  | 23% |  |
| 19 | [png](shots/all-love/019-errand-library-errand_library_1.png) | errand-library:1 | NANDA: This book is forty days late. I kept it because you touched it once. | That's so cute ♥ +3; I don't remember that ♥ +1; That's creepy ♡ −4 | 23% | 12 |
| 20 | [png](shots/all-love/020-errand-library-errand_library_1.png) | errand-library:1 | NANDA: I knew you'd say that. I wrote it down. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/all-love/021-errand-library-errand_library_2.png) | errand-library:2 | NANDA: The gate is down. The train is a big metal door. I hate doors. Stand clos |  | 28% |  |
| 22 | [png](shots/all-love/022-errand-library-errand_library_3.png) | errand-library:3 | NANDA: Book's back. Now the library can't keep you either. Only I can. | Only you ♥ +4; Let's go eat ♥ +1; Nobody keeps me ♡ −5 | 28% | 12 |
| 23 | [png](shots/all-love/023-errand-library-errand_library_3.png) | errand-library:3 | NANDA: Only me. Say it at the station too. [fx love-burst] |  | 33% |  |
| 24 | [png](shots/all-love/024-errand-library-errand_library_4.png) | errand-library:4 | WALK TO THE FOOD STALLS | Walk to the food stalls; Stroll to the yummy stalls ♡ | 33% |  |
| 25 | [png](shots/all-love/025-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 33% | 12 |
| 26 | [png](shots/all-love/026-hungry-hungry_0.png) | hungry:0 | NANDA: With naan! You know me so well. ♡ [fx love-burst] |  | 38% |  |
| 27 | [png](shots/all-love/027-hungry-hungry_1.png) | hungry:1 | NANDA: Tear the naan. Give me the soft part. Always the soft part. |  | 38% |  |
| 28 | [png](shots/all-love/028-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 38% | 12 |
| 29 | [png](shots/all-love/029-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 42% |  |
| 30 | [png](shots/all-love/030-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 42% |  |
| 31 | [png](shots/all-love/031-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 42% | 12 |
| 32 | [png](shots/all-love/032-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 46% |  |
| 33 | [png](shots/all-love/033-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 46% |  |
| 34 | [png](shots/all-love/034-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:28 AM, a sleepy night, and this is a cl |  | 46% |  |
| 35 | [png](shots/all-love/035-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 46% |  |
| 36 | [png](shots/all-love/036-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 46% |  |
| 37 | [png](shots/all-love/037-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 46% |  |
| 38 | [png](shots/all-love/038-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 46% | 12 |
| 39 | [png](shots/all-love/039-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 51% |  |
| 40 | [png](shots/all-love/040-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 51% |  |
| 41 | [png](shots/all-love/041-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 51% |  |
| 42 | [png](shots/all-love/042-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 43 | [png](shots/all-love/043-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 44 | [png](shots/all-love/044-naan-naan_0.png) | naan:0 |  |  |  |  |
| 45 | [png](shots/all-love/045-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not our lunch. |  |  |  |
| 46 | [png](shots/all-love/046-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 47 | [png](shots/all-love/047-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 48 | [png](shots/all-love/048-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 49 | [png](shots/all-love/049-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 50 | [png](shots/all-love/050-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 51 | [png](shots/all-love/051-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 52 | [png](shots/all-love/052-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 53 | [png](shots/all-love/053-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 54 | [png](shots/all-love/054-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 55 | [png](shots/all-love/055-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 56 | [png](shots/all-love/056-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 57 | [png](shots/all-love/057-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 58 | [png](shots/all-love/058-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 59 | [png](shots/all-love/059-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 51% | 12 |
| 60 | [png](shots/all-love/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 55% |  |
| 61 | [png](shots/all-love/061-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:2 |  | 55% |  |
| 62 | [png](shots/all-love/062-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 55% |  |
| 63 | [png](shots/all-love/063-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 55% |  |
| 64 | [png](shots/all-love/064-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 55% |  |
| 65 | [png](shots/all-love/065-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:29 AM. |  | 55% |  |
| 66 | [png](shots/all-love/066-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 55% | 12 |
| 67 | [png](shots/all-love/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 61% |  |
| 68 | [png](shots/all-love/068-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 61% |  |
| 69 | [png](shots/all-love/069-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 61% | 11 |
| 70 | [png](shots/all-love/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 67% |  |
| 71 | [png](shots/all-love/071-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 67% |  |
| 72 | [png](shots/all-love/072-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 67% |  |
| 73 | [png](shots/all-love/073-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 67% |  |
| 74 | [png](shots/all-love/074-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 67% |  |
| 75 | [png](shots/all-love/075-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 67% | 12 |
| 76 | [png](shots/all-love/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 71% |  |
| 77 | [png](shots/all-love/077-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 71% |  |
| 78 | [png](shots/all-love/078-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 71% | 12 |
| 79 | [png](shots/all-love/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 75% |  |
| 80 | [png](shots/all-love/080-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 75% |  |
| 81 | [png](shots/all-love/081-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 75% |  |
| 82 | [png](shots/all-love/082-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 75% |  |
| 83 | [png](shots/all-love/083-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 75% |  |
| 84 | [png](shots/all-love/084-door-door_0.png) | door:0 |  |  | 75% |  |
| 85 | [png](shots/all-love/085-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 75% | 12 |
| 86 | [png](shots/all-love/086-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 78% |  |
| 87 | [png](shots/all-love/087-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 78% |  |
| 88 | [png](shots/all-love/088-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 78% | 12 |
| 89 | [png](shots/all-love/089-door-door_3.png) | door:3 | NANDA: One cup. I'll pour it slow. [fx love-burst] |  | 83% |  |
| 90 | [png](shots/all-love/090-genkan-in-genkan_in_0.png) | genkan-in:0 | Her shoes. Lined up to the millimetre. |  |  |  |
| 91 | [png](shots/all-love/091-genkan-in-genkan_in_1.png) | genkan-in:1 | Men's slippers. Already set out. |  |  |  |
| 92 | [png](shots/all-love/092-genkan-in-genkan_in_2.png) | genkan-in:2 | A tiny shrine. Inside: a circuit you built. |  |  |  |
| 93 | [png](shots/all-love/093-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: おかえり。Welcome home. I mean my home. I mean our home. Same thing. | ただいま ♥ +4; Thanks for having me ♥ +1; This isn't my home ♡ −5 | 83% | 12 |
| 94 | [png](shots/all-love/094-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: You said it! ただいま! I'm keeping that. [fx love-burst] |  | 88% |  |
| 95 | [png](shots/all-love/095-genkan-talk-genkan_talk_1.png) | genkan-talk:1 | NANDA: Slippers on. I bought them in your size. Last year. Before we met. Don't  |  | 88% |  |
| 96 | [png](shots/all-love/096-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I made a list of things you like. Forty things. I'm number one. I checked | You're number one ♥ +3; What's number two? ♥ +1; Burn the list ♡ −5 | 88% | 12 |
| 97 | [png](shots/all-love/097-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I knew it. The list is never wrong. [fx love-burst] |  | 93% |  |
| 98 | [png](shots/all-love/098-genkan-talk-genkan_talk_3.png) | genkan-talk:3 | NANDA: Kitchen's this way. Don't open the other doors. They're shy. |  | 93% |  |
| 99 | [png](shots/all-love/099-cup-cup_0.png) | cup:0 | NANDA: I made tamagoyaki. For no reason. Eat. | Eat it all ♥ +2; Eat a little ♥ +1; I'm not hungry ♡ −3 | 93% | 12 |
| 100 | [png](shots/all-love/100-cup-cup_0.png) | cup:0 | NANDA: See? You needed me. [fx love-burst] |  | 96% |  |
| 101 | [png](shots/all-love/101-cup-cup_1.png) | cup:1 | Third teacup. Nobody poured it. Tamagoyaki on its saucer. |  | 96% |  |
| 102 | [png](shots/all-love/102-cup-cup_2.png) | cup:2 | MC: Who's the third cup for? |  | 96% |  |
| 103 | [png](shots/all-love/103-cup-cup_3.png) | cup:3 | NANDA: For Input B. Silly. It's always three of us. | Drink ♥ +3; Hold the cup ♥ +1; Stand up ♡ −3 | 96% | 12 |
| 104 | [png](shots/all-love/104-cup-cup_3.png) | cup:3 | NANDA: Drink. It's warm. It makes the thinking stop. [fx love-burst] |  | 100% |  |
| 105 | [png](shots/all-love/105-steeped-steeped_0.png) | steeped:0 | OR |  | 100% |  |
| 106 | [png](shots/all-love/106-steeped-steeped_1.png) | steeped:1 | NANDA: Rest. I'll do the remembering. |  | 100% |  |
| 107 | [png](shots/all-love/107-steeped-steeped_2.png) | steeped:2 | NANDA: Warm cup, sweet sleep. You're mine to keep. |  | 100% |  |
| 108 | [png](shots/all-love/108-steeped-steeped_3.png) | steeped:3 | NANDA: いつまでも一緒。…FORever. ね？ |  | 100% |  |
| 109 | [png](shots/all-love/109-steeped-steeped_4.png) | steeped:4 | [END CARD] YOU WIN 100% |  | 100% |  |
| 110 | [png](shots/all-love/110-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### reduced-motion__steeped (1920x1080, reduced motion)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/reduced-motion__steeped/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/reduced-motion__steeped/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 2 | [png](shots/reduced-motion__steeped/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst still] |  | 4% |  |
| 3 | [png](shots/reduced-motion__steeped/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/reduced-motion__steeped/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/reduced-motion__steeped/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst still] |  | 7% |  |
| 6 | [png](shots/reduced-motion__steeped/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/reduced-motion__steeped/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/reduced-motion__steeped/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 9 | [png](shots/reduced-motion__steeped/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst still] |  | 12% |  |
| 10 | [png](shots/reduced-motion__steeped/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/reduced-motion__steeped/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:27 AM. ♡ [fx love-burst still] |  | 16% |  |
| 12 | [png](shots/reduced-motion__steeped/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/reduced-motion__steeped/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/reduced-motion__steeped/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst still] |  | 20% |  |
| 15 | [png](shots/reduced-motion__steeped/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/reduced-motion__steeped/016-park-park_4.png) | park:4 | NANDA: It's 3:27 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/reduced-motion__steeped/017-park-park_4.png) | park:4 | NANDA: The book! It's late. Like you. But you came. |  | 23% |  |
| 18 | [png](shots/reduced-motion__steeped/018-errand-library-errand_library_0.png) | errand-library:0 | A rail crossing. Bells ring. Sakura on the tracks. |  | 23% |  |
| 19 | [png](shots/reduced-motion__steeped/019-errand-library-errand_library_1.png) | errand-library:1 | NANDA: This book is forty days late. I kept it because you touched it once. | That's so cute ♥ +3; I don't remember that ♥ +1; That's creepy ♡ −4 | 23% | 12 |
| 20 | [png](shots/reduced-motion__steeped/020-errand-library-errand_library_1.png) | errand-library:1 | NANDA: I knew you'd say that. I wrote it down. [fx love-burst still] |  | 28% |  |
| 21 | [png](shots/reduced-motion__steeped/021-errand-library-errand_library_2.png) | errand-library:2 | NANDA: The gate is down. The train is a big metal door. I hate doors. Stand clos |  | 28% |  |
| 22 | [png](shots/reduced-motion__steeped/022-errand-library-errand_library_3.png) | errand-library:3 | NANDA: Book's back. Now the library can't keep you either. Only I can. | Only you ♥ +4; Let's go eat ♥ +1; Nobody keeps me ♡ −5 | 28% | 12 |
| 23 | [png](shots/reduced-motion__steeped/023-errand-library-errand_library_3.png) | errand-library:3 | NANDA: Only me. Say it at the station too. [fx love-burst still] |  | 33% |  |
| 24 | [png](shots/reduced-motion__steeped/024-errand-library-errand_library_4.png) | errand-library:4 | WALK TO THE FOOD STALLS | Walk to the food stalls; Stroll to the yummy stalls ♡ | 33% |  |
| 25 | [png](shots/reduced-motion__steeped/025-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 33% | 12 |
| 26 | [png](shots/reduced-motion__steeped/026-hungry-hungry_0.png) | hungry:0 | NANDA: With naan! You know me so well. ♡ [fx love-burst still] |  | 38% |  |
| 27 | [png](shots/reduced-motion__steeped/027-hungry-hungry_1.png) | hungry:1 | NANDA: Tear the naan. Give me the soft part. Always the soft part. |  | 38% |  |
| 28 | [png](shots/reduced-motion__steeped/028-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 38% | 12 |
| 29 | [png](shots/reduced-motion__steeped/029-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst still] |  | 42% |  |
| 30 | [png](shots/reduced-motion__steeped/030-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 42% |  |
| 31 | [png](shots/reduced-motion__steeped/031-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 42% | 12 |
| 32 | [png](shots/reduced-motion__steeped/032-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst still] |  | 46% |  |
| 33 | [png](shots/reduced-motion__steeped/033-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 46% |  |
| 34 | [png](shots/reduced-motion__steeped/034-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:28 AM, a sleepy night, and this is a cl |  | 46% |  |
| 35 | [png](shots/reduced-motion__steeped/035-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 46% |  |
| 36 | [png](shots/reduced-motion__steeped/036-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 46% |  |
| 37 | [png](shots/reduced-motion__steeped/037-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 46% |  |
| 38 | [png](shots/reduced-motion__steeped/038-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 46% | 12 |
| 39 | [png](shots/reduced-motion__steeped/039-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst still] |  | 51% |  |
| 40 | [png](shots/reduced-motion__steeped/040-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 51% |  |
| 41 | [png](shots/reduced-motion__steeped/041-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 51% |  |
| 42 | [png](shots/reduced-motion__steeped/042-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 43 | [png](shots/reduced-motion__steeped/043-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 44 | [png](shots/reduced-motion__steeped/044-naan-naan_0.png) | naan:0 |  |  |  |  |
| 45 | [png](shots/reduced-motion__steeped/045-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not our lunch. |  |  |  |
| 46 | [png](shots/reduced-motion__steeped/046-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 47 | [png](shots/reduced-motion__steeped/047-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 48 | [png](shots/reduced-motion__steeped/048-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 49 | [png](shots/reduced-motion__steeped/049-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 50 | [png](shots/reduced-motion__steeped/050-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 51 | [png](shots/reduced-motion__steeped/051-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 52 | [png](shots/reduced-motion__steeped/052-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 53 | [png](shots/reduced-motion__steeped/053-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 54 | [png](shots/reduced-motion__steeped/054-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 55 | [png](shots/reduced-motion__steeped/055-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 56 | [png](shots/reduced-motion__steeped/056-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 51% | 12 |
| 57 | [png](shots/reduced-motion__steeped/057-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst still] |  | 55% |  |
| 58 | [png](shots/reduced-motion__steeped/058-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:2 |  | 55% |  |
| 59 | [png](shots/reduced-motion__steeped/059-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 55% |  |
| 60 | [png](shots/reduced-motion__steeped/060-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 55% |  |
| 61 | [png](shots/reduced-motion__steeped/061-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 55% |  |
| 62 | [png](shots/reduced-motion__steeped/062-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:29 AM. |  | 55% |  |
| 63 | [png](shots/reduced-motion__steeped/063-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 55% | 12 |
| 64 | [png](shots/reduced-motion__steeped/064-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst still] |  | 61% |  |
| 65 | [png](shots/reduced-motion__steeped/065-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 61% |  |
| 66 | [png](shots/reduced-motion__steeped/066-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 61% | 12 |
| 67 | [png](shots/reduced-motion__steeped/067-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst still] |  | 67% |  |
| 68 | [png](shots/reduced-motion__steeped/068-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 67% |  |
| 69 | [png](shots/reduced-motion__steeped/069-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 67% |  |
| 70 | [png](shots/reduced-motion__steeped/070-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 67% |  |
| 71 | [png](shots/reduced-motion__steeped/071-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 67% |  |
| 72 | [png](shots/reduced-motion__steeped/072-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 67% | 12 |
| 73 | [png](shots/reduced-motion__steeped/073-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst still] |  | 71% |  |
| 74 | [png](shots/reduced-motion__steeped/074-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 71% |  |
| 75 | [png](shots/reduced-motion__steeped/075-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 71% | 12 |
| 76 | [png](shots/reduced-motion__steeped/076-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst still] |  | 75% |  |
| 77 | [png](shots/reduced-motion__steeped/077-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 75% |  |
| 78 | [png](shots/reduced-motion__steeped/078-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 75% |  |
| 79 | [png](shots/reduced-motion__steeped/079-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 75% |  |
| 80 | [png](shots/reduced-motion__steeped/080-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 75% |  |
| 81 | [png](shots/reduced-motion__steeped/081-door-door_0.png) | door:0 |  |  | 75% |  |
| 82 | [png](shots/reduced-motion__steeped/082-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 75% | 12 |
| 83 | [png](shots/reduced-motion__steeped/083-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst still] |  | 78% |  |
| 84 | [png](shots/reduced-motion__steeped/084-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 78% |  |
| 85 | [png](shots/reduced-motion__steeped/085-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 78% | 12 |
| 86 | [png](shots/reduced-motion__steeped/086-door-door_3.png) | door:3 | NANDA: One cup. I'll pour it slow. [fx love-burst still] |  | 83% |  |
| 87 | [png](shots/reduced-motion__steeped/087-genkan-in-genkan_in_0.png) | genkan-in:0 | Her shoes. Lined up to the millimetre. |  |  |  |
| 88 | [png](shots/reduced-motion__steeped/088-genkan-in-genkan_in_1.png) | genkan-in:1 | Men's slippers. Already set out. |  |  |  |
| 89 | [png](shots/reduced-motion__steeped/089-genkan-in-genkan_in_2.png) | genkan-in:2 | A tiny shrine. Inside: a circuit you built. |  |  |  |
| 90 | [png](shots/reduced-motion__steeped/090-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: おかえり。Welcome home. I mean my home. I mean our home. Same thing. | ただいま ♥ +4; Thanks for having me ♥ +1; This isn't my home ♡ −5 | 83% | 12 |
| 91 | [png](shots/reduced-motion__steeped/091-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: You said it! ただいま! I'm keeping that. [fx love-burst still] |  | 88% |  |
| 92 | [png](shots/reduced-motion__steeped/092-genkan-talk-genkan_talk_1.png) | genkan-talk:1 | NANDA: Slippers on. I bought them in your size. Last year. Before we met. Don't  |  | 88% |  |
| 93 | [png](shots/reduced-motion__steeped/093-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I made a list of things you like. Forty things. I'm number one. I checked | You're number one ♥ +3; What's number two? ♥ +1; Burn the list ♡ −5 | 88% | 12 |
| 94 | [png](shots/reduced-motion__steeped/094-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I knew it. The list is never wrong. [fx love-burst still] |  | 93% |  |
| 95 | [png](shots/reduced-motion__steeped/095-genkan-talk-genkan_talk_3.png) | genkan-talk:3 | NANDA: Kitchen's this way. Don't open the other doors. They're shy. |  | 93% |  |
| 96 | [png](shots/reduced-motion__steeped/096-cup-cup_0.png) | cup:0 | NANDA: I made tamagoyaki. For no reason. Eat. | Eat it all ♥ +2; Eat a little ♥ +1; I'm not hungry ♡ −3 | 93% | 12 |
| 97 | [png](shots/reduced-motion__steeped/097-cup-cup_0.png) | cup:0 | NANDA: See? You needed me. [fx love-burst still] |  | 96% |  |
| 98 | [png](shots/reduced-motion__steeped/098-cup-cup_1.png) | cup:1 | Third teacup. Nobody poured it. Tamagoyaki on its saucer. |  | 96% |  |
| 99 | [png](shots/reduced-motion__steeped/099-cup-cup_2.png) | cup:2 | MC: Who's the third cup for? |  | 96% |  |
| 100 | [png](shots/reduced-motion__steeped/100-cup-cup_3.png) | cup:3 | NANDA: For Input B. Silly. It's always three of us. | Drink ♥ +3; Hold the cup ♥ +1; Stand up ♡ −3 | 96% | 12 |
| 101 | [png](shots/reduced-motion__steeped/101-cup-cup_3.png) | cup:3 | NANDA: Drink. It's warm. It makes the thinking stop. [fx love-burst still] |  | 100% |  |
| 102 | [png](shots/reduced-motion__steeped/102-steeped-steeped_0.png) | steeped:0 | OR |  | 100% |  |
| 103 | [png](shots/reduced-motion__steeped/103-steeped-steeped_1.png) | steeped:1 | NANDA: Rest. I'll do the remembering. |  | 100% |  |
| 104 | [png](shots/reduced-motion__steeped/104-steeped-steeped_2.png) | steeped:2 | NANDA: Warm cup, sweet sleep. You're mine to keep. |  | 100% |  |
| 105 | [png](shots/reduced-motion__steeped/105-steeped-steeped_3.png) | steeped:3 | NANDA: いつまでも一緒。…FORever. ね？ |  | 100% |  |
| 106 | [png](shots/reduced-motion__steeped/106-steeped-steeped_4.png) | steeped:4 | [END CARD] YOU WIN 100% |  | 100% |  |
| 107 | [png](shots/reduced-motion__steeped/107-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### vp1024__escape-win (1024x768)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/vp1024__escape-win/000-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/vp1024__escape-win/001-rooftop-rooftop_1.png) | rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 2 | [png](shots/vp1024__escape-win/002-rooftop-rooftop_1.png) | rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/vp1024__escape-win/003-rooftop-rooftop_2.png) | rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/vp1024__escape-win/004-rooftop-rooftop_3.png) | rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 11 |
| 5 | [png](shots/vp1024__escape-win/005-rooftop-rooftop_3.png) | rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/vp1024__escape-win/006-rooftop-rooftop_4.png) | rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/vp1024__escape-win/007-rooftop-rooftop_5.png) | rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/vp1024__escape-win/008-rooftop-rooftop_6.png) | rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 9 | [png](shots/vp1024__escape-win/009-rooftop-rooftop_6.png) | rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/vp1024__escape-win/010-park-park_0.png) | park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/vp1024__escape-win/011-park-park_0.png) | park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:29 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/vp1024__escape-win/012-park-park_1.png) | park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/vp1024__escape-win/013-park-park_2.png) | park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/vp1024__escape-win/014-park-park_2.png) | park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/vp1024__escape-win/015-park-park_3.png) | park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/vp1024__escape-win/016-park-park_4.png) | park:4 | NANDA: It's 3:29 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/vp1024__escape-win/017-park-park_4.png) | park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 18 | [png](shots/vp1024__escape-win/018-errand-shop-errand_shop_0.png) | errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 19 | [png](shots/vp1024__escape-win/019-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 20 | [png](shots/vp1024__escape-win/020-errand-shop-errand_shop_1.png) | errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/vp1024__escape-win/021-errand-shop-errand_shop_2.png) | errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 22 | [png](shots/vp1024__escape-win/022-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 23 | [png](shots/vp1024__escape-win/023-errand-shop-errand_shop_3.png) | errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 24 | [png](shots/vp1024__escape-win/024-errand-shop-errand_shop_4.png) | errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 25 | [png](shots/vp1024__escape-win/025-errand-shop-errand_shop_5.png) | errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 26 | [png](shots/vp1024__escape-win/026-hungry-hungry_0.png) | hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 27 | [png](shots/vp1024__escape-win/027-hungry-hungry_0.png) | hungry:0 | NANDA: Crunchy! You chose. I'll pretend I did. |  | 35% |  |
| 28 | [png](shots/vp1024__escape-win/028-hungry-hungry_1.png) | hungry:1 | NANDA: Cut the katsu. Blow on it. I like it when you work for me. |  | 35% |  |
| 29 | [png](shots/vp1024__escape-win/029-hungry-hungry_2.png) | hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 35% | 12 |
| 30 | [png](shots/vp1024__escape-win/030-hungry-hungry_2.png) | hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 39% |  |
| 31 | [png](shots/vp1024__escape-win/031-town-town_0.png) | town:0 | The big crossing. A thousand people. She only looks at you. |  | 39% |  |
| 32 | [png](shots/vp1024__escape-win/032-town-town_1.png) | town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 39% | 12 |
| 33 | [png](shots/vp1024__escape-win/033-town-town_1.png) | town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 43% |  |
| 34 | [png](shots/vp1024__escape-win/034-town-town_2.png) | town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 43% |  |
| 35 | [png](shots/vp1024__escape-win/035-town-town_3.png) | town:3 | NANDA: Want to see a magic trick? It's 3:30 AM, a sleepy night, and this is a cl |  | 43% |  |
| 36 | [png](shots/vp1024__escape-win/036-town-town_4.png) | town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 43% |  |
| 37 | [png](shots/vp1024__escape-win/037-town-town_5.png) | town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 43% |  |
| 38 | [png](shots/vp1024__escape-win/038-town-town_6.png) | town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 43% |  |
| 39 | [png](shots/vp1024__escape-win/039-town-town_7.png) | town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 43% | 12 |
| 40 | [png](shots/vp1024__escape-win/040-town-town_7.png) | town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 48% |  |
| 41 | [png](shots/vp1024__escape-win/041-town-town_8.png) | town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 48% |  |
| 42 | [png](shots/vp1024__escape-win/042-town-town_9.png) | town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 48% |  |
| 43 | [png](shots/vp1024__escape-win/043-train-train_0.png) | train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/vp1024__escape-win/044-train-train_1.png) | train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 45 | [png](shots/vp1024__escape-win/045-naan-naan_0.png) | naan:0 |  |  |  |  |
| 46 | [png](shots/vp1024__escape-win/046-naan-naan_1.png) | naan:1 | MC: Technically, that's a NAND gate. Not bread. |  |  |  |
| 47 | [png](shots/vp1024__escape-win/047-blackout-blackout_0.png) | blackout:0 |  |  |  |  |
| 48 | [png](shots/vp1024__escape-win/048-blackout-blackout_1.png) | blackout:1 |  |  |  |  |
| 49 | [png](shots/vp1024__escape-win/049-blackout-blackout_2.png) | blackout:2 |  |  |  |  |
| 50 | [png](shots/vp1024__escape-win/050-blackout-blackout_3.png) | blackout:3 |  |  |  |  |
| 51 | [png](shots/vp1024__escape-win/051-blackout-blackout_4.png) | blackout:4 |  |  |  |  |
| 52 | [png](shots/vp1024__escape-win/052-blackout-blackout_5.png) | blackout:5 |  |  |  |  |
| 53 | [png](shots/vp1024__escape-win/053-blackout-blackout_6.png) | blackout:6 |  |  |  |  |
| 54 | [png](shots/vp1024__escape-win/054-blackout-blackout_7.png) | blackout:7 |  |  |  |  |
| 55 | [png](shots/vp1024__escape-win/055-blackout-blackout_8.png) | blackout:8 |  |  |  |  |
| 56 | [png](shots/vp1024__escape-win/056-blackout-blackout_9.png) | blackout:9 |  |  |  |  |
| 57 | [png](shots/vp1024__escape-win/057-platform-platform_0.png) | platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/vp1024__escape-win/058-platform-platform_1.png) | platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/vp1024__escape-win/059-platform-platform_2.png) | platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/vp1024__escape-win/060-station-talk-station_talk_0.png) | station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 48% | 12 |
| 61 | [png](shots/vp1024__escape-win/061-station-talk-station_talk_0.png) | station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 52% |  |
| 62 | [png](shots/vp1024__escape-win/062-station-talk-station_talk_1.png) | station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:3 |  | 52% |  |
| 63 | [png](shots/vp1024__escape-win/063-station-talk-station_talk_2.png) | station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 52% |  |
| 64 | [png](shots/vp1024__escape-win/064-station-talk-station_talk_3.png) | station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 52% |  |
| 65 | [png](shots/vp1024__escape-win/065-station-talk-station_talk_4.png) | station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 52% |  |
| 66 | [png](shots/vp1024__escape-win/066-rain-crossing-rain_crossing_0.png) | rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:30 AM. |  | 52% |  |
| 67 | [png](shots/vp1024__escape-win/067-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 52% | 12 |
| 68 | [png](shots/vp1024__escape-win/068-rain-crossing-rain_crossing_1.png) | rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 58% |  |
| 69 | [png](shots/vp1024__escape-win/069-rain-crossing-rain_crossing_2.png) | rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 58% |  |
| 70 | [png](shots/vp1024__escape-win/070-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 58% | 12 |
| 71 | [png](shots/vp1024__escape-win/071-rain-crossing-rain_crossing_3.png) | rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 64% |  |
| 72 | [png](shots/vp1024__escape-win/072-rain-crossing-rain_crossing_4.png) | rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 64% |  |
| 73 | [png](shots/vp1024__escape-win/073-underpass-underpass_0.png) | underpass:0 | Your steps, her steps. Always an even count. |  | 64% |  |
| 74 | [png](shots/vp1024__escape-win/074-underpass-underpass_1.png) | underpass:1 | NANDA: Don't read the ads. Read me. |  | 64% |  |
| 75 | [png](shots/vp1024__escape-win/075-walk-home-walk_home_0.png) | walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 64% |  |
| 76 | [png](shots/vp1024__escape-win/076-walk-home-walk_home_1.png) | walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 64% | 12 |
| 77 | [png](shots/vp1024__escape-win/077-walk-home-walk_home_1.png) | walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 68% |  |
| 78 | [png](shots/vp1024__escape-win/078-walk-home-walk_home_2.png) | walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 68% |  |
| 79 | [png](shots/vp1024__escape-win/079-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 68% | 12 |
| 80 | [png](shots/vp1024__escape-win/080-walk-home-walk_home_3.png) | walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 72% |  |
| 81 | [png](shots/vp1024__escape-win/081-walk-home-walk_home_4.png) | walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 72% |  |
| 82 | [png](shots/vp1024__escape-win/082-walk-home-walk_home_5.png) | walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 72% |  |
| 83 | [png](shots/vp1024__escape-win/083-apartment-apartment_0.png) | apartment:0 | Four floors. One window lit. |  | 72% |  |
| 84 | [png](shots/vp1024__escape-win/084-apartment-apartment_1.png) | apartment:1 | NANDA: That's mine. I left the light on for you. |  | 72% |  |
| 85 | [png](shots/vp1024__escape-win/085-door-door_0.png) | door:0 |  |  | 72% |  |
| 86 | [png](shots/vp1024__escape-win/086-door-door_1.png) | door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 72% | 12 |
| 87 | [png](shots/vp1024__escape-win/087-door-door_1.png) | door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 75% |  |
| 88 | [png](shots/vp1024__escape-win/088-door-door_2.png) | door:2 | NANDA: Come in? Just for tea. |  | 75% |  |
| 89 | [png](shots/vp1024__escape-win/089-door-door_3.png) | door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 75% | 12 |
| 90 | [png](shots/vp1024__escape-win/090-door-door_3.png) | door:3 | NANDA: One cup. I'll pour it slow. [fx love-burst] |  | 80% |  |
| 91 | [png](shots/vp1024__escape-win/091-genkan-in-genkan_in_0.png) | genkan-in:0 | Her shoes. Lined up to the millimetre. |  |  |  |
| 92 | [png](shots/vp1024__escape-win/092-genkan-in-genkan_in_1.png) | genkan-in:1 | Men's slippers. Already set out. |  |  |  |
| 93 | [png](shots/vp1024__escape-win/093-genkan-in-genkan_in_2.png) | genkan-in:2 | A tiny shrine. Inside: a circuit you built. |  |  |  |
| 94 | [png](shots/vp1024__escape-win/094-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: おかえり。Welcome home. I mean my home. I mean our home. Same thing. | ただいま ♥ +4; Thanks for having me ♥ +1; This isn't my home ♡ −5 | 80% | 12 |
| 95 | [png](shots/vp1024__escape-win/095-genkan-talk-genkan_talk_0.png) | genkan-talk:0 | NANDA: You said it! ただいま! I'm keeping that. [fx love-burst] |  | 86% |  |
| 96 | [png](shots/vp1024__escape-win/096-genkan-talk-genkan_talk_1.png) | genkan-talk:1 | NANDA: Slippers on. I bought them in your size. Last year. Before we met. Don't  |  | 86% |  |
| 97 | [png](shots/vp1024__escape-win/097-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I made a list of things you like. Forty things. I'm number one. I checked | You're number one ♥ +3; What's number two? ♥ +1; Burn the list ♡ −5 | 86% | 12 |
| 98 | [png](shots/vp1024__escape-win/098-genkan-talk-genkan_talk_2.png) | genkan-talk:2 | NANDA: I knew it. The list is never wrong. [fx love-burst] |  | 90% |  |
| 99 | [png](shots/vp1024__escape-win/099-genkan-talk-genkan_talk_3.png) | genkan-talk:3 | NANDA: Kitchen's this way. Don't open the other doors. They're shy. |  | 90% |  |
| 100 | [png](shots/vp1024__escape-win/100-cup-cup_0.png) | cup:0 | NANDA: I made tamagoyaki. For no reason. Eat. | Eat it all ♥ +2; Eat a little ♥ +1; I'm not hungry ♡ −3 | 90% | 12 |
| 101 | [png](shots/vp1024__escape-win/101-cup-cup_0.png) | cup:0 | NANDA: See? You needed me. [fx love-burst] |  | 93% |  |
| 102 | [png](shots/vp1024__escape-win/102-cup-cup_1.png) | cup:1 | Third teacup. Nobody poured it. Tamagoyaki on its saucer. |  | 93% |  |
| 103 | [png](shots/vp1024__escape-win/103-cup-cup_2.png) | cup:2 | MC: Who's the third cup for? |  | 93% |  |
| 104 | [png](shots/vp1024__escape-win/104-cup-cup_3.png) | cup:3 | NANDA: For Input B. Silly. It's always three of us. | Drink ♥ +3; Hold the cup ♥ +1; Stand up ♡ −3 | 93% | 12 |
| 105 | [png](shots/vp1024__escape-win/105-cup-cup_3.png) | cup:3 | NANDA: Sit. The tea isn't finished. [fx hate-quake] |  | 88% |  |
| 106 | [png](shots/vp1024__escape-win/106-unknown-unknown_0.png) | unknown:0 | You stand. The floor tilts a little. |  |  |  |
| 107 | [png](shots/vp1024__escape-win/107-unknown-unknown_1.png) | unknown:1 | Under the table: a floor hatch. Too big for storage. | Open the hatch; Gently open the hatch ♡ |  |  |
| 108 | [png](shots/vp1024__escape-win/108-unknown-unknown_2.png) | unknown:2 | A steep wooden ladder. Down into the dark. | Climb down; Tippy-toe down ♡ |  |  |
| 109 | [png](shots/vp1024__escape-win/109-escape-escape_0.png) | escape:0 | Concrete. One bulb. Rain at a high window. | Look at the shelves; Peek at the pretty shelves ♡ |  |  |
| 110 | [png](shots/vp1024__escape-win/110-escape-escape_1.png) | escape:1 | Jars on the shelves. Each one: a date, a name. |  |  |  |
| 111 | [png](shots/vp1024__escape-win/111-escape-escape_2.png) | escape:2 | The dates go back years. The names are all different. |  |  |  |
| 112 | [png](shots/vp1024__escape-win/112-escape-escape_3.png) | escape:3 | Bento boxes, one per day. Your name on each. Untouched. |  |  |  |
| 113 | [png](shots/vp1024__escape-win/113-escape-escape_4.png) | escape:4 | The oldest is dated before you met. |  |  |  |
| 114 | [png](shots/vp1024__escape-win/114-escape-escape_5.png) | escape:5 | A mortar and a mallet. One fresh mochi. Hers only. | Keep looking; Keep looking… and nothing else |  |  |
| 115 | [png](shots/vp1024__escape-win/115-escape-escape_6.png) | escape:6 | Newest jar: today, your name, tamagoyaki. Lid off. Empty. |  |  |  |
| 116 | [png](shots/vp1024__escape-win/116-escape-escape_8.png) | escape:8 |  |  |  |  |
| 117 | [png](shots/vp1024__escape-win/117-escape-escape_9.png) | escape:9 |  |  |  |  |
| 118 | dup | escape:11 |  |  |  |  |
| 119 | [png](shots/vp1024__escape-win/119-escape-escape_12.png) | escape:12 | Minutes gone. A clock upstairs chimed. You lost count. |  |  |  |
| 120 | [png](shots/vp1024__escape-win/120-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS LOCKED pins 0/8 |  |  | 40s |
| 121 | [png](shots/vp1024__escape-win/121-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS LOCKED pins 4/8 |  |  | 37s |
| 122 | [png](shots/vp1024__escape-win/122-escape-escape_13.png) | escape:13 | [LOCK GAME] THE DOOR IS OPEN pins 8/8 |  |  | 34s |
| 123 | [png](shots/vp1024__escape-win/123-escape-win-escape_win_0.png) | escape-win:0 | She's waiting at the outside door. |  | 84% |  |
| 124 | [png](shots/vp1024__escape-win/124-escape-win-escape_win_1.png) | escape-win:1 | NANDA: You took the long way. |  | 84% |  |
| 125 | [png](shots/vp1024__escape-win/125-escape-win-escape_win_2.png) | escape-win:2 | NANDA: Home is warm, and sweet. |  | 84% |  |
| 126 | [png](shots/vp1024__escape-win/126-escape-win-escape_win_3.png) | escape-win:3 | NANDA: Sleep now. You're mine to keep. |  | 84% |  |
| 127 | [png](shots/vp1024__escape-win/127-escape-win-escape_win_4.png) | escape-win:4 |  |  |  |  |
| 128 | [png](shots/vp1024__escape-win/128-escape-win-escape_win_5.png) | escape-win:5 | NANDA: Mine. |  |  |  |
| 129 | [png](shots/vp1024__escape-win/129-escape-win-escape_win_6.png) | escape-win:6 | [END CARD] GAME OVER 84% |  |  |  |
| 130 | [png](shots/vp1024__escape-win/130-rooftop-rooftop_0.png) | rooftop:0 | [GOAL CARD] |  | 0% |  |

### loop3__leave-yeah (1920x1080)

| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |
|---|---|---|---|---|---|---|
| 0 | [png](shots/loop3__leave-yeah/000-rooftop-rooftop_0.png) | L1 rooftop:0 | [GOAL CARD] |  | 0% |  |
| 1 | [png](shots/loop3__leave-yeah/001-rooftop-rooftop_1.png) | L1 rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 2 | [png](shots/loop3__leave-yeah/002-rooftop-rooftop_1.png) | L1 rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 3 | [png](shots/loop3__leave-yeah/003-rooftop-rooftop_2.png) | L1 rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 4 | [png](shots/loop3__leave-yeah/004-rooftop-rooftop_3.png) | L1 rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 5 | [png](shots/loop3__leave-yeah/005-rooftop-rooftop_3.png) | L1 rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 6 | [png](shots/loop3__leave-yeah/006-rooftop-rooftop_4.png) | L1 rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 7 | [png](shots/loop3__leave-yeah/007-rooftop-rooftop_5.png) | L1 rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 8 | [png](shots/loop3__leave-yeah/008-rooftop-rooftop_6.png) | L1 rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 9 | [png](shots/loop3__leave-yeah/009-rooftop-rooftop_6.png) | L1 rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 10 | [png](shots/loop3__leave-yeah/010-park-park_0.png) | L1 park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 11 | [png](shots/loop3__leave-yeah/011-park-park_0.png) | L1 park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:30 AM. ♡ [fx love-burst] |  | 16% |  |
| 12 | [png](shots/loop3__leave-yeah/012-park-park_1.png) | L1 park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 13 | [png](shots/loop3__leave-yeah/013-park-park_2.png) | L1 park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 14 | [png](shots/loop3__leave-yeah/014-park-park_2.png) | L1 park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 15 | [png](shots/loop3__leave-yeah/015-park-park_3.png) | L1 park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 16 | [png](shots/loop3__leave-yeah/016-park-park_4.png) | L1 park:4 | NANDA: It's 3:30 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 17 | [png](shots/loop3__leave-yeah/017-park-park_4.png) | L1 park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 18 | [png](shots/loop3__leave-yeah/018-errand-shop-errand_shop_0.png) | L1 errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 19 | [png](shots/loop3__leave-yeah/019-errand-shop-errand_shop_1.png) | L1 errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 20 | [png](shots/loop3__leave-yeah/020-errand-shop-errand_shop_1.png) | L1 errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 21 | [png](shots/loop3__leave-yeah/021-errand-shop-errand_shop_2.png) | L1 errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 22 | [png](shots/loop3__leave-yeah/022-errand-shop-errand_shop_3.png) | L1 errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 23 | [png](shots/loop3__leave-yeah/023-errand-shop-errand_shop_3.png) | L1 errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 24 | [png](shots/loop3__leave-yeah/024-errand-shop-errand_shop_4.png) | L1 errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 25 | [png](shots/loop3__leave-yeah/025-errand-shop-errand_shop_5.png) | L1 errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 26 | [png](shots/loop3__leave-yeah/026-hungry-hungry_0.png) | L1 hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 27 | [png](shots/loop3__leave-yeah/027-hungry-hungry_0.png) | L1 hungry:0 | NANDA: With naan! You know me so well. ♡ [fx love-burst] |  | 36% |  |
| 28 | [png](shots/loop3__leave-yeah/028-hungry-hungry_1.png) | L1 hungry:1 | NANDA: Tear the naan. Give me the soft part. Always the soft part. |  | 36% |  |
| 29 | [png](shots/loop3__leave-yeah/029-hungry-hungry_2.png) | L1 hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 36% | 12 |
| 30 | [png](shots/loop3__leave-yeah/030-hungry-hungry_2.png) | L1 hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 41% |  |
| 31 | [png](shots/loop3__leave-yeah/031-town-town_0.png) | L1 town:0 | The big crossing. A thousand people. She only looks at you. |  | 41% |  |
| 32 | [png](shots/loop3__leave-yeah/032-town-town_1.png) | L1 town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 41% | 12 |
| 33 | [png](shots/loop3__leave-yeah/033-town-town_1.png) | L1 town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 45% |  |
| 34 | [png](shots/loop3__leave-yeah/034-town-town_2.png) | L1 town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 45% |  |
| 35 | [png](shots/loop3__leave-yeah/035-town-town_3.png) | L1 town:3 | NANDA: Want to see a magic trick? It's 3:31 AM, a sleepy night, and this is a cl |  | 45% |  |
| 36 | [png](shots/loop3__leave-yeah/036-town-town_4.png) | L1 town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 45% |  |
| 37 | [png](shots/loop3__leave-yeah/037-town-town_5.png) | L1 town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 45% |  |
| 38 | [png](shots/loop3__leave-yeah/038-town-town_6.png) | L1 town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 45% |  |
| 39 | [png](shots/loop3__leave-yeah/039-town-town_7.png) | L1 town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 45% | 12 |
| 40 | [png](shots/loop3__leave-yeah/040-town-town_7.png) | L1 town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 49% |  |
| 41 | [png](shots/loop3__leave-yeah/041-town-town_8.png) | L1 town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 49% |  |
| 42 | [png](shots/loop3__leave-yeah/042-town-town_9.png) | L1 town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 49% |  |
| 43 | [png](shots/loop3__leave-yeah/043-train-train_0.png) | L1 train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 44 | [png](shots/loop3__leave-yeah/044-train-train_1.png) | L1 train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 45 | [png](shots/loop3__leave-yeah/045-naan-naan_0.png) | L1 naan:0 |  |  |  |  |
| 46 | [png](shots/loop3__leave-yeah/046-naan-naan_1.png) | L1 naan:1 | MC: Technically, that's a NAND gate. Not our lunch. |  |  |  |
| 47 | [png](shots/loop3__leave-yeah/047-blackout-blackout_0.png) | L1 blackout:0 |  |  |  |  |
| 48 | [png](shots/loop3__leave-yeah/048-blackout-blackout_1.png) | L1 blackout:1 |  |  |  |  |
| 49 | [png](shots/loop3__leave-yeah/049-blackout-blackout_2.png) | L1 blackout:2 |  |  |  |  |
| 50 | [png](shots/loop3__leave-yeah/050-blackout-blackout_3.png) | L1 blackout:3 |  |  |  |  |
| 51 | [png](shots/loop3__leave-yeah/051-blackout-blackout_4.png) | L1 blackout:4 |  |  |  |  |
| 52 | [png](shots/loop3__leave-yeah/052-blackout-blackout_5.png) | L1 blackout:5 |  |  |  |  |
| 53 | [png](shots/loop3__leave-yeah/053-blackout-blackout_6.png) | L1 blackout:6 |  |  |  |  |
| 54 | [png](shots/loop3__leave-yeah/054-blackout-blackout_7.png) | L1 blackout:7 |  |  |  |  |
| 55 | [png](shots/loop3__leave-yeah/055-blackout-blackout_8.png) | L1 blackout:8 |  |  |  |  |
| 56 | [png](shots/loop3__leave-yeah/056-blackout-blackout_9.png) | L1 blackout:9 |  |  |  |  |
| 57 | [png](shots/loop3__leave-yeah/057-platform-platform_0.png) | L1 platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 58 | [png](shots/loop3__leave-yeah/058-platform-platform_1.png) | L1 platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 59 | [png](shots/loop3__leave-yeah/059-platform-platform_2.png) | L1 platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 60 | [png](shots/loop3__leave-yeah/060-station-talk-station_talk_0.png) | L1 station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 49% | 12 |
| 61 | [png](shots/loop3__leave-yeah/061-station-talk-station_talk_0.png) | L1 station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 54% |  |
| 62 | [png](shots/loop3__leave-yeah/062-station-talk-station_talk_1.png) | L1 station-talk:1 | NANDA: Hey… have we stood here before? No. Silly. It's just a nice day. It's 3:3 |  | 54% |  |
| 63 | [png](shots/loop3__leave-yeah/063-station-talk-station_talk_2.png) | L1 station-talk:2 | MC: (Weird. Feels like I've heard that before.) |  | 54% |  |
| 64 | [png](shots/loop3__leave-yeah/064-station-talk-station_talk_3.png) | L1 station-talk:3 | NANDA: Déjà vu is just your heart remembering me early. ♡ |  | 54% |  |
| 65 | [png](shots/loop3__leave-yeah/065-station-talk-station_talk_4.png) | L1 station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 54% |  |
| 66 | [png](shots/loop3__leave-yeah/066-rain-crossing-rain_crossing_0.png) | L1 rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:31 AM. |  | 54% |  |
| 67 | [png](shots/loop3__leave-yeah/067-rain-crossing-rain_crossing_1.png) | L1 rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 54% | 12 |
| 68 | [png](shots/loop3__leave-yeah/068-rain-crossing-rain_crossing_1.png) | L1 rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 59% |  |
| 69 | [png](shots/loop3__leave-yeah/069-rain-crossing-rain_crossing_2.png) | L1 rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 59% |  |
| 70 | [png](shots/loop3__leave-yeah/070-rain-crossing-rain_crossing_3.png) | L1 rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 59% | 12 |
| 71 | [png](shots/loop3__leave-yeah/071-rain-crossing-rain_crossing_3.png) | L1 rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 65% |  |
| 72 | [png](shots/loop3__leave-yeah/072-rain-crossing-rain_crossing_4.png) | L1 rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 65% |  |
| 73 | [png](shots/loop3__leave-yeah/073-underpass-underpass_0.png) | L1 underpass:0 | Your steps, her steps. Always an even count. |  | 65% |  |
| 74 | [png](shots/loop3__leave-yeah/074-underpass-underpass_1.png) | L1 underpass:1 | NANDA: Don't read the ads. Read me. |  | 65% |  |
| 75 | [png](shots/loop3__leave-yeah/075-walk-home-walk_home_0.png) | L1 walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 65% |  |
| 76 | [png](shots/loop3__leave-yeah/076-walk-home-walk_home_1.png) | L1 walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 65% | 12 |
| 77 | [png](shots/loop3__leave-yeah/077-walk-home-walk_home_1.png) | L1 walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 70% |  |
| 78 | [png](shots/loop3__leave-yeah/078-walk-home-walk_home_2.png) | L1 walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 70% |  |
| 79 | [png](shots/loop3__leave-yeah/079-walk-home-walk_home_3.png) | L1 walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 70% | 12 |
| 80 | [png](shots/loop3__leave-yeah/080-walk-home-walk_home_3.png) | L1 walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 74% |  |
| 81 | [png](shots/loop3__leave-yeah/081-walk-home-walk_home_4.png) | L1 walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 74% |  |
| 82 | [png](shots/loop3__leave-yeah/082-walk-home-walk_home_5.png) | L1 walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 74% |  |
| 83 | [png](shots/loop3__leave-yeah/083-apartment-apartment_0.png) | L1 apartment:0 | Four floors. One window lit. |  | 74% |  |
| 84 | [png](shots/loop3__leave-yeah/084-apartment-apartment_1.png) | L1 apartment:1 | NANDA: That's mine. I left the light on for you. |  | 74% |  |
| 85 | [png](shots/loop3__leave-yeah/085-door-door_0.png) | L1 door:0 |  |  | 74% |  |
| 86 | [png](shots/loop3__leave-yeah/086-door-door_1.png) | L1 door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 74% | 12 |
| 87 | [png](shots/loop3__leave-yeah/087-door-door_1.png) | L1 door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 77% |  |
| 88 | [png](shots/loop3__leave-yeah/088-door-door_2.png) | L1 door:2 | NANDA: Come in? Just for tea. |  | 77% |  |
| 89 | [png](shots/loop3__leave-yeah/089-door-door_3.png) | L1 door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 77% | 12 |
| 90 | [png](shots/loop3__leave-yeah/090-door-door_3.png) | L1 door:3 | NANDA: …Goodnight? It's only 3:32 AM. [fx hate-quake] |  | 72% |  |
| 91 | [png](shots/loop3__leave-yeah/091-leave-leave_0.png) | L1 leave:0 | NANDA: Leaving is not an option. |  | 72% |  |
| 92 | [png](shots/loop3__leave-yeah/092-leave-leave_1.png) | L1 leave:1 | XOR Coffee. 7:00 AM. |  | 72% |  |
| 93 | [png](shots/loop3__leave-yeah/093-leave-leave_2.png) | L1 leave:2 | NANDA: He wakes at 7:00. | Good morning, Nanda ♥ +2; Who's 'he'? ♥ +1; Stop following me ♡ −3 | 72% | 12 |
| 94 | [png](shots/loop3__leave-yeah/094-leave-leave_2.png) | L1 leave:2 | NANDA: Good morning! Same as yesterday. Same as always. [fx love-burst] |  | 75% |  |
| 95 | [png](shots/loop3__leave-yeah/095-leave-leave_3.png) | L1 leave:3 | NANDA: From now on… can we be fORever? | uhmmm yeah ig ♥ +1; Forever sounds long ♥ +1; FUCK YOU. I'm leaving ♡ −5 | 75% | 12 |
| 96 | [png](shots/loop3__leave-yeah/096-leave-leave_3.png) | L1 leave:3 | NANDA: From now on… can we be fORever? [fx love-burst] |  | 77% |  |
| 97 | [png](shots/loop3__leave-yeah/097-leave-yeah-leave_yeah_0.png) | L1 leave-yeah:0 | NANDA: Hooray! FORever and ever! |  | 77% |  |
| 98 | [png](shots/loop3__leave-yeah/098-leave-yeah-leave_yeah_1.png) | L1 leave-yeah:1 | NANDA: Good input. |  | 77% |  |
| 99 | [png](shots/loop3__leave-yeah/099-leave-yeah-leave_yeah_2.png) | L1 leave-yeah:2 | CROWD: fORever and ever |  | 77% |  |
| 100 | [png](shots/loop3__leave-yeah/100-leave-yeah-leave_yeah_3.png) | L1 leave-yeah:3 | CROWD: fORever and ever and ever |  | 77% |  |
| 101 | [png](shots/loop3__leave-yeah/101-leave-yeah-leave_yeah_4.png) | L1 leave-yeah:4 | [END CARD] GAME OVER 77% |  | 77% |  |
| 102 | [png](shots/loop3__leave-yeah/102-rooftop-rooftop_0.png) | L1 rooftop:0 | [GOAL CARD] |  | 0% |  |
| 103 | [png](shots/loop3__leave-yeah/103-L2-rooftop-rooftop_1.png) | L2 rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 104 | [png](shots/loop3__leave-yeah/104-L2-rooftop-rooftop_1.png) | L2 rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 105 | [png](shots/loop3__leave-yeah/105-L2-rooftop-rooftop_2.png) | L2 rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 106 | [png](shots/loop3__leave-yeah/106-L2-rooftop-rooftop_3.png) | L2 rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 107 | [png](shots/loop3__leave-yeah/107-L2-rooftop-rooftop_3.png) | L2 rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 108 | [png](shots/loop3__leave-yeah/108-L2-rooftop-rooftop_4.png) | L2 rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 109 | [png](shots/loop3__leave-yeah/109-L2-rooftop-rooftop_5.png) | L2 rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 110 | [png](shots/loop3__leave-yeah/110-L2-rooftop-rooftop_6.png) | L2 rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 111 | [png](shots/loop3__leave-yeah/111-L2-rooftop-rooftop_6.png) | L2 rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 112 | [png](shots/loop3__leave-yeah/112-L2-park-park_0.png) | L2 park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 113 | [png](shots/loop3__leave-yeah/113-L2-park-park_0.png) | L2 park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:32 AM. ♡ [fx love-burst] |  | 16% |  |
| 114 | [png](shots/loop3__leave-yeah/114-L2-park-park_1.png) | L2 park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 115 | [png](shots/loop3__leave-yeah/115-L2-park-park_2.png) | L2 park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 116 | [png](shots/loop3__leave-yeah/116-L2-park-park_2.png) | L2 park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 117 | [png](shots/loop3__leave-yeah/117-L2-park-park_3.png) | L2 park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 118 | [png](shots/loop3__leave-yeah/118-L2-park-park_4.png) | L2 park:4 | NANDA: It's 3:32 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 119 | [png](shots/loop3__leave-yeah/119-L2-park-park_4.png) | L2 park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 120 | [png](shots/loop3__leave-yeah/120-L2-errand-shop-errand_shop_0.png) | L2 errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 121 | [png](shots/loop3__leave-yeah/121-L2-errand-shop-errand_shop_1.png) | L2 errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 122 | [png](shots/loop3__leave-yeah/122-L2-errand-shop-errand_shop_1.png) | L2 errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 123 | [png](shots/loop3__leave-yeah/123-L2-errand-shop-errand_shop_2.png) | L2 errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 124 | [png](shots/loop3__leave-yeah/124-L2-errand-shop-errand_shop_3.png) | L2 errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 125 | [png](shots/loop3__leave-yeah/125-L2-errand-shop-errand_shop_3.png) | L2 errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 126 | [png](shots/loop3__leave-yeah/126-L2-errand-shop-errand_shop_4.png) | L2 errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 127 | [png](shots/loop3__leave-yeah/127-L2-errand-shop-errand_shop_5.png) | L2 errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 128 | [png](shots/loop3__leave-yeah/128-L2-hungry-hungry_0.png) | L2 hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 129 | [png](shots/loop3__leave-yeah/129-L2-hungry-hungry_0.png) | L2 hungry:0 | NANDA: With naan! You know me so well. ♡ [fx love-burst] |  | 36% |  |
| 130 | [png](shots/loop3__leave-yeah/130-L2-hungry-hungry_1.png) | L2 hungry:1 | NANDA: Tear the naan. Give me the soft part. Always the soft part. |  | 36% |  |
| 131 | [png](shots/loop3__leave-yeah/131-L2-hungry-hungry_2.png) | L2 hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 36% | 12 |
| 132 | [png](shots/loop3__leave-yeah/132-L2-hungry-hungry_2.png) | L2 hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 41% |  |
| 133 | [png](shots/loop3__leave-yeah/133-L2-town-town_0.png) | L2 town:0 | The big crossing. A thousand people. She only looks at you. |  | 41% |  |
| 134 | [png](shots/loop3__leave-yeah/134-L2-town-town_1.png) | L2 town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 41% | 12 |
| 135 | [png](shots/loop3__leave-yeah/135-L2-town-town_1.png) | L2 town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 45% |  |
| 136 | [png](shots/loop3__leave-yeah/136-L2-town-town_2.png) | L2 town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 45% |  |
| 137 | [png](shots/loop3__leave-yeah/137-L2-town-town_3.png) | L2 town:3 | NANDA: Want to see a magic trick? It's 3:33 AM, a sleepy night, and this is a cl |  | 45% |  |
| 138 | [png](shots/loop3__leave-yeah/138-L2-town-town_4.png) | L2 town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 45% |  |
| 139 | [png](shots/loop3__leave-yeah/139-L2-town-town_5.png) | L2 town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 45% |  |
| 140 | [png](shots/loop3__leave-yeah/140-L2-town-town_6.png) | L2 town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 45% |  |
| 141 | [png](shots/loop3__leave-yeah/141-L2-town-town_7.png) | L2 town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 45% | 12 |
| 142 | [png](shots/loop3__leave-yeah/142-L2-town-town_7.png) | L2 town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 49% |  |
| 143 | [png](shots/loop3__leave-yeah/143-L2-town-town_8.png) | L2 town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 49% |  |
| 144 | [png](shots/loop3__leave-yeah/144-L2-town-town_9.png) | L2 town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 49% |  |
| 145 | [png](shots/loop3__leave-yeah/145-L2-train-train_0.png) | L2 train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 146 | [png](shots/loop3__leave-yeah/146-L2-train-train_1.png) | L2 train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 147 | [png](shots/loop3__leave-yeah/147-L2-naan-naan_0.png) | L2 naan:0 |  |  |  |  |
| 148 | [png](shots/loop3__leave-yeah/148-L2-naan-naan_1.png) | L2 naan:1 | MC: Technically, that's a NAND gate. Not our lunch. |  |  |  |
| 149 | [png](shots/loop3__leave-yeah/149-L2-blackout-blackout_0.png) | L2 blackout:0 |  |  |  |  |
| 150 | [png](shots/loop3__leave-yeah/150-L2-blackout-blackout_1.png) | L2 blackout:1 |  |  |  |  |
| 151 | [png](shots/loop3__leave-yeah/151-L2-blackout-blackout_2.png) | L2 blackout:2 |  |  |  |  |
| 152 | [png](shots/loop3__leave-yeah/152-L2-blackout-blackout_3.png) | L2 blackout:3 |  |  |  |  |
| 153 | [png](shots/loop3__leave-yeah/153-L2-blackout-blackout_4.png) | L2 blackout:4 |  |  |  |  |
| 154 | [png](shots/loop3__leave-yeah/154-L2-blackout-blackout_5.png) | L2 blackout:5 |  |  |  |  |
| 155 | [png](shots/loop3__leave-yeah/155-L2-blackout-blackout_6.png) | L2 blackout:6 |  |  |  |  |
| 156 | [png](shots/loop3__leave-yeah/156-L2-blackout-blackout_7.png) | L2 blackout:7 |  |  |  |  |
| 157 | [png](shots/loop3__leave-yeah/157-L2-blackout-blackout_8.png) | L2 blackout:8 |  |  |  |  |
| 158 | [png](shots/loop3__leave-yeah/158-L2-blackout-blackout_9.png) | L2 blackout:9 |  |  |  |  |
| 159 | [png](shots/loop3__leave-yeah/159-L2-platform-platform_0.png) | L2 platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 160 | [png](shots/loop3__leave-yeah/160-L2-platform-platform_1.png) | L2 platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 161 | [png](shots/loop3__leave-yeah/161-L2-platform-platform_2.png) | L2 platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 162 | [png](shots/loop3__leave-yeah/162-L2-station-talk-station_talk_0.png) | L2 station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 49% | 12 |
| 163 | [png](shots/loop3__leave-yeah/163-L2-station-talk-station_talk_0.png) | L2 station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 54% |  |
| 164 | [png](shots/loop3__leave-yeah/164-L2-station-talk-station_talk_1.png) | L2 station-talk:1 | NANDA: Wait. Why is everything the same? Same rain. Same 3:33 AM. You said that  |  | 54% |  |
| 165 | [png](shots/loop3__leave-yeah/165-L2-station-talk-station_talk_2.png) | L2 station-talk:2 | MC: Didn't we already do this? The bento, the train, the tea… Nanda, are we in a |  | 54% |  |
| 166 | [png](shots/loop3__leave-yeah/166-L2-station-talk-station_talk_3.png) | L2 station-talk:3 | NANDA: A loop? Ehehe. Then you can't leave. You picked me last time too. You'll  |  | 54% |  |
| 167 | [png](shots/loop3__leave-yeah/167-L2-station-talk-station_talk_4.png) | L2 station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 54% |  |
| 168 | [png](shots/loop3__leave-yeah/168-L2-rain-crossing-rain_crossing_0.png) | L2 rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:34 AM. |  | 54% |  |
| 169 | [png](shots/loop3__leave-yeah/169-L2-rain-crossing-rain_crossing_1.png) | L2 rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 54% | 12 |
| 170 | [png](shots/loop3__leave-yeah/170-L2-rain-crossing-rain_crossing_1.png) | L2 rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 59% |  |
| 171 | [png](shots/loop3__leave-yeah/171-L2-rain-crossing-rain_crossing_2.png) | L2 rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 59% |  |
| 172 | [png](shots/loop3__leave-yeah/172-L2-rain-crossing-rain_crossing_3.png) | L2 rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 59% | 12 |
| 173 | [png](shots/loop3__leave-yeah/173-L2-rain-crossing-rain_crossing_3.png) | L2 rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 65% |  |
| 174 | [png](shots/loop3__leave-yeah/174-L2-rain-crossing-rain_crossing_4.png) | L2 rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 65% |  |
| 175 | [png](shots/loop3__leave-yeah/175-L2-underpass-underpass_0.png) | L2 underpass:0 | Your steps, her steps. Always an even count. |  | 65% |  |
| 176 | [png](shots/loop3__leave-yeah/176-L2-underpass-underpass_1.png) | L2 underpass:1 | NANDA: Don't read the ads. Read me. |  | 65% |  |
| 177 | [png](shots/loop3__leave-yeah/177-L2-walk-home-walk_home_0.png) | L2 walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 65% |  |
| 178 | [png](shots/loop3__leave-yeah/178-L2-walk-home-walk_home_1.png) | L2 walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 65% | 12 |
| 179 | [png](shots/loop3__leave-yeah/179-L2-walk-home-walk_home_1.png) | L2 walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 70% |  |
| 180 | [png](shots/loop3__leave-yeah/180-L2-walk-home-walk_home_2.png) | L2 walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 70% |  |
| 181 | [png](shots/loop3__leave-yeah/181-L2-walk-home-walk_home_3.png) | L2 walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 70% | 12 |
| 182 | [png](shots/loop3__leave-yeah/182-L2-walk-home-walk_home_3.png) | L2 walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 74% |  |
| 183 | [png](shots/loop3__leave-yeah/183-L2-walk-home-walk_home_4.png) | L2 walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 74% |  |
| 184 | [png](shots/loop3__leave-yeah/184-L2-walk-home-walk_home_5.png) | L2 walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 74% |  |
| 185 | [png](shots/loop3__leave-yeah/185-L2-apartment-apartment_0.png) | L2 apartment:0 | Four floors. One window lit. |  | 74% |  |
| 186 | [png](shots/loop3__leave-yeah/186-L2-apartment-apartment_1.png) | L2 apartment:1 | NANDA: That's mine. I left the light on for you. |  | 74% |  |
| 187 | [png](shots/loop3__leave-yeah/187-L2-door-door_0.png) | L2 door:0 |  |  | 74% |  |
| 188 | [png](shots/loop3__leave-yeah/188-L2-door-door_1.png) | L2 door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 74% | 12 |
| 189 | [png](shots/loop3__leave-yeah/189-L2-door-door_1.png) | L2 door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 77% |  |
| 190 | [png](shots/loop3__leave-yeah/190-L2-door-door_2.png) | L2 door:2 | NANDA: Come in? Just for tea. |  | 77% |  |
| 191 | [png](shots/loop3__leave-yeah/191-L2-door-door_3.png) | L2 door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 77% | 12 |
| 192 | [png](shots/loop3__leave-yeah/192-L2-door-door_3.png) | L2 door:3 | NANDA: …Goodnight? It's only 3:34 AM. [fx hate-quake] |  | 72% |  |
| 193 | [png](shots/loop3__leave-yeah/193-L2-leave-leave_0.png) | L2 leave:0 | NANDA: Leaving is not an option. |  | 72% |  |
| 194 | [png](shots/loop3__leave-yeah/194-L2-leave-leave_1.png) | L2 leave:1 | XOR Coffee. 7:00 AM. |  | 72% |  |
| 195 | [png](shots/loop3__leave-yeah/195-L2-leave-leave_2.png) | L2 leave:2 | NANDA: He wakes at 7:00. | Good morning, Nanda ♥ +2; Who's 'he'? ♥ +1; Stop following me ♡ −3 | 72% | 12 |
| 196 | [png](shots/loop3__leave-yeah/196-L2-leave-leave_2.png) | L2 leave:2 | NANDA: Good morning! Same as yesterday. Same as always. [fx love-burst] |  | 75% |  |
| 197 | [png](shots/loop3__leave-yeah/197-L2-leave-leave_3.png) | L2 leave:3 | NANDA: From now on… can we be fORever? | uhmmm yeah ig ♥ +1; Forever sounds long ♥ +1; FUCK YOU. I'm leaving ♡ −5 | 75% | 12 |
| 198 | [png](shots/loop3__leave-yeah/198-L2-leave-leave_3.png) | L2 leave:3 | NANDA: From now on… can we be fORever? [fx love-burst] |  | 77% |  |
| 199 | [png](shots/loop3__leave-yeah/199-L2-leave-yeah-leave_yeah_0.png) | L2 leave-yeah:0 | NANDA: Hooray! FORever and ever! |  | 77% |  |
| 200 | [png](shots/loop3__leave-yeah/200-L2-leave-yeah-leave_yeah_1.png) | L2 leave-yeah:1 | NANDA: Good input. |  | 77% |  |
| 201 | [png](shots/loop3__leave-yeah/201-L2-leave-yeah-leave_yeah_2.png) | L2 leave-yeah:2 | CROWD: fORever and ever |  | 77% |  |
| 202 | [png](shots/loop3__leave-yeah/202-L2-leave-yeah-leave_yeah_3.png) | L2 leave-yeah:3 | CROWD: fORever and ever and ever |  | 77% |  |
| 203 | [png](shots/loop3__leave-yeah/203-L2-leave-yeah-leave_yeah_4.png) | L2 leave-yeah:4 | [END CARD] GAME OVER 77% |  | 77% |  |
| 204 | [png](shots/loop3__leave-yeah/204-L2-rooftop-rooftop_0.png) | L2 rooftop:0 | [GOAL CARD] |  | 0% |  |
| 205 | [png](shots/loop3__leave-yeah/205-L3-rooftop-rooftop_0.png) | L3 rooftop:0 | [GOAL CARD] |  | 0% |  |
| 206 | [png](shots/loop3__leave-yeah/206-L3-rooftop-rooftop_1.png) | L3 rooftop:1 | NANDA: I made two. One's for you. Don't look at me like that. | Take the tamagoyaki ♥ +3; Take the umeboshi ♥ +1; Take neither ♡ −3 | 0% | 12 |
| 207 | [png](shots/loop3__leave-yeah/207-L3-rooftop-rooftop_1.png) | L3 rooftop:1 | NANDA: Sweet egg for my sweet boy. ♡ [fx love-burst] |  | 4% |  |
| 208 | [png](shots/loop3__leave-yeah/208-L3-rooftop-rooftop_2.png) | L3 rooftop:2 | NANDA: Sweet. Like me. Good input. |  | 4% |  |
| 209 | [png](shots/loop3__leave-yeah/209-L3-rooftop-rooftop_3.png) | L3 rooftop:3 | NANDA: Sweet, ne? I rolled it myself. | Best I've ever had ♥ +2; It's good ♥ +1; Bit salty, honestly ♡ −3 | 4% | 12 |
| 210 | [png](shots/loop3__leave-yeah/210-L3-rooftop-rooftop_3.png) | L3 rooftop:3 | NANDA: …Obviously. Don't stare. [fx love-burst] |  | 7% |  |
| 211 | [png](shots/loop3__leave-yeah/211-L3-rooftop-rooftop_4.png) | L3 rooftop:4 | You smile for her. It's easy. |  | 7% |  |
| 212 | [png](shots/loop3__leave-yeah/212-L3-rooftop-rooftop_5.png) | L3 rooftop:5 | MC: Technically, rain wasn't f-OR-ecast. |  | 7% |  |
| 213 | [png](shots/loop3__leave-yeah/213-L3-rooftop-rooftop_6.png) | L3 rooftop:6 | NANDA: Stay fORever? The rain can wait. | Stay a minute ♥ +3; Walk with her ♥ +1; OR Leave before the rain ♡ −3 | 7% | 12 |
| 214 | [png](shots/loop3__leave-yeah/214-L3-rooftop-rooftop_6.png) | L3 rooftop:6 | NANDA: A minute. Then another. Then the whole day. [fx love-burst] |  | 12% |  |
| 215 | [png](shots/loop3__leave-yeah/215-L3-park-park_0.png) | L3 park:0 | NANDA: I love your cute jacket. You wore it for me. I can tell. Don't say no, I  | I wore it for you ♥ +3; It was clean ♥ +1; Not everything is about you ♡ −4 | 12% | 12 |
| 216 | [png](shots/loop3__leave-yeah/216-L3-park-park_0.png) | L3 park:0 | NANDA: I knew it. I know everything about you. Even the time. It's 3:35 AM. ♡ [fx love-burst] |  | 16% |  |
| 217 | [png](shots/loop3__leave-yeah/217-L3-park-park_1.png) | L3 park:1 | NANDA: Sakura only last a week. Then they fall. I don't let things fall. |  | 16% |  |
| 218 | [png](shots/loop3__leave-yeah/218-L3-park-park_2.png) | L3 park:2 | NANDA: Hold my hand. The whole way. Hands get lost if you let go. | Hold it tight ♥ +3; Hold one finger ♥ +1; Pull your hand back ♡ −4 | 16% | 12 |
| 219 | [png](shots/loop3__leave-yeah/219-L3-park-park_2.png) | L3 park:2 | NANDA: Tighter. Mm. Now you're mine till tonight. ♡ [fx love-burst] |  | 20% |  |
| 220 | [png](shots/loop3__leave-yeah/220-L3-park-park_3.png) | L3 park:3 | NANDA: Who needs friends? I'm the only friend you need. I'm like ten friends. In |  | 20% |  |
| 221 | [png](shots/loop3__leave-yeah/221-L3-park-park_4.png) | L3 park:4 | NANDA: It's 3:35 AM. One job today. My groceries, or my library book? You pick.  | Carry her groceries ♥ +2; Return her book ♥ +2; Do it alone, later ♡ −4 | 20% | 12 |
| 222 | [png](shots/loop3__leave-yeah/222-L3-park-park_4.png) | L3 park:4 | NANDA: Groceries! For our dinner. I mean mine. Ours. [fx love-burst] |  | 23% |  |
| 223 | [png](shots/loop3__leave-yeah/223-L3-errand-shop-errand_shop_0.png) | L3 errand-shop:0 | A street of little shops. Pink petals on every roof. |  | 23% |  |
| 224 | [png](shots/loop3__leave-yeah/224-L3-errand-shop-errand_shop_1.png) | L3 errand-shop:1 | NANDA: Carrots. Rice. Two cups. No, three cups. We'll need three. | Get three cups ♥ +3; Why three? ♥ +1; Two is normal ♡ −3 | 23% | 12 |
| 225 | [png](shots/loop3__leave-yeah/225-L3-errand-shop-errand_shop_1.png) | L3 errand-shop:1 | NANDA: You get it. You always get me. [fx love-burst] |  | 28% |  |
| 226 | [png](shots/loop3__leave-yeah/226-L3-errand-shop-errand_shop_2.png) | L3 errand-shop:2 | NANDA: The shop lady smiled at you. It's okay! She has a bad face. Look at me. |  | 28% |  |
| 227 | [png](shots/loop3__leave-yeah/227-L3-errand-shop-errand_shop_3.png) | L3 errand-shop:3 | NANDA: You carry the bags. I carry you. In my heart. Heavy, right? | So heavy, in a good way ♥ +3; The bags are fine ♥ +1; Carry your own bags ♡ −4 | 28% | 12 |
| 228 | [png](shots/loop3__leave-yeah/228-L3-errand-shop-errand_shop_3.png) | L3 errand-shop:3 | NANDA: Ehehe. Heavy means you can't run. [fx love-burst] |  | 32% |  |
| 229 | [png](shots/loop3__leave-yeah/229-L3-errand-shop-errand_shop_4.png) | L3 errand-shop:4 | NANDA: I'm hungry. You look hungry too. Let's eat. Now. |  | 32% |  |
| 230 | [png](shots/loop3__leave-yeah/230-L3-errand-shop-errand_shop_5.png) | L3 errand-shop:5 | WALK TO THE FOOD STALLS | Walk to the food stalls; Skip to the food stalls ♡ | 32% |  |
| 231 | [png](shots/loop3__leave-yeah/231-L3-hungry-hungry_0.png) | L3 hungry:0 | NANDA: I'm so hungry. Feed me. Butter chicken, or katsu curry? Pick the right on | Butter chicken, for her ♥ +3; Katsu curry ♥ +2; I'm not hungry ♡ −4 | 32% | 12 |
| 232 | [png](shots/loop3__leave-yeah/232-L3-hungry-hungry_0.png) | L3 hungry:0 | NANDA: With naan! You know me so well. ♡ [fx love-burst] |  | 36% |  |
| 233 | [png](shots/loop3__leave-yeah/233-L3-hungry-hungry_1.png) | L3 hungry:1 | NANDA: Tear the naan. Give me the soft part. Always the soft part. |  | 36% |  |
| 234 | [png](shots/loop3__leave-yeah/234-L3-hungry-hungry_2.png) | L3 hungry:2 | NANDA: Mm! See? You're so good at making me happy. Keep going. Forever. | Anything for you ♥ +3; It's just lunch ♥ +1; Feed yourself ♡ −4 | 36% | 12 |
| 235 | [png](shots/loop3__leave-yeah/235-L3-hungry-hungry_2.png) | L3 hungry:2 | NANDA: Anything. I'll hold you to that. ♡ [fx love-burst] |  | 41% |  |
| 236 | [png](shots/loop3__leave-yeah/236-L3-town-town_0.png) | L3 town:0 | The big crossing. A thousand people. She only looks at you. |  | 41% |  |
| 237 | [png](shots/loop3__leave-yeah/237-L3-town-town_1.png) | L3 town:1 | NANDA: So many people. Don't look at them. They can't love you like me. | Only looking at you ♥ +3; Keep walking ♥ +1; I like crowds ♡ −4 | 41% | 12 |
| 238 | [png](shots/loop3__leave-yeah/238-L3-town-town_1.png) | L3 town:1 | NANDA: Good. Your eyes are mine till bedtime. [fx love-burst] |  | 45% |  |
| 239 | [png](shots/loop3__leave-yeah/239-L3-town-town_2.png) | L3 town:2 | NANDA: Your phone buzzed. It's just people. We're busy being us. |  | 45% |  |
| 240 | [png](shots/loop3__leave-yeah/240-L3-town-town_3.png) | L3 town:3 | NANDA: Want to see a magic trick? It's 3:35 AM, a sleepy night, and this is a cl |  | 45% |  |
| 241 | [png](shots/loop3__leave-yeah/241-L3-town-town_4.png) | L3 town:4 | NANDA: Trick two. you by the window is thinking about snacks. you with the lapto |  | 45% |  |
| 242 | [png](shots/loop3__leave-yeah/242-L3-town-town_5.png) | L3 town:5 | NANDA: Trick three. you pretending not to watch, you laughed a little. I heard i |  | 45% |  |
| 243 | [png](shots/loop3__leave-yeah/243-L3-town-town_6.png) | L3 town:6 | NANDA: I see you, the curly-haired guy. I see you, you gringo wearing a cap. Don |  | 45% |  |
| 244 | [png](shots/loop3__leave-yeah/244-L3-town-town_7.png) | L3 town:7 | NANDA: You're so smart. Smarter than everyone here. They don't get you. Only I g | You get me ♥ +3; I'm not that smart ♥ +1; Stop flattering me ♡ −4 | 45% | 12 |
| 245 | [png](shots/loop3__leave-yeah/245-L3-town-town_7.png) | L3 town:7 | NANDA: I'm the only one who ever will. [fx love-burst] |  | 49% |  |
| 246 | [png](shots/loop3__leave-yeah/246-L3-town-town_8.png) | L3 town:8 | NANDA: Train time. Twelve stops. I counted them this morning. For fun. |  | 49% |  |
| 247 | [png](shots/loop3__leave-yeah/247-L3-town-town_9.png) | L3 town:9 | WALK TO THE STATION | Walk to the station; Walk to the station… and nothing else | 49% |  |
| 248 | [png](shots/loop3__leave-yeah/248-L3-train-train_0.png) | L3 train:0 | AND Line, local service. Home in twelve stops. |  |  |  |
| 249 | [png](shots/loop3__leave-yeah/249-L3-train-train_1.png) | L3 train:1 | Nobody reads the ads. This one says 甘い！ SWEET! |  |  |  |
| 250 | [png](shots/loop3__leave-yeah/250-L3-naan-naan_0.png) | L3 naan:0 |  |  |  |  |
| 251 | [png](shots/loop3__leave-yeah/251-L3-naan-naan_1.png) | L3 naan:1 | MC: Technically, that's a NAND gate. Not our lunch. |  |  |  |
| 252 | [png](shots/loop3__leave-yeah/252-L3-blackout-blackout_0.png) | L3 blackout:0 |  |  |  |  |
| 253 | [png](shots/loop3__leave-yeah/253-L3-blackout-blackout_1.png) | L3 blackout:1 |  |  |  |  |
| 254 | [png](shots/loop3__leave-yeah/254-L3-blackout-blackout_2.png) | L3 blackout:2 |  |  |  |  |
| 255 | [png](shots/loop3__leave-yeah/255-L3-blackout-blackout_3.png) | L3 blackout:3 |  |  |  |  |
| 256 | [png](shots/loop3__leave-yeah/256-L3-blackout-blackout_4.png) | L3 blackout:4 |  |  |  |  |
| 257 | [png](shots/loop3__leave-yeah/257-L3-blackout-blackout_5.png) | L3 blackout:5 |  |  |  |  |
| 258 | [png](shots/loop3__leave-yeah/258-L3-blackout-blackout_6.png) | L3 blackout:6 |  |  |  |  |
| 259 | [png](shots/loop3__leave-yeah/259-L3-blackout-blackout_7.png) | L3 blackout:7 |  |  |  |  |
| 260 | [png](shots/loop3__leave-yeah/260-L3-blackout-blackout_8.png) | L3 blackout:8 |  |  |  |  |
| 261 | [png](shots/loop3__leave-yeah/261-L3-blackout-blackout_9.png) | L3 blackout:9 |  |  |  |  |
| 262 | [png](shots/loop3__leave-yeah/262-L3-platform-platform_0.png) | L3 platform:0 | Her stop. The rain followed us off the train. |  |  |  |
| 263 | [png](shots/loop3__leave-yeah/263-L3-platform-platform_1.png) | L3 platform:1 | The AND Line leaves. Just two of us now. |  |  |  |
| 264 | [png](shots/loop3__leave-yeah/264-L3-platform-platform_2.png) | L3 platform:2 | NEXT: this OR that. The sign never picks. |  |  |  |
| 265 | [png](shots/loop3__leave-yeah/265-L3-station-talk-station_talk_0.png) | L3 station-talk:0 | NANDA: Twelve stops, and you held the pole. Not me. Next time, hold me. | Next time, I'll hold you ♥ +3; It was crowded ♥ +1; I needed the pole ♡ −4 | 49% | 12 |
| 266 | [png](shots/loop3__leave-yeah/266-L3-station-talk-station_talk_0.png) | L3 station-talk:0 | NANDA: There is no next time. Only this time. Again. ♡ [fx love-burst] |  | 54% |  |
| 267 | [png](shots/loop3__leave-yeah/267-L3-station-talk-station_talk_1.png) | L3 station-talk:1 | NANDA: Run 4. Same day. You know, I know. Skip the small talk. It's 3:36 AM agai |  | 54% |  |
| 268 | [png](shots/loop3__leave-yeah/268-L3-station-talk-station_talk_2.png) | L3 station-talk:2 | MC: Run 4. I know every line. So do you. |  | 54% |  |
| 269 | [png](shots/loop3__leave-yeah/269-L3-station-talk-station_talk_3.png) | L3 station-talk:3 | NANDA: Of course it's a loop. I made it. Every ending comes back here, every nig |  | 54% |  |
| 270 | [png](shots/loop3__leave-yeah/270-L3-station-talk-station_talk_4.png) | L3 station-talk:4 | NANDA: It's raining. Good. Rain keeps people inside. Inside is where people stay |  | 54% |  |
| 271 | [png](shots/loop3__leave-yeah/271-L3-rain-crossing-rain_crossing_0.png) | L3 rain-crossing:0 | Rain. The signs glow. The crossing is empty now. It's 3:36 AM. |  | 54% |  |
| 272 | [png](shots/loop3__leave-yeah/272-L3-rain-crossing-rain_crossing_1.png) | L3 rain-crossing:1 | NANDA: Share my umbrella. It's small. We have to be very close. That's the point | Step under, close ♥ +4; Hold it for her ♥ +1; I'll just get wet ♡ −4 | 54% | 12 |
| 273 | [png](shots/loop3__leave-yeah/273-L3-rain-crossing-rain_crossing_1.png) | L3 rain-crossing:1 | NANDA: Your shoulder's wet. It's okay. I'll dry everything. [fx love-burst] |  | 59% |  |
| 274 | [png](shots/loop3__leave-yeah/274-L3-rain-crossing-rain_crossing_2.png) | L3 rain-crossing:2 | NANDA: If you ever left, I'd be fine. I'd just stand here. In the rain. Until yo |  | 59% |  |
| 275 | [png](shots/loop3__leave-yeah/275-L3-rain-crossing-rain_crossing_3.png) | L3 rain-crossing:3 | NANDA: Say you had fun. Say it's the best day ever. Say it twice. | Best day ever. Twice ♥ +4; It was a nice day ♥ +1; It's been too long ♡ −5 | 59% | 12 |
| 276 | [png](shots/loop3__leave-yeah/276-L3-rain-crossing-rain_crossing_3.png) | L3 rain-crossing:3 | NANDA: Then we'll have it again. And again. ♡ [fx love-burst] |  | 65% |  |
| 277 | [png](shots/loop3__leave-yeah/277-L3-rain-crossing-rain_crossing_4.png) | L3 rain-crossing:4 | WALK HER HOME | Walk her home; Walk her home… and nothing else | 65% |  |
| 278 | [png](shots/loop3__leave-yeah/278-L3-underpass-underpass_0.png) | L3 underpass:0 | Your steps, her steps. Always an even count. |  | 65% |  |
| 279 | [png](shots/loop3__leave-yeah/279-L3-underpass-underpass_1.png) | L3 underpass:1 | NANDA: Don't read the ads. Read me. |  | 65% |  |
| 280 | [png](shots/loop3__leave-yeah/280-L3-walk-home-walk_home_0.png) | L3 walk-home:0 | The rain stops. Sun on her street. She walks slower. |  | 65% |  |
| 281 | [png](shots/loop3__leave-yeah/281-L3-walk-home-walk_home_1.png) | L3 walk-home:1 | NANDA: This is my street. I walk it every day and pretend you're next to me. Now | I'm right here ♥ +3; It's a nice street ♥ +1; That's a lot ♡ −4 | 65% | 12 |
| 282 | [png](shots/loop3__leave-yeah/282-L3-walk-home-walk_home_1.png) | L3 walk-home:1 | NANDA: Right here. Don't move from right here. [fx love-burst] |  | 70% |  |
| 283 | [png](shots/loop3__leave-yeah/283-L3-walk-home-walk_home_2.png) | L3 walk-home:2 | The sky goes orange. She stopped walking a while ago. |  | 70% |  |
| 284 | [png](shots/loop3__leave-yeah/284-L3-walk-home-walk_home_3.png) | L3 walk-home:3 | NANDA: Walk slower. If we walk slow, the day can't end. It's night. | Walk slower with her ♥ +3; Keep the same pace ♥ +1; I need to go home ♡ −5 | 70% | 12 |
| 285 | [png](shots/loop3__leave-yeah/285-L3-walk-home-walk_home_3.png) | L3 walk-home:3 | NANDA: Slower… slower… there. Now we're almost still. [fx love-burst] |  | 74% |  |
| 286 | [png](shots/loop3__leave-yeah/286-L3-walk-home-walk_home_4.png) | L3 walk-home:4 | NANDA: Everyone goes home at night. Not you. You come home with me. |  | 74% |  |
| 287 | [png](shots/loop3__leave-yeah/287-L3-walk-home-walk_home_5.png) | L3 walk-home:5 | FOLLOW HER INSIDE | Follow her inside; Follow her inside… and nothing else; Run home alone | 74% |  |
| 288 | [png](shots/loop3__leave-yeah/288-L3-apartment-apartment_0.png) | L3 apartment:0 | Four floors. One window lit. |  | 74% |  |
| 289 | [png](shots/loop3__leave-yeah/289-L3-apartment-apartment_1.png) | L3 apartment:1 | NANDA: That's mine. I left the light on for you. |  | 74% |  |
| 290 | [png](shots/loop3__leave-yeah/290-L3-door-door_0.png) | L3 door:0 |  |  | 74% |  |
| 291 | [png](shots/loop3__leave-yeah/291-L3-door-door_1.png) | L3 door:1 | NANDA: This is me. Unit 12. Obviously you'll remember. | I'll never forget it ♥ +2; Nice building ♥ +1; Which unit again? ♡ −3 | 74% | 12 |
| 292 | [png](shots/loop3__leave-yeah/292-L3-door-door_1.png) | L3 door:1 | NANDA: Good. I wrote it on your hand anyway. [fx love-burst] |  | 77% |  |
| 293 | [png](shots/loop3__leave-yeah/293-L3-door-door_2.png) | L3 door:2 | NANDA: Come in? Just for tea. |  | 77% |  |
| 294 | [png](shots/loop3__leave-yeah/294-L3-door-door_3.png) | L3 door:3 | NANDA: I already boiled the water. This morning. Just in case. | Just one cup ♥ +3; One cup, then home ♥ +1; Say goodnight ♡ −3 | 77% | 12 |
| 295 | [png](shots/loop3__leave-yeah/295-L3-door-door_3.png) | L3 door:3 | NANDA: …Goodnight? It's only 3:36 AM. [fx hate-quake] |  | 72% |  |
| 296 | [png](shots/loop3__leave-yeah/296-L3-leave-leave_0.png) | L3 leave:0 | NANDA: Leaving is not an option. |  | 72% |  |
| 297 | [png](shots/loop3__leave-yeah/297-L3-leave-leave_1.png) | L3 leave:1 | XOR Coffee. 7:00 AM. |  | 72% |  |
| 298 | [png](shots/loop3__leave-yeah/298-L3-leave-leave_2.png) | L3 leave:2 | NANDA: He wakes at 7:00. | Good morning, Nanda ♥ +2; Who's 'he'? ♥ +1; Stop following me ♡ −3 | 72% | 12 |
| 299 | [png](shots/loop3__leave-yeah/299-L3-leave-leave_2.png) | L3 leave:2 | NANDA: Good morning! Same as yesterday. Same as always. [fx love-burst] |  | 75% |  |
| 300 | [png](shots/loop3__leave-yeah/300-L3-leave-leave_3.png) | L3 leave:3 | NANDA: From now on… can we be fORever? | uhmmm yeah ig ♥ +1; Forever sounds long ♥ +1; FUCK YOU. I'm leaving ♡ −5 | 75% | 12 |
| 301 | [png](shots/loop3__leave-yeah/301-L3-leave-leave_3.png) | L3 leave:3 | NANDA: From now on… can we be fORever? [fx love-burst] |  | 77% |  |
| 302 | [png](shots/loop3__leave-yeah/302-L3-leave-yeah-leave_yeah_0.png) | L3 leave-yeah:0 | NANDA: Hooray! FORever and ever! |  | 77% |  |
| 303 | [png](shots/loop3__leave-yeah/303-L3-leave-yeah-leave_yeah_1.png) | L3 leave-yeah:1 | NANDA: Good input. |  | 77% |  |
| 304 | [png](shots/loop3__leave-yeah/304-L3-leave-yeah-leave_yeah_2.png) | L3 leave-yeah:2 | CROWD: fORever and ever |  | 77% |  |
| 305 | [png](shots/loop3__leave-yeah/305-L3-leave-yeah-leave_yeah_3.png) | L3 leave-yeah:3 | CROWD: fORever and ever and ever |  | 77% |  |
| 306 | [png](shots/loop3__leave-yeah/306-L3-leave-yeah-leave_yeah_4.png) | L3 leave-yeah:4 | [END CARD] GAME OVER 77% |  | 77% |  |
| 307 | [png](shots/loop3__leave-yeah/307-L3-rooftop-rooftop_0.png) | L3 rooftop:0 | [GOAL CARD] |  | 0% |  |
