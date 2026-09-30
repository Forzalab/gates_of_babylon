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
export const ITEM_LABEL = { curry: 'curry', 'butter-chicken': 'butter chicken', katsu: 'katsu curry', book: 'library book', grocery: 'groceries', teacup: 'tea', bento: 'bento' };
