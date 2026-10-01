// TOWN walk (research/sprint-0930/town/NOTES.md): 3 shots on the way to curry lunch, AKIBA · 2:45 PM.
// LIVE = PURE vtrace (Tony's cel-over-vtrace technique): the bg (背景) is ONE vtracer pass of the ref (pipeline/pure.py:
// 16:9 crop, faces / logos blurred, the light 2:45 PM grade; no repaint), and our signs + the ゲートちゃん board are flat
// hand CELS (セル) on top. Cels get the scene's tint and a soft shadow in the bg's light (SHADOWS.md); the street has a
// BOOK cel (a lamp pole in front of Nanda, rendered by main.jsx as <bg>-book). The older hand-hybrid shots stay exported
// as town-*-hybrid (traces *-hybrid.svg) for the comparison in research/sprint-0930/town/pure-compare/.
// HUD-safe band: no text above y 140; Nanda's column is x 730-1190.
import { traceUrl, preloadTrace } from '../romance/Grade.jsx';
import { Haze } from '../sandwich.jsx';

const JP = { fontFamily: "'IPAGothic', 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif", fontWeight: 700 };
const EN = { fontFamily: "'DejaVu Sans', 'Arial Black', sans-serif", fontWeight: 900 };
const INK = '#2b2433', WHITE = '#fffaf2', PINK = '#ff5fa2', BLUE = '#2f6fd6', ORANGE = '#ff8a2a';

// a vertical 縦看板 (faces the camera), one char per cell; the long vowel mark stands up in vertical writing
export function VSign({ x, y, w, text, bg, fg, rim, size = w * 0.72 }) {
  const chars = [...text].map((c) => (c === 'ー' ? '｜' : c));
  const h = chars.length * size * 1.08 + size * 0.5;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={bg} stroke={INK} strokeWidth="5" />
      {rim && <rect x={x + 7} y={y + 7} width={w - 14} height={h - 14} rx="4" fill="none" stroke={rim} strokeWidth="4" />}
      {chars.map((c, i) => {
        const ascii = c.charCodeAt(0) < 128;
        return <text key={i} x={x + w / 2} y={y + size * 0.3 + (i + 0.82) * size * 1.08} textAnchor="middle"
          fontSize={size * (ascii ? 0.86 : 1)} fill={fg} style={ascii ? EN : JP}>{c}</text>;
      })}
    </g>
  );
}

export function HSign({ x, y, w, h, text, bg, fg, size, rim, sub }) {
  const ty = y + h / 2 + size * 0.36 - (sub ? size * 0.3 : 0);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={bg} stroke={INK} strokeWidth="6" />
      {rim && <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx="5" fill="none" stroke={rim} strokeWidth="4" />}
      <text x={x + w / 2} y={ty} textAnchor="middle" fontSize={size} fill={fg} style={JP}>{text}</text>
      {sub && <text x={x + w / 2} y={ty + size * 0.72} textAnchor="middle" fontSize={Math.round(size * 0.42)} fill={fg} style={JP}>{sub}</text>}
    </g>
  );
}

export function TownScene({ id, label, children, sw = null }) {
  const t = sw ? `town/${id}-sw` : `town/${id}`;
  preloadTrace(t);
  return (
    <div className={`art town town-${id}${sw ? ' sw' : ''}`}>
      <svg viewBox="0 0 1920 1080" role="img" aria-label={label}>
        <image href={traceUrl(t)} width="1920" height="1080" preserveAspectRatio="none" />
        {sw && <Haze id={`town-${id}`} href={traceUrl(t)} {...sw} />}
        {children}
      </svg>
    </div>
  );
}

// the cel layer: a per-scene tint (feColorMatrix) + a soft shadow in the bg's light (feDropShadow). One filter per scene.
export function Cels({ id, tint, dx = 0, dy = 3, blur = 3, a = 0.3, children }) {
  return (
    <g>
      <filter id={`cel-${id}`} x="-10%" y="-10%" width="120%" height="130%">
        <feColorMatrix type="matrix" values={tint} />
        <feDropShadow dx={dx} dy={dy} stdDeviation={blur} floodColor="#22263e" floodOpacity={a} />
      </filter>
      <g filter={`url(#cel-${id})`}>{children}</g>
    </g>
  );
}
// tints: street = open shade under a sunny sky (a touch cool); crossing / board = overcast (greyer, softer)
const T_STREET = '0.94 0 0 0 0.01  0 0.95 0 0 0.01  0 0 1 0 0.02  0 0 0 1 0';
const T_GREY = '0.86 0.06 0.04 0 0.02  0.05 0.86 0.05 0 0.02  0.05 0.06 0.86 0 0.03  0 0 0 1 0';

// 1. establishing (ref 04, pure trace): the billboard canyon. Cels: the オア電 roof sign on the far building at the VP, the
// メイド・イン・NAND 縦看板 on the left sign column. The street floor is in open shade, so the cel shadows fall straight down.
export function TownStreet() {
  return (
    <TownScene id="street"
      label="Akiba main street at 2:45 PM, painted in soft traced colour blobs: huge billboards on both sides, a white roof sign that says OR-den at the end of the street, and a pink vertical sign that says Maid in NAND.">
      <Cels id="street" tint={T_STREET}>
        <HSign x={925} y={455} w={200} h={72} text="オア電" bg={WHITE} fg="#e8363c" size={52} rim="#e8363c" />
        <VSign x={640} y={170} w={70} text="メイド・イン・NAND" bg={PINK} fg={WHITE} rim={WHITE} size={44} />
      </Cels>
    </TownScene>
  );
}

// the street's BOOK cel: a lamp pole over her right edge, in front of her (depth); open shade, a soft shadow all round.
export function TownStreetBook() {
  return (
    <div className="art town-book" aria-hidden="true">
      <svg viewBox="0 0 1920 1080">
        <Cels id="street-book" tint={T_STREET} dx={0} dy={0} blur={4} a={0.25}>
          <rect x="1150" y="0" width="30" height="1080" fill="#6f7488" stroke={INK} strokeWidth="4" />
          <rect x="1168" y="0" width="12" height="1080" fill="#565a6e" />
          <rect x="1140" y="610" width="50" height="16" rx="4" fill="#565a6e" stroke={INK} strokeWidth="4" />
        </Cels>
      </svg>
    </div>
  );
}

// 2. the crossing (ref 05, pure trace): the real crowd, traced (heads blurred first), on the zebra. Cel: ANDロイド over the
// big board on the right. Overcast: the cel shadow is soft and straight down.
export function TownCrossing() {
  return (
    <TownScene id="crossing"
      label="A crowded crosswalk in Akiba on a grey day, painted in soft traced colour blobs: a line of people crossing, and a blue board on the right that says AND-roid, newest smartphones.">
      <Cels id="crossing" tint={T_GREY}>
        <HSign x={1360} y={160} w={400} h={230} text="ANDロイド" bg={BLUE} fg={WHITE} size={72} rim="#a8efe6" sub="最新スマホ あります" />
        <rect x="1700" y="186" width="44" height="80" rx="9" fill={INK} />
        <rect x="1706" y="194" width="32" height="64" rx="4" fill="#a8efe6" />
      </Cels>
    </TownScene>
  );
}

// 3. the billboard (ref 07, pure trace): OUR ゲートちゃん board (cel: gate-chan.svg, from pipeline/cels.py) on the traced
// board face, her name + the pun NANDでも推せる！ as 縦看板 on its edges. Overcast.
export function TownBoard() {
  return (
    <TownScene id="board"
      label="A giant anime billboard on an Akiba building on a grey day: a smiling idol girl with mint twin tails and a yellow logic-gate hair clip. Her name, Gate-chan, runs down the left edge, and the slogan NAND de mo oseru down the right.">
      <Cels id="board" tint={T_GREY}>
        <rect x="716" y="150" width="760" height="620" fill={INK} />
        <image href={traceUrl('town/gate-chan')} x="722" y="156" width="748" height="608" preserveAspectRatio="none" />
        <VSign x={1488} y={160} w={78} text="NANDでも推せる！" bg={PINK} fg={WHITE} rim={WHITE} size={50} />
        <VSign x={620} y={160} w={78} text="ゲートちゃん" bg="#2b2a55" fg={WHITE} rim={PINK} size={52} />
      </Cels>
    </TownScene>
  );
}

// ---- the older HAND-HYBRID shots (trace -> hand repaint -> trace), kept for the comparison only ----
// 1. establishing (refs 04 + 02/03): the billboard canyon, one VP (960, 560) down the middle of the street.
export function TownStreetHybrid() {
  return (
    <TownScene id="street-hybrid"
      label="Akiba main street at 2:45 PM: huge anime billboards on both sides, tall vertical shop signs, a white roof sign that says OR-den at the end of the street, and small flat silhouettes of people walking.">
      <VSign x={640} y={170} w={70} text="メイド・イン・NAND" bg={PINK} fg={WHITE} rim={WHITE} size={44} />
      <text x="70" y="772" fontSize="54" fill={WHITE} style={JP} transform="rotate(-11 70 772)">推し活グッズ</text>
    </TownScene>
  );
}

// 2. the crossing (refs 05 + 01): the crowd as flat silhouettes, the zebra stripes on the VP (960, 520); your arm in
// from the left with her two hands wrapped round it.
export function TownCrossingHybrid() {
  return (
    <TownScene id="crossing-hybrid"
      label="A crowded crosswalk in Akiba. Dozens of flat dark silhouettes of people cross. Your green sleeve reaches in from the left, and Nanda's two hands hold your arm tight.">
      <HSign x={1330} y={150} w={560} h={300} text="ANDロイド" bg={BLUE} fg={WHITE} size={84} rim="#a8efe6" sub="最新スマホ あります" />
      <rect x="1812" y="180" width="60" height="110" rx="12" fill={INK} />
      <rect x="1820" y="190" width="44" height="88" rx="5" fill="#a8efe6" />
      <HSign x={1000} y={330} w={250} h={84} text="カレー →" bg={ORANGE} fg={WHITE} size={58} />
    </TownScene>
  );
}

// 3. the billboard (refs 06 + 07): a GIANT board of our own idol ゲートちゃん, the pun NANDでも推せる！, the maid café
// メイド・イン・NAND above Nanda's head. One VP (1000, 600).
export function TownBoardHybrid() {
  return (
    <TownScene id="board-hybrid"
      label="A giant anime billboard on a corner building: a smiling idol girl with mint twin tails and a yellow logic-gate hair clip. Her name, Gate-chan, runs down the side. The slogan under her says NAND de mo oseru.">
      <rect x="70" y="552" width="570" height="78" fill={PINK} />
      <text x="355" y="610" textAnchor="middle" fontSize="54" fill={WHITE} stroke={INK} strokeWidth="3" paintOrder="stroke" style={JP}>NANDでも推せる！</text>
      <HSign x={830} y={170} w={460} h={110} text="メイド・イン・NAND" bg={PINK} fg={WHITE} size={42} rim={WHITE} />
    </TownScene>
  );
}
