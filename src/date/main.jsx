// Date mode gate (Builder Y): date.html?v=y1 | y2 | y3. A parody adult-site age gate where every "face" is one of our
// own gates: the grid tiles are live two-gate circuits (sim.evaluate), the portrait is a big Shape with hand-built SVG
// blush / wink / heart. One classroom-meta surprise per variant: y1 red pen, y2 Web 1.0 popups, y3 class group chat.
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { Shape, GATE_GEOM } from '../nodes/index.jsx';
import { evaluate } from '../sim.js';
import { compat, pairCircuit } from './compat.js';
// Self-hosted webfonts (SIL OFL 1.1 via @fontsource; Yellowtail is Apache 2.0): no third-party font requests.
import '@fontsource/bangers';
import '@fontsource/yellowtail';
import '@fontsource/archivo-black';
import '@fontsource/arimo/400.css';
import '@fontsource/arimo/700.css';
import '@fontsource/caveat/600.css';
import '@fontsource/caveat/700.css';
import '@fontsource/vt323';
import './date.css';

const q = new URLSearchParams(location.search);
const V = ['y1', 'y2', 'y3'].includes(q.get('v')) ? q.get('v') : 'y1';
const ENTERED = q.get('entered') === '1';
const CLEAN = q.get('clean') === '1'; // measurement only: hide the surprise so Pillow can compare chrome with the mockup
const HOME = import.meta.env.BASE_URL; // "I'm not 18" -> Logic mode (the 4th-wall joke)
const REDUCE = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const pct = (x) => `${Math.round(x * 100)}%`;
const fmt = (n) => n.toLocaleString('en-US');

// ---------- the "you" in compat: y1 has no portrait, so you are compared with a plain AND ----------
const DATE = { y1: ['AND'], y2: ['OR'], y3: ['XOR'] }[V];

// ---------- tiles: 12 live mini circuits (a pair of gates), badge = compat x a fake count ----------
const TILES = [
  { pair: ['AND', 'OR'], a: 1, b: 1, base: 608301 }, { pair: ['NOT', 'NAND'], a: 1, b: 1, base: 362268 },
  { pair: ['OR', 'AND'], a: 1, b: 0, base: 311918 }, { pair: ['XOR', 'NOR'], a: 1, b: 0, base: 608301 },
  { pair: ['OR', 'NAND'], a: 0, b: 1, base: 241512 }, { pair: ['NAND', 'NOT'], a: 1, b: 1, base: 362268 },
  { pair: ['NOR', 'XOR'], a: 0, b: 1, base: 207945 }, { pair: ['AND', 'NOR'], a: 0, b: 0, base: 241512 },
  { pair: ['XOR', 'OR'], a: 1, b: 0, base: 362268 }, { pair: ['OR', 'NOT'], a: 0, b: 0, base: 311918 },
  { pair: ['NAND', 'AND'], a: 1, b: 0, base: 241512 }, { pair: ['AND', 'NAND'], a: 1, b: 1, base: 362268 },
];

// A gate drawn with the real Shape. `lit` comes from the sim, so an ON gate glows exactly as it does in Logic.
function Gate({ type, lit, idle, className = '' }) {
  const g = GATE_GEOM[type];
  return <span className={`dg ${className}`} style={{ aspectRatio: `${g.w} / ${g.h}` }}>
    <Shape g={g} idle={idle} on={lit?.out} lit={lit} />
  </span>;
}

function Mini({ pair, a, b }) {
  const out = evaluate(pairCircuit(pair, !!a, !!b));
  const g1 = { in: [!!a, !!b], out: out.g1 };
  const g2 = pair[1] && { in: [out.g1, pair[1] === 'NOT' ? false : !!b], out: out.g2 };
  return <div className="mini" aria-hidden="true">
    <i className={`mw w-a ${a ? 'on' : ''}`} /><i className={`mw w-b ${b ? 'on' : ''}`} />
    <Gate type={pair[0]} lit={g1} className="g-first" />
    <i className={`mw w-mid ${out.g1 ? 'on' : ''}`} />
    {pair[1] && <Gate type={pair[1]} lit={g2} className="g-second" />}
    <i className={`mw w-out ${out.L ? 'on' : ''}`} />
  </div>;
}

function Tile({ t, i, hearts }) {
  const c = compat(t.pair, DATE);
  return <a className="tile" href="#" onClick={(e) => e.preventDefault()} title={`${t.pair.join(' → ')}: ${pct(c)} compatible`}>
    <div className="photo" style={{ '--hue': (i * 37) % 360 }}><Mini {...t} /></div>
    <div className="icon"><Gate type={t.pair[1] ?? t.pair[0]} idle />{hearts && <Heart className="icon-heart" />}</div>
    <span className="match">{pct(c)} match</span>
    <span className="badge">{fmt(Math.round(t.base * (0.25 + c * 0.75)))}</span>
  </a>;
}

const Heart = ({ className = '', fill = 'currentColor' }) => <svg className={className} viewBox="0 0 24 22" aria-hidden="true">
  <path fill={fill} d="M12 21 2.6 11.8A5.6 5.6 0 0 1 12 4.3a5.6 5.6 0 0 1 9.4 7.5Z" /></svg>;
const Spark = ({ className = '' }) => <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
  <path d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0Z" /></svg>;

// ---------- neon "Date": one tube stroke + two glow passes (Yellowtail, OFL) ----------
function Neon({ className = '' }) {
  return <svg className={`neon ${className}`} viewBox="0 0 300 120" role="img" aria-label="Date">
    <text x="150" y="92" textAnchor="middle" className="n-glow">Date</text>
    <text x="150" y="92" textAnchor="middle" className="n-tube">Date</text>
    <text x="150" y="92" textAnchor="middle" className="n-core">Date</text>
  </svg>;
}

function Bar({ logo }) {
  return <header className="bar">
    <a className="logo" href="#" onClick={(e) => e.preventDefault()}>
      {logo === 'neon' && <><Heart className="lh" /><Neon className="bar-neon" /></>}
      <span className="gatexx">GATEXX</span>
      {logo === 'neon' && <Heart className="lh" />}
    </a>
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <input placeholder="Search..." aria-label="Search" /><button type="submit">Search</button>
    </form>
    <nav>{['BEST OF', 'HITS', 'TRUTH TABLES', 'LIVE GATES', 'DATING'].map((n) => <a key={n} href="#" onClick={(e) => e.preventDefault()}>{n}</a>)}</nav>
  </header>;
}

// ---------- portrait: a big gate with blush, eyes, wink and a heart bubble (all hand-built SVG) ----------
function Portrait({ type, face }) {
  const g = GATE_GEOM[type];
  const cx = g.w * (type === 'XOR' ? 0.5 : 0.45), cy = g.h / 2;
  return <div className="portrait">
    <Spark className="ps ps1" /><Spark className="ps ps2" /><Heart className="ph ph1" /><Heart className="ph ph2" />
    <div className="pg" style={{ aspectRatio: `${g.w} / ${g.h}` }}>
      <Shape g={g} on lit={{ in: [true, type === 'XOR' ? false : true], out: true }} />
      <svg className="face" viewBox={`0 0 ${g.w} ${g.h}`} aria-hidden="true">
        <ellipse className="blush" cx={cx - 20} cy={cy + 12} rx="8" ry="4.5" />
        <ellipse className="blush" cx={cx + 20} cy={cy + 12} rx="8" ry="4.5" />
        {face === 'wink' ? <>
          <ellipse className="eye" cx={cx - 12} cy={cy - 4} rx="3.6" ry="5.4" /><circle className="glint" cx={cx - 11} cy={cy - 6.5} r="1.4" />
          <path className="lid" d={`M${cx + 7} ${cy - 3}q5 -7 11 0`} />
          <path className="mouth" d={`M${cx - 5} ${cy + 8}q5 6 10 0`} />
        </> : <>
          <ellipse className="eye" cx={cx - 9} cy={cy - 3} rx="3.2" ry="5" /><circle className="glint" cx={cx - 10} cy={cy - 5} r="1.3" />
          <ellipse className="eye" cx={cx + 11} cy={cy - 3} rx="3.2" ry="5" /><circle className="glint" cx={cx + 10} cy={cy - 5} r="1.3" />
          <path className="lid" d={`M${cx - 15} ${cy - 10}l7 -3M${cx + 17} ${cy - 10}l-7 -3`} />
          <path className="mouth" d={`M${cx - 3} ${cy + 9}q3 -3 6 0`} />
        </>}
      </svg>
      <svg className="bubble" viewBox="0 0 48 44" aria-hidden="true">
        <path className="b-shape" d="M24 2C36 2 46 10 46 20S36 38 24 38c-3 0-6-.5-8-1.4L6 42l3-9C4.7 29.6 2 25 2 20 2 10 12 2 24 2Z" />
        <path className="b-heart" d="M24 30 15.8 22A5 5 0 0 1 24 15.4 5 5 0 0 1 32.2 22Z" />
      </svg>
    </div>
    <span className="plate">{type}</span>
  </div>;
}

const enterHref = `?v=${V}&entered=1`;
function Btn({ kind = 'pri', href, children, sub }) {
  return <a className={`btn ${kind}`} href={href}><Heart className="bh" /><span>{children}</span><Heart className="bh" />{sub && <em>{sub}</em>}</a>;
}

// ---------- the three modals, one per mockup ----------
function ModalY1() {
  return <div className="modal m1" role="dialog" aria-modal="true" aria-labelledby="warn">
    <Corners /><Spark className="sp s1" /><Spark className="sp s2" /><Spark className="sp s3" /><Spark className="sp s4" />
    <Heart className="mh h1" /><Heart className="mh h2" /><Heart className="mh h3" /><Heart className="mh h4" />
    <h1 id="warn"><span className="w1">WARNING:</span><span className="w2" id="bits">THESE GATES ARE 18+ ...BITS!</span></h1>
    <p className="copy">BY ENTERING, I CONFIRM I AM AT LEAST 18 YEARS OLD<br />AND I KNOW WHAT A TRUTH TABLE IS.</p>
    <div className="btns"><Btn href={enterHref}>ENTER</Btn><Btn kind="sec" href={HOME}>I'M NOT 18</Btn></div>
  </div>;
}

function ModalY2() {
  const b = (t) => pct(compat([t], DATE));
  return <div className="modal m2 has-sign" role="dialog" aria-modal="true" aria-labelledby="warn">
    <Sign />
    <div className="split">
      <Portrait type="OR" face="wink" />
      <div className="txt">
        <h1 id="warn"><span className="w1">WARNING:</span><span className="w2">THESE GATES ARE 18+</span></h1>
        <p className="copy">THIS SITE CONTAINS LOGIC GATES<br />THAT DATE!</p>
        <p className="copy">BY ENTERING, I CONFIRM I AM 18 OR OLDER<br />AND THAT I KNOW WHAT A TRUTH TABLE IS...</p>
        <p className="copy dots">...AND OTHER BITS. <Heart className="ih" /></p>
      </div>
    </div>
    <div className="btns three">
      <Btn href={enterHref} sub={`${b('AND')} compat`}>AND : ENTER</Btn>
      <Btn kind="sec" href={enterHref} sub={`${b('OR')} compat`}>OR : ENTER</Btn>
      <Btn kind="sec" href={enterHref} sub={`${b('XOR')} compat`}>XOR : ENTER</Btn>
    </div>
    <p className="foot"><Heart className="ih" /> IF YOU HAVE CHILDREN, USE PARENTAL CONTROLS (<a href={HOME}>NOT GATE</a>). <Heart className="ih" /></p>
  </div>;
}

function ModalY3() {
  const c = compat(['AND'], DATE);
  return <div className="modal m3 has-sign" role="dialog" aria-modal="true" aria-labelledby="warn">
    <Sign close />
    <div className="split">
      <Portrait type="XOR" face="shy" />
      <div className="txt">
        <Spark className="sp s1" /><Spark className="sp s2" /><Heart className="mh h1" />
        <h1 id="warn"><span className="w1">WARNING:</span><span className="w2">THESE GATES ARE <b className="y18">18+</b></span>
          <span className="w3">... AND A FEW BITS NAUGHTY <Heart className="ih outline" fill="none" /></span></h1>
        <p className="plain">By entering, I confirm I am 18 or older and<br />I know what a truth table is.</p>
        <div className="meter" title="matching truth-table rows / total rows">
          <span>XOR &amp; you (AND): {pct(c)} compatible</span><i style={{ width: pct(c) }} />
        </div>
        <div className="btns stack"><Btn href={enterHref}>ENTER ANYWAY</Btn><a className="btn ghost" href={HOME}><span>NO THANKS</span></a></div>
      </div>
    </div>
  </div>;
}

function Sign({ close }) {
  return <div className="sign" aria-hidden={!close}>
    <Heart className="sh sh1" fill="none" /><Neon className="sign-neon" /><Heart className="sh sh2" fill="none" />
    {close && <a className="x" href={HOME} aria-label="Close (takes you back to Logic)">✕</a>}
  </div>;
}
const Corners = () => <><i className="cn tl" /><i className="cn tr" /><i className="cn bl" /><i className="cn br" /></>;

// =====================================================================================================
// SURPRISES (Builder Y lane: college life + classroom meta + 4th wall)
// =====================================================================================================

// y1: the professor has already graded this page. Red pen all over the modal, a grade, a stapled rubric.
function RedPen() {
  return <div className={`redpen ${REDUCE ? 'still' : ''}`} aria-label="Graded in red pen by Prof. Kerney">
    <svg className="rp-marks" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" style={{ '--d': '0.3s' }} d="M300 200C240 196 222 250 300 262 480 290 760 286 860 246 900 222 850 186 700 184 520 180 360 186 300 200" />
      <path pathLength="1" style={{ '--d': '1.1s' }} d="M620 440c80 14 180 6 230-8" />
      <path pathLength="1" style={{ '--d': '1.4s' }} d="M650 468c60 8 140 4 190-6" />
      <path pathLength="1" style={{ '--d': '1.9s' }} d="M150 440l30 34 60-80" />
    </svg>
    <span className="rp-note n1" style={{ '--d': '0.8s' }}>pun: +0. I'm keeping it though.</span>
    <span className="rp-note n2" style={{ '--d': '1.7s' }}>then why are you in my class?</span>
    <span className="rp-note n3" style={{ '--d': '2.2s' }}>correct gate ✓</span>
    <div className="grade" style={{ '--d': '2.6s' }}><b>B+</b><span>bold choice.<br />see me after class.<br />— K.</span></div>
    <div className="rubric" style={{ '--d': '3s' }}>
      <i className="staple" />
      <h3>CSCI 26 · Rubric</h3>
      <p><span>Truth table correct</span><b>40/40</b></p>
      <p><span>Uses real gates, no AI art</span><b>30/30</b></p>
      <p><span>Innuendo, classroom-safe</span><b>18/20</b></p>
      <p><span>Taste</span><b>0/10</b></p>
      <p className="tot"><span>Due Thu Oct 1 · on time?</span><b>barely</b></p>
    </div>
  </div>;
}

// y2: Web 1.0 ad assault. Popups you can close, a visitor-counter prize, a cookie banner, a marquee.
function Popups() {
  const [open, setOpen] = useState(REDUCE ? [true, true, true] : [false, false, false]);
  const [claimed, setClaimed] = useState(false);
  const [cookie, setCookie] = useState(true);
  useEffect(() => {
    if (REDUCE) return;
    const ts = [700, 1300, 1900].map((ms, i) => setTimeout(() => setOpen((o) => o.map((v, j) => (j === i ? true : v))), ms));
    return () => ts.forEach(clearTimeout);
  }, []);
  const close = (i) => setOpen((o) => o.map((v, j) => (j === i ? false : v)));
  const Win = ({ i, title, children }) => open[i] && <div className={`win w${i}`} role="alertdialog" aria-label={title}>
    <div className="wt"><span>{title}</span><button onClick={() => close(i)} aria-label="Close popup">×</button></div>
    <div className="wb">{children}</div>
  </div>;
  return <div className="popups">
    <Win i={0} title="!!! WINNER !!!">
      <p className="blink">CONGRATULATIONS!!!</p>
      <p>You are the <b>1,000,000th</b> visitor to this truth table!</p>
      <p className="prize">{claimed ? 'Nice try. Extra credit is not a popup. — Prof. K' : 'CLAIM +5% EXTRA CREDIT ON THE FINAL'}</p>
      {!claimed && <button className="w98" onClick={() => setClaimed(true)}>CLAIM NOW &gt;&gt;</button>}
    </Win>
    <Win i={1} title="Hot Singles">
      <p className="big">HOT SINGLE GATES<br />IN YOUR DORM</p>
      <p>3 are within 2 ft of your laptop. One is a NAND. It says it's "complicated".</p>
    </Win>
    <Win i={2} title="Security Alert">
      <p><b>WARNING:</b> Your transcript has <b>(3) viruses</b>.</p>
      <p>Finals week detected. Sleep schedule: <b>corrupted</b>.</p>
      <button className="w98">Scan now</button> <button className="w98">Pull all-nighter</button>
    </Win>
    <div className="marquee" aria-hidden="true"><span>★ FREE PIZZA IN THE CS LOUNGE* ★ LIVE GATES IN YOUR AREA ★ THIS PAGE COUNTS FOR EXTRA CREDIT** ★ *there is no pizza ★ **it does not ★ FREE PIZZA IN THE CS LOUNGE* ★ LIVE GATES IN YOUR AREA ★ THIS PAGE COUNTS FOR EXTRA CREDIT** ★ *there is no pizza ★ **it does not ★</span></div>
    {cookie && <div className="cookie" role="region" aria-label="Cookie notice">
      <p><b>This site uses cookies.</b> Not the good ones from the dining hall. The stale ones.</p>
      <button className="ck a" onClick={() => setCookie(false)}>Accept all</button>
      <button className="ck b" onClick={() => setCookie(false)}>Accept all, but sadder</button>
    </div>}
  </div>;
}

// y3: the class group chat has found the page. Messages keep landing; the professor is in the chat.
const CHAT = [
  ['jay', 'J', '#ffb020', 'wait is THIS the assignment??'],
  ['mo', 'M', '#35c46a', 'why is the XOR gate blushing at me'],
  ['priya', 'P', '#5aa0ff', '50% compatible with the AND gate. higher than my lab partner'],
  ['sam', 'S', '#c77dff', "it's 3am, finals are thursday, and i've been on the Date page for 40 min"],
  ['Prof. Kerney', 'K', '#ff4f7a', 'I can see who is online.', true],
  ['jay', 'J', '#ffb020', '...'],
  ['mo', 'M', '#35c46a', 'the OR gate sent me 400 hearts in 3 clock cycles, is that normal'],
  ['priya', 'P', '#5aa0ff', 'is this going to be on the final'],
  ['Prof. Kerney', 'K', '#ff4f7a', 'It is now.', true],
];
function Chat() {
  const [n, setN] = useState(REDUCE ? CHAT.length : 1);
  useEffect(() => {
    if (REDUCE || n >= CHAT.length) return;
    const t = setTimeout(() => setN(n + 1), n === 4 ? 1400 : 700);
    return () => clearTimeout(t);
  }, [n]);
  return <aside className="chat" aria-label="Class group chat" aria-live="polite">
    <header><b># csci-26-general</b><span className="unread">{34 + n} new</span></header>
    <ol>{CHAT.slice(0, n).map(([who, ini, col, msg, prof], i) => <li key={i} className={prof ? 'prof' : ''}>
      <i className="av" style={{ background: col }}>{ini}</i>
      <div><span className="who">{who}{prof && <em>PROF</em>}</span><p>{msg}</p></div>
    </li>)}</ol>
    {n < CHAT.length && <p className="typing">{CHAT[n][0]} is typing<span>...</span></p>}
  </aside>;
}

function Stub() {
  return <div className="stub"><div className="modal m1"><Corners />
    <h1><span className="w1">YOU'RE IN.</span><span className="w2">DATE MODE LOADS IN A LATER PR.</span></h1>
    <p className="copy">UNTIL THEN, THE GATES ARE WAITING IN LOGIC MODE.</p>
    <div className="btns"><Btn href={`?v=${V}`}>BACK TO THE GATE</Btn><Btn kind="sec" href={HOME}>LOGIC MODE</Btn></div>
  </div></div>;
}

function App() {
  const layout = { y1: 'ee', y2: 'c2', y3: 'x8' }[V];
  return <div className={`date v-${V} l-${layout} ${REDUCE ? 'reduce' : ''}`}>
    <Bar logo={V === 'y1' ? 'neon' : 'plain'} />
    <main className="grid" aria-hidden="true">{TILES.map((t, i) => <Tile key={i} t={t} i={i} hearts={V !== 'y1'} />)}</main>
    <div className="scrim" />
    {ENTERED ? <Stub /> : <div className="stage">
      {V === 'y1' && <div className="mwrap"><ModalY1 />{!CLEAN && <RedPen />}</div>}
      {V === 'y2' && <div className="mwrap"><ModalY2 /></div>}
      {V === 'y3' && <div className="mwrap"><ModalY3 /></div>}
    </div>}
    {!ENTERED && !CLEAN && V === 'y2' && <Popups />}
    {!ENTERED && !CLEAN && V === 'y3' && <Chat />}
    <footer className="foot-strip" />
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
