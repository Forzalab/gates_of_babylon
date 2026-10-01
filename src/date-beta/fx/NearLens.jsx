// fx/NearLens.jsx: the NEAR-LENS FOREGROUND layer, generalised from the rain-fx near-lens umbrella (props.underUmbrella).
// A beat sets props.near = '<id>' and the stage draws a big, heavily blurred foreground cel between the scene
// (bg + Nanda + BOOK cel) and the HUD (dialogue box, choices, ribbon), so the HUD stays sharp and readable over it.
// Cel-over-vtrace: every piece is a flat SVG silhouette (no line art needed, the blur eats it), tinted to the scene
// light by a flat grade pass, then blurred with a CSS filter (depth of field). Static: no motion at all, so reduced
// motion needs nothing special. Keep-outs: Nanda's face (the centre column) and the focal prop (the Kemey jar).
//   crowd      = v2-train platform: commuter shoulders / heads / bags crossing the left + right thirds and the bottom
//   crowd-bump = the same crowd + one shoulder shoved into the right edge, a cap brim silhouette on top (= hat boy)
//   shelves    = cellar: we hide behind her shelves; jar shapes (right edge), a shelf edge (top + left), a bulb cord
//   hair       = v2-train 5:20 nap: a strand of her hair across the lens (left) + the window-frame edge (right)
//   fence      = rooftop establishing: chain-link mesh at the lower corners (watched from behind the fence)
//   genkan     = v2-home 0: the door-frame edge (left) + the shoe rack's end (bottom right), peeking into her home
import './nearlens.css';

export const NEAR_IDS = ['crowd', 'crowd-bump', 'shelves', 'hair', 'fence', 'genkan'];

// light per cel: base silhouette colour + the scene grade laid over it + the blur radius (px at 1920 wide)
const LIGHT = {
  crowd: { base: '#0c0e14', grade: '#6d7c8c', gradeO: 0.12, blur: 12 },
  shelves: { base: '#3a2418', grade: '#ffb070', gradeO: 0.14, blur: 13 },
};

// a commuter from behind: head + neck + shoulder mass, anchored at its base centre (x, y), s = scale
const person = (x, y, s, lean = 0) =>
  `M${x - 260 * s} ${y} Q${x - 250 * s} ${y - 300 * s} ${x - 120 * s + lean} ${y - 360 * s} Q${x - 70 * s + lean} ${y - 380 * s} ${x - 60 * s + lean} ${y - 430 * s}` +
  ` Q${x - 110 * s + lean} ${y - 560 * s} ${x + lean} ${y - 600 * s} Q${x + 110 * s + lean} ${y - 560 * s} ${x + 60 * s + lean} ${y - 430 * s}` +
  ` Q${x + 70 * s + lean} ${y - 380 * s} ${x + 120 * s + lean} ${y - 360 * s} Q${x + 250 * s} ${y - 300 * s} ${x + 260 * s} ${y}Z`;

function Crowd({ bump }) {
  return (
    <g>
      {/* left third: a tall shoulder + head cut by the frame, a second one lower, a tote bag strap + bag */}
      <path d={person(20, 1200, 1.55, 40)} />
      <path d={person(330, 1220, 0.9, -20)} opacity=".92" />
      <rect x="170" y="840" width="230" height="260" rx="36" opacity=".95" />
      <path d="M200 850 Q280 700 370 850" fill="none" stroke="currentColor" strokeWidth="18" />
      {/* right third: a backpack shoulder, a head */}
      <path d={person(1920, 1220, 1.45, -40)} />
      <rect x="1560" y="820" width="220" height="300" rx="60" opacity=".9" />
      {/* bottom: shoulders passing under the box */}
      <ellipse cx="960" cy="1150" rx="620" ry="120" />
      <ellipse cx="620" cy="1110" rx="260" ry="90" />
      {bump && (
        <g className="nl-bump">
          {/* hat boy: one shoulder shoved into the right frame edge, head + cap brim silhouette */}
          <path d="M2000 420 Q1700 440 1600 640 Q1560 760 1600 900 L2000 1000Z" />
          <ellipse cx="1790" cy="330" rx="150" ry="170" />
          <g fill="#6a3a14">
            <path d="M1640 270 Q1740 150 1900 170 Q1980 185 1990 260 L1990 290 Q1820 270 1640 295Z" />
            <path d="M1520 292 Q1600 262 1690 278 L1690 306 Q1600 300 1520 312Z" />
          </g>
        </g>
      )}
    </g>
  );
}

// a jar silhouette (lid + body) at base centre (x, y), w = body width
const jar = (x, y, w) => {
  const h = w * 1.5, lid = w * 0.8;
  return `M${x - lid / 2} ${y - h - w * 0.2}h${lid}v${w * 0.2}h${-lid}Z M${x - w / 2} ${y - h + 10}Q${x - w / 2} ${y - h} ${x - w / 2 + 16} ${y - h}H${x + w / 2 - 16}Q${x + w / 2} ${y - h} ${x + w / 2} ${y - h + 10}V${y - 10}Q${x + w / 2} ${y} ${x + w / 2 - 16} ${y}H${x - w / 2 + 16}Q${x - w / 2} ${y} ${x - w / 2} ${y - 10}Z`;
};

function Shelves() {
  return (
    <g>
      {/* the shelf we hide behind, right edge: an upright + two planks with jars cut by the frame */}
      <rect x="1790" y="-40" width="60" height="1160" />
      <rect x="1600" y="470" width="400" height="36" />
      <rect x="1560" y="1000" width="440" height="40" />
      <path d={`${jar(1700, 470, 170)} ${jar(1900, 470, 190)} ${jar(1690, 1000, 200)} ${jar(1910, 1000, 230)}`} />
      {/* top edge: the plank above us, crossing the top of the frame */}
      <rect x="-40" y="-40" width="2000" height="150" />
      <path d={`${jar(680, 118, 110)} ${jar(1180, 118, 100)}`} opacity=".9" />
      {/* left edge: a close upright, clear of the Kemey jar (x >= 190) */}
      <rect x="-40" y="-40" width="140" height="1160" />
      <path d={jar(40, 1100, 260)} />
      {/* the dangling bulb cord, close to the lens: a thin line and a pull */}
      <path d="M1510 100 Q1500 360 1520 560" fill="none" stroke="currentColor" strokeWidth="12" />
      <ellipse cx="1520" cy="580" rx="16" ry="28" />
    </g>
  );
}

// her hair on your shoulder (the 5:20 nap): one pale strand sweeping down across the top-left corner + the left edge,
// and the window frame's edge (a dark upright + the sill) on the right. Its own light: the strand is lit, not dark.
function Hair() {
  return (
    <g>
      <path d="M-60 -60 Q320 40 360 260 Q380 420 250 620 Q170 760 190 1140 L60 1140 Q30 760 110 600 Q220 400 170 240 Q120 110 -60 60Z" fill="#efe6ee" />
      <path d="M-60 120 Q180 200 200 380 Q210 520 110 720 Q60 860 80 1140 L-60 1140Z" fill="#dcd0e2" />
      <path d="M230 -60 Q430 60 420 200" fill="none" stroke="#f4ecf2" strokeWidth="26" />
      <rect x="1780" y="-40" width="180" height="1160" fill="#2c211a" />
      <rect x="1560" y="690" width="400" height="70" fill="#3a2c22" />
    </g>
  );
}

// chain-link at the lower corners (we are behind the fence): a diamond mesh clipped to two corner wedges + a post
const MESH = (() => {
  let d = '';
  for (let k = -20; k < 40; k++) { const x = k * 70; d += `M${x} 1120 L${x + 700} 420 M${x} 420 L${x + 700} 1120 `; }
  return d;
})();
function Fence() {
  return (
    <g>
      <clipPath id="nl-fence-clip"><path d="M-40 430 Q260 520 560 1120 L-40 1120Z M1960 430 Q1660 520 1360 1120 L1960 1120Z" /></clipPath>
      <path d={MESH} clipPath="url(#nl-fence-clip)" fill="none" stroke="currentColor" strokeWidth="11" />
      <rect x="40" y="380" width="56" height="740" />
      <rect x="1830" y="380" width="56" height="740" />
      <rect x="-40" y="470" width="340" height="26" transform="rotate(14 -40 470)" />
      <rect x="1620" y="552" width="340" height="26" transform="rotate(-14 1960 470)" />
    </g>
  );
}

// the genkan, peeking in: the door frame's edge (left) and the shoe rack's end (bottom right), both close + dark wood
function Genkan() {
  return (
    <g>
      <rect x="-40" y="-40" width="260" height="1160" />
      <rect x="220" y="-40" width="40" height="1160" opacity=".7" />
      <path d="M1560 1120 L1600 700 L1960 650 L1960 1120Z" />
      <path d="M1600 700 L1960 650 L1960 690 L1596 736Z" fill="#6b4a30" />
    </g>
  );
}

const KIND = { crowd: 'crowd', 'crowd-bump': 'crowd', shelves: 'shelves', hair: 'hair', fence: 'fence', genkan: 'genkan' };
Object.assign(LIGHT, {
  hair: { base: '#2c211a', grade: '#a0784a', gradeO: 0.18, blur: 18 },
  fence: { base: '#3e4a52', grade: '#9ab8d0', gradeO: 0.18, blur: 9 },
  genkan: { base: '#1a0f09', grade: '#c08850', gradeO: 0.12, blur: 12 },
});

export function NearLens({ near }) {
  if (!NEAR_IDS.includes(near)) return null;
  const kind = KIND[near], L = LIGHT[kind];
  const cel = { crowd: <Crowd bump={near === 'crowd-bump'} />, shelves: <Shelves />, hair: <Hair />, fence: <Fence />, genkan: <Genkan /> }[kind];
  return (
    <svg className={`nl-near nl-${kind}`} data-near={near} viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true"
      style={{ '--nl-blur': `${L.blur}px`, color: L.base }}>
      <g fill="currentColor">{cel}</g>
      {/* the scene light: the same silhouettes, flat-graded */}
      <g fill={L.grade} stroke={L.grade} opacity={L.gradeO}>{cel}</g>
    </svg>
  );
}

export default NearLens;
