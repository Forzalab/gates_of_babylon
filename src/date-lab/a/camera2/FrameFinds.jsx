// cam-h-r2-a "THE FRAME KEEPS FINDING HER" (builder A's take on the cam-3 Kon x cam-5 found-footage hybrid, horror 5).
// School: Satoshi Kon (match cuts that slip reality, pull-backs that reveal the frame was a picture) x Ju-On / found footage
// (camcorder OSD, handheld <= 3 Hz, the camera notices her first). Central theme: YOU ARE THE ONE FILMING — and every "reality"
// the camcorder shows you turns out to be one of HER frames.
// Every Kon move is motivated by the camcorder: the AF box locks onto a "face", the D.ZOOM pushes/releases on its own, and the
// readout stays continuous across the nested cuts (6x on the very first frame = you were already filming her phone).
//   1 train   : AF hunts (3 held boxes), locks "FACE 1" on the umeboshi; D.ZOOM pushes in by itself until red fills the frame
//   2 iris    : match cut, the red is HER iris; D.ZOOM releases 202x -> 6x; her face IS the ad; hard-cut slip smile -> wide
//   3 poster  : the release keeps going: the carriage is a poster in the underpass (1.0x). The AF box drops the poster and jumps
//               to the tunnel mouth, where she is standing.
//   4 tunnel  : NIGHT SHOT, D.ZOOM pushes on her by itself (4x); tracking dropout (one held 800 ms state, no strobe)
//   5 floor   : the camera falls and lies on its side in her genkan; timecode stamp frozen at 12:00:00 AM; it counts FACES 1..11
//               on an empty floor, one per 500 ms; FACE 12 = her phone on the tataki. D.ZOOM 6x into its screen = the train
//               window at 1:1 = frame 1. Seamless loop.
// RM: no handheld, one held frame per shot (the floor gets a second hard cut to the phone), counts still step, no dropout band.
import { memo, useMemo } from 'react';
import Train from '../../../date-beta/art/Train.jsx';
import Underpass from '../../../date-beta/art/Underpass.jsx';
import Genkan from '../../../date-beta/art/Genkan.jsx';
import { useClock } from '../kit/hooks.js';
import { camTransform } from '../kit/time.js';
import { Nanda, Frag, ART } from '../kit/Sprite.jsx';
import { Ors } from '../kit/ui.jsx';
import { subAt } from '../kit/Camera.jsx';
import { SHOTS, total, shotAt, poseOf, toScreen, handheld, zoomReadout, countAt, huntAt, AD, NEST, PHONE, HER_TUNNEL, GHOSTS } from './frame.js';
import './frame.css';

const TRAIN_PROPS = { zoom: false };
const GENKAN_PROPS = { insert: false };

// her face pasted over the NOT Sweet ad (as cam-3)
const TrainHer = memo(function TrainHer({ rm, face = 'smile' }) {
  return (
    <>
      <Train props={TRAIN_PROPS} rm={rm} />
      <svg className="art ff-ad" viewBox="0 0 1920 1080" aria-hidden="true">
        <defs><clipPath id={`ff-adclip-${face}`}><rect x="723" y="121" width="654" height="304" /></clipPath></defs>
        <g clipPath={`url(#ff-adclip-${face})`}>
          <rect x="720" y="118" width="660" height="310" fill="#ffe3f0" />
          <rect x="720" y="118" width="250" height="310" fill="#f0243f" />
          <text x="845" y="232" textAnchor="middle" className="ff-ad-name">NANDA</text>
          <text x="845" y="292" textAnchor="middle" className="ff-ad-sub">♡ Good input.</text>
          <text x="845" y="398" textAnchor="middle" className="ff-ad-figur">Figur</text>
          <Nanda face={face} pin="red" x={AD.x} y={AD.y} s={AD.s} />
        </g>
        <rect x="720" y="118" width="660" height="310" fill="none" stroke="#f0243f" strokeWidth="6" />
      </svg>
    </>
  );
});

const Her = memo(function Her({ x, y, s }) {
  return <svg className="art ff-her" viewBox="0 0 1920 1080" aria-label="A figure in the tunnel mouth."><Frag html={ART.sil('nanda', x, y, s, { slit: true })} /></svg>;
});

const UnderpassNest = memo(function UnderpassNest({ rm, her }) {
  return (
    <>
      <Underpass props={{}} rm={rm} />
      <div className="ff-nest" style={{ left: NEST.x, top: NEST.y, transform: `scale(${NEST.k})`, transformOrigin: '0 0' }}><TrainHer rm face="wide" /></div>
      {her && <Her {...HER_TUNNEL} />}
    </>
  );
});

// her phone on the tataki, turned -86 deg, screen = 320 x 180 world px showing the carriage (lit: it is NOT night-shot graded)
const Phone = memo(function Phone({ rm }) {
  const w = 1920 * PHONE.k, h = 1080 * PHONE.k;
  return (
    <>
      <svg className="art ff-phonebody" viewBox="0 0 1920 1080" aria-hidden="true">
        <g transform={`rotate(${PHONE.r} ${PHONE.x} ${PHONE.y})`}>
          <rect x={PHONE.x - w / 2 - 24} y={PHONE.y - h / 2 - 20} width={w + 48} height={h + 40} rx="26" fill="#1a1420" stroke="#ff9cc8" strokeWidth="4" />
        </g>
      </svg>
      <div className="ff-nest ff-screen" style={{ left: PHONE.x - 960, top: PHONE.y - 540, transform: `rotate(${PHONE.r}deg) scale(${PHONE.k})` }}>
        <Train props={TRAIN_PROPS} rm={rm} />
      </div>
    </>
  );
});

function FaceBox({ x, y, w, label, red, hunt }) {
  const h = w * 1.15;
  return (
    <div className={`ff-face${red ? ' red' : ''}${hunt ? ' hunt' : ''}`} style={{ left: x - w / 2, top: y - h / 2, width: w, height: h }}>
      <i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" />
      {label && <b>{label}</b>}
    </div>
  );
}

const pad = (n, k = 2) => String(Math.floor(n)).padStart(k, '0');
function Osd({ t, night, zoom, count, rm, af }) {
  const tape = 12 * 60 + 4 + t / 1000;
  const tc = `${pad(tape / 3600, 1)}:${pad((tape / 60) % 60)}:${pad(tape % 60)}`;
  const on = rm || Math.floor(t / 500) % 2 === 0; // REC dot: 1 Hz, 500 ms holds
  return (
    <div className="ff-osd" aria-hidden="true">
      <p className="rec"><i style={{ opacity: on ? 1 : 0.15 }} />REC</p>
      <p className="tc">{tc}</p>
      <p className="bat">▮▮▯ <span>SP</span></p>
      {night && <p className="night">NIGHT SHOT</p>}
      {af && <p className="af">AF ■</p>}
      {zoom && <p className="zoom">D.ZOOM {zoom}</p>}
      {count > 0 && <p className="count">FACES: {count}</p>}
      <p className="stamp">SEP.28.2026<br />12:00:00 AM</p>
      <i className="br tl" /><i className="br tr" /><i className="br bl" /><i className="br bh" />
    </div>
  );
}

export default function FrameFinds({ rm }) {
  const [t, restart] = useClock({ loop: total });
  const { shot, i, local } = shotAt(t);
  const pose = poseOf(shot, local, rm);
  const j = rm || shot.id === 'floor' ? { x: 0, y: 0, r: 0 } : handheld(t, shot.night ? 1.4 : 1);
  const drop = !rm && shot.dropout && local >= shot.dropout[0] && local < shot.dropout[1];
  const slipped = shot.slip != null && local >= shot.slip;
  const settled = shot.settle != null && local >= shot.settle && (!rm || local >= shot.rmLate.at);
  const night = shot.night && !settled;

  const scenes = useMemo(() => ({
    train: <Train props={TRAIN_PROPS} rm={rm} />,
    iris: <TrainHer rm={rm} />,
    irisWide: <TrainHer rm={rm} face="wide" />,
    poster: <UnderpassNest rm={rm} />,
    posterHer: <UnderpassNest rm={rm} her />,
    tunnel: <><Underpass props={{}} rm={rm} /><Her {...HER_TUNNEL} /></>,
    floor: <Genkan props={GENKAN_PROPS} rm={rm} />,
  }), [rm]);
  let scene = scenes[shot.id];
  if (shot.id === 'iris' && slipped) scene = scenes.irisWide;
  if (shot.id === 'poster' && local >= shot.her) scene = scenes.posterHer;

  // AF boxes, stepped to an 8 px grid (they jump, they do not glide)
  const snap = (p) => (rm ? p : [Math.round(p[0] / 8) * 8, Math.round(p[1] / 8) * 8]);
  const boxes = [];
  const hunt = rm ? null : huntAt(shot, local);
  if (hunt) boxes.push({ x: hunt[1], y: hunt[2], w: 150, hunt: true, screen: true });
  const locks = [];
  if (shot.lock && (rm ? !shot.lock2 : local >= shot.lock.from && (shot.lock.to == null || local < shot.lock.to))) locks.push(shot.lock);
  if (shot.lock2 && (rm || local >= shot.lock2.from)) locks.push(shot.lock2);
  for (const L of locks) {
    const [x, y] = snap(toScreen(pose, L.at[0], L.at[1], j));
    boxes.push({ x: Math.max(80, Math.min(1840, x)), y, w: Math.max(56, L.w * Math.min(pose.s, 3)), label: L.label, red: L.red });
  }
  const n = settled ? 0 : countAt(shot, local);
  if (n > 0) {
    GHOSTS.slice(0, Math.min(n, 11)).forEach(([gx, gy], k) => {
      const [x, y] = snap(toScreen(pose, gx, gy, j));
      boxes.push({ x, y, w: 70 + (k % 3) * 20, label: `FACE ${k + 1}`, red: n >= 12 });
    });
    if (n >= 12) {
      const [x, y] = snap(toScreen(pose, PHONE.x, PHONE.y, j));
      boxes.push({ x, y, w: Math.min(900, 250 * pose.s * 0.8), label: 'FACE 12', red: true });
    }
  }
  const zoom = zoomReadout(shot, pose);
  const sub = subAt(shot.sub, local);
  const camT = `translate(${j.x}px, ${j.y}px) ${camTransform({ ...pose, r: (pose.r ?? 0) + j.r })}`;

  return (
    <div className={`aroot ffh s-${shot.id}${night ? ' night' : ''}${drop ? ' drop' : ''}${rm ? ' is-rm' : ''}`} data-shot={shot.id} onClick={restart}>
      <div className="ff-cam" style={{ transform: camT }} key={shot.id}>
        <div className="ff-scene">{scene}</div>
        {shot.id === 'floor' && <Phone rm={rm} />}
      </div>
      <div className="ff-tape" />
      {drop && <div className="ff-band" />}
      {boxes.map((b, k) => <FaceBox key={k} {...b} />)}
      <Osd t={t} night={night} zoom={zoom} count={n} rm={rm} af={boxes.some((b) => !b.hunt)} />
      {sub && <div className="a-sub ff-sub" key={`${shot.id}${sub}`}><Ors text={sub} /></div>}
      <div className="a-tag">cam-h-r2-a · the frame keeps finding her · {i + 1}/{SHOTS.length} {shot.id}</div>
      <div className="a-hud"><span className="a-chip">click = restart</span></div>
    </div>
  );
}
