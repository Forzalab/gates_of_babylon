// train-r4 vending machine (research/sprint-0930/train-r4/NOTES.md). The bento payoff: the v1 spine's vending echo
// (scenes.json beats 56/235, art/stationParts.jsx Vending) comes back on the platform.
// - PlatformVending: the platform machine for the wide shots (refs 01/02/06: a white + sky-blue box, frontal, with a
//   side IC panel, 4 drink rows, a dark take-out slot, and a teal じどうはんばいき header strip from ref 03). Its TOP
//   ROW swaps by the bento flag (props.drink): plum drinks (umeboshi) or egg-pudding drinks (tamagoyaki).
// - VendingInsert (bg `vending-insert`, v2-train beat 3): ref 09's composition. The glass fills the frame, the kawaii
//   labels have faces, the one drink she buys glows mid-left, and her pointing mitten reaches in from the lower right
//   (the sprite keeps the centre).
// Static SVG only; ids are prefixed per instance.
import { R3Scene, pts } from './parts.jsx';

// ---- the two bento drinks, kawaii labels (ref 09: fat outline, a face, a sparkle). Local box: 0..w x 0..h.
export function Drink({ kind = 'umeboshi', x, y, s = 1, glow = false }) {
  const ume = kind !== 'tamagoyaki';
  const ink = ume ? '#7a1030' : '#7a4a08';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className={`r4-drink r4-drink-${ume ? 'ume' : 'tama'}`}>
      {glow && <ellipse cx="30" cy="56" rx="52" ry="70" fill={ume ? '#ff9bb8' : '#ffe27a'} opacity=".55" />}
      {ume ? (
        // plum drink: a pink bottle, a round red umeboshi with a leaf and a face, うめ
        <g stroke={ink} strokeWidth="3.4" strokeLinejoin="round">
          <rect x="18" y="0" width="24" height="12" rx="3" fill="#ff5f8f" />
          <path d="M16 12h28q8 8 8 22v70q0 8 -8 8h-28q-8 0 -8 -8v-70q0 -14 8 -22z" fill="#ffd3e1" />
          <rect x="8" y="46" width="44" height="44" fill="#fff" />
          <circle cx="30" cy="68" r="15" fill="#e0304f" />
          <path d="M30 53q6 -8 13 -6q-4 7 -13 6z" fill="#5fbf6a" />
          <g stroke="none" fill={ink}><circle cx="25" cy="67" r="2.2" /><circle cx="35" cy="67" r="2.2" /></g>
          <path d="M27 73q3 3 6 0" fill="none" strokeWidth="2" />
          <ellipse cx="21" cy="72" rx="3" ry="1.8" fill="#ff9bb8" stroke="none" /><ellipse cx="39" cy="72" rx="3" ry="1.8" fill="#ff9bb8" stroke="none" />
          <text x="30" y="40" textAnchor="middle" className="r3-jp" fontSize="15" fill={ink} stroke="none">うめ</text>
        </g>
      ) : (
        // egg-pudding drink: a round yellow bottle, a pudding with caramel top and a face, プリン
        <g stroke={ink} strokeWidth="3.4" strokeLinejoin="round">
          <rect x="18" y="0" width="24" height="12" rx="3" fill="#8a4a18" />
          <path d="M16 12h28q10 10 10 26v66q0 8 -8 8h-32q-8 0 -8 -8v-66q0 -16 10 -26z" fill="#fff2b8" />
          <rect x="6" y="46" width="48" height="44" fill="#fff" />
          <path d="M18 84l4 -24h16l4 24z" fill="#ffd23f" />
          <path d="M22 60q8 -6 16 0v4q-8 -4 -16 0z" fill="#9a5a1c" />
          <g stroke="none" fill={ink}><circle cx="26" cy="72" r="2.2" /><circle cx="34" cy="72" r="2.2" /></g>
          <path d="M28 77q2 2.4 4 0" fill="none" strokeWidth="2" />
          <text x="30" y="40" textAnchor="middle" className="r3-jp" fontSize="14" fill={ink} stroke="none">プリン</text>
        </g>
      )}
      <path d="M50 8l2.4 -6l2.4 6l6 2.4l-6 2.4l-2.4 6l-2.4 -6l-6 -2.4z" fill="#fff" stroke={ink} strokeWidth="1.6" />
    </g>
  );
}

// filler drinks on the other rows: plain flat cans/bottles in the refs' mixed colours (no brands)
const FILL = ['#7fc4ff', '#ff9d6b', '#8fd6a0', '#ffe07a', '#c9b3ff', '#f4f4f4', '#ff8fb0'];
function Filler({ x, y, w, h, c }) {
  return (
    <g>
      <rect x={x} y={y + h * 0.18} width={w} height={h * 0.82} rx={w * 0.2} fill={c} stroke="#3d5566" strokeWidth="2" />
      <rect x={x + w * 0.25} y={y} width={w * 0.5} height={h * 0.22} rx="2" fill="#dfe8ee" stroke="#3d5566" strokeWidth="2" />
      <rect x={x} y={y + h * 0.5} width={w} height={h * 0.2} fill="#fff" opacity=".75" />
    </g>
  );
}

// ref 09 filler: a juice box with a face (the insert only; the wide shot keeps plain cans)
function Cute({ x, y, c }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke="#6b4a8a" strokeWidth="3.4" strokeLinejoin="round">
      <path d="M0 30l18 -18h72l-18 18z" fill="#fff" /><path d="M72 30l18 -18v130l-18 18z" fill={c} opacity=".75" />
      <rect x="0" y="30" width="72" height="130" rx="4" fill={c} />
      <rect x="54" y="-6" width="8" height="30" rx="3" fill="#fff" />
      <g stroke="none" fill="#6b4a8a"><circle cx="24" cy="92" r="3.4" /><circle cx="48" cy="92" r="3.4" /></g>
      <path d="M31 101q5 5 10 0" fill="none" strokeWidth="2.4" />
      <ellipse cx="17" cy="102" rx="5" ry="3" fill="#ff9bb8" stroke="none" /><ellipse cx="55" cy="102" rx="5" ry="3" fill="#ff9bb8" stroke="none" />
    </g>
  );
}

// The platform machine, frontal. x, y = top-left; w x h (about 1 : 1.8, ref 01). drink = the bento echo row.
export function PlatformVending({ x, y, w, h, drink = 'umeboshi', id = 'pv' }) {
  const gx = x + w * 0.07, gw = w * 0.86, gy = y + h * 0.1, gh = h * 0.44, rows = 4, cols = 6;
  const cw = gw / cols, rh = gh / rows;
  return (
    <g className="r4-vending" data-drink={drink}>
      {/* the long 4:30 shadow, down-left */}
      <polygon points={pts([[x, y + h], [x + w, y + h], [x - w * 0.9, y + h * 1.22], [x - w * 1.3, y + h * 1.18]])} fill="#1a1410" opacity=".26" />
      <rect x={x - w * 0.16} y={y + h * 0.18} width={w * 0.16} height={h * 0.8} rx="4" fill="#cfd9df" stroke="#7d8e98" strokeWidth="3" />
      <rect x={x - w * 0.12} y={y + h * 0.26} width={w * 0.08} height={h * 0.08} rx="3" fill="#2f8fd6" />
      <rect x={x} y={y} width={w} height={h} rx="8" fill="#f7fbfd" stroke="#7d8e98" strokeWidth="4" />
      <rect x={x} y={y} width={w} height={h * 0.07} rx="8" fill="#12a3ac" />
      <text x={x + w / 2} y={y + h * 0.055} textAnchor="middle" className="r3-jp" fontSize={h * 0.042} fill="#fff">じどうはんばいき</text>
      {/* the drink window */}
      <rect x={gx - 6} y={gy - 6} width={gw + 12} height={gh + 12} rx="6" fill="#bfe3f4" stroke="#7d8e98" strokeWidth="3" />
      {Array.from({ length: rows }, (_, r) => (
        <g key={r}>
          {Array.from({ length: cols }, (_, c) => (r === 0
            ? <Drink key={c} kind={drink} x={gx + c * cw + cw * 0.08} y={gy + r * rh + rh * 0.05} s={(rh * 0.8) / 112} />
            : <Filler key={c} x={gx + c * cw + cw * 0.22} y={gy + r * rh + rh * 0.14} w={cw * 0.56} h={rh * 0.66} c={FILL[(c + r * 3) % FILL.length]} />))}
          <rect x={gx} y={gy + (r + 1) * rh - rh * 0.12} width={gw} height={rh * 0.1} fill="#e6f2f8" />
          <g fill="#ff5f8f">{Array.from({ length: cols }, (_, c) => <rect key={c} x={gx + c * cw + cw * 0.36} y={gy + (r + 1) * rh - rh * 0.1} width={cw * 0.28} height={rh * 0.06} rx="2" />)}</g>
        </g>
      ))}
      {/* the top-row tag: which drink is today's (the echo) */}
      <rect x={gx + gw * 0.62} y={gy - h * 0.05} width={gw * 0.38} height={h * 0.045} rx="6" fill="#ff5f8f" />
      <text x={gx + gw * 0.81} y={gy - h * 0.016} textAnchor="middle" className="r3-sign" fontSize={h * 0.032} fill="#fff">{drink === 'tamagoyaki' ? 'NEW! ぷりん' : 'NEW! うめ'}</text>
      {/* the lower panel (ref 04's loud art, kawaii): sky blue with clouds and a plum/pudding mascot */}
      <rect x={gx} y={y + h * 0.6} width={gw * 0.62} height={h * 0.2} rx="6" fill="#bfe3ff" />
      <ellipse cx={gx + gw * 0.16} cy={y + h * 0.66} rx={gw * 0.12} ry={h * 0.02} fill="#fff" />
      <Drink kind={drink} x={gx + gw * 0.36} y={y + h * 0.615} s={(h * 0.17) / 112} />
      <rect x={gx + gw * 0.68} y={y + h * 0.6} width={gw * 0.32} height={h * 0.2} rx="6" fill="#e3eaef" stroke="#7d8e98" strokeWidth="2" />
      <rect x={gx + gw * 0.76} y={y + h * 0.63} width={gw * 0.16} height={h * 0.03} rx="2" fill="#253540" />
      <circle cx={gx + gw * 0.84} cy={y + h * 0.72} r={gw * 0.05} fill="#2f8fd6" />
      <rect x={gx + gw * 0.1} y={y + h * 0.85} width={gw * 0.8} height={h * 0.09} rx="6" fill="#253540" />
      <rect x={x + w * 0.02} y={y + h - 8} width={w * 0.96} height="10" fill="#9fb0ba" />
    </g>
  );
}

// v2-train 3: the insert (ref 09). The machine's glass fills the frame; her drink glows on the middle shelf, up-left
// of the sprite (the ref's girl points up-left at one bottle); her pink mitten reaches in from behind her body.
export function VendingInsert({ props, rm }) {
  const drink = props?.drink === 'tamagoyaki' ? 'tamagoyaki' : 'umeboshi';
  const other = drink === 'umeboshi' ? 'tamagoyaki' : 'umeboshi';
  const SH = [132, 352, 572]; // shelf tops (the box starts at y 773; the HUD bar ends at y 110)
  const COLS = [150, 390, 630, 870, 1110, 1350, 1590];
  const over = (
    <g>
      {/* machine body + the pastel frame (ref 09 pink machine -> her pink) */}
      <rect x="40" y="96" width="1840" height="1000" rx="40" fill="#ffc4de" stroke="#d1177f" strokeWidth="8" />
      <rect x="84" y="118" width="1752" height="960" rx="26" fill="#eadcff" stroke="#b58ae0" strokeWidth="6" />
      {/* ref 09's dotted back wall behind the shelves */}
      <g fill="#d9c4fa">{Array.from({ length: 13 * 8 }, (_, i) => <circle key={i} cx={120 + (i % 13) * 140 + ((i / 13 | 0) % 2) * 70} cy={150 + (i / 13 | 0) * 120} r="9" />)}</g>
      {SH.map((y, r) => (
        <g key={y}>
          {COLS.map((x, c) => {
            const hero = r === 1 && c === 2;
            const kind = hero ? drink : (r + c) % 3 === 0 ? other : drink;
            const plain = !hero && (r * 7 + c) % 4 === 3;
            return (
              <g key={c}>
                {plain ? <Cute x={x + 34} y={y + 34} c={FILL[(c + r * 2) % FILL.length]} />
                  : <Drink kind={kind} x={x + (hero ? -6 : 18)} y={y + (hero ? -16 : 8)} s={hero ? 2.05 : 1.72} glow={hero} />}
              </g>
            );
          })}
          {/* shelf lip + price tags */}
          <rect x="100" y={y + 196} width="1720" height="24" rx="6" fill="#c9a6f0" />
          <rect x="100" y={y + 220} width="1720" height="10" fill="#9c78c8" />
          {COLS.map((x) => <g key={x}><rect x={x + 38} y={y + 199} width="80" height="18" rx="4" fill="#fff" /><text x={x + 78} y={y + 214} textAnchor="middle" className="r3-sign" fontSize="15" fill="#6b0f45">¥130</text></g>)}
        </g>
      ))}
      {/* glass: soft diagonal gloss bands (still) */}
      <polygon points="1360,118 1560,118 1060,1078 860,1078" fill="#fff" opacity=".16" />
      <polygon points="1620,118 1676,118 1176,1078 1120,1078" fill="#fff" opacity=".14" />
      {/* the hero sparkle + her tag on it */}
      <g transform="translate(700 350)">
        <path transform="translate(96 20)" d="M0 -60l10 -26l10 26l26 10l-26 10l-10 26l-10 -26l-26 -10z" fill="#fff" stroke="#d1177f" strokeWidth="3" />
        <rect x="-150" y="-8" width="128" height="44" rx="12" fill="#ff5f8f" stroke="#fff" strokeWidth="4" />
        <text x="-86" y="23" textAnchor="middle" className="r3-sign" fontSize="28" fill="#fff">SAME ♡</text>
      </g>
      {/* r5 (AUDIT 059): no drawn-in sleeve + mitten here any more: her sprite stands in front of the glass (the near
          frame) and holds the can she just bought in her own pin hand (packs/r5-ume.json) */}
    </g>
  );
  return (
    <R3Scene id="vending-insert" trace="station-ads" tone="afternoon" rm={rm} cam="scale(2.4) translate(-20 -300)" over={over}
      label={`Close-up of the platform vending machine's glass: rows of cute drinks with faces; she points at one ${drink === 'tamagoyaki' ? 'egg pudding drink' : 'plum drink'}, the same taste you picked at lunch.`} />
  );
}
