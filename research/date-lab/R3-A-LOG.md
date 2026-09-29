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
