# date-lab R1 — Builder A log

Worktree branch: `worktree-agent-a88d4b414cc46001d` (fast-forwarded onto the scaffold commit 85e8f7d).
Run: `npm run build && npx vite preview --port 5481`, then `date-lab.html?v=<id>` (`&still` = reduced motion).
Shots: `node research/date-lab/shots-a.mjs [id ...]` -> `research/date-lab/shots/<id>-*.png`.

## Shared kit (`src/date-lab/a/kit/`)
- `menu.js` — the DOOR choice as a pure state machine: 5 s timer, timeout = pink, replay disables your last pick while the
  timer still runs, and if pink is the disabled one she still takes it on timeout (`forced`). Node-tested (`src/date-lab-a.test.js`).
- `time.js` — shots / keyframes / stepped poses (8 fps grid, >= 500 ms holds) / flash audit (>= 334 ms, <= 3 a second) / word count. Node-tested.
- `art.js` + `roles.css` — main's Nanda SVG sprite (mockups `shared/art.js`) ported to an ES module; root class `art` -> `ka` so its
  stroke rules never touch date-beta's `.art` scenes. Colours are CSS role vars, so a grade wrapper can re-light her per scene.
- `hooks.js` — rAF clock, stepped pose clock, `useDoorMenu` (hotkeys 1 / 2, R = replay), `useBeats` sequencer, `useTitle`.
- `ui.jsx` — dialogue line + subtitles with main's OR rule (`Say.jsx` Ors), HUD chips, fonts.

---

## menu-1 · Tarot (horror 2)
- **School**: CLAMP / Persona arcana UI (anime) x Argento's *Suspiria* jewel tones + candle key light (cinema/horror).
- **Theme**: *fate is dealt by her.* Her card (VI THE CUP, "Just one cup.") is face-up and warm; yours is face-down (a door with her
  pin for a peephole, "It's late. Goodnight." printed under it so the choice is still legible).
- **What it does**: establishing shot on her door (Stairs, ajar) with "Come in? Just for tea." -> the table deals in (BG racks to
  blur + dims, velvet cloth, Nanda across the table *between* the two cards, candle-underlit) -> 5 s candle timer (wax = smooth
  timer, flame = 3 stepped poses at 500 ms, 5 ember pips). Timeout: her hand drops in 3 stepped poses and slides her card to you,
  "You didn't say no. So I drew for you." Purple: your card flips REVERSED (XVI THE DOOR upside down), purple bleed 334 ms, her face
  goes blank + pin red, "Reversed means you stay. Draw again?". Replay (R): the card you drew is pinned to the cloth with her
  NAND hair-pin (disabled), candle burns again; if you had picked pink she still draws it on timeout ("You can't pick it twice. I can.").
- **RM**: no deal / flip / slide; hard cuts between states; the bleed is still one 334 ms hold.
- **Self-critique**: strongest "object" menu of the three, but the card faces repeat the option text twice (card + label) and the
  pinned hair-pin reads a bit like a spoon at projector distance.
- **Carry-forward (R2)**: keep the candle timer + her eyes between the cards; make the face-down card *warm up* toward pink as the
  candle burns (her influence), add a 3rd card slot that is always empty (the third cup), and draw the hair-pin bigger with a red
  puncture so "disabled" reads from the back row.
