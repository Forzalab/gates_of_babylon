// M2 leave routes (sprint 0930): both leave picks really branch in live play (main.jsx PLAY packs), and each walk
// reaches its own leave ending. Before: rooftop "Leave before the rain" fell through to v2-park, and v2-home went
// straight to cup (the only "Say goodnight" was on the off-path door scene). Shots: research/sprint-0930/leave/.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadScenes, start, next, choose, beatAt, ending, timeoutPick, enabled } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import base from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };

const MAIN = readFileSync(new URL('./date-beta/main.jsx', import.meta.url), 'utf8');
const PLAY = JSON.parse(MAIN.match(/const PLAY = (\[[^\]]*\])/)[1].replace(/'/g, '"'));
const pack = (n) => ({ name: n, ...JSON.parse(readFileSync(new URL(`./date-beta/packs/${n}.json`, import.meta.url), 'utf8')) });
const S = loadScenes(applyPacks(base, PLAY.map(pack)), { manifest });

// Walk from scene 1 like a player: at each choice take the first option whose label matches one of `picks` (in order of
// the list), else the timer default. Returns the visited beat ids, the picks taken and the ending.
function walk(picks) {
  let p = start(S, { seed: 1 });
  const seen = [], took = [];
  for (let n = 0; n < 600; n++) {
    const e = ending(S, p);
    if (e) return { seen, took, e, flags: p.flags };
    if (p.react) { p = next(S, p); continue; }
    const b = beatAt(S, p);
    seen.push(`${S[p.s].id}:${p.b}`);
    if (!b.choices) { p = next(S, p); continue; }
    let i = -1;
    for (const re of picks) { i = b.choices.findIndex((c, k) => enabled(c, p.flags) && re.test(c.plain ?? c.text)); if (i >= 0) break; }
    if (i < 0) i = timeoutPick(b, p.flags);
    took.push(`${S[p.s].id}:${p.b}=${b.choices[i].plain ?? b.choices[i].text}`);
    p = choose(S, p, i);
  }
  assert.fail(`no ending after 600 steps; last ${seen.at(-1)}`);
}
const scenesOf = (seen) => [...new Set(seen.map((x) => x.split(':')[0]))];

const ROUTES = [
  { name: 'rooftop leave -> leave-fu', picks: [/Leave before the rain/, /FUCK YOU/], via: 'rooftop', end: 'leave-fu' },
  { name: 'rooftop leave -> leave-yeah', picks: [/Leave before the rain/, /yeah ig/], via: 'rooftop', end: 'leave-yeah' },
  { name: 'v2-home Say goodnight -> leave-fu', picks: [/Say goodnight/, /FUCK YOU/], via: 'v2-home', end: 'leave-fu' },
  { name: 'v2-home Say goodnight -> leave-yeah', picks: [/Say goodnight/, /yeah ig/], via: 'v2-home', end: 'leave-yeah' },
];

for (const r of ROUTES) {
  test(`leave route: ${r.name} reaches its ending`, () => {
    const { seen, took, e } = walk(r.picks);
    const sc = scenesOf(seen);
    assert.equal(e.kind, 'leave');
    assert.equal(e.scene, r.end, `ended in ${e.scene}; took ${took.join(' | ')}`);
    // the branch is real: the leave pick lands on leave:0 next, and every leave beat plays in order
    const at = seen.indexOf('leave:0');
    assert.ok(at > 0, 'leave:0 never shown');
    assert.equal(seen[at - 1], r.via === 'rooftop' ? 'rooftop:11' : 'v2-home:4', `leave:0 came after ${seen[at - 1]}`);
    for (const id of ['leave:1', 'leave:2', 'leave:3', `${r.end}:0`]) assert.ok(seen.includes(id), `${id} skipped`);
    assert.ok(!sc.includes('cup') && !sc.includes('door'), `went through ${sc.join(' > ')}`);
    if (r.via === 'rooftop') assert.deepEqual(sc, ['rooftop', 'leave', r.end], `rooftop leave walked ${sc.join(' > ')}`);
    else assert.ok(sc.includes('v2-park') && sc.includes('v2-home') && sc.indexOf('v2-home') < sc.indexOf('leave'));
  });
}

test('leave route: the other rooftop picks still go to the park, and v2-home "Sit down" still goes to cup', () => {
  const roof = S.find((s) => s.id === 'rooftop'), home = S.find((s) => s.id === 'v2-home');
  const last = roof.beats.at(-1), seat = home.beats.at(-1);
  assert.deepEqual(last.choices.map((c) => c.go), ['v2-park', 'v2-park', 'leave']);
  assert.deepEqual(seat.choices.map((c) => [c.plain ?? c.text, c.go]), [['Sit down', 'cup'], ['Say goodnight', 'leave']]);
  assert.ok(last.loveHidden && seat.loveHidden, 'both leave picks are consequential, so their chips show ??');
  const { e } = walk([/Stay a minute/, /Sit down/]);
  assert.notEqual(e.scene, 'leave-fu');
  assert.notEqual(e.scene, 'leave-yeah');
});
