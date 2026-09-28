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
