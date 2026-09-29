# date-lab R3 — Builder B log

Branch: `worktree-agent-a5699bfe445be9894` (reset to `claude/date-beta-alt-spec-review-4gdzab` @ cd249e5 first; the merge conflicted in `src/date-beta/scenes.json`, so per the brief it was a hard reset). Folder: `src/date-lab/b/**`.
Shots: `research/date-lab/shots/<id>-*.png` via `node research/date-lab/shots-b.mjs -r3-` (preview on :5482).
Tests: `src/date-lab-b-r3.test.js` (pure parts of every round-3 variant). Earlier rounds untouched.

## menu-h2-r3 · "Her Time, Her Cut", refined (horror 4)
**Fixes the R2 defects:**
- **Typing ≤ 2 glyph swaps/s** (R2 ran 125 ms/key = 8/s): her edit is now whole-word swaps on held states,
  `0-3000 clean → 3000 glitch → 3500 select → 4000 "Stay." lands as one word`. Every state holds ≥ 500 ms. Node test samples the
  label on the 8 fps grid and asserts max 2 changes in any 1 s window (and asserts the r2 edit really broke it).
- **Purple = the same fat slab as pink**: both are 124 px solid slabs, white 50 px text with a dark text shadow, no outline
  box. Pink = #FF5FA2 pour rising in a deep-pink slab (pre-poured 30 %), purple = solid #8A5CF6. Only colour and squeeze
  differ (pink 690 → 780 px, purple 630 → 540 px as the time pours).
- **Edit line 34 px** (was 22), her red, under the purple slab: `✎ NANDA is editing…` → `✎ NANDA edited: ~~Goodnight.~~ → Stay.`
- **Room tally** in the top bar: `THE ROOM CHOSE PINK n OF N` (endings on this machine, localStorage, try/catch), from the second play on.
Everything else as r2 (caret + NANDA flag from frame 1, leave only before the edit, her grease-pencil cut, take two with CUT).
**RM:** one hard cut at 3 s to the finished edit (1 swap), timer = 5 blocks, bleed = edge frame, cut = held frame.
**Self-critique:** the pre-pour line cuts through the pink label for the first 2 s (reads as liquid, but it is a hard edge under text).

## menu-h3-r3 · "Her Hold" (NEW hybrid: menu-h2 letterbox/pour x menu-1-r2 hand-on-card x menu-3-r2 lens gaze; horror 4)
**Theme:** she does not edit anything; she just holds your answer down and then looks at who is holding the mouse.
**What it does:** the letterbox door shot (real lit bust), the two equal slabs, the pre-poured pink slab and the NAND-gate
nozzle pouring the timer into it. From the first menu frame her **hand** reaches in over the right edge of the frame (pose 1,
held 500 ms) and rests two red-nailed fingertips on the top edge of the purple box (pose 2): the box sits 6 px lower, hover
lifts pink 22 px but purple only 6 (her fingers). Caption `[two nails tap the box]`. Her pin goes red in the last 2 s.
- **Timeout** → hard cut to her ECU (A's menu-3-r2 eye layer, copied + given a look vector): pupils down-right on the purple box
  she is holding, "You didn't say no." — one held cut at 1.5 s — pupils dead into the lens, "Not him. You." and, in her red
  under the options, **"The one clicking."** The options stay full-size and readable under the ECU the whole time (the menu-3-r2
  occlusion defect does not exist here). Then the door opens, slippers insert.
- **Purple click** (always reachable, 500 ms hold): she lets go (hand lifts), 334 ms bleed, ECU on the box "Right. Goodnight.
  That's… fine." → lens "Text me when you're home." / "I'll know if you don't." → replay.
- **Replay:** her 5x hair-pin (A's `BigPin`, imported read-only) driven through the picked box, label struck in her red,
  "you already tried that", room tally in the top bar, timer live. After a pink round the pink box is pinned and her hand is
  still on purple: the timeout still never picks leave (tested).
- Zero glyph swaps anywhere.
**RM:** the hand is at rest from frame 0, timer = 5 blocks, no spout drops, bleed = edge frame; the ECU is already two hard cuts.
**Borrowed (credited in files):** A's menu-1-r2 `HoldingHand` drawing (mirrored), A's menu-3-r2 `EyesEcu` (look vector added), A's `BigPin`.
**Self-critique:** the fingertips sit over the last letters of "Goodnight." for a second when the box is squeezed most; the ECU
look change is a pupil shift of ~55 px, readable but not huge on a projector.
