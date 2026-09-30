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
test('fake: plays the first choice and flashes its action', () => {
  const s = sc([{ text: 'Go down', go: 'b', love: 1 }, { text: 'Stay up', fake: true, go: 'a' }]);
  const p = choose(s, start(s), 1);
  assert.equal(s[p.s].id, 'b');
  assert.deepEqual({ ...p.fx }, { kind: 'chosen-flash', action: 'Go down', fake: true });
  assert.throws(() => sc([{ text: 'x', fake: true }, { text: 'y' }]), /first choice/);
});
