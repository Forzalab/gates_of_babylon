# fix-m: SLOP MED fixes (M1, M2)

Base: origin/ccr-8b4548b6-08uz6t @ e48d2a5. Shots: frozen `vite build` + `vite preview` (:5260), Playwright 1920x1080, clock 12:20 PM,
`date-beta.html?scene=<id>&beat=<n>&run=2&seed=1`. The BEFORE shots come from a build of e48d2a5 and the AFTER shots from the fix commit.
Files: `<shot>-before.jpg`, `<shot>-after.jpg` and `<shot>-pair.jpg` (side by side, half size), JPEG q80.
No line text changed (voice is recorded). Scope: only M1 and M2; M3-M10 are not touched here.

## M1: curry 7 (`v2-curry` beat 7, bg `curry-sauce`): the sauce boat poured with no hand
- **Line:** "She pours more butter sauce. It is thick, orange, and shiny." So the holder is HER: her pin hand (Nanda canon), not the MC's.
- **Wrong:** the steel boat hung from the top edge of the frame and poured on its own. Katsu 5 (`katsu-pour`) already shows her pin holding the same boat.
- **Root cause:** `sauce()` in research/sprint-0930/curry/pipeline/draw.py drew only `boat_cel(boat(...))`; the M1-route-B pin that
  `katsu_pour()` got was never added to the butter twin.
- **Fix:** `sauce()` now does what `katsu_pour()` does: it computes where `boat()` places itself from the landing point and draws a
  `pin_hold` whose round nub grips the boat's belly (boat-local (50, 22); this boat is smaller than katsu's (1.9 vs 2.6), so the nub
  sits a little higher on the belly than katsu's (40, 40) to read as holding, not touching). The lead comes in from the right frame edge
  (her side) under the HUD column, over the saag katori; nub at (1269, 215), r 58, its top below the y=140 HUD band. It is drawn as a
  lifted `cel` (scene tint `b`, soft cast shadow down-right like every other cel).
  `python3 draw.py public/date-beta/trace/curry sauce` regenerated sauce.svg only. Before the change, the pipeline output differed from the
  committed sauce.svg only by the unused `silb` filter def (184 B, upstream drift, checked), so the diff is that def plus the pin.
  The CurrySauce aria label in art/curry/Butter.jsx now says her pink pin hand holds the boat.
- **Files:** research/sprint-0930/curry/pipeline/draw.py, public/date-beta/trace/curry/sauce.svg, src/date-beta/art/curry/Butter.jsx.
- **After:** curry7. Her pink pin lead comes in from the right and its nub sits on the boat's belly; the stream still falls from the spout
  into the butter chicken. Nothing floats, no HUD overlap, no five fingers.

## M2: shop 5 (`v2-shop` beat 5, bg `shop-basket-cups`): "Her hand puts one cup in the basket" showed no hand
- **Wrong:** the top-down basket insert showed all three cups already at rest and no hand at all, so the line had nothing to match.
  The Checkout.jsx comment said "her hand lowers cup 3", but no hand was ever drawn.
- **Fix (art/shop/Checkout.jsx `BasketCupBowls`):** cup 3 is still in her hand, just above its spot. It is lifted (-10, -35) and drawn a little
  bigger (0.62 vs 0.56), as it is closer to the top-down camera. Its overhead shadow stays on the landing spot, softer and wider.
  Her `PinHand` (from shop/parts.jsx, H2's pin look, never five fingers) sits at (1275, 625) with rot -60 and s 0.8, so the round nub closes on cup 3's
  lower-right rim at about (1206, 585). The lead runs down-right off the right frame edge and passes under the box, clear of cups 1 and 2.
  Cups 1 and 2 render exactly as before. The aria label now names the two cups and her pin lowering the third.
- **Files:** src/date-beta/art/shop/Checkout.jsx.
- **After:** shop5. Her pink pin visibly holds the third cup over the basket, so "puts one cup in the basket" now has a hand. The insert keeps the usual
  focus blur and dim behind the box: the beat has no `cut.sharp`, and making it sharp would be a pack change outside this fix. The pin still reads clearly through it.
