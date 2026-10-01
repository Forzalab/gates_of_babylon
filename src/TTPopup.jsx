import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import TTBox from './TTBox.jsx';

// Full truth table in a dialog. Rendered inside .app (a portal to it, not to <body>) so --u and the container query still resolve.
// Open: focus goes to the live row, the rest of .app is inert. Escape, the X and a click on the veil close it (Truth.jsx returns focus).
export const OpenIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9V3H9M15 3H21V9M21 15V21H15M9 21H3V15" /></svg>;
const CloseIcon = () => <svg viewBox="-12 -12 24 24" aria-hidden="true"><path d="M-7 -7L7 7M7 -7L-7 7" /></svg>;

export default function TTPopup({ host, onClose, ...table }) {
  useEffect(() => {
    const esc = (e) => { if (e.key !== 'Escape') return; e.stopPropagation(); e.preventDefault(); onClose(); };
    window.addEventListener('keydown', esc, true); // capture: runs before the palette's own Escape handler
    const held = [...host.children].filter((c) => !c.classList.contains('tpop') && !c.inert);
    held.forEach((c) => { c.inert = true; });
    return () => { window.removeEventListener('keydown', esc, true); held.forEach((c) => { c.inert = false; }); };
  }, [host, onClose]);
  const limit = (el) => el.closest('.tpanel').getBoundingClientRect().bottom - 28 * (el.closest('.frame').clientWidth / 1440);
  return createPortal(
    <div className="tpop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="truth tpanel" role="dialog" aria-modal="true" aria-labelledby="tpop-title" tabIndex={-1}>
        <h2 className="label" id="tpop-title">Truth table</h2>
        <button className="tt-ico" aria-label="Close" onClick={onClose}><CloseIcon /></button>
        <TTBox {...table} limit={limit} focusLive />
      </div>
    </div>, host);
}
