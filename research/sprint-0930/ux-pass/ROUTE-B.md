# ROUTE-B (library branch, seed=2, 1920x1080)

Build: vite dev on :5191, `date-beta.html?seed=2`. Real play order (packs story, meta, mech, lockgame, obbp, sequences, variant-v2, love, gacha), so scene ids are the v2-* ones, not the old park/errand-shop/hungry/town ids in alt-test/graph.json (that graph is stale; use the pack-applied one).
Entry: `?scene=v2-park&beat=4` (URL jump to the errand pick, prefix not replayed). Shooter: ux-pass/shootB.mjs (modes main | react | timeout | pity | rm).

## Ordered scene/beat list (this agent shoots)
1. v2-park:4 pick reaction (Return her book)  -> only the react frame; the pick frame itself is A's shot 20 
2. v2-library:0..5 (rail crossing 1:50 PM, library 2:00 PM, book return; the whole scene, A never visits it)
3. v2-curry:1 pick reaction (Katsu curry) and v2-curry:2 (katsu dish insert; A has the butter-chicken variant of the same beat)
4. cup:1 and cup:4 reaction frames on THIS route's picks (cup:4 = Stand up, A took Drink)
5. unknown:0..3 (stand, hatch, kettle clicks off, ladder)
6. escape:0..14 (basement, jars, bento boxes, mochi, auto beats 7-11 sampled at 8 and 11, clock, footsteps)
7. lock game (escape:14 game overlay): start, mid (4 tumblers)
8. escape-win:0..7 and its end card (win)
9. lock game reload path: start, low-time (10 s)
10. escape-timeout:0..7 and its end card (timeout)
11. Extras: pity love-bomb run (rooftop:2,6 broken hearts, rooftop:9 heart) and reduced-motion (3 frames)

## Dropped as shared with A (A owns them)
boot, goal card, rooftop:0-9, v2-park:0-3,5, v2-curry:0,3-5 (curry pick frame v2-curry:1 itself is A's 30), v2-train, v2-rain, v2-street, v2-home, cup:0,2,3. These have identical content on both routes (only `cold`/`run` flags vary and neither route sets cold=yes on the shared v2 beats).

## Scenes that exist only on B
v2-library, unknown, escape, escape-win, escape-timeout.  A-only: v2-shop, steeped.

## Shot files (B/)
- 00-v2-library-0.png
- 00a-v2-park-4-react.png
- 01-v2-library-1.png
- 02-v2-library-2.png
- 03-v2-library-3.png
- 04-v2-library-4.png
- 05-v2-library-5.png
- 05a-v2-curry-1-react.png
- 06-v2-curry-2.png
- 07-cup-1-after-pick-fx.png
- 08-cup-4-after-pick-fx.png
- 09-unknown-0.png
- 10-unknown-1.png
- 11-unknown-2.png
- 12-unknown-3.png
- 13-escape-0.png
- 14-escape-1.png
- 15-escape-2.png
- 16-escape-3.png
- 17-escape-4.png
- 18-escape-5.png
- 19-escape-6.png
- 20-escape-8.png
- 21-escape-11.png
- 22-escape-11.png
- 23-escape-12.png
- 24-escape-13.png
- 25-lockgame-start.png
- 26-lockgame-mid.png
- 27-escape-win-0.png
- 28-escape-win-1.png
- 29-escape-win-2.png
- 30-escape-win-3.png
- 31-escape-win-5.png
- 32-escape-win-5.png
- 33-escape-win-6.png
- 34-escape-win-7-end.png
- 35-END-settled-win.png
- 36-lockgame-start.png
- 37-lockgame-lowtime.png
- 38-escape-timeout-0.png
- 39-escape-timeout-2.png
- 40-escape-timeout-3.png
- 41-escape-timeout-4.png
- 42-escape-timeout-5.png
- 43-escape-timeout-6.png
- 44-escape-timeout-7-end.png
- 45-END-settled-timeout.png
- 90-v2-park-4-RM.png
- 91-v2-park-4-RM.png
- 92-v2-park-5-RM.png
- pity-40-rooftop-2-choices-pick1.png
- pity-41-rooftop-2-flash-pick1-flash.png
- pity-42-rooftop-2-result-pick1-result.png
- pity-43-rooftop-6-choices-pick2.png
- pity-44-rooftop-6-flash-pick2-flash.png
- pity-45-rooftop-6-result-pick2-result.png
- pity-46-rooftop-9-choices-pick3.png
- pity-47-rooftop-9-flash-pick3-flash.png
- pity-48-rooftop-9-result-pick3-result.png
- pity-49-v2-park-2-choices-pick4.png
- pity-50-v2-park-2-flash-pick4-flash.png
- pity-51-v2-park-2-result-pick4-result.png
- pity-52-v2-park-4-choices-pick5.png
- pity-53-v2-park-4-flash-pick5-flash.png
- pity-54-v2-park-4-result-pick5-result.png
- pity-55-v2-park-5-choices-pick6.png

log-*.json = raw scripted state per shot (speaker, line, choices, love). Numbering gaps: 00a/05a are late additions (react frames); 36-45 are the timeout run; pity-* and 90-92 (RM) are extras.
