# date-lab R1 — Builder B log

Branch: `worktree-agent-ad24ddf80a310bd95` (reset onto the scaffold commit `85e8f7d`). Folder: `src/date-lab/b/**`.
Shots: `research/date-lab/shots/<id>-*.png` via `research/date-lab/shots-b.mjs` (preview on :5482).
Tests: `src/date-lab-b.test.js` (door state machine, cue table, timelines, shake cap).

## Shared layer (src/date-lab/b/shared)
- `door.js`: the DOOR choice as a pure state machine. 5 s, 500 ms hold before a click counts, timeout = pink, replay = picked option disabled + timer still running (timeout then takes whatever is left). Both menus use it.
- `cues.js` + `audio.js`: 35 synthesized Web Audio cues (oscillators + one seeded noise buffer, no files). Nothing sounds before a click on the stage; `M` or the pill top-right mutes (saved in localStorage); every cue fires a caption (`CC [her breath, close]`) even when muted or locked. Beds (rain, hum, drone, tape, cicada, room, parade) loop; `muffle` lowpasses the whole mix for STEEPED.
- `ui.jsx`: stage root, sound chrome + captions, `<Line>` (OR rule: her red, 1px offset, breath SFX once per line with an OR), `useClock` (`?t=<s>` seek, `?pause`), `Markup` for the ported sprite.
- `art.js`: main's SVG sprite ported to an ES module; role colours are B's night tokens in `b.css`.
- `timeline.js`: shots + keyframed camera; reduced motion = hard cut to each keyframe at its time; `lint()` enforces >= 500 ms shots and <= 12 words.

---

## menu-4 · Bandersnatch letterbox (horror 3)
**Theme:** "the timer is hers." Netflix interactive-film grammar (2.39:1 letterbox, the picture keeps playing under the choice, cinema subtitles instead of a VN box) turned into a trap.
**What it does:** her door in the rain, her silhouette (rim-lit by the door lamp) beside it. Two subtitles, then the bottom bar opens (2.39 -> ~2.9:1) and the choice rises. The timer does not shrink to the centre like Netflix: it drains leftward and pours into the pink option, which fills like a cup (the drain head is her NAND pin). Heartbeat on the last 3 seconds. Between the options: `OR` in her red with her breath. Timeout = pink fills, "You didn't say no.", lock clicks, slow push into the warm door gap, hard cut to the slippers insert. Purple = 334 ms purple bleed + low bell, the bars CLAMP to 2.76:1, her eyes open, hard cut-in to her face (reaction shot), then SHE rewinds the tape (VHS bands, `◀◀ REW`, whisper "again?") and the replay has purple struck through + LOCKED while the timer still runs. Keys 1/2, arrows + Enter, R. `?state=menu|replay|pink|purple` for shots.
**RM:** bars and camera hard-cut, the timer = 5 blocks dropping one a second (the pink block last), bleed = a static purple edge frame for 334 ms, rewind = one held frame.
**Self-critique:** the silhouette is a flat cut-out at 2.3x in the reaction cut-in; it needs a real face layer (Nanda bust, blank eyes) to land the horror.
**Round-2 carry-forward:** keep the "time pours into her option" meter and the bar clamp on purple; swap the reaction silhouette for the Nanda bust `face: 'blank'` in the same light; add the Bandersnatch "already seen" 1.5x replay speed and "the room chose pink N%" counter on the second replay.
