import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { blind, shuffleOrder } from './date-beta/meta.js';

test('blind run: run 1 hides chips + shuffles, replays (run 2+) do not', () => {
  assert.equal(blind(1), true);
  assert.equal(blind(2), false);
  assert.equal(blind(7), false);
});

test('shuffleOrder: a permutation, the same per seed + beat, and it varies across beats', () => {
  for (const n of [2, 3, 4, 5]) {
    const o = shuffleOrder(n, 42, 'rooftop:3');
    assert.deepEqual([...o].sort((a, b) => a - b), Array.from({ length: n }, (_, i) => i), `n=${n} is a permutation`);
    assert.deepEqual(shuffleOrder(n, 42, 'rooftop:3'), o, 'deterministic');
  }
  const seen = new Set(Array.from({ length: 40 }, (_, k) => shuffleOrder(3, 1, `s:${k}`).join('')));
  assert.ok(seen.size >= 4, `3 choices over 40 beats hit ${seen.size} of 6 orders`);
});

test('Choices wiring: a shown slot picks its ORIGINAL index; keys follow the shown order; no chips when blind', () => {
  const say = readFileSync(new URL('./date-beta/Say.jsx', import.meta.url), 'utf8');
  assert.match(say, /\(order \?\? choices\.map\(\(_, i\) => i\)\)\.map\(\(i, slot\)/);
  assert.match(say, /onPick\(i\)/, 'the click passes the original index');
  assert.match(say, /const chips = !blind && /);
  const main = readFileSync(new URL('./date-beta/main.jsx', import.meta.url), 'utf8');
  assert.match(main, /pick\(orderRef\.current\?\.\[\+e\.key - 1\] \?\? \+e\.key - 1\)/);
});
