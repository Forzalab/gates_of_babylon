// v2-train 5: 5:20 PM. Her head on your shoulder. Rain hits the window. (ref 14: green seats; its エル watermark is
// inpainted in prep). Same trace family as train-sun, graded grey in prep (windows -> rain sky, floor sun patches
// filled). Hand pass: the window glass as flat grey-blue cels with a far grey town, rain = 2 static streak layers on
// the glass only (swapped every 750 ms; reduced motion = 1 still layer), straight poles + the luggage rack in front,
// grey window reflections down the aisle. Sun (4:40) -> rain (5:20) is the time passing.
import { R3Scene, RainPair, Pole, TOD, preloadTrace, pts } from './parts.jsx';
import { nandaSVG } from '../nanda.js';

preloadTrace('train-rain');

const T = TOD['rain-dusk'];
const GLASS = [
  [[0, 10], [100, 28], [470, 185], [495, 215], [498, 570], [478, 598], [70, 618], [0, 615]],
  [[606, 256], [648, 262], [648, 446], [606, 446]], [[664, 264], [714, 270], [714, 444], [664, 444]],
  [[800, 334], [880, 330], [896, 350], [896, 540], [800, 548]],
  [[1208, 442], [1272, 442], [1272, 590], [1208, 590]],
  [[1620, 0], [1920, 0], [1920, 296], [1700, 340], [1620, 380]],
];
// the far town through the glass: low grey blocks along each pane's bottom
const TOWN = [[0, 520, 90, 70], [90, 540, 70, 60], [170, 500, 80, 110], [260, 530, 110, 80], [380, 510, 90, 90], [1640, 250, 90, 120], [1740, 230, 70, 110], [1820, 260, 100, 60]];

export default function TrainRain({ rm, over = null, id = 'train-rain', label = null }) {
  const clip = GLASS.map((g) => `M${pts(g).replace(/ /g, 'L')}Z`).join('');
  return (
    <R3Scene id={id} trace="train-rain" tone="rain-dusk" rm={rm} over={over}
      label={label ?? 'The same kind of train at 5:20 PM, grey now: rain streaks down every window, green seats, the aisle shines with the grey light.'}>
      <defs>
        <linearGradient id="r3tr-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d8898" /><stop offset=".7" stopColor="#a9b3c0" /><stop offset="1" stopColor="#c3cad3" />
        </linearGradient>
        <clipPath id="r3tr-glass-clip"><path d={clip} /></clipPath>
        <filter id="r3tr-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      {/* ceiling: one cel toward the far door, the hanging ad strip (muted, it is raining), the light strips */}
      <linearGradient id="r3tr-ceil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a67a6c" /><stop offset="1" stopColor="#7e5c58" />
      </linearGradient>
      <polygon points="600,0 1540,0 1340,412 1170,420 720,196" fill="url(#r3tr-ceil)" />
      <polygon points="900,40 960,40 1150,380 1130,386" fill="#e6dcd8" opacity=".5" />
      <polygon points="1440,40 1480,40 1330,380 1318,382" fill="#e6e2e6" opacity=".6" />
      {[[1000, 160, 150, 90, '#7d8ea6'], [1150, 160, 140, 90, '#a0605e'], [1060, 262, 124, 56, '#8a9a7c'], [1188, 262, 100, 56, '#b8a488'], [1100, 334, 170, 40, '#6f8f8a']].map(([x, y, w, h, c]) => (
        <g key={`${x}-${y}`}><rect x={x} y={y} width={w} height={h} fill={c} /><rect x={x} y={y} width={w} height="6" fill="#d9d2d6" /></g>
      ))}
      <g stroke="#9a9096" strokeWidth="4" fill="none">
        {Array.from({ length: 9 }, (_, i) => { const x = 690 + i * 52, y = 150 + i * 26, k = 1 - i * 0.07; return <path key={i} d={`M${x} ${y}l${-12 * k} ${34 * k}h${24 * k}z`} />; })}
      </g>
      {/* clean cels: the long green seat (back pads + cushion), the aisle floor, the right seat */}
      <linearGradient id="r3tr-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8a6e68" /><stop offset=".5" stopColor="#6a5250" /><stop offset="1" stopColor="#4a3434" />
      </linearGradient>
      <linearGradient id="r3tr-seat" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#555a40" /><stop offset="1" stopColor="#35301f" />
      </linearGradient>
      <polygon points="300,1080 760,790 1100,640 1290,640 1340,760 1395,1080" fill="url(#r3tr-floor)" />
      <polygon points="0,790 600,700 700,690 760,790 300,1080 0,1080" fill="url(#r3tr-seat)" />
      <polygon points="300,1080 760,790 772,806 330,1080" fill="#3a2226" />
      <polygon points="0,618 600,598 600,700 0,790" fill="#5a5f45" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x0 = 10 + i * 98, x1 = x0 + 88, y = (x) => 618 - x * 0.033, b = (x) => 790 - x * 0.15;
        return (
          <g key={i}>
            <polygon points={`${x0},${y(x0) + 8} ${x1},${y(x1) + 8} ${x1},${b(x1) - 8} ${x0},${b(x0) - 8}`} fill="#666b4e" />
            {[0.25, 0.4, 0.55].map((t) => <line key={t} x1={x0 + 10} y1={y(x0) + (b(x0) - y(x0)) * t} x2={x1 - 10} y2={y(x1) + (b(x1) - y(x1)) * t} stroke="#7f8f73" strokeWidth="4" />)}
          </g>
        );
      })}
      <polygon points="1412,744 1520,760 1520,1010 1412,980" fill="url(#r3tr-seat)" />
      {/* the seat-end partitions (frosted panels, a light rim) */}
      <g fill="#8e8288" stroke="#c9c0c6" strokeWidth="4" strokeLinejoin="round" opacity=".82">
        <path d="M566 448 Q566 432 590 436 L700 470 Q744 486 746 540 L748 770 L604 818 Q572 812 570 780 Z" />
        <path d="M770 552 L896 552 L896 700 L776 740 Z" />
        <path d="M1528 520 Q1540 452 1640 430 L1920 300 L1920 1080 L1540 1080 Z" fill="#9a8c90" opacity=".92" />
      </g>
      {GLASS.map((g, i) => <polygon key={i} points={pts(g)} fill="url(#r3tr-glass)" />)}
      <g clipPath="url(#r3tr-glass-clip)" fill="#6d7686">
        {TOWN.map(([x, y, w, h]) => <rect key={x} x={x} y={y} width={w} height={h} />)}
        {TOWN.map(([x, y, w]) => <rect key={`l${x}`} x={x + 12} y={y + 14} width="10" height="12" fill={T.window} opacity=".7" />)}
      </g>
      {/* rain on the glass: 2 static layers + a few fixed drops */}
      <RainPair seed={23} n={260} box={[0, 0, 1920, 640]} len={[18, 46]} slant={0.08} color="#e8eef8" opacity={0.55} width={2.2} clip="r3tr-glass-clip" rm={rm} />
      <g clipPath="url(#r3tr-glass-clip)" fill="#eef3fa" opacity=".6">
        {[[60, 300], [140, 420], [230, 210], [320, 480], [420, 350], [460, 540], [1700, 120], [1800, 220], [1880, 80], [630, 330], [840, 420]].map(([x, y]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="4" ry="6" />)}
      </g>
      {/* luggage rack over the big window + straight poles in front */}
      <g stroke="#8b7f86" strokeWidth="5">
        <line x1="100" y1="32" x2="650" y2="202" /><line x1="170" y1="0" x2="690" y2="162" />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={130 + i * 44} y1={20 + i * 13.6} x2={176 + i * 44} y2={2 + i * 13.6} strokeWidth="3" />)}
      </g>
      <Pole x={52} y0={0} y1={630} w={22} fill="#8b8591" hi="#d9d4dc" />
      <Pole x={401} y0={50} y1={975} w={18} fill="#8b8591" hi="#d9d4dc" />
      <Pole x={655} y0={200} y1={820} w={12} fill="#8b8591" hi="#d9d4dc" />
      <Pole x={1400} y0={0} y1={1080} w={20} fill="#7d7884" hi="#cfcad3" />
      {/* the aisle: grey window light in soft vertical bands */}
      <g filter="url(#r3tr-soft)" fill="#c3cad3" opacity=".28">
        <polygon points="1120,640 1180,640 1050,1080 900,1080" />
        <polygon points="1230,640 1260,640 1250,1080 1170,1080" />
      </g>
    </R3Scene>
  );
}

// train-r4 beat 8 (ref 10): she lies across the dialogue bar, half asleep, drooling. Her standing sprite is off
// (cut.frame 'off'); this is the same gate-girl rotated onto her flat back, resting on the box top (y 773), her
// dazed-sleepy face (props.cut.face), a drool strand + drop hanging over the bar edge, still z's. No motion.
export const SLEEP_AT = { x: 1075, y: 832, s: 1.5, rot: -48 };
export function Sleeper({ face = 'dazed-sleepy' }) {
  const svg = nandaSVG({ face, talk: false });
  const { x, y, s, rot } = SLEEP_AT;
  return (
    <g className="r4-sleeper" data-face={face} aria-hidden="true">
      <ellipse cx="900" cy="772" rx="260" ry="18" fill="#0c1220" opacity=".4" />
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} dangerouslySetInnerHTML={{ __html: svg }} />
      {/* drool: from the corner of her mouth down to the bar edge (ref 10) */}
      <path d="M947 698 Q962 730 956 752" fill="none" stroke="#1f5f96" strokeWidth="7" strokeLinecap="round" />
      <path d="M947 698 Q962 730 956 752" fill="none" stroke="#bfe8ff" strokeWidth="4" strokeLinecap="round" />
      <path d="M956 744 C964 754 970 760 970 766 A14 14 0 0 1 942 766 C942 760 948 754 956 744 Z" fill="#8fd3ff" stroke="#1f5f96" strokeWidth="3" />
      <ellipse cx="950" cy="764" rx="3" ry="5" fill="#fff" opacity=".85" />
      <g fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1080 470h40l-40 40h40" /><path d="M1150 400h30l-30 30h30" /><path d="M1206 344h20l-20 20h20" />
      </g>
    </g>
  );
}
export function TrainRainSleepy({ props, rm }) {
  return (
    <TrainRain rm={rm} id="train-rain-sleepy" over={(
        <>
          {/* cosy dim carriage: the bg is darkened and warmed yellow, and she gets the same warm grade so they match */}
          <rect width="1920" height="1080" fill="#1c0e04" opacity=".62" />
          <rect width="1920" height="1080" fill="#ffb238" opacity=".2" />
          <g style={{ filter: 'sepia(.55) saturate(1.15) brightness(.85)' }}><Sleeper face={props?.cut?.face ?? 'dazed-sleepy'} /></g>
        </>
      )}
      label="5:20 PM on the rainy train. Nanda has fallen half asleep lying across the dialogue bar, drooling a little." />
  );
}
