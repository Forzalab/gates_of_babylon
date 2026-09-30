// T5 mechanics: 3 choices, fx, fake, hate emote, timer minimum.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadScenes, start, choose, next, MIN_TIMER } from './date-beta/engine.js';

const sc = (choices, extra = {}) => loadScenes({ scenes: [
  { id: 'a', bg: 'x', nanda: true, beats: [{ text: 'NANDA: Which?', choices, ...extra }, { text: 'after' }] },
  { id: 'b', bg: 'x', beats: [{ text: 'far' }] }] });

test('three choices get pink / mid / purple; four fail', () => {
  const s = sc([{ text: 'a' }, { text: 'b' }, { text: 'c' }]);
  assert.deepEqual(s[0].beats[0].choices.map((c) => c.side), ['pink', 'mid', 'purple']);
  assert.throws(() => sc([{ text: 'a' }, { text: 'b' }, { text: 'c' }, { text: 'd' }]), /1\.\.3/);
});
test('timer is at least 12 s', () => {
  assert.equal(sc([{ text: 'a' }], { timer: 3 })[0].beats[0].timer, MIN_TIMER);
  assert.equal(sc([{ text: 'a' }], { timer: 20 })[0].beats[0].timer, 20);
});
test('fx values are validated; hate-quake defaults the hate emote; fx rides the pick', () => {
  assert.throws(() => sc([{ text: 'a', fx: 'boom' }]), /fx/);
  const s = sc([{ text: 'a' }, { text: 'b', love: -3, fx: 'hate-quake' }]);
  assert.equal(s[0].beats[0].choices[1].emote, 'hate');
  assert.equal(choose(s, start(s), 1).fx.kind, 'hate-quake');
});
test('fx clears on the next beat', () => {
  const s = sc([{ text: 'a', fx: 'love-burst' }]);
  const p = choose(s, start(s), 0);
  assert.ok(p.fx);
  assert.equal(next(s, p).fx, undefined);
});
test('lines and reactions allow 30 words, buttons stay at 12', () => {
  const w = (n) => Array.from({ length: n }, (_, i) => `w${i}`).join(' ');
  assert.doesNotThrow(() => sc([{ text: 'a', love: 1, react: w(30) }], { text: w(30) }));
  assert.throws(() => sc([{ text: 'a' }], { text: w(31) }), /31 words/);
  assert.throws(() => sc([{ text: 'a', love: 1, react: w(31) }]), /react has 31/);
  assert.throws(() => sc([{ text: w(13) }]), /max 12/);
});
test('declared flag cold (no|yes): pick sets it, vary swaps the second cold line', () => {
  const s = loadScenes({ flags: { cold: ['no', 'yes'] }, scenes: [{ id: 'a', bg: 'x', nanda: true, beats: [
    { text: 'NANDA: Which?', choices: [{ text: 'a', set: { cold: 'no' } }, { text: 'b', set: { cold: 'yes' }, love: -2, fx: 'hate-quake' }] },
    { text: 'NANDA: Hello again.', vary: { cold: { no: { text: 'NANDA: Yay, hi!' }, yes: { text: 'NANDA: What now.' } } } }] }] });
  const p = choose(s, start(s), 1);
  assert.equal(p.flags.cold, 'yes');
  assert.throws(() => loadScenes({ flags: { cold: ['no', 'yes'] }, scenes: [{ id: 'a', bg: 'x', beats: [{ text: 'x', choices: [{ text: 'a', set: { cold: 'maybe' } }] }] }] }), /not one of/);
});
test('fake: plays the first choice and flashes its action', () => {
  const s = sc([{ text: 'Go down', go: 'b', love: 1 }, { text: 'Stay up', fake: true, go: 'a' }]);
  const p = choose(s, start(s), 1);
  assert.equal(s[p.s].id, 'b');
  assert.deepEqual({ ...p.fx }, { kind: 'chosen-flash', action: 'Go down', fake: true });
  assert.throws(() => sc([{ text: 'x', fake: true }, { text: 'y' }]), /first choice/);
});
