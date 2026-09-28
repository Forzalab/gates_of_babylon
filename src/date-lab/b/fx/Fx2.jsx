// fx-2 · THE MONITOR WALL (horror 2). Central theme: Kiyoshi Kurosawa's Kairo / Pulse: a room of CRTs, each one
// playing one effect alone, forever. A test bench for round 2: every effect side by side, each with its own replay
// and its own reduced-motion toggle, so full and RM versions can be compared on the projector.
// The wall runs one effect at a time (a slow scan, 2.6 s each) so sounds never stack; click a monitor to play it.
import { useEffect, useState } from 'react';
import { LabRoot } from '../shared/ui.jsx';
import { BEATS } from './effects.jsx';

const COLS = 3, W = 480, H = 270, GX = 100, GY = 26, X0 = 140, Y0 = 90;

function Monitor({ b, k, rm0, go, onPlay }) {
  const [rm, setRm] = useState(rm0);
  const C = b.C;
  const x = X0 + (k % COLS) * (W + GX), y = Y0 + Math.floor(k / COLS) * (H + GY + 40);
  return (
    <div className="fx2-mon" style={{ left: x, top: y, width: W, height: H + 44 }}>
      <div className="fx2-screen" onClick={onPlay} role="button" tabIndex={0} aria-label={`play ${b.label}`}>
        <div className="fx2-inner" style={{ transform: `scale(${W / 1920})` }}><C rm={rm} go={go} auto={false} /></div>
        <div className="fx2-glass" />
      </div>
      <div className="fx2-ctl">
        <b>{String(k + 1).padStart(2, '0')} {b.label}</b>
        <button type="button" className="lab" onClick={onPlay}>▶ play</button>
        <button type="button" className={`lab${rm ? ' on' : ''}`} onClick={() => setRm((v) => !v)}>{rm ? 'still ✓' : 'still'}</button>
      </div>
    </div>
  );
}

export default function Fx2({ rm }) {
  const [gos, setGos] = useState(() => BEATS.map(() => 0));
  const [scan, setScan] = useState(true);
  const fire = (k) => setGos((g) => g.map((v, i) => (i === k ? v + 1 : v)));
  useEffect(() => {
    if (!scan) return undefined;
    let k = 0;
    fire(0);
    const id = setInterval(() => { k = (k + 1) % BEATS.length; fire(k); }, 2600);
    return () => clearInterval(id);
  }, [scan]);
  return (
    <LabRoot rm={rm} className="fx2" captions="tr">
      <h1 className="fx2-title">FIGUR MONITORING · 9 CHANNELS · <span>{scan ? 'SCANNING' : 'MANUAL'}</span></h1>
      {BEATS.map((b, k) => <Monitor key={b.id} b={b} k={k} rm0={rm} go={gos[k]} onPlay={() => { setScan(false); fire(k); }} />)}
      <button type="button" className="lab fx2-scan" onClick={() => setScan((s) => !s)}>{scan ? '■ stop scan' : '▶ scan all'}</button>
    </LabRoot>
  );
}
