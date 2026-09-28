// closeup-5 HER PIN STATES (horror 2). School: magical-girl brooch macro (*Sailor Moon* / *Madoka* soul-gem inserts) x the
// manga two-panel reaction split (object panel over face panel) x the mood-ring as a warning light.
// Central theme: THE PIN IS THE TRUTH HER FACE HIDES. Her NAND hair-pin's output bubble = her mood (characters.md):
// hums pink when safe, flickers when flustered, solid red when afraid, dark when she goes blank.
// 4 states x 2.6 s (10.4 s loop): the macro pin panel above, a letterboxed strip of her eyes below (Kuleshov pairing), a legend
// on the right that lights the current state. Flicker = 2 swaps a second (the glitch cap), each pose held 500 ms.
// RM: flicker becomes a static half-lit bubble (same meaning, no alternation); the state changes are hard cuts anyway.
import { useClock } from '../kit/hooks.js';
import { Line, Tag, Hud } from '../kit/ui.jsx';
import { Nanda, Frag, ART } from '../kit/Sprite.jsx';
import { stepAt } from '../kit/time.js';
import './closeup.css';

const STATES = [
  { id: 'hum', face: 'smile', label: 'hums pink = safe', line: 'NANDA: Good input.' },
  { id: 'flicker', face: 'tears', label: 'flickers = flustered', line: 'NANDA: W-wait. Not both at once—' },
  { id: 'red', face: 'wide', label: 'solid red = afraid', line: "NANDA: Don't lea—" },
  { id: 'off', face: 'blank', label: 'dark = gone quiet', line: '' },
];
const HOLD = 2600;

export default function Pin({ rm }) {
  const [t, restart] = useClock({ loop: HOLD * STATES.length });
  const i = Math.min(STATES.length - 1, Math.floor(t / HOLD));
  const st = STATES[i];
  // flicker: the bubble alternates bright / dim, each pose held 500 ms (2 swaps a second, under the glitch cap)
  const cls = st.id === 'flicker' ? (rm ? 'pin-flicker' : stepAt(t, 2, 500) ? 'pin-hum' : 'pin-flicker') : `pin-${st.id}`;
  return (
    <div className={`aroot closeup pinmacro st-${st.id}`} onClick={restart}>
      {/* top panel: the pin, macro, on her hair */}
      <svg className="pm-top" viewBox="0 0 1920 640" aria-hidden="true">
        <defs><linearGradient id="pm-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e9ebf6" /><stop offset="1" stopColor="#c8cce4" /></linearGradient></defs>
        <rect width="1920" height="640" fill="url(#pm-hair)" />
        {Array.from({ length: 26 }, (_, k) => <path key={k} d={`M${-200 + k * 90} -20 C${k * 90} 200 ${k * 90 - 120} 420 ${k * 90 + 60} 680`} stroke={k % 3 ? '#aeb3d3' : '#ffffff'} strokeWidth={k % 3 ? 4 : 10} fill="none" opacity=".8" />)}
        <g className={cls}><Frag html={ART.pin(900, 330, -14, 12)} className="pm-pin" /></g>
        {st.id === 'off' && <rect width="1920" height="640" fill="#0a0610" opacity=".35" />}
      </svg>
      {/* bottom panel: her eyes only, letterboxed */}
      <div className="pm-eyes">
        <svg viewBox="0 0 1920 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="1920" height="300" fill="#1b0f1f" />
          <Nanda face={st.face} pin={st.id === 'flicker' ? 'flicker' : st.id} x={960 - 300 * 3.4} y={150 - 352 * 3.4} s={3.4} />
        </svg>
      </div>
      <div className="pm-gutter" />
      {/* legend */}
      <ul className="pm-legend">
        {STATES.map((s, k) => <li key={s.id} className={k === i ? 'on' : ''}><i className={`dot d-${s.id}`} />{s.label}</li>)}
      </ul>
      <Line text={st.line} className="cu-line" />
      <Tag>closeup-5 · her pin states</Tag>
      <Hud><span className="a-chip">click = restart</span></Hud>
    </div>
  );
}
