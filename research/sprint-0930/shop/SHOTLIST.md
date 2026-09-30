# SHOP (v2-shop, groceries route): shot list

One image per line. The whole scene is 2:00 PM on a sunny day, graded with one light (the `afternoon` wash). The place and time stamp is on line 1.
Chain: street → vending → doors → list → cart → HER LIST game (3 aisles) → basket with three cups → snacks → checkout → register → nails → self-checkout → exit → v2-curry.
Nanda's screen direction: in the player she always stands in the same slot (the `.db-nanda` medium frame, left of centre). In the game she stays on the right edge of frame. She never swaps sides.
Data: `src/date-beta/packs/shop.json` (runs before `love`). Art: `src/date-beta/art/shop/` (19 ids). Game: `src/date-beta/game/ShopGame.jsx` + `shopgame.js`.
Shots are in `shots/` in play order. The contact sheet is `chain.png` (256 colours).

| # | line (who: text) | shot | ref | art id | sfx |
|---|---|---|---|---|---|
| 1 | — SHOP STREET · 2:00 PM. Sunny. Vending machines hum. Nanda pulls you to a shop. | establishing + place/time stamp | c91399ad (vending machines, arcade roof) | shop-vending | wind |
| 2 | — The shop doors slide open. A little tune plays. | wide, the shop front | 16981cdc (konbini doors) | shop-doors | bell |
| 3 | NANDA: Carrots, eggs, three cups, and you. My whole list. ♡ | insert, her handwritten list | 48d536e4 crop (cart handle) | shop-list | — |
| 4 | — Your hands push the cart. Her hand slides on top of yours. | POV, cart handle | 48d536e4 (cart POV) | shop-cart | breath |
| 5 | GAME "HER LIST" (see below): 3 aisles by hard cut, then the end card, then her scored reaction | POV shelf ×3 / close-up / reaction | 7eeb457b, 3e2c3f6b, cc81cb95, 28b1b12e, 708a5c2b, ebc36ef4, a2a61ba4 | shop-game | — |
| 6 | — Close-up. Her hand puts one cup in the basket. Then two. Then three. | close-up (insert) | 8d83db1f (basket) | shop-basket-cups | thump |
| 7 | — You walk past the sweets. She does not look at them. She looks at you. | medium, snack shelf | 0a536433 (snacks) | shop-snacks | tick |
| 8 | — Checkout. Lane 2 is open. You put the basket on the counter. | wide, checkout lanes | d110f421 (checkout wide) | shop-checkout | thump |
| 9 | — The shop lady smiles at you. Nanda sees it. | over the shoulder, the register (Nanda pouts) | c6ec0ec2 (retro register) | shop-register | silence (the ma beat) |
| 10 | — Close-up. Her nails press into the basket handle. Hard. | extreme close-up | 8873611d (basket handle) | shop-basket-handle | thump |
| 11 | — She pulls you to the self-checkout. No shop lady there. | medium, self-checkout lane | b56aeeaa (self-checkout) | shop-self-checkout | tick |
| 12 | NANDA: Do not look at her. Look at me. I bought you a cup. | push-in on the same machine ("NO LADY HERE") | b56aeeaa crop | shop-self-close | — |
| 13 | — The shop bell rings. You carry the bags. She holds your sleeve. → *Walk to lunch* (v2-curry) | exit, the doors from inside (reverse of 2) | 16981cdc mirrored | shop-way-out | bell |

## HER LIST game (line 5): frames

| step | frame | art id (bg) | her face / line |
|---|---|---|---|
| R1 shelf | POV aisle 1 (vegetables). List chip "carrots". "She is waiting · 12". Items: Carrots / White radish / Sweet potato / KEMEY jar. Cart handle at the bottom. | shop-aisle-produce | — |
| R1 right | close-up: the carrot crate | shop-carrots | heart + sparkle: "Carrots! You read my list. ♡" |
| R2 shelf | aisle 2 (eggs + milk): Milk / Eggs / Natto beans | shop-aisle-eggs | (her mood face if you already missed one) |
| R2 right | close-up: the egg racks | shop-eggs-rack | "Eggs. For your lunch tomorrow. ♡"; if you took the tamagoyaki: "Eggs. For the egg rolls. You remember. ♡" (`vary.bento`) |
| R3 shelf | aisle 3 (cups): One cup / Two cups / Three cups (the trap) | shop-aisle-cups | — |
| R3 right | close-up: three matching cups | shop-cups-front | "Three cups. One for you. Two for me. ♡" |
| wrong #1 | same aisle | (aisle) | pout + puff + tear: "Oh. That is not on my list." |
| wrong #2 | hard cut to the straightened tea-tin shelf (OCPD) | shop-tea-tins | vein: "She puts it back. She lines up the whole shelf. 'It goes here. Always here.'" |
| wrong #3+ | the aisle goes dark (BPD split), then snaps back sweet | (aisle) + scrim | shadow-eyes: "You forgot me already?" → sparkle: "Ehehe. Try again, ne? ♡" |
| two cups aside | shown above her line on that wrong pick | | "Two? Then who is the third cup for?" |
| timeout | counts as a wrong pick; she takes the item and the game moves on | | "She is done waiting. She takes it herself." |
| end card | the cart POV + "HER LIST · DONE": carrot, eggs, three cups, "you ♡" | shop-cart | hearts, or a pout if you missed 2 or more |
| reaction | choice 2 (no misses) love +3 love-burst · choice 1 (1 miss) +2 · choice 0 (2+ misses) −2 hate-quake | shop-cart | "Every item, first try. You know me. ♡" / "Almost perfect. I still keep you. ♡" / "You forgot my list. Next time I write it on your hand." |

Budget: 3 × 12 s. The clock never refills inside an aisle and keeps running through a wrong-pick frame, so each aisle takes at most 12 s plus one feedback hold (≤ 2.3 s), and the end card holds 2 s. Worst case is about 45 s, a clean run about 12 s. All frames are stepped (static frames held ≥ 334 ms, no transitions), so reduced motion gets the same game.
