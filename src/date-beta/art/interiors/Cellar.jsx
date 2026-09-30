// CELLAR (art id `cellar`): her basement. Replaces the black + bulb `basement` for the `unknown` ladder beat and the
// `escape` scene. Trace = Tony's ref 52 (skylight shaft), mirrored + floor patch inpainted (pipeline/prep.py), ~50% hand
// overlay drawn through one pinhole camera (kit.camera) so every prop shares the trace's vanishing point:
//   left wall = her shelf wall (jars = her collection, bentos, the usu), back wall = the high rainy window,
//   centre = ONE chair standing in the shaft of light, right = steep box stairs up to a CLOSED hatch (warm seam),
//   two steel columns, a faint bulb by the shelves. Grime, no graffiti.
// Light: key = the window shaft (cold, back -> front, lands on the chair; its shadows fall toward the camera, left);
// fill = the faint bulb (warm, soft radial shadows); every object on the floor has a contact shadow.
// props.shelf: null | 'jars' | 'bentos' | 'usu' | 'newest'  (same contract as the old Basement.jsx) -> a warm pool of
// attention on that part of the shelf; props.jar = the bento pick echoed on the newest jar's label.
// Motion (stepped, >= 600 ms per pose): rain streaks on the glass (2 poses), a bulb dip (1 pose in 8). rm = still.
import { rng, useStep } from '../util.js';
import { camera, hull, ptsOf, inside, preloadTrace, Trace, Grade } from './kit.jsx';

preloadTrace('basement');

const C = camera({ vx: 929, vy: 522 });
const { P, pts } = C;
const f2 = (n) => n.toFixed(1);
// room (metres): back wall Z 6.1, left wall X -1.92, right wall X 1.85, ceiling 2.88
const ZB = 6.1, XL = -1.92, XR = 1.85, CEIL = 2.88;
const back = (x, y) => [((x - C.vx) * ZB) / C.f, C.eye + ((C.vy - y) * ZB) / C.f]; // stage px on the back wall -> X, Y

// ---------- the window + its shaft
const WIN = { x0: 985, y0: 352, x1: 1195, y1: 470 };
const [WX0, WY1] = back(WIN.x0, WIN.y0), [WX1, WY0] = back(WIN.x1, WIN.y1);
const CHAIR = { x: 0, z: 4.62 };
// light direction: window centre -> the chair (per metre of drop)
const LX = (CHAIR.x - (WX0 + WX1) / 2) / ((WY0 + WY1) / 2), LZ = (CHAIR.z - ZB) / ((WY0 + WY1) / 2);
const shade = (X, Y, Z) => [X + Y * LX, 0, Z + Y * LZ]; // where a point's shadow lands on the floor
const winCorners = [[WX0, WY1, ZB], [WX1, WY1, ZB], [WX1, WY0, ZB], [WX0, WY0, ZB]];
const patch = winCorners.map((p) => shade(...p));
const patchPx = patch.map((p) => P(...p));
const beamPx = hull([...winCorners.map((p) => P(...p)), ...patchPx]);

// warm dust motes, static, inside the beam
const MOTES = (() => {
  const r = rng(90), out = [];
  const xs = beamPx.map((p) => p[0]), ys = beamPx.map((p) => p[1]);
  const [ax, bx, ay, by] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  while (out.length < 46) {
    const p = [ax + r() * (bx - ax), ay + r() * (by - ay)];
    if (inside(p, beamPx)) out.push([...p, 0.8 + r() * 2.2, 0.25 + r() * 0.55]);
  }
  return out;
})();

// ---------- shelf wall (left): front edge X -1.56, Z 2.1 .. 5.7
const XF = -1.56, XM = -1.74, SZ = [2.1, 3.3, 4.5, 5.7], PLANK = [0.1, 0.62, 1.14, 1.66, 2.18], TH = 0.03, SH_TOP = 2.21;
const JARS = [['2019.04.02', 'Kenji'], ['2019.10.11', 'Taro'], ['2020.11.19', 'Sora'], ['2021.05.03', 'Yuki'], ['2022.02.14', 'Ren'],
  ['2022.09.09', 'Kaito'], ['2023.08.30', 'Haru'], ['2024.01.20', 'Minato'], ['2024.07.07', 'Riku'], ['2025.06.07', 'Daichi']];
const BENTOS = ['2024.12.01', '2025.03.12', '2026.05.20', '2026.09.27', '2026.09.28', '2026.09.29'];
const today = () => { const d = new Date(); return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`; };

function Jar({ z, y, date, name, note, empty, open, rim = 0.5 }) {
  const [cx, by] = P(XM, y, z);
  const s = C.f / z / 1000; // 1 unit = 1 mm
  return (
    <g transform={`translate(${f2(cx)} ${f2(by)}) scale(${s.toFixed(4)})`}>
      {!open && <rect x="-62" y="-262" width="124" height="34" rx="8" fill="#3b2a22" />}
      {!open && <rect x="-62" y="-262" width="124" height="8" rx="4" fill="#6a5040" opacity=".7" />}
      <path d="M-68 -230Q-78 -228 -78 -200V-22Q-78 0 -56 0H56Q78 0 78 -22V-200Q78 -228 68 -230Z" fill={empty ? '#b8c8e0' : '#233046'} fillOpacity={empty ? 0.12 : 0.55} stroke="#9fb2cf" strokeOpacity=".55" strokeWidth="5" />
      {!empty && <path d="M-70 -120H70V-24Q70 -8 54 -8H-54Q-70 -8 -70 -24Z" fill="#6e1426" />}
      {!empty && [[-40, -60], [0, -44], [36, -70], [-14, -92], [30, -30]].map(([x, yy]) => <circle key={x} cx={x} cy={yy} r="17" fill="#8e1c34" />)}
      <rect x="-60" y="-190" width="120" height="58" rx="4" fill="#d9ccb4" />
      <text x="0" y="-168" textAnchor="middle" fontSize="19" fontWeight="700" fontFamily="var(--mono, monospace)" fill="#3a1a10">{date}</text>
      <text x="0" y="-142" textAnchor="middle" fontSize="24" fontWeight="800" fontFamily="var(--cond, sans-serif)" fill="#3a1a10">{name}</text>
      {note && <text x="0" y="-100" textAnchor="middle" fontSize="18" fontWeight="700" fontFamily="var(--cond, sans-serif)" fill="#f4ead8">{note}</text>}
      {/* warm bulb-side glint (the bulb is room-side = right of the jar) + a cold window tick */}
      <rect x="52" y="-214" width="10" height="176" rx="5" fill="#ffc98a" opacity={rim} />
      <rect x="-60" y="-214" width="5" height="120" rx="3" fill="#bcd6ff" opacity=".22" />
    </g>
  );
}

function Bento({ z, y, n, label }) {
  // a lacquer box 0.12 (X) x 0.2 (Z) x 0.06 tall: top (seen from above), -Z front, +X side
  const x0 = XM - 0.06, x1 = XM + 0.06, z0 = z, z1 = z + 0.2, h = 0.058, y1 = y + h;
  return (
    <g>
      <polygon points={pts([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])} fill={n % 2 ? '#6a1a24' : '#2a1216'} />
      <polygon points={pts([[x0, y, z0], [x1, y, z0], [x1, y1, z0], [x0, y1, z0]])} fill={n % 2 ? '#4a0f18' : '#1a0a0e'} />
      <polygon points={pts([[x1, y, z0], [x1, y, z1], [x1, y1, z1], [x1, y1, z0]])} fill={n % 2 ? '#56141e' : '#221014'} />
      {/* gold band across the side + a paper name slip */}
      <polygon points={pts([[x1, y, z0 + 0.09], [x1, y, z0 + 0.11], [x1, y1, z0 + 0.11], [x1, y1, z0 + 0.09]])} fill="#b8923a" />
      {label && <polygon points={pts([[x1, y + 0.012, z0 + 0.13], [x1, y + 0.012, z0 + 0.19], [x1, y1 - 0.012, z0 + 0.19], [x1, y1 - 0.012, z0 + 0.13]])} fill="#e8dcc4" />}
    </g>
  );
}

function Section({ i, shelf, jar }) {
  const z0 = SZ[i], z1 = SZ[i + 1];
  const jarsTop = [], jarsMid = [], bentos = [];
  const zs = [0.38, 0.6, 0.82, 1.04].map((d) => z0 + d); // the first slot clears the near upright's face
  zs.forEach((z, k) => {
    const idx = (i * 4 + k) % JARS.length;
    const newest = i === 0 && k === 0; // the nearest jar on the top shelf: today, you, lid off, empty
    if (!newest) jarsTop.push({ z, date: JARS[idx][0], name: JARS[idx][1] });
    jarsMid.push({ z, date: JARS[(idx + 5) % JARS.length][0], name: JARS[(idx + 5) % JARS.length][1] });
  });
  [0.1, 0.36, 0.62, 0.88].forEach((d, k) => [0, 1, 2].forEach((lv) => { if (!(k === 3 && lv === 2)) bentos.push({ z: z0 + d, lv, n: i * 7 + k + lv }); }));
  const on = (k) => shelf === k;
  return (
    <g>
      {/* back panel between the uprights (dark stained ply over the wall) */}
      <polygon points={pts([[XL, 0, z0], [XL, 0, z1], [XL, SH_TOP, z1], [XL, SH_TOP, z0]])} fill="#150e14" />
      {PLANK.map((y) => (
        <g key={y}>
          {y + TH < C.eye
            ? <polygon points={pts([[XL, y + TH, z0], [XF, y + TH, z0], [XF, y + TH, z1], [XL, y + TH, z1]])} fill="#2a1c1c" />
            : <polygon points={pts([[XL, y, z0], [XF, y, z0], [XF, y, z1], [XL, y, z1]])} fill="#0e090c" />}
          <polygon points={pts([[XF, y, z0], [XF, y, z1], [XF, y + TH, z1], [XF, y + TH, z0]])} fill="#4a3226" />
        </g>
      ))}
      <g opacity={shelf && !on('bentos') ? 0.55 : 1}>
        {bentos.sort((a, b) => b.z - a.z).map((b) => <Bento key={`${b.z}-${b.lv}`} z={b.z} y={PLANK[1] + TH + b.lv * 0.06} n={b.n} label={b.lv === 0} />)}
      </g>
      <g opacity={shelf && !on('jars') ? 0.55 : 1}>
        {jarsMid.sort((a, b) => b.z - a.z).map((j) => <Jar key={j.z} z={j.z} y={PLANK[2] + TH} date={j.date} name={j.name} rim={0.25 + 0.4 * Math.max(0, 1 - Math.abs(j.z - 3.4) / 2)} />)}
        {jarsTop.sort((a, b) => b.z - a.z).map((j) => <Jar key={j.z} z={j.z} y={PLANK[3] + TH} date={j.date} name={j.name} rim={0.25 + 0.4 * Math.max(0, 1 - Math.abs(j.z - 3.4) / 2)} />)}
      </g>
      {i === 0 && (
        <g opacity={shelf && !on('newest') ? 0.7 : 1}>
          <Jar z={zs[0]} y={PLANK[3] + TH} date={today()} name="you" note={jar} empty open rim={0.6} />
          {/* its lid, set down beside it, tilted */}
          {(() => { const [x, y] = P(XM + 0.02, PLANK[3] + TH, zs[0] + 0.14); const s = C.f / (zs[0] + 0.14) / 1000; return (
            <g transform={`translate(${f2(x)} ${f2(y)}) scale(${s.toFixed(4)}) rotate(-14)`}><rect x="-62" y="-34" width="124" height="34" rx="8" fill="#3b2a22" /><rect x="-62" y="-34" width="124" height="8" rx="4" fill="#6a5040" /></g>); })()}
        </g>
      )}
    </g>
  );
}

function Upright({ z }) {
  return (
    <g>
      <polygon points={pts([[XL, 0, z], [XF, 0, z], [XF, SH_TOP, z], [XL, SH_TOP, z]])} fill="#24170f" />
      <polygon points={pts([[XF, 0, z], [XF, 0, z + 0.025], [XF, SH_TOP, z + 0.025], [XF, SH_TOP, z]])} fill="#5a3e2c" />
      {/* grain on the board's face (only reads on the near one) */}
      {[0.08, 0.17, 0.26].map((d) => <polyline key={d} points={pts([[XL + d, 0.02, z], [XL + d + 0.01, 0.9, z], [XL + d - 0.01, 1.6, z], [XL + d, SH_TOP - 0.02, z]])} stroke="#1a100a" strokeWidth="2" fill="none" opacity=".6" />)}
    </g>
  );
}

// ---------- props on the floor
function Ellipse({ X, Y, Z, r, ...rest }) {
  // a horizontal circle, projected: centre + half-axes from its left/right and near/far points
  const [cx, cy] = P(X, Y, Z), [lx] = P(X - r, Y, Z), [rx] = P(X + r, Y, Z);
  const [, ny] = P(X, Y, Z - r), [, fy] = P(X, Y, Z + r);
  return <ellipse cx={f2(cx)} cy={f2((ny + fy) / 2)} rx={f2((rx - lx) / 2)} ry={f2(Math.abs(ny - fy) / 2)} {...rest} />;
}

function Usu({ on }) {
  // a squat wooden mortar (usu) on the floor by the shelves, two iron hoops; one mochi in the bowl, hers only.
  // Its mallet (kine) leans on it: barrel head on the floor, handle up against the shelf edge.
  const X = -1.2, Z = 3.05, r0 = 0.25, h = 0.36;
  const at = (r, y) => [P(X - r, y, Z), P(X + r, y, Z)];
  const top = at(r0, h), waist = at(r0 * 0.84, h * 0.5), foot = at(r0 * 0.96, 0);
  const body = `M${f2(top[0][0])} ${f2(top[0][1])}Q${f2(waist[0][0] - 6)} ${f2(waist[0][1])} ${f2(foot[0][0])} ${f2(foot[0][1])}L${f2(foot[1][0])} ${f2(foot[1][1])}Q${f2(waist[1][0] + 6)} ${f2(waist[1][1])} ${f2(top[1][0])} ${f2(top[1][1])}Z`;
  const s = C.f / Z / 1000;
  const [hx, hy] = P(-0.86, 0.07, 3.0), [tx, ty] = P(-1.52, 1.0, 3.5);
  const ang = (Math.atan2(ty - hy, tx - hx) * 180) / Math.PI;
  const [mx, my] = P(X, h + 0.035, Z + 0.02);
  return (
    <g opacity={on === false ? 0.7 : 1}>
      <Ellipse X={X + 0.12} Y={0} Z={Z + 0.02} r={0.42} fill="#050308" opacity=".7" />
      <path d={body} fill="#3a2718" />
      {[0.1, 0.27].map((y) => { const [[ax, ay], [bx]] = at(r0 * (y < 0.2 ? 0.9 : 0.88), y); return <rect key={y} x={f2(ax)} y={f2(ay - 5)} width={f2(bx - ax)} height="9" rx="3" fill="#15121a" />; })}
      {[-0.12, -0.02, 0.1].map((dx) => { const [a, b] = [P(X + dx, 0.34, Z - 0.2), P(X + dx * 0.9, 0.03, Z - 0.22)]; return <line key={dx} x1={f2(a[0])} y1={f2(a[1])} x2={f2(b[0])} y2={f2(b[1])} stroke="#2a1b10" strokeWidth="3" />; })}
      <path d={body} fill="#ffc98a" opacity=".1" />
      <Ellipse X={X} Y={h} Z={Z} r={r0} fill="#5a3e28" />
      <Ellipse X={X} Y={h - 0.004} Z={Z} r={r0 * 0.76} fill="#1e140c" />
      {/* the mochi: a soft white dome sitting in the bowl */}
      <g transform={`translate(${f2(mx)} ${f2(my)}) scale(${s.toFixed(4)})`}>
        <path d="M-100 20Q-104 -52 0 -60Q104 -52 100 20Q0 42 -100 20Z" fill="#f4eee6" />
        <ellipse cx="-30" cy="-30" rx="36" ry="14" fill="#fff" opacity=".9" />
        <path d="M-100 20Q0 42 100 20" stroke="#c8c0c8" strokeWidth="6" fill="none" />
      </g>
      {/* the kine: handle first (behind the head), then the barrel head on the floor */}
      <line x1={f2(hx)} y1={f2(hy)} x2={f2(tx)} y2={f2(ty)} stroke="#6a4c30" strokeWidth={f2(0.045 * s * 1000)} strokeLinecap="round" />
      <line x1={f2(hx)} y1={f2(hy)} x2={f2(tx)} y2={f2(ty)} stroke="#ffc98a" strokeOpacity=".18" strokeWidth={f2(0.012 * s * 1000)} transform="translate(-4 -2)" />
      <g transform={`translate(${f2(hx)} ${f2(hy)}) rotate(${(ang + 90).toFixed(1)}) scale(${s.toFixed(4)})`}>
        <rect x="-160" y="-75" width="320" height="150" rx="40" fill="#4a3220" />
        <rect x="-160" y="-75" width="320" height="30" rx="15" fill="#7a5638" opacity=".7" />
        <rect x="-170" y="-80" width="28" height="160" rx="10" fill="#2a1c12" /><rect x="142" y="-80" width="28" height="160" rx="10" fill="#2a1c12" />
      </g>
    </g>
  );
}

function Column({ X, Z, r = 0.05 }) {
  const [x0, y0] = P(X - r, CEIL, Z), [x1, y1] = P(X + r, 0, Z);
  const w = x1 - x0, [bx0, by] = P(X - r * 2.4, 0, Z), [bx1] = P(X + r * 2.4, 0, Z);
  return (
    <g>
      <Ellipse X={X} Y={0} Z={Z} r={r * 4} fill="#050308" opacity=".65" />
      <rect x={f2(x0)} y={f2(y0)} width={f2(w)} height={f2(y1 - y0)} fill="#1a1c28" />
      <rect x={f2(x0 + w * 0.62)} y={f2(y0)} width={f2(w * 0.22)} height={f2(y1 - y0)} fill="#8ea4c8" opacity=".35" />
      <rect x={f2(x0 + w * 0.12)} y={f2(y0)} width={f2(w * 0.1)} height={f2(y1 - y0)} fill="#ffc98a" opacity=".12" />
      <rect x={f2(bx0)} y={f2(by - 6)} width={f2(bx1 - bx0)} height="6" fill="#262838" />
      <rect x={f2(bx0)} y={f2(y0)} width={f2(bx1 - bx0)} height="5" fill="#262838" />
    </g>
  );
}

// ---------- the chair (backlit by the shaft: cold rim on top edges, fronts in its own shadow)
const CW = 0.2, CZ0 = CHAIR.z - 0.2, CZ1 = CHAIR.z + 0.2, SEAT = 0.45, BACK = 0.95, LEG = 0.018;
function legPoly(X, Z, top) { return pts([[X - LEG, 0, Z], [X + LEG, 0, Z], [X + LEG, top, Z], [X - LEG, top, Z]]); }
function Chair() {
  const X = CHAIR.x;
  const rail = (y0, y1) => pts([[X - CW, y0, CZ1], [X + CW, y0, CZ1], [X + CW, y1, CZ1], [X - CW, y1, CZ1]]);
  const [bx, by] = P(X, BACK - 0.02, CZ1), bs = C.f / CZ1 / 1000;
  return (
    <g>
      {/* rear legs + back (behind the seat) */}
      <polygon points={legPoly(X - CW + LEG, CZ1, BACK)} fill="#1a110c" />
      <polygon points={legPoly(X + CW - LEG, CZ1, BACK)} fill="#1a110c" />
      <polygon points={rail(0.8, BACK)} fill="#23170f" />
      <polygon points={rail(BACK - 0.012, BACK)} fill="#c8dcff" opacity=".7" />
      <polygon points={rail(0.6, 0.66)} fill="#23170f" />
      {[-0.09, 0, 0.09].map((dx) => <polygon key={dx} points={pts([[X + dx - 0.014, SEAT, CZ1], [X + dx + 0.014, SEAT, CZ1], [X + dx + 0.014, 0.8, CZ1], [X + dx - 0.014, 0.8, CZ1]])} fill="#1e140d" />)}
      {/* her bow on the top rail */}
      <g transform={`translate(${f2(bx)} ${f2(by)}) scale(${bs.toFixed(4)})`}>
        <path d="M0 0C-40 -34 -86 -20 -80 8C-74 34 -30 24 0 0C30 24 74 34 80 8C86 -20 40 -34 0 0Z" fill="#d6337f" />
        <path d="M-6 2L-30 70M6 2L28 66" stroke="#b0206a" strokeWidth="12" strokeLinecap="round" />
        <circle r="14" fill="#ff7fb4" />
      </g>
      {/* seat: lit top (cold), dark front */}
      <polygon points={pts([[X - CW - 0.01, SEAT, CZ0], [X + CW + 0.01, SEAT, CZ0], [X + CW + 0.01, SEAT, CZ1], [X - CW - 0.01, SEAT, CZ1]])} fill="#5b6a88" />
      <polygon points={pts([[X - CW - 0.01, SEAT - 0.04, CZ0], [X + CW + 0.01, SEAT - 0.04, CZ0], [X + CW + 0.01, SEAT, CZ0], [X - CW - 0.01, SEAT, CZ0]])} fill="#1c130d" />
      <polygon points={pts([[X - CW - 0.01, SEAT - 0.004, CZ0], [X + CW + 0.01, SEAT - 0.004, CZ0], [X + CW + 0.01, SEAT, CZ0], [X - CW - 0.01, SEAT, CZ0]])} fill="#c8dcff" opacity=".55" />
      <polygon points={legPoly(X - CW + LEG, CZ0, SEAT - 0.04)} fill="#140d09" />
      <polygon points={legPoly(X + CW - LEG, CZ0, SEAT - 0.04)} fill="#140d09" />
      {/* contact shadows at the feet */}
      {[[X - CW + LEG, CZ0], [X + CW - LEG, CZ0], [X - CW + LEG, CZ1], [X + CW - LEG, CZ1]].map(([x, z]) => <Ellipse key={`${x}${z}`} X={x} Y={0} Z={z} r={0.04} fill="#030206" opacity=".8" />)}
    </g>
  );
}
// the chair's shadow in the light patch (clipped to the patch, so outside it the floor is simply dark)
function ChairShadow() {
  const X = CHAIR.x, sh = (x, y, z) => P(...shade(x, y, z));
  const quad = (a) => ptsOf(a.map((p) => sh(...p)));
  const legs = [[X - CW + LEG, CZ0, SEAT], [X + CW - LEG, CZ0, SEAT], [X - CW + LEG, CZ1, BACK], [X + CW - LEG, CZ1, BACK]];
  return (
    <g fill="#0a0b14" opacity=".82">
      <polygon points={quad([[X - CW, SEAT, CZ0], [X + CW, SEAT, CZ0], [X + CW, SEAT, CZ1], [X - CW, SEAT, CZ1]])} />
      <polygon points={quad([[X - CW, 0.8, CZ1], [X + CW, 0.8, CZ1], [X + CW, BACK, CZ1], [X - CW, BACK, CZ1]])} />
      <polygon points={quad([[X - CW, 0.6, CZ1], [X + CW, 0.6, CZ1], [X + CW, 0.66, CZ1], [X - CW, 0.66, CZ1]])} />
      {legs.map(([x, z, t]) => { const [a, b] = [sh(x, 0, z), sh(x, t, z)]; return <line key={`${x}${z}`} x1={f2(a[0])} y1={f2(a[1])} x2={f2(b[0])} y2={f2(b[1])} stroke="#0a0b14" strokeWidth="7" />; })}
    </g>
  );
}

// ---------- stairs (right): 12 closed box steps, bottom riser at Z 2.7, top at the ceiling; X 0.95 .. 1.85
const SX0 = 0.95, SX1 = XR, SN = 12, RISE = CEIL / SN, GO = 1.6 / SN, SZ0 = 2.7;
function Stairs() {
  const steps = [];
  for (let i = SN - 1; i >= 0; i--) {
    const z = SZ0 + i * GO, y0 = i * RISE, y1 = (i + 1) * RISE;
    const lit = 0.55 + 0.45 * (i / SN);
    steps.push(
      <g key={i}>
        {y1 < C.eye && <polygon points={pts([[SX0, y1, z], [SX1, y1, z], [SX1, y1, z + GO], [SX0, y1, z + GO]])} fill="#4a3424" opacity={lit} />}
        <polygon points={pts([[SX0, y0, z], [SX1, y0, z], [SX1, y1, z], [SX0, y1, z]])} fill="#20150e" />
        {/* worn nosing: a paler strip, rubbed in the middle where feet go */}
        <polygon points={pts([[SX0, y1 - 0.018, z], [SX1, y1 - 0.018, z], [SX1, y1, z], [SX0, y1, z]])} fill="#6a4c34" />
        <polygon points={pts([[SX0 + 0.3, y1 - 0.018, z], [SX0 + 0.6, y1 - 0.018, z], [SX0 + 0.6, y1, z], [SX0 + 0.3, y1, z]])} fill="#8a6a4c" opacity=".6" />
      </g>,
    );
  }
  // left stringer: a board along the slope on the X 0.95 plane (its room-side face is what we see)
  const m = RISE / GO, top = (z) => 0.32 + m * (z - SZ0), bot = (z) => m * (z - SZ0) - 0.25;
  const zTopCeil = SZ0 + (CEIL - 0.32) / m, zBotCeil = SZ0 + (CEIL + 0.25) / m, zBotFloor = SZ0 + 0.25 / m;
  const stringer = [[SX0, 0, SZ0 - 0.04], [SX0, top(SZ0 - 0.04), SZ0 - 0.04], [SX0, CEIL, zTopCeil], [SX0, CEIL, zBotCeil], [SX0, 0, zBotFloor]];
  const under = [[SX0, 0, zBotFloor], [SX0, CEIL, zBotCeil], [SX0, CEIL, zBotCeil + 0.2], [SX0, 0, zBotCeil + 0.2]];
  return (
    <g>
      {/* the void under the stairs (deep shadow) + two storage boxes in it */}
      <polygon points={pts(under)} fill="#07050b" />
      <polygon points={pts([[SX0 + 0.2, 0, 3.7], [SX0 + 0.6, 0, 3.7], [SX0 + 0.6, 0.34, 3.7], [SX0 + 0.2, 0.34, 3.7]])} fill="#2a2018" />
      <polygon points={pts([[SX0 + 0.2, 0.34, 3.7], [SX0 + 0.6, 0.34, 3.7], [SX0 + 0.6, 0.34, 4.1], [SX0 + 0.2, 0.34, 4.1]])} fill="#3a2c20" />
      <Ellipse X={SX0 + 0.45} Y={0} Z={2.62} r={0.55} fill="#040306" opacity=".6" />
      {steps}
      <polygon points={pts(stringer)} fill="#2e2016" />
      <polygon points={pts([[SX0, top(SZ0 - 0.04) - 0.03, SZ0 - 0.04], [SX0, top(SZ0 - 0.04), SZ0 - 0.04], [SX0, CEIL, zTopCeil], [SX0, CEIL - 0.03, zTopCeil]])} fill="#6a4c34" opacity=".8" />
      {/* the bulb side of the stringer: a faint warm wash low down */}
      <polygon points={pts(stringer)} fill="#ffc98a" opacity=".05" />
    </g>
  );
}

function Hatch() {
  // the lid in the ceiling over the top step: CLOSED. Light from her sitting room leaks through the seam.
  const q = [[SX0 + 0.02, CEIL, 3.62], [SX1 - 0.02, CEIL, 3.62], [SX1 - 0.02, CEIL, 4.36], [SX0 + 0.02, CEIL, 4.36]];
  const [rx, ry] = P(1.4, CEIL, 3.8);
  return (
    <g>
      <polygon points={pts(q)} fill="#ffb45a" opacity=".16" transform="translate(0 2)" style={{ filter: 'blur(6px)' }} />
      <polygon points={pts(q)} fill="#1a110b" stroke="#ffb45a" strokeWidth="2.5" strokeOpacity=".85" />
      {[3.8, 4.0, 4.18].map((z) => <polyline key={z} points={pts([[SX0 + 0.04, CEIL, z], [SX1 - 0.04, CEIL, z]])} stroke="#0c0806" strokeWidth="2" />)}
      <circle cx={f2(rx)} cy={f2(ry + 10)} r="7" fill="none" stroke="#6b6e7a" strokeWidth="2.5" />
    </g>
  );
}

export default function Cellar({ props = {}, rm }) {
  const shelf = props.shelf ?? null;
  const pose = useStep(8, 5, !rm); // 625 ms per pose
  const rain = pose % 2, dip = pose === 5;
  const bulb = P(-1.0, 2.3, 3.4), wireTop = P(-1.0, CEIL, 3.4);
  const r = rng(12);
  const drops = Array.from({ length: 22 }, () => [WIN.x0 + 8 + r() * (WIN.x1 - WIN.x0 - 16), WIN.y0 + 6 + r() * (WIN.y1 - WIN.y0 - 30), 10 + r() * 22]);
  const focus = { jars: P(XM, 1.5, 3.9), bentos: P(XM, 0.75, 3.5), usu: P(-1.25, 0.3, 3.05), newest: P(XM, 1.8, 2.28) }[shelf];
  const label = shelf ? `Her basement. The shelf wall: ${shelf}.` : 'Her basement: concrete, one chair in a shaft of cold light from a high rainy window, steep wooden stairs up to a closed hatch, a wall of shelves full of labelled jars.';
  return (
    <div className="art cellar" data-shelf={shelf ?? 'none'}>
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" role="img" aria-label={label}>
        <defs>
          <linearGradient id="cl-beam" gradientUnits="userSpaceOnUse" x1={WIN.x1} y1={WIN.y0} x2={patchPx[0][0]} y2={patchPx[0][1]}>
            <stop offset="0" stopColor="#d8e6ff" stopOpacity=".34" /><stop offset=".7" stopColor="#9fb8ff" stopOpacity=".12" /><stop offset="1" stopColor="#9fb8ff" stopOpacity=".05" />
          </linearGradient>
          <radialGradient id="cl-bulb"><stop offset="0" stopColor="#ffd9a0" stopOpacity=".55" /><stop offset=".3" stopColor="#ff9a4a" stopOpacity=".16" /><stop offset="1" stopColor="#ff9a4a" stopOpacity="0" /></radialGradient>
          <radialGradient id="cl-focus"><stop offset="0" stopColor="#ffcf8a" stopOpacity=".38" /><stop offset="1" stopColor="#ffcf8a" stopOpacity="0" /></radialGradient>
          <linearGradient id="cl-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e8f0ff" /><stop offset="1" stopColor="#8aa4d8" /></linearGradient>
          <filter id="cl-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10" /></filter>
          <clipPath id="cl-patch"><polygon points={ptsOf(patchPx)} /></clipPath>
        </defs>
        <rect width="1920" height="1080" fill="#0b0812" />
        <Trace id="basement" />

        {/* back wall around the window (the trace's window blob is wider than the real frame) */}
        <rect x="918" y="292" width="420" height="262" fill="#1b1426" filter="url(#cl-soft)" />
        {[950, 1000, 1050, 1100, 1150, 1200, 1250, 1300].map((x) => <line key={x} x1={x} y1="300" x2={x} y2="548" stroke="#120d1c" strokeWidth="3" opacity=".7" />)}
        {/* water stains under the sill */}
        {[1004, 1046, 1120, 1172].map((x, i) => <path key={x} d={`M${x} 478q${i % 2 ? 6 : -4} 60 ${i % 2 ? -2 : 3} ${90 + i * 26}`} stroke="#0e0a16" strokeWidth={6 + (i % 2) * 5} opacity=".6" fill="none" />)}
        {/* the window: glass (cold street light beyond), rain, frame + 2 bars */}
        <rect x={WIN.x0} y={WIN.y0} width={WIN.x1 - WIN.x0} height={WIN.y1 - WIN.y0} fill="url(#cl-glass)" />
        <g stroke="#f4f8ff" strokeWidth="2" opacity=".55">{drops.map(([x, y, l], i) => <line key={i} x1={f2(x)} y1={f2(y + rain * 14)} x2={f2(x - 3)} y2={f2(y + l + rain * 14)} />)}</g>
        <g fill="#5a70a0" opacity=".5">{drops.slice(0, 10).map(([x, y], i) => <circle key={i} cx={f2(x + 9)} cy={f2(y + 20)} r="3.5" />)}</g>
        <rect x={WIN.x0 - 10} y={WIN.y0 - 10} width={WIN.x1 - WIN.x0 + 20} height={WIN.y1 - WIN.y0 + 20} fill="none" stroke="#2a2230" strokeWidth="14" />
        <rect x={WIN.x0 - 14} y={WIN.y1 + 6} width={WIN.x1 - WIN.x0 + 28} height="10" fill="#3a3040" />
        {[1055, 1125].map((x) => <rect key={x} x={x} y={WIN.y0} width="7" height={WIN.y1 - WIN.y0} fill="#2a2230" />)}
        {/* cobwebs in the two back corners */}
        <g stroke="#8a8aa0" strokeWidth="1.2" opacity=".35" fill="none">
          <path d="M616 312l70 8M616 312l58 40M616 312l22 64M630 314q12 14 4 30M650 316q20 20 8 48" />
          <path d="M1232 312l-66 6M1232 312l-50 44M1232 312l-16 60M1216 314q-14 16 -4 30" />
        </g>

        {/* columns (far first) */}
        <Column X={-0.55} Z={5.7} />
        <Column X={-1.3} Z={5.35} />

        {/* the shelf wall: far section first, each upright in front of the section behind it */}
        <Upright z={SZ[3]} />
        {[2, 1, 0].map((i) => <g key={i}><Section i={i} shelf={shelf} jar={props.jar} /><Upright z={SZ[i]} /></g>)}
        <polygon points={pts([[XL, SH_TOP, SZ[0]], [XF, SH_TOP, SZ[0]], [XF, SH_TOP, SZ[3]], [XL, SH_TOP, SZ[3]]])} fill="#0c080a" />

        {/* floor: grime, drain, a puddle under the window with its reflection */}
        <g fill="#0a0810" opacity=".35">
          <Ellipse X={-0.5} Y={0} Z={3.6} r={0.4} />
          <Ellipse X={0.6} Y={0} Z={5.2} r={0.4} />
        </g>
        <Ellipse X={0.9} Y={0} Z={5.8} r={0.35} fill="#1a2238" opacity=".8" />
        <polygon points={pts([[0.72, 0, 5.75], [1.05, 0, 5.75], [1.0, 0, 5.95], [0.78, 0, 5.95]])} fill="#9fb8e8" opacity=".3" />
        <Ellipse X={0.25} Y={0} Z={3.3} r={0.14} fill="#08070c" />
        {[-0.08, -0.03, 0.02, 0.07].map((d) => <polyline key={d} points={pts([[0.25 + d, 0.001, 3.2], [0.25 + d, 0.001, 3.4]])} stroke="#3a3848" strokeWidth="2" />)}

        {/* the light patch + the chair's shadow inside it */}
        <polygon points={ptsOf(patchPx)} fill="#b8ccf0" opacity=".42" />
        <polygon points={ptsOf(patchPx)} fill="#dfe9ff" opacity=".22" filter="url(#cl-soft)" />
        <g clipPath="url(#cl-patch)"><ChairShadow /></g>
        <Usu on={shelf ? shelf === 'usu' : null} />
        <Chair />

        {/* the shaft through the air + warm dust (static) */}
        <polygon points={ptsOf(beamPx)} fill="url(#cl-beam)" style={{ mixBlendMode: 'screen' }} />
        <g fill="#ffd9a0">{MOTES.map(([x, y, s, o], i) => <circle key={i} cx={f2(x)} cy={f2(y)} r={f2(s)} opacity={f2(o)} />)}</g>

        {/* stairs + the post under the hatch header + the hatch */}
        <Column X={SX0 - 0.06} Z={4.5} r={0.06} />
        <Stairs />
        <Hatch />

        {/* the bulb: faint, warm, by the shelves */}
        <line x1={f2(wireTop[0])} y1={f2(wireTop[1])} x2={f2(bulb[0])} y2={f2(bulb[1] - 12)} stroke="#0c0a10" strokeWidth="2.5" />
        <circle cx={f2(bulb[0])} cy={f2(bulb[1])} r="300" fill="url(#cl-bulb)" opacity={dip ? 0.55 : 1} style={{ mixBlendMode: 'screen' }} />
        <rect x={f2(bulb[0] - 6)} y={f2(bulb[1] - 20)} width="12" height="10" fill="#3a3432" />
        <ellipse cx={f2(bulb[0])} cy={f2(bulb[1])} rx="10" ry="13" fill={dip ? '#d8a070' : '#ffe2b0'} />

        {focus && <circle cx={f2(focus[0])} cy={f2(focus[1])} r="260" fill="url(#cl-focus)" style={{ mixBlendMode: 'screen' }} />}
        <Grade id="cl-grade" tone="horror" sun={[1090, 410]} flareR={170} rm={rm} />
      </svg>
    </div>
  );
}
