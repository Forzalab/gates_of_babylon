// Rain for the night scenes (6-9): thin slanted streaks, 2 poses on the stepped clock (500 ms each = 2 Hz, under the 3 Hz cap).
// Reduced motion: one still pose. Streak positions are seeded, so a screenshot is always the same.
import { rng, useStep } from './util.js';

export default function Rain({ seed = 7, n = 140, x = 0, y = 0, w = 1920, h = 1080, color = '#b9c8ff', opacity = 0.35, rm }) {
  const pose = useStep(2, 4, !rm);
  const rnd = rng(seed + pose * 101);
  return (
    <g className="rain" stroke={color} strokeWidth="2" opacity={opacity} strokeLinecap="round">
      {Array.from({ length: n }, (_, i) => {
        const x1 = x + rnd() * w, y1 = y + rnd() * h, len = 26 + rnd() * 34;
        return <line key={i} x1={x1} y1={y1} x2={x1 - len * 0.22} y2={y1 + len} />;
      })}
    </g>
  );
}

// A lit city block behind the rain: dark towers with a seeded scatter of warm/cool windows.
export function Skyline({ seed = 3, base = 700, from = 0, to = 1920, tone = '#141b3a', lit = ['#ffd27a', '#8fd0ff', '#ff9ad0'] }) {
  const rnd = rng(seed);
  const towers = [];
  for (let x = from; x < to;) {
    const w = 70 + rnd() * 110, h = 160 + rnd() * 380;
    towers.push({ x, w, h });
    x += w + rnd() * 18;
  }
  return (
    <g className="skyline">
      {towers.map((t, i) => (
        <g key={i}>
          <rect x={t.x} y={base - t.h} width={t.w} height={t.h} fill={tone} />
          {Array.from({ length: Math.floor(t.h / 26) * Math.floor(t.w / 22) }, (_, k) => {
            if (rnd() > 0.28) return null;
            const cols = Math.floor(t.w / 22), c = k % cols, r = Math.floor(k / cols);
            return <rect key={k} x={t.x + 8 + c * 22} y={base - t.h + 12 + r * 26} width="10" height="12" fill={lit[Math.floor(rnd() * lit.length)]} opacity=".75" />;
          })}
        </g>
      ))}
    </g>
  );
}
