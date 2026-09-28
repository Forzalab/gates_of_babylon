# date-lab R2 — Builder A log

Worktree branch: `worktree-agent-a534583f6293ea5c6` (merged `claude/date-beta-alt-spec-review-4gdzab` @ efdc8ea first).
Run: `npm run build && npx vite preview --port 5481`, then `date-lab.html?v=<id>` (`&still` = reduced motion).
Shots: `node research/date-lab/shots-a.mjs <id>` -> `research/date-lab/shots/<id>-*.png`. Tests: `src/date-lab-a-r2.test.js`.
Round-1 variants are untouched; round-2 code lives in new folders (`a/menu2/`, ...).

---

## menu-h1-r2 · "The Cup That Types" (hybrid menu-1 x menu-3, horror 4)
- **School**: CLAMP arcana + Suspiria candle key light (menu-1) x DDLC / *Funny Games* live UI edit (menu-3).
- **Theme**: *she rewrites your card while the candle burns.* The table is warm and diegetic; the horror is her cursor.
- **What it does**: door (1 s) -> the deal (0.9 s) lands with her red caret + her DDLC arrow (white, red edge) ALREADY parked at
  the end of your face-down card's slip, "NANDA is typing…" under it (tell inside the first 2 s, before the timer even starts).
  Candle timer 5 s. Her cursor backspaces your slip one key every 250 ms ("It's late. Goodnight." -> "It's late. ") then types
  "Stay." — your card back (lattice, frame, door, glow) warms from cold purple to her pink in 4 held steps while it happens.
  Purple still MEANS leave: pick it and the card flips XVI THE DOOR reversed, 334 ms bleed, she retypes the slip to "It's late. lea—",
  "You read the old text. Cheater." Timeout: her hand slides THE CUP to you in 3 held poses. Replay: the drawn card gets her hair-pin
  driven through it (big, red puncture ring), a DRAWN stamp, dimmed, and its slip = her retyped text struck through in her red
  ("It's late. Stay." / "Just one cup."), her note under it. Pink disabled -> she retypes your WHOLE slip into "Just one cup." and
  still draws pink on timeout ("You can't pick it twice. I can.").
- **RM**: no deal / flip / slide; each edit = 3 hard cuts held 1 s (old -> emptied -> new); caret doesn't blink; warmth jumps with the cuts.
- **Verdict criticisms answered**: menu-1 "caption-dependent" -> the tell is the cursor + typing label + warming card, not the line;
  menu-1 "pin reads as a stray mark" -> 380 px pin, red puncture ring, DRAWN stamp, struck slip; menu-1 R1 self-critique "text
  repeated twice" -> one slip per card, under-labels removed; menu-3 "first 3 s plain" -> cursor parked on the card at the deal.
- **Tests**: retype finishes < 5 s, >= 250 ms per key on the 8 fps grid, warmth steps >= 500 ms, RM <= 3 cuts >= 1 s, lines <= 12 words.
- **Self-critique**: strongest single-frame read of my menus; the brand print (Figur Arcana) had to go to make room for the slip,
  and her arrow is a UI glyph floating on a diegetic table (intended DDLC clash, but a purist could call it mixed grammar).

## menu-3-r2 · DDLC 4th wall, improved (horror 5)
- **School**: DDLC / Monika x Haneke's *Funny Games* x Pony Island meta-horror (unchanged). **Theme**: *she edits the menu while
  you read it* — and now she starts before the menu exists.
- **What changed vs R1**: (1) **cold-open tell**: the scene opens on MC's OWN line "It's late. I should go home."; at 0.75 s her
  red caret appears in HIS dialogue box (box border goes her red, "NANDA is typing…" tab on the box) and backspaces "go home." ->
  "stay." by 2.6 s. The menu appears at 3 s, already after the room has seen her rewrite the game. Her first line then answers
  it: "You said stay. Come in? Just for tea." (2) **ECU layer** (`menu2/EyesEcu.jsx`): drawn for the ECU, not the bust at 3x —
  lids ~19 px, face edge ~9 px, lower lid ~8 px, highlight removed, shrunken red iris + pinpoint pupil, heavy upper-face shade.
  Pupils start on MC (screen-left) and after ONE held cut (1 s) snap dead-centre into the lens on "Not him. You." (3) file list
  tied to real state: `visits N (i counted)` from localStorage (try/catch, private window = 1).
  Kept: live retype of purple -> "Stay.", timer relabelled "take your time ♡", her cursor walks to pink in 3 held poses, purple =
  "Cheater." + "It's late. lea—", replay notes, pink-disabled both-buttons-agree, console easter egg.
- **RM**: MC-line edit = 3 hard cuts held 1 s; menu edits = held cuts; pupils start centred; no tear band; caret static.
- **Verdict criticisms answered**: "first ~3 s a cold audience sees nothing scary" -> MC's line is rewritten inside 1-2.6 s;
  "ECU bust thin line at 3x" -> dedicated ECU layer with authored line weights.
- **Tests**: MC-line edit starts < 1 s, ends <= 3 s, on the 8 fps grid; RM = 3 cuts >= 1 s; lines <= 12 words.
- **Self-critique**: the tell is now early and obvious; the ECU is cleaner but my own face drawing is flatter than main's bust
  (no hair shine) and the pin is cropped huge at top-right.

## menu-1-r2 · Tarot, improved (horror 2)
- **School**: CLAMP / Persona arcana x Argento's *Suspiria* candlelight (unchanged). **Theme**: *fate is dealt by her* — now
  readable with the sound and captions off.
- **What changed vs R1**: (1) **her hand is on your card**: from the deal on, her sleeve reaches out of the dark on her side of
  the table and two red-nailed fingertips rest on your face-down card. Hover THE CUP: it lifts 22 px; hover yours: 6 px (she is
  holding it down). (2) your card **warms toward her pink one step per burnt candle pip** (5 held 1 s steps; her candle, her
  colour). (3) **the third place**: an empty chalk-cup card slot "III" on the cloth (the third cup; nobody deals into it). (4)
  option text lives ONCE on a slip across each card (the R1 double label is gone). (5) **disabled from the back row**: the drawn
  card is dimmed, nailed with her hair-pin at 5x (steel shaft, red puncture ring with tear lines), a rotated DRAWN stamp, the slip
  struck through in 7 px her red, her script note under it. Timeout: the hand lets go of yours and slides THE CUP to you.
- **RM**: no deal / flip / slide / lift; warmth jumps with the pips; bleed one 334 ms hold.
- **Verdict criticisms answered**: "needs the 'Mine is face-up' line to land" -> hand-on-card + warming + lift asymmetry carry
  it; that caption line was cut ("Pick one. Take your time." is now ironic flavour). "Pin reads as a stray mark at distance" ->
  380 px pin + puncture + DRAWN + strike.
- **Self-critique**: reads without words now; the arm's fade-from-dark sleeve is a bit of a cheat (no shoulder), and it shares
  its disabled kit with menu-h1-r2 so the two look like siblings (they are: the hybrid is this table plus her cursor).

## cam-h-r2-a · "The Frame Keeps Finding Her" (builder A's take on cam-3 x cam-5, horror 5)
- **School**: Satoshi Kon (match cuts that slip reality, nested pull-backs) x Ju-On / found footage (camcorder OSD, handheld,
  the camera notices her first). **Theme**: *you are the one filming — and every reality the camcorder shows you is one of her frames.*
- **Key idea (A's take)**: every Kon move is *motivated by the camcorder's own automation*, and the **D.ZOOM readout is a
  continuous, honest number across the nested cuts**. Every nested frame is exactly 1/6 of the stage, so "D.ZOOM 6.0x" on the very
  first frame already tells a careful viewer they are filming a picture of a picture.
  1. **train** (6 s): REC, handheld drift (B's cam-5 sines, all <= 2.6 Hz, copied). AF hunts in 3 held white boxes, then locks
     "FACE 1" on the umeboshi (it is not a face). The D.ZOOM pushes in *by itself* until red fills the frame.
  2. **iris** (6.5 s): match cut, the red is HER iris at "D.ZOOM 202x"; the zoom releases, AF locks her face — she IS the ad.
     Hard-cut Kon slip smile -> wide.
  3. **poster** (6.5 s): the release continues through 6.0x -> 1.0x: the carriage is a poster in the underpass (seamless nested
     pull-back, readout continuous). The AF box DROPS the poster and jumps to the tunnel mouth, red: she is standing there.
  4. **tunnel** (4 s): NIGHT SHOT; the D.ZOOM pushes on her by itself (4x); tracking dropout = one 800 ms held state.
  5. **floor** (9.5 s): the camera falls, lies rolled 86° in her genkan; the date stamp is frozen at 12:00:00 AM the whole
     piece; FACES 1..11 counted on an empty floor, one per 500 ms (held), all boxes go red at FACE 12 = her phone on the tataki.
     "NANDA: Rewind it. I'm on the train." The D.ZOOM pushes 6x into the phone screen — the phone lies turned -86° so the fallen
     camera sees it upright — and the last frame IS frame 1 (the train at 1:1, readout 6.0x): seamless loop, proven in a test.
     The last 600 ms drop night-shot + AF so the OSD also matches frame 1.
- **RM**: no handheld, no dropout band, one held frame per shot (the floor gets a second hard cut straight to the phone frame),
  face count still steps (text, not motion), REC dot solid.
- **Borrowed**: B's cam-5 OSD grammar + handheld sine table + face-box look (copied into `a/camera2/`, B's folder untouched);
  my cam-3 train ad / nested-poster geometry.
- **Tests**: loop seam maps 4 train pixels back to themselves under the final pose; D.ZOOM readout equal at the loop and at the
  iris->poster cut; handheld <= 3 Hz; AF hunt + face count holds >= 500 ms; dropout >= 334 ms; 20-40 s; lines <= 12 words.
- **Self-critique**: the strongest "only a camcorder can do this" logic of my camera pieces; the her-in-tunnel silhouette is big
  and flat at 4x, the phone on the floor is oversized for the room (it has to be 1/6 of the stage for the readout maths), and the
  genkan floor count repeats B's round-1 beat nearly 1:1 (by spec).
