// Naan scene: the station platform at pink/violet dusk, with the Hot NAAN ad placed in it (plan B: platform trace).
// Three variants, one per reference composition (research/date-beta-demo/naan/COMPOSITION.txt):
//   v1 elevated platform, ad on a rooftop billboard across the tracks (refs 1 + 4)
//   v2 canopy platform, ad in a light-box between the pillars (ref 2)
//   v3 long perspective platform, hanging line sign in front, ad on the stair-house end wall (ref 3)
// Layout rule: the ad and the station sign end above y = 780 (the dialogue box owns the bottom ~300 px).
// v2 + v3 are one-point perspective from a tiny camera model (cam), so every receding line is true.
import { P, Sky, Cloud, Blocks, AdSlot, LineSign, NameBoard } from './platformParts.jsx';

// Camera: VP (cx, cy), focal f (px), eye height (m). World: x right, y up (floor 0), z away from us.
const cam = (cx, cy, f, eye) => (x, y, z) => [cx + (f * x) / z, cy + (f * (eye - y)) / z];
const pts = (pr, list) => list.map((p) => pr(...p).map((n) => n.toFixed(1)).join(',')).join(' ');
// Rectangle on a plane of constant x (a side wall, a train side): y in [ya, yb], z in [za, zb].
const sideQuad = (pr, x, ya, yb, za, zb) => pts(pr, [[x, yb, za], [x, yb, zb], [x, ya, zb], [x, ya, za]]);
// Rectangle on a plane of constant y (floor, ceiling): x in [xa, xb], z in [za, zb].
const flatQuad = (pr, y, xa, xb, za, zb) => pts(pr, [[xa, y, za], [xb, y, za], [xb, y, zb], [xa, y, zb]]);

// A train side seen in perspective: cars of 20 m, 4 doors each, windows between. stripe = [ya, yb, colour].
function PerspTrain({ pr, x, z0, cars, body, shade, stripe, stripe2, win = P.glass, sky = P.glassSky }) {
  const out = [];
  const DOORS = [2.2, 7.0, 11.8, 16.6], WINS = [[0.5, 1.8], [3.8, 6.6], [8.6, 11.4], [13.4, 16.2], [18.2, 19.5]];
  for (let c = 0; c < cars; c++) {
    const a = z0 + c * 20.6;
    out.push(<polygon key={`b${c}`} points={sideQuad(pr, x, -0.3, 2.95, a, a + 20)} fill={body} />);
    out.push(<polygon key={`r${c}`} points={sideQuad(pr, x, 2.95, 3.2, a, a + 20)} fill={shade} />);
    if (stripe) out.push(<polygon key={`s${c}`} points={sideQuad(pr, x, stripe[0], stripe[1], a, a + 20)} fill={stripe[2]} />);
    if (stripe2) out.push(<polygon key={`t${c}`} points={sideQuad(pr, x, stripe2[0], stripe2[1], a, a + 20)} fill={stripe2[2]} />);
    WINS.forEach(([u, v], i) => {
      out.push(<polygon key={`w${c}-${i}`} points={sideQuad(pr, x, 1.05, 2.1, a + u, a + v)} fill={win} />);
      out.push(<polygon key={`g${c}-${i}`} points={sideQuad(pr, x, 1.7, 2.1, a + u, a + v)} fill={sky} opacity=".55" />);
    });
    DOORS.forEach((d, i) => {
      out.push(<polygon key={`d${c}-${i}`} points={sideQuad(pr, x, -0.2, 2.35, a + d, a + d + 1.3)} fill={shade} />);
      out.push(<polygon key={`dw${c}-${i}`} points={sideQuad(pr, x, 1.1, 2.0, a + d + 0.12, a + d + 0.58)} fill={win} />);
      out.push(<polygon key={`dv${c}-${i}`} points={sideQuad(pr, x, 1.1, 2.0, a + d + 0.72, a + d + 1.18)} fill={win} />);
    });
    out.push(<polygon key={`gap${c}`} points={sideQuad(pr, x, -0.3, 3.2, a + 20, a + 20.6)} fill={P.ink} />);
  }
  return <g>{out}</g>;
}

/* ------------------------------------------------------------------ V1 ------------------------------------------------------------------ */
// Ref 1's camera (across the tracks from under our canopy) + ref 4's rooftop billboards with lamp arms.
const AD1 = { x: 860, y: 190, w: 780 }; // h = w / 2.2 = 354.5 -> bottom 545

function V1() {
  const ah = AD1.w / 2.2;
  const edge = (x) => 470 * (1 - x / 1250); // our canopy's front edge: (1250, 0) -> (0, 470)
  const wire = (y0, k) => `M1920 ${y0} L0 ${y0 + k * 1920}`;
  return (
    <>
      <Sky id="pf1-sky" stops={[[0, '#4b49ad'], [0.3, '#8c7be6'], [0.52, '#cf95df'], [0.64, '#f4aecf'], [1, '#f8c2c9']]} />
      <Cloud x={1210} y={30} s={2.4} />
      <Cloud x={1630} y={250} s={1.2} flip />
      <Cloud x={560} y={300} s={0.9} />
      {/* far city, then the mid-rises (ref 1 slab left of centre, ref 4 tower right) */}
      <Blocks tone="far" base={700} seed={3} b={[[180, 130, 470], [320, 90, 520], [420, 150, 430], [760, 110, 470], [1600, 120, 450], [1730, 90, 500], [1830, 100, 460]]} />
      <Blocks tone="mid" base={700} seed={5} b={[[600, 150, 300, 30], [1700, 110, 250, 26], [240, 120, 560, 20]]} />
      {/* the ad's building + rooftop billboard frame (legs, walkway, lamp arms) */}
      <Blocks tone="near" base={700} seed={9} win={0.3} b={[[840, 820, 604, 34], [1680, 130, 596, 20], [1830, 110, 622]]} />
      <rect x={AD1.x - 20} y={AD1.y + ah + 8} width={AD1.w + 40} height="12" fill={P.deep} />
      {[0.06, 0.3, 0.55, 0.8, 0.96].map((f) => {
        const x = AD1.x + f * AD1.w;
        return <rect key={f} x={x - 6} y={AD1.y + ah} width="12" height={604 - AD1.y - ah} fill={P.deep} />;
      })}
      <path d={`M${AD1.x + 47} ${AD1.y + ah + 20} L${AD1.x + 234} 604 M${AD1.x + 429} ${AD1.y + ah + 20} L${AD1.x + 624} 604`} stroke={P.deep} strokeWidth="6" />
      <rect x={AD1.x - 10} y={AD1.y - 10} width={AD1.w + 20} height={ah + 20} fill="#2a2238" />
      <AdSlot x={AD1.x} y={AD1.y} w={AD1.w} />
      {[0.12, 0.37, 0.63, 0.88].map((f) => {
        const x = AD1.x + f * AD1.w;
        return (
          <g key={f}>
            <path d={`M${x} ${AD1.y - 10} L${x} ${AD1.y - 44} L${x + 30} ${AD1.y - 58}`} stroke="#2a2238" strokeWidth="6" fill="none" />
            <rect x={x + 18} y={AD1.y - 66} width="40" height="14" rx="4" fill="#e9e1f2" />
          </g>
        );
      })}
      {/* small rooftop signs, right (ref 1: green + white) */}
      <rect x="1694" y="540" width="8" height="56" fill={P.deep} /><rect x="1790" y="540" width="8" height="56" fill={P.deep} />
      <rect x="1680" y="500" width="130" height="50" fill="#3c9a7a" />
      <text x="1745" y="535" textAnchor="middle" className="pf-roof">ゲート</text>
      {/* far platform: gantries, canopy, pillars (the horizon line, ref 1 at 0.68) */}
      {[330, 790, 1700].map((x) => <rect key={x} x={x - 7} y="560" width="14" height="140" fill={P.steel} />)}
      <rect x="300" y="574" width="520" height="12" fill={P.steel} /><rect x="770" y="574" width="960" height="12" fill={P.steel} />
      <path d={wire(560, 0.05)} stroke={P.ink} strokeWidth="2.5" /><path d={wire(578, 0.05)} stroke={P.ink} strokeWidth="2" />
      <polygon points="240,668 1920,630 1920,676 240,702" fill="#5b4880" />
      <polygon points="240,662 1920,622 1920,632 240,670" fill={P.lit} />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={300 + i * 200} y={690 - i * 4} width="12" height="80" fill={P.deep} />)}
      <rect x="0" y="700" width="1920" height="80" fill="#4b3a6c" />
      {/* the passing train (ref 1's green/orange stripe car): lives under the dialogue box */}
      <g transform="translate(0 768) skewY(-0.75)">
        <rect width="1920" height="320" fill={P.silver} />
        <rect width="1920" height="16" fill={P.silverShade} />
        {[40, 540, 1040, 1540].map((x) => (
          <g key={x}>
            <rect x={x} y="40" width="300" height="96" rx="6" fill={P.glass} />
            <path d={`M${x + 20} 40 L${x + 120} 40 L${x + 40} 136 L${x} 136 L${x} 60Z`} fill={P.glassSky} opacity=".5" />
            <rect x={x + 340} y="26" width="120" height="300" fill={P.silverShade} />
            <rect x={x + 350} y="44" width="46" height="110" rx="4" fill={P.glass} /><rect x={x + 404} y="44" width="46" height="110" rx="4" fill={P.glass} />
          </g>
        ))}
        <rect y="226" width="1920" height="16" fill="#2e9c7c" /><rect y="242" width="1920" height="18" fill="#f28a4b" />
        <rect x="1000" width="14" height="320" fill={P.ink} />
      </g>
      {/* near wires (our track), converging left toward the off-frame VP */}
      <path d={wire(-40, 0.14)} stroke={P.ink} strokeWidth="3" fill="none" /><path d={wire(-8, 0.14)} stroke={P.ink} strokeWidth="2.5" fill="none" />
      {/* our canopy: underside, beams, front fascia (ref 1's top-left diagonal) */}
      <polygon points="0,0 1250,0 0,470" fill={P.canopy} />
      {[180, 420, 660, 900, 1140].map((x) => <path key={x} d={`M${x} ${edge(x)} L${x - 420} ${edge(x) - 240}`} stroke={P.canopyLit} strokeWidth="10" />)}
      <polygon points="1250,0 1312,0 0,522 0,470" fill={P.fascia} />
      <polygon points="1300,0 1312,0 0,522 0,512" fill="#9a7cc0" />
      <rect x="780" y="40" width="200" height="14" rx="7" fill="#eef0ff" transform="rotate(-20.6 880 47)" />
      {/* exit sign + the violet LED lamp (ref 1) */}
      <rect x="512" y="86" width="6" height="36" fill={P.ink} /><rect x="576" y="86" width="6" height="36" fill={P.ink} />
      <rect x="490" y="120" width="116" height="70" rx="4" fill="#1f8f58" stroke="#e8f5ec" strokeWidth="4" />
      <g transform="translate(520 132)" fill="#f4fbf6">
        <circle cx="16" cy="6" r="6" /><path d="M8 16 L22 14 L30 28 L38 30 L37 35 L27 33 L22 26 L18 36 L26 44 L22 48 L12 38 L6 46 L2 43 L10 30 L12 22 L6 26 L3 23Z" />
        <rect x="46" y="0" width="30" height="46" fill="none" stroke="#f4fbf6" strokeWidth="4" />
      </g>
      <rect x="718" y="110" width="6" height="40" fill={P.ink} />
      <rect x="690" y="148" width="62" height="24" rx="3" fill="#2a2238" /><rect x="696" y="166" width="50" height="6" fill="#a58aff" />
      {/* left pillar + the edge railing, with the no-entry plate (ref 1 bottom-left) */}
      <rect x="0" y="0" width="64" height="1080" fill="#231c36" /><rect x="56" y="0" width="8" height="1080" fill="#6e5b8e" />
      <rect x="64" y="892" width="210" height="10" fill={P.steelLit} /><rect x="64" y="958" width="210" height="8" fill={P.steelLit} />
      {[80, 130, 180, 230].map((x) => <rect key={x} x={x} y="892" width="8" height="188" fill={P.steelLit} />)}
      <rect x="88" y="910" width="84" height="100" fill="#f4f1ea" stroke="#23202c" strokeWidth="3" />
      <text x="130" y="950" textAnchor="middle" className="pf-plate">立入</text>
      <text x="130" y="990" textAnchor="middle" className="pf-plate">禁止</text>
      {/* the line sign, hung from our canopy (ref 4's white "1" box) */}
      <LineSign x={70} y={300} w={500} h={170} num="1" jp="中NAND" jp2="三鷹 方面" en="for NAND-kano, Mitaka" rods={[[60, 250], [440, 200]]} />
    </>
  );
}

/* ------------------------------------------------------------------ V2 ------------------------------------------------------------------ */
// Ref 2: wide canopy platform, two pillars framing the centre bay, the train along the right edge running off toward
// the platform-end fence. The ad is a free-standing light-box in that bay, in front of the fence.
const pr2 = cam(840, 615, 1100, 1.6);
const LB = { x0: -2.4, x1: 2.25, y0: 0.9, z: 8 };

function V2() {
  const pr = pr2;
  const [ax, ay] = pr(LB.x0, LB.y0 + (LB.x1 - LB.x0) / 2.2, LB.z), [bx] = pr(LB.x1, 0, LB.z);
  const aw = bx - ax;
  const leg = (x) => { const [lx, top] = pr(x, LB.y0, LB.z), [, bot] = pr(x, 0, LB.z); return <rect key={x} x={lx - 7} y={top} width="14" height={bot - top} fill={P.steelLit} />; };
  const [, fenceTop] = pr(0, 1.1, 9), [, fenceBot] = pr(0, 0, 9), [fenceR] = pr(2.4, 0, 9);
  return (
    <>
      <Sky id="pf2-sky" stops={[[0, '#3a2a78'], [0.22, '#6a58c4'], [0.42, '#b58ad8'], [0.55, '#f0aacb'], [0.62, '#f7bfc4']]} />
      <Cloud x={560} y={250} s={1.1} /><Cloud x={1480} y={170} s={1.4} flip />
      <Blocks tone="far" base={640} seed={21} b={[[0, 120, 420], [110, 100, 360], [220, 140, 450], [600, 120, 380], [720, 90, 440], [1060, 130, 360], [1180, 100, 420], [1300, 120, 330], [1440, 110, 400], [1560, 150, 350], [1720, 120, 420], [1840, 90, 380]]} />
      <Blocks tone="mid" base={640} seed={23} b={[[40, 160, 470, 24], [440, 140, 500, 20], [860, 180, 450, 26], [1130, 120, 520, 18], [1500, 160, 480, 22]]} />
      {/* beyond the fence: track bed, rails to the VP, dusk grass */}
      <rect x="0" y="600" width="1920" height="120" fill="#5b4a78" />
      {[-1.2, -0.2, 1.6, 2.6].map((x) => <line key={x} x1={pr(x - 4, 0, 9)[0]} y1="612" x2={pr(x - 4, 0, 9)[0] - 30} y2={fenceBot} stroke="#8b7aa8" strokeWidth="3" />)}
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${40 + i * 70} ${fenceTop + 4} q10 -30 20 0 q6 -22 14 0`} fill="#6f8f78" />)}
      {/* the train, running off along the right edge (ref 2's orange stripe, low sun from the right) */}
      <PerspTrain pr={pr} x={2.85} z0={1.6} cars={4} body="#e2c9d6" shade="#b394bd" stripe={[0.35, 0.72, '#ff8a5a']} stripe2={[0.72, 0.8, '#e0405e']} />
      {/* platform-end fence */}
      <rect x="0" y={fenceTop} width={fenceR} height="8" fill={P.steelLit} />
      <rect x="0" y={fenceBot - 10} width={fenceR} height="8" fill={P.steelLit} />
      {Array.from({ length: Math.floor(fenceR / 22) + 1 }, (_, i) => <rect key={i} x={i * 22} y={fenceTop} width="3" height={fenceBot - fenceTop} fill={P.steelLit} opacity=".8" />)}
      {/* floor + tactile strip along the edge */}
      <polygon points={flatQuad(pr, 0, -12, 2.6, 1.4, 9)} fill={P.floor} />
      <polygon points={flatQuad(pr, 0, 1.75, 2.05, 1.4, 9)} fill={P.tactile} />
      <polygon points={flatQuad(pr, 0, 2.45, 2.6, 1.4, 9)} fill="#e8e2ef" />
      {/* the light-box */}
      {leg(LB.x0 + 0.5)}{leg(LB.x1 - 0.5)}
      <rect x={ax - 12} y={ay - 12} width={aw + 24} height={aw / 2.2 + 24} rx="4" fill="#cfc6dc" />
      <rect x={ax - 4} y={ay - 4} width={aw + 8} height={aw / 2.2 + 8} fill="#6e5b8e" />
      <AdSlot x={ax} y={ay} w={aw} />
      {/* canopy: ribbed underside, beams, curved fascia dipping between the pillars */}
      <path d="M0 0 H1920 V286 L1310 300 Q860 214 420 300 L0 292Z" fill="#5a2a5e" />
      {[-7, -4, -1, 2, 5].map((x) => { const [x1, y1] = pr(x, 3.8, 2), [x2, y2] = pr(x, 3.8, 6.5); return <line key={x} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7a3d74" strokeWidth="8" />; })}
      {[3, 4, 5, 6].map((z) => <line key={z} x1="0" y1={pr(0, 3.8, z)[1]} x2="1920" y2={pr(0, 3.8, z)[1]} stroke="#3e1c44" strokeWidth={z < 5 ? 14 : 10} />)}
      {[[-4.2, -3], [0.2, 1.4]].map(([a, b]) => <polygon key={a} points={flatQuad(pr, 3.78, a, b, 4.95, 5.1)} fill="#f4eeff" />)}
      <path d="M0 292 L420 300 Q860 214 1310 300 L1920 286 V318 L1310 334 Q860 250 420 334 L0 326Z" fill="#7d3a70" />
      <path d="M0 322 L420 330 Q860 246 1310 330 L1920 314 V318 L1310 334 Q860 250 420 334 L0 326Z" fill="#e79ac0" />
      {/* pillars: left near (lit right face), right further (shade face) */}
      {(() => {
        const [l0, t0] = pr(-1.85, 3.8, 4), [l1, b0] = pr(-1.55, 0, 4), [l2] = pr(-1.55, 0, 4.3);
        const [r0, t1] = pr(2.2, 3.8, 6), [r1, b1] = pr(2.45, 0, 6), [r2] = pr(2.2, 0, 6.25);
        return (
          <g>
            <rect x={l0} y={t0} width={l1 - l0} height={b0 - t0} fill="#6e4e7e" /><rect x={l1} y={t0} width={l2 - l1} height={b0 - t0} fill="#f2b8cf" />
            {[0.2, 0.4, 0.6].map((f) => <rect key={f} x={l0} y={t0 + f * (b0 - t0)} width={l2 - l0} height="8" fill="#4a3462" />)}
            <rect x={r2} y={t1} width={r0 - r2} height={b1 - t1} fill="#4f3a68" /><rect x={r0} y={t1} width={r1 - r0} height={b1 - t1} fill="#8e6ea4" />
            <rect x={r0 + 8} y={t1 + 120} width={r1 - r0 - 16} height="40" fill="#f4f1ea" />
          </g>
        );
      })()}
      {/* station name board, hung from the canopy in the left bay */}
      <NameBoard x={24} y={330} w={400} h={160} rods={[[70, 240], [330, 240]]} />
    </>
  );
}

/* ------------------------------------------------------------------ V3 ------------------------------------------------------------------ */
// Ref 3: one-point perspective down a long platform. Train left, dark canopy right, the navy line sign hanging in the
// foreground, and the stair house's end wall at 6 m carrying the ad: every receding line points at it.
const pr3 = cam(900, 600, 1000, 1.6);
const SH = { x0: -0.6, x1: 4.4, z: 6 }; // stair house front face

function V3() {
  const pr = pr3;
  const [hx0, hy0] = pr(SH.x0, 4.2, SH.z), [hx1, hy1] = pr(SH.x1, 0, SH.z);
  const [ax, ay] = pr(-0.4, 3.1, SH.z), [bx] = pr(4.0, 0, SH.z);
  const aw = bx - ax;
  const [pl, pt] = pr(6.6, 4.2, 8), [pr_, pb] = pr(6.95, 0, 8);
  return (
    <>
      <Sky id="pf3-sky" stops={[[0, '#6a3fb8'], [0.28, '#b25fd0'], [0.46, '#e57fc4'], [0.56, '#ff9fb4'], [1, '#ffb9b4']]} />
      <Cloud x={120} y={120} s={1.3} /><Cloud x={420} y={330} s={0.7} flip />
      <Blocks tone="far" base={604} seed={31} b={[[780, 40, 548], [826, 30, 566], [862, 50, 540], [940, 36, 560]]} />
      {/* track bed + floor */}
      <polygon points={flatQuad(pr, -1.1, -9, -2.2, 0.4, 200)} fill="#2b2442" />
      <polygon points={flatQuad(pr, 0, -2.2, 9, 0.4, 200)} fill="#3d3a5e" />
      <polygon points={flatQuad(pr, 0, -2.2, -2.08, 0.4, 200)} fill="#e8e2ef" />
      <polygon points={flatQuad(pr, 0, -1.8, -1.5, 0.4, 200)} fill="#c9a444" />
      {/* the train, receding to the VP (Chiyo-DA green line) */}
      <PerspTrain pr={pr} x={-2.4} z0={0.6} cars={8} body="#b9b0cc" shade="#8c82a8" stripe={[0.72, 0.86, '#3fae7a']} win="#2c2f4a" sky="#d77bb8" />
      {/* canopy: dark underside, edge beam, cool tube lights, cross beams */}
      <polygon points={flatQuad(pr, 4.2, -1.0, 12, 0.4, 200)} fill="#2c2640" />
      <polygon points={sideQuad(pr, -1.0, 3.8, 4.2, 0.6, 200)} fill="#4a3f68" />
      {[3, 5, 7, 9, 12, 15, 20, 26, 34].map((z) => <polygon key={z} points={flatQuad(pr, 4.18, -1.0, 12, z, z + 0.25)} fill="#1f1b30" />)}
      {[0.8, 3.2].map((x) => [2, 4, 6, 8.5, 11, 14, 18, 23, 30, 40].map((z) => <polygon key={`${x}-${z}`} points={flatQuad(pr, 4.15, x, x + 0.14, z, z + 1.2)} fill="#dff4ff" />))}
      {/* a far pillar right of the stair house */}
      <rect x={pl} y={pt} width={pr_ - pl} height={pb - pt} fill="#4a3f68" />
      {/* the stair house end wall: the ad's far wall */}
      <rect x={hx0} y={hy0} width={hx1 - hx0} height={hy1 - hy0} fill="#cbbfd8" />
      <rect x={hx0} y={hy0} width={hx1 - hx0} height="24" fill="#8e82a8" />
      <rect x={ax - 14} y={ay - 14} width={aw + 28} height={aw / 2.2 + 28} fill="#efe9f4" />
      <AdSlot x={ax} y={ay} w={aw} />
      {/* green signal lamp (ref 3) */}
      <rect x="1004" y="0" width="6" height="276" fill={P.ink} />
      <rect x="984" y="272" width="46" height="46" rx="8" fill="#1b2230" /><circle cx="1007" cy="295" r="14" fill="#43e38a" />
      {/* the hanging line sign in the foreground (ref 3's navy "2" box) */}
      <LineSign x={1090} y={70} w={720} h={200} num="2" jp="新XOR" jp2="千代DA線 方面" en="for Shin-XOR-ku, Chiyo-DA Line" dark rods={[[80, 0], [640, 0]]} />
    </>
  );
}

const LABEL = {
  v1: 'A station platform at pink dusk, across the tracks from rooftops. The Hot NAAN billboard stands on a roof. Sign: 1 NAND-kano, for Mitaka.',
  v2: 'A station platform at pink dusk under a wide canopy. Between two pillars, a Hot NAAN light-box. Sign: Ike-NOR-kuro.',
  v3: 'A long station platform at pink dusk, a train on the left. The Hot NAAN ad fills the far wall. Sign: 2 Shin-XOR-ku, Chiyo-DA Line.',
};
const VARIANT = { v1: V1, v2: V2, v3: V3 };

export function Platform({ variant = 'v1' }) {
  const V = VARIANT[variant] ?? V1;
  const v = VARIANT[variant] ? variant : 'v1';
  return (
    <svg className={`art platform pf-${v}`} viewBox="0 0 1920 1080" data-variant={v} role="img" aria-label={LABEL[v]}>
      <V />
    </svg>
  );
}

// The naan scene's art: ?platform=v1|v2|v3 picks the variant (default v1).
export default function NaanPlatform() {
  const q = typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('platform');
  return <Platform variant={q ?? 'v1'} />;
}
