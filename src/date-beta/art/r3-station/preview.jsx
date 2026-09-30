// Dev-only preview (research/sprint-0930/scenes-r3/g1-preview.html; not a build entry):
//   ?bg=<R3_STATION id> [&bare] [&sharp] [&line=...] [&ref=12&op=.5]   one art id staged like a player beat
//   (Nanda centre + line under the focus blur); &ref lays refs/<n>.jpg over it for tracing alignment.
import { createRoot } from 'react-dom/client';
import '../../theme.js';
import '../art.css';
import '../../beta.css';
import { R3_STATION } from './index.js';
import { Say } from '../../Say.jsx';
import { Nanda } from '../../Nanda.jsx';
import { parseLine } from '../../engine.js';

const q = new URLSearchParams(location.search);
const id = q.get('bg') ?? 'station-gate-r3';
const Art = R3_STATION[id];
const k = Math.min(innerWidth / 1920, innerHeight / 1080);
const line = parseLine(q.get('line') ?? 'STATION · 4:30 PM. Many feet walk past.', `preview:${id}`);
const bare = q.has('bare');
const ref = q.get('ref');

createRoot(document.getElementById('root')).render(
  <div className={`viewport${q.has('anim') ? '' : ' rm'}`}>
    <div className={`stage${bare || q.has('sharp') ? '' : ' focus'}`} style={{ transform: `translate(-50%, -50%) scale(${k})` }} data-scene={id}>
      <div className="scene"><Art rm={!q.has('anim')} props={{}} /></div>
      {ref && <img src={`/research/sprint-0930/scenes-r3/refs/${ref}.jpg`} alt="" style={{ position: 'absolute', inset: 0, width: 1920, height: 1080, opacity: +(q.get('op') ?? 0.5) }} />}
      {!bare && <Nanda talk />}
      {!bare && <Say line={line} />}
    </div>
  </div>,
);
