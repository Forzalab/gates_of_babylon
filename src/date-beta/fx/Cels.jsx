// R5 cels (Tony 09-30): small flat SVG cels drawn OVER the focus blur (the action stays crisp, the bg blurs), under
// Nanda + the box. Picked by props.cel (or props.bump 'laugh' -> bump). Still art, no motion. Stage units (1920x1080).
// Her palette: rim #d1177f, lit #ffc4e6, ink #6b0f45 (art/nanda.js SWEET).
const RIM = '#d1177f', LIT = '#ffc4e6', INK = '#6b0f45';
const STAR = '0,-46 12,-14 44,-20 20,4 38,34 6,20 -6,50 -12,18 -44,26 -22,0 -40,-28 -8,-16';
const sfx = (x, y, text, rot = -8, size = 68) => <text x={x} y={y} textAnchor="middle" fill="#fff" stroke={INK} strokeWidth="9" paintOrder="stroke" fontSize={size} fontWeight="900" transform={`rotate(${rot} ${x} ${y})`}>{text}</text>;

// v2-train 3: the two men bump into her: two impact stars at her sides + ドンッ
function Bump() {
  return (<>
    {[[742, 470, -1], [1160, 480, 1]].map(([x, y, d]) => (
      <g key={x} transform={`translate(${x} ${y})`}>
        <polygon points={STAR} fill="#fff4b8" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d={`M${d * 30},-60 l${d * 26},-14 M${d * 44},-30 l${d * 30},-4 M${d * 40},4 l${d * 28},10`} stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      </g>))}
    {sfx(600, 360, 'ドンッ')}
  </>);
}

// v2-street 3 "Close-up. Her house key. Her fist opens. Red marks on her palm.": her hand = her pin nub (the cartoon
// hand, Tony 09-30), huge, opened flat; the key lies on it, beside the red imprint of itself (she held it since noon).
function KeyPalm() {
  return (<>
    <path d="M-40 1000 Q420 880 700 640" fill="none" stroke={RIM} strokeWidth="70" strokeLinecap="round" />
    <path d="M-40 1000 Q420 880 700 640" fill="none" stroke={LIT} strokeWidth="30" strokeLinecap="round" />
    <ellipse cx="960" cy="470" rx="330" ry="250" fill={LIT} stroke={RIM} strokeWidth="16" />
    <ellipse cx="860" cy="380" rx="110" ry="60" fill="#fff" opacity=".55" />
    {/* the red marks: the key's own outline pressed into her palm (a red imprint beside where the key lies now) */}
    <g transform="translate(990 540) rotate(-18)" fill="none" stroke="#e0243f" strokeWidth="9" strokeLinejoin="round" opacity=".7">
      <circle cx="-150" cy="0" r="66" /><path d="M-84 -16 H160 V16 H-84 M104 16 v36 h20 v-36 M142 16 v24 h16 v-24" />
    </g>
    <g transform="translate(960 440) rotate(-24)">
      <circle cx="-150" cy="0" r="72" fill="#f2c14a" stroke="#8a5a10" strokeWidth="10" /><circle cx="-150" cy="0" r="28" fill={LIT} stroke="#8a5a10" strokeWidth="8" />
      <path d="M-80 -18 H170 V18 H-80Z M110 18 v40 h24 v-40 M150 18 v28 h20 v-28" fill="#f2c14a" stroke="#8a5a10" strokeWidth="10" strokeLinejoin="round" />
    </g>
    <path d="M1330 250 l30 -26 M1350 300 l40 -6 M1330 350 l34 20" stroke={RIM} strokeWidth="8" strokeLinecap="round" />
  </>);
}

// v2-street 5 "The key turns. Click. Door 12 opens.": カチッ at the lock + warm light spilling from the opening door
function DoorClick() {
  return (<>
    <polygon points="1040,300 1080,300 1300,960 1120,960" fill="#ffd98a" opacity=".38" />
    {sfx(1240, 380, 'カチッ', -6, 76)}
  </>);
}

const CELS = { bump: Bump, 'key-palm': KeyPalm, 'door-click': DoorClick };
export const celOf = (props) => (props?.bump === 'laugh' ? 'bump' : props?.cel ?? null);

export function Cel({ id }) {
  const C = CELS[id];
  if (!C) return null;
  return <svg className="db-cel" viewBox="0 0 1920 1080" aria-hidden="true" data-cel={id}><C /></svg>;
}
