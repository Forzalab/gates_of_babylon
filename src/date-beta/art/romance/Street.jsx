// "Walk her home": ONE street, two times of day. street-day and street-dusk share this overlay (same geometry: the dusk
// ref was warped onto the day frame, see pipeline/prep.py); only the trace colours, the lights and the grade change.
// Hand overlay: crosswalk + lane lines, the 3 utility poles and their wires, and clean signs over the traced text mush
// (the konbini sign, the A-frame poster face, the drinks poster).
import { TraceScene, preloadTrace } from './Grade.jsx';

preloadTrace('street-day'); preloadTrace('street-dusk');

const POLE = (x, top, bot, w, c) => (
  <g>
    <rect x={x} y={top} width={w} height={bot - top} fill={c} />
    <rect x={x + w * 0.62} y={top} width={w * 0.38} height={bot - top} fill="#000" opacity=".18" />
    {[top + 60, top + 150].map((y) => <rect key={y} x={x - 34} y={y} width={w + 68} height="9" fill={c} />)}
    <rect x={x - 10} y={top + 250} width={w + 20} height="54" rx="6" fill={c} opacity=".92" />
  </g>
);

function Wires({ c }) {
  const d = [
    'M560 70 Q1000 250 1336 150', 'M560 160 Q1000 330 1336 240', 'M560 250 Q950 380 1336 300',
    'M1336 150 Q1560 200 1820 60', 'M1336 240 Q1600 300 1820 150', 'M0 300 Q280 380 560 250',
    'M870 250 Q1100 330 1336 300', 'M1336 300 Q1600 380 1920 250',
  ];
  return <g fill="none" stroke={c} strokeWidth="3" strokeLinecap="round">{d.map((p) => <path key={p} d={p} />)}</g>;
}

function Road({ stripe, line }) {
  const zebra = [[640, 812], [880, 1020], [1118, 1246], [1330, 1490], [1540, 1720]];
  return (
    <g>
      {zebra.map(([a, b], i) => (
        <polygon key={i} points={`${a + 40},985 ${b + 20},985 ${b - 10 + i * 12},1080 ${a - 20 + i * 8},1080`} fill={stripe} opacity=".93" />
      ))}
      <path d="M1000 722 L585 985" stroke={line} strokeWidth="11" strokeLinecap="round" />
      <path d="M1165 722 L1720 975" stroke={line} strokeWidth="11" strokeLinecap="round" />
      <polygon points="1130,790 1180,835 1150,880 1085,828" fill="none" stroke={line} strokeWidth="9" strokeLinejoin="round" />
    </g>
  );
}

function Signs({ dusk }) {
  const glow = dusk ? '#f6e6cf' : '#e8ebf3';
  return (
    <g>
      {/* OR-SON konbini (the chain from the underpass ad) over the traced kana mush */}
      <rect x="256" y="222" width="246" height="300" rx="6" fill={glow} />
      <rect x="256" y="222" width="18" height="300" fill="#ff5fa2" />
      <text x="388" y="300" textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="800" fontSize="54" fill="#3a2a6a">OR-SON</text>
      <path d="M388 380 C372 356 338 368 352 394 L388 426 L424 394 C438 368 404 356 388 380Z" fill="#ff5fa2" />
      <text x="388" y="490" textAnchor="middle" fontFamily="var(--jp, sans-serif)" fontWeight="700" fontSize="40" fill="#3a2a6a">24時間</text>
      {/* the A-frame board: a menu, no face */}
      <g>
        <polygon points="46,752 180,752 192,944 36,944" fill="#fff6e8" stroke="#6b5a4a" strokeWidth="6" />
        <text x="113" y="800" textAnchor="middle" fontFamily="var(--jp, sans-serif)" fontWeight="700" fontSize="34" fill="#c24a7a">おにぎり</text>
        <text x="113" y="846" textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="700" fontSize="28" fill="#3a2a6a">¥150</text>
        <rect x="60" y="872" width="106" height="44" rx="6" fill="#ffcc3d" />
        <text x="113" y="903" textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="800" fontSize="24" fill="#3a2a6a">OPEN ♡</text>
      </g>
      {/* drinks poster in the window */}
      <rect x="360" y="622" width="96" height="140" rx="4" fill="#bfe3ff" />
      <rect x="392" y="648" width="32" height="70" rx="10" fill="#ff8fb8" />
      <rect x="398" y="634" width="20" height="16" rx="3" fill="#3a2a6a" />
      <rect x="360" y="730" width="96" height="32" fill="#3a2a6a" />
      {/* red vertical sale banner */}
      <rect x="188" y="560" width="48" height="140" rx="3" fill="#e2463f" />
      <text x="212" y="590" textAnchor="middle" writingMode="tb" fontFamily="var(--jp, sans-serif)" fontWeight="700" fontSize="30" fill="#fff">セール</text>
    </g>
  );
}

// dusk only: lit shop, lamp heads, a few warm windows (the day trace has them dark)
function Lights() {
  const win = [[630, 300, 40, 80], [690, 540, 30, 90], [1470, 560, 40, 90]];
  return (
    <g style={{ mixBlendMode: 'screen' }}>
      <rect x="252" y="520" width="240" height="280" fill="#ffb45c" opacity=".35" />
      {win.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#ffc977" opacity=".35" />)}
      {[[712, 222], [782, 322]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="90" fill="#ffd89a" opacity=".3" />
          <ellipse cx={x} cy={y} rx="26" ry="9" fill="#fff3d6" />
        </g>
      ))}
      <circle cx="1210" cy="555" r="26" fill="#ff5a4a" opacity=".8" />
      <circle cx="1245" cy="555" r="26" fill="#ff5a4a" opacity=".35" />
    </g>
  );
}

function StreetArt({ dusk, rm }) {
  const pole = dusk ? '#3b2d49' : '#5b5560';
  return (
    <TraceScene id={dusk ? 'street-dusk' : 'street-day'} rm={rm}
      label={dusk ? 'The same quiet street at dusk: shop lights on, the sky orange and violet, power lines against the clouds.'
        : 'A quiet street in the sun: an OR-SON konbini on the left, power lines, a crosswalk, blue sky and a tall cloud.'}
      grade={dusk ? { tone: 'dusk', sun: [1100, 470], sparkles: 26 } : { tone: 'day', sun: [1640, -60], sparkles: 18 }}>
      <Road stripe={dusk ? '#f3d2c6' : '#eef2fb'} line={dusk ? '#f7e0cf' : '#f4f6fb'} />
      <Wires c={dusk ? '#2a1e38' : '#3c3f4e'} />
      {POLE(548, 0, 815, 24, pole)}
      {POLE(1330, 128, 752, 16, pole)}
      {POLE(1804, 0, 880, 38, pole)}
      <Signs dusk={dusk} />
      {dusk && <Lights />}
    </TraceScene>
  );
}

export const StreetDay = ({ rm }) => <StreetArt rm={rm} />;
export const StreetDusk = ({ rm }) => <StreetArt dusk rm={rm} />;
