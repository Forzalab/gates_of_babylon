// PARK (art id `park`, fixes KNOWN-BUGS #1): the first date spot. Trace = the sakura park ref (research/refs/
// sakura-park_5f5f46b7.jpg, a 16:9 band of the portrait ref, prep.py) + hand overlay: the near canopy hanging into
// frame, a clean pink-gravel path curving from Nanda's feet to the gazebo, a bench for two (two cans + her bento
// bundle), the lamp's lantern lit early, the koi pond rim, a far pink clock tower in the sky gap, grass tufts.
// Light: magic hour, ONE sun low behind the trees at the right -> every shadow falls long toward the front-left
// (trunks, lamp, bench); warm rim on the right edges. Grade: Your-Name magic tone (flare, sparkles, drifting petals).
// Motion: Grade's stepped sparkles + petals (500 ms per pose); rm = still.
import { rng, useStoryTime } from '../util.js';
import { camera, preloadTrace, Trace, Grade } from './kit.jsx';

preloadTrace('park');

const C = camera({ vx: 960, vy: 620, eye: 1.5 });
const { P, pts } = C;
const f1 = (n) => n.toFixed(1);
const SUN = [1790, 300];

// blossom cluster along a branch: circles in 3 pinks, darker underside first
function Blossoms({ seed, along, spread = 70, n = 60, size = [26, 58] }) {
  const r = rng(seed), out = [];
  for (let i = 0; i < n; i++) {
    const t = r(), [x0, y0] = along(t);
    const x = x0 + (r() - 0.5) * spread * 2, y = y0 + (r() - 0.5) * spread * 1.3, s = size[0] + r() * (size[1] - size[0]);
    out.push([x, y, s, r()]);
  }
  return (
    <g>
      {out.map(([x, y, s], i) => <circle key={`d${i}`} cx={f1(x)} cy={f1(y + s * 0.25)} r={f1(s)} fill="#c7658f" />)}
      {out.map(([x, y, s, k], i) => <circle key={`m${i}`} cx={f1(x)} cy={f1(y)} r={f1(s * 0.9)} fill={k < 0.5 ? '#f29bbf' : '#f7b6d0'} />)}
      {out.map(([x, y, s, k], i) => k > 0.72 && <circle key={`h${i}`} cx={f1(x + s * 0.3)} cy={f1(y - s * 0.35)} r={f1(s * 0.28)} fill="#ffe6f0" opacity=".8" />)}
    </g>
  );
}
const bez = (a, b, c, d) => (t) => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]);
};

function Bench() {
  // front-on park bench, 1.6 m, at X -3.0, Z 8 (where the traced bench mushed out); slats + iron ends
  const X0 = -3.8, X1 = -2.2, Z0 = 7.8, Z1 = 8.25, SEAT = 0.45, TOP = 0.88;
  const s = C.f / 8 / 1000;
  const [cx, cy] = P(-3.25, SEAT, 7.95), [bx, by] = P(-2.7, SEAT, 7.95);
  return (
    <g>
      {/* long shadow toward the front-left (sun low, back-right) */}
      <polygon points={pts([[X0, 0, Z0], [X1, 0, Z0], [X1 - 0.9, 0, Z0 - 1.3], [X0 - 0.9, 0, Z0 - 1.3]])} fill="#4a2f5c" opacity=".28" />
      {[X0 + 0.08, X1 - 0.08].map((x) => (
        <g key={x}>
          <polygon points={pts([[x - 0.03, 0, Z1], [x + 0.03, 0, Z1], [x + 0.03, TOP, Z1], [x - 0.03, TOP, Z1]])} fill="#2c2330" />
          <polygon points={pts([[x - 0.03, 0, Z0], [x + 0.03, 0, Z0], [x + 0.03, SEAT, Z0], [x - 0.03, SEAT, Z0]])} fill="#2c2330" />
        </g>
      ))}
      {[0.5, 0.64, 0.78].map((y) => <polygon key={y} points={pts([[X0, y, Z1], [X1, y, Z1], [X1, y + 0.08, Z1], [X0, y + 0.08, Z1]])} fill="#a0643c" />)}
      {[0, 1, 2, 3].map((k) => { const z = Z0 + k * 0.11; return <polygon key={k} points={pts([[X0, SEAT, z], [X1, SEAT, z], [X1, SEAT, z + 0.08], [X0, SEAT, z + 0.08]])} fill={k % 2 ? '#b8744a' : '#c4804f'} />; })}
      <polygon points={pts([[X0, SEAT - 0.04, Z0], [X1, SEAT - 0.04, Z0], [X1, SEAT, Z0], [X0, SEAT, Z0]])} fill="#7a4628" />
      <polygon points={pts([[X1 - 0.3, SEAT, Z0], [X1, SEAT, Z0], [X1, TOP, Z1], [X1 - 0.3, TOP, Z1]])} fill="#ffd8a0" opacity=".18" />
      {/* two cans + her pink bento bundle */}
      <g transform={`translate(${f1(cx)} ${f1(cy)}) scale(${s.toFixed(4)})`}>
        <rect x="-40" y="-120" width="66" height="120" rx="10" fill="#f4f0f6" /><rect x="-40" y="-86" width="66" height="44" fill="#ff7fb4" />
        <rect x="40" y="-120" width="66" height="120" rx="10" fill="#f4f0f6" /><rect x="40" y="-86" width="66" height="44" fill="#7fb8ff" />
      </g>
      <g transform={`translate(${f1(bx)} ${f1(by)}) scale(${s.toFixed(4)})`}>
        <path d="M-140 0Q-150 -120 0 -130Q150 -120 140 0Z" fill="#ff8ab8" />
        <path d="M-40 -128Q-80 -210 -10 -190Q0 -160 -4 -130M40 -128Q80 -210 10 -190" fill="#ff8ab8" stroke="#d6337f" strokeWidth="8" />
        <g fill="#fff" opacity=".85">{[[-80, -60], [-20, -90], [50, -50], [90, -95], [0, -30]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="12" />)}</g>
      </g>
    </g>
  );
}

function Tower() {
  const [h, m] = useStoryTime(4, 0); // magic hour
  // far pink clock tower (the pink-cathedral ref, redrawn small) in the bright sky gap: hazed, rim-lit from the right
  return (
    <g opacity=".8">
      <path d="M1540 430V300L1560 250L1580 300V430Z" fill="#e7a9c6" />
      <path d="M1600 430V270L1622 190L1644 270V430Z" fill="#eab0cb" />
      <path d="M1664 430V300L1684 250L1704 300V430Z" fill="#e7a9c6" />
      <path d="M1580 430V330H1664V430Z" fill="#e2a0bf" />
      <path d="M1640 272L1644 270V430H1638Z M1700 300L1704 300V430H1698Z" fill="#fff4e0" opacity=".8" />
      <circle cx="1622" cy="300" r="17" fill="#fff6fa" stroke="#c77a9e" strokeWidth="3" />
      <g transform="translate(1622 300)" stroke="#8a4a6a" strokeWidth="2.5" strokeLinecap="round"><path d="M0 0V-12" transform={`rotate(${m * 6})`} /><path d="M0 0V-9" transform={`rotate(${(h % 12) * 30 + m / 2})`} /></g>
      <circle cx="1622" cy="370" r="14" fill="#c77a9e" opacity=".6" />
      {/* far treeline in haze, hiding the base */}
      <g fill="#d9e6c8">{[[1520, 420, 44], [1575, 408, 40], [1630, 414, 48], [1690, 404, 42], [1740, 420, 40]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} />)}</g>
      <g fill="#f4c6d8">{[[1548, 398, 26], [1662, 392, 28], [1716, 402, 22]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} />)}</g>
    </g>
  );
}

function Path() {
  const d = 'M700 1080C760 960 930 860 1080 800C1170 764 1190 730 1188 700L1262 700C1276 734 1262 780 1200 830C1090 920 1060 990 1230 1080Z';
  const r = rng(5);
  const grit = Array.from({ length: 140 }, () => { const y = 700 + Math.pow(r(), 0.6) * 380; return [r(), y, r()]; });
  return (
    <g>
      <defs>
        <linearGradient id="pk-path" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6d4cf" /><stop offset="1" stopColor="#f2bfc7" /></linearGradient>
        <clipPath id="pk-path-clip"><path d={d} /></clipPath>
      </defs>
      <path d={d} fill="url(#pk-path)" />
      <g clipPath="url(#pk-path-clip)">
        {grit.map(([u, y, k], i) => { const w = 2 + (y - 700) / 60; return <ellipse key={i} cx={f1(700 + u * 560)} cy={f1(y)} rx={f1(w)} ry={f1(w * 0.5)} fill={k < 0.5 ? '#d99aa8' : '#fff0ea'} opacity=".7" />; })}
        {/* trunk + lamp shadows crossing the path, long toward the front-left */}
        <path d="M1150 700L1100 700L700 1080L860 1080Z" fill="#5a3a6a" opacity=".2" />
        <path d="M1240 760L1225 760L980 1080L1030 1080Z" fill="#5a3a6a" opacity=".16" />
      </g>
    </g>
  );
}

function Pond() {
  return (
    <g>
      <defs><linearGradient id="pk-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfe3e6" /><stop offset=".6" stopColor="#8fc4d0" /><stop offset="1" stopColor="#f0b8cf" /></linearGradient></defs>
      <path d="M1440 1080C1470 990 1560 930 1700 905C1800 890 1880 900 1920 910V1080Z" fill="url(#pk-water)" />
      <g fill="#ffe6f0" opacity=".7">{[[1600, 980, 60], [1760, 950, 40], [1700, 1040, 80]].map(([x, y, w]) => <ellipse key={x} cx={x} cy={y} rx={w} ry="4" />)}</g>
      <g fill="#6fae6a">{[[1560, 1010], [1820, 990]].map(([x, y]) => <path key={x} d={`M${x} ${y}a26 11 0 1 0 1 -9L${x} ${y}Z`} />)}</g>
      <g fill="#ff8a3a">{[[1680, 985, -12], [1760, 1030, 18]].map(([x, y, a]) => <g key={x} transform={`translate(${x} ${y}) rotate(${a})`}><ellipse rx="22" ry="8" /><path d="M-22 0L-36 -8L-36 8Z" /><circle cx="8" cy="-2" r="3" fill="#fff" /></g>)}</g>
      <g>{[[1450, 1060, 46], [1500, 985, 40], [1570, 940, 44], [1660, 915, 38], [1750, 902, 42], [1850, 900, 40]].map(([x, y, r]) => (
        <g key={x}><ellipse cx={x} cy={y} rx={r} ry={r * 0.55} fill="#8d8a96" /><ellipse cx={x - r * 0.2} cy={y - r * 0.18} rx={r * 0.6} ry={r * 0.28} fill="#c9c4cf" /></g>))}</g>
    </g>
  );
}

function Tufts({ seed, x0, x1, y0, y1, n = 26 }) {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), h = 10 + ((y - 640) / 14) * (0.5 + r() * 0.5), lean = (r() - 0.5) * h * 0.8;
        return (
          <g key={i}>
            <path d={`M${f1(x - 6)} ${f1(y)}Q${f1(x + lean * 0.4)} ${f1(y - h * 0.6)} ${f1(x + lean)} ${f1(y - h)}Q${f1(x + 2)} ${f1(y - h * 0.5)} ${f1(x + 6)} ${f1(y)}Z`} fill={r() < 0.5 ? '#4f8a3c' : '#63a048'} opacity=".9" />
            <path d={`M${f1(x + 2)} ${f1(y)}Q${f1(x + lean * 0.5 + 3)} ${f1(y - h * 0.55)} ${f1(x + lean + 2)} ${f1(y - h)}`} stroke="#e9f7a0" strokeWidth="1.6" fill="none" opacity=".7" />
          </g>
        );
      })}
    </g>
  );
}

export default function Park({ rm }) {
  const lamp = [592, 196];
  const petalsGround = (() => { const r = rng(77); return Array.from({ length: 70 }, () => [r() * 1920, 700 + Math.pow(r(), 0.7) * 380, r() * 180, 0.6 + r()]); })();
  return (
    <div className="art park">
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" role="img"
        aria-label="A sakura park at magic hour: pink blossoms overhead, a pink gravel path curving to a wooden gazebo, a bench for two, a koi pond, a far pink clock tower in the bright sky.">
        <defs>
          <radialGradient id="pk-lamp"><stop offset="0" stopColor="#fff2c0" stopOpacity=".9" /><stop offset=".25" stopColor="#ffc46a" stopOpacity=".35" /><stop offset="1" stopColor="#ffc46a" stopOpacity="0" /></radialGradient>
          <radialGradient id="pk-sky" cx="1" cy=".3" r="1"><stop offset="0" stopColor="#fff4d8" stopOpacity=".6" /><stop offset="1" stopColor="#fff4d8" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="#f7d6e2" />
        <Trace id="park" />
        <Tower />
        {/* trunk shadows on the grass (sun low at the right, behind the trees) */}
        <g fill="#4a2f5c" opacity=".3">
          <path d="M790 700L740 700L380 1080L560 1080Z" /><path d="M980 680L950 680L760 900L820 900Z" /><path d="M600 700L585 700L300 1000L340 1000Z" />
        </g>
        <Path />
        {/* petals settled on the path + grass */}
        <g>{petalsGround.map(([x, y, a, s], i) => <ellipse key={i} cx={f1(x)} cy={f1(y)} rx={f1(4 * s * (y - 600) / 200)} ry={f1(2 * s * (y - 600) / 200)} transform={`rotate(${f1(a)} ${f1(x)} ${f1(y)})`} fill="#ffc7de" opacity=".85" />)}</g>
        <Pond />
        <Bench />
        {/* the lamp's lantern, lit early */}
        <circle cx={lamp[0]} cy={lamp[1]} r="120" fill="url(#pk-lamp)" style={{ mixBlendMode: 'screen' }} />
        <path d={`M${lamp[0] - 16} ${lamp[1] - 18}H${lamp[0] + 16}L${lamp[0] + 12} ${lamp[1] + 16}H${lamp[0] - 12}Z`} fill="#fff0c0" stroke="#3a2a2a" strokeWidth="4" />
        <path d={`M${lamp[0] - 22} ${lamp[1] - 18}L${lamp[0]} ${lamp[1] - 34}L${lamp[0] + 22} ${lamp[1] - 18}Z`} fill="#3a2a2a" />
        {/* foreground grass tufts, rim-lit */}
        <Tufts seed={3} x0={0} x1={700} y0={960} y1={1080} n={34} />
        <Tufts seed={4} x0={1240} x1={1480} y0={900} y1={1080} n={18} />
        {/* the near canopy hanging into frame: two branches, top-left + top-right */}
        <path d="M-20 40C200 70 380 40 560 -20" stroke="#4a2c2c" strokeWidth="26" fill="none" strokeLinecap="round" />
        <path d="M1940 150C1760 120 1600 60 1480 -20" stroke="#4a2c2c" strokeWidth="22" fill="none" strokeLinecap="round" />
        <Blossoms seed={11} along={bez([-20, 40], [200, 70], [380, 40], [560, -20])} spread={80} n={70} />
        <Blossoms seed={12} along={bez([1940, 150], [1760, 120], [1600, 60], [1480, -20])} spread={70} n={56} size={[22, 50]} />
        <rect width="1920" height="1080" fill="url(#pk-sky)" style={{ mixBlendMode: 'screen' }} />
        <Grade id="pk-grade" tone="magic" sun={SUN} sparkles={20} petals={30} rm={rm} />
      </svg>
    </div>
  );
}
