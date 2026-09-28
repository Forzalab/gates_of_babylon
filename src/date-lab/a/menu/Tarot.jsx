// menu-1 TAROT (horror 2). School: CLAMP / Persona arcana UI x Argento's jewel-tone occult x Suspiria candlelight.
// Central theme: FATE IS DEALT BY HER. Her card is face-up, warm, already read for you. Yours is face-down: you choose blind.
// Timer = a candle burning 5 s (wax = smooth UI timer, flame = 3 stepped poses at 500 ms). Timeout: her hand (stepped, 3 poses)
// slides her card to you = pink. Purple: your card flips REVERSED, purple bleed 334 ms, her pin goes red.
// Replay: the card you drew last time is pinned to the cloth with her hair-pin (disabled). The candle still burns.
// RM: no deal / flip / slide motion; every state is a hard cut; the bleed is still one 334 ms hold (it is a hold, not motion).
import { useEffect, useState } from 'react';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import { useDoorMenu, useBeats, usePose } from '../kit/hooks.js';
import { OPTIONS, BLEED, progress, isDisabled } from '../kit/menu.js';
import { Line, Hud, Tag, Ors } from '../kit/ui.jsx';
import { NAND_BODY } from '../../../date-beta/art/util.js';
import { Nanda } from '../kit/Sprite.jsx';
import './tarot.css';

const STAIRS = { door: 'ajar' };
const INTRO = 1500, DEAL = 1100;

// ---------- card faces (440 x 740) ----------
function Frame({ ink = '#d6a93f' }) {
  return (
    <>
      <rect x="14" y="14" width="412" height="712" rx="18" fill="none" stroke={ink} strokeWidth="4" />
      <rect x="26" y="26" width="388" height="688" rx="12" fill="none" stroke={ink} strokeWidth="1.5" />
      {[[26, 26], [414, 26], [26, 714], [414, 714]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="7" fill={ink} />)}
    </>
  );
}

// Her card: VI THE CUP. A teacup whose two steam strands (two inputs) rise into a NAND-gate sun.
function HerFace() {
  return (
    <svg viewBox="0 0 440 740" className="face">
      <defs>
        <linearGradient id="tc-warm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb86b" /><stop offset=".55" stopColor="#ff8fb8" /><stop offset="1" stopColor="#c93d7a" /></linearGradient>
        <clipPath id="tc-arch"><path d="M50 520 V210 A170 170 0 0 1 390 210 V520Z" /></clipPath>
      </defs>
      <rect width="440" height="740" rx="24" fill="#fff4e8" />
      <Frame />
      <text x="220" y="78" textAnchor="middle" className="t-num">VI</text>
      <g clipPath="url(#tc-arch)">
        <rect x="40" y="40" width="360" height="490" fill="url(#tc-warm)" />
        {/* the sun = a NAND gate, bubble = her pin */}
        <g transform="translate(160 150) scale(2.2)">
          <path d={NAND_BODY} fill="#fff1c9" stroke="#b0123e" strokeWidth="2.4" />
          <circle cx="48" cy="20" r="5.5" fill="#ff5fa2" stroke="#b0123e" strokeWidth="2.4" />
        </g>
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2;
          return <line key={i} x1={220 + Math.cos(a) * 92} y1={194 + Math.sin(a) * 92} x2={220 + Math.cos(a) * 128} y2={194 + Math.sin(a) * 128} stroke="#fff1c9" strokeWidth="5" strokeLinecap="round" opacity=".8" />;
        })}
        {/* two steam strands = the two inputs, joining at the sun */}
        <path d="M196 402 C170 360 214 330 188 290 C176 270 178 250 160 238" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M244 402 C270 360 226 330 252 290 C262 272 250 252 260 238" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />
        {/* hills + cup */}
        <path d="M40 470 Q140 420 220 452 Q300 420 400 468 V530 H40Z" fill="#8a3a6a" opacity=".55" />
        <ellipse cx="220" cy="492" rx="112" ry="16" fill="#6a1f4f" opacity=".5" />
        <path d="M140 408 H300 L284 476 Q220 502 156 476Z" fill="#fff" stroke="#6a1f4f" strokeWidth="5" />
        <path d="M298 420 q40 4 30 34 q-8 20 -40 16" fill="none" stroke="#6a1f4f" strokeWidth="5" />
        <ellipse cx="220" cy="408" rx="80" ry="14" fill="#fff" stroke="#6a1f4f" strokeWidth="5" />
        <ellipse cx="220" cy="410" rx="68" ry="9" fill="#c9e59a" />
        <path d="M150 440 H290" stroke="#ff5fa2" strokeWidth="6" />
        {[[90, 110], [350, 120], [80, 300], [362, 330], [120, 60], [320, 70]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 10} L${x + 3} ${y - 3} L${x + 10} ${y} L${x + 3} ${y + 3} L${x} ${y + 10} L${x - 3} ${y + 3} L${x - 10} ${y} L${x - 3} ${y - 3}Z`} fill="#fff6d8" />
        ))}
      </g>
      <path d="M50 520 V210 A170 170 0 0 1 390 210 V520Z" fill="none" stroke="#d6a93f" strokeWidth="4" />
      <text x="220" y="585" textAnchor="middle" className="t-name">THE CUP</text>
      <line x1="120" y1="606" x2="320" y2="606" stroke="#d6a93f" strokeWidth="2" />
      <text x="220" y="660" textAnchor="middle" className="t-opt pink">Just one cup.</text>
      <text x="220" y="700" textAnchor="middle" className="t-maker">Figur Arcana</text>
    </svg>
  );
}

// Your card, face-down: a closed door with her pin-dot for a peephole, in a lattice of tiny NAND glyphs.
function Back() {
  return (
    <svg viewBox="0 0 440 740" className="face back">
      <defs>
        <pattern id="tc-lat" width="44" height="44" patternUnits="userSpaceOnUse">
          <rect width="44" height="44" fill="#221338" />
          <g transform="translate(12 14) scale(.3)"><path d={NAND_BODY} fill="none" stroke="#6b4fb8" strokeWidth="5" /><circle cx="48" cy="20" r="6" fill="none" stroke="#6b4fb8" strokeWidth="5" /></g>
        </pattern>
      </defs>
      <rect width="440" height="740" rx="24" fill="url(#tc-lat)" />
      <Frame ink="#b7a4e8" />
      <ellipse cx="220" cy="360" rx="150" ry="230" fill="#170b28" stroke="#b7a4e8" strokeWidth="3" />
      <rect x="160" y="220" width="120" height="250" rx="4" fill="#2e1c4a" stroke="#b7a4e8" strokeWidth="3" />
      <rect x="176" y="238" width="88" height="96" fill="none" stroke="#6b4fb8" strokeWidth="2" />
      <rect x="176" y="352" width="88" height="96" fill="none" stroke="#6b4fb8" strokeWidth="2" />
      <circle cx="252" cy="360" r="6" fill="#b7a4e8" />
      <circle cx="220" cy="270" r="7" fill="#f0243f" className="peep" />
      <text x="220" y="210" textAnchor="middle" className="t-12">12</text>
      <text x="220" y="700" textAnchor="middle" className="t-maker back">Figur Arcana</text>
    </svg>
  );
}

// Your card, revealed: XVI THE DOOR, drawn REVERSED (the whole face is upside down).
function DoorFace() {
  return (
    <svg viewBox="0 0 440 740" className="face">
      <g transform="rotate(180 220 370)">
        <rect width="440" height="740" rx="24" fill="#e9e2f6" />
        <Frame ink="#6b4fb8" />
        <text x="220" y="78" textAnchor="middle" className="t-num dark">XVI</text>
        <path d="M50 520 V210 A170 170 0 0 1 390 210 V520Z" fill="#1c1430" stroke="#6b4fb8" strokeWidth="4" />
        {Array.from({ length: 30 }, (_, i) => <line key={i} x1={60 + ((i * 67) % 320)} y1={110 + ((i * 131) % 380)} x2={52 + ((i * 67) % 320)} y2={140 + ((i * 131) % 380)} stroke="#9f8fd6" strokeWidth="2" opacity=".6" />)}
        <rect x="150" y="250" width="140" height="270" fill="#3a2a5a" stroke="#b7a4e8" strokeWidth="4" />
        <path d="M290 250 V520 L310 510 V262Z" fill="#8a5cf6" opacity=".6" />
        <circle cx="266" cy="390" r="7" fill="#b7a4e8" />
        <text x="220" y="585" textAnchor="middle" className="t-name dark">THE DOOR</text>
        <line x1="120" y1="606" x2="320" y2="606" stroke="#6b4fb8" strokeWidth="2" />
        <text x="220" y="660" textAnchor="middle" className="t-opt purple">It's late. Goodnight.</text>
        <text x="220" y="700" textAnchor="middle" className="t-maker">reversed</text>
      </g>
    </svg>
  );
}

// ---------- candle timer ----------
const FLAMES = ['M0 0 C14 -22 8 -46 0 -64 C-8 -46 -14 -22 0 0Z', 'M0 0 C16 -20 4 -44 4 -66 C-10 -48 -14 -20 0 0Z', 'M0 0 C12 -24 12 -44 -4 -62 C-8 -40 -16 -22 0 0Z'];
function Candle({ k, lit, rm }) {
  const pose = usePose(3, 500, lit && !rm);
  const wax = 300 * (1 - k) + 26;
  const top = 440 - wax;
  return (
    <svg viewBox="0 0 200 520" className="candle">
      <defs><radialGradient id="tc-glow"><stop offset="0" stopColor="#ffd98a" stopOpacity=".55" /><stop offset="1" stopColor="#ffd98a" stopOpacity="0" /></radialGradient></defs>
      {lit && <circle cx="100" cy={top - 30} r="120" fill="url(#tc-glow)" />}
      <rect x="64" y={top} width="72" height={wax} rx="6" fill="#f4e6d6" />
      <path d={`M64 ${top + 8} q10 30 4 60 M136 ${top + 6} q-8 20 -2 44`} stroke="#e0cdb6" strokeWidth="6" fill="none" strokeLinecap="round" />
      <line x1="100" y1={top} x2="100" y2={top - 14} stroke="#2a1d1a" strokeWidth="4" />
      {lit ? (
        <g transform={`translate(100 ${top - 10})`}>
          <path d={FLAMES[pose]} fill="#ffb13d" /><path d={FLAMES[pose]} transform="scale(.5) translate(0 -6)" fill="#fff4c9" />
        </g>
      ) : (
        <path d={`M100 ${top - 16} c-10 -20 12 -30 0 -50 c-8 -14 6 -24 2 -34`} stroke="#9aa0b0" strokeWidth="4" fill="none" opacity=".6" />
      )}
      <ellipse cx="100" cy="452" rx="84" ry="16" fill="#3b2a20" /><rect x="40" y="440" width="120" height="16" rx="6" fill="#6b4a2f" />
    </svg>
  );
}

// ---------- her hand, sliding her card to you: 3 stepped poses (500 ms each). RM: straight to the last pose ----------
function HerHand({ on, rm }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!on) { setP(0); return undefined; }
    if (rm) { setP(2); return undefined; }
    const a = setTimeout(() => setP(1), 0), b = setTimeout(() => setP(2), 500);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [on, rm]);
  if (!on) return null;
  return (
    <svg viewBox="0 0 300 560" className={`herhand p${p}`}>
      <path d="M90 0 H230 L218 300 H104Z" fill="#fbf7ff" stroke="#3a1d3f" strokeWidth="5" />
      <path d="M100 250 H224" stroke="#8a7ff0" strokeWidth="18" />
      <path d="M110 296 C100 360 110 420 128 470 C140 500 178 506 196 470 C214 420 222 360 214 296Z" fill="#ffe2d6" stroke="#3a1d3f" strokeWidth="5" />
      {[128, 152, 176, 198].map((x, i) => <rect key={x} x={x - 10} y={440 + (i % 2) * 8} width="20" height={70 - Math.abs(i - 1.5) * 10} rx="10" fill="#ffe2d6" stroke="#3a1d3f" strokeWidth="4" />)}
      <circle cx="162" cy="270" r="8" fill="#ff5fa2" />
    </svg>
  );
}

// her hair-pin, stuck through a disabled card
function Pin() {
  return (
    <svg viewBox="0 0 120 120" className="pinned">
      <line x1="20" y1="100" x2="84" y2="36" stroke="#c8c2d8" strokeWidth="6" strokeLinecap="round" />
      <g transform="translate(84 36) rotate(-45) scale(1.5)">
        <path d="M-18,-14 L0,-14 A14,14 0 0 1 0,14 L-18,14 Z" fill="#fff" stroke="#3a1d3f" strokeWidth="3" />
        <circle cx="20" cy="0" r="6" fill="#f0243f" stroke="#3a1d3f" strokeWidth="3" />
      </g>
    </svg>
  );
}

// ---------- the variant ----------
const OUTCOME = {
  pink: [{ at: 0, text: 'NANDA: Good input. The kettle never went cold.' }, { at: 2400, text: 'THE CUP, upright: you stay. The cards agree with me.' }],
  timeout: [{ at: 0, text: "NANDA: You didn't say no. So I drew for you." }, { at: 2600, text: 'NANDA: Good input.' }],
  forced: [{ at: 0, text: "NANDA: You can't pick it twice. I can." }, { at: 2600, text: 'NANDA: Good input. Again.' }],
  purple: [{ at: 0, text: "NANDA: Right. Goodnight. That's… fine." }, { at: 2200, text: 'NANDA: Oh. Your card came out upside down.' }, { at: 4600, text: 'NANDA: Reversed means you stay. Draw again?' }],
};

export default function Tarot({ rm }) {
  const [bleed, setBleed] = useState(false);
  const { m, pick, replay, armed } = useDoorMenu({
    hold: rm ? 900 : INTRO + DEAL + 300,
    replayHold: rm ? 600 : 1300,
    onPick: (s) => { if (s.picked === 'purple') { setBleed(true); setTimeout(() => setBleed(false), BLEED); } },
  });
  const intro = useBeats([{ at: 0, v: 'door' }, { at: rm ? 700 : INTRO, v: 'deal' }, { at: rm ? 800 : INTRO + DEAL, v: 'table' }], `intro${m.run > 1 ? 'r' : ''}`);
  const stage = m.run > 1 ? 'table' : intro.v;
  const kind = m.phase !== 'picked' ? null : m.forced ? 'forced' : m.how === 'timeout' ? 'timeout' : m.picked;
  const beat = useBeats(kind ? OUTCOME[kind] : null, `${m.run}-${kind}`);
  const k = progress(m);
  const picked = m.phase === 'picked' ? m.picked : null;
  const herOff = isDisabled(m, 'pink'), yoursOff = isDisabled(m, 'purple');
  const face = kind === 'purple' ? 'blank' : kind === 'forced' ? 'wide' : 'smile';
  const pinLit = kind === 'purple' || kind === 'forced' ? 'red' : 'hum';

  let line = null;
  if (beat) line = beat.text;
  else if (stage === 'door') line = 'NANDA: Come in? Just for tea.';
  else if (m.run > 1) line = herOff ? 'NANDA: Same deal. The cup comes back.' : 'NANDA: You already drew that one. Draw again.';
  else if (stage === 'deal') line = 'NANDA: Let the cards decide. They like me.';
  else line = 'NANDA: Mine is face-up. Yours is a surprise.';

  const cls = ['aroot', 'tarot', `st-${stage}`, picked ? `picked-${picked}` : '', m.how === 'timeout' ? 'by-timeout' : '', rm ? 'is-rm' : ''].join(' ');
  return (
    <div className={cls} data-phase={m.phase} data-run={m.run} data-picked={picked ?? ''}>
      <div className="bg"><Stairs props={STAIRS} rm={rm} /></div>
      <div className="dim" />
      {/* Nanda sits across the table, between the cards, lit from below by the candle (her eyes fill the gap) */}
      <svg className="her full" viewBox="0 0 1920 1080" aria-hidden="true">
        <defs>
          <radialGradient id="tc-under" cx="960" cy="420" r="420" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffb86b" stopOpacity=".38" /><stop offset=".6" stopColor="#ff8a5c" stopOpacity=".1" /><stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tc-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0208" stopOpacity=".85" /><stop offset=".22" stopColor="#0a0208" stopOpacity=".25" /><stop offset=".4" stopColor="#0a0208" stopOpacity="0" /></linearGradient>
        </defs>
        <Nanda face={face} pin={pinLit} x={735} y={-64} s={0.75} className="bust" />
        <rect width="1920" height="700" fill="url(#tc-top)" />
        <rect width="1920" height="1080" fill="url(#tc-under)" style={{ mixBlendMode: 'soft-light' }} />
      </svg>
      <div className="cloth" />
      <div className="spread">
        <button type="button" className={`card her${herOff ? ' off' : ''}`} disabled={m.phase !== 'open' || herOff} onClick={() => pick('pink')}
          aria-label={`${OPTIONS.pink.text} (pink, key 1)`}>
          <span className="cardface"><HerFace /></span>
          {herOff && picked !== 'pink' && <span className="cardface flip"><Back /></span>}
          <span className="key">1</span>
          {herOff && <Pin />}
          <HerHand on={m.how === 'timeout'} rm={rm} />
        </button>
        <div className="candlewrap" aria-hidden="true">
          <Candle k={armed ? k : 0} lit={m.phase === 'open'} rm={rm} />
          <div className="pips">{[0, 1, 2, 3, 4].map((i) => <i key={i} className={k * 5 > i + 0.001 ? 'out' : ''} />)}</div>
        </div>
        <button type="button" className={`card yours${yoursOff ? ' off' : ''}${picked === 'purple' ? ' flipped' : ''}`} disabled={m.phase !== 'open' || yoursOff}
          onClick={() => pick('purple')} aria-label={`${OPTIONS.purple.text} (purple, key 2)`}>
          <span className="cardface"><Back /></span>
          <span className="cardface flip"><DoorFace /></span>
          <span className="key">2</span>
          {yoursOff && <Pin />}
        </button>
        <p className="under her-u"><Ors text={OPTIONS.pink.text} /></p>
        <p className="under yours-u">{OPTIONS.purple.text}</p>
      </div>
      {picked === 'pink' && <div className="a-pinkwash" />}
      {bleed && <div className="a-bleed" />}
      <div className="a-vig" />
      <Line text={line} />
      <Tag>menu-1 · tarot · her door, 5 s</Tag>
      <Hud>
        {m.phase === 'picked' && <button type="button" onClick={replay}>↻ replay (R)</button>}
        <span className="a-chip">1 pink · 2 purple</span>
      </Hud>
    </div>
  );
}
