// Dev-only preview (research/sprint-0930/shop/preview.html; not a build entry):
//   ?bg=<SHOP id> [&bare] [&sharp] [&line=...] [&ref=12&op=.5]   one art id staged like a player beat
import { createRoot } from 'react-dom/client';
import '../../theme.js';
import '../art.css';
import '../../beta.css';
import { SHOP } from './index.js';
import { Say } from '../../Say.jsx';
import { Nanda } from '../../Nanda.jsx';
import { parseLine } from '../../engine.js';

const q = new URLSearchParams(location.search);
const id = q.get('bg') ?? 'shop-vending';
const Art = SHOP[id];
const k = Math.min(innerWidth / 1920, innerHeight / 1080);
const line = parseLine(q.get('line') ?? 'SHOP STREET · 2:00 PM.', `preview:${id}`);
const bare = q.has('bare');

createRoot(document.getElementById('root')).render(
  <div className={`viewport${q.has('anim') ? '' : ' rm'}`}>
    <div className={`stage${bare || q.has('sharp') ? '' : ' focus'}`} style={{ transform: `translate(-50%, -50%) scale(${k})` }} data-scene={id}>
      <div className="scene"><Art rm={!q.has('anim')} props={{}} /></div>
      {!bare && <Nanda talk />}
      {!bare && <Say line={line} />}
    </div>
  </div>,
);
