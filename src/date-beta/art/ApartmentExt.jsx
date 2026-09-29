// Scene 8, APARTMENT EXTERIOR (night, rain). Composition from Tony's refs (small walk-up block, bike shed, pole + wires).
// A 4-floor building, every window dark except ONE on the 4th floor (warm). Street lamp, BUFFER vending glow, bikes.
import Rain from './Rain.jsx';
import './alt.css';

const FLOORS = 4, UNITS = 3;

function Building() {
  const x0 = 520, w = 900, fh = 170, top = 1080 - 150 - FLOORS * fh;
  return (
    <g>
      <rect x={x0} y={top - 30} width={w} height={FLOORS * fh + 30} fill="#3a3d4a" />
      <rect x={x0 - 20} y={top - 44} width={w + 40} height="20" fill="#262833" />
      {Array.from({ length: FLOORS }, (_, f) => {
        const y = top + f * fh, floor = FLOORS - f;
        return (
          <g key={f}>
            {/* outside walkway slab + railing */}
            <rect x={x0} y={y + fh - 22} width={w} height="22" fill="#4c5060" />
            <rect x={x0} y={y + fh - 70} width={w} height="48" fill="#2f323d" />
            {Array.from({ length: 30 }, (_, k) => <rect key={k} x={x0 + 6 + k * 30} y={y + fh - 70} width="4" height="48" fill="#555a6a" />)}
            {Array.from({ length: UNITS }, (_, u) => {
              const on = floor === 4 && u === 2;
              const wx = x0 + 60 + u * 290;
              return (
                <g key={u}>
                  <rect x={wx} y={y + 24} width="150" height="70" fill={on ? '#ffcf7a' : '#1a1c26'} className={on ? 'ap-lit' : undefined} />
                  {on && <rect x={wx + 6} y={y + 30} width="138" height="58" fill="#fff0c2" opacity=".6" />}
                  <line x1={wx + 75} y1={y + 24} x2={wx + 75} y2={y + 94} stroke="#2a2c36" strokeWidth="4" />
                  <rect x={wx + 180} y={y + 20} width="56" height="80" fill="#2a2c36" />
                </g>
              );
            })}
          </g>
        );
      })}
      {/* the one lit window spills onto the rain */}
      <path d={`M${x0 + 640} ${top + 94} L${x0 + 600} ${top + 170} H${x0 + 850} L${x0 + 790} ${top + 94}Z`} fill="#ffcf7a" opacity=".12" />
      {/* 外階段 side stairs, right end */}
      {Array.from({ length: FLOORS }, (_, f) => (
        <path key={f} d={`M${x0 + w} ${top + (f + 1) * fh} L${x0 + w + 120} ${top + f * fh + 22}`} stroke="#6b7082" strokeWidth="10" />
      ))}
      <text x={x0 + 24} y={top + FLOORS * fh + 40} className="ap-name">コーポ・フィグール</text>
    </g>
  );
}

export default function ApartmentExt({ rm }) {
  return (
    <div className="art apartment">
      <svg viewBox="0 0 1920 1080" role="img" aria-label="A small four-floor apartment building at night in the rain. Only one window is lit, on the fourth floor.">
        <defs>
          <linearGradient id="ap-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#12141d" /><stop offset="1" stopColor="#2b2f40" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#ap-sky)" />
        {/* neighbours */}
        <path d="M0 520 H300 L360 470 L420 520 H480 V1080 H0Z" fill="#1d202b" />
        <rect x="1520" y="420" width="400" height="660" fill="#1b1d27" />
        <rect x="1600" y="520" width="80" height="50" fill="#3b3524" /><rect x="1760" y="700" width="80" height="50" fill="#1f2230" />
        <Building />
        {/* pole + wires */}
        <rect x="380" y="120" width="22" height="840" fill="#15161c" />
        <rect x="330" y="200" width="120" height="10" fill="#15161c" />
        <path d="M0 230 Q380 300 900 180 T1920 220 M0 260 Q400 330 1000 210 T1920 250" stroke="#0e0f14" strokeWidth="3" fill="none" />
        {/* street lamp */}
        <path d="M402 360 Q460 340 470 380" stroke="#15161c" strokeWidth="8" fill="none" />
        <circle cx="470" cy="386" r="12" fill="#fff4d0" />
        <path d="M470 392 L380 960 H560Z" fill="#fff4d0" opacity=".08" />
        {/* bike shed + bikes, vending glow */}
        <path d="M1420 800 L1900 770 V790 L1420 820Z" fill="#4a4f5c" />
        {[1480, 1560, 1640, 1720, 1800].map((x) => (
          <g key={x} stroke="#6c7384" strokeWidth="5" fill="none">
            <circle cx={x} cy="905" r="30" /><circle cx={x + 58} cy="905" r="30" /><path d={`M${x} 905 L${x + 26} 862 L${x + 58} 905 M${x + 26} 862 H${x + 50}`} />
          </g>
        ))}
        <rect x="200" y="760" width="120" height="200" rx="6" fill="#dfe8ee" />
        <rect x="212" y="776" width="96" height="30" fill="#1e7fd6" />
        <text x="260" y="798" textAnchor="middle" className="ap-buffer">BUFFER</text>
        <rect x="160" y="740" width="200" height="240" fill="#bfefff" opacity=".12" />
        {/* wet street */}
        <rect x="0" y="930" width="1920" height="150" fill="#1b1d25" />
        <rect x="1000" y="940" width="160" height="140" fill="#ffcf7a" opacity=".07" />
        <rect x="430" y="940" width="80" height="140" fill="#fff4d0" opacity=".08" />
        <Rain seed={9} rm={rm} opacity={0.3} />
      </svg>
    </div>
  );
}
