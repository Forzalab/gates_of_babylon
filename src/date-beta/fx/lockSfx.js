// fx/lockSfx.js: the lock game's sounds (lock-click / lock-fail / lock-win), driven by the game's own DOM so
// game/LockGame.jsx stays as it is. No React. main.jsx calls watchLock(document, ASSETS.play) once.
//   tile tapped (not an open one, not during a mismatch hold)  -> lock-click
//   a mismatched pair goes red (.is-bad appears)               -> lock-fail
//   all pairs matched (title reads THE DOOR IS OPEN)           -> lock-win
//   the timer runs out (0s on the clock, door still locked)    -> lock-fail
export const LOCK_CUES = Object.freeze({ tap: 'lock-click', miss: 'lock-fail', open: 'lock-win', time: 'lock-fail' });

export function watchLock(doc, play, Observer = globalThis.MutationObserver) {
  if (!doc?.addEventListener) return () => {};
  const done = new WeakSet(); // lock-game roots that already played their win / timeout sound
  const onClick = (e) => {
    const t = e.target?.closest?.('.lg-tile');
    if (!t || t.disabled || t.classList.contains('is-open')) return;
    const root = t.closest('.lg-root');
    if (root && (done.has(root) || root.querySelector('.is-bad'))) return;
    play(LOCK_CUES.tap);
  };
  doc.addEventListener('click', onClick, true);
  const look = () => {
    const root = doc.querySelector?.('.lg-root');
    if (!root || done.has(root)) return;
    if (/OPEN/i.test(root.querySelector('.lg-title')?.textContent ?? '')) { done.add(root); play(LOCK_CUES.open); return; }
    if ((root.querySelector('.lg-time')?.textContent ?? '').trim() === '0s') { done.add(root); play(LOCK_CUES.time); }
  };
  const mo = Observer ? new Observer((list) => {
    for (const m of list) {
      if (m.type === 'attributes' && m.attributeName === 'class' && m.target.classList?.contains('is-bad') && !(m.oldValue ?? '').includes('is-bad')) play(LOCK_CUES.miss);
    }
    look();
  }) : null;
  mo?.observe(doc.body ?? doc, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
  return () => { doc.removeEventListener('click', onClick, true); mo?.disconnect(); };
}
