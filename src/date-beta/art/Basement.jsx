// Basement (SCRIPT-v5 ESCAPE = BASEMENT): no new BG. Black + one CSS bulb (radial light, slow stepped sway; reduced
// motion = still) + SVG shelf props. The creep is in the LABELS. props.shelf picks what the bulb falls on:
// jars (date + first name, years back) · bentos (his name, one per day, oldest before they met) · usu (mortar, mallet,
// one mochi, hers only) · newest (today, his name, lid off, empty). props.jar = the bento pick (echo on the newest jar).
const JARS = [['2019.04.02', 'Kenji'], ['2020.11.19', 'Sora'], ['2022.02.14', 'Ren'], ['2023.08.30', 'Haru'], ['2025.06.07', 'Daichi']];
const BENTOS = ['2024.12.01', '2025.03.12', '2026.05.20', '2026.09.27', '2026.09.28'];
const today = () => { const d = new Date(); return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`; };

function Jar({ x, y, date, name, lit = true, empty = false, open = false }) {
  return (
    <g transform={`translate(${x} ${y})`} className={lit ? 'lit' : ''}>
      {!open && <rect x="-44" y="-128" width="88" height="22" rx="6" className="lid" />}
      <path d="M-52 -104H52V-8Q52 8 36 8H-36Q-52 8 -52 -8Z" className={`glass${empty ? ' empty' : ''}`} />
      {!empty && <path d="M-44 -64H44V-10Q44 0 34 0H-34Q-44 0 -44 -10Z" className="plums" />}
      <rect x="-40" y="-92" width="80" height="44" rx="4" className="label" />
      <text x="0" y="-74" className="lbl-date">{date}</text>
      <text x="0" y="-55" className="lbl-name">{name}</text>
    </g>
  );
}

export default function Basement({ props }) {
  const shelf = props.shelf ?? null;
  const on = (k) => shelf === k;
  return (
    <div className={`art basement shelf-${shelf ?? 'none'}`} role="img" aria-label={shelf ? `basement shelves: ${shelf}` : 'a dark basement, one bulb'}>
      <div className="bulb-wire" aria-hidden="true"><div className="bulb" /></div>
      <svg className="shelves" viewBox="0 0 1920 1080" aria-hidden="true">
        <rect x="1560" y="70" width="220" height="60" className="window" />
        <path d="M1600 70V130M1640 70V130M1680 70V130M1720 70V130" className="bars" />
        {[330, 560, 790].map((y) => <rect key={y} x="160" y={y} width="1600" height="18" className="plank" />)}
        <g className={`row${on('jars') ? ' on' : ''}`}>
          {JARS.map(([d, n], i) => <Jar key={d} x={260 + i * 150} y={330} date={d} name={n} />)}
        </g>
        <g className={`row${on('bentos') ? ' on' : ''}`}>
          {BENTOS.map((d, i) => (
            <g key={d} transform={`translate(${250 + i * 150} 560)`}>
              <rect x="-60" y="-70" width="120" height="70" rx="8" className="bento" />
              <path d="M-60 -48H60" className="band" />
              <text x="0" y="-18" className="lbl-name">you</text><text x="0" y="-58" className="lbl-date lt">{d}</text>
            </g>
          ))}
        </g>
        <g className={`row${on('usu') ? ' on' : ''}`} transform="translate(1250 790)">
          <path d="M-90 0L-70 -120H70L90 0Z" className="usu" /><ellipse cx="0" cy="-120" rx="70" ry="16" className="usu-top" />
          <path d="M60 -150L210 -300" className="kine-h" /><rect x="170" y="-360" width="130" height="56" rx="14" transform="rotate(-45 235 -332)" className="kine" />
          <ellipse cx="-230" cy="-22" rx="80" ry="12" className="plate" /><ellipse cx="-230" cy="-40" rx="44" ry="24" className="mochi" />
          <text x="-230" y="36" className="lbl-name lt">hers only</text>
        </g>
        <g className={`row newest${on('newest') ? ' on' : ''}`}>
          <Jar x={1510} y={330} date={today()} name="you" empty open />
          <g transform="translate(1640 318)"><rect x="-44" y="-10" width="88" height="22" rx="6" className="lid" transform="rotate(12)" /></g>
        </g>
        {props.jar && <text x="1510" y="380" className="lbl-date lt">{props.jar}</text>}
      </svg>
    </div>
  );
}
