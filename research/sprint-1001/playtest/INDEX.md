# Sprint 1001 playtest: shot index

Build: frozen `vite build` + `vite preview --port 5310` from `origin/ccr-44b3aeaf-0iuf00`. 1920x1080, seed 1, fx=full,
clock pinned with `page.clock.install(2026-10-01T12:20)`. Driver: `shoot.mjs <route> 5310`; sheets: `sheets.mjs <route>`
(4x3 grid, 12 shots per sheet, caption = file + scene:beat + leg + choice taken). Raw PNGs are in `<route>/png/` and are not committed.
Each route opens with the Logic-mode index shot (001).

| route | how | sheets | shots | page errors | stuck / notes |
|---|---|---|---|---|---|
| A | leg A (001-062): boot → rooftop → v2-park → v2-shop (shelf game, all right) → v2-town → v2-curry butter chicken → first beat of v2-train; leg A2 (063-089): shelf game again from `scene=v2-shop&beat=4` with wrong picks + a timeout, ends at v2-town 0 | 8 | 89 | none | none |
| B | `scene=v2-curry&beat=1`, pick katsu → v2-curry-katsu → v2-train → v2-rain → v2-street → v2-home → cup (Drink) → steeped END | 5 | 55 | none | none, reaches END card (LOVE 78%) |
| alone | `scene=v2-curry&beat=1`, pick "I am not hungry" → v2-curry-alone → first beat of v2-train | 1 | 8 | none | none |
| leave | 3 legs: `door` 0 → "Say goodnight" → leave → "uhmmm yeah ig" → leave-yeah END; `leave` 0 → "FUCK YOU" → leave-fu END; `leave` 3 → "Forever sounds long" → leave-yeah END | 4 | 38 | none | none, all three reach the GAME OVER card |
| escape | leg 1: `cup` 0 → "Stand up" → unknown → escape → lock game solved pair by pair (8 lock frames) → escape-win END; leg 2: `escape` 13 → lock game left to time out (40 s) → escape-timeout END | 5 | 54 | none | no stall. Beats not shot: escape 7, 8, 10, escape-win 4, escape-timeout 1 (auto/hold beats that advanced between driver polls, or same text as the shot before). Lock timeout leg has 1 lock frame (the countdown is not part of the state key). |
| run2 | `?run=2`: rooftop (to first beat of v2-park); `station-talk` 0-4 (loop lines); `v2-train` 6 onward to v2-rain 0 | 3 | 28 | none | none, run-2 vary text shows |
| run3 | same as run2 with `?run=3` | 3 | 28 | none | none, run-3 vary text shows |
| gacha | `scene=rooftop&beat=3&gacha=<tier>&pick=N`, 3 shots each (250 / 950 / 2450 ms): crit10, crit5, pity, anger, rage with pick 1; anger, rage with pick 3; then an unforced seed-1 rooftop play | 3 | 35 | none | none. Seen, not judged: forced crit10 and crit5 both show pop +8; anger/rage forced on pick 1 show +3 (no penalty) while on pick 3 they show −5 / −8. |
