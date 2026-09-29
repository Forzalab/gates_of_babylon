// menu-h1-r3 "THE CUP THAT TYPES", round 3 (hybrid menu-1 tarot x menu-3 DDLC, horror 4).
// Same theme as r2: SHE REWRITES YOUR CARD WHILE THE CANDLE BURNS. Round-3 fixes (R2-VERDICT trial-3 slate):
//   1. Typing <= 2 glyph swaps per second: the edit is whole-chunk swaps held 500 ms each
//      ("Goodnight." goes red-selected -> deleted -> "Sta" -> "Stay."), not one key every 250 ms.
//   2. Her pointer is HER HAND (drawn, red nail, pink cuff), not a white UI arrow: one grammar on a diegetic table.
//   3. The Figur Arcana print is back on both cards (bottom edge, under the slip).
//   4. Slips 54 px, "NANDA is typing…" 40 px (both >= 44 / 34 px on a projector).
// RM: no deal / flip / slide, every edit = <= 3 hard cuts held 1 s, caret doesn't blink, bleed stays one 334 ms hold.
import { useMemo, useState } from 'react';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import { useDoorMenu, useBeats, useClock } from '../kit/hooks.js';
import { OPTIONS, BLEED, progress, isDisabled } from '../kit/menu.js';
import { Line, Hud, Tag, Ors } from '../kit/ui.jsx';
import { Nanda } from '../kit/Sprite.jsx';
import { HerFace, Back, DoorFace, Candle, HerHand, Disabled } from '../menu2/cards.jsx';
import HerPointer from './HerPointer.jsx';
import { frameAt, endOf, doneAt } from './chunks.js';
import { cupScript, leaEdit, STAY } from './script3.js';
import '../menu2/tarot2.css';
import './menu3.css';

const STAIRS = { door: 'ajar' };
const INTRO = 1000, DEAL = 900;

// Text with the trailing `sel` chars in her red selection.
export function Sel({ text, sel }) {
  if (!sel) return <Ors text={text} />;
  return <><Ors text={text.slice(0, text.length - sel)} /><mark className="hsel">{text.slice(text.length - sel)}</mark></>;
}
// Her caret + her hand at the end of the text. `tap` flips on every swap (a held pose).
export function Cursor({ tap }) {
  return <span className="curs"><i className="caret" /><HerPointer tap={tap} /></span>;
}

function Typed({ frames }) {
  const [t] = useClock();
  const f = frameAt(frames, t);
  return <><Sel text={f.text} sel={f.sel} />{t < endOf(frames) + 500 && <Cursor tap={frames.indexOf(f) % 2} />}</>;
}

function Slip({ tone, frame, cursor, tap, struck, children }) {
  return (
    <span className={`slip ${tone}${struck ? ' struck' : ''}`}>
      <span className="stxt">{children ?? <Sel text={frame.text} sel={frame.sel} />}{cursor && <Cursor tap={tap} />}</span>
    </span>
  );
}

const Print = ({ n }) => <span className="print" aria-hidden="true"><i>Figur Arcana</i><b>{n}</b></span>;

const OUT = {
  pink: [{ at: 0, text: 'NANDA: Good input. The kettle never went cold.' }, { at: 2600, text: 'NANDA: See? The cards agree with me.' }],
  timeout: [{ at: 0, text: "NANDA: You didn't say no. So I drew for you." }, { at: 2600, text: 'NANDA: Good input.' }],
  forced: [{ at: 0, text: "NANDA: You can't pick it twice. I can." }, { at: 2600, text: 'NANDA: Both cards say it now. Like us.' }],
  purple: [{ at: 0, text: 'NANDA: You read the old text. Cheater.' }, { at: 2400, text: 'NANDA: Oh. Your card came out upside down.' }, { at: 4800, text: 'NANDA: Reversed means you stay. Draw again?' }],
};

export default function CupTypes3({ rm }) {
  const [bleed, setBleed] = useState(false);
  const { m, pick, replay, armed } = useDoorMenu({
    hold: rm ? 900 : INTRO + DEAL + 200,
    replayHold: rm ? 600 : 1300,
    onPick: (s) => { if (s.picked === 'purple') { setBleed(true); setTimeout(() => setBleed(false), BLEED); } },
  });
  const intro = useBeats([{ at: 0, v: 'door' }, { at: rm ? 500 : INTRO, v: 'deal' }, { at: rm ? 700 : INTRO + DEAL, v: 'table' }], 'intro');
  const stage = m.run > 1 ? 'table' : intro.v;
  const kind = m.phase !== 'picked' ? null : m.forced ? 'forced' : m.how === 'timeout' ? 'timeout' : m.picked;
  const beat = useBeats(kind ? OUT[kind] : null, `${m.run}-${kind}`);
  const picked = m.phase === 'picked' ? m.picked : null;
  const herOff = isDisabled(m, 'pink'), yoursOff = isDisabled(m, 'purple');

  const script = useMemo(() => cupScript(m.run, m.disabled, rm), [m.run, m.disabled, rm]);
  const t = armed ? m.t : -1;
  const open = m.phase === 'open';
  const pinkF = frameAt(script.pink, t), purpleF = frameAt(script.purple, t);
  const typingFrames = script[script.typing];
  const tap = typingFrames.indexOf(frameAt(typingFrames, t)) % 2;
  const editing = open && stage !== 'door' && t < endOf(typingFrames) + 500;
  const typedDone = t >= endOf(typingFrames);
  // your card warms toward her pink with each of her swaps (held >= 500 ms); once she has "fixed" it, it stays warm
  const q = (k) => Math.round(k * 4) / 4;
  const warm = script.typing === 'purple' ? (picked ? (picked === 'purple' ? 0 : 1) : q(doneAt(script.purple, t))) : script.warmFrom;
  const face = kind === 'purple' ? 'blank' : kind === 'forced' ? 'wide' : 'smile';
  const pinLit = kind === 'purple' || kind === 'forced' ? 'red' : editing ? 'flicker' : 'hum';

  let line = null;
  if (beat) line = beat.text;
  else if (stage === 'door') line = 'NANDA: Come in? Just for tea.';
  else if (m.run > 1) line = herOff ? 'NANDA: Same deal. I fixed yours to match.' : 'NANDA: You already drew that one. Draw again.';
  else if (!armed) line = 'NANDA: Let the cards decide. They like me.';
  else if (!typedDone) line = 'NANDA: Yours has a typo. Hold still.';
  else line = 'NANDA: There. Now it says what you meant.';

  const cls = ['aroot', 't2', 't3', 'cuptypes', `st-${stage}`, picked ? `picked-${picked}` : '', m.how === 'timeout' ? 'by-timeout' : '', rm ? 'is-rm' : ''].join(' ');
  const k = armed ? progress(m) : 0;
  return (
    <div className={cls} data-phase={m.phase} data-run={m.run} data-picked={picked ?? ''} data-warm={warm}>
      <div className="bg"><Stairs props={STAIRS} rm={rm} /></div>
      <div className="dim" />
      <svg className="her full" viewBox="0 0 1920 1080" aria-hidden="true">
        <defs>
          <linearGradient id="t3-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0208" stopOpacity=".85" /><stop offset=".22" stopColor="#0a0208" stopOpacity=".25" /><stop offset=".4" stopColor="#0a0208" stopOpacity="0" /></linearGradient>
        </defs>
        <Nanda face={face} pin={pinLit} x={735} y={-64} s={0.75} className="bust" />
        <rect width="1920" height="700" fill="url(#t3-top)" />
      </svg>
      <div className="cloth" />
      <div className="spread">
        <button type="button" className={`card her${herOff ? ' off' : ''}`} disabled={!open || herOff} onClick={() => pick('pink')}
          aria-label={`${pinkF.text} (pink, key 1)`}>
          <span className="cardface"><HerFace /></span>
          {herOff && picked !== 'pink' && <span className="cardface flip"><Back warm={1} /></span>}
          <Print n="VI" />
          <Slip tone="pink" frame={pinkF} struck={herOff} tap={tap} cursor={script.typing === 'pink' && editing} />
          <span className="key">1</span>
          {herOff && <Disabled note="you picked this. keep it." />}
          <HerHand on={m.how === 'timeout'} rm={rm} />
        </button>
        <div className="candlewrap" aria-hidden="true">
          <Candle k={k} lit={open} rm={rm} />
          <div className="pips">{[0, 1, 2, 3, 4].map((i) => <i key={i} className={k * 5 > i + 0.001 ? 'out' : ''} />)}</div>
        </div>
        <button type="button" className={`card yours${yoursOff ? ' off' : ''}${picked === 'purple' ? ' flipped' : ''}`} disabled={!open || yoursOff}
          onClick={() => pick('purple')} aria-label={`${OPTIONS.purple.text} (purple, key 2)`} style={{ '--warm': warm }}>
          <span className="cardface"><Back warm={warm} /></span>
          <span className="cardface flip"><DoorFace /></span>
          <Print n={picked === 'purple' ? 'XVI' : '?'} />
          <Slip tone={warm >= 0.75 && !picked ? 'purple warm' : 'purple'} frame={yoursOff ? { text: STAY, sel: 0 } : purpleF} struck={yoursOff} tap={tap}
            cursor={script.typing === 'purple' && (editing || (stage === 'deal' && !armed))}>
            {picked === 'purple' ? <Typed key={m.run} frames={leaEdit(rm)} /> : null}
          </Slip>
          <span className="key">2</span>
          {yoursOff && <Disabled note="you already tried that." />}
        </button>
        {editing && <p className={`typing ${script.typing}`}>NANDA is typing<b>…</b></p>}
      </div>
      {picked === 'pink' && <div className="a-pinkwash" />}
      {bleed && <div className="a-bleed" />}
      <div className="a-vig" />
      <Line text={line} />
      <Tag>menu-h1-r3 · the cup that types</Tag>
      <Hud>
        {m.phase === 'picked' && <button type="button" onClick={replay}>↻ replay (R)</button>}
        <span className="a-chip">1 pink · 2 purple</span>
      </Hud>
    </div>
  );
}
