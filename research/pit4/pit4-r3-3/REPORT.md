# pit4/r3-3: h3 (from r2-2 / g2, run 3)
`date.html?v=h3` and `&next=1`. f1 and g2 are unchanged; h3 rules are scoped to `.v-h3`.

## The ONE surprise, and its punchline (K3)
Prof. Kerney graded the age gate (B+ ring, "bold choice. see me after class."). Under the note, her margin holds a stuck installer, "installing feelings.exe ... 99%", with the red-pen line "est. time left: 4 years (your degree) - K."
- **With motion:** the bar crawls to 99%, sits, jumps back to 12% (error blip), crawls back to 99% and stays. Every step is an instant width swap, not a tween.
- **With reduced motion:** a static 99% bar plus the text; the vine boom sound still plays when the B+ lands. The whole gag reads in the still.
- **Look:** the bar is a Wenrexa pill bar in page tokens, with no Win-98 grey.

## VERDICT-r2 fixes for g2
1. **WARNING cap:** raised by about 10% (font `max(8.6u, 14.8vh)`). My Pillow measure is .131 / .129, which is about .115 by the arbiter's pink-rows method (g2 was .119 by mine vs .104 by theirs).
2. **Modal + sign height:** .690 at 1440 and .596 at 1024.
3. **MATCH window:** it no longer opens on load. It opens only after a ≥75% ♡, docked to the bottom band, ≤.22 H, and the feed stays readable.
4. **Yellow digits:** the cause was class `y` on the agreeing rows, which picked up the global 18+ yellow stroke and the 1.35em size. It is reset for h3, so the digits are white/pink.
5. **Credits:** a 12 px line on `&next=1` (Kenney CC0 and the Vine boom by Business Goose, CC BY-NC) with a link to `sfx/CREDITS.md`. The mute button's title also names the credits file.
6. **HIGH SCORES:** ported from g3, including "5TH the age gate B+ - K.", at .11 H.
7. **Compat pill:** max(13px, 1.2u).

## Checks
- `npm test`, `npm run build` and `npm run e2e` pass.
- 0 page errors and no horizontal scroll.
- The reduced-motion set is the default screenshot set (`shots/*-still.png`), plus one motion set.
- Left/right luminance difference: 3.3% / 3.1%.

Remaining deltas:
- The column-1 badges are on the left (a g2 choice).
- The feed's truth-table text is 12 px, which reads small in Roboto Condensed.
