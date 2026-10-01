# Review A (Prof. WhatIsThis): route index

Resumable: a route listed here is done; skip it on restart. Head under review: origin/ccr-8b4548b6-08uz6t @ e48d2a5.
Setup: frozen `vite build` + `vite preview --port 5633`, Chromium /opt/pw-browsers, 1920x1080, seed 1, clock pinned 2026-10-01 12:20
(story clock live: offset +20 min). Driver: `node research/sprint-1001/review/shoot.mjs <route> 5633 <outdir>`; PNGs stay in scratch (not committed).

| # | route | how | shots | result | done (UTC) |
|---|---|---|---|---|---|
| 1 | A: demo path, run 1, end to end | `?seed=1&fx=full`, pink picks, butter, shelf all right, Sit down, Drink -> STEEPED (YOU WIN 100%) | 99 | complete, no STUCK, no page errors | 13:10 |
| 2 | branches: every choice of every reachable 2+ choice beat | `choices.mjs` -> 46 picks; deep link `?scene=&beat=&pick=k` + react + 2 frames after | 130 | complete, every pick routes to its authored `go` (rooftop:11 c2 -> leave, v2-park:3 c1 -> v2-library, v2-curry:1 c1/c2 -> katsu/alone, v2-home:4 c1 -> leave, cup:4 c2 -> unknown, leave:3 c0/c1/c2 -> yeah/yeah(fake)/fu); no no-op choice | 13:15 |
