# date-beta scene contract

`scenes.json` is loaded by `loadScenes(data, { manifest, art })` in `engine.js`. Anything off-contract (an unknown key,
a `go` to a missing scene, an asset id missing from `assets.json` or of the wrong kind) throws at load with
`date-beta scenes: <scene>[<beat>]: <reason>`.

## Beat

| field | type | default | meaning |
|---|---|---|---|
| `text` | string, max 12 words | `""` | The line. `{OR}` is the only OR mark. |
| `speaker` | string | from a `NAME:` prefix in `text`, else narration | Who says it. If set, `text` is used as written (no prefix parse). |
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

## Choice

| field | type | meaning |
|---|---|---|
| `text` | string, max 12 words | Button label. |
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

Flag values are strings, numbers, booleans or `null`. Root keys: `version`, `note`, `scenes`.
