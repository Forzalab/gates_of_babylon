// Scene 9, OUTDOOR STAIRS + HER DOOR. Composition from Tony's refs (metal 外階段 up the side, open walkway, steel doors).
// Left: the stairs climb to the 4th-floor landing. Right: her door, close. Nameplate "Unit 12", a lamp, the rain beyond the rail.
// props.door: 'shut' (default) | 'ajar' (a warm sliver of light; hard cut, no motion).
import Rain from './Rain.jsx';
import './alt.css';

function Steps() {
  return (
    <g>
      {/* stringers */}
      <path d="M60 1080 L700 520" stroke="#4d5566" strokeWidth="18" />
      <path d="M200 1080 L780 580" stroke="#4d5566" strokeWidth="14" />
      {Array.from({ length: 12 }, (_, i) => {
        const t = i / 12, x = 90 + t * 610, y = 1050 - t * 520;
        return <path key={i} d={`M${x} ${y} h120 l-14 14 h-120z`} fill="#6a7384" stroke="#353b47" strokeWidth="3" />;
      })}
      {/* handrail + posts */}
      <path d="M40 960 L690 400" stroke="#8a93a6" strokeWidth="10" strokeLinecap="round" />
      {[0, 0.25, 0.5, 0.75, 1].map((t) => <line key={t} x1={40 + t * 650} y1={960 - t * 560} x2={70 + t * 650} y2={1060 - t * 540} stroke="#8a93a6" strokeWidth="6" />)}
    </g>
  );
}

function Door({ ajar }) {
  return (
    <g transform="translate(1180 180)">
      <rect x="-30" y="-30" width="460" height="720" fill="#6b5a55" />
      <rect x="0" y="0" width="400" height="660" fill="#5a4a46" />
      {ajar && <path d="M388 0 H400 V660 H366Z" fill="#ffcf7a" opacity=".85" />}
      <rect x="20" y="20" width="360" height="620" fill="none" stroke="#4a3c38" strokeWidth="4" />
      <rect x="310" y="300" width="18" height="90" rx="6" fill="#c9c2b8" />
      <rect x="140" y="180" width="120" height="16" rx="4" fill="#3c302d" />
      {/* nameplate */}
      <rect x="440" y="90" width="150" height="70" rx="4" fill="#eee8dc" stroke="#b8ad99" strokeWidth="3" />
      <text x="515" y="138" textAnchor="middle" className="st-plate">Unit 12</text>
      <rect x="470" y="220" width="70" height="100" rx="6" fill="#2f3036" />
      <circle cx="505" cy="250" r="12" fill="#55565e" /><rect x="490" y="280" width="30" height="20" rx="4" fill="#8a8c94" />
      {/* umbrella leaning, hers */}
      <path d="M-70 660 L-40 380" stroke="#e8f1ff" strokeWidth="6" /><path d="M-60 600 Q-80 480 -40 380 Q-10 480 -30 600Z" fill="#cfe3ff" opacity=".3" />
    </g>
  );
}

export default function Stairs({ props, rm }) {
  return (
    <div className="art stairs">
      <svg viewBox="0 0 1920 1080" role="img" aria-label="Metal outdoor stairs climb to a walkway at night. Her door, close up. The nameplate reads Unit 12.">
        <defs>
          <linearGradient id="st-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#141722" /><stop offset="1" stopColor="#2a2f40" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#st-night)" />
        {/* the town below, beyond the rail */}
        {Array.from({ length: 22 }, (_, i) => <rect key={i} x={i * 50} y={560 + (i % 4) * 20} width="36" height="520" fill="#1c2030" />)}
        {[120, 300, 520, 760, 880].map((x, i) => <rect key={x} x={x} y={600 + i * 18} width="10" height="12" fill="#ffd27a" opacity=".6" />)}
        {/* walkway wall + ceiling slab */}
        <rect x="1040" y="0" width="880" height="1080" fill="#8e8a80" />
        {Array.from({ length: 40 }, (_, r) => <line key={r} x1="1040" y1={r * 28} x2="1920" y2={r * 28} stroke="#7d796f" strokeWidth="2" />)}
        <rect x="0" y="0" width="1920" height="110" fill="#5c5f68" />
        <rect x="1300" y="80" width="200" height="22" rx="4" fill="#fff4d0" />
        <path d="M1300 102 L1180 700 H1640 L1500 102Z" fill="#fff4d0" opacity=".08" />
        {/* walkway floor + rail */}
        <rect x="700" y="840" width="1220" height="240" fill="#5e6270" />
        <rect x="700" y="520" width="340" height="14" fill="#8a93a6" />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={710 + i * 28} y="534" width="5" height="306" fill="#8a93a6" />)}
        <Steps />
        <Door ajar={props.door === 'ajar'} />
        <Rain seed={17} rm={rm} w={1040} opacity={0.3} />
      </svg>
    </div>
  );
}
