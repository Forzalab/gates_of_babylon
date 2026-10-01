# Scene A checks: readability, occlusion, contrast, Impeccable, voice (Agent 2)

**Shots.** Every rooftop beat at 1920×1080 with reduced motion (`?still`) is in `beats/`, 29 PNGs in all:
- both frames of each two-step beat (`10a`/`10b` peek, `12a`/`12b` forecast)
- the tamagoyaki and umeboshi paths
- the salty branch (`11s` its reaction, `11t` its "Don't stare" line)

They are played with real keys under Playwright's paused clock, so the step-1 frame is caught before the swap.

Regenerate them with the dev server on 5196:
```
node research/sprint-0930/scene-a/pipeline/beats.mjs http://localhost:5196 research/sprint-0930/scene-a/beats
python3 research/sprint-0930/scene-a/pipeline/checks.py research/sprint-0930/scene-a/beats
```

**How the gate works:**
- **OCR:** tesseract 5.3.4 (pytesseract) on the dialogue-box crop. *Recall* = the words the DOM shows that OCR reads back.
- **Step-1 frames:** the not-yet-revealed words must **not** be readable.
- **Covered pts:** 7 sample points per rendered text line. The topmost painted element at each point (`elementFromPoint`) must be the dialogue box. The pick's translucent FX wash (`.fx-pinkflash` / `.fx-vignette`) does not count as a cover.
- **Contrast:** measured on rendered pixels: the box's most common colour vs the darkest 3 % (the lightest 3 % on the dark OR box).
- **PASS** = recall ≥ 0.9, hidden words unread, 0 covered points, contrast ≥ 4.5.

## Result
| shot | beat | text (DOM, visible) | OCR recall | step-1 hidden words | covered pts | contrast | gate |
|---|---|---|---|---|---|---|---|
| 01-goal-card | rooftop:0 | (no dialogue: art-only beat) | - | - | 0 | - | n/a |
| 02-establishing-stamp | rooftop:1 | stamp: / SCHOOL ROOFTOP - 12:00 NOON | 1.00 | - | 0 | - | PASS |
| 03-she-is-there | rooftop:2 | Her shoes by the fence. Toes pointed at you. | 1.00 | - | 0 | 10.8 | PASS |
| 04-handout | rooftop:3 | I made two. One's for you. Don't look at me like that. | 1.00 | - | 0 | 13.9 | PASS |
| 04b-handout-hover-tama | rooftop:3 | I made two. One's for you. Don't look at me like that. | 1.00 | - | 0 | 13.9 | PASS |
| 05-tama-react | rooftop:3 | Sweet egg for my sweet boy. ♡ | 1.00 | - | 0 | 7.2 | PASS |
| 06-tama-insert | rooftop:4 | Close-up. The lid lifts. Tamagoyaki, rolled in gold layers. | 1.00 | - | 0 | 10.8 | PASS |
| 07-tama-lift | rooftop:5 | (no dialogue: art-only beat) | - | - | 0 | - | n/a |
| 08-tama-pov | rooftop:6 | Itadakimasu. | 1.00 | - | 0 | 6.0 | PASS |
| 09-tama-eyes-cutaway | rooftop:7 | She doesn't eat hers. She watches you chew. | 1.00 | - | 0 | 10.9 | PASS |
| 10a-tama-peek-step1 | rooftop:8 | Sweet. Like me. Good input. | 1.00 | hidden 5/5 | 0 | 10.8 | PASS |
| 10b-tama-peek-step2 | rooftop:8 | Sweet. Like me. Good input. / Sweet, ne? I rolled it myself. | 1.00 | - | 0 | 13.9 | PASS |
| 11-tama-dont-stare-best | rooftop:9 | …Obviously. Don't stare. | 1.00 | - | 0 | 6.7 | PASS |
| 12a-tama-forecast-step1 | rooftop:10 | Technically, rain wasn't  | 1.00 | hidden 2/2 | 0 | 15.9 | PASS |
| 12b-tama-forecast-step2 | rooftop:10 | Technically, rain wasn't f-OR-ecast. | 1.00 | - | 0 | 17.5 | PASS |
| 13-tama-stay-close | rooftop:11 | Stay fORever? The rain can wait. | 1.00 | - | 0 | 17.8 | PASS |
| 05-ume-react | rooftop:3 | Sour. Brave. I'll remember you like sour. | 1.00 | - | 0 | 13.9 | PASS |
| 06-ume-insert | rooftop:4 | Close-up. The lid lifts. One red umeboshi on white rice. | 1.00 | - | 0 | 10.7 | PASS |
| 07-ume-lift | rooftop:5 | (no dialogue: art-only beat) | - | - | 0 | - | n/a |
| 08-ume-pov | rooftop:6 | Itadakimasu. | 1.00 | - | 0 | 6.0 | PASS |
| 09-ume-eyes-cutaway | rooftop:7 | She doesn't eat hers. She watches you chew. | 1.00 | - | 0 | 10.9 | PASS |
| 10a-ume-peek-step1 | rooftop:8 | Sour. Hm. You like things that bite? | 1.00 | hidden 1/1 | 0 | 12.0 | PASS |
| 10b-ume-peek-step2 | rooftop:8 | Sour. Hm. You like things that bite? / Sour, neee? | 1.00 | - | 0 | 13.4 | PASS |
| 11-ume-dont-stare-good | rooftop:9 | Good is a start. Tomorrow I'll do better. | 1.00 | - | 0 | 12.7 | PASS |
| 12a-ume-forecast-step1 | rooftop:10 | Technically, rain wasn't  | 1.00 | hidden 2/2 | 0 | 15.9 | PASS |
| 12b-ume-forecast-step2 | rooftop:10 | Technically, rain wasn't f-OR-ecast. | 1.00 | - | 0 | 17.5 | PASS |
| 13-ume-stay-close | rooftop:11 | Stay fORever? The rain can wait. | 1.00 | - | 0 | 17.8 | PASS |
| 11s-salty-react | rooftop:8 | Say that again. Slowly. So I can write it down. | 1.00 | - | 0 | 6.4 | PASS |
| 11t-salty-dont-stare | rooftop:9 | Salty. Noted. Forever. | 1.00 | - | 0 | 12.0 | PASS |

29 shots, 0 fail

Found and fixed during the gate:
- **Handout.** The box was drawn over the dialogue box, and half the line was hidden. The handout layer now sits under the dialogue, and the "Take neither" pill moved clear of the NANDA tag.
- **Smile tag.** It is wider than NEXT, so the "Good is a start…" line ran under it. A box with the tag now wraps its text before the tag (`padding-right: 400px`).
- **Stay forever.** "can" touched her NAND input pin. The box's text column now ends 260 px before its right edge, where she overlaps it.
- **Peek.** Her legs showed under the raised box while the choices waited for the step. The sprite is now cut off at y 745.

## Impeccable (v4.1.0, live, 1920×1080, `?scene=rooftop&beat=N&still&seed=1`)
`shape-assembled-illustration` is an advisory on Nanda's SVG and the art. It is judged, not fixed (see ART.md), and is left out of the counts.

| | beats | findings | per beat |
|---|---|---|---|
| before (old rooftop, 10 beats) | 0–9 | **26** | 1 / 1 / 4 / 4 / 4 / 1 / 4 / 1 / 2 / 4 |
| after (Scene A, 12 beats) | 0–11 | **19** | 1 / 1 / 1 / 1 / 1 / 1 / 1 / 1 / 4 / 1 / 1 / 5 |
| static: `SceneA.jsx`, `scene-a.css`, `Nanda.jsx`, `Say.jsx` | | 0 | |

- **Gone:**
  - the 3 `clipped-overflow-container` findings on each old bento close-up (the `.focus` / `.shot-blur` wrappers; the new close-ups are `sharp`)
  - the `low-contrast` findings on the handout: the love chip was white on `#ffa6d6`, 1.8:1. The bento's food tags now use a `#a8206f` chip.
- **Left:**
  - `layout-transition` on every beat: the timer bar's width transition, engine chrome.
  - On the merged beat (8) and stay forever (11): the shared `<Choices>` love chip, 1.8:1 in the axe sense. It has a text-shadow outline. It is the same chip in every scene, so it was not changed here.
  - `ai-color-palette`: the purple "leave" pill, which is the brand.
  - One `clipped-overflow-container` on beat 11. This one is on purpose: in "Stay forever" she breaks past the frame's right edge.

## Voice (src/date-beta/voice): which takes still match
Playback matches scene + words (`voice.js norm`). A test (`src/date-beta-scene-a.test.js`) walks every bento × yum view and asserts that **all 16 rooftop takes are still reachable**.

| line | take | status |
|---|---|---|
| "I made two. One's for you. Don't look at me like that." | 001 | unchanged |
| reacts 1 R+ / R= / R− | 002 / 003 / 004 | unchanged (the handout's picks) |
| "Sweet. Like me. Good input." / "Sour. Hm. You like things that bite?" | 006 / 005 | now the **lead** (top) line of the merged beat. The player plays the lead's take, then queues the lower line's take after it (`VOICE.show(scene, lead, then)`). |
| "Sweet, ne? I rolled it myself." | 008 | unchanged (the merged beat's lower line) |
| "Sour, ne?" → **"Sour, neee?"** | 007 | **Changed on purpose.** The take is "Sour, neee?", so the old text **never matched** (`sourne` ≠ `sourneee`). It matches now. |
| "…Obviously. Don't stare." / "Good is a start. Tomorrow I'll do better." | 009 / 010 | Moved from react frames to the "Don't stare" beat (vary on `yum`). Same words, so they still match. |
| "Say that again. Slowly. So I can write it down." | 011 | unchanged (salty keeps its reaction frame) |
| "Salty. Noted. Forever." | 012 | moved from the removed "You smile" beat to "Don't stare" (salty). Still matches. |
| "Stay forever? The rain can wait." + reacts 6 R+ / R= / R− | 013–016 | unchanged |
| New: "Her shoes by the fence. Toes pointed at you.", "MC: Itadakimasu.", "She doesn't eat hers. She watches you chew." (now on the eyes cutaway), the forecast | — | Narration or MC: no take by design. |

**Timing caveat.** On the merged beat the lower line appears at 1000 ms. Its take (008 / 007) starts only when the lead take ends, which is about 1.5–2.5 s in. So the text leads the voice for about a second.
