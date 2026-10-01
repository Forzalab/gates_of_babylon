# SHOP scene rebuild: status + remaining steps (agent worktree agent-a4dff2932c2439da1, branch sprint/shop-scene)

## Done so far (uncommitted, in the worktree)
- Branch `sprint/shop-scene` off origin/ccr-8b4548b6-08uz6t, `npm ci` ok. Read alt's note, RUBRIC, PLAN "Art style", LockGame, the pack system.
- `research/sprint-0930/shop/pipeline/prep.py`: 16 refs -> 1920x1080 prep (cover crop, inpaint/mask-paint people, watermarks, captions; flat cels for big holes; 2 PM warm grade).
- Traced with alt's `romance/pipeline/trace.py` -> `public/date-beta/trace/shop/*.svg` (16 files, 328-578 KB each).
- `src/date-beta/art/shop/`: parts.jsx (ShopScene on R3Scene, `afternoon` wash; Card, Price, Cup, PlayerHand, HerHand), Street.jsx, Aisles.jsx, Checkout.jsx, shop.css, index.js (19 art ids; `shop-way-out`, because `shop-exit` is already a shot alias), preview.jsx + research/sprint-0930/shop/preview.html, pipeline/bare.mjs. SHOP is spread into ART in art/index.js.
- Vite dev server started on :5311 (background; kill by PID when done).

## Remaining
1. Bare shots of all 19 ids (bare.mjs), then fix the overlay alignment by eye (signs, the cart wires, the hands, the self-checkout machine).
2. SHOTLIST.md: one row per line (line | shot type | ref | art id):
   vending [stamp SHOP STREET · 2:00 PM] -> doors -> list (NANDA) -> cart POV -> GAME (produce/carrots, eggs/rack, cups/cups-front, tins = OCPD, end card) -> basket three cups -> snacks -> checkout wide -> register (lady smiles, pout) -> nails -> self-checkout -> self-close (NANDA "Do not look at her...") -> way out (bell, bags, sleeve) -> v2-curry.
3. `packs/shop.json`: patch v2-shop beats (props replaced, so no stale `shot`), new beats inserted via `beats`, the game beat `bg: shop-game` with 3 score choices (love -2 / +2 / +3, emote, react), vary on `bento` for the eggs line. Add 'shop' to PLAY in main.jsx after 'love'.
4. `game/ShopGame.jsx` + css: 3 rounds by hard cut, keys 1-4, aria labels, a "She is waiting" timer, the cart handle at the bottom, wrong picks escalate (pout/puff -> OCPD tins frame + vein -> BPD shadow-eyes, then sweet), stepped frames only; onPick(score bucket). Register in game/index.js. Tests for the scoring + keys.
5. Shots of every beat in order + chain.png (256 colours); Impeccable pass; npm test + build; commit + push after each commit; brain _drift merge note for alt.
