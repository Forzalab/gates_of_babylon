// Dev-only preview (research/sprint-0930/scene-a/preview.html; not a build entry):
//   ?bg=<SCENE_A id> [&bare] [&line=...] [&props=<json>]   one art id, staged like a player beat (Nanda centre + line)
import { createRoot } from 'react-dom/client';
import '../../theme.js';
import '../art.css';
import '../../beta.css';
import { SCENE_A } from './index.js';
import { Say } from '../../Say.jsx';
import { Nanda } from '../../Nanda.jsx';
import { parseLine } from '../../engine.js';

const q = new URLSearchParams(location.search);
const id = q.get('bg') ?? 'rooftop-noon';
const Art = SCENE_A[id];
const props = JSON.parse(q.get('props') ?? '{}');
const k = Math.min(innerWidth / 1920, innerHeight / 1080);
const line = parseLine(q.get('line') ?? 'NANDA: I made you lunch. Pick one ♡', `preview:${id}`);
const bare = q.has('bare');

createRoot(document.getElementById('root')).render(
  <div className="viewport rm">
    <div className={`stage${bare ? '' : ' focus'}`} style={{ transform: `translate(-50%, -50%) scale(${k})` }} data-scene={id}>
      <div className="scene"><Art rm props={props} /></div>
      {!bare && q.has('nanda') && <Nanda talk />}
      {!bare && <Say line={line} />}
    </div>
  </div>,
);
