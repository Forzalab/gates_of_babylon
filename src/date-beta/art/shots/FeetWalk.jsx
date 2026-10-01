// R7 LEGS (research/sprint-0930/legs): the park walk-out, "Two pairs of shoes walk out of the park. Hers stay close to
// yours." (v2-park, insert item `feet`, pose `park`). A full-frame KyoAni low cutaway, waist-down, over the blurred park
// trace (the cel-over-vtrace lock: the bg stays the pure trace, everything here is a hand-drawn cel). Was: a beige oval
// plate with stubby pink shoes and leg stumps that ended in mid-air (not her canon, no ground, no light).
// Construction (Loomis / Bridgman): HER = her own sprite (nanda.js, pin legs + plum shoes, the walk pose) at 11 px per gate
//   unit, so the frame cuts her at the cheeks under the HUD band: we see the skirt hem, the bow, the pin legs, the shoes.
//   YOU = jeans + purple sneakers at a man's scale next to her (a shoe 1.3x hers, the leg leaves the frame at the top).
// Inoue: both pairs in the contact pose walking toward the camera, in step: her front foot (viewer-left) strikes with the
//   heel while yours does the same on the far side (she matches your step); the back feet push off on the toes.
//   "Hers stay close to yours": the two pairs converge on one line of travel, her back shoe inside your stride.
// Nishiya: her plum dome shoe + strap + sole lip (the sprite); your sneaker = white midsole, purple upper, white toe cap,
//   tongue + laces, the jeans hem breaking over the tongue.
// Shinkai (the park's light, Park.jsx): ONE sun low behind the trees at the right -> long cast shadows toward the
//   front-left, a warm rim on every right-hand edge, dappled light on the path + the legs, the pink-gravel path bouncing
//   warm onto the shins. Contact: a near-black occlusion line under each sole, darkest at the sole.
// UI: the soles sit at y 700-745, clear of the two-line box (rivets ~760); the HUD band covers her face (y < 95).
import { useMemo } from 'react';
import { nandaSVG } from '../nanda.js';

const RIM = '#ffd9a0', INK = '#2a1a2e', PATH = '#d9b8aa', SH = '#5a3040';
const HER = { x: 620, ground: 669, s: 5.5 }; // nandaSVG local (0, 0) = her column at the ground; local 9.2 = the front sole

// a sneaker seen from the front, unit width 100, ground at y 0; toeUp = heel strike (the sole + tread show), heelUp = toe-off
function Sneaker({ x, gy, s = 2.5, pose = 'flat' }) {
  const toeUp = pose === 'toeUp', heelUp = pose === 'heelUp';
  const k = heelUp ? 1.16 : toeUp ? 0.9 : 1;          // the upper's height on screen (foreshortening)
  const soleH = toeUp ? 22 : heelUp ? 8 : 14;
  const sw = heelUp ? 45 : 50;                          // toe-off: the sole tips away, only its toe edge shows
  const b = toeUp ? -3 : 0;                            // the toe lifts off the ground on the strike
  const top = b - soleH - 46 * k;
  return (
    <g transform={`translate(${x} ${gy}) scale(${s})`}>
      {/* contact: the heel's (toe up) / the toe's (heel up) occlusion, darkest right at the sole */}
      <ellipse cx="0" cy="1" rx={toeUp ? 30 : heelUp ? 26 : 50} ry="4" fill={SH} opacity=".45" />
      <ellipse cx="0" cy=".4" rx={toeUp ? 20 : heelUp ? 18 : 42} ry="1.8" fill="#120a10" opacity=".85" />
      {/* the midsole (thick at the strike: its tread faces us) */}
      <path d={`M${-sw} ${b - soleH} Q${-sw - 3} ${b - 2} ${-sw + 10} ${b} H${sw - 10} Q${sw + 3} ${b - 2} ${sw} ${b - soleH} Z`} fill="#ece7ef" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {toeUp && [-30, -15, 0, 15, 30].map((t) => <path key={t} d={`M${t} ${b - 3} v-9`} stroke="#b9b1c4" strokeWidth="3" strokeLinecap="round" />)}
      {/* the upper, the toe cap, the tongue + laces */}
      <path d={`M-46 ${b - soleH} Q-50 ${top + 14 * k} -30 ${top + 2} Q0 ${top - 6} 30 ${top + 2} Q50 ${top + 14 * k} 46 ${b - soleH} Z`} fill="#6c62c4" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d={`M-40 ${b - soleH} Q-42 ${b - soleH - 16 * k} -22 ${b - soleH - 20 * k} Q0 ${b - soleH - 23 * k} 22 ${b - soleH - 20 * k} Q42 ${b - soleH - 16 * k} 40 ${b - soleH} Z`} fill="#e6e1ea" stroke={INK} strokeWidth="1.6" />
      <path d={`M-15 ${top + 3} L-16 ${b - soleH - 22 * k} Q0 ${b - soleH - 18 * k} 16 ${b - soleH - 22 * k} L15 ${top + 3} Z`} fill="#4b4298" />
      {[0.25, 0.5].map((f) => { const y = top + 6 + f * 26 * k; return <path key={f} d={`M-14 ${y} L14 ${y + 5} M14 ${y} L-14 ${y + 5}`} stroke="#f6f2ea" strokeWidth="3" strokeLinecap="round" />; })}
      {/* light: the warm rim on the right-hand edge, a sheen on the toe cap */}
      <path d={`M40 ${top + 8} Q49 ${top + 20 * k} 47 ${b - soleH - 1}`} stroke={RIM} strokeWidth="2.6" fill="none" strokeLinecap="round" opacity=".9" />
      <ellipse cx="-14" cy={b - soleH - 12 * k} rx="9" ry="3" fill="#fff" opacity=".55" />
    </g>
  );
}

// a jeans leg from the hem (over the shoe's tongue) up out of the frame top; w0 at the hem, w1 at the top edge
function Jeans({ x, hem, w0, w1, lean = 0, front = false }) {
  const xt = x + lean;
  return (
    <g>
      <path d={`M${x - w0 / 2} ${hem} L${xt - w1 / 2} -20 L${xt + w1 / 2} -20 L${x + w0 / 2} ${hem} Q${x} ${hem + 16} ${x - w0 / 2} ${hem}Z`} fill="#2f3a58" />
      <path d={`M${x - w0 / 2} ${hem} L${xt - w1 / 2} -20 L${xt - w1 / 2 + w1 * 0.22} -20 L${x - w0 / 2 + w0 * 0.2} ${hem}Z`} fill="#232c46" />
      <path d={`M${x + w0 * 0.12} ${hem - 10} L${xt + w1 * 0.1} -20`} stroke="#4a5a80" strokeWidth="6" opacity=".6" />
      {front && <path d={`M${x - w0 / 2} ${hem} L${xt - w1 / 2} -20`} stroke="#151b2e" strokeWidth="5" />}
      {/* the hem break: a folded band, then the knee crease */}
      <path d={`M${x - w0 / 2 - 4} ${hem} Q${x} ${hem + 18} ${x + w0 / 2 + 4} ${hem} L${x + w0 / 2 + 2} ${hem - 22} Q${x} ${hem - 8} ${x - w0 / 2 - 2} ${hem - 22}Z`} fill="#3a4768" />
      <path d={`M${x - w0 * 0.3} ${hem - 150} q${w0 * 0.3} 14 ${w0 * 0.55} -4`} stroke="#232c46" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* the sun's rim on the right edge, the path's warm bounce at the bottom */}
      <path d={`M${x + w0 / 2 - 3} ${hem - 22} L${xt + w1 / 2 - 3} -20`} stroke={RIM} strokeWidth="5" opacity=".75" />
      <path d={`M${x - w0 / 2 + 6} ${hem - 30} L${x + w0 / 2 - 6} ${hem - 30}`} stroke="#e7b9a0" strokeWidth="10" opacity=".18" strokeLinecap="round" />
    </g>
  );
}

// a long soft cast shadow from a foot toward the front-left (the sun is low behind at the right)
const Cast = ({ x, y, w, len, o = 0.5 }) => (
  <path d={`M${x - w / 2} ${y} L${x + w / 2} ${y} L${x + w / 2 - len * 0.78} ${y + len * 0.42} L${x - w / 2 - len * 0.78} ${y + len * 0.42}Z`} fill={SH} opacity={o} filter="url(#fw-soft)" />
);

export default function FeetWalk() {
  const her = useMemo(() => nandaSVG({ stage: 1, emote: 'heart', talk: false, step: 'walk', lit: { side: 1, rim: RIM, bounce: '#efc3b0' } }), []);
  const petals = useMemo(() => [...Array(34)].map((_, i) => [(i * 211) % 1920, 640 + ((i * 97) % 440), (i * 47) % 180, 5 + (i % 3) * 2]), []);
  return (
    <svg className="art fw-walk" viewBox="0 0 1920 1080" aria-hidden="true">
      <defs>
        <linearGradient id="fw-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PATH} stopOpacity="0" /><stop offset=".16" stopColor={PATH} stopOpacity=".85" /><stop offset="1" stopColor="#c99f92" stopOpacity=".95" />
        </linearGradient>
        <filter id="fw-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
        <filter id="fw-far" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.4" /></filter>
      </defs>
      {/* the ground plane: the pink-gravel path, soft at the far edge (it melts into the blurred trace), petals + gravel */}
      <rect x="0" y="560" width="1920" height="520" fill="url(#fw-path)" />
      <g filter="url(#fw-far)">{petals.map(([x, y, r, s], i) => (i % 3 === 0
        ? <circle key={i} cx={x} cy={y} r={s * 0.8} fill="#a98478" opacity=".55" />
        : <ellipse key={i} cx={x} cy={y} rx={s * 1.8} ry={s} fill="#ffc6dc" transform={`rotate(${r} ${x} ${y})`} opacity=".9" />))}</g>
      {/* dappled light through the canopy on the path */}
      {[[260, 640, 120], [900, 800, 150], [1240, 660, 90], [1700, 860, 130], [520, 930, 110]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.32} fill="#fff1d2" opacity=".32" />)}
      {/* cast shadows first (on the ground, under every cel): long, toward the front-left */}
      <Cast x={532} y={720} w={180} len={300} /><Cast x={713} y={693} w={150} len={280} o={0.4} />
      <Cast x={HER.x} y={700} w={1000} len={360} o={0.16} />
      <Cast x={1640} y={746} w={220} len={380} /><Cast x={1390} y={704} w={190} len={340} o={0.4} />
      {/* YOU: the back leg (toe-off, farther) then the front leg (heel strike, nearer) */}
      {/* (each shoe first, then its jeans leg: the hem breaks OVER the tongue, ~30 px under the shoe's top) */}
      <Sneaker x={1390} gy={704} s={2.3} pose="heelUp" />
      <Jeans x={1390} hem={594} w0={172} w1={200} lean={50} />
      <Sneaker x={1640} gy={746} s={2.5} pose="toeUp" />
      <Jeans x={1640} hem={610} w0={192} w1={216} lean={-50} front />
      {/* HER: her own sprite (canon pins + shoes), the walk pose, rim + bounce from the park sun */}
      <g transform={`translate(${HER.x} ${HER.ground}) scale(${HER.s})`} dangerouslySetInnerHTML={{ __html: her }} />
    </svg>
  );
}
