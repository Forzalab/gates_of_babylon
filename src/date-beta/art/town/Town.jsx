// TOWN walk (research/sprint-0930/town/NOTES.md): 3 shots on the way to curry lunch, AKIBA · 2:45 PM.
// Each shot = the SECOND vtracer trace (public/date-beta/trace/town/<id>.svg) of a hand-fixed composite of the first
// trace of Tony's refs (pipeline: research/sprint-0930/town/pipeline). One vanishing point per shot, straight verticals,
// every sign ours. The pun signs whose kana the trace blurs are redrawn crisp on top, at the same place as in hand.py.
// HUD-safe band: no text above y 140. The dialogue box (y > 770) and Nanda's column (x 730-1190) cover no sign that
// has to be read, and never the billboard face (x 170-500, y 200-470).
import { traceUrl, preloadTrace } from '../romance/Grade.jsx';

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

export function TownScene({ id, label, children }) {
  preloadTrace(`town/${id}`);
  return (
    <div className={`art town town-${id}`}>
      <svg viewBox="0 0 1920 1080" role="img" aria-label={label}>
        <image href={traceUrl(`town/${id}`)} width="1920" height="1080" preserveAspectRatio="none" />
        {children}
      </svg>
    </div>
  );
}

// 1. establishing (refs 04 + 02/03): the billboard canyon, one VP (960, 560) down the middle of the street.
export function TownStreet() {
  return (
    <TownScene id="street"
      label="Akiba main street at 2:45 PM: huge anime billboards on both sides, tall vertical shop signs, a white roof sign that says OR-den at the end of the street, and small flat silhouettes of people walking.">
      <VSign x={640} y={170} w={70} text="メイド・イン・NAND" bg={PINK} fg={WHITE} rim={WHITE} size={44} />
      <text x="70" y="772" fontSize="54" fill={WHITE} style={JP} transform="rotate(-11 70 772)">推し活グッズ</text>
    </TownScene>
  );
}

// 2. the crossing (refs 05 + 01): the crowd as flat silhouettes, the zebra stripes on the VP (960, 520); your arm in
// from the left with her two hands wrapped round it.
export function TownCrossing() {
  return (
    <TownScene id="crossing"
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
export function TownBoard() {
  return (
    <TownScene id="board"
      label="A giant anime billboard on a corner building: a smiling idol girl with mint twin tails and a yellow logic-gate hair clip. Her name, Gate-chan, runs down the side. The slogan under her says NAND de mo oseru.">
      <rect x="70" y="552" width="570" height="78" fill={PINK} />
      <text x="355" y="610" textAnchor="middle" fontSize="54" fill={WHITE} stroke={INK} strokeWidth="3" paintOrder="stroke" style={JP}>NANDでも推せる！</text>
      <HSign x={830} y={170} w={460} h={110} text="メイド・イン・NAND" bg={PINK} fg={WHITE} size={42} rim={WHITE} />
    </TownScene>
  );
}
