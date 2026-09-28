# date-lab R2 — Builder B log

Branch: `worktree-agent-ab3b46bcccd53e94e` (merged `claude/date-beta-alt-spec-review-4gdzab` @ efdc8ea first). Folder: `src/date-lab/b/**`.
Shots: `research/date-lab/shots/<id>-*.png` via `node research/date-lab/shots-b.mjs r2` (preview on :5482).
Tests: `src/date-lab-b-r2.test.js` (pure parts of every round-2 variant) + round-1 `src/date-lab-b.test.js`.
Round-1 variants are untouched; round-2 ids carry the `r2` suffix.

## Shared (new in round 2)
- `shared/LitBust.jsx`: my ported Nanda bust composited into a scene's light. The light maths is Builder A's rig table
  (`a/kit/integrate.js`, imported read-only, pure JS): graded role colours, a rim band on the lamp side, a soft cast shadow.
  This is how both round-2 menus get a real face.
- `menur2/Letterbox.jsx`: one letterbox engine, two variants (`mode="h2"` / `mode="m4"`). Pure timing in `menur2/edit.js`.
- `?mt=<ms>` freezes the menu clock at any time for shots.

---

## menu-h2-r2 · "Her Time, Her Cut" (menu-4 x menu-3, horror 4)
**Theme:** the time is hers and so is the edit. Bandersnatch letterbox + the timer that pours into pink (menu-4), plus
menu-3's live edit, but staged as a film/editing suite: her collaborator cursor, then her cut.
**What it does:** medium shot of Nanda at her door (real bust, lit by the door lamp, rim on the lamp side). The menu rises in
the bottom bar; the timer drains leftward into the pink cup. **From the first frame** her red caret is parked at the end of
"Goodnight." with a Google-Docs-style name flag `NANDA` and a line under the box: `✎ NANDA is editing…`. At 3.0 s the word
glitches (red/pink split, one held state 375 ms), her pin turns red; 3.375 s she selects "Goodnight." (red highlight,
held 500 ms); from 3.875 s she types "Stay." one key per 125 ms (done 4.375 s, before the timeout). The line becomes
`✎ NANDA edited: ~~Goodnight.~~ → Stay.` The timer keeps pouring into pink underneath.
- Timeout → pink ("You didn't say no."), lock, door ajar, push-in, slippers insert.
- Purple **after** her edit reads as "Stay." → the stay ending ("You picked Stay. I saw.").
- Purple **before** her edit → leave: 334 ms bleed, bars clamp to 2.76:1, hard cut-in on her real face (blank eyes, pin off),
  "You're allowed. Text me when you're home." → **her cut**: the frame freezes and desaturates, film sprockets, a red
  grease-pencil X in two held strokes (500 ms apart), `✂ CUT · TAKE 2`, whisper "cut." → take two: purple struck with
  her grease-pencil `CUT`, timer still runs.
- Replay after pink: pink is disabled, the only option left is purple, which she retypes to "Stay." at 3 s; the timeout
  takes it → "Same answer, then." Every road ends at her door.
**RM:** timer = 5 blocks, bars/camera hard-cut, the edit is one hard cut at 3.0 s straight to "It's late. Stay." (the
struck original stays readable in the edit line), caret solid, bleed = purple edge frame, her cut = one held X frame.
**Verdict answers (menu-4 critique carried in):** "options look neutral before the first timeout" → her named caret +
"NANDA is editing…" are on screen from frame 1, and the edit lands at 3 s, before any timeout; "reaction silhouette
flat" → real bust, blank face, same door light.
**Self-critique:** the grade of A's rig makes her a touch pale/flat in the door light; the grease-pencil X is a clean vector
stroke, not a hand-drawn wobble.

## menu-4-r2 · Bandersnatch, improved (horror 3)
**Theme:** "the timer is hers", visibly, from the first frame.
**What it does:** same letterbox, same backlit silhouette at the door, but the lean is readable before anything happens:
1. the pink cup opens **pre-poured** (30 %), then fills with the time;
2. a **pour spout**: the timer bar bends down into the pink box and drops step into it on the 125 ms grid;
3. the boxes are **unequal from frame 1** and diverge: pink 730 → 880 px, purple 530 → 380 px (its text is squeezed onto
   two lines); purple sits in her shadow, pink in her lamp spill.
Purple → bleed, bars clamp, **reaction cut-in on her real face** (the bust, blank, backlit at half brightness so it is
the same silhouette seen close), then SHE rewinds the tape (VHS bands, whisper "again?"). Every replay opens with
Bandersnatch's `▸▸ 1.5× · ALREADY SEEN` re-intro, and from the second replay the top bar reads
`THE ROOM CHOSE PINK n OF N` (endings seen on this machine, localStorage, try/catch).
**RM:** timer = 5 blocks with the pre-pour, widths jump once a second, no spout drops, bleed = edge frame, rewind = held frame.
**Verdict answers:** "pink lean visible only after one timeout" → pre-pour + spout + squeezed purple box at t = 0;
"reaction silhouette needs a real face" → Nanda bust, blank eyes, same light; carry-forward 1.5x + room stats → done.
**Self-critique:** the pink lamp spill is subtle on a dim projector; the room tally counts this browser only.
