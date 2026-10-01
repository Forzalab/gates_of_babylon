# SFX wiring (M5): sound -> beat / event -> file

All files are `public/date-beta/sfx/<name>.wav` (made by `research/sprint-0930/sfx/synth.py`). Ids resolve through `src/date-beta/assets.json`.
Tests: `src/date-beta-sfx-wire.test.js` (every referenced id has a file; every sound below is referenced; beds stop on a scene change).

## Mechanisms
- **Pick events** (`popCues` in `assets.js`, fired from `main.jsx` when a pop shows): chimes, gacha, anger / rage / hate, heart pop.
- **`props.sfx`** (new, in packs): extra cue(s) laid over the beat's own `sfx` on the same cut. A name, a list, or `{ "cue", "at": ms }`.
  Not played on reaction frames. A one-shot equal to the previous beat's is inherited (props carry in a scene), so it does not repeat.
  A bed in `props.sfx` replaces the beat's own bed. `props.sfx: null` ends a carried value.
- **Game events** (`fx/lockSfx.js`, DOM-driven so `game/LockGame.jsx` is untouched).
- **Beds** (`assets.js` loader): see the bottom.

## Table

| sound | beat / event | file |
|---|---|---|
| love-up (love chime +) | a scored pick with love > 0 (no gacha tier), when the pop shows; heart-pop follows at +334 ms | `love-up.wav` |
| love-down (love chime -) | a scored pick with love < 0 (no gacha tier, no hate) | `love-down.wav` |
| heart-pop | every love > 0 pop (plain, crit, love-bomb), +334 ms, on the HUD's first step | `heart-pop.wav` |
| gacha-crit | gacha tier `crit5` / `crit10` (fx `love-crit`), replaces love-up | `gacha-crit.wav` |
| love-bomb | gacha pity tier (fx `love-bomb`, +15), replaces love-up | `love-bomb.wav` |
| anger-pop | gacha tier `anger` (-2), replaces love-down | `anger-pop.wav` |
| rage-thunder | gacha tier `rage` (-5), replaces love-down | `rage-thunder.wav` |
| hate-quake | a pick with `fx: hate-quake` (or emote `hate`), e.g. the shop game's "Two or more wrong"; replaces love-down | `hate-quake.wav` |
| lock-click | a tile tapped in the lock game (escape beat 15, `bg: lock-game`) | `lock-click.wav` |
| lock-fail | a mismatched pair turns red; the lock timer reaches 0s | `lock-fail.wav` |
| lock-win | all pairs matched, "THE DOOR IS OPEN" | `lock-win.wav` |
| vending-clunk | v2-train beat 2 (`vending-insert`, she buys the plum drink), at +900 ms (`packs/r3-station.json` props.sfx) | `vending-clunk.wav` |
| ic-beep | v2-train beat 5 (`station-ads-insert`, "She taps her card. Beep. Then again"), twice: 0 and +700 ms (`packs/r3-station.json`); seq-station beat 1 (`ic-card-tap`), same two taps (`packs/sequences.json`) | `ic-beep.wav` |
| crunch | v2-curry-katsu beat 4 "...with her spoon. Crunch." (`packs/curry.json`); seq-katsu beat 2 "The knife goes in. Crunch." (`packs/sequences.json`) | `crunch.wav` |
| umbrella-rain (bed) | v2-rain beats 1, 2, 4 (the red umbrella; replaces the plain `rain` bed on 2) (`packs/r3-rain.json`); rain-crossing beat 2 `umbrella-shoulder` (`packs/sequences.json`). Beat 3 (eave) has `props.sfx: null` and its own `silence`. | `umbrella-rain.wav` |

## Beds (rain, wind, train-hum, drone, static, umbrella-rain)
- A bed cue starts a looping source (the files carry a 0.5 s crossfaded loop point). The same bed asked again is a no-op: no doubling.
- A different bed crossfades over 0.5 s (new one starts first, old one fades out): no gap, never two beds after the fade.
- The scene changing stops the bed (0.5 s fade); the new scene's first beat starts its own. The end card / a finished run stops it too.
- A `silence` cue fades the bed out (1 s). A bed asked for before the first gesture starts once on unlock, or when its file finishes decoding.
- If a bed's file fails to load, it plays the synth.js stand-in once (old behaviour) and does not loop.
- The sfx bus is unchanged: M mutes, a voice take ducks it -8 dB.

## Left unwired
Nothing from the requested list. The shop game's own events (item picks) have no sound, as before.
