// NaanPlatform.jsx: the naan scene. A Japanese station platform with the Hot NAAN ad (NaanAd.jsx) placed in it.
// Three variants, one per reference composition (research/date-beta-demo/naan/COMPOSITION.txt):
//   v1 elevated platform, ad on a rooftop billboard across the tracks (refs 1 + 4)
//   v2 canopy platform, ad in a light-box between the pillars (ref 2)
//   v3 long perspective platform, hanging line sign in front, ad on the stair-house end wall (ref 3)
// time: 'dusk' (the naan scene) | 'night' (the same station after the blackout: navy sky, tubes on, rain, wet floor,
// the ad unlit with its headline held on NANDA). Same geometry in both, so it reads as the same place.
// Layout rule: the ad and the station sign end above y = 780 (the dialogue box owns the bottom ~300 px).
// v2 + v3 are one-point perspective from a tiny camera model (cam), so every receding line is true.
import { P, tint, cam, sideQuad, flatQuad, Sky, Cloud, Blocks, PerspTrain, Rain, AdSlot, AD_RATIO, LineSign, NameBoard, Vending, Tube } from './stationParts.jsx';

/* ------------------------------------------------------------------ V1 ------------------------------------------------------------------ */
// Ref 1's camera (across the tracks from under our canopy) + ref 4's rooftop billboards with lamp arms.
const AD1 = { x: 820, y: 130, w: 1000 }; // 2:1 -> 1000 x 500, bottom 630; the canopy fascia clears its top-left corner
const edge1 = (x) => 470 * (1 - x / 1060); // outer line of our canopy's fascia: (1060, 0) -> (0, 470)

function V1({ k, night, rm }) {
  const ah = AD1.w / AD_RATIO, base = AD1.y + ah;
  const wire = (y0, s) => `M1920 ${y0} L0 ${y0 + s * 1920}`;
  return (
    <>
      <Sky id="np1-sky" night={night} stops={[[0, '#4b49ad'], [0.3, '#8c7be6'], [0.52, '#cf95df'], [0.66, '#f4aecf'], [1, '#f8c2c9']]} />
      <Cloud x={1210} y={20} s={2.4} k={k} /><Cloud x={540} y={330} s={0.9} k={k} />
      {/* far city, then the mid-rises (ref 1's slab left of centre) */}
      <Blocks tone="far" base={740} seed={3} k={k} night={night} b={[[180, 130, 500], [320, 90, 560], [420, 150, 470], [600, 110, 520], [1790, 130, 520]]} />
      <Blocks tone="mid" base={740} seed={5} k={k} night={night} b={[[640, 150, 290, 30], [250, 120, 590, 20]]} />
      {/* the ad's building + rooftop billboard frame: legs, walkway, braces */}
      <Blocks tone="near" base={740} seed={9} win={0.3} k={k} night={night} b={[[820, 1060, 668, 30]]} />
      <rect x={AD1.x - 20} y={base + 8} width={AD1.w + 40} height="12" fill={k(P.deep)} />
      {[0.05, 0.3, 0.55, 0.8, 0.95].map((f) => <rect key={f} x={AD1.x + f * AD1.w - 6} y={base} width="12" height={668 - base} fill={k(P.deep)} />)}
      <path d={`M${AD1.x + 50} ${base + 20} L${AD1.x + 300} 668 M${AD1.x + 550} ${base + 20} L${AD1.x + 800} 668`} stroke={k(P.deep)} strokeWidth="6" />
      <rect x={AD1.x - 10} y={AD1.y - 10} width={AD1.w + 20} height={ah + 20} fill={k('#2a2238')} />
      <AdSlot x={AD1.x} y={AD1.y} w={AD1.w} rm={rm} night={night} />
      {/* lamp arms over the board (ref 4); off at night, the ad is unlit */}
      {[0.22, 0.47, 0.72, 0.94].map((f) => {
        const x = AD1.x + f * AD1.w;
        return (
          <g key={f}>
            <path d={`M${x} ${AD1.y - 10} L${x} ${AD1.y - 40} L${x - 28} ${AD1.y - 52}`} stroke={k('#2a2238')} strokeWidth="6" fill="none" />
            <rect x={x - 62} y={AD1.y - 60} width="40" height="14" rx="4" fill={k('#e9e1f2')} />
          </g>
        );
      })}
      {/* far platform: gantries, wires, canopy, pillars. Its roof line is the horizon (ref 1: 0.68) */}
      {[330, 790, 1880].map((x) => <rect key={x} x={x - 7} y="640" width="14" height="100" fill={k(P.steel)} />)}
      <rect x="300" y="652" width="1600" height="12" fill={k(P.steel)} />
      <path d={wire(640, 0.04)} stroke={k(P.ink)} strokeWidth="2.5" /><path d={wire(656, 0.04)} stroke={k(P.ink)} strokeWidth="2" />
      <polygon points="200,716 1920,690 1920,732 200,752" fill={k('#5b4880')} />
      <polygon points="200,710 1920,682 1920,692 200,718" fill={k(P.lit)} />
      {Array.from({ length: 9 }, (_, i) => {
        const x = 280 + i * 200, y = 750 - i * 2.4;
        return (
          <g key={i}>
            <rect x={x} y={y - 6} width="12" height="40" fill={k(P.deep)} />
            {night && <rect x={x + 40} y={y - 8} width="70" height="6" rx="3" fill={P.tube} />}
          </g>
        );
      })}
      {/* far platform surface (yellow line) and its shadowed face */}
      <polygon points="0,778 1920,752 1920,768 0,794" fill={k('#8a74b0')} />
      <polygon points="0,788 1920,762 1920,766 0,792" fill={k(P.tactile)} />
      {night && Array.from({ length: 9 }, (_, i) => <rect key={i} x={320 + i * 200} y={752 - i * 2.4} width="70" height="40" fill={P.tube} opacity=".16" />)}
      <polygon points="0,794 1920,768 1920,860 0,860" fill={k('#34284f')} />
      {/* the passing train (ref 1's green/orange stripe car): lives under the dialogue box */}
      <g transform="translate(0 812) skewY(-0.75)">
        <rect width="1920" height="280" fill={k(P.silver)} />
        <rect width="1920" height="16" fill={k(P.silverShade)} />
        {[40, 540, 1040, 1540].map((x) => (
          <g key={x}>
            <rect x={x} y="40" width="300" height="96" rx="6" fill={night ? P.glassLit : k(P.glass)} />
            {!night && <path d={`M${x + 20} 40 L${x + 120} 40 L${x + 40} 136 L${x} 136 L${x} 60Z`} fill={P.glassSky} opacity=".5" />}
            <rect x={x + 340} y="26" width="120" height="260" fill={k(P.silverShade)} />
            <rect x={x + 350} y="44" width="46" height="110" rx="4" fill={night ? P.glassLit : k(P.glass)} />
            <rect x={x + 404} y="44" width="46" height="110" rx="4" fill={night ? P.glassLit : k(P.glass)} />
          </g>
        ))}
        <rect y="200" width="1920" height="16" fill={k('#2e9c7c')} /><rect y="216" width="1920" height="18" fill={k('#f28a4b')} />
        <rect x="1000" width="14" height="280" fill={k(P.ink)} />
      </g>
      {/* near wires (our track's catenary), running down-left toward ref 1's off-frame VP; they clear the board */}
      <path d={wire(-60, 0.14)} stroke={k(P.ink)} strokeWidth="3" fill="none" /><path d={wire(-30, 0.14)} stroke={k(P.ink)} strokeWidth="2.5" fill="none" />
      {night && <Rain clip="np1-rain" rm={rm} seed={11} />}
      {night && <defs><clipPath id="np1-rain"><polygon points="1060,0 1920,0 1920,1080 0,1080 0,470" /></clipPath></defs>}
      {/* our canopy: underside, purlins parallel to the edge, rafters, front fascia (ref 1's top-left diagonal) */}
      <polygon points="0,0 1000,0 0,420" fill={k(P.canopy)} />
      {[150, 330, 480, 600].map((d) => <path key={d} d={`M${1000 - d} 0 L0 ${(420 * (1000 - d)) / 1000}`} stroke={k(P.canopyLit)} strokeWidth={d < 300 ? 12 : 8} />)}
      {[220, 440, 660, 880].map((x) => <path key={x} d={`M${x} ${420 * (1 - x / 1000)} L${x - 150} ${420 * (1 - x / 1000) - 150}`} stroke={k('#241d38')} strokeWidth="7" />)}
      <polygon points="1000,0 1060,0 0,470 0,420" fill={k(P.fascia)} />
      <polygon points="1048,0 1060,0 0,470 0,460" fill={k('#9a7cc0')} />
      {[330, 60].map((x) => { const y = (x2) => 281 * (1 - x2 / 670); /* on the second purlin */ return <Tube key={x} night={night} points={`${x},${y(x)} ${x + 180},${y(x + 180)} ${x + 180},${y(x + 180) + 12} ${x},${y(x) + 12}`} />; })}
      {/* exit sign + the violet LED lamp (ref 1): both lit */}
      <rect x="612" y="14" width="6" height="30" fill={k(P.ink)} /><rect x="676" y="14" width="6" height="30" fill={k(P.ink)} />
      <rect x="590" y="42" width="116" height="70" rx="4" fill="#1f8f58" stroke="#e8f5ec" strokeWidth="4" />
      <g transform="translate(620 54)" fill="#f4fbf6">
        <circle cx="16" cy="6" r="6" /><path d="M8 16 L22 14 L30 28 L38 30 L37 35 L27 33 L22 26 L18 36 L26 44 L22 48 L12 38 L6 46 L2 43 L10 30 L12 22 L6 26 L3 23Z" />
        <rect x="46" y="0" width="30" height="46" fill="none" stroke="#f4fbf6" strokeWidth="4" />
      </g>
      <rect x="330" y="150" width="6" height="40" fill={k(P.ink)} />
      <rect x="302" y="188" width="62" height="24" rx="3" fill={k('#2a2238')} /><rect x="308" y="206" width="50" height="6" fill="#a58aff" />
      {night && <rect x="296" y="202" width="74" height="16" rx="8" fill="#a58aff" opacity=".35" />}
      {/* left pillar + the edge railing, with the no-entry plate (ref 1 bottom-left) */}
      <rect x="0" y="0" width="64" height="1080" fill={k('#231c36')} /><rect x="56" y="0" width="8" height="1080" fill={k('#6e5b8e')} />
      <rect x="64" y="892" width="210" height="10" fill={k(P.steelLit)} /><rect x="64" y="958" width="210" height="8" fill={k(P.steelLit)} />
      {[80, 130, 180, 230].map((x) => <rect key={x} x={x} y="892" width="8" height="188" fill={k(P.steelLit)} />)}
      <rect x="88" y="910" width="84" height="100" fill={k('#f4f1ea')} stroke={k('#23202c')} strokeWidth="3" />
      <text x="130" y="950" textAnchor="middle" className="np-plate" style={{ fill: k('#c8102e') }}>立入</text>
      <text x="130" y="990" textAnchor="middle" className="np-plate" style={{ fill: k('#c8102e') }}>禁止</text>
      {/* the line sign, hung from our canopy (ref 4's white "1" box) */}
      <LineSign x={70} y={300} w={500} h={170} num="1" jp="中NAND" jp2="三鷹 方面" en="for NAND-kano, Mitaka" k={k} rods={[[60, 250], [440, 150]]} />
    </>
  );
}

/* ------------------------------------------------------------------ V2 ------------------------------------------------------------------ */
// Ref 2: wide canopy platform, two pillars framing the centre bay, the train along the right edge running off toward
// the platform-end fence. The ad is a free-standing light-box in that bay, in front of the fence.
const pr2 = cam(840, 615, 1100, 1.6);
const LB = { x0: -3.05, x1: 2.44, y0: 0.7, z: 8 };

function V2({ k, night, rm, vending }) {
  const pr = pr2;
  const [ax, ay] = pr(LB.x0, LB.y0 + (LB.x1 - LB.x0) / AD_RATIO, LB.z), [bx] = pr(LB.x1, 0, LB.z);
  const aw = bx - ax;
  const leg = (x) => { const [lx, top] = pr(x, LB.y0, LB.z), [, bot] = pr(x, 0, LB.z); return <rect key={x} x={lx - 7} y={top} width="14" height={bot - top} fill={k(P.steelLit)} />; };
  const [, fenceTop] = pr(0, 1.1, 9), [, fenceBot] = pr(0, 0, 9), [fenceR] = pr(2.4, 0, 9);
  const rail = (x) => { const [x1, y1] = pr(x, -1.1, 9.2), [x2, y2] = pr(x, -1.1, 80); return <line key={x} x1={x1} y1={y1} x2={x2} y2={y2} stroke={k('#a996c4')} strokeWidth="3" />; };
  const [vx0, vy0] = pr(-5.0, 1.83, 7.2), [vx1, vy1] = pr(-4.1, 0, 7.2);
  const [l0, t0] = pr(-2.15, 3.8, 4), [l1, b0] = pr(-1.85, 0, 4), [l2] = pr(-1.85, 0, 4.3);
  const [r0, t1] = pr(2.2, 3.8, 6), [r1, b1] = pr(2.45, 0, 6), [r2] = pr(2.2, 0, 6.25);
  const tubes = [[-4.2, -3], [0.2, 1.4]];
  return (
    <>
      <Sky id="np2-sky" night={night} stops={[[0, '#3a2a78'], [0.22, '#6a58c4'], [0.42, '#b58ad8'], [0.55, '#f0aacb'], [0.62, '#f7bfc4']]} />
      <Blocks tone="far" base={640} seed={21} k={k} night={night} b={[[0, 120, 420], [110, 100, 360], [220, 140, 450], [600, 120, 380], [720, 90, 440], [1060, 130, 360], [1180, 100, 420], [1300, 120, 330], [1440, 110, 400], [1560, 150, 350], [1720, 120, 420], [1840, 90, 380]]} />
      <Blocks tone="mid" base={640} seed={23} k={k} night={night} b={[[40, 160, 470, 24], [440, 140, 390, 20], [860, 180, 450, 26], [1130, 120, 520, 18], [1500, 160, 480, 22]]} />
      {/* beyond the fence: track bed + rails running off to the VP, grass along the fence */}
      <rect x="0" y="608" width="1920" height={fenceBot - 600} fill={k('#5b4a78')} />
      <rect x="0" y="604" width="1920" height="8" fill={k('#8e7cb4')} />
      {[-7.2, -6.1, -3.6, -2.5, 3.6, 4.7].map(rail)}
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${20 + i * 72} ${fenceBot - 6} q10 -34 20 0 q6 -26 14 0 q8 -20 16 0`} fill={k('#6f8f78')} />)}
      {/* the train, running off along the right edge (ref 2's orange stripe, low sun from the right) */}
      <PerspTrain pr={pr} x={3.1} z0={1.6} cars={4} body="#e6cfdb" shade="#b99ac2" win="#5d4d82" sky="#f0a8d0" k={k} night={night}
        stripe={[0.8, 1.0, '#ff8a5a']} stripe2={[2.3, 2.45, '#ff8a5a']} />
      {/* platform-end fence */}
      <rect x="0" y={fenceTop} width={fenceR} height="8" fill={k(P.steelLit)} />
      <rect x="0" y={fenceBot - 10} width={fenceR} height="8" fill={k(P.steelLit)} />
      {Array.from({ length: Math.floor(fenceR / 22) + 1 }, (_, i) => <rect key={i} x={i * 22} y={fenceTop} width="3" height={fenceBot - fenceTop} fill={k(P.steelLit)} opacity=".8" />)}
      {/* floor, tactile strip, white edge along the train; at night the wet floor catches the tubes + the vending machine */}
      <polygon points={flatQuad(pr, 0, -12, 2.9, 1.4, 9)} fill={k(P.floor)} />
      {night && tubes.map(([a, b]) => <polygon key={a} points={flatQuad(pr, 0, a, b, 1.4, 9)} fill={P.tube} opacity=".12" />)}
      <polygon points={flatQuad(pr, 0, 2.05, 2.35, 1.4, 9)} fill={k(P.tactile)} />
      <polygon points={flatQuad(pr, 0, 2.75, 2.9, 1.4, 9)} fill={k('#e8e2ef')} />
      {/* vending machine by the fence (props.vending: the bento echo lights one slot) */}
      {night && <g transform={`translate(0 ${2 * vy1}) scale(1 -1)`} opacity=".2"><Vending x={vx0} y={vy0} w={vx1 - vx0} h={vy1 - vy0} kind={vending} /></g>}
      <Vending x={vx0} y={vy0} w={vx1 - vx0} h={vy1 - vy0} kind={vending} />
      {/* the light-box */}
      {leg(LB.x0 + 0.6)}{leg(LB.x1 - 0.6)}
      <rect x={ax - 12} y={ay - 12} width={aw + 24} height={aw / AD_RATIO + 24} rx="4" fill={k('#cfc6dc')} />
      <rect x={ax - 4} y={ay - 4} width={aw + 8} height={aw / AD_RATIO + 8} fill={k('#6e5b8e')} />
      <AdSlot x={ax} y={ay} w={aw} rm={rm} night={night} />
      {night && <defs><clipPath id="np2-rain"><rect x="0" y="240" width={r2} height={fenceBot - 240} /></clipPath></defs>}
      {night && <Rain clip="np2-rain" rm={rm} seed={12} />}
      {/* canopy: ribbed underside, a ladder cable tray, cross beams, curved fascia dipping between the pillars */}
      <path d="M0 0 H1920 V286 L1310 300 Q860 214 420 300 L0 292Z" fill={k('#5a2a5e')} />
      {[-7, -4.5, -1, 1.5, 4].map((x) => { const [x1, y1] = pr(x, 3.8, 1.6), [x2, y2] = pr(x, 3.8, 6.5); return <line key={x} x1={x1} y1={y1} x2={x2} y2={y2} stroke={k('#7a3d74')} strokeWidth="8" />; })}
      {[3, 4, 5, 6].map((z) => <line key={z} x1="0" y1={pr(0, 3.8, z)[1]} x2="1920" y2={pr(0, 3.8, z)[1]} stroke={k('#3e1c44')} strokeWidth={z < 5 ? 14 : 10} />)}
      {(() => {
        const L = [-3.4, -2.9], out = [];
        L.forEach((x) => { const [x1, y1] = pr(x, 3.45, 1.7), [x2, y2] = pr(x, 3.45, 6.4); out.push(<line key={x} x1={x1} y1={y1} x2={x2} y2={y2} stroke={k('#2e1433')} strokeWidth="7" />); });
        for (let z = 1.8; z < 6.4; z += 0.35) { const [x1, y1] = pr(L[0], 3.45, z), [x2, y2] = pr(L[1], 3.45, z); out.push(<line key={z} x1={x1} y1={y1} x2={x2} y2={y2} stroke={k('#2e1433')} strokeWidth="4" />); }
        return out;
      })()}
      {tubes.map(([a, b]) => <Tube key={a} night={night} points={flatQuad(pr, 3.78, a, b, 4.95, 5.1)} />)}
      <path d="M0 292 L420 300 Q860 214 1310 300 L1920 286 V318 L1310 334 Q860 250 420 334 L0 326Z" fill={k('#7d3a70')} />
      <path d="M0 322 L420 330 Q860 246 1310 330 L1920 314 V318 L1310 334 Q860 250 420 334 L0 326Z" fill={k('#e79ac0')} />
      {/* pillars: left near (lit right face), right further (shade face) */}
      <rect x={l0} y={t0} width={l1 - l0} height={b0 - t0} fill={k('#6e4e7e')} /><rect x={l1} y={t0} width={l2 - l1} height={b0 - t0} fill={k('#f2b8cf')} />
      {[0.2, 0.4, 0.6].map((f) => <rect key={f} x={l0} y={t0 + f * (b0 - t0)} width={l2 - l0} height="8" fill={k('#4a3462')} />)}
      <rect x={r2} y={t1} width={r0 - r2} height={b1 - t1} fill={k('#4f3a68')} /><rect x={r0} y={t1} width={r1 - r0} height={b1 - t1} fill={k('#8e6ea4')} />
      {[0.3, 0.55].map((f) => <rect key={f} x={r2} y={t1 + f * (b1 - t1)} width={r1 - r2} height="6" fill={k('#3a2a52')} />)}
      {/* station name board, hung from the canopy in the left bay */}
      <NameBoard x={16} y={330} w={370} h={160} k={k} rods={[[60, 240], [310, 240]]} />
    </>
  );
}

/* ------------------------------------------------------------------ V3 ------------------------------------------------------------------ */
// Ref 3: one-point perspective down a long platform. Train left, dark canopy right, the navy line sign hanging in the
// foreground, and the stair house's end wall at 5.5 m carrying the ad: every receding line points at it. The house
// sits right of the VP, so the platform still runs away past it (ref 3's long view).
const pr3 = cam(900, 600, 1000, 1.6);
const SH = { x0: 0.3, x1: 5.3, z: 5.5 }; // stair house front face
const ROWS3 = [-0.4, 0.8, 3.2, 5.6];

function V3({ k, night, rm }) {
  const pr = pr3;
  const [hx0, hy0] = pr(SH.x0, 4.2, SH.z), [hx1, hy1] = pr(SH.x1, 0, SH.z);
  const [ax, ay] = pr(0.5, 0.9 + 4.4 / AD_RATIO, SH.z), [bx] = pr(4.9, 0, SH.z);
  const aw = bx - ax;
  return (
    <>
      <Sky id="np3-sky" night={night} stops={[[0, '#6a3fb8'], [0.28, '#b25fd0'], [0.46, '#e57fc4'], [0.56, '#ff9fb4'], [1, '#ffb9b4']]} />
      <Cloud x={120} y={120} s={1.3} k={k} /><Cloud x={420} y={330} s={0.7} flip k={k} />
      <Blocks tone="far" base={604} seed={31} k={k} night={night} b={[[850, 26, 566], [880, 40, 548], [924, 30, 572]]} />
      {/* track bed + floor; at night the wet floor catches the tube rows */}
      <polygon points={flatQuad(pr, -1.1, -9, -2.2, 0.4, 200)} fill={k('#2b2442')} />
      <polygon points={flatQuad(pr, 0, -2.2, 8, 0.4, 200)} fill={k('#3d3a5e')} />
      {night && ROWS3.map((x) => <polygon key={x} points={flatQuad(pr, 0, x - 0.1, x + 0.24, 1.2, 60)} fill={P.tube} opacity=".14" />)}
      <polygon points={flatQuad(pr, 0, -2.2, -2.08, 0.4, 200)} fill={k('#e8e2ef')} />
      <polygon points={flatQuad(pr, 0, -1.8, -1.5, 0.4, 200)} fill={k('#c9a444')} />
      {/* the train, receding to the VP (Chiyo-DA green line) */}
      <PerspTrain pr={pr} x={-2.4} z0={0.6} cars={8} body="#b9b0cc" shade="#8c82a8" stripe={[0.72, 0.86, '#3fae7a']} win="#2c2f4a" sky="#d77bb8" k={k} night={night} />
      {night && <defs><clipPath id="np3-rain"><polygon points="0,0 627,0 900,600 240,1080 0,1080" /></clipPath></defs>}
      {night && <Rain clip="np3-rain" rm={rm} seed={13} />}
      {/* right wall of the station (closes the platform), with lit timetable panels */}
      <polygon points={sideQuad(pr, 8, 0, 4.2, 2, 200)} fill={k('#3a3456')} />
      {[9, 14, 20, 28].map((z) => <polygon key={z} points={sideQuad(pr, 7.98, 0.9, 2.3, z, z + 1.6)} fill="#e6e9f7" opacity={night ? 0.95 : 0.85} />)}
      {/* canopy: dark underside, edge beam, cross beams, cool tube lights */}
      <polygon points={flatQuad(pr, 4.2, -1.0, 8, 0.4, 200)} fill={k('#2c2640')} />
      <polygon points={sideQuad(pr, -1.0, 3.8, 4.2, 0.6, 200)} fill={k('#4a3f68')} />
      {[3, 5, 7, 9, 12, 15, 20, 26, 34, 45].map((z) => <polygon key={z} points={flatQuad(pr, 4.18, -1.0, 8, z, z + 0.25)} fill={k('#1f1b30')} />)}
      {ROWS3.map((x) => [4, 6, 8.5, 11, 14, 18, 23, 30, 40, 55].map((z) => <Tube key={`${x}-${z}`} night={night && z < 20} points={flatQuad(pr, 4.15, x, x + 0.14, z, z + 1.2)} />))}
      {/* the stair house: its side face (toward the train), then the end wall carrying the ad */}
      <polygon points={sideQuad(pr, SH.x0, 0, 4.2, SH.z, SH.z + 14)} fill={k('#8e82a8')} />
      <rect x={hx0} y={hy0} width={hx1 - hx0} height={hy1 - hy0} fill={k('#bcaecd')} />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={hx0} y={hy0 + 60 + i * 72} width={hx1 - hx0} height="3" fill={k('#ab9cc0')} />)}
      <rect x={hx0} y={hy0} width={hx1 - hx0} height="26" fill={k('#6f628f')} />
      <rect x={ax - 14} y={ay - 14} width={aw + 28} height={aw / AD_RATIO + 28} fill={k('#efe9f4')} />
      <AdSlot x={ax} y={ay} w={aw} rm={rm} night={night} />
      {/* green signal lamp (ref 3) */}
      <rect x="1004" y="0" width="6" height="246" fill={k(P.ink)} />
      <rect x="984" y="242" width="46" height="46" rx="8" fill={k('#1b2230')} /><circle cx="1007" cy="265" r="14" fill="#43e38a" />
      {night && <circle cx="1007" cy="265" r="26" fill="#43e38a" opacity=".25" />}
      {/* the hanging line sign in the foreground (ref 3's navy "2" box) */}
      <LineSign x={1090} y={60} w={720} h={200} num="2" jp="新XOR" jp2="千代DA線 方面" en="for Shin-XOR-ku, Chiyo-DA Line" dark k={k} rods={[[80, 0], [640, 0]]} />
    </>
  );
}

const LABEL = {
  v1: 'A station platform across the tracks from rooftops. The Hot NAAN billboard stands on a roof. Sign: 1 NAND-kano, for Mitaka.',
  v2: 'A station platform under a wide canopy. Between two pillars, a Hot NAAN light-box. Sign: Ike-NOR-kuro.',
  v3: 'A long station platform, a train on the left. The Hot NAAN ad fills the far wall. Sign: 2 Shin-XOR-ku, Chiyo-DA Line.',
};
const VARIANT = { v1: V1, v2: V2, v3: V3 };

// The station itself. Exported for other scenes (alt's night platform): <NaanPlatform variant="v2" time="night" rm />.
export function NaanPlatform({ variant = 'v1', time = 'dusk', rm = false, vending }) {
  const v = VARIANT[variant] ? variant : 'v1';
  const V = VARIANT[v], night = time === 'night';
  const when = night ? 'At night, in the rain; the ad is dark and stuck on NANDA.' : 'Pink dusk.';
  return (
    <svg className={`art naan-platform np-${v}${night ? ' np-night' : ''}`} viewBox="0 0 1920 1080" data-variant={v} data-time={night ? 'night' : 'dusk'}
      role="img" aria-label={`${LABEL[v]} ${when}`}>
      <V k={tint(night)} night={night} rm={rm} vending={vending} />
    </svg>
  );
}

// The naan scene's art (ART.naan): ?platform=v1|v2|v3 picks the variant (default v1), ?time=night previews the night.
export default function NaanPlatformScene({ props = {}, rm }) {
  const q = typeof location === 'undefined' ? new URLSearchParams() : new URLSearchParams(location.search);
  return <NaanPlatform variant={props.platform ?? q.get('platform') ?? 'v1'} time={props.time ?? q.get('time') ?? 'dusk'} rm={rm} vending={props.vending} />;
}
