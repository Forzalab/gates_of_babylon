// Dev-only preview (research/sprint-0930/interiors/preview.html; not a build entry):
// ?bg=<art id> [&still] [&nanda] [&line=...] [&props={"shelf":"jars"}]
// The scene with an optional sample line under the player's focus blur; &nanda = Nanda centred (sprint contract).
import { createRoot } from 'react-dom/client';
import '../../theme.js';
import '../art.css';
import '../../beta.css';
import { INTERIORS } from './index.js';
import { Say } from '../../Say.jsx';
import { Nanda } from '../../Nanda.jsx';
import { parseLine } from '../../engine.js';

const q = new URLSearchParams(location.search);
const id = q.get('bg') ?? 'cellar';
const rm = q.has('still');
const Art = INTERIORS[id];
const props = q.has('props') ? JSON.parse(q.get('props')) : {};
const k = Math.min(innerWidth / 1920, innerHeight / 1080);
const text = q.get('line');
const line = text ? parseLine(text, `preview:${id}`) : null;

createRoot(document.getElementById('root')).render(
  <div className={`viewport${rm ? ' rm' : ''}`}>
    <div className={`stage${line ? ' focus' : ''}`} style={{ transform: `translate(-50%, -50%) scale(${k})` }} data-scene={id}>
      <div className="scene"><Art rm={rm} props={props} /></div>
      {q.has('nanda') && <Nanda talk />}
      {line && <Say line={line} />}
    </div>
  </div>,
);
