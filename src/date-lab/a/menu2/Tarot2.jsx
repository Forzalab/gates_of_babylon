// menu-1-r2 TAROT, improved (horror 2). School: CLAMP / Persona arcana x Argento's Suspiria candlelight (unchanged).
// Central theme: FATE IS DEALT BY HER. Round-2 goal: the asymmetry must read WITHOUT the caption, and "disabled" must read
// from the back row.
//   - Her HAND rests on your face-down card from the deal onward (two fingertips on its top edge): she is holding your choice
//     down. Hover her card: it lifts. Hover yours: it barely moves (her fingers). No words needed.
//   - Your card WARMS toward her pink with each candle pip (5 held steps, 1 s each): the candle is hers too.
//   - A third place is set on the cloth: an empty card slot with a cup glyph (the third cup; it is always empty — for now).
//   - Option text lives once, on a slip across each card (no duplicate labels); caption line only adds flavour.
//   - Replay: the drawn card is pinned with her 5x hair-pin (red puncture ring), DRAWN stamp, slip struck through, note under it.
// Timeout: her hand leaves your card and slides THE CUP to you (3 held poses). Purple: flip, REVERSED, 334 ms bleed.
// RM: no deal / flip / slide / lift; warmth jumps with the pips (they are already held steps); bleed is one 334 ms hold.
import { useState } from 'react';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import { useDoorMenu, useBeats } from '../kit/hooks.js';
import { OPTIONS, BLEED, progress, isDisabled } from '../kit/menu.js';
import { Line, Hud, Tag, Ors } from '../kit/ui.jsx';
import { Nanda } from '../kit/Sprite.jsx';
import { HerFace, Back, DoorFace, Candle, HerHand, Disabled } from './cards.jsx';
import './tarot2.css';
import './tarot2b.css';

const STAIRS = { door: 'ajar' };
const INTRO = 1200, DEAL = 1000;

// her hand resting on your card: sleeve from upper-left (her side of the table), two fingertips on the card's top edge
function HoldingHand() {
  return (
    <svg className="holding" viewBox="0 0 420 300" aria-hidden="true">
      <defs>
        {/* the sleeve comes out of the dark on her side of the table */}
        <linearGradient id="t2b-fade" x1="0" y1="0" x2="1" y2="0"><stop offset=".05" stopColor="#fff" stopOpacity="0" /><stop offset=".42" stopColor="#fff" stopOpacity="1" /></linearGradient>
        <mask id="t2b-mask" maskUnits="userSpaceOnUse" x="-40" y="0" width="480" height="300"><rect x="-40" width="480" height="300" fill="url(#t2b-fade)" /></mask>
      </defs>
      <g mask="url(#t2b-mask)">
      <path d="M0 40 L170 118 L150 176 L-20 110Z" fill="#fbf7ff" stroke="#3a1d3f" strokeWidth="6" strokeLinejoin="round" />
      <path d="M150 112 L136 180" stroke="#8a7ff0" strokeWidth="20" />
      <path d="M160 116 C210 118 262 140 300 176 C318 194 300 214 278 206 L250 196 C236 204 214 206 196 196 C176 186 158 176 150 170Z" fill="#ffe2d6" stroke="#3a1d3f" strokeWidth="6" strokeLinejoin="round" />
      {/* index + middle fingertips pressing down on the edge, nails in her red */}
      <path d="M276 168 C300 190 314 222 312 252 C311 266 294 268 290 254 C286 232 276 212 262 196Z" fill="#ffe2d6" stroke="#3a1d3f" strokeWidth="6" strokeLinejoin="round" />
      <path d="M244 184 C262 208 270 236 266 262 C264 276 246 276 244 262 C242 240 236 220 224 204Z" fill="#ffe2d6" stroke="#3a1d3f" strokeWidth="6" strokeLinejoin="round" />
      <ellipse cx="302" cy="252" rx="8" ry="6" fill="#f0243f" /><ellipse cx="255" cy="262" rx="8" ry="6" fill="#f0243f" />
      <circle cx="146" cy="146" r="9" fill="#ff5fa2" />
      </g>
    </svg>
  );
}

function Slip({ tone, text, struck }) {
  return <span className={`slip ${tone}${struck ? ' struck' : ''}`}><span className="stxt"><Ors text={text} /></span></span>;
}

const OUTCOME = {
  pink: [{ at: 0, text: 'NANDA: Good input. The kettle never went cold.' }, { at: 2400, text: 'NANDA: THE CUP, upright. The cards agree with me.' }],
  timeout: [{ at: 0, text: "NANDA: You didn't say no. So I drew for you." }, { at: 2600, text: 'NANDA: Good input.' }],
  forced: [{ at: 0, text: "NANDA: You can't pick it twice. I can." }, { at: 2600, text: 'NANDA: Good input. Again.' }],
  purple: [{ at: 0, text: "NANDA: Right. Goodnight. That's… fine." }, { at: 2200, text: 'NANDA: Oh. Your card came out upside down.' }, { at: 4600, text: 'NANDA: Reversed means you stay. Draw again?' }],
};

export default function Tarot2({ rm }) {
  const [bleed, setBleed] = useState(false);
  const { m, pick, replay, armed } = useDoorMenu({
    hold: rm ? 900 : INTRO + DEAL + 300,
    replayHold: rm ? 600 : 1300,
    onPick: (s) => { if (s.picked === 'purple') { setBleed(true); setTimeout(() => setBleed(false), BLEED); } },
  });
  const intro = useBeats([{ at: 0, v: 'door' }, { at: rm ? 500 : INTRO, v: 'deal' }, { at: rm ? 700 : INTRO + DEAL, v: 'table' }], 'intro');
  const stage = m.run > 1 ? 'table' : intro.v;
  const kind = m.phase !== 'picked' ? null : m.forced ? 'forced' : m.how === 'timeout' ? 'timeout' : m.picked;
  const beat = useBeats(kind ? OUTCOME[kind] : null, `${m.run}-${kind}`);
  const k = armed ? progress(m) : 0;
  const pips = Math.min(5, Math.floor(k * 5 + 1e-6));
  const picked = m.phase === 'picked' ? m.picked : null;
  const herOff = isDisabled(m, 'pink'), yoursOff = isDisabled(m, 'purple');
  const face = kind === 'purple' ? 'blank' : kind === 'forced' ? 'wide' : 'smile';
  const pinLit = kind === 'purple' || kind === 'forced' ? 'red' : 'hum';
  // your card warms one step per burnt pip (her candle, her colour); after a pink outcome it is simply hers
  const warm = picked === 'pink' ? 1 : picked === 'purple' ? 0 : pips / 5;
  const holding = stage !== 'door' && m.phase === 'open' && !yoursOff;

  let line = null;
  if (beat) line = beat.text;
  else if (stage === 'door') line = 'NANDA: Come in? Just for tea.';
  else if (m.run > 1) line = herOff ? 'NANDA: Same deal. The cup comes back.' : 'NANDA: You already drew that one. Draw again.';
  else if (stage === 'deal') line = 'NANDA: Let the cards decide. They like me.';
  else line = 'NANDA: Pick one. Take your time.';

  const cls = ['aroot', 't2', 'tarot2', `st-${stage}`, picked ? `picked-${picked}` : '', m.how === 'timeout' ? 'by-timeout' : '', holding ? 'is-held' : '', rm ? 'is-rm' : ''].join(' ');
  return (
    <div className={cls} data-phase={m.phase} data-run={m.run} data-picked={picked ?? ''} data-warm={warm}>
      <div className="bg"><Stairs props={STAIRS} rm={rm} /></div>
      <div className="dim" />
      <svg className="her full" viewBox="0 0 1920 1080" aria-hidden="true">
        <defs>
          <linearGradient id="t2b-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0208" stopOpacity=".85" /><stop offset=".22" stopColor="#0a0208" stopOpacity=".25" /><stop offset=".4" stopColor="#0a0208" stopOpacity="0" /></linearGradient>
        </defs>
        <Nanda face={face} pin={pinLit} x={735} y={-64} s={0.75} className="bust" />
        <rect width="1920" height="700" fill="url(#t2b-top)" />
      </svg>
      <div className="cloth" />
      {/* the third place: an empty slot on the cloth, a cup drawn in chalk. Nobody deals into it. */}
      <div className="third" aria-hidden="true">
        <svg viewBox="0 0 200 330"><path d="M60 170 H140 L132 214 Q100 230 68 214Z" fill="none" stroke="#d6a93f" strokeWidth="5" opacity=".7" /><path d="M140 180 q24 2 18 22 q-6 12 -24 10" fill="none" stroke="#d6a93f" strokeWidth="5" opacity=".7" /><text x="100" y="286" textAnchor="middle">III</text></svg>
      </div>
      <div className="spread">
        <button type="button" className={`card her${herOff ? ' off' : ''}`} disabled={m.phase !== 'open' || herOff} onClick={() => pick('pink')}
          aria-label={`${OPTIONS.pink.text} (pink, key 1)`}>
          <span className="cardface"><HerFace /></span>
          {herOff && picked !== 'pink' && <span className="cardface flip"><Back warm={1} /></span>}
          <Slip tone="pink" text={OPTIONS.pink.text} struck={herOff} />
          <span className="key">1</span>
          {herOff && <Disabled note="you picked this. keep it." />}
          <HerHand on={m.how === 'timeout'} rm={rm} />
        </button>
        <div className="candlewrap" aria-hidden="true">
          <Candle k={k} lit={m.phase === 'open'} rm={rm} />
          <div className="pips">{[0, 1, 2, 3, 4].map((i) => <i key={i} className={pips > i ? 'out' : ''} />)}</div>
        </div>
        <button type="button" className={`card yours${yoursOff ? ' off' : ''}${picked === 'purple' ? ' flipped' : ''}`} disabled={m.phase !== 'open' || yoursOff}
          onClick={() => pick('purple')} aria-label={`${OPTIONS.purple.text} (purple, key 2)`} style={{ '--warm': warm }}>
          <span className="cardface"><Back warm={warm} /></span>
          <span className="cardface flip"><DoorFace /></span>
          <Slip tone={warm >= 0.6 && !picked ? 'purple warm' : 'purple'} text={OPTIONS.purple.text} struck={yoursOff} />
          <span className="key">2</span>
          {yoursOff && <Disabled note="you already tried that." />}
          {holding && <HoldingHand />}
        </button>
      </div>
      {picked === 'pink' && <div className="a-pinkwash" />}
      {bleed && <div className="a-bleed" />}
      <div className="a-vig" />
      <Line text={line} />
      <Tag>menu-1-r2 · tarot · her door, 5 s</Tag>
      <Hud>
        {m.phase === 'picked' && <button type="button" onClick={replay}>↻ replay (R)</button>}
        <span className="a-chip">1 pink · 2 purple</span>
      </Hud>
    </div>
  );
}
