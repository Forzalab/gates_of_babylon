# Emotion FX research (sprint 0930)

Scope: still, no-motion FX for the gacha love meter. Research only, no game code.
Hard rule: NO animation. Stills first; at most a stepped swap of two stills, each held >= 500 ms (<= 2 Hz), and only if prefers-reduced-motion is not set. Default = still.

## 1. Sources

- TV Tropes, Cross-Popping Veins: https://tvtropes.org/pmwiki/pmwiki.php/Main/CrossPoppingVeins
  Cross/Y-shaped vein on forehead or fist when angry. Extra veins may pop in the air around the character.
- TV Tropes, Love Bubbles (the "Bubble Background" trope): https://tvtropes.org/pmwiki/pmwiki.php/Main/LoveBubbles
  Romantic moment = pastel background with lots of bubbles.
- TV Tropes, Sparkle Background / "Bishie Sparkle" (page found via search): https://tvtropes.org/pmwiki/pmwiki.php/Main/BubblyTropes
  Pretty people sparkle. Also see Japanese Visual Arts Tropes: https://tvtropes.org/pmwiki/pmwiki.php/Main/JapaneseVisualArtsTropes and Manga Effects: https://tvtropes.org/pmwiki/pmwiki.php/Main/MangaEffects
- TV Tropes, Shadowed Eyes (not fetched directly; from search snippet): shadowed faces, eyes may stay white. Related: https://tvtropes.org/pmwiki/pmwiki.php/Main/ThunderShock
- TV Tropes, Dramatic Thunder: https://tvtropes.org/pmwiki/pmwiki.php/Main/DramaticThunder
  Thunder/lightning at a critical moment = dramatic, ominous, powerful. Thunder Shock (above) is the shocked-reaction version.
- Emotional Iconography (Univ. of Michigan): https://public.websites.umich.edu/~anime/info_emotions.html
- Explaining anime's visual symbols: https://giannisimone.substack.com/p/explaining-animes-visual-symbols-17-11-13
- Anger mark: https://www.japanesewithanime.com/2020/03/anger-mark.html
  Red, concave 4-sided shape, lines do NOT connect = contour of a popped vein. "Ikari maaku".

Gaps (be honest):
- The MyAnimeList article was NOT found: two searches returned nothing. The three non-TV-Tropes sources above stand in for it. If Tony has the MAL URL, add it here.
- tvtropes.org returned HTTP 403 to WebFetch. TV Tropes text above comes from search-result snippets only, not full pages. Shadowed Eyes URL not confirmed by search; it is the expected TV Tropes path, check before citing.
- Python PIL is not installed. Hex values below are eyeballed from the images, not pixel-sampled. Treat as +/- 10 per channel. Re-sample later (pip install pillow) if exact values matter.

## 2. Per-ref analysis

Layer order below is back to front.

### 01 Shadow-eyes girl (sky, sailor uniform, twin tails)
- Composition: face in upper right third. Blue sky behind. Bangs come down over the eyes. Shadow is a soft-edged dark blob covering the eye band only (about 1/4 of head height), nose and mouth stay visible. Mouth is a small flat line.
- Layers: sky > hair > shadow blob (on top of skin, under bangs' edge) > mouth line.
- Palette: shadow #5A3A45 centre to #7A4A48 edge (dark plum-brown, not black); hair #C98A4E, hair shade #A86A38; skin #F2C9A5; sky #4F8FD8.
- Shape grammar: an irregular, roughly horizontal lens. Hard top edge (hair line). Soft feathered lower edge. Bangs strands are drawn over the shadow so it reads as "under hair".
- Note: no highlight in the eyes at all. That absence is the effect.

### 02 Shadow-eyes dark (tiny, 200x150 webp)
- Composition: close crop, face lower half only. Hair mass covers the whole top. Only nose, mouth (tight, grim) visible.
- Palette: hair #2B2A3C to #4A4A66 (blue-black); shadow #1A1418; skin #B58A66 (dim); background blue #3A5A9A.
- Shape grammar: shadow = hair itself; no separate blob. Value contrast is the point: dark upper 60%, mid-tone lower 40%.
- Low res: use as mood only, not for shapes.

### 03 Red anger-vein / anger-mark icon sheet (8 icons, white bg)
- Composition: 4x2 grid, isolated icons, no face. Each is a separate red mark.
- Palette: red #E01010 to #D60000; white #FFFFFF. Flat, no outline, no gradient; slightly soft edges (blur ~0.5 px).
- Shape grammar by icon:
  1. Top-left: classic anger vein = 4 curved wedges (crescent blades), each concave to the centre, pointing to a square gap in the middle. Wedges are fat at the mid-point, thin at both tips. Lines do not connect.
  2. Three thin slanted slashes (speed marks).
  3. Zigzag bolt streak.
  4. Three exclamation-like tapered strokes with dots.
  5-8. Jagged bolt pairs, box-like fragments, a 2-wedge vein (half of icon 1).
- Use icon 1 for the vein layer, icon 8 (two opposing wedges) for a smaller/secondary vein. Others: optional accents for rage.

### 04 Haikyuu lightning, black bg, rage
- Composition: face front and centre, mouth wide open, pupils shrunken to dots (small white ovals). Lightning fills the whole background, branching, and stops at the head outline. Black fills the cells between the veins of lightning (looks like cracked black rocks).
- Layers: black > glow halo > lightning cores > character (with white outline on the shoulder). Character is fully on top; the lightning never crosses the face.
- Palette: bg #000000; lightning core #F4F8C8 (pale yellow-white); halo #B8D820 to #7FA010 (yellow-green); skin #D08850, skin shade #8A5A38; hair #E8752A; shirt #8E8E70; mouth #7A2A1A.
- Shape grammar: jagged polylines, 3-6 px core, 10-20 px halo. Forks at ~30-60 degrees. Long runs edge to edge, lots of small side spurs. Black "cells" between them are the silhouette shape.
- Density: high, ~35-40% of frame is lightning + halo. Strong value contrast. Face gets rim light from the right.

### 05 Peonies + bubbles, pink bg (small, 350x197)
- Composition: character centre, head at the middle. Two big peonies mid-left and right (each ~30% frame width), both overlapping the shoulders. Two big soap bubbles (upper left, lower right, each ~20% width). Sparkles inside eyes.
- Layers: pink gradient > big soft bubbles > peonies (back) > character > small star sparkle on the eye and the bubbles.
- Palette: bg #F4A6D8 to #C89AE8 (pink to lavender); peony #F7B8D0, peony centre #E08A9A, peony shade #D96C9C; leaf #3A8A6A; bubble fill #E0B8F0 at ~50% alpha; bubble rim #FFFFFF at ~70%; sparkle #FFFFFF.
- Shape grammar: peony = 5-7 layered ruffled petals in concentric rings, darker at the inside. Bubble = circle, thin white rim, radial fill lighter at the edge, tiny glint dot upper-left.

### 06 Couple bubble bg (350x196), and 08 = exact duplicate (same 21051 bytes)
- Composition: couple centre, pale radial glow behind them (white-yellow centre). Bubbles crowd the edges and corners, thinning toward the centre so faces stay clean. Tiny 4-point sparkles and dots between the bubbles.
- Layers: pink/violet radial gradient > white centre glow > large bubbles (edges) > mid bubbles > tiny sparkles > characters.
- Palette: edge magenta #E85AA0, mid pink #F8A0C0, centre glow #FFF4E0, lavender corner #B890E0, bubble rim #FFFFFF, bubble fill #FFD0E4 at 40% alpha.
- Shape grammar: bubbles = circles r 4-15% of frame width, overlapping freely, some with a bright arc rim only. Mix of sizes (big / medium / dots).
- Density: about 20-25 bubbles, more at the edge (~50% area there), few in the middle.
- 08 adds nothing. Ignore it, or delete it to save repo space (Tony's call; left in place).

### 07 Sakura petals on black
- Composition: no character. Petals scattered across the whole frame, big ones at the bottom and right, tiny ones in a trail across the middle. Random rotation.
- Palette: bg #000000; petal fill #E8D0E8 (lilac-white pink) to #F0DCEB; petal edge glow #FFFFFF at ~40% (thin soft halo); shade at the notch #B080B8.
- Shape grammar: a petal = rounded oval, one end slightly pointed and the other with a small heart-shaped notch. 10-20 px to 60 px long. Flat fill, thin bright rim, no line art.
- Density: about 40 petals; sizes on a rough power-law (few big, many tiny).
- Works on both black and pink; on pink use fill #FFE6EF with rim #FFFFFF and shade #F5A3C0.

### 09 Pastel holo hexagons + sparkles + bokeh (Adobe Stock watermark)
- COMPOSITION ONLY. Never trace, never copy shapes, never use the file. Watermarked stock.
- Composition: diagonal gradient pink (top-left) to lavender to cyan (bottom-right), one soft rainbow ribbon sweeping across. About 12 translucent hexagons (frosted glass) in overlapping clusters. 6-8 bokeh rings in the top-right/bottom-right. About 15 sparkles of varied size, one big 8-point star top-left, a few large 4-point stars with long thin rays.
- Palette: pink #F080E0, lavender #C8A0F0, cyan #90E0F0, glass fill #FFFFFF at 25-35%, glass rim #FFFFFF at 60%, bokeh ring #F8F0A0 (yellow-cream), sparkle #FFFFFF.
- What to take: layering idea (gradient > glass shapes > rings > stars), the "big star + many small" size ratio, and hue drift pink-lavender-cyan. Build all shapes fresh.

### 10 Blue 4/8-point sparkle sheet (navy bg)
- Composition: 3x3 sheet of separate sparkles. No face.
- Palette: bg #1C2650 (navy); core #FFFFFF; glow #8CA8FF to #5A78E8; ring lines #6A88F0 at 60%.
- Shape grammar: (a) 4-point star: two thin long rays crossing at 90 degrees, ray length ~10x core width, concave (pinched) sides. (b) 8-point: 4-point + a shorter 45 degree pair (~60% length). (c) soft glow disc at the core (radial gradient white > blue > transparent). (d) ring + small offset dots = lens-flare variants (skip for anime; too "photo").
- Tapered rays: each ray fades from bright to transparent along its length.

### 11 Cheek puff (Tony, added 0930; 600x338)
- Pout: puffed cheeks, flat squashed mouth, brows angled down to the centre, blush hatching on the cheeks, one small teardrop at the eye corner; backdrop = pink halftone polka dots (white field, dots #F4A8C8-ish, bigger/denser at the edges) = the no-motion `anger` backdrop (with the vein); `rage` stays black + lightning. Composition + palette only, never the character.

## 3. FX specs

Shared rules for all FX (still):
- One FX = one static SVG stack, positioned behind/around the character portrait, sized to the portrait frame (viewBox 0 0 1600 900 or the actual frame).
- Effect never covers the face, except shadow-eyes (which is meant to).
- Dialogue box gets its own opaque plate (see a11y) so FX contrast does not matter for reading.
- Random layout = generate once with a seeded PRNG (seed = event id), so the same event always draws the same picture. No per-frame redraw.

### Palette tokens
```
--fx-love-bg-a: #F8A0C8   --fx-love-bg-b: #C8A0F0   --fx-love-glow: #FFF4E0
--fx-love-rim: #FFFFFF    --fx-love-peony: #F7B8D0  --fx-love-peony-deep: #D96C9C
--fx-love-petal: #FFE6EF  --fx-love-petal-shade: #F5A3C0
--fx-love-cyan: #90E0F0   --fx-love-gold: #F8F0A0   --fx-leaf: #3A8A6A
--fx-anger-bg: #000000    --fx-anger-bolt: #F4F8C8  --fx-anger-halo: #B8D820
--fx-anger-red: #E01010   --fx-anger-shade: #5A3A45 --fx-anger-dark: #1A1418
--fx-plate: #1A1020 (dialogue plate)   --fx-plate-text: #FFFFFF
```
Note the pink-vs-black split must stay: love = light, pastel, warm; anger = black + yellow-green + red.

### FX A: love-crit (+5 / +10 surprise crit)
Look: soft pastel "Bubble + Sparkle Background". Lighter and cleaner than love-bomb.
Layers, back to front:
1. Gradient: `<linearGradient>` 135deg, --fx-love-bg-a to --fx-love-bg-b.
2. Centre glow: `<radialGradient>` --fx-love-glow at 70% alpha at centre, transparent at 55% radius (keeps the face area pale = clean).
3. Bubbles, 12-16, mostly near edges: `<circle>`, fill radialGradient (white 0.05 centre > pink 0.35 edge), stroke white 0.7, stroke-width 2; glint = small white `<ellipse>` upper-left.
4. Sparkles, 6-8: 4-point star (see sparkle layer), sizes 12-60 px.
5. Optional 2 small peonies at bottom corners (crit +10 only).
Blend: bubbles `mix-blend-mode: screen` or plain alpha (screen is optional; alpha alone is fine).
Still: everything static. +5 vs +10 = density and count (+5: 12 bubbles, 6 sparkles; +10: 16 bubbles, 8 sparkles, 2 peonies). Do not use motion to show size.
Reduced-motion: identical, since it is already still. Optional stepped twinkle (2 sprite sets, swap every 800 ms) only when motion allowed and never in reduced-motion.

### FX B: love-bomb (pity roll)
Look: everything in love-crit, x2 density, plus holo hexagons, petals and flowers. Reads as "guaranteed jackpot".
Layers:
1. Gradient pink > lavender > cyan (3 stops, --fx-love-bg-a / -b / --fx-love-cyan) plus one soft rainbow ribbon: blurred curved `<path>` stroke 60 px, gradient pink-yellow-cyan, opacity 0.35.
2. Glass hexagons, 8-10: `<polygon>` (6 points), fill white 0.25, stroke white 0.6, stroke-width 2; inner linearGradient white > transparent. Original shapes only (Ref 09 is composition-only).
3. Bubbles, 20-24 with bokeh rings (--fx-love-gold ring, stroke only) on the right side.
4. Peonies, 2-3, large, mid-left / mid-right, partly behind the character. Construction: 3 rings of 5-7 petals (`<path>` teardrops, rotated), fills from --fx-love-peony (outer) to --fx-love-peony-deep (inner), tiny gold-stamen dots centre. Blur a low-alpha copy behind as shadow.
5. Sakura petals, 30-40: `<path>` oval with a small notch, fill --fx-love-petal, edge stroke white 0.5, random rotation, sizes power-law. Scatter over the whole frame, denser at the bottom.
6. Sparkles, 12-18, 1 big 8-point at upper left.
7. Frame vignette: radialGradient transparent centre to --fx-love-bg-a at 25% at the corners.
Filters: `feGaussianBlur stdDeviation=6` on the ribbon and glow only. Skip per-element filters (cost).
Still: one baked layout. Pity vs crit distinction = hexagons + peonies + petals present, plus a small "PITY" text badge (real text, not just FX, so colour is not the only signal).
Reduced-motion: same still. Petals could optionally be 2 alternate layouts swapped at >= 500 ms (allowed only when motion is on).

### FX C: anger (-2 penalty)
Look: mild: anger vein and cheek puff mostly, plus a dim, cold background. NOT the full thunder.
Layers:
1. Background: plain dark red-tinted gradient #2A1016 to #000000 (radial, centre lighter).
2. Vignette black 60% at edges.
3. Face layers: anger vein (1) on the forehead/temple; optional puff (see face layers).
4. 2 small icon-8 style red marks floating near the head (static, "extra veins in the air", per TV Tropes).
Still: yes. -2 = 1 vein. Colour alone is not the cue; also show "-2" in the meter.

### FX D: rage (-5 penalty)
Look: Ref 04. Black + thunder-shock lightning bolts + hidden eyes + big vein.
Layers, back to front:
1. Black rect #000.
2. Halo layer: the bolt paths stroked wide, stroke --fx-anger-halo, width 18, opacity 0.5, `feGaussianBlur stdDeviation=8`.
3. Core layer: same paths, stroke --fx-anger-bolt, width 4, linejoin miter, no blur. Use 6-8 long main paths + 10-15 short spurs.
4. Optional inner black "cells": not needed; black bg does it.
5. Character portrait. Bolts end at the head outline (clip: `<clipPath>` with the head silhouette inverted, or just draw the character over it).
6. Face layers: shadow-eyes + big vein (+ puff optional).
7. Optional red accent marks (icon 2/8 shapes) at the temples.
Bolt path recipe: start on a frame edge, 6-10 segments, each 60-150 px long, angle offset random +/-35 degrees, alternating offset; add a fork every 2-3 segments with 40-60% length. Seeded PRNG.
Still: one baked frame. Do NOT flash white/black. Optional stepped swap between two bolt layouts only if motion is allowed and each is held >= 500 ms; skip by default.
Reduced-motion: single still. That is already the default.

## 4. Face layers (still, on top of the portrait)

Each layer is a separate SVG group anchored to portrait anchor points: `forehead`, `temple`, `cheekL/R`, `eyeBand`. Anchors come from the portrait art data, not hardcoded.

### Layer 1: anger vein
- Refs: 03 (icon 1), TV Tropes Cross-Popping Veins.
- Shape: 4 crescent wedges around a square gap. Each wedge = a `<path>` with two arcs (outer arc convex, inner arc concave), tips pointed. Wedge length ~ 0.4 x icon size, gap between wedges ~ 0.15 x icon size at the centre, and diagonal placement at the 45 degree corners (the X arrangement), so the four wedges make a "#-like burst".
- Path sketch (unit box, top-left wedge): `M 0.10 0.10 C 0.30 0.14, 0.42 0.26, 0.46 0.46 C 0.34 0.34, 0.22 0.28, 0.10 0.10 Z`; mirror horizontally / vertically for the other three.
- Fill: --fx-anger-red, no stroke. Optional: 1 px darker #9A0808 stroke to hold on pale skin. Size ~ 10-12% of head width; placed on forehead/temple, rotated ~ 10-15 degrees.
- Still: static. Size scales with severity (-2 = 1 small; -5 = 1 large + 1 small).
- a11y: decorative; `aria-hidden`.

### Layer 2: cheek puff
- Refs: none among Tony's 10 (no image of a cheek puff was supplied). Based on the trope only: a rounded bulge on one cheek.
- Shape: on each cheek, an extra rounded contour: `<path>` crescent line tracing the puffed jaw, plus a light-pink/blush ellipse. Two variants: (a) puffed = inflate the cheek outline 8-12% outward (needs art change); (b) overlay = 2 small curved contour lines + blush disc.
- Colours: line = the portrait's outline colour (#5A3A2A); blush #F5A0A0 at 40%; highlight #FFFFFF at 35% (small ellipse upper cheek).
- Recipe (overlay): `<ellipse rx=0.09w ry=0.07w fill=blush>` + 2 short arc `<path>` strokes 3 px, `stroke-linecap=round`.
- Still: static. Pair with rage-lite (-2) or sulk. Flagged: need a real puff ref from Tony before final art.
- a11y: decorative.

### Layer 3: shadow-eyes (hidden eyes)
- Refs: 01 (soft blob), 02 (dark hair mass), TV Tropes Shadowed Eyes.
- Shape: eye-band lens across both eyes, from temple to temple, top edge follows the bangs, lower edge soft.
- Recipe: `<path>` lens (about 90% head width x 22% head height) filled with linearGradient top to bottom: #5A3A45 at 0.9 alpha at top, 0.55 at the bottom; blur bottom edge with `feGaussianBlur stdDeviation=3` (using a mask so the top edge stays hard); use `mix-blend-mode: multiply`. Bangs strands drawn ABOVE this layer (the portrait needs a separate bangs layer; if it has none, clip the top edge to the hairline with a `<clipPath>`).
- Rage: darker: #1A1418 at 0.85, and also darken the whole upper face 15%.
- Keep nose/mouth visible; mouth a flat or open line for anger.
- Still: static; no fade. If the portrait is small, drop the blur and use a flat fill.
- a11y: hides expression, so the meaning must not depend on it. Dialogue text says how the character reacts.

### Layer 4: sparkle
- Refs: 10 (shape), 09 and 05, 06 (usage).
- 4-point star recipe (unit box, centre 0,0): `<path d="M0 -1 C 0.06 -0.12, 0.12 -0.06, 1 0 C 0.12 0.06, 0.06 0.12, 0 1 C -0.06 0.12, -0.12 0.06, -1 0 C -0.12 -0.06, -0.06 -0.12, 0 -1 Z">` = pinched, concave-sided, long thin rays. Fill white.
- 8-point: same star + a second one at 45 degrees scaled to 0.6.
- Glow: `<circle r=0.25>` with radialGradient white 0.9 > #8CA8FF (blue-ish, for a cool tint) or > #FFC8E8 (love tint) 0.3 > transparent.
- Sizes: 10, 18, 32, 60 px (ratio ~ 1:2:3:6), few large + many small. Place 1 large one at the eye/cheek highlight (ref 05: sparkle inside the pupil), others on the bubbles' edge.
- Tokens: love sparkle = white core, --fx-love-gold or #FFC8E8 glow; blue variant only for special (e.g. "star" tier).
- Still: static. Stepped twinkle only if allowed (swap two sizes of each star, hold >= 500 ms).
- a11y: decorative; `aria-hidden`.

## 5. Showing it without motion (summary)
- Impact from size, density, contrast and layering, not from movement.
- Crit/bomb tiers: count and size of shapes (crit +5 < crit +10 < bomb).
- Penalty tiers: -2 = vein only; -5 = full lightning + shadow-eyes + vein.
- Reveal: instead of a transition, show a 1-frame "before" (portrait alone) and a "after" (FX) with a hard cut and keep the FX visible until dismissed. No fade, no shake, no zoom (fades are fine as CSS opacity only if the user has no reduced-motion setting and the duration is >= 500 ms; safer to skip).
- All FX sit in ONE `<svg>` with `role="img"` + `aria-label` off, or `aria-hidden="true"` (decorative); the meaning goes into text ("Love +10! Critical") in the meter and a `role="status"` line.
- `@media (prefers-reduced-motion: reduce)`: nothing to turn off, since the default is still. Any optional stepped swap must be wrapped in `@media (prefers-reduced-motion: no-preference)`.

## 6. Accessibility notes
- Flashes: WCAG 2.3.1 limit = max 3 flashes per second (and no large red flashes). Our stepped swap <= 2 Hz with a >= 500 ms hold is inside it, but default is still, so 0 Hz. Rage: no white/black strobe. Bolts are static.
- Dialogue text: never place text straight on FX. Use an opaque plate: --fx-plate #1A1020 at 90-95% alpha, text #FFFFFF. White on #1A1020 is about 17:1 (AAA). Do not use white text on the pink bg: white on #F8A0C8 is only ~1.9:1 (fails). If text must be on pink, use #3A1030 on #F8A0C8 = about 8:1 (passes AA/AAA). On black FX use white or #F4F8C8; both > 15:1.
- Do not carry meaning by colour only: pink vs black must be paired with a signed number ("+10", "-5"), an icon and text label ("Critical", "Pity", "Angry", "Furious").
- Red vein on skin: low contrast against skin (#E01010 vs #F2C9A5 ~ 3:1); it is decorative, so fine, but a 1 px dark stroke helps.
- Screen readers: FX `aria-hidden="true"`; the outcome goes to a `role="status"` live region once.
- Contrast for UI text in the meter is independent of FX; keep meter chrome outside the FX frame.
- Photosensitivity: dense petals + sparkle stills are fine; avoid high-contrast fine checker/stripe patterns (bolt halos are OK; do not repeat them in tight parallel lines).
- Performance: seeded static SVG, <= 300 nodes per FX, blur only on 2-3 groups. Pre-render to PNG/WebP at build time if the frame budget matters.

## 7. Coverage checklist
Refs 01-10: done (08 = duplicate of 06; 09 = composition only).
FX: love-crit (A), love-bomb (B), anger (C), rage (D).
Face layers: vein (1), puff (2, no ref supplied), shadow-eyes (3), sparkle (4).
Open items for Tony: MAL article URL; a cheek-puff ref; confirm delete of 08; re-sample exact palette with PIL.
