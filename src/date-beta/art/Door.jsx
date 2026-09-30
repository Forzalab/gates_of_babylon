// BG-D1 fallback: her door at night. Apartment corridor close-up: Unit 12 plate, peephole, one buzzing wall lamp,
// rain falling past the open corridor rail on the left. Flat fills, stepped rain (reduced motion = still).
import { rng } from './util.js';

function Rain({ rm }) {
  const rnd = rng(12);
  return (
    <g className={`rain${rm ? '' : ' on'}`}>
      {Array.from({ length: 70 }, (_, i) => {
        const x = rnd() * 420, y = rnd() * 1080;
        return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 44} />;
      })}
    </g>
  );
}

export default function Door({ rm }) {
  return (
    <svg className="art door" viewBox="0 0 1920 1080" role="img" aria-label="A closed apartment door at night, number 12, rain behind the corridor rail.">
      <defs>
        <radialGradient id="dr-lamp" cx="1300" cy="150" r="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f4e2b0" stopOpacity=".55" /><stop offset=".5" stopColor="#f4e2b0" stopOpacity=".12" /><stop offset="1" stopColor="#f4e2b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* night beyond the rail */}
      <rect width="440" height="1080" fill="#0e1428" />
      {[[60, 300], [150, 420], [300, 260], [220, 520], [360, 460]].map(([x, y]) => <rect key={x} x={x} y={y} width="26" height="18" fill="#e8c46a" opacity=".5" />)}
      <Rain rm={rm} />
      {/* corridor wall */}
      <rect x="440" width="1480" height="1080" fill="#2b2a3c" />
      <rect x="440" width="36" height="1080" fill="#1d1c2a" />
      {/* door frame + door */}
      <rect x="820" y="120" width="620" height="900" fill="#1a1924" />
      <rect x="850" y="150" width="560" height="870" fill="#5a3a36" />
      <rect x="880" y="190" width="500" height="360" fill="none" stroke="#4a2e2b" strokeWidth="8" />
      <rect x="880" y="600" width="500" height="380" fill="none" stroke="#4a2e2b" strokeWidth="8" />
      <circle cx="1130" cy="400" r="14" fill="#141018" stroke="#b5a37a" strokeWidth="5" />
      {/* handle + lock */}
      <rect x="1320" y="560" width="30" height="120" rx="6" fill="#b5a37a" />
      <rect x="1250" y="600" width="90" height="22" rx="8" fill="#d3c294" />
      <circle cx="1335" cy="720" r="12" fill="#8a7a55" /><rect x="1332" y="712" width="6" height="16" fill="#2a2030" />
      {/* unit plate */}
      <rect x="1500" y="340" width="190" height="120" rx="6" fill="#e9e3d2" stroke="#8a8270" strokeWidth="4" />
      <text x="1595" y="428" className="unit">12</text>
      {/* doorbell */}
      <rect x="1540" y="560" width="70" height="110" rx="8" fill="#d9d4c6" /><circle cx="1575" cy="630" r="18" fill="#f0243f" opacity=".85" />
      {/* lamp + its light */}
      <rect x="1250" y="40" width="100" height="52" rx="10" fill="#f4e2b0" /><rect x="1240" y="30" width="120" height="16" fill="#1a1924" />
      <rect x="440" width="1480" height="1080" fill="url(#dr-lamp)" />
      {/* rail + floor */}
      <rect x="0" y="720" width="460" height="18" fill="#4b4a60" />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 46 + 10} y="738" width="8" height="260" fill="#4b4a60" />)}
      <rect x="0" y="990" width="1920" height="90" fill="#3a3848" /><rect x="0" y="990" width="1920" height="6" fill="#57556a" />
      {/* umbrella left by the door, still wet */}
      <path d="M745 990 Q760 820 780 700 Q800 820 815 990 Q780 1000 745 990Z" fill="#8a5cf6" /><path d="M780 700 L780 990" stroke="#5b37c4" strokeWidth="3" /><line x1="780" y1="700" x2="780" y2="660" stroke="#1a1924" strokeWidth="6" />
      <ellipse cx="780" cy="1010" rx="60" ry="8" fill="#6f7aa8" opacity=".5" />
    </svg>
  );
}
