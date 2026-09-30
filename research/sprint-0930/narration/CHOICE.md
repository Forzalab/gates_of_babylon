# Narrator: model + voice choice (2026-09-30)

Picked: **Daniel – Steady Broadcaster** (`onwK4e9ZLuTAKqWW03F9`, premade, British, formal) on **`eleven_multilingual_v2`**,
voice_settings `{ stability: 0.6, similarity_boost: 0.8, style: 0, speed: 1.08 }`, output `mp3_44100_128`, via
`/v1/text-to-speech/{id}/with-timestamps` (character alignment kept per line for the timing plan).

## Test
Same 3 lines for every candidate (`test/<voice>_<model>_<n>.mp3`, numbers in `test/results.json`,
script `scripts/narration/compare.mjs`):
1. `Close-up. The lid lifts. One red umeboshi on white rice.` (a shot line)
2. `SHOP STREET · 2:00 PM. Sunny. Vending machines hum. Nanda pulls you to a shop.` (a place/time stamp read aloud)
3. `Technically, rain wasn't forecast.` (an MC line)

| voice | model | render latency (ms, 1/2/3) | audio ms (1/2/3) | cost x |
|---|---|---|---|---|
| Daniel | multilingual_v2 | 1241 / 1257 / 902 | 5068 / 7993 / 2560 | 1 |
| River | multilingual_v2 | 1225 / 1483 / 1033 | 3918 / 5355 / 2064 | 1 |
| Alice | multilingual_v2 | 1667 / 1487 / 1018 | 4571 / 6139 / 2482 | 1 |
| Daniel | v3 | 2883 / 4175 / 1752 | 6217 / 7576 / 2612 | 1 |
| River | v3 | 2912 / 3902 / 1747 | 5094 / 6635 / 2456 | 1 |
| Daniel | flash_v2_5 | 262 / 305 / 218 | 6191 / 7497 / 2429 | 0.5 |
| Daniel | v4 | 1959 / 2264 / 1261 | 5277 / 7184 / 2873 | 1 |

Models on this key (GET /v1/models): v4, v4_turbo, v3, v3_conversational, multilingual_v2, flash_v2_5, turbo_v2_5,
turbo_v2, flash_v2 (+ two speech-to-speech). Every candidate returned alignment from `/with-timestamps`.

## Why
- **Contrast with Nanda.** Nanda is Irohauta (young, high, bratty, JA-accented, eleven_v3 with emotion tags). The narrator
  should be the opposite pole: a low, adult, level male voice. Daniel is the only "formal / broadcaster" voice on the key:
  clipped British diction, no smile in it: the grumpy-teacher read. River (neutral, calm) was the runner-up: shortest
  takes, but gender-neutral and softer, closer to a meditation app than a deadpan camera. Alice is clear but friendly/warm.
- **Clarity over expression.** Narration is flat prose ("Close-up. The lid lifts."): v3's strength is tags and acting,
  which we don't want here; v3 is also the slowest to render (2–4 s) and its takes ran longest (6.2 s for line 1).
  multilingual_v2 is ElevenLabs' stable long-form reading model (no tags needed, consistent take to take).
- **Latency.** Takes are pre-rendered, so render latency only costs build time; what matters in play is the *audio*
  length (it sets the beat hold). multilingual_v2 gave Daniel's tightest shot line (5.1 s vs 6.2 s on v3/flash); `speed
  1.08` trims the stamp lines a little more without sounding rushed.
- **Cost.** multilingual_v2 = 1 credit/char, same as v3/v4. Flash (0.5x) was fastest to render but gave longer takes
  and is the lower-fidelity model; the full script is ~8k chars, so halving it is not worth the quality.
- The alignment comes back for all of them, so the choice does not constrain the timing plan.

Note: picked on the numbers + voice descriptions in this container (no speakers here); Tony should ear-check the
`test/` mp3s, and a swap is one constant in `scripts/narration/record.mjs` + a re-run.
