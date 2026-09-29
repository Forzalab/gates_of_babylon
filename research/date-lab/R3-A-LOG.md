# date-lab R3 — Builder A log

Worktree branch: `worktree-agent-a8a73e2776df5a4c7` (reset to `claude/date-beta-alt-spec-review-4gdzab` @ cd249e5 first; the merge conflicted in scenes.json).
Run: `npm run build && npx vite preview --port 5481`, then `date-lab.html?v=<id>` (`&still` = reduced motion).
Shots: `node research/date-lab/shots-a.mjs <id>` -> `research/date-lab/shots/<id>-*.png`. Tests: `src/date-lab-a-r3.test.js`.
Round-3 code: `src/date-lab/a/menu3/` (menus), `a/camera3/` (camera), `a/closeup3/` (SOUR). Earlier rounds untouched.

**Shared r3 fix, all menus:** `menu3/chunks.js` `wordEdit()` replaces per-key typing. An edit is whole-chunk swaps held 500 ms:
old text -> the doomed words selected in her red -> deleted -> first half typed -> rest typed. `swapsSafe()` proves no 1 s
window holds more than 2 swaps (R1 rule: typing/glitch <= 2 glyph swaps per second). RM: <= 3 hard cuts held 1 s.

---

## menu-h1-r3 · The Cup That Types (hybrid menu-1 x menu-3, horror 4)
- **Theme**: unchanged, *she rewrites your card while the candle burns*.
- **R2 defects fixed**: (1) typing ran 250 ms/key -> now 4 chunk swaps 500 ms apart ("Goodnight." goes red-selected at
  0.75 s, gone at 1.25 s, "Sta" 1.75 s, "Stay." 2.25 s; your card warms one step per swap). (2) her white UI arrow ->
  `menu3/HerPointer.jsx`, HER hand drawn in the sprite line (red nail on the caret, pink cuff, lavender sleeve), pressing
  5 px in on alternate swaps (held pose). (3) Figur Arcana print restored on both cards (bottom edge; dark backing on your
  card so it reads). (4) slips 54 px, "NANDA is typing…" 40 px.
- Kept: candle timer, warm-up, her hand slides THE CUP on timeout, replay pin/DRAWN/strike, pink-disabled "both cards agree".
- **Tests**: edit ends < 5 s, <= 2 swaps/s on every run state, warmth 0/.25/.5/.75/1 at the swaps, no per-key `retype(` in
  source, brand print present, lines <= 12 words.
- **Self-critique**: the red selection is the new best frame (`-2`); her hand is big and hangs below the card edge, which
  crowds the "NANDA is typing…" label on the right.

## menu-3-r3 · DDLC 4th wall (horror 5)
- **Theme**: unchanged, *she edits the menu while you read it*, starting on MC's own line before the menu exists.
- **R2 defects fixed**: (1) ECU occlusion: in the lens beat the menu used to shrink to 45 % into the bottom-left and the
  dialogue box clipped it ("take yo"). Now it stays full size, docked top-left (y 92-400) above her eyes and clear of the
  box; timer 54 px tall, label 36 px, red on white in the lens (`-6`, `rm-ecu`). (2) all three edits (MC's line, purple,
  timer label) are chunk swaps: MC's "go home." red-selected 1.0 s -> gone 1.5 s -> "sta" -> "stay." 2.5 s; purple
  "Goodnight." selected at t 1.0 s -> "Stay." at 2.5 s; label countdown -> emptied 3.0 s -> "take " -> "take your time ♡"
  4.0 s. Merged, never more than 2 swaps in any second (tested).
- Kept: cold open, "NANDA is typing…" tab, her DDLC cursor on timeout (UI arrow is right here: this one IS the game UI),
  ECU eye layer with the held look-cut MC -> lens, visits counter (own key `gob.lab.menu3r3.visits`), replay notes.
- **Tests**: MC edit inside 3 s, merged swaps <= 2/s on all run states, lens CSS has `transform: none` and ends above y 890,
  label >= 34 px, lines <= 12 words, no per-key retype.
- **Self-critique**: menu and her eyes now share the frame cleanly; the ECU face is still my flatter drawing, and the
  "4th-wall" count in the demo stays high (Tony lifted the cap).
