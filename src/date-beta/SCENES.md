# date-beta scene contract

`scenes.json` is loaded by `loadScenes(data, { manifest, art })` in `engine.js`. Anything off-contract (an unknown key,
a `go` to a missing scene, an asset id missing from `assets.json` or of the wrong kind) throws at load with
`date-beta scenes: <scene>[<beat>]: <reason>`.

## Beat

| field | type | default | meaning |
|---|---|---|---|
| `text` | string, max 30 words | `""` | The line. `{OR}` is the only OR mark. Styled spans (train-r4): `{wavy:words}` (italic teal, wavy underline) and `{hat:words}` (bold orange, cap chip). The words stay plain text for voice, aria and OCR. |
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
| `card` | `"goal"` | none | Draws the goal card over the beat (rooftop beat 0, the first thing after the Figur collapse). A card beat waits for a click (GOT IT ▸). |
| `end` | `steeped`, `escape`, `leave` (lowercase name) | none | The ending title beat. It must keep its `Back to start` choice: the result card (win / almost / low) replaces the chip and choices, and its button takes choice 0. |
| `loveHidden` | bool, choice beats only | `false` | The ♥ chips on this beat's buttons read `♥ ??` instead of the number (same chip, size and colour). Only the display changes: the pick scores as usual and the pop / meter show the real change afterwards. Used for variable reward: about half of the choice beats plus every consequential one (see `research/sprint-0930/alt-test/LOVE-AUDIT.md`). |

## Choice

| field | type | meaning |
|---|---|---|
| `text` | string, max 12 words | Button label. An action fragment ("Drink", "Stand up"), not a full sentence. No trailing period (the loader rejects it). |
| `side` | `pink` or `purple` | Defaults by position (pink, then purple). |
| `default` | bool | What the timer picks. At most one per beat. |
| `if` | flags object | Enabled only when every key equals its flag. A missing flag reads as `null`. A disabled choice is shown but can't be picked. |
| `set` | flags object | Merged in on pick, before `go` is resolved. |
| `go` | scene id, or a list like `[{ "if": {...}, "to": "x" }, "fallback"]` | Jumps to the first entry that matches. If nothing matches (or there is no `go`), play moves to the next beat. |
| `love` | whole number -5..+5 | The score change. Default 0 (no pop, no reaction frame). |
| `emote` | `heart`, `hearts`, `sweat`, `pout`, `or`, `crack` | Her face + bubble on the reaction frame. Default from `love`: +3 and up hearts, +2 heart, +1 sweat, -1 pout, -2 or, -3 and down crack. Needs a non-zero `love`. |
| `react` | string, max 30 words | Her line on the reaction frame (speaker NANDA, `{OR}` allowed, echo-linted). Missing = the chip keeps the question line. Needs a non-zero `love`. |
| `tell` | bool | Show the "She liked that." / "She did not like that." line under the delta pill. Default true when `love` is not 0. |
| `pass` | bool | A scored pick with **no reaction frame**. Play moves on at once, and the pop (delta pill, emote bubble, FX) shows on the next beat she is on. It cannot have a `react`. Used by Scene A's merged beat and its smile tag. |

## Scene

| field | meaning |
|---|---|
| `id`, `title`, `enter` (`cut`/`fade`), `bg`, `scare`, `beats` | As before. |
| `defaults` | Flags object. Skipping the scene (Esc or S) merges these in, so the flags look as if the scene had played its default path. |
| `nanda` | bool. Is she on screen in this scene? Default: true when any beat (or `vary` variant) has a NANDA line. Drives the HUD bar and her sprite. |
| `short` | 1-8 uppercase characters. The scene's name on the route trail. Default: `END` for a scene with an `end` beat, else the id in capitals. |

Flag values are strings, numbers, booleans or `null`. Root keys: `version`, `note`, `flags`, `love`, `scenes`.

## Love (HUD)

| rule | meaning |
|---|---|
| root `love` | `{ "start": 0, "goal": "auto" }`. The loader walks every path from scene 1 to an ending (`end` beat, a choice back to scene 1, or the end of the script) following sets, `if` and `go`, and takes the best total (clamped at 0 on the way, like play). `goal: "auto"` uses that. A written number must equal it, so a new branch can never make 100% unreachable or reachable by accident. A loop in the graph fails the load. Shipped goal: 16 (STEEPED, all pink picks, tamagoyaki). |
| `pos.love` | The running score, clamped 0..goal. Shown as a percentage: 100% only when full. A choice back to scene 1 starts a new run at `start`. `?love=N` starts there (testing). |
| present | `scene.nanda` and the beat's bg is not `blackout`. The ribbon (meter, route trail, beat pips) and her sprite show only then. She also shows on any NANDA line. |
| reaction frame | A pick with `love` where she is present: same bg, choices gone, the chip shows `react` (else the question line), her `emote` with a big bubble, the delta pill + tell line under the ribbon. Holds at least 500 ms, then click / Space / Enter / → / NEXT goes on to where the pick went. Esc just closes it. |
| deferred pop | A pick with `love` where she is absent (the basement) changes the score at once; the pop and emote show on the next beat where she is present. |
| skip | Esc / S scores every pick it passes over as the timer would pick it (`default`, else pink). The pick it lands on (a branch) is not scored. |
| timer | The auto-pick scores like a click. |
| ending card | On the `end` beat (endcard.js): 100% = the win card. STEEPED / ESCAPE / ESCAPE? (steeped, escape-win, escape-timeout) keep their own ENDING card at any love %. Any other ending below 100% is a real loss: the GAME OVER card with one of her ~8 fail lines, picked by seed + run, by ending and by love band (60-99% almost, below 60% low). PLAY AGAIN / TRY AGAIN go back to the rooftop at love 0. |
| trail | Scenes entered this run (filled), this one (a capsule with `short` and one pip per beat, or `n/N` over 8 beats), then the shortest route to an ending (hollow; the ending is a heart). |

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

## Scene A camera + chrome: `props.cut` (packs/scene-a.json, SceneA.jsx, Nanda.jsx)
Props carry forward inside a scene, so every beat that uses `cut` sets its own. A `vary` entry that changes it gives the whole `cut`.

Every change is a hard cut or **one** stepped swap at ≥ 500 ms, the same under reduced motion. Nothing is tweened.

| field | meaning |
|---|---|
| `frame` | Her camera. `medium` (default) is the usual sprite. `off` hides her sprite (bg-only / food shots). `handout` puts her behind the box she holds out. `pov` shows her small, across from you, behind the food. `eyes` is an extreme close-up that fills the stage. `peek` is her huge face behind a raised dialogue bar, with the box in the foreground. `close` fills about half the frame, in front of the dialogue box's right end, and shoves the HUD. Big frames drop the thought bubble. |
| `face` / `face2` | Her face id: `art/nanda.js` `SCENE_FACES`, or any `FACES` key such as `hate`. `face2` replaces it once the beat has stepped. A reaction frame keeps the emote's face. |
| `raise` | `true` = her raised pose (as on choice beats), so a 3-line box never covers her face (train-r4). |
| `lead` | A line shown first, on top, in the same box. The beat's own line reveals under it after `step` ms. Voice plays the lead's take, then the beat's own. |
| `at` | Split the beat's line at this text. The rest reveals in place after `step` ms. |
| `step` | ms before the reveal (≥ 500, default 600). Hidden text keeps its space, so the box never jumps. Put the beat's `hold` ≥ `step`, so no pick or NEXT comes before it. |
| `sharp` | No focus blur behind the dialogue: food inserts, the eyes cutaway, the stamp. |
| `handout` | `{ tama: i, ume: j }`. Her bento replaces `<Choices>`, and the two foods are the buttons for choices i and j. Any other choice stays a small pill. Keys 1–3 still pick. |
| `tag` | On a beat with exactly one choice: that choice is drawn where NEXT sits ("smile ♥ +1"). A click anywhere, Space or Enter takes it. |
| `food` | `tama` or `ume` for the `pov` / `peek` foreground. |

## Live routes to the endings (packs/leave-route.json, test: src/date-beta-leave.test.js)
- STEEPED: rooftop Stay/Walk → v2-park … v2-home 4 **Sit down** → cup → Drink/Hold → steeped.
- ESCAPE: … cup 4 **Stand up** → unknown → escape 15 → escape-win (Leave her house) | escape-timeout (Wait for her).
- LEAVE: rooftop 11 **Leave before the rain** → leave, or the full day then v2-home 4 **Say goodnight** → leave; leave 3 → leave-yeah (uhmmm yeah ig / Forever sounds long) | leave-fu (FUCK YOU). Flag `left` (home | roof) picks leave 0's bg (her door 12 | the rooftop).
- The old night-walk spine (park … door, genkan-in) stays in scenes.json but is off the live path.
