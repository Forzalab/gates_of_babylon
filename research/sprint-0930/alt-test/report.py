#!/usr/bin/env python3
"""report.py: results.json -> INDEX.md (run tables, verdicts, per-run beat lists). Verdict text lives in VERDICTS below."""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(HERE, 'results.json')))
runs = d['results']
ORDER = ['steeped__butter', 'steeped__katsu', 'escape-win__butter', 'escape-win__katsu', 'escape-timeout__butter', 'escape-timeout__katsu',
         'leave-fu__butter', 'leave-fu__katsu', 'leave-yeah__butter', 'leave-yeah__katsu', 'errand-groceries__steeped', 'errand-library__steeped',
         'all-hate', 'all-love', 'reduced-motion__steeped', 'vp1024__escape-win', 'loop3__leave-yeah']
runs.sort(key=lambda r: ORDER.index(r['name']))
E = 'shots/_evidence-1920/'

VERDICTS = [
    ('1', 'park has no art (Rooftop stand-in)', 'FAIL (still true)',
     'Park beats 0-4 draw the rooftop clock tower with the "FIGUR WEATHER / Today\'s f-OR-ecast" sign and cherry blossom. ' \
     f'`{E}steeped__butter__010-park-park_0.png`'),
    ('2', 'Crowd tricks 2-3 + Tony line inside town', 'FAIL (MED)',
     'town:2-6 is 5 click beats in a row with no choice; town:3-6 are 28/30/27/29 words. On town:4-6 the dialogue box grows to 302 px tall and covers Nanda '
     f'(only her hair tip and bubble show). `{E}steeped__butter__036-town-town_4.png`, `{E}steeped__butter__038-town-town_6.png`. Also at 1024x768: `{E}vp1024__escape-win__036-town-town_4.png`. No crash, no overflow.'),
    ('3', 'Loop lines in station-talk 1-3 on every run', 'FAIL (LOW)',
     'Run 1 shows "Hey... have we stood here before? No. Silly." / "(Weird. Feels like I\'ve heard that before.)" / "Deja vu is just your heart remembering me early." '
     'then station-talk:4: 5 click beats in a row (station-talk:1 to rain-crossing:0). Run 2 and run 3+ variants swap in correctly (see RUN table). '
     f'`{E}loop3__leave-yeah__062-station-talk-station_talk_1.png` (run 1), `{E}loop3__leave-yeah__164-L2-station-talk-station_talk_1.png` (run 2), `{E}loop3__leave-yeah__267-L3-station-talk-station_talk_1.png` (run 4, see B-09).'),
    ('4', 'Story 3-way neutral picks now side "mid"', 'PASS',
     '440 three-choice beats seen across 17 runs (77 two-choice): every one lays out left to right pink, mid, purple, one row, y=860 (x=90 / 683 / 1277). '
     f'`{E}steeped__butter__001-rooftop-rooftop_1.png`, `{E}steeped__butter__010-park-park_0.png`. 2-choice MOVE beats: pink left, purple right.'),
    ('5', 'Echo-lint: "sweet" -> "cute" in errand-library 1', 'PASS',
     'errand-library:1 choice 0 reads "That\'s so cute" (chip +3), no "sweet"; loads with no lint error. '
     f'`{E}errand-library__steeped__019-errand-library-errand_library_1.png`'),
    ('6', 'Lock game win/lose routing (props.win 0 / lose 1)', 'PASS',
     'Solving all 8 pairs shows "THE DOOR IS OPEN" and goes to escape-win (escape-win__butter/katsu, vp1024). Letting 40 s run out (time shown 40s, then 10s with the low style) goes to escape-timeout (both foods). '
     f'`{E}escape-win__butter__122-escape-escape_13.png`, `{E}escape-timeout__butter__121-escape-escape_13.png`, `{E}escape-win__butter__123-escape-win-escape_win_0.png`, `{E}escape-timeout__butter__122-escape-timeout-escape_timeout_0.png`. '
     'Works at 1024x768 too. Note: the choice buttons are not drawn on the lock-game beat (by design), so the "Stay right here" fake is unreachable.'),
    ('7', 'Nanda centred: overlap with chips / react bubbles', 'PASS (chips) / see B-02 (dialogue box)',
     'Across every beat of 17 runs the walker found 0 overlaps between Nanda\'s art and any choice button, chip, or the +N/tell pop. Raised choice beats and reaction beats (big bubble) are clear: '
     f'`{E}steeped__butter__010-park-park_0.png`, `{E}steeped__butter__011-park-park_0.png`. The only overlap is the dialogue box covering her lower body on every beat, and almost all of her on town:4-6.'),
    ('8', 'fake flash on walk-home 5 vs next scene', 'PASS',
     'Picking "Run home alone" plays choice 0: apartment:0 opens with the chosen-flash card "YOU CHOSE TO FOLLOW HER INSIDE." over the beat; dialogue "Four floors. One window lit." is readable under it and a click moves on to apartment:1 (no stall, no error). '
     f'`{E}all-hate__083-apartment-apartment_0.png` (pick: `{E}all-hate__082-walk-home-walk_home_5.png`).'),
]

o = []
w = o.append
w('# PR #27 (sprint/obbp) click-through test, alt')
w('')
w('- Commit tested: `c851871` (origin/sprint/obbp), fresh `npm ci`.')
w('- `npm test`: tests 282, pass 282, fail 0, cancelled 0, skipped 0, todo 0.')
w('- `npm run build`: OK (vite, "built in 1.29s", 0 errors).')
w('- Served with `npx vite preview --port 5493 --strictPort`; entry `index.html?demo`, click `h1.wordmark`, then click through. Chromium, Playwright, 1920x1080 unless noted.')
w('- Walker: `walk.mjs` (runs come from the applied scene graph, `graph.json`, made by `graph.mjs` with the main.jsx PLAY order story, meta, mech, lockgame, obbp). Probes: `extra.mjs`, `timer.mjs`. `post.py` makes the 256-colour shots; `report.py` makes this file. Raw results: `results.json`.')
w('- Shots: `shots/<run>/NNN-<scene>-<beat>.png`, 256 colours. Full 1920x1080 evidence frames in `shots/_evidence-1920/`. To stay under 60 MB the per-beat shots are scaled: 384 px wide for the 7 key runs (steeped__butter, escape-win__butter, all-hate, all-love, reduced-motion, vp1024, loop3), 256 px wide for the rest. The 1024 run is scaled the same way. 5 identical consecutive frames were dropped (the row then says "dup").')
w('- Beat rows are one per new screen state (a beat, its reaction frame, a lock-game stage), so rows exceed scene beat counts.')
w('')
w('## Scene graph (after packs)')
w('')
w(f"- Endings found: {', '.join(d['endings'])} (5, no new ids). Love goal (auto): 69. Flags: bento, cold, errand, food, run.")
w('- Routing choice beats: ' + '; '.join(f'`{x}`' for x in d['routing']))
w('')
w('## Runs')
w('')
w('| run | viewport | beats | console err/warn, pageerror, failed req, http>=400 | grey BG boxes | unfilled {TOKEN} | overflow flag (spec metric) | glyphs leave box | Nanda over choice/chip/pop | hung | ending, love |')
w('|---|---|---|---|---|---|---|---|---|---|---|')
for r in runs:
    B = [b for b in r['beats'] if not b.get('hung')]
    ends = [b['endCard'] for b in B if b['endCard']]
    endtxt = ', '.join(f"{e['kicker']} {e['num']}" for e in ends[:1]) + (f' (x{len(ends)} loops)' if len(ends) > 1 else '')
    vp = f"{r['w']}x{r['h']}" + (' RM' if r.get('rm') else '')
    w(f"| {r['name']} | {vp} | {len(B)} | {len(r['errs'])} | {sum(bool(b['grey']) for b in B)} | {sum(bool(b['tokens']) for b in B)} | {sum(bool(b['over']) for b in B)} of {len(B)} | "
      f"{sum(bool(b['leaves']) for b in B)} | {sum(any(not x.startswith('say') for x in b['nandaOverlap']) for b in B)} | {('HUNG at ' + r['hung']) if r['hung'] else 'no'} | {endtxt} |")
w('')
w('Overflow flag: `scrollHeight > clientHeight + 2` fires on `.db-say` (and `.db-choice`, `.hud-card`, `.hud-end`) on most beats with the same +22..+40 px every time. `extra.json` `overflowProbe`: with the absolutely positioned `.pins` / `.db-chip` decorations hidden, `scrollHeight == clientHeight` (245 = 245, 150 = 150), so the flag measures those decorations. The glyph-range check (text leaves its box or the screen) found 0 in all 17 runs. No text overflow was found.')
w('')
w('Other things checked and clean in all runs: no `data:image/svg+xml` BG placeholder, no `{TOKEN}` text on screen, no console error or warning, no pageerror, no failed request, no HTTP >= 400, no run hung (longest 415 s wall for the 3-loop run, 3 concurrent browsers).')
w('')
w('Timers: 421 timed choice beats seen; every one drew the bar and a seconds number (12, or 11 at first look); no untimed beat drew a bar. `timer.mjs`: on rooftop:1, door:3 and leave:3 the count ran 10 -> 4 -> expiry, and expiry picked the default (rooftop: umeboshi +1 "She liked that."; door: "One cup, then home"; leave:3: the default is the fake, which plays "uhmmm yeah ig"). Lock game shows its own seconds (40s -> 37s -> 10s low).')
w('')
w('## RUN loop (second run in the same browser context)')
w('')
w('`loop3__leave-yeah`: one context, localStorage kept. Loop 1 (page load, run 1), "Back to start" (run 2), then a page reload after the second ending.')
w('')
w('| loop | station-talk:1 | station-talk:2 | park:0 react `{RUN}` |')
w('|---|---|---|---|')
w('| 1 (run 1) | "Hey... have we stood here before? No. Silly. It\'s just a nice day. It\'s 3:31 AM. Remember that." | "(Weird. Feels like I\'ve heard that before.)" | not shown (no hate pick) |')
w('| 2 (run 2) | "Wait. Why is everything the same? Same rain. Same 3:33 AM. You said that exact thing last time. I remember. Do you?" | "Didn\'t we already do this? The bento, the train, the tea... Nanda, are we in a loop?" | not shown |')
w('| 3 (page reload, shows run 4) | "Run 4. Same day. You know, I know. Skip the small talk. It\'s 3:36 AM again. Hold my hand." | "Run 4. I know every line. So do you." | not shown |')
w('')
w('The run-1 hate token: all-hate park:0 react reads "You always learn, around run 1." (`{RUN}` filled). `{RUN}=2` variants (PASS) and run-3+ variants (PASS) both replace the base lines. The reload counted as another arrival at scene 1 (the ending\'s "Back to start" was arrival 3, the reload arrival 4), see B-09.')
w('')
w('## KNOWN-BUGS #1-#8')
w('')
w('| # | item | verdict | evidence |')
w('|---|---|---|---|')
for n, t, v, ev in VERDICTS:
    w(f'| {n} | {t} | **{v}** | {ev} |')
w('')
w('## Endings and love (facts)')
w('')
w('| run | love at end card | card |')
w('|---|---|---|')
for r in runs:
    e = [b for b in r['beats'] if b.get('endCard')]
    if e: w(f"| {r['name']} | {e[0]['endCard']['num']} | {e[0]['endCard']['kicker']} / {e[0]['endCard']['h2']} |")
w('')
w('Only all-love (butter chicken, library, all top picks) and the reduced-motion run (same picks) reach 100% and the win card: `' + E + 'all-love__zz-settled-endcard-L1.png`. The best groceries-route run (steeped__butter, every top pick, groceries) ends at 99% with GAME OVER: `' + E + 'steeped__butter__zz-settled-endcard-L1.png`. Lowest: all-hate 0%: `' + E + 'all-hate__zz-settled-endcard-L1.png`. Goal card: `' + E + 'steeped__butter__zz-settled-goalcard.png`.')
w('')
w('## Per-run ordered beat lists')
w('')
for r in runs:
    w(f"### {r['name']} ({r['w']}x{r['h']}{', reduced motion' if r.get('rm') else ''})")
    w('')
    w('| # | shot | scene:beat | line (80) | choices (text, chip) | love | timer |')
    w('|---|---|---|---|---|---|---|')
    for i, b in enumerate(r['beats']):
        if b.get('hung'):
            w(f"| {i} | | HUNG at {b['beat']} | | | | |")
            continue
        shot = f"shots/{r['name']}/{b['shot']}"
        link = f"[png]({shot})" if os.path.exists(os.path.join(HERE, shot)) else 'dup'
        line = ((b['who'] + ': ' if b['who'] else '') + b['line']).replace('\n', ' ').replace('|', '/')[:80]
        ch = '; '.join(f"{c['text']} {c['chip'] or ''}".strip() for c in b['choices']).replace('|', '/')
        love = f"{b['pct']}" if b['pct'] else ''
        t = b['timerSecs'] if (b['timerBar'] or b['game']) and b['timerSecs'] else ''
        tag = ('L' + str(b['loop']) + ' ') if r['name'].startswith('loop3') else ''
        if b['endCard']: line = f"[END CARD] {b['endCard']['kicker']} {b['endCard']['num']}"
        if b['goalCard']: line = '[GOAL CARD]'
        if b['game']: line = f"[LOCK GAME] {b['game']['title']} pins {b['game']['pins']}/8"
        if b['fx'] and b['fxText']: line += f" [fx {b['fx']}: {b['fxText']}]"
        elif b['fx']: line += f" [fx {b['fx']}]"
        w(f"| {i} | {link} | {tag}{b['beat']} | {line} | {ch} | {love} | {t} |")
    w('')
open(os.path.join(HERE, 'INDEX.md'), 'w').write('\n'.join(o))
print('INDEX.md', len('\n'.join(o)) // 1024, 'KB')
