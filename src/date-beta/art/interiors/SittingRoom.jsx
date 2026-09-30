// SITTING ROOM (art id `sitting-room`): the `cup` tea room. Trace = the night desk-window ref (research/refs/
// desk-window-night), full height, centred (767 px). Hand overlay: the window wall continued on both sides behind
// sheer lilac curtains (night city bokeh through rain), low wall + wood floor, and in front the low tea table
// (chabudai) with THREE cups: yours + hers (left, poured, steaming) and the third (right, empty, for "Input B"),
// the teapot, and the plate from props.plate / props.feed (umeboshi | tamagoyaki). Nanda stands centre, behind it.
// Light: her desk lamp (warm, top-right, in the ref) + the city through the glass (cool, from behind). Cups get a
// warm right side, a cool back rim, a contact shadow and a soft shadow to the front-left. No motion.
import { camera, traceUrl, preloadTrace, Grade } from './kit.jsx';
import { SidePanes, Curtain } from './room.jsx';

preloadTrace('sitting-room');

const C = camera({ vx: 960, vy: 330, f: 1000, eye: 1.0 }); // floor meets the window wall at y 925 (Z 1.68); the table sits against it, above the dialogue box
const { P, pts } = C;
const f1 = (n) => n.toFixed(1);
const REF = { x: 576, w: 767 }, SILL = 728, FLOOR = 925;
const TOP = 0.33, TX = 0.8, TZ0 = 1.22, TZ1 = 1.62; // table top height, half width, near/far edge

function ell(X, Y, Z, r) {
  const [cx] = P(X, Y, Z), [lx] = P(X - r, Y, Z), [rx] = P(X + r, Y, Z), [, ny] = P(X, Y, Z - r), [, fy] = P(X, Y, Z + r);
  return { cx, cy: (ny + fy) / 2, rx: (rx - lx) / 2, ry: Math.abs(ny - fy) / 2 };
}

function Cup({ X, Z, full }) {
  const r0 = 0.036, r1 = 0.05, h = 0.075, y0 = TOP, y1 = TOP + h;
  const b = ell(X, y0, Z, r0), t = ell(X, y1, Z, r1), s = ell(X - 0.03, y0 + 0.001, Z - 0.05, r0 * 1.5);
  return (
    <g>
      <ellipse cx={f1(s.cx)} cy={f1(s.cy)} rx={f1(s.rx * 1.3)} ry={f1(s.ry)} fill="#1a0e0a" opacity=".45" />
      <ellipse cx={f1(b.cx)} cy={f1(b.cy)} rx={f1(b.rx)} ry={f1(b.ry)} fill="#120a08" opacity=".7" />
      <path d={`M${f1(t.cx - t.rx)} ${f1(t.cy)}L${f1(b.cx - b.rx)} ${f1(b.cy)}A${f1(b.rx)} ${f1(b.ry)} 0 0 0 ${f1(b.cx + b.rx)} ${f1(b.cy)}L${f1(t.cx + t.rx)} ${f1(t.cy)}Z`} fill="#e9e1ea" />
      <path d={`M${f1(t.cx + t.rx * 0.35)} ${f1(t.cy)}L${f1(b.cx + b.rx * 0.35)} ${f1(b.cy + 2)}A${f1(b.rx)} ${f1(b.ry)} 0 0 0 ${f1(b.cx + b.rx)} ${f1(b.cy)}L${f1(t.cx + t.rx)} ${f1(t.cy)}Z`} fill="#ffd9a8" opacity=".55" />
      <path d={`M${f1(t.cx - t.rx)} ${f1(t.cy)}L${f1(b.cx - b.rx)} ${f1(b.cy)}L${f1(b.cx - b.rx * 0.5)} ${f1(b.cy + 3)}L${f1(t.cx - t.rx * 0.5)} ${f1(t.cy + 2)}Z`} fill="#8a7a9a" opacity=".5" />
      {/* a pink band glaze */}
      <path d={`M${f1(t.cx - t.rx * 0.97)} ${f1(t.cy + (b.cy - t.cy) * 0.3)}Q${f1(t.cx)} ${f1(t.cy + (b.cy - t.cy) * 0.3 + t.ry * 1.6)} ${f1(t.cx + t.rx * 0.97)} ${f1(t.cy + (b.cy - t.cy) * 0.3)}`} stroke="#e06a9a" strokeWidth="4" fill="none" />
      <ellipse cx={f1(t.cx)} cy={f1(t.cy)} rx={f1(t.rx)} ry={f1(t.ry)} fill="#f4eef4" stroke="#b8acb8" strokeWidth="2" />
      <ellipse cx={f1(t.cx)} cy={f1(t.cy + 1)} rx={f1(t.rx * 0.84)} ry={f1(t.ry * 0.78)} fill={full ? '#a8923e' : '#d8d0da'} />
      {full && <ellipse cx={f1(t.cx + t.rx * 0.2)} cy={f1(t.cy)} rx={f1(t.rx * 0.3)} ry={f1(t.ry * 0.2)} fill="#fff4c8" opacity=".6" />}
      {full && <path d={`M${f1(t.cx - 6)} ${f1(t.cy - 8)}q-12 -26 4 -48q10 -14 -2 -34M${f1(t.cx + 10)} ${f1(t.cy - 10)}q-10 -24 6 -44`} stroke="#fff" strokeWidth="4" opacity=".4" fill="none" strokeLinecap="round" />}
      {!full && <ellipse cx={f1(t.cx)} cy={f1(t.cy - t.ry * 0.9)} rx={f1(t.rx * 0.9)} ry={f1(t.ry * 0.25)} fill="#bcd6ff" opacity=".35" />}
    </g>
  );
}

function Teapot({ X, Z }) {
  const b = ell(X, TOP, Z, 0.07), m = ell(X, TOP + 0.07, Z, 0.085), t = ell(X, TOP + 0.13, Z, 0.05), sh = ell(X - 0.04, TOP + 0.001, Z - 0.06, 0.1);
  const [sx, sy] = P(X + 0.13, TOP + 0.11, Z), [hx, hy] = P(X - 0.1, TOP + 0.09, Z);
  return (
    <g>
      <ellipse cx={f1(sh.cx)} cy={f1(sh.cy)} rx={f1(sh.rx * 1.3)} ry={f1(sh.ry)} fill="#1a0e0a" opacity=".45" />
      <path d={`M${f1(m.cx + m.rx * 0.8)} ${f1(m.cy)}L${f1(sx)} ${f1(sy)}`} stroke="#3a4a3a" strokeWidth="11" strokeLinecap="round" />
      <path d={`M${f1(b.cx - b.rx)} ${f1(b.cy)}Q${f1(m.cx - m.rx * 1.25)} ${f1(m.cy)} ${f1(t.cx - t.rx)} ${f1(t.cy)}L${f1(t.cx + t.rx)} ${f1(t.cy)}Q${f1(m.cx + m.rx * 1.25)} ${f1(m.cy)} ${f1(b.cx + b.rx)} ${f1(b.cy)}A${f1(b.rx)} ${f1(b.ry)} 0 0 1 ${f1(b.cx - b.rx)} ${f1(b.cy)}Z`} fill="#3f5446" />
      <path d={`M${f1(m.cx + m.rx * 0.3)} ${f1(t.cy)}Q${f1(m.cx + m.rx * 1.2)} ${f1(m.cy)} ${f1(b.cx + b.rx)} ${f1(b.cy)}`} stroke="#ffd9a8" strokeWidth="4" opacity=".45" fill="none" />
      <ellipse cx={f1(t.cx)} cy={f1(t.cy)} rx={f1(t.rx)} ry={f1(t.ry)} fill="#56705e" />
      <circle cx={f1(t.cx)} cy={f1(t.cy - 6)} r="5" fill="#2a3a2e" />
      <path d={`M${f1(hx)} ${f1(hy)}q-16 -4 -14 14`} stroke="#2a3a2e" strokeWidth="7" fill="none" />
    </g>
  );
}

function Plate({ X, Z, kind }) {
  const p = ell(X, TOP + 0.005, Z, 0.09), sh = ell(X - 0.03, TOP + 0.001, Z - 0.04, 0.1);
  const [cx, cy] = P(X, TOP + 0.01, Z), s = C.f / Z / 1000;
  return (
    <g>
      <ellipse cx={f1(sh.cx)} cy={f1(sh.cy)} rx={f1(sh.rx)} ry={f1(sh.ry)} fill="#1a0e0a" opacity=".4" />
      <ellipse cx={f1(p.cx)} cy={f1(p.cy)} rx={f1(p.rx)} ry={f1(p.ry)} fill="#f2ede6" stroke="#c8bcb0" strokeWidth="2" />
      {kind && (
        <g transform={`translate(${f1(cx)} ${f1(cy)}) scale(${(s * 0.9).toFixed(3)})`}>
          {kind === 'tamagoyaki'
            ? <g><rect x="-60" y="-44" width="120" height="44" rx="10" fill="#f2c94c" /><path d="M-40 -44V0M-14 -44V0M12 -44V0M38 -44V0" stroke="#d9a92a" strokeWidth="4" /><rect x="-60" y="-44" width="120" height="10" rx="5" fill="#ffe7a0" /></g>
            : <g><circle cx="0" cy="-30" r="30" fill="#b0102c" /><circle cx="-10" cy="-40" r="8" fill="#e8546a" /><path d="M0 -60q10 -16 26 -10q-8 12 -26 10" fill="#3f8a3a" /></g>}
        </g>
      )}
    </g>
  );
}


// the low tea table + its cups / pot / plate: drawn in the room, and again as the BOOK cel (SittingRoomBook) over her
// sprite, so she stands BEHIND the table (its top hides her legs; research/sprint-0930/r5-ume, AUDIT 084).
function TableSet({ kind, id }) {
  const top = pts([[-TX, TOP, TZ0], [TX, TOP, TZ0], [TX, TOP, TZ1], [-TX, TOP, TZ1]]);
  const front = pts([[-TX, TOP - 0.04, TZ0], [TX, TOP - 0.04, TZ0], [TX, TOP, TZ0], [-TX, TOP, TZ0]]);
  const leg = (x) => pts([[x - 0.03, 0, TZ0 + 0.06], [x + 0.03, 0, TZ0 + 0.06], [x + 0.03, TOP - 0.04, TZ0 + 0.06], [x - 0.03, TOP - 0.04, TZ0 + 0.06]]);
  return (
    <g>
      <defs><linearGradient id={`${id}-table`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a2a1c" /><stop offset=".7" stopColor="#6a3c26" /><stop offset="1" stopColor="#7e4a2e" /></linearGradient></defs>
        {/* the low tea table */}
        <polygon points={leg(-TX + 0.08)} fill="#2a160e" /><polygon points={leg(TX - 0.08)} fill="#2a160e" />
        <polygon points={top} fill={`url(#${id}-table)`} />
        <ellipse cx="1180" cy="770" rx="260" ry="22" fill="#ffd9a8" opacity=".14" />
        <polygon points={pts([[-TX, TOP + 0.001, TZ1 - 0.01], [TX, TOP + 0.001, TZ1 - 0.01], [TX, TOP + 0.001, TZ1], [-TX, TOP + 0.001, TZ1]])} fill="#9fb8e8" opacity=".35" />
        <polygon points={front} fill="#2e180e" />
        <polygon points={pts([[-TX, TOP - 0.004, TZ0], [TX, TOP - 0.004, TZ0], [TX, TOP, TZ0], [-TX, TOP, TZ0]])} fill="#c88a5a" opacity=".5" />
        <Teapot X={-0.6} Z={1.56} />
        <Cup X={-0.4} Z={1.44} full />
        <Cup X={-0.7} Z={1.46} full />
        <Plate X={0.4} Z={1.42} kind={kind} />
        <Cup X={0.64} Z={1.5} />
    </g>
  );
}
// the BOOK cel (art id `sitting-room-book`): the same table, over her (main.jsx draws ART[`${bg}-book`] after her sprite)
export function SittingRoomBook({ props = {} }) {
  const kind = props.feed || props.plate || null;
  return (
    <div className="art sr-book">
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" aria-hidden="true"><TableSet kind={kind} id="srb" /></svg>
    </div>
  );
}


// r5 (AUDIT 082): the table's dining chairs, one at each end (yours is the middle one, where the camera sits). Wood, the
// lamp (top right) lights their right edges; a soft contact shadow under each on the floor.
function SideChair({ flip = false }) {
  const t = flip ? 'translate(1920 0) scale(-1 1)' : undefined;
  const wood = '#5a321e', line = '#2a160e', lit = flip ? '#3e2214' : '#9a6a44';
  return (
    <g transform={t}>
      <ellipse cx="170" cy="1066" rx="170" ry="22" fill="#0d0806" opacity=".45" />
      {/* the back posts + top rail + a slat (the backrest faces the camera side) */}
      <rect x="62" y="560" width="30" height="520" rx="8" fill={wood} stroke={line} strokeWidth="5" />
      <rect x="132" y="578" width="28" height="500" rx="8" fill={wood} stroke={line} strokeWidth="5" />
      <path d="M52 560 L170 578 L170 628 L52 612Z" fill="#6a3c26" stroke={line} strokeWidth="5" strokeLinejoin="round" />
      <path d="M62 700 L160 712 L160 736 L62 724Z" fill="#6a3c26" stroke={line} strokeWidth="4" strokeLinejoin="round" />
      <path d="M56 566 L166 582" stroke={lit} strokeWidth="6" strokeLinecap="round" />
      {/* the seat, reaching toward the table, and the front legs */}
      <path d="M58 880 L166 896 L318 890 L226 872Z" fill="#6a3c26" stroke={line} strokeWidth="5" strokeLinejoin="round" />
      <path d="M58 880 L166 896 L166 914 L58 898Z" fill="#4a2a1c" stroke={line} strokeWidth="4" strokeLinejoin="round" />
      <path d="M166 896 L318 890 L318 906 L166 914Z" fill="#3e2214" stroke={line} strokeWidth="4" strokeLinejoin="round" />
      <rect x="226" y="900" width="24" height="180" fill={wood} stroke={line} strokeWidth="4" />
      <rect x="292" y="900" width="24" height="180" fill={wood} stroke={line} strokeWidth="4" />
    </g>
  );
}

export default function SittingRoom({ props = {}, rm }) {
  const kind = props.feed || props.plate || null;
  const lamp = [1302, 262];
  return (
    <div className="art sitting-room">
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" role="img"
        aria-label={`Her sitting room at night: a wall of windows over the rainy city, lilac curtains, her desk lamp on; a low tea table with three cups, two poured, the third empty${kind ? `, and a plate of ${kind}` : ''}.`}>
        <defs>
          <linearGradient id="sr-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2418" /><stop offset="1" stopColor="#1e120c" /></linearGradient>
          <linearGradient id="sr-table" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4a2a1c" /><stop offset=".7" stopColor="#6a3c26" /><stop offset="1" stopColor="#7e4a2e" /></linearGradient>
          <radialGradient id="sr-lamp"><stop offset="0" stopColor="#ffe2b0" stopOpacity=".7" /><stop offset=".3" stopColor="#ffa860" stopOpacity=".22" /><stop offset="1" stopColor="#ffa860" stopOpacity="0" /></radialGradient>
          <linearGradient id="sr-edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".05" stopColor="#fff" /><stop offset=".95" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <mask id="sr-refmask" maskContentUnits="userSpaceOnUse"><rect x={REF.x} y="0" width={REF.w} height="1080" fill="url(#sr-edge)" /></mask>
        </defs>
        <rect width="1920" height="1080" fill="#0d1424" />
        {/* the window wall continued on both sides, low wall + floor under it */}
        <SidePanes x0={0} x1={REF.x + 20} sill={SILL} seed={4} mullions={[20, 392]} />
        <SidePanes x0={REF.x + REF.w - 20} x1={1920} sill={SILL} seed={9} mullions={[1500, 1872]} />
        <rect x="0" y={SILL} width="1920" height={FLOOR - SILL} fill="#1c1822" />
        <rect x="0" y={FLOOR} width="1920" height={1080 - FLOOR} fill="url(#sr-floor)" />
        {[980, 1040].map((y) => <line key={y} x1="0" y1={y} x2="1920" y2={y} stroke="#140c08" strokeWidth="2" opacity=".6" />)}
        {/* the traced ref (window + city + desk), edges feathered into the hand-drawn wall */}
        <image href={traceUrl('sitting-room')} x={REF.x} y="0" width={REF.w} height="1080" preserveAspectRatio="none" mask="url(#sr-refmask)" />
        <Curtain x0={0} x1={340} hem={FLOOR + 10} side="left" seed={5} tint="#9a86c0" shade="#3e3258" />
        <Curtain x0={1580} x1={1920} hem={FLOOR + 10} side="right" seed={6} tint="#c8a8c8" shade="#4a3a60" />
        <circle cx={lamp[0]} cy={lamp[1]} r="520" fill="url(#sr-lamp)" style={{ mixBlendMode: 'screen' }} />
        <SideChair /><SideChair flip />
        <TableSet kind={kind} id="sr" />
        <Grade id="sr-grade" tone="night" sun={lamp} flareR={160} rm={rm} />
      </svg>
    </div>
  );
}
