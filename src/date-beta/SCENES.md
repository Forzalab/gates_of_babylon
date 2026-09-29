# date-beta scene contract

`scenes.json` is loaded by `loadScenes(data, { manifest, art })` in `engine.js`. Anything off-contract (an unknown key,
a `go` to a missing scene, an asset id missing from `assets.json` or of the wrong kind) throws at load with
`date-beta scenes: <scene>[<beat>]: <reason>`.

## Beat

| field | type | default | meaning |
|---|---|---|---|
| `text` | string, max 12 words | `""` | The line. `{OR}` is the only OR mark. |
| `speaker` | string \| `false` | from a `NAME:` prefix in `text`, else narration | Who says it. If set, `text` is used as written (no prefix parse). `false` = narration, text as written (a sign read out: `NEXT: this {OR} that.`). |
| `choices` | 1-2 choices (below) | none | The beat waits for a pick. |
| `timer` | seconds > 0, choice beats only | none | Counts down, frozen while paused (P) or the tab is hidden. At 0 it picks the `default` choice, else the pink one. If that choice is disabled it picks the other enabled one. If none is enabled, nothing is picked. |
| `scare` | 0, 1 or 2 | scene's `scare`, else 0 | Dread level. |
| `bg` | manifest id (`BG-03`) or art name (`rooftop`) | carried from the previous beat or the scene | Background. An id draws `ASSETS.src(id)`, a name draws the art component. |
| `sprite` | manifest id or art name | none | Layer drawn over the bg. |
| `sfx` | manifest id (`SX-37`) or cue name (`wind`) | none | Sound played when the beat appears. |
| `set` | flat flags object | none | Merged into the flags when the beat is reached. |
| `props` | object | carried forward | Art state. |
| `hold` | ms | 500 (minimum) | No click, key or pick is accepted before this. |
| `auto` | ms, at least `hold` | none | Auto-advance. Not allowed on a choice beat. |
| `wait` | `click`, `start`, `auto`, `choice` | inferred | What moves the beat on. |
| `motion` + `rmAlt` | bool; `same`, `hard-cut`, `static`, `skip` | `false`, `same` | A motion beat needs a reduced-motion alt. |
| `vary` | `{ flag: { value: { text?, speaker?, props?, sprite?, bg?, sfx? } } }` | none | Per-value overlay for a declared flag (see Flags). Only these six look fields can vary; `choices`, `timer`, `set`, `wait` etc. cannot, so the scene graph is the same for every value. |

## Choice

| field | type | meaning |
|---|---|---|
| `text` | string, max 12 words | Button label. An action fragment ("Drink", "Stand up"), not a full sentence. No trailing period (the loader rejects it). |
| `side` | `pink` or `purple` | Defaults by position (pink, then purple). |
| `default` | bool | What the timer picks. At most one per beat. |
| `if` | flags object | Enabled only when every key equals its flag. A missing flag reads as `null`. A disabled choice is shown but can't be picked. |
| `set` | flags object | Merged in on pick, before `go` is resolved. |
| `go` | scene id, or a list like `[{ "if": {...}, "to": "x" }, "fallback"]` | Jumps to the first entry that matches. If nothing matches (or there is no `go`), play moves to the next beat. |

## Scene

| field | meaning |
|---|---|
| `id`, `title`, `enter` (`cut`/`fade`), `bg`, `scare`, `beats` | As before. |
| `defaults` | Flags object. Skipping the scene (Esc or S) merges these in, so the flags look as if the scene had played its default path. |

Flag values are strings, numbers, booleans or `null`. Root keys: `version`, `note`, `flags`, `scenes`.

## Flags and `vary` (echo rule)

| field | where | meaning |
|---|---|---|
| `flags` | root | Declared pick flags: `{ "bento": ["umeboshi", "tamagoyaki"] }`. Each is a non-empty list of distinct strings. The first value is the fallback. A declared flag can only be `set`, tested (`if`, `go` `if`) or defaulted to one of its values, or `null`. |
| `vary` | beat | One entry per declared value, all required, no extras (`{}` = same as the base beat). Entries are checked like beats: 12-word text, `{OR}` rule, speaker, asset ids. |
| `beatView(beat, flags)` | engine | What the player sees: each varied flag's entry laid over the beat. An unset or unknown value uses the first declared value. Variant `props` merge over the beat's carried props for that beat only. Nothing a variant sets carries to the next beat. |
| echo lint | loader | Text containing `umeboshi`, `tamagoyaki`, `sour`, `sweet`, `すっぱい` or `甘い` (whole words, any case) fails unless the beat varies on `bento` and every value has its own `text`. Choice labels are linted too, except on a choice that sets the flag (the rooftop pick). |

Rooftop sets `bento` with a no-timer pick. Skipping the rooftop defaults it to `umeboshi`.

## Choice buttons (Tony, Mon 9/28)
- No number key on the button. Keys 1/2 still pick, but nothing is drawn.
- Label centred, 58px (was 44px left-aligned).
- Label = action fragment. No trailing period. Applies to every choice.

## Branch map (debug, Tony's test tool)
- `~` (Shift+Backquote) or `?debug` opens it. Esc, `~` or the Close button closes it. Timer and auto beats freeze; game keys do nothing.
- Click a pink/purple pill (an edge) to play that choice from its beat. Only branching choices get a pill: different scenes, or a flag something reads (`bento`). Stay/leave and Back to start stay thin lines.
- If the branch reads an earlier pick you have not made (e.g. `bento`), a dialog asks for it. "Remember this choice at reload" keeps picks in `localStorage` (`dateBeta.debug.<schema hash>`); off by default. Reset picks clears them.
- A normal boot (no `?debug`, no `~`) never reads saved picks. Code: `debug.js` (pure), `Tree.jsx`, `jumpTo` in engine.js.
