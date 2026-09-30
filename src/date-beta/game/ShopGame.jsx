// ShopGame "HER LIST": the v2-shop mini-game (groceries route only; packs/shop.json puts it after v2-shop's cart POV).
// You push the cart (POV: the red handle at the bottom edge). 3 aisles, one hard cut each: her list item at the top, a
// shelf of 3-4 items (click, or keys 1-4), a stepped "She is waiting" timer. Right = the close-up + her happy line.
// Wrong (or the timer) = her mood climbs for the rest of the game: pout -> OCPD (she straightens the shelf) -> BPD
// split (flat, then sweet). End card: the cart with the three items + "you ♡", then onPick(bucket): the beat's choice
// 0 (love -2) / 1 (+2) / 2 (+3). Like LockGame: every state is a static frame held >= 334 ms, no transitions, so
// reduced motion needs no separate path. Rules live in shopgame.js (tested under node).
import { useCallback, useEffect, useRef, useState } from 'react';
import { SHOP } from '../art/shop/index.js';
import { Nanda } from '../Nanda.jsx';
import { ROUNDS, SECS, HOLD, moodOf, bucket, keySlot, pickItem, timeOut, fresh, TIMEOUT_LINE } from './shopgame.js';
import './shopgame.css';

// flat item icons (60x60), one per shelf item
function Icon({ id }) {
  const ol = { stroke: '#3a2a30', strokeWidth: 2.5, strokeLinejoin: 'round' };
  switch (id) {
    case 'carrots': return (<svg viewBox="0 0 60 60"><path d="M18 20 L44 22 L26 56 Z" fill="#ff8a2a" {...ol} /><path d="M30 20 l-8 -14 M32 20 l2 -16 M34 21 l10 -12" stroke="#3f9a3a" strokeWidth="4" strokeLinecap="round" /></svg>);
    case 'daikon': return (<svg viewBox="0 0 60 60"><path d="M22 18 Q30 14 38 18 L34 56 Q30 58 26 56 Z" fill="#f6f4ee" {...ol} /><path d="M30 16 l-8 -12 M30 16 l8 -12" stroke="#3f9a3a" strokeWidth="4" strokeLinecap="round" /></svg>);
    case 'potato': return (<svg viewBox="0 0 60 60"><ellipse cx="30" cy="32" rx="22" ry="14" transform="rotate(-20 30 32)" fill="#a0405a" {...ol} /></svg>);
    case 'jar': return (<svg viewBox="0 0 60 60"><rect x="18" y="8" width="24" height="7" rx="2" fill="#7a3050" {...ol} /><rect x="14" y="15" width="32" height="38" rx="6" fill="#d9c7e8" {...ol} /><rect x="17" y="27" width="26" height="12" fill="#fff" /><text x="30" y="36.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="#7a3050">KEMEY</text></svg>);
    case 'milk': return (<svg viewBox="0 0 60 60"><path d="M18 18 L30 8 L42 18 L42 54 L18 54 Z" fill="#fff" {...ol} /><rect x="18" y="30" width="24" height="12" fill="#5b8fd6" /></svg>);
    case 'eggs': return (<svg viewBox="0 0 60 60"><rect x="8" y="30" width="44" height="18" rx="4" fill="#e9dcc0" {...ol} />{[16, 30, 44].map((x) => <ellipse key={x} cx={x} cy="28" rx="6" ry="8" fill="#fff6e4" {...ol} />)}</svg>);
    case 'natto': return (<svg viewBox="0 0 60 60"><rect x="10" y="20" width="40" height="28" rx="3" fill="#f2e6c8" {...ol} /><circle cx="30" cy="34" r="8" fill="#b07a3a" /><path d="M10 20 L50 20" stroke="#d8262e" strokeWidth="5" /></svg>);
    default: { // cups: one, pair, three
      const n = id === 'three' ? 3 : id === 'pair' ? 2 : 1;
      const xs = n === 3 ? [14, 30, 46] : n === 2 ? [21, 39] : [30];
      return (<svg viewBox="0 0 60 60">{xs.map((x) => (<g key={x}><path d={`M${x - 8} 24 L${x - 6} 44 Q${x} 48 ${x + 6} 44 L${x + 8} 24 Z`} fill="#fbf8f2" {...ol} /><rect x={x - 7.5} y="31" width="15" height="5" fill="#ff8fb8" /></g>))}</svg>);
    }
  }
}

// her one anchor in every game frame: the same sprite size + feet on the floor band (y ~950), a contact shadow that
// falls down-left (the 2:00 PM sun is upper right). Only her face/layers change between frames.
function Her(props) {
  return (<><i className="sg-foot" aria-hidden="true" /><Nanda big talk={false} {...props} /></>);
}

function Bg({ id }) {
  const Art = SHOP[id];
  return Art ? <div className="sg-bg"><Art rm props={{}} /></div> : null;
}

export default function ShopGame({ props = {}, onPick }) {
  const secs = props.secs ?? SECS;
  const rolls = props.eggs === 'rolls';
  const [st, setSt] = useState(fresh);
  const [frame, setFrame] = useState({ kind: 'shelf' }); // shelf | wrong | right | end
  const [left, setLeft] = useState(secs);
  const done = useRef(false);
  const timers = useRef([]);
  const later = (ms, f) => { timers.current.push(setTimeout(f, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // same = back to the same aisle after a wrong pick: the clock keeps its time (it never refills, so a round is <= secs)
  const toShelf = useCallback((s, same = false) => {
    if (s.done) {
      setFrame({ kind: 'end' });
      later(HOLD.end, () => { if (!done.current) { done.current = true; onPick?.(bucket(s.wrongs)); } });
      return;
    }
    if (!same) setLeft(secs);
    setFrame({ kind: 'shelf' });
  }, [onPick, secs]);

  const play = useCallback((s) => {
    setSt(s);
    const round = ROUNDS.find((r) => r.id === s.last.round);
    if (s.last.ok) {
      setFrame({ kind: 'right', round });
      later(HOLD.right, () => toShelf(s));
      return;
    }
    const mood = moodOf(s.wrongs);
    const item = round.items.find((i) => i.id === s.last.item);
    setFrame({ kind: 'wrong', round, mood, aside: s.last.timeout ? TIMEOUT_LINE : item?.aside, sweet: false });
    if (mood.sweet) later(HOLD.split, () => setFrame((f) => (f.kind === 'wrong' ? { ...f, sweet: true } : f)));
    later(HOLD.wrong + (mood.sweet ? HOLD.split : 0), () => toShelf(s, !s.last.timeout));
  }, [toShelf]);

  const choose = useCallback((slot) => {
    if (frame.kind !== 'shelf' || done.current) return;
    const s = pickItem(st, slot);
    if (s.last) play(s);
  }, [frame.kind, st, play]);

  // the stepped timer: one tick a second while she waits in this aisle (it keeps running through a wrong-pick frame)
  const waiting = frame.kind === 'shelf' || frame.kind === 'wrong';
  useEffect(() => {
    if (!waiting) return undefined;
    if (left <= 0) { if (frame.kind === 'shelf') play(timeOut(st)); return undefined; }
    const id = setTimeout(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearTimeout(id);
  }, [waiting, frame.kind, left, st, play]);

  // keys 1-4 belong to the shelf while the game is up (captured before the player's own 1-9 = choice keys)
  useEffect(() => {
    const onKey = (e) => {
      if (!/^[1-9]$/.test(e.key)) return;
      e.stopImmediatePropagation(); e.preventDefault();
      const round = ROUNDS[st.r];
      const slot = round ? keySlot(e.key, round.items.length) : null;
      if (slot != null) choose(slot);
    };
    addEventListener('keydown', onKey, true);
    return () => removeEventListener('keydown', onKey, true);
  }, [choose, st.r]);

  const round = ROUNDS[st.r];
  const stop = (e) => e.stopPropagation();

  if (frame.kind === 'end') {
    return (
      <div className="sg-root sg-end" onClick={stop}>
        <Bg id="shop-cart-full" />
        <div className="sg-card" role="status">
          <div className="sg-list-title">HER LIST · DONE</div>
          <ul className="sg-got">
            {['carrots', 'eggs', 'three'].map((id) => <li key={id}><Icon id={id} /></li>)}
            <li className="sg-you">you ♡</li>
          </ul>
          <div className="sg-line">{st.wrongs === 0 ? 'Every item. First try. You are perfect. ♡' : st.wrongs === 1 ? 'All done. Almost perfect. ♡' : 'All done. Next time, read my list.'}</div>
        </div>
        <Her emote={st.wrongs >= 2 ? 'pout' : 'hearts'} />
      </div>
    );
  }

  if (frame.kind === 'right') {
    const line = frame.round.id === 'eggs' && rolls ? frame.round.rightRolls : frame.round.right;
    return (
      <div className="sg-root sg-right" onClick={stop}>
        <Bg id={frame.round.close} />
        <div className="sg-say" role="status"><b>NANDA</b> {line}</div>
        <Her emote="heart" layers={['sparkle']} />
      </div>
    );
  }

  if (frame.kind === 'wrong') {
    const { mood } = frame;
    const split = !!mood.sweet && !frame.sweet;
    return (
      <div className={`sg-root sg-wrong${split ? ' sg-split' : ''}`} onClick={stop}>
        <Bg id={mood.bg ?? frame.round.bg} />
        {split && <div className="sg-shadow" aria-hidden="true" />}
        <div className="sg-say" role="status">
          {frame.aside && <span className="sg-aside">{frame.aside}</span>}
          <span><b>NANDA</b> {frame.sweet ? mood.sweet : mood.line}</span>
        </div>
        <Her emote={frame.sweet ? 'heart' : mood.face === 'pout' || mood.face === 'vein' ? 'pout' : null} scare={split ? 2 : 0}
          layers={frame.sweet ? ['sparkle'] : mood.layers} />
      </div>
    );
  }

  return (
    <div className="sg-root sg-shelf" onClick={stop} data-round={round.id}>
      <Bg id={round.bg} />
      <div className="sg-head">
        <div className="sg-aisle">{round.aisle}</div>
        <div className="sg-chip" aria-label={`Her list says: ${round.want}`}><small>HER LIST</small> {round.want} ♡</div>
        <div className={`sg-wait${left <= 4 ? ' low' : ''}`} role="timer" aria-label={`She is waiting. ${left} seconds.`}>
          She is waiting · <b>{left}</b>
        </div>
      </div>
      <div className="sg-shelf-row" role="group" aria-label="The shelf. Pick one.">
        {round.items.map((it, i) => (
          <button key={it.id} type="button" className="sg-item" data-item={it.id} onClick={(e) => { e.stopPropagation(); choose(i); }}
            aria-label={`${i + 1}: ${it.label}`}>
            <span className="sg-key">{i + 1}</span>
            <Icon id={it.id} />
            <span className="sg-label">{it.label}</span>
          </button>
        ))}
      </div>
      <div className="sg-handle" aria-hidden="true"><i /><i /><b /><b /></div>
      {st.wrongs > 0 && <Her emote={st.wrongs === 1 ? 'pout' : null} layers={moodOf(st.wrongs).layers} scare={Math.min(2, st.wrongs - 1)} />}
    </div>
  );
}
