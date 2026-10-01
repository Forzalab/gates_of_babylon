# The '??' chips (M7b) - explained, Tony picks the UX. No code changed.

## Where
The small pill on the top-right corner of each choice button (`.db-chip`, fx.css:10). Normally it shows the love change: `♥ +1`, `0`, `♡ −1`. On some beats it shows `♥ ??` instead (same colour as the real value: pink up, grey zero, dark down - so the colour still leaks the sign).
Code: `LoveChip` in src/date-beta/Say.jsx:83 (`hidden ? '??' : ...`); rendered by `Choices` (Say.jsx:72), called from main.jsx:390 with `hidden={beat.loveHidden}`.

## What it means in code
- `loveHidden: true` on a choice beat (engine.js, loader accepts a boolean on choice beats only). It changes ONLY the label; the love score still changes on the pick (test: date-beta-lovehidden.test.js).
- Set by packs/love.json (the "variable reward" rule): every other choice beat in play order (45-60%, never 3 shown in a row) plus every consequential choice (options go to different scenes or set a flag: door, cup, errand, lock game, leave, v2-park:4, escape:14...). List: research/sprint-0930/alt-test/LOVE-AUDIT.md.
- Chips only exist on beats where some choice has a non-zero `love`.

## When it shows
On those beats, always, on every choice of the beat. The only explanation today: a one-time legend ("?? = hidden, find out", `.db-legend`, beta.css:430) on the FIRST hidden beat per page load (module variable `legendAt`, resets on reload). After that, nothing explains it; players who skip/miss it see unexplained '??'.

## UX options (Tony picks one)
1. Keep as is (one-time legend). Pro: zero work, preserves mystery. Con: the legend is easy to miss; later '??' read as a bug.
2. Replace '??' with a mystery glyph on the heart (`♥ ?` / sparkle, no digits). Pro: reads as intentional, no "??" typo feel. Con: same "what is it" question without a legend.
3. Show the legend every time hidden chips appear, as a tiny line under the choices ("hidden: it still counts"). Pro: always explained. Con: repeated noise, hurts the suspense.
4. Reveal after the pick: the chip flips from '??' to the real value (`+1`/`−1`) with the heart pop on the HUD. Pro: teaches the meaning by doing; payoff feel. Con: breaks the "variable reward" secrecy a bit, needs small code in Choices/main.
5. Drop colour leak: make hidden chips one neutral colour. Pro: truly hidden. Con: loses the free colour hint some players like.
