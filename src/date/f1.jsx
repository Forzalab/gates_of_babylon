// f1 (pit4): x3's layout (wide ENTER ANYWAY over narrow NO THANKS, the yellow 18+ is the only yellow)
// + ONE surprise: Prof. Kerney has already graded the age gate in red pen ("B+ bold choice, see me after class").
// Design school: Atlus / Persona 5 "UI as character": tilted cut-out type, the dialog slams in, every
// transition is a performance (the ENTER wipe). The red pen is the only non-palette ink.
// &next=1 is the continue screen: a MATCH FEED of live gate pairs on the real simulator + real Shape.
import { useEffect, useState } from 'react';
import { Pair, Portrait, Bar, Neon, Heart, Corners, useLanded, useTick, LOGIC, STILL } from './main.jsx';
import { compat } from './compat.js';

const params = new URLSearchParams(location.search);
const CLEAN = params.has('clean'); // arbiter's overlap diff: the page without the red pen
const NEXT = `${location.pathname}?v=f1&next=1`;
const GATE = `${location.pathname}?v=f1`;

// P5-style exit: a tilted pink slash wipes the screen, then we navigate.
function useWipe() {
  const [go, set] = useState(null);
  useEffect(() => {
    if (!go) return;
    const t = setTimeout(() => { location.href = go; }, STILL ? 0 : 520);
    return () => clearTimeout(t);
  }, [go]);
  return [go, (href) => (e) => { e.preventDefault(); set(href); }];
}
const Wipe = ({ on }) => <div className={on ? 'wipe on' : 'wipe'} aria-hidden="true"><i /><i /></div>;

// The red pen. Hand-drawn paths only (no new font: the note is the page's own Yellowtail script, in ink).
function Grade({ on }) {
  if (CLEAN) return null;
  return (
    <div className={on ? 'pen on' : 'pen'} aria-label="Graded by Prof. Kerney: B plus. Bold choice, see me after class.">
      <svg className="pen-ring" viewBox="0 0 200 170" aria-hidden="true">
        <path pathLength="1" d="M112 14C58 6 14 40 16 88c2 44 44 72 94 68 50-4 80-38 76-78C182 38 146 12 96 16 80 18 66 24 58 30" />
        <text x="100" y="112" textAnchor="middle">B+</text>
      </svg>
      <p className="pen-note">bold choice.<br />see me after class.<span>&ndash; K.</span></p>
    </div>
  );
}
// The red tick on ENTER ANYWAY, in the gutter left of the button so it never covers the label.
const Tick = ({ on }) => (CLEAN ? null :
  <svg className={on ? 'tick on' : 'tick'} viewBox="0 0 60 50" aria-hidden="true"><path pathLength="1" d="M6 26l14 16C30 26 42 12 56 4" /></svg>);

export function F1() {
  const on = useLanded(1500);
  const [go, to] = useWipe();
  return (
    <div className="stage sf">
      <section className="modal mf" role="dialog" aria-modal="true" aria-labelledby="fh">
        <Corners />
        <div className="sign plate">
          <svg viewBox="-12 -12 24 24" className="nh l"><Heart className="heart tube" /></svg>
          <Neon word="Dejting" />
          <svg viewBox="-12 -12 24 24" className="nh r"><Heart className="heart tube" /></svg>
        </div>
        <a className="close" href={LOGIC} aria-label="Close (back to Logic)">&#10005;</a>
        <div className="cols">
          <div className="left">
            <Portrait />
            <Grade on={on} />
          </div>
          <div className="copy">
            <h1 id="fh" className="warn cut"><span className="w1">WARNING:</span>
              <small>THESE GATES ARE <em className="y">18+</em></small>
              <small className="n">... AND A FEW BITS NAUGHTY &#9825;</small></h1>
            <p className="plain">By entering, I confirm I am 18 or older and<br />I know what a truth table is.</p>
            <div className="btns stack">
              <div className="tickrow"><Tick on={on} />
                <a className="btn hot wide" href={NEXT} onClick={to(NEXT)}>&#9829; ENTER ANYWAY &#9829;</a></div>
              <a className="btn soft narrow" href={LOGIC}>NO THANKS</a>
            </div>
          </div>
        </div>
      </section>
      <Wipe on={!!go} />
    </div>
  );
}

// ---------- continue screen: MATCH FEED ----------
const FEED = [['OR', 'AND'], ['XOR', 'NAND'], ['AND', 'AND'], ['NOR', 'OR'], ['NAND', 'AND'], ['OR', 'XOR'],
  ['AND', 'NOT'], ['NOT', 'NOR'], ['XOR', 'OR'], ['NAND', 'NOT'], ['OR', 'OR'], ['NOR', 'XOR']];
const LINES = {
  100: 'soulmates. same truth table.', 75: 'agree 3 rows out of 4', 50: 'it’s complicated', 25: 'only agree on one row', 0: 'literally opposites (hot)',
};

function Card({ A, B, row, i, liked, onLike }) {
  const pct = Math.round(compat(A, B) * 100);
  return (
    <article className={liked ? 'card liked' : 'card'} style={{ '--i': i }}>
      <div className="tube"><Pair A={A} B={B} row={row} /></div>
      <header><b>{A} <span>&#9829;</span> {B}</b><em>{pct}%</em>
        <button className="like" onClick={onLike} aria-pressed={liked} aria-label={liked ? 'Unmatch' : 'Swipe right'}>{liked ? '♥' : '♡'}</button></header>
      <div className="meter" role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${A} and ${B} compatibility`}>
        <i style={{ width: `${Math.max(pct, 4)}%` }} /></div>
      <p>{LINES[pct]}</p>
      {liked && <strong className="stamp">IT&rsquo;S A MATCH!<small>please take a number: A-{118 + i}</small></strong>}
    </article>
  );
}

export function Feed() {
  const t = useTick(900);
  const serving = 42 + Math.floor(t / 3) % 70;
  const [liked, setLiked] = useState(() => new Set(STILL ? [2] : []));
  const [go, to] = useWipe();
  const toggle = (i) => () => setLiked((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  return (
    <>
      <Bar />
      <div className="feedbar">
        <h1 className="warn cut"><span className="w1">MATCH FEED</span><small>LIVE GATES NEAR YOU &middot; {liked.size} MATCHED</small></h1>
        {/* the mundane lens (M2, the DMV): dating a gate means taking a number */}
        <div className="ticket" role="status" aria-live="off">
          <div><small>NOW SERVING</small><b>A-{String(serving).padStart(3, '0')}</b></div>
          <div><small>YOUR NUMBER</small><b className="mine">A-117</b></div>
          <div><small>EST. WAIT</small><b>{117 - serving} clock cycles</b></div>
          {!CLEAN && <p className="feed-pen" aria-label="Prof. Kerney: still B+. show your truth tables.">still B+. show your truth tables. <span>&ndash; K.</span></p>}
        </div>
        <nav className="feednav">
          <a className="btn soft narrow" href={GATE} onClick={to(GATE)}>&#9664; BACK TO GATE</a>
          <a className="btn hot" href={LOGIC}>LOGIC MODE</a>
        </nav>
      </div>
      <main className="feed">
        {FEED.map(([A, B], i) => <Card key={i} i={i} A={A} B={B} row={t + i} liked={liked.has(i)} onLike={toggle(i)} />)}
      </main>
      <Wipe on={!!go} />
    </>
  );
}
