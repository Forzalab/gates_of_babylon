// menu-3 DDLC 4TH WALL (horror 5). School: Doki Doki Literature Club / Monika (anime-VN) x Haneke's *Funny Games* rewind
// (cinema: the film knows you are watching) x meta-horror (Pony Island's rewritten UI).
// Central theme: SHE EDITS THE MENU WHILE YOU READ IT. The choice UI is her territory, not yours.
// Beat plan (timer = the real 5 s bar; it never lies, but she relabels it):
//   0.5 s  her red caret lands at the end of the purple option, "NANDA is typing…"
//   0.7 s  backspaces "Goodnight." one key per 125 ms, types "Stay."  (purple still MEANS leave: pick it and she calls you a cheater)
//   3.1 s  she types over the timer label: "take your time ♡" while the bar keeps draining (gaslight)
//   5.0 s  timeout: a second cursor (hers) walks to pink in 3 held poses and clicks it; hard cut to her close-up, wide eyes,
//          the tab title changes, she looks past MC into the lens: "Not him. You. The one clicking."
// Purple: 334 ms bleed, the button snaps back to what it said, she retypes it to "It's late. lea—" (she never finishes "leave").
// Replay: the picked option is disabled with her note; the timer still runs; on a pink-disabled replay she makes both buttons agree.
// RM: every edit is one hard cut (held >= 500 ms), her cursor jumps, no glitch band; same beats, same meaning.
import { useEffect, useMemo, useState } from 'react';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import { useDoorMenu, useBeats, useClock, useTitle } from '../kit/hooks.js';
import { OPTIONS, BLEED, isDisabled, progress } from '../kit/menu.js';
import { retype, textAt } from '../kit/retype.js';
import { Line, Hud, Tag } from '../kit/ui.jsx';
import { Nanda } from '../kit/Sprite.jsx';
import './ddlc.css';

const STAIRS = { door: 'ajar' };
const HOLD = 2000;

// the open-phase edit script, relative to the timer start
function openScript(run, disabled, rm) {
  if (run > 1 && disabled.includes('purple')) {
    return { purple: [{ at: 0, text: OPTIONS.purple.text }], note: 'you already tried that', pink: retype('Just one cup.', 'Just one cup.', ' ♡', 900, { rm }), label: [] };
  }
  if (run > 1 && disabled.includes('pink')) {
    return { purple: retype(OPTIONS.purple.text, '', 'Just one cup.', 600, { rm, tick: 90 }), note: 'you picked this. keep it.', pink: [{ at: 0, text: OPTIONS.pink.text }], label: [] };
  }
  return {
    purple: retype(OPTIONS.purple.text, "It's late. ", 'Stay.', 700, { rm }),
    pink: [{ at: 0, text: OPTIONS.pink.text }],
    label: retype('5 s', '', 'take your time ♡', 2900, { rm, tick: 80 }),
  };
}

// A self-clocked typed string (outcome beats): frames relative to mount.
function Typed({ frames, caret }) {
  const [t] = useClock();
  const text = textAt(frames, t);
  const typing = caret && t < (frames.at(-1)?.at ?? 0) + 600;
  return <>{text}{typing && <i className="caret" />}</>;
}

// Her cursor: 3 held poses (500 ms) from the corner to the pink button, then a press. RM: jump straight to the press.
function HerCursor({ rm, onClick }) {
  const [p, setP] = useState(rm ? 3 : 0);
  useEffect(() => {
    if (rm) { const c = setTimeout(onClick, 600); return () => clearTimeout(c); }
    const ids = [1, 2, 3].map((k) => setTimeout(() => setP(k), k * 500));
    ids.push(setTimeout(onClick, 1800));
    return () => ids.forEach(clearTimeout);
  }, [rm]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <svg className={`hercursor p${p}`} viewBox="0 0 40 60" aria-hidden="true">
      <path d="M2 2 L2 46 L13 36 L21 55 L29 51 L21 33 L36 33Z" fill="#fff" stroke="#f0243f" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

const OUT = {
  timeout: [{ at: 0, text: "NANDA: Let me. You're slow." }, { at: 2000, v: 'lens', text: 'NANDA: Not him. You. The one clicking.' }, { at: 5000, v: 'lens', text: "NANDA: Don't close the tab. I'll know." }],
  forced: [{ at: 0, text: 'NANDA: Both buttons agree now. Like us.' }, { at: 2000, v: 'lens', text: 'NANDA: You keep rewinding. I keep waiting.' }],
  pink: [{ at: 0, text: 'NANDA: Good input. I knew you would.' }, { at: 2400, v: 'lens', text: 'NANDA: You. Behind him. You clicked it too.' }],
  purple: [{ at: 0, text: 'NANDA: You read the old text. Cheater.' }, { at: 2600, text: "NANDA: Right. Goodnight. That's… fine." }, { at: 5200, text: 'NANDA: Again. Properly this time.' }],
};

export default function Ddlc({ rm }) {
  const [bleed, setBleed] = useState(false);
  const [herClick, setHerClick] = useState(false);
  const { m, pick, replay, armed } = useDoorMenu({
    hold: rm ? 1000 : HOLD, replayHold: rm ? 600 : 1200,
    onPick: (s) => {
      setHerClick(false);
      if (s.picked === 'purple') { setBleed(true); setTimeout(() => setBleed(false), BLEED); }
    },
  });
  useEffect(() => { console.log('%cI know you opened this.', 'color:#f0243f;font:700 18px monospace'); }, []);
  const kind = m.phase !== 'picked' ? null : m.forced ? 'forced' : m.how === 'timeout' ? 'timeout' : m.picked;
  // on timeout her cursor must reach pink before the pick "lands" on screen
  const landed = kind !== 'timeout' || herClick;
  const beat = useBeats(kind && landed ? OUT[kind] : null, `${m.run}-${kind}-${landed}`);
  const lens = beat?.v === 'lens';
  useTitle(lens ? "Unit 12 · don't close me" : null);

  const script = useMemo(() => openScript(m.run, m.disabled, rm), [m.run, m.disabled, rm]);
  const t = armed ? m.t : -1;
  const pinkText = textAt(script.pink, t);
  const purpleText = textAt(script.purple, t);
  const label = script.label.length > 1 && t >= script.label[1].at ? textAt(script.label, t) : `${Math.ceil((m.dur - m.t) / 1000)} s`;
  const editingPurple = m.phase === 'open' && t >= 500 && t < (script.purple.at(-1)?.at ?? 0) + 400;
  const editingLabel = m.phase === 'open' && script.label.length > 0 && t >= 2800;
  const typing = editingPurple || editingLabel || (m.phase === 'open' && t >= 800 && t < (script.pink.at(-1)?.at ?? 0) + 400);

  const picked = m.phase === 'picked' ? m.picked : null;
  const face = lens ? 'wide' : kind === 'purple' ? 'blank' : 'smile';
  const pin = lens || kind === 'purple' ? 'red' : typing ? 'flicker' : 'hum';
  let line = beat?.text;
  if (!line) {
    if (kind === 'timeout') line = 'NANDA: Let me. You\'re slow.';
    else if (m.run > 1) line = m.disabled.includes('purple') ? 'NANDA: You stayed last time. …Didn\'t you?' : 'NANDA: Same question. Same answer. Right?';
    else if (editingLabel) line = 'NANDA: No rush. The kettle can wait.';
    else if (t >= 2000) line = 'NANDA: There. I fixed the typo for you.';
    else line = 'NANDA: Come in? Just for tea.';
  }

  const cls = ['aroot', 'ddlc', lens ? 'lens' : '', picked ? `picked-${picked}` : '', kind ? `k-${kind}` : '', rm ? 'is-rm' : ''].join(' ');
  return (
    <div className={cls} data-phase={m.phase} data-run={m.run}>
      <div className="bg"><Stairs props={STAIRS} rm={rm} /></div>
      <div className="grade" />
      <svg className="full her" viewBox="0 0 1920 1080" aria-hidden="true">
        <Nanda face={face} pin={pin} x={lens ? 60 : 1190} y={lens ? -516 : 200} s={lens ? 3 : 0.98} className="bust" />
      </svg>
      {lens && <div className="lensgrade" />}
      {lens && <pre className="chr" aria-hidden="true">{'nanda.chr   modified 23:47\nmenu.json   modified 23:47\nyou         still here'}</pre>}
      <div className={`menu${m.phase === 'open' && !armed ? ' pre' : ''}`} role="group" aria-label="Choice">
        <div className="timer"><i style={{ transform: `scaleX(${1 - (armed ? progress(m) : 0)})` }} /><span className="tlabel">{label}{editingLabel && <i className="caret" />}</span></div>
        <button type="button" className={`opt pink${isDisabled(m, 'pink') ? ' off' : ''}${picked === 'pink' && landed ? ' chosen' : ''}`}
          disabled={m.phase !== 'open' || isDisabled(m, 'pink')} onClick={() => pick('pink')}>
          <span className="k">1</span>
          <span className="txt">{lens ? OPTIONS.pink.text : pinkText}{m.phase === 'open' && t >= 800 && t < (script.pink.at(-1)?.at ?? 0) + 400 && script.pink.length > 1 && <i className="caret" />}</span>
          {isDisabled(m, 'pink') && <em className="note">{script.note}</em>}
        </button>
        <button type="button" className={`opt purple${isDisabled(m, 'purple') ? ' off' : ''}${picked === 'purple' ? ' chosen' : ''}`}
          disabled={m.phase !== 'open' || isDisabled(m, 'purple')} onClick={() => pick('purple')}
          aria-label={`${OPTIONS.purple.text} (purple, key 2)`}>
          <span className="k">2</span>
          <span className="txt">
            {lens ? OPTIONS.pink.text
              : picked === 'purple' ? <Typed key={m.run} caret frames={retype(OPTIONS.purple.text, "It's late. ", 'lea—', 900, { rm })} />
                : purpleText}
            {editingPurple && <i className="caret" />}
          </span>
          {isDisabled(m, 'purple') && <em className="note">{script.note}</em>}
        </button>
        {typing && <p className="typing">NANDA is typing<b>…</b></p>}
      </div>
      {kind === 'timeout' && !herClick && <HerCursor rm={rm} onClick={() => setHerClick(true)} />}
      {picked === 'pink' && landed && !lens && <div className="a-pinkwash" />}
      {bleed && <div className="a-bleed" />}
      {lens && !rm && <div className="tear" aria-hidden="true" />}
      <Line text={line} className={lens ? 'broken' : ''} />
      <Tag>menu-3 · ddlc · she edits the menu</Tag>
      <Hud>
        {m.phase === 'picked' && <button type="button" onClick={replay}>↻ replay (R)</button>}
        <span className="a-chip">1 pink · 2 purple</span>
      </Hud>
    </div>
  );
}
