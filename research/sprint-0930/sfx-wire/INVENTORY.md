# SFX wiring inventory (sprint 0930, task M5)

Where sounds live:
- `src/date-beta/assets.json`: every sfx id (`assets.<id>`, kind `sfx`) + the cue-name map (`cues`). Files: `public/date-beta/sfx/*.wav`
  (made by `research/sprint-0930/sfx/synth.py`). Beds are the files that script crossfade-loops; they carry `"loop": true` in the manifest.
- `src/date-beta/synth.js`: WebAudio stand-ins, used only when a file fails to load (SX-* ids only).
- `src/date-beta/assets.js`: the loader (one-shots, beds, mute, voice duck).
- `src/date-beta/fx/sound.js` (new): the pure sound director. Per beat it turns the beat cue, `props.sfx` and the
  pick events (love pop, gacha tier, pick FX) into { bed, one-shots }. The lock game emits through its tiny bus.
- Voice lines (`src/date-beta/voice/`) are not sfx; they duck the sfx bus by -8 dB while a take plays.
- Hooks outside the sound files (audio lines only): `main.jsx` (the per-frame sfx effect goes through the director; the
  audio dispatch lives there, not in engine.js), `game/LockGame.jsx` (3 `emitSfx` calls), `engine.js` `carried()` (props.sfx
  is beat-local). Levels: every bed and loud one-shot has a manifest `gain` trim, measured against the voice in QA.md.

Counts = beats in the normal play order (18 packs over scenes.json) that name the cue in `beat.sfx`.

| sound id | cue | kind | used before M5? | fires now (M5) |
|---|---|---|---|---|
| SX-45 | tick | one-shot | yes, beat.sfx (23) | unchanged |
| SX-04 | thump | one-shot | yes, beat.sfx (27) | unchanged |
| SX-23 | bell | one-shot | yes, beat.sfx (18) | unchanged wiring; level trim 0.6 (it rode over her lines, QA.md) |
| SX-28 | breath | one-shot | yes, beat.sfx (20) | unchanged wiring; level trim 0.7 |
| SX-37 | kettle | one-shot (rising, not a loop) | yes, beat.sfx (11) | unchanged wiring; level trim 0.5 |
| SX-06 | static | one-shot sting | yes, beat.sfx (7: end cards, blackout, the café cut) | unchanged (kept a sting: a looping hiss under the end card / café would bury her lines) |
| SX-15 | wind | BED | yes, beat.sfx (10), played once (7.5 s) | loops from its beat until the scene changes (or `silence` / another bed) |
| SX-20 | rain | BED | yes, beat.sfx (11), played once | loops, as wind |
| SX-21 | train-hum | BED | yes, beat.sfx (5), played once | loops, as wind |
| SX-27 | drone | BED | yes, beat.sfx (9), played once | loops, as wind |
| umbrella-rain | umbrella-rain | BED | NO | event: any beat with `props.underUmbrella` and live rain (heavy/medium/drizzle) = v2-rain 2-3; props.sfx: rain-crossing umbrella-shoulder close-up |
| SX-C1..SX-C4 | collapse-tilt/slip/fall/glitch | one-shot | yes, src/collapse.js (Logic-side Figur collapse) | unchanged |
| love-up | love-up | one-shot | NO | event: the love pop shows (reaction frame or pending pop) with love > 0 and no gacha tier |
| love-down | love-down | one-shot | NO | event: the love pop shows with love < 0 and no gacha tier |
| gacha-crit | gacha-crit | one-shot | NO | event: gacha tier fx `love-crit` (crit5 / crit10) |
| love-bomb | love-bomb | one-shot | NO | event: gacha tier fx `love-bomb` (the pity tier) |
| anger-pop | anger-pop | one-shot | NO | event: gacha tier fx `anger` (the anger vein / puff FX) |
| rage-thunder | rage-thunder | one-shot | NO | event: gacha tier fx `rage` |
| heart-pop | heart-pop | one-shot | NO | event: pick FX `love-burst` (the falling hearts, Fx.jsx) |
| hate-quake | hate-quake | one-shot | NO | event: pick FX `hate-quake` (the stage shake, Fx.jsx) |
| lock-click | lock-click | one-shot | NO | event: lock game, a matched pair (a tumbler turns) |
| lock-win | lock-win | one-shot | NO | event: lock game, all pairs open |
| lock-fail | lock-fail | one-shot | NO | event: lock game, the timer runs out |
| vending-clunk | vending-clunk | one-shot | NO | props.sfx: v2-train 2 (vending-insert: she buys the plum drink) |
| ic-beep | ic-beep | one-shot | NO | props.sfx: v2-train 5 (station-ads-insert) + seq-station 1 (ic-card-tap): two taps, two beeps ("Then she taps it again. For you.") |
| crunch | crunch | one-shot | NO | props.sfx: v2-curry-katsu 4 (the cut, "Crunch.") + 8 (she bites the katsu), seq-katsu 2 ("The knife goes in. Crunch.") + 4 (nanda-eat-katsu) |

Not sfx ids but cue names: `silence` (null, 18 beats) now also ends the running bed; `collapse-void` (null) is the collapse's silent frame.

Allowlist (sounds with no in-game hook, with the reason): none. Every sfx id above is wired
(the test `src/date-beta-sfx-wire.test.js` enforces this; its allowlist is empty).

Event priority: a gacha tier replaces both the plain love chime and the pick FX sound (the engine already swaps the pick
FX for the gacha FX), so one pick = at most two sounds (chime + heart-pop, or chime + quake).
