# pit4/r2-3: g3 (from r1-1 / f1, run 2)
`date.html?v=g3` and `&next=1`. f1 is unchanged; only 4 exports were added to f1.jsx.

- **School S6, arcade attract mode.**
  - The neon plate is the marquee.
  - ENTER ANYWAY is the PRESS START: its glow blinks in steps, and under reduced motion it holds a steady lit state.
  - The continue screen has a HIGH SCORES table and a 1UP / HI-SCORE / CREDIT HUD with "PRESS ♡ TO MATCH". The HUD is static under reduced motion.
- **Lens M12:** Kerney's note sits on a lilac Wenrexa sticky note. Same words, same pen, no new gag.
- **ONE surprise:** Prof. Kerney graded the gate, with the B+ ring on the portrait corner, the sticky note and a red tick. It comes back on the continue screen as 5TH in HIGH SCORES: "the age gate, B+, - K."
- **Reduced motion (graded):** the pen, sticky, tick and a liked card show at once. IT'S A MATCH is an instant modal that stays up until clicked. There is no flicker, blink or slam. The sound still plays: the jingle, plus the vine boom (CC BY-NC, credited) when the B+ lands.

## Fix list
1. **Sign vs WARNING:** the gap between the g descender stroke and the WARNING cap top is ~15 px at 1440 and ~20 px at 1024.
2. **Dotted seam:** fixed with `paint-order: stroke fill` on the neon.
3. **Cap:** `min(7.5vw,14vh)`. At 4:3 WARNING spans the full panel (M1 layout).
4. **Note:** ≥17 px.
5. **Badges:** the column-1 badges are anchored left.
6. **Feed:**
   - 8 cards (4x2) on navy tubes.
   - An "IT'S A MATCH!! NEW HIGH SCORE" modal with the truth table on a ≥75% like.
7. **Compat pill and truth table (from f2):**
   - The compat pill sits under the fine print.
   - A liked card flips to its live truth table, with ♥ on each row where the gates agree.
8. **PARENTAL CONTROLS (NOT GATE):** added as a footer.

## Deltas (Pillow on the reduced-motion stills; measure.py)
| | 1440 | 1024 | target |
|---|---|---|---|
| cap/H | .116 | .115 | .11-.13 |
| pink | #ec1a86 | #ec1a86 | #f01a88 |
| header/H | .089 | .089 | .085-.10 |
| modal W | .550 | .551 | .52-.58 |
| modal+sign H | .695 | .690 | .55-.70 |
| &clean overlap | 0% | 0% | <2% |
| L/R lum | 3.6% | 0.3% | <12% |

Remaining deltas:
- The modal+sign height is at the top of the band.
- The column-1 badges are on the left, while the mockups have them on the right.
- At 1024 the tick sits beside the B+ ring.
