// menu-h4-r3 "THE DRAFT FOLDER" (hybrid: menu-h1 object edit x menu-3 cold open x menu-h2 pour timer, horror 4).
// School: Kiyoshi Kurosawa's *Pulse* / *Kairo* (the machine in your hand is how she gets in) x *Unfriended* screen-horror
// x CLAMP candle table (menu-1). Central theme: SHE IS ON YOUR PHONE. The wall-break is in-world: no game cursor, no menu
// chrome. The choice is two drafted replies on MC's phone, lying face-up on the tarot cloth between her card and the candle.
//   cold open (0-3 s): MC's unsent reply "It's late. I should go home." "Nanda is typing…" and HIS draft goes her red:
//     "go home." selected -> deleted -> "stay." typed in her red (chunk swaps, <= 2/s). Then the Drafts folder opens.
//   timer: the auto-send bar drains and pours into the pink draft (h2's pour); the candle only marks the pips.
//   pink / timeout: "Just one cup." sends. "Delivered ♡", then "Read 12:00". Timeout = it sent itself.
//   purple: "It's late. Goodnight." bounces, "! Not delivered", purple bleed 334 ms, her hair-pin goes into the screen.
//   replay: the picked draft is greyed "Message already sent" and the phone is nailed to the cloth by her pin; timer runs.
// RM: no slide / pour tween (5 held blocks), edits = <= 3 hard cuts held 1 s, dots hold, bleed one 334 ms hold.
import { useMemo, useState } from 'react';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import { useDoorMenu, useBeats, useClock, usePose } from '../kit/hooks.js';
import { BLEED, progress, isDisabled, secondsLeft } from '../kit/menu.js';
import { Line, Hud, Tag, Ors } from '../kit/ui.jsx';
import { Nanda } from '../kit/Sprite.jsx';
import { HerFace, Candle, BigPin } from '../menu2/cards.jsx';
import Sel from './Sel.jsx';
import { frameAt, endOf } from './chunks.js';
import { SHOW, HOLD, MC_KEEP, composer, pourAt, draftScript, sentAt, STATUS } from './draft.js';
import '../menu2/tarot2.css';
import './draft.css';

const STAIRS = { door: 'ajar' };

const OUT = {
  pink: [{ at: 0, text: 'NANDA: Good input. The kettle is already on.' }, { at: 2600, text: 'NANDA: Read at twelve. I always am.' }],
  timeout: [{ at: 0, text: "NANDA: You didn't say no. It sent itself." }, { at: 2600, text: 'NANDA: Read at twelve. I always am.' }],
  forced: [{ at: 0, text: 'NANDA: Sent it again for you. Twice is cute.' }, { at: 2600, text: 'NANDA: Drafts are just things you meant.' }],
  purple: [{ at: 0, text: 'NANDA: Oh. It bounced. Bad signal on my stairs.' }, { at: 2600, text: 'NANDA: Try the other one?' }],
};

// MC's draft in the composer: his words in ink, hers in her red.
function Composer({ t, frames }) {
  const f = frameAt(frames, t);
  const mine = f.text.slice(0, Math.min(f.text.length, MC_KEEP.length));
  const hers = f.text.length > MC_KEEP.length && !f.sel ? f.text.slice(MC_KEEP.length) : '';
  return (
    <div className="composer" role="status">
      <span className="ctxt">{f.sel ? <Sel text={f.text} sel={f.sel} /> : <>{mine}<b className="hers">{hers}</b></>}<i className="caret" /></span>
      <span className="sendbtn" aria-hidden="true">➤</span>
    </div>
  );
}

function Dots({ on }) {
  const p = usePose(3, 500, on);
  return <span className="dots" aria-hidden="true">{[0, 1, 2].map((i) => <i key={i} className={i === p ? 'on' : ''} />)}</span>;
}

// Cracks where her pin went into the glass: 8 held lines, no animation.
function Crack() {
  return (
    <svg className="crack" viewBox="-160 -160 320 320" aria-hidden="true">
      {[10, 55, 100, 150, 200, 245, 290, 330].map((a, i) => (
        <path key={a} d={`M0 0 L${Math.cos(a * Math.PI / 180) * (90 + (i % 3) * 30)} ${Math.sin(a * Math.PI / 180) * (90 + (i % 3) * 30)}`}
          stroke="#fff" strokeWidth="3" opacity=".85" />
      ))}
      <circle r="60" fill="none" stroke="#fff" strokeWidth="2" opacity=".5" />
    </svg>
  );
}

function Draft({ tone, frame, off, note, k, onClick, disabled, keyN, typing }) {
  return (
    <button type="button" className={`draftrow ${tone}${off ? ' off' : ''}`} disabled={disabled} onClick={onClick}
      aria-label={`${frame.text} (${tone}, key ${keyN})`}>
      {tone === 'pink' && <span className="fill" style={{ transform: `scaleX(${k})` }} aria-hidden="true" />}
      <span className="k">{keyN}</span>
      <span className="dtxt"><Sel text={frame.text} sel={frame.sel} />{typing && <i className="caret" />}</span>
      {off && <em className="note">{note}</em>}
    </button>
  );
}

export default function DraftFolder({ rm }) {
  const [bleed, setBleed] = useState(false);
  const [clock] = useClock();
  const { m, pick, replay, armed } = useDoorMenu({
    hold: rm ? 1800 : HOLD, replayHold: rm ? 600 : 1200,
    onPick: (s) => { if (s.picked === 'purple') { setBleed(true); setTimeout(() => setBleed(false), BLEED); } },
  });
  const kind = m.phase !== 'picked' ? null : m.forced ? 'forced' : m.how === 'timeout' ? 'timeout' : m.picked;
  const beat = useBeats(kind ? OUT[kind] : null, `${m.run}-${kind}`);
  const since = useSince(`${m.run}-${kind}`, kind != null);
  const sent = sentAt(kind, rm ? 99999 : since);
  const last = m.history.at(-1) ?? null; // what was sent on the previous run (replay keeps it in the thread)
  const prev = m.run > 1 && m.phase === 'open' ? sentAt(last === 'purple' ? 'purple' : 'pink', 99999) : null;
  const bubble = sent ?? prev;

  const comp = useMemo(() => composer(rm), [rm]);
  const script = useMemo(() => draftScript(m.run, m.disabled, rm), [m.run, m.disabled, rm]);
  const coldOpen = m.run === 1 && clock < (rm ? 1800 : SHOW) && !armed;
  const t = armed ? m.t : -1;
  const open = m.phase === 'open';
  const pinkF = frameAt(script.pink, t), purpleF = frameAt(script.purple, t);
  const k = pourAt(armed ? progress(m) : 0, rm);
  const pinkOff = isDisabled(m, 'pink'), purpleOff = isDisabled(m, 'purple');
  const typingDraft = open && armed && m.run > 1 ? (script.purple.length > 1 ? 'purple' : script.pink.length > 1 ? 'pink' : null) : null;
  const editingDraft = typingDraft && t < endOf(script[typingDraft]) + 400;
  const herTyping = coldOpen || editingDraft || (open && m.run === 1);
  const nailed = m.run > 1;
  const face = kind === 'purple' ? 'blank' : 'smile';
  const pin = kind === 'purple' ? 'red' : herTyping ? 'flicker' : 'hum';

  let line = beat?.text;
  if (!line) {
    if (coldOpen) line = clock < 1250 ? "MC: Just send it. It's late." : "MC: Wait. I didn't type that.";
    else if (m.run > 1) line = pinkOff ? 'NANDA: You already sent that. I fixed the other.' : 'NANDA: That one already went. Pick again.';
    else line = 'NANDA: No rush. Drafts send themselves eventually.';
  }

  const cls = ['aroot', 't2', 'draft', 'st-table', kind ? `k-${kind}` : '', m.phase === 'picked' ? `picked-${m.picked}` : '', nailed ? 'nailed' : '', rm ? 'is-rm' : ''].join(' ');
  return (
    <div className={cls} data-phase={m.phase} data-run={m.run}>
      <div className="bg"><Stairs props={STAIRS} rm={rm} /></div>
      <div className="dim" />
      <svg className="her full" viewBox="0 0 1920 1080" aria-hidden="true">
        <Nanda face={face} pin={pin} x={40} y={-40} s={0.62} className="bust" />
      </svg>
      <div className="cloth" />
      {/* her card, face-up on her side; the candle and the empty third place on the right */}
      <div className="hercard" aria-hidden="true"><HerFace /><span className="print">Figur Arcana</span></div>
      <div className="candlewrap" aria-hidden="true">
        <Candle k={armed ? progress(m) : 0} lit={open} rm={rm} />
        <div className="pips">{[0, 1, 2, 3, 4].map((i) => <i key={i} className={(armed ? progress(m) : 0) * 5 > i + 0.001 ? 'out' : ''} />)}</div>
      </div>
      <div className="third" aria-hidden="true"><span>III</span></div>

      <div className="phone">
        <div className="screen">
          <div className="status"><b>12:00</b><span>Figur 5G ▮▮▮</span></div>
          <div className="head">
            <span className="avatar" aria-hidden="true"><i /></span>
            <span className="who"><b>Nanda ♡</b><em className={herTyping ? 'typ' : ''}>{herTyping ? 'typing…' : 'online'}</em></span>
          </div>
          <div className="thread">
            <span className="tstamp">Tue 23:47 · Unit 12</span>
            <p className="bub hers">Come in? Just for tea.</p>
            {herTyping && !bubble && <p className="bub hers dotsbub"><Dots on={!rm} /></p>}
            {bubble && (
              <div className={`sent ${bubble.tone}`}>
                <p className={`bub mine ${bubble.tone}${bubble.status === 'fail' ? ' failed' : ''}`}><Ors text={bubble.text} /></p>
                <span className={`st ${bubble.status}`}>{STATUS[bubble.status]}</span>
                {bubble.pin && <span className="inscreen"><Crack /><BigPin /></span>}
              </div>
            )}
          </div>
          {coldOpen ? (
            <Composer t={clock} frames={comp} />
          ) : (
            <div className="drafts" role="group" aria-label="Choice">
              <div className="dhead"><b>DRAFTS · 2</b><span>{open && armed ? `auto-send in ${secondsLeft(m)} s ♡` : open ? 'auto-send ♡' : kind === 'purple' ? 'not sent' : 'sent'}</span></div>
              <div className="sendbar" aria-hidden="true"><i style={{ transform: `scaleX(${1 - k})` }} /><span className="spout" style={{ left: `${(1 - k) * 100}%` }} /></div>
              <Draft tone="pink" keyN="1" frame={pinkF} k={k} off={pinkOff} note="Message already sent" typing={typingDraft === 'pink' && editingDraft}
                disabled={!open || !armed || pinkOff} onClick={() => pick('pink')} />
              <Draft tone="purple" keyN="2" frame={purpleF} k={0} off={purpleOff} note="Message already sent" typing={typingDraft === 'purple' && editingDraft}
                disabled={!open || !armed || purpleOff} onClick={() => pick('purple')} />
            </div>
          )}
        </div>
      </div>
      {nailed && <span className="nail" aria-hidden="true"><BigPin /></span>}
      {m.phase === 'picked' && m.picked === 'pink' && <div className="a-pinkwash" />}
      {bleed && <div className="a-bleed" />}
      <div className="a-vig" />
      <Line text={line} />
      {coldOpen && <span className="sr">Nanda is editing your draft.</span>}
      <Tag>menu-h4-r3 · the draft folder</Tag>
      <Hud>
        {m.phase === 'picked' && <button type="button" onClick={replay}>↻ replay (R)</button>}
        <span className="a-chip">1 pink · 2 purple</span>
      </Hud>
    </div>
  );
}

// ms since `key` last changed while `on` (a smooth clock for the sent-status beats).
function useSince(key, on) {
  const [t0, setT0] = useState({ key: null, at: 0 });
  const [now] = useClock();
  if (on && t0.key !== key) setT0({ key, at: now });
  return on ? now - (t0.key === key ? t0.at : now) : 0;
}
