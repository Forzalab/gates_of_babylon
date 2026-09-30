// Fx.jsx: the pick effects. pos.fx = { kind, action, fake } from engine.choose(). Kinds: love-burst, hate-quake, chosen-flash.
// Each plays once (a timer removes the overlay). Nothing flashes faster than 3 Hz. Reduced motion (rm): the same overlay as a
// static frame (no falling, no shake, no fade), held a little longer so it can be read.
// The quake shakes the stage element (stageRef) with the `fx-quake` class: 3 x 334 ms stepped jumps.
import { useEffect, useState } from 'react';

const LEN = { 'love-burst': 1800, 'hate-quake': 1700, 'chosen-flash': 1800 };
// hearts: x %, size px, delay ms, fall ms (fixed so a screenshot is repeatable)
const HEARTS = [[6, 54, 0, 1500], [14, 38, 260, 1700], [22, 64, 120, 1400], [31, 44, 480, 1600], [39, 58, 60, 1500], [47, 36, 380, 1800],
  [55, 66, 200, 1450], [63, 46, 540, 1650], [71, 56, 100, 1500], [79, 40, 420, 1750], [87, 62, 240, 1400], [94, 48, 340, 1600]];

export function Fx({ fx, rm = false, stageRef }) {
  const [live, setLive] = useState(null);
  useEffect(() => {
    if (!fx || !LEN[fx.kind]) { setLive(null); return undefined; }
    setLive(fx);
    const stage = stageRef?.current;
    if (fx.kind === 'hate-quake' && !rm) {
      stage?.classList.add('fx-quake');
      var q = setTimeout(() => stage?.classList.remove('fx-quake'), 334 * 3 + 40);
    }
    const t = setTimeout(() => setLive(null), LEN[fx.kind] + (rm ? 600 : 0));
    return () => { clearTimeout(t); clearTimeout(q); stage?.classList.remove('fx-quake'); };
  }, [fx, rm, stageRef]);
  if (!live) return null;
  const { kind, action } = live;
  return (
    <div className={`db-fx ${kind}${rm ? ' still' : ''}`} aria-hidden={kind !== 'chosen-flash'} role={kind === 'chosen-flash' ? 'status' : undefined}>
      {kind === 'love-burst' && (
        <>
          <i className="fx-pinkflash" />
          {HEARTS.map(([x, s, d, f], i) => (
            <svg key={i} className="fx-heart" viewBox="-16 -12 32 26" style={{ left: `${x}%`, width: s, '--d': `${d}ms`, '--f': `${f}ms`, top: rm ? `${8 + ((i * 23) % 70)}%` : undefined }}>
              <path d="M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z" transform="scale(1.4)" />
            </svg>
          ))}
        </>
      )}
      {kind === 'hate-quake' && <i className="fx-vignette" />}
      {kind === 'chosen-flash' && (
        <div className="fx-card">
          <b>YOU CHOSE TO {String(action ?? '').toUpperCase()}.</b>
        </div>
      )}
    </div>
  );
}
