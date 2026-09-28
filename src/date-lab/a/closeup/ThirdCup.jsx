// closeup-3 THE THIRD CUP + STEAM "OR" (horror 4). School: Ozu's low tatami-height table shots (anime: Kyoto Animation
// quiet-kitchen inserts) x *Get Out*'s teacup (a domestic object as the trigger) x Hitchcock's *Notorious* poisoned-cup
// rack focus. The tea is never named or explained; only the cup, the steam and who it is for.
// Central theme: IT'S ALWAYS THREE OF US — the third cup is for YOU, the player (Input B).
// Shots (16 s loop): (1) the table, two cups poured and a third one full that nobody poured; (2) rack focus: cups 1-2 go soft,
// the third comes sharp, its surface rings (stepped) as if just poured; (3) ECU: the steam writes OR in her red, rising in
// 3 held poses and fading, with the breath caption; "MC: Who's the third cup for?"; (4) her hand slides the cup toward the
// lens (3 held poses, toward YOU): "For Input B. Silly. It's always three of us."
// RM: one held frame per shot; the steam OR is a static OR cut in, held 1 s, cut out (script rule); the cup push is one cut.
import { memo } from 'react';
import CameraPiece from '../kit/Camera.jsx';
import { parallax } from '../kit/fit.js';
import { camTransform, stepAt } from '../kit/time.js';
import { StrScene, Frag, ART } from '../kit/Sprite.jsx';
import './closeup.css';

const KITCHEN = ART.sceneKitchen();
const KitchenBG = memo(function KitchenBG() {
  return <svg className="art tc-bg" viewBox="0 0 1920 1080" aria-hidden="true"><StrScene html={KITCHEN} /></svg>;
});
const CUP3 = ART.cup(1300, 570, 1.4, { third: true });

// the third cup on its own plane (so focus can rack to it), with ripple rings on the tea
function ThirdCupPlane({ pose, blur, ripple, push = 0 }) {
  const p = parallax(pose, 1);
  const s = [1, 1.3, 1.7][push];
  const dy = [0, 40, 90][push];
  return (
    <div className="fg" style={{ transform: camTransform(p), filter: blur ? `blur(${blur}px)` : undefined }}>
      <svg viewBox="0 0 1920 1080" width="1920" height="1080" overflow="visible" aria-hidden="true">
        <g transform={`translate(1300 ${570 + dy}) scale(${s}) translate(-1300 -570)`}>
          <Frag html={CUP3} className="tc-cup3" />
          {ripple != null && [0, 1].map((i) => <ellipse key={i} cx="1300" cy="573" rx={14 + ((ripple + i) % 3) * 16} ry={3 + ((ripple + i) % 3) * 3} fill="none" stroke="#e9f7d0" strokeWidth="2.5" opacity=".8" />)}
        </g>
        {push > 0 && <g className="tc-herhand" transform={`translate(${1300 + 128 * s} ${590 + dy + 40 * s}) scale(${0.62 * s}) rotate(-90)`}><Frag html={ART.hand(0, 0, 1.0, false, 'closed')} /></g>}
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

const SHOTS = [
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
    id: 'toward-you', dur: 4600, Scene: KitchenBG, props: {}, cut: 'hard',
    keys: [{ t: 0, x: 1300, y: 600, s: 1.6, blur: 8 }, { t: 4600, x: 1300, y: 600, s: 1.6, blur: 8 }],
    sub: [{ at: 400, text: 'NANDA: For Input B. Silly.' }, { at: 2300, text: "NANDA: It's always three of us." }],
    layers: ({ pose, local, rm }) => <><ThirdCupPlane pose={pose} push={rm ? 2 : local < 900 ? 0 : local < 1400 ? 1 : 2} /><div className="tc-grade tc-grade-4" /></>,
  },
];

export default function ThirdCup({ rm }) {
  return <CameraPiece shots={SHOTS} rm={rm} className="closeup thirdcup" tag="closeup-3 · the third cup" bars={70} />;
}
