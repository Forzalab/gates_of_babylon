// SANDWICH fronts for the faraway / establishing shots outside the town (research/sprint-0930/sandwich/LOG.md).
// Each scene keeps its own hand overlay (props, gags); these add the MID haze (<Mid>) and a few crisp, saturated FRONT
// cels (signage / lamps / landmarks) in the shot's light. Night = neon with a bloom; day = a soft down shadow.
import { traceUrl } from './romance/Grade.jsx';
import { Haze, FrontDefs, front, neon, Tate, Board, NEON as N, LINE } from './sandwich.jsx';

export const Mid = ({ id, ...p }) => <Haze id={id} href={traceUrl(id)} {...p} />;
const W = N.white;

// rooftop-noon: the far skyline gets two crisp landmarks (a red-white radio mast, a rooftop billboard), noon haze-blue
export function RooftopFront() {
  return (
    <g aria-hidden="true">
      <FrontDefs id="rn" a={0.18} dy={2} blur={2} />
      <g filter={front('rn')}>
        <g stroke="#e8363c" strokeWidth="5">
          <line x1="1150" y1="420" x2="1150" y2="606" />
          {[450, 500, 550].map((y) => <line key={y} x1="1138" y1={y} x2="1162" y2={y} stroke={y === 500 ? '#fff' : '#e8363c'} />)}
        </g>
        <circle cx="1150" cy="416" r="6" fill="#ff3040" />
        <Board x={440} y={600} w={120} h={46} bg="#ffd23a" lines={[['NAND生命', 22, '#c2233a']]} />
        <rect x="490" y="646" width="6" height="20" fill="#5a6a78" /><rect x="504" y="646" width="6" height="20" fill="#5a6a78" />
      </g>
    </g>
  );
}

// station-gate-r3: the platform's hanging signs, crisp and saturated (overcast: a soft down shadow)
export function StationFront() {
  return (
    <g aria-hidden="true">
      <FrontDefs id="sg" a={0.25} />
      <g filter={front('sg')}>
        <rect x="1590" y="270" width="4" height="30" fill="#4a5560" /><rect x="1750" y="270" width="4" height="30" fill="#4a5560" />
        <Board x={1560} y={296} w={220} h={62} bg={N.yellow} lines={[['↑ 出口 EXIT', 34, LINE]]} />
        <Board x={1170} y={372} w={150} h={44} bg={W} rim={N.green} lines={[['NAND駅', 26, '#12804a']]} />
      </g>
    </g>
  );
}

// crossing-night: neon, lots of it, with a bloom (heavy rain: the glow carries through the wet air)
export function CrossingNightFront() {
  return (
    <g aria-hidden="true">
      <FrontDefs id="cnf" glow={7} />
      <g filter={neon('cnf')} transform="translate(0 110)">
        <Tate x={120} y={180} w={74} text="カラオケAND" bg="#2a0d3a" fg={N.pink} rim={N.pink} size={50} stroke={N.pink} />
        <Tate x={250} y={220} w={58} text="ゲーセン" bg="#0b1a3a" fg={N.cyan} rim={N.cyan} size={40} stroke={N.cyan} />
        <Board x={440} y={200} w={260} h={80} bg="#1a0b30" rim={N.yellow} stroke={N.yellow} lines={[['オア電', 50, N.yellow]]} />
        <Tate x={1700} y={200} w={66} text="メイド・イン・NAND" bg="#2a0d3a" fg={W} rim={N.violet} size={40} stroke={N.violet} />
        <Board x={1450} y={560} w={200} h={64} bg="#1a0b30" rim={N.green} stroke={N.green} lines={[['OR-SON 24h', 30, N.green]]} />
      </g>
    </g>
  );
}

// street-bluehour: the first lights of the evening (warm lanterns + one neon plate), gentle bloom
export function BluehourFront() {
  return (
    <g aria-hidden="true">
      <FrontDefs id="bh" glow={5} />
      <g filter={neon('bh')}>
        {[[330, 470], [410, 470]].map(([x, y]) => (
          <g key={x}>
            <ellipse cx={x} cy={y} rx="28" ry="40" fill="#ff4a2a" stroke="#3a1a1a" strokeWidth="3" />
            <text x={x} y={y + 14} textAnchor="middle" fontSize="36" fill="#fff4d8" fontWeight="700" fontFamily="var(--jp, sans-serif)">{x === 330 ? '居' : '酒'}</text>
          </g>
        ))}
        <Tate x={1420} y={330} w={40} text="スナックAND" bg="#1b1540" fg={N.pink} rim={N.pink} size={28} stroke={N.pink} />
      </g>
    </g>
  );
}

// escape-night: small neon plates down her street (the OR-SON sign gets its bloom in the scene), a lit vending glow
export function EscapeFront() {
  return (
    <g aria-hidden="true">
      <FrontDefs id="esc" glow={6} />
      <g filter={neon('esc')}>
        <Tate x={1340} y={380} w={40} text="スナックOR" bg="#1b1540" fg={N.cyan} rim={N.cyan} size={28} stroke={N.cyan} />
        <rect x="878" y="460" width="104" height="34" rx="5" fill="none" stroke="#ff7ab6" strokeWidth="3" />
      </g>
    </g>
  );
}

// curry-street: the lantern street; the red paper lanterns strung across are redrawn crisp (afternoon: unlit, saturated red)
export function CurryFront() {
  const L = [[300, 250, 1.9], [560, 300, 1.6], [760, 330, 1.4], [1200, 330, 1.4], [1400, 300, 1.6], [1650, 250, 1.9]];
  return (
    <g aria-hidden="true">
      <FrontDefs id="cs" a={0.22} dx={-2} dy={3} />
      <path d="M120 170 Q960 330 1820 170" fill="none" stroke="#3a2a28" strokeWidth="3" />
      <g filter={front('cs')}>
        {L.map(([x, y, s], i) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
            <line x1="0" y1="-30" x2="0" y2="-44" stroke="#3a2a28" strokeWidth="3" />
            <rect x="-14" y="-34" width="28" height="8" fill="#2a1e1a" />
            <ellipse cx="0" cy="12" rx="32" ry="42" fill="#e8202e" />
            {[-20, 0, 20, 36].map((yy) => <path key={yy} d={`M-30 ${12 + yy * 0.7} Q0 ${16 + yy * 0.7} 30 ${12 + yy * 0.7}`} stroke="#a8121c" strokeWidth="2" fill="none" />)}
            <text x="0" y="26" textAnchor="middle" fontSize="36" fill="#fff4e0" fontWeight="700" fontFamily="var(--jp, sans-serif)">{'祭カレー祭'[i] ?? '祭'}</text>
            <rect x="-14" y="52" width="28" height="8" fill="#2a1e1a" />
          </g>
        ))}
      </g>
    </g>
  );
}
