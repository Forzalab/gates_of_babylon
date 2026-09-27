// g3 (pit4 run 2, from f1): the same gate + Kerney red pen, with the r1 fix list applied, restyled through
// S6 arcade attract mode: the neon plate is the cabinet marquee, ENTER ANYWAY blinks like PRESS START,
// and the continue screen is a HIGH SCORE table with a CREDIT/1UP HUD.
// ONE surprise on the gate: Prof. Kerney graded the age gate (B+ ring). Her note is on a lilac sticky
// note, the M12 lens (the thing everybody sticks to a monitor), not a new gag: same words, same pen.
import { useEffect, useState } from 'react';
import { Pair, Portrait, Bar, Neon, Heart, Corners, useLanded, useTick, LOGIC, STILL } from './main.jsx';
import { compat, pairRow } from './compat.js';
import { play, then } from './sfx.js';
import { useWipe, Mute, Wipe, hover } from './f1.jsx';

const params = new URLSearchParams(location.search);
const CLEAN = params.has('clean');
const NEXT = `${location.pathname}?v=g3&next=1`;
const GATE = `${location.pathname}?v=g3`;
const refuse = (e) => { e.preventDefault(); play('error'); setTimeout(() => { location.href = LOGIC; }, STILL ? 0 : 380); };

function Grade({ on }) {
  return (
    <div className={CLEAN ? 'pen3 clean' : on ? 'pen3 on' : 'pen3'} aria-label="Graded by Prof. Kerney: B plus. Bold choice, see me after class.">
      <svg className="ring" viewBox="0 0 200 170" aria-hidden="true">
        <path pathLength="1" d="M112 14C58 6 14 40 16 88c2 44 44 72 94 68 50-4 80-38 76-78C182 38 146 12 96 16 80 18 66 24 58 30" />
        <text x="100" y="112" textAnchor="middle">B+</text>
      </svg>
      <p className="sticky">bold choice.<br />see me after class.<span>&ndash; K.</span></p>
    </div>
  );
}
const Tick = ({ on }) => (
  <svg className={CLEAN ? 'tick clean' : on ? 'tick on' : 'tick'} viewBox="0 0 60 50" aria-hidden="true"><path pathLength="1" d="M6 26l14 16C30 26 42 12 56 4" /></svg>);

export function G3() {
  const on = useLanded(1500);
  const [go, to] = useWipe();
  useEffect(() => { play('glitch', { vol: 0.3 }); }, []);
  useEffect(() => { if (on && !CLEAN) { play('grade', { vol: 0.35 }); play('boom', { vol: 0.3 }); } }, [on]); // vine boom: sound only, fine under reduced motion
  const enter = (e) => { then('confirm', 'chips', 260); to(NEXT)(e); };
  return (
    <div className="stage sf s3g">
      <Mute />
      <section className="modal mf mg" role="dialog" aria-modal="true" aria-labelledby="gh">
        <Corners />
        <div className="sign plate">
          <svg viewBox="-12 -12 24 24" className="nh l"><Heart className="heart tube" /></svg>
          <Neon word="Dejting" />
          <svg viewBox="-12 -12 24 24" className="nh r"><Heart className="heart tube" /></svg>
        </div>
        <a className="close" href={LOGIC} onClick={refuse} aria-label="Close (back to Logic)">&#10005;</a>
        <div className="cols">
          <div className="left"><Portrait /><Grade on={on} /></div>
          <div className="copy">
            <h1 id="gh" className="warn cut"><span className="w1">WARNING:</span>
              <small>THESE GATES ARE <em className="y">18+</em></small>
              <small className="n">... AND A FEW BITS NAUGHTY &#9825;</small></h1>
            <p className="plain">By entering, I confirm I am 18 or older and<br />I know what a truth table is.</p>
            <div className="compat" role="meter" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
              <i style={{ width: '25%' }} /><span>XOR &amp; you (AND): 25% compatible</span></div>
            <div className="btns stack">
              <div className="tickrow"><Tick on={on} />
                <a className="btn hot wide start" href={NEXT} onClick={enter} onPointerEnter={hover}>&#9829; ENTER ANYWAY &#9829;</a></div>
              <a className="btn soft narrow" href={LOGIC} onClick={refuse} onPointerEnter={hover}>NO THANKS</a>
            </div>
          </div>
        </div>
        <p className="foot"><Heart3 /> IF YOU HAVE CHILDREN, USE PARENTAL CONTROLS (NOT GATE). <Heart3 /></p>
      </section>
      <Wipe on={!!go} />
    </div>
  );
}
const Heart3 = () => <svg viewBox="-12 -12 24 24" className="fh" aria-hidden="true"><Heart /></svg>;

// ---------- continue screen: HIGH SCORE attract mode ----------
const FEED = [['AND', 'AND'], ['OR', 'AND'], ['XOR', 'NAND'], ['NOR', 'OR'], ['NAND', 'AND'], ['OR', 'OR'], ['AND', 'NOT'], ['XOR', 'OR']];
const LINES = { 100: 'same truth table. soulmates.', 75: 'agree on 3 of 4 rows', 50: 'it’s complicated', 25: 'agree on 1 row. once.', 0: 'total opposites (hot)' };
const INIT = ['ANN', 'ORA', 'XOX', 'NOR', 'NAN', 'ORR', 'ADA', 'XIO'];

function Table({ A, B }) {
  return (
    <table className="tt"><thead><tr><th>a</th><th>b</th><th>{A}</th><th>{B}</th><th /></tr></thead>
      <tbody>{[0, 1, 2, 3].map((k) => { const r = pairRow(A, B, k); const ok = r.A === r.B; return (
        <tr key={k} className={ok ? 'ok' : ''}><td>{+r.a}</td><td>{+r.b}</td><td>{+r.A}</td><td>{+r.B}</td><td>{ok ? '♥' : '·'}</td></tr>); })}</tbody></table>
  );
}

function Card({ A, B, row, i, liked, onLike }) {
  const pct = Math.round(compat(A, B) * 100);
  return (
    <article className={liked ? 'card g liked' : 'card g'} style={{ '--i': i }}>
      <div className="tube">{liked ? <Table A={A} B={B} /> : <Pair A={A} B={B} row={row} />}</div>
      <header><b>{A} <span>&#9829;</span> {B}</b><em>{pct}%</em>
        <button className="like" onClick={onLike} aria-pressed={liked} aria-label={liked ? 'Unmatch' : 'Swipe right'}>{liked ? '♥' : '♡'}</button></header>
      <div className="meter" role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${A} and ${B} compatibility`}>
        <i style={{ width: `${Math.max(pct, 4)}%` }} /></div>
      <p>{LINES[pct]}</p>
    </article>
  );
}

function Scores({ liked }) {
  const rows = FEED.map(([A, B], i) => ({ A, B, i, pct: Math.round(compat(A, B) * 100) }))
    .sort((a, b) => b.pct - a.pct || a.i - b.i).slice(0, 4);
  return (
    <section className="scores" aria-label="High scores">
      <h2>HIGH SCORES</h2>
      <ol>
        {rows.map((r, k) => (
          <li key={r.i} className={liked.has(r.i) ? 'you' : ''}><b>{['1ST', '2ND', '3RD', '4TH'][k]}</b>
            <span>{r.A} &#9829; {r.B}</span><em>{String(r.pct).padStart(3, '0')}%</em><i>{liked.has(r.i) ? 'YOU' : INIT[r.i]}</i></li>))}
        {!CLEAN && <li className="kerney"><b>5TH</b><span>the age gate</span><em>B+</em><i>&ndash; K.</i></li>}
      </ol>
    </section>
  );
}

export function Feed3() {
  const t = useTick(900);
  const [liked, setLiked] = useState(() => new Set(STILL ? [1] : []));
  const [big, setBig] = useState(null); // the IT'S A MATCH moment
  const [go, to] = useWipe();
  useEffect(() => { if (big === null || STILL) return; const k = setTimeout(() => setBig(null), 2200); return () => clearTimeout(k); }, [big]);
  const toggle = (i) => () => {
    const n = new Set(liked);
    if (n.has(i)) { n.delete(i); play('click'); } else {
      n.add(i); play('match', { rate: 1 + 0.08 * (n.size - 1) });
      const [A, B] = FEED[i]; if (compat(A, B) >= 0.75) setBig(i);
    }
    setLiked(n);
  };
  const best = Math.max(0, ...[...liked].map((i) => Math.round(compat(...FEED[i]) * 100)));
  return (
    <>
      <Bar />
      <Mute />
      <div className="feedbar g3bar">
        <h1 className="warn cut"><span className="w1">MATCH FEED</span><small>LIVE GATES NEAR YOU &middot; {liked.size} MATCHED</small></h1>
        <div className="hud" role="status" aria-live="off">
          <div><small>1UP</small><b>{String(liked.size * 1000).padStart(5, '0')}</b></div>
          <div><small>HI-SCORE</small><b>{String(best).padStart(3, '0')}%</b></div>
          <div><small>CREDIT</small><b>01</b></div>
          <p className={t % 2 ? 'blink off' : 'blink'}>PRESS &#9825; TO MATCH</p>
        </div>
        <nav className="feednav">
          <a className="btn soft narrow" href={GATE} onClick={(e) => { play('click'); to(GATE)(e); }} onPointerEnter={hover}>&#9664; BACK TO GATE</a>
          <a className="btn hot" href={LOGIC} onPointerEnter={hover}>LOGIC MODE</a>
        </nav>
      </div>
      <main className="feed g3feed">
        {FEED.map(([A, B], i) => <Card key={i} i={i} A={A} B={B} row={t + i} liked={liked.has(i)} onLike={toggle(i)} />)}
        <Scores liked={liked} />
      </main>
      {big !== null && (
        <div className="bigmatch" role="alert" onClick={() => setBig(null)}>
          <div className="modal mbm"><Corners />
            <strong>IT&rsquo;S A MATCH!!</strong>
            <p>NEW HIGH SCORE &middot; {FEED[big][0]} &#9829; {FEED[big][1]} &middot; {Math.round(compat(...FEED[big]) * 100)}%</p>
            <Table A={FEED[big][0]} B={FEED[big][1]} />
            <button className="btn hot" onClick={() => setBig(null)}>&#9829; CONTINUE? &#9829;</button>
          </div>
        </div>)}
      <Wipe on={!!go} />
    </>
  );
}
