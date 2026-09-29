# Figur collapse: Impeccable pass

Branch `figur-collapse` (from `ccr-ed715d8f-aootws` 59d233b). Impeccable 4.1.0, `--viewport 1920x1080`, Chromium 1194 via the no-sandbox wrapper, served by `vite preview`.
"Before" = a build of 59d233b; "after" = this branch.

## Live URLs

| Page | Before | After | Notes |
|---|---|---|---|
| `/` (Logic) | 2 | 2 | Same 2 `clipped-overflow-container` flags on `div.app` / react-flow as run 1. Not touched: Logic's look must not change. |
| `/date-beta.html` | 0 (fake-site splash) | 0 (rooftop, scene 1) | The page now opens on the rooftop, as if START had been pressed. |
| `/date-beta.html?scene=door` | 0 | 0 | |

Static scan of the new or changed CSS/JSX (`src/collapse.css`, `src/date-beta/beta.css`, `src/date-beta/main.jsx`): 0 findings.

## Mid-build check (dropped with the spec change)
Tony's first brief had a title screen that faded in, then the rooftop over the title. That scan found 1 `low-contrast` flag on the title. It was a false positive: the scan caught the subtitle mid-fade (2.9:1, 15.5:1 at rest). The 18:05 spec update removed the title screen, so the flag went with it.

## Kept flags
- Logic `clipped-overflow-container` x2: `.app { overflow: hidden }` is how the Logic frame is built. A fix would change Logic's normal look, which this task must not do. The earlier fix variant B (`contain: paint`) is still waiting on its owner.

## The collapse frames
The frames are brief states that no URL can reach, so Impeccable cannot scan them live. Each frame was checked by hand and by `shots.mjs` instead:
- Frame changes come at most every 500 ms (2 Hz). The 334 ms floor and the 3-per-second cap are asserted in `src/collapse.test.js`.
- The screen goes from light to black once (f3 pile, then f5 void) and never flips back before Date. The rooftop then fades in over 700 ms, the same entry START used.
- The f4 palette glitch swaps tokens at similar luminance on 3 of 16 tiles (18.75% of the viewport, under the 25% limit). Nothing is red.
