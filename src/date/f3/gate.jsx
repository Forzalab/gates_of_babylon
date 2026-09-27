// pit4 f3: the fused Dejting age gate. Base = x3's M3 layout (sign plate, gate-mascot portrait, wide ENTER ANYWAY over a
// narrow NO THANKS, the one yellow 18+). School = galge / visual novel (Tony): the portrait is a VN sprite card with a
// Tokimeki heart meter, the confirm line is spoken in an ADV textbox with a nameplate, and the buttons are the choice menu.
// ONE surprise: the Doki Doki Literature Club turn, through a mundane lens (Tony's M9, the office-hours queue; cf. the Tax
// Day dating sim). ~1.8 s in, AND-chan breaks the 4th wall: her line glitches from the mockup's legal text to "you're #47
// in the office-hours queue ... I'll ALWAYS wait", her heart meter becomes a queue ticket, her eyes open into a stare,
// and the NO THANKS choice glitches. Reduced motion
// (or ?still) = the landed frame. No people, no photos, no AI art: the heroine is our own AND Shape plus SVG.
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import '@fontsource/bangers/400.css';
import '@fontsource/yellowtail/400.css';
import '@fontsource/roboto-condensed/400.css';
import '@fontsource/roboto-condensed/700.css';
import { Shape, GATE_GEOM } from '../../nodes/index.jsx';
import { Grid, Heart } from './tiles.jsx';
import { play, isMuted, setMuted, onMute } from '../sfx.js';
import './gate.css';

const q = new URLSearchParams(location.search);
const STILL = q.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const CLEAN = q.has('clean'); // arbiter's overlap diff: the page without the surprise
const LOGIC = import.meta.env.BASE_URL;
const NEXT = `${location.pathname}?v=f3&next=1`;

function useLanded(ms) {
  const [on, set] = useState(STILL && !CLEAN);
  useEffect(() => { if (STILL || CLEAN) return; const t = setTimeout(() => set(true), ms); return () => clearTimeout(t); }, [ms]);
  return on;
}

function Bar() {
  return (
    <header className="bar">
      <a className="logo" href={LOGIC}><b>GATEXX</b></a>
      <form className="search" onSubmit={(e) => e.preventDefault()}><input placeholder="Search..." aria-label="Search" /><button>Search</button></form>
      <nav>{['BEST OF', 'HITS', 'TRUTH TABLES', 'LIVE GATES', 'DATING'].map((n) => <a key={n} href="#">{n}</a>)}</nav>
      <Mute />
    </header>
  );
}

// Neon "Dejting": one tube word on a black grid plate. The j and g descenders hang past the plate's bottom rule.
export function Dejting({ className = '' }) {
  return <span className={`neon ${className}`} lang="sv" aria-label="Dejting">Dejting</span>;
}

// AND-chan: the VN sprite. Our AND Shape with a hand-drawn face; `yan` = the landed stare.
function Sprite({ yan }) {
  const g = GATE_GEOM.AND;
  return (
    <div className="sprite">
      <svg viewBox="0 0 300 330" aria-label={yan ? 'AND-chan, staring' : 'AND-chan, an AND gate, winking'}>
        <defs>
          <radialGradient id="sg" cx="45%" cy="40%" r="75%"><stop offset="0" stopColor="#fff2fb" /><stop offset=".65" stopColor="#ffc2e6" /><stop offset="1" stopColor="#ff8fcf" /></radialGradient>
        </defs>
        <rect width="300" height="330" fill="url(#sg)" />
        {/* kawaii sparkles + soft hearts: the kit's background props */}
        {[[34, 42, 1.1], [262, 250, 1], [44, 278, .9], [266, 120, .8]].map(([x, y, s], i) => <Heart key={i} x={x} y={y} s={s} className="heart soft" />)}
        {[[250, 40], [30, 160], [150, 300]].map(([x, y], i) => <path key={i} className="spark" transform={`translate(${x} ${y})`} d="M0 -11Q1.5 -1.5 11 0Q1.5 1.5 0 11Q-1.5 1.5 -11 0Q-1.5 -1.5 0 -11Z" />)}
        <g transform="translate(40 92) scale(1.8)">
          <line className="w on" x1={-10} x2={0} y1={g.in[0][1]} y2={g.in[0][1]} /><line className="w on" x1={-10} x2={0} y1={g.in[1][1]} y2={g.in[1][1]} />
          <Shape g={g} on lit={{ in: [true, true], out: true }} />
          <g className="face">
            {yan ? <>
              <circle cx="44" cy="46" r="7.2" className="eyew" /><circle cx="44" cy="46" r="1.9" className="eye" />
              <circle cx="70" cy="46" r="7.2" className="eyew" /><circle cx="70" cy="46" r="1.9" className="eye" />
              <path d="M49 63 Q57 68 65 63" className="smile" />
              <path d="M26 30 L34 33 M26 36 L33 37" className="shade" />
            </> : <>
              <ellipse cx="44" cy="46" rx="4.4" ry="6.2" className="eye" />
              <circle cx="45.6" cy="43.4" r="1.6" fill="#fff" />
              <path d="M63 47 Q69.5 40 76 47" className="wink" />
              <path d="M50 62 Q57 70 64 62" className="smile" />
            </>}
            <ellipse cx="35" cy="59" rx="7" ry="3.6" className="blush" />
            <ellipse cx="78" cy="59" rx="7" ry="3.6" className="blush" />
          </g>
        </g>
        <g transform="translate(236 60)">
          <path className="bubble" d="M-34 -26H34Q46 -26 46 -14V10Q46 22 34 22H-2L-22 38L-16 22H-34Q-46 22 -46 10V-14Q-46 -26 -34 -26Z" />
          <Heart y={-3} s={1.9} className={yan ? 'heart deep' : 'heart'} />
        </g>
      </svg>
      {/* Tokimeki Memorial affection meter, drawn as the Wenrexa profile card's heart row */}
      {yan
        ? <div className="meter ticket" aria-label="Queue ticket 47">QUEUE <b>#47</b></div>
        : <div className="meter" aria-label="Affection: full">
          {[0, 1, 2, 3, 4].map((i) => <svg key={i} viewBox="-12 -12 24 24"><Heart s={1} className="heart" /></svg>)}
        </div>}
    </div>
  );
}

// ADV textbox: nameplate tab + the line + the advance cursor. The DDLC turn types the new line out (a tick per few
// characters, as VN engines do) and glitches the last words.
const YAN = [['You’re ', ''], ['#47', 'b'], [' in the office-hours queue, senpai. I’ll wait. ', ''], ['I’ll ALWAYS wait.', 'glitch'], [' ♡', '']];
const YAN_LEN = YAN.reduce((n, [t]) => n + t.length, 0);
function Textbox({ yan }) {
  const [n, setN] = useState(STILL ? YAN_LEN : 0);
  useEffect(() => {
    if (!yan || STILL) return;
    const k = setInterval(() => setN((c) => { if (c >= YAN_LEN) { clearInterval(k); return c; } if (c % 4 === 0) play('tick', { vol: 0.25, gap: 60 }); return c + 1; }), 16);
    return () => clearInterval(k);
  }, [yan]);
  let left = n;
  return (
    <div className={yan ? 'adv yan' : 'adv'} role="status" aria-label={yan ? YAN.map(([t]) => t).join('') : undefined}>
      <span className="nameplate">AND-chan</span>
      {yan
        ? <p aria-hidden="true">{YAN.map(([t, c], i) => {
          const shown = t.slice(0, Math.max(0, left)); left -= t.length;
          const ghost = t.slice(shown.length); // untyped text keeps its space, so the box never reflows
          const body = <>{shown}<span className="ghost">{ghost}</span></>;
          return c === 'b' ? <b key={i}>{body}</b> : c === 'glitch' ? <span key={i} className={shown.length === t.length ? 'glitch' : ''} data-t={t}>{body}</span> : <span key={i}>{body}</span>;
        })}</p>
        : <p>By entering, you confirm you&rsquo;re 18+ and know what a truth table is. &#9825;</p>}
      <i className="cursor" aria-hidden="true">&#9660;</i>
    </div>
  );
}

// Mute: a Wenrexa round icon button in the site bar (the classroom kill switch). Remembered in localStorage.
export function Mute({ className = 'mute' }) {
  const [m, set] = useState(isMuted());
  useEffect(() => onMute(set), []);
  return (
    <button className={className} aria-pressed={m} aria-label={m ? 'Sound off (click to turn on)' : 'Sound on (click to mute)'} title={m ? 'Unmute' : 'Mute'}
      onClick={() => { setMuted(!m); if (m) play('toggle', { gap: 0 }); }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path className="spk" d="M3 9H7L12 4.5V19.5L7 15H3Z" />
        {m ? <path className="wave" d="M16 9L21 15M21 9L16 15" /> : <path className="wave" d="M15.5 8.5Q18 12 15.5 15.5M18.5 6Q22.5 12 18.5 18" />}</svg>
    </button>
  );
}

function Gate() {
  const yan = useLanded(1200);
  useEffect(() => { if (yan && !STILL) play('creep', { vol: 0.3 }); }, [yan]);
  const enter = (e) => { e.preventDefault(); play('confirm', { gap: 0 }); setTimeout(() => { location.href = NEXT; }, isMuted() ? 0 : 260); };
  const leave = (e) => { e.preventDefault(); const to = e.currentTarget.href; play('back', { gap: 0 }); setTimeout(() => { location.href = to; }, isMuted() ? 0 : 220); };
  const hover = () => play('select', { vol: 0.25, gap: 120 });
  return (
    <div className={`date f3${STILL ? ' still' : ''}${yan ? ' yan' : ''}`}>
      <Bar />
      <Grid still={STILL} />
      <div className="stage">
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="warn">
          <div className="plate">
            <svg viewBox="-12 -12 24 24" className="nh l" aria-hidden="true"><Heart className="heart tube" /></svg>
            <Dejting />
            <svg viewBox="-12 -12 24 24" className="nh r" aria-hidden="true"><Heart className="heart tube" /></svg>
          </div>
          <a className="close" href={LOGIC} onClick={leave} aria-label="Close (back to Logic)">&#10005;</a>
          <i className="cn bl" /><i className="cn br" />
          <div className="cols">
            <Sprite yan={yan} />
            <div className="copy">
              <h1 id="warn" className="warn">WARNING:</h1>
              <p className="sub">THESE GATES ARE <em className="y">18+</em></p>
              <p className="sub n">... AND A FEW BITS NAUGHTY &#9825;</p>
              <nav className="choices" aria-label="Choices">
                <a className="btn hot" href={NEXT} onClick={enter} onPointerEnter={hover} onFocus={hover}>&#9829; ENTER ANYWAY &#9829;</a>
                <a className={yan ? 'btn soft glitchy' : 'btn soft'} href={LOGIC} onClick={leave} onPointerEnter={hover} onFocus={hover} data-t="NO THANKS">NO THANKS</a>
              </nav>
            </div>
          </div>
          <Textbox yan={yan} />
        </section>
      </div>
    </div>
  );
}

document.title = 'GATEXX';
createRoot(document.getElementById('root')).render(<Gate />);
