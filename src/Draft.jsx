// In-progress wire: a straight thin "pencil" line from the pin to the cursor, at rule weight (2 screen px,
// non-scaling). On drop the finished Wire takes the normal routed path. A paper casing keeps it readable where it
// crosses an existing ink or orange wire, so it always reads as starting AT the knob.
export default function Draft({ fromX, fromY, toX, toY }) {
  const d = `M ${fromX} ${fromY} L ${toX} ${toY}`;
  return (
    <g>
      <path className="wire-draft-casing" d={d} fill="none" />
      <path className="wire-draft" d={d} fill="none" />
    </g>
  );
}
