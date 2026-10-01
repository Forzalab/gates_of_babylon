# PR #27 (sprint/obbp) bugs found, alt

Commit `c851871`. 17 runs, about 2,200 screen states, 1920x1080 plus one 1024x768 and one reduced-motion run.
Counts: BLOCKER 0, HIGH 0, MED 3, LOW 6. No fixes attempted. Evidence paths are relative to this folder; `E/` = `shots/_evidence-1920/`.

Nothing stopped the click-through: no crash, no soft-lock, no hang, no console error or warning, no pageerror, no failed request, no HTTP >= 400, no grey BG placeholder, no unfilled `{TOKEN}`, no text leaving its box (see INDEX.md).

## MED

### B-01 MED: park scene draws the rooftop (KNOWN-BUGS #1)
- Repro: any run, park:0 to park:4 (after the rooftop).
- What: the park shows the rooftop clock tower and the "FIGUR WEATHER / Today's f-OR-ecast" sign under cherry blossom. The scene reads as the same place as scene 1.
- Evidence: `E/steeped__butter__010-park-park_0.png`, `E/steeped__butter__011-park-park_0.png`.
- Likely file: `src/date-beta/art/index.js:24-25` (`park: Rooftop`); scene bg set in `src/date-beta/packs/story.json:18-21` (`"bg": "park"`).

### B-02 MED: town:2-6 is five click beats in a row, and the tall crowd lines hide Nanda (KNOWN-BUGS #2)
- Repro: any run to town (after hungry). Click through town:2 to town:6.
- What: town:2 (phone), 3 (magic trick, 28 words), 4 (30), 5 (27), 6 (29) have no choice between them. On town:4-6 the dialogue box is 302 px tall and covers Nanda, only her hair tip and speech bubble show. Same at 1024x768.
- Evidence: `E/steeped__butter__036-town-town_4.png`, `E/steeped__butter__038-town-town_6.png`, `E/vp1024__escape-win__036-town-town_4.png`.
- Likely file: `src/date-beta/packs/obbp.json` (town beat 3 `set` at line 62; inserted beats at line ~160-175, texts at lines 166, 170 and the "curly-haired guy" line); box size from `src/date-beta/beta.css:24` (`.db-say`, min-height 190, grows with text).

### B-03 MED: the win card is reachable on one route only; the groceries route tops out at 99%
- Repro: run `steeped__butter` (all top picks, groceries at park:4): ends at 99%, GAME OVER card with the dead-face Nanda. Run `all-love` (same picks but "Return her book" at park:4): 100%, YOU WIN.
- What: errand-shop picks give 3 + 3 = 6 at most, errand-library picks give 3 + 4 = 7 ("Only you" +4). The loader's goal (69) is the library path, so groceries + everything else best = 68/69 = 99% and can never win. Of the 17 runs, 15 end on GAME OVER; the escape-win / escape-timeout / leave-* endings top out at 67-91% (they contain a -3 or -5 pick). The lock-game win ends on "GAME OVER 84-86%". The engine has an `almost` tier (60-99%) but the end card draws only win vs "She does not love you enough" (99% looks the same as 0% except the heart fill).
- Evidence: `E/steeped__butter__zz-settled-endcard-L1.png` (99%), `E/all-love__zz-settled-endcard-L1.png` (100%), `E/all-hate__zz-settled-endcard-L1.png` (0%), `shots/escape-win__butter/129-escape-win-escape_win_6.png` (end card, 86%).
- Likely file: love values in `src/date-beta/packs/story.json` errand-shop (scene at line 191) vs errand-library (line 331, "Only you" love 4 at line ~406); tier use in `src/date-beta/Hud.jsx:121-122` (`win = end.tier === 'win'`) vs `src/date-beta/engine.js:36,383`.

## LOW

### B-04 LOW: `?love=N` is documented but ignored
- Repro: open `date-beta.html?scene=steeped&beat=4&love=69`. The end card shows 0%, GAME OVER (expected 100%, YOU WIN). Same for love=68, 48, 0.
- Evidence: `E/extra__endcard-win-100.png`; probe values in `extra.json`.
- Likely file: `src/date-beta/main.jsx:112` calls `startAt(SCENES, { rm, at, beat })` without `love`; `engine.js:425` `startAt` accepts `love`. Documented in `src/date-beta/SCENES.md:60`.

### B-05 LOW: `{DAYPART}` / `{TIME}` wording can contradict the scene
- Repro: any run at a clock time outside the scene's mood (test clock was 3 AM).
- What: town:3 reads "It's 3:31 AM, a sleepy night, and this is a classroom" over a daytime crossing; walk-home:3 reads "the day can't end. It's night." under an orange sunset sky. The wording follows the real clock, not the scene.
- Evidence: `E/steeped__butter__035-town-town_3.png`, `E/all-hate__079-walk-home-walk_home_3.png`.
- Likely file: `src/date-beta/packs/obbp.json:62` ("a sleepy {DAYPART}"), `src/date-beta/packs/story.json:967` ("It's {DAYPART}."), `src/date-beta/packs/meta.json:14` (dropped preview copy of the same line).

### B-06 LOW: crowd fills start sentences in lowercase and break agreement
- Repro: any run, town:4 and town:5.
- What: "Trick two. you by the window is thinking about snacks. you with the laptop open is thinking about me." and "Trick three. you pretending not to watch, you laughed a little." Lowercase "you" after a full stop; "you ... is" agreement.
- Evidence: `E/steeped__butter__036-town-town_4.png`.
- Likely file: `src/date-beta/packs/crowd.json:5-8` (CROWD strings), used at `src/date-beta/packs/obbp.json:166,170`.

### B-07 LOW: leave:3 reaction frame repeats the question line
- Repro: `all-hate` run, leave:3 (cold = yes): question is "だめ。You already said forever. I heard it."; pick "FUCK YOU. I'm leaving" (-5) shows the same line again on the reaction frame. Picks "uhmmm yeah ig" and the timer default also re-show the question ("From now on... can we be fORever?"; see `timer.json`).
- Evidence: `E/all-hate__095-leave-leave_3.png`, `E/all-hate__096-leave-leave_3.png`.
- Likely file: `src/date-beta/scenes.json:261` (leave, beat 3 choices have no `react`); the `vary.cold.yes` text at `src/date-beta/packs/story.json:1581`.

### B-08 LOW: 16 s of black between train and platform
- Repro: any run past town. train:0 to platform:2 is 16 click/auto beats; blackout:0-8 are `auto` beats of 1000, 2600, 2600, 1500, 1500, 1500, 2800, 1800, 1000 ms (16.3 s) with no text, then an 800 ms hold. Reduced motion skips blackout:3, 5, 7 (108 vs 111 states).
- Evidence: `shots/steeped__butter/047-blackout-blackout_0.png` to `056-blackout-blackout_9.png`.
- Likely file: `src/date-beta/scenes.json:61` (scene `blackout`). Pacing only; likely pre-existing.

### B-09 LOW: every page load at scene 1 counts as a new run
- Repro: play to an ending, "Back to start" (run 2 -> run 3 arrival), then reload `date-beta.html`. The next station-talk says "Run 4". A refresh mid-run also restarts at rooftop:0 and adds 1.
- Evidence: `E/loop3__leave-yeah__267-L3-station-talk-station_talk_1.png`.
- Likely file: `src/date-beta/main.jsx:139` (`bumpRun()` on every arrival at scene 1) and `src/date-beta/meta.js:21`.

## Not bugs (checked)
- `scrollHeight > clientHeight + 2` flags on `.db-say` / `.db-choice`: measures the absolutely positioned `.pins` / chip decorations (`extra.json`); glyph-range check found no text overflow.
- Reaction-frame and goal-card screenshots taken 350 ms after a beat appears catch the fade-in; settled frames are the `zz-settled-*` / `_evidence-1920` ones.
- Harness note: the 3rd loop in `loop3__leave-yeah` used a page reload, which is why it shows run 4 (B-09).
