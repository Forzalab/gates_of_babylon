// menu-3-r3 DDLC 4TH WALL, round 3 (horror 5). School: DDLC / Monika x Haneke's *Funny Games* x Pony Island meta-horror.
// Central theme: SHE EDITS THE MENU WHILE YOU READ IT, and she starts before the menu exists (r2 cold open kept).
// Round-3 fixes (R2-VERDICT):
//   1. ECU occlusion: in the lens beat the menu no longer shrinks into the bottom-left under the dialogue box ("take yo").
//      It stays FULL SIZE, docked top-left above her eyes and clear of the box; timer label 36 px ("take your time ♡").
//   2. Every edit (MC's line, purple, the timer label) is whole-chunk swaps held 500 ms: <= 2 glyph swaps per second.
//      The doomed words are shown selected in her red for one held swap before they go.
// RM: every edit is <= 3 hard cuts held 1 s, her cursor jumps, no tear band, pupils start centred, caret doesn't blink.
import { useEffect, useMemo, useState } from 'react';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import { useDoorMenu, useBeats, useClock, useTitle, useAfter } from '../kit/hooks.js';
import { OPTIONS, BLEED, isDisabled, progress } from '../kit/menu.js';
import { Line, Hud, Tag } from '../kit/ui.jsx';
import { Nanda } from '../kit/Sprite.jsx';
import EyesEcu from '../menu2/EyesEcu.jsx';
import { frameAt, textAt, endOf } from './chunks.js';
import { mcLine, ddlcScript, leaEdit } from './script3.js';
import Sel from './Sel.jsx';
import '../menu/ddlc.css';
import '../menu2/ddlc2.css';
import './ddlc3.css';

const STAIRS = { door: 'ajar' };
const SHOW = 3000, HOLD = 3400;

// visits of this browser (4th wall). Never throws; private windows just say 1.
function useVisits() {
  const [n] = useState(() => {
    try { const v = Number(localStorage.getItem('gob.lab.menu3r3.visits') || 0) + 1; localStorage.setItem('gob.lab.menu3r3.visits', String(v)); return v; } catch { return 1; }
  });
  return n;
}

function Typed({ frames, caret }) {
  const [t] = useClock();
  const f = frameAt(frames, t);
  return <><Sel text={f.text} sel={f.sel} />{caret && t < endOf(frames) + 600 && <i className="caret" />}</>;
}

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

// MC's own line, being edited by her: a dialogue box with her caret in it.
function McLine({ t, frames }) {
  const f = frameAt(frames, t);
  const editing = t >= frames[0].at - 250 && t < endOf(frames) + 500;
  return (
    <div className={`a-line who-mc mcline${editing ? ' edited' : ''}`} role="status">
      <b className="who">MC</b>
      <p><Sel text={f.text} sel={f.sel} />{editing && <i className="caret" />}</p>
      {editing && <span className="boxtyping">NANDA is typing<b>…</b></span>}
    </div>
  );
}

const OUT = {
  timeout: [{ at: 0, text: "NANDA: Let me. You're slow." }, { at: 2000, v: 'lens', text: 'NANDA: Not him. You. The one clicking.' }, { at: 5000, v: 'lens', text: "NANDA: Don't close the tab. I'll know." }],
  forced: [{ at: 0, text: 'NANDA: Both buttons agree now. Like us.' }, { at: 2000, v: 'lens', text: 'NANDA: You keep rewinding. I keep waiting.' }],
  pink: [{ at: 0, text: 'NANDA: Good input. I knew you would.' }, { at: 2400, v: 'lens', text: 'NANDA: You. Behind him. You clicked it too.' }],
  purple: [{ at: 0, text: 'NANDA: You read the old text. Cheater.' }, { at: 2600, text: "NANDA: Right. Goodnight. That's… fine." }, { at: 5200, text: 'NANDA: Again. Properly this time.' }],
};

export default function Ddlc3({ rm }) {
  const [bleed, setBleed] = useState(false);
  const [herClick, setHerClick] = useState(false);
  const [clock] = useClock();
  const visits = useVisits();
  const { m, pick, replay, armed } = useDoorMenu({
    hold: HOLD, replayHold: rm ? 600 : 1200,
    onPick: (s) => {
      setHerClick(false);
      if (s.picked === 'purple') { setBleed(true); setTimeout(() => setBleed(false), BLEED); }
    },
  });
  useEffect(() => { console.log('%cI know you opened this.', 'color:#f0243f;font:700 18px monospace'); }, []);
  const mc = useMemo(() => mcLine(rm), [rm]);
  const kind = m.phase !== 'picked' ? null : m.forced ? 'forced' : m.how === 'timeout' ? 'timeout' : m.picked;
  const landed = kind !== 'timeout' || herClick;
  const beat = useBeats(kind && landed ? OUT[kind] : null, `${m.run}-${kind}-${landed}`);
  const lens = beat?.v === 'lens';
  const atYou = useAfter(rm ? 0 : 1000, `${lens}-${m.run}`);
  useTitle(lens ? "Unit 12 · don't close me" : null);

  const script = useMemo(() => ddlcScript(m.run, m.disabled, rm), [m.run, m.disabled, rm]);
  const t = armed ? m.t : -1;
  const shown = m.run > 1 || clock >= SHOW || armed;
  const coldOpen = m.run === 1 && !armed;
  const pinkF = frameAt(script.pink, t);
  const purpleF = frameAt(script.purple, t);
  const labelOn = script.label.length > 0 && t >= script.label[0].at;
  const label = labelOn ? textAt(script.label, t) : `${Math.ceil((m.dur - m.t) / 1000)} s`;
  const editingPurple = m.phase === 'open' && t >= 500 && t < endOf(script.purple) + 400;
  const editingLabel = m.phase === 'open' && labelOn;
  const editingPink = m.phase === 'open' && t >= 900 && t < endOf(script.pink) + 400 && script.pink.length > 1;
  const editingMc = coldOpen && clock >= mc[0].at - 250 && clock < endOf(mc) + 500;
  const typing = editingPurple || editingLabel || editingPink;

  const picked = m.phase === 'picked' ? m.picked : null;
  const face = kind === 'purple' ? 'blank' : 'smile';
  const pin = kind === 'purple' ? 'red' : typing || editingMc ? 'flicker' : 'hum';
  let line = beat?.text;
  if (!line) {
    if (kind === 'timeout') line = "NANDA: Let me. You're slow.";
    else if (m.run > 1) line = m.disabled.includes('purple') ? "NANDA: You stayed last time. …Didn't you?" : 'NANDA: Same question. Same answer. Right?';
    else if (editingLabel) line = 'NANDA: No rush. The kettle can wait.';
    else if (t >= 2000) line = 'NANDA: There. I fixed the typo for you.';
    else line = 'NANDA: You said stay. Come in? Just for tea.';
  }

  const cls = ['aroot', 'ddlc', 'ddlc2', 'ddlc3', lens ? 'lens' : '', picked ? `picked-${picked}` : '', kind ? `k-${kind}` : '', rm ? 'is-rm' : ''].join(' ');
  return (
    <div className={cls} data-phase={m.phase} data-run={m.run}>
      <div className="bg"><Stairs props={STAIRS} rm={rm} /></div>
      <div className="grade" />
      {!lens && (
        <svg className="full her" viewBox="0 0 1920 1080" aria-hidden="true">
          <Nanda face={face} pin={pin} x={1190} y={200} s={0.98} className="bust" />
        </svg>
      )}
      {lens && <EyesEcu look={atYou ? 'you' : 'mc'} pin="red" />}
      {lens && <div className="lensgrade" />}
      {lens && (
        <pre className="chr" aria-hidden="true">{`nanda.chr   modified 23:47\nmenu.json   modified 23:47\nyou         still here\nvisits      ${visits}${visits > 1 ? '   (i counted)' : ''}`}</pre>
      )}
      <div className={`menu${shown ? '' : ' pre'}`} role="group" aria-label="Choice">
        <div className="timer"><i style={{ transform: `scaleX(${1 - (armed ? progress(m) : 0)})` }} /><span className="tlabel">{label}{editingLabel && <i className="caret" />}</span></div>
        <button type="button" className={`opt pink${isDisabled(m, 'pink') ? ' off' : ''}${picked === 'pink' && landed ? ' chosen' : ''}`}
          disabled={m.phase !== 'open' || !armed || isDisabled(m, 'pink')} onClick={() => pick('pink')}>
          <span className="k">1</span>
          <span className="txt">{lens ? OPTIONS.pink.text : <Sel text={pinkF.text} sel={pinkF.sel} />}{editingPink && <i className="caret" />}</span>
          {isDisabled(m, 'pink') && <em className="note">{script.note}</em>}
        </button>
        <button type="button" className={`opt purple${isDisabled(m, 'purple') ? ' off' : ''}${picked === 'purple' ? ' chosen' : ''}`}
          disabled={m.phase !== 'open' || !armed || isDisabled(m, 'purple')} onClick={() => pick('purple')}
          aria-label={`${OPTIONS.purple.text} (purple, key 2)`}>
          <span className="k">2</span>
          <span className="txt">
            {lens ? OPTIONS.pink.text
              : picked === 'purple' ? <Typed key={m.run} caret frames={leaEdit(rm)} />
                : <Sel text={purpleF.text} sel={purpleF.sel} />}
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
      {coldOpen ? <McLine t={clock} frames={mc} /> : <Line text={line} className={lens ? 'broken' : ''} />}
      {editingMc && <span className="sr">Nanda is editing your line.</span>}
      <Tag>menu-3-r3 · ddlc · she edits the menu</Tag>
      <Hud>
        {m.phase === 'picked' && <button type="button" onClick={replay}>↻ replay (R)</button>}
        <span className="a-chip">1 pink · 2 purple</span>
      </Hud>
    </div>
  );
}
