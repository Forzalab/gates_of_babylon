// SceneA.jsx: the Scene A (rooftop) chrome + camera layers the player draws from a beat's `props.cut`
// (research/sprint-0930/scene-a/FACES.md, SCENES.md "props.cut"). Everything is still: a stepped reveal is one hard
// swap after >= 500 ms (useStep), never a tween, the same with reduced motion.
//   Handout  : her pink bento replaces <Choices>; the umeboshi / tamagoyaki are the buttons (cut.handout maps
//              food -> choice index), the other choices stay small pills. Keys 1-3 still pick (main.jsx).
//   SmileTag : a one-choice beat's pick drawn where NEXT sits ("smile ♥ +1"); click / Space / Enter take it.
//   PovFood  : the POV "you eat" insert: the chosen piece big in the foreground, up in the chopsticks.
//   PeekBento: the watching-you-eat foreground: the box low left, the eaten piece gone.
import { useEffect, useState } from 'react';
import { BentoSvg, BentoBox, TamaBlock, Umeboshi, Chopstick, Glint } from './art/scene-a/index.js';
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

export function Handout({ choices, map, on = [], onPick, left = null, total = null, def = -1, hidden = false }) {
  const [hot, setHot] = useState(null);
  const idx = { tama: map.tama, ume: map.ume };
  const rest = choices.map((c, i) => i).filter((i) => i !== idx.tama && i !== idx.ume);
  const timed = left != null && total > 0;
  const over = (e) => setHot(e.target.closest?.('[data-food]')?.dataset.food ?? null);
  const label = (f) => `${idx[f] + 1}: ${fill(choices[idx[f]].plain)}`;
  const pill = (f, cls) => {
    const i = idx[f], c = choices[i];
    return (
      <button type="button" tabIndex={-1} aria-hidden="true" className={`sa-food-tag ${cls}${hot === f ? ' hot' : ''}${timed && i === def ? ' is-default' : ''}`}
        onClick={(e) => { e.stopPropagation(); onPick(i); }} onPointerEnter={() => setHot(f)} onPointerLeave={() => setHot(null)}>
        <kbd>{i + 1}</kbd><span className="name">{FOOD_OF[f]}</span><LoveChip love={c.love} hidden={hidden} />
        {timed && i === def && <span className="db-deftag">default</span>}
      </button>
    );
  };
  return (
    <div className="sa-handout" role="group" aria-label="She holds out her bento. Take one." onClick={(e) => e.stopPropagation()}>
      {/* her arms = her PIN LEADS (r5): out of her lower input pin (left) and her NOT bubble (right) to the box's back
          corners, the pins' rim + lit core (drawn under the box) */}
      <svg className="sa-arms" viewBox="0 0 1920 1080" aria-hidden="true">
        <path d="M770,338 C720,344 680,372 666,404 M1196,268 C1246,286 1262,340 1256,404" fill="none" stroke="#d1177f" strokeWidth="16" strokeLinecap="round" />
        <path d="M768,334 C720,340 684,366 672,396 M1196,262 C1242,280 1256,332 1252,396" fill="none" stroke="#ffc4e6" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <div className="sa-handout-box" style={{ left: HB.left, top: HB.top, width: HB.w }} onPointerOver={over} onPointerLeave={() => setHot(null)}
        onFocus={over} onBlur={() => setHot(null)}>
        <BentoSvg uid="ho" focus={hot ?? 'both'} labels={{ tama: label('tama'), ume: label('ume') }} onPick={(f) => onPick(idx[f])} />
      </div>
      <svg className="sa-arms hands" viewBox="0 0 1920 1080" aria-hidden="true">
        {/* her pin hands on the box rim: a round pin nub each, two short pin fingers hooked over the rim */}
        {[[664, 404, -1], [1256, 404, 1]].map(([x, y, d]) => (
          <g key={x}>
            <path d={`M${x} ${y} l${-8 * d} 34 M${x} ${y} l${10 * d} 32`} stroke="#d1177f" strokeWidth="11" strokeLinecap="round" />
            <path d={`M${x - 4 * d} ${y + 12} l${-4 * d} 16 M${x + 5 * d} ${y + 12} l${5 * d} 15`} stroke="#ffc4e6" strokeWidth="4" strokeLinecap="round" />
            <circle cx={x} cy={y} r="17" fill="#ffc4e6" stroke="#d1177f" strokeWidth="5" /><circle cx={x - 5} cy={y - 6} r="5" fill="#fff" opacity=".8" />
          </g>
        ))}
      </svg>
      {timed && (
        <div className="db-timebar sa-timebar" role="timer" aria-label={`${Math.ceil(left)} seconds left`}>
          <i style={{ width: `${Math.max(0, Math.min(100, (100 * left) / total))}%` }} />
          <span className="db-timer">{Math.ceil(left)}</span>
        </div>
      )}
      {pill('tama', 'right')}
      {pill('ume', 'left')}
      {rest.map((i) => (
        <button type="button" key={i} className={`sa-other ${choices[i].side}`} disabled={on[i] === false} aria-label={`${i + 1}: ${fill(choices[i].plain)}`}
          onClick={(e) => { e.stopPropagation(); onPick(i); }}>
          <kbd>{i + 1}</kbd><span className="line"><Parts parts={choices[i].parts} /></span><LoveChip love={choices[i].love} hidden={hidden} />
        </button>
      ))}
    </div>
  );
}

// The NEXT pill's place, but it is the beat's only choice: its words + the love it gives ("smile ♥ +1").
export function SmileTag({ choice, onPick }) {
  const n = choice.love;
  return (
    <button type="button" className="hud-next sa-smile" aria-label={`${fill(choice.plain)}: love ${n > 0 ? 'plus' : 'minus'} ${Math.abs(n)}`}
      onClick={(e) => { e.stopPropagation(); onPick(0); }}>
      <span className="line"><Parts parts={choice.parts} /></span><b aria-hidden="true">{n > 0 ? '♥' : '♡'} {n > 0 ? `+${n}` : `−${-n}`}</b>
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
      {/* r5 (AUDIT 008): your bento's pink corner low left (the BOOK), the piece held just above it in your chopsticks */}
      <g transform="translate(-330 560) rotate(-6) scale(.78)"><BentoBox uid="pov-b" lift={ume ? 'ume' : 'tama'} /></g>
      {ume ? (
        <g>
          <Chopstick from={[2080, 1180]} to={[700, 668]} w0={56} w1={18} />
          <g transform="translate(560 640) rotate(-8)"><Umeboshi r={112} uid="pov-u" /></g>
          <Chopstick from={[2080, 960]} to={[680, 586]} w0={56} w1={18} />
          <Glint x={480} y={540} s={24} />
        </g>
      ) : (
        <g>
          <Chopstick from={[2080, 1200]} to={[720, 700]} w0={56} w1={18} />
          <g transform="translate(560 650) rotate(-8) scale(1)"><TamaBlock uid="pov-t" /></g>
          <Chopstick from={[2080, 940]} to={[700, 560]} w0={56} w1={18} />
          <Glint x={430} y={520} s={26} />
        </g>
      )}
    </svg>
  );
}

// Watching you eat: the box in the foreground, low left, the piece you took gone from it.
export function PeekBento({ food = 'tama' }) {
  return <BentoSvg className="sa-layer sa-peek-box" uid="pk" lift={food === 'ume' ? 'ume' : 'tama'} />;
}
