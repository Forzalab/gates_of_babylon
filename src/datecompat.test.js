import test from 'node:test';
import assert from 'node:assert/strict';
import { compat, truth } from './date/compat.js';

test('date compat: identical tables are 100%', () => assert.equal(compat(['AND'], ['AND']), 1));
test('date compat: complements are 0%', () => assert.equal(compat(['AND'], ['NAND']), 0));
test('date compat: AND vs OR agree on 2 of 4 rows', () => assert.equal(compat(['AND'], ['OR']), 0.5));
test('date compat: AND then NOT equals NAND', () => assert.deepEqual(truth(['AND', 'NOT']), truth(['NAND'])));
