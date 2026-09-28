// date-lab: variant tournament for date-beta (camera, animation, menu, close-ups, FX, Nanda integration).
// Each builder owns one folder (a/ or b/) and exports VARIANTS from its index.js. Nobody edits this file or the other folder.
// URL: date-lab.html = hub; ?v=<id> = one variant full-stage; ?still = reduced motion. Stage = 1920x1080 scaled to fit.
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { VARIANTS as A } from './a/index.js';
import { VARIANTS as B } from './b/index.js';
import './lab.css';

export const W = 1920, H = 1080;
const params = new URLSearchParams(location.search);
export const RM = params.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const ALL = [...A, ...B];
const TRACKS = ['camera', 'anim', 'menu', 'closeup', 'fx', 'nanda'];

function useFit() {
  const [k, setK] = useState(1);
  useEffect(() => {
    const fit = () => setK(Math.min(innerWidth / W, innerHeight / H));
    fit(); addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, []);
  return k;
}

function Stage({ v }) {
  const k = useFit();
  const C = v.Component;
  return (
    <div className={`lab-viewport${RM ? ' rm' : ''}`}>
      <div className="lab-stage" style={{ transform: `translate(-50%, -50%) scale(${k})` }} data-variant={v.id}>
        <C rm={RM} />
      </div>
      <a className="lab-back" href="?">◂ lab</a>
    </div>
  );
}

function Hub() {
  return (
    <main className="lab-hub">
      <h1>date-lab · round 1</h1>
      {TRACKS.map((t) => (
        <section key={t}>
          <h2>{t}</h2>
          <ul>
            {ALL.filter((v) => v.track === t).map((v) => (
              <li key={v.id}><a href={`?v=${v.id}`}><b>{v.id}</b> {v.title}</a> <i>{v.theme} · horror {v.horror}/5 · builder {v.builder}</i></li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

const v = ALL.find((x) => x.id === params.get('v'));
createRoot(document.getElementById('root')).render(v ? <Stage v={v} /> : <Hub />);
