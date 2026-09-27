// The GATEXX thumbnail grid: 4 x 3 tiles. Each is a warm, noisy blur (no people, no photos) with a real gate pair
// running its truth table under the blur, and the mockup's crisp white gate outline + hollow heart on top.
import { useEffect, useState } from 'react';
import { Shape, GATE_GEOM } from '../../nodes/index.jsx';
import { compat, pairRow } from '../compat.js';

const HEART = 'M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z';
export const Heart = ({ x = 0, y = 0, s = 1, className = 'heart' }) =>
  <path className={className} d={HEART} transform={`translate(${x} ${y}) scale(${s})`} />;

const pins = (g) => (Array.isArray(g.in?.[0]) ? g.in : [g.in]);
const outTip = (g) => [g.out[0] + (g.bubble ? 0 : 12), g.out[1]];

function Pair({ A, B, row }) {
  const gA = GATE_GEOM[A], gB = GATE_GEOM[B];
  const r = pairRow(A, B, row);
  const ax = 40, ay = 20;
  const [aox, aoy] = outTip(gA);
  const bIn = pins(gB);
  const bx = ax + aox + 34 - (bIn[0][0] - 12), by = ay + aoy - bIn[0][1];
  const W = bx + outTip(gB)[0] + 40, Hh = Math.max(ay + gA.h, by + gB.h) + 26;
  const aIns = pins(gA), bits = [r.a, r.b];
  const [box, boy] = outTip(gB);
  return (
    <svg className="pair" viewBox={`0 0 ${W} ${Hh}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {aIns.map(([x, y], i) => <line key={i} className={bits[i] ? 'w on' : 'w'} x1={4} x2={ax + x - 12} y1={ay + y} y2={ay + y} />)}
      <line className={r.A ? 'w on' : 'w'} x1={ax + aox} x2={bx + bIn[0][0] - 12} y1={ay + aoy} y2={ay + aoy} />
      <line className={r.B ? 'w on' : 'w'} x1={bx + box} x2={W - 4} y1={by + boy} y2={by + boy} />
      <g transform={`translate(${ax} ${ay})`}><Shape g={gA} on={r.A} lit={{ in: aIns.map((_, i) => bits[i]), out: r.A }} /></g>
      <g transform={`translate(${bx} ${by})`}><Shape g={gB} on={r.B} lit={{ in: bIn.map((_, i) => (i === 0 ? r.A : r.b)), out: r.B }} /></g>
    </svg>
  );
}

function Icon({ type, heart }) {
  const g = GATE_GEOM[type], [ox, oy] = outTip(g);
  return (
    <svg className="icon" viewBox={`-30 -4 ${g.w + 74} ${g.h + 8}`} aria-hidden="true">
      {pins(g).map(([x, y], i) => <line key={i} className="w" x1={-26} x2={x - 12} y1={y} y2={y} />)}
      <Shape g={g} idle on={false} lit={{}} />
      <line className="w" x1={ox} x2={ox + 14} y1={oy} y2={oy} />
      {heart && <Heart x={ox + 26} y={oy - 1} s={1.1} className="heart hollow" />}
    </svg>
  );
}

// Mockup order (M1/M3): the outer columns are the ones you can see; the middle ones peek above/below the modal.
const PAIRS = [['OR', 'AND'], ['NOT', 'NAND'], ['AND', 'NOT'], ['NAND', 'OR'], ['XOR', 'AND'], ['NOT', 'XOR'],
  ['AND', 'AND'], ['NOR', 'OR'], ['NOR', 'NAND'], ['NOT', 'OR'], ['AND', 'XOR'], ['NAND', 'NOT']];
const VIEWS = ['456,226', '228,100', '51,975', '456,226', '181,134', '156,450', '90,600', '181,134', '181,134', '155,959', '181,234', '181,134'];

function Tile({ i, A, B, row }) {
  const c = Math.round(compat(A, B) * 100);
  return (
    <a className="tile" href="#" onClick={(e) => e.preventDefault()} aria-label={`${A} and ${B}, ${c}% compatible`}>
      <span className="blob" style={{ '--h': (i * 37) % 50, '--x': `${20 + ((i * 29) % 50)}%`, '--y': `${25 + ((i * 17) % 40)}%` }} />
      <span className="grain" />
      <Pair A={A} B={B} row={row} />
      <Icon type={A} heart={i % 3 !== 1} />
      <span className="badge">{VIEWS[i]}</span>
    </a>
  );
}

export function Grid({ still }) {
  const [t, set] = useState(0);
  useEffect(() => { if (still) return; const k = setInterval(() => set((n) => n + 1), 1100); return () => clearInterval(k); }, [still]);
  return <main className="grid" aria-label="Gate thumbnails">{PAIRS.map(([A, B], i) => <Tile key={i} i={i} A={A} B={B} row={t + i} />)}</main>;
}
