// cam-h-r2-b · "The Frame Keeps Finding Her" (Builder B's take on the cam-3 Kon x cam-5 found-footage hybrid, horror 5).
// Timeline + lens maths: ./shots.js (pure, node-tested seams). The camcorder OSD frames everything; each Kon reveal is done
// BY the camcorder (AF box finds a face, the D.ZOOM moves by itself), so reality slipping = you are the one filming.
// Loop: the last counted face (FACE 12, her by the genkan door, camera on the floor) is framed exactly like the first
// frame (a face in the train window, same size, same roll), so the piece loops with no visible cut.
import { memo, useMemo } from 'react';
import Train from '../../../date-beta/art/Train.jsx';
import Platform from '../../../date-beta/art/Platform.jsx';
import Underpass from '../../../date-beta/art/Underpass.jsx';
import ApartmentExt from '../../../date-beta/art/ApartmentExt.jsx';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/Genkan.jsx';
import { LabRoot, Markup, Sub, useClock, useShotSound } from '../shared/ui.jsx';
import { camTransform, handheld } from '../shared/timeline.js';
import { ART } from '../shared/art.js';
import { SHOTS, TOTAL, NEST, at, poseFor, toScreen } from './shots.js';
import '../cam5/cam5.css';
import './camh.css';

SHOTS.forEach((s, i) => { s.i = i; });
const BEDS = ['tape', 'rain'];
const HER = ART.sil('nanda', 0, 0, 1, { slit: true });
const TRAIN_PROPS = { zoom: false };

// the platform shot, and the same platform as a lit poster in the underpass's first panel
const PlatformGone = memo(function PlatformGone({ rm }) { return <Platform props={{ train: 'gone' }} rm={rm} />; });
const UnderNest = memo(function UnderNest({ rm }) {
  return (
    <>
      <Underpass props={{}} rm={rm} />
      <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true"><rect x="200" y="250" width="400" height="290" fill="#05070c" /></svg>
      <div className="ch-nest" style={{ left: NEST.x, top: NEST.y, transform: `scale(${NEST.k})` }}><PlatformGone rm /></div>
      <svg className="art" viewBox="0 0 1920 1080" aria-hidden="true">
        <rect x="200" y={NEST.y} width="400" height="225" fill="none" stroke="#fff7e0" strokeWidth="3" opacity=".7" />
        <text x="400" y={NEST.y + 250} textAnchor="middle" className="ch-poster">Figur · AND Line · last train 12:00</text>
      </svg>
    </>
  );
});

function FaceBox({ x, y, w, label, red, edge }) {
  const h = w * 1.15;
  return (
    <div className={`c5-face${red ? ' red' : ''}${edge ? ' edge' : ''}`} style={{ left: x - w / 2, top: y - h / 2, width: w, height: h }}>
      <i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" />
      <b>{edge === 'l' ? '◀ ' : ''}{label}</b>
    </div>
  );
}

// the OSD: REC blinks at 1 Hz; the clock is FROZEN at 12:00:00 AM (tape counter too), the date never changes
function Osd({ t, night, zoom, count, rm }) {
  const blink = rm || Math.floor(t / 500) % 2 === 0;
  return (
    <div className="c5-osd" aria-hidden="true">
      <p className="rec"><i style={{ opacity: blink ? 1 : 0.15 }} />REC</p>
      <p className="tc">12:00:00:00</p>
      <p className="bat">▮▮▯ <span>SP</span></p>
      {night && <p className="night">NIGHT SHOT</p>}
      {zoom && <p className="zoom">D.ZOOM {zoom}</p>}
      {count != null && <p className="count">FACES: {count}</p>}
      <p className="stamp">SEP.28.2026<br />12:00:00 AM</p>
      <i className="br tl" /><i className="br tr" /><i className="br bl" /><i className="br bh" />
    </div>
  );
}

export default function CamH({ rm }) {
  const [t] = useClock(TOTAL);
  const { shot, local } = at(t);
  const pose = poseFor(shot, local, rm);
  useShotSound(shot, local, t, BEDS);
  const j = rm ? { x: 0, y: 0, r: 0 } : handheld(t, shot.jit(local));
  if (shot.walk && !rm) j.y += Math.sin((t / 1000) * 2 * Math.PI * 1.7) * 6; // footfall bob, 1.7 Hz
  const drop = shot.dropout && local >= shot.dropout[0] && local < shot.dropout[1];
  const night = shot.night && local >= shot.night[0] && local < shot.night[1];

  const arts = useMemo(() => ({
    train: <Train props={TRAIN_PROPS} rm={rm} />,
    platform: <PlatformGone rm={rm} />,
    underpass: <UnderNest rm={rm} />,
    apartment: <ApartmentExt rm={rm} />,
    stairs: <Stairs props={{ door: 'shut' }} rm={rm} />,
    genkan: <Genkan props={{ insert: false }} rm={rm} />,
  }), [rm]);

  const faces = shot.faces(local).map((f) => {
    const q = toScreen(pose, f.x, f.y, j);
    const step = rm ? q : { x: Math.round(q.x / 8) * 8, y: Math.round(q.y / 8) * 8 }; // AF boxes jump, they don't glide
    const w = Math.max(56, f.w * q.k);
    return { ...f, x: Math.max(70, Math.min(1850, step.x)), y: step.y, w, edge: step.x < 40 ? 'l' : null };
  }).filter((f) => f.y > -200 && f.y < 1280);
  const dz = shot.dzoom?.(local, pose);
  const zoom = dz && dz > 1.05 ? `${dz.toFixed(1)}x` : null;
  const count = shot.count?.(local) ?? null;
  const her = shot.her && local >= (shot.her.from ?? 0) ? shot.her : null;
  const line = (shot.lines ?? []).filter(([ms]) => local >= ms).at(-1)?.[1] ?? (shot.text && local >= shot.textAt ? shot.text : null);

  return (
    <LabRoot rm={rm} className={`c5 ch s-${shot.id}${night ? ' night' : ''}${drop ? ' drop' : ''}`} captions="bl">
      <div className="c5-cam" style={{ transform: `translate(${j.x}px, ${j.y}px) ${camTransform({ ...pose, r: (pose.r ?? 0) + j.r })}`, '--bl': `${Math.min(0.6, 3 / pose.s)}px` }}>
        {arts[shot.art]}
        {her && (
          <svg className={`art c5-her${her.refl ? ` refl${night ? ' dark' : ''}` : ''}`} viewBox="0 0 1920 1080"
            aria-label={her.refl ? 'Her face in the train window. The seat is empty.' : 'Her. She was not there before.'}>
            <g transform={`translate(${her.x} ${her.y}) scale(${her.s})`}><Markup html={HER} /></g>
          </svg>
        )}
      </div>
      <div className="c5-tape" />
      <div className={`c5-band${drop ? ' big' : ''}`} />
      {faces.map((f, i) => <FaceBox key={i} {...f} />)}
      <Osd t={t} night={night} zoom={zoom} count={count} rm={rm} />
      {line && <Sub text={line} key={line} className={`c5-sub${shot.id === 'fall' ? ' top' : ''}`} />}
      <p className="ch-slate">cam-h-r2-b · {shot.id}</p>
    </LabRoot>
  );
}
