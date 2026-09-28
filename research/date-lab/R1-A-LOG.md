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

## menu-2 · Truth table (horror 1)
- **School**: KyoAni / *Hyouka* prop-detail inserts (anime) x Wes Anderson dead-frontal planimetric framing (cinema) x Hitchcock's
  *Suspicion* quiet wrongness (horror, dialled to 1).
- **Theme**: *the output is already written.* MC's lunch napkin (his truth-table habit) is taped to her door, Unit 12. Columns
  A (you, pencil, mono), B (her, red pen, pre-filled 1s), OUT (NAND, pre-filled: "0 ♡" for stay, "1" circled three times for go).
- **What it does**: tick a row (the rows are the buttons, keys 1 / 2). Timer = 5 pencil tallies, one a second, the fifth strikes
  through; her red pen hangs on a string and swings in 2 held poses (a pendulum clock). Timeout: the red pen ticks the pink row
  ("I ticked it for you. You were thinking."). Pink: the warm door sliver widens, OUT "0 ♡" gets circled. Purple: 334 ms bleed,
  the door sliver shuts, her note becomes "1 = awake. all night.". Replay: the row you ticked is ruled out in her red, tallies restart.
- **RM**: tallies/ticks are already hard cuts; the pen stops swinging; no fades.
- **Self-critique**: the calmest and most legible of the three (reads from the back row), but horror 1 means it barely unsettles;
  the pencil mono font reads "typed", not "handwritten".
- **Carry-forward (R2)**: keep the pre-filled OUT column as the core joke/threat; draw MC's hand-lettering as SVG paths; add a third,
  empty row she has already ticked in red ("both") for the Input-B foreshadow; tally strokes should *scratch* on (3 stepped poses each).

## menu-3 · DDLC 4th wall (horror 5)
- **School**: *Doki Doki Literature Club* / Monika (anime-VN) x Haneke's *Funny Games* (the film knows you are watching) x Pony
  Island meta-horror (the UI is rewritten by the antagonist).
- **Theme**: *she edits the menu while you read it* — the choice UI is her territory.
- **What it does**: a normal pastel VN choice at her door (Nanda at her door, smiling). As the 5 s bar drains: her red caret lands on
  the purple option, "NANDA is typing…", "Goodnight." is backspaced one key per 125 ms and "Stay." typed in; then she types over the
  timer label, "take your time ♡", while the bar keeps draining (gaslight). Timeout: a second cursor (hers, white with a red edge)
  walks to pink in 3 held poses and clicks; hard cut to an ECU of her wide eyes, the menu shoved into a corner reading "Just one cup."
  twice, the tab title becomes "Unit 12 · don't close me", a DDLC-style file list ("nanda.chr modified 23:47 / you still here"),
  a torn scanline band holding 500 ms per position: "Not him. You. The one clicking." Purple: 334 ms bleed, the button snaps back to
  what you actually read and she retypes it to "It's late. lea—" (she never finishes "leave"): "You read the old text. Cheater."
  Replay: disabled option struck through with her note ("you already tried that"); on a pink-disabled replay she retypes purple into
  "Just one cup." too, and still takes pink on timeout. Console easter egg: "I know you opened this."
- **RM**: every edit is one hard cut held >= 500 ms; her cursor jumps straight to the press; no tear band; caret doesn't blink.
- **Self-critique**: strongest horror payoff and the most "only-in-a-game" idea; the pre-timeout half is plain on purpose, but the
  pastel box is generic DDLC and the ECU sprite is a scaled bust (line weight stays thin at 3x, a bit soft for a projector).
- **Carry-forward (R2)**: keep the live edit + her cursor + lens ECU; draw a dedicated ECU eye layer (thicker line, highlight removed
  = yandere stare) instead of scaling the bust; let her edit the *dialogue box* too (MC's own line gets rewritten); tie the file list
  to real state (runs count from localStorage).

## Camera rig (`kit/Camera.jsx`, `camera/lens.jsx`)
A virtual camera over main's scene components: per-shot keyframes (x/y/zoom/roll/BG blur), cubic in-out "operator" easing,
fade-through-black cuts, parallax planes (`parallax(pose, depth)`), `screen()` projection so optical effects track scene lights,
and `fit()` so no move ever shows the art's edge. Lens layer: flare with ghosts on the light->centre axis (hex or heart ghosts),
out-of-focus foreground petals falling in held 500 ms steps, raindrops on the lens, scene-space bloom. `?t=<ms>` freezes a frame.

## cam-1 · Shinkai light (horror 1)
- **School**: Makoto Shinkai (*Your Name*, *5 cm per Second*) x Terrence Malick magic-hour tilt-ups x one J-horror wrong detail.
- **Theme**: *light tells time, except hers* — the sky goes noon -> dusk -> night; the tower clock never leaves 12:00.
- **What it does** (31 s loop): (1) fade in on the rooftop railing, tilt up past the Figur clock to the sky, soft petals on a
  near plane, a sun flare whose ghosts slide as the camera tilts; (2) locked-off time-lapse, three held match-cuts noon / dusk /
  night (clouds re-lit at dusk, stars + moon at night, the clock face the only lit thing: "Night. The tower still said twelve.");
  (3) match cut sky -> train-window sky at 10x, pull back to find the carriage, rack focus from the window to a hanging strap on a
  near plane and back, dusk beam through the glass; (4) platform truck in the rain with drops on the lens and bloom on the tubes;
  (5) tilt up her stairs into the door lamp; its flare ghosts are tiny pink hearts. "NANDA: Obviously you'll remember."
- **RM**: one held frame per shot (the time-lapse keeps its three hard cuts), no fades, no flare drift, no petal fall.
- **Self-critique**: the time-lapse and the rack focus are the strongest beats; the dusk grade is a multiply over main's noon art so
  the sky banding reads "filtered", and the platform truck is the least motivated move.
- **Carry-forward (R2)**: let main paint dusk/night sky variants (or give Rooftop a `sky` prop) so the time-lapse re-lights instead of
  tints; add a 2-3 s "ma" hold with only wind before the stairs; keep the heart-ghost flare as the horror-1 signature.
