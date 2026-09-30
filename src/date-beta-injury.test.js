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
