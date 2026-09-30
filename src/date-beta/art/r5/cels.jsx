// r5-ume CELS (research/sprint-0930/r5-ume/AUDIT.md G8/G10): flat SVG cels laid over a beat's traced bg, in stage px
// (1920 x 1080), so a line gets the thing it names (your sleeve she tugs, the bags you carry, the crowd, a table edge)
// without a beige insert card. Cel-over-vtrace: flat fills + a clean line, lit from the scene's one light (upper left
// unless a cel says so), no motion. Data: beat props.cels = [id | { id, x?, y?, k?, flip? }]; a cel is drawn BEHIND her
// (over the bg) unless its registry entry says front: true (a BOOK cel in front of her: your hand, the table edge).
import { CEL } from './celArt.jsx';
import './r5.css';

export function Cels({ list, front = false, rm = false }) {
  if (!Array.isArray(list) || !list.length) return null;
  const items = list.map((c) => (typeof c === 'string' ? { id: c } : c)).filter((c) => CEL[c.id] && !!CEL[c.id].front === !!front);
  if (!items.length) return null;
  return (
    <svg className={`r5-cels${front ? ' front' : ''}`} viewBox="0 0 1920 1080" aria-hidden="true">
      {items.map((c, i) => {
        const { x = 0, y = 0, k = 1, flip = false } = c;
        const Art = CEL[c.id].Art;
        return (
          <g key={`${c.id}${i}`} transform={`translate(${x} ${y})${flip ? ' translate(1920 0) scale(-1 1)' : ''} scale(${k})`}>
            <Art rm={rm} {...c} />
          </g>
        );
      })}
    </svg>
  );
}
