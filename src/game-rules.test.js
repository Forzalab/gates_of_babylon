// Bagging-area minigame rules (src/date/game/rules.js): the GLOW set, merges, cascades, endings and the hand-off.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TYPES, glows, personalityCompat, charge, mergeResult, identityCircuit, prove, IDENTITY_KEYS, dropAndResolve, emptyGrid,
  gate, pickEnding, score, outPayload, resolve, bestPartner, swipe, H, overflow, rng, detect,
} from './date/game/rules.js';
import { evaluate } from './sim.js';

const key = (X, Y) => [X, Y].sort().join('+');

test('GLOW set is exactly X+X (all 6), OR+XOR, NAND+NOT, NOR+NOT', () => {
  const want = new Set([...TYPES.map((t) => key(t, t)), key('OR', 'XOR'), key('NAND', 'NOT'), key('NOR', 'NOT')]);
  const got = new Set();
  for (const X of TYPES) for (const Y of TYPES) if (glows(X, Y)) got.add(key(X, Y));
  assert.deepEqual([...got].sort(), [...want].sort());
  for (const X of TYPES) for (const Y of TYPES) assert.equal(glows(X, Y), glows(Y, X), `symmetric ${X}/${Y}`);
});

test('compat is each gate\'s own truth table; the traps', () => {
  for (const t of TYPES) assert.equal(personalityCompat(t, t), 1);
  assert.equal(personalityCompat('NAND', 'XOR'), 0.75);
  assert.equal(glows('NAND', 'XOR'), false, '75% but wrong charge');
  assert.equal(personalityCompat('NAND', 'NOR'), 0.5);
  assert.equal(glows('NAND', 'NOR'), false, 'same charge but 50%');
  assert.equal(personalityCompat('AND', 'OR'), 0.5);
  assert.deepEqual(['NOT', 'NAND', 'NOR'].map(charge), [-1, -1, -1]);
  assert.deepEqual(['AND', 'OR', 'XOR'].map(charge), [1, 1, 1]);
});

test('mergeResult follows the table and refuses HURT pairs', () => {
  const g = (t, tier = 1) => ({ t, tier });
  assert.deepEqual(mergeResult(g('AND'), g('AND')).result, { t: 'AND', tier: 2 });
  assert.deepEqual(mergeResult(g('AND', 2), g('AND', 2)).result, { t: 'AND', tier: 3 });
  assert.equal(mergeResult(g('AND', 3), g('AND', 3)).result, null);
  assert.equal(mergeResult(g('AND', 3), g('AND', 3)).jackpot, true);
  assert.deepEqual(mergeResult(g('OR'), g('OR')).result, { t: 'OR', tier: 2 });
  const cl = mergeResult(g('OR', 3), g('OR'));
  assert.equal(cl.identity, 'clingy'); assert.equal(cl.result, null);
  assert.equal(mergeResult(g('XOR'), g('XOR')).result, null);
  assert.equal(mergeResult(g('NOT'), g('NOT')).identity, 'notnot');
  for (const [X, Y] of [['NAND', 'NAND'], ['NOR', 'NOR'], ['NAND', 'NOT'], ['NOT', 'NOR']]) {
    const m = mergeResult(g(X), g(Y));
    assert.equal(m.identity, 'nand'); assert.deepEqual(m.result, { t: 'NOT', tier: 1 });
  }
  const child = mergeResult(g('OR'), g('XOR'), rng(1));
  assert.equal(child.identity, 'child'); assert.ok(TYPES.includes(child.result.t));
  assert.equal(child.rows, 3);
  // B review #1: clingy never lets a HURT pair merge.
  assert.throws(() => mergeResult(g('OR', 3), g('NOT')));
  assert.throws(() => mergeResult(g('NAND'), g('XOR')));
});

test('every identity circuit is a real circuit that proves its identity via evaluate', () => {
  const pairs = { and: ['AND', 'AND'], or: ['OR', 'OR'], clingy: ['OR', 'OR'], xor: ['XOR', 'XOR'], notnot: ['NOT', 'NOT'], nand: ['NAND', 'NOT'], child: ['OR', 'XOR'] };
  for (const k of IDENTITY_KEYS) {
    const c = identityCircuit(k, ...pairs[k]);
    const p = prove(k, c);
    assert.ok(p.ok, `${k}: ${p.text}`);
    assert.doesNotThrow(() => evaluate(c));
  }
  assert.equal(prove('notnot', identityCircuit('notnot')).text, 'x=0→0, x=1→1 ✓');
  assert.equal(prove('nand', identityCircuit('nand', 'NOR', 'NOR')).text, 'x=0→1, x=1→0 ✓');
  assert.equal(prove('xor', identityCircuit('xor')).text, 'x=0→0, x=1→0 ✓');
  // Detection compares tables: a circuit claiming the wrong identity fails.
  assert.equal(prove('notnot', identityCircuit('xor')).ok, false);
  assert.ok(detect('child', 'OR', 'XOR'));
});

test('drop cascade: NAND onto NAND makes a NOT, which then meets a NOT and both vanish (combo 2)', () => {
  const cols = emptyGrid();
  cols[2].push(gate('NOT'));
  cols[3].push(gate('NAND'));
  const out = dropAndResolve(cols, 3, gate('NAND'));
  assert.equal(out.combo, 2);
  assert.deepEqual(out.merges.map((m) => m.identity), ['nand', 'notnot']);
  assert.equal(out.cols.flat().length, 0);
  assert.deepEqual(score(out.merges), { affection: 8, mean: 1 });
});

test('HURT pairs do not merge, add 0 affection and are reported', () => {
  const cols = emptyGrid();
  cols[0].push(gate('AND'));
  const out = dropAndResolve(cols, 1, gate('XOR'));
  assert.equal(out.combo, 0);
  assert.equal(out.hurts.length, 1);
  assert.equal(out.hurts[0].compat, 0.25);
  const opp = dropAndResolve(out.cols, 2, gate('NOR'));
  assert.equal(opp.hurts[0].opposite, true);
});

test('merge priority: highest compat first, ties go down, then left, then right', () => {
  const cols = emptyGrid();
  // A NOT landing at (3,1): below NOT (100%), left NAND (75%), right NOT (100%). Down wins.
  cols[3].push(gate('NOT'));
  cols[2].push(gate('AND'), gate('NAND'));
  cols[4].push(gate('AND'), gate('NOT'));
  cols[3].push(gate('NOT'));
  assert.equal(bestPartner(cols, { c: 3, i: 1 }).dir, 'down');
  // Remove the down partner: the 100% right beats the 75% left.
  const c2 = emptyGrid();
  c2[2].push(gate('NAND')); c2[4].push(gate('NOT')); c2[3].push(gate('NOT'));
  assert.equal(bestPartner(c2, { c: 3, i: 0 }).dir, 'right');
});

test('overflow, swipe and resolve stay deterministic', () => {
  const cols = emptyGrid();
  for (let i = 0; i < H; i++) cols[0].push(gate(i % 2 ? 'AND' : 'NOR'));
  assert.equal(overflow(cols), true);
  const s = emptyGrid();
  s[0].push(gate('XOR')); s[1].push(gate('AND')); s[2].push(gate('XOR'));
  const id = s[0][0].id;
  const out = swipe(s, id, 1);
  assert.equal(out.combo, 1, 'swiped XOR now sits next to the other XOR');
  assert.equal(resolve(emptyGrid(), []).combo, 0);
});

test('ending tie-break (B review #4) and the canvas hand-off payload', () => {
  assert.equal(pickEnding({ nand: 5, notnot: 2 }), 'notnot');
  assert.equal(pickEnding({ nand: 5, clingy: 1 }), 'nand', 'hit once never beats hit twice');
  assert.equal(pickEnding({ nand: 1, xor: 1 }), 'xor', 'ties go to the rarer');
  assert.equal(pickEnding({}), null);
  assert.equal(pickEnding({ nand: 6, and: 4 }), 'and', 'over its base rate, not raw count');
  assert.equal(pickEnding({ nand: 20, child: 2 }), 'nand', 'a real flood still wins');
  const cols = emptyGrid();
  cols[2].push(gate('NOT')); cols[3].push(gate('NAND'));
  const run = dropAndResolve(cols, 3, gate('NAND'));
  const out = outPayload({ merges: run.merges });
  assert.equal(out.match, true);
  assert.equal(out.ending, 'notnot');
  assert.equal(out.circuits.length, 2);
  assert.equal(out.circuits[0].ending, true);
  for (const c of out.circuits) assert.doesNotThrow(() => evaluate(c));
  const lost = outPayload({ merges: [], lastHurt: { ta: 'AND', tb: 'XOR' } });
  assert.equal(lost.match, false);
  assert.equal(lost.circuits[0].hurt, true);
});
