# date-lab — ROUND 1 SPEC (alt account, Mon 2026-09-28 03:30 PT)

Tony's brief: two extra-effort builders + one medium-effort advisor/arbitrator. The builders compete. Every variant = anime × cinema × horror-film school, at its own intensity, with its OWN central theme. Round 1 now. Cron at 08:15 PT runs round 2 (or 3).

## Where
- Entry `date-lab.html` → `src/date-lab/main.jsx` (hub). `?v=<id>` = one variant on the 1920×1080 stage, `?still` = reduced motion.
- Builder A owns `src/date-lab/a/**` ONLY. Builder B owns `src/date-lab/b/**` ONLY. Each exports `VARIANTS` from its `index.js`: `{ id, track, title, theme, horror, builder, Component }`.
- Do NOT edit: `src/date-beta/**` (main's engine + scenes 1-10), `src/date-lab/main.jsx`, `lab.css`, the other builder's folder, `research/date-beta-mockups/**`. IMPORT from them freely (e.g. `src/date-beta/art/*.jsx` scenes, `Say.jsx` OR rule, `art/util.js` useStep/rng).
- Nanda art: main's hand-authored SVG sprite = `research/date-beta-mockups/shared/art.js` (classic script, sets `window.ART.nanda(...)` etc.; roles are CSS classes `k-*`, colours come from theme CSS, see `A/theme.css`). Port what you need into your folder as a module (copy + adapt is fine), or draw your own. One base female sprite only (`SHOPPING-LIST`: Sutemo PSD, not in repo).
- Shots: `research/date-lab/shots/<id>*.png`, 1920×1080, Playwright with `executablePath: '/opt/pw-browsers/chromium'` (never `playwright install`). Build: `npm run build && npx vite preview --port <A:5481|B:5482>`.
- Reference images (composition/colour only; NEVER copy into git): `/tmp/claude-0/-home-user-gates-of-babylon/a4baa7c0-e039-5e34-ac59-1467e25e8579/scratchpad/refs/` (30 files, named). 20-22 = main's own renders (train, rooftop, naan). All CC0 per Tony. One upload (red lounge, signed "Jorge Barros", neon "XXX") is EXCLUDED.
- Story + rules: brain `projects/csci/_files/date-beta-SCRIPT-v5.md` (HARD RULES, DEMO PATH v1, HER 3 FOODS, SOUR MUST READ, FRAME RATE, BRAND RULE), `date-beta-characters.md`, `date-beta-film-research.md`, `date-beta-choice-research.md`, `date-beta-4thwall-research.md`. Copies at `/home/claude/brain/projects/csci/_files/`.

## Hard rules (every variant)
- ≤12 words per click. No flashing > 3 Hz; glitch ≤ 2 frame swaps/s; a "1-frame" flash holds ≥ 334 ms.
- Drawn things step on the 8 fps grid (125 ms tick), a pose holds ≥ 500 ms. Camera, fades, text = smooth.
- Reduced motion (`rm` prop / `.rm`) = hard cuts, same meaning, every motion has an RM version.
- PINK #FF5FA2 = toward her, PURPLE #8A5CF6 = leave. Every "OR" in her red #F0243F, 1px offset (+ breath cue).
- Every in-world brand = "Figur" or a gate pun. Tea drug is NEVER named. PG-13: no gore on screen, no sexual content.
- Illusion of control: choices lean pink (default on timeout = her side); on replay the picked option is disabled but the timer still runs.
- `npm test` + `npm run build` green before every commit. Commit small, in your worktree branch.

## Tracks and slots (A vs B compete slot-for-slot; advisor scores all)
Horror = intensity 0-5. Each variant's theme = one film/anime school; the central theme must differ from every other slot.

### CAMERA (6) — a 20-40 s camera piece over existing scenes (rooftop → train → platform → underpass → stairs → door → genkan), cinema-grade, anime cinematography tropes encouraged
| id | builder | school / central theme | horror |
|---|---|---|---|
| cam-1 | A | Shinkai light: tilt-up to sky, lens flare, rack focus, "time passes" sky match-cuts | 1 |
| cam-2 | A | Kubrick symmetry: one-point dolly-in down the underpass/corridor, dead-centre framing | 3 |
| cam-3 | A | Satoshi Kon: match-cut reality slips (train window → her eye → billboard) | 4 |
| cam-4 | B | Hitchcock: dolly-zoom (Vertigo) on her door + the genkan slippers | 4 |
| cam-5 | B | Ju-On / found footage: handheld drift (≤ 3 Hz), timecode, the frame "notices" her | 5 |
| cam-6 | B | Anno / Evangelion: long static holds, hard cut-ins, big serif title cards | 3 |

### ANIMATION (4) — all 10 scenes if possible (idle life on each BG), stepped 8 fps
| id | builder | school / central theme | horror |
|---|---|---|---|
| anim-1 | A | KyoAni idle: blinks, hair, rain, steam, straps — the world breathes | 1 |
| anim-2 | A | Trigger limited-anim: smear frames, impact holds, speed lines on beats | 2 |
| anim-3 | B | Junji Ito creep: things move only when you look away (on click), spirals | 5 |
| anim-4 | B | Paprika dream-morph: props slide into each other between scenes (parade) | 3 |

### BRANCHING MENU (5) — the choice UI for the DOOR (🩷 "Just one cup." vs 💜 "It's late. Goodnight."), 5 s timer, default = pink, replay-disabled state, RM version. Round 1 = trial 1 of 3: arbiter prunes the 2 worst; trial 2 refills those 2 slots with hybrids of the 3 best.
| id | builder | school / central theme | horror |
|---|---|---|---|
| menu-1 | A | Tarot: two cards, hers face-up and warm, yours face-down | 2 |
| menu-2 | A | Truth table: the choice is a row you tick; her output column is pre-filled | 1 |
| menu-3 | A | DDLC 4th wall: she edits the menu text while you read it | 5 |
| menu-4 | B | Bandersnatch: cinema letterbox, a timer bar she drains toward pink | 3 |
| menu-5 | B | Circuit wires: drag a wire to an option; her wire is already soldered | 3 |

### Shared tracks (one each, still scored)
- `closeup-*` (A): 3-5 close-up inserts from the demo path with a short demo line each (bento pick + SOUR pucker, phone face-down, the third cup + steam OR, the shrine circuit, her pin state). Own theme per insert is fine.
- `nanda-*` (A): Nanda composited INTO scenes (platform silhouette → door → genkan → third cup), same lighting as the BG, 2+ integration tests (scale, rim light, shadow, colour grade).
- `fx-*` (B): effects + SFX for those scenes: rain, breath on OR, SOUR squash + tint, purple bleed (334 ms), steam OR, static, heartbeat thump, the 12:00 bell, underwater muffle. SFX = synthesized Web Audio (no files), only after a user click, a visible mute toggle, a caption for every sound.

## Deliverable per builder (round 1)
1. Variants registered + working at `?v=<id>` (and `?still`).
2. Shots: ≥ 2 PNG per variant (+ 1 RM) in `research/date-lab/shots/`.
3. `research/date-lab/R1-<A|B>-LOG.md`: per variant — theme, what it does, 1-line self-critique, the spec you'd carry to round 2.
4. Commits on your worktree branch, tests + build green. Report the branch name + last commit.

## Advisor / arbitrator (medium effort)
- Before builds land: write `research/date-lab/R1-RUBRIC.md` (100 pts; reuse main's mockup rubric shape from brain `date-beta-MOCKUPS-R1-REVIEW.md`, adapted per track: camera, anim, menu, closeup, nanda, fx).
- After: score every variant from the shots + a live run, rank per track, prune menu (2 worst), pick the 2 best of 3 top per track for round 2 hybrids, write `research/date-lab/R1-VERDICT.md`.

## Round 2 (cron 08:15 PT)
Menu: 3 survivors improved + 2 hybrids of the 3 best. Other tracks: hybrid of the 2 best of the top 3, same setup, improved, plus each builder's own round-1 carry-forward spec.
