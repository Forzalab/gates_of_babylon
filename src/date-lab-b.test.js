// Builder B (date-lab round 1): pure parts. The DOOR menu state machine (timeout -> pink, replay-disabled),
// the synth cue table (a caption for every cue, a recipe for every cue), timelines (hold >= 500 ms, <= 12 words),
// and the handheld shake cap (<= 3 Hz).
import test from 'node:test';
import assert from 'node:assert/strict';
import { DOOR, openMenu, tick, choose, fallback, replay, remaining, secondsLeft, enabled, PINK, PURPLE } from './date-lab/b/shared/door.js';
import { CUES, CUE_IDS } from './date-lab/b/shared/cues.js';
import { RECIPES } from './date-lab/b/shared/audio.js';
import { build, shotAt, poseAt, lint, HANDHELD, handheld } from './date-lab/b/shared/timeline.js';
import { words } from './date-beta/engine.js';

test('door menu: the two options, colours and the 5 s timer', () => {
  assert.equal(DOOR.timeout, 5000);
  assert.deepEqual(DOOR.options.map((o) => o.label), ['Just one cup.', "It's late. Goodnight."]);
  assert.equal(DOOR.options[0].color, PINK);
  assert.equal(DOOR.options[1].color, PURPLE);
  assert.equal(PINK, '#FF5FA2');
  assert.equal(PURPLE, '#8A5CF6');
  for (const o of DOOR.options) assert.ok(words(o.label) <= 12);
  assert.ok(words(DOOR.prompt) <= 12);
});

test('door menu: no pick = pink on timeout', () => {
  let s = openMenu();
  for (let i = 0; i < 49; i++) s = tick(s, 100);
  assert.equal(s.done, false);
  assert.ok(remaining(s) > 0 && remaining(s) < 0.05);
  s = tick(s, 200);
  assert.equal(s.done, true);
  assert.equal(s.picked, 'pink');
  assert.equal(s.via, 'timeout');
  assert.equal(tick(s, 1000), s, 'a settled menu does not move');
});

test('door menu: a click needs the 500 ms hold; picks settle once', () => {
  let s = openMenu();
  assert.equal(choose(s, 'purple'), s, 'too early');
  s = tick(s, 600);
  s = choose(s, 'purple');
  assert.equal(s.picked, 'purple');
  assert.equal(s.via, 'click');
  assert.equal(choose(s, 'pink').picked, 'purple');
  assert.equal(choose(tick(openMenu(), 600), 'nope').done, false);
});

test('door menu: replay disables the picked option, the timer still runs', () => {
  const first = choose(tick(openMenu(), 800), 'purple');
  let s = replay(first);
  assert.deepEqual(s.disabled, ['purple']);
  assert.equal(s.done, false);
  assert.equal(s.t, 0);
  s = tick(s, 700);
  assert.equal(choose(s, 'purple').done, false, 'disabled option cannot be clicked');
  assert.ok(s.t > 0, 'timer runs in the replay');
  s = tick(s, 5000);
  assert.equal(s.picked, 'pink');
  assert.deepEqual(enabled(s).map((o) => o.id), ['pink']);
});

test('door menu: replay after pink leaves only purple, and the timeout takes it', () => {
  const s = replay(choose(tick(openMenu(), 800), 'pink'));
  assert.equal(fallback(s), 'purple');
  assert.equal(tick(s, 6000).picked, 'purple');
});

test('door menu: whole seconds for the reduced-motion blocks', () => {
  const s = openMenu();
  assert.equal(secondsLeft(s), 5);
  assert.equal(secondsLeft(tick(s, 1)), 5);
  assert.equal(secondsLeft(tick(s, 1000)), 4);
  assert.equal(secondsLeft(tick(s, 4999)), 1);
});

test('sfx: every cue has a caption and a synth recipe (no audio files)', () => {
  assert.ok(CUE_IDS.length >= 20);
  for (const id of CUE_IDS) {
    const c = CUES[id];
    assert.ok(typeof c.caption === 'string' && c.caption.trim().length > 2, `${id} caption`);
    assert.ok(['shot', 'bed', 'bus'].includes(c.kind), `${id} kind`);
    assert.ok(words(c.caption) <= 12, `${id} caption <= 12 words`);
    if (c.kind !== 'bus') assert.equal(typeof RECIPES[id], 'function', `${id} recipe`);
  }
  for (const id of ['rain', 'breath', 'sour', 'bleed', 'steam', 'static', 'thump', 'bell', 'muffle']) assert.ok(CUES[id], `demo-path cue ${id}`);
  for (const id of Object.keys(RECIPES)) assert.ok(CUES[id], `recipe ${id} has a cue`);
});

test('timeline: shots, hard-cut poses under reduced motion, lint', () => {
  const tl = build([
    { id: 'a', dur: 1000, cam: [[0, { x: 0, s: 1 }], [1, { x: 100, s: 2 }]], text: 'One two three.' },
    { id: 'b', dur: 2000, cam: [[0, { x: 5 }], [0.5, { x: 50 }]] },
  ]);
  assert.equal(tl.total, 3000);
  assert.equal(shotAt(tl, 1500).shot.id, 'b');
  assert.equal(shotAt(tl, 99999).shot.id, 'b');
  const mid = poseAt(tl.shots[0].cam, 0.5);
  assert.ok(mid.x > 0 && mid.x < 100);
  assert.deepEqual(poseAt(tl.shots[0].cam, 0.5, true), { x: 0, s: 1 }, 'rm holds the keyframe (hard cut)');
  assert.deepEqual(poseAt(tl.shots[0].cam, 1, true), { x: 100, s: 2 });
  assert.deepEqual(lint(tl), []);
  assert.equal(lint(build([{ id: 'x', dur: 200, text: 'one two three four five six seven eight nine ten eleven twelve thirteen' }])).length, 2);
});

test('handheld drift: every component <= 3 Hz, bounded', () => {
  for (const h of HANDHELD) assert.ok(h.hz <= 3, `${h.axis} ${h.hz} Hz`);
  for (let t = 0; t < 20000; t += 37) {
    const o = handheld(t);
    assert.ok(Math.abs(o.x) < 25 && Math.abs(o.y) < 20 && Math.abs(o.r) < 1.5);
  }
});
