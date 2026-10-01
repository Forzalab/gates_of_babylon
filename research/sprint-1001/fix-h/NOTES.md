# fix-h: SLOP HIGH fixes (H1, H2, H3)

Base: origin/ccr-44b3aeaf-0iuf00 @ b2ef695. Shots: frozen `vite build` + `vite preview`, Playwright 1920x1080, clock 12:20 PM,
`date-beta.html?scene=<id>&beat=<n>&run=2&seed=1`. The BEFORE shots come from a build of b2ef695 and the AFTER shots from the fix commit.
Files: `<shot>-before.jpg`, `<shot>-after.jpg` and `<shot>-pair.jpg` (side by side), JPEG q80. The `t` suffix means `&bento=tamagoyaki`.
Scope: H4/H5/M4/L4/C1 were fixed elsewhere. The coordinator moved H6 (and curry 13) and H7 to main, so this branch does not touch them.

## H1: rooftop 5 (bento lift) + 6 ("Itadakimasu"): the chopsticks were held by nobody
- **Wrong:** her pink chopsticks lifted the umeboshi or tamagoyaki from off the frame edge with no hand. On beat 6 (POV), Nanda
  stands in the background, so the sticks belonged to nobody on screen.
- **Root cause:** `BentoLift` (art/scene-a/Bento.jsx) and `PovFood` (SceneA.jsx) drew two bare `<Chopstick>`s from off-canvas
  points. No hand existed in the scene-a parts.
- **Fix:** a new `HeldChopsticks` / `ChopHand` in art/scene-a/foods.jsx. It draws YOUR right hand (the MC's, so 5 fingers are OK; Nanda's
  pin-hands lock is untouched) with the green knit sleeve off the frame edge and the wrist bent 22 deg. The sticks' thick ends converge in the
  grip, the thumb, index and middle sit on the sticks, and the nails are drawn. Beat 5: the hand enters from the lower left, and the box layout stays as on beat 4.
  Beat 6 (POV): the hand enters from the lower right, under the line of her sprite. On the tamagoyaki the sticks pinch it from behind (`behind`), so no
  stick crosses its face. No pack change was needed, and the change covers routes A, gacha, run2 and run3.
- **Files:** src/date-beta/art/scene-a/foods.jsx, Bento.jsx, index.js; src/date-beta/SceneA.jsx.
- **After:** rooftop5/6 (umeboshi) and rooftop5t/6t (tamagoyaki). The hand clearly holds both sticks and nothing floats. On beat 6 the box only overlaps
  the hand's lower knuckles.
