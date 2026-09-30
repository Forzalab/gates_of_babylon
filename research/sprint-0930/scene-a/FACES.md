# Scene A faces: Nanda's face layers vs refs 12–15 (Agent 2)

The faces are drawn by `src/date-beta/art/nanda.js`: the `FACES` builders plus the new `SCENE_FACES` / `FACE_DECOR`. The gacha overlays live in `src/date-beta/art/emotion/face.js`.

A beat picks a face by id through `props.cut.face` / `face2` (see `SCENES.md` "props.cut"). The engine's emote list does not change. Each face keeps Nanda's identity:
- the same NAND-gate body and fringe
- the same rim `#d1177f`
- ink `#6b0f45`
- blush `#ff5fa8`

A test checks this.

## What the old faces had, and what the refs need
| ref | what the ref does | closest old face | what was missing |
|---|---|---|---|
| 14 Anya smile | Huge round eyes with 2 highlights and lashes at the outer corners. A tiny nose tick. A wide, flat, closed smile. Blush drawn as 3–4 **vertical** hatch strokes per cheek. | `1` (wink: small dot eye plus an arc) | Big eyes, a second highlight, lashes, a nose, the wide flat smile, vertical hatch. The old hatch (faces `2`, `sweat`) slants diagonally. |
| 13 `>_<` embarrassed | Squeezed chevron eyes. One hot blush band across both cheeks and the nose. Flick triangles over the head. The sweat row. | `pout` (`> <` plus pinched brows and 2 separate cheek blobs) | The blush **band** with `///` hatch, the flustered wobbly mouth, the flicks, a row of sweat drops. The single drop in `sweat` sits on the temple. |
| 15 + 13 laugh | `><` eyes. A tall open mouth with a tongue. Red blush bands. Hearts floating round the head. | `hearts` (face `2`, heart pupils and a closed smile) | An open laughing mouth, the tongue, raised brows, hearts outside the head. The gacha `heart-eyes` halo is heart-**eyes**, not a laugh. |
| 12 Content | Closed happy `^^` arcs, a small soft smile, a plain soft blush. | `1` (one eye open) | Both eyes closed as arcs. |
| 12 Puppy Eyes / the stare | Oversized glossy eyes, raised brows, a tiny mouth. | `sweat` (small round eyes) | Eye size: the old eyes are 4.2 × 5.6 face units, and the peek needs 7.6 × 9.8. |

## The 5 new faces
| id | where it plays | drawn as |
|---|---|---|
| `anya-smile` | Merged beat, step 2 ("Sweet, ne? I rolled it myself." / "Sour, neee?"). | `bigEye` × 2 (6 × 7.6, a lower iris glow, 2 highlights, a lid that hugs the eye, 2 outer lashes pointing out), a nose tick, a wide flat smile, vertical hatch blush. |
| `blush-embarrassed` | "…Obviously. Don't stare." | Chevron `> <`, a blush band with `///`, a wobbly mouth. Decor (still, outside the body clip): 3 sweat drops stepping down past her right temple, 2 flick triangles. |
| `heart-laugh` | Forecast, step 2 (on "f-OR-ecast"). | Chevron `> <` (thicker), raised brows, a tall open mouth with a tongue, a stronger band. Decor: 5 pink hearts round her head and 2 flicks. |
| `content` | "Stay f{OR}ever?" (close frame) and the "Good is a start" answer. | Closed `^^` arcs, a small smile, soft blush. |
| `big-eyes-peek` | The eyes cutaway and merged beat step 1. | `bigEye` × 2 at 7.6 × 9.8, soft blush, a tiny closed mouth. |

Contact sheet renders: `faces/png/*.png` (`node research/sprint-0930/scene-a/faces/faces.mjs`).

## Side-by-sides + deltas (`python3 research/sprint-0930/scene-a/faces/compare.py`)
Each side-by-side in `faces/compare/` has 3 panels: the ref crop, the new face, and the closest old face.

**Ink IoU** is the overlap of the dark-stroke masks at 48 × 48, dilated. Higher means the eyes, mouth and hatching sit in the same shapes and places. The refs are hand-drawn heads with hair crossing the face, so about 0.3 is a close match here.

**Palette dE:** refs 12–14 are greyscale manga, so their palette dE mostly measures "Nanda is pink". Only ref 15 is a colour target.

**Blush** is the share of the cheek band that is blush pink. The greyscale JPEGs read near 0 %.

| face | ref | ink IoU new | ink IoU before | palette dE new | palette dE before | blush ref / new / before | side-by-side |
|---|---|---|---|---|---|---|---|
| anya-smile | ref 14 Anya smile | 0.29 | 0.23 | 13.7 | 14.3 | 0% / 30% / 21% | faces/compare/anya-smile_vs_14.png |
| blush-embarrassed | ref 13 >_< embarrassed (+ flicks) | 0.24 | 0.24 | 24.5 | 25.6 | 6% / 63% / 32% | faces/compare/blush-embarrassed_vs_13.png |
| heart-laugh | ref 15 heart-laugh (left girl) | 0.13 | 0.16 | 18.5 | 20.5 | 48% / 66% / 25% | faces/compare/heart-laugh_vs_15.png |
| heart-laugh | ref 13 laugh (tall open mouth) | 0.31 | 0.27 | 26.3 | 28.7 | 4% / 66% / 25% | faces/compare/heart-laugh_vs_13.png |
| content | ref 12 Content | 0.10 | 0.07 | 8.3 | 8.3 | 0% / 18% / 21% | faces/compare/content_vs_12.png |
| big-eyes-peek | ref 12 Puppy Eyes (the stare) | 0.33 | 0.14 | 10.7 | 10.5 | 0% / 33% / 23% | faces/compare/big-eyes-peek_vs_12.png |

How to read it:
- **Structure.** The new face overlaps its ref at least as well as the old face in 5 of 6 pairs. The big steps are the peek (0.14 → 0.33) and anya-smile (0.23 → 0.29).
- **heart-laugh vs 15 is the one that scores lower (0.13 vs 0.16).** Ref 15's face is 3/4 view with hands on the cheeks and hair across it, so its ink mass sits off-centre. Nanda's face is front-on inside the gate. The features themselves match by eye: `><`, the open mouth with a tongue, the hatch band, the hearts. Its colour moved closer (20.5 → 18.5), and so did its blush share (25 % → 66 %, ref 48 %).
- **Changes made because of this table and the side-by-sides:**
  - anya-smile's first lids read as angry brows. The outer lash flicks pointed up, which slanted the eyes. The lids now hug the eye, and the 2 lashes point outward.
  - The smile is wider (−15 → 13), like ref 14's low, flat smile.
  - The laugh mouth grew taller, like ref 15.
- **Not copied on purpose:**
  - hair, hands, and the scarf of ref 13
  - ref 14's heavy black ink: Nanda's ink stays `#6b0f45`

## Staging (hard cuts, reduced motion first)
Every face change inside a beat is one stepped swap at ≥ 500 ms (`useStep`), and it is the same under `?still`:
- big-eyes-peek → anya-smile at 1000 ms
- default → heart-laugh at 500 ms

The decor is still: it never animates.
