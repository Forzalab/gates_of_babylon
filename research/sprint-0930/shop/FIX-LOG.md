# SHOP physics fix: fix log

Source: brain `projects/csci/_files/sprint-0930/SHOP-PHYSICS-CRITIQUE.md` (HIGH 13 · MED 35 · LOW 9), with Tony's 16 new shop refs (kept in alt's scratchpad, not committed).
Method: the vtracer traces of the old refs were the source of the murk, the double vanishing points and the floating props. So every shop id is now a **hand-pass cel rebuild** (scenes-r3 style: straight verticals, one vanishing point, flat cel regions). The refs set the layout, props and palette. The old traces stay in `public/date-beta/trace/shop/`, but no shop id loads them any more.
Shots: `shots/` (24, re-shot from `pipeline/shots.mjs` on :5201) + `chain.png` (256 colours).

## Global system (parts.jsx)
- **One light:** the 2:00 PM sun comes from the upper right (`LIGHT`). One `ShopWash` on every shot: a warm key wash from the top right, the black point lifted about 15 %, and half the old vignette. Contact shadows (`Shadow`) fall down and to the left.
- **One palette:** `SP` tokens are shared by every shop drawing. **One VP** `(960, 330)` is used for the aisle, cart, floors, checkout and self-checkout.
- **HUD-safe band:** no art text above y 140 (`HUD_SAFE`). Signs sit on plank lips at y ≥ 150.
- **Hands:** there is one `Hand` sprite, with 5 fingers, a thumb, a wrist, a forearm and a sleeve (her version has a pink sleeve, a white cuff and pink nails). Poses are flat, grip and pinch. Every hand is placed so its fingertips touch what it holds.
- **One basket bed:** `BasketBed` is the green basket with the carrot bunch, the egg pack and THE three cups on one baseline. The same sprite appears in the end card, the react frame, the cups insert (16), the counter (18, 19) and the nails shot (20). There is one `Cup` drawing, always identical. There is one `Carrot`, always `SP.carrot` orange.
- **Nanda in the game:** one anchor in every frame (400×432, right 40, feet ~y 950 on the floor band). She has a contact shadow (`.sg-foot`) offset down-left. When the react box is up she is cropped at its top (`:has(.db-say)`). There is no entry animation.
- **Engine:** `carried()` keeps `emote` and `cut.frame: 'off'` on their own beat, so "hide Nanda" no longer carries past the game. The player now reads `beat.props.emote`, so the register beat pouts. Hand inserts (03 cart, 16 basket, 20 nails) use `cut.frame 'off'` for that one beat: her hand is in the shot. This removes the 15→16 slot jump without a slide; it is a hard cut with a fixed slot.

## Per-ref notes
| ref | what I took | used in |
|---|---|---|
| 01 retro vending corner | colourful machines with a white header strip, a drink window grid, a coin/button column, a "broken" card | shop-vending |
| 02 konbini doors | glass sliding doors, shelves seen through the glass, a green threshold stripe | shop-doors, shop-way-out |
| 03 green basket (hero) | the green lattice basket, 3/4 from above, goods poking over the rim | BasketBed |
| 04 strawberry snack shelf | pink strawberry bags in rows, small price tags on the lip | shop-snacks |
| 05 grey basket + hand | a hand gripping the handle bar, the basket below | shop-basket-handle |
| 06 retro register + hand | a beige register, a green LED display on a post, groceries on the counter | shop-register |
| 07 real checkout lanes | counters in a row on one VP, numbered lane boards overhead | shop-checkout |
| 08 anime self-checkout | a machine with a monitor on a post and a bag tray, a cold case behind, pale floor | shop-self-checkout / -close |
| 09 tea/cup display | wooden stepped shelves, many small cups | shop-aisle-cups |
| 10 tea-bowl shelf | bowls in coloured glazes, rows on planks | Bowl (the "other" tableware, dimmed in cups-front) |
| 11 egg display 幸福タマゴ | stacked egg packs, gold HAPPY-EGGS headers | shop-aisle-eggs, shop-eggs-rack, EggPack |
| 12 carrots bin ¥99 | a heap of carrots, a hand-written ¥99 card | shop-carrots, CarrotCrate (produce) |
| 13 cart handle + sweater hand | a knit-sleeved hand gripping the bar, the cart beyond | shop-cart hands (knit sleeve) |
| 14 cart POV + held item | the goods in the cart, a hand in the frame | shop-cart-full (end card) |
| 15 cart POV down an aisle | one vanishing point, shelves converging, the cart wire on the same VP | AisleVP + Cart |
| 16 konbini exterior, sunny | a blue sky with clouds, a flat shop face, a name band, a red/green stripe | shop-vending, shop-doors |

## Fix log (critique line → fix → shot)
### HIGH (13 + 1 continuity: all fixed)
| # | line | fix | shot |
|---|---|---|---|
| 1 | Nanda 2 heights/scales in game | one `.sg-root .db-nanda` anchor for every state; the card row moves left instead (x 110-1430) | 04-15 |
| 2 | no ground in game frames | `ShelfBay` floor band (y 880+, tiles on the VP) under every aisle; the `.sg-foot` shadow is offset down-left | 04-13 |
| 3 | 02 list covered by Nanda / bubble | the clipboard moves left (x 150-710), with all lines above y 740, a shadow down-left, and a clip on the in-focus handle | 02 |
| 4 | 03 cart: no hands, 2 VPs | cel aisle + cart on one VP; the handle at y 560 (above the box); two knit-sleeved grip hands; her hand from the right lies on your right hand | 03 |
| 5 | 07 Nanda raised, HUD-cut column | anchor fixed; signs now hang flat on plank lips at y 316, left and right of the header chips | 07 |
| 6 | 08 tins illegible, rulers off-plank, tag covered | a grid of identical tins on 3 planks, the dashed lines ON the plank lips, the TEA ¥350 tag at x 900-1200 | 08 |
| 7 | 10 bowls/wheel bigger than her head | THE cup at 80 px, the same drawing as the answer icons; bowls 84 px; no wheel | 10 |
| 8 | 13 cups not matching, 5-6 bowls, floating tags | exactly 3 identical cups on one plank (x 720/960/1200); ¥880 tags on the plank lip; everything else dimmed to 35 % | 13 |
| 9 | 14 detached cuff, empty basket | the end card uses `shop-cart-full` (the basket bed with carrot, eggs and 3 cups); the hands are the new Hand with wrists and forearms; the card moves left off the basket | 14 |
| 10 | 15 legs below the box, -2 chip | Nanda is clipped at the box top while the react box is up | 15 (chip: see open) |
| 11 | 16 cups float, no hand, covered | the basket bed: cups 1+2 on one baseline with shadows; her hand (5 fingers) lowers cup 3; Nanda is hidden for this insert | 16 |
| 12 | 19 poster in front, faceless lady, 4 fingers | poster + FOR SALE flat on the back wall, fully in frame; the lady drawn waist-up with a visible smile; a 5-finger wave; the basket on the counter; Nanda pouts (emote honoured) | 19 |
| 13 | 20 hand floats, 4 fingers, sticks, 30° roll | forearm from the top right, a 5-finger grip, 4 nail tips ON the bar with indents, one pressure tick per nail, basket roll 6° | 20 |
| C | 14/15/16 basket continuity | one `BasketBed` sprite | 14, 15, 16, 18, 19, 20 |

### MED (35): 27 fixed, 8 open
Fixed: light/palette global (ShopWash + SP) · HUD collisions (no art text above y 140) · 00 dutch tilt + no pavement (sunny street, machines vertical at x 1230-1900, pavement) · 01 doorway covered + floating sign (door at x 1260-1660, one threshold line, an A-board with a shadow) · 02 floating paper (clipboard + shadow, blurred bg) · 03 two VPs · 04 cards cover the tag / no carrot bin (carrot crate + ¥99 on the lip, row shifted left) · 04 hands with no thumbs (CSS hands: knuckles + a thumb, ±10°) · 05 tiles clipping Nanda (no tiles; Nanda z-index above) · 06 carrot mass / no crate / sign HUD-cut (crate front + floor, card at y 200-460) · 08 card under the HUD · 09 illegible racks, two perspectives (two plank rows face-on, labels on the lips) · 10 rotated white wedge sign (flat card on the lip) · 11 lit Nanda on a dark scrim (brightness .8 + cold rim) · 12 sign behind her (the sign is at the right lip, above her head) · 14 carrot colour (one `SP.carrot`) · 16 basket scale vs cups · 17 tilted NAND BITES + 2 VPs (level on two hangers, face-on bay) · 18 lane signs non-monotonic, no basket/counter (boards on one VP line, scale 0.9→0.33; the basket on the lane-2 counter) · 18 no floor (tiled floor + 2 shoppers) · 19 wink + floating register handle (pout; the register is drawn whole) · 20 red blob + wink (gone; Nanda hidden in the insert) · 21 tilted tray, pole with no base, covered machine (level tray, post with a base, machine at x 1240-1760) · 21 floor reads as wood (tiles + one window reflection) · 22 tray flips, shelves not supported (the same layers scaled about one point) · 23 Nanda in the top slot (standard slot) · 15→16 slot jump (Nanda hidden on the inserts; hard cut, fixed slot, no slide).
Open: player-frame waist cut by the dialogue box (Say.jsx / `.db-nanda` belong to main's dialog-box work, so not touched) · 11 helper line above the speaker name (kept: the aside is part of the game box) · 15 "-2" chip vs the HUD arrow (Hud.jsx, shared) · 23 bags half hidden by the CTA (the CTA is shared UI) · 00-01 no curry/3 PM check (curry branch) · 13 "Nanda clear of x>1450" holds, but she still stands in front of the cups shelf (by design) · 06 carrot heap reads as rows · 18 counters are plain blocks.

### LOW (9): 7 fixed, 2 open
Fixed: 01 OPEN sign crowding the HUD (now y 296) · 05 RED ONLY cut by the box (on the top plank lip) · 07 stray EG fragment (no trace) · 08 wink face (the vein level now shows `pout`) · 10 thin one-cup icon (every cup icon uses the same width) · 23 mirror (the door is now on the LEFT, text not mirrored) · carrot colour.
Open: 10 skirt colour between emote variants (Nanda sprite = art/nanda.js, shared) · 14 the card still hides a strip of the cart rim.
