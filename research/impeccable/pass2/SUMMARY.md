# Impeccable detect: pass 1 vs pass 2

Pass 2 runs with `.impeccable/config.json`, which suppresses only the rules Tony marked intentional:
side-tab, bounce-easing, repeating-stripes-gradient, radial-halo, codex-grid-background, dark-glow,
and overused-font for the value Roboto only.
"Baseline" is the same target scanned with `--no-config` before the pass-2 fixes, so it matches pass 1.
URL scans ran against `npx vite --port 3100`, viewport 1280x800 unless noted.

## Why the logic and /date.html URLs were empty in pass 1

- **Logic (`/`)**: the scan worked, and the page has zero findings at 1280x800. The CLI prints nothing
  when nothing is found (`--json` gives `[]`, exit 0). I checked this with a control page: the same app
  plus one injected low-contrast `<p>` reports exactly that one finding. So the detector does see the
  logic DOM. Scanning with `?coach=c` (no tour veil) is also clean. At 1920x1080 (projector size) it
  reports 2 `clipped-overflow-container` findings: `div.app` and `div.react-flow` clip positioned children.
  Both are expected in a canvas editor.
- **`/date.html`**: this file does not exist. Date mode's entry is `date-aleph.html` (see `vite.config.js`).
  Vite's SPA fallback serves `index.html` for unknown paths, so pass 1 scanned the logic page again, and
  it was clean. The real date-mode results are `url-date-aleph*.txt` (main page, `?game=1`, `?canvas=1`).

## Counts (all rules, primary findings)

| target | baseline (pass 1 / no-config) | pass 2 |
|---|---|---|
| src/ (static) | 25 (bounce 14, grid 4, font 3, side-tab 4) | 0 |
| research/ mockups | 184 (side-tab 39, dark-glow 35, stripes 35, halo 34, low-contrast 25, border-accent 14, all-caps 2) | 41 (low-contrast 25, border-accent-on-rounded 14, all-caps-body 2) |
| / (logic) | 0 | 0 |
| /?coach=c | 0 | 0 |
| /?coach=c @1920x1080 | 2 clipped-overflow | 2 clipped-overflow |
| /date.html (= logic via fallback) | 0 | 0 |
| date-beta.html | 7 (low-contrast 4, cramped 2, halo 1) + 2 advisory | **0** |
| date-aleph.html | 40 incl. dark-glow 14; low-contrast 2, cramped 1 | 18; low-contrast 1, cramped 1 |
| date-aleph.html?game=1 | 57 incl. dark-glow 13; low-contrast 19, cramped 1 | 22; low-contrast 1, cramped 0 |
| date-aleph.html?canvas=1 | 32 incl. dark-glow 7; low-contrast 10 | 17; low-contrast 5 |

## Residual low-contrast / cramped (real vs false positive)

- date-aleph `#fee51f on #fdf6fd`: the `.y` yellow word ("18+") has a text stroke that the detector ignores.
  The stroke is now dark plum `#7a0b45` instead of gold, so it reads. The finding stays.
- date-aleph `cpill`: the compat meter bar. The fill is flush by design. Left as is.
- canvas "Tap a 0/1...", "NAND", "NOT", "XOR, OR" (analytic-gradient+alpha): false positive. The text is white
  or pink on the dark or blue surface (checked in a screenshot). The detector resolves the tiled grid gradient wrongly.
- game "NOT" pixel contrast on svg underlay: the tile label over the gate glyph. Minor; left as is.
- research/ mockups: 25 low-contrast findings (`#3a1d3f on #2a1830`). These are archives, so they are only reported and not fixed.

Not in scope and left untouched: ai-color-palette, text-occlusion, marquee, tight-leading, undersized-ui-text
(the date-aleph prototype is stashed).
