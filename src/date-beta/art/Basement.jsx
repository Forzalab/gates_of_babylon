// Basement (SCRIPT-v5 ESCAPE = BASEMENT): no new BG. Black + one CSS bulb (radial light, slow stepped sway; reduced
// motion = still) + SVG shelf props. The creep is in the LABELS. props.shelf picks what the bulb falls on:
// jars (dates only, years back; the names are gone, only the dates are kept) · bentos (his name, one per day, oldest before
// they met) · usu (mortar, mallet, one mochi, hers only) · newest (TODAY'S jar: "Kemey" + today's date, lid off, empty,
// under a second warm lamp of its own). props.jar = the bento pick (echo on the newest jar).
// Layout (UX fix pack, REPORT-B #4): the top plank sits below the place chip (chip ends y ~240) and today's jar sits on
// the right of the top shelf (x 1300..1500, y 150..420), clear of the chip and of the dialogue box (text beats: y >= 770;
// choice beats: y 520..760). Static art: no motion of its own.
export const TODAY_NAME = 'Kemey';
const JARS = ['2019.04.02', '2020.11.19', '2022.02.14', '2023.08.30', '2025.06.07'];
const BENTOS = ['2024.12.01', '2025.03.12', '2026.05.20', '2026.09.27', '2026.09.28'];
export const today = (d = new Date()) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
const TOP = 360, MID = 560, LOW = 730; // plank tops
const KEMEY = { x: 1400, y: TOP }; // today's jar (bottom centre)

function Jar({ x, y, date, name = null, s = 1, empty = false, open = false, className = '' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className={className}>
      {!open && <rect x="-44" y="-128" width="88" height="22" rx="6" className="lid" />}
      <path d="M-52 -104H52V-8Q52 8 36 8H-36Q-52 8 -52 -8Z" className={`glass${empty ? ' empty' : ''}`} />
      {!empty && <path d="M-44 -64H44V-10Q44 0 34 0H-34Q-44 0 -44 -10Z" className="plums" />}
      <rect x="-48" y="-94" width="96" height={name ? 50 : 30} rx="4" className="label" />
      <text x="0" y={name ? -77 : -73} className="lbl-date">{date}</text>
      {name && <text x="0" y="-53" className="lbl-name">{name}</text>}
      {empty && <path d="M-40 -30Q0 -22 40 -30" className="glass-hi" />}
    </g>
  );
}

// The second lamp: a small shaded work lamp on its own wire, right over today's jar. Its warm pool is SVG (static).
function Lamp({ x }) {
  return (
    <g className="lamp2" transform={`translate(${x} 0)`}>
      <path d="M0 0V96" className="lamp2-wire" />
      <path d="M-34 138L-14 96H14L34 138Z" className="lamp2-shade" />
      <ellipse cx="0" cy="140" rx="16" ry="7" className="lamp2-bulb" />
    </g>
  );
}

export default function Basement({ props }) {
  const shelf = props.shelf ?? null;
  const on = (k) => shelf === k;
  const date = today();
  return (
    <div className={`art basement shelf-${shelf ?? 'none'}`} role="img"
      aria-label={shelf === 'newest' ? `basement shelf: today's jar, ${TODAY_NAME}, ${date}, lid off, empty` : shelf ? `basement shelves: ${shelf}` : 'a dark basement, one bulb'}>
      <div className="bulb-wire" aria-hidden="true"><div className="bulb" /></div>
      <svg className="shelves" viewBox="0 0 1920 1080" aria-hidden="true">
        <defs>
          <radialGradient id="bsLamp2" cx="50%" cy="38%" r="60%">
            <stop offset="0" stopColor="#ffc46b" stopOpacity=".62" /><stop offset=".45" stopColor="#ff9a3c" stopOpacity=".22" /><stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bsPool" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#ffcf7a" stopOpacity=".55" /><stop offset="1" stopColor="#ffcf7a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="1600" y="70" width="180" height="56" className="window" />
        <path d="M1636 70V126M1672 70V126M1708 70V126M1744 70V126" className="bars" />
        {[TOP, MID, LOW].map((y) => <rect key={y} x="160" y={y} width="1600" height="18" className="plank" />)}
        <g className={`row${on('jars') ? ' on' : ''}`}>
          {JARS.map((d, i) => <Jar key={d} x={260 + i * 150} y={TOP} date={d} />)}
        </g>
        <g className={`row${on('bentos') ? ' on' : ''}`}>
          {BENTOS.map((d, i) => (
            <g key={d} transform={`translate(${250 + i * 150} ${MID})`}>
              <rect x="-60" y="-70" width="120" height="70" rx="8" className="bento" />
              <path d="M-60 -48H60" className="band" />
              <text x="0" y="-18" className="lbl-name lt">you</text><text x="0" y="-58" className="lbl-date lt">{d}</text>
            </g>
          ))}
        </g>
        <g className={`row${on('usu') ? ' on' : ''}`} transform={`translate(1250 ${LOW})`}>
          <path d="M-90 0L-70 -120H70L90 0Z" className="usu" /><ellipse cx="0" cy="-120" rx="70" ry="16" className="usu-top" />
          <path d="M60 -150L210 -300" className="kine-h" /><rect x="170" y="-360" width="130" height="56" rx="14" transform="rotate(-45 235 -332)" className="kine" />
          <ellipse cx="-230" cy="-22" rx="80" ry="12" className="plate" /><ellipse cx="-230" cy="-40" rx="44" ry="24" className="mochi" />
          <text x="-230" y="36" className="lbl-name lt">hers only</text>
        </g>
        <g className={`row newest${on('newest') ? ' on' : ''}`}>
          <ellipse cx={KEMEY.x} cy={KEMEY.y - 110} rx="230" ry="210" fill="url(#bsLamp2)" className="lamp2-glow" />
          <ellipse cx={KEMEY.x} cy={KEMEY.y + 4} rx="170" ry="16" fill="url(#bsPool)" />
          <Lamp x={KEMEY.x} />
          <Jar x={KEMEY.x} y={KEMEY.y} s={1.45} date={date} name={TODAY_NAME} empty open className="today" />
          <g transform={`translate(${KEMEY.x + 128} ${KEMEY.y - 12})`}><rect x="-44" y="-10" width="88" height="22" rx="6" className="lid" transform="rotate(12)" /></g>
          {props.jar && <text x={KEMEY.x} y={KEMEY.y + 50} className="lbl-date lt echo">{props.jar}</text>}
        </g>
      </svg>
    </div>
  );
}
