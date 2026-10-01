# CURRY r2: notes on Tony's 16 refs

The refs are Tony's uploads, and they are **not committed**. Each one below is named by its upload file name. I looked at every file, both as a contact sheet and at full size for 181 and katsu-lift.

**No ref pixels are used.** Every r2 food, hand, and face shot is drawn by hand as a flat-cel SVG in `pipeline/draw.py`, in the scenes-r3 style: a base colour, one shade, one highlight, and a thin dark line.

## Lassi refs
| ref | what it shows | what we take | where it goes |
|---|---|---|---|
| images(172) | A photo of a thick green-yellow lassi in a straight tumbler, with a metal straw, on a dark bar with coasters. | Nothing, because of the colour: it is pistachio-green, not mango. We do take one idea: the glass sits on the table with a contact shadow. | lassi (the shadow) |
| images(173) | Two mango lassis in short glasses, with a whipped-cream cap and pistachio bits. | The **thick pale foam band** at the top of the drink, and the small green bits on it. | lassi foam line |
| images(174) | An Indian lunch spread (a photo): naan in paper, a tall lassi, rice, and two steel bowls of red curry. | A **steel katori** of red-orange curry is the house look. The lassi sits right next to the tray. | thali + lassi layout |
| images(175) | A thali-style lunch plate with a partitioned plate, a naan, a lassi in a plastic cup with a straw, on a woven mat. | The **drink sits beside the tray at the upper side**, with one straw. | lassi (the tray is cut by the left edge) |
| images(176) | A mango lassi in a small tumbler on a marble coaster, with saffron and pistachio on top. | The warm mango **orange with a lighter left side**: the glass shade model. | lassi cel shade |
| images(177) | A mango lassi in a **stemmed tulip glass** with a yellow straw, a mint leaf, and a mango cube on the rim, on black. | **The glass shape** (tulip bowl + stem + foot), the **mint on the rim**, and the **mango piece on the rim**. The straw is one straw, leaning right. | lassi glass (the main ref) |
| images(178) | A painterly mango lassi in a tulip glass, with a mint sprig, mango cubes, and a wicker mat. | The **warm window glow** behind the glass, and the specular stripe down the left side. | lassi (window on the left, left gloss stripe) |

## Naan / thali refs
| ref | what it shows | what we take | where it goes |
|---|---|---|---|
| images(179) | An anime **teardrop naan** that droops over a steel tray, with a grey dal cup, a salad cup, and a butter pat. | **The teardrop shape** (a thin tip, a fat round end), the **butter pat** on top, and pale puffed domes with brown rims. | the thali naan |
| images(180) | Anime: two naan on a wooden tray, next to a wooden bowl of curry. | **Char spots** as irregular brown splotches (never circles), and the pale body. | naan char spots (the `blobpath` splotches) |
| images(181) | Anime (**the main ref**): a round steel thali with three steel katoris (green, orange, yellow), a spoon in one cup, and a long lumpy naan across the front. A steel cup sits at the top-right. | **The whole layout**: 3 katoris at the back, the naan across the front, the spoon, the steel rim ellipse, and a soft contact shadow. The light comes from the upper left. | thali hero, and every close-up of it (crops) |

## Katsu refs
(These are also summarised in `r2/KATSU-ANALYSIS.md`.)

| ref | what it shows | what we take | where it goes |
|---|---|---|---|
| images(182) | Anime: a big breaded cutlet on a dark roux, with **pink cut stripes**, sparkles, and orange lava highlights, on a warm orange background. | The **scalloped crumb edge**, gold dots, and pink cut faces. The **orange glints** on the dark roux. | the `cutlet()` crumb + roux glints |
| images(183) | Watercolour: a **fanned sliced cutlet** across a ridged roux, rice on the right, a pickle tray, a water glass with lime, and a wooden spoon on a napkin. | The **plate layout** (rice right, roux left, the cutlet across the seam), the **fanned slices**, the **water + lime**, and the **spoon on a napkin**. | katsu hero, katsu-water, the spoon on the napkin |
| images(184) | Anime: a deep white plate held at eye level (curry rice), with a glass of water in front and a spoon. | The white plate rim and its **blue-grey shade**. | the katsu plate rim shade |
| images(185) | Anime: a plate of curry rice **held out toward the camera** (the rice mound + orange-brown roux with carrot). | Rice as a **lumpy dome** with carrot chunks. The katsu serving shot (the dish arrives). | the rice mound, and the carrot / potato cubes |
| images(186) | Anime: a **gravy boat tilts** at the top-right, and a thick ribbon of roux (with an eggplant slice) falls onto a rice dome and pools. | **The pour**: the boat at the top-right, one thick glossy ribbon, and a pool with a dark rim on the rice. | katsu-pour (and the butter sauce shot uses the same `boat()`) |
| katsu-lift-curry-romeo-is-a-dead-man-1.jpg | Anime "Katsu Lift": a **cut katsu** whose pink face has pale fat lines inside a thick jagged crumb ring. Glossy smooth roux with white specular blobs, a darker rim where it meets the rice, and potato cubes and mushrooms. The rice is drawn as grain outlines. Its on-screen captions and watermark are ignored. | The **cut face** (pink + a pale fat line + the crumb ring), the **white spec blobs** on the roux, the **dark roux rim** at the rice, and the **rice grain outlines**. | `cutlet()` faces, `katsu_piece()`, the roux on the katsu plate |

## Rules carried into every shot
- **One light.** The 3:00 PM sun comes through the window on the left. Highlights sit on the top-left, and shadows fall to the lower right.
- **One dish sprite.** Every close-up is a crop (a scale and translate) of the hero drawing. The naan piece is one function from the tear to the bite, and so is the katsu piece.
- **Hands.** Hands have 5 fingers and a wrist, with a sleeve that runs off the frame edge. Your hand has a navy blazer sleeve and a white cuff, and comes from the bottom-left. Her hand has a lavender sleeve, a white and pink cuff, and pink nails, and comes from the right.
