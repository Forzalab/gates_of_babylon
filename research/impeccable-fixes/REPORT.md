# Impeccable fix variants A / B (date-beta + Logic)

Engine: alt branch `origin/ccr-ed715d8f-aootws` @ 6907561, read via worktree. `src/` untouched.
date-aleph and `src/date/` are archived, so they're out of scope and weren't scanned.

View: copy `research/` into an alt-branch checkout, `npx vite --port 3000`, open
`/research/impeccable-fixes/{A,B}/{index.html,date-beta.html,date-beta.html?scene=door}`. Each mockup page is the
alt-branch entry HTML plus one `<link>` to that variant's `fix.css`. The file is prefixed `html[data-mode]` so it wins over Vite's runtime CSS.

Impeccable 4.1.0, `detect --viewport 1920x1080 --json`, no-sandbox Chromium wrapper.

## Findings

| Page | Baseline | A (chips/scrim) | B (type+colour tokens) |
|---|---|---|---|
| `/` Logic | 2 | 0 | 0 |
| `/date-beta.html` title | 9 (7 warn + 2 advisory) | 3 (1 warn + 2 adv) | 3 (1 warn + 2 adv) |
| `/date-beta.html?scene=door` | 2 | 0 | 0 |
| **Total** | **13** | **3** | **3** |

What's left on the title in A and B is `radial-halo`, `repeating-stripes` and `codex-grid-background`. The detector
reads the authored rules in `src/date-beta/art/splash.css` and `beta.css`, so an override can't clear them. Both variants
set the halo to `background-image: none`, so it's gone from the render. To clear the flag, delete the `radial-gradient`
at splash.css:15. That's a one-line src edit for the engine owner, and I didn't make it.

Shots (1920x1080): `shots/{base,A,B}-{logic,title,door}.png`.

## Variant A: chip / scrim containers
Tokens: `--chip-bg: var(--scrim)` (#1A0710, opaque), `--chip-ink: var(--scrim-ink)` (16.8:1), `--chip-rim: var(--pink)`,
`--chip-pad-y: .5em`, `--chip-pad-x: .9em`, `--card-surface: #fff3f8`.
- `.chrome` opacity 1. skip/fullscreen are opaque scrim pills with a pink rim, 16px. `.nexthint` and `.db-paused` use the same chip.
- Splash hero: flat surface. The pink disc comes back as a hard-edged, outlined sticker. The kicker is a scrim pill and the subtitle is an outlined label.
- Padding rule: every text box gets vertical padding of at least .3em (nav items, `.mini` cards).
- Logic: `.app` and `.react-flow` get `overflow: visible` + `clip-path: inset(0)`. The crop looks the same, with no overflow trap.

Design-school check (VN textbox / otome / DDLC / Yandere Sim): this is the genre's own solution. System buttons (skip/auto/fullscreen)
sit in opaque, rimmed capsules because the art under them changes every scene. The pills reuse the R2b OR-rule-C scrim, so the
dark chip matches the dread box, which suits cute-then-wrong. They read at projector distance on any BG.

## Variant B: type + colour token shift
Tokens: `--t-chrome: 18px` (was 14), `--t-lead: 1.4`, `--ink-hi: #fff`, `--ink-bg-hi: #000` (alpha 1),
`--card-ink: #2a0f24`, `--card-ink-2: #5a1440`, `--card-surface: #fff3f8`.
- Opacity and alpha are banned on text-bearing chrome. skip/fullscreen are white on black at 21:1, 18px, square corners.
- Splash: flat hero surface. Kicker and subtitle ink is darker and the subtitle goes bold. No new boxes.
- Padding comes from the type tokens (.3em block padding on 34px labels).
- Logic: `overflow: visible` + `contain: paint` (paint containment crops without being an overflow container).

Design-school check: B is the purer Swiss/NYCTA move (Vignelli/Noorda, Müller-Brockmann): no ornament, fixed with a type
scale plus black/white. On date-beta it's weaker. The black squares read as debug UI next to glossy candy pills, and they
drop the otome capsule language.

## Logic mode general pass
It already follows Swiss/NYCTA: a 3-column rule grid, flush-left numbered zones 01/02/03, one signal colour (#ff5a1f), white paper,
2px rules and no ornament. The only live flags were the 2 overflow clips, and both variants fix them. The static `theme.css` scan
flags Roboto Flex as "overused font". **Kept.** It's a neo-grotesk in the Helvetica/Standard line NYCTA used, and font trials are already running on the alt branch.

## Brand/parody flags kept on purpose
- `repeating-stripes-gradient` (dialogue chip pins, NO SIGNAL scanlines): the chip is an IC package, and the scanlines are the fourth-wall gag.
- `codex-grid-background` (splash pink grid): the fake-website parody, on purpose.
- `radial-halo`: gone from the render in A and B. The flag stays only because the rule is still authored in src.
- `side-tab` (glossy `.db-choice` bottom stripe, static scan): the R2c glossy button base, which is brand.
- Roboto "overused" (Logic + Roboto Condensed in date-beta): Swiss lineage, and Roboto Condensed is the spec R2b body face.

## Pick
**A for date-beta, and B's `contain: paint` for Logic.** A keeps the otome capsule language and reuses the R2b scrim token.
B's black chrome clashes with the candy UI. For Logic, `contain: paint` is one declaration with no visual side effects.

## Weak spots
- A's flat pink disc on the hero reads a bit empty. It could hold the NAND mark, or be dropped.
- Neither variant clears the 3 authored-CSS flags without a src edit.
- `overflow: visible` on `.react-flow` has only been checked at the default zoom. Pan/zoom at the frame edge isn't tested.
