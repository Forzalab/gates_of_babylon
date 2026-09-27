// compat.js — Date mode's only "science": two circuits are as compatible as their truth tables agree.
// compat = matching rows / total rows (the handout's rule), computed with the real sim.
import { evaluate } from '../sim.js';

// A 2-input circuit: switches a, b -> gate g1(a, b) [-> g2(g1, b)] -> lamp. `pair` = [type] or [type1, type2].
export function pairCircuit(pair, a = false, b = false) {
  const nodes = { a: { id: 'a', kind: 'S', value: a }, b: { id: 'b', kind: 'S', value: b },
    g1: { id: 'g1', kind: 'G', type: pair[0] }, L: { id: 'L', kind: 'L' } };
  const wires = {};
  const w = (id, source, target, pin) => { wires[id] = { id, source, target, pin }; };
  w('w1', 'a', 'g1', 0);
  if (pair[0] !== 'NOT') w('w2', 'b', 'g1', 1);
  if (pair[1]) {
    nodes.g2 = { id: 'g2', kind: 'G', type: pair[1] };
    w('w3', 'g1', 'g2', 0);
    if (pair[1] !== 'NOT') w('w4', 'b', 'g2', 1);
    w('w5', 'g2', 'L', 0);
  } else w('w5', 'g1', 'L', 0);
  return { nodes, wires };
}

export const ROWS = [[false, false], [false, true], [true, false], [true, true]];
export const truth = (pair) => ROWS.map(([a, b]) => evaluate(pairCircuit(pair, a, b)).L);
export function compat(p, q) {
  const tp = truth(p), tq = truth(q);
  return tp.filter((v, i) => v === tq[i]).length / ROWS.length;
}
