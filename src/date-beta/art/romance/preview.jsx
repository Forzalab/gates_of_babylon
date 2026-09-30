// Dev-only preview (romance-preview.html at the repo root; not a build entry): ?bg=<art id> [&still] [&bare] [&line=...]
// draws the scene with Nanda centred and a sample dialogue line, the way the player stages a Nanda beat.
import { createRoot } from 'react-dom/client';
import '../../theme.js';
import '../art.css';
import '../../beta.css';
import { ROMANCE } from './index.js';
import { Say } from '../../Say.jsx';
import { Nanda } from '../../Nanda.jsx';
import { parseLine } from '../../engine.js';

const q = new URLSearchParams(location.search);
const id = q.get('bg') ?? 'street-day';
const rm = q.has('still');
const Art = ROMANCE[id];
const k = Math.min(innerWidth / 1920, innerHeight / 1080);
const line = parseLine(q.get('line') ?? 'NANDA: Walk me home? The long way. I want every minute ♡', `preview:${id}`);

createRoot(document.getElementById('root')).render(
  <div className={`viewport${rm ? ' rm' : ''}`}>
    <div className={`stage${q.has('bare') ? '' : ' focus'}`} style={{ transform: `translate(-50%, -50%) scale(${k})` }} data-scene={id}>
      <div className="scene"><Art rm={rm} props={{}} /></div>
      {!q.has('bare') && <Nanda talk />}
      {!q.has('bare') && <Say line={line} />}
    </div>
  </div>,
);
