// Shared pieces for the two window rooms (sitting-room, bedroom): the portrait ref's window wall is traced and
// centred; these hand-drawn parts extend it to 16:9. Pure SVG, no motion.
import { rng } from '../util.js';

const f1 = (n) => n.toFixed(1);

// more of the same window wall, left or right of the traced ref: night glass with a blurred city (bokeh) + mullions
export function SidePanes({ x0, x1, top = 0, sill, sky = ['#15223e', '#27406a'], lights = ['#ffd27a', '#8fd0ff', '#ffb070'], seed = 1, mullions = [] }) {
  const r = rng(seed);
  const id = `sp-${seed}`;
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient></defs>
      <rect x={x0} y={top} width={x1 - x0} height={sill - top} fill={`url(#${id})`} />
      {/* out-of-focus towers + window lights (the rain on the glass blurs them) */}
      <g opacity=".55">
        {Array.from({ length: 9 }, (_, i) => { const w = 40 + r() * 80, h = 120 + r() * 300, x = x0 + r() * (x1 - x0 - w); return <rect key={i} x={f1(x)} y={f1(sill - h)} width={f1(w)} height={f1(h)} fill="#101a30" />; })}
      </g>
      <g style={{ mixBlendMode: 'screen' }}>
        {Array.from({ length: 70 }, (_, i) => { const x = x0 + r() * (x1 - x0), y = top + (sill - top) * (0.35 + r() * 0.62), s = 2 + r() * 7; return <circle key={i} cx={f1(x)} cy={f1(y)} r={f1(s)} fill={lights[i % lights.length]} opacity={f1(0.25 + r() * 0.5)} />; })}
      </g>
      {mullions.map((x) => <rect key={x} x={x - 9} y={top} width="18" height={sill - top} fill="#0e1422" />)}
      <rect x={x0} y={sill - 10} width={x1 - x0} height="16" fill="#1a1f2c" />
    </g>
  );
}

// a sheer curtain panel pulled to one side: vertical folds, lit from the room (warm) and from the glass (cool)
export function Curtain({ x0, x1, top = 0, hem, side = 'left', tint = '#d8c4e8', shade = '#8c78a8', seed = 3 }) {
  const r = rng(seed);
  const n = Math.round((x1 - x0) / 46);
  const folds = Array.from({ length: n }, (_, i) => x0 + ((i + 0.5) * (x1 - x0)) / n + (r() - 0.5) * 14);
  // gathered toward the wall side at the hem: the fabric drapes in a slight curve
  const gather = (x, y) => { const t = (y - top) / (hem - top); const pull = side === 'left' ? -1 : 1; return x + pull * t * t * 40 * ((side === 'left' ? x1 - x : x - x0) / (x1 - x0)); };
  const id = `cu-${seed}`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={side === 'left' ? shade : tint} /><stop offset="1" stopColor={side === 'left' ? tint : shade} />
        </linearGradient>
      </defs>
      <path d={`M${x0} ${top}H${x1}L${f1(gather(x1, hem))} ${hem}Q${f1((x0 + x1) / 2)} ${hem + 14} ${f1(gather(x0, hem))} ${hem}Z`} fill={`url(#${id})`} opacity=".86" />
      {folds.map((x, i) => (
        <g key={i}>
          <path d={`M${f1(x)} ${top}C${f1(x - 6)} ${f1(top + (hem - top) * 0.3)} ${f1(x + 6)} ${f1(top + (hem - top) * 0.7)} ${f1(gather(x, hem))} ${hem}`} stroke={shade} strokeWidth={f1(10 + r() * 10)} opacity=".35" fill="none" />
          <path d={`M${f1(x + 14)} ${top}C${f1(x + 8)} ${f1(top + (hem - top) * 0.3)} ${f1(x + 20)} ${f1(top + (hem - top) * 0.7)} ${f1(gather(x + 14, hem))} ${hem}`} stroke="#fff4f8" strokeWidth="4" opacity=".28" fill="none" />
        </g>
      ))}
      <rect x={x0 - 10} y={top} width={x1 - x0 + 20} height="14" fill="#2a2230" />
    </g>
  );
}
