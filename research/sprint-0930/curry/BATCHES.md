# CURRY r2: batches (resumed from 969b476 "WIP backup")

The WIP left three things: the hand.py thali/lassi drafts, KATSU-ANALYSIS.md, and the round PNGs in r2/. It had not pushed a batch. So the work below starts from that point, and nothing was redone.

All art comes from `pipeline/draw.py`. It is hand-drawn flat cel and is written straight to `public/date-beta/trace/curry/`. None of it is vtraced: the flat SVG is crisper than a trace, and each file is 7-47 KB.

## Batch 1: every r2 food / hand / face shot, both paths rewired
- **Butter**
  - Redrawn: thali (hero, anime steel thali with a teardrop naan on the orange cloth), naan-lift (the torn tip plus her hand), sauce (a steel boat pours), naan-dip, and lassi (tulip glass, ONE straw, the same tray at the left).
  - butter-table: a two-shot with the window on the left and her booth, so she sits on a seat and has a cast shadow.
  - New: naan-feed (the extreme close-up feeding POV, your hand at her open mouth, full frame, so the box cannot clip a sprite) and butter-bite (the sauce at her mouth).
  - New: napkin (her hand wipes your fingers).
- **Katsu, beat for beat with butter**
  - New shots: katsu-counter (two-shot), katsu-dish (hero after KATSU-ANALYSIS), katsu-cut (spoon + the small piece), katsu-pour (the roux boat onto the rice), katsu-close (the dip), katsu-feed, katsu-bite (roux at her mouth), katsu-water (lemon water, one straw), and katsu-napkin.
  - Not hungry: napkin-fold.
  - `curry-katsu-spoon` is removed.
- **Pack.** `packs/curry.json` is rewritten:
  - butter has 14 beats and katsu has 12 (2 of the 14 are the shared street beats).
  - The napkin is now SHOWN on both paths, and the exit reads "We walk out to the street. It is 3:40 PM."
  - The lines are rewritten at grade 2 (LINES-CHANGED.md).
- **Tests.** The curry test asserts 24 ids, the three chains, that katsu matches butter beat for beat, that the napkin beat exists on both paths, and that the feed and bite beats use frame `off`. The r3-rain v2-curry exit moved from beat 12 to beat 13.
- **Docs:** REF-NOTES-R2.md (all 16 refs) and LINES-CHANGED.md.
- **Output:** chain-butter.png and chain-katsu.png, re-shot.

## Batch 2: physics pass (CURRY-PHYSICS.md), all HIGH fixed
See CURRY-PHYSICS.md.
