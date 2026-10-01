# CURRY r3: audit (physics + trace-vs-ref + NANDA), per shot

Tony on the butter chain, shot 6 (`curry-thali`): "THAT'S NOT THE NAAN I LOVE. What's the white thing? The sauce cup is too small. The naan shape is wrong."

The refs are in the scratchpad `curry-refs/` (16 files; see REF-NOTES-R2.md). The side-by-sides are in `r3-compare/<id>.png`, laid out as ref | before (r2) | after (r3).

Coordinates are frame px (1920x1080). The HUD band is y<140, and the dialogue box starts at y~740.

**Status:** HIGH = fixed, MED = open unless it says fixed, LOW = noted.

## Method (r3)
- **Food.** All food is a vtrace of the refs (`pipeline/sprites.py`). Each food is cut from its ref, graded, and traced with spline, stacked, about 48 colours and 0.5x size. Each food is **one sprite**, nested into every shot (`spr()`, `<use>` of one `<defs>` copy):
  - naan = images(179), the Japan-shop teardrop.
  - katori = images(181), the orange cup. It is re-graded for butter, saag and rice.
  - katsu plate + fukujinzuke = images(183).
- **Backgrounds.** Per Tony's cel-over-vtrace lock, each bg is a pure vtrace of a ref table (mirror-tiled):
  - `bg-nand` = the 181 wood table.
  - `bg-oror` = the 183 pale planks.
- **Cels.** Hands, the held piece, the spoon and the gravy boat are flat SVG cels. They get a per-scene tint filter (`tint-b` / `tint-k`) and cast their silhouette shadow down-right (the window is upper left), further when lifted.
- **Real scale.** Every shot has a px/cm:
  - naan 40 cm = 1400 px, so the thali is 35 px/cm.
  - katsu plate 26 cm = 1350 px, so the katsu shots are 52 px/cm.
  - At her mouth it is 34 px/cm.
  - A hand is 18 cm = 250 hand units, so `HS_*` = the hand scale and `PK_*` = the held piece in hand units. The piece in the fingers is the same physical size as the notch it left.

## BUTTER

| shot | sev | finding (r2) | r3 |
|---|---|---|---|
| thali | HIGH | Trace: the naan was a flat oval slab (the "only in Japan" complaint was about the shape), with round dot char and fully inside the tray. | FIXED: 179 teardrop traced, 1400 px long (3x a katori), droops off the tray at x 1540-1870, with irregular brown char. |
| thali | HIGH | The **white blob** at (230-590, 450-630) was unreadable (it was meant to be rice). | FIXED: the rice is now in its own steel katori (1130,130), a domed mound with grain outlines. The line "Butter chicken, green saag, rice" is kept. |
| thali | HIGH | Scale: the katori was 340 px next to a 1300 px naan and shallow, so it read as a sauce cup. | FIXED: the traced 181 katori is 470 px wide and deep (a 13 cm bowl at 35 px/cm). |
| thali | MED | Light: shadows went down-right, but the naan cast no shadow on the tray. | FIXED: every sprite casts its silhouette down-right. |
| thali | MED | The naan char is paler than 181's (the 179 grade). | open |
| thali | LOW | The katori trace edge is slightly stepped at 2x crops. | noted |
| naan-lift | HIGH | Support: the piece floated at the tip with no tear visible on the naan. Scale: hand 1.7 vs the naan. | FIXED: the naan is clipped along the tear (a pale crumb edge). Her hand is at the physical scale (HS_B x1.2 crop), lifts the piece above the tray and casts its shadow on the naan. |
| naan-lift | MED | The hand covers part of the torn edge. | open |
| sauce | HIGH | The boat was bigger than the cup it pours into. | FIXED: 1.6x crop of the big katori; boat s=1.9 (about 12 cm). The ribbon lands in the cup. |
| naan-dip | HIGH | The piece was not in the curry (a flat ellipse blob), and the hand came from the right with no contact. | FIXED: the piece tip is placed at the curry surface by geometry (`tip -> pinch`), with a ring on the surface and a drip. Her fingers pinch the torn edge. |
| naan-feed | HIGH | The piece covered her mouth, and the ECU proportions did not match her sprite. | FIXED: the tip stops at the mouth corner and the open mouth shows. See NANDA. |
| butter-bite | HIGH | **The lip line crossed the food.** | FIXED: the food is clipped outside the mouth oval, and the upper and lower lips are drawn above and below it. No line crosses the piece. |
| lassi / table / napkin | MED | Orange cloth vs the new wood table. | FIXED: lassi uses bg-nand; the two-shot tables are recoloured to the same wood. |

## KATSU

| shot | sev | finding (r2) | r3 |
|---|---|---|---|
| katsu-dish | HIGH | Trace: the drawn cutlet was an unsliced oval slab with no fan, and the rice and roux were flat. | FIXED: the 183 plate is traced. The cutlet is sliced and fanned with pink-white faces over golden crumb, the roux is ridged brown on the left and the rice is on the right. The fukujinzuke + rakkyo dish sits behind at the upper right. |
| katsu-dish | HIGH | Scale: the spoon was about 400 px next to a 1460 px plate (a 26 cm plate with a 7 cm spoon). | FIXED: the spoon is 18 cm = 940 px on a napkin and runs off the frame. |
| katsu-cut | HIGH | Spoon bowl 80 px vs the slice. | FIXED: the bowl is 208 px (4 cm) and presses on the end slice (sprite coords SLICE). Her hand grips the handle at the right edge. |
| katsu-cut | MED | Only her fingers show at the right edge (the handle grip is cut by the frame). | open |
| katsu-pour | MED | A flat pool cel on the traced rice. | open (acceptable: cel over trace) |
| katsu-close | HIGH | The piece was hidden by the long fingers, and a 1.5x crop made the hand 1400 px. | FIXED: 1.0 crop. The piece is drawn over the pinch (`on_top`), and its tip is placed at the roux ring. |
| katsu-close | MED | The small piece still reads as dark (roux coat) at this size. | open |
| katsu-feed / bite | HIGH | Same lip bug as butter. | FIXED: same clip. The slice (4 cm) pinch is shifted toward the mouth, so the tip enters at the lip. |
| katsu-bite | MED | The slice enters at the left corner, not the centre. | open |

## NANDA (every curry shot she appears in)
Her normal sprite is `src/date-beta/art/nanda.js`: an IC-chip body, eyes at (-13,-5)/(11,-5), the mouth at y+11, hatch blush between them.

| shot | sev | finding | r3 |
|---|---|---|---|
| feed / bite ECU | HIGH | Eye spacing : eye-to-mouth was 680 : 220 (0.32). The sprite is 24 : 16 (0.67). The mouth sat too close under the eyes, the cheeks were above the mouth line, and the blush was plain ovals. | FIXED: eyes at x 680/1240, y 300; mouth y 560 (0.46, clamped so the mouth stays above the box). Cheeks at y 470 between them with the sprite's vertical hatch. |
| feed | MED | The eyes were plain dots. | FIXED: 'anya-smile' glossy eyes (2 highlights + a lash flick). |
| bite | HIGH | Heavy lids hid the eyes, but the line says "She looks at your face the whole time". | FIXED: 'big-eyes-peek' (bigger eyes, raised brows). The brows are clear of the zigzag fringe. |
| bite | HIGH | The lip line crossed the food. | FIXED (see above). |
| her hands (lift, dip, close, cut, napkin) | HIGH | Scale was arbitrary (s 1.5-1.7 in 2-4x crops, so the hand was smaller than the naan tip). | FIXED: `hand_at` + HS_B/HS_K times the crop. 5 fingers, a wrist, a sleeve off the frame edge, and a pinch at the torn edge. |
| her hands | MED | The cel hand (the r2 art) is still simple. The flipped pinch shows the back of the hand with nails, and the fingers overlap on the grip. | open |
| butter-table / katsu-counter / exits | HIGH | The same default face on every medium beat. | FIXED: per-beat `cut.face`: table 'anya-smile', counter 'content', butter + katsu exits 'heart-laugh', alone exit 'content' (the alone int keeps 'hate'). |
| two-shots | LOW | Her sprite sits on the booth seat / stool top with a shadow to her right (r2). The palette, head and bow match nanda.js (the engine sprite, unchanged). | ok |

## Files
- `pipeline/sprites.py`: new (the ref cuts, grades and traces, which write `sprites/`).
- `pipeline/draw.py`: now consumes the sprites.
- `public/date-beta/trace/curry/*.svg`: regenerated. Each file is under 600 KB (the test limit).
