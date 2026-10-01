// SceneA.jsx: the Scene A (rooftop) chrome + camera layers the player draws from a beat's `props.cut`
// (research/sprint-0930/scene-a/FACES.md, SCENES.md "props.cut"). Everything is still: a stepped reveal is one hard
// swap after >= 500 ms (useStep), never a tween, the same with reduced motion.
//   Handout  : her pink bento replaces <Choices>; the umeboshi / tamagoyaki are the buttons (cut.handout maps
//              food -> choice index), the other choices stay small pills. Keys 1-3 still pick (main.jsx).
//   SmileTag : a one-choice beat's pick drawn where NEXT sits ("smile ♥ +1"); click / Space / Enter take it.
//   PovFood  : the POV "you eat" insert: the chosen piece big in the foreground, up in the chopsticks.
//   PeekBento: the watching-you-eat foreground: the box low left, the eaten piece gone.
import { useEffect, useState } from 'react';
import { BentoSvg, TamaBlock, Umeboshi, Chopstick, HeldChopsticks, Glint } from './art/scene-a/index.js';
import { Parts, LoveChip } from './Say.jsx';
import { fill } from './meta.js';
import './scene-a.css';

// One stepped swap: false until `ms` after `key` changed (true at once when ms is 0). key = the position object.
export function useStep(ms, key) {
  const [done, setDone] = useState(null);
  useEffect(() => {
    if (!ms) return undefined;
    const t = setTimeout(() => setDone(key), ms);
    return () => clearTimeout(t);
  }, [ms, key]);
  return !ms || done === key;
}

const FOOD_OF = { tama: 'tamagoyaki', ume: 'umeboshi' };
// Stage geometry of the handout box (BentoSvg viewBox -20 -20 1200 872 drawn 720 wide at left 600, top 360).
const HB = { left: 600, top: 360, w: 720 };

export function Handout({ choices, map, on = [], onPick, left = null, total = null, def = -1, hidden = false, blind = false }) {
  const [hot, setHot] = useState(null);
  const idx = { tama: map.tama, ume: map.ume };
  const rest = choices.map((c, i) => i).filter((i) => i !== idx.tama && i !== idx.ume);
  const timed = left != null && total > 0;
  const over = (e) => setHot(e.target.closest?.('[data-food]')?.dataset.food ?? null);
  const label = (f) => `${idx[f] + 1}: ${fill(choices[idx[f]].plain)}`;
  // R6 (Tony): the food picks are the SAME choice buttons as every other beat (db-choice + side colour + chip + default tag), only smaller.
  const btn = (i, cls, text, f = null) => {
    const c = choices[i];
    return (
      <button type="button" key={i} className={`db-choice ${c.side} sa-mini ${cls}${f && hot === f ? ' hot' : ''}${timed && i === def ? ' is-default' : ''}`}
        disabled={on[i] === false} aria-label={`${i + 1}: ${fill(c.plain)}`}
        onClick={(e) => { e.stopPropagation(); onPick(i); }} onPointerEnter={f ? () => setHot(f) : undefined} onPointerLeave={f ? () => setHot(null) : undefined}>
        {!blind && <LoveChip love={c.love} hidden={hidden} />}
        <span className="line">{text}</span>
        {timed && i === def && <span className="db-deftag">default</span>}
      </button>
    );
  };
  return (
    <div className="sa-handout" role="group" aria-label="She holds out her bento. Take one." onClick={(e) => e.stopPropagation()}>
      {/* her arms: the gate's pink rim, out to the box's back corners (drawn under the box) */}
      <svg className="sa-arms" viewBox="0 0 1920 1080" aria-hidden="true">
        <path d="M806,318 Q716,356 668,414 M1106,318 Q1196,356 1252,414" fill="none" stroke="#d1177f" strokeWidth="36" strokeLinecap="round" />
        <path d="M806,318 Q716,356 668,414 M1106,318 Q1196,356 1252,414" fill="none" stroke="#fff" strokeWidth="25" strokeLinecap="round" />
      </svg>
      <div className="sa-handout-box" style={{ left: HB.left, top: HB.top, width: HB.w }} onPointerOver={over} onPointerLeave={() => setHot(null)}
        onFocus={over} onBlur={() => setHot(null)}>
        <BentoSvg uid="ho" focus={hot ?? 'both'} labels={{ tama: label('tama'), ume: label('ume') }} onPick={(f) => onPick(idx[f])} />
      </div>
      <svg className="sa-arms hands" viewBox="0 0 1920 1080" aria-hidden="true">
        {[[664, 404], [1256, 404]].map(([x, y]) => <g key={x}><circle cx={x} cy={y} r="24" fill="#fff" stroke="#d1177f" strokeWidth="5" /><path d={`M${x - 10},${y + 4} q10,8 20,0`} fill="none" stroke="#ffc4e6" strokeWidth="4" strokeLinecap="round" /></g>)}
      </svg>
      {timed && (
        <div className="db-timebar sa-timebar" role="timer" aria-label={`${Math.ceil(left)} seconds left`}>
          <i style={{ width: `${Math.max(0, Math.min(100, (100 * left) / total))}%` }} />
          <span className="db-timer">{Math.ceil(left)}</span>
        </div>
      )}
      {btn(idx.tama, 'right', FOOD_OF.tama, 'tama')}
      {btn(idx.ume, 'left', FOOD_OF.ume, 'ume')}
      {rest.map((i, k) => btn(i, `left rest${k}`, <Parts parts={choices[i].parts} />))}
    </div>
  );
}

// The NEXT pill's place, but it is the beat's only choice: its words + the love it gives ("smile ♥ +1").
export function SmileTag({ choice, onPick, blind = false }) {
  const n = choice.love;
  return (
    <button type="button" className="hud-next sa-smile" aria-label={blind ? fill(choice.plain) : `${fill(choice.plain)}: love ${n > 0 ? 'plus' : 'minus'} ${Math.abs(n)}`}
      onClick={(e) => { e.stopPropagation(); onPick(0); }}>
      <span className="line"><Parts parts={choice.parts} /></span><b aria-hidden="true">{n > 0 ? '♥' : '♡'}{blind ? '' : ` ${n > 0 ? `+${n}` : `−${-n}`}`}</b>
    </button>
  );
}

// POV: you eat. Your chopsticks come up from the bottom right with her food, big and sharp; she sits across, watching.
export function PovFood({ food = 'tama' }) {
  const ume = food === 'ume';
  return (
    <svg className="sa-layer sa-pov" viewBox="0 0 1920 1080" role="img"
      aria-label={ume ? 'Your view: the umeboshi comes up to your mouth in her pink chopsticks.' : 'Your view: a tamagoyaki slice comes up to your mouth in her pink chopsticks.'}>
      <defs><radialGradient id="pov-vig" cx=".5" cy=".46" r=".72"><stop offset=".62" stopColor="#1a0710" stopOpacity="0" /><stop offset="1" stopColor="#1a0710" stopOpacity=".5" /></radialGradient></defs>
      <rect width="1920" height="1080" fill="url(#pov-vig)" />
      {/* H1: your hand holds the sticks (bottom right, the green knit sleeve off the frame edge), never nobody's */}
      {ume ? (
        <g>
          <HeldChopsticks tips={[[1010, 640], [990, 520]]} grip={[1640, 700]} s={1.7} w0={64} w1={20}>
            <g transform="translate(820 600) rotate(-8)"><Umeboshi r={170} uid="pov-u" /></g>
          </HeldChopsticks>
          <Glint x={700} y={470} s={30} />
        </g>
      ) : (
        <g>
          <HeldChopsticks tips={[[1060, 700], [1080, 430]]} grip={[1660, 720]} s={1.7} w0={64} w1={20} behind>
            <g transform="translate(800 610) rotate(-8) scale(1.45)"><TamaBlock uid="pov-t" /></g>
          </HeldChopsticks>
          <Glint x={610} y={430} s={34} /><Glint x={1080} y={520} s={20} op={0.8} />
        </g>
      )}
    </svg>
  );
}

// Watching you eat: the box in the foreground, low left, the piece you took gone from it.
export function PeekBento({ food = 'tama' }) {
  return <BentoSvg className="sa-layer sa-peek-box" uid="pk" lift={food === 'ume' ? 'ume' : 'tama'} />;
}
