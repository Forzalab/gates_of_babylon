// Scene 6, PLATFORM (night, rain): the naan station again, after the blackout (Tony: same station, dusk -> night).
// Backdrop = <NaanPlatform variant="v3" time="night" />: same geometry as the naan scene, navy sky, tubes on, rain,
// the ad unlit and stuck on NANDA. props.train: 'here' | 'gone' (it pulls away in 3 stepped poses; reduced motion = hard cut).
// Overlay (alt): a low LED board hung from the canopy in the foreground, 「次は NEXT: ―― {OR} ――」 with OR in her red,
// and Nanda as a black silhouette under a clear umbrella in front of the dark ad; her output pin = one pink dot.
// The breath cue sits on the beat that reads the sign.
import { NaanPlatform } from './NaanPlatform.jsx';
import { OrSpans } from '../Say.jsx';
import './alt.css';

// Hangs from the canopy (above the frame), close to us: board 560 x 140, rods to y = 0. Clears the line sign on the right.
const B = { x: 290, y: 64, w: 560, h: 140 };

function NextBoard() {
  return (
    <g className="pl-board">
      {[B.x + 70, B.x + B.w - 70].map((x) => <rect key={x} x={x - 4} y="0" width="8" height={B.y} fill="#1c1830" />)}
      <rect x={B.x - 8} y={B.y - 8} width={B.w + 16} height={B.h + 16} rx="6" fill="#0e1622" />
      <rect x={B.x} y={B.y} width={B.w} height={B.h} rx="2" fill="#101634" />
      <rect x={B.x} y={B.y} width={B.w} height="6" fill="#2f4660" />
      <text x={B.x + B.w / 2} y={B.y + 44} textAnchor="middle" className="pl-sign-jp">次は</text>
      <text x={B.x + B.w / 2} y={B.y + 110} textAnchor="middle" className="pl-sign"><OrSpans text="NEXT: ―― {OR} ――" /></text>
    </g>
  );
}

// ~1.6 m tall at z = 3.2 m on the v3 camera (feet under the dialogue box), in front of the ad's left edge.
function Nanda() {
  return (
    <g transform="translate(1150 600) scale(.9)">
      {/* clear umbrella */}
      <path d="M-150 60 Q0 -70 150 60 Z" fill="#cfe3ff" opacity=".22" stroke="#e8f1ff" strokeWidth="4" />
      <line x1="0" y1="-4" x2="0" y2="150" stroke="#e8f1ff" strokeWidth="5" />
      {/* silhouette: hair, coat, legs */}
      <path d="M-40 70 Q-52 20 -8 8 Q36 0 44 44 Q52 86 30 110 L34 150 L-38 150 Q-58 110 -40 70Z" fill="#05060c" />
      <path d="M-46 146 Q-70 260 -60 420 H62 Q76 260 50 146Z" fill="#05060c" />
      <rect x="-40" y="418" width="26" height="140" fill="#05060c" /><rect x="14" y="418" width="26" height="140" fill="#05060c" />
      <path d="M-20 60 Q-70 110 -60 200" stroke="#05060c" strokeWidth="22" fill="none" />
      <circle cx="2" cy="176" r="8" fill="#ff5fa2" className="pin" />
    </g>
  );
}

export default function Platform({ props = {}, rm }) {
  return (
    <div className="art platform">
      <NaanPlatform variant="v3" time="night" rm={rm} train={props.train === 'gone' ? 'gone' : 'here'} />
      <svg className="pl-over" viewBox="0 0 1920 1080" role="img" aria-label="A board hangs over the platform: next, blank OR blank. A girl waits under a clear umbrella.">
        <NextBoard />
        <Nanda />
      </svg>
    </div>
  );
}
