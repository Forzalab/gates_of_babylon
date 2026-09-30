# Emotion FX + gacha love: SCHEMA (sprint 0930)

Research: `RESEARCH.md` (refs 01-11). Code: `src/date-beta/gacha.js`, `src/date-beta/packs/gacha.json`,
`src/date-beta/art/emotion/`, `src/date-beta/art/nanda.js` (ANCHORS, `puff` face, overlay slot).
Tests: `src/date-beta-gacha.test.js`, `src/date-beta-emotion.test.js`.

## Files
- `gacha.js`: pure rules. `loadGacha` (validator), `rollGacha` (one scored pick), `freshLuck` / `nextRunLuck`, `unit(seed, n)`.
- `packs/gacha.json`: the rules. LAST in `main.jsx` `PLAY` (after `love`, so beat numbers are final; it patches nothing).
- `packs/index.js`: new pack key `gacha` (copied to the root; a later pack replaces it).
- `engine.js`: root key `gacha` -> `scenes.gacha`; position gets `luck`; `take()` rolls on every scored pick.
- `art/emotion/shapes.js` (vocabulary: bubble, sparkle, peony, sakura petal, glass hexagon, 💢 vein, halftone, lightning),
  `fx.js` (4 backdrops), `index.js` (`EMOTION_FX` map), `face.js` (4 face layers), `EmotionFx.jsx`, `emotion.css`.
- `shots/` + `shots.mjs`: 1920x1080 stills, one per FX and one per face layer.

## Tier ids

| tier id | when | love | fx | face layers | Nanda emote | badge |
|---|---|---|---|---|---|---|
| `crit10` | ♥ pick (love > 0), 7% | +10 | `love-crit` (big) | sparkle | hearts | CRITICAL +10 |
| `crit5` | ♥ pick, next 15% | +5 | `love-crit` | sparkle | hearts | CRITICAL +5 |
| `rage` | 💔 pick (love < 0), 12% | -5 | `rage` | shadow-eyes, vein (pair) | hate | FURIOUS −5 |
| `anger` | 💔 pick, next 25% | -2 | `anger` | vein, puff | puff | ANGRY −2 |
| `pity` | ♥ pick after 2 💔 picks in a row | +10 | `love-bomb` | sparkle | hearts | PITY +10 · redeemed |

The bonus adds to the choice's own love (a +3 pick that crits +10 = +13 on the HUD pop). Love clamps 0..goal as before.

## Pack fields (`gacha`)
```
"gacha": {
  "seed": 930,                                   // whole number >= 0; the default seed
  "crit":    [ tier, ... ],                      // ♥ picks: rolled in order, rates add up to <= 1
  "penalty": [ tier, ... ],                      // 💔 picks: same
  "pity":    { tier fields (no rate), "after": 2 }  // armed by `after` 💔 picks in a row; the next ♥ pick takes it
}
tier = { "id": "crit10", "bonus": 10, "rate": 0.07, "fx": "love-crit", "face": ["sparkle"], "emote": "hearts", "label": "CRITICAL +10" }
```
- `id`: short lowercase name, unique. `bonus`: whole number, > 0 in crit/pity, < 0 in penalty, within -10..+10.
- `rate`: 0 < rate < 1. `fx`: `love-crit | love-bomb | anger | rage`. `face`: any of `vein | puff | shadow-eyes | sparkle`.
- `emote` (optional): a Nanda emote (engine `EMOTES`, now incl. `puff`); replaces the choice's emote. `label`: badge text, max 24 chars, keep the signed number in it.
- Unknown keys, bad signs, rates over 1, duplicate ids, unknown fx / face / emote: load error (the game will not boot).

## How a roll works (deterministic)
- Position field `luck = { seed, n, streak, force? }` (only when the script has a `gacha`).
- Pick n of a run draws `u = unit(seed, n)` (32-bit hash, [0,1)). ♥ pick: pity if `streak >= after`, else the first crit
  tier whose running rate total exceeds u. 💔 pick: the same over `penalty`. 0-love picks never roll.
- `streak` = 💔 picks in a row; any ♥ pick resets it (pity spends it).
- A new run (a go back to scene 1, a skip past the end, play again) = `seed + 1`, n and streak back to 0.
- The loader's goal walk uses base love only, so 100% stays reachable without luck. Skip (Esc) scores base love, no rolls.
- Result on the reaction: `react.love` = base + bonus, `react.gacha = { id, fx, face, label, bonus, base }`. A tier replaces the
  choice's own `fx` (love-burst / hate-quake). Where she is absent it rides on `pending`, like any pop.

## How to trigger (URL, dev or build)
- `?seed=N`: replay a seed (else a new random seed per boot).
- `?gacha=<tier id>`: force that tier on every pick of its sign (`crit10`, `crit5`, `rage`, `anger`, `pity`).
- `?pick=N`: take choice N (1-based) on the start beat, so the URL opens on the reaction frame.
- `?layers=a,b`: override her face layers on a gacha pop (shots of one layer).
- Examples (rooftop bento pick: 1 = +3, 3 = -3):
  - `date-beta.html?scene=rooftop&beat=2&still&gacha=crit10&pick=1&love=10`
  - `date-beta.html?scene=rooftop&beat=2&still&gacha=pity&pick=1&love=10`
  - `date-beta.html?scene=rooftop&beat=2&still&gacha=anger&pick=3&love=24`
  - `date-beta.html?scene=rooftop&beat=2&still&gacha=rage&pick=3&love=24`
- In code: `start(scenes, { seed, force })`, `startAt(..., { seed, force })`, then `choose()` as usual.

## Rendering
- `main.jsx`: `pop.gacha` -> `<EmotionFx>` right after `.db-focus` (over the scene, under Nanda / dialogue / HUD, by DOM order)
  and `<Nanda layers={pop.gacha.face}>`. Both stay for the whole reaction frame and leave with it (hard cut).
- FX = one static `<svg viewBox="0 0 1920 1080" aria-hidden>`; the badge is real text on an opaque plate with `role="status"`.
- Face layers (`face.js`) are positioned from `ANCHORS` in `art/nanda.js` (gate units). `nandaSVG({ overlay })` draws
  `under` inside her body clip after the face and before the fringe (bangs on top), `over` after the figure.
  vein = 💢 on the fringe at the temple (+ one in the air when furious); puff = cheek bulges, blush hatching, teardrop
  (the squashed mouth + pouting brows are the `puff` face); shadow-eyes = dark eye band + two white eyes, upper face -15%;
  sparkle = 4-point stars in both eye highlights + 5 round her head.

## Motion + a11y
- No tweened animation: no keyframes, transitions or SMIL (tested). One exception, the anger vein "grows a bit": a stepped
  2-frame swap, small -> big (1.25x), via ONE 600 ms setTimeout in `EmotionFx` that sets `data-emo-step="big"` on the stage
  (`.emo-v-s` / `.emo-v-b` in `emotion.css`), then it holds. Reduced motion: big only from frame 1. < 2 Hz, no flashes.
- Puff (Tony 0930): fat balloon cheeks + hot blush + a soft red face flush; the anger backdrop has a red flush round her head.
- Seeded layouts (fixed seeds per FX): the same tier always draws the same picture. Node budget <= 300 per FX; blur on <= 2 groups.
- Text: the dialogue box keeps its opaque plate; badges: #7a0f4e / #6b0f45 / #9a0808 on #fff (8-12:1), #f4f8c8 on #1a1020 (~16:1).
  Meaning never by colour only: the badge + HUD pop carry the signed number and a word.

## Art notes
- All shapes hand-built from the written shape grammar in RESEARCH.md. vtracer was not used: the only rasters are Tony's refs
  (anime frames + watermarked stock 09), which are composition/palette only, and tracing them would copy them.
- Refs used: 03 (💢), 04 (lightning + shadowed face), 05/06 (bubbles, peonies), 07 (sakura), 09 (composition only: hex glass,
  bokeh, ribbon, big-star ratio), 10 (4/8-point star), 11 (pout face + halftone backdrop). 08 = dup of 06.

## Shots
`node research/sprint-0930/emotion-fx/shots.mjs research/sprint-0930/emotion-fx/shots` with vite on :3000, then
quantise to 256 colours with PIL (`im.quantize(256, method=MEDIANCUT, dither=NONE)`).
`fx-love-crit.png`, `fx-love-bomb.png`, `fx-anger.png`, `fx-rage.png`, `face-vein.png`, `face-puff.png`, `face-shadow-eyes.png`, `face-sparkle.png`.

## Impeccable (v4.1.0, `--viewport 1920x1080`)
- Static, my files (`art/emotion/`, `Nanda.jsx`, `gacha.js`, `art/nanda.js`, `packs/gacha.json`): 0 before, 0 after.
- Live, reaction frame without a tier (baseline): 2 (`nested-cards` HUD pop, `layout-transition` timebar; not ours).
- Live, per FX, before -> after: love-crit 2 -> 2, love-bomb 4 -> 2 (fixed: violet badge text #5a1a8a = 2 `ai-color-palette`),
  anger 2 -> 2, rage 2 -> 2. All remaining = the baseline 2.
- Advisory kept on purpose: `shape-assembled-illustration` on the FX svg and on Nanda: hand-built SVG is the brief.
