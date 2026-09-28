// cam-3 SATOSHI KON (horror 4). School: Satoshi Kon (*Perfect Blue*, *Millennium Actress*, *Paprika*: match cuts that slip
// reality, pull-backs that reveal the scene was a screen) x Kon's cool Perfect Blue palette with her red x image-horror.
// Central theme: EVERY FRAME IS HER FRAME. Each pull-back reveals the "real" shot was a picture she put there, and the loop
// closes on her phone.
// Chain (one continuous loop, 31 s):
//   A  train carriage -> slow push into the umeboshi on the NOT Sweet ad until the red fills the screen
//   B  match cut: the red is HER IRIS -> pull back (log zoom about a fixed point) -> her face IS the train ad now
//   C  seamless nested pull-back: that whole carriage is a poster in the underpass -> "Don't read the ads. Read me."
//   D1 push into the dark tunnel mouth -> black
//   D2 her phone, face-down on her knee, flips (3 held poses) -> the screen shows the train -> push into the screen until it
//      IS the train at 1:1 -> loop to A (the cut is invisible because the frames are identical)
// RM: one held frame per shot (the reveal pose), hard cuts, the phone flip is a single cut to face-up.
import { memo } from 'react';
import Train from '../../../date-beta/art/Train.jsx';
import Underpass from '../../../date-beta/art/Underpass.jsx';
import CameraPiece from '../kit/Camera.jsx';
import { zoomAbout } from '../kit/fit.js';
import { Nanda, Frag, ART } from '../kit/Sprite.jsx';
import { clamp, ease } from '../kit/time.js';
import './kon.css';

const TRAIN_PROPS = { zoom: false };
// her poster over the NOT Sweet ad (ad box = 720,118 660x310). Bust placement chosen so her iris sits at a known point.
const BX = 985, BY = 74, BS = 0.55;
const IRIS = [BX + 246 * BS, BY + 356 * BS]; // left iris centre in scene px
const UME = [837, 288];                        // the umeboshi on main's ad

const TrainHer = memo(function TrainHer({ rm, face = 'smile' }) {
  return (
    <>
      <Train props={TRAIN_PROPS} rm={rm} />
      <svg className="art kon-ad" viewBox="0 0 1920 1080" aria-hidden="true">
        <defs><clipPath id="kon-adclip"><rect x="723" y="121" width="654" height="304" /></clipPath></defs>
        <g clipPath="url(#kon-adclip)">
          <rect x="720" y="118" width="660" height="310" fill="#ffe3f0" />
          <rect x="720" y="118" width="250" height="310" fill="#f0243f" />
          <text x="845" y="232" textAnchor="middle" className="kon-ad-name">NANDA</text>
          <text x="845" y="292" textAnchor="middle" className="kon-ad-sub">♡ Good input.</text>
          <text x="845" y="398" textAnchor="middle" className="kon-ad-figur">Figur</text>
          <Nanda face={face} pin="red" x={BX} y={BY} s={BS} />
        </g>
        <rect x="720" y="118" width="660" height="310" fill="none" stroke="#f0243f" strokeWidth="6" />
      </svg>
    </>
  );
});
const TrainHerWide = memo(function TrainHerWide({ rm }) { return <TrainHer rm={rm} face="wide" />; });

// the underpass with the carriage (with her ad) pasted into its first lit panel (panel box 200,250 400x290)
const NEST = { x: 200, y: 250 + (290 - 225) / 2, k: 400 / 1920 };
const UnderpassNest = memo(function UnderpassNest({ rm }) {
  return (
    <>
      <Underpass props={{}} rm={rm} />
      <div className="kon-nest" style={{ left: NEST.x, top: NEST.y, transform: `scale(${NEST.k})` }}><TrainHer rm face="wide" /></div>
      <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true"><rect x="200" y={NEST.y} width="400" height="225" fill="none" stroke="#fff7e0" strokeWidth="3" opacity=".6" /></svg>
    </>
  );
});

// her lap, her hand, her phone (landscape). Screen box = 680,380 640x360 (1/3 scale of the stage).
const SCREEN = { x: 680, y: 380, k: 1 / 3 };
const LapBase = memo(function LapBase() {
  return (
    <svg className="art kon-lap" viewBox="0 0 1920 1080" aria-hidden="true">
      <rect width="1920" height="1080" fill="#20243a" />
      {/* the train bench + her pleated skirt across the frame */}
      <rect x="0" y="0" width="1920" height="300" fill="#833545" />
      <path d="M-40 260 Q960 180 1960 260 V1100 H-40Z" fill="#23284a" />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${i * 130 - 20} 250 L${i * 130 + 30} 1080`} stroke="#1a1e3a" strokeWidth="10" />)}
      <path d="M-40 250 Q960 170 1960 250" stroke="#8a7ff0" strokeWidth="16" fill="none" />
      <Frag html={ART.hand(700, 900, 1.5, false, 'closed')} className="kon-hand" />
    </svg>
  );
});
// the phone flips in 3 held poses (500 ms), driven by shot time so a frozen ?t= frame is exact. RM: face-up at once.
function Phone({ local, rm }) {
  const p = rm ? 2 : local < 900 ? 0 : local < 1400 ? 1 : 2;
  return (
    <>
      <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true">
        {p === 0 && <g><rect x="660" y="360" width="680" height="400" rx="46" className="kon-phone-back" /><circle cx="1240" cy="430" r="26" fill="#2a2330" /><text x="1000" y="600" textAnchor="middle" className="kon-figur">Figur</text></g>}
        {p === 1 && <rect x="660" y="520" width="680" height="80" rx="30" className="kon-phone-back" />}
        {p === 2 && <rect x="660" y="360" width="680" height="400" rx="46" fill="#15101c" />}
      </svg>
      {p === 2 && <div className="kon-nest kon-screen" style={{ left: SCREEN.x, top: SCREEN.y, transform: `scale(${SCREEN.k})` }}><Train props={TRAIN_PROPS} rm /></div>}
      {p === 2 && <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true"><rect x="660" y="360" width="680" height="400" rx="46" fill="none" stroke="#3a1d3f" strokeWidth="20" /></svg>}
    </>
  );
}

const Black = memo(function Black() { return <div className="art" style={{ background: '#000' }} />; });

// poses
const A_PUSH = zoomAbout({ x: 960, y: 540, s: 1 }, { x: UME[0], y: UME[1], s: 15 });
const B_PULL = zoomAbout({ x: IRIS[0], y: IRIS[1], s: 480 / (26 * BS) }, { x: 960, y: 540, s: 1 });
const C_PULL = zoomAbout({ x: NEST.x + 200, y: NEST.y + 112.5, s: 1 / NEST.k }, { x: 960, y: 540, s: 1 });
const D1_PUSH = zoomAbout({ x: 960, y: 540, s: 1 }, { x: 70, y: 640, s: 5 });
const D2_PUSH = zoomAbout({ x: 960, y: 540, s: 1 }, { x: SCREEN.x + 320, y: SCREEN.y + 180, s: 3 });
const seg = (local, a, b, e = ease.inOut) => e(clamp((local - a) / (b - a)));

const SHOTS = [
  { id: 'train-ad', dur: 6000, Scene: Train, props: TRAIN_PROPS, cut: 'hard', pose: (l) => A_PUSH(seg(l, 1400, 5600, ease.in)), rmKey: { x: UME[0], y: UME[1], s: 4 },
    sub: [{ at: 300, text: 'Nobody reads the ads. You read this one.' }, { at: 3600, text: '' }] },
  { id: 'her-iris', dur: 7000, Scene: TrainHer, props: {}, cut: 'hard', pose: (l) => B_PULL(seg(l, 500, 5200, ease.out)), rmKey: { x: 960, y: 540, s: 1 },
    sub: [{ at: 5400, text: 'NANDA: You read me instead. Good.' }],
    layers: ({ local, rm }) => (!rm && local > 6200 ? <div className="kon-slip"><TrainHerWide rm /></div> : null) },
  { id: 'poster', dur: 7000, Scene: UnderpassNest, props: {}, cut: 'hard', pose: (l) => C_PULL(seg(l, 300, 5000, ease.inOut)), rmKey: { x: 960, y: 540, s: 1 },
    sub: [{ at: 4600, text: "NANDA: Don't read the ads. Read me." }] },
  { id: 'tunnel', dur: 2600, Scene: Underpass, props: {}, cut: 'hard', pose: (l) => D1_PUSH(seg(l, 0, 2600, ease.in)), rmKey: { x: 960, y: 540, s: 1 } },
  { id: 'her-phone', dur: 8000, Scene: LapBase, props: {}, cut: 'hard', inScene: ({ local, rm }) => <Phone local={local} rm={rm} />, pose: (l) => D2_PUSH(seg(l, 3600, 7800, ease.in)), rmKey: { x: 960, y: 540, s: 1 },
    sub: [{ at: 1900, text: 'NANDA: You keep looking. So do I.' }, { at: 4200, text: '' }] },
];

export default function Kon({ rm }) {
  return <CameraPiece shots={SHOTS} rm={rm} className="kon" tag="cam-3 · satoshi kon" />;
}
export { Black };
