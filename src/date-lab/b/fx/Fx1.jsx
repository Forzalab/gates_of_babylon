// fx-1 · DEMO-PATH FX REEL (horror 3). Central theme: "every sound has a body" (Mushishi x Lynch room tone).
// Nine beats in demo-path order; each plays its effect on entry and again on every click of the scene.
// The visual twin means the room still gets it with the speakers off; the caption names the sound.
// Keys: -> / Space next, <- back, Enter or click = replay. ?beat=<id> opens a beat (shots).
import { useEffect, useState } from 'react';
import { LabRoot, Line, param } from '../shared/ui.jsx';
import { BEATS } from './effects.jsx';

const start = Math.max(0, BEATS.findIndex((b) => b.id === param('beat')));

export default function Fx1({ rm }) {
  const [i, setI] = useState(start);
  const [go, setGo] = useState(0);
  const b = BEATS[i];
  // entering a beat plays its effect after a short hold (the cut lands first)
  useEffect(() => { const t = setTimeout(() => setGo((g) => g + 1), param('nogo') !== null ? 1e9 : 450); return () => clearTimeout(t); }, [i]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); setI((k) => Math.min(BEATS.length - 1, k + 1)); }
      else if (e.key === 'ArrowLeft') setI((k) => Math.max(0, k - 1));
      else if (e.key === 'Enter') setGo((g) => g + 1);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);
  const C = b.C;
  return (
    <LabRoot rm={rm} className="fx1" captions="tl">
      <div className="fx1-stage" onClick={() => setGo((g) => g + 1)} key={b.id}>
        <C rm={rm} go={go} />
      </div>
      {b.text && <Line text={b.text} key={`t${b.id}`} className="fx1-line" />}
      <p className="fx1-spec"><b>{String(i + 1).padStart(2, '0')} · {b.label}</b> {b.spec}</p>
      <nav className="fx1-strip" onPointerDown={(e) => e.stopPropagation()}>
        {BEATS.map((x, k) => (
          <button type="button" key={x.id} className={`lab${k === i ? ' on' : ''}`} onClick={() => setI(k)}>{k + 1} {x.label}</button>
        ))}
      </nav>
      <p className="hint fx1-hint">click the scene to replay · ← → beats</p>
    </LabRoot>
  );
}
