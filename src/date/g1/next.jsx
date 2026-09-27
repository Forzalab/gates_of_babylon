// pit4 g1 (r2-1) adds: a gacha pull card intro (SSR AND-chan, NOPE / LIKE swipe, from f2), a compat pill in the
// Raggningstabell header, a LOGIC MODE pill, the neon glow clipped to row 01, Prof. Kerney's "Swiping is not a valid
// proof." on NOPE, and an IT'S A MATCH stamp on the table after a match.
// pit4 f3 continue screen (date.html?v=g1&next=1): what ENTER ANYWAY leads to. It is the REAL circuit editor (App.jsx,
// React Flow, the real sim + truth table), re-skinned in Date tokens: neon "Dejting" wordmark whose j and g hang past the
// row rule, pink/blue ink, the lockup reads MATCH MAKER, the disk is a heart that goes back to Logic. AND-chan keeps
// talking in a VN textbox (row 03). Wiring one gate's output into another gate pops "IT'S A MATCH" with the pair's
// real compatibility (compat.js runs the pair through sim.evaluate). Office-hours lens: she's still #47 in the queue.
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import '@xyflow/react/dist/style.css';
import '../../theme.css';
import '@fontsource/bangers/400.css';
import '@fontsource/yellowtail/400.css';
import '@fontsource/roboto-condensed/400.css';
import '@fontsource/roboto-condensed/700.css';
import App from '../../App.jsx';
import { Shape, GATE_GEOM } from '../../nodes/index.jsx';
import { compat } from '../compat.js';
import { play, isMuted, setMuted, onMute } from '../sfx.js';
import './next.css';

const q = new URLSearchParams(location.search);
const STILL = q.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const LOGIC = import.meta.env.BASE_URL;
const GATE = `${location.pathname}?v=g1`;

// The date: AND-chan (g1, already holding both switches) and XOR-kun (g2, lit to the lamp). One wire short of a match.
const START = {
  nodes: {
    s1: { id: 's1', kind: 'S', value: true },
    s2: { id: 's2', kind: 'S', value: false },
    g1: { id: 'g1', kind: 'G', type: 'AND' },
    g2: { id: 'g2', kind: 'G', type: 'XOR' },
    l1: { id: 'l1', kind: 'L' },
  },
  wires: {
    d1: { id: 'd1', source: 's1', target: 'g1', pin: 0 },
    d2: { id: 'd2', source: 's2', target: 'g1', pin: 1 },
    d3: { id: 'd3', source: 's2', target: 'g2', pin: 1 },
    d4: { id: 'd4', source: 'g2', target: 'l1', pin: 0 },
  },
};
const VIEW = [
  { id: 's1', type: 'S', position: { x: 26, y: 95 }, data: {} },
  { id: 's2', type: 'S', position: { x: 26, y: 295 }, data: {} },
  { id: 'g1', type: 'G', position: { x: 260, y: 184 }, data: {} },
  { id: 'g2', type: 'G', position: { x: 520, y: 204 }, data: {} },
  { id: 'l1', type: 'L', position: { x: 760, y: 201 }, data: {} },
];

// First visit: the Logic tour would dim this screen. Hide it for this mount only, then restore the keys so Logic's own
// first-visit tour still runs at "/".
function muteTour() {
  const keys = [['gob.tour', 'done'], ['gob.paletteHint', '1']];
  const set = [];
  try { for (const [k, v] of keys) if (localStorage.getItem(k) == null) { localStorage.setItem(k, v); set.push(k); } } catch { /* private mode */ }
  return () => { try { set.forEach((k) => localStorage.removeItem(k)); } catch { /* private mode */ } };
}

const HEART = 'M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z';
const Heart = ({ className = 'dj-heart', x = 0, y = 0, s = 1 }) => <path className={className} d={HEART} transform={`translate(${x} ${y}) scale(${s})`} />;

const LINES = {
  hello: <>You&rsquo;re <b>#47</b> in the queue. Wire my output to a cute gate? &#9825;</>,
  lamp: <>A <b>lamp</b>?? Senpai. Wire me to a <b>GATE</b>. &#9825;</>,
  other: <>Mm. Nice wire. Now wire a gate&rsquo;s output into another <b>gate</b>. &#9825;</>,
  match: <>Prof. Kerney will see you <b>both</b> now. &#9825;</>,
  nope: <>Swiping is not a valid proof. Build the circuit.</>,
};
const SPEAKER = { nope: 'Prof. Kerney' };

// Gacha pull card (S4) = f2's swipe intro in the kit's title-panel chrome. Real Shape + her real truth table.
function Pull({ onDone }) {
  const [out, setOut] = useState(null);
  const g = GATE_GEOM.AND, c = Math.round(compat('AND', 'XOR') * 100);
  const go = (like) => { setOut(like ? 'like' : 'nope'); play(like ? 'confirm' : 'back', { gap: 0 }); setTimeout(() => onDone(like), STILL ? 0 : 380); };
  useEffect(() => { const k = (e) => { if (e.key === 'ArrowRight') go(true); if (e.key === 'ArrowLeft') go(false); }; addEventListener('keydown', k); return () => removeEventListener('keydown', k); });
  return (
    <div className="dj-veil pull">
      <section className={`dj-card${out ? ' ' + out : ''}`} role="dialog" aria-modal="true" aria-labelledby="dj-p">
        <div className="dj-rar"><b>SSR</b> <span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
        <div className="dj-art" aria-hidden="true">
          <svg className="dj-rays" viewBox="-100 -100 200 200">{Array.from({ length: 16 }, (_, i) => <path key={i} transform={`rotate(${i * 22.5})`} d="M-7 0L0 -140L7 0Z" />)}</svg>
          <svg className="dj-gate" viewBox={`-14 -8 ${g.w + 28} ${g.h + 16}`}><Shape g={g} on lit={{ in: [true, true], out: true }} /></svg>
        </div>
        <h2 id="dj-p" className="dj-pn">AND-chan <small>2 inputs &middot; 0 km away &middot; queue #47</small></h2>
        <table className="dj-tt"><thead><tr><th>A</th><th>B</th><th>OUT</th></tr></thead>
          <tbody>{[[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => <tr key={`${a}${b}`}><td>{a}</td><td>{b}</td><td>{a & b}</td></tr>)}</tbody></table>
        <p className="dj-cp">AND-chan &amp; XOR-kun: <b>{c}%</b> compatible</p>
        <div className="dj-btns">
          <button className="dj-btn soft" onClick={() => go(false)}>&#10005; NOPE</button>
          <button className="dj-btn hot" onClick={() => go(true)} autoFocus>&#9829; LIKE</button>
        </div>
      </section>
    </div>
  );
}

function Match({ m, onClose }) {
  const gA = GATE_GEOM[m.A], gB = GATE_GEOM[m.B], c = Math.round(compat(m.A, m.B) * 100);
  const rows = Math.round(c / 25);
  useEffect(() => { const k = (e) => { if (e.key === 'Escape') onClose(); }; addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [onClose]);
  return (
    <div className="dj-veil" onClick={onClose}>
      <section className="dj-match" role="dialog" aria-modal="true" aria-labelledby="dj-m" onClick={(e) => e.stopPropagation()}>
        <i className="cn tl" /><i className="cn tr" /><i className="cn bl" /><i className="cn br" />
        <h2 id="dj-m" className="dj-its">IT&rsquo;S A MATCH!</h2>
        <div className="dj-pair" aria-hidden="true">
          <svg viewBox={`-8 -8 ${gA.w + 16} ${gA.h + 16}`}><Shape g={gA} on lit={{ in: [true, true], out: true }} /></svg>
          <svg className="dj-mid" viewBox="-14 -14 28 28"><Heart s={1.25} /></svg>
          <svg className="flip" viewBox={`-8 -8 ${gB.w + 16} ${gB.h + 16}`}><Shape g={gB} on lit={{ in: [true, true], out: true }} /></svg>
        </div>
        <p className="dj-names">{m.A}-chan <span>&#9829;</span> {m.B}-kun</p>
        <p className="dj-compat"><b>{c}%</b> compatible <small>({rows}/4 truth-table rows agree)</small></p>
        <div className="dj-bar" aria-hidden="true"><i style={{ width: `${Math.max(c, 4)}%` }} /></div>
        <div className="dj-btns">
          <button className="dj-btn hot" onClick={() => { play('select', { gap: 0 }); onClose(); }} autoFocus>&#9829; KEEP WIRING &#9829;</button>
          <a className="dj-btn soft" href={GATE}>BACK TO THE GATE</a>
        </div>
      </section>
    </div>
  );
}

function MuteBtn() {
  const [m, set] = useState(isMuted());
  useEffect(() => onMute(set), []);
  return (
    <button className="dj-mute" aria-pressed={m} aria-label={m ? 'Sound off (click to turn on)' : 'Sound on (click to mute)'} title={m ? 'Unmute' : 'Mute'}
      onClick={() => { setMuted(!m); if (m) play('toggle', { gap: 0 }); }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path className="spk" d="M3 9H7L12 4.5V19.5L7 15H3Z" />
        {m ? <path className="wave" d="M16 9L21 15M21 9L16 15" /> : <path className="wave" d="M15.5 8.5Q18 12 15.5 15.5M18.5 6Q22.5 12 18.5 18" />}</svg>
    </button>
  );
}

function Skin({ line, match, closeMatch, matched }) {
  const [host, setHost] = useState(null);
  useEffect(() => {
    let raf = 0;
    const find = () => { const app = document.querySelector('.app'); if (app) setHost(app); else raf = requestAnimationFrame(find); };
    find();
    return () => cancelAnimationFrame(raf);
  }, []);
  if (!host) return null;
  const r1 = host.querySelector('.c-main.r1'), side = host.querySelector('.c-side.r1'), r3 = host.querySelector('.c-side.r3'), canvas = host.querySelector('.canvas'), truth = host.querySelector('.truth');
  return <>
    {r1 && createPortal(<div className="dj-plate">
      <span className="dj-neon" lang="sv" aria-hidden="true">Dejting</span>
      <nav className="dj-nav"><a className="dj-back" href={GATE} onClick={() => play('back', { gap: 0 })}>&#9664; BACK TO THE GATE</a>
        <a className="dj-back dj-logic" href={LOGIC}>LOGIC MODE</a></nav>
      <MuteBtn />
    </div>, r1)}
    {side && createPortal(<a className="dj-disk" href={LOGIC} aria-label="Logic mode" title="Back to Logic mode">
      <svg viewBox="-50 -50 100 100" aria-hidden="true"><path d="M0 34L-30 4A17 17 0 0 1 0 -24A17 17 0 0 1 30 4Z" /></svg>
    </a>, side)}
    {r3 && createPortal(<div className="dj-adv" role="status">
      <span className="dj-name">{SPEAKER[line] ?? 'AND-chan'}</span><p>{LINES[line]}</p><i aria-hidden="true">&#9660;</i>
    </div>, r3)}
    {truth && createPortal(<div className="dj-pill">AND-chan &amp; XOR-kun: <b>{Math.round(compat('AND', 'XOR') * 100)}%</b>
      {matched && <span className="dj-stamp">IT&rsquo;S A MATCH</span>}</div>, truth)}
    {match && canvas && createPortal(<Match m={match} onClose={closeMatch} />, canvas)}
  </>;
}

function Next() {
  const [line, setLine] = useState('hello');
  const [match, setMatch] = useState(null);
  const [matched, setMatched] = useState(false);
  const [pull, setPull] = useState(!q.has('nopull'));
  const combo = useRef(0); // each further match pitches the payoff up (SOUND.md rule 7), capped at 1.6
  const onWire = (src, dst) => {
    if (src?.kind === 'G' && dst?.kind === 'G') {
      setMatch({ A: src.type, B: dst.type }); setLine('match'); setMatched(true);
      play('sax', { gap: 0, rate: 1 + 0.08 * combo.current++ }); // cheesy-romance sax sting, pitched up per further match
    } else { setLine(dst?.kind === 'L' ? 'lamp' : 'other'); play('tick', { gap: 0 }); }
  };
  useEffect(() => { const t = setTimeout(restore, 1500); return () => clearTimeout(t); }, []);
  return (
    <div className={STILL ? 'dj still' : 'dj'}>
      <h1 className="sr">Dejting: match maker</h1>
      <App start={START} startView={VIEW} onWire={onWire} />
      <Skin line={line} match={match} matched={matched} closeMatch={() => setMatch(null)} />
      {pull && <Pull onDone={(like) => { setPull(false); if (!like) setLine('nope'); }} />}
    </div>
  );
}

const restore = muteTour();
document.title = 'GATEXX · Dejting';
createRoot(document.getElementById('root')).render(<Next />);
