// A virtual camera over main's 1920x1080 scene art (builder A camera + nanda pieces).
// shots = [{ id, dur, Scene, props, keys: [{ t, x, y, s, r, blur }], rmKey?, cut: 'hard'|'fade'|'white', sub, grade, layers(ctx) }]
//   keys  = camera keyframes in shot-local ms (x/y = the scene point at frame centre, s = zoom, r = roll, blur = BG plane blur px).
//   layers(ctx) = extra planes drawn over the scene (foreground props for parallax, flares, grades) — ctx = { pose, local, k, rm, t, screen }.
// Camera, fades and focus pulls are smooth (rAF). Reduced motion: each shot is ONE held frame (its rmKey or last key), cut in hard.
import { memo } from 'react';
import { useClock } from './hooks.js';
import { shotAt, keyAt, rmPose, total, camTransform, clamp } from './time.js';
import { parallax, screen, fit, zoomAbout } from './fit.js';
import { Ors } from './ui.jsx';

export const FADE = 450;

export { parallax, screen, fit, zoomAbout };

const Plane = memo(function Plane({ Scene, props, rm }) {
  return <Scene props={props} rm={rm} />;
});

export function subAt(sub, local) {
  if (!sub) return null;
  if (typeof sub === 'string') return sub;
  let cur = null;
  for (const s of sub) if (local >= s.at) cur = s.text;
  return cur;
}

export default function CameraPiece({ shots, rm, className = '', tag, children, bars = 0 }) {
  const len = total(shots);
  const [t, restart] = useClock({ loop: len });
  const { shot, i, local, k } = shotAt(shots, t);
  const raw = rm ? (shot.rmKey ?? (shot.keys ? rmPose(shot.keys) : shot.pose(shot.dur))) : shot.pose ? shot.pose(local) : keyAt(shot.keys, local);
  const pose = shot.free ? raw : fit(raw);
  const next = shots[i + 1] ?? shots[0];
  // fade through black / white at shot boundaries (smooth), never in RM
  let fade = 0, fadeCol = '#000';
  if (!rm) {
    if (shot.cut === 'fade' || shot.cut === 'white') { fade = Math.max(fade, 1 - clamp(local / FADE)); if (shot.cut === 'white') fadeCol = '#fff'; }
    if (next.cut === 'fade' || next.cut === 'white') { fade = Math.max(fade, clamp((local - (shot.dur - FADE)) / FADE)); if (next.cut === 'white') fadeCol = '#fff'; }
  }
  const ctx = { pose, local, k, rm, t, shot, i, screen: (px, py) => screen(pose, px, py) };
  const sub = subAt(shot.sub, local);
  const barPx = typeof shot.bars === 'number' ? shot.bars : bars;
  return (
    <div className={`aroot campiece ${className} shot-${shot.id}${rm ? ' is-rm' : ''} a-bars`} style={{ '--bar': `${barPx}px` }} data-shot={shot.id} onClick={restart}>
      <div className="camplane" style={{ transform: camTransform(pose), filter: pose.blur ? `blur(${pose.blur}px)` : undefined }} key={shot.id}>
        <Plane Scene={shot.Scene} props={shot.props} rm={rm} />
        {shot.inScene?.(ctx)}
      </div>
      {shot.layers?.(ctx)}
      {shot.grade && <div className={`grade ${shot.grade}`} />}
      {children?.(ctx)}
      {fade > 0 && <div className="camfade" style={{ opacity: fade, background: fadeCol }} />}
      {sub && <div className="a-sub" key={`${shot.id}${sub}`}><Ors text={sub} /></div>}
      {tag && <div className="a-tag">{tag} · shot {i + 1}/{shots.length} · {shot.id}</div>}
      <div className="a-hud"><span className="a-chip">click = restart</span></div>
    </div>
  );
}
