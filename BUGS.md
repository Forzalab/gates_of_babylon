# Open bugs: pick one, fix it, open a PR

Live site: http://csci4x.com:6677 · Run locally: `npm ci && npm run dev` · Checks: `npm test`, `npm run build`, `npm run e2e`

**Rules:**
- One bug per branch, named `fix/<short-name>`.
- Open a PR into `main`. Never push to `main` directly.
- Put a before/after screenshot in the PR.
- Orange means logic 1 only.
- The "g" of Figur hanging into the canvas is intentional. Don't "fix" it.

Difficulty: ★ easy · ★★ medium · ★★★ hard

| # | Bug | How to see it | Where to look | Done when | ★ | Taken by |
|---|---|---|---|---|---|---|
| 1 | The delete X and the pin halo both show at once | Hover a part's X, then slide the pointer onto a pin | `src/nodes/index.jsx`, `src/theme.css` (`.remove`, `.port:hover`) | Only one of them is ever visible, with no flicker | ★★ | |
| 2 | Wires and parts hug the top edge of the canvas | Drag a part or a wire near the top border of row 02 | `src/route.js`, `free()` in `src/App.jsx` | Wires and parts keep at least 20px from the canvas top edge | ★★ | |
| 3 | The line drawn while dragging a new wire is jarring | Drag from a pin | `src/Draft.jsx` | While dragging: a straight thin line from the pin to the cursor. On drop: the normal routed wire | ★★ | |
| 4 | Lit knobs look "too fat" on gates | Turn a switch on and zoom in on a gate's knob | `.lit` paths in `src/nodes/index.jsx` | Tony picks A, B or C (ask him) and it matches the lamp's look | ★ | |
| 5 | The NOT/NAND/NOR bubbles in the parts tray have no orange dot | Open the tray (`>` tab) | `src/Palette.jsx` | Tray bubbles look like the ones on the canvas | ★ | Claude (Tray and labels) |
| 6 | Part labels (G1, A, OUT) and the hover grey look out of place | Look at the grey "G1" under a gate | `.plate` in `src/theme.css` | Font, weight and colour use the site's existing tokens (`--ink`, `--ink-2`, Roboto Flex) | ★ | Claude (Tray and labels) |
| 7 | Tour step 1: the hand hides under the "Gates are in here" balloon | Clear site data, reload, look at step 1 | `src/Coach.jsx` | Hand and balloon never overlap | ★ | |
| 8 | Tour step 3: a delete X shows on G2 | Clear site data, reload, go to step 3 | `src/Coach.jsx` | No X shows during the tour | ★ | |
| 9 | 1px step in some gate→lamp wires | Wire a gate to a lamp placed about 1 unit higher or lower | `src/route.js` | The wire is perfectly straight | ★★ | |

To replay the tour: click "Show me how" in the bottom-right cell, or clear the site data.
