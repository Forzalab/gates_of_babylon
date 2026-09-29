// Scene 10, GENKAN ARRIVAL (art id 'genkan-in'). Night, just in from the rain: we stand in her doorway looking IN.
//   BG   = slate tataki, the raised wood step (agari-kamachi) with its lip, a landing, then a hallway that falls into
//          the dark toward a shoji at the end. Shoe cabinet on the right wall, umbrella stand + empty coat pegs on the
//          left. One paper pendant is the only light. Her shoes: 4 pairs, heels to the step, toes on a tape line.
//   PROP = men's slippers set out on the step, facing the door (for you), and a tiny floor shrine at the cabinet end.
// The shrine frames a logic circuit. PLACEHOLDER: a fixed A,B -> NAND -> OUT. Later = the player's last Logic-mode circuit.
// props.insert: false (wide) | true (camera crops in on slippers + shrine; smooth 1.4 s, reduced motion = hard cut).
//
// Geometry is a real one-point perspective: every point goes through P(x, y, z) (metres, x right, y up, z into the
// house, z = 0 at the door). All receding edges therefore meet at VP. Main's BG-D3 (Genkan.jsx) can reuse ROOM +
// PAL for the reverse shot (see research/merge/GENKAN-V2-NOTES.md).
import './alt.css';

// ---- camera + room (metres). Keep in sync with GENKAN-V2-NOTES.md -------------------------------------------------
export const VP = { x: 960, y: 400 };            // vanishing point on the 1920x1080 stage (shift lens: horizon above centre)
export const F = 760;                            // focal length, px per metre at 1 m depth
export const CAM = { x: 0, y: 1.3, z: -0.5 };    // eye: in the doorway, 0.5 m outside the door plane
export const ROOM = {
  W: 1.45,            // half-width of genkan + landing (room is 2.9 m wide)
  STEP_Z: 2.0,        // depth of the step edge (tataki runs z 0..2)
  STEP_H: 0.18,       // step height
  LIP: 0.035,         // kamachi lip board thickness
  CEIL: 2.4,          // ceiling height
  WALL_Z: 3.9,        // wall across the landing with the hall opening
  HALL_W: 0.8,        // half-width of the hallway
  HALL_H: 2.1,        // hall opening header height
  HALL_END: 8.5,      // end wall (shoji)
  CAB: { x0: 1.05, z0: 0.3, z1: 2.0, h: 0.9 },   // shoe cabinet on the right wall, on the tataki
  LAMP: { x: 0, y: 1.9, z: 1.6, r: 0.2 },         // paper pendant, the only light
  TAPE_Z: 1.72,       // her tape line (toe line of her shoes)
  DOOR: { x0: -0.45, x1: 0.45, h: 2.0 },          // front door in the z = 0 plane (behind this camera; for the reverse shot)
  SLIPPERS: { x: [0.3, 0.46], z: 2.2 },           // slipper centres on the step (main's "empty spot")
};
export const PAL = {
  plaster: '#bea37e', plasterDim: '#6a5a45', plasterDark: '#4e4234',
  ceil: '#c2aa86', ceilDark: '#5e4f3e',
  wood: '#c38f58', woodFar: '#7c5836', grain: '#9c7146', lip: '#7a5230', lipEdge: '#e8bb7e',
  slate: '#45474c', slateJoint: '#2b2c30', slateSheen: '#565960',
  cab: '#a77d4d', cabTop: '#cf9f66', cabSeam: '#6f4e2e', trim: '#4a3322',
  shoji: '#3b3c44', lattice: '#17141a', dark: '#07060a',
  lampHot: '#fff4d8', lampEdge: '#f0c47e', glow: '#ffd79a',
  her: '#f0243f', pink: '#ff5fa2',
  slipBody: '#4a5f86', slipToe: '#33466a', slipLine: '#22304a',
};

const { W, STEP_Z, STEP_H, LIP, CEIL, WALL_Z, HALL_W, HALL_H, HALL_END, CAB, LAMP, TAPE_Z } = ROOM;

// ---- projection helpers ------------------------------------------------------------------------------------------
const P = (x, y, z) => { const d = z - CAM.z; return [VP.x + (F * (x - CAM.x)) / d, VP.y - (F * (y - CAM.y)) / d]; };
const S = (z) => F / (z - CAM.z);                 // px per metre at depth z (for frontal elevations)
const f1 = (n) => Math.round(n * 10) / 10;
const pt = (p) => `${f1(p[0])} ${f1(p[1])}`;
const path2 = (pts2) => `M${pts2.map(pt).join('L')}Z`;
const poly = (pts3) => path2(pts3.map((p) => P(...p)));
const line = (a, b) => `M${pt(P(...a))}L${pt(P(...b))}`;

// 2D convex hull (monotone chain), used to give shoes a solid silhouette.
function hull(ps) {
  const p = [...ps].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length > 1 && cr(lo.at(-2), lo.at(-1), q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length > 1 && cr(up.at(-2), up.at(-1), q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

// Footprint of a shoe/slipper (toe toward the door = -z). Returns [x, z, t] with t in -1 (toe) .. 1 (heel).
function footprint(cx, cz, w, l, taper = 0.35, n = 28) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    const t = Math.sign(s) * Math.abs(s) ** 0.8;
    const k = t < 0 ? 1 - taper * t * t : 1 - 0.12 * t * t;
    return [cx + Math.sign(c) * Math.abs(c) ** 0.7 * (w / 2) * k, cz + t * (l / 2), t];
  });
}

// Soft contact shadow: the footprint grown a little and pushed away from the lamp.
function contact(fp, y, grow = 1.18, push = 0.05) {
  const cx = fp.reduce((s, p) => s + p[0], 0) / fp.length, cz = fp.reduce((s, p) => s + p[1], 0) / fp.length;
  const dx = cx - LAMP.x, dz = cz - LAMP.z, m = Math.hypot(dx, dz) || 1;
  return poly(fp.map(([x, z]) => [cx + (x - cx) * grow + (dx / m) * push, y, cz + (z - cz) * grow + (dz / m) * push]));
}

// One shoe on the tataki. kind: pump | flat | sneaker | loafer.
const SHOE_KIND = {
  pump: { hT: 0.035, hH: 0.075, open: 0.62, ow: 0.7 },
  flat: { hT: 0.03, hH: 0.05, open: 0.58, ow: 0.72 },
  sneaker: { hT: 0.05, hH: 0.085, open: 0.34, ow: 0.62 },
  loafer: { hT: 0.04, hH: 0.065, open: 0.46, ow: 0.7 },
};
function Shoe({ x, z, kind, fill, side, y = 0, w = 0.09, l = 0.24 }) {
  const k = SHOE_KIND[kind];
  const fp = footprint(x, z, w, l);
  const hAt = (t) => k.hT + (k.hH - k.hT) * (t + 1) / 2;
  const sole = fp.map(([px, pz]) => P(px, y, pz));
  const top = fp.map(([px, pz, t]) => P(px, y + hAt(t), pz));
  const ocz = z + l / 2 - (k.open * l) / 2 - 0.012;
  const opening = footprint(x, ocz, w * k.ow, k.open * l, 0.2, 20).map(([px, pz, t]) => P(px, y + hAt(0.5 + t * 0.4) + 0.002, pz));
  return (
    <g>
      <path d={contact(fp, y)} fill="#000" opacity=".55" filter="url(#gk-soft)" />
      <path d={path2(hull([...sole, ...top]))} fill={side} stroke="#141013" strokeWidth="1.4" strokeLinejoin="round" />
      <path d={path2(top)} fill={fill} />
      <path d={path2(opening)} fill="#120e10" />
      {kind === 'sneaker' && [0.2, 0.3, 0.4].map((d) => (
        <path key={d} d={line([x - w * 0.18, y + hAt(-0.2) + 0.003, z - l / 2 + l * d + 0.04], [x + w * 0.18, y + hAt(-0.2) + 0.003, z - l / 2 + l * d + 0.04])} stroke="#b9b2a6" strokeWidth="1.6" />
      ))}
      {kind === 'loafer' && <path d={line([x - w * 0.36, y + hAt(-0.3), z - 0.02], [x + w * 0.36, y + hAt(-0.3), z - 0.02])} stroke="#1a2a44" strokeWidth="2.4" />}
      {kind === 'pump' && <path d={path2(footprint(x, z - l * 0.36, w * 0.28, l * 0.1, 0, 12).map(([px, pz]) => P(px, y + hAt(-0.7) + 0.003, pz)))} fill="#5a4f5e" />}
    </g>
  );
}

// Men's slipper on the step, toe toward the door. Body #4a5f86, toe cover #33466a, outline #22304a.
function Slipper({ x, z, y = STEP_H, w = 0.115, l = 0.285 }) {
  const fp = footprint(x, z, w, l, 0.08);
  const sole = fp.map(([px, pz]) => P(px, y, pz));
  const bed = fp.map(([px, pz]) => P(px, y + 0.022, pz));
  // toe cover: the front 45 % of the outline, arched up to 5 cm at the throat (a U over the foot)
  const TH = -0.2, hMax = 0.04, yb = y + 0.022;
  const front = fp.filter((p) => p[2] < TH).sort((p, q) => Math.atan2(p[1] - z, p[0] - x) - Math.atan2(q[1] - z, q[0] - x));
  const zT = z + TH * (l / 2);
  const ends = [front[0], front.at(-1)].sort((p, q) => p[0] - q[0]);
  const [L, R] = ends.map(([px, pz]) => P(px, yb, pz));
  const arch = P(x, yb + 2 * hMax, zT);                   // quadratic control: the curve peaks at hMax
  const bedBehind = P(x, yb, zT + 0.05);
  const edge = front.map(([px, pz]) => P(px, yb, pz));
  const toeFirst = edge[0][0] < edge.at(-1)[0] ? edge : [...edge].reverse();   // left end -> around the toe -> right end
  return (
    <g>
      <path d={contact(fp, y, 1.15, 0.03)} fill="#000" opacity=".5" filter="url(#gk-soft)" />
      <path d={path2(hull([...sole, ...bed]))} fill={PAL.slipLine} />
      <path d={path2(bed)} fill={PAL.slipBody} stroke={PAL.slipLine} strokeWidth="1.2" />
      <path d={path2(footprint(x, z + l * 0.12, w * 0.7, l * 0.66, 0.08, 20).map(([px, pz]) => P(px, yb + 0.001, pz)))} fill="#566c95" />
      <path d={`M${pt(L)}Q${pt(arch)} ${pt(R)}Q${pt(bedBehind)} ${pt(L)}Z`} fill="#161e30" />
      <path d={`M${toeFirst.map(pt).join('L')}Q${pt(arch)} ${pt(toeFirst[0])}Z`} fill={PAL.slipToe} stroke={PAL.slipLine} strokeWidth="1.2" strokeLinejoin="round" />
      <path d={`M${pt(L)}Q${pt(arch)} ${pt(R)}`} fill="none" stroke="#6b82ad" strokeWidth="1.3" />
    </g>
  );
}

function Circuit() {
  return (
    <g stroke="#2a2330" strokeWidth="5" fill="none">
      <path d="M10 30 H52 M10 70 H52" />
      <path d="M52 14 H82 A36 36 0 0 1 82 86 H52Z" fill="#fff8ea" />
      <circle cx="124" cy="50" r="6" fill="#fff8ea" />
      <path d="M130 50 H160" />
      <circle cx="10" cy="30" r="7" fill={PAL.pink} stroke="none" /><circle cx="10" cy="70" r="7" fill={PAL.pink} stroke="none" />
      <circle cx="162" cy="50" r="9" fill={PAL.her} stroke="none" />
    </g>
  );
}

// Tiny floor shrine (hokora) on the landing, just past the cabinet end, facing the door.
const SHR = { x0: 0.64, x1: 1.0, z0: 2.2, z1: 2.44, body: 0.3, roof: 0.13 };
function Shrine() {
  const y0 = STEP_H, { x0, x1, z0, z1 } = SHR, xm = (x0 + x1) / 2;
  const yb = y0 + 0.035 + SHR.body, yr = yb + SHR.roof, ov = 0.035;
  const s = S(z0) / 100;                          // front elevation drawn in centimetres
  const [ox, oy] = P(x0, y0, z0);
  const shadow = poly([[x0 - 0.04, y0, z0 - 0.02], [x1 + 0.05, y0, z0 - 0.01], [x1 + 0.07, y0, z1 + 0.09], [x0 - 0.02, y0, z1 + 0.08]]);
  return (
    <g className="gk-shrine">
      <path d={shadow} fill="#000" opacity=".55" filter="url(#gk-soft)" />
      {/* plinth + body, left side face (we see it: the shrine sits right of the VP) */}
      <path d={poly([[x0 - 0.02, y0, z0], [x0 - 0.02, y0, z1], [x0 - 0.02, y0 + 0.035, z1], [x0 - 0.02, y0 + 0.035, z0]])} fill="#2e2a28" />
      <path d={poly([[x0 + 0.02, y0 + 0.035, z0], [x0 + 0.02, y0 + 0.035, z1], [x0 + 0.02, yb, z1], [x0 + 0.02, yb, z0]])} fill="#8e6a44" />
      <path d={poly([[x0 - 0.02, y0 + 0.035, z0], [x1 + 0.02, y0 + 0.035, z0], [x1 + 0.02, y0 + 0.035, z1], [x0 - 0.02, y0 + 0.035, z1]])} fill="#6d6763" />
      {/* roof: both slopes are seen from above, the right one turns away from the lamp */}
      <path d={poly([[xm, yr, z0], [xm, yr, z1 + ov], [x1 + ov, yb, z1 + ov], [x1 + ov, yb, z0]])} fill="#241812" />
      <path d={poly([[xm, yr, z0], [xm, yr, z1 + ov], [x0 - ov, yb, z1 + ov], [x0 - ov, yb, z0]])} fill="#3e2c20" />
      <path d={line([xm, yr + 0.004, z0], [xm, yr + 0.004, z1 + ov])} stroke="#1a110b" strokeWidth="2.2" />
      {/* front elevation (cm, y up is negative) */}
      <g transform={`translate(${f1(ox)} ${f1(oy)}) scale(${s.toFixed(4)})`}>
        <rect x="-2" y="-3.5" width="40" height="3.5" fill="#57524e" />
        <rect x="2" y="-33.5" width="32" height="30" fill="#c99f6a" stroke="#5e4029" strokeWidth=".8" />
        <rect x="5" y="-29.5" width="26" height="21" fill="#fbf4e6" stroke="#7a5a3a" strokeWidth=".7" />
        <g transform="translate(6.2 -27.6) scale(.137)"><Circuit /></g>
        <path d={`M-${ov * 100} -33.5 L18 -${33.5 + SHR.roof * 100} L${36 + ov * 100} -33.5Z`} fill="#b48755" />
        <path d={`M-${ov * 100} -33.5 L18 -${33.5 + SHR.roof * 100} L${36 + ov * 100} -33.5`} fill="none" stroke="#2c1c10" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="18" cy={-33.5 - SHR.roof * 45} r="1.6" fill="#d9b25c" stroke="#6b4a2a" strokeWidth=".4" />
        <rect x={-ov * 100} y="-34.6" width={36 + ov * 200} height="1.8" fill="#2c1c10" />
        {/* shimenawa rope + two paper shide */}
        <path d="M3 -31.8 Q18 -28.6 33 -31.8" stroke="#e6d6a8" strokeWidth="1.3" fill="none" />
        <path d="M9 -30.8 l1.6 2.4 l-1.6 1.6 l1.6 2.4" stroke="#fff" strokeWidth=".9" fill="none" />
        <path d="M27 -30.8 l-1.6 2.4 l1.6 1.6 l-1.6 2.4" stroke="#fff" strokeWidth=".9" fill="none" />
        {/* two offering cups on the plinth */}
        <rect x="6" y="-6.5" width="3.4" height="3" rx=".6" fill="#f4efe6" /><rect x="26.6" y="-6.5" width="3.4" height="3" rx=".6" fill="#f4efe6" />
      </g>
    </g>
  );
}

// Sizes on the tataki: 4 pairs, pitch 0.33 m, heels 3 cm off the riser, toes exactly on the tape.
const PAIRS = [
  { kind: 'pump', fill: '#2a2530', side: '#141116' },
  { kind: 'flat', fill: '#b3163f', side: '#6e0d27' },
  { kind: 'sneaker', fill: '#f2ece0', side: '#bdb5a6' },
  { kind: 'loafer', fill: '#3f5f8f', side: '#233955' },
];
const PAIR_X0 = -0.72, PAIR_PITCH = 0.33, SHOE_L = 0.24, SHOE_GAP = 0.055;

function Wood() {
  // landing floor (z STEP_Z..WALL_Z, full width) + hall floor; planks run into the house (lines through the VP)
  const planks = [];
  for (let x = -W + 0.15; x < W; x += 0.15) planks.push(<path key={`p${f1(x)}`} d={line([x, STEP_H, STEP_Z], [x, STEP_H, WALL_Z])} />);
  const joints = [];
  for (let i = 0; i < 19; i++) {
    const x = -W + 0.15 * i, zj = STEP_Z + 0.35 + ((i * 0.83) % 1.4);
    if (zj < WALL_Z) joints.push(<path key={`j${i}`} d={line([x, STEP_H, zj], [x + 0.15, STEP_H, zj])} />);
  }
  return (
    <g>
      <path d={poly([[-W, STEP_H, STEP_Z], [W, STEP_H, STEP_Z], [W, STEP_H, WALL_Z], [-W, STEP_H, WALL_Z]])} fill="url(#gk-wood)" />
      <g stroke={PAL.grain} strokeWidth="1.5" opacity=".75">{planks}{joints}</g>
    </g>
  );
}

function Tataki() {
  const T = 0.6, joints = [];
  for (let x = -W + 0.25; x < W; x += T) joints.push(<path key={`x${f1(x)}`} d={line([x, 0, 0], [x, 0, STEP_Z])} />);
  for (let z = 0.2; z < STEP_Z; z += T) joints.push(<path key={`z${f1(z)}`} d={line([-W, 0, z], [W, 0, z])} />);
  return (
    <g>
      <path d={poly([[-W, 0, 0], [W, 0, 0], [W, 0, STEP_Z], [-W, 0, STEP_Z]])} fill={PAL.slate} />
      {/* faint cleft texture in the slate: a few irregular lighter patches */}
      {[[-0.9, 1.2, 0.24], [0.1, 0.8, 0.3], [0.6, 1.6, 0.2], [-0.3, 1.9, 0.16]].map(([x, z, r]) => (
        <path key={`${x}${z}`} d={poly([[x - r, 0, z - r * 0.4], [x + r * 0.6, 0, z - r * 0.5], [x + r, 0, z + r * 0.3], [x - r * 0.4, 0, z + r * 0.5]])} fill={PAL.slateSheen} opacity=".35" />
      ))}
      <g stroke={PAL.slateJoint} strokeWidth="3">{joints}</g>
    </g>
  );
}

function Hall() {
  const hw = HALL_W, hz = HALL_END;
  const door = (sx, z0, z1, id) => (
    <g key={id}>
      <path d={poly([[sx, STEP_H, z0], [sx, 2.0, z0], [sx, 2.0, z1], [sx, STEP_H, z1]])} fill="#2a1f17" />
      <path d={poly([[sx, STEP_H, z0 + 0.05], [sx, 1.95, z0 + 0.05], [sx, 1.95, z1 - 0.05], [sx, STEP_H, z1 - 0.05]])} fill="#3a2b20" />
      <circle cx={P(sx, 1.0, sx < 0 ? z1 - 0.1 : z0 + 0.1)[0]} cy={P(sx, 1.0, z1 - 0.1)[1]} r="3" fill="#6b5a44" />
    </g>
  );
  return (
    <g>
      <path d={poly([[-hw, CEIL, WALL_Z], [hw, CEIL, WALL_Z], [hw, CEIL, hz], [-hw, CEIL, hz]])} fill="#4a3e31" />
      <path d={poly([[-hw, STEP_H, WALL_Z], [-hw, CEIL, WALL_Z], [-hw, CEIL, hz], [-hw, STEP_H, hz]])} fill="url(#gk-hallL)" />
      <path d={poly([[hw, STEP_H, WALL_Z], [hw, CEIL, WALL_Z], [hw, CEIL, hz], [hw, STEP_H, hz]])} fill="url(#gk-hallR)" />
      {/* hall floor: same planks, running on into the dark */}
      <path d={poly([[-hw, STEP_H, WALL_Z], [hw, STEP_H, WALL_Z], [hw, STEP_H, hz], [-hw, STEP_H, hz]])} fill={PAL.woodFar} />
      <g stroke={PAL.grain} strokeWidth="1.5" opacity=".6">
        {Array.from({ length: 10 }, (_, i) => -hw + 0.15 * (i + 1)).map((x) => <path key={x} d={line([x, STEP_H, WALL_Z], [x, STEP_H, hz])} />)}
      </g>
      {door(-hw, 5.0, 5.8, 'dl')}
      {door(hw, 6.3, 7.1, 'dr')}
      {/* skirting boards, receding */}
      <path d={line([-hw, STEP_H + 0.06, WALL_Z], [-hw, STEP_H + 0.06, hz])} stroke="#2a1f17" strokeWidth="3" />
      <path d={line([hw, STEP_H + 0.06, WALL_Z], [hw, STEP_H + 0.06, hz])} stroke="#2a1f17" strokeWidth="3" />
      {/* end wall + shoji, unlit: a little cold street light behind the paper */}
      <path d={poly([[-hw, STEP_H, hz], [hw, STEP_H, hz], [hw, CEIL, hz], [-hw, CEIL, hz]])} fill="#2c2620" />
      {(() => {
        const [ax, ay] = P(-0.7, 2.02, hz), [bx, by] = P(0.7, STEP_H + 0.02, hz), s = S(hz);
        return (
          <g>
            <rect x={ax} y={ay} width={bx - ax} height={by - ay} fill={PAL.shoji} />
            <rect x={ax} y={ay} width={bx - ax} height={by - ay} fill="url(#gk-moon)" />
            {Array.from({ length: 5 }, (_, i) => <line key={`v${i}`} x1={ax + ((bx - ax) * (i + 1)) / 6} y1={ay} x2={ax + ((bx - ax) * (i + 1)) / 6} y2={by} stroke={PAL.lattice} strokeWidth={(i === 2 ? 0.05 : 0.02) * s} />)}
            {Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1={ax} y1={ay + ((by - ay) * (i + 1)) / 8} x2={bx} y2={ay + ((by - ay) * (i + 1)) / 8} stroke={PAL.lattice} strokeWidth={0.02 * s} />)}
            <rect x={ax} y={ay} width={bx - ax} height={by - ay} fill="none" stroke={PAL.lattice} strokeWidth={0.05 * s} />
          </g>
        );
      })()}
      {/* switched-off hall light */}
      {(() => { const [cx, cy] = P(0, CEIL, 6.4); return <ellipse cx={cx} cy={cy + 2} rx={0.22 * S(6.4)} ry="4" fill="#6a6258" />; })()}
    </g>
  );
}

function Cabinet() {
  const { x0, z0, z1, h } = CAB, plinth = 0.08;
  const doors = [];
  const nD = 4;
  for (let i = 1; i < nD; i++) {
    const z = z0 + ((z1 - z0) * i) / nD;
    doors.push(<path key={i} d={line([x0, plinth + 0.02, z], [x0, h - 0.03, z])} />);
  }
  const pulls = [1, 3].flatMap((sN) => [-0.05, 0.05].map((dz) => {
    const z = z0 + ((z1 - z0) * sN) / nD + dz;
    return <path key={`${sN}${dz}`} d={line([x0, h - 0.14, z], [x0, h - 0.26, z])} />;
  }));
  return (
    <g>
      <path d={poly([[x0 + 0.03, 0, z0], [x0 + 0.03, plinth, z0], [x0 + 0.03, plinth, z1], [x0 + 0.03, 0, z1]])} fill="#1e160f" />
      <path d={poly([[x0, plinth, z0], [x0, h, z0], [x0, h, z1], [x0, plinth, z1]])} fill="url(#gk-cab)" />
      <path d={poly([[x0, plinth, z0], [W, plinth, z0], [W, h, z0], [x0, h, z0]])} fill="#8a6440" />
      <path d={poly([[x0 - 0.015, h, z0 - 0.015], [W, h, z0 - 0.015], [W, h, z1], [x0 - 0.015, h, z1]])} fill={PAL.cabTop} />
      <path d={poly([[x0 - 0.015, h - 0.025, z0 - 0.015], [x0 - 0.015, h, z0 - 0.015], [x0 - 0.015, h, z1], [x0 - 0.015, h - 0.025, z1]])} fill="#8f6639" />
      <g stroke={PAL.cabSeam} strokeWidth="2">{doors}</g>
      <g stroke="#3a2818" strokeWidth="4" strokeLinecap="round">{pulls}</g>
      {/* on top: a key tray (her keys, squared to the edge) and one vase, one stem, one red bud */}
      <path d={poly([[1.12, h + 0.005, 1.1], [1.34, h + 0.005, 1.1], [1.34, h + 0.005, 1.26], [1.12, h + 0.005, 1.26]])} fill="#5a3f28" stroke="#2c1e13" strokeWidth="1.5" />
      <path d={line([1.19, h + 0.01, 1.18], [1.29, h + 0.01, 1.18])} stroke="#c9c2b0" strokeWidth="3" strokeLinecap="round" />
      {(() => { const [kx, ky] = P(1.18, h + 0.01, 1.18); return <ellipse cx={kx} cy={ky} rx="7" ry="3" fill="none" stroke="#c9c2b0" strokeWidth="2" />; })()}
      {(() => {
        const [vx, vy] = P(1.25, h, 1.75), s = S(1.75);
        return (
          <g transform={`translate(${f1(vx)} ${f1(vy)}) scale(${(s / 100).toFixed(4)})`}>
            <ellipse cx="0" cy="0" rx="7" ry="2" fill="#000" opacity=".4" />
            <path d="M-5 0 Q-7 -12 -3 -18 L-2 -22 H2 L3 -18 Q7 -12 5 0Z" fill="#efe9ef" />
            <path d="M0 -22 Q-4 -40 5 -56" fill="none" stroke="#4a6a3a" strokeWidth=".8" />
            <circle cx="5.4" cy="-57" r="1.8" fill={PAL.her} />
          </g>
        );
      })()}
    </g>
  );
}

function LeftWall() {
  // umbrella stand in the corner by the step, her wet umbrella in it, a small drip ring
  const [ux, uy] = P(-1.26, 0, 1.78), us = S(1.78);
  // empty coat pegs on a rail; light switch near the door
  const rail = [[-W, 1.7, 2.35], [-W, 1.78, 2.35], [-W, 1.78, 3.45], [-W, 1.7, 3.45]];
  return (
    <g>
      <path d={poly(rail)} fill="#7a5634" />
      {[2.55, 2.9, 3.25].map((z) => (
        <path key={z} d={line([-W, 1.74, z], [-W + 0.1, 1.76, z])} stroke="#3e2a18" strokeWidth={0.03 * S(z)} strokeLinecap="round" />
      ))}
      <path d={poly([[-W, 1.1, 1.0], [-W, 1.24, 1.0], [-W, 1.24, 1.08], [-W, 1.1, 1.08]])} fill="#e9e2d2" stroke="#8a7a62" strokeWidth="1.5" />
      {[1.02, 1.055].map((z) => <path key={z} d={poly([[-W, 1.14, z], [-W, 1.2, z], [-W, 1.2, z + 0.02], [-W, 1.14, z + 0.02]])} fill="#cfc6b2" stroke="#9a8a70" strokeWidth="1" />)}
      <g transform={`translate(${f1(ux)} ${f1(uy)}) scale(${(us / 100).toFixed(4)})`}>
        <ellipse cx="0" cy="1" rx="17" ry="3.4" fill="#000" opacity=".45" />
        <ellipse cx="4" cy="3" rx="14" ry="2.2" fill="#6f7c8e" opacity=".35" />
        <path d="M-10 0 V-44 H10 V0Z" fill="#6e5234" />
        <path d="M-10 -44 H10" stroke="#3a2a1a" strokeWidth="1.6" />
        <ellipse cx="0" cy="-44" rx="10" ry="2.4" fill="#1e150d" />
        {/* the clear vinyl umbrella from the stairs scene, still beaded with rain */}
        <path d="M-1 -40 Q-9 -62 -5 -84 L-3 -84 Q4 -62 3 -40Z" fill="#b9cde6" opacity=".6" />
        <path d="M0 -42 Q-5 -62 -4 -82 M2 -42 Q0 -62 -3 -83" stroke="#e8f1ff" strokeWidth=".6" fill="none" opacity=".8" />
        <path d="M-4 -84 L-4.6 -94" stroke="#2a2a30" strokeWidth="1.4" />
        <path d="M-4.6 -93 v-5 q0 -4 4 -4 q4 0 4 4" stroke="#2a2a30" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {[[-5, -60], [-3, -72], [1, -52], [-1, -66]].map(([x, y]) => <circle key={y} cx={x} cy={y} r=".8" fill="#fff" opacity=".85" />)}
      </g>
    </g>
  );
}

function Lamp() {
  const [cx, cy] = P(LAMP.x, LAMP.y, LAMP.z), r = LAMP.r * S(LAMP.z);
  const [, topY] = P(LAMP.x, CEIL, LAMP.z);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 5.5} fill="url(#gk-halo)" />
      <path d={`M${cx} ${topY} V${cy - r}`} stroke="#1b1512" strokeWidth="2" />
      <rect x={cx - 10} y={topY} width="20" height="6" fill="#2a2018" />
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.94} fill="url(#gk-paper)" />
      {[-0.66, -0.33, 0, 0.33, 0.66].map((t) => (
        <path key={t} d={`M${cx - r * Math.sqrt(1 - t * t)} ${cy + r * t} Q${cx} ${cy + r * t + r * 0.12} ${cx + r * Math.sqrt(1 - t * t)} ${cy + r * t}`} fill="none" stroke="#d9a660" strokeWidth="1.2" opacity=".55" />
      ))}
      <rect x={cx - 12} y={cy - r * 0.97} width="24" height="5" rx="2" fill="#3a2a1c" />
    </g>
  );
}

export default function GenkanArrival({ props }) {
  // world anchors reused for gradients
  const [lx, ly] = P(LAMP.x, LAMP.y, LAMP.z);
  const [, stepY] = P(0, STEP_H, STEP_Z);
  const [, wallFloorY] = P(0, STEP_H, WALL_Z);
  const [, ceilWallY] = P(0, CEIL, WALL_Z);
  const [poolX, poolY] = P(LAMP.x, 0, LAMP.z + 0.1);
  const opening = [[-HALL_W, STEP_H, WALL_Z], [HALL_W, STEP_H, WALL_Z], [HALL_W, HALL_H, WALL_Z], [-HALL_W, HALL_H, WALL_Z]];
  const wallFront = `${poly([[-W, STEP_H, WALL_Z], [W, STEP_H, WALL_Z], [W, CEIL, WALL_Z], [-W, CEIL, WALL_Z]])} ${poly(opening)}`;
  const leftX = P(-W, 0, WALL_Z)[0];
  const rightX = P(W, 0, WALL_Z)[0];
  const tapeY = TAPE_Z;

  return (
    <div className={`art genkan cam${props.insert ? ' insert' : ''}`}>
      <svg viewBox="0 0 1920 1080" role="img" aria-label={props.insert
        ? 'Close up: a pair of men\'s slippers, set out on the step and waiting. Beside them, a tiny shrine holding a logic circuit.'
        : 'Her entryway at night, lit by one paper lamp. Her shoes stand in a perfect line on a strip of tape. The hallway beyond goes dark.'}>
        <defs>
          <filter id="gk-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" /></filter>
          <linearGradient id="gk-wallL" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={f1(leftX)} y2="0">
            <stop offset="0" stopColor={PAL.plasterDim} /><stop offset=".45" stopColor={PAL.plaster} /><stop offset="1" stopColor="#a08664" />
          </linearGradient>
          <linearGradient id="gk-wallR" gradientUnits="userSpaceOnUse" x1="1920" y1="0" x2={f1(rightX)} y2="0">
            <stop offset="0" stopColor={PAL.plasterDim} /><stop offset=".45" stopColor={PAL.plaster} /><stop offset="1" stopColor="#a08664" />
          </linearGradient>
          <radialGradient id="gk-ceil" gradientUnits="userSpaceOnUse" cx={f1(lx)} cy="0" r="900">
            <stop offset="0" stopColor={PAL.ceil} /><stop offset="1" stopColor={PAL.ceilDark} />
          </radialGradient>
          <linearGradient id="gk-wood" gradientUnits="userSpaceOnUse" x1="0" y1={f1(stepY)} x2="0" y2={f1(wallFloorY)}>
            <stop offset="0" stopColor={PAL.wood} /><stop offset="1" stopColor={PAL.woodFar} />
          </linearGradient>
          <linearGradient id="gk-front" gradientUnits="userSpaceOnUse" x1="0" y1={f1(ceilWallY)} x2="0" y2={f1(wallFloorY)}>
            <stop offset="0" stopColor="#8e785c" /><stop offset="1" stopColor="#a58c6a" />
          </linearGradient>
          <linearGradient id="gk-hallL" gradientUnits="userSpaceOnUse" x1={f1(P(-HALL_W, 0, WALL_Z)[0])} y1="0" x2={f1(VP.x)} y2="0">
            <stop offset="0" stopColor="#6e5c47" /><stop offset=".7" stopColor="#261f19" /><stop offset="1" stopColor="#141010" />
          </linearGradient>
          <linearGradient id="gk-hallR" gradientUnits="userSpaceOnUse" x1={f1(P(HALL_W, 0, WALL_Z)[0])} y1="0" x2={f1(VP.x)} y2="0">
            <stop offset="0" stopColor="#5e4e3c" /><stop offset=".7" stopColor="#221c17" /><stop offset="1" stopColor="#141010" />
          </linearGradient>
          <linearGradient id="gk-cab" gradientUnits="userSpaceOnUse" x1={f1(P(CAB.x0, 0, CAB.z0)[0])} y1="0" x2={f1(P(CAB.x0, 0, CAB.z1)[0])} y2="0">
            <stop offset="0" stopColor="#7d5a36" /><stop offset=".55" stopColor={PAL.cab} /><stop offset="1" stopColor="#94703f" />
          </linearGradient>
          <radialGradient id="gk-moon" cx=".5" cy=".4" r=".7">
            <stop offset="0" stopColor="#6d7690" stopOpacity=".5" /><stop offset="1" stopColor="#6d7690" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gk-paper" cx=".45" cy=".55" r=".6">
            <stop offset="0" stopColor={PAL.lampHot} /><stop offset=".7" stopColor="#fbe2ae" /><stop offset="1" stopColor={PAL.lampEdge} />
          </radialGradient>
          <radialGradient id="gk-halo">
            <stop offset="0" stopColor={PAL.glow} stopOpacity=".5" /><stop offset=".35" stopColor={PAL.glow} stopOpacity=".14" /><stop offset="1" stopColor={PAL.glow} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gk-pool" gradientUnits="userSpaceOnUse" cx={f1(poolX)} cy={f1(poolY)} r="620" gradientTransform={`translate(${f1(poolX)} ${f1(poolY)}) scale(1 .42) translate(${f1(-poolX)} ${f1(-poolY)})`}>
            <stop offset="0" stopColor={PAL.glow} stopOpacity=".28" /><stop offset="1" stopColor={PAL.glow} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gk-dim" gradientUnits="userSpaceOnUse" cx={f1(lx)} cy={f1(ly + 300)} r="1150">
            <stop offset=".22" stopColor={PAL.dark} stopOpacity="0" /><stop offset=".62" stopColor={PAL.dark} stopOpacity=".45" /><stop offset="1" stopColor={PAL.dark} stopOpacity=".86" />
          </radialGradient>
          <radialGradient id="gk-deep" gradientUnits="userSpaceOnUse" cx={VP.x} cy={f1(P(0, 1.0, HALL_END)[1])} r="300">
            <stop offset="0" stopColor={PAL.dark} stopOpacity=".92" /><stop offset=".45" stopColor={PAL.dark} stopOpacity=".8" /><stop offset="1" stopColor={PAL.dark} stopOpacity=".5" />
          </radialGradient>
        </defs>

        <g className="gk-bg">
          <rect width="1920" height="1080" fill="#1a1512" />
          <Hall />
          <rect x="0" y="0" width="1920" height="1080" fill="url(#gk-deep)" clipPath="url(#gk-open)" />
          <clipPath id="gk-open"><path d={poly(opening)} /></clipPath>
          {/* wall across the landing, with the hall opening + a dark trim frame */}
          <path d={wallFront} fill="url(#gk-front)" fillRule="evenodd" />
          <path d={poly(opening)} fill="none" stroke={PAL.trim} strokeWidth="7" />
          <Wood />
          {/* side walls + ceiling of the genkan */}
          <path d={poly([[-W, STEP_H, STEP_Z], [-W, 0, STEP_Z], [-W, 0, 0], [-W, CEIL, 0], [-W, CEIL, WALL_Z], [-W, STEP_H, WALL_Z]])} fill="url(#gk-wallL)" />
          <path d={poly([[W, STEP_H, STEP_Z], [W, 0, STEP_Z], [W, 0, 0], [W, CEIL, 0], [W, CEIL, WALL_Z], [W, STEP_H, WALL_Z]])} fill="url(#gk-wallR)" />
          <path d={poly([[-W, CEIL, 0], [W, CEIL, 0], [W, CEIL, WALL_Z], [-W, CEIL, WALL_Z]])} fill="url(#gk-ceil)" />
          {/* skirting where walls meet the landing, receding to the VP */}
          <path d={line([-W, STEP_H + 0.07, STEP_Z], [-W, STEP_H + 0.07, WALL_Z])} stroke={PAL.trim} strokeWidth="4" />
          <path d={line([W, STEP_H + 0.07, STEP_Z], [W, STEP_H + 0.07, WALL_Z])} stroke={PAL.trim} strokeWidth="4" />
          {/* a hanging scroll on the right wall above the cabinet: one ink circle (enso) */}
          <path d={poly([[W, 1.95, 1.2], [W, 1.95, 1.62], [W, 1.2, 1.62], [W, 1.2, 1.2]])} fill="#ece2cc" stroke="#3a2a1c" strokeWidth="3" />
          {(() => { const [ex, ey] = P(W, 1.58, 1.41); return <ellipse cx={ex} cy={ey} rx={0.08 * S(1.41) * 0.42} ry={0.08 * S(1.41)} fill="none" stroke="#2a2420" strokeWidth="3" strokeDasharray="60 8" />; })()}
          <Tataki />
          {/* the step: lip board catches the lamp on its top edge, riser in its own shadow */}
          <path d={poly([[-W, 0, STEP_Z], [W, 0, STEP_Z], [W, STEP_H - LIP, STEP_Z], [-W, STEP_H - LIP, STEP_Z]])} fill="#4e331d" />
          <path d={poly([[-W, STEP_H - LIP, STEP_Z - 0.02], [W, STEP_H - LIP, STEP_Z - 0.02], [W, STEP_H, STEP_Z - 0.02], [-W, STEP_H, STEP_Z - 0.02]])} fill={PAL.lip} />
          <path d={poly([[-W, STEP_H, STEP_Z - 0.02], [W, STEP_H, STEP_Z - 0.02], [W, STEP_H, STEP_Z + 0.02], [-W, STEP_H, STEP_Z + 0.02]])} fill={PAL.lipEdge} />
          <path d={poly([[-W, 0, STEP_Z - 0.02], [W, 0, STEP_Z - 0.02], [W, 0, STEP_Z - 0.13], [-W, 0, STEP_Z - 0.13]])} fill="#000" opacity=".35" filter="url(#gk-soft)" />
          {/* her tape line (toes touch it) with a pencil tick for every shoe, and the ruler she used, on the step */}
          <path d={poly([[PAIR_X0 - 0.2, 0.001, tapeY - 0.012], [PAIR_X0 + 3 * PAIR_PITCH + 0.2, 0.001, tapeY - 0.012], [PAIR_X0 + 3 * PAIR_PITCH + 0.2, 0.001, tapeY + 0.012], [PAIR_X0 - 0.2, 0.001, tapeY + 0.012]])} fill="#e3d98f" />
          <g stroke="#3a3326" strokeWidth="1.4">
            {PAIRS.flatMap((_, i) => [-1, 1].map((sd) => {
              const x = PAIR_X0 + i * PAIR_PITCH + (sd * SHOE_GAP);
              return <path key={`${i}${sd}`} d={line([x, 0.002, tapeY - 0.012], [x, 0.002, tapeY + 0.012])} />;
            }))}
          </g>
          {(() => {
            const r0 = -1.18, r1 = -0.68, rz = STEP_Z + 0.05, rw = 0.04, y = STEP_H + 0.004;
            return (
              <g>
                <path d={poly([[r0, STEP_H, rz - 0.01], [r1 + 0.01, STEP_H, rz - 0.01], [r1 + 0.01, STEP_H, rz + rw + 0.02], [r0, STEP_H, rz + rw + 0.02]])} fill="#000" opacity=".35" filter="url(#gk-soft)" />
                <path d={poly([[r0, y, rz], [r1, y, rz], [r1, y, rz + rw], [r0, y, rz + rw]])} fill="#efdc8e" stroke="#9c8740" strokeWidth="1" />
                <g stroke="#5b4c1e" strokeWidth="1">
                  {Array.from({ length: 51 }, (_, i) => <path key={i} d={line([r0 + 0.01 * i, y, rz], [r0 + 0.01 * i, y, rz + (i % 10 ? (i % 5 ? 0.008 : 0.013) : 0.02)])} />)}
                </g>
              </g>
            );
          })()}
          <Cabinet />
          <LeftWall />
          {/* 4 pairs: heels 3 cm off the riser, toes on the tape, equal gaps. Nothing out of place. */}
          {PAIRS.map((p, i) => [-1, 1].map((sd) => (
            <Shoe key={`${i}${sd}`} x={PAIR_X0 + i * PAIR_PITCH + sd * SHOE_GAP} z={tapeY + SHOE_L / 2} kind={p.kind} fill={p.fill} side={p.side} l={SHOE_L} />
          )))}
          {/* light: the pool under the pendant, the pendant, then everything away from it sinks */}
          <rect width="1920" height="1080" fill="url(#gk-pool)" />
          <Lamp />
        </g>
        <g className="gk-prop">
          {/* men's slippers on the step, toes toward the door = set out for a guest */}
          {ROOM.SLIPPERS.x.map((x) => <Slipper key={x} x={x} z={ROOM.SLIPPERS.z} />)}
          <Shrine />
        </g>
        <rect className="gk-dim" width="1920" height="1080" fill="url(#gk-dim)" pointerEvents="none" />
      </svg>
    </div>
  );
}
