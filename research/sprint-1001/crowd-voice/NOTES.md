# Crowd chant voice (leave-fu / leave-yeah, beats 2-3)

## Takes (speaker CROWD, "fORever and ever" / "... and ever and ever")
All mono, 44.1 kHz, mp3 128k, under `public/date-beta/voice/narration/`. 4 distinct files (no sharing).

| beat | file | visual |
|---|---|---|
| leave-fu 2 | leave-fu/380_2.mp3 | 50 figures |
| leave-fu 3 | leave-fu/381_3.mp3 | 71 figures |
| leave-yeah 2 | leave-yeah/383_2.mp3 | 50 |
| leave-yeah 3 | leave-yeah/384_3.mp3 | 71 |

Originals: `orig/*.mp3.orig` (outside the served folder). `mix.py --restore` puts them back.

## Brainstorm
1. Copies with small pitch offsets (+-1-4 st) and formant mode alternating preserved/shifted, so each reads as another body.
2. Per-copy delay 10-75 ms and +-3.5% time-stretch: the chant smears like real unison instead of a phasey comb.
3. Near/mid/far depth: far copies low-passed (2.2-3.4 kHz), quieter, own echo; matches the near bokeh / far silhouettes.
4. Octave-down "mass" layer(s), dark and low-passed, for the weight of a big body of people.
5. Dark room send (low-passed multi-tap echo) plus a slow brown-noise breath pad with 0.45 Hz swell.
6. Pan spread: rejected, files must stay mono (same format as the wiring expects). Width is implied by delay/EQ/depth instead.

Chosen: 1+2+3+4+5 together (they stack, none replaces another), tanh soft saturation on the crowd bus. Beat 3 is denser: 11+2 layers vs 7+1, wider delay spread, louder low layer and room, mirroring 50 -> 71.

## Chain (exact, see mix.py; seeded per file so it is deterministic)
- L0 dry original, HPF 90, gain 1.0: loudest centre layer, keeps words intelligible.
- Beat 2: 6 pitched copies (3 near/mid, 3 far) + 1 octave-down. Beat 3: 10 pitched (5 near/mid, 5 far) + 2 low (pitch 0.5, 0.49).
- Pitched copy: rubberband pitch = 2^(st/12) with st drawn from [-4..+4], tempo 1+-3.5%, adelay 10..55 ms (beat 2) / 10..75 ms (beat 3). Near: HPF 100, LPF 5.2-7.5 kHz, vol 0.38-0.58. Far: delay +25 ms, LPF 2.2-3.4 kHz, HPF 140, aecho (0.7/0.5, 70-110|150-230 ms), vol 0.22-0.32.
- Low layer: LPF 1.5 kHz, vol 0.35 (beat 2) / 0.45 (beat 3).
- Bus: amix (no normalize) -> asoftclip tanh 1.4. Room send: LPF 2.4 kHz, aecho taps 47/83/131/197/283 ms, vol 0.30 / 0.38. Breath: brown noise LPF 500 HPF 70, tremolo 0.45 Hz depth 0.7, vol 0.18.
- Trim to original length + 120 ms, 140 ms fade out, alimiter 0.8, then gain-match to original LUFS (iterated through the mp3 encode) and alimiter 0.84 (-1.5 dBFS). Encode mono mp3 128k.

## Before / after
TAIL = 0.12 s of extra length: the first render (same length) tripped the repo QA hard error "speech touches the end" (smeared copies + room tail reach the file end), so the render is 120 ms longer and fades out over the last 140 ms.

| file | LUFS before | after | true peak before | after (dBTP) | dur before | after | audioMs old -> new |
|---|---|---|---|---|---|---|---|
| leave-fu/380_2 | -26.1 | -26.1 | -9.9 | -9.8 | 2.351 s | 2.508 s | 2377 -> 2534 |
| leave-fu/381_3 | -26.1 | -26.1 | -6.2 | -9.1 | 3.239 s | 3.396 s | 3265 -> 3422 |
| leave-yeah/383_2 | -25.3 | -25.3 | -10.9 | -9.8 | 2.273 s | 2.429 s | 2299 -> 2456 |
| leave-yeah/384_3 | -26.4 | -26.4 | -8.1 | -10.0 | 3.239 s | 3.396 s | 3265 -> 3422 |

Timing table regenerated the repo way (`node scripts/narration/timing-table.mjs`): only these 4 rows changed (+157 ms audioMs/holdMs). Spectrograms in `spectro/` (`spectro.py`): harmonic lines smear into a dense band, extra low-end mass, word onsets unchanged. Clips sit at about -26 LUFS like all narration here; original LUFS matched rather than normalised up.

QA: scripts/narration/qa.py hard 0; voice-gaps 0 silent; npm test 438/438; vite build ok.
