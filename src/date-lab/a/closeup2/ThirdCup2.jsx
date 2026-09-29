// closeup-3-r2 THE THIRD CUP, round 2 (horror 4). Same school as R1: Ozu's low tatami-height table (KyoAni quiet-kitchen
// inserts) x *Get Out*'s teacup x *Notorious*'s rack focus on a cup. The tea is never named.
// Theme: IT'S ALWAYS THREE OF US — the third cup is for YOU (Input B).
// Kept from R1 (the verdict's 89): table -> rack focus onto the ripples of a cup nobody poured -> ECU, the steam writes OR ->
// "For Input B. Silly. It's always three of us."
// R2 fix (the R1 self-critique): her hand is no longer main's fist gripping the cup. It is her own OPEN hand, red nails,
// fingertips on a saucer: she SLIDES it to you in held poses, lets go, and turns her palm up beside it. Gentle. That is the horror.
// RM: one held frame per shot, the static OR cut in at 0.8 s, held 1 s, cut out (script rule); the slide = one cut to the palm.
import { memo } from 'react';
import CameraPiece from '../kit/Camera.jsx';
import { parallax } from '../kit/fit.js';
import { camTransform, stepAt } from '../kit/time.js';
import { StrScene, Frag, ART } from '../kit/Sprite.jsx';
import HerHand from './HerHand.jsx';
import { PUSH_DUR, PUSH_SUB, pushAt, HAND } from './third.js';
import '../closeup/closeup.css';
import './closeup2.css';

const KITCHEN = ART.sceneKitchen();
const KitchenBG = memo(function KitchenBG() {
  return <svg className="art tc-bg" viewBox="0 0 1920 1080" aria-hidden="true"><StrScene html={KITCHEN} /></svg>;
});
const CUP3 = ART.cup(1300, 570, 1.4, { third: true });
const SCALE = [1, 1.3, 1.7];
const DY = [0, 20, 40];

function Saucer() {
  return (
    <g className="tc2-saucer">
      <ellipse cx="1300" cy="690" rx="112" ry="27" fill="#efe4ee" stroke="#3a1d3f" strokeWidth="5" />
      <ellipse cx="1300" cy="686" rx="74" ry="16" fill="none" stroke="#d9c6d6" strokeWidth="3" />
      <path d="M1196 694 C1240 712 1360 712 1404 694" stroke="#ff5fa2" strokeWidth="3" fill="none" opacity=".8" />
    </g>
  );
}

// the third cup on its own plane (so focus can rack to it), on a saucer, with ripple rings on the tea; her open hand slides it
function ThirdCupPlane({ pose, blur, ripple, push = 0, hand = null }) {
  const p = parallax(pose, 1);
  const s = SCALE[push], dy = DY[push];
  const h = hand && HAND[hand];
  return (
    <div className="fg" style={{ transform: camTransform(p), filter: blur ? `blur(${blur}px)` : undefined }}>
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" overflow="visible" aria-hidden="true">
        <g transform={`translate(1300 ${570 + dy}) scale(${s}) translate(-1300 -570)`}>
          <Saucer />
          <Frag html={CUP3} className="tc-cup3" />
          {ripple != null && [0, 1].map((i) => <ellipse key={i} cx="1300" cy="573" rx={14 + ((ripple + i) % 3) * 16} ry={3 + ((ripple + i) % 3) * 3} fill="none" stroke="#e9f7d0" strokeWidth="2.5" opacity=".8" />)}
          {h && (
            <g transform={`translate(${h.x} ${h.y}) scale(${HAND.s} ${HAND.s * (h.squash ?? HAND.squash)}) rotate(${h.rot})`} data-hand={hand}>
              <HerHand pose={hand} />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

// steam that writes OR: rises in 3 held poses (500 ms each) and fades; RM: static OR, cut in at 0.8 s, held 1 s, cut out
function SteamOr({ pose, local, rm }) {
  let y = 0, o = 1;
  if (rm) { if (local < 800 || local > 1800) return null; }
  else {
    const cyc = local % 2400;
    const step = Math.min(2, Math.floor(cyc / 500));
    y = -step * 36;
    o = cyc < 1500 ? 1 : Math.max(0, 1 - (cyc - 1500) / 700);
  }
  const p = parallax(pose, 1);
  return (
    <div className="fg" style={{ transform: camTransform(p) }} aria-hidden="true">
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" overflow="visible">
        <g transform={`translate(1300 ${470 + y})`} opacity={o}>
          <path d="M-40 70 C-60 40 -20 20 -36 -10 M30 70 C54 40 18 18 34 -12" className="tc-steam" />
          <text x="2" y="-18" textAnchor="middle" className="tc-or">OR</text>
        </g>
      </svg>
    </div>
  );
}

export const SHOTS = [
  {
    id: 'table', dur: 3400, Scene: KitchenBG, props: {}, cut: 'fade',
    keys: [{ t: 0, x: 960, y: 580, s: 1.02 }, { t: 3400, x: 990, y: 580, s: 1.1, e: 'linear' }],
    sub: [{ at: 300, text: 'Two cups poured. A third one, full.' }],
    layers: ({ pose }) => <><ThirdCupPlane pose={pose} /><div className="tc-grade" /></>,
  },
  {
    id: 'rack-focus', dur: 3800, Scene: KitchenBG, props: {}, cut: 'hard',
    keys: [{ t: 0, x: 1130, y: 560, s: 1.45, blur: 0 }, { t: 800, x: 1130, y: 560, s: 1.45, blur: 0 }, { t: 1700, x: 1150, y: 560, s: 1.5, blur: 7, e: 'sine' }, { t: 3800, x: 1160, y: 560, s: 1.52, blur: 7 }],
    rmKey: { x: 1150, y: 560, s: 1.5, blur: 7 },
    sub: [{ at: 1200, text: 'Nobody poured it. You heard a pour anyway.' }],
    layers: ({ pose, local, rm }) => {
      const fb = rm ? 0 : local < 800 ? 7 : local < 1700 ? 7 * (1 - (local - 800) / 900) : 0;
      return <><ThirdCupPlane pose={pose} blur={fb} ripple={rm ? 0 : stepAt(local, 3, 500)} /><div className="tc-grade" /></>;
    },
  },
  {
    id: 'steam-or', dur: 4400, Scene: KitchenBG, props: {}, cut: 'hard',
    keys: [{ t: 0, x: 1300, y: 470, s: 2.5, blur: 8 }, { t: 4400, x: 1300, y: 460, s: 2.7, blur: 8, e: 'linear' }],
    sub: [{ at: 1500, text: "MC: Who's the third cup for?" }],
    layers: ({ pose, local, rm }) => <><ThirdCupPlane pose={pose} /><SteamOr pose={pose} local={local} rm={rm} /><div className="tc-grade" /><span className="sr">[her breath]</span></>,
  },
  {
    id: 'her-open-hand', dur: PUSH_DUR, Scene: KitchenBG, props: {}, cut: 'hard',
    keys: [{ t: 0, x: 1420, y: 640, s: 1.25, blur: 8 }, { t: PUSH_DUR, x: 1560, y: 700, s: 1.3, blur: 8, e: 'linear' }],
    sub: PUSH_SUB,
    layers: ({ pose, local, rm }) => {
      const p = pushAt(local, rm);
      return <><ThirdCupPlane pose={pose} push={p.push} hand={p.hand} /><div className="tc-grade tc2-grade" /></>;
    },
  },
];

export default function ThirdCup2({ rm }) {
  return <CameraPiece shots={SHOTS} rm={rm} className="closeup thirdcup thirdcup2" tag="closeup-3-r2 · the third cup" bars={70} />;
}
