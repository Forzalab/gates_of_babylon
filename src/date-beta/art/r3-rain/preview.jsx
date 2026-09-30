// Dev-only preview (research/sprint-0930/scenes-r3/pipeline-g23/preview.html; not a build entry): ?bg=<id> [&still]
// draws one R3 rain / her-street background bare at 1920x1080 (the Pillow side-by-sides + raw review use it).
import { createRoot } from 'react-dom/client';
import '../../theme.js';
import '../art.css';
import '../../beta.css';
import { R3_RAIN } from './index.js';

const q = new URLSearchParams(location.search);
const id = q.get('bg') ?? 'rain-sidewalk';
const Art = R3_RAIN[id];
const k = Math.min(innerWidth / 1920, innerHeight / 1080);
createRoot(document.getElementById('root')).render(
  <div className={`viewport${q.has('still') ? ' rm' : ''}`}>
    <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${k})` }} data-scene={id}>
      <div className="scene"><Art rm={q.has('still')} props={{}} /></div>
    </div>
  </div>,
);
