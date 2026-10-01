// curry-street (v2-curry 5, the napkin line, on the way out of the curry house at 3:40): ref 05, the lantern street,
// graded from its pink sunset to afternoon in prep (blue sky, warm daylight; the lanterns unlit).
// Hand pass: the poles straightened, the curry house's indigo noren (カ・レ・ー, the same shop as `curry-house`) on the
// left shop, a clock on the pole at 3:40 (both above the dialogue box), the neon mush redrawn: 花や / FLOWERS, そば.
import { R3Scene, Plate, preloadTrace } from './parts.jsx';
import { Mid, CurryFront } from '../sandwichFronts.jsx';

preloadTrace('curry-street');
const T = 'afternoon';

function Poles() {
  return (
    <g fill="#b89c8e">
      {[[505, 400, 40], [1310, 300, 40], [662, 700, 30], [1160, 560, 20], [1092, 600, 18]].map(([x, y, w]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={1080 - y} />
          <rect x={x + w * 0.6} y={y} width={w * 0.4} height={1080 - y} fill="#8f7568" />
        </g>
      ))}
    </g>
  );
}

// the clock on the left pole: 3:40 (hour hand 2/3 of the way from 3 to 4, minute hand on 8)
function Clock() {
  const cx = 525, cy = 470, r = 50; // above the dialogue box (y 560+)
  const hand = (deg, len) => [cx + Math.sin((deg * Math.PI) / 180) * len, cy - Math.cos((deg * Math.PI) / 180) * len];
  const [hx, hy] = hand(110, 28), [mx, my] = hand(240, 40);
  return (
    <g>
      <rect x="517" y="412" width="16" height="12" fill="#5a4a44" />
      <circle cx={cx} cy={cy} r={r + 7} fill="#3a2e2c" />
      <circle cx={cx} cy={cy} r={r} fill="#fbf6ea" />
      {Array.from({ length: 12 }, (_, i) => { const [x1, y1] = hand(i * 30, r - 4), [x2, y2] = hand(i * 30, r - 12); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a2e2c" strokeWidth={i % 3 ? 3 : 5} />; })}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#3a2e2c" strokeWidth="7" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#3a2e2c" strokeWidth="4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" fill="#c2335a" />
    </g>
  );
}

function CurryNoren() {
  return (
    <g>
      {/* hung high on the left shop so neither the dialogue box (x 260+) nor the choice button (y 850+) covers it */}
      <rect x="10" y="668" width="250" height="10" rx="4" fill="#4a3528" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={16 + i * 82} y="676" width="78" height="118" fill="#24386a" />
          <rect x={16 + i * 82} y="776" width="78" height="10" fill="#f0e6cf" opacity=".85" />
          <text x={55 + i * 82} y="750" textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="800" fontSize="56" fill="#f7efdc">{'カレー'[i]}</text>
        </g>
      ))}
    </g>
  );
}

export default function CurryStreet({ rm }) {
  return (
    <R3Scene id="curry-street" tod={T} rm={rm}
      label="The lantern street outside the curry house at 3:40 in the afternoon: red paper lanterns strung across a blue sky, old shop houses, the curry house's indigo noren, a clock on a pole.">
      <Mid id="curry-street" blur={3} op={0.5} tint="#f2ecdf" wash={0.06} />
      <Poles />
      <Clock />
      <CurryNoren />
      <CurryFront />
      <Plate x={1500} y={420} w={44} h={116} bg="#f2d23c" fg="#6a2a2a" jp="そば" vertical jpSize={34} />
      <Plate x={1726} y={846} w={194} h={150} bg="#d8303a" fg="#fff4ea" jp="花や" en="FLOWERS" jpSize={64} enSize={30} rx={4} />
    </R3Scene>
  );
}
