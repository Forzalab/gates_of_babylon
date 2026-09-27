// rules.js: "UNEXPECTED GATE IN BAGGING AREA". Pure game rules, no DOM. Everything is computed from GATES in
// src/sim.js through the real evaluate(); no truth table here is typed by hand.
import { GATES, evaluate, canConnect } from '../../sim.js';

export const TYPES = ['AND', 'OR', 'XOR', 'NAND', 'NOR', 'NOT'];
export const W = 7, H = 9; // bagging area: 7 columns x 9 rows. A column reaching H = BAG FULL.
export const ROWS = [[false, false], [false, true], [true, false], [true, true]];

// ---------- personality = the gate's own truth table ----------
// One gate on the real simulator: switches a, b -> gate -> lamp. NOT only reads a (NOT = NOT(a)).
function soloCircuit(type, a, b) {
  const nodes = { a: { id: 'a', kind: 'S', value: a }, b: { id: 'b', kind: 'S', value: b }, g: { id: 'g', kind: 'G', type }, L: { id: 'L', kind: 'L' } };
  const wires = { w0: { id: 'w0', source: 'a', target: 'g', pin: 0 }, w2: { id: 'w2', source: 'g', target: 'L', pin: 0 } };
  if (GATES[type].pins > 1) wires.w1 = { id: 'w1', source: 'b', target: 'g', pin: 1 };
  return { nodes, wires };
}
const TABLES = Object.fromEntries(TYPES.map((t) => [t, ROWS.map(([a, b]) => evaluate(soloCircuit(t, a, b)).L)]));
export const table = (t) => TABLES[t];

// Rows where both personalities output the same bit (boolean[4]) and the compat fraction.
export const matchRows = (X, Y) => ROWS.map((_, i) => TABLES[X][i] === TABLES[Y][i]);
export function personalityCompat(X, Y) { return matchRows(X, Y).filter(Boolean).length / 4; }
export const dots = (X, Y) => matchRows(X, Y).map((m) => (m ? '●' : '○')).join('');

// Charge: a bubble gate is negative.
export const charge = (t) => (t === 'NOT' || t === 'NAND' || t === 'NOR' ? -1 : 1);

// THE rule. GLOW = same charge AND compat >= 75%. Everything else is HURT. Nothing merges unless this is true.
export function glows(X, Y) { return charge(X) === charge(Y) && personalityCompat(X, Y) >= 0.75; }

// ---------- the 7 identities (endings) ----------
// expect = the identity's own table over x = 0, 1. Proof = evaluate the merge's circuit and compare.
export const IDENTITIES = {
  and:    { formula: 'x ∧ x = x', name: 'Supportive', line: 'x AND 1 = x. I’m supportive, why won’t anyone—', expect: [false, true] },
  or:     { formula: 'x ∨ x = x', name: 'Same Energy', line: 'You’re just like me. That’s the problem and the point.', expect: [false, true] },
  clingy: { formula: 'x ∨ 1 = 1', name: 'Clingy', line: 'Whatever you say, I’m ON. Always. Forever. Hi.', expect: [true, true] },
  xor:    { formula: 'x ⊕ x = 0', name: 'The Clone', line: 'Dated my own clone. We cancelled out. Zero.', expect: [false, false] },
  notnot: { formula: '¬¬x = x', name: 'Getting Back Together', line: 'Two NOs make a yes. We’re back.', expect: [false, true] },
  nand:   { formula: 'NAND(x,x) = ¬x', name: 'The Impersonator', line: 'Tied both my inputs together and became a NOT. Universal, darling.', expect: [true, false] },
  child:  { formula: 'x ∨ (x ⊕ x) = x', name: 'Meant To Be Together', line: 'OR and XOR agreed on 3 rows of 4. Now there’s a little one.', expect: [false, true] },
};
export const IDENTITY_KEYS = Object.keys(IDENTITIES);
// Rarest first: the impersonator floods every run, so ties go to the rarer identity (B review #4).
export const RARITY = ['clingy', 'child', 'notnot', 'xor', 'and', 'or', 'nand'];

// Which identity a GLOW pair proves. Only meaningful for glowing pairs.
export function identityOf(A, B) {
  const [X, Y] = [A.t, B.t].sort();
  if (X === Y) {
    if (X === 'AND') return 'and';
    if (X === 'OR') return A.tier >= 3 || B.tier >= 3 ? 'clingy' : 'or';
    if (X === 'XOR') return 'xor';
    if (X === 'NOT') return 'notnot';
    return 'nand'; // NAND+NAND, NOR+NOR: NAND(x,x) = not x
  }
  if (X === 'OR' && Y === 'XOR') return 'child';
  return 'nand'; // NAND+NOT, NOR+NOT: the impersonator
}

// Spawn weights (B): AND 22. A seeded RNG keeps runs replayable (?seed=).
export const WEIGHTS = { AND: 22, OR: 18, XOR: 16, NAND: 14, NOR: 14, NOT: 16 };
export function rng(seed) { // mulberry32
  let s = seed >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function randomType(r, weights = WEIGHTS) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let x = r() * total;
  for (const t of TYPES) { x -= weights[t]; if (x < 0) return t; }
  return 'NOT';
}
const CHILD_WEIGHTS = { AND: 1, OR: 1, XOR: 1, NAND: 1, NOR: 1, NOT: 1 };

// Merge result for a GLOW pair (B's table + B review #1). result = the gate left behind, or null when both vanish.
export function mergeResult(A, B, r = Math.random) {
  if (!glows(A.t, B.t)) throw new Error(`HURT pair ${A.t}+${B.t} cannot merge`);
  const identity = identityOf(A, B);
  const rows = matchRows(A.t, B.t).filter(Boolean).length;
  const base = { identity, rows, jackpot: false };
  if (identity === 'and') {
    if (A.tier >= 3 && B.tier >= 3) return { ...base, result: null, jackpot: true };
    return { ...base, result: { t: 'AND', tier: Math.min(3, Math.max(A.tier, B.tier) + 1) } };
  }
  if (identity === 'clingy') return { ...base, result: null, jackpot: true };
  if (identity === 'or') return { ...base, result: { t: 'OR', tier: Math.min(3, Math.max(A.tier, B.tier) + 1) } };
  if (identity === 'xor' || identity === 'notnot') return { ...base, result: null };
  if (identity === 'nand') return { ...base, result: { t: 'NOT', tier: 1 } };
  return { ...base, result: { t: randomType(r, CHILD_WEIGHTS), tier: 1 } }; // child
}

// ---------- every merge is a real circuit: switch x -> gates -> lamp ----------
const S = (id, value = false, label) => ({ id, kind: 'S', value, ...(label ? { label } : {}) });
const G = (id, type) => ({ id, kind: 'G', type });
const L = (id) => ({ id, kind: 'L' });
const wire = (source, target, pin) => ({ id: `${source}-${target}-${pin}`, source, target, pin });
function build(nodes, wires) {
  const c = { nodes: {}, wires: {} };
  for (const n of nodes) c.nodes[n.id] = n;
  for (const w of wires) { const ok = canConnect(c, w.source, w.target, w.pin); if (!ok.ok) throw new Error(`bad wire ${w.id}: ${ok.reason}`); c.wires[w.id] = w; }
  return c;
}
export function identityCircuit(identity, X, Y) {
  switch (identity) {
    case 'and': case 'or': case 'xor': {
      const t = identity.toUpperCase();
      return build([S('x'), G('g1', t), L('L')], [wire('x', 'g1', 0), wire('x', 'g1', 1), wire('g1', 'L', 0)]);
    }
    case 'clingy':
      return build([S('x'), S('one', true, '1'), G('g1', 'OR'), L('L')], [wire('x', 'g1', 0), wire('one', 'g1', 1), wire('g1', 'L', 0)]);
    case 'notnot':
      return build([S('x'), G('g1', 'NOT'), G('g2', 'NOT'), L('L')], [wire('x', 'g1', 0), wire('g1', 'g2', 0), wire('g2', 'L', 0)]);
    case 'nand': {
      const t = X === 'NOR' || Y === 'NOR' ? 'NOR' : 'NAND';
      return build([S('x'), G('g1', t), L('L')], [wire('x', 'g1', 0), wire('x', 'g1', 1), wire('g1', 'L', 0)]);
    }
    case 'child':
      return build([S('x'), G('g1', 'XOR'), G('g2', 'OR'), L('L')], [wire('x', 'g1', 0), wire('x', 'g1', 1), wire('x', 'g2', 0), wire('g1', 'g2', 1), wire('g2', 'L', 0)]);
    default: throw new Error(`unknown identity ${identity}`);
  }
}
// A HURT pair on the canvas: both gates read the same a, b and each drives its own lamp, so you watch them disagree.
export function hurtCircuit(X, Y) {
  const ns = [S('a'), S('b'), G('g1', X), G('g2', Y), L('L1'), L('L2')];
  const ws = [wire('a', 'g1', 0), wire('a', 'g2', 0)];
  if (GATES[X].pins > 1) ws.push(wire('b', 'g1', 1));
  if (GATES[Y].pins > 1) ws.push(wire('b', 'g2', 1));
  ws.push(wire('g1', 'L1', 0), wire('g2', 'L2', 0));
  return build(ns, ws);
}

// Run the circuit over x = 0, 1 on the real simulator and compare with the identity's table.
export function prove(identity, circuit) {
  const lamp = Object.values(circuit.nodes).find((n) => n.kind === 'L').id;
  const got = [false, true].map((x) => evaluate({ ...circuit, nodes: { ...circuit.nodes, x: { ...circuit.nodes.x, value: x } } })[lamp]);
  const ok = got.every((v, i) => v === IDENTITIES[identity].expect[i]);
  return { got, ok, text: `x=0→${+got[0]}, x=1→${+got[1]} ${ok ? '✓' : '✗'}` };
}
// The ending is DETECTED by evaluation: an identity is only credited when its circuit's table checks out.
export function detect(identity, X, Y) {
  const circuit = identityCircuit(identity, X, Y);
  const proof = prove(identity, circuit);
  return proof.ok ? { identity, circuit, proof } : null;
}

// ---------- the drop grid: cols[c] is a stack, bottom first ----------
let nextId = 1;
export const gate = (t, tier = 1) => ({ id: `g${nextId++}`, t, tier });
export const emptyGrid = () => Array.from({ length: W }, () => []);
const clone = (cols) => cols.map((c) => c.map((g) => ({ ...g })));
export function find(cols, id) { for (let c = 0; c < W; c++) { const i = cols[c].findIndex((g) => g && g.id === id); if (i >= 0) return { c, i }; } return null; }
export const at = (cols, c, i) => (c >= 0 && c < W && i >= 0 ? cols[c][i] ?? null : null);
// Fixed order: down, left, right.
export const neighbourCells = ({ c, i }) => [{ c, i: i - 1, dir: 'down' }, { c: c - 1, i, dir: 'left' }, { c: c + 1, i, dir: 'right' }];
export const neighbours = (cols, p) => neighbourCells(p).filter((n) => at(cols, n.c, n.i));

// B review #2: the glowing neighbour with the highest compat wins; ties go down, then left, then right.
export function bestPartner(cols, p) {
  const me = at(cols, p.c, p.i);
  let best = null, bestC = -1;
  for (const n of neighbours(cols, p)) {
    const o = at(cols, n.c, n.i);
    if (!glows(me.t, o.t)) continue;
    const k = personalityCompat(me.t, o.t);
    if (k > bestC) { best = n; bestC = k; }
  }
  return best;
}

export function canDrop(cols, c) { return c >= 0 && c < W && cols[c].length < H; }

// Merge -> gravity -> repeat. One merge per step. Every intermediate frame is kept so the UI can replay the cascade.
export function resolve(cols0, activeIds, r = Math.random) {
  let cols = clone(cols0);
  let queue = [...activeIds];
  const frames = [], merges = [], merged = new Set();
  let combo = 0, guard = 0;
  while (queue.length && guard++ < 500) {
    const id = queue.shift();
    const p = find(cols, id);
    if (!p) continue;
    const q = bestPartner(cols, p);
    if (!q) continue;
    const A = at(cols, p.c, p.i), B = at(cols, q.c, q.i);
    const m = mergeResult(A, B, r);
    const d = detect(m.identity, A.t, B.t);
    if (!d) throw new Error(`identity ${m.identity} failed its proof`);
    combo++;
    merged.add(A.id); merged.add(B.id);
    const before = new Map();
    cols.forEach((col, c) => col.forEach((g, i) => before.set(g.id, `${c},${i}`)));
    const res = m.result ? gate(m.result.t, m.result.tier) : null;
    cols[p.c][p.i] = null;
    cols[q.c][q.i] = res;
    cols = cols.map((col) => col.filter(Boolean)); // gravity
    const moved = [];
    cols.forEach((col, c) => col.forEach((g, i) => { if (before.has(g.id) && before.get(g.id) !== `${c},${i}`) moved.push(g.id); }));
    const head = [...(res ? [res.id] : []), ...moved];
    queue = [...head, ...queue.filter((x) => !head.includes(x))];
    const ev = { kind: 'merge', a: A.t, b: B.t, aId: A.id, bId: B.id, aTier: A.tier, bTier: B.tier, from: p, at: res ? find(cols, res.id) : q,
      identity: m.identity, rows: m.rows, compat: personalityCompat(A.t, B.t), jackpot: m.jackpot, result: res, combo, proof: d.proof, circuit: d.circuit };
    merges.push(ev);
    frames.push({ cols: clone(cols), ev });
  }
  return { cols, frames, merges, combo, merged };
}

// The would-be neighbours of a drop, for the touch preview: [{dir, t, glow, compat, dots}].
export function preview(cols, c, t) {
  if (!canDrop(cols, c)) return null;
  const p = { c, i: cols[c].length };
  return { at: p, pairs: neighbours(cols, p).map((n) => { const o = at(cols, n.c, n.i); return { ...n, t: o.t, glow: glows(t, o.t), compat: personalityCompat(t, o.t), dots: dots(t, o.t) }; }) };
}

// Drop a gate into a column and resolve. hurts = the dropped gate's neighbours when it found no GLOW partner.
export function dropAndResolve(cols0, c, g, r = Math.random) {
  if (!canDrop(cols0, c)) return null;
  const cols = clone(cols0);
  cols[c].push({ ...g });
  const landed = { c, i: cols[c].length - 1 };
  const hurts = neighbours(cols, landed).filter((n) => !glows(g.t, at(cols, n.c, n.i).t)).map((n) => {
    const o = at(cols, n.c, n.i);
    return { a: g.id, b: o.id, ta: g.t, tb: o.t, at: { c: n.c, i: n.i }, opposite: charge(g.t) !== charge(o.t), compat: personalityCompat(g.t, o.t) };
  });
  const out = resolve(cols, [g.id], r);
  return { ...out, landed, placed: clone(cols), hurts: out.merged.has(g.id) ? [] : hurts };
}

// SWIPE LEFT: flick a settled gate one column sideways (swap with the gate there, or slide over and fall).
export function swipe(cols0, id, dir, r = Math.random) {
  const p = find(cols0, id);
  if (!p) return null;
  const c2 = p.c + dir;
  if (c2 < 0 || c2 >= W) return null;
  const cols = clone(cols0);
  const me = cols[p.c][p.i], other = cols[c2][p.i];
  let active;
  if (other) { cols[c2][p.i] = me; cols[p.c][p.i] = other; active = [me.id, other.id]; }
  else {
    if (cols[c2].length >= H) return null;
    cols[p.c].splice(p.i, 1); cols[c2].push(me);
    active = [me.id, ...cols[p.c].slice(p.i).map((g) => g.id)];
  }
  return { ...resolve(cols, active, r), placed: clone(cols) };
}

export const overflow = (cols) => cols.some((col) => col.length >= H);

// B review #4: identities hit at least twice beat ones hit once; among those, the rarest wins.
export function pickEnding(counts) {
  const hit = RARITY.filter((k) => (counts[k] ?? 0) > 0);
  if (!hit.length) return null;
  const twice = hit.filter((k) => counts[k] >= 2);
  return (twice.length ? twice : hit)[0];
}

// Affection = sum of matched rows over GLOW merges (HURT adds 0); the pop-up shows the mean compat of those pairs.
export function score(merges) {
  const affection = merges.reduce((s, m) => s + m.rows, 0);
  const mean = merges.length ? merges.reduce((s, m) => s + m.compat, 0) / merges.length : 0;
  return { affection, mean };
}

export function countIdentities(merges) {
  const counts = {};
  for (const m of merges) counts[m.identity] = (counts[m.identity] ?? 0) + 1;
  return counts;
}

// The hand-off to the Date canvas: the ending circuit plus the 2 best other merges (distinct identities).
// A run with no merges at all is "not a match" and hands back its last HURT pair, red.
export function outPayload({ merges, lastHurt, won = false }) {
  const counts = countIdentities(merges);
  const ending = pickEnding(counts);
  const { mean, affection } = score(merges);
  if (!ending) {
    const circuits = lastHurt ? [{ label: `${lastHurt.ta} × ${lastHurt.tb}`, name: 'Never Ever', hurt: true, identity: null, pair: [lastHurt.ta, lastHurt.tb], ...hurtCircuit(lastHurt.ta, lastHurt.tb) }] : [];
    return { match: false, ending: null, mean, affection, circuits };
  }
  const pick = (k) => merges.filter((m) => m.identity === k).sort((x, y) => y.compat - x.compat)[0];
  const others = RARITY.filter((k) => k !== ending && counts[k]).map(pick)
    .sort((x, y) => y.compat - x.compat || RARITY.indexOf(x.identity) - RARITY.indexOf(y.identity)).slice(0, 2);
  const circ = (m, isEnding) => ({ label: IDENTITIES[m.identity].formula, name: IDENTITIES[m.identity].name, identity: m.identity, ending: isEnding,
    bonded: true, pair: [m.a, m.b], proof: prove(m.identity, m.circuit).text, ...identityCircuit(m.identity, m.a, m.b) });
  return { match: true, won, ending, mean, affection, circuits: [circ(pick(ending), true), ...others.map((m) => circ(m, false))] };
}
