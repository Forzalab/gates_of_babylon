import { TOAST_MS } from './Toasts.jsx';
import { useEffect, useRef, useState } from 'react';
import { isMuted, setMuted, onMute } from './logicSfx.js';
import { WIPE_VIEWBOX, WIPE_EMPH, WIPE_REST } from './t4Lettering.js';

// Row 03 control bar (T4): [undo] [wipe] [redo], centred. Icons on a 24-unit grid, "step" set (the wire's own right
// angle, radius 0), drawn at 50% of the cell at the wire weight (--stroke, never under 2px on screen).
const UNDO = 'M9 4L4 9L9 14M4 9H19.5V20';
const WIPE = 'M3 6.5H21M9 6.5V3.5H15V6.5M6 6.5V20.5H18V6.5M10 10V17M14 10V17';
// Sound: a speaker box + cone, then one arc (on) or a cross (off). Same step grid and stroke as undo/wipe.
const SPK = 'M3 9.5H7L12 5V19L7 14.5H3Z';
const WAVE = 'M15.5 9Q18 12 15.5 15', MUTE = 'M15.5 9.5L20.5 14.5M20.5 9.5L15.5 14.5';
const Icon = ({ d, flip }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} transform={flip ? 'matrix(-1 0 0 1 24 0)' : undefined} /></svg>
);

// Wipe confirm balloon: ellipse 232x72u + straight tail to the button; WIPE Bold Italic, CANVAS? Regular (Anime Ace paths).
function WipeBubble() {
  return (
    <p className="wipe-bubble" role="alert">
      <svg viewBox="0 0 240 100" aria-hidden="true"><path d="M40 61.9A116 36 0 1 1 64 69.2L36 96Z" /></svg>
      <span className="sr">Wipe canvas? Click again to wipe.</span>
      <svg className="lettering" viewBox={WIPE_VIEWBOX} aria-hidden="true"><path d={WIPE_EMPH} /><path className="rest" d={WIPE_REST} /></svg>
    </p>
  );
}

export default function Controls({ canUndo, canRedo, canWipe, armed, setArmed, onUndo, onRedo, onWipe }) {
  const wipeRef = useRef(null);
  // Armed wipe disarms on any pointerdown outside the wipe button, or Escape. No timer.
  useEffect(() => {
    if (!armed) return;
    const down = (e) => { if (!wipeRef.current?.contains(e.target)) setArmed(false); };
    const key = () => setArmed(false); // any key is a new action (Tony), Escape included
    const t = setTimeout(() => setArmed(false), TOAST_MS); // and 3 s max, like every balloon
    window.addEventListener('pointerdown', down, true);
    window.addEventListener('keydown', key);
    return () => { clearTimeout(t); window.removeEventListener('pointerdown', down, true); window.removeEventListener('keydown', key); };
  }, [armed, setArmed]);
  const [m, setM] = useState(isMuted());
  useEffect(() => onMute(setM), []);
  return (
    <div className="ctl" role="toolbar" aria-label="History">
      <span className="cb-wrap"><button className="cb" disabled={!canUndo} aria-label="Undo" title="Undo (Ctrl+Z)" onClick={onUndo}><Icon d={UNDO} /></button></span>
      <span className="cb-wrap">
        <button ref={wipeRef} className={`cb wipe ${armed ? 'armed' : ''}`} disabled={!canWipe} aria-pressed={armed}
          aria-label={armed ? 'Confirm: wipe canvas' : 'Wipe canvas'} title={armed ? undefined : 'Wipe canvas'}
          onClick={() => (armed ? (setArmed(false), onWipe()) : setArmed(true))}><Icon d={WIPE} /></button>
        {armed && <WipeBubble />}
      </span>
      <span className="cb-wrap"><button className="cb" disabled={!canRedo} aria-label="Redo" title="Redo (Shift+Ctrl+Z)" onClick={onRedo}><Icon d={UNDO} flip /></button></span>
      <span className="cb-wrap"><button className="cb" aria-pressed={m} aria-label={m ? 'Unmute sound' : 'Mute sound'} title={m ? 'Sound off' : 'Sound on'}
        onClick={() => setMuted(!m)}><Icon d={`${SPK}${m ? MUTE : WAVE}`} /></button></span>
    </div>
  );
}
