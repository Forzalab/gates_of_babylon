# Font trials (replacing Roboto Flex / Roboto Condensed)

Trials only: the defaults are unchanged. Add `?font=<name>` to any logic-mode URL or date-beta URL
(`src/fontTrial.js` sets `<html data-font>` and lazy-loads `src/font-trials/<name>.css`, which re-points
`--font/--font-help/--font-label` in logic mode, `--cond/--btn` in date-beta, the logic wordmark, and the
date-beta splash title/logo). All fonts are self-hosted through @fontsource. A normal load fetches no trial CSS.

Out of scope: Bangers is still the comic display face in the date-beta art and buttons (START, "UNIVERSAL").
Bangers is not Roboto, and it carries the manga voice.

Shots are 1920x1080, `<page>-<variant>.png` for pages `logic` (/), `splash` (date-beta.html) and `choice`
(date-beta.html?scene=door&beat=2). `sheet-<page>.png` puts all five side by side.
Note: `logic-current` shows the first-visit coach overlay. The later shots ran in the same browser context,
so that overlay was already dismissed for them. The font comparison is not affected.

| name | body / UI | display | why it fits | legibility at projector distance |
|---|---|---|---|---|
| `inter` | Inter Tight | Inter Tight 900 italic | Already a dependency. Neutral and tight like the current grotesk. | Very clear, with a large x-height. It is wider than Roboto Condensed, so the date dialogue wraps to 2 lines. Its character is close to Roboto, so it barely answers the "overused" flag. |
| `rounded` | M PLUS Rounded 1c | Nunito 900 | Rounded terminals read as soft, cute anime UI and suit the glossy pink buttons. It has Japanese glyph coverage. | Friendly and clear. The widest option, so it wraps dialogue and the "cookies" chip. It gets heavy in the truth table. |
| `barlow` | Barlow, plus Barlow Condensed for labels and date body | Barlow Condensed 900 (italic) | Same condensed role and metrics as Roboto Condensed, so layouts hold. It has a sporty/HUD edge that fits a puzzle game, and the italic 900 splash title sits well next to Bangers. | Nothing wraps. The date-beta text is darker and punchier than the current version. Tiny labels (poll bar, help) get cramped at 900/800, so those weights need trimming. The wordmark turns too compressed ("Figur" squashes). |
| `grotesk` | Space Grotesk | Space Grotesk 700 | Quirky techno grotesk that suits the logic/circuit side. | Its 1 has a flag that reads badly in the truth table at a distance, and it looks less anime. It wraps dialogue. It is also a common "AI-default" pick, so it risks a repeat of the overuse flag. |

## Top pick: `barlow` (Barlow + Barlow Condensed)
It is the only candidate that swaps in without breaking the date-beta layout. It has condensed metrics like
Roboto Condensed and does not wrap. At 1080p it reads crisp and heavy for a projector, and its condensed italic
display pairs naturally with Bangers.
Before adopting it: keep Roboto Flex (or use Barlow 800, not condensed) for the logic wordmark, and drop small-label
weights to 600-700. Runner-up for date mode: `rounded`, if the anime softness matters more than the fit.
