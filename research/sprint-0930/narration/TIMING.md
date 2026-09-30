# Timing plan: beats honour the voice

Written before the implementation. Goal: nobody is cut off, the NEXT pill never invites a click over a line still
being read, two-step reveals land on the spoken word, and Nanda + narrator never talk over each other.

## Data: `src/date-beta/voice/timing.json` (generated, the engine reads it)
`scripts/narration/timing-table.mjs` walks every take in `voice/manifest.json` (Nanda + narrator):
- `audioMs`: the mp3 length from its frame headers (`scripts/narration/timing.mjs` `mp3Ms`, no ffprobe in the
  container; CBR 44.1 kHz / 128 kbps so it is exact to a frame, 26 ms).
- `holdMs = audioMs + PAD` with `PAD = 350`.
- `marks`: for narrator takes, `/with-timestamps` returns per-character start/end times. The full alignment is kept in
  `research/sprint-0930/narration/align/<file>.json`; the engine only needs the few reveal points, so the table stores
  `marks: { "<substring>": ms }` for each `cut.at` split text and `props.sfxAt` word that occurs in that line.
- Nanda's takes (v3, recorded before, no alignment) get `audioMs` + `holdMs` only.
Keyed by file path; plus `rows` (scene, beat, chars, audioMs, holdMs) as the human-readable table.

## Engine rules (main.jsx + voice/index.js)
`VOICE.plan(scene, plain, then)` returns `{ ms, stepMs, marks }` for what `show()` will actually play (0 when muted,
not yet unlocked, or unrecorded), so a silent run keeps the authored timing exactly.
- (a) **Hold / auto.** Auto beats wait `max(beat.auto, ms + PAD)`. Click beats keep `beat.hold` as the *click* gate
  (a click can always skip the voice after the authored hold).
- (b) **NEXT pill.** `ready` (the pill) turns on at `max(beat.hold, ms + PAD)` instead of `beat.hold`. Choice beats:
  choices still unlock at `beat.hold` (unchanged: a timer beat must stay fair).
- (c) **Two-step beats.** `lead` beats (lead line, then the beat's own line): the second line reveals when the lead's
  take ends (`stepMs = lead audioMs`), and the queued take starts on `ended` as now. `cut.at` splits (the forecast gag
  "f-" and "They laugh.") reveal at `marks[at]` (the aligned start of that substring). No take/mark: the authored
  `cut.step` stays.
- (d) **SFX.** `beat.sfx` fires on the beat start (unchanged, lines up with the frame cut). A beat with
  `props.sfxAt: "<word>"` delays its sfx to `marks[word]` when the take is playing (fallback: beat start).
- (e) **No overlap.** One `Audio` at a time: `show()` pauses the previous element before starting; a queued second take
  only starts if it is still the queued one when the first ends; a new beat, a skip or mute stops everything.

## Test (`src/date-beta-narration.test.js`)
- every manifest take has a timing row, `holdMs >= audioMs + 350`, `audioMs > 300`, file > 5 KB;
- narrator rows: every `cut.at` of a recorded two-step line has a mark inside the take;
- `plan()` math: muted / unrecorded = 0, lead + line = sum.
