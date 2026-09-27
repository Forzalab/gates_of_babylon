// In-progress wire: a thin "pencil" line from the pin to the cursor, at rule weight (2 screen px, non-scaling). On drop
// the finished Wire takes the normal routed path. A paper casing keeps it readable where it crosses an existing ink or
// orange wire, so it always reads as starting AT the knob.
// Tony: grid-like, never a diagonal. Right angles: across, down, across; the bend sits on a grid line (20 flow units).
export const GRID = 20;
export const draftPoints = ([x0, y0], [x1, y1], grid = GRID) => {
  const mx = grid ? Math.round((x0 + x1) / 2 / grid) * grid : (x0 + x1) / 2;
  return [[x0, y0], [mx, y0], [mx, y1], [x1, y1]];
};
export const polyD = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');

export default function Draft({ fromX, fromY, toX, toY }) {
  const d = polyD(draftPoints([fromX, fromY], [toX, toY]));
  return (
    <g>
      <path className="wire-draft-casing" d={d} fill="none" />
      <path className="wire-draft" d={d} fill="none" />
    </g>
  );
}
