# SFX inventory (sprint 0930)

How sfx play: beats carry `"sfx": "<cue>"` (scenes.json + packs/*.json). `src/date-beta/assets.json` maps cue -> SX id -> file;
`createLoader` (src/date-beta/assets.js) preloads, decodes on first gesture, plays. Missing file -> WebAudio stand-in (synth.js) -> beep.
Before this sprint every referenced mp3 in `public/date-beta/assets/` was MISSING (all sfx ran on the synth.js stand-ins).
Now: all files are `public/date-beta/sfx/<cue>.wav`, made by `synth.py` (no ffmpeg in the container, so WAV mono 16-bit 44.1 kHz).

| cue | id | used in (beat count) | before | now | character |
|---|---|---|---|---|---|
| tick | SX-45 | scenes/packs (30) | MISSING | tick.wav | soft clock tick |
| thump | SX-04 | scenes/packs (41) | MISSING | thump.wav | heartbeat lub-dub |
| bell | SX-23 | scenes/packs (24) | MISSING | bell.wav | shop door bell, two strikes down a third |
| breath | SX-28 | scenes/packs (23) | MISSING | breath.wav | in / out breath |
| wind | SX-15 | scenes/packs (22) | MISSING | wind.wav | airy noise bed (loop) |
| kettle | SX-37 | scenes/packs (19) | MISSING | kettle.wav | rising hiss to whistle |
| rain | SX-20 | scenes/packs (16), fx/rain.js | MISSING | rain.wav | rain bed + drops (loop) |
| drone | SX-27 | scenes/packs (10) | MISSING | drone.wav | detuned low drone (loop) |
| train-hum | SX-21 | scenes/packs (9) | MISSING | train-hum.wav | motor hum + rail clacks (loop) |
| static | SX-06 | scenes/packs (8) | MISSING | static.wav | crackle/hiss bed (loop) |
| silence | null | scenes/packs (29) | n/a | n/a | no sound |
| collapse-tilt/slip/fall/glitch | SX-C1..C4 | src/collapse.js | path null | collapse-*.wav | card crack / clack+scrape / clatter / bit-crush |

Not yet referenced by any beat or code (files made + manifest slots added, not wired to events):
crunch, heart-pop, love-up, love-down (love +/- chime), gacha-crit, love-bomb, anger-pop, rage-thunder, hate-quake,
lock-click, lock-win, lock-fail, vending-clunk, ic-beep, umbrella-rain (loop).

Mix: beds (rain, wind, train-hum, drone, static, umbrella-rain) ~-16 LUFS (RMS approx), 0.5 s crossfaded loop; one-shots peak -1 dBFS.
Beds route through a gain ducked -8 dB while a voice line plays; the voice mute toggle (M) also mutes sfx.
