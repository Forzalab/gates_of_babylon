# Voice QA: showreel standard (2026-09-30)

These checks cover all 231 takes (78 Nanda + 153 narrator), not just whether each file exists. Scripts are in `scripts/narration/`.
Hard errors fail `npm test` (`src/date-beta-narration.test.js`).

| check | how | result |
|---|---|---|
| Loudness consistency | EBU R128 integrated LUFS per take (`qa.py`, ffmpeg ebur128), common target = the median | target **-24.1 LUFS**. 62 takes were more than ±1.5 dB off (Nanda whispers down to -7.5 dB, some shouts up to +5.6 dB). All were gain-normalised with a 0.95 limiter. **All 231 are now within ±1.5 dB** (hard) |
| Clipping | samples ≥ 0.999 | 0 (hard) |
| Clipped starts/ends | leading/trailing silence at -45 dBFS < 20 ms → add a 40 ms pad | the Nanda "quote" takes had 0 ms heads/tails. They are padded now, 0 left (hard) |
| Narrator timbre/speed | words/s over the speech span, Tukey band on the narrator set | median **2.75 w/s**, band 0.98–4.50, **0 outliers**. There is one voice, one model and one setting set for every take (`record.mjs` NARRATOR) |
| Timing vs hold vs reveal | `timeline.mjs` walks every beat, vary view and choice react of the live packs through the engine's own `beatTiming` | 450 beats, 226 voiced, **0 errors** (NEXT before the take ends, an auto cut, a reveal after the take, an sfx after the take, a take running past its beat). There are 0 timer warnings: every timed choice (≥ 12 s) outlasts its ask |
| Overlap | one `Audio` at a time; a new beat stops the old take; a lead → line queue only continues if it is still queued | enforced in `voice/index.js` and asserted per beat in the timeline (hard) |
| SFX ducking | the sfx bus (`assets.js duck`) drops to 0.45 while a take plays (30 ms attack, 120 ms release) | wired through `createVoice(…, onSpeak)` |
| Pronunciation | ASR round trip (ElevenLabs scribe → word error rate + missed risky words) is implemented in `qa.py --asr` | **blocked**: this key lacks the `speech_to_text` permission (401). Covered by the spot-listen list below instead |
| Route timeline | `qa/timeline.json` (beat → text → voice start/end → reveal → sfx → NEXT/auto → gap) plus one waveform PNG per scene in `qa/timeline/` (pink = Nanda, blue = narrator, dashed = reveal, ^ = sfx, v = NEXT) | 38 scenes. Total play is about 19 min, of which about 15.6 min is spoken, at click-on-NEXT pacing |

## Spot-listen for Tony (the riskiest takes)
1. `rooftop/248_6` "Itadakimasu." (a JP word read by a British narrator)
2. `rooftop/250_10` "Technically, rain wasn't f-OR-ecast." (the pun, and its reveal mark sits at "f-")
3. `v2-curry` "We go inside NAND HOUSE." (NAND read as a word, not spelled out?)
4. `v2-curry-katsu` "We go inside OR OR CURRY." (the pun)
5. `v2-rain/300_0` "BIG CROSSING · 5:30 PM." (a stamp read aloud)
6. `v2-park/251_0` "PARK · 1:00 PM." (a stamp)
7. `escape-timeout/375_3` umeboshi, `376_3` tamagoyaki (JP food words)
8. `v2-curry/277_8` naan / saag lines
9. `escape/363_3` "Bento boxes, one per day."
10. The 62 normalised Nanda takes, especially `01-rooftop/014_6-r` (a whisper lifted by 7.5 dB, so listen for noise)

If a word is wrong: re-take with a phonetic spelling in `spoken()` (`record.mjs`). The shown text and the lookup stay the same.
Then rerun `qa.py --fix`, `timing-table.mjs` and `timeline.mjs`.

Pipeline: `record.mjs` → `qa.py --fix` → `timing-table.mjs` → `timeline.mjs` → `timeline_png.py` → `npm test`.
