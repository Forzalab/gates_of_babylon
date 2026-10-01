// M4 replay (v3-train 2, research/sprint-0930/replay/AUDIT.md): the window beat. "In the dark window you see your face.
// And hers." (run 1/2) / "three of you sit in a row. You, you, you." (run 3). The bg is the train-rain trace (the same
// grey 5:20 PM carriage, its big left pane); the reflections are flat cels on the glass only (clipped to the panes):
// pale head-and-shoulder ghosts of you, sitting along the pane bottom, smaller toward the far end (the pane recedes to
// the right), plus her own sprite mirrored and faint beside you (props.her). No feet: a reflection cut at the sill.
// props: you = 1..3 ghosts of you, her = bool. Used under the closeup shot (props.ofProps).
import TrainRain from './TrainRain.jsx';
import { nandaSVG } from '../nanda.js';

// one seated ghost: head + hair cap + shoulders, its sill line at y (the pane bottom), size s
function Ghost({ x, y, s, k }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} data-ghost={k}>
      <path d="M-78 0 Q-76 -70 -40 -84 Q0 -96 40 -84 Q76 -70 78 0 Z" fill="#e9eef6" />
      <ellipse cx="0" cy="-138" rx="40" ry="46" fill="#e9eef6" />
      <path d="M-42 -146 Q-40 -192 0 -190 Q42 -192 42 -146 Q30 -168 0 -166 Q-28 -168 -42 -146 Z" fill="#c9d2de" />
      {/* the eyes: two darker dashes, the same on every ghost (it is the same you) */}
      <path d="M-18 -136 h10 M8 -136 h10" stroke="#8d98a8" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

const SPOTS = [[120, 604, 1], [262, 600, 0.86], [388, 596, 0.74]];

export default function TrainWindow({ props = {}, rm }) {
  const you = Math.min(3, Math.max(1, props.you ?? 1));
  const her = !!props.her && you < 3;
  const herSvg = her ? nandaSVG({ face: '4', talk: false }) : '';
  const over = (
    <g clipPath="url(#r3tr-glass-clip)" style={{ mixBlendMode: 'screen' }} opacity=".34" aria-hidden="true">
      {SPOTS.slice(0, you).map(([x, y, s], k) => <Ghost key={k} x={x} y={y} s={s} k={k} />)}
      {/* hers: mirrored (a reflection), waist-up above the sill, beside you */}
      {her && <g transform="translate(330 640) scale(-0.62 0.62)" dangerouslySetInnerHTML={{ __html: herSvg }} />}
    </g>
  );
  const label = you >= 3
    ? 'Close-up on the rainy train window: three pale reflections of you sit in a row in the glass.'
    : 'Close-up on the rainy train window: your pale reflection in the glass, and hers beside it, staring.';
  return <TrainRain rm={rm} id="train-window" over={over} label={label} />;
}
