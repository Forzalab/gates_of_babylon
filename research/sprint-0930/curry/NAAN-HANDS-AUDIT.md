# CURRY: naan-hands audit (every shot where a hand touches the food)

The refs are Tony's hand photos, `naan-hands/01-05` in the scratchpad. They are stock photos with watermarks, so they are **not committed**. The grips are:
- 01: a fingertip pinch that dips a torn piece into dal.
- 02: a strip held between the thumb and the index/middle.
- 03: a tear, with the palm down and the thumb under.
- 04: a folded scoop dipped into the bowl.
- 05: two hands lifting a naan.

The scales come from R3-AUDIT: the thali is 35 px/cm, the lift crop is 42, the dip crop is 56, the katsu is 52 and her face is 34. A girl's hand is about 16.5 cm long and an index finger is about 1.5 cm wide.

The side-by-sides are in `hands-compare/<id>.png`, laid out as ref grip (the vtraced ref silhouette, not the photo) | before (r3) | after.

**Status:** HIGH = fixed, MED = open unless it says fixed, LOW = noted.

## What was wrong with the r3 cel hand (it was used in every shot)
- **The fingers were about 1.8x too thick.**
  - Each finger was 27 hand units + a 10-unit line = 2.66 cm, against about 1.5 cm on a real finger.
  - The thumb was 2.9 cm against about 1.9 cm. The pinky was 2.2 cm against about 1.3 cm.
  - The palm was about 15% too wide.
  - Together they read as a mitten, "the hand is 2x too big". The length alone (about 15.4 cm) was close.
- **The joints were wrong.** Each finger had 2 straight segments and no taper, so there was 1 bend instead of 3 phalanges. The 4 fingers were all the same thickness.
- **Nails showed on the pad side.** Nails were drawn on all 5 fingertips in every view. In the curled pinch views that is the pad side, so the hand read as "the back of the hand facing you with the fingers bent backwards".
- **The thumb did not oppose.** It was a straight 2-segment stick parallel to the index. Its tip touched the index only because the pinch point was defined there. There was no IP bend toward the index.
- **The piece was the wrong size.** The held piece was a separate small cel of 9.4 x 6 cm, against the notch it left in the naan (10 x 9.3 cm). It had 65% of the notch's area.
- **The shadow was hard.** It was the silhouette with a flat offset and hard edges, and it ignored how high the hand was.

## Per shot

| shot | sev | before (r3) | after |
|---|---|---|---|
| naan-lift (the tear) | HIGH | Only one hand, so nothing held the naan down while the tip came off. The piece floated at the naan edge, away from the notch, and the hand covered the torn edge. The fingers were fat, with pink nails on the pad side. | FIXED: a two-hand pinch-pull (refs 03 + 05). Her left hand is palm down (dorsal view, nails correct) with the index/middle/ring tips pinning the naan 2 cm right of the tear, and her thumb is under the naan (hidden). Her right hand pinches the piece's torn edge with the thumb under and the index on top, and pulls it 5 cm up-left. Dough strands join the notch to the piece. The piece **is** the sprite's own tip (clipped by the tear line), so it fits the notch 1:1. There are soft blurred contact shadows under the anchoring fingertips, and the lifted hand throws a larger, softer shadow down-right. |
| naan-dip | HIGH | The piece's tip only touched the surface: the dip depth was 0 and there was no occlusion. The hand came in as a flat mitten over the saag katori, the ring/pinky tips hung into the next bowl, and the grip was a flat pinch of an unfolded piece. | FIXED: the scoop grip (ref 04). The piece is folded, with the thumb on top and the index/middle under it. Her left hand comes from the right. The far end is **2.5 cm under the curry**: it is hidden below the surface line and behind the katori's front wall. A lit meniscus and ring show where it goes in, and the sauce coats the end. |
| naan-feed (POV) | HIGH | A pinch with 3 fanned fat fingers. The piece was drawn over the fingers, so the fingers touched it at 1 point. | FIXED: the hold grip (ref 02). The piece sits between your thumb pad on top and the index/middle under it. The ring/pinky are curled. The navy sleeve and white cuff run off the bottom-left. The hand is 16.5 cm = 560 px next to a 5 cm mouth. The coated tip stops 4 cm short of her open mouth, with one drip falling straight down. |
| butter-bite | HIGH | Same hand as the feed. | FIXED: the same hand and piece, moved 4 cm further in. The tip is inside her lips (clipped), and no lip line crosses it. |
| katsu-close | HIGH | A 2x-scale mitten. The slice was a separate cel sitting on top of the fingers, so there was no grip. | FIXED: a pinch (ref 01). The slice is the plate sprite's own end slice (3.7 x 4.6 cm, so it matches the gap). Its end is pressed 1 cm into the shallow roux (occluded), with a meniscus. |
| katsu-feed / katsu-bite | HIGH | Same as naan-feed. | FIXED: the hold grip with the real slice. |
| katsu-cut | HIGH | The hand floated at the frame edge and **did not touch the spoon handle** (about 60 px gap). | FIXED: the spoon grip. The handle sits between the thumb pad and the side of the index, 6 cm up from the handle end. |
| all | MED | Hand cels vs the painterly bg: the hands are flat cels by the lock (the "Scooby-Doo tell"), and they read slightly pasted-on in the dip. | open |
| naan-dip | MED | The top face of the folded scoop shows the torn zig-zag edge as a hard cut, and the entry line under the surface is a straight horizontal clip. | open |
| katsu-close | MED | The gap the slice left is still the r3 flat brown pentagon (ROUX_FILL). It is not a hand issue. | open |
| napkin / napkin-fold / katsu-napkin | MED | These still use the r3 `hand()` (fat fingers). No food touches the hand, so they were out of scope. | open |
| feed | LOW | Your cuff is a flat band, with no fold. | noted |

## Method
- **`pipeline/hands.py`** handles the refs:
  - It lifts the watermark band and inpaints and blurs its text.
  - It cuts each hand with GrabCut plus a skin gate, and vtraces the silhouette into 3 flat tones in Nanda's skin palette → `sprites/hand-{pinch,hold,press,scoop}.svg` + `hands.json`.
  - At about 550 px, the refs are too low-res for the fingers to separate cleanly in the trace. So the silhouettes are the pose/proportion reference and the "ref" panel of the compares, not the shot art.
- **`pipeline/grip.py`** builds the shot hands:
  - The anatomical cel hand is built in **cm**: palm 9.5 x 7.2, fingers 6.5/7.0/6.6/5.2 x 1.25-1.55 tapering, 3 phalanges each, and a 3-bone thumb solved by IK onto its contact. The IP joint always bulges outward.
  - The grips match the refs.
  - Skin is Nanda's SWEET palette. The sleeve is her violet collar colour, with a white cuff and a rim-pink stripe.
  - The shade and light are in screen space (the window is upper left).
  - The cast shadow is soft and offset by height, at 0.24 px per px of height.
- **`pipeline/hands_compare.py`** builds the sheets in `hands-compare/`.
