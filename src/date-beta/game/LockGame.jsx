// LockGame: the basement door lock. A 4x4 match game adapted from aleph's gate match (src/date/game, archived; the
// gate truth table comes from the copied compat.js on the real simulator). Tap a tile, then another tile of the same
// kind: both unlock. Clear all 8 pairs before the timer (props.secs, default 40) runs out.
// Win -> onPick(props.win ?? 1), timeout -> onPick(props.lose ?? 0). Timer steps once a second (no animation), and
// every feedback state is a static frame held >= 334 ms, so reduced motion needs no separate path.
import { useEffect, useMemo, useRef, useState } from 'react';
import { pairRow } from './compat.js';
import { emitSfx, LOCK_SFX } from '../fx/sound.js';
import './lockgame.css';

const KINDS = ['jar', 'slipper', 'bento', 'nand'];
const LABEL = { jar: 'JAR', slipper: 'SLIPPER', bento: 'BENTO', nand: 'NAND' };
const HOLD = 400; // ms a mismatch / match frame stays up (>= 334)

// NAND face: its own output column, straight off the simulator (A = NAND(a, b)).
const NAND_BITS = [0, 1, 2, 3].map((r) => (pairRow('NAND', 'NOT', r).A ? '1' : '0')).join('');

function deal(seed) {
  const t = KINDS.flatMap((k) => [k, k, k, k]);
  let s = seed >>> 0 || 1;
  for (let i = t.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; const j = s % (i + 1); [t[i], t[j]] = [t[j], t[i]]; }
  return t;
}

function Face({ kind }) {
  if (kind === 'jar') return (
    <svg viewBox="0 0 60 60"><rect x="16" y="8" width="28" height="7" rx="2" className="lg-lid" />
      <rect x="12" y="15" width="36" height="38" rx="7" className="lg-body" /><rect x="18" y="28" width="24" height="12" rx="2" className="lg-tag" /></svg>);
  if (kind === 'slipper') return (
    <svg viewBox="0 0 60 60"><path d="M10 40 Q10 22 30 20 Q50 18 52 36 Q52 50 30 50 Q10 50 10 40Z" className="lg-body" />
      <path d="M22 22 Q30 36 44 24" className="lg-strap" /></svg>);
  if (kind === 'bento') return (
    <svg viewBox="0 0 60 60"><rect x="8" y="14" width="44" height="34" rx="4" className="lg-body" />
      <path d="M30 14 V48 M8 31 H30" className="lg-strap" /><circle cx="41" cy="31" r="6" className="lg-tag" /></svg>);
  return (
    <svg viewBox="0 0 60 60"><path d="M10 12 H30 A18 18 0 0 1 30 48 H10 Z" className="lg-body" />
      <circle cx="52" cy="30" r="4" className="lg-tag" /><text x="23" y="36" className="lg-bits">{NAND_BITS}</text></svg>);
}

export default function LockGame({ props = {}, onPick }) {
  const secs = props.secs ?? 40;
  const tiles = useMemo(() => deal(props.seed ?? 7), [props.seed]);
  const [open, setOpen] = useState(() => new Set());
  const [sel, setSel] = useState(null);
  const [bad, setBad] = useState(null); // [i, j] held for HOLD ms
  const [left, setLeft] = useState(secs);
  const done = useRef(false);
  const won = open.size === tiles.length;

  useEffect(() => {
    if (won) return undefined;
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [won]);
  useEffect(() => {
    if (done.current) return undefined;
    if (!won && left > 0) return undefined;
    done.current = true;
    emitSfx(won ? LOCK_SFX.win : LOCK_SFX.lose); // sfx-wire: the lock gives / the time is up
    const t = setTimeout(() => onPick?.(won ? (props.win ?? 1) : (props.lose ?? 0)), won ? 1200 : HOLD);
    return () => clearTimeout(t);
  }, [won, left, onPick, props.win, props.lose]);

  const tap = (i) => (e) => {
    e.stopPropagation();
    if (done.current || bad || open.has(i)) return;
    if (sel == null) { setSel(i); return; }
    if (sel === i) { setSel(null); return; }
    if (tiles[sel] === tiles[i]) {
      if (open.size + 2 < tiles.length) emitSfx(LOCK_SFX.match); // a tumbler turns (the last pair plays the win)
      setOpen((o) => new Set([...o, sel, i])); setSel(null); return;
    }
    setBad([sel, i]); setSel(null);
    setTimeout(() => setBad(null), HOLD);
  };

  const pairs = open.size / 2;
  return (
    <div className="lg-root" onClick={(e) => e.stopPropagation()}>
      <div className="lg-head">
        <span className="lg-title">{won ? 'THE DOOR IS OPEN' : 'THE DOOR IS LOCKED'}</span>
        <span className={`lg-time${left <= 10 ? ' low' : ''}`}>{left}s</span>
      </div>
      <div className="lg-sub">{won ? 'CLICK. The lock gives.' : 'Match two of a kind to turn a tumbler.'}</div>
      <div className="lg-grid">
        {tiles.map((k, i) => {
          const cls = ['lg-tile', `k-${k}`, open.has(i) && 'is-open', sel === i && 'is-sel', bad?.includes(i) && 'is-bad'].filter(Boolean).join(' ');
          return (
            <button key={i} type="button" className={cls} data-kind={k} data-i={i} onClick={tap(i)} aria-label={LABEL[k]} disabled={open.has(i)}>
              <Face kind={k} /><span className="lg-name">{LABEL[k]}</span>
            </button>
          );
        })}
      </div>
      <div className="lg-pins">{[...Array(tiles.length / 2)].map((_, i) => <i key={i} className={i < pairs ? 'on' : ''} />)}</div>
    </div>
  );
}
