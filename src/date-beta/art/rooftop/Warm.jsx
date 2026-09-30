// School rooftop at magic hour (ref 07): brick stairwell box centre-right with a lit doorway, a low parapet with
// benches on the left, warm cream tiles, a lilac city under an apricot sky. Trace = sky + floor wash; the city,
// box, parapet, benches and joints are redrawn crisp. The Figur tower sits in the skyline gap left of centre.
import { RoofSvg, FigurTower, TileJoints, Vignette, preloadTrace } from './parts.jsx';

preloadTrace('rooftop-warm');

const LIT = '#f6c48e';

function Windows({ x, y, w, h, cols, rows, fill, glint }) {
  const cw = w / cols, rh = h / rows;
  return Array.from({ length: cols * rows }, (_, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    return <rect key={i} x={x + c * cw + cw * 0.2} y={y + r * rh + rh * 0.25} width={cw * 0.6} height={rh * 0.5} fill={(c * 7 + r * 3) % 11 === 0 ? glint : fill} />;
  });
}

function City() {
  return (
    <g aria-hidden="true">
      {/* far layer, hazed */}
      <g opacity=".82">
        <rect x="1057" y="349" width="252" height="340" fill="#b59aa6" />
        <rect x="1107" y="257" width="160" height="100" fill="#c3a6ad" />
        <rect x="1257" y="257" width="10" height="432" fill={LIT} opacity=".7" />
        <Windows x={1117} y={270} w={140} h={80} cols={4} rows={3} fill="#a78d9c" glint="#ffe0b0" />
        <path d="M1611 360 Q1760 316 1920 332 V690 H1611Z" fill="#b39aa6" />
        {[380, 412, 444].map((y) => <path key={y} d={`M1616 ${y + 10} Q1760 ${y - 30} 1920 ${y - 14}`} stroke="#d6bcc0" strokeWidth="9" fill="none" />)}
        <rect x="503" y="374" width="227" height="320" fill="#a996ad" />
        <Windows x={515} y={388} w={205} h={140} cols={6} rows={5} fill="#c4b3c7" glint="#ffd79e" />
        <rect x="814" y="410" width="151" height="280" fill="#b1a0b3" />
        <ellipse cx="889" cy="410" rx="75" ry="14" fill="#d2bcc2" />
        {[440, 470, 500].map((y) => <rect key={y} x="820" y={y} width="139" height="7" fill="#c9b6c3" />)}
      </g>
      {/* near layer */}
      <rect x="0" y="440" width="336" height="250" fill="#8f86a8" />
      <rect x="0" y="440" width="336" height="10" fill="#b8aac2" />
      <Windows x={10} y={462} w={316} h={200} cols={9} rows={5} fill="#aba1c4" glint={LIT} />
      <rect x="330" y="560" width="300" height="130" fill="#948aa9" />
      <Windows x={340} y={572} w={280} h={100} cols={8} rows={3} fill="#b0a6c6" glint="#ffd79e" />
      <rect x="621" y="517" width="386" height="175" fill="#8a82a4" />
      <rect x="621" y="517" width="386" height="9" fill="#bfb0c4" />
      <Windows x={631} y={536} w={366} h={140} cols={10} rows={4} fill="#a79dc0" glint={LIT} />
    </g>
  );
}

function Parapet() {
  return (
    <g aria-hidden="true">
      {/* back wall: frontal, lit cap */}
      <rect x="302" y="680" width="705" height="40" fill="#8e7e9d" />
      <rect x="302" y="676" width="705" height="8" fill="#e7b99a" />
      {/* left wall receding to the back corner, with its thin rail */}
      <polygon points="0,770 319,684 319,722 0,830" fill="#7a6a8a" />
      <polygon points="0,770 319,684 319,690 0,780" fill="#e2b096" />
      <polyline points="0,640 319,624 1007,630" fill="none" stroke="#7b6f8c" strokeWidth="5" />
      {Array.from({ length: 16 }, (_, i) => { const x = i * 64; const y0 = x < 319 ? 640 - (x / 319) * 16 : 624 + ((x - 319) / 688) * 6; const y1 = x < 319 ? 770 - (x / 319) * 86 : 680; return <line key={i} x1={x} y1={y0} x2={x} y2={y1} stroke="#7b6f8c" strokeWidth="3" opacity=".8" />; })}
    </g>
  );
}

function Bench({ x, y, w, k = 1 }) {
  // a slatted wooden bench along the left wall, lit top, dark legs
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} aria-hidden="true">
      <rect x="10" y="26" width="10" height="40" fill="#4a2e30" /><rect x={w - 20} y="16" width="10" height="40" fill="#4a2e30" />
      <polygon points={`0,30 ${w},0 ${w},16 0,48`} fill="#b86b43" />
      <polygon points={`0,30 ${w},0 ${w},5 0,36`} fill="#f0a36c" />
      <line x1="0" y1="40" x2={w} y2="9" stroke="#8a4a32" strokeWidth="2" />
    </g>
  );
}

function StairBox() {
  return (
    <g aria-hidden="true">
      {/* roof slab */}
      <polygon points="1007,441 1183,399 1183,453 1007,483" fill="#6b4a4e" />
      <polygon points="1183,399 1703,406 1703,452 1183,453" fill="#f3cba0" />
      <rect x="1183" y="399" width="520" height="6" fill="#ffe8c4" />
      <polygon points="1183,453 1703,452 1690,468 1195,470" fill="#7a4a3e" />
      {/* left face in shade + its window */}
      <polygon points="1007,483 1191,458 1191,777 1007,718" fill="#5d4150" />
      <polygon points="1074,512 1141,504 1141,630 1074,634" fill="#3f2b3e" />
      <polygon points="1080,518 1106,515 1106,628 1080,630" fill="#8c6c86" opacity=".55" />
      {/* front: brick, pilasters, lit doorway */}
      <rect x="1191" y="468" width="479" height="306" fill="#d98552" />
      {Array.from({ length: 13 }, (_, r) => <line key={r} x1="1191" y1={492 + r * 22} x2="1670" y2={492 + r * 22} stroke="#b9663f" strokeWidth="2" opacity=".55" />)}
      {Array.from({ length: 13 }, (_, r) => Array.from({ length: 9 }, (_, c) => <line key={`${r}-${c}`} x1={1210 + c * 54 + (r % 2) * 27} y1={470 + r * 22} x2={1210 + c * 54 + (r % 2) * 27} y2={492 + r * 22} stroke="#b9663f" strokeWidth="2" opacity=".45" />))}
      <rect x="1191" y="468" width="36" height="306" fill="#b8683f" />
      <rect x="1510" y="468" width="26" height="306" fill="#b8683f" />
      <rect x="1646" y="468" width="26" height="304" fill="#c26f45" />
      <rect x="1408" y="516" width="104" height="210" fill="#9a4f36" />
      <rect x="1418" y="526" width="84" height="196" fill="#fbe2b4" />
      <rect x="1418" y="526" width="84" height="40" fill="#fff3d8" />
      <rect x="1434" y="604" width="10" height="4" rx="2" fill="#9a4f36" />
      {/* wall lamp + handrail + base */}
      <rect x="1240" y="474" width="22" height="30" rx="4" fill="#5a3c3a" /><rect x="1244" y="480" width="14" height="16" fill="#ffe7b0" />
      <polygon points="1191,774 1670,772 1690,786 1180,790" fill="#8a5a4a" opacity=".7" />
      {/* right: pale neighbour wall with its rail */}
      <rect x="1690" y="470" width="230" height="300" fill="#d9b8b4" />
      {[704, 734].map((y) => <line key={y} x1="1690" y1={y} x2="1920" y2={y + 12} stroke="#8f7a8a" strokeWidth="5" />)}
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={1710 + i * 40} y1={704 + i * 2} x2={1710 + i * 40} y2={790} stroke="#8f7a8a" strokeWidth="3" />)}
    </g>
  );
}

export default function RooftopWarm({ props = {} }) {
  const [h, m] = props.tower ?? [5, 0];
  return (
    <RoofSvg id="rooftop-warm" label="The school rooftop at magic hour: warm tiles, benches by the wall, the brick stairwell box with a lit door. The pink clock tower glows far off.">
      <radialGradient id="rw-sun" cx="1820" cy="330" r="760" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff2d0" stopOpacity=".7" /><stop offset=".4" stopColor="#ffc890" stopOpacity=".28" /><stop offset="1" stopColor="#ffc890" stopOpacity="0" />
      </radialGradient>
      <City />
      <FigurTower x={440} y={478} s={0.19} h={h} m={m} haze={0.72} tint="warm" />
      <rect x="330" y="560" width="300" height="130" fill="#948aa9" />
      <Windows x={340} y={572} w={280} h={100} cols={8} rows={3} fill="#b0a6c6" glint="#ffd79e" />
      <Parapet />
      <TileJoints id="rw" vp={[480, 640]} y0={722} step={70}
        clip="0,880 0,832 319,722 1007,722 1191,790 1690,788 1920,800 1920,1080 0,1080" ink="#c38a5c" op={0.34} />
      <g fill="#b0765a" opacity=".55" aria-hidden="true">
        <polygon points="0,846 210,792 300,812 60,880 0,900" /><polygon points="150,782 300,742 330,760 190,800" />
      </g>
      <Bench x={-10} y={780} w={170} k={1.1} />
      <Bench x={160} y={716} w={150} k={0.8} />
      <StairBox />
      <rect width="1920" height="1080" fill="url(#rw-sun)" style={{ mixBlendMode: 'screen' }} />
      <Vignette id="rw" color="#3a1c3c" op={0.34} />
    </RoofSvg>
  );
}
