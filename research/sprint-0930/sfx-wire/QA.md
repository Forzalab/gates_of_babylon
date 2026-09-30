# SFX wiring: audio QA (2026-09-30, task M5)

Three passes: the existing showreel voice QA (`scripts/narration/qa.py`), a loudness pass on every sfx at its in-game
level (`levels.py` -> `levels.json`, which `npm test` checks), and a run of the real page in headless Chromium with the
real WebAudio graph (`qa-browser.mjs`).

## 1. Showreel voice QA (existing script)
`python3 scripts/narration/qa.py` (no `--fix`, no `--asr`). All 231 takes: **target -24.1 LUFS, hard errors 0, fixed 0**,
narrator median 2.76 w/s (band 0.99..4.51). `qa/qa.json` came out unchanged. The voice is still the reference for the
levels below.

## 2. SFX levels vs the voice (`python3 research/sprint-0930/sfx-wire/levels.py`)
EBU R128 via ffmpeg, taken after the manifest `gain` trim. The voice reference is a sample of 67 shipped takes:
median I **-24.0 LUFS**, median momentary max **-19.5**. While a take plays the sfx bus is ducked by -8 dB.

| group | level (LUFS) | rule (enforced in `src/date-beta-sfx-wire.test.js`) |
|---|---|---|
| beds: rain, wind, train-hum, drone, umbrella-rain | I -29.6..-30.2, ducked -37.6..-38.2 | ≤ voice -5 dB, and ≤ voice -12 dB when ducked |
| event one-shots: love-up/down, gacha-crit, love-bomb, anger-pop, heart-pop, hate-quake, lock-win/fail, ic-beep | M max -15.7..-17.9 | M ≤ -15, and ducked ≥ 3 dB under the voice's momentary max |
| quiet one-shots: crunch, vending-clunk, rage-thunder, lock-click, tick | M -19.4..-27 | as above |
| existing beat cues: kettle, bell, breath (trimmed in this pass), thump | M -15.1..-15.9 | as above. Kettle, bell and breath used to peak at M -9.8..-12.8, which is -17.8..-20.8 when ducked, as loud as her line or louder, so they now get a trim |

Trims set in `assets.json` (`gain`): rain 0.26, wind 0.2, train-hum 0.32, drone 0.2, umbrella-rain 0.4, love-up/down 0.5,
gacha-crit 0.6, love-bomb 0.5, anger-pop 0.8, hate-quake 0.7, lock-win 0.7, lock-fail 0.2, ic-beep 0.3, kettle 0.5,
bell 0.6, breath 0.7. The Logic-side collapse cues (SX-C*) are left as they were, since no voice plays there.

Loop seams (beds): `synth.py` builds each bed so that the wrap is sample-contiguous (the tail crossfades into the head).
Measured jump across the wrap: rain 0.024, wind 0.048, train-hum 0.003, drone 0.002. Each is well inside that file's own
99th-percentile sample step. umbrella-rain is 0.042 against 0.037, with a +4 dB RMS lift in the last 50 ms: a canopy thud
sits at the seam. It is contiguous and has no click, but it does hit once per 7.5 s loop. Spot-listen item 3 below covers it.

## 3. The real page (`node research/sprint-0930/sfx-wire/qa-browser.mjs`): 25/25 ok
Vite dev server + headless Chromium 141 (`--autoplay-policy=no-user-gesture-required`). The hook logs every
AudioBufferSourceNode that starts (named by the file its buffer was decoded from) and every bus gain value. It waits
until all 29 sfx files are decoded, so no cue falls back to its stand-in.

- rooftop: the **wind bed started once** across beats 0, 1 and 7, which all ask for it. It loops (`loop = true`), and one bed is live.
- rooftop -> v2-park (both open on wind): the bed **runs on across the cut**, with no stop and no second copy.
- A walk through 26 scene changes (two full loops of the v2 route): **never more than one live bed**, **no bed restarted
  while it was still running**, and **every bed change faded the old one out in ≤ 300 ms** (10 stops, longest fade 0.270 s).
- Mute (M): the bus goes to 0, and unmute brings it back (ducked value 0.398 while a take is up).
- v2-rain: a forced crit pick plays **gacha-crit**, with no plain chime or heart pop. Beat 2 under the umbrella: **umbrella-rain
  replaces rain**. Beat 3 (`silence` cue, still under it): the canopy runs on and is not restarted. Beat 4 (rain stopping,
  wind cue): **wind replaces the canopy**.
- Rooftop bento picks: forced rage -> **rage-thunder**, anger -> **anger-pop**, pity -> **love-bomb**. A plain ♥ pick -> **love-up**,
  and the tamagoyaki pick (love-burst) -> **love-up + heart-pop**. The 💔 picks at seed 3 rolled the anger tier (anger-pop),
  and the unit tests cover the plain love-down + hate-quake path.
- v2-train 2 -> **vending-clunk**. v2-train 5 -> **ic-beep x2** (0 / +700 ms). v2-curry-katsu 4 and 8 -> **crunch**.
- Lock game (escape 15): 8 pairs matched -> **7 lock-click + 1 lock-win**, and the rain bed runs on under it. Left alone
  for 40 s -> **lock-fail**.

The run was repeated on the final head, rebased onto the M2 leave fixes and with the final trims: 25/25 ok again.

## Spot-listen for Tony (a headless run can't judge these by ear)
1. rooftop: wind under her first lines at -30 LUFS. Can you still hear it on the ceiling speakers?
2. A ♥ pick: the chime plus the heart pop 120 ms later. Do they read as two sounds, or as clutter?
3. v2-rain 2-3: the canopy thud once per loop (see the seams above).
4. Lock game: lock-click is quiet (M -27) because it is a 60 ms tick. Raise it if the tumblers feel dead.

## Known limits
- hate-quake and rage-thunder are mostly sub-300 Hz rumble. They are logged as playing, but ceiling speakers will render
  little of them. That comes from the file design in `research/sprint-0930/sfx/synth.py`, not from this wiring.
- If a bed's file has not arrived when its scene starts, the synth.js stand-in loops until the file lands, then swaps
  (only SX ids have stand-ins; umbrella-rain beeps once).
