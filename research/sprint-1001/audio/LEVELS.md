# Voice vs bed levels (sprint-1001)

Problem: takes measure about -24 LUFS (scripts/narration/qa.py), beds -16..-20 LUFS, and beds ducked only -8 dB under a take, so the voice sounded too small.

Change:
- Voice takes route through WebAudio: MediaElementSource -> GainNode (2.0, +6 dB) -> DynamicsCompressor (threshold -14 dB, knee 6, ratio 8, attack 3 ms, release 150 ms) -> destination. See src/date-beta/voice/index.js. If WebAudio or the source node fails, the plain element plays at volume 1. Mute still stops the take, so nothing plays.
- SFX/beds duck to 0.2 (-14 dB, was 0.398 / -8 dB) under a take (src/date-beta/assets.js DUCK).
- Net: a voice take sits about +12 dB clearer over the beds than before. The files and qa.py/levels measurements are unchanged (the gain is applied at playback only).
