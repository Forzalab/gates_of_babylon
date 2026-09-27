# Research: adult-site UI vs dating-sim UI (Builder X)

No explicit content was opened. The sources are design, legal and game-studies pages.
The only adult-site screenshot I used is the age gate we were given, which I measured and did not browse.

## a) Adult-site (tube) UI conventions

### Fonts (the most important)
- **System sans.** Tube chrome is set in the system sans stack (Arial, Helvetica, Verdana), bold for nav and titles, small regular for the rest. The original gate (O) shows it: a bold Arial-like face, a .023 H headline, all caps only in the nav. No webfont is loaded.
- **Why: speed.** Web fonts are "a heavy performance cost", and "the best performing web font is no web font". On slow mobile links the difference is 1–3 s ([web.dev](https://web.dev/learn/performance/optimize-web-fonts), [DebugBear](https://www.debugbear.com/blog/website-font-performance)). Users of these sites "decide fast, often in seconds" ([Scrile](https://www.scrile.com/blog/adult-web-design)), so any font swap that delays the grid costs a visit.
- **Why: no brand voice.** A neutral sans says "utility", not "publisher". The personality lives in the thumbnails, not the type.
- **Implication for us:** Our chrome uses Roboto Condensed, a free OFL face with the same neutral, narrow sans voice as the GATEXX mockup logo. We self-host it through `@fontsource`, so it never waits on a third-party CDN. The loud display faces (Bangers, Yellowtail) appear only inside the modal. That split is exactly the joke: utility chrome, then a shouting pink dialog.

### Colour
- **Palette.** A saturated blue (M ≈ #003ec5, O #00016c) with navy bars and a single yellow accent (O #ffff00, used only on the keyword "adult content" and the GOLD tab).
- **Why.** The dark, cool chrome recedes so the warm skin-tone thumbnails pop. One accent colour means one thing to look at: the keyword and the paid tier.
- **Implication for us:** Keep the blue/navy chrome and the badge blue. Spend yellow once per page (x3's 18+). Our "thumbnails" are live circuits over warm pink/mauve blurs, so the warm-on-cool pop survives without any people.

### Composition
- **Layout.** A dense grid (4+ columns) of 16:9 thumbnails with a view-count badge bottom-right, a search box first in the bar, then category tabs.
- **Why.** Tube sites use "grid-based layouts with dense thumbnails" and navigation that must be "obvious and reachable without friction" ([Scrile](https://www.scrile.com/blog/adult-web-design)).
- **View counts are social proof.** Showing big numbers makes people trust and click, and "a low share count can create negative social proof" ([Medium: UX of Social Proof](https://joydeeproni.medium.com/ux-of-social-proof-b51a644d1309)). We lean into that: our counts are compat % × a fake number, so an incompatible pair honestly shows **0** views. That makes the negative social proof a quiet gag.
- **Hover previews.** Hover-to-preview is the norm, which is why our tiles unblur on hover.

### UX and the age gate
- **Legal pattern.** The gate is a legal pattern. Texas HB 1181 requires verification when ≥1/3 of a site's content is "harmful to minors", and the Supreme Court upheld it 6–3 in *Free Speech Coalition v. Paxton* (June 27, 2025). At least 21 other states have similar laws ([Freedom Forum](https://www.freedomforum.org/age-verification-laws-first-amendment/), [Congress.gov CRS](https://www.congress.gov/crs-product/LSB11354), [Wikipedia](https://en.wikipedia.org/wiki/Free_Speech_Coalition_v._Paxton)). The click-through "I am 18" box predates those laws: it is the minimum good-faith notice.
- **Usability conventions.** Clear language, and a clear "I'm not of legal age" option ([Salespanel](https://salespanel.io/resources/age-verification-popups/), [ui-patterns collection](https://ui-patterns.com/users/3513/collections/age-verification/screenshots)). Friction costs conversions ([Didit](https://didit.me/blog/age-verification-conversion-optimization/)), hence one huge ENTER and a tiny exit. O's measurements match: a filled 38 px primary, outlined secondaries, and fine print about parental controls.
- **What the audience assumes and wants.**
  - Speed and anonymity: no sign-up, no name, nothing to remember.
  - A gate that gets out of the way.
  - Thumbnails that promise what's behind them.
  - Numbers that say "others liked this".
- **Implications for us.**
  - The class recognises this layout instantly (everyone has seen an age gate), so we don't need to show anything adult. The shape of the page carries the innuendo.
  - The exit button is the 4th-wall joke. "I'm not 18" sends you back to Logic mode (`/`), which is where minors, and graders, belong.

## b) Dating sims and visual novels

### Fonts
- **Two fonts.** VNs use a display face for titles and menus and a legible face for dialogue. "The display font can carry the bulk of the theme while body text needs to prioritize legibility" ([Lemma Soft forums](https://lemmasoft.renai.us/forums/viewtopic.php?t=13275)).
- **Handwritten defaults.** Ren'Py's default GUI even ships a handwritten font, ArchitectsDaughter, at 33 px in a 278 px textbox ([Ren'Py GUI docs](https://www.renpy.org/doc/html/gui.html)).
- **The kit's face.** The Wenrexa kit uses italic condensed comic caps everywhere. Bangers (Vernon Adams, OFL, "mid-20th century superhero comics cover lettering", caps only, "best suited for short bursts") is our free match ([Google Fonts](https://fonts.google.com/specimen/Bangers), [GitHub](https://github.com/googlefonts/bangers)).
- **Our split.** Bangers for the shouting lines and pills, Roboto Condensed for the sentence of fine print in x3, and Yellowtail (OFL script) for the neon.

### Palette
- Pastel pinks and lilacs on white, with soft rims and drop-lips instead of hard shadows (K, measured: #ffffff panel, #ec86f4 rim, #f24898 text).
- It reads as warmth, safety and "cute", the opposite of the tube site's cool utility blue.

### Composition
- **ADV layout.** In ADV mode the textbox takes about the bottom eighth of the screen, with a portrait or side image, usually head-and-shoulders ([VNDev Wiki](https://vndev.wiki/index.php?title=Graphical_User_Interface), [Fuwanovel "Anatomy of VNs"](https://forums.fuwanovel.moe/blogs/entry/4226-ui-design-%E2%80%93-an-anatomy-of-visual-novels/)).
- **Expressive sprites.** Sprites need "expressive faces to convey emotions" ([Brave Zebra](https://www.bravezebra.com/blog/game-design-visual-novel-2d/)).
- **Choices.** Choice buttons are stacked, equal-weight pills.
- **Affection meters.** Heart meters show a hidden love score ([Wikipedia: Dating sim](https://en.wikipedia.org/wiki/Dating_sim)).

### Player wants
- **Parasocial warmth.** Affection, communication and intimacy build parasocial relationships, and more playtime deepens them ([TCD dissertation](https://publications.scss.tcd.ie/theses/diss/2021/TCD-SCSS-DISSERTATION-2021-007.pdf), [ResearchGate](https://www.researchgate.net/publication/357640651_Female-oriented_dating_sims_in_China_Players'_parasocial_relationships_gender_attitudes_and_romantic_beliefs)).
- **Safe rejection.** A wrong choice costs a few hearts, not your dignity.

### Implications for us
- **Portrait.** Our portrait is our own AND gate with a face: a wink, blush and a heart bubble, all hand-built SVG. That delivers the "expressive face" beat with no person and no AI art.
- **Compat meter.** Compat % is the affection meter, computed honestly by `sim.evaluate` (matching truth-table rows / 4).

## c) Shared vs different, and what the collision buys us

| | tube site | dating sim | shared |
|---|---|---|---|
| goal | get you in fast | keep you in slow | a gate you must pass |
| type | neutral system sans | display comic caps + legible body | caps for emphasis |
| colour | cool blue + one yellow | pastel pink + lilac | a single hot accent |
| composition | dense grid, counts | one portrait, one box, choices | a centred modal with 2–3 choices |
| promise | "others watched this" | "she likes you" | reward behind the gate |
| exit | tiny, legally required | "No" costs hearts | always a way out |

**Why it jars.** Both genres put a centred modal with a yes/no choice in front of a reward, so the pink VN dialog slots perfectly into the tube-site frame. But their type, colour and tempo are opposites: cool utility sans at speed versus warm comic caps at leisure. Colliding them inside a logic-gate homework app gives three layers of wrong: the wrong genre, the wrong genre again, and the wrong course. The CS surprise on top adds a fourth: the page itself "breaks" the way programs do.

## Sources
- https://web.dev/learn/performance/optimize-web-fonts
- https://www.debugbear.com/blog/website-font-performance
- https://www.scrile.com/blog/adult-web-design
- https://joydeeproni.medium.com/ux-of-social-proof-b51a644d1309
- https://www.freedomforum.org/age-verification-laws-first-amendment/
- https://www.congress.gov/crs-product/LSB11354
- https://en.wikipedia.org/wiki/Free_Speech_Coalition_v._Paxton
- https://salespanel.io/resources/age-verification-popups/
- https://ui-patterns.com/users/3513/collections/age-verification/screenshots
- https://didit.me/blog/age-verification-conversion-optimization/
- https://lemmasoft.renai.us/forums/viewtopic.php?t=13275
- https://www.renpy.org/doc/html/gui.html
- https://fonts.google.com/specimen/Bangers
- https://github.com/googlefonts/bangers
- https://vndev.wiki/index.php?title=Graphical_User_Interface
- https://forums.fuwanovel.moe/blogs/entry/4226-ui-design-%E2%80%93-an-anatomy-of-visual-novels/ (search summary only; the page returned 403 to the fetcher)
- https://www.bravezebra.com/blog/game-design-visual-novel-2d/
- https://en.wikipedia.org/wiki/Dating_sim
- https://publications.scss.tcd.ie/theses/diss/2021/TCD-SCSS-DISSERTATION-2021-007.pdf
- https://www.researchgate.net/publication/357640651_Female-oriented_dating_sims_in_China_Players'_parasocial_relationships_gender_attitudes_and_romantic_beliefs
