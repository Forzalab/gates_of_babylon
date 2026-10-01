# WHATISTHIS: reviewer A (Prof. WhatIsThis), date-beta, demo Thu Oct 1 noon PT

Head: origin/ccr-8b4548b6-08uz6t @ e48d2a5 (PR #36 + crowd-eyes merged). Read-only on app code. Routes and method: INDEX.md.
Shots: 1920x1080, seed 1, clock 12:20 (story clock live, +20 min), frozen build on :5633. Crops: `crops/`.
Owner hint: **main** = Say.jsx / Tree / meta.js / injury.js / HUD / main.jsx choice logic; **alt** = art/, packs/, box/CSS.
Known and in progress elsewhere (not re-reported, status only): H1/H2/H3 (PR #36), H6 + H7 (main), C2 (flow-c2-r2 FLOW.md).

## HIGH

None. I looked for a softlock, a dead button, a wrong route or an embarrassing demo-path frame, and found none on head.
Every choice routes to its authored scene. The lock game resolves both ways (win, and the 40 s timeout).
Every ending card shows. Route A reaches YOU WIN 100% with no page errors.

## MED

| id | sev | scene:beat | What is this. | rule broken | crop | likely file (owner) |
|---|---|---|---|---|---|---|
| WT01 | MED | rooftop:11 react (demo path, seed 1 rolls a crit on "Stay a minute") | What is this. The gacha badge says "…L +8". The word CRITICAL is behind Nanda's head on the zoom-pop frame. (On cup:4 the same badge is fully visible.) | Occlusion/legibility: a badge must never sit under the sprite | crops/WT01-rooftop11-badge-behind-head.jpg | art/emotion/emotion.css + EmotionFx.jsx badge z-index/position vs the zoom-pop sprite (alt) |
| WT02 | MED | v2-curry:9, 10, 12 (butter, demo path) | What is this. The MC's arm wears a navy suit sleeve with a white shirt cuff. Every other MC hand today has the green knit sleeve (rooftop:5/6, shop:3, shop:12). | Continuity: the MC's clothes do not change mid-day | crops/WT02-curry10-navy-sleeve.jpg vs crops/WT02-shop12-green-sleeve.jpg | art/curry/Butter.jsx (player hand sleeve; shop/parts.jsx `SP.knit` is the canon) (alt) |
| WT03 | MED | v2-home:4 (7:10 PM) -> cup:0-4 (7:20 PM), steeped, unknown, escape | What is this. Her plaster and faint bruise are there at 7:10 PM. Ten minutes later, at the tea table, her face is clean. | Continuity of injury across beats | crops/WT03a-home4-plaster.jpg, crops/WT03b-cup4-no-plaster.jpg | src/date-beta/injury.js `injuryLayer` returns null for every scene after v2-home (main) |
| WT04 | MED | cup:2 + cup:3 (both bento paths) | What is this. The line says "One umeboshi / Tamagoyaki on its saucer". The saucer in the picture is empty, and it is not under the third cup. | Line vs picture | crops/WT04-cup3-empty-saucer.jpg | packs/r5.json / interiors cup beat 2 props (`plate`) or the sitting-room art (alt) |
| WT05 | MED | v2-curry:4 (demo path) | What is this. The line says "She sits on your right. Her knee touches your knee." The picture shows her across the table in a booth, facing you. | Line vs picture | crops/WT05-curry4-across-not-right.jpg | art/curry/Butter.jsx curry-butter-table (or reword packs/curry.json beat 4) (alt) |
| WT08 | MED | rooftop:11 c2 "OR Leave before the rain" -> leave:0 | What is this. You leave the sunny school rooftop at noon. The next frame is night and rain at her apartment door (Unit 12), which you have never seen. Then comes "XOR Coffee. 7:00 AM." | Plot/continuity (time, place, weather) | crops/WT08-rooftop11c2-leave0-night-door.jpg | packs/love.json / story leave:0 `bg: BG-D1` (the door bg only fits the v2-home entry) (alt) |
| WT10 | MED | unknown:1-3 (escape route) | What is this. You are still in the kitchen beside the closed hatch, yet her lines are labelled "NANDA (ABOVE)" / "(UPSTAIRS)". unknown:2 says "Upstairs, the kettle clicks off" over a cellar-jar picture, before you climb down at unknown:4. She was at the table with you one beat earlier. The kitchen picture at unknown:1 has no hatch. | Plot coherence + line vs picture | crops/WT10a-unknown2-cellar-jars-upstairs-line.jpg, crops/WT10b-unknown3-upstairs-in-kitchen.jpg | packs/ux-six.json `unknown offstage:true` (should start at escape) + packs story unknown 2/3 text (alt); main.jsx showLine ABOVE label (main) |
| WT11 | MED | unknown:3, escape:14, leave:3 (cold=yes) | What is this. Three reachable Nanda lines play silent: "Darling? Where did you go?", "Four, five… Don't hide, darling…" and "だめ。You already said forever." scripts/voice-gaps.mjs reports 0 silent because it only counts who === 'NANDA' and vary text that starts with "NANDA:". | Voice: text vs voice/manifest.json | (no picture; `node research/sprint-1001/review/narrcheck.mjs`) | src/date-beta/voice/manifest.json (no take) + scripts/voice-gaps.mjs `her()` / who match (alt for takes, main for the script) |
| WT13 | MED | leave:3 with cold=yes (after leave:2 "Stop following me") | What is this. The question "can we be forever?" is replaced by "だめ。You already said forever. I heard it." The three buttons then answer a question nobody asked ("uhmmm yeah ig" / "Forever sounds long"). | Coherence: choices must answer the line on screen | crops/WT13-leave3-cold-question-not-asked.jpg | packs/story or love.json leave:3 `vary.cold.yes` (alt) |

## LOW

| id | sev | scene:beat | What is this. | rule broken | crop | likely file (owner) |
|---|---|---|---|---|---|---|
| WT06 | LOW | v2-shop:9, v2-curry:6, v2-train:6, v2-street:3 | What is this. "Her nails press", "with two fingers", "counts them on her fingers", "Her fist opens. Red marks on her palm". Her hands are pins with a ball. A pin has no nails, fingers or palm. | Line vs picture (PIN-hands lock) | (A/036, A/052, A/067, A/080 in scratch) | packs/shop.json, curry.json, r3-station/variant-v2 train 6, r3-rain street 3 text (alt) |
| WT07 | LOW | v2-home:3 | What is this. The line says "Three chairs. Three cups. Steam." The picture shows two cups and no chairs. Nanda stands where the middle one would be. | Line vs picture | crops/WT07-home3-two-cups-no-chairs.jpg | packs/interiors.json kitchen-wide beat (alt) |
| WT09 | LOW | rooftop:0-11 HUD trail | What is this. On the rooftop, the trail shows ROOF + 1 stop + ♡ (the shortest way to an ending is via LEAVE). At the park it grows to 9 stops. The demo audience is told the date is 3 scenes long. | HUD/flow: the trail should not predict the bail-out route | (A/004 HUD in scratch) | engine.js `routeFrom` / Hud.jsx trail (main) |
| WT14 | LOW | v2-library:1 (book branch) | What is this. The line says "A train passes. Her hand grabs your sleeve until it is gone." There is no train in the picture, only the crossing poles. | Line vs picture | crops/WT14-library1-no-train.jpg | packs v2-library beat 1 `shot: crossing-bell` art (alt) |
| WT15 | LOW | v2-shop:4 shelf right frame vs cup:4 | What is this. In the shop she says "Three cups. One for you. Two for me." At the table, the third cup is "For Input B… It's always three of us." | Plot consistency (who the third cup is for) | (A/030 in scratch) | src/date-beta/game/shopgame.js say line (alt) |
| WT16 | LOW | escape:2 | What is this. The line says "The names are all different." The shot zooms on the one jar with YOUR name and today's date (2026.10.01). That is the escape:6 reveal, three beats early. | Line vs picture / reveal order | (branches/109 in scratch) | packs escape beat 2 `closeup` ofProps (alt) |

## SLOP.md status (origin/playtest-1001 research/sprint-1001/playtest/slop/SLOP.md) on head e48d2a5

| SLOP | status | evidence |
|---|---|---|
| H1 held chopsticks | VERIFIED | A/007 + A/008: green-knit MC hand grips the chopsticks |
| H2 PIN hands | VERIFIED | A/024 cart, A/052/054/058 curry: pin + ball (copy still says fingers/nails: WT06) |
| H3 ceiling arm | VERIFIED | A/039 shop:12: pin arm runs from her body to the sleeve |
| H4 clock contradictions | VERIFIED | only the rooftop stamp is live (12:20 PM, tower clock 12:20); AKIBA 2:45 -> CURRY 2:55 -> STATION 4:30 (board 4:30) -> 7:00/7:05/7:10/7:20 all match their lines |
| H5 {TIME} = real clock | VERIFIED (route A/branches); replays below | v2-home:4 c1 "It's only 7:10." under HER KITCHEN 7:10 |
| H6 box over face | STILL OPEN (main fixing) | also seen: v2-town:3 (only hair shows), v2-shop:7, v2-home:1 + 4, v2-train:8 |
| H7 v3-train:3 rain vs sun | NOT REACHABLE on head | variant-v3 is not in main.jsx PLAY; v3-train is not built |
| M1 sauce jug no hand | STILL OPEN | A/053 v2-curry:7 |
| M2 cups no hand | STILL OPEN | A/032 v2-shop:5: three cups already in the basket, no hand |
| M3 v2-train:7 no black eye / no MC | STILL OPEN | A/068: no black eye (beats 4-6, 8 have it), she lies diagonal in mid-air, no MC head |
| M4 badge cut / +10 vs +8 | VERIFIED (number + position) / new occlusion WT01 | CRITICAL +7 / +8 labels match the pop; but on the zoom pop the badge is behind her head |
| M6 v2-rain:2 head under shoes | STILL OPEN | A/073 |
| M7, M9 v3-train | NOT REACHABLE on head | variant-v3 not in PLAY |
| M11 rooftop:3 pills over bento | VERIFIED | A/004: pills sit left/right of the bento (key/label order: C2) |
| M12 v2-home:1 kneel/slippers | STILL OPEN | A/084: she is behind the box, slippers on the shelf |
| L1 town board | STILL OPEN | A/043 (box hides all but her hair), A/044 (over the billboard girl's face) |
| L3 カチッ over sign | STILL OPEN | A/082 |
| L4 HUD CAFÉ over door | VERIFIED | branches/024 + 074: chapter LEAVE |
| L5 copy | STILL OPEN (Tony's call) | "FUCK YOU. I'm leaving" still on leave:3 |
| M5, M8, M10, L2 | see replays / endings below | |

## New today: red-eye crowd (leave-fu / leave-yeah 2-3)

Reviewed in the endings route (below).
