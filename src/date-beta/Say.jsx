// Say.jsx: the dialogue box + the OR rule (Tony edits 2): every "OR" on screen renders in her red, offset 1px.
export const orParts = (text) => text.split(/(OR)/).filter(Boolean).map((t) => ({ t, or: t === 'OR' }));

export function Ors({ text }) {
  return orParts(text).map((p, i) => (p.or ? <span key={i} className="or">OR</span> : p.t));
}

// SVG twin of <Ors>: tspans inside a <text>.
export function OrSpans({ text }) {
  return orParts(text).map((p, i) => (p.or ? <tspan key={i} className="or-svg" dx="1" dy="1">OR</tspan>
    : <tspan key={i} dy={i && orParts(text)[i - 1].or ? -1 : 0}>{p.t}</tspan>));
}

// "NANDA: line" -> a speaker chip + the line. No prefix = narration.
export function Say({ text }) {
  const m = /^([A-Z][A-Z ]{0,11}):\s*(.*)$/.exec(text);
  const who = m?.[1], line = m ? m[2] : text;
  return (
    <div className={`say${who ? ` who-${who.toLowerCase()}` : ' narration'}`} role="status">
      {who && <b className="speaker">{who}</b>}
      <p><Ors text={line} /></p>
    </div>
  );
}
