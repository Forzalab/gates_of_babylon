// Date mode, pit3 Builder X prototype. A fake adult-site age gate made of our real logic gates.
// Variants: date.html?v=x1 | x2 | x3 (default x1). Each carries exactly ONE CS-humor surprise.
// No people, no photos, no AI art: every "face" here is our own Shape plus hand-drawn SVG.
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import '@fontsource/bangers/400.css';
import '@fontsource/yellowtail/400.css';
import '@fontsource/roboto-condensed/400.css';
import '@fontsource/roboto-condensed/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import { Shape, GATE_GEOM } from '../nodes/index.jsx';
import { compat, pairRow } from './compat.js';
import './date.css';
import F2 from './f2.jsx';

const params = new URLSearchParams(location.search);
const V = ['x1', 'x2', 'x3', 'f2'].includes(params.get('v')) ? params.get('v') : 'x1';
const STILL = params.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const LOGIC = import.meta.env.BASE_URL; // "/": the real app. "I'm not 18" lands here (the 4th-wall joke).

// Surprise clock: the page opens as a straight mockup, then the gag lands. Reduced motion = the landed still.
function useLanded(ms) {
  const [on, set] = useState(STILL);
  useEffect(() => { if (STILL) return; const t = setTimeout(() => set(true), ms); return () => clearTimeout(t); }, [ms]);
  return on;
}
function useTick(ms) {
  const [n, set] = useState(0);
  useEffect(() => { if (STILL) return; const t = setInterval(() => set((k) => k + 1), ms); return () => clearInterval(t); }, [ms]);
  return n;
}

const HEART = 'M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z';
const Heart = ({ x = 0, y = 0, s = 1, className = 'heart' }) =>
  <path className={className} d={HEART} transform={`translate(${x} ${y}) scale(${s})`} />;

const pins = (g) => (Array.isArray(g.in?.[0]) ? g.in : [g.in]);
const outTip = (g) => [g.out[0] + (g.bubble ? 0 : 12), g.out[1]];

// A live pair: switches a, b -> gate A -> gate B (pin 0), b -> B pin 1. Values come from sim.evaluate.
function Pair({ A, B, row }) {
  const gA = GATE_GEOM[A], gB = GATE_GEOM[B];
  const r = pairRow(A, B, row);
  const ax = 40, ay = 20;
  const [aox, aoy] = outTip(gA);
  const bIn = pins(gB);
  const bx = ax + aox + 34 - (bIn[0][0] - 12), by = ay + aoy - bIn[0][1];
  const W = bx + outTip(gB)[0] + 40, Hh = Math.max(ay + gA.h, by + gB.h) + 26;
  const aIns = pins(gA), bits = [r.a, r.b];
  const litA = { in: aIns.map((_, i) => bits[i]), out: r.A };
  const litB = { in: bIn.map((_, i) => (i === 0 ? r.A : r.b)), out: r.B };
  const [box, boy] = outTip(gB);
  const lowY = Hh - 12;
  return (
    <svg className="pair" viewBox={`0 0 ${W} ${Hh}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {aIns.map(([x, y], i) => <line key={i} className={bits[i] ? 'w on' : 'w'} x1={4} x2={ax + x - 12} y1={ay + y} y2={ay + y} />)}
      <line className={r.A ? 'w on' : 'w'} x1={ax + aox} x2={bx + bIn[0][0] - 12} y1={ay + aoy} y2={ay + aoy} />
      {bIn[1] && <polyline className={r.b ? 'w on' : 'w'} points={`14,${ay + (aIns[1] ?? aIns[0])[1]} 14,${lowY} ${bx - 14},${lowY} ${bx - 14},${by + bIn[1][1]} ${bx + bIn[1][0] - 12},${by + bIn[1][1]}`} />}
      <line className={r.B ? 'w on' : 'w'} x1={bx + box} x2={W - 4} y1={by + boy} y2={by + boy} />
      <g transform={`translate(${ax} ${ay})`}><Shape g={gA} on={r.A} lit={litA} /></g>
      <g transform={`translate(${bx} ${by})`}><Shape g={gB} on={r.B} lit={litB} /></g>
      {r.B && <Heart x={W - 14} y={by + boy - 2} s={1.2} />}
    </svg>
  );
}

// The crisp mockup icon over the blur: gate A's outline, a heart on its output.
function Icon({ type }) {
  const g = GATE_GEOM[type], [ox, oy] = outTip(g);
  return (
    <svg className="icon" viewBox={`-30 0 ${g.w + 70} ${g.h}`} aria-hidden="true">
      {pins(g).map(([x, y], i) => <line key={i} className="w" x1={-26} x2={x - 12} y1={y} y2={y} />)}
      <Shape g={g} idle on={false} lit={{}} />
      <line className="w" x1={ox} x2={ox + 14} y1={oy} y2={oy} />
      <Heart x={ox + 26} y={oy - 1} s={1.1} className="heart hollow" />
    </svg>
  );
}

const PAIRS = [['OR', 'AND'], ['XOR', 'NAND'], ['AND', 'NOT'], ['NOR', 'OR'], ['NAND', 'AND'], ['OR', 'XOR'],
  ['AND', 'AND'], ['NOT', 'NOR'], ['XOR', 'OR'], ['NAND', 'NOT'], ['OR', 'OR'], ['NOR', 'XOR']];
const FAKE = [6083, 2415, 1811, 4562, 3129, 5201, 1811, 2079, 2415, 1559, 4562, 1812];

function Tile({ i, A, B, row }) {
  const c = compat(A, B), views = Math.round(c * 100 * FAKE[i]);
  return (
    <a className="tile" href="#" onClick={(e) => e.preventDefault()} aria-label={`${A} x ${B}, ${Math.round(c * 100)}% compatible`}>
      <span className="blob" style={{ '--h': (i * 37) % 60 }} />
      <Pair A={A} B={B} row={row} />
      <Icon type={A} />
      <span className="match">{A} &#9829; {B} &middot; {Math.round(c * 100)}% compat</span>
      <span className="badge">{views.toLocaleString('en-US')}</span>
    </a>
  );
}

function Grid() {
  const t = useTick(1100);
  return <main className="grid">{PAIRS.map(([A, B], i) => <Tile key={i} i={i} A={A} B={B} row={t + i} />)}</main>;
}

function Neon({ small }) {
  return <span className={small ? 'neon small' : 'neon'} aria-label="Date">Date</span>;
}

function Bar({ logo }) {
  return (
    <header className="bar">
      {logo ? <a className="logo neonlogo" href="#"><svg viewBox="-12 -12 24 24" className="nh"><Heart s={1} className="heart tube" /></svg><Neon small /><b>GATEXX</b><svg viewBox="-12 -12 24 24" className="nh"><Heart s={1} className="heart tube" /></svg></a>
        : <a className="logo" href="#"><b>GATEXX</b></a>}
      <form className="search" onSubmit={(e) => e.preventDefault()}><input placeholder="Search..." aria-label="Search" /><button>Search</button></form>
      <nav>{['BEST OF', 'HITS', 'TRUTH TABLES', 'LIVE GATES', 'DATING'].map((n) => <a key={n} href="#">{n}</a>)}</nav>
    </header>
  );
}

// Dialog portrait: a big AND gate with a face. Blush, wink, smile and the heart bubble are hand-built SVG.
function Portrait() {
  const g = GATE_GEOM.AND;
  return (
    <div className="portrait">
      <svg viewBox="0 0 300 300" aria-label="An AND gate, blushing and winking">
        <defs><radialGradient id="pg" cx="45%" cy="55%" r="70%"><stop offset="0" stopColor="#ffd6f0" /><stop offset="1" stopColor="#ff8fd0" /></radialGradient></defs>
        <rect width="300" height="300" rx="18" fill="url(#pg)" />
        {[[30, 40], [250, 250], [40, 260], [270, 150]].map(([x, y], i) => <Heart key={i} x={x} y={y} s={1.1} className="heart soft" />)}
        <g transform="translate(46 84) scale(1.75)">
          <line className="w on" x1={-8} x2={0} y1={33} y2={33} /><line className="w on" x1={-8} x2={0} y1={75} y2={75} />
          <Shape g={g} on lit={{ in: [true, true], out: true }} />
          <g className="face">
            <ellipse cx="44" cy="45" rx="4.2" ry="6" className="eye" />
            <circle cx="45.5" cy="42.5" r="1.5" fill="#fff" />
            <path d="M62 46 Q68 39 74 46" className="wink" />
            <ellipse cx="36" cy="60" rx="7" ry="3.6" className="blush" />
            <ellipse cx="74" cy="60" rx="7" ry="3.6" className="blush" />
            <path d="M50 62 Q57 70 64 62" className="smile" />
          </g>
        </g>
        <g transform="translate(222 64)">
          <path className="bubble" d="M-40 -30H40Q52 -30 52 -18V14Q52 26 40 26H-6L-26 44L-20 26H-40Q-52 26 -52 14V-18Q-52 -30 -40 -30Z" />
          <Heart y={-4} s={2.2} className="heart" />
        </g>
      </svg>
    </div>
  );
}

// ---------- the three surprises (CS / programmer humor lane) ----------
function Duplicate({ on }) { // x1: Stack Overflow closes the age gate as a duplicate
  return (
    <div className={on ? 'so on' : 'so'} aria-hidden={!on}>
      <div className="so-stamp">CLOSED AS DUPLICATE</div>
      <div className="so-box">
        <div className="so-votes"><span>&#9650;</span><b>-3</b><span>&#9660;</span></div>
        <div>
          <p className="so-h">This question already has an answer here:</p>
          <p className="so-q"><u>Am I 18+ if I'm 10010 in binary?</u> <em>(47 answers)</em></p>
          <p className="so-m">Closed 11 years ago by 3 users with 100k rep. Also: why would you date a gate? Use a flip-flop.</p>
        </div>
      </div>
    </div>
  );
}

function Conflict({ on }) { // x2: the headline is a git merge conflict
  if (!on) return <h1 className="warn">WARNING:<small>THESE GATES ARE 18+</small></h1>;
  return (
    <div className="conflict" role="heading" aria-level={1}>
      <div className="lens">Accept Current Change | Accept Incoming Change | Accept Both Changes | Compare Changes</div>
      <div className="ours"><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (logic-mode)</code><span>WARNING: THESE GATES ARE 18+</span></div>
      <code className="mid">=======</code>
      <div className="theirs"><span>WARNING: THESE GATES ARE 0b10010+</span><code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; date-mode</code></div>
    </div>
  );
}

function Segfault({ on }) { // x3: the date crashes with a core dump
  return (
    <div className={on ? 'term on' : 'term'} aria-hidden={!on}>
      <div className="term-bar"><i /><i /><i /><span>tony@babylon: ~/gates</span></div>
      <pre>{`$ ./date --enter
`}<b className="red">Segmentation fault (core dumped)</b>{`
$ gdb ./date core
(gdb) bt
#0  heart_deref (h=0x0) at date.c:18
#1  love_bomb (n=4294967295) at date.c:42 `}<i className="cm">{'// UINT_MAX texts'}</i>{`
#2  enter_anyway () at date.c:69
(gdb) `}<span className="caret">&#9608;</span></pre>
    </div>
  );
}

// ---------- the modals ----------
const enter = (e) => { e.preventDefault(); location.hash = 'enter'; };

function X1() {
  const on = useLanded(1600);
  return (
    <section className="modal m1" role="dialog" aria-modal="true" aria-labelledby="h1">
      <Corners />
      <h1 id="h1" className="warn big"><svg viewBox="-12 -12 24 24" className="hh"><Heart /></svg>WARNING:<svg viewBox="-12 -12 24 24" className="hh"><Heart /></svg>
        <small>THESE GATES ARE 18+ ...BITS!</small></h1>
      <p className="fine">By entering, I confirm I am at least 18 years old<br />and I know what a truth table is.</p>
      <div className="btns two">
        <a className="btn hot" href="#enter" onClick={enter}>&#9829; ENTER &#9829;</a>
        <a className="btn soft" href={LOGIC}>&#9829; I'M NOT 18 &#9829;</a>
      </div>
      <Duplicate on={on} />
    </section>
  );
}

function X2() {
  const on = useLanded(1500);
  return (
    <div className="stage s2">
      <div className="sign"><svg viewBox="-12 -12 24 24" className="nh l"><Heart className="heart tube" /></svg><Neon /><svg viewBox="-12 -12 24 24" className="nh r"><Heart className="heart tube" /></svg></div>
      <section className="modal m2" role="dialog" aria-modal="true">
        <Corners />
        <div className="cols">
          <Portrait />
          <div className="copy">
            <Conflict on={on} />
            <p className="fine">This site contains logic gates that date!</p>
            <p className="fine">By entering, I confirm I am 18 or older and that I know what a truth table is... and other bits.</p>
          </div>
        </div>
        <div className="btns three">
          <a className="btn hot" href="#enter" onClick={enter}>&#9829; AND : ENTER &#9829;</a>
          <a className="btn soft" href="#enter" onClick={enter}>&#9829; OR : ENTER &#9829;</a>
          <a className="btn soft" href="#enter" onClick={enter}>&#9829; XOR : ENTER &#9829;</a>
        </div>
        <p className="foot">&#9829; If you have children, use parental controls (NOT gate). <a href={LOGIC}>I'm not 18</a> &#9829;</p>
      </section>
    </div>
  );
}

function X3() {
  const on = useLanded(1800);
  return (
    <div className={on ? 'stage s3 crashed' : 'stage s3'}>
      <section className="modal m3" role="dialog" aria-modal="true">
        <div className="sign plate"><Neon /><svg viewBox="-12 -12 24 24" className="nh l"><Heart className="heart tube" /></svg><svg viewBox="-12 -12 24 24" className="nh r"><Heart className="heart tube" /></svg></div>
        <a className="close" href={LOGIC} aria-label="Close (back to Logic)">&#10005;</a>
        <div className="cols">
          <Portrait />
          <div className="copy">
            <h1 className="warn">WARNING:<small>THESE GATES ARE <em className="y">18+</em></small><small className="n">... AND A FEW BITS NAUGHTY &#9825;</small></h1>
            <p className="plain">By entering, I confirm I am 18 or older and<br />I know what a truth table is.</p>
            <div className="btns stack">
              <a className="btn hot wide" href="#enter" onClick={enter}>&#9829; ENTER ANYWAY &#9829;</a>
              <a className="btn soft narrow" href={LOGIC}>NO THANKS</a>
            </div>
          </div>
        </div>
      </section>
      <Segfault on={on} />
    </div>
  );
}

const Corners = () => <><i className="cn tl" /><i className="cn tr" /><i className="cn bl" /><i className="cn br" /></>;

function Stub() {
  return (
    <div className="stub">
      <div className="sign"><Neon /></div>
      <section className="modal m1 stubm">
        <h1 className="warn">DATE MODE<small>COMING SOON (STUB)</small></h1>
        <p className="fine">The real Date mode moves into the app once Tony picks a variant.</p>
        <div className="btns two">
          <a className="btn hot" href="#" onClick={(e) => { e.preventDefault(); location.hash = ''; }}>&#9829; BACK &#9829;</a>
          <a className="btn soft" href={LOGIC}>LOGIC MODE</a>
        </div>
      </section>
    </div>
  );
}

function Page() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => { const f = () => setHash(location.hash); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []);
  return (
    <div className={`date v-${V}${STILL ? ' still' : ''}`}>
      <Bar logo={V === 'x1'} />
      <Grid />
      <div className="veil" />
      {hash === '#enter' ? <Stub /> : V === 'x1' ? <div className="stage s1"><X1 /></div> : V === 'x2' ? <X2 /> : <X3 />}
    </div>
  );
}

document.title = 'GATEXX';
createRoot(document.getElementById('root')).render(V === 'f2' ? <F2 Bar={Bar} Grid={Grid} /> : <Page />);
