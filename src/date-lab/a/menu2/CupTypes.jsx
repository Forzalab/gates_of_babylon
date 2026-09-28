// menu-h1-r2 "THE CUP THAT TYPES" (hybrid menu-1 tarot x menu-3 DDLC, horror 4).
// School: CLAMP arcana + Suspiria candlelight (menu-1) x DDLC / Funny Games live edit (menu-3).
// Central theme: SHE REWRITES YOUR CARD WHILE THE CANDLE BURNS. The table is warm and diegetic; the horror is her cursor.
//   - The deal lands with her red caret + her white/red cursor ALREADY parked on your face-down card (the first-seconds tell).
//   - As the candle burns, the cursor backspaces your slip one key every 250 ms: "It's late. Goodnight." -> "It's late. Stay."
//     and your card warms from cold purple to her pink in 4 held steps. Purple still MEANS leave (pick it: "Cheater.").
//   - Timeout: her hand (3 held poses) slides her card to you = pink.
//   - Replay: the card you drew is pinned through with her hair-pin, DRAWN, and its slip is her retyped text struck through.
//     Pink disabled? She retypes YOUR whole slip into "Just one cup." and still draws pink on timeout.
// RM: no deal/flip/slide motion, every edit = 3 hard cuts held 1 s, caret does not blink, bleed stays one 334 ms hold.
import { useMemo, useState } from 'react';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import { useDoorMenu, useBeats, useClock } from '../kit/hooks.js';
import { OPTIONS, BLEED, progress, isDisabled } from '../kit/menu.js';
import { retype } from '../kit/retype.js';
import { Line, Hud, Tag, Ors } from '../kit/ui.jsx';
import { Nanda } from '../kit/Sprite.jsx';
import { HerFace, Back, DoorFace, Candle, HerHand, Disabled } from './cards.jsx';
import { cupScript, textAt, endOf, warmAt, STAY } from './script.js';
import './tarot2.css';

const STAIRS = { door: 'ajar' };
const INTRO = 1000, DEAL = 900;

// Her cursor: DDLC arrow, white with her red edge. Sits right after the caret, so it walks with the typing.
export function HerArrow() {
  return (
    <svg className="herarrow" viewBox="0 0 40 60" aria-hidden="true">
      <path d="M2 2 L2 46 L13 36 L21 55 L29 51 L21 33 L36 33Z" fill="#fff" stroke="#f0243f" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

function Typed({ frames }) {
  const [t] = useClock();
  return <>{textAt(frames, t)}{t < endOf(frames) + 500 && <span className="curs"><i className="caret" /><HerArrow /></span>}</>;
}

// The paper slip tucked into a card: the option text, once. `cursor` = her caret + arrow at the end of the text.
function Slip({ tone, text, cursor, struck, children }) {
  return (
    <span className={`slip ${tone}${struck ? ' struck' : ''}`}>
      <span className="stxt">{children ?? <Ors text={text} />}{cursor && <span className="curs"><i className="caret" /><HerArrow /></span>}</span>
    </span>
  );
}

const OUT = {
  pink: [{ at: 0, text: 'NANDA: Good input. The kettle never went cold.' }, { at: 2600, text: 'NANDA: See? The cards agree with me.' }],
  timeout: [{ at: 0, text: "NANDA: You didn't say no. So I drew for you." }, { at: 2600, text: 'NANDA: Good input.' }],
  forced: [{ at: 0, text: "NANDA: You can't pick it twice. I can." }, { at: 2600, text: 'NANDA: Both cards say it now. Like us.' }],
  purple: [{ at: 0, text: 'NANDA: You read the old text. Cheater.' }, { at: 2400, text: 'NANDA: Oh. Your card came out upside down.' }, { at: 4800, text: 'NANDA: Reversed means you stay. Draw again?' }],
};

export default function CupTypes({ rm }) {
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
  const pinkText = textAt(script.pink, t), purpleText = textAt(script.purple, t);
  const typingFrames = script[script.typing];
  const editing = open && stage !== 'door' && t < endOf(typingFrames) + 300;
  const typedDone = t >= endOf(typingFrames);
  // your card warms toward her pink as she types (4 held steps); after she has "fixed" it, it stays warm
  const warm = script.typing === 'purple' ? (picked ? (picked === 'purple' ? 0 : 1) : warmAt(script.purple, t)) : script.warmFrom;
  const face = kind === 'purple' ? 'blank' : kind === 'forced' ? 'wide' : 'smile';
  const pinLit = kind === 'purple' || kind === 'forced' ? 'red' : editing ? 'flicker' : 'hum';

  let line = null;
  if (beat) line = beat.text;
  else if (stage === 'door') line = 'NANDA: Come in? Just for tea.';
  else if (m.run > 1) line = herOff ? 'NANDA: Same deal. I fixed yours to match.' : 'NANDA: You already drew that one. Draw again.';
  else if (!armed) line = 'NANDA: Let the cards decide. They like me.';
  else if (!typedDone) line = 'NANDA: Yours has a typo. Hold still.';
  else line = 'NANDA: There. Now it says what you meant.';

  const cls = ['aroot', 't2', 'cuptypes', `st-${stage}`, picked ? `picked-${picked}` : '', m.how === 'timeout' ? 'by-timeout' : '', rm ? 'is-rm' : ''].join(' ');
  const k = armed ? progress(m) : 0;
  return (
    <div className={cls} data-phase={m.phase} data-run={m.run} data-picked={picked ?? ''} data-warm={warm}>
      <div className="bg"><Stairs props={STAIRS} rm={rm} /></div>
      <div className="dim" />
      <svg className="her full" viewBox="0 0 1920 1080" aria-hidden="true">
        <defs>
          <linearGradient id="t2-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a0208" stopOpacity=".85" /><stop offset=".22" stopColor="#0a0208" stopOpacity=".25" /><stop offset=".4" stopColor="#0a0208" stopOpacity="0" /></linearGradient>
        </defs>
        <Nanda face={face} pin={pinLit} x={735} y={-64} s={0.75} className="bust" />
        <rect width="1920" height="700" fill="url(#t2-top)" />
      </svg>
      <div className="cloth" />
      <div className="spread">
        <button type="button" className={`card her${herOff ? ' off' : ''}`} disabled={!open || herOff} onClick={() => pick('pink')}
          aria-label={`${pinkText} (pink, key 1)`}>
          <span className="cardface"><HerFace /></span>
          {herOff && picked !== 'pink' && <span className="cardface flip"><Back warm={1} /></span>}
          <Slip tone="pink" text={pinkText} struck={herOff} cursor={script.typing === 'pink' && editing} />
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
          <Slip tone={warm >= 0.75 && !picked ? 'purple warm' : 'purple'} text={yoursOff ? STAY : purpleText} struck={yoursOff}
            cursor={script.typing === 'purple' && (editing || (stage === 'deal' && !armed))}>
            {picked === 'purple' ? <Typed key={m.run} frames={retype(OPTIONS.purple.text, "It's late. ", 'lea—', 700, { rm })} /> : null}
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
      <Tag>menu-h1-r2 · the cup that types</Tag>
      <Hud>
        {m.phase === 'picked' && <button type="button" onClick={replay}>↻ replay (R)</button>}
        <span className="a-chip">1 pink · 2 purple</span>
      </Hud>
    </div>
  );
}
