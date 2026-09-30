// r5-ume shots (research/sprint-0930/r5-ume/AUDIT.md): the close-ups a line names, each pushed into the scene's OWN
// traced bg (Backdrop) with flat cels on top, lit by that bg's one light. Stage px 1920 x 1080; the dialogue box owns the
// band below y ~780, so every subject sits above it. No motion.
import { Backdrop, Contact, HerLegFront, HerLegSide, YouLegSide, HerPalmUp, Key, HER, YOU, SKIN, INK } from './parts.jsx';
import { Hand, SP } from '../shop/parts.jsx';
import { nandaSVG, pinArmSVG } from '../nanda.js';
import { Umeboshi } from '../scene-a/foods.jsx';

const Svg = ({ label, children }) => <svg className="art" viewBox="0 0 1920 1080" role="img" aria-label={label}>{children}</svg>;
const Vig = ({ id, a = 0.4, c = '#1a0c14' }) => (
  <g aria-hidden="true">
    <defs><radialGradient id={id} cx=".5" cy=".45" r=".75"><stop offset=".55" stopColor={c} stopOpacity="0" /><stop offset="1" stopColor={c} stopOpacity={a} /></radialGradient></defs>
    <rect width="1920" height="1080" fill={`url(#${id})`} />
  </g>
);


// her skirt's lower edge at the top of a low close-up (whose legs these are): lavender pleats, the pink body rim
function SkirtHem({ x0 = 600, x1 = 1320, y0 = 110, y1 = 250 }) {
  const n = 8, w = (x1 - x0) / n;
  return (
    <g>
      <path d={`M${x0} ${y0} L${x1} ${y0} L${x1 + 10} ${y1} L${x0 - 10} ${y1}Z`} fill={HER.skirt} />
      {Array.from({ length: n - 1 }, (_, i) => <path key={i} d={`M${x0 + w * (i + 1)} ${y0} L${x0 + w * (i + 1) + (i - 3) * 2} ${y1}`} stroke={HER.skirt2} strokeWidth="7" />)}
      <path d={`M${x0} ${y0 + 26} H${x1}`} stroke="#fff" strokeWidth="8" />
      <path d={`M${x0 - 10} ${y1} H${x1 + 10}`} stroke={HER.rim} strokeWidth="10" strokeLinecap="round" />
    </g>
  );
}

// ---- rooftop 2: "Her shoes by the fence. Toes pointed at you." A low insert at the fence base: her two loafers + socks,
// toes to the lens, legs cut at the knee by the frame top; the chain-link + its post behind her, sharp, the roof beyond soft.
function Mesh({ x0, x1, y0, y1, cell = 46, color = '#6f7f86', w = 3 }) {
  const d = [];
  for (let x = x0 - (y1 - y0); x < x1; x += cell) d.push(`M${x} ${y1}L${x + (y1 - y0)} ${y0}`, `M${x} ${y0}L${x + (y1 - y0)} ${y1}`);
  return (
    <g>
      <defs><clipPath id="r5-mesh-c"><rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} /></clipPath></defs>
      <g clipPath="url(#r5-mesh-c)" stroke={color} strokeWidth={w} fill="none" opacity=".9">{d.map((p, i) => <path key={i} d={p} />)}</g>
    </g>
  );
}
export function ShoesFence({ rm }) {
  return (
    <div className="art shot r5-shot">
      <Backdrop of="rooftop-noon" x={420} y={760} zoom={2.2} blur={4} rm={rm} />
      <Svg label="Close-up at the rooftop fence: her two small maroon shoes and white socks, toes pointed straight at you, the chain-link fence behind her.">
        {/* the fence line: a concrete kerb, its chain-link, a post; the noon sun is high and a little left */}
        <rect x="0" y="560" width="1920" height="70" fill="#b9bec4" />
        <rect x="0" y="560" width="1920" height="12" fill="#e4e8ec" />
        <rect x="0" y="626" width="1920" height="8" fill="#8e969c" opacity=".7" />
        <Mesh x0={0} x1={1920} y0={-20} y1={562} />
        <rect x="1470" y="-20" width="34" height="590" fill="#7c8a90" /><rect x="1476" y="-20" width="8" height="590" fill="#c9d3d8" />
        <rect x="-20" y="190" width="1960" height="16" fill="#7c8a90" />
        {/* the chain-link's shadow on the floor, falling toward you */}
        <path d="M0 634 L1920 634 L1920 700 L0 700Z" fill="#5a6470" opacity=".12" />
        <Contact x={835} y={784} rx={150} ry={26} dx={18} op={0.4} />
        <Contact x={1095} y={784} rx={150} ry={26} dx={18} op={0.4} />
        <HerLegFront x={830} y={784} w={118} top={236} />
        <HerLegFront x={1090} y={784} w={118} top={236} />
        {/* her skirt hem, cut by the frame top: these are HER legs */}
        <SkirtHem />
      </Svg>
    </div>
  );
}

// ---- park 4 / rain 4: "Two pairs of shoes walk..." A low tracking shot on the ground: your loafers mid-stride, hers two
// small steps beside them, close. wet: the road after the rain (puddles mirror the shoes, rings, no falling rain).
export function ShoesWalk({ props = {}, rm }) {
  const { of = 'park', x = 900, y = 860, zoom = 2, wet = false, ground = 752 } = props;
  const G = ground;
  return (
    <div className="art shot r5-shot">
      <Backdrop of={of} x={x} y={y} zoom={zoom} blur={wet ? 3 : 4} rm={rm} props={props.ofProps ?? {}} />
      <Svg label={wet ? 'Low on the wet road: your brown loafers and her small maroon shoes walk side by side through the puddles. The rain has stopped.' : 'Low on the park path: your brown loafers mid-stride, and her small maroon shoes taking two steps to each of yours, close beside them.'}>
        {/* a sharp strip of the ground they walk on (the focus plane) */}
        <path d={`M0 ${G - 30} L1920 ${G - 30} L1920 ${G + 60} L0 ${G + 60}Z`} fill={wet ? '#46505c' : '#d8b9a2'} opacity={wet ? 0.35 : 0.28} />
        {wet && (
          <g>
            <ellipse cx="880" cy={G + 16} rx="360" ry="34" fill="#9fb4c8" opacity=".35" />
            <ellipse cx="1320" cy={G + 20} rx="260" ry="26" fill="#9fb4c8" opacity=".32" />
            {/* the mirror: the shoes upside down, faint, in the puddles */}
            <g transform={`translate(0 ${2 * G + 16}) scale(1 -1)`} opacity=".22">
              <YouLegSide x={930} y={G} L={240} top={G - 330} />
              <HerLegSide x={1290} y={G} L={160} top={G - 300} />
            </g>
            {[[760, 10, 90], [1010, 18, 60], [1400, 14, 70], [1180, 22, 40]].map(([cx, dy, r], i) => <ellipse key={i} cx={cx} cy={G + dy} rx={r} ry={r * 0.18} fill="none" stroke="#e8f2ff" strokeWidth="3" opacity=".55" />)}
          </g>
        )}
        <Contact x={630} y={G + 6} rx={140} ry={16} dx={-30} op={0.25} />
        <Contact x={930} y={G + 6} rx={150} ry={18} dx={-30} op={0.34} />
        <Contact x={1170} y={G + 5} rx={96} ry={13} dx={-20} op={0.3} />
        <Contact x={1290} y={G + 5} rx={96} ry={13} dx={-20} op={0.34} />
        {/* you: back foot lifting, front foot planted */}
        <YouLegSide x={620} y={G} L={240} lift={16} top={-20} lean={70} />
        <YouLegSide x={930} y={G} L={240} top={-20} lean={-40} />
        {/* her: two small steps, right beside your front foot */}
        <HerLegSide x={1165} y={G} L={160} lift={12} top={290} lean={44} />
        <HerLegSide x={1290} y={G} L={160} top={300} lean={-26} />
        {/* her skirt hem + your blazer hem cut by the frame top: whose legs these are */}
        <path d="M1080 250 L1400 250 L1410 312 L1070 312Z" fill={HER.skirt} stroke={HER.rim} strokeWidth="6" />
      </Svg>
    </div>
  );
}

// ---- park 2: "Her thumb is on your wrist. She is counting your pulse." Your forearm, palm up, across the frame; her pin
// hand's nub presses the inside of your wrist; she leans in from the right edge, eyes on the spot, counting.
export function WristPulse({ rm }) {
  const her = nandaSVG({ face: 'big-eyes-peek', talk: false, arms: [{ from: 'L2', to: [-96, 82], c1: [-30, 70], c2: [-70, 60], w: [3, 3.4], r: 6, fingers: [150, 200] }] });
  return (
    <div className="art shot r5-shot">
      <Backdrop of="park" x={760} y={560} zoom={1.7} blur={7} rm={rm} />
      <Svg label="Close-up: your forearm across the frame, palm up. Her round pin hand presses the inside of your wrist. She leans in from the right, counting your pulse.">
        <Vig id="r5-wr-v" a={0.35} />
        {/* your arm: the navy sleeve off the left edge, the shirt cuff, the wrist, the open hand */}
        <path d="M-60 470 L520 450 L528 640 L-60 660Z" fill={YOU.pants} stroke={YOU.line} strokeWidth="5" />
        <path d="M500 452 L560 450 L566 642 L506 640Z" fill="#f4f1ea" stroke="#9a948a" strokeWidth="4" />
        <Hand x={600} y={548} rot={90} s={1.3} pose="flat" thumb="right" sleeve="#f4f1ea" />
        {/* the pulse: small beat ticks round her nub */}
        <g stroke="#e0467f" strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M700 452 q10 -18 26 -26 M748 436 q18 -6 30 -2 M690 640 q12 18 30 22 M744 668 q18 2 30 -6" />
        </g>
        <text x="760" y="410" fontFamily="M PLUS Rounded 1c, sans-serif" fontWeight="900" fontSize="46" fill="#fff" stroke="#b0103e" strokeWidth="10" paintOrder="stroke">ドクン</text>
        {/* her, leaning in from the right edge; her lower pin stretches to your wrist */}
        <g transform="translate(1560 900) scale(3)" dangerouslySetInnerHTML={{ __html: her }} />
      </Svg>
    </div>
  );
}

// ---- rain 2: "Close-up. Her shoes are wet. She walks in the puddles for you." Her shoes in a puddle on the alley road,
// a splash crown, rings spreading; the rain still falls (the player's rain layer).
export function ShoesPuddle({ rm }) {
  const drops = [[-120, -40, 16], [-160, -90, 11], [-60, -120, 13], [130, -60, 15], [180, -110, 10], [70, -140, 12], [-30, -70, 9]];
  return (
    <div className="art shot r5-shot">
      <Backdrop of="rain-alley" x={960} y={880} zoom={2.2} blur={4} rm={rm} />
      <Svg label="Close-up on the wet alley: her small maroon shoes stand in a puddle, water splashing up round them, rings spreading.">
        <defs><linearGradient id="r5-pd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c2638" /><stop offset="1" stopColor="#2e3c54" /></linearGradient></defs>
        <ellipse cx="960" cy="770" rx="560" ry="70" fill="url(#r5-pd)" opacity=".85" />
        <ellipse cx="960" cy="770" rx="560" ry="70" fill="none" stroke="#8fa8c8" strokeWidth="3" opacity=".5" />
        {/* the shoes' mirror in the puddle */}
        <g transform="translate(0 1552) scale(1 -1)" opacity=".28"><HerLegFront x={830} y={776} w={112} top={420} /><HerLegFront x={1090} y={776} w={112} top={420} /></g>
        {[[960, 770, 480], [960, 772, 360], [700, 774, 150], [1230, 772, 160]].map(([cx, cy, r], i) => <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.11} fill="none" stroke="#dbe8ff" strokeWidth="3" opacity=".6" />)}
        <HerLegFront x={830} y={776} w={112} top={236} />
        <HerLegFront x={1090} y={776} w={112} top={236} />
        {/* wet shine on the shoes + the splash crown at the right foot's toe */}
        <path d="M770 700 q20 -16 44 -10 M1030 700 q20 -16 44 -10" stroke="#e8f2ff" strokeWidth="6" strokeLinecap="round" opacity=".8" />
        {drops.map(([dx, dy, r], i) => <ellipse key={i} cx={1090 + dx} cy={756 + dy} rx={r * 0.7} ry={r} fill="#cfe2ff" stroke="#6f8fb8" strokeWidth="3" />)}
        <path d="M960 780 q-24 -34 -8 -64 M1224 780 q26 -30 12 -62" stroke="#cfe2ff" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".8" />
        <SkirtHem />
      </Svg>
    </div>
  );
}

// ---- street 3: "Close-up. Her house key. Her fist opens. Red marks on her palm." Her hand, open, palm up, the key lying
// where she held it since noon; red dents in the key's shape pressed into her palm. Warm low sun behind (her street).
export function KeyPalm({ rm }) {
  const marks = (
    <g stroke="#d6405a" strokeWidth="7" fill="none" strokeLinecap="round" opacity=".62">
      <circle cx="-34" cy="-20" r="30" />
      <path d="M-4 -30 L112 -64 M110 -44 L118 -20 M88 -38 L94 -18" />
    </g>
  );
  return (
    <div className="art shot r5-shot">
      <Backdrop of="street-dusk" x={960} y={500} zoom={1.6} blur={9} dim={0.95} rm={rm} />
      <Svg label="Extreme close-up: her open hand, palm up. Her small brass house key lies on it, a pink heart tag with the number 12. Red marks in the key's shape are pressed into her palm.">
        <Vig id="r5-kp-v" a={0.3} c="#3a1a10" />
        <HerPalmUp x={960} y={520} s={1.55} rot={-8} marks={marks}>
          <Key x={30} y={26} s={0.78} rot={-24} />
        </HerPalmUp>
      </Svg>
    </div>
  );
}

// ---- street 5: "Close-up. The key turns. Click. Door 12 opens." Her door close up: the 12 plate, the brass lock with
// the key in it, turned; her hand (pink cuff) on the key; the door edge already open a crack of warm light.
export function KeyLock({ rm }) {
  return (
    <div className="art shot r5-shot">
      <Backdrop of="her-building" x={1372} y={420} zoom={2.6} blur={6} dim={0.9} rm={rm} />
      <Svg label="Close-up on door 12 at night: the number plate, the brass lock with her key in it, turned. Her hand is on the key. The door is open a crack and warm light shows.">
        <defs><linearGradient id="r5-door" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2c3a66" /><stop offset="1" stopColor="#3b4c80" /></linearGradient></defs>
        {/* the door panel fills the right two thirds; its open edge on the left shows the warm hall */}
        <rect x="560" y="-20" width="1400" height="1120" fill="url(#r5-door)" />
        <rect x="532" y="-20" width="40" height="1120" fill="#ffd89a" />
        <rect x="520" y="-20" width="16" height="1120" fill="#1a2240" />
        <rect x="640" y="60" width="1160" height="1000" rx="10" fill="none" stroke="#243056" strokeWidth="10" />
        {/* the 12 plate */}
        <rect x="1180" y="150" width="260" height="170" rx="14" fill="#f4f1ea" stroke="#1a1a24" strokeWidth="8" />
        <text x="1310" y="280" textAnchor="middle" fontFamily="Nunito Variable, Nunito, sans-serif" fontWeight="900" fontSize="130" fill="#1a1a24">12</text>
        {/* the lever handle + the lock cylinder under it */}
        <rect x="700" y="420" width="70" height="200" rx="24" fill="#c9ced6" stroke="#4a4e58" strokeWidth="6" />
        <rect x="700" y="470" width="300" height="60" rx="28" fill="#dfe3ea" stroke="#4a4e58" strokeWidth="6" />
        <circle cx="735" cy="700" r="62" fill="#d9b24a" stroke="#6e4a10" strokeWidth="7" />
        <circle cx="735" cy="700" r="40" fill="#b88a2a" />
        {/* the key, turned a quarter (its bow now upright), her fingers pinching the bow */}
        <Key x={735} y={560} s={0.9} rot={-90} tag={false} />
        <g transform="translate(735 700)"><rect x="-10" y="-40" width="20" height="46" fill="#e7b64a" stroke="#6e4a10" strokeWidth="4" /></g>
        <Hand x={860} y={690} rot={-70} s={1.05} her pose="pinch" thumb="right" />
        {/* the click, lettered at the lock */}
        <text x="880" y="820" fontFamily="M PLUS Rounded 1c, sans-serif" fontWeight="900" fontSize="78" fill="#fff4c4" stroke="#6e4a10" strokeWidth="12" paintOrder="stroke" transform="rotate(-8 880 820)">カチッ</text>
        <path d="M560 740 l-60 -20 M560 680 l-70 -4 M560 800 l-56 -40" stroke="#fff4c4" strokeWidth="8" strokeLinecap="round" />
      </Svg>
    </div>
  );
}

// ---- cup 2: "Third teacup. Nobody poured it. One umeboshi on its saucer." The empty third cup on its saucer, one red
// umeboshi beside it, on her tea table; the night window soft behind.
export function CupSaucer({ rm, props = {} }) {
  const tama = props.plate === 'tamagoyaki';
  return (
    <div className="art shot r5-shot">
      <Backdrop of="sitting-room" x={1260} y={760} zoom={2.4} blur={10} rm={rm} props={props} />
      <Svg label={tama ? 'Close-up: the third teacup, empty, on its saucer. A tamagoyaki slice sits on the saucer.' : 'Close-up: the third teacup, empty, on its saucer. One red umeboshi sits on the saucer.'}>
        <rect x="0" y="600" width="1920" height="480" fill="#5a3222" />
        <rect x="0" y="600" width="1920" height="14" fill="#8a5a3a" />
        <ellipse cx="930" cy="690" rx="420" ry="74" fill="#1a0e0a" opacity=".35" />
        <ellipse cx="960" cy="668" rx="400" ry="80" fill="#f6f1ea" stroke="#6e5a52" strokeWidth="6" />
        <ellipse cx="960" cy="660" rx="300" ry="54" fill="#e8e0d6" />
        {/* the cup: white, a pink band, EMPTY (the dry bottom shows) */}
        <path d="M780 420 L1140 420 L1110 640 Q960 690 810 640Z" fill="#fbf8f2" stroke="#6e5a52" strokeWidth="7" strokeLinejoin="round" />
        <path d="M800 520 L1122 520 L1116 560 L806 560Z" fill="#ff8fb8" />
        <ellipse cx="960" cy="420" rx="180" ry="36" fill="#e9e2da" stroke="#6e5a52" strokeWidth="7" />
        <ellipse cx="960" cy="432" rx="140" ry="22" fill="#d9d0c6" />
        <path d="M1090 450 L1100 600" stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity=".7" />
        {tama ? (
          <g transform="translate(1250 640) rotate(-8)"><rect x="-90" y="-50" width="180" height="90" rx="22" fill="#f6c94a" stroke="#8a5a10" strokeWidth="6" /><path d="M-60 -10 q30 -30 60 0 q30 30 60 0" stroke="#e0a020" strokeWidth="6" fill="none" /></g>
        ) : (
          <g transform="translate(1235 626)"><Umeboshi r={70} uid="r5-cs-u" /></g>
        )}
        <Vig id="r5-cs-v" a={0.45} c="#0d1424" />
      </Svg>
    </div>
  );
}

// ---- steeped 3: "Close-up. Your cup, empty. Hers, full. She never drank." Two cups side by side: yours drained, hers
// full to the brim, cold (no steam).
export function CupsPair({ rm }) {
  const cup = (x, full) => (
    <g>
      <ellipse cx={x - 10} cy="712" rx="210" ry="40" fill="#1a0e0a" opacity=".35" />
      <path d={`M${x - 190} 400 L${x + 190} 400 L${x + 160} 660 Q${x} 718 ${x - 160} 660Z`} fill="#fbf8f2" stroke="#6e5a52" strokeWidth="7" strokeLinejoin="round" />
      <path d={`M${x - 176} 500 L${x + 176} 500 L${x + 170} 544 L${x - 170} 544Z`} fill="#ff8fb8" />
      <ellipse cx={x} cy="400" rx="190" ry="40" fill={full ? '#8a9a3a' : '#e9e2da'} stroke="#6e5a52" strokeWidth="7" />
      {full ? <ellipse cx={x - 40} cy="394" rx="80" ry="12" fill="#b9c86a" opacity=".6" /> : <ellipse cx={x} cy="414" rx="150" ry="24" fill="#d9d0c6" />}
      <path d={`M${x + 140} 430 L${x + 150} 600`} stroke="#fff" strokeWidth="14" strokeLinecap="round" opacity=".7" />
    </g>
  );
  return (
    <div className="art shot r5-shot">
      <Backdrop of="bedroom" x={960} y={640} zoom={2} blur={10} dim={0.85} rm={rm} />
      <Svg label="Close-up: two teacups side by side. Yours is empty. Hers is full to the brim and cold. She never drank.">
        <rect x="0" y="640" width="1920" height="440" fill="#4a2a1c" />
        <rect x="0" y="640" width="1920" height="12" fill="#7e4a2e" />
        {cup(640, false)}
        {cup(1280, true)}
        <Vig id="r5-cp-v" a={0.5} c="#0d0714" />
      </Svg>
    </div>
  );
}

// ---- the dining chairs at her tea table (home 3-4): the middle chair, seen from behind (yours), for the kitchen wide
export function ChairBack({ x = 960, y = 700, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-190" y="0" width="30" height="420" rx="8" fill="#5a321e" stroke="#2a160e" strokeWidth="5" />
      <rect x="160" y="0" width="30" height="420" rx="8" fill="#5a321e" stroke="#2a160e" strokeWidth="5" />
      <rect x="-200" y="-10" width="400" height="56" rx="16" fill="#6a3c26" stroke="#2a160e" strokeWidth="6" />
      <rect x="-170" y="120" width="340" height="30" rx="8" fill="#6a3c26" stroke="#2a160e" strokeWidth="5" />
      <path d="M-180 4 H170" stroke="#9a6a44" strokeWidth="8" strokeLinecap="round" />
    </g>
  );
}
