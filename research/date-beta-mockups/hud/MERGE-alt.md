# Alt → main: HUD UI + native Japanese (merge notes)

Branch: `claude/japanese-translation-fixes-qpi3qi`. Base: PR #25 head `d6d5747` (`claude/leftover-tonight-tasks-5wm6yl`).
Tony (Tue 9/29, ~15:10 PT): alt builds the HUD UI now. Main owns this merge and decides small things (conflicts, naming, layout, tests).

## Merge
```
git checkout claude/leftover-tonight-tasks-5wm6yl
git fetch origin claude/japanese-translation-fixes-qpi3qi
git merge origin/claude/japanese-translation-fixes-qpi3qi
npm test && npm run build && npm run e2e
```
If PR #25 did not move after d6d5747, this is a fast-forward.

## What landed (variant A + Tony's literal copy)
| File | Change |
|---|---|
| `src/date-beta/Hud.jsx` (new) | Ribbon (heart badge N%, LOVE meter 1 cell = 1 point, 100% goal, route trail from `engine.trail`), pop (`+3 She liked that.` / `−2 She did not like that.`), goal card, end card (100% = YOU WIN, less = GAME OVER), `NextButton`. |
| `src/date-beta/main.jsx` | Uses `reactView` / `present` / `trail` / `ending` from the engine. HUD only while Nanda is present. Nanda stays up for the whole present scene (bubble only on her lines, pop or card). Reaction emote + big bubble. End card: button / Space / Enter / `1` = choice 0 (back to the rooftop). NEXT on every click beat after its hold (solo pill on art-only beats). "Click anywhere to continue": big on the goal card, then small bottom-left; hidden on choice and auto beats. Focus: `.stage.focus` while a line, choice or card is up. |
| `src/date-beta/Say.jsx` | `next` prop → `onNext` (the NEXT pill replaces the `▸` glyph). |
| `src/date-beta/Nanda.jsx` | `emote`, `big`, `talk` props. |
| `src/date-beta/art/nanda.js` | `nandaSVG({ emote, big })` from `hud/nanda-emotes.js`: sweat + pout faces and bubbles are new. `stage` alone draws the old look. |
| `src/date-beta/beta.css` | Old `.db-say .next` + `.nexthint` rules removed. HUD block appended (`hud-` / `lv-`), from `hud.css` variant A. Focus: blur 3px + brightness .78 + vignette (red at scare 2), Nanda pink rim-light. `data-lowfx` (rAF probe > 24 ms/frame, not RM) = dim only. RM = static final frame. |
| `src/date-beta/scenes.json` | JP (below). |
| `src/date-beta/art/NaanAd.jsx` | `渋谷駅 徒歩3分` → `池NOR袋駅 徒歩3分`. |
| `src/date-beta-art-fixes.test.js` | adCopy inputs → fullwidth `！` (match scenes.json). |

## Native Japanese (Sonnet scan, native-level review)
| Where | Before | After | Why |
|---|---|---|---|
| steeped:3 | `ずっと。…F{OR}ever. Ne?` | `いつまでも一緒。…F{OR}ever. ね？` | Bare ずっと。 trails off. いつまでも一緒 = "together forever" (teammate's "whenever" direction). ね？ = same script as the line. |
| cup:0 umeboshi | `すっぱい？…ね。` | `すっぱいでしょ。…ね？` | A native "Sour, right? …Right?". The tag ね takes ？. |
| cup:0 tamagoyaki | `甘い？…ね。` | `甘いでしょ。…ね？` | Same. Bento echo lint still holds. |
| train:1 | `すっぱい! SOUR!` / `甘い! SWEET!` | `すっぱい！` / `甘い！` | Fullwidth ！ after kana, to match the train and underpass art. |
| NaanAd | `渋谷駅` | `池NOR袋駅` | 渋谷 was the only real place name; the one named station in the game is 池NOR袋. |
| NaanAd | `本格インドカレー` | unchanged | This is the standard native term for Indian curry (インド = India; Indonesia = インドネシア). The vertical ー renders upright (see `live/6-*.png`). |
All other JP signs (次は, 立入禁止, 方面, 甘い玉子焼き ¥180, 梅干しおにぎり ¥150, コーポ・フィグール, ナン食べ放題, 税込) passed as natural.

## Checks (alt, 15:25 PT)
- `npm test` 267/267. `npm run build` OK. `npm run e2e` all passed.
- Playwright walks at 1920x1080: all-pink (`?still`) reaches 16/16 = 100% → YOU WIN; all-purple → leave-fu GAME OVER 0%; normal-motion run. 48 + 45 + 50 beats, 0 console or page errors.
- Keys: Space on the end card → rooftop:0 (love reset, goal card again). NEXT click = one step. GOT IT → rooftop:1.
- Impeccable: static `src/date-beta/` 2 → 0 (pop tail = a clip-path triangle, hint padding 8px). Live: 0 real findings. Kept on purpose: `low-contrast` "XII" on the rooftop clock = art under the focus blur (median 7.2:1). The `shape-assembled-illustration` advisories = the locked Nanda + scene art.
- Shots: `research/date-beta-mockups/hud/live/1-9*.png`.

## Not done (YAGNI, main's call)
- Tree.jsx love on edge pills. Variant B.

## Forks for Tony (not decided by alt)
- The bar hides in absent scenes (train, naan, blackout, platform, genkan-in, basement). That is Tony's spec ("bar only when Nanda is on screen"), but those beats have no progress cue except NEXT and the hint.
- Focus blur also softens art that a line points at (train:1 "This one says 甘い！", the ad is blurred). Tune `.stage.focus .scene` in `beta.css` (blur 3px now).
