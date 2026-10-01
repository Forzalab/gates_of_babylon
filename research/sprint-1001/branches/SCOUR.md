# Branch scour vs `ccr-8b4548b6-08uz6t` (demo integration)

Fetched 2026-10-01 ~05:50 PT. Integration head `b2ef695` (PR #33 story clock). 227 remote branches.

**Buckets:** LIVE-UNMERGED 176 · ARCHIVE 31 · MERGED 20 · **total 227**

**LIVE verdicts:** conflict-risk 3 · orphan-worth-a-look 39 · superseded 134

## Method
- `unique` = `rev-list --count integ..B` / `main..B` / `git cherry integ B` "+" count (patch-id dedup). Cherry 0 → MERGED.
- ARCHIVE = `pit2/archive-*`, or patch-unique commits touch only `research/ docs/ handout/` (+2 with no src/public/scripts: `deploy/gob-site` build output, `claude/hello-world-repo-push-jqswqo`).
- 168/176 LIVE branches share **no merge-base** with integ (integ is a re-rooted history). `diff merge-base..B` is meaningless for them, so demo files = `src/date-beta/**`, `public/date-beta/**` touched by B's patch-unique commits, compared blob-by-blob with integ:
  - **superseded**: every such file equals integ, or integ edited it after B's last commit.
  - **orphan-worth-a-look**: B has file(s) integ does not have at all.
  - **conflict-risk**: files diverge and integ's last edit is older than B's tip.
- Hand fix: files missing only because integ deliberately replaced/dropped them (`Naan.jsx` → `NaanAd/NaanPlatform`; voice takes 033_3, 298_3 dropped in M7a) → superseded.
- ⚑ = last commit after 2026-09-29. Demo column: `N (miss M, diverge D)`; `sdb/`=`src/date-beta/`, `pdb/`=`public/date-beta/`.

## Look at these first
| # | branch | what | verdict |
|---|---|---|---|
| 1 | `ccr-4a751f0b-vxlgc1` | sfx-wire (looping beds, event SFX, props.sfx on beats, mixer/QA 25/25) + M2 leave endings wired into live play + leave audit fixes. Integ has NO `src/date-beta/fx/sound.js` and NO `packs/leave-route.json`. | orphan / conflict-risk on 6 shared files (engine, scenes) |
| 2 | `ccr-5a9dde06-rb80gg` | Same sfx-wire + M2 leave content, as merged into `main` via PR #32. Pick one of this or 4a751f0b, not both. | orphan / conflict-risk |
| 3 | `main` | Carries PR #32 (sfx + leave) and PR #34 README; 17 demo files diverge from integ. Same two missing files. | orphan / conflict-risk |
| 4 | `crowd-eyes` | 10-01: crowd-eyes layer (far/mid/near red-eyed silhouettes) on every CROWD beat. New `art/crowd/*` + `packs/crowd-eyes.json`; touches `engine.js`, `main.jsx`. | orphan, 1 commit, 2 hot files |
| 5 | `ccr-44b3aeaf-0iuf00` | 10-01, 3 commits: H2/H3 shop + butter-route hand pins (Nanda). 11 demo files, all diverge from integ. | conflict-risk |
| 6 | `ccr-9e547080-secqtv` | 10-01: H7 v3-train beat 3 "Rain on the window" uses rain train bg. 1-line `packs/variant-v3.json` change. | conflict-risk (trivial, 1 line) |
| 7 | `hud-build` | 09-30 WIP "stopped at session limit, handoff to alt": `src/date-beta/hud.css` absent on integ. | orphan, WIP — check if alt finished it |
| 8 | `narration-vo` | 09-30: 4 narration takes not on integ and not referenced by integ code (281_13, 253_4, 254_0, 297_1). 2 others were dropped on purpose in M7a. | orphan, low (assets only) |

Not demo-relevant but new (⚑ 10-01): `ccr-e9874dc9-9t3u5d`, `claude/bold-ptolemy-w147br` — Gates of Babylon logic **circuit** simulator + synth sounds (21 non-demo files missing on integ); their date-beta copies are stale obbp versions (diverge 11–12 files) → do not merge their date-beta parts.

## Full table
| branch | bucket | unique (integ/main/cherry) | last date | demo files | verdict | note |
|---|---|---|---|---|---|---|
| ⚑ `Forzalab-patch-1` | LIVE-UNMERGED | 326/0/276 | 2026-10-01 | 76 (miss 2, diverge 17): sdb/fx/sound.js, sdb/packs/leave-route.json | orphan-worth-a-look | Update README.md |
| ⚑ `ccr-44b3aeaf-0iuf00` | LIVE-UNMERGED | 3/77/3 | 2026-10-01 | 11 (miss 0, diverge 11) | conflict-risk | H3: shop 12 sleeve hold is her own pin lead from her body (no ceiling arm); bags + fist mo |
| ⚑ `ccr-5a9dde06-rb80gg` | LIVE-UNMERGED | 324/0/275 | 2026-10-01 | 76 (miss 2, diverge 13): sdb/fx/sound.js, sdb/packs/leave-route.json | orphan-worth-a-look | Truth table: horizontal scrollbar no longer hidden by the bottom fade mask |
| ⚑ `ccr-9e547080-secqtv` | LIVE-UNMERGED | 1/75/1 | 2026-10-01 | 1 (miss 0, diverge 1) | conflict-risk | H7: v3-train 3 'Rain on the window' uses the rain train bg; H6 shooter + before shots |
| ⚑ `ccr-e9874dc9-9t3u5d` | LIVE-UNMERGED | 308/0/262 | 2026-10-01 | 69 (miss 0, diverge 11) | conflict-risk | circuit: tab-indent block fields to match Kerney testcases · unrelated history (no merge-base) |
| ⚑ `claude/bold-ptolemy-w147br` | LIVE-UNMERGED | 307/0/261 | 2026-10-01 | 69 (miss 0, diverge 12) | orphan-worth-a-look | Logic: subtle synth sounds for place, wire in/out, switch on/off, trash, reject + mute · unrelated history (no merge-base) |
| ⚑ `crowd-eyes` | LIVE-UNMERGED | 1/75/1 | 2026-10-01 | 6 (miss 4, diverge 2): sdb/art/crowd/CrowdLayer.jsx, sdb/art/crowd/crowd.css, sdb/art/crowd/crowd.js, sdb/packs/crowd-eyes.json | orphan-worth-a-look | date-beta: crowd-eyes layer (far/mid/near red-eyed silhouettes) on every CROWD beat |
| ⚑ `main` | LIVE-UNMERGED | 327/0/276 | 2026-10-01 | 76 (miss 2, diverge 17): sdb/fx/sound.js, sdb/packs/leave-route.json | orphan-worth-a-look | Merge pull request #34 from Forzalab/Forzalab-patch-1 |
| ⚑ `ccr-4a751f0b-vxlgc1` | LIVE-UNMERGED | 9/0/9 | 2026-09-30 | 14 (miss 2, diverge 6): sdb/fx/sound.js, sdb/packs/leave-route.json | orphan-worth-a-look | sfx-wire: QA.md, browser QA re-run on the final rebased head (25/25) |
| ⚑ `hud-build` | LIVE-UNMERGED | 280/1/242 | 2026-09-30 | 42 (miss 1, diverge 0): sdb/hud.css | orphan-worth-a-look | WIP (hud-build): stopped at session limit, handoff to alt · unrelated history (no merge-base) |
| ⚑ `narration-vo` | LIVE-UNMERGED | 4/4/4 | 2026-09-30 | 215 (miss 6, diverge 0): pdb/voice/06-v2-train/033_3-run-1.mp3, pdb/voice/narration/v2-curry/281_13.mp3, pdb/voice/narration/v2-park/253_4.mp3, pdb/voice/narration/v2-shop/254_0.mp3 … | orphan-worth-a-look | narration timing: voice-aware holds/NEXT/auto/two-step reveal/sfxAt, sfx ducking, timing t |
| ⚑ `sprint/lockgame` | LIVE-UNMERGED | 289/0/250 | 2026-09-30 | 51 (miss 0, diverge 0) | superseded | date-beta: T6 lock-game, 4x4 basement lock match on the escape door beat (pack lockgame) · unrelated history (no merge-base) |
| ⚑ `sprint/mech` | LIVE-UNMERGED | 288/0/249 | 2026-09-30 | 46 (miss 0, diverge 0) | superseded | date-beta: lines/reactions up to 30 words, declared flag cold, tests · unrelated history (no merge-base) |
| ⚑ `sprint/meta` | LIVE-UNMERGED | 289/0/250 | 2026-09-30 | 49 (miss 0, diverge 0) | superseded | date-beta meta loop: run counter, live tokens, crowd/loop pack · unrelated history (no merge-base) |
| ⚑ `sprint/obbp` | LIVE-UNMERGED | 331/29/285 | 2026-09-30 | 81 (miss 0, diverge 0) | superseded | KNOWN-BUGS: B-08 fixed, love audit + ?? chips done; verify script and screenshots · unrelated history (no merge-base) |
| ⚑ `sprint/romance` | LIVE-UNMERGED | 285/0/246 | 2026-09-30 | 54 (miss 0, diverge 0) | superseded | T1a romance scenes: 6 traced bgs + hand overlay + Your-Name grade · unrelated history (no merge-base) |
| ⚑ `sprint/seq-visual` | LIVE-UNMERGED | 313/11/269 | 2026-09-30 | 77 (miss 0, diverge 0) | superseded | WIP (sprint/seq-visual): stopped by Tony, backup · unrelated history (no merge-base) |
| ⚑ `sprint/sequences` | LIVE-UNMERGED | 306/4/263 | 2026-09-30 | 70 (miss 0, diverge 0) | superseded | sequences: voice NEW-LINES.md (v3 tags, play order) · unrelated history (no merge-base) |
| ⚑ `sprint/story` | LIVE-UNMERGED | 287/0/248 | 2026-09-30 | 41 (miss 0, diverge 0) | superseded | story: BIBLE section 3 beat table + SCHEMA.md · unrelated history (no merge-base) |
| ⚑ `sprint/story-pack` | LIVE-UNMERGED | 288/0/249 | 2026-09-30 | 42 (miss 0, diverge 0) | superseded | story: packs/story.json from BIBLE beat table + check-pack + PACK-SCHEMA · unrelated history (no merge-base) |
| ⚑ `sprint/v2-build` | LIVE-UNMERGED | 319/17/274 | 2026-09-30 | 80 (miss 0, diverge 0) | superseded | WIP (sprint/v2-build): stopped by Tony, backup · unrelated history (no merge-base) |
| ⚑ `sprint/variants` | LIVE-UNMERGED | 311/9/268 | 2026-09-30 | 73 (miss 0, diverge 0) | superseded | variants: lead judge scores, V2 wins (85) · unrelated history (no merge-base) |
| ⚑ `sprint/voice` | LIVE-UNMERGED | 316/13/272 | 2026-09-30 | 73 (miss 0, diverge 0) | superseded | voice: appendix #179 marked superseded (recorded as V2 #32) · unrelated history (no merge-base) |
| ⚑ `sprint/voice-audio` | LIVE-UNMERGED | 387/84/343 | 2026-09-30 | 144 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · voice: escape-timeout #69 · unrelated history (no merge-base) |
| `art-fixes` | LIVE-UNMERGED | 282/0/243 | 2026-09-29 | 40 (miss 0, diverge 0) | superseded | date-beta art-fixes: test walker skips reaction frames; shoot script walks the merged roof · unrelated history (no merge-base) |
| `ccr-ed715d8f-aootws` | LIVE-UNMERGED | 242/0/210 | 2026-09-29 | 25 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · date-beta: simpler button labels; 'Leave her house' · unrelated history (no merge-base) |
| `claude/date-beta-alt-spec-review-4gdzab` | LIVE-UNMERGED | 259/63/218 | 2026-09-29 | 21 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · genkan-in v2: slippers point into the house (guest custom), re-shot · unrelated history (no merge-base) |
| `claude/japanese-translation-fixes-qpi3qi` | LIVE-UNMERGED | 284/0/245 | 2026-09-29 | 41 (miss 0, diverge 0) | superseded | research: round-2 refs (trace + bento) + PLAN-main.md for the vtrace/bento/close-up build · unrelated history (no merge-base) |
| `claude/leftover-tonight-tasks-5wm6yl` | LIVE-UNMERGED | 282/0/243 | 2026-09-29 | 40 (miss 0, diverge 0) | superseded | date-beta art-fixes: test walker skips reaction frames; shoot script walks the merged roof · unrelated history (no merge-base) |
| `demo-assets-fallback` | LIVE-UNMERGED | 245/0/212 | 2026-09-29 | 31 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · date-beta fallback art: lift genkan shoes above the dialogue box, sign spacing, umbrella;  · unrelated history (no merge-base) |
| `demo-playthrough` | LIVE-UNMERGED | 247/0/214 | 2026-09-29 | 25 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · research: date-beta demo playthrough (every ending x both bento picks, 1024x768, reduced m · unrelated history (no merge-base) |
| `figur-collapse` | LIVE-UNMERGED | 227/0/197 | 2026-09-29 | 22 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · Figur collapse: the wordmark is the only way into Date; Date starts at scene 1 · unrelated history (no merge-base) |
| `font-trials` | LIVE-UNMERGED | 222/0/193 | 2026-09-29 | 22 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · Font trials: ?font= override (inter/rounded/barlow/grotesk), shots + notes; defaults uncha · unrelated history (no merge-base) |
| `hud-mockups` | LIVE-UNMERGED | 268/0/233 | 2026-09-29 | 33 (miss 0, diverge 0) | superseded | hud mockups: literal copy pass (goal, pops, legend, trail names, endings) · unrelated history (no merge-base) |
| `imp-pass2` | LIVE-UNMERGED | 222/0/193 | 2026-09-29 | 22 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · Impeccable pass 2: ignore intentional rules, fix contrast/padding in date-beta + date-alep · unrelated history (no merge-base) |
| `naan-ad` | LIVE-UNMERGED | 256/0/222 | 2026-09-29 | 32 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · date-beta naan: ad-row.png, NaanAd next to NOT Sweet, XOR Coffee and Figur Weather at 1:1 · unrelated history (no merge-base) |
| `naan-platform` | LIVE-UNMERGED | 261/0/226 | 2026-09-29 | 34 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · naan platform r2/r3 + night: NaanAd mounted (2:1), time='dusk' 'night' (rain, tubes on, we · unrelated history (no merge-base) |
| `physics-audit` | LIVE-UNMERGED | 247/1/214 | 2026-09-29 | 31 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · physics audit: date-beta screenshots and findings · unrelated history (no merge-base) |
| `redteam-pr24` | LIVE-UNMERGED | 229/0/199 | 2026-09-29 | 22 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · redteam: exhaustive branch walk + known-fail tests for PR #24 demo risks (assets, Esc on e · unrelated history (no merge-base) |
| `stage1-bento` | LIVE-UNMERGED | 218/0/189 | 2026-09-29 | 20 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · date-beta: bento flag + vary overlays + echo sites (plan stage 1) · unrelated history (no merge-base) |
| `stage2-tree` | LIVE-UNMERGED | 219/0/190 | 2026-09-29 | 22 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · date-beta: secret branch map (~ / ?debug) with jumpTo, prereq ask dialog, remember toggle · unrelated history (no merge-base) |
| `build1-assets` | LIVE-UNMERGED | 212/0/184 | 2026-09-28 | 17 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · date-beta: asset slots (assets.json manifest, loader, beep/grey-box placeholders) · unrelated history (no merge-base) |
| `build2-look` | LIVE-UNMERGED | 212/0/184 | 2026-09-28 | 16 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · date-beta build2: HA look in the engine (glossy choices, chip box, OR rule C), engine-owne · unrelated history (no merge-base) |
| `build3-contract` | LIVE-UNMERGED | 215/0/186 | 2026-09-28 | 20 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · date-beta: finalize beat contract (speaker, timer, set/if, go conditions, defaults, asset  · unrelated history (no merge-base) |
| `build4-spine` | LIVE-UNMERGED | 216/0/187 | 2026-09-28 | 20 (miss 0, diverge 0) | superseded | missing file(s) intentionally gone on integ (Naan.jsx→NaanAd/NaanPlatform; voice takes dropped in M7a) · date-beta: wire demo spine (door -> cup -> steeped   ??? -> escape stub; leave) + path tes · unrelated history (no merge-base) |
| `pit4/final` | LIVE-UNMERGED | 189/0/163 | 2026-09-28 | 0 | superseded | pit4/final: feed nav fits BACK / PLAY / LOGIC MODE at 1024; game + canvas link back to the · unrelated history (no merge-base) |
| `pit4/game` | LIVE-UNMERGED | 180/0/155 | 2026-09-28 | 0 | superseded | pit4/game: eager unfreeze on tap, harness fixes, dogfood log · unrelated history (no merge-base) |
| `pit4/r3-2` | LIVE-UNMERGED | 184/16/159 | 2026-09-28 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · pit4/r3-2: REPORT deltas · unrelated history (no merge-base) |
| `claude/todays-agenda-lv3s51` | LIVE-UNMERGED | 190/1/163 | 2026-09-27 | 0 | superseded | Merge pull request #21 from Forzalab/pit4/final · unrelated history (no merge-base) |
| `fix/consolidate-bugs` | LIVE-UNMERGED | 148/0/125 | 2026-09-27 | 0 | superseded | e2e: mark the tour done so hover tests see the delete X (tour hides it, BUGS #8) · unrelated history (no merge-base) |
| `fix/draft-straight-line` | LIVE-UNMERGED | 132/0/116 | 2026-09-27 | 0 | superseded | Draft wire: straight thin line pin->cursor while dragging (BUGS #3) · unrelated history (no merge-base) |
| `fix/knob-slim` | LIVE-UNMERGED | 132/0/116 | 2026-09-27 | 0 | superseded | fix(#4): slimmer lit knob disk, 3px paper inside the ink ring · unrelated history (no merge-base) |
| `fix/plate-tokens` | LIVE-UNMERGED | 132/0/116 | 2026-09-27 | 0 | superseded | Labels + pin halo on site tokens (BUGS #6): gate names --ink at 760 --font-label, halo = f · unrelated history (no merge-base) |
| `fix/top-margin` | LIVE-UNMERGED | 132/0/116 | 2026-09-27 | 0 | superseded | fix(#2): keep wires and parts 20px off the canvas top edge · unrelated history (no merge-base) |
| `fix/tour-hand-x` | LIVE-UNMERGED | 132/0/116 | 2026-09-27 | 0 | superseded | Tour: balloon above the hand on step 1 (#7), no delete X during the tour (#8) · unrelated history (no merge-base) |
| `fix/tray-bubble-dot` | LIVE-UNMERGED | 132/0/116 | 2026-09-27 | 0 | superseded | Tray: inverting gate bubbles show the orange dot (BUGS #5); claim #5 #6 · unrelated history (no merge-base) |
| `fix/wire-jog` | LIVE-UNMERGED | 132/0/116 | 2026-09-27 | 0 | superseded | fix(#9): straight gate-to-lamp wires · unrelated history (no merge-base) |
| `fix/x-halo` | LIVE-UNMERGED | 133/0/117 | 2026-09-27 | 0 | superseded | BUGS.md: #4 row matches fix/knob-slim so the two PRs merge in any order · unrelated history (no merge-base) |
| `pit3/arbiter` | LIVE-UNMERGED | 168/0/143 | 2026-09-27 | 0 | superseded | Arbiter verdict and contact sheet for Date mode x1-y3 · unrelated history (no merge-base) |
| `pit3/date-x` | LIVE-UNMERGED | 167/0/142 | 2026-09-27 | 0 | superseded | pit3/date-x: ANALYSIS, RESEARCH, REPORT with Pillow delta tables; final shots · unrelated history (no merge-base) |
| `pit3/date-y` | LIVE-UNMERGED | 167/3/142 | 2026-09-27 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Date Y: Pillow deltas table, final shots · unrelated history (no merge-base) |
| `pit4/r1-1` | LIVE-UNMERGED | 171/0/146 | 2026-09-27 | 0 | superseded | pit4/r1-1: jingles, tile/neon polish, REPORT with Pillow deltas and side-by-sides · unrelated history (no merge-base) |
| `pit4/r1-2` | LIVE-UNMERGED | 170/2/145 | 2026-09-27 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · pit4 f2: Pillow-tuned layout, M1/M7 lens, juice + Kenney CC0 sound, report · unrelated history (no merge-base) |
| `pit4/r1-3` | LIVE-UNMERGED | 175/7/150 | 2026-09-27 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · pit4/r1-3 f3: REPORT.md · unrelated history (no merge-base) |
| `pit4/r2-1` | LIVE-UNMERGED | 180/12/155 | 2026-09-27 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · pit4/r2-1 g1: REPORT.md · unrelated history (no merge-base) |
| `pit4/r2-2` | LIVE-UNMERGED | 172/0/147 | 2026-09-27 | 0 | superseded | pit4/r2-2: g2 = f1 + r1 fix list + JRPG cursor/message window, 4x2 feed with truth-table e · unrelated history (no merge-base) |
| `pit4/r2-3` | LIVE-UNMERGED | 173/2/148 | 2026-09-27 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · pit4/r2-3: g3 reduced-motion pass, vine boom (BY-NC credited), shots, REPORT · unrelated history (no merge-base) |
| `pit4/r3-1` | LIVE-UNMERGED | 174/0/149 | 2026-09-27 | 0 | superseded | pit4/r3-1 h1: continue fixes 3-6 (docked match window, HIGH SCORES, credits, no yellow dig · unrelated history (no merge-base) |
| `pit4/r3-3` | LIVE-UNMERGED | 174/2/149 | 2026-09-27 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · pit4/r3-3: h3 compact truth tables, reduced-motion shots, REPORT + LOG · unrelated history (no merge-base) |
| `pit2/bleed-a` | LIVE-UNMERGED | 76/6/70 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Pin bleed variant A: knob-hugging capsule + wire bridge through knob tip · unrelated history (no merge-base) |
| `pit2/bleed-b` | LIVE-UNMERGED | 77/7/71 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Pin bleed variant B: square notch plug over the knob · unrelated history (no merge-base) |
| `pit2/bleed-c` | LIVE-UNMERGED | 78/8/72 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Pin bleed variant C: knob capsule + inset band in the paper gap · unrelated history (no merge-base) |
| `pit2/bleed-d` | LIVE-UNMERGED | 78/8/72 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Pin bleed D2: lit input on an unlit multi-input body fills its half of the inset (Tony's s · unrelated history (no merge-base) |
| `pit2/bleed-e` | LIVE-UNMERGED | 79/9/73 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Bleed E1: dotted unlit half-wedge + dotted pin stub (Tony sketch); XOR extra curve opens a · unrelated history (no merge-base) |
| `pit2/bleed-e1` | LIVE-UNMERGED | 79/9/73 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Bleed E1: dotted unlit half-wedge + dotted pin stub (Tony sketch); XOR extra curve opens a · unrelated history (no merge-base) |
| `pit2/bleed-e2` | LIVE-UNMERGED | 80/10/74 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Bleed E2: XOR extra curve stays ink over the neck (wire hops it) · unrelated history (no merge-base) |
| `pit2/bleed-e3` | LIVE-UNMERGED | 80/10/74 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Bleed E3: XOR inputs get no neck; wedge starts at the inner curve · unrelated history (no merge-base) |
| `pit2/bleed-f` | LIVE-UNMERGED | 81/11/75 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Bleed F1: midline dots in --one, 4px off the orange edge · unrelated history (no merge-base) |
| `pit2/bleed-f1` | LIVE-UNMERGED | 81/11/75 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Bleed F1: midline dots in --one, 4px off the orange edge · unrelated history (no merge-base) |
| `pit2/bleed-f2` | LIVE-UNMERGED | 82/12/76 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Bleed F2: no dotted midline; dots trace only the empty half's outer contour · unrelated history (no merge-base) |
| `pit2/bleed-f3` | LIVE-UNMERGED | 82/12/76 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Bleed F3: grey midline dots kept, set 4px off the orange edge (a paper gap, like outline-t · unrelated history (no merge-base) |
| `pit2/bub` | LIVE-UNMERGED | 76/6/70 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Speech balloons: messages spoken by the part or the logo; palette hint lifted, tail tip fi · unrelated history (no merge-base) |
| `pit2/bub-a` | LIVE-UNMERGED | 77/7/71 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Balloons variant A: Blambot classic (oval, wedge tail, bold italic stress) · unrelated history (no merge-base) |
| `pit2/bub-b` | LIVE-UNMERGED | 77/7/71 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Balloons variant B: Swiss/Rams minimal (square panel, right-angle tail, weight stress) · unrelated history (no merge-base) |
| `pit2/bub-c` | LIVE-UNMERGED | 77/7/71 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Balloons variant C: Material 3 (inverse-surface container, rounded tail, orange stress) · unrelated history (no merge-base) |
| `pit2/bub-d` | LIVE-UNMERGED | 80/10/74 | 2026-09-26 | 0 | superseded | Palette hint restyled as a bub-d balloon (same ink, 2:1 rule, tail, 12u cap, lettering); t · unrelated history (no merge-base) |
| `pit2/bub-e1` | LIVE-UNMERGED | 81/11/75 | 2026-09-26 | 0 | superseded | Toasts e1: flat caption boxes (Blambot MEANWHILE style), stacked 20u, 4s; CANVAS WIPED (Sh · unrelated history (no merge-base) |
| `pit2/bub-e2` | LIVE-UNMERGED | 81/11/75 | 2026-09-26 | 0 | superseded | Toasts e2: centred two-line caption boxes (Blambot EIGHTH DIMENSION style, no drop shadow) · unrelated history (no merge-base) |
| `pit2/bub-f` | LIVE-UNMERGED | 83/13/77 | 2026-09-26 | 0 | superseded | Drop the Shift+Backspace wipe key (Tony); wipe() kept for the parked T4 button; toast stac · unrelated history (no merge-base) |
| `pit2/combo-1` | LIVE-UNMERGED | 44/0/40 | 2026-09-26 | 0 | superseded | Swedish plates: white letter on the lit (orange) plate (Tony) · unrelated history (no merge-base) |
| `pit2/combo-2` | LIVE-UNMERGED | 47/0/42 | 2026-09-26 | 0 | superseded | combo-2: merge pit2/hint-a (dbb4064); mixed-net run = orange dots on unbroken ink; lighter · unrelated history (no merge-base) |
| `pit2/defaults` | LIVE-UNMERGED | 49/0/44 | 2026-09-26 | 0 | superseded | Defaults: no sub-cell jogs (jogShift on drop), exact one-step undo after any drag (decided · unrelated history (no merge-base) |
| `pit2/hint-a` | LIVE-UNMERGED | 30/0/30 | 2026-09-26 | 0 | superseded | First-visit coach marks: 5 steps, veil + part balloon + dotted drag arrow (variant A spotl · unrelated history (no merge-base) |
| `pit2/hint-b` | LIVE-UNMERGED | 31/1/31 | 2026-09-26 | 0 | superseded | Coach marks variant B: comic panels (paper veil, 3px frames, numbered captions) · unrelated history (no merge-base) |
| `pit2/i6-A` | LIVE-UNMERGED | 123/0/111 | 2026-09-26 | 0 | superseded | Half-lit gates: the dotted empty wedge links out through the output knob to the stub/wire  · unrelated history (no merge-base) |
| `pit2/i6-B` | LIVE-UNMERGED | 122/0/110 | 2026-09-26 | 0 | superseded | Tour: scrap the dotted arrow; original white-glove hand points at the element every step ( · unrelated history (no merge-base) |
| `pit2/i6-C` | LIVE-UNMERGED | 123/0/111 | 2026-09-26 | 0 | superseded | Issue 6 C3: empty truth table drops the [x] tag, keeps the frame and diagonals (img10) · unrelated history (no merge-base) |
| `pit2/img8-fix` | LIVE-UNMERGED | 28/0/28 | 2026-09-26 | 0 | superseded | Nudge rule: compare stuck wire sets, forward wires may not loop (img8 dogfood) · unrelated history (no merge-base) |
| `pit2/restore` | LIVE-UNMERGED | 30/0/30 | 2026-09-26 | 0 | superseded | Restore: step pencil draft wire, one dot rule, open chevron, crisp tray glyphs; X only ins · unrelated history (no merge-base) |
| `pit2/review` | LIVE-UNMERGED | 4/4/4 | 2026-09-26 | 0 | superseded | Review: debates, joint SPEC-FINAL (R1 + R2 signed) · unrelated history (no merge-base) |
| `pit2/spec-build` | LIVE-UNMERGED | 20/0/20 | 2026-09-26 | 0 | superseded | J-1 follow-up: Palette before ReactFlow in the DOM, so Open parts is Tab stop 2 (was 18) · unrelated history (no merge-base) |
| `pit2/t1w-a` | LIVE-UNMERGED | 96/26/88 | 2026-09-26 | 0 | superseded | Stroke: parts+wires 6px -> 4px (2x --rule, clean 2:1 ratio) · unrelated history (no merge-base) |
| `pit2/t1w-b` | LIVE-UNMERGED | 96/26/88 | 2026-09-26 | 0 | superseded | Grid: --rule 2px -> 4px, parts stay at 6px · unrelated history (no merge-base) |
| `pit2/t1w-c` | LIVE-UNMERGED | 96/26/88 | 2026-09-26 | 0 | superseded | One shared line weight: parts 6px -> 4px, --rule 2px -> 4px · unrelated history (no merge-base) |
| `pit2/t1w-d` | LIVE-UNMERGED | 97/27/89 | 2026-09-26 | 0 | superseded | Tony's T1 verdict: parts+wires to 3px, zoom-dependent stroke, full Kerney matrix · unrelated history (no merge-base) |
| `pit2/t2-hop` | LIVE-UNMERGED | 30/0/30 | 2026-09-26 | 0 | superseded | Hop bridges: finish WIP on the product router (45-degree trapezoid bridge, bend clearance) · unrelated history (no merge-base) |
| `pit2/t2b-cap` | LIVE-UNMERGED | 77/7/71 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Capped wire router (<=4 bends, detours node boxes, step-path fallback) + before/after shot · unrelated history (no merge-base) |
| `pit2/t2b-deny` | LIVE-UNMERGED | 78/8/72 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Deny-the-drop: refuse moves/drops that overlap parts, run a wire backwards or cover a wire · unrelated history (no merge-base) |
| `pit2/t3` | LIVE-UNMERGED | 76/6/70 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · T3: truth table legibility pass (tabular figures, compact rows, gate columns, AA live row) · unrelated history (no merge-base) |
| `pit2/t3-a` | LIVE-UNMERGED | 77/7/71 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · T3 variant A: column groups by rule + IN/GATES/OUT captions · unrelated history (no merge-base) |
| `pit2/t3-b` | LIVE-UNMERGED | 77/7/71 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · T3 variant B: column kinds by tone (grey gate surface, inverted lamp header) · unrelated history (no merge-base) |
| `pit2/t3-c` | LIVE-UNMERGED | 77/7/71 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · T3 variant C: column kinds by canvas glyph + weight · unrelated history (no merge-base) |
| `pit2/t3-d` | LIVE-UNMERGED | 78/8/72 | 2026-09-26 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · T3-D: drop # column, table in the page's one voice (800 cut, ink only, rule weights), AUDI · unrelated history (no merge-base) |
| `pit2/t3-swe-hang` | LIVE-UNMERGED | 30/0/30 | 2026-09-26 | 0 | superseded | Keep Truth.jsx sort line verbatim (truth.test.js drift guard); names.js repeats the same o · unrelated history (no merge-base) |
| `pit2/t3-swe-ink` | LIVE-UNMERGED | 31/2/31 | 2026-09-26 | 0 | superseded | Keep Truth.jsx sort line verbatim (truth.test.js drift guard); names.js repeats the same o · unrelated history (no merge-base) |
| `pit2/t3-swe-tab` | LIVE-UNMERGED | 31/2/31 | 2026-09-26 | 0 | superseded | Keep Truth.jsx sort line verbatim (truth.test.js drift guard); names.js repeats the same o · unrelated history (no merge-base) |
| `pit2/t3r-a` | LIVE-UNMERGED | 97/27/89 | 2026-09-26 | 0 | superseded | t3r-a: n13 stress shots, principle notes · unrelated history (no merge-base) |
| `pit2/t3r-b` | LIVE-UNMERGED | 97/27/89 | 2026-09-26 | 0 | superseded | Truth table: remove # column, A flush-left in its slot (t3r-b) · unrelated history (no merge-base) |
| `pit2/t3r-c` | LIVE-UNMERGED | 98/28/90 | 2026-09-26 | 0 | superseded | t3r-c: add orig n13 stress shot · unrelated history (no merge-base) |
| `pit2/t3r2-v1` | LIVE-UNMERGED | 102/32/94 | 2026-09-26 | 0 | superseded | t3r2-v1: test matrix, full-page and scroll-cue shots, notes · unrelated history (no merge-base) |
| `pit2/t3r2-v2` | LIVE-UNMERGED | 102/32/94 | 2026-09-26 | 0 | superseded | t3r2-v2: test matrix, full-page and scroll-cue shots, notes · unrelated history (no merge-base) |
| `pit2/t3r2-v3` | LIVE-UNMERGED | 102/32/94 | 2026-09-26 | 0 | superseded | t3r2-v3: test matrix, full-page and scroll-cue shots, notes · unrelated history (no merge-base) |
| `pit2/t3r3` | LIVE-UNMERGED | 104/34/96 | 2026-09-26 | 0 | superseded | t3r3: dogfood run, Pillow measurements, OCR evidence · unrelated history (no merge-base) |
| `pit2/t4-final` | LIVE-UNMERGED | 25/0/25 | 2026-09-26 | 0 | superseded | Row 03 control bar: undo / wipe / redo (T4 final, H1 ruled cells) · unrelated history (no merge-base) |
| `pit2/t4-h1` | LIVE-UNMERGED | 25/1/25 | 2026-09-26 | 0 | superseded | T4 it2 H1 ruled cells: centred undo/wipe/redo bar, 10-step undo, dashed-ring error mark · unrelated history (no merge-base) |
| `pit2/t4-h2` | LIVE-UNMERGED | 26/2/26 | 2026-09-26 | 0 | superseded | T4 it2 H2 tiles in cells (default bar h2) · unrelated history (no merge-base) |
| `pit2/t4-h3` | LIVE-UNMERGED | 26/2/26 | 2026-09-26 | 0 | superseded | T4 it2 H3 segmented tiles (default bar h3) · unrelated history (no merge-base) |
| `pit2/t4-tt` | LIVE-UNMERGED | 29/0/29 | 2026-09-26 | 0 | superseded | Empty truth table state; bigger delete X; pin hit zones grown into empty space and clipped · unrelated history (no merge-base) |
| `pit2/t4-tt-ring` | LIVE-UNMERGED | 30/1/30 | 2026-09-26 | 0 | superseded | Variant: pin ring (paper gap + 2px grey ring) instead of halo; [x] box without diagonals · unrelated history (no merge-base) |
| `pit2/wip-hint-base` | LIVE-UNMERGED | 29/0/29 | 2026-09-26 | 0 | superseded | WIP (agent died on usage limit) · unrelated history (no merge-base) |
| `pit2/wip-jn-a` | LIVE-UNMERGED | 30/1/30 | 2026-09-26 | 0 | superseded | Truth table fills the taller row 02 (cap = room above row 03); dev-only nudge probe for th · unrelated history (no merge-base) |
| `pit2/wip-jn-b` | LIVE-UNMERGED | 31/2/31 | 2026-09-26 | 0 | superseded | Truth table fills the taller row 02 (cap = room above row 03); dev-only nudge probe for th · unrelated history (no merge-base) |
| `pit2/wip-jn-c` | LIVE-UNMERGED | 31/2/31 | 2026-09-26 | 0 | superseded | Truth table fills the taller row 02 (cap = room above row 03); dev-only nudge probe for th · unrelated history (no merge-base) |
| `pit2/wip-jn-metro` | LIVE-UNMERGED | 31/0/31 | 2026-09-26 | 0 | superseded | Truth table fills the taller row 02 (cap = room above row 03); dev-only nudge probe for th · unrelated history (no merge-base) |
| `pit2/wip-jn-metro-never` | LIVE-UNMERGED | 32/2/32 | 2026-09-26 | 0 | superseded | Truth table fills the taller row 02 (cap = room above row 03); dev-only nudge probe for th · unrelated history (no merge-base) |
| `pit2/wip-restore` | LIVE-UNMERGED | 29/0/29 | 2026-09-26 | 0 | superseded | WIP (agent died on usage limit) · unrelated history (no merge-base) |
| `pit2/wip-t2-hop` | LIVE-UNMERGED | 29/0/29 | 2026-09-26 | 0 | superseded | WIP (agent died on usage limit) · unrelated history (no merge-base) |
| `pit2/wip-t3-swe-hang` | LIVE-UNMERGED | 30/0/30 | 2026-09-26 | 0 | superseded | Keep Truth.jsx sort line verbatim (truth.test.js drift guard); names.js repeats the same o · unrelated history (no merge-base) |
| `claude/inventory-check-csx5gm` | LIVE-UNMERGED | 35/0/32 | 2026-09-25 | 0 | orphan-worth-a-look | no date-beta files (old Logic/pit work) · Wiring: drop target = port hit zones (as big as the drag-start zones); help bar shows righ · unrelated history (no merge-base) |
| `ui/r1-a` | LIVE-UNMERGED | 9/0/9 | 2026-09-24 | 0 | superseded | Fix pass 2: uppercase table title, wordmark offset, inset softer table block · unrelated history (no merge-base) |
| `ui/r1-b` | LIVE-UNMERGED | 9/3/9 | 2026-09-24 | 0 | superseded | Fix pass 2: wordmark placement, ref2 table scale, quiet CTA, 3.5px 1-wires · unrelated history (no merge-base) |
| `ui/r1-win` | LIVE-UNMERGED | 9/0/9 | 2026-09-24 | 0 | superseded | Fix pass 2: uppercase table title, wordmark offset, inset softer table block · unrelated history (no merge-base) |
| `ui/r2-c` | LIVE-UNMERGED | 11/0/11 | 2026-09-24 | 0 | superseded | R2-C: instant hover/press/focus/drag/reject states · unrelated history (no merge-base) |
| `ui/r2-d` | LIVE-UNMERGED | 10/1/10 | 2026-09-24 | 0 | superseded | R2-D: NYCTA paper grid, bleed truth table, primary SHOW GRID, interaction states · unrelated history (no merge-base) |
| `ui/r2-win` | LIVE-UNMERGED | 11/0/11 | 2026-09-24 | 0 | superseded | R2-C: instant hover/press/focus/drag/reject states · unrelated history (no merge-base) |
| `ui/r3-e` | LIVE-UNMERGED | 12/0/12 | 2026-09-24 | 0 | superseded | R3-E: 38.9% row rule, 33.5% L, orange focus ring, inline port rejection, inset table rules · unrelated history (no merge-base) |
| `ui/r3-f` | LIVE-UNMERGED | 12/1/12 | 2026-09-24 | 0 | superseded | R3-F: outlined IEEE gates, port-side reject, accent focus, 38.9% rule · unrelated history (no merge-base) |
| `ui/r3-win` | LIVE-UNMERGED | 12/0/12 | 2026-09-24 | 0 | superseded | R3-E: 38.9% row rule, 33.5% L, orange focus ring, inline port rejection, inset table rules · unrelated history (no merge-base) |
| `ui/r4-g` | LIVE-UNMERGED | 14/0/14 | 2026-09-24 | 0 | superseded | R4-G: design spec · unrelated history (no merge-base) |
| `ui/r4-h` | LIVE-UNMERGED | 13/1/13 | 2026-09-24 | 0 | superseded | R4-H: g overlap 47px, keyboard focus order, ref2 table/switch, bold-caps rejection + inval · unrelated history (no merge-base) |
| `ui/r4-win` | LIVE-UNMERGED | 14/0/14 | 2026-09-24 | 0 | superseded | R4-G: design spec · unrelated history (no merge-base) |
| `ui/r5-i` | LIVE-UNMERGED | 15/0/15 | 2026-09-24 | 0 | superseded | R5-I: Swiss ref3 grid, true-inset lit state, fused knobs, cap-height help bar · unrelated history (no merge-base) |
| `ui/r5-i2` | LIVE-UNMERGED | 16/2/16 | 2026-09-24 | 0 | superseded | R5-I2: improve J's build: hollow 9px knobs, cap-high SVG mouse, 12px-cap BKSP chip, ink-on · unrelated history (no merge-base) |
| `ui/r5-j` | LIVE-UNMERGED | 15/1/15 | 2026-09-24 | 0 | superseded | R5-J: ref3 frame at zoom 1, one 6px stroke system, double-path lit inset, half-bump knobs, · unrelated history (no merge-base) |
| `ui/r5-j2` | LIVE-UNMERGED | 16/0/16 | 2026-09-24 | 0 | superseded | R5-J2: improve R5-I: 12px-cap BKSP chip in a 20px box, wordmark span matched to ref3 (x71- · unrelated history (no merge-base) |
| `ui/r5-win` | LIVE-UNMERGED | 16/0/16 | 2026-09-24 | 0 | superseded | R5-J2: improve R5-I: 12px-cap BKSP chip in a 20px box, wordmark span matched to ref3 (x71- · unrelated history (no merge-base) |
| `ui/r6-k` | LIVE-UNMERGED | 17/1/17 | 2026-09-24 | 0 | superseded | R6 K: Mona Sans variable on every label, wdth-driven widths, 20px mouse, 9px broken-outlin · unrelated history (no merge-base) |
| `ui/r6-k2` | LIVE-UNMERGED | 18/0/18 | 2026-09-24 | 0 | superseded | R6 K2 (swap on L): wordmark wdth/wght refit (+5% -> -1.5%), g crossing 31 -> 27, title/dig · unrelated history (no merge-base) |
| `ui/r6-l` | LIVE-UNMERGED | 17/0/17 | 2026-09-24 | 0 | superseded | R6 L: Roboto Flex variable (wdth/wght/opsz) fitted per element to ref3, 9px broken knobs,  · unrelated history (no merge-base) |
| `ui/r6-l2` | LIVE-UNMERGED | 18/2/18 | 2026-09-24 | 0 | superseded | R6 L2 (swap on K): help tracking 0 + wdth 86 (widths match ref3), mouse/chip flush on one  · unrelated history (no merge-base) |
| `ui/r6-win` | LIVE-UNMERGED | 18/0/18 | 2026-09-24 | 0 | superseded | R6 K2 (swap on L): wordmark wdth/wght refit (+5% -> -1.5%), g crossing 31 -> 27, title/dig · unrelated history (no merge-base) |
| `ui/r7-m` | LIVE-UNMERGED | 19/0/19 | 2026-09-24 | 0 | superseded | R7 M: per-glyph Roboto Flex axis fit (XOPQ/XTRA/wdth) for wordmark, table, header, numeral · unrelated history (no merge-base) |
| `ui/r7-m2` | LIVE-UNMERGED | 20/2/20 | 2026-09-24 | 0 | superseded | R7 M2 (swap on N): per-glyph wordmark axes (L XOPQ 126, o/g/c XTRA, i at 60), help second  · unrelated history (no merge-base) |
| `ui/r7-n` | LIVE-UNMERGED | 19/1/19 | 2026-09-24 | 0 | superseded | R7 N: per-element Flex fit to ref3 (table figures/header/numerals exact, help wdth 78 6/7, · unrelated history (no merge-base) |
| `ui/r7-n2` | LIVE-UNMERGED | 20/0/20 | 2026-09-24 | 0 | superseded | R7 N2 (swap on M): table figure 4 fitted 20->17 (wdth 50), BKSP chip 50->48 (padding 4) · unrelated history (no merge-base) |
| `ui/r7-win` | LIVE-UNMERGED | 20/0/20 | 2026-09-24 | 0 | superseded | R7 N2 (swap on M): table figure 4 fitted 20->17 (wdth 50), BKSP chip 50->48 (padding 4) · unrelated history (no merge-base) |
| `ui/r8-o` | LIVE-UNMERGED | 21/0/21 | 2026-09-24 | 0 | superseded | R8 O: fluid scaling via container query units (--u = 100cqw/1440), React Flow zoom = frame · unrelated history (no merge-base) |
| `ui/r8-o2` | LIVE-UNMERGED | 22/2/22 | 2026-09-24 | 0 | superseded | R8 O2 (swap on P): th scope=col (columnheader), resize rescales user viewport by u/u_prev  · unrelated history (no merge-base) |
| `ui/r8-p` | LIVE-UNMERGED | 21/1/21 | 2026-09-24 | 0 | superseded | R8 P: fluid scaling via one --u unit; canvas zoom = u; reflow canvas track; metric fallbac · unrelated history (no merge-base) |
| `ui/r8-p2` | LIVE-UNMERGED | 22/0/22 | 2026-09-24 | 0 | superseded | R8 P2 (swap on O): pinned opsz, geometricPrecision help/numerals, whole-word a11y runs, wo · unrelated history (no merge-base) |
| `ui/r8-win` | LIVE-UNMERGED | 22/0/22 | 2026-09-24 | 0 | superseded | R8 P2 (swap on O): pinned opsz, geometricPrecision help/numerals, whole-word a11y runs, wo · unrelated history (no merge-base) |
| `ui/r9-q` | LIVE-UNMERGED | 23/1/23 | 2026-09-24 | 0 | superseded | R9 Q: text unit --t = max(--u, 1rem/16) for WCAG 1.4.4, header/footer/side tracks in --t,  · unrelated history (no merge-base) |
| `ui/r9-q2` | LIVE-UNMERGED | 24/0/24 | 2026-09-24 | 0 | superseded | R9 Q2 (swap on R): zoom-gated text floor --f = min(1rem/16, --u * devicePixelRatio) so typ · unrelated history (no merge-base) |
| `ui/r9-r` | LIVE-UNMERGED | 23/0/23 | 2026-09-24 | 0 | superseded | R9 R: rem-floored type (WCAG 1.4.4, 2x at 200%), container-query zoom reflow, em-linked mo · unrelated history (no merge-base) |
| `ui/r9-r2` | LIVE-UNMERGED | 24/2/24 | 2026-09-24 | 0 | superseded | R9 R2 (swap on Q): rem floor on --t only under browser zoom (resolution > 1dppx) so 100% s · unrelated history (no merge-base) |
| `ui/r9-win` | LIVE-UNMERGED | 24/0/24 | 2026-09-24 | 0 | superseded | R9 Q2 (swap on R): zoom-gated text floor --f = min(1rem/16, --u * devicePixelRatio) so typ · unrelated history (no merge-base) |
| ⚑ `flow-c2-r2` | ARCHIVE | 4/78/4 | 2026-10-01 | — | — | docs/research/handout only · C2 flow: shop game run1/run2 PASS; FLOW.md complete |
| ⚑ `playtest-1001` | ARCHIVE | 9/59/9 | 2026-10-01 | — | — | docs/research/handout only · Playtest 1001: SLOP.md review (7 HIGH / 12 MED / 5 LOW) + crops |
| ⚑ `critique/physics` | ARCHIVE | 1/1/1 | 2026-09-30 | — | — | docs/research/handout only · critique: PHYSICS review of shop shots |
| `pit2/archive-T1` | ARCHIVE | 72/2/66 | 2026-09-26 | — | — | pit2/archive-* · T1 it2: screen-constant knob/bubble detail, lit-wire optical weight, pencil draft at knob, |
| `pit2/archive-T2` | ARCHIVE | 71/1/65 | 2026-09-26 | — | — | pit2/archive-* · T2 draft: wire lanes/junctions/crossings, shape-only delete X, no ghost marks (variants vi |
| `pit2/archive-T3` | ARCHIVE | 71/1/65 | 2026-09-26 | — | — | pit2/archive-* · T3 draft: truth table split header, part tags (nyc/swiss/swe), gate names, hint variants ( |
| `pit2/archive-T4-it1-archive` | ARCHIVE | 71/1/65 | 2026-09-26 | — | — | pit2/archive-* · archive: T4 iteration 1 prototype (errors x6, bars A/B/C, icons) — superseded by t4-final |
| `pit2/archive-bleed` | ARCHIVE | 71/1/65 | 2026-09-26 | — | — | pit2/archive-* · Bleed pin colour into the wire for logic 1 |
| `pit2/archive-hint-base` | ARCHIVE | 28/0/28 | 2026-09-26 | — | — | pit2/archive-* · Nudge rule: compare stuck wire sets, forward wires may not loop (img8 dogfood) |
| `pit2/archive-img8-fix` | ARCHIVE | 28/0/28 | 2026-09-26 | — | — | pit2/archive-* · Nudge rule: compare stuck wire sets, forward wires may not loop (img8 dogfood) |
| `pit2/archive-jn-a` | ARCHIVE | 29/0/29 | 2026-09-26 | — | — | pit2/archive-* · Junctions (thick trunk + dots, mixed runs dashed), lit pins as tapered bulbs, row 02 fills |
| `pit2/archive-jn-b` | ARCHIVE | 30/1/30 | 2026-09-26 | — | — | pit2/archive-* · Junction variant b (twin lines) |
| `pit2/archive-jn-c` | ARCHIVE | 30/1/30 | 2026-09-26 | — | — | pit2/archive-* · Junction variant c (dot only) |
| `pit2/archive-jn-metro` | ARCHIVE | 30/0/30 | 2026-09-26 | — | — | pit2/archive-* · jn-metro: squeezed lane before nudge (nudge last resort) |
| `pit2/archive-jn-metro-never` | ARCHIVE | 31/1/31 | 2026-09-26 | — | — | pit2/archive-* · jn-metro-never: never nudge |
| `pit2/archive-restore` | ARCHIVE | 28/0/28 | 2026-09-26 | — | — | pit2/archive-* · Nudge rule: compare stuck wire sets, forward wires may not loop (img8 dogfood) |
| `pit2/archive-t2-hop` | ARCHIVE | 28/0/28 | 2026-09-26 | — | — | pit2/archive-* · Nudge rule: compare stuck wire sets, forward wires may not loop (img8 dogfood) |
| `pit2/archive-t3-swe-hang` | ARCHIVE | 30/0/30 | 2026-09-26 | — | — | pit2/archive-* · Keep Truth.jsx sort line verbatim (truth.test.js drift guard); names.js repeats the same o |
| `pit2/archive-t3-swe-ink` | ARCHIVE | 31/2/31 | 2026-09-26 | — | — | pit2/archive-* · Keep Truth.jsx sort line verbatim (truth.test.js drift guard); names.js repeats the same o |
| `pit2/archive-t3-swe-tab` | ARCHIVE | 31/2/31 | 2026-09-26 | — | — | pit2/archive-* · Keep Truth.jsx sort line verbatim (truth.test.js drift guard); names.js repeats the same o |
| `pit2/archive-t4-final` | ARCHIVE | 25/0/25 | 2026-09-26 | — | — | pit2/archive-* · Row 03 control bar: undo / wipe / redo (T4 final, H1 ruled cells) |
| `pit2/archive-t4-h1` | ARCHIVE | 25/1/25 | 2026-09-26 | — | — | pit2/archive-* · T4 it2 H1 ruled cells: centred undo/wipe/redo bar, 10-step undo, dashed-ring error mark |
| `pit2/archive-t4-h2` | ARCHIVE | 26/2/26 | 2026-09-26 | — | — | pit2/archive-* · T4 it2 H2 tiles in cells (default bar h2) |
| `pit2/archive-t4-h3` | ARCHIVE | 26/2/26 | 2026-09-26 | — | — | pit2/archive-* · T4 it2 H3 segmented tiles (default bar h3) |
| `pit2/archive-t4-tt` | ARCHIVE | 28/0/28 | 2026-09-26 | — | — | pit2/archive-* · Nudge rule: compare stuck wire sets, forward wires may not loop (img8 dogfood) |
| `pit2/archive-testA` | ARCHIVE | 71/1/65 | 2026-09-26 | — | — | pit2/archive-* · Exhaustive sim tests: all 2^n rows for every gate and composite circuits, edge cases, Trut |
| `pit2/archive-testB` | ARCHIVE | 71/1/65 | 2026-09-26 | — | — | pit2/archive-* · Add Playwright e2e smoke test for circuit editor |
| `deploy/gob-site` | ARCHIVE | 8/8/8 | 2026-09-25 | — | — | no src/public/scripts (build output / hello-world) · site: build of claude/inventory-check-csx5gm c688704 |
| `pit2/archive-T2b` | ARCHIVE | 70/0/64 | 2026-09-25 | — | — | pit2/archive-* · Merge pull request #4 from Forzalab/claude/todays-agenda-lv3s51 |
| `pit2/archive-T4` | ARCHIVE | 70/0/64 | 2026-09-25 | — | — | pit2/archive-* · Merge pull request #4 from Forzalab/claude/todays-agenda-lv3s51 |
| `claude/hello-world-repo-push-jqswqo` | ARCHIVE | 6/1/6 | 2026-09-24 | — | — | no src/public/scripts (build output / hello-world) · Add hello world file |
| ⚑ `alone` | MERGED | 0/25/0 | 2026-10-01 | — | — | M3 alone: AUDIT fixes + locks, before/after compares, float audit 0 flags |
| ⚑ `ccr-82757ffd-vs2odu` | MERGED | 0/45/0 | 2026-10-01 | — | — | M4 WIP backup (tests 424/424, not shot-reviewed): crowd token caps, meta.json + r3-station |
| ⚑ `ccr-8b4548b6-08uz6t` | MERGED | 0/74/0 | 2026-10-01 | — | — | Merge PR #33: story clock (rooftop/towers/park/cafe live 12-14; curry fixed; only rooftop  |
| ⚑ `ccr-fa5f7f43-89ymbq` | MERGED | 0/67/0 | 2026-10-01 | — | — | Branch map: hint fits on one row; before/after screenshots + NOTES (369 -> 0 overlaps) |
| ⚑ `el-r6` | MERGED | 0/9/0 | 2026-10-01 | — | — | r6: re-record changed narration (shop 0, curry 13, train 1), new Nanda take for shop 2, dr |
| ⚑ `leave` | MERGED | 0/52/0 | 2026-10-01 | — | — | M2 leave: after shots (4 routes, 0 errors) + AUDIT.md |
| ⚑ `legs` | MERGED | 0/9/0 | 2026-10-01 | — | — | legs R7: final renders, contact sheet 3, N/A review (no legs on screen), compares 03/04 re |
| ⚑ `r6-fix` | MERGED | 0/8/0 | 2026-10-01 | — | — | r6: critic pass done: skirt mask at the hem (float audit back to 0), re-shoot + sheets, CR |
| ⚑ `sfx-wire` | MERGED | 0/21/0 | 2026-10-01 | — | — | sfx: wire the unused sounds to beats and events; beds loop and stop on a scene change |
| ⚑ `voice` | MERGED | 0/58/0 | 2026-10-01 | — | — | Voice: all 261 wired takes re-recorded on eleven_v4; narrator Daniel -> Sean (Squeaky voic |
| ⚑ `audio-int` | MERGED | 0/0/0 | 2026-09-30 | — | — | Narration VO onto main's R5: Daniel takes, beatTiming, QA |
| ⚑ `ccr-7a495bd3-chfs0d` | MERGED | 0/0/0 | 2026-09-30 | — | — | R5: umeboshi re-shoot (94 shots), before/after sheets in story order, REPORT.md |
| ⚑ `puddle` | MERGED | 0/0/0 | 2026-09-30 | — | — | puddle: slipped bands off her face, after shots + ref before after compare, Impeccable cle |
| ⚑ `sfx-synth` | MERGED | 0/0/0 | 2026-09-30 | — | — | sfx: synthesize all date-beta sound effects (numpy/scipy), wire into loader with mute + vo |
| ⚑ `sprint/curry-r2-wip` | MERGED | 0/0/0 | 2026-09-30 | — | — | WIP backup (curry-r2): session limit |
| ⚑ `sprint/curry-scene` | MERGED | 0/0/0 | 2026-09-30 | — | — | curry r3: food vtraced from Tony's refs (179 teardrop naan, 181 katori, 183 katsu plate),  |
| ⚑ `sprint/dialog-box` | MERGED | 0/0/0 | 2026-09-30 | — | — | dialog-box: NEXT pill tucked inside the IC-chip box, bottom-right (name tag kept on top-le |
| ⚑ `sprint/interiors` | MERGED | 0/0/0 | 2026-09-30 | — | — | date-beta interiors: escape-timeout returns to the traced sitting room |
| ⚑ `sprint/shop-scene` | MERGED | 0/0/0 | 2026-09-30 | — | — | shop vtrace r2: cart POV, produce, eggs/OCPD, cups, basket + end card back on vtracer trac |
| ⚑ `sprint/ux-six` | MERGED | 0/0/0 | 2026-09-30 | — | — | ux-six: shots (256-colour), control checks, FOR-ALT notes |

## Re-check 06:40 PT vs ccr head `35df730c`
- IN ccr now: `crowd-eyes`, `ccr-44b3aeaf-0iuf00` (M1/M2), `ccr-9e547080-secqtv` (H6/H7), `crowd-voice`. Head verified: test 439/439, voice-gaps 0 silent, build ok, float audit 0 flags.
- `ccr-4a751f0b` / `ccr-5a9dde06` / `main` (sfx-wire + leave-route): **superseded**. ccr has its own sound wiring (f88d9316, `assets.js` beds/cues/duck, `vending-clunk` on v2-train 2), and the leave route lives in `packs/story.json` ("Say goodnight", rooftop leave). Do not merge: two sound systems.
- `hud-build`: **superseded**. ccr's `Hud.jsx` + `lv-` styles in `beta.css`.
- `narration-vo`: **drop**. Its 4 takes (281_13, 253_4, 254_0, 297_1) are referenced nowhere on ccr.
- New: `crowd-voice-v2` @ 4032a7b (layered crowd chant v2). Gates green; merges only after Tony listens.
