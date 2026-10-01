// Scene A food parts, hand-drawn SVG (<g> fragments, local origin = the food's centre). Refs: 02 (the rolled-layer
// swirl), 01 (seared top, chopsticks), 03 (the umeboshi's pink stain on rice), 08/09 (our AND-gate plum, 74181 omelette:
// ha-props.js ume()/tama()). The circuit gag stays subtle so each reads as food first:
//   umeboshi   = 2 stem nubs on its flat-ish left side (the AND inputs) + a shiso leaf out the right (the output)
//   tamagoyaki = a pin-1 dimple on the cut face; lifted, a nori band stamped "SN74181" + a row of sesame pins
// Still art, no animation. Ink is mid-brown (ref 04), never black.
import { rng } from '../util.js';

export const INK = '#5a2a3a';

// ---------- umeboshi ----------
// wrinkly plum outline: polar wobble, the left side pressed a little flat (the AND gate's straight back)
function plumPath(r, seed = 3) {
  const rnd = rng(seed), ph = [rnd() * 6, rnd() * 6, rnd() * 6];
  const pts = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    let rr = r * (1 + 0.045 * Math.sin(5 * a + ph[0]) + 0.03 * Math.sin(9 * a + ph[1]) + 0.02 * Math.sin(13 * a + ph[2]));
    let x = Math.cos(a) * rr, y = Math.sin(a) * rr * 0.92;
    if (x < -r * 0.62) x = -r * 0.62 - (-(x) - r * 0.62) * 0.35; // flatten the left
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M${pts.join(' L')}Z`;
}

const WRINKLES = 'M-30,-26 C-20,-20 -12,-30 -2,-24 M-34,4 C-24,-4 -14,8 -4,2 M4,-36 C12,-30 22,-34 30,-26 M6,16 C16,8 26,20 36,12 M-18,30 C-8,24 2,34 12,28 M26,-8 C32,-2 38,-6 42,2';

export function Umeboshi({ r = 50, uid = 'u', stems = true, leaf = true }) {
  const k = r / 50;
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-body`} cx=".36" cy=".3" r=".8">
          <stop offset="0" stopColor="#e85a78" /><stop offset=".5" stopColor="#b01f40" /><stop offset="1" stopColor="#5c1030" />
        </radialGradient>
        <radialGradient id={`${uid}-hl`}><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
      </defs>
      {leaf && <ShisoLeaf x={r * 0.5} y={r * 0.3} s={k * 0.8} rot={-4} />}
      {stems && [-0.36, 0.36].map((dy) => (
        <g key={dy} stroke={INK} strokeLinecap="round">
          <line x1={-r * 0.6} y1={dy * r} x2={-r * 0.8} y2={dy * r} stroke="#7a5428" strokeWidth={3.4 * k} />
          <circle cx={-r * 0.84} cy={dy * r} r={3 * k} fill="#9a7440" strokeWidth={1.4 * k} />
        </g>
      ))}
      <ellipse cx={r * 0.08} cy={r * 0.86} rx={r * 0.9} ry={r * 0.16} fill="#5c1030" opacity=".22" />
      <path d={plumPath(r)} fill={`url(#${uid}-body)`} stroke={INK} strokeWidth={3.4 * k} strokeLinejoin="round" />
      <g transform={`scale(${k})`} fill="none" strokeLinecap="round">
        <path d={WRINKLES} stroke="#5c1030" strokeWidth="3" opacity=".65" />
        <path d={WRINKLES} stroke="#ff9fb8" strokeWidth="1.6" opacity=".5" transform="translate(1 -2.5)" />
        <ellipse cx="-16" cy="-22" rx="17" ry="8" fill={`url(#${uid}-hl)`} transform="rotate(-18 -16 -22)" />
        <circle cx="-24" cy="-26" r="3.4" fill="#fff" />
      </g>
    </g>
  );
}

export function ShisoLeaf({ x = 0, y = 0, s = 1, rot = -12 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0,0 C18,-30 64,-32 86,-2 C64,28 18,30 0,0Z" fill="#5fb548" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M4,0 L80,-2 M26,0 L36,-12 M26,0 L36,12 M46,-1 L56,-11 M46,-1 L56,9 M64,-1 L70,-8 M64,-1 L70,6" fill="none" stroke="#2f6b22" strokeWidth="2" strokeLinecap="round" />
      <path d="M8,-4 C24,-22 56,-24 74,-8" fill="none" stroke="#b6f09a" strokeWidth="2" opacity=".7" />
    </g>
  );
}

// the pink ring umeboshi leave on rice (ref 03); `gone` = the plum was lifted: a wetter, darker print
export function UmeStain({ r = 50, gone = false }) {
  return (
    <g>
      <ellipse rx={r * 1.25} ry={r * 1.08} fill="#f7c3cc" opacity={gone ? 0.75 : 0.55} />
      {gone && <path d={plumPath(r * 0.92, 5)} fill="#e992a4" opacity=".75" />}
      {gone && <path d={plumPath(r * 0.6, 7)} fill="#d8687f" opacity=".45" />}
    </g>
  );
}

// ---------- tamagoyaki ----------
// superellipse spiral from the crust into the core: the rolled layers of ref 02, one continuous line
const spow = (v, p) => Math.sign(v) * Math.abs(v) ** p;
export function swirlPath(w, h, turns = 2.9, a0 = 2.3, p = 0.72) {
  const n = Math.round(turns * 60), pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = a0 + t * turns * Math.PI * 2, k = 0.9 - t * 0.8;
    pts.push(`${(w / 2 * k * spow(Math.cos(a), p)).toFixed(1)},${(h / 2 * k * spow(Math.sin(a), p)).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}

// A slice standing on its side, cut face up (top-down box view). depth = the visible side band under the face.
export function TamaSlice({ w = 144, h = 124, depth = 14, uid = 't', notch = true }) {
  const x = -w / 2, y = -h / 2, rx = Math.min(w, h) * 0.26;
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-face`} cx=".45" cy=".42" r=".7">
          <stop offset="0" stopColor="#fff6b8" /><stop offset=".55" stopColor="#ffe06a" /><stop offset="1" stopColor="#f2bf3a" />
        </radialGradient>
      </defs>
      <rect x={x + 3} y={y + depth + 6} width={w} height={h} rx={rx} fill="#5a2a3a" opacity=".22" />
      <rect x={x} y={y + depth} width={w} height={h} rx={rx} fill="#dd9c26" stroke={INK} strokeWidth="3.4" />
      {[0.3, 0.55, 0.8].map((u) => <ellipse key={u} cx={x + w * u} cy={y + h + depth * 0.55} rx={w * 0.07} ry={depth * 0.28} fill="#a9661a" opacity=".55" />)}
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#${uid}-face)`} stroke={INK} strokeWidth="3.4" />
      <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx={rx * 0.8} fill="none" stroke="#e9ab2e" strokeWidth="5" opacity=".75" />
      <path d={swirlPath(w - 16, h - 16)} fill="none" stroke="#cc8a24" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity=".8" />
      <path d={swirlPath(w - 16, h - 16)} fill="none" stroke="#fff4bc" strokeWidth="1.4" strokeLinecap="round" transform="translate(-1.4 -1.6)" opacity=".8" />
      {[[-0.28, -0.3], [0.22, 0.28], [0.3, -0.18]].map(([u, v], i) => <rect key={i} x={w * u} y={h * v} width="7" height="3.4" rx="1.6" fill="#fffbe6" transform={`rotate(${i * 50 - 30} ${w * u} ${h * v})`} />)}
      {[[-0.34, -0.42, 16], [0.36, 0.4, 13], [0.42, -0.36, 10]].map(([u, v, r], i) => <ellipse key={i} cx={w * u} cy={h * v} rx={r} ry={r * 0.5} fill="#d88c1e" opacity=".32" />)}
      <path d={`M${x + 16},${y + 12} Q${x + w * 0.3},${y + 4} ${x + w * 0.5},${y + 8}`} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".7" />
      {notch && <path d={`M-8,${y + 1.7} A8,6 0 0 0 8,${y + 1.7}Z`} fill="#d9961f" opacity=".85" />}
    </g>
  );
}

// The uncut rest of the roll, lying behind the slices: seared top, layer lines along its length (refs 01 + 10).
export function TamaLog({ w = 300, h = 96, uid = 'tl' }) {
  const x = -w / 2, y = -h / 2;
  return (
    <g>
      <defs><linearGradient id={`${uid}-g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe680" /><stop offset=".6" stopColor="#ffd445" /><stop offset="1" stopColor="#eeb431" /></linearGradient></defs>
      <rect x={x} y={y} width={w} height={h} rx="26" fill={`url(#${uid}-g)`} stroke={INK} strokeWidth="3.4" />
      {[0.3, 0.52, 0.74].map((v) => <path key={v} d={`M${x + 14},${y + h * v} C${x + w * 0.3},${y + h * v - 5} ${x + w * 0.7},${y + h * v + 5} ${x + w - 14},${y + h * v}`} fill="none" stroke="#e2a42a" strokeWidth="2.6" opacity=".6" />)}
      {[[0.2, 0.36, 26], [0.5, 0.6, 20], [0.78, 0.4, 22]].map(([u, v, r], i) => <ellipse key={i} cx={x + w * u} cy={y + h * v} rx={r} ry={r * 0.3} fill="#c98a2a" opacity=".35" />)}
      <rect x={x + 18} y={y + 8} width={w * 0.55} height="8" rx="4" fill="#fff6c4" opacity=".75" />
    </g>
  );
}

// The lifted piece in 3/4: cut face (swirl) toward us, seared top, right side with the nori band + sesame pins.
export function TamaBlock({ w = 300, h = 250, dx = 92, dy = -64, uid = 'tb' }) {
  const x = -w / 2, y = -h / 2, rx = 44;
  const top = `M${x + rx * 0.6},${y} L${x + dx + rx * 0.6},${y + dy} L${x + w + dx - rx * 0.4},${y + dy} Q${x + w + dx},${y + dy} ${x + w + dx},${y + dy + rx * 0.5} L${x + w},${y + rx * 0.5} Q${x + w},${y} ${x + w - rx * 0.6},${y}Z`;
  const side = `M${x + w},${y + rx * 0.4} L${x + w + dx},${y + dy + rx * 0.4} L${x + w + dx},${y + h + dy - rx * 0.6} Q${x + w + dx},${y + h + dy} ${x + w + dx - 10},${y + h + dy + 4} L${x + w - rx * 0.5},${y + h} Q${x + w},${y + h} ${x + w},${y + h - rx * 0.5}Z`;
  // nori band across the side face, a parallelogram 30 % in
  const bx = (u) => x + w + dx * u, by = (u) => y + dy * u;
  const band = `M${bx(0.34)},${by(0.34) + 6} L${bx(0.62)},${by(0.62) + 6} L${bx(0.62)},${by(0.62) + h - 8} L${bx(0.34)},${by(0.34) + h - 8}Z`;
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-face`} cx=".42" cy=".4" r=".72">
          <stop offset="0" stopColor="#fff8c4" /><stop offset=".5" stopColor="#ffe070" /><stop offset="1" stopColor="#efb834" />
        </radialGradient>
        <linearGradient id={`${uid}-top`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ffe27a" /><stop offset="1" stopColor="#f6c648" /></linearGradient>
      </defs>
      <path d={side} fill="#e9ad33" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      {[0.22, 0.42, 0.62, 0.8].map((v) => <path key={v} d={`M${x + w + 6},${y + h * v} L${x + w + dx - 6},${y + dy + h * v}`} stroke="#c98a22" strokeWidth="3" opacity=".6" />)}
      <path d={band} fill="#1f2a1c" stroke={INK} strokeWidth="3" />
      {/* text runs down the band; glyph "up" = the depth axis, so the stamp lies flat on the side face */}
      <text transform={`matrix(0 1 ${-dx / Math.hypot(dx, dy)} ${-dy / Math.hypot(dx, dy)} ${bx(0.48) - 7} ${by(0.48) + h * 0.5})`} textAnchor="middle"
        fontFamily="var(--cond, sans-serif)" fontWeight="800" fontSize="19" letterSpacing="2" fill="#fff4c8">SN74181</text>
      {Array.from({ length: 6 }, (_, i) => { const u = 0.1 + i * 0.16; return <ellipse key={i} cx={x + w + dx * u + 2} cy={y + h + dy * u - 6} rx="6" ry="3" fill="#2a2226" transform={`rotate(${Math.atan2(dy, dx) * 180 / Math.PI} ${x + w + dx * u + 2} ${y + h + dy * u - 6})`} />; })}
      <path d={top} fill={`url(#${uid}-top)`} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      {[[0.26, 0.45, 46], [0.6, 0.55, 38], [0.82, 0.3, 26], [0.42, 0.78, 30]].map(([u, v, r], i) => (
        <ellipse key={i} cx={x + w * u + dx * v} cy={y + dy * v} rx={r} ry={r * 0.18} fill={i % 2 ? '#d49530' : '#c4862c'} opacity=".4" transform={`rotate(-10 ${x + w * u + dx * v} ${y + dy * v})`} />
      ))}
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#${uid}-face)`} stroke={INK} strokeWidth="5" />
      <rect x={x + 9} y={y + 9} width={w - 18} height={h - 18} rx={rx * 0.8} fill="none" stroke="#e5a52c" strokeWidth="9" opacity=".7" />
      <path d={swirlPath(w - 30, h - 30, 3.2)} fill="none" stroke="#c07c1a" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
      <path d={swirlPath(w - 30, h - 30, 3.2)} fill="none" stroke="#fff4bc" strokeWidth="2.2" strokeLinecap="round" transform="translate(-2.4 -2.8)" opacity=".8" />
      {[[-0.3, -0.26], [0.2, 0.3], [0.32, -0.2], [-0.18, 0.34]].map(([u, v], i) => <rect key={i} x={w * u} y={h * v} width="12" height="5" rx="2.5" fill="#fffbe6" transform={`rotate(${i * 50 - 30} ${w * u} ${h * v})`} />)}
      <path d={`M-14,${y + 2.5} A14,10 0 0 0 14,${y + 2.5}Z`} fill="#d9961f" opacity=".85" />
      <path d={`M${x + 26},${y + 20} Q${x + w * 0.3},${y + 8} ${x + w * 0.52},${y + 14}`} fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity=".75" />
    </g>
  );
}

// ---------- chopsticks + glints ----------
// One stick, from `from` (the thick end, may be off-canvas) to `to` (the tip). Pink lacquer, bare wood tip (hers).
export function Chopstick({ from, to, w0 = 40, w1 = 13 }) {
  const [x0, y0] = from, [x1, y1] = to;
  const L = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
  const lac = L * 0.7;
  const wAt = (d) => w0 + (w1 - w0) * (d / L);
  const quad = (d0, d1) => `M${d0},${-wAt(d0) / 2} L${d1},${-wAt(d1) / 2} L${d1},${wAt(d1) / 2} L${d0},${wAt(d0) / 2}Z`;
  return (
    <g transform={`translate(${x0} ${y0}) rotate(${a})`}>
      <path d={quad(0, lac)} fill="#e8739f" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d={`M0,${-w0 / 2 + 5} L${lac},${-wAt(lac) / 2 + 3}`} stroke="#ffc2d8" strokeWidth="4" />
      {[0.12, 0.2].map((u) => <circle key={u} cx={L * u} cy="0" r={wAt(L * u) * 0.22} fill="#fff0f6" />)}
      <path d={quad(lac, L - 2)} fill="#f2dcbc" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x={lac - 4} y={-wAt(lac) / 2 - 1} width="8" height={wAt(lac) + 2} fill="#d6a93f" stroke={INK} strokeWidth="2" />
    </g>
  );
}

// H1 (SLOP 10-01): the sticks are never held by nobody. YOUR right hand (5 fingers OK: it is the MC's, never Nanda's,
// whose hands are pins) grips her pink chopsticks: both sticks run under the hand and out past the curled index +
// middle, the thumb pad presses the upper stick, the forearm + the MC's green knit sleeve run off the frame edge.
// <HeldChopsticks tips={[[x, y] lower, [x, y] upper]} grip={[x, y]} s> : the sticks' back ends converge in the hand at
// `grip`; the hand is aimed at the tips. The thumb stays on the screen-top side whichever way the sticks point.
const HS = { skin: '#fcd8c4', skinLo: '#e8b39b', line: '#7a4a3a', knit: '#3d6b4a', knitLo: '#2a4a34', knitHi: '#5a8a64' };
function ChopHand() {
  const ol = { stroke: HS.line, strokeWidth: 4, strokeLinejoin: 'round', strokeLinecap: 'round' };
  const finger = (d, w) => (
    <g><path d={d} fill="none" stroke={HS.line} strokeWidth={w + 8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={HS.skin} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" /></g>
  );
  return (
    <g>
      {/* forearm + knit sleeve, off the frame edge: bent 22 deg down at the wrist (the sticks are not in line with the arm) */}
      <g transform="rotate(-22 -40 0)">
        <path d="M-40 -56 L-900 -110 L-900 120 L-40 60 Z" fill={HS.skin} {...ol} />
        <path d="M-120 -78 L-1000 -150 L-1000 170 L-120 86 Z" fill={HS.knit} stroke={HS.knitLo} strokeWidth="6" strokeLinejoin="round" />
        {[-150, -190, -230].map((x) => <path key={x} d={`M${x} ${-80 - (x + 120) * 0.08} L${x} ${88 - (x + 120) * 0.09}`} stroke={HS.knitLo} strokeWidth="6" />)}
        <path d="M-160 -60 L-900 -120" stroke={HS.knitHi} strokeWidth="10" strokeLinecap="round" opacity=".7" />
      </g>
      {/* ring + pinky, curled under (drawn first: behind the palm) */}
      {finger('M70 34 C110 40 122 58 104 74', 26)}
      {finger('M54 52 C88 62 96 78 80 90', 22)}
      {/* the back of the hand */}
      <path d="M-50 -54 C0 -70 70 -64 104 -40 C118 -10 112 30 90 52 C40 70 -10 66 -50 56 Z" fill={HS.skin} {...ol} />
      <path d="M-10 -50 C30 -60 70 -54 92 -38" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity=".45" />
      <path d="M-30 46 C20 58 60 52 86 40" fill="none" stroke={HS.skinLo} strokeWidth="10" strokeLinecap="round" opacity=".8" />
      {/* middle finger: under the lower stick, tip up against it */}
      {finger('M96 12 C140 14 168 22 176 40', 28)}
      {/* index: curled over the upper stick */}
      {finger('M100 -24 C150 -30 184 -26 196 -6', 30)}
      {/* thumb: along the top, its pad pressing the upper stick */}
      {finger('M-20 -58 C40 -86 120 -76 168 -50', 32)}
      {/* nails: the thumb, index + middle tips (MC's: plain, unpainted) */}
      {[[160, -52, 8], [190, -10, 40], [170, 34, 60]].map(([x, y, r]) => <ellipse key={x} cx={x} cy={y} rx="9" ry="7" transform={`rotate(${r} ${x} ${y})`} fill="#ffe8e0" stroke={HS.line} strokeWidth="2.5" />)}
      {[[118, -22], [114, 16]].map(([x, y]) => <path key={x + y} d={`M${x} ${y - 9} q5 9 0 18`} stroke={HS.skinLo} strokeWidth="3.5" fill="none" strokeLinecap="round" />)}
    </g>
  );
}

// children = the held piece: drawn between the lower stick (its tip under the piece) and the upper one (on top of it);
// behind = both sticks pinch it from behind (a big piece seen from the eater's side: no stick crosses its face).
export function HeldChopsticks({ tips, grip, s = 1, w0 = 40, w1 = 13, behind = false, children }) {
  const [gx, gy] = grip;
  const mx = (tips[0][0] + tips[1][0]) / 2, my = (tips[0][1] + tips[1][1]) / 2;
  const a = Math.atan2(my - gy, mx - gx), deg = a * 180 / Math.PI;
  const flip = Math.cos(a) < 0 ? -1 : 1;                                         // keep the thumb on the screen-top side
  const ux = Math.cos(a), uy = Math.sin(a), nx = -uy * flip, ny = ux * flip;    // n = toward the lower stick
  const back = (k) => [gx - ux * 150 * s + nx * k * s, gy - uy * 150 * s + ny * k * s];   // the thick ends, hidden in the palm
  return (
    <g className="sa-held-sticks">
      <Chopstick from={back(14)} to={tips[0]} w0={w0} w1={w1} />
      {behind && <Chopstick from={back(-30)} to={tips[1]} w0={w0} w1={w1} />}
      {children}
      {!behind && <Chopstick from={back(-30)} to={tips[1]} w0={w0} w1={w1} />}
      <g transform={`translate(${gx} ${gy}) rotate(${deg}) scale(${s} ${s * flip})`}><ChopHand /></g>
    </g>
  );
}

const STAR = 'M0 -1L.2 -.2L1 0L.2 .2L0 1L-.2 .2L-1 0L-.2 -.2Z';
export const Glint = ({ x, y, s = 14, op = 0.9 }) => <path d={STAR} transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={op} />;
