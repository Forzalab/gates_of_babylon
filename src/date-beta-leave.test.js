// M2 (09-30): the leave endings (leave, leave-fu, leave-yeah) are reachable in live play by real choices from a fresh
// start, and the old routes still reach their endings. The graph is the shipped one: scenes.json + main.jsx PLAY packs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadScenes, start, next, choose, beatAt, beatView, ending, enabled, resolveGo, sceneIndex } from './date-beta/engine.js';
import { applyPacks } from './date-beta/packs/index.js';
import base from './date-beta/scenes.json' with { type: 'json' };
import manifest from './date-beta/assets.json' with { type: 'json' };

const MAIN = readFileSync(new URL('./date-beta/main.jsx', import.meta.url), 'utf8');
const PLAY = JSON.parse(MAIN.match(/const PLAY = (\[[^\]]*\])/)[1].replace(/'/g, '"'));
const pack = (n) => ({ name: n, ...JSON.parse(readFileSync(new URL(`./date-beta/packs/${n}.json`, import.meta.url), 'utf8')) });
const S = loadScenes(applyPacks(base, PLAY.map(pack)), { manifest });
const sc = (id) => S[sceneIndex(S, id)];
const label = (c) => c.plain ?? c.text.replace(/\{OR\}\s*/g, '');

// Play from a fresh start like a player: click through, and on a choice beat take the option whose label matches
// picks[`scene:beat`] (a regex), else the first enabled option. Returns the end position and the scenes entered.
function play(picks = {}) {
  let p = start(S, { seed: 1 });
  const seen = [S[p.s].id];
  for (let n = 0; n < 600; n++) {
    const b = beatAt(S, p);
    if (b.end && !p.react) return { p, seen, end: ending(S, p) };
    if (p.react || !b.choices) p = next(S, p);
    else {
      const want = picks[`${S[p.s].id}:${p.b}`];
      let i = want ? b.choices.findIndex((c) => want.test(label(c)) && enabled(c, p.flags)) : -1;
      assert.ok(!want || i >= 0, `no option ${want} at ${S[p.s].id}:${p.b} (${b.choices.map(label)})`);
      if (i < 0) i = b.choices.findIndex((c) => enabled(c, p.flags));
      p = choose(S, p, i);
    }
    if (seen.at(-1) !== S[p.s].id) seen.push(S[p.s].id);
  }
  throw new Error(`no ending after 600 steps (at ${S[p.s].id}:${p.b})`);
}

const LEAVE_ROOF = { 'rooftop:11': /Leave before the rain$/ };
const GOODNIGHT = { 'v2-home:4': /^Say goodnight$/ };
const FU = { 'leave:3': /^FUCK YOU/ };
const YEAH = { 'leave:3': /^uhmmm yeah ig$/ };

test('leave: rooftop "Leave before the rain" goes to the leave scene, not the park', () => {
  const roof = sc('rooftop').beats[11];
  const leave = roof.choices.find((c) => /Leave before the rain/.test(label(c)));
  assert.equal(resolveGo(leave.go, {}), 'leave');
  for (const c of roof.choices.filter((x) => x !== leave)) assert.equal(resolveGo(c.go, {}), 'v2-park', label(c));
});

test('leave: from the rooftop leave, "FUCK YOU. I\'m leaving" reaches leave-fu (a LEAVE ending)', () => {
  const r = play({ ...LEAVE_ROOF, ...FU });
  assert.deepEqual(r.seen, ['rooftop', 'leave', 'leave-fu']);
  assert.equal(beatAt(S, r.p).end, 'leave');
  assert.equal(r.end.scene, 'leave-fu');
  assert.equal(r.end.tier, 'low');
});

test('leave: from the rooftop leave, "uhmmm yeah ig" reaches leave-yeah (a LEAVE ending)', () => {
  const r = play({ ...LEAVE_ROOF, ...YEAH });
  assert.deepEqual(r.seen, ['rooftop', 'leave', 'leave-yeah']);
  assert.equal(r.end.scene, 'leave-yeah');
});

test('leave: the full day, then "Say goodnight" in her home, reaches leave, then leave-fu or leave-yeah', () => {
  for (const [picks, end] of [[FU, 'leave-fu'], [YEAH, 'leave-yeah']]) {
    const r = play({ ...GOODNIGHT, ...picks });
    assert.deepEqual(r.seen.slice(0, 2), ['rooftop', 'v2-park']);
    assert.deepEqual(r.seen.slice(-3), ['v2-home', 'leave', end]);
    assert.ok(!r.seen.includes('cup'), 'goodnight skips the tea');
    assert.equal(r.end.scene, end);
  }
});

test('leave: the old routes still reach their endings (steeped, escape-win, escape-timeout)', () => {
  const steeped = play();
  assert.deepEqual(steeped.seen.slice(-3), ['v2-home', 'cup', 'steeped']);
  assert.equal(steeped.end.tier, 'win', 'all first picks still fill her heart');
  const run = (pick) => play({ 'cup:4': /^Stand up$/, 'escape:15': pick });
  assert.equal(run(/^Leave her house$/).end.scene, 'escape-win');
  assert.equal(run(/^Wait for her$/).end.scene, 'escape-timeout');
  assert.ok(!steeped.seen.includes('leave'));
});

test('leave: every ending is reachable in the scene graph from scene 1 (choices + fall-through)', () => {
  const reach = new Set([0]), todo = [0];
  while (todo.length) {
    const s = todo.pop();
    let falls = true;
    for (const b of S[s].beats) {
      if (!b.choices) continue;
      for (const c of b.choices) for (const g of [c.go].flat()) {
        const to = g == null ? null : typeof g === 'string' ? g : g.to;
        if (to && to !== S[0].id) { const k = sceneIndex(S, to); if (!reach.has(k)) { reach.add(k); todo.push(k); } }
      }
      if (b.end || b.choices.every((c) => c.go != null && (typeof c.go === 'string' || c.go.some((g) => typeof g === 'string')))) { falls = false; break; }
    }
    if (falls && s + 1 < S.length && !reach.has(s + 1)) { reach.add(s + 1); todo.push(s + 1); }
  }
  const ids = new Set([...reach].map((k) => S[k].id));
  for (const id of ['leave', 'leave-fu', 'leave-yeah', 'steeped', 'escape-win', 'escape-timeout']) assert.ok(ids.has(id), id);
});

test('leave: "Leaving is not an option" plays on the rooftop when you left it, at her door 12 when you left her home', () => {
  const b = sc('leave').beats[0];
  assert.equal(beatView(b, { left: 'roof' }).bg, 'rooftop-noon');
  assert.equal(beatView(b, { left: 'home' }).bg, 'BG-D1');
  // the flag is set on both ways out, so a new run never keeps the last run's value
  assert.equal(sc('rooftop').beats[11].choices[2].set.left, 'roof');
  assert.equal(sc('v2-home').beats[4].choices.find((c) => label(c) === 'Say goodnight').set.left, 'home');
});

test('leave: both new branch beats score every option (+ and -) and hide the chips (consequential)', () => {
  for (const b of [sc('rooftop').beats[11], sc('v2-home').beats[4]]) {
    assert.equal(b.loveHidden, true);
    assert.ok(b.choices.every((c) => Number.isInteger(c.love) && c.love !== 0));
    assert.ok(Math.max(...b.choices.map((c) => c.love)) > 0 && Math.min(...b.choices.map((c) => c.love)) < 0);
  }
});
