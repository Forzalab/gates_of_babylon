// compat.js: Date-mode matchmaking on the real simulator. No DOM.
// A tile is a pair of gates wired together: switches a, b feed gate A; A's output feeds B's pin 0 and
// b feeds B's pin 1 (when B has two pins). Compat = truth-table rows where A and B agree / total rows.
import { evaluate, GATES } from '../sim.js';

export function pairCircuit(A, B, a, b) {
  const nodes = {
    a: { id: 'a', kind: 'S', value: a },
    b: { id: 'b', kind: 'S', value: b },
    A: { id: 'A', kind: 'G', type: A },
    B: { id: 'B', kind: 'G', type: B },
  };
  const wires = { w0: { id: 'w0', source: 'a', target: 'A', pin: 0 } };
  if (GATES[A].pins > 1) wires.w1 = { id: 'w1', source: 'b', target: 'A', pin: 1 };
  wires.w2 = { id: 'w2', source: 'A', target: 'B', pin: 0 };
  if (GATES[B].pins > 1) wires.w3 = { id: 'w3', source: 'b', target: 'B', pin: 1 };
  return { nodes, wires };
}

export const ROWS = [[false, false], [false, true], [true, false], [true, true]];

// One truth-table row through the pair: every value the tile needs to light itself.
export function pairRow(A, B, row) {
  const [a, b] = ROWS[row % 4];
  const v = evaluate(pairCircuit(A, B, a, b));
  return { a, b, A: v.A, B: v.B };
}

// Compat in [0, 1]: rows where the two gates output the same bit, over all rows.
export function compat(A, B) {
  const same = ROWS.filter((_, i) => { const r = pairRow(A, B, i); return r.A === r.B; }).length;
  return same / ROWS.length;
}

// f2: single-gate truth tables straight from the simulator (a lone gate fed by switches a, b; NOT reads a only).
export function gateTT(type) {
  return ROWS.map(([a, b]) => {
    const nodes = { a: { id: 'a', kind: 'S', value: a }, b: { id: 'b', kind: 'S', value: b }, G: { id: 'G', kind: 'G', type } };
    const wires = { w0: { id: 'w0', source: 'a', target: 'G', pin: 0 } };
    if (GATES[type].pins > 1) wires.w1 = { id: 'w1', source: 'b', target: 'G', pin: 1 };
    return evaluate({ nodes, wires }).G;
  });
}
// Per row: do the two gates output the same bit? And the share of rows that agree, in [0, 1].
export const agree = (A, B) => { const a = gateTT(A), b = gateTT(B); return a.map((v, i) => v === b[i]); };
export const gateCompat = (A, B) => agree(A, B).filter(Boolean).length / ROWS.length;
