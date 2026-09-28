# Arbiter verdict: Date mode, x1–y3

This verdict covers `pit3/date-x` at 8325632 and `pit3/date-y` at 349f8b8. Both were built with `vite build` and served with `vite preview`. I took Playwright shots at 1440×810 and 1024×768, waiting 3.5 s so each surprise had landed. The Y pages were also shot with `&clean=1` for measurement. All the Pillow numbers below are mine, not the builders'.

## Gates
- **Hard fails:** none.
- **Art:**
  - No AI art, people, photos or traced anime girl.
  - Every portrait is a gate drawn with our `Shape`.
  - Nothing is explicit.
- **Logic mode:** `npm run e2e` passes on both branches ("All e2e checks passed."). `/` is unchanged: the grey Figur editor.
- **Console:**
  - The only error is a favicon 404 on each server's first load. It affects both branches equally, and I dock polish by 1 for it.
  - There are no page errors and no horizontal scroll at either width.
- **Buttons:**
  - Every ENTER goes to a stub: `#enter` on X, `?v=..&entered=1` on Y.
  - Every "not 18" exit goes to `/`.

## Pillow re-derivation (1440 shots vs the mockups)

| | bar | grid bg | headline pink | WARNING cap H |
|---|---|---|---|---|
| M1 ee486fef | #001a5d | #003ab7 | #ed1c83 | .100 |
| M2 c20f7340 | #001b62 | #0041c6 | #f51b85 | .114 |
| M3 8c0d1049 | #001e6d | #003ed0 | #f60f94 | .122 |
| x1 | #001b62 | #003ec5 | #ec1a86 | .094 |
| x2 | #001b62 | #003ec5 | #ec1a86 | .035 (conflict text) |
| x3 | #001b62 | #003ec5 | #ec1a86 | .078 |
| y1 | #011a5e | #0039bb | #ec1b82 | .095 |
| y2 | #011a5e | #0039bb | **#f5419a** (washed out) | .073 |
| y3 | #011a5e | #0039bb | **#fb55c4** (ΔRGB about 90 vs M3) | .093 |

**Chrome:** Both builders nail the chrome, within ΔRGB 15.

**Headline size:** Everyone undershoots the headline on M2/M3. x2 and x3 lose the most. y2 and y3 also drift in hue, toward a pastel pink.

**Tiles:** On both branches the tiles are a flat mauve, where the mockups show warm, blurred, photo-like noise. This is an honest trade, since we have no photos, but it reads flatter.

## Scores (40–80; 55 = passes, 70 = strong)

| variant | 1 faithful | 2 jarring | 3 surprise | 4 polish | 5 research | **overall** |
|---|---|---|---|---|---|---|
| x1 (SO "closed as duplicate") | 62 | 68 | 60 | 58 | 68 | **63** |
| x2 (git merge conflict) | 60 | 66 | 70 | 60 | 68 | **65** |
| x3 (segfault + gdb bt) | 66 | 70 | 72 | 64 | 68 | **68** |
| y1 (Kerney grades the page, B+) | 64 | 68 | 74 | 56 | 45 | **61** |
| y2 (popup/virus/ticker storm) | 58 | 66 | 48 | 55 | 45 | **54** |
| y3 (#csci-26 Discord, "Prof. Kerney is typing") | 63 | 68 | 70 | 63 | 45 | **62** |

**Y's research score:** Y's ANALYSIS, RESEARCH and REPORT files were never written. Y has only `deltas.md`, so its research is scored 45 across the board.

**y2's surprise:** It breaks the "exactly ONE" rule. It has five gags: the WINNER popup, Hot Singles, Security Alert, the cookie banner and the ticker.

**Nobody reaches 70 overall.** No variant is ready as-is.

## Top 3

1. **x3 (68).** It has the best-structured page and the best surprise:
   - It keeps the full M3 hierarchy: the yellow 18+ is the only yellow, and a wide ENTER ANYWAY sits over a narrow NO THANKS.
   - The segfault is instantly legible to anyone in CS.
   - `love_bomb (n=4294967295) // UINT_MAX texts` spends the one love-bomb gag well.
   - The terminal never covers the buttons.
2. **x2 (65).**
   - The merge conflict is the cleanest pure-CS joke of the six. It is a real choice between two headlines, which makes it thematic.
   - The AND/OR/XOR : ENTER row is the best parody of the original gate.
   - Held back by: the conflict text shrinks the headline to .035 H (M2 is .114), so the page loses M2's "WARNING" punch.
3. **x1 (63).**
   - It is the most faithful copy of M1, with a neon logo and cap .094 vs .100.
   - Held back by: the SO notice sits on top of the modal's top edge, and the stamp makes the headline and fine print illegible. The result looks cluttered rather than deliberate.

**Honourable mention: y1's surprise.** Kerney's red-pen rubric ("Taste 0/10", "B+ bold choice, see me after class. – K.") is the funniest of the six for this exact room. Port it; don't ship y1.

## Fix lists

**x3**
1. Scale WARNING up to about .12 H (it is .078 now) and tighten the modal padding so it fits.
2. The neon "Date" glyph shows a stray swash or underline artefact under the "e" at 1440. Clean up the path or font subset.
3. Raise the terminal's z-order only after the jolt. Shrink it about 15% at 1024 so it clears the badges.
4. Fill the dead blue band under the grid (about 90 px at 1440). Add a 4th row or stretch the tiles.
5. Give the tiles warm, noisy, blurred gradients instead of flat mauve, to fake the photo blur.
6. Add a favicon (it causes the 404).

**x2**
1. Keep one big WARNING (.11 H) above the conflict, and put the conflict on the subline "THESE GATES ARE 18+ / 0b10010+".
2. Raise the lens line from 0.78 to 1 u. It is unreadable on a projector.
3. Give AND : ENTER the primary weight, with OR and XOR secondary, as M2 does.
4. Apply x3's fixes 2, 4, 5 and 6 here too.

**x1**
1. Move the SO notice so it docks above the modal (or replaces the logo row) instead of overlapping the modal top.
2. Stamp across the empty space between the headline and the buttons, not over the text. Keep "18+ ...BITS!" readable.
3. Apply x3's fixes 4, 5 and 6 here too.
4. Optionally make ENTER primary.

## Sheet
`sheet.png` has all six at 1440, labelled with their overall scores. M2 (`c20f7340`) is at half scale in the corner.
