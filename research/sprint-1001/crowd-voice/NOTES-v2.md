# Crowd chant v2 (engineer-style layered unison)

## Brainstorm
1. Doubling like a vocal producer: 5-6 takes of the same line, each a slightly different "person", instead of 12 near-identical smears (v1 got muddy).
2. Pitch spread -3..+3 st with one voice at exactly 0 as the lead; add small detune (+-0.1 st) so no two voices share a pitch (no static comb).
3. Formant shift independent of pitch (bigger/smaller bodies). ffmpeg rubberband only has preserved/shifted, so: asetrate by F st (moves pitch+formant+speed), then rubberband tempo=1/F-ratio, pitch=(P-F) st, formant=preserved. Gives arbitrary P and F.
4. Timing offsets 15-40 ms per voice, plus +-1% tempo drift: human-like unison spread, no flanging.
5. Per-voice gain -3 (lead) to -9 dB: lead stays intelligible, others add body.
6. Pan spread then fold to mono: a pan fold is just a gain change on the sum (no phase effect), so panning is skipped; width cues come from offset/EQ/formant. Phasing avoided because pitch, offset and tempo are unique per voice (no time-aligned copies).
7. Light chorus (short modulated delay) on 2 voices for extra detune smear.
8. EQ: HPF 90 Hz, -3 dB at 320 Hz (mud), +2 dB at 3.5 kHz (presence), LPF 6.5 kHz on the quieter voices.
9. Short room: 23/41/67 ms low-passed taps, no long tail (keeps the chant tight, avoids the "speech touches end" QA error).
10. Loudness: gain to v1 LUFS, then limiter at v1 true peak, iterated through the mp3 encode. Same length as v1 (v1 = orig + 157 ms, already QA-safe).
11. Rejected: v1's octave-down mass layers and breath noise (muddy / not "voices"); heavy reverb.

Picked: 1-5, 7-10, and 6 as a mono fold without panning.

## Voices (P pitch st incl. detune, F formant st, d offset ms, g dB)
Beat 2 (5 voices): lead P0 F0 d0 g-3 | P+2.1 F+1.5 d18 g-5 | P-2.1 F-2 d27 g-6 | P+3 F0 d35 g-8 | P-3 F+1 d23 g-9
Beat 3 (6 voices): the five above plus P+1.1 F-2 d40 g-7 (small tempo drift and delay jitter seeded per file)
