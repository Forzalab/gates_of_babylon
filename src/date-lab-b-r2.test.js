// Builder B (date-lab round 2): pure parts of the round-2 variants.
import test from 'node:test';
import assert from 'node:assert/strict';
import { DOOR, openMenu, tick, choose } from './date-lab/b/shared/door.js';
import { EDIT, editDone, purpleLabel, retyped, outcome, pinkFill, widths, tally, PREPOUR } from './date-lab/b/menur2/edit.js';
import { words } from './date-beta/engine.js';

const run = (s, ms) => { let x = s; for (let t = 0; t < ms; t += 25) x = tick(x, 25); return x; };

test('menu-h2-r2: her edit runs on the 8 fps grid, every held state >= 334 ms, done before the timeout', () => {
  assert.equal(EDIT.selectAt - EDIT.glitchAt >= 334, true);
  assert.equal(EDIT.typeAt - EDIT.selectAt >= 334, true);
  assert.equal(EDIT.key, 125);
  assert.ok(editDone < DOOR.timeout, 'she finishes typing before the timer ends');
  assert.equal(purpleLabel(0).word, 'Goodnight.');
  assert.equal(purpleLabel(2999).stage, 'clean');
  assert.equal(purpleLabel(3100).stage, 'glitch');
  assert.equal(purpleLabel(3500).stage, 'select');
  assert.equal(purpleLabel(3900).word, 'S');
  assert.equal(purpleLabel(editDone).word, 'Stay.');
  assert.equal(purpleLabel(editDone).stage, 'done');
  // glitch <= 2 swaps a second: clean->glitch->select happen >= 334 ms apart
  const swaps = [EDIT.glitchAt, EDIT.selectAt, EDIT.typeAt];
  for (let i = 1; i < swaps.length; i++) assert.ok(swaps[i] - swaps[i - 1] >= 334);
  assert.ok(words(EDIT.keep + EDIT.to) <= 12);
});

test('menu-h2-r2: reduced motion = one hard cut to the finished edit at 3 s', () => {
  assert.equal(purpleLabel(2999, true).word, 'Goodnight.');
  const L = purpleLabel(3000, true);
  assert.equal(L.word, 'Stay.');
  assert.equal(L.struck, 'Goodnight.');
  assert.equal(retyped(3000, true), true);
  assert.equal(retyped(3000, false), false);
});

test('menu-h2-r2: purple before her edit leaves; after it, purple reads Stay; timeout = pink', () => {
  let s = choose(run(openMenu(), 1000), 'purple');
  assert.equal(outcome(s), 'leave');
  s = choose(run(openMenu(), EDIT.typeAt + 50), 'purple');
  assert.equal(outcome(s), 'stay');
  assert.equal(outcome(s, false, 'm4'), 'leave', 'menu-4-r2 has no edit');
  s = run(openMenu(), 5200);
  assert.equal(s.picked, 'pink');
  assert.equal(outcome(s), 'stay');
  // replay with pink disabled: the timer takes purple, which she has retyped to Stay.
  s = run(openMenu(DOOR, { disabled: ['pink'] }), 5200);
  assert.equal(s.picked, 'purple');
  assert.equal(outcome(s), 'stay');
});

test('menu-4-r2: the lean is visible at t = 0 (pre-poured cup, unequal boxes) and only grows', () => {
  assert.ok(pinkFill(1) >= 0.2, 'pink cup opens pre-poured');
  assert.equal(pinkFill(1), PREPOUR);
  assert.equal(pinkFill(0), 1);
  const a = widths(1), b = widths(0.5), c = widths(0);
  assert.ok(a.pink > a.purple, 'unequal from the first frame');
  assert.ok(b.pink > a.pink && c.pink > b.pink);
  assert.ok(c.purple >= 380, 'purple stays readable');
  assert.equal(a.pink + a.purple, 1260);
});

test('menu-4-r2: the room tally', () => {
  assert.deepEqual(tally([]), { pink: 0, n: 0, pct: 0 });
  assert.deepEqual(tally(['stay', 'stay', 'leave', 'stay']), { pink: 3, n: 4, pct: 75 });
});
