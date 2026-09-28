# date-lab — Round 1 Rubric (Advisor/arbiter pass, written BEFORE any build lands, 2026-09-28)

Written blind to builder output, from `research/date-lab/R1-SPEC.md`, brain `date-beta-MOCKUPS-R1-REVIEW.md` (rubric shape reused), `date-beta-SCRIPT-v5.md` (HARD RULES / DEMO PATH v1 / HER 3 FOODS / SOUR MUST READ / FRAME RATE / BRAND RULE), `date-beta-film-research.md`, `date-beta-choice-research.md`, and the 10 rendered scenes in `research/date-beta-demo/` (`01-splash` … `scene-10-genkan-wide` + their RM/insert variants). Demo: Thu Oct 1, projector, crowd-timed choices.

Every variant is scored **/100 = shared core (50) + track-specific (50)**. Score each criterion 0–5, scale to its weight (`pts = round(score/5 * weight)`). Total is per-variant, per-track — camera variants compete against camera variants, menu against menu, etc. Tie-break = theme differentiation, then feasibility.

**Scoring pass needs receipts, not just numbers.** For every criterion: one sentence of evidence tied to a specific shot/frame/timestamp or a specific line of the running build, not a vibe. "5/5, legible" is not a receipt; "5/5 — the OR in cam-3's match-cut still reads red-offset at 400% zoom crop of the 1920×1080 shot" is.

---

## 1. Shared core (50 pts) — every variant, every track

| # | Criterion | Weight | What "5" looks like | What "0" looks like |
|---|---|---|---|---|
| 1 | **Projector legibility at distance** | 8 | Reads at 20+ ft, dim classroom projector: text ≥28px-equiv, ≥4.5:1 contrast on its own BG, key words (OR, forever, choices) pop even blurred/out of focus | Thin hairline UI, caption-sized body text, pastel-on-pastel, only legible zoomed-in on a laptop |
| 2 | **Reduced-motion quality** | 8 | `?still`/`rm` path is a deliberately graded set of hard-cut frames (≥500 ms hold, matches the engine's `rmAlt` pattern already seeded in `scene-06-rm-platform-hardcut.png` etc.), still reads as dread/comedy/whatever the beat needs | RM = a blank/frozen frame, or the beat's meaning is only carried by the tween that RM strips out |
| 3 | **Flash / flicker safety** | 6 | Nothing flashes >3 Hz; glitch state changes ≤2 swaps/s; any "1-frame" flash is held ≥334 ms (script's own number) | A corruption/glitch effect strobes faster than the hard rule, or a camera/anim beat reads as a seizure risk on a real projector |
| 4 | **≤12 words/click discipline** | 6 | One short line or label per click, chrome sized for it; no narrator paragraphs, no stat blocks | Text-heavy UI inviting scope creep past the word budget |
| 5 | **OR-in-red / PINK-PURPLE lock** | 8 | Every literal "OR" renders in her red #F0243F, 1px offset, breath cue intact (per `Say.jsx`'s `orParts`/`Ors`/`OrSpans`); PINK #FF5FA2 = toward her, PURPLE #8A5CF6 = leave, used consistently, never swapped or reinterpreted as a different meaning | "OR" rendered as plain text anywhere it appears; pink/purple used decoratively or reversed in meaning |
| 6 | **Brand / content rule** | 4 | In-world brand = "Figur" or a gate pun (NAND HOUSE, OR-SON, AND Line — matching the existing scenes' running joke); the tea drug is never named, shown only by effect; PG-13 held (no gore, no sexual content) | A generic/real brand slips in; the drug is named outright; content tips past PG-13 |
| 7 | **Build feasibility by Thu (hard gate)** | 6 | CSS/SVG + the ONE base female sprite only; reuses existing engine primitives (`useStep`/`rng` from `art/util.js`, `Say`/`Ors`, stepped 8 fps poses, ≥500 ms holds); no new asset pipeline, no video plates, no second sprite sheet | Needs new art types (real video, a second character sheet) or a rendering approach the SVG/CSS pipeline can't ship by Thursday — **score this down hard regardless of how good the idea is elsewhere; feasibility failures are not "docked a point", they cap the variant's total** |
| 8 | **Consistency with the 10 existing scenes** | 4 | Drop-in compatible with the locked BGs/chrome in `src/date-beta/art/*.jsx` and `research/date-beta-demo/` (splash → rooftop → train → naan billboard → blackout → platform → underpass → apartment → stairs → genkan); doesn't require redrawing a locked BG or introducing a competing palette/typeface system | Clashes with or requires redrawing an existing scene; a second visual language fights the established one (see splash-vs-scene tonal-seam note already flagged in main's own review) |

**Hard gates:** criteria 5 (OR/lock) and 7 (feasibility) are non-negotiable per the script's own HARD RULES section. A variant that scores well everywhere else but fails either outright should not win its slot — flag it explicitly in the verdict rather than let a high raw total paper over it.

---

## 2. Track-specific (50 pts each)

### CAMERA (`cam-1..6`) — 20–40 s camera piece over rooftop→train→platform→underpass→stairs→door→genkan
| # | Criterion | Weight | 5 | 0 |
|---|---|---|---|---|
| 1 | Cinema grammar / shot craft | 10 | Correct, legible use of the named technique (dolly-in, dolly-zoom, match-cut, rack focus, handheld drift, static hold) — the audience can name the move even without the label | The technique is asserted in copy/log but not visible in the actual frames; looks like a generic pan |
| 2 | Motivated moves | 10 | Every camera move is justified by story beat (per film-research's "cut for emotion first" / McKee "every scene must turn a value") — the move happens *because* something changes, not on a timer | Camera moves are decorative, unrelated to what's on screen changing |
| 3 | School fidelity | 10 | Genuinely reads as its stated school (Shinkai light/Kubrick symmetry/Kon reality-slip/Hitchcock dolly-zoom/Ju-On found-footage/Anno static-holds) to someone who knows the reference, not just "anime camera generically" | Could be relabeled to any other school in the table with no visible difference |
| 4 | Horror timing at its stated intensity | 10 | Matches the 0–5 horror number: silence-before-scare (film-research's "cut audio 0.5–1 s before the line"), held reaction beats, escalation appropriate to the number | A horror-1 piece is scary, or a horror-5 piece plays it safe/cute |
| 5 | Theme differentiation vs the other 5 camera slots | 10 | Distinct enough that a classroom couldn't mistake it for a sibling slot in a blind screenshot test (see §3) | Collapses into the same "slow" or "shaky" bucket as another slot |

### ANIMATION (`anim-1..4`) — idle life across scenes, stepped 8 fps
| # | Criterion | Weight | 5 | 0 |
|---|---|---|---|---|
| 1 | 8 fps discipline | 12 | Strict 125 ms tick, poses hold ≥500 ms (`useStep`), camera/fades/text stay smooth per FRAME RATE's hybrid rule — no drift into 24/30 fps smoothness on drawn elements | Drawn elements tween smoothly (reads as "lag" on a projector per the script's own warning), or holds are shorter than 500 ms |
| 2 | Life vs noise | 13 | Idle motion reads as "the world breathes" (blinks, hair, steam, rain) without pulling focus from the dialogue box/choice — motion supports the read, doesn't compete with it | Constant fidgeting becomes visual noise; distracts from the ≤12-word line it should be framing |
| 3 | School fidelity | 13 | Recognizably KyoAni-idle / Trigger-limited-smear / Ito-creep (moves only off-click) / Paprika-morph, not "generic idle loop" | Same generic ambient-loop regardless of which school is claimed |
| 4 | Theme differentiation vs the other 3 slots | 12 | Distinct triggering logic (continuous idle vs on-click vs on-cut morph) is visible, not just a different palette on the same loop | Two slots are both "things wiggle a little," indistinguishable in a blind test |

### BRANCHING MENU (`menu-1..5`) — DOOR choice UI, 5 s timer, default-pink, replay-disabled, RM
This is round 1 of 3 trials (spec §"Tracks and slots"): score all 5, **prune the 2 worst**; survivors + hybrids of the top 3 go to trial 2.
| # | Criterion | Weight | 5 | 0 |
|---|---|---|---|---|
| 1 | Illusion of control legible in ≤1 s | 12 | A viewer who has never seen the game understands, within one second of the menu appearing, that one path is being pushed (visual lean, sizing, hover glow — not a caption saying so) | Two neutral, symmetric buttons with zero visual tell |
| 2 | Timer pressure + default-to-pink | 10 | Visible countdown that reads on a projector; timeout resolves to pink without needing an explainer; the countdown itself feels like *her* pressure, not a generic UI timer | No visible timer, or timer defaults to a neutral/no-op state instead of pink |
| 3 | Replay-disabled state | 8 | On replay, the previously-picked option is visibly disabled (greyed/soldered/face-down — matches the chosen metaphor) while the timer still runs, per the script's "illusion of choice" rule | Replay just resets to a clean, fully-open menu — the "she remembers" horror is absent |
| 4 | Crowd readability | 10 | Presenter can read the state and hit the right hotkey/click from the back of the room without hesitation; big targets, high contrast, no ambiguity under time pressure | Small targets, low contrast, or a metaphor (cards, wires) that needs close reading to parse under 5 s |
| 5 | RM parity | 10 | Full RM version exists: hard cuts, same meaning, same pressure, no reliance on the timer's tween | RM = the timer become invisible/non-functional, or the choice UI breaks under `.rm` |

### CLOSEUP (`closeup-*`, builder A) — 3–5 inserts from the demo path
| # | Criterion | Weight | 5 | 0 |
|---|---|---|---|---|
| 1 | Insert grammar | 15 | Correct use of rack focus / ECU / sprite-scale-as-zoom per film-research §3 (blur BG then sprite, crop at eyes for ECU) — reads as a deliberate insert, not a crop of the wide shot | Just a zoomed screenshot of the existing wide shot with no compositional rework |
| 2 | Line lands in ≤12 words | 15 | The insert's one line pays off a planted gun (SOUR pucker, the third cup/steam OR, the shrine circuit, the pin state) in ≤12 words, per script's "SOUR MUST READ" spec | Line is generic, doesn't reference the specific gun it's supposed to land, or overflows the word budget |
| 3 | Geography integration | 10 | Slots into the existing scene without requiring a redraw (per main's own critique of the dialogue box eating load-bearing geography — an insert must respect, not repeat, that mistake) | Insert requires new art of the BG, or covers the exact prop it's supposed to be inserting on |
| 4 | Theme distinctiveness per insert | 10 | Each of the 3–5 inserts has its own visual idea (not just "same crop treatment, different scene") | All inserts look like the same template with different backgrounds |

### NANDA integration (`nanda-*`, builder A) — Nanda composited into scenes
| # | Criterion | Weight | 5 | 0 |
|---|---|---|---|---|
| 1 | Light/shadow/grade match | 15 | Nanda's silhouette/sprite matches each BG's actual light source and grade (rain-blue platform vs warm genkan vs black blackout) — this is the #1 fix main's own review flagged (no character on screen at all in the 5 original scenes) | Sprite looks pasted on top, flat-lit regardless of scene |
| 2 | Scale correctness | 15 | Consistent, perspective-correct scale across platform silhouette → door → genkan → third cup scenes | Sprite is an obviously wrong size for its position in at least one scene |
| 3 | Demonstrates 2+ integration tests | 10 | At least 2 of {scale, rim light, cast shadow, colour grade} are visibly, deliberately shown working, not just asserted in the log | Zero or one integration technique actually visible in the shots |
| 4 | Doesn't clash with the hand-authored sprite style | 10 | Matches the linework/fill style of `research/date-beta-mockups/shared/art.js`'s `window.ART.nanda(...)` (or a coherent alternative if drawn fresh) rather than looking like a different renderer | Visibly different art style/weight from the rest of the world, breaking the "one sprite budget" illusion |

### FX / SFX (`fx-*`, builder B) — synthesized Web Audio + visual FX
| # | Criterion | Weight | 5 | 0 |
|---|---|---|---|---|
| 1 | Safety | 15 | Mute toggle visible at all times, audio starts only after a user click (never autoplay), every sound has a fixed-slot caption, flash/timing rules from §1.3 are respected | Autoplaying audio, no mute control, or an effect (SOUR squash, purple bleed) exceeds 334 ms / flicker limits |
| 2 | Diegetic craft / signature sound | 15 | Builds a "Ben Burtt" signature sound from something in-world (per film-research §2) rather than a stock SFX; rain/breath/heartbeat/bell feel like they belong to this specific world | Generic stock-sounding beeps/clicks with no worldized identity |
| 3 | Sync/timing discipline | 10 | Follows the script's ordering rule: SFX → 0.3 s → line, or line → 0.5 s → stinger; never stacks a line on a big SFX hit | Line and SFX collide, or timing feels arbitrary |
| 4 | Coverage of the required list | 10 | Meaningfully covers the spec's list (rain, breath-on-OR, SOUR squash+tint, purple bleed 334 ms, steam OR, static, heartbeat thump, 12:00 bell, underwater muffle) rather than 1–2 cherry-picked easy wins | Only trivial effects attempted, the harder/more central ones (breath-on-OR, steam OR) skipped |

---

## 3. Theme differentiation check

Score sheet must include a **blind-screenshot test**: could a classmate, shown two variants' shots side by side with labels hidden, correctly say which is which? If not, flag the pair.

Collisions I already expect from reading the spec (verify against actual builds, don't assume):
- **cam-2 (Kubrick symmetry, static dolly-in)** vs **cam-6 (Anno long static holds)** — both are "slow and still"; the distinguishing feature has to be the dolly-in's *motion* vs cam-6's *total lock* + serif title cards. If cam-2 never actually moves, it IS cam-6.
- **cam-4 (Hitchcock dolly-zoom)** vs **cam-5 (Ju-On handheld drift)** — both horror 4–5; distinguishing feature is a locked, precise dolly-zoom vs deliberately imprecise handheld. If cam-4's dolly-zoom isn't a real trombone effect (background scale change opposite the foreground), it reads as generic "creepy zoom," collapsing into cam-5's territory.
- **menu-2 (Truth table)** vs **menu-5 (Circuit wires)** — both lean on gate-logic diagram texture; risk of both reading as "engineering-flavoured menu skin" with no distinct interaction model. Truth table's tick-a-row vs wires' drag-a-wire need to feel like different physical actions, not the same click dressed differently.
- **menu-3 (DDLC 4th wall)** and any 4th-wall move reused elsewhere (closeup, nanda) — film-research caps 4th-wall breaks at 2 per film; if menu-3 plus another slot both break the wall, that's a content collision to flag up to Tony, not just a design one.
- **anim-1 (KyoAni idle)** vs **anim-4 (Paprika dream-morph)** — lower risk (different trigger: continuous vs on-cut), but verify anim-4 isn't just anim-1 with an extra cut; the morph must be prop-to-prop, not a scene fade.

---

## 4. Pruning protocol

**Menu (5 slots, 3 trials total):**
- Trial 1 (round 1, now being scored): score all 5 on the full 100-pt sheet (shared core + menu-specific). **Prune the 2 lowest-scoring** — but a hard-gate failure (§1 criteria 5/7) prunes a variant even if its raw total would have survived.
- Trial 2: the 3 survivors return, improved, **plus 2 new hybrid slots** built from the 3 best-scoring elements across all 5 original variants (a hybrid is not one of the 3 survivors reskinned — it must combine at least 2 distinct mechanics/visual ideas from the top scorers, e.g. "Bandersnatch timer bar + circuit-wire drag target"). Score all 5 again.
- Trial 3: repeat — refine survivors, arbiter picks the final menu.

**Other tracks (camera, animation, closeup, nanda, fx — single-round-2 hybrid, not 3 trials):**
- Round 2: take the top 3 scorers in the track. Build **one hybrid of the 2 best of those 3** (combining their strongest scoring criteria — e.g. if cam-3's school fidelity (Kon match-cuts) wins but cam-5's horror timing wins, the hybrid tries Kon-style reality-slip match-cuts at found-footage horror intensity). This hybrid plus each builder's own round-1 carry-forward spec (per `R1-SPEC.md` §Round 2) form round 2's slate.

---

## 5. Failure modes to watch for, by school (pre-registered, before seeing any build)

| School / slot | Likely failure mode |
|---|---|
| cam-5 Ju-On / found-footage handheld | Shake amplitude breaks the ≤3 Hz flash-adjacent motion-safety spirit even if not a literal flash — "handheld drift" that's actually a fast juddery loop will read as broken/nauseating on a projector, not scary |
| cam-2 Kubrick symmetry | Symmetric dead-centre framing with no actual dolly move reads as a static screenshot, indistinguishable from a menu screen — needs the dolly-in to be visible over the full 20–40 s |
| cam-6 Anno static holds | "Long holds" executed as literally nothing changing for too long will read as the build being frozen/broken, especially over a shaky wifi projector setup — needs a title-card or hard cut-in to prove it's intentional |
| menu-3 DDLC 4th wall | The "menu edits itself while you read it" effect is the single highest risk of reading as **a bug** rather than horror — text glitching/reflowing looks identical to a CSS layout break unless it's paired with an unambiguous tell (audio cue, colour shift) that says "this is on purpose" |
| menu-5 Circuit wires | Drag-to-choose interactions are the hardest input to make crowd-legible in 5 s; a presenter fumbling a drag live, on a projector, with a classroom watching, is a real demo-day risk — needs a click-fallback |
| anim-3 Junji Ito creep (moves only off-click) | Depends entirely on the audience *not* looking at the right moment, which a static screenshot/shot-for-shot review can't validate at all — hardest track to score from stills; must be checked live |
| cam-3 / nanda Satoshi Kon match-cuts | Reality-slip match cuts need frame-perfect alignment (same silhouette position across two different BGs) or they just look like an unmotivated cut, not a slip |
| fx-* breath-on-OR / steam OR | Web-Audio-only (no files) synthesis is the most likely track to blow the Thu deadline — a convincing "breath" or "bell" synthesized from oscillators is genuinely hard; expect a fallback to a thin/cheap-sounding beep that undercuts the "diegetic" criterion |
| closeup-* SOUR pucker | The scaleY(0.92) squash + tint has to read as "sour reaction" not "the sprite glitched" — same risk class as the DDLC menu: horror/comedy effects that resemble bugs need an unambiguous accompanying cue (the sour squeak SFX) to land as intentional |
| cam-1 Shinkai light / anim-1 KyoAni idle (the two lowest-horror, "safe" slots) | Opposite failure: too polished and pretty with nothing distinct to say — these are the slots most likely to score high on craft but low on theme differentiation and "wow," since they have the least horror pressure forcing a strong choice |

---

## 6. Score-sheet template (to fill in Phase 2)

For each variant: `id | builder | school/theme | shared-core subtotal /50 (w/ 8 one-line receipts) | track subtotal /50 (w/ per-criterion receipts) | total /100 | hard-gate flags (Y/N + why) | theme-collision flags | 1-line verdict`.
