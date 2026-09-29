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

## cam-h-r2-b · "The Frame Keeps Finding Her" (cam-3 Kon x cam-5 found footage, horror 5)
**Theme:** you are the one filming, so every Kon reveal is the camcorder's doing: the AF box finds a face, then the D.ZOOM
moves by itself. The OSD frames all of it: REC (1 Hz), tape counter and date stamp FROZEN at 12:00:00 AM, scanlines,
tracking band, NIGHT SHOT.
**What it does (37.8 s seamless loop):**
1. *train* — NIGHT SHOT, frame rolled 86 deg, tight on a face with IR eyeshine, red box `FACE 12`, `FACES: 12`
   (this is the loop seam). The camera is lifted upright while it zooms out; NIGHT SHOT clicks off: a sunny carriage,
   the face was a reflection in the window. Box relabels `FACE 1`. "Someone in the window. Nobody in the seat."
2. *platform* — her under the umbrella, `FACE 1`. At 3.4 s the OSD reads `D.ZOOM 4.8x` although the frame looks 1:1 (the tell).
3. *underpass* — the zoom pulls back by itself: the platform was a lit poster in the underpass
   ("Figur · AND Line · last train 12:00"), a seamless nested pull-back (pixel-exact, tested). "That one's a poster."
   She is at the tunnel mouth now, `FACE 2`; the camera pans and D.ZOOMs into her face. "This one's me."
4. *apartment* — **Kon match cut**: same face, same box, same size, same D.ZOOM number, but now NIGHT SHOT green and she is
   the silhouette in the one lit window; zoom out to the building.
5. *stairs* — footfall bob (1.7 Hz), tracking dropout (one held frame), she is at the door: red `FACE 3`.
6. *fall* — the camera drops, lies rolled on the genkan floor and counts `FACE 1..11` on an empty floor, one per 400 ms;
   something nudges it toward the door: `FACE 12` is her. "Twelve. Keep filming." The zoom pushes into her face until it is
   the train-window face at the same size and roll -> loop, no visible cut.
**Seams (node-tested):** genkan face -> train face (same screen spot, size, roll, no handheld either side, counter 12 carries
over); tunnel face -> window face; platform -> poster (5 sample pixels land on the same screen px). Handheld = round-1
`HANDHELD` sines, all <= 3 Hz. Digital-zoom softness is capped at 3 px on screen.
**RM:** no handheld/bob/band roll; each shot hard-cuts between held key poses, landing on the same seam framings (tested).
**Borrowed:** the Kon language + log-space `zoomAbout` (copied, credited) from A's cam-3; the OSD, AF-box grammar and face
count from my cam-5; the reflection-in-the-train-window and the platform-as-poster from the verdict spec.
**Verdict answers:** cam-5 "no real face at the end" -> the end is her face at full frame with IR eyeshine, and it IS the
opening shot; cam-3 "umeboshi->iris not scale-perfect" -> every match here is the same shape at the exact same scale.
**Self-critique (cam):** her body is still the flat silhouette (not the bust) — right for night shot, but the daylight
reflection could use a real face; 37.8 s sits near the top of the 20-40 s window.

## anim-3-r2 · Junji Ito creep, CROWD MODE (horror 5) — the verdict's BLOCKING item
**Theme:** "it only moves when you are not looking", now for a room: when nobody touches the mouse, the ROOM is the eye.
**What it does:** round-1 anim-3's eight scenes and four creep stages (imported, unchanged), plus `anim3r2/room.js`:
- **ROOM mode** (default; no pointer movement for 6 s, or never): a big pill at the top shows the room's eye (an Ito eye,
  spiral iris, her red pupil) and its attention draining in 4 held poses of 1.5 s — "THE ROOM IS WATCHING" -> "the room is
  getting tired" -> "the room glances away" -> "the room is not looking" (4 dots count down). At 6 s the whole screen
  blinks (lids) and the scene takes one step behind the blink, `[the room blinks] [something shifted]`. Fully crept scenes
  hold 6 s and the tour moves to the next scene by itself -> the piece runs hands-off on a projector (verified live: stage
  1 at 6.8 s, stage 3 at 19 s, no mouse).
- **HAND mode** (someone moves the mouse): round-1 rule, gaze ring, 2.5 s off the anchor = a step; the pill reads
  "YOU ARE WATCHING" (pink) / "you looked away". Idle 6 s -> back to ROOM mode.
- Space / click = the presenter's blink (a step, the room's meter resets). ←/→ scenes, R resets a scene.
- **Round-1 self-critique answered ("overlays stacked on main's art, not Ito linework"):** from stage 2 the scene greys; from
  stage 3 the scene ITSELF is re-inked by an SVG filter: 8-bin luminance -> ink black / hatched grey / paper, an edge pass
  draws Ito's pen line, hatching fills the night tones; her red and pink (OR on the platform sign, her pins, the red
  pupils) are masked back in so every OR stays her red.
**RM:** blink = 400 ms black cut; the room's eye poses are already stepped; the ink is a hard cut at the stage change.
**Verdict answers:** "needs a room-looks-away 6 s idle timer so it works for a projector audience" -> ROOM mode is the
default and the idle timer is exactly 6 s (node-tested: 3 steps in 18 s hands-off, 4 eye poses, tour after a 6 s hold).
**Self-critique:** the ink filter flattens the day scenes (train, rooftop) to mostly paper; the room's eye is UI chrome,
not in-world.
