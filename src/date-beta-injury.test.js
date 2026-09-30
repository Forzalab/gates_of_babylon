import test from 'node:test';
import assert from 'node:assert/strict';
import { injuryLayer, withInjury } from './date-beta/injury.js';

test('injury: black eye from train beat 5 through street, plaster at home', () => {
  assert.equal(injuryLayer('v2-train', 3), null);
  assert.equal(injuryLayer('v2-train', 4), 'black-eye');
  assert.deepEqual(withInjury(null, 'v2-rain', 1), ['black-eye']);
  assert.deepEqual(withInjury(['puff'], 'v2-street', 2), ['puff', 'black-eye']);
  assert.deepEqual(withInjury(null, 'v2-home', 0), ['plaster']);
  assert.equal(withInjury(null, 'v2-park', 0), null);
});
