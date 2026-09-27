// f2 (pit4): the mockup-faithful minimum. Layout = Tony's c20f7340: neon plate over the panel, a gate mascot left,
// copy right, the AND/OR/XOR : ENTER row, the parental-controls foot. The ONE surprise: the class group chat, drawn
// as the fake site's own "LIVE CHAT" tile (navy strip, count badge, grid slot col 4 x rows 2-3), so it ships with the page.
// &next=1 is what ENTER leads to: a swipe deck of our gates, compat % = truth-table rows that agree (real sim).
// Juice (Sakurai / Nijman / Swink): every press answers at once (squash), hit-stop before a commit, one small shake on
// a match, overshoot on arrivals. Reduced motion or &still=1 = the landed stills, no motion at all.
import { useEffect, useRef, useState } from 'react';
import { Shape, GATE_GEOM } from '../nodes/index.jsx';
import { gateTT, agree, gateCompat, ROWS } from './compat.js';
import { play, isMuted, setMuted } from './sfx.js';
import './f2.css';

const q = new URLSearchParams(location.search);
const STILL = q.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const CLEAN = q.get('clean') === '1'; // measurement only: hide the surprise so Pillow can diff chrome against the mockup
const NEXT = q.get('next') === '1';
const YOU = ['AND', 'OR', 'XOR'].includes(q.get('you')) ? q.get('you') : 'AND';
const LOGIC = import.meta.env.BASE_URL;
const pct = (x) => `${Math.round(x * 100)}%`;
const href = (p) => `?${new URLSearchParams({ v: 'f2', ...p })}`;
const wait = (ms) => new Promise((r) => setTimeout(r, STILL ? 0 : ms));

const H = 'M12 21 2.6 11.8A5.6 5.6 0 0 1 12 4.3a5.6 5.6 0 0 1 9.4 7.5Z';
export const Heart = ({ className = '', hollow }) => <svg className={`hz ${className}`} viewBox="0 0 24 22" aria-hidden="true">
  <path d={H} fill={hollow ? 'none' : 'currentColor'} stroke={hollow ? 'currentColor' : 'none'} strokeWidth="2.4" /></svg>;

// Heart burst: 10 hearts fly out from a point. Pure juice; skipped entirely when still.
function burst(x, y, n = 10) {
  if (STILL) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i');
    s.className = 'f2-spark';
    const a = (i / n) * Math.PI * 2 + Math.random() * .5, d = 60 + Math.random() * 70;
    s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 30}px;--r:${(Math.random() - .5) * 90}deg`;
    s.innerHTML = `<svg viewBox="0 0 24 22"><path d="${H}" fill="currentColor"/></svg>`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 750);
  }
}

// ---------- the mascot: one of our gates (real Shape, lit by its own truth table row 11) with a face ----------
export function Mascot({ type, face = 'wink', bubble = true }) {
  const g = GATE_GEOM[type];
  const cx = ((Array.isArray(g.in[0]) ? g.in[0][0] : g.in[0]) + g.out[0]) / 2 - 4, cy = g.h / 2;
  const tt = gateTT(type);
  const lit = { in: Array.isArray(g.in[0]) ? g.in.map(() => true) : [true], out: tt[3] };
  return (
    <svg className="mascot" viewBox={`-26 -30 ${g.w + 64} ${g.h + 52}`} aria-label={`${type} gate, ${face === 'wink' ? 'winking' : 'blushing'}`}>
      {(Array.isArray(g.in[0]) ? g.in : [g.in]).map(([x, y], i) => <line key={i} className="mw" x1={-22} x2={x - 12} y1={y} y2={y} />)}
      <line className="mw" x1={g.out[0] + (g.bubble ? 0 : 12)} x2={g.w + 22} y1={g.out[1]} y2={g.out[1]} />
      <Shape g={g} on={tt[3]} lit={lit} />
      <g className="face">
        <ellipse className="blush" cx={cx - 21} cy={cy + 11} rx="8" ry="4.2" />
        <ellipse className="blush" cx={cx + 19} cy={cy + 11} rx="8" ry="4.2" />
        <ellipse className="eye" cx={cx - 11} cy={cy - 5} rx="3.8" ry="5.6" /><circle className="glint" cx={cx - 9.8} cy={cy - 7.6} r="1.5" />
        {face === 'wink'
          ? <path className="lid" d={`M${cx + 5} ${cy - 4}q6 -7 12 0`} />
          : <><ellipse className="eye" cx={cx + 11} cy={cy - 5} rx="3.8" ry="5.6" /><circle className="glint" cx={cx + 12.2} cy={cy - 7.6} r="1.5" /></>}
        <path className="mouth" d={face === 'sad' ? `M${cx - 6} ${cy + 12}q6 -6 12 0` : `M${cx - 6} ${cy + 7}q6 7 12 0`} />
      </g>
      {bubble && <g transform={`translate(${g.w + 8} -12)`}>
        <path className="bub" d="M0 -16C12 -16 20 -9 20 0S12 16 0 16c-2.6 0-5-.4-7-1.2L-17 19l3-8C-17.6 7.6-20 4-20 0-20-9-12-16 0-16Z" />
        <path className="bheart" transform="translate(-9 -8.5) scale(.75)" d={H} />
      </g>}
    </svg>
  );
}

// ---------- the neon plate: "Dejting" as one pink tube; j and g hang past the plate's bottom rule ----------
export function Sign() {
  return (
    <div className="f2-sign" aria-label="Dejting">
      <Heart className="tube l" hollow /><span className="f2-neon" aria-hidden="true">Dejting</span><Heart className="tube r" hollow />
    </div>
  );
}

// ---------- the surprise: the site's own LIVE CHAT tile, where the class has found the page ----------
const GATE_CHAT = [
  ['jay', 'wait is THIS the assignment??'],
  ['priya', `${pct(gateCompat('XOR', 'AND'))} with XOR. still beats my lab partner`],
  ['mo', 'is this a captcha? select all squares with a NAND gate'],
  ['Prof. Kerney', 'I can see who is online.', true],
];
const AV = { jay: 'var(--f2-blue)', mo: 'var(--f2-lilac-2)', priya: 'var(--hot-2)', 'Prof. Kerney': 'var(--navy)' };
export function Chat({ script, typing = 'Prof. Kerney', extra = [] }) {
  const [n, setN] = useState(STILL ? script.length : 0);
  useEffect(() => {
    if (n >= script.length) return;
    const t = setTimeout(() => { setN(n + 1); play('chat', { gap: 0 }); }, n === 0 ? 350 : 420);
    return () => clearTimeout(t);
  }, [n, script.length]);
  const msgs = [...script.slice(0, n), ...extra].slice(-6);
  return (
    <aside className="f2-chat" aria-label="Class group chat" aria-live="polite">
      <header><span className="dot" />LIVE CHAT <b>#csci-26</b></header>
      <ol>{msgs.map(([who, msg, prof], i) => (
        <li key={`${i}-${msgs.length}-${who}`} className={prof ? 'prof' : ''}>
          <i className="av" style={{ background: AV[who] }}>{who === 'Prof. Kerney' ? 'K' : who[0].toUpperCase()}</i>
          <div><span className="who">{who}{prof && <em>PROF</em>}</span><p>{msg}</p></div>
        </li>))}</ol>
      <p className="typing">{typing} is typing<span>...</span></p>
      <span className="badge" key={n + extra.length}>{34 + n + extra.length} online</span>
    </aside>
  );
}

// ---------- the gate ----------
const ORDER = ['AND', 'OR', 'XOR'];
function Gate() {
  const [you, setYou] = useState('AND');
  const c = gateCompat('XOR', you);
  const go = async (e, g) => {
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.classList.add('hit'); play('confirm');
    burst(r.left + r.width / 2, r.top + r.height / 2, 12);
    await wait(260);
    location.search = href({ next: '1', you: g });
  };
  return (
    <div className="f2-stage">
      <Sign />
      <section className="f2-modal" role="dialog" aria-modal="true" aria-labelledby="f2h">
        <i className="cn tl" /><i className="cn tr" /><i className="cn bl" /><i className="cn br" />
        <Heart className="corner-h l" /><Heart className="corner-h r" />
        <div className="f2-cols">
          <div className="f2-portrait"><Mascot type="XOR" /><Heart className="ph a" /><Heart className="ph b" /><Heart className="ph c" /></div>
          <div className="f2-copy">
            <h1 id="f2h" className="f2-warn">WARNING:<small>THESE GATES ARE 18+</small></h1>
            <p className="f2-fine">THIS SITE CONTAINS LOGIC GATES<br />THAT DATE!</p>
            <p className="f2-fine">BY ENTERING, I CONFIRM I AM 18 OR OLDER<br />AND THAT I KNOW WHAT A TRUTH TABLE IS...</p>
            <p className="f2-fine bits">...AND OTHER BITS. <Heart /></p>
            <div className="f2-meter" title="truth-table rows where XOR and you output the same bit">
              <span>XOR &amp; you ({you}): <b key={you}>{pct(c)}</b> compatible</span><i style={{ width: pct(c) }} />
            </div>
          </div>
        </div>
        <div className="f2-btns">
          {ORDER.map((g, i) => (
            <a key={g} className={i === 0 ? 'f2-btn hot' : 'f2-btn soft'} href={href({ next: '1', you: g })}
              onMouseEnter={() => { setYou(g); play('hover', { vol: .25 }); }} onFocus={() => setYou(g)} onClick={(e) => go(e, g)}>
              <Heart /> {g} : ENTER <Heart /></a>))}
        </div>
        <p className="f2-foot"><Heart /> IF YOU HAVE CHILDREN, USE PARENTAL CONTROLS (<a href={LOGIC}>NOT GATE</a>). <Heart /></p>
      </section>
    </div>
  );
}

// ---------- &next=1: swipe on gates ----------
const DECK = ['NAND', 'OR', 'XOR', 'NOR', 'NOT', 'AND'];
const BIO = {
  AND: 'Only says 1 if we BOTH show up. Commitment.',
  OR: 'Low standards, high availability. Either of you is fine.',
  NOT: 'One input. Will contradict everything you say.',
  NAND: 'Universal. I can be anything you want me to be.',
  NOR: 'Also universal. Says no to everything, equally.',
  XOR: 'Into you, but only if you are not into me.',
};
const NEXT_CHAT = [
  ['jay', 'they let you IN??'],
  ['mo', 'swipe left on NOT. trust me'],
  ['Prof. Kerney', 'Swiping is not a valid proof.', true],
];

function Card({ type, you, drag, style, onPointerDown, top }) {
  const tt = gateTT(type), mine = gateTT(you), ok = agree(type, you), c = gateCompat(type, you);
  return (
    <article className={`f2-card${top ? ' top' : ''}`} style={style} onPointerDown={onPointerDown} aria-label={`${type}, ${pct(c)} compatible`}>
      <div className="win"><Mascot type={type} face={c >= .5 ? 'wink' : 'shy'} bubble={false} />
        <span className="stamp like" style={{ opacity: Math.max(0, drag / 120) }}>LIKE</span>
        <span className="stamp nope" style={{ opacity: Math.max(0, -drag / 120) }}>NOPE</span>
      </div>
      <h2>{type} <span>{type === 'NOT' ? 1 : 2} {type === 'NOT' ? 'input' : 'inputs'} &middot; 0 km away</span></h2>
      <p className="bio">{BIO[type]}</p>
      <table className="tt">
        <thead><tr><th>a</th><th>b</th><th>{type}</th><th>you ({you})</th><th /></tr></thead>
        <tbody>{ROWS.map(([a, b], i) => (
          <tr key={i} className={ok[i] ? 'agree' : ''}>
            <td>{+a}</td><td>{type === 'NOT' ? '·' : +b}</td><td>{+tt[i]}</td><td>{+mine[i]}</td>
            <td><Heart hollow={!ok[i]} /></td></tr>))}</tbody>
      </table>
      <div className="f2-meter"><span>{type} &amp; you ({you}): <b>{pct(c)}</b> compatible</span><i style={{ width: pct(c) }} /></div>
    </article>
  );
}

function Swipe() {
  const [i, setI] = useState(0);
  const [drag, setDrag] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | hit | out
  const [dir, setDir] = useState(0);
  const [result, setResult] = useState(null);
  const [extra, setExtra] = useState([]);
  const [shake, setShake] = useState(0);
  const [matches, setMatches] = useState(0);
  const streak = useRef(0);
  const [filed, setFiled] = useState(null);
  const start = useRef(null);
  const type = DECK[i % DECK.length], done = i >= DECK.length;

  const commit = async (d) => {
    if (phase !== 'idle' || done || result) return;
    const them = type, c = gateCompat(them, YOU);
    const match = d > 0 && c >= .5;
    streak.current = match ? streak.current + 1 : d > 0 ? 0 : streak.current;
    if (d < 0) play('slide');
    else if (match) play('pluck', { rate: 1 + .08 * (streak.current - 1) }); // pitch-up per match streak
    else { play('error'); setTimeout(() => play('hurt', { vol: .35 }), 110); } // HURT: swiped right on a bad table
    setDir(d); setPhase('hit');        // hit-stop: the card freezes with a flash for 90 ms, then leaves
    await wait(90);
    setPhase('out');
    await wait(280);
    setPhase('idle'); setDrag(0); setI((k) => k + 1);
    if (d > 0) {
      setResult({ them, c, match });
      if (match) { play(streak.current > 1 ? 'streak' : 'match', { rate: streak.current > 1 ? 1 + .08 * streak.current : 1 }); setMatches((m) => m + 1); setShake((s) => s + 1); burst(innerWidth / 2, innerHeight / 2, 16); }
      setExtra((x) => [...x, match
        ? ['priya', `${YOU} x ${them} at ${pct(c)}?? we love a ${pct(c)} love story`]
        : ['jay', `bro swiped right on ${them}. ${Math.round(c * 4)}/4 rows. rip`]]);
    }
  };
  // M1 (tax filing): a match has to pick a filing status. Tick first (instant feedback), then the chat reacts.
  const file = async (e, kind) => {
    if (filed) return;
    const r = e.currentTarget.getBoundingClientRect();
    setFiled(kind); play('click'); burst(r.left + 30, r.top + r.height / 2, 8);
    await wait(420);
    setResult(null); setFiled(null);
    setExtra((x) => [...x, kind === 'jointly'
      ? ['Prof. Kerney', 'Jointly = both of you must sign. That is an AND gate.', true]
      : ['jay', 'filing singly on the first date. respect']]);
  };
  useEffect(() => {
    const k = (e) => { if (e.key === 'ArrowRight') commit(1); if (e.key === 'ArrowLeft') commit(-1); if (e.key === 'Escape') setResult(null); };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  });
  const down = (e) => {
    if (phase !== 'idle') return;
    const el = e.currentTarget;
    start.current = e.clientX; el.setPointerCapture(e.pointerId);
    const mv = (ev) => setDrag(ev.clientX - start.current);
    const up = (ev) => {
      el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
      const dx = ev.clientX - start.current;
      if (Math.abs(dx) > 110) commit(Math.sign(dx)); else setDrag(0);
    };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  };
  const tf = phase === 'out' ? `translateX(${dir * 140}vw) rotate(${dir * 30}deg)`
    : phase === 'hit' ? `translateX(${drag || dir * 40}px) rotate(${(drag || dir * 40) / 18}deg) scale(1.05)`
      : `translateX(${drag}px) rotate(${drag / 18}deg)`;
  const shownDrag = phase === 'idle' ? drag : dir * 140;

  return (
    <div className="f2-stage next">
      <Sign />
      <div className={`f2-deck${shake ? ' shook' : ''}`} key={`s${shake}`}>
        <p className="f2-you">YOU ARE <b>{YOU}</b>. SWIPE ON GATES
          <small><Heart /> MATCHES {matches}/{DECK.length} &middot; REFUND $0 &middot; drag the card, or &larr; / &rarr;</small></p>
        <div className="pile">
          {!done && i + 1 < DECK.length && <Card type={DECK[i + 1]} you={YOU} drag={0} />}
          {!done ? <Card key={i} top type={type} you={YOU} drag={shownDrag} onPointerDown={down}
            style={{ transform: tf, transition: phase === 'out' ? 'transform .28s cubic-bezier(.5,0,.9,.4)' : drag && phase === 'idle' ? 'none' : undefined }} />
            : <div className="f2-card empty"><h2>THAT'S EVERY GATE.</h2><p className="bio">There are only six. You swiped on the whole standard library.</p>
              <a className="f2-btn hot" href={href({ next: '1', you: YOU })}><Heart /> AGAIN <Heart /></a></div>}
        </div>
        <div className="f2-btns two">
          <button className="f2-btn soft" onClick={() => commit(-1)} disabled={done}>&#10005; NOPE</button>
          <button className="f2-btn hot" onClick={() => commit(1)} disabled={done}><Heart /> LIKE</button>
        </div>
        <p className="f2-foot"><a href={href({})}>&larr; BACK TO THE GATE</a> <Heart /> <a href={LOGIC}>LOGIC MODE</a></p>
      </div>
      {result && (
        <div className="f2-result" role="dialog" aria-modal="true" aria-labelledby="f2r">
          <section className={`f2-modal small${result.match ? ' match' : ''}`}>
            <i className="cn tl" /><i className="cn tr" /><i className="cn bl" /><i className="cn br" />
            <h1 id="f2r" className="f2-warn">{result.match ? "IT'S A MATCH!" : 'LEFT ON READ'}</h1>
            <div className="duo"><Mascot type={YOU} face="wink" bubble={false} /><Heart className="mid" hollow={!result.match} /><Mascot type={result.them} face={result.match ? 'wink' : 'sad'} bubble={false} /></div>
            <p className="f2-fine">{result.match
              ? `YOU (${YOU}) AND ${result.them} AGREE ON ${Math.round(result.c * 4)} OF 4 ROWS.`
              : `${result.them} CHECKED YOUR TRUTH TABLE: ${Math.round(result.c * 4)} OF 4 ROWS. OUCH.`}</p>
            {result.match ? (
              <div className="f2-file" role="group" aria-label="Filing status">
                <span className="tab">FILING STATUS: CHOOSE 1</span>
                {[['jointly', 'FILE JOINTLY', 'AND: we both sign'], ['singly', 'FILE SINGLY', 'OR: either of us will do']].map(([k, t, sub], n) => (
                  <button key={k} className={filed === k ? 'on' : ''} autoFocus={n === 0} onClick={(e) => file(e, k)}>
                    <i className="box">{filed === k && <svg viewBox="0 0 20 20"><path d="M3 10l5 5L18 3" /></svg>}</i>{t} <small>({sub})</small></button>))}
              </div>
            ) : (
              <div className="f2-btns two">
                <button className="f2-btn hot" autoFocus onClick={() => setResult(null)}><Heart /> KEEP SWIPING</button>
                <a className="f2-btn soft" href={LOGIC}>FILE SINGLY IN LOGIC</a>
              </div>
            )}
          </section>
        </div>
      )}
      {!CLEAN && <ChatSlot><Chat script={NEXT_CHAT} typing="priya" extra={extra} /></ChatSlot>}
    </div>
  );
}

// The chat sits in the tile grid's own slot (col 4, rows 2-3), measured from the live grid so it never drifts.
function ChatSlot({ children }) {
  const [box, setBox] = useState(null);
  useEffect(() => {
    const f = () => {
      const t = document.querySelectorAll('.grid .tile');
      if (t.length < 12) return;
      const a = t[7].getBoundingClientRect(), b = t[11].getBoundingClientRect();
      setBox({ left: a.left, top: a.top, width: a.width, height: b.bottom - a.top });
    };
    f(); addEventListener('resize', f); return () => removeEventListener('resize', f);
  }, []);
  return box && <div className="f2-slot" style={box}>{children}</div>;
}

function Mute() {
  const [m, setM] = useState(isMuted());
  return (
    <button className="f2-mute" aria-pressed={m} title={m ? 'Sound off' : 'Sound on'} onClick={() => { setMuted(!m); setM(!m); if (m) play('click'); }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z" />
        {m ? <path className="x" d="M16 9l5 6M21 9l-5 6" /> : <path className="x" d="M16 8.5q3 3.5 0 7M18.5 6q5.5 6 0 12" />}</svg>
      {m ? 'SOUND OFF' : 'SOUND ON'}
    </button>
  );
}

export default function F2({ Bar, Grid }) {
  return (
    <div className={`date f2 ${NEXT ? 'is-next' : 'is-gate'}${STILL ? ' still' : ''}`}>
      <Bar><Mute /></Bar>
      <Grid />
      <div className="veil" />
      {NEXT ? <Swipe /> : <><Gate />{!CLEAN && <ChatSlot><Chat script={GATE_CHAT} /></ChatSlot>}</>}
    </div>
  );
}
