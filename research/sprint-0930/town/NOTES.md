# TOWN walk to curry lunch (v2-town): notes

**Where it sits:** it happens around 2:45 PM, after the shop (`v2-shop`) or the library (`v2-library`) and before the curry street choice (`v2-curry`, CURRY STREET · 2:55 PM). The route is `v2-shop` / `v2-library` → **`v2-town`** → `v2-curry`. The pack is `src/date-beta/packs/town.json`, and `'town'` sits in PLAY after `'shop'` and before `'love'`.

The art is in `src/date-beta/art/town/`, with the traces in `public/date-beta/trace/town/{street,crossing,board}.svg`. The pipeline is in `pipeline/`. The refs are Tony's stock photos in the session scratchpad and are **not committed**.

## Per-ref notes (what I took, what I threw away)

| Ref | What it shows | Used for | Removed / redrawn |
|---|---|---|---|
| 01 | Shinjuku scramble at dusk: a wall-to-wall crowd, neon signs on both sides, the zebra stripes running away from camera. | Shot 2: the crowd density and the stripes running to the VP. Every head sits on the eye line, so nearer people are taller. | All people (real faces) are redrawn as flat silhouettes. The neon brands (a karaoke chain, a drugstore) are not used. |
| 02 | Akiba Chuo-dori at noon, one-point view. Huge anime billboards on the left, tall vertical signs, and the red-on-white オノデン roof sign at the end of the street. LAOX, SEGA-style and GAMERS signs. | Shot 1: the layout. The billboard canyon, the vertical signs sticking out of the facades, and the roof sign over the vanishing point. | オノデン becomes **オア電**. LAOX, GAMERS, Duty Free, ONE and every anime key visual are gone. The billboards are our ゲートちゃん and ANDロイド. |
| 03 | Same street, more pedestrians, a stock watermark bottom-left. | Shot 1: the pavement, the bollards on the curb, and the scale of people far down the street. | The watermark and the people (not used). |
| 04 | Same street with nobody in it. Giant billboards lean in at the top because the camera looks up. PACHINKO / ESPACE and カードキングダム signs. | **Shot 1 base.** It gets a keystone fix (straight verticals) and is placed with its VP (283, 312) at (960, 560). | All billboards and brand text are median-softened in prep, then covered by our boards. The lower street is repainted as brick paving on the VP. |
| 05 | An Akiba crossing on an overcast day. A crowd crosses in front of the amiami anime billboard. COMIC ZIN, GiGO, WATTS, 吉野家 and a parked car. | **Shot 2 base.** VP (300, 295) is placed at (960, 520), and the people are knocked flat first. | The people become silhouettes. amiami becomes the ANDロイド board, and the 吉野家 sign becomes our カレー → arrow (it points to lunch). The car is gone. |
| 06 | A corner building: an anime billboard, メディアサイクル, メイドカジノ, まんが喫茶, the 質 pawn-shop circle, and an orange 買取 facade. | Shot 3: the corner-building layout (billboard on top, orange shop under it, a big 質 circle). | メイドカジノ becomes **メイド・イン・NAND**. The anime key visual becomes our own idol. 質 stays, because it is the generic pawn-shop kanji and not a brand. |
| 07 | A vertical Akiba street under a giant billboard (a white-haired character). Passers-by in front, with faces. An alamy watermark at the bottom. | **Shot 3 base.** VP (230, 470) is placed at (1000, 600). | The watermark strip is cut off. The faces are knocked flat, then covered by silhouettes. The billboard is replaced by ゲートちゃん (a new, original design; nothing is copied from the ref character). |

## Pipeline: auto trace → hand → auto trace

1. `prep.py` works on the refs and writes 1920x1080 PNGs. It fixes the keystone and places each ref so its street VP lands on the shot's one VP. It adds mirrored and blurred wings plus a flat pavement fill, knocks down watermarks, people and brand text, and applies the brighter 2:45 PM grade (brightness 1.16, saturation 1.1, black point lifted about 9%, a touch warm).
2. `trace.py` makes **trace 1**. It is the shop's `vtrace-r2/trace.py` recipe: 0.5x, median 3, median-cut to 48 colours, then vtracer color / stacked / spline, at ≤ 700 KB.
3. `hand.py` builds the **hand pass** over trace 1, and `render.mjs DIRECT=1` rasterises it:
   - The paving seams, curbs, crosswalk stripes and side-wall boards all run to one VP, and every edge stays vertical.
   - Every sign is ours.
   - The crowd is flat silhouettes with their heads on the eye line.
   - A cream wash is laid over everything for the 2:45 PM light.
4. `trace.py` runs again on the hand PNGs to make **trace 2**, the final unified vtrace look. The sizes are street 519 KB, crossing 343 KB and board 386 KB.
5. The only crisp overlay in the JSX is the few pun signs whose small kana the 0.5x trace blurs: メイド・イン・NAND, 推し活グッズ, ANDロイド / 最新スマホ, カレー → and NANDでも推せる！. They are drawn at the same place as in hand.py.

To rerun (S = the scratchpad):

```
python3 prep.py $S/town-refs $S/town/prep
python3 trace.py $S/town/prep $S/town/t1
node render.mjs $S/town/t1png $S/town/t1/*.svg
python3 hand.py $S/town/t1png $S/town/hand
DIRECT=1 node render.mjs $S/town/handpng $S/town/hand/*.svg
python3 trace.py $S/town/handpng public/date-beta/trace/town
```

## The beats (v2-town)

| # | Shot (bg) | Speaker | Line | Face |
|---|---|---|---|---|
| 0 | town-street | – | Stamp **AKIBA · 2:45 PM**. "Big signs. Big screens. She holds your hand." | (off frame) |
| 1 | town-street | NANDA | We are going out for curry. Just you and me. | happy |
| 2 | town-crossing | NANDA | So many people. I will hold your arm. Tight. | anya-smile |
| 3 | town-board | NANDA | Wow! A giant oshi board. Oshi means "my favorite." | big-eyes-peek (looking up at it) |
| 4 | town-board | NANDA | But not one of them is as cute as me. Right? | heart-laugh (back at you); choice "Walk to lunch" → v2-curry |

Every Nanda beat is `frame: medium` with `plant: 90`. That puts her shoes on the paving, with the `.db-plant` shadow under her. Nothing text-bearing sits above y 140. The dialogue box never covers the billboard face (x 170-500, y 200-470), and the board ends at y 640, above the box.

## The Japanese puns (reading + why it works)

| Sign | Reading | Parodies | Why it is a pun |
|---|---|---|---|
| **オア電** (roof sign at the end of the street, and the vertical signs) | オアでん / *oa-den* | オノデン (*ono-den*), the Akiba electronics store with the red roof sign | It swaps one kana: ノ → ア makes オア = **OR**. 電 (*den*, "electric") stays, so it reads "OR Electric". One kana changes, the rhythm stays, and a local reads the parody at once. |
| **ANDロイド** (the phone board) | アンドロイド / *andoroido* | Android (アンドロイド) phones | アンド is already how Japanese writes **AND**, so ANDロイド is pronounced exactly like the real word. It is the same trick as our AND-ON. |
| **メイド・イン・NAND** (the maid café) | メイド・イン・ナンド / *meido in nando* | "Made in Japan" (メイド・イン・ジャパン) + メイド (maid) | メイド is both "made" and "maid" in katakana, which is why maid cafés use this pun for real. NAND replaces ジャパン, and the rhythm is the same (4 morae + ン + ド). |
| **NANDでも推せる！** (the ゲートちゃん billboard slogan) | ナンドでもおせる / *nando demo oseru* | 何度でも推せる, "I can stan her again and again" (何度 *nando* = "any number of times") | This is the main pun. NAND, read the Japanese way, is exactly なんど = 何度, so the slogan is a real oshi-katsu phrase that also says NAND. It is the same kind of pun as our NAND駅. |

**Self-check on the kana and kanji:**
- 推し活グッズ (*oshikatsu guzzu*, "fan-activity goods") and 萌え, まんが, まんが館, 質, 買取 ゲーム・まんが, カレー → and 最新スマホ あります are all ordinary Akiba signage.
- The character's name, ゲートちゃん, uses the plain ゲート ("gate") + ちゃん.
- In the vertical signs, the long vowel mark ー is drawn upright (｜), as it is in real vertical writing. Latin letters (NAND, AND) stand upright and stacked, as they do on real 縦看板.
- I rejected 「XOR（ゾーア）」: ゾーア means nothing in Japanese, so it would read as a spelling error, not a pun. I also rejected 「NOTラジオ」, which has no second meaning.

## Gates

- **Compare** (`compare/{street,crossing,board}.png`) shows REF | TRACE 1 | HAND | TRACE 2 per shot. The alamy strip of ref 07 is cropped out.
- **Shots** (`shots/00-04`) are every beat in the real player (`date-beta.html?scene=v2-town&beat=N&still`), with no page errors.
- **OCR** (`pipeline/ocr.py`, tesseract, eng, dialogue box crop): word recall is 100% on all 5 beats.
- **Impeccable** (`pipeline/impeccable.sh`, 1920x1080, per beat):
  - The art has **0** findings on all 5 beats.
  - The chrome has 1 finding, `layout-transition`. It is the shared dialogue chrome, not the town art, and curry reports the same one.
- **Tests:** `src/date-beta-town.test.js` covers the routing (shop / library → town → curry, and nothing else goes into curry), the PLAY order, the stamp, one face per beat, the plants, the ≤ 700 KB traces and the pun signs. The voice lookup tests are unchanged and pass.
- **Voice:** `NEW-VOICE-LINES.md` (#248-252, Irohauta, folder `37-v2-town`) is waiting for the rotated ElevenLabs key.
