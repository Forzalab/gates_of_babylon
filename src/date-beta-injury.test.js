import test from 'node:test';
import assert from 'node:assert/strict';
import { injuryLayer, withInjury } from './date-beta/injury.js';

test('injury: black eye from train beat 5 through street, 75% rain, 50% street, plaster + faint bruise at home', () => {
  assert.equal(injuryLayer('v2-train', 3), null);
  assert.equal(injuryLayer('v2-train', 4), 'black-eye');
  assert.deepEqual(withInjury(null, 'v2-rain', 1), ['black-eye-75']);
  assert.deepEqual(withInjury(['puff'], 'v2-street', 2), ['puff', 'black-eye-50']);
  assert.deepEqual(withInjury(null, 'v2-home', 0), ['plaster-20']);
  assert.equal(withInjury(null, 'v2-park', 0), null);
});

test('injury WT03: the plaster stays on after v2-home (tea, escape), only on a run that came through v2-home', () => {
  const viaHome = ['rooftop', 'v2-train', 'v2-street', 'v2-home', 'cup'];
  for (const s of ['cup', 'steeped', 'unknown', 'escape', 'escape-win', 'escape-timeout']) assert.equal(injuryLayer(s, 0, viaHome), 'plaster-20', s);
  assert.equal(injuryLayer('cup', 2, ['rooftop', 'door', 'genkan-in', 'genkan-talk', 'cup']), null, 'genkan route: never hurt');
  assert.equal(injuryLayer('cup', 2), null, 'no path: no injury');
  assert.deepEqual(withInjury(['vein'], 'cup', 1, viaHome), ['vein', 'plaster-20']);
});
