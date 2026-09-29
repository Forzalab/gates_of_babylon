// R6: the Logic circuit survives the trip into Date and back ("◂ LOGIC").
import test from 'node:test';
import assert from 'node:assert/strict';
import { saveLogic, loadLogic, maxSuffix, LOGIC_KEY } from './logicSave.js';

const mem = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), m }; };
const circuit = { nodes: { s1: { id: 's1', kind: 'S', value: true }, gor_3: { id: 'gor_3', kind: 'G', type: 'OR' } }, wires: { w7: { id: 'w7' } } };
const view = [{ id: 's1', type: 'S', position: { x: 1, y: 2 }, data: {}, measured: { width: 9 }, selected: true }];

test('logicSave: round trip keeps circuit + positions and drops React Flow runtime fields', () => {
  const s = mem();
  assert.equal(saveLogic(s, circuit, view), true);
  const v = loadLogic(s);
  assert.deepEqual(v.circuit, circuit);
  assert.deepEqual(v.view, [{ id: 's1', type: 'S', position: { x: 1, y: 2 }, data: {} }]);
});

test('logicSave: nothing saved, junk, or no storage -> null; a throwing storage never throws', () => {
  assert.equal(loadLogic(mem()), null);
  const s = mem(); s.setItem(LOGIC_KEY, '{nope'); assert.equal(loadLogic(s), null);
  s.setItem(LOGIC_KEY, JSON.stringify({ circuit: {}, view: [] })); assert.equal(loadLogic(s), null);
  assert.equal(loadLogic(null), null);
  const bad = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); } };
  assert.equal(loadLogic(bad), null);
  assert.equal(saveLogic(bad, circuit, view), false);
});

test('logicSave: new ids continue after restored ones', () => {
  assert.equal(maxSuffix(Object.keys(circuit.wires), /^w(\d+)$/), 7);
  assert.equal(maxSuffix(Object.keys(circuit.nodes), /_(\d+)$/), 3);
  assert.equal(maxSuffix([], /_(\d+)$/), 0);
});
