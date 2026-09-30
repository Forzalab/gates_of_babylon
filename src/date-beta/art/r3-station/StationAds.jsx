// v2-train 2: the crowd line (ref 11: benches + the ad wall). Same 4:30 overcast grade as the gate.
// Hand pass: station sign 「NAND駅」 (the group's name gag), the next-train board (4:30 → OR again), the ad wall
// redrawn as our own posters, KEEPING the ref's red "WATCHING YOU" poster (a yandere wink: the eyes follow you),
// (train-r4: the green tea machine became the platform PlatformVending, Vending.jsx), the fire box, straight pillars and a clean yellow tactile strip.
// StationAdsInsert (v2-train 3, "she taps her card, twice"): the same art, insert framing on the vending + gate side,
// plus a ticket gate with an IC reader in the left third (Nanda keeps the centre).
import { R3Scene, Pole, preloadTrace, pts } from './parts.jsx';
import { Crowd, Shafts, WavyGuy, CapGuy, scatter } from './Crowd.jsx';
import { PlatformVending } from './Vending.jsx';

preloadTrace('station-ads');

function Poster({ x, y, w, h, bg, children }) {
  return (
    <g>
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} fill="#9fb4bf" />
      <rect x={x} y={y} width={w} height={h} fill={bg} />
      {children}
    </g>
  );
}

function Watching() {
  // the red poster, cleaned: a cream face whose pupils look straight out, the ref's caption, one small heart
  return (
    <Poster x={772} y={312} w={182} h={174} bg="#d8403a">
      <circle cx="863" cy="382" r="50" fill="#fbe6cf" />
      <path d="M813 372c6-40 94-40 100 0c-8-16-22-24-50-24s-42 8-50 24z" fill="#3a2230" />
      <ellipse cx="845" cy="386" rx="11" ry="13" fill="#fff" /><ellipse cx="881" cy="386" rx="11" ry="13" fill="#fff" />
      <circle cx="845" cy="389" r="6" fill="#1a0f18" /><circle cx="881" cy="389" r="6" fill="#1a0f18" />
      <path d="M850 410q13 8 26 0" stroke="#8a2a3a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M904 402c-3-6-11-4-9 2l9 8 9-8c2-6-6-8-9-2z" fill="#ff8fc0" />
      <text x="863" y="472" textAnchor="middle" className="r3-sign" fill="#fff4e0" fontSize="24">WATCHING YOU</text>
    </Poster>
  );
}

export function StationAdsArt({ drink }) {
  return (
    <g>
      {/* the next-train board (ref: G1 次 00:00 開往 幻想郷) */}
      <rect x="216" y="126" width="364" height="150" rx="6" fill="#56636e" />
      <rect x="226" y="136" width="344" height="130" rx="3" fill="#1a1414" />
      <text x="398" y="190" textAnchor="middle" className="r3-led" fill="#ffc861" fontSize="44">4:30 → OR</text>
      <text x="244" y="244" className="r3-led" fill="#ff9a8a" fontSize="26">つぎ NEXT</text>
      <text x="552" y="244" textAnchor="end" className="r3-led" fill="#f4efe2" fontSize="26">1ばんせん</text>
      {/* station name sign (ref: 如月站) */}
      <rect x="598" y="198" width="182" height="90" rx="4" fill="#9fb4bf" />
      <rect x="604" y="204" width="170" height="78" rx="2" fill="#1f2a38" />
      <text x="689" y="252" textAnchor="middle" className="r3-jp" fill="#fff" fontSize="42">NAND駅</text>
      <text x="689" y="275" textAnchor="middle" className="r3-sign" fill="#c9d8ff" fontSize="16">NAND-eki</text>
      {/* the ad wall: our own posters + the kept WATCHING YOU */}
      <Poster x={336} y={318} w={118} h={180} bg="#ffb347">
        <ellipse cx="395" cy="428" rx="42" ry="16" fill="#fff4dc" />
        <path d="M355 428a40 36 0 0 0 80 0z" fill="#e8762c" />
        <text x="395" y="372" textAnchor="middle" className="r3-jp" fill="#7a2d10" fontSize="30">カレー</text>
        <text x="395" y="482" textAnchor="middle" className="r3-sign" fill="#7a2d10" fontSize="20">CURRY</text>
      </Poster>
      <Poster x={502} y={312} w={242} h={186} bg="#bfe3ff">
        <path d="M502 450 C560 410 640 420 744 400 L744 498 L502 498Z" fill="#8fcf8f" />
        {[[560, 360], [620, 390], [690, 350]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="24" fill="#ffc2dc" />)}
        <text x="623" y="484" textAnchor="middle" className="r3-jp" fill="#2d4d6a" fontSize="30">はる SPRING</text>
      </Poster>
      <Watching />
      <Poster x={1134} y={316} w={108} h={124} bg="#8fd6b8">
        <text x="1188" y="390" textAnchor="middle" className="r3-sign" fill="#1f5a44" fontSize="30">♪ ♪</text>
      </Poster>
      <Poster x={1262} y={318} w={124} h={100} bg="#ffe07a">
        <text x="1324" y="378" textAnchor="middle" className="r3-sign" fill="#7a5a10" fontSize="26">SALE</text>
      </Poster>
      {/* platform number */}
      <rect x="1436" y="340" width="62" height="46" rx="4" fill="#f4efe2" />
      <text x="1467" y="378" textAnchor="middle" className="r3-sign" fill="#1f2a38" fontSize="38">1</text>
      <PlatformVending x={66} y={316} w={286} h={516} drink={drink} />
      {/* fire box (ref: 灭火器) */}
      <rect x="806" y="516" width="118" height="134" rx="4" fill="#c8322b" />
      <rect x="818" y="530" width="94" height="40" rx="3" fill="#f4efe2" />
      <text x="865" y="560" textAnchor="middle" className="r3-sign" fill="#c8322b" fontSize="26">FIRE</text>
      <text x="865" y="616" textAnchor="middle" className="r3-jp" fill="#fff4e0" fontSize="26">しょうか</text>
      {/* straight pillars */}
      <Pole x={40} y0={0} y1={995} w={46} fill="#7c95a0" hi="#c3d3da" />
      <Pole x={1031} y0={170} y1={700} w={52} fill="#6f8893" hi="#b9ccd4" />
      <Pole x={1415} y0={250} y1={592} w={40} fill="#6f8893" hi="#b9ccd4" />
      <Pole x={1621} y0={200} y1={522} w={30} fill="#6f8893" hi="#b9ccd4" />
    </g>
  );
}

// the yellow tactile strip, bottom left -> far right (ref 11); drawn under the pillars' feet
const STRIP = [[150, 1080], [500, 1080], [1880, 552], [1830, 540]];

// train-r4: the crowd (refs 07-08) + the two bumpers either side of her. props.bump: 'laugh' (v2-train 3: they bump into her
// and laugh; R5: they touch her + ドンッ impact marks, fx/Cels.jsx)
// | 'named' (beat 5: she calls them out; each gets the chip of her styled span: a teal wave, an orange cap).
const BACK = scatter(52, 14, [1440, 1900], [520, 600], [100, 170]);
const FRONT = [[1800, 1140, 720]];
const SHAFTS = ['1560,0 1680,0 1180,1080 1000,1080', '1780,0 1840,0 1480,1080 1390,1080', '1100,0 1150,0 560,1080 500,1080'];

export default function StationAds({ props, rm }) {
  const mood = props?.bump ?? 'plain';
  return (
    <R3Scene id="station-ads" tone="overcast" rm={rm}
      label={`NAND station platform at 4:30 PM, crowded: an ad wall with a red WATCHING YOU poster, a drink vending machine, a wavy-haired guy with a teal scarf left of her and a guy in an orange cap right of her${mood === 'laugh' ? ', both laughing' : ''}.`}>
      <polygon points={pts(STRIP)} fill="#d2ad3e" />
      <polygon points={pts([[500, 1080], [520, 1080], [1890, 556], [1880, 552]])} fill="#b8922a" />
      <StationAdsArt drink={props?.drink} />
      <Crowd seed={52} back={BACK} front={[]} />
      {/* R5: on the bump beat the two men are shoulder-to-shoulder with her (contact, not 400 px away); the impact marks are
          fx/Cels.jsx, over the focus blur (the action stays crisp) */}
      <WavyGuy x={mood === 'laugh' ? 700 : 560} y={930} h={590} mood={mood} />
      <CapGuy x={mood === 'laugh' ? 1215 : 1330} y={940} h={610} mood={mood} />
      <Crowd seed={54} back={[]} front={FRONT} />
      <Shafts id="r4sa" bands={SHAFTS} op={0.2} />
    </R3Scene>
  );
}

// v2-train 3: insert on the vending + gate side (the same art at 1.9x, left half), ticket gate + IC reader over it
export function StationAdsInsert({ props, rm }) {
  const gate = (
    <g>
      <defs>
        <radialGradient id="r3in-pad"><stop offset="0" stopColor="#bff2ff" /><stop offset="1" stopColor="#2f8fd6" /></radialGradient>
        <filter id="r3in-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      {/* gate cabinet, left third: top face + front */}
      <polygon points="120,760 640,710 720,750 200,810" fill="#e7ecef" />
      <polygon points="200,810 720,750 720,1080 200,1080" fill="#b9c4cb" />
      <polygon points="120,760 200,810 200,1080 120,1080" fill="#8e9aa2" />
      <rect x="200" y="840" width="520" height="16" fill="#2fb36b" />
      {/* the IC reader on top, glowing */}
      <ellipse cx="520" cy="738" rx="90" ry="30" fill="#6fd0ff" filter="url(#r3in-glow)" opacity=".8" />
      <polygon points="440,720 600,706 620,740 460,756" fill="url(#r3in-pad)" stroke="#1d5f93" strokeWidth="4" />
      <text x="530" y="742" textAnchor="middle" className="r3-sign" fill="#0d3a5e" fontSize="28">IC</text>
      {/* twice: two beeps */}
      <text x="300" y="560" className="r3-jp" fill="#fff" stroke="#2f8fd6" strokeWidth="6" paintOrder="stroke" fontSize="72">ピッ</text>
      <text x="470" y="660" className="r3-jp" fill="#fff" stroke="#ff5fa2" strokeWidth="6" paintOrder="stroke" fontSize="72">ピッ♡</text>
      {/* the gate flap, open */}
      <polygon points="700,790 760,780 760,900 700,920" fill="#ff8fc0" opacity=".9" />
    </g>
  );
  return (
    <R3Scene id="station-ads-insert" trace="station-ads" tone="overcast" rm={rm} cam="scale(1.9) translate(0 -260)" over={gate}
      label="Close-up: the ticket gate at NAND station, next to the drink vending machine. The IC reader glows blue: beep, beep.">
      <polygon points={pts(STRIP)} fill="#d2ad3e" />
      <StationAdsArt drink={props?.drink} />
    </R3Scene>
  );
}
