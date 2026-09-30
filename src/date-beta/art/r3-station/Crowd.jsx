// train-r4 crowd (research/sprint-0930/train-r4/NOTES.md, refs 07-08): flat silhouette commuters in 2 depth layers
// (back = small, light, hazy; front = big, dark, rim-lit by the low 4:30 sun), long floor shadows, and still sun
// shafts. Plus the two bumpers Nanda names in beat 5, drawn so they read at a glance and match her styled spans:
// WAVY = a big wavy-haired guy with a teal scarf (the {wavy:} teal); CAP = a guy in an orange cap + backpack (the {hat:} orange).
// Everything is static SVG (no animation). A person = feet point (x, y) + height h; seeded, so every render is identical.
import { rng } from '../util.js';

const f = (n) => Math.round(n * 10) / 10;

// one commuter silhouette as path data (feet at x, y). kind: coat | skirt | pack | bag | phone | bun
function body(x, y, h, kind, flip = 1) {
  const hw = h * 0.13, hem = kind === 'coat' ? 0.3 : kind === 'skirt' ? 0.36 : 0.44, sh = y - h * 0.83, hy = y - h * hem;
  const head = `M${f(x - h * 0.068)} ${f(y - h * 0.92)}a${f(h * 0.068)} ${f(h * 0.078)} 0 1 0 ${f(h * 0.136)} 0a${f(h * 0.068)} ${f(h * 0.078)} 0 1 0 ${f(-h * 0.136)} 0Z`;
  const neck = `M${f(x - h * 0.03)} ${f(y - h * 0.86)}h${f(h * 0.06)}v${f(h * 0.05)}h${f(-h * 0.06)}Z`;
  const torso = `M${f(x - hw)} ${f(sh + h * 0.03)}Q${f(x - hw)} ${f(sh)} ${f(x - hw * 0.6)} ${f(sh)}H${f(x + hw * 0.6)}Q${f(x + hw)} ${f(sh)} ${f(x + hw)} ${f(sh + h * 0.03)}`
    + `L${f(x + hw * (kind === 'skirt' ? 1.5 : 1.12))} ${f(hy)}H${f(x - hw * (kind === 'skirt' ? 1.5 : 1.12))}Z`;
  const legs = `M${f(x - hw * 0.8)} ${f(hy - 1)}h${f(hw * 0.7)}l${f(-hw * 0.05)} ${f(y - hy + 1)}h${f(-hw * 0.6)}Z`
    + `M${f(x + hw * 0.1)} ${f(hy - 1)}h${f(hw * 0.7)}l${f(hw * 0.05)} ${f(y - hy + 1)}h${f(-hw * 0.6)}Z`;
  let extra = '';
  if (kind === 'pack') extra = `M${f(x - flip * hw * 1.05)} ${f(sh + h * 0.04)}h${f(-flip * h * 0.09)}v${f(h * 0.26)}h${f(flip * h * 0.09)}Z`;
  if (kind === 'bag') extra = `M${f(x + flip * hw * 1.1)} ${f(y - h * 0.5)}h${f(flip * h * 0.1)}v${f(h * 0.12)}h${f(-flip * h * 0.1)}Z`;
  if (kind === 'bun') extra = `M${f(x - h * 0.03)} ${f(y - h * 1.0)}a${f(h * 0.04)} ${f(h * 0.04)} 0 1 0 ${f(h * 0.08)} 0a${f(h * 0.04)} ${f(h * 0.04)} 0 1 0 ${f(-h * 0.08)} 0Z`;
  return head + neck + torso + legs + extra;
}
const KINDS = ['coat', 'pack', 'bag', 'skirt', 'phone', 'coat', 'bun', 'bag'];

// people = [[x, y, h], ...]; tone = { fill, rim, op }; sun = rim light side (+1 right)
function Layer({ people, fill, rim, op = 1, seed, shadow = true, sun = 1 }) {
  const r = rng(seed);
  const ps = people.map(([x, y, h], i) => ({ x, y, h, kind: KINDS[(i + Math.floor(r() * 8)) % 8], flip: r() > 0.5 ? 1 : -1 }));
  const d = ps.map((p) => body(p.x, p.y, p.h, p.kind, p.flip)).join('');
  const lit = ps.map((p) => body(p.x + sun * Math.max(2, p.h * 0.008), p.y, p.h, p.kind, p.flip)).join('');
  // long shadows: the sun is low on the right, so each shadow falls down-left across the floor
  const sh = ps.map((p) => `M${f(p.x - p.h * 0.09)} ${f(p.y)}L${f(p.x + p.h * 0.09)} ${f(p.y)}L${f(p.x - p.h * 0.62)} ${f(p.y + p.h * 0.2)}L${f(p.x - p.h * 0.8)} ${f(p.y + p.h * 0.17)}Z`).join('');
  const phones = ps.filter((p) => p.kind === 'phone').map((p) => (
    <rect key={`${p.x}`} x={f(p.x + p.flip * p.h * 0.02)} y={f(p.y - p.h * 0.8)} width={f(p.h * 0.04)} height={f(p.h * 0.06)} rx="2" fill="#cfeaff" opacity=".9" />
  ));
  return (
    <g opacity={op}>
      {shadow && <path d={sh} fill="#1a1410" opacity=".28" />}
      {rim && <path d={lit} fill={rim} />}
      <path d={d} fill={fill} />
      {phones}
    </g>
  );
}

// still sun shafts through the roof (ref 07): warm translucent bands, top-right -> floor
export function Shafts({ id, bands, op = 0.2 }) {
  return (
    <g aria-hidden="true" pointerEvents="none" style={{ mixBlendMode: 'screen' }}>
      <defs>
        <linearGradient id={`${id}-shaft`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1c8" stopOpacity={op * 1.5} /><stop offset="1" stopColor="#ffd28a" stopOpacity={op * 0.4} />
        </linearGradient>
      </defs>
      {bands.map((b, i) => <polygon key={i} points={b} fill={`url(#${id}-shaft)`} />)}
    </g>
  );
}

// The two bumpers. x, y = feet, h = height. mood: 'plain' | 'laugh' (beat 4: they laugh) | 'named' (beat 5: she calls them out)
export function WavyGuy({ x, y, h, mood = 'plain', ink = '#1f2a36' }) {
  const hw = h * 0.14, top = y - h;
  // the hair: a big wavy mop, 7 bumps round the head (the identifier)
  const bumps = Array.from({ length: 8 }, (_, i) => {
    const a = Math.PI * (1.05 + (i / 7) * 0.9), R = h * 0.105;
    return [x + Math.cos(a) * R, top + h * 0.1 + Math.sin(a) * R * 0.9];
  });
  const hair = `M${f(x - h * 0.1)} ${f(top + h * 0.13)}` + bumps.map(([bx, by], i) => `Q${f(bx + (i % 2 ? 6 : -6))} ${f(by - h * 0.05)} ${f(bx)} ${f(by)}`).join('') + `L${f(x + h * 0.11)} ${f(top + h * 0.14)}Q${f(x + h * 0.13)} ${f(top + h * 0.2)} ${f(x + h * 0.1)} ${f(top + h * 0.22)}Q${f(x)} ${f(top + h * 0.16)} ${f(x - h * 0.11)} ${f(top + h * 0.22)}Q${f(x - h * 0.14)} ${f(top + h * 0.18)} ${f(x - h * 0.1)} ${f(top + h * 0.13)}Z`;
  return (
    <g className="r4-bumper r4-wavy">
      <path d={body(x, y, h * 1.0, 'coat')} fill={ink} />
      <path d={hair} fill={ink} stroke={mood === 'named' ? '#12a3ac' : '#3a4a5a'} strokeWidth={mood === 'named' ? 6 : 3} strokeLinejoin="round" />
      {/* a light wave line through the hair so the curls read even in silhouette */}
      <path d={`M${f(x - h * 0.08)} ${f(top + h * 0.07)}q${f(h * 0.02)} ${f(-h * 0.02)} ${f(h * 0.04)} 0t${f(h * 0.04)} 0t${f(h * 0.04)} 0t${f(h * 0.04)} 0`} fill="none" stroke="#6f8494" strokeWidth="3" strokeLinecap="round" />
      {/* the teal scarf */}
      <path d={`M${f(x - hw * 0.9)} ${f(y - h * 0.84)}h${f(hw * 1.8)}v${f(h * 0.05)}h${f(-hw * 1.8)}Z M${f(x + hw * 0.3)} ${f(y - h * 0.8)}h${f(h * 0.045)}v${f(h * 0.17)}h${f(-h * 0.045)}Z`} fill="#12a3ac" stroke="#0a6670" strokeWidth="2" />
      {mood === 'laugh' && <Laugh x={x - h * 0.2} y={top + h * 0.02} flip={-1} />}
      {mood === 'named' && <Tag x={x} y={top - h * 0.08} kind="wavy" />}
    </g>
  );
}

export function CapGuy({ x, y, h, mood = 'plain', ink = '#1f2a36' }) {
  const top = y - h, hx = x, hy = top + h * 0.09, hw = h * 0.14;
  return (
    <g className="r4-bumper r4-cap">
      <path d={body(x, y, h, 'pack', 1)} fill={ink} />
      {/* the backpack strap + a tourist camera, flat */}
      <path d={`M${f(x - hw * 0.5)} ${f(y - h * 0.82)}l${f(hw * 0.3)} ${f(h * 0.26)}`} stroke="#3a4a5a" strokeWidth="5" />
      <rect x={f(x + hw * 0.1)} y={f(y - h * 0.6)} width={f(h * 0.07)} height={f(h * 0.045)} rx="3" fill="#3a4a5a" />
      {/* the orange cap: crown + a long brim pointing right (the identifier) */}
      <path d={`M${f(hx - h * 0.075)} ${f(hy)}Q${f(hx - h * 0.075)} ${f(hy - h * 0.085)} ${f(hx)} ${f(hy - h * 0.085)}Q${f(hx + h * 0.075)} ${f(hy - h * 0.085)} ${f(hx + h * 0.078)} ${f(hy)}Z`}
        fill="#f08a2c" stroke={mood === 'named' ? '#a3400a' : '#8a3c0c'} strokeWidth={mood === 'named' ? 5 : 3} strokeLinejoin="round" />
      <path d={`M${f(hx + h * 0.02)} ${f(hy - h * 0.004)}h${f(h * 0.12)}q${f(h * 0.012)} ${f(h * 0.016)} ${f(-h * 0.01)} ${f(h * 0.02)}h${f(-h * 0.11)}Z`} fill="#d06a14" stroke="#8a3c0c" strokeWidth="2" />
      <circle cx={f(hx)} cy={f(hy - h * 0.087)} r={f(h * 0.009)} fill="#fff" />
      {mood === 'laugh' && <Laugh x={x + h * 0.22} y={top + h * 0.02} flip={1} />}
      {mood === 'named' && <Tag x={x} y={top - h * 0.1} kind="hat" />}
    </g>
  );
}

// "HA HA" + two laugh ticks, flat comic lettering (still)
function Laugh({ x, y, flip }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${flip * 8})`}>
      <text textAnchor="middle" className="r3-sign" fontSize="40" fill="#fff" stroke="#1f2a36" strokeWidth="7" paintOrder="stroke">HA HA</text>
      <path d={`M${flip * 58} -34 l${flip * 12} -10 M${flip * 62} -16 l${flip * 16} -2`} stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

// beat 5: she names them. The same marks as her styled spans: a teal wave chip, an orange cap chip.
function Tag({ x, y, kind }) {
  const wavy = kind === 'wavy';
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <rect x="-42" y="-30" width="84" height="46" rx="12" fill={wavy ? '#e2f7f8' : '#ffe2c6'} stroke={wavy ? '#0a6670' : '#a3400a'} strokeWidth="4" />
      {wavy
        ? <path d="M-28 -7q7 -10 14 0t14 0t14 0t14 0" fill="none" stroke="#0a6670" strokeWidth="5" strokeLinecap="round" />
        : <g fill="#a3400a"><path d="M-16 4C-16 -8 -8 -16 0 -16s16 8 16 20Z" /><path d="M-22 4h44v5h-44Z" /></g>}
      <path d="M-8 16l8 12l8 -12Z" fill={wavy ? '#0a6670' : '#a3400a'} />
    </g>
  );
}

// a crowd: back + front layers from seeded placements inside given x bands (keeps Nanda's centre and the key props clear)
export function Crowd({ seed, back, front, backTone = '#7d8d99', frontTone = '#222c36', rim = '#f6c98a' }) {
  return (
    <g className="r4-crowd" aria-hidden="true">
      <Layer people={back} fill={backTone} op={0.9} seed={seed} rim={null} shadow />
      <Layer people={front} fill={frontTone} rim={rim} seed={seed + 1} />
    </g>
  );
}

// seeded placements: n people along a floor line y0..y1 across [xa, xb], heights hMin..hMax (perspective: lower = taller)
export function scatter(seed, n, [xa, xb], [y0, y1], [hMin, hMax]) {
  const r = rng(seed);
  return Array.from({ length: n }, () => {
    const t = r();
    return [f(xa + r() * (xb - xa)), f(y0 + t * (y1 - y0)), f(hMin + t * (hMax - hMin))];
  }).sort((a, b) => a[1] - b[1]);
}
