// her-building (v2-street 5, "The key turns. Click. Door 12 opens."): ref 03, a night street after the rain, her
// block on the right with two lit windows. The rain has stopped (timeline: dry sky, wet road), so no streaks.
// Hand pass: door 12 on the raised ground floor, lamp over it, kept ABOVE the dialogue box (box top = y 560, Nanda
// x 740-1160), the building plate (G3's hidden logic gag: メゾン XNOR, the gate that says 1 when both are the same),
// the no-parking disc redrawn, poles straightened, the lit windows flat warm + their broken reflections on the road.
import { R3Scene, Win, Lamp, WetBand, Stars, preloadTrace } from './parts.jsx';

preloadTrace('her-building');
const T = 'night';

function Door12() {
  return (
    <g>
      {/* entrance recess + canopy on the raised floor */}
      <rect x="1282" y="268" width="170" height="276" fill="#141a2e" />
      <rect x="1268" y="252" width="198" height="20" fill="#2a3150" />
      {/* the door: warm light through the frosted glass strip, open a crack (the key turned) */}
      <rect x="1306" y="300" width="122" height="244" fill="#39415f" />
      <rect x="1306" y="300" width="122" height="244" fill="none" stroke="#1d2238" strokeWidth="6" />
      <rect x="1392" y="318" width="20" height="200" fill="#ffd27a" opacity=".9" />
      <polygon points="1428,300 1446,306 1446,538 1428,544" fill="#ffd27a" opacity=".85" />
      <circle cx="1322" cy="426" r="6" fill="#c9b27a" />
      {/* 12: the plate, big enough to read through the focus blur */}
      <rect x="1318" y="318" width="64" height="44" rx="4" fill="#e9e4d6" />
      <text x="1350" y="352" textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="800" fontSize="36" fill="#1d2238">12</text>
      <Lamp x={1367} y={240} r={14} tod={T} pool={90} poolY={540} />
      {/* steps down along the plinth (they run on behind the dialogue box) */}
      {[0, 1, 2].map((i) => <rect key={i} x={1266 - i * 10} y={544 + i * 18} width={206 + i * 20} height="18" fill={i % 2 ? '#3a415c' : '#454d6a'} />)}
      {/* the building plate: メゾン XNOR */}
      <rect x="1478" y="350" width="150" height="70" rx="4" fill="#d9d3c2" />
      <text x="1553" y="380" textAnchor="middle" fontFamily="var(--jp, sans-serif)" fontWeight="700" fontSize="24" fill="#2a2f48">メゾン</text>
      <text x="1553" y="410" textAnchor="middle" fontFamily="var(--cond, sans-serif)" fontWeight="800" fontSize="28" fill="#c2335a" letterSpacing=".06em">XNOR</text>
    </g>
  );
}

function Street() {
  return (
    <g>
      {/* straightened: the left concrete pole + the building's corner pillar */}
      <rect x="342" y="0" width="84" height="840" fill="#2b3450" />
      <rect x="342" y="0" width="26" height="840" fill="#3a4666" />
      <rect x="1700" y="0" width="46" height="1000" fill="#1c2238" />
      {/* the no-parking disc (a symbol, no text), redrawn */}
      <circle cx="308" cy="156" r="56" fill="#c8303c" />
      <circle cx="308" cy="156" r="44" fill="#2f5fb0" />
      <path d="M277 125 L339 187" stroke="#c8303c" strokeWidth="10" />
      <rect x="302" y="212" width="12" height="80" fill="#39415c" />
      {/* lit windows (flat warm) and the far ones */}
      <Win x={1146} y={132} w={78} h={116} tod={T} />
      <rect x="1234" y="128" width="14" height="112" fill="#ffd27a" />
      <Win x={1414} y={120} w={104} h={92} tod={T} frame="#8a7a50" />
      <Win x={640} y={266} w={58} h={32} tod={T} frame="#8a7a50" />
      <Lamp x={666} y={368} r={10} tod={T} />
      <Lamp x={514} y={352} r={7} tod={T} />
      {/* wet road: the white edge lines, the broken reflections of the windows + lamps */}
      <path d="M520 570 Q575 640 540 800 L420 1080" stroke="#aebde0" strokeWidth="24" fill="none" opacity=".75" />
      <path d="M1260 730 L1860 1080" stroke="#aebde0" strokeWidth="18" fill="none" opacity=".6" />
      <WetBand x={1190} y={840} w={100} h={200} c="#ffe28a" o={0.55} />
      <WetBand x={1466} y={900} w={120} h={170} c="#ffe28a" o={0.55} />
      <WetBand x={668} y={610} w={60} h={120} c="#ffe28a" o={0.4} />
    </g>
  );
}

export default function HerBuilding({ rm }) {
  return (
    <R3Scene id="her-building" tod={T} rm={rm}
      label="Her street at night after the rain: the wet road shines, her apartment block on the right has two lit windows and a lit entrance, door 12 open a crack under a lamp.">
      <Stars id="hb-stars" clip="440,0 860,0 860,190 440,240" n={40} seed={3} h={240} />
      <Street />
      <Door12 />
    </R3Scene>
  );
}
