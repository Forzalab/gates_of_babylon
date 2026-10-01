// Logic sounds: every event has a recipe, each is short and quiet, and play() never throws without a context.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RECIPES, play } from './logicSfx.js';

// A fake AudioContext that records gain peaks: enough to check length and loudness without a browser.
function fakeCtx() {
  const peaks = [];
  const param = () => ({ value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime(v) { peaks.push(v); } });
  const node = () => ({ connect: (n) => n, start() {}, stop() {}, frequency: param(), Q: param(), gain: param(), type: '' });
  return { peaks, sampleRate: 8000, createOscillator: node, createGain: node, createBiquadFilter: node, createBufferSource: node,
    createBuffer: (ch, n) => ({ getChannelData: () => new Float32Array(n) }) };
}

test('logic sfx: the six events + off all have short, quiet recipes', () => {
  assert.deepEqual(Object.keys(RECIPES).sort(), ['connect', 'disconnect', 'off', 'on', 'place', 'reject', 'trash']);
  for (const [id, r] of Object.entries(RECIPES)) {
    const c = fakeCtx(), len = r(c, {}, 0, 1);
    assert.ok(len > 0 && len < 0.3, `${id} length ${len}`);
    assert.ok(Math.max(...c.peaks) <= 0.09, `${id} peak ${Math.max(...c.peaks)}`);
  }
});

test('logic sfx: play() before any gesture is a silent no-op', () => {
  assert.doesNotThrow(() => { play('connect'); play('nope'); });
});
