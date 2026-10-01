# Branch map (`?debug` / `~`) fix, sprint 1001

## What changed
- **Opaque layer.** `.db-tree` is solid `#1a0710`. Nothing from the game shows through.
- **Fixed header, pannable canvas.** Row 1 has the title, picks, "Remember this choice at reload", Reset and Close. Row 2 has the hint plus **Fit / − / % / + / 100%**, styled like the other header buttons. The header is CSS-`zoom`ed by the game scale `k`. The canvas below it scrolls natively and can be dragged anywhere except on a button. Zoom keeps the view centre still.
- **Layout (`debug.js layout(g, o, legacy)`).** The canvas is sized to fit the script; it is no longer squeezed into a 1920x1080 stage.
  - Columns: the longest path from scene 1, as before.
  - Each scene is a **block**: the node, with its branching pills in one column right under it. A thin spine joins the pills to the node.
  - Each block sits at the mean y of whatever leads into it. A pill that leads into it counts with its own y, so a target lines up with its pill. A block is pushed down past the block above it. So boxes can never overlap.
  - Edges go pill right side → target left side (and node right side → target left side for the thin lines), drawn as curves.
- **Box sizes match the layout.** Each node and pill is drawn at exactly the width and height the layout gives it, with `nowrap`. Labels are full and never wrap or clamp. Pill width comes from the label: 10.5 px per char, CJK counts double.
- **Legacy lane.** Scenes where `routeTo(scenes, i)` is `[]` get their own dashed, dimmed lane under the main map, labelled "Legacy · not reachable from scene 1". Its columns count only edges inside the lane. Legacy pills are still clickable, and full opacity on hover.
- **Current scene.** The current scene (`here`) is still highlighted. The map opens at 100% scrolled to centre it.
- **Kept as before:** pill click → prereq ask dialog → `onJump`, the focus trap, Esc to close, and the remember tick. The ask scrim is now `position: fixed`, with the dialog zoomed by `k`.

## Numbers (1920x1080, `date-beta.html?debug`, full play script: 41 scenes, 110 pills)
`node research/sprint-1001/tree/check.mjs <label> --jump --edge=door.3.1` (dev server on :5460):

| | before (c190357c) | after |
|---|---|---|
| node/pill pairwise overlaps, as opened | **369** | **0** |
| overlaps at Fit (23%) | n/a (no zoom) | **0** |
| overlaps at 100% | n/a | **0** |
| labels wider than their box | 0 (labels wrapped to 2–3 lines inside 142 px pills instead) | 0 |
| current scene visible and on top on open | no (buried) | yes |
| pill click jumps (door.3.1 → asks bento → closes → genkan-in) | yes | yes |

An earlier "before" run showed 364 overlaps. That run had the fonts blocked by a node_modules symlink outside the Vite allow list. 369 is the run with the fonts loaded.

Tests: `npm test` 436/436. The old rule "every node inside 1920x1080" is replaced by "every box inside L.W x L.H and no node/pill overlaps", checked on the base script and on the full play script (all PLAY packs). A new test checks that a scene's pills sit in one column under it. `npx vite build` passes.

Screenshots: `before-open.jpg`, `after-open.jpg` (100%, centred on the current scene), `after-fit.jpg`.

## Known limits
- The canvas is large: about 7060 x 3490 px for the full script. Fit (about 23%) shows the whole shape, but pill text is too small to read at that zoom. Use + or 100% to read it.
- Edges can still cross other edges, and a long edge can pass behind a block. The worst cases are the few edges from legacy scenes back into the main lane (for example into `cup`). They are drawn dimmed and loop because their target is to the left.
- Pill widths are an estimate, not a measurement. The estimate is generous, so in-game labels fit with some slack. A label in a much wider font or glyph set could still overflow, and the `clipped` count in check.mjs would catch it.
- No ctrl+wheel zoom and no keyboard pan. YAGNI.
