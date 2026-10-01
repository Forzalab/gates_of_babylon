# R5 umeboshi deep pass (main, 2026-09-30)

Plan + Tony's picks: brain `_drift/2026-09-30T0805-alt-R5-plan.md`, `0825-alt-R5-picks.md`, `0830-alt-hand-pins.md`.
Alt's r5-ume branch never reached origin, so main redid the pass on `ccr-7a495bd3-chfs0d` (based on ccr-8b4548b6 2d39561).

- Re-shoot: `after-ume/` (94 shots, `node shoot.mjs ume`, `?fx=full`), still YOU WIN 100%. Before: `../paths/ume/`.
- Before / after in story order: `compare/01..19.jpg` (park beat 1 was cut, so later park shots pair with before N+1).

## Fixed
1. Knife: the white side-pony is gone; the NOT circle stays as her joint. Hands = the two input pins with round nubs (`pinArm`, `reachArm` in art/nanda.js).
2. Hint "Click anywhere to continue" = subtitle text, no pill.
3. Focus plane (hybrid): the floor band + an ellipse round her feet stay sharp, a stronger contact shadow (`.db-fplane`).
4. Park: the feet close-up beat cut; "Hold my hand" = park bg + her pin reaching at the viewer; the rack shot's big blurred duplicate gone.
5. Naan V2: both hands behind the naan (draw.py paint order).
6. Faces: `art/autoface.js`, a different mood face every beat (no wink run).
7. Train bump: "Two men bump into her" (she has no bag), the men touch her, ドンッ impact cel.
8. Line vs visual: she takes your hand (pin reach); rain line = "slows to a few drops" (the FX); key close-up = her pin hand with the key's red imprint; door 12 close-up + カチッ; she kneels (lower + reach); hand on your back = kitchen bg; wet shoes close-up.
9. Insert shots: no beige card; the item is the close-up and she steps out of frame.
10. Floats: a solo NEXT beat no longer raises her; raised over a choice box with no floor, she is cropped at the skirt.

## Not done (next)
- The dialogue box still covers her feet on crop bgs (that is the medium shot, waist-up); per-shot-type sizing (criterion F) not reworked.
- '??' chips unchanged (a Tony UX pick is still open).
- Other branches (shop/butter, library/katsu, leave after its routing fix, not-hungry, replays) not audited yet.
- Leave endings still unreachable in live play (v2-home -> cup, no "Say goodnight").
