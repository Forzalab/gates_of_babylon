// TOWN, SANDWICH version (research/sprint-0930/sandwich/LOG.md): BACK = a pure vtrace of the ORIGINAL ref (only small
// face blurs + brand-name scrubs, the ad clutter kept: pipeline/back.py -> trace/town/<id>-sw.svg), MID = <Haze>, FRONT =
// our hand-traced ad cels, LOTS of them, saturation cranked (vivid Akiba neon), set in each facade's perspective
// (skewY = the facade slope toward the street VP). One soft, straight-down contact shadow (overcast / open shade).
// HUD band: no text above y 140. The dialogue box starts near y 780, so the front text sits in y 140-760.
import { TownScene } from './Town.jsx';
import { traceUrl } from '../romance/Grade.jsx';
import { FrontDefs, front, Tate, Board, Nobori, Walker, NEON as N, LINE } from '../sandwich.jsx';

const W = N.white;

// 1. the billboard canyon (ref 04). VP of the street ~ (990, 880); left facades fall toward it (skew +), right rise (skew -).
export function TownStreetSW() {
  return (
    <TownScene id="street" sw={{ blur: 3, op: 0.5, tint: '#eaf2fb', wash: 0.07 }}
      label="Akiba main street at 2:45 PM: a canyon of loud billboards. On the left, a giant Gate-chan idol poster and a pink banner, NAND de mo oseru; vertical signs say Maid in NAND and Moe Gate; a white roof sign at the end of the street says OR-den; on the right a yellow board says Card Gate Kingdom, a blue one AND-roid, and shop flags stand on the pavement.">
      <FrontDefs id="tst" a={0.28} />
      <g filter={front('tst')}>
        {/* left: the huge anime board becomes our ゲートちゃん poster, leaning into the street */}
        <g transform="translate(40 150) skewY(9)">
          <rect width="440" height="420" fill={N.violet} stroke={LINE} strokeWidth="6" />
          <image href={traceUrl('town/gate-chan')} x="10" y="10" width="420" height="340" preserveAspectRatio="xMidYMid slice" />
          <rect x="10" y="350" width="420" height="60" fill={N.pink} />
          <text x="220" y="396" textAnchor="middle" fontSize="44" fill={W} style={{ fontFamily: "'IPAGothic', sans-serif", fontWeight: 700 }}>ゲートちゃん 新曲！</text>
        </g>
        <Board x={0} y={640} w={540} h={86} skew={9} bg={N.pink} rim={W} lines={[['NANDでも推せる！', 50, W]]} />
        {/* the left sign column (vertical 看板), stepping toward the VP */}
        <Tate x={560} y={300} w={64} text="萌えゲート" bg={N.yellow} fg={N.red} size={44} />
        <Tate x={640} y={170} w={70} text="メイド・イン・NAND" bg={N.pink} fg={W} rim={W} size={44} />
        <Tate x={730} y={250} w={52} text="まんが館" bg={N.cyan} fg={W} size={36} />
        <Tate x={800} y={330} w={40} text="オア電" bg={W} fg={N.red} rim={N.red} size={28} />
        {/* the roof sign over the VP */}
        <Board x={925} y={455} w={200} h={72} bg={W} rim={N.red} lines={[['オア電', 52, N.red]]} />
        {/* right: the big slanted board (the old カードキングダム) and the tall ad column */}
        <Board x={1510} y={330} w={410} h={160} skew={-13} bg={N.yellow} rim={N.orange} lines={[['カードゲート王国', 44, N.red], ['GATE KINGDOM · 買取', 26, LINE]]} />
        <Tate x={1236} y={200} w={74} text="ANDロイド" bg={N.cyan} fg={W} rim={W} size={48} skew={-6} />
        <Tate x={1330} y={180} w={64} text="推し活グッズ" bg={N.violet} fg={N.yellow} size={42} skew={-6} />
        <Tate x={1086} y={300} w={44} text="ゲーセン" bg={N.green} fg={W} size={30} skew={-4} />
        <Board x={1270} y={640} w={330} h={80} skew={-9} bg={N.orange} rim={W} lines={[['カレー → 200m', 40, W]]} />
        {/* のぼり flags on the right pavement */}
        <Nobori x={1650} base={900} h={230} text="新作入荷" bg={N.red} fg={W} />
        <Nobori x={1730} base={915} h={250} text="推し活" bg={N.pink} fg={W} />
        <Nobori x={1815} base={930} h={270} text="中古NAND" bg={N.yellow} fg={N.red} />
        {/* the far crowd (flat cels) near the VP, heads on the eye line */}
        <Walker x={900} base={905} eye={868} c="#4a5a8a" />
        <Walker x={1060} base={912} eye={868} c="#8a4a5a" flip />
        <Walker x={1120} base={920} eye={868} c="#3d6a5a" bag={N.pink} />
      </g>
    </TownScene>
  );
}

// 2. the crossing (ref 05): the real traced crowd stays in the back; the signs above it become ours.
export function TownCrossingSW() {
  return (
    <TownScene id="crossing" sw={{ blur: 3, op: 0.5, tint: '#e9edf2', wash: 0.08 }}
      label="A crowded crosswalk in Akiba on a grey day. Above the crowd, loud signs: a big blue AND-roid phone board on the right, vertical signs for an arcade, karaoke and fan goods, an orange Curry arrow, and a pink Maid in NAND board.">
      <FrontDefs id="tcr" a={0.26} blur={4} />
      <g filter={front('tcr')}>
        <Tate x={70} y={150} w={80} text="カラオケAND" bg={N.red} fg={W} rim={W} size={52} />
        <Tate x={360} y={150} w={62} text="ゲーセン" bg={N.violet} fg={N.cyan} size={46} />
        <Tate x={590} y={150} w={58} text="推し活グッズ" bg={N.pink} fg={W} size={42} />
        <Board x={940} y={170} w={200} h={210} bg={N.orange} rim={W} lines={[['カレー', 54, W], ['→', 64, W]]} />
        <Board x={1360} y={160} w={400} h={230} bg={N.cyan} rim={W} lines={[['ANDロイド', 72, W], ['最新スマホ あります', 30, LINE]]} />
        <rect x="1700" y="186" width="44" height="80" rx="9" fill={LINE} />
        <rect x="1706" y="194" width="32" height="64" rx="4" fill="#bdfcff" />
        <Board x={1380} y={590} w={440} h={80} bg={W} rim={N.pink} lines={[['メイド・イン・NAND', 34, N.pink]]} />
        <Board x={200} y={560} w={240} h={70} bg={N.yellow} lines={[['まんが 中古', 36, N.red]]} />
      </g>
    </TownScene>
  );
}

// 3. the billboard (ref 07): our ゲートちゃん board on the traced board face, the side columns now all ours.
export function TownBoardSW() {
  return (
    <TownScene id="board" sw={{ blur: 3, op: 0.5, tint: '#e9edf2', wash: 0.08 }}
      label="A giant anime billboard on an Akiba building on a grey day: a smiling idol girl with mint twin tails and a yellow logic-gate hair clip. Her name, Gate-chan, runs down the left edge and the slogan NAND de mo oseru down the right; more vertical signs say OR-den, AND-roid and Oshi-katsu, and a neon board says Maid in NAND.">
      <FrontDefs id="tbd" a={0.26} blur={4} />
      <g filter={front('tbd')}>
        <Tate x={320} y={190} w={62} text="ANDロイド" bg={N.cyan} fg={W} size={42} />
        <Tate x={400} y={150} w={70} text="オア電" bg={W} fg={N.red} rim={N.red} size={50} />
        <Tate x={80} y={420} w={56} text="推し活" bg={N.pink} fg={W} size={40} />
        <rect x="716" y="150" width="760" height="620" fill={LINE} />
        <image href={traceUrl('town/gate-chan')} x="722" y="156" width="748" height="608" preserveAspectRatio="none" />
        <Tate x={1488} y={160} w={78} text="NANDでも推せる！" bg={N.pink} fg={W} rim={W} size={50} />
        <Tate x={620} y={160} w={78} text="ゲートちゃん" bg={N.violet} fg={W} rim={N.pink} size={52} />
        <Board x={1600} y={300} w={300} h={110} bg={N.violet} rim={N.pink} lines={[['メイド・イン・NAND', 30, N.yellow], ['MAID CAFE', 26, W]]} />
        <Board x={1610} y={450} w={170} h={170} rx={85} bg={W} rim={LINE} lines={[['質', 110, LINE]]} />
        <Board x={1790} y={470} w={120} h={250} bg={N.yellow} lines={[['買取', 44, N.red], ['ゲーム', 30, LINE], ['まんが', 30, LINE]]} />
      </g>
    </TownScene>
  );
}
