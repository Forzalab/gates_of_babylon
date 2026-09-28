// HOT NAAN billboard (SHOPPING-LIST: BILLBOARD + BRAND RULE). A butter-chicken river with naan + rice, NAND gates
// swimming in it (palette + S-curve from Tony's CC0 ref 217e8bc1). Japanese ad style: crammed, many fonts, red/yellow.
// Headline glitch: NAAN -> NAND -> one "NANDA" frame, on a 500 ms step (<= 2 swaps a second, WCAG 2.3.1 safe).
// Reduced motion: a static "NAN D" with the D in her red; the gates stop bobbing.
import { rng, useStep, HEART } from './util.js';

// Centre line of the river: [x, y, width]. Sampled as a Catmull-Rom spline, offset by +-width/2.
const RIVER = [[620, 150, 36], [860, 205, 70], [1090, 285, 100], [1100, 370, 120], [880, 430, 140], [620, 500, 160],
  [540, 610, 190], [760, 700, 250], [1060, 790, 360], [1000, 900, 560], [760, 1010, 1100]]

function cr(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return p1.map((_, i) => 0.5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3));
}
// u in [0, 1] along the whole river -> { x, y, w, nx, ny } (unit normal from a central difference, so segment joins stay smooth)
function pos(u) {
  const n = RIVER.length - 1, f = Math.max(0, Math.min(u * n, n - 1e-6)), i = Math.floor(f), t = f - i;
  const P = (k) => RIVER[Math.max(0, Math.min(n, k))];
  return cr(P(i - 1), P(i), P(i + 1), P(i + 2), t);
}
function at(u) {
  const [x, y, w] = pos(u), a = pos(u - 0.004), b = pos(u + 0.004);
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  return { x, y, w, nx: -dy / l, ny: dx / l };
}
const line = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
function riverPath() {
  const N = 120, L = [], R = [];
  for (let k = 0; k <= N; k++) { const p = at(k / N); L.push([p.x + p.nx * p.w / 2, p.y + p.ny * p.w / 2]); R.push([p.x - p.nx * p.w / 2, p.y - p.ny * p.w / 2]); }
  return `${line(L)}${line(R.reverse()).replace('M', 'L')}Z`;
}
function swirl(off, u0, u1) {
  const pts = [];
  for (let k = 0; k <= 40; k++) { const p = at(u0 + (u1 - u0) * k / 40); pts.push([p.x + p.nx * p.w * off, p.y + p.ny * p.w * off]); }
  return line(pts);
}
const RIVER_D = riverPath();
const SWIRLS = [[0.22, 0.03, 0.26], [-0.18, 0.1, 0.36], [0.12, 0.3, 0.55], [-0.26, 0.44, 0.7], [0.3, 0.58, 0.84], [0.02, 0.7, 0.96], [-0.2, 0.82, 0.99]]
  .map(([o, a, b]) => swirl(o, a, b));

const place = (u, off) => { const p = at(u); return { x: p.x + p.nx * p.w * off, y: p.y + p.ny * p.w * off, s: 0.35 + p.w / 520 }; };
const CHICKEN = [[0.18, 0.2], [0.33, -0.25], [0.47, 0.2], [0.6, -0.3], [0.7, 0.28], [0.82, -0.22], [0.9, 0.3], [0.95, -0.05]].map(([u, o]) => place(u, o));
const GATES = [[0.26, -0.05], [0.42, -0.02], [0.56, 0.1], [0.76, 0.02], [0.88, -0.35], [0.9, 0.12]].map(([u, o]) => place(u, o));

function Chunk({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-40 14 C-44 -6 -20 -30 2 -30 C24 -30 44 -8 40 14 C30 22 -30 22 -40 14Z" fill="#c9501a" />
      <path d="M-24 -10 C-14 -22 4 -24 14 -18" stroke="#e8762c" strokeWidth="7" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="18" rx="50" ry="8" fill="none" stroke="#fdd9a8" strokeWidth="3" opacity=".7" />
    </g>
  );
}

function Gate({ x, y, s, up }) {
  return (
    <g transform={`translate(${x} ${y - (up ? 6 : 0)}) scale(${s}) rotate(${up ? -4 : 3})`}>
      <path d="M-58 22 Q-20 34 30 22" stroke="#fff3dc" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M-44 -26 H-6 A26 26 0 0 1 -6 26 H-44Z" fill="#fffaf0" stroke="#5a1f00" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="28" cy="0" r="8" fill="#fffaf0" stroke="#5a1f00" strokeWidth="6" />
      <line x1="-58" y1="-12" x2="-44" y2="-12" stroke="#5a1f00" strokeWidth="6" /><line x1="-58" y1="12" x2="-44" y2="12" stroke="#5a1f00" strokeWidth="6" />
      <circle cx="-26" cy="-4" r="4.5" fill="#5a1f00" /><circle cx="-10" cy="-4" r="4.5" fill="#5a1f00" />
      <path d="M-24 8 Q-18 13 -12 8" stroke="#5a1f00" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Naan({ x, y, s = 1, r = 0, wedge = false }) {
  const rnd = rng(Math.round(x + y));
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d={wedge ? 'M-120 -90 Q20 -130 130 -40 L-40 130 Q-110 40 -120 -90Z' : 'M-150 40 C-150 -70 -60 -110 10 -110 C100 -110 160 -40 150 40 C120 70 -120 70 -150 40Z'}
        fill="#e7a34d" stroke="#b86a22" strokeWidth="6" />
      <path d={wedge ? 'M-96 -76 Q10 -104 100 -40' : 'M-110 -20 C-80 -80 40 -100 110 -30'} stroke="#fbe3b4" strokeWidth="14" fill="none" strokeLinecap="round" opacity=".8" />
      {Array.from({ length: 11 }, (_, i) => {
        const cx = (rnd() - 0.5) * 180, cy = (rnd() - 0.4) * 110, rr = 7 + rnd() * 10;
        return <g key={i}><circle cx={cx} cy={cy} r={rr} fill="#a8601e" /><circle cx={cx - 2} cy={cy - 2} r={rr * 0.5} fill="#d38a3c" /></g>;
      })}
    </g>
  );
}

function Rice({ x, y, w, h, seed }) {
  const rnd = rng(seed);
  return (
    <g>
      <path d={`M${x - w / 2} ${y} C${x - w / 3} ${y - h} ${x + w / 3} ${y - h} ${x + w / 2} ${y}Z`} fill="#fdfcf4" />
      {Array.from({ length: Math.round(w / 6) }, (_, i) => {
        const gx = x + (rnd() - 0.5) * w * 0.85, gy = y - rnd() * h * 0.7 - 4;
        return <ellipse key={i} cx={gx} cy={gy} rx="7" ry="3" transform={`rotate(${rnd() * 180} ${gx} ${gy})`} fill="#e3ddcb" />;
      })}
    </g>
  );
}

function Puff({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#ffffff">
      <circle cx="0" cy="0" r="46" /><circle cx="52" cy="-18" r="56" /><circle cx="110" cy="0" r="44" /><rect x="0" y="0" width="110" height="44" />
    </g>
  );
}

// Idol silhouettes: [x, fill, hair]. Pink / black alternate; black ones get a pink rim so they read on the panel.
const IDOLS = [[1450, '#ff5fa2', 'twin'], [1570, '#111', 'bob'], [1690, '#ff5fa2', 'long'], [1810, '#111', 'pony']];
function Idol({ x, fill, hair }) {
  const rim = fill === '#111' ? '#ff5fa2' : '#111';
  const hairD = {
    twin: `M${x - 44} 470 C${x - 90} 520 ${x - 84} 600 ${x - 60} 640 C${x - 70} 580 ${x - 54} 520 ${x - 34} 500Z M${x + 44} 470 C${x + 90} 520 ${x + 84} 600 ${x + 60} 640 C${x + 70} 580 ${x + 54} 520 ${x + 34} 500Z`,
    bob: `M${x - 54} 480 C${x - 60} 400 ${x + 60} 400 ${x + 54} 480 L${x + 56} 540 L${x - 56} 540Z`,
    long: `M${x - 48} 460 C${x - 60} 520 ${x - 62} 620 ${x - 54} 680 L${x + 54} 680 C${x + 62} 620 ${x + 60} 520 ${x + 48} 460Z`,
    pony: `M${x + 30} 440 C${x + 90} 430 ${x + 100} 520 ${x + 70} 600 C${x + 74} 530 ${x + 60} 480 ${x + 36} 470Z`,
  }[hair];
  return (
    <g stroke={rim} strokeWidth="5" strokeLinejoin="round">
      <path d={hairD} fill={fill} />
      <path d={`M${x - 70} 790 C${x - 70} 640 ${x - 44} 560 ${x} 560 C${x + 44} 560 ${x + 70} 640 ${x + 70} 790Z`} fill={fill} />
      <circle cx={x} cy="486" r="44" fill={fill} />
      <path d={`M${x - 30} 668 Q${x + 20} 596 ${x + 74} 640 Q${x + 40} 716 ${x - 30} 668Z`} fill="#e7a34d" stroke="#b86a22" strokeWidth="4" />
      <circle cx={x + 18} cy={650} r="6" fill="#a8601e" stroke="none" /><circle cx={x + 42} cy={662} r="5" fill="#a8601e" stroke="none" />
    </g>
  );
}

function Qr() {
  const rnd = rng(980), n = 21, m = 5;
  const finder = (x, y) => <g key={`${x}${y}`}><rect x={x * m} y={y * m} width={7 * m} height={7 * m} fill="#111" /><rect x={x * m + m} y={y * m + m} width={5 * m} height={5 * m} fill="#fff" /><rect x={x * m + 2 * m} y={y * m + 2 * m} width={3 * m} height={3 * m} fill="#111" /></g>;
  const inFinder = (i, j) => (i < 8 && j < 8) || (i > n - 9 && j < 8) || (i < 8 && j > n - 9);
  const cells = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) if (!inFinder(i, j) && rnd() < 0.48) cells.push(<rect key={`${i}-${j}`} x={i * m} y={j * m} width={m} height={m} fill="#111" />);
  return (
    <svg className="qr" viewBox={`-10 -10 ${n * m + 20} ${n * m + 20}`} aria-hidden="true">
      <rect x="-10" y="-10" width={n * m + 20} height={n * m + 20} fill="#fff" />
      {cells}{finder(0, 0)}{finder(n - 7, 0)}{finder(0, n - 7)}
    </svg>
  );
}

const Heart = () => <svg className="hl-heart" viewBox="-15 -13 30 26" aria-hidden="true"><path d={HEART} transform="scale(1.25)" fill="#ff5fa2" stroke="#b0123e" strokeWidth="1.6" /></svg>;

// 8 ticks x 500 ms = 4 s loop. Letters after "NA": plain = normal, g = glitched (black tile, her red).
const GLITCH = [['A', 'N'], ['A', 'N'], ['A', 'N'], ['A', 'N'], ['N', 'D'], ['N', 'D'], ['N', 'D', 'A'], ['N', 'D']];
function Headline({ rm }) {
  const f = useStep(GLITCH.length, 4, !rm);
  const tail = rm ? null : GLITCH[f];
  return (
    <h2 className="hl" data-glitch={rm ? 'NAN D' : `NA${tail.join('')}`}>
      <Heart />
      <span className="hl-hot">Hot</span>
      <span className="hl-naan">NA{rm
        ? <>N<i className="gl gl-rm">D</i></>
        : tail.map((c, i) => (tail[0] === 'A' ? <span key={i}>{c}</span> : <i key={i} className="gl">{c}</i>))}</span>
      <span className="hl-area">in your area</span>
      <Heart />
    </h2>
  );
}

export default function NaanBoard({ rm }) {
  const bob = useStep(2, 4, !rm);
  return (
    <div className="art naan">
      <svg className="board" viewBox="0 0 1920 1080" role="img" aria-label="Billboard: Hot NAAN in your area. A river of butter chicken curry with naan, rice and swimming NAND gates.">
        <defs><clipPath id="nb-poster"><rect x="16" y="16" width="1888" height="1048" /></clipPath></defs>
        <rect width="1920" height="1080" fill="#151515" />
        <g clipPath="url(#nb-poster)">
        <rect x="16" y="16" width="1888" height="1048" fill="#d4e6df" />
        <Puff x={80} y={250} s={1.4} /><Puff x={560} y={200} s={1.1} /><Puff x={1120} y={470} s={1.2} /><Puff x={1000} y={210} s={0.9} />
        <Puff x={220} y={900} s={1.6} /><Puff x={1200} y={880} s={1.3} />
        <Naan x={1230} y={300} s={1.05} r={8} />
        <Rice x={660} y={290} w={230} h={90} seed={3} />
        {/* river: bank rim (depth), body, cream swirls */}
        <path d={RIVER_D} transform="translate(0 22)" fill="#c63f06" />
        <path d={RIVER_D} fill="#f68413" />
        {SWIRLS.map((d, i) => <path key={i} d={d} fill="none" stroke="#fff3dc" strokeWidth={i > 3 ? 13 : 9} strokeLinecap="round" opacity=".92" />)}
        {CHICKEN.map((c, i) => <Chunk key={i} {...c} />)}
        {GATES.map((g, i) => <Gate key={i} {...g} up={(bob + i) % 2 === 1} />)}
        {[[0.3, 0.3], [0.52, -0.3], [0.66, 0.05], [0.8, 0.38], [0.93, -0.4]].map(([u, o], i) => {
          const p = place(u, o);
          return <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s}) rotate(${i * 50})`} fill="#3c8d2f"><ellipse rx="14" ry="8" cx="-10" /><ellipse rx="14" ry="8" cx="10" transform="rotate(60)" /><ellipse rx="14" ry="8" cx="10" transform="rotate(-50)" /></g>;
        })}
        <Rice x={400} y={830} w={420} h={170} seed={9} />
        <Naan x={350} y={640} s={1.1} r={-14} wedge />
        {/* PINKBLACK panel */}
        <rect x="1370" y="216" width="520" height="590" fill="#111" stroke="#ff5fa2" strokeWidth="8" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${1374 + i * 70} 802 L${1474 + i * 70} 402`} stroke="#ff5fa2" strokeWidth="14" opacity=".22" />)}
        {IDOLS.map(([x, fill, hair]) => <Idol key={x} x={x} fill={fill} hair={hair} />)}
        {/* starburst */}
        <polygon transform="translate(400 372) rotate(-12)" fill="#ffe100" stroke="#e60012" strokeWidth="8" strokeLinejoin="round"
          points={Array.from({ length: 32 }, (_, i) => { const a = (i * Math.PI) / 16, r = i % 2 ? 118 : 158; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(' ')} />
        </g>
        {/* header + footer bands */}
        <rect x="16" y="16" width="1888" height="176" fill="#ffe100" />
        <rect x="16" y="186" width="1888" height="12" fill="#e60012" />
        <rect x="16" y="940" width="1888" height="124" fill="#111" />
        <rect x="16" y="934" width="1888" height="8" fill="#e60012" />
        <g transform="translate(40 966) scale(1.5)">
          <path d="M0 0h26a24 24 0 0 1 0 48H0z" fill="none" stroke="#ffe100" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="58" cy="24" r="7" fill="none" stroke="#ffe100" strokeWidth="6" />
        </g>
        {[[40, 70], [1880, 70]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="8" fill="#888" stroke="#333" strokeWidth="3" />)}
      </svg>

      <Headline rm={rm} />
      <p className="v-curry">本格インドカレー</p>
      <p className="burst">新発売<span>！</span></p>
      <p className="pb"><b>PINKBLACK</b> も夢中！</p>
      <p className="pb-spons"><span>sponsored by <b>Figur</b></span></p>
      <p className="tabehodai">ナン食べ放題‼</p>
      <p className="price">¥980<small>（税込）</small></p>
      <p className="bang b1">‼</p><p className="bang b2">‼</p><p className="bang b3">‼</p>
      <p className="foot"><b>NAND HOUSE</b><span>渋谷駅 徒歩3分</span></p>
      <p className="foot-figur">Figur</p>
      <Qr />
    </div>
  );
}
