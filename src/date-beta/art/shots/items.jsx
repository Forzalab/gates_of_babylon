// Hand-built SVG objects for insert shots. Each draws in a 600x600 box, centre (300, 300), soft ink outline + cel shade.
const INK = '#4a1f3a';
const O = { stroke: INK, strokeWidth: 6, strokeLinejoin: 'round', strokeLinecap: 'round' };

function Plate({ children, rim = '#fdf8ef' }) {
  return (<g>
    <ellipse cx="300" cy="360" rx="250" ry="120" fill="#000" opacity=".12" />
    <ellipse cx="300" cy="330" rx="250" ry="130" fill={rim} {...O} />
    <ellipse cx="300" cy="325" rx="190" ry="95" fill="#f3e9da" stroke="#e2d3bd" strokeWidth="4" />
    {children}
    <path d="M110 290 Q140 240 220 222" fill="none" stroke="#fff" strokeWidth="10" opacity=".8" strokeLinecap="round" />
  </g>);
}
const Rice = ({ x = 230, y = 320 }) => (<g>
  <path d={`M${x - 110} ${y + 10} Q${x - 100} ${y - 70} ${x} ${y - 78} Q${x + 100} ${y - 70} ${x + 104} ${y + 12} Q${x} ${y + 50} ${x - 110} ${y + 10}Z`} fill="#fffdf6" {...O} />
  {[[-60, -30], [-20, -50], [20, -40], [50, -20], [-40, 0], [10, -10], [60, 5]].map(([dx, dy], i) => <ellipse key={i} cx={x + dx} cy={y + dy} rx="9" ry="5" fill="#fff" stroke="#e8e0cf" strokeWidth="2" transform={`rotate(${i * 37} ${x + dx} ${y + dy})`} />)}
</g>);
const Steam = ({ x = 300, y = 170 }) => (<g fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity=".85">
  {[-60, 0, 60].map((d) => <path key={d} d={`M${x + d} ${y + 40} q-22 -30 0 -60 q22 -30 0 -60`} />)}
</g>);

export const ITEMS = {
  curry: () => (<g><Steam /><Plate>
    <Rice x={220} />
    <path d="M280 300 Q300 250 400 260 Q470 280 460 340 Q430 400 320 390 Q260 370 280 300Z" fill="#c7751c" {...O} />
    {[[340, 300, '#f1a33b'], [390, 320, '#e9582c'], [420, 300, '#f1a33b'], [360, 350, '#7fb24a']].map(([x, y, c], i) => <rect key={i} x={x - 16} y={y - 14} width="32" height="28" rx="7" fill={c} stroke={INK} strokeWidth="4" />)}
  </Plate></g>),
  'butter-chicken': () => (<g><Steam /><Plate rim="#fff4e6">
    <path d="M140 320 Q160 240 300 232 Q450 240 460 320 Q430 400 300 404 Q170 400 140 320Z" fill="#e8742d" {...O} />
    <path d="M190 300 Q300 270 410 300" fill="none" stroke="#fff6e8" strokeWidth="12" strokeLinecap="round" opacity=".9" />
    {[[230, 330], [300, 350], [370, 325], [280, 300], [350, 290]].map(([x, y], i) => <rect key={i} x={x - 22} y={y - 17} width="44" height="34" rx="12" fill="#f3a45a" stroke={INK} strokeWidth="4" />)}
    {[[250, 290], [330, 320], [390, 350]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l10 -12 l10 12 l-10 6z`} fill="#4c9a3a" />)}
    <path d="M430 210 Q520 220 540 300 Q470 320 430 210Z" fill="#f2cf8a" {...O} />
  </Plate></g>),
  katsu: () => (<g><Steam /><Plate>
    <Rice x={210} />
    <path d="M250 330 Q290 380 430 350 Q470 300 430 280 Q330 300 250 330Z" fill="#9b4e16" {...O} />
    <g transform="rotate(-8 360 280)">{[0, 1, 2, 3].map((i) => (
      <g key={i}><rect x={270 + i * 50} y="220" width="46" height="96" rx="10" fill="#e9a441" {...O} />
        <rect x={276 + i * 50} y="226" width="34" height="12" rx="5" fill="#fff" opacity=".6" /><rect x={276 + i * 50} y="296" width="34" height="14" rx="4" fill="#fbf3de" /></g>))}</g>
    <path d="M160 390 q20 -20 50 -10 q-20 25 -50 10Z" fill="#e9435a" {...O} />
  </Plate></g>),
  book: () => (<g transform="rotate(-6 300 300)">
    <rect x="150" y="120" width="310" height="390" rx="12" fill="#000" opacity=".14" transform="translate(14 14)" />
    <rect x="150" y="120" width="310" height="390" rx="12" fill="#3a5aa8" {...O} />
    <rect x="150" y="120" width="40" height="390" fill="#2c4486" stroke={INK} strokeWidth="6" />
    <rect x="440" y="130" width="20" height="370" fill="#fff8e8" stroke={INK} strokeWidth="4" />
    <rect x="230" y="190" width="180" height="120" rx="8" fill="#fbe7c4" stroke={INK} strokeWidth="5" />
    <path d="M320 270 C290 240 262 262 290 285 L320 305 L350 285 C378 262 350 240 320 270Z" fill="#ff5fa2" stroke={INK} strokeWidth="4" />
    <rect x="240" y="350" width="150" height="14" rx="7" fill="#fbe7c4" opacity=".8" /><rect x="260" y="378" width="110" height="10" rx="5" fill="#fbe7c4" opacity=".6" />
    <rect x="360" y="420" width="70" height="46" rx="4" fill="#fff" stroke={INK} strokeWidth="4" />
    <path d="M370 434 h50 M370 446 h40 M370 456 h30" stroke="#c43c6b" strokeWidth="3" />
    <path d="M410 120 v90 l14 -14 l14 14 v-90" fill="#ff5fa2" stroke={INK} strokeWidth="4" />
  </g>),
  grocery: () => (<g>
    <ellipse cx="300" cy="520" rx="200" ry="30" fill="#000" opacity=".14" />
    <path d="M220 150 Q220 90 260 90 M380 150 Q380 90 340 90" fill="none" stroke={INK} strokeWidth="10" />
    <path d="M210 130 Q170 180 190 250" fill="#7fb24a" {...O} /><path d="M200 140 q-40 -60 10 -90 q20 50 -10 90Z" fill="#9ccc5c" {...O} />
    <circle cx="380" cy="180" r="46" fill="#ff5a4e" {...O} /><path d="M380 134 q6 -20 22 -24" fill="none" stroke={INK} strokeWidth="5" />
    <rect x="280" y="120" width="60" height="120" rx="10" fill="#fff" {...O} /><rect x="280" y="150" width="60" height="30" fill="#8fd3ff" />
    <path d="M140 200 H460 L430 510 H170Z" fill="#e8c48f" {...O} />
    <path d="M140 200 H460 L455 240 H145Z" fill="#d7ad70" stroke={INK} strokeWidth="5" />
    <path d="M270 330 C250 310 225 330 245 350 L270 370 L295 350 C315 330 290 310 270 330Z" fill="#ff5fa2" stroke={INK} strokeWidth="4" />
    <text x="300" y="440" textAnchor="middle" className="shot-jp">八百屋</text>
  </g>),
  teacup: () => (<g><Steam y={150} />
    <ellipse cx="300" cy="430" rx="220" ry="60" fill="#fdf8ef" {...O} />
    <path d="M150 260 H450 Q450 420 300 430 Q150 420 150 260Z" fill="#fdfbf5" {...O} />
    <path d="M450 290 q70 0 60 60 q-8 50 -80 50" fill="none" stroke={INK} strokeWidth="18" /><path d="M450 290 q70 0 60 60 q-8 50 -80 50" fill="none" stroke="#fdfbf5" strokeWidth="7" />
    <ellipse cx="300" cy="262" rx="150" ry="34" fill="#b6c95a" {...O} />
    <ellipse cx="270" cy="255" rx="50" ry="8" fill="#e6f0a8" opacity=".8" />
    <path d="M200 330 q100 30 200 0" fill="none" stroke="#ff5fa2" strokeWidth="10" strokeLinecap="round" />
    <path d="M300 370 C285 355 265 370 282 385 L300 398 L318 385 C335 370 315 355 300 370Z" fill="#ff5fa2" />
  </g>),
  bento: () => (<g transform="rotate(4 300 300)">
    <rect x="100" y="150" width="400" height="320" rx="26" fill="#000" opacity=".14" transform="translate(12 14)" />
    <rect x="100" y="150" width="400" height="320" rx="26" fill="#2a1c30" {...O} />
    <rect x="120" y="170" width="200" height="280" rx="14" fill="#fffdf6" stroke="#e8e0cf" strokeWidth="4" />
    <circle cx="220" cy="310" r="30" fill="#d9304f" stroke={INK} strokeWidth="4" /><circle cx="212" cy="302" r="8" fill="#fff" opacity=".5" />
    <rect x="336" y="170" width="144" height="130" rx="12" fill="#3b2b3f" />
    {[0, 1, 2].map((i) => <g key={i}><rect x="346" y={182 + i * 36} width="124" height="32" rx="6" fill="#ffd34d" stroke={INK} strokeWidth="4" /><path d={`M352 ${198 + i * 36} q30 -8 60 0 q30 8 52 0`} fill="none" stroke="#f0a92a" strokeWidth="3" /></g>)}
    <rect x="336" y="316" width="144" height="134" rx="12" fill="#3b2b3f" />
    <path d="M350 420 q20 -80 60 -80 q50 0 56 80Z" fill="#7fb24a" stroke={INK} strokeWidth="4" />
    <path d="M360 350 l20 30 M430 345 l-10 35" stroke="#ff9aa8" strokeWidth="10" strokeLinecap="round" />
  </g>),
};
export const ITEM_LABEL = { curry: 'curry', 'butter-chicken': 'butter chicken', katsu: 'katsu curry', book: 'library book', grocery: 'groceries', teacup: 'tea', bento: 'bento',
  hands: 'click.', cups3: 'three cups', 'ic-card': 'loaded ♡', umbrella: 'one umbrella', key: 'her key', 'cups-end': 'empty / full', feet: 'her shoes, your shoes' };

const Cup = ({ x, y, full = true, k = 1 }) => (<g transform={`translate(${x} ${y}) scale(${k})`}>
  <path d="M-70 -40 H70 Q70 50 0 56 Q-70 50 -70 -40Z" fill="#fdfbf5" {...O} />
  <ellipse cx="0" cy="-40" rx="70" ry="18" fill={full ? '#b6c95a' : '#e8e0cf'} {...O} />
  <path d="M-40 10 q40 14 80 0" fill="none" stroke="#ff5fa2" strokeWidth="7" strokeLinecap="round" />
</g>);
// Sequence inserts (GAPS.md art-to-build)
Object.assign(ITEMS, {
  hands: () => (<g>
    <path d="M40 420 Q160 330 250 300 L330 300 Q360 330 330 360 L250 380 Q150 430 60 500Z" fill="#ffd9c4" {...O} />
    <path d="M560 180 Q450 250 380 280 L300 290 Q270 320 300 350 L390 340 Q470 300 560 260Z" fill="#fff0e6" {...O} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={250 + i * 22} y={250 + i * 6} width="26" height="110" rx="13" fill={i % 2 ? '#ffd9c4' : '#fff0e6'} stroke={INK} strokeWidth="5" transform={`rotate(${-18 + i * 4} ${263 + i * 22} ${305 + i * 6})`} />)}
    <path d="M300 200 C280 180 255 196 272 214 L300 236 L328 214 C345 196 320 180 300 200Z" fill="#ff5fa2" stroke={INK} strokeWidth="4" />
    <path d="M470 150 l20 -20 M500 170 l28 -8 M440 130 l4 -28" stroke="#ff5fa2" strokeWidth="7" strokeLinecap="round" />
  </g>),
  cups3: () => (<g>
    <path d="M160 260 Q160 120 300 120 Q440 120 440 260" fill="none" stroke={INK} strokeWidth="12" />
    <Cup x={200} y={250} k={0.8} full={false} /><Cup x={300} y={230} k={0.8} full={false} /><Cup x={400} y={250} k={0.8} full={false} />
    <path d="M100 260 H500 L460 500 H140Z" fill="#e8c48f" {...O} />
    {[190, 250, 310, 370, 420].map((x) => <path key={x} d={`M${x} 290 V470`} stroke="#c9a06a" strokeWidth="6" />)}
    <path d="M400 150 C388 136 368 148 382 162 L400 176 L418 162 C432 148 412 136 400 150Z" fill="#ff5fa2" stroke={INK} strokeWidth="4" />
  </g>),
  'ic-card': () => (<g>
    <rect x="120" y="330" width="360" height="200" rx="20" fill="#3a3f55" {...O} />
    <circle cx="300" cy="420" r="60" fill="#8fd3ff" stroke={INK} strokeWidth="5" />
    <path d="M270 420 q30 -40 60 0 M255 420 q45 -60 90 0" fill="none" stroke="#fff" strokeWidth="6" />
    <g transform="rotate(-14 300 250)"><rect x="170" y="140" width="260" height="165" rx="18" fill="#ff8fc6" {...O} />
      <rect x="190" y="160" width="60" height="44" rx="6" fill="#ffd34d" stroke={INK} strokeWidth="4" />
      <text x="410" y="285" textAnchor="end" className="shot-jp">IC ♡</text></g>
    <path d="M120 120 l-30 -30 M480 120 l30 -30 M300 80 v-40" stroke="#8fd3ff" strokeWidth="8" strokeLinecap="round" />
  </g>),
  umbrella: () => (<g>
    {[...Array(14)].map((_, i) => <path key={i} d={`M${60 + i * 38} ${60 + (i % 3) * 30} l-14 40`} stroke="#9fb4ff" strokeWidth="5" strokeLinecap="round" />)}
    <path d="M90 300 Q300 60 510 300 Q470 280 440 300 Q400 270 370 300 Q330 270 300 300 Q270 270 230 300 Q200 270 160 300 Q130 280 90 300Z" fill="#ff8fc6" {...O} />
    <path d="M300 300 V480 q0 30 -30 30" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
    <path d="M430 330 Q520 360 540 520 H400 Q400 400 430 330Z" fill="#8a7ff0" {...O} />
    <path d="M470 350 q20 60 10 120" stroke="#5a4fb8" strokeWidth="14" opacity=".6" fill="none" />
    <circle cx="500" cy="380" r="7" fill="#9fb4ff" /><circle cx="520" cy="420" r="6" fill="#9fb4ff" />
  </g>),
  key: () => (<g>
    <g transform="rotate(-24 330 250)"><circle cx="230" cy="250" r="70" fill="#ffd34d" {...O} /><circle cx="230" cy="250" r="26" fill="#fff0e6" stroke={INK} strokeWidth="5" />
      <path d="M296 238 H500 V262 H470 V300 H440 V262 H410 V290 H380 V262 H296Z" fill="#ffd34d" {...O} /></g>
    <path d="M100 520 Q140 380 230 340 L400 320 Q460 330 450 380 Q420 420 320 420 Q260 470 230 540Z" fill="#fff0e6" {...O} />
    <path d="M200 160 C185 145 162 158 178 176 L200 194 L222 176 C238 158 215 145 200 160Z" fill="#ff5fa2" stroke={INK} strokeWidth="4" />
    {[330, 370, 410].map((x) => <path key={x} d={`M${x} 350 q10 30 0 60`} fill="none" stroke={INK} strokeWidth="4" />)}
  </g>),
  'cups-end': () => (<g>
    <ellipse cx="300" cy="470" rx="260" ry="50" fill="#000" opacity=".2" />
    <Cup x={190} y={380} full={false} /><Cup x={420} y={380} full />
    <path d="M410 300 q-10 -30 10 -50 q20 -20 5 -50" fill="none" stroke="#fff" strokeWidth="7" opacity=".6" strokeLinecap="round" />
  </g>),
});

// Feet insert (V2 Yamada): her small pink shoes, toes pointed at your big purple sneakers. pose = 'park' (gravel, day) | 'wet' (street, puddle, rain).
const PINK = '#ff8fc6', PINK_D = '#ff5fa2', PURP = '#8a7ff0', PURP_D = '#5a4fb8';
const HerShoe = ({ x, y, r = 0, wet }) => (<g transform={`translate(${x} ${y}) rotate(${r})`}>
  <path d="M-18 -120 Q-26 -60 -22 -20 L22 -20 Q26 -60 18 -120Z" fill="#fff0e6" {...O} />
  <path d="M-20 -58 H20" stroke={INK} strokeWidth="4" opacity=".35" />
  <path d="M-46 -24 Q-50 -54 -8 -56 Q46 -56 58 -30 Q66 -6 40 4 H-38 Q-52 0 -46 -24Z" fill={PINK} {...O} />
  <path d="M-30 -40 Q4 -52 30 -40" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
  <circle cx="30" cy="-40" r="7" fill="#ffd34d" stroke={INK} strokeWidth="3" />
  <path d="M-44 4 H42" stroke={PINK_D} strokeWidth="8" strokeLinecap="round" />
  {wet && <path d="M-30 -30 q6 10 0 18 M48 -26 q6 10 0 18" stroke="#9fb4ff" strokeWidth="5" fill="none" strokeLinecap="round" />}
</g>);
const YourShoe = ({ x, y, r = 0 }) => (<g transform={`translate(${x} ${y}) rotate(${r})`}>
  <path d="M-34 -150 Q-40 -80 -34 -34 L34 -34 Q40 -80 34 -150Z" fill="#3a3f55" {...O} />
  <path d="M-70 -30 Q-74 -76 -16 -80 Q60 -82 84 -44 Q98 -12 62 6 H-58 Q-78 0 -70 -30Z" fill={PURP} {...O} />
  <path d="M-72 -4 H86" stroke="#fdfbf5" strokeWidth="12" strokeLinecap="round" />
  {[-20, 0, 20].map((d) => <path key={d} d={`M${d - 12} ${-66 + (d + 20) / 4} l24 6`} stroke="#fdfbf5" strokeWidth="5" strokeLinecap="round" />)}
  <path d="M-58 -52 Q-50 -64 -30 -66" fill="none" stroke={PURP_D} strokeWidth="6" strokeLinecap="round" />
</g>);
Object.assign(ITEMS, {
  feet: ({ pose = 'park' } = {}) => {
    const wet = pose === 'wet';
    return (<g>
      <ellipse cx="330" cy="500" rx="380" ry="120" fill={wet ? '#3b3f66' : '#cdb58c'} opacity=".8" /> {/* R5: a soft ground patch, no card */}
      {wet
        ? <g><ellipse cx="200" cy="470" rx="170" ry="36" fill="#6f7fd0" opacity=".7" stroke="#9fb4ff" strokeWidth="4" />
            <ellipse cx="200" cy="470" rx="90" ry="18" fill="none" stroke="#c9d4ff" strokeWidth="4" />
            {[...Array(12)].map((_, i) => <path key={i} d={`M${20 + i * 52} ${40 + (i % 4) * 40} l-12 44`} stroke="#9fb4ff" strokeWidth="5" strokeLinecap="round" />)}</g>
        : [...Array(26)].map((_, i) => <circle key={i} cx={(i * 97) % 620} cy={390 + ((i * 53) % 230)} r={5 + (i % 3) * 3} fill="#b89d74" />)}
      <HerShoe x={150} y={470} r={-6} wet={wet} /><HerShoe x={250} y={478} r={4} wet={wet} />
      <g transform="scale(-1 1) translate(-980 0)"><YourShoe x={420} y={500} r={-4} /><YourShoe x={540} y={506} r={3} /></g>
      <path d="M300 200 C282 180 256 196 274 216 L300 240 L326 216 C344 196 318 180 300 200Z" fill={PINK_D} stroke={INK} strokeWidth="4" />
    </g>);
  },
});
