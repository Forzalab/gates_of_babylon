# BGM (2026-10-01)

Sources: Tony's 2 Suno songs (`src-bgm_1.mp3` sweet, `src-bgm_2.mp3`). Rebuild: `python3 research/sprint-1001/bgm/process.py` (ffmpeg + rubberband, numpy).

| out | from | I (LUFS) | peak | length |
|---|---|---|---|---|
| `public/date-beta/music/bgm-sweet.mp3` | bgm_1 | -30.1 | -11.2 dBFS | 159.9 s |
| `public/date-beta/music/bgm-dark.mp3` | bgm_2 + horror pass | -30.7 | -14.7 dBFS | 146.5 s |

Both: mono 44.1 kHz, HPF 60 Hz, last 3 s crossfaded into the first 3 s (seamless `loop`), -30 LUFS, 96 kbps.

## Horror pass (bgm_2): sweet on the surface, wrong underneath
1. Varispeed -1.5 st (pitch + tempo): drugged, slowed tape.
2. Wow 0.25 Hz + flutter 4 Hz: detune that never settles.
3. Ghost double -40 cents, +25 ms, -9 dB: beats against the dry signal.
4. Sub octave-down, LPF 180 Hz, -14 dB: dread you feel, not hear.
5. Dry LPF 3.2 kHz + tanh soft clip: music from another room.
6. 6-bit crush layer, -18 dB: worn, decayed.
7. Multi-tap room 0.4 / 0.75 / 1.2 s: long, distant space.
8. Tremolo 0.1 Hz, 15%: the bed breathes.
Not used: dropouts or reverses (they break the loop and pull focus).

## Wiring
- `assets.json` `music`: default `bgm-sweet`; `bgm-dark` on cup, steeped, unknown, escape*, leave* (`darkScenes`).
- `assets.js` music channel: a streamed `<audio>` per track -> gain -> sfx master (mute and the voice duck apply). The same track across scenes = no restart; a change = 2.5 s crossfade.
- Volume knob: `MUSIC_GAIN` = 0.35 (about -39 LUFS in game, voice about -26).
