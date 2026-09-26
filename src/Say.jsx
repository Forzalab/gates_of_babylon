import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SAY } from './sayLettering.js';

// A speech balloon said by a part (gate, lamp) or by the Figur wordmark, drawn like the palette hint: a white 2:1 ellipse
// with a curved tail, and the fixed phrase lettered in outlined Anime Ace 3 BB (src/sayLettering.js). The <p> is placed
// by its TAIL TIP (CSS --ax/--ay): the tail aims at the speaker and stops short of it (Blambot, Comic Book Grammar).
// --k is the unit: 1px inside React Flow nodes (the viewport zoom already scales them), var(--u) in the app grid.
// Flips mirror the BALLOON only; the lettering sits in a <g> counter-flipped about the text centre (0, 0) in user space,
// so the words stay upright and in place (the old per-path fill-box flip slid the bold run over the regular one: img09).
export default function Say({ phrase, className = '', role = 'status', text }) {
  const p = SAY[phrase];
  const ref = useRef(null);
  const [flip, setFlip] = useState({ x: false, y: false });
  useEffect(() => {
    const el = ref.current;
    const canvas = el?.closest('.canvas');
    if (!el || !canvas) return;
    const b = el.getBoundingClientRect(), c = canvas.getBoundingClientRect();
    const next = { y: b.top < c.top, x: b.right > c.right };
    setFlip((f) => (f.x === next.x && f.y === next.y ? f : next));
  });
  if (!p) return null;
  const [vx, vy, vw, vh] = p.view;
  const style = { '--dx': p.tip[0] - vx, '--dy': p.tip[1] - vy, '--w': vw, '--h': vh };
  const t = flip.x || flip.y ? `scale(${flip.x ? -1 : 1} ${flip.y ? -1 : 1})` : undefined;
  return (
    <p ref={ref} className={`say ${className} ${flip.y ? 'flip-y' : ''} ${flip.x ? 'flip-x' : ''}`} role={role} style={style}>
      <span className="sr">{text ?? p.text}</span>
      <svg viewBox={p.view.join(' ')} aria-hidden="true">
        <path className="bal" d={p.balloon} />
        <g transform={t}><path className="emph" d={p.emph} /><path className="rest" d={p.rest} /></g>
      </svg>
    </p>
  );
}

// ---- Angry burst balloon (error messages said by a part about one of its pins) ----------------------------------------
// Structure dissected from Tony's ref (img08, scratchpad/issue6/dissect.py, 8 bursts): 7..12 spikes (median 9), valley/peak
// radius 0.67..0.81 (mean 0.74), spike spacing CV 0.15..0.35 (mean 0.24), peak radius CV 0.04..0.10 (mean 0.07), aspect
// 1.0..1.85, stroke 2.2..2.7% of height, sides between spikes curve INWARD to sharp points. Here: 10 spikes, valleys on
// the text ellipse, peaks at 1/0.74 of it, seeded jitter (stable per phrase), one spike stretched into the tail whose tip
// lands on the refused pin's ring (img07: "point tip to the pin"). Stroke = the balloon ink (3), text never mirrored.
export const BURST = { spikes: 10, valley: 0.92, peak: 1 / 0.74, spacingCV: 0.24, peakCV: 0.07 };
const MARK_GAP = 28;                       // tip stops on the error ring (MARK_R 24 + half its stroke + 2): points AT the pin
const LIFT = 56;                            // burst centre sits this far (u) beyond its valley ellipse from the pin
const EDGE = 8;                             // screen px kept free at the window edge (the balloon may cross every cell, not the glass)

function rng(seed) { let s = 0; for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
const f1 = (v) => Math.round(v * 10) / 10;

// Points of the burst around (0, 0) in lettering units; tail = tip (x, y) relative to the centre.
export function burstPath(rx, ry, tail, seed = 'x') {
  const R = rng(seed), n = BURST.spikes, step = (2 * Math.PI) / n;
  const tailA = Math.atan2(tail[1] / ry, tail[0] / rx); // parametric angle of the tail direction
  const ang = [];
  for (let i = 0; i < n; i++) ang.push(tailA + i * step + (i ? (R() - 0.5) * 2 * Math.sqrt(3) * BURST.spacingCV * step : 0));
  const on = (a, k) => [k * rx * Math.cos(a), k * ry * Math.sin(a)];
  const peaks = ang.map((a, i) => (i === 0 ? tail : on(a, BURST.peak * (1 + (R() - 0.5) * 2 * Math.sqrt(3) * BURST.peakCV))));
  let d = `M${f1(peaks[0][0])} ${f1(peaks[0][1])}`;
  for (let i = 0; i < n; i++) {
    const a0 = ang[i], a1 = i + 1 < n ? ang[i + 1] : ang[0] + 2 * Math.PI;
    const P0 = peaks[i], P1 = peaks[(i + 1) % n];
    // the tail spike keeps a narrow base: its neighbouring valleys sit closer to it
    const am = i === 0 ? a0 + 0.3 * (a1 - a0) : i === n - 1 ? a0 + 0.7 * (a1 - a0) : (a0 + a1) / 2;
    const M = on(am, BURST.valley * (0.97 + R() * 0.06));
    const C = [2 * M[0] - (P0[0] + P1[0]) / 2, 2 * M[1] - (P0[1] + P1[1]) / 2]; // quad midpoint = M: concave side
    d += `Q${f1(C[0])} ${f1(C[1])} ${f1(P1[0])} ${f1(P1[1])}`;
  }
  return d + 'Z';
}

const ellipse = (p) => { const m = /A([\d.]+) ([\d.]+)/.exec(p.balloon); return [+m[1], +m[2]]; };

// Placed by the pin: an anchor <i> inside the node at the pin (flow px); the balloon itself is portalled to <body> so it
// can break the canvas frame and cover the truth table / palette (4th wall, img09) at full size, never squashed.
export function SayBurst({ phrase, text, pin, role = 'alert' }) {
  const p = SAY[phrase];
  const anchor = useRef(null);
  const [geo, setGeo] = useState(null);
  useLayoutEffect(() => {
    if (!p) return;
    let raf = 0;
    const tick = () => {
      const a = anchor.current, node = a?.parentElement;
      if (a && node && node.offsetWidth) {
        const ar = a.getBoundingClientRect(), k = node.getBoundingClientRect().width / node.offsetWidth;
        const [rx, ry] = ellipse(p), pr = BURST.peak * 1.1;
        const W = window.innerWidth, H = window.innerHeight;
        // default: above the pin, a little right; below when the window top would cut it
        let cy = -(ry * pr + LIFT);
        if (ar.top + (cy - ry * pr) * k < EDGE) cy = ry * pr + LIFT;
        let cx = rx * 0.35;
        const lo = (EDGE - ar.left) / k + rx * pr, hi = (W - EDGE - ar.left) / k - rx * pr;
        cx = Math.min(Math.max(cx, lo), hi);
        const len = Math.hypot(cx, cy), tip = [-cx + (cx / len) * MARK_GAP, -cy + (cy / len) * MARK_GAP];
        const next = { x: ar.left, y: ar.top, k, cx, cy, tip, rx, ry, H };
        setGeo((g) => (g && ['x', 'y', 'k', 'cx', 'cy'].every((q) => Math.abs(g[q] - next[q]) < 0.01) ? g : next));
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [p]);
  if (!p) return null;
  let balloon = null;
  if (geo) {
    const { x, y, k, cx, cy, tip, rx, ry } = geo;
    const d = burstPath(rx, ry, tip, phrase);
    const m = Math.max(Math.abs(tip[0]), rx * BURST.peak * 1.2) + 4, n = Math.max(Math.abs(tip[1]), ry * BURST.peak * 1.2) + 4;
    const vb = [-m, -n, 2 * m, 2 * n];
    balloon = createPortal(
      <p className="say say-burst" role={role} style={{ left: x + (cx - m) * k, top: y + (cy - n) * k, width: vb[2] * k, height: vb[3] * k }}>
        <span className="sr">{text ?? p.text}</span>
        <svg viewBox={vb.join(' ')} aria-hidden="true">
          <path className="bal" d={d} />
          <path className="emph" d={p.emph} />
          <path className="rest" d={p.rest} />
        </svg>
      </p>, document.body);
  }
  return <><i ref={anchor} className="say-pin" style={{ left: pin[0], top: pin[1] }} aria-hidden="true" />{balloon}</>;
}
