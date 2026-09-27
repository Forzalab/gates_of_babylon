# pit4/r1-2 (f2) log
- 2026-09-27 T+0: read brief, plan, rubric, all 10 refs + dejting spec. Branch pit4/r1-2 off origin/pit3/arbiter.
- T+1: f2 scaffold: src/date/f2.jsx + f2.css; compat.js gains gateTT/agree/gateCompat (sim-backed) + tests; favicon (data: heart).
  Surprise = class chat as the fake site's own LIVE CHAT tile in grid col 4 rows 2-3. Continue = swipe deck on gates.
- T+2: Tony adds school S2 (Sakurai/Nijman/Swink juice) and mundane lens M1/M7. Squash on press, hit-stop 90 ms before a swipe commits, heart burst, one shake on match.
- T+3: first shots: modal .76H too tall, buttons overflow modal, deck off-screen at 1440, pointer drag bug (listeners on e.target). Fixed sizes + drag.
- T+4: Pillow loop (measure.py): modal y-span .76 -> .695, grid bottom .899 -> .906, WARNING cap .098 -> .105, chat body moved to the kit's magenta (was tile beige-grey).
- T+5: lens M1 (filing status in the match panel) + M7 (captcha line in the chat). Match modal opacity bug (implicit to-keyframe) fixed with explicit `to`.
- T+6: Kenney CC0 sound: sfx.js, 14 files / 140 KB in public/sfx, SOUND ON/OFF toggle in the bar, unlock on first gesture. Tests 132/132, build, e2e pass, 0 page errors.
