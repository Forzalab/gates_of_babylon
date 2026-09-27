import test from 'node:test';
import assert from 'node:assert/strict';
import { compat, pairRow } from './date/compat.js';

test('date compat: a gate matched with NOT of itself never agrees', () => {
  assert.equal(compat('AND', 'NOT'), 0);
});
test('date compat: AND then AND agrees on every row', () => {
  // B = (a AND b) AND b = a AND b = A
  assert.equal(compat('AND', 'AND'), 1);
});
test('date compat: XOR then OR agrees on three rows of four', () => {
  assert.equal(compat('XOR', 'OR'), 0.75);
});
test('date compat: pairRow runs the real simulator', () => {
  assert.deepEqual(pairRow('NAND', 'NOT', 3), { a: true, b: true, A: false, B: true });
});
