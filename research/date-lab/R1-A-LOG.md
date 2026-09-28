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

## cam-2 · Kubrick symmetry (horror 3)
- **School**: Kubrick (*The Shining* hallway tracks, intertitles, one-point dead-centre framing, the "Kubrick stare") x anime
  corridor holds (Evangelion / Shaft symmetry) x slow corridor dread.
- **Theme**: *everything in its place* — the world is symmetrical because she arranged it (mirrored ad pairs, the tactile line
  dead centre, her shoes to the millimetre).
- **What it does** (30.6 s): intertitle "THE UNDERPASS / 23 : 52" -> a TRUE one-point dolly down a procedurally drawn underpass
  (every depth slice projected with F/(z-camZ), so near tiles grow faster than far ones; it is a track, not a zoom), identical
  Figur / gate-pun ads on both walls (NOT Sweet, OR-SON, XOR Coffee, BUFFER), a yellow tactile line to the vanishing point.
  From 5.2 s the ceiling tubes die far -> near, one per 600 ms (held); each time one dies her silhouette (main's `sil('nanda')`,
  red eyes, pink pin) is one hard cut nearer, backlit by the exit; the ads stay lit. Intertitle "12 : 00" -> a patient dolly into
  her genkan -> the stare: dead centre, symmetric door frames receding, wide-eyed, "Shoes off. Everything in its place."
- **RM**: the corridor is two held frames (lit, far / dark, near); every other shot one held frame; hard cuts only.
- **Self-critique**: the corridor is the best thing I shipped this round (real depth, clear horror escalation); the genkan shot is
  main's asymmetric art so it breaks the symmetry theme, and the stare is a medium close-up, not a real Kubrick ECU.
- **Carry-forward (R2)**: symmetrical genkan (mirror the shoe line, shrine dead centre) or cut it; push the stare to an ECU with a
  head-tilt-down pose layer; add a single mirrored "twin" silhouette beat (two Nandas, one blinks) — the Grady twins, PG-13.

## cam-3 · Satoshi Kon (horror 4)
- **School**: Satoshi Kon (*Perfect Blue*, *Millennium Actress*, *Paprika*): match cuts that slip reality, pull-backs that reveal the
  shot was a screen/poster; Perfect Blue's cool palette with her red as the only warm thing; image-horror.
- **Theme**: *every frame is her frame* — each "real" shot turns out to be a picture she put there; the loop closes on her phone.
- **What it does** (30.6 s seamless loop): (A) carriage, "Nobody reads the ads. You read this one." — log-space push into the
  umeboshi on the NOT Sweet ad until red fills the frame; (B) match cut: the red is HER iris (iris re-graded to umeboshi red) —
  pull back (zoom about a fixed point, `kit/fit.js zoomAbout`) to find her face IS the train ad now ("NANDA ♡ Good input. Figur"),
  hard-cut slip smile -> wide eyes; (C) seamless nested pull-back: that whole carriage is a lit poster in the underpass —
  "Don't read the ads. Read me."; (D1) push into the dark tunnel mouth; (D2) her phone face-down on her pleated skirt flips in
  3 held poses, the screen shows the (clean) train, "You keep looking. So do I.", push into the screen until it IS the train at 1:1
  -> loop to A with no visible cut. Nested frames are real scene components scaled into boxes, so every reveal is pixel-exact.
- **RM**: one held frame per shot at its reveal pose, hard cuts, phone face-up at once.
- **Self-critique**: the most "cinema" of my camera pieces and the loop really is seamless; the lap/phone set is my own quick
  art and flatter than main's scenes, and the umeboshi -> iris match is shape+colour but not scale-perfect (iris is an ellipse).
- **Carry-forward (R2)**: add one more Kon slip mid-shot (a *match on action*: MC's hand reaching for the strap = her hand reaching for
  the phone); paint the lap/phone insert at main's quality; sound-bridge each cut (fx track) — Kon cuts on sound as much as shape.

## Close-ups (5 inserts, letterboxed to an insert aspect; each has its own school + one demo line)
### closeup-1 · Bento pick + SOUR (horror 1)
- **School**: food anime (*Shokugeki no Soma* reaction, *Yuru Camp* inserts) x Itami's *Tampopo* top-down x the echo rule.
- **Theme**: *what you pick, she packs forever.* Top-down lacquer bento on her gingham: rice + umeboshi, tamagoyaki, an octopus
  sausage, HER mochi ("mine ♡"). "Pick one. Sweet OR sour." -> MC's chopsticks hover the tamagoyaki (pink glow), step to the
  umeboshi (purple glow), pinch -> SOUR MUST READ: frame squashes to scaleY .92 (smooth camera), damped shiver, yellow-green tint
  held 334 ms, "すっぱい！ SOUR!" -> "Sour, ne?" -> her smile on speed lines, "You smile for her anyway." -> back on the box her red
  chopsticks have put a SECOND umeboshi in: "Good. I'll pack sour. Every day." RM: static tint 1 s + hard cut, no squash/shiver.
- **Self-critique**: reads instantly and is funny; the "reaction" cut is her face, not MC's (MC is hands-only), so the pucker is
  only carried by the camera + SFX. **R2**: add MC's hand trembling on the chopsticks in the pucker beat (2 held poses).

### closeup-2 · Phone face-down (horror 3)
- **School**: the Kuleshov effect x *Rear Window* inserts x yandere tells. **Theme**: *what she hides, she hides without looking.*
- Her phone buzzes (2 held offsets, 2 Hz) — lock screen 12:00, wallpaper = a candid photo of YOU from behind on the roof railing,
  "Unknown ⊕ · who's the new kid? 🙂" (XOR) — her thumb flips it face-down in 3 held poses -> Kuleshov cut to her face, blank,
  pin dark, 2 s of nothing -> "Nobody. Nobody important." -> it buzzes again face-down, XOR-purple light leaks round the edge ->
  her smile: "Only you tonight. Come in." RM: static "bzz", no offset, one-cut flip.
- **Self-critique**: the wallpaper detail is the best horror-per-pixel of the set; the hand is main's MC hand re-coloured and reads
  a bit mitten-like. **R2**: her own hand art (nails in her red); the purple leak should pulse once per buzz, not glow flat.

### closeup-3 · The third cup (horror 4)
- **School**: Ozu low-table framing / KyoAni quiet kitchens x *Get Out*'s teacup x *Notorious* rack focus. The tea is never named.
- **Theme**: *it's always three of us* — the third cup is for YOU (Input B). Uses main's `sceneKitchen` string art with the third
  cup lifted onto its own plane so focus can rack to it; ripples ring on its surface (stepped) — "Nobody poured it. You heard a
  pour anyway." -> ECU: the steam writes OR in her red, rising in 3 held poses and fading ([her breath] caption) — "MC: Who's the
  third cup for?" -> her hand slides the cup toward the lens in 3 held poses: "For Input B. Silly." / "It's always three of us."
  RM: static OR cut in at 0.8 s, held 1 s, cut out (script rule); the push is one cut.
- **Self-critique**: the OR-in-steam shot and the rack focus are strong; her hand is a fist, not a gentle push. **R2**: an open palm
  sliding the saucer, and a 4th cup appearing on the last beat (the TRUE AND ending plant).

### closeup-4 · The shrine circuit (horror 3)
- **School**: *Mushishi* / *Mononoke* reliquary macro x a patient Kurosawa push-in x Undertale-style personal memory.
- **Theme**: *she enshrines what you make.* Genkan -> push in on main's shrine (my candle flame steps in 3 held poses) -> ECU on
  the circuit under glass: inputs "you" / "her", a NAND, the output lamp lit red, and her red handwriting "built today, HH:MM ·
  kept ♡" with the VIEWER's real clock -> an umeboshi offering: "I keep everything you make."
- **Honest note**: Logic mode doesn't persist the player's circuit anywhere (no localStorage key), so the circuit is fixed; only the
  time is real. **R2**: have Logic mode write `gob.lastCircuit` and render it here (the script asks for exactly that).

### closeup-5 · Her pin states (horror 2)
- **School**: magical-girl brooch macro (*Sailor Moon* / *Madoka* soul gem) x the manga two-panel reaction split x mood ring.
- **Theme**: *the pin is the truth her face hides.* Top panel: her NAND hair-pin in macro on silver hair; bottom panel: a letterbox
  strip of her eyes; legend on the right. hum (pink glow) "Good input." / flicker (bright<->dim, 500 ms holds = 2 swaps/s)
  "W-wait. Not both at once—" / solid red "Don't lea—" / dark, silence. RM: flicker = a static half-lit bubble.
- **Self-critique**: clearest "rules card" for the audience, least cinematic; the pin reads as a plain gate, not a jewel. **R2**: add
  enamel/metal shading and a glint, and use it as a HUD element in the real game instead of a standalone insert.

## Nanda integration kit (`kit/integrate.js` pure + node-tested, `kit/Lit.jsx`)
Each scene has a LIGHT RIG measured from main's art (ambient, key colour + direction, rim source, a sampled wall colour next to her,
a scale reference at a known depth). Her role palette is DERIVED from the rig (multiply toward ambient + key lift), not hand-picked.
`LitNanda` composites main's sprite with 4 toggleable passes: grade, form shade (key-direction gradient masked by her own alpha),
rim (SVG edge filter on the lit side; all-round for backlit rigs), cast shadow (blurred black copy away from the key; a long
skewed floor shadow for the silhouette). Placement = `bustScale()/silScale()` from the reference object, never eyeballed.

## nanda-1 · Lit like the room (horror 2)
- **School**: Ghibli / KyoAni cel-over-BG compositing (colour script) x Deakins motivated light x "she is closer each time".
- **Theme**: *she belongs in every room.* 22 s, 4 shots, slow push each: (1) platform — main's own silhouette gets a cool rim
  from the city, a wet-floor reflection and pin bloom ("Her stop. She waited in the rain."); (2) her door — bust graded to the
  walkway, warm rim from the ajar door, cast shadow on the wall ("This is me. Unit 12."); (3) genkan — backlit silhouette in the
  hall doorway, all-round warm rim, red eyes, a long shadow reaching toward you over the step ("Shoes off. The hall light is
  for you."); (4) third cup — she sits BEHIND the table (kitchen split into back/front planes), pin red ("Drink while it's warm.").
- **RM**: one held frame per shot, hard cuts.
- **Self-critique**: grade + rim make her sit in the door and genkan shots; the kitchen is main's flat Kawaii palette so there
  is little to match, and the door-shot form shade reads a bit grey/flat. **R2**: add a bounce light (floor colour, from below)
  pass and a subtle key-colour hair highlight; draw a real lower body for the door so she can stand at the door's scale.
