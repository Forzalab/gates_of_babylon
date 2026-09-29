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

## menu-h4-r3 · The Draft Folder (NEW hybrid: menu-h1 object edit x menu-3 cold open x menu-h2 pour, horror 4)
- **School**: Kurosawa's *Pulse* (the machine in your hand is how she gets in) x *Unfriended* screen-horror x the CLAMP
  candle table. **Theme**: *she is on your phone*: the wall-break becomes in-world, no game cursor, no menu chrome.
- **What it does** (`menu3/Draft.jsx`, pure beats in `menu3/draft.js`): MC's phone lies face-up on the tarot cloth between
  her card (VI THE CUP, Figur Arcana) and the candle + the empty "III" place. Chat with "Nanda ♡", carrier "Figur 5G",
  clock 12:00. **Cold open (0-3 s)**: his unsent reply "It's late. I should go home." sits in the composer, header says
  "typing…" in her red, her dots bubble steps; "go home." goes red-selected (1.25 s), vanishes, "stay." types in HER red
  (2.75 s). MC: "Wait. I didn't type that." **3.0 s** the Drafts folder slides up: two drafts (pink "Just one cup.", purple
  "It's late. Goodnight.", 48 px), "auto-send in N s ♡". **Timer**: the send bar drains and its spout pours into the pink
  draft (fill grows); the candle only marks the pips. **Pink / timeout**: the pink bubble sends, "Delivered ♡", 1 s later
  "Read 12:00" ("You didn't say no. It sent itself." / "Read at twelve. I always am."). **Purple**: the bubble sends,
  "! Not delivered" at 0.5 s, 334 ms purple bleed, her hair-pin goes through the glass at 1 s (crack lines), "Oh. It
  bounced. Bad signal on my stairs." **Replay**: the picked draft is greyed and struck, "Message already sent"; the phone is
  nailed to the cloth by her pin through its bottom-right corner; the last bubble stays in the thread; timer runs. Pink
  already sent -> she chunk-edits the purple draft into "Just one cup." (menu-3-r3 script).
- **RM**: no slide, pour = 5 held one-second blocks, spout hidden, edits = <= 3 hard cuts held 1 s, dots hold, status lines
  cut straight to their end state.
- **Tests**: composer edit ends before the folder opens, <= 2 swaps/s on every run, pour monotone, RM blocks, status beats
  (Delivered -> Read 12:00, Not delivered -> pin), brand + "Message already sent" present, lines <= 12 words.
- **Self-critique**: reads instantly as "she's on his phone" and needs no UI cursor; the thread area is a bit empty while the
  timer runs (by design, the eye goes to the drafts), and the replay pin through the corner reads more "stuck" than "nailed".
