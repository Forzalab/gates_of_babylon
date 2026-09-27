// Wire X placement (Tony, pic 4: "the X is placed unevenly"). Every wire shape the router can make, plus fuzz.
// Invariants for midpoint(pts):
//  1. the point lies ON the path (on one of its segments);
//  2. if any run can hold the X (>= 56 = its hit square), the point sits on such a run, >= 28 from both of its corners,
//     so the X never covers a bend;
//  3. if the run holding the path's arc-length middle can hold the X, the point IS that run's centre (the wire's middle);
//  4. no run can hold the X -> the centre of the longest run.
import test from 'node:test';
import assert from 'node:assert/strict';
import { midpoint, route, stepFallback } from './route.js';

const len = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
const segs = (p) => p.slice(1).map((b, i) => [p[i], b]);
const onSeg = ([x, y], [a, b]) => Math.min(a[0], b[0]) - 1e-6 <= x && x <= Math.max(a[0], b[0]) + 1e-6
  && Math.min(a[1], b[1]) - 1e-6 <= y && y <= Math.max(a[1], b[1]) + 1e-6 && (a[0] === b[0] ? Math.abs(x - a[0]) < 1e-6 : Math.abs(y - a[1]) < 1e-6);

function check(pts, name) {
  const m = midpoint(pts), S = segs(pts).filter(([a, b]) => len(a, b) > 0);
  const host = S.filter((s) => onSeg(m, s));
  assert.ok(host.length, `${name}: X ${m} is not on the path`);
  const fits = S.filter(([a, b]) => len(a, b) >= 56);
  if (fits.length) {
    assert.ok(host.some(([a, b]) => len(a, b) >= 56 && len(m, a) >= 28 - 1e-6 && len(m, b) >= 28 - 1e-6),
      `${name}: X ${m} sits on a short run or within 28 of a corner`);
    // 3: the run at the arc-length middle
    const tot = S.reduce((t, [a, b]) => t + len(a, b), 0); let acc = 0, mid = null;
    for (const s of S) { if (acc + len(...s) >= tot / 2) { mid = s; break; } acc += len(...s); }
    if (mid && len(...mid) >= 56) assert.deepEqual(m, [(mid[0][0] + mid[1][0]) / 2, (mid[0][1] + mid[1][1]) / 2], `${name}: not the wire's middle`);
  } else {
    const L = Math.max(...S.map(([a, b]) => len(a, b)));
    assert.ok(host.some(([a, b]) => len(a, b) === L), `${name}: all runs short, X not on the longest`);
  }
  return m;
}

const shapes = {
  'straight H': [[0, 0], [300, 0]],
  'straight V': [[0, 0], [0, 300]],
  'straight backward': [[300, 0], [0, 0]],
  'L right-down': [[0, 0], [200, 0], [200, 150]],
  'L down-right': [[0, 0], [0, 150], [200, 150]],
  'Z equal ends (pic 4)': [[110, 138], [257.5, 138], [257.5, 217], [405, 217]],
  'Z long middle': [[0, 0], [40, 0], [40, 300], [80, 300]],
  'Z short middle 20': [[0, 0], [150, 0], [150, 20], [300, 20]],
  'Z middle exactly 56': [[0, 0], [100, 0], [100, 56], [200, 56]],
  'Z middle 55': [[0, 0], [100, 0], [100, 55], [200, 55]],
  'Z up': [[0, 200], [150, 200], [150, 0], [300, 0]],
  'U back (loop around)': [[0, 0], [40, 0], [40, 120], [-200, 120], [-200, 60], [-160, 60]],
  'S 4 bends': [[0, 0], [60, 0], [60, 100], [200, 100], [200, 200], [260, 200]],
  'stairs 6 bends': [[0, 0], [30, 0], [30, 30], [60, 30], [60, 60], [90, 60], [90, 90], [300, 90]],
  'all short': [[0, 0], [30, 0], [30, 30], [60, 30], [60, 60]],
  'two points same': [[5, 5], [5, 5], [100, 5]],
  'duplicate corner': [[0, 0], [100, 0], [100, 0], [100, 100]],
  'collinear split': [[0, 0], [50, 0], [120, 0], [300, 0]],
  'jog 1px': [[0, 0], [150, 0], [150, 1], [300, 1]],
  'long tail short head': [[0, 0], [20, 0], [20, 400]],
  'huge': [[0, 0], [5000, 0], [5000, 3000], [9000, 3000]],
};
for (const [name, pts] of Object.entries(shapes)) test(`wire X: ${name}`, () => check(pts, name));

test('wire X: the pic-4 Z lands on the middle run', () => {
  assert.deepEqual(midpoint(shapes['Z equal ends (pic 4)']), [257.5, 177.5]);
});

test('wire X: step fallback shapes (every direction)', () => {
  for (const [s, t] of [[[0, 0], [300, 200]], [[0, 0], [300, -200]], [[300, 0], [0, 200]], [[0, 0], [10, 300]], [[0, 0], [300, 0]], [[0, 0], [0, 0.5]]])
    check(stepFallback(s, t), `fallback ${s}->${t}`);
});

test('wire X: real router output over a grid of part placements', () => {
  const box = (x, y, w, h) => ({ x, y, w, h });
  let n = 0;
  for (let dx = -400; dx <= 600; dx += 40) for (let dy = -300; dy <= 300; dy += 30) {
    const src = box(0, 0, 86, 86), dst = box(dx, dy, 112, 108);
    if (dx > -130 && dx < 110 && dy > -130 && dy < 110) continue; // overlapping parts are not a legal placement
    const s = [86, 43], t = [dx, dy + 34];
    const p = route(s, t, { src, dst });
    if (p && p.length >= 2) { check(p, `router dx=${dx} dy=${dy}`); n++; }
  }
  assert.ok(n > 300, `only ${n} routed placements`);
});

test('wire X: fuzz 3000 random orthogonal polylines', () => {
  let seed = 4242; const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  for (let k = 0; k < 3000; k++) {
    const pts = [[0, 0]]; let horiz = rnd() < 0.5;
    const n = 1 + Math.floor(rnd() * 7);
    for (let i = 0; i < n; i++) {
      const [x, y] = pts.at(-1), d = Math.round((rnd() - 0.3) * 400);
      pts.push(horiz ? [x + d, y] : [x, y + d]); horiz = !horiz;
    }
    if (pts.slice(1).every((b, i) => len(b, pts[i]) === 0)) continue;
    check(pts, `fuzz #${k} ${JSON.stringify(pts)}`);
  }
});
