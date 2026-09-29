// cam-4 · HITCHCOCK (horror 4). Central theme: "the bomb under the table" + the Vertigo effect.
// Suspense grammar: show the audience the danger first (the slippers are already set out), THEN make them watch the
// long approach. Saul Bass title (her eye, red; a spiral), establishing crane, low-angle rack focus up the stairs,
// a tracking shot down the walkway, then a TRUE dolly-zoom on her door: a pinhole camera in shared/persp.js moves
// in while the focal length widens (f = f0 * D / D0), so the door holds its size while the walkway yawns open.
// Inside, the reverse dolly-zoom: the slippers hold still, the hallway compresses, and she is at the end of it.
// Reduced motion: each camera move = hard cuts to its keyframes (the dolly-zooms become 3 held frames).
import { useMemo } from 'react';
import ApartmentExt from '../../../date-beta/art/ApartmentExt.jsx';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/GenkanArrival.jsx';
import Rain from '../../../date-beta/art/Rain.jsx';
import { LabRoot, Markup, Sub, useClock, useShotSound } from '../shared/ui.jsx';
import { build, shotAt, poseAt, camTransform } from '../shared/timeline.js';
import { renderFaces, project, clipNear, billboard, dollyF } from '../shared/persp.js';
import { ART, placed } from '../shared/art.js';
import { walkway, genkan, WALK, GENKAN } from './world.js';
import './cam4.css';

// ---------- 3D cameras ----------
const walkCam = (z, f) => ({ x: 0, y: 1.5, z, f, cx: 960, cy: 540 });
const TRACK = (u) => walkCam(-1.5 + 2.2 * u, 1000);
const DOLLY = (u) => { const z = 6 + 7.8 * u; return walkCam(z, dollyF(2000, WALK.len - 6, WALK.len - z)); };
const GK = (u) => { const D = 0.9 + 1.6 * u; return { x: 0, y: 0.65, z: GENKAN.slippers - D, f: 950 * D, cx: 960, cy: 410 }; };

export const SHOTS = build([
  { id: 'eye', kind: 'eye', dur: 1800, cam: [[0, { s: 8.5 }], [1, { s: 10.5 }, 'linear']], cues: [[200, 'drone']], beds: ['drone'] },
  { id: 'title', kind: 'title', dur: 2600, cam: [[0, { r: -10 }], [1, { r: 12 }, 'linear']], cues: [[0, 'stab'], [900, 'breath']] },
  { id: 'bomb', kind: 'art', art: 'genkan', dur: 3000, text: 'Upstairs, a pair of slippers is already waiting.',
    cam: [[0, { x: 960, y: 540, s: 1 }], [1, { x: 990, y: 560, s: 1.06 }]], cues: [[300, 'thump']] },
  { id: 'est', kind: 'art', art: 'apartment', dur: 4000, text: 'Her building. One window lit.', beds: ['rain'],
    cam: [[0, { x: 960, y: 330, s: 1.35 }], [1, { x: 960, y: 560, s: 1.02 }]] },
  { id: 'stairs', kind: 'art', art: 'stairs', dur: 4200, text: 'NANDA: This is me. Unit 12.', beds: ['rain'], cues: [[200, 'steps']],
    cam: [[0, { x: 430, y: 800, s: 1.6, blur: 5, fg: 0 }], [0.45, { x: 860, y: 640, s: 1.45, blur: 5, fg: 0 }],
      [0.7, { x: 1180, y: 540, s: 1.38, blur: 0, fg: 12 }], [1, { x: 1360, y: 480, s: 1.35, blur: 0, fg: 12 }]] },
  { id: 'track', kind: 'walk', dur: 3000, beds: ['rain'], cam: [[0, { u: 0 }], [1, { u: 1 }, 'linear']], cues: [[0, 'steps', { n: 6 }]] },
  { id: 'dolly', kind: 'dolly', dur: 5200, text: 'NANDA: Come in? Just for tea.', beds: ['rain', 'drone'],
    cam: [[0, { u: 0 }], [0.5, { u: 0.5 }, 'inOut'], [1, { u: 1 }, 'inOut']], cues: [[0, 'stab'], [2600, 'thump']] },
  { id: 'open', kind: 'open', dur: 1500, beds: ['drone'], cam: [[0, { u: 1 }]], cues: [[100, 'door']] },
  { id: 'inside', kind: 'genkan3d', dur: 5600, text: "Men's slippers. Already set out.", beds: ['drone'],
    cam: [[0, { u: 0 }], [0.5, { u: 0.5 }, 'inOut'], [1, { u: 1 }, 'inOut']],
    cues: [[0, 'thump'], [1900, 'thump'], [3300, 'thump'], [4400, 'thump'], [5100, 'breath']] },
  { id: 'black', kind: 'black', dur: 2600, text: "NANDA: Obviously you'll remember.", cues: [[200, 'bell']] },
]);
const BEDS = ['rain', 'drone'];

// ---------- title: the Saul Bass spiral ----------
const SPIRAL = (() => {
  let d = '';
  for (let k = 0; k <= 720; k++) {
    const a = (k / 720) * Math.PI * 2 * 7, r = 6 + (k / 720) * 560;
    d += `${k ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r * 0.92).toFixed(1)}`;
  }
  return d;
})();
const FALLER = ART.sil('suit', 0, 0, 0.32);
function Title({ pose }) {
  return (
    <svg className="art c4-title" viewBox="0 0 1920 1080" role="img" aria-label="Title: UNIT 12. A spiral.">
      <rect width="1920" height="1080" fill="#d7263d" />
      <g transform={`translate(1240 540) rotate(${pose.r})`}>
        <path d={SPIRAL} className="c4-spiral" />
        <g transform={`rotate(${-pose.r * 2}) translate(60 -40) rotate(35)`}><Markup html={FALLER} className="c4-faller" /></g>
      </g>
      <text x="120" y="520" className="c4-t1">UNIT 12</text>
      <text x="126" y="600" className="c4-t2">a Figur picture</text>
      <text x="126" y="980" className="c4-t3">in <tspan className="or-svg" dx="1" dy="1">OR</tspan><tspan dy="-1">der of appearance: her, then you</tspan></text>
    </svg>
  );
}

// ---------- the eye (Vertigo's opening: an extreme close-up, red) ----------
const BUST = placed(ART.nanda({ face: 'blank' }), 0, 0, 600, 900);
function Eye({ pose }) {
  const s = pose.s;
  return (
    <svg className="art c4-eye" viewBox="0 0 1920 1080" role="img" aria-label="An extreme close-up of her eye.">
      <filter id="c4-red"><feColorMatrix type="matrix" values=".42 .7 .14 0 .06  .05 .1 .02 0 0  .07 .12 .03 0 .02  0 0 0 1 0" /></filter>
      <g filter="url(#c4-red)">
        <rect width="1920" height="1080" fill="#ffece3" />
        <g transform={`translate(${960 - 244 * s} ${540 - 352 * s}) scale(${s})`}><Markup html={BUST} /></g>
      </g>
    </svg>
  );
}

// ---------- 3D ----------
const WALK_FACES = walkway();
const WALK_OPEN = walkway({ open: true });
const GK_FACES = genkan();
const HER = ART.sil('nanda', 0, 0, 1);

function Rain3D({ cam, rm }) {
  // rain only beyond the rail: the open slot between the parapet and the slab, projected
  const slot = clipNear([[-1, 0.5, cam.z - 1], [-1, 2.6, cam.z - 1], [-1, 2.6, 18], [-1, 0.5, 18]], cam.z + 0.15);
  const pts = slot.map((p) => project(cam, p).slice(0, 2).map((v) => v.toFixed(0)).join(',')).join(' ');
  return (
    <g>
      <clipPath id="c4-slot"><polygon points={pts} /></clipPath>
      <g clipPath="url(#c4-slot)"><Rain seed={21} rm={rm} opacity={0.45} n={220} /></g>
    </g>
  );
}

function World({ cam, faces, fog, rm, rain, her, plate }) {
  const list = renderFaces(cam, faces, fog);
  const items = list.map((f, i) => ({ depth: f.depth, node: <path key={i} d={f.d} fill={f.fill} opacity={f.opacity} /> }));
  if (her) {
    const b = billboard(cam, [0, GENKAN.stepH, GENKAN.her], 1.62);
    const k = b.px / 560;
    items.push({ depth: GENKAN.her - cam.z, node: <g key="her" transform={`translate(${b.x} ${b.y}) scale(${k})`}><Markup html={HER} className="c4-her" /></g> });
    items.sort((a, c) => c.depth - a.depth);
  }
  let label = null;
  if (plate) {
    const [x, y, dz] = project(cam, [0.77, 1.52, WALK.len - 0.02]);
    label = <text x={x} y={y + (cam.f * 0.035) / dz} textAnchor="middle" className="c4-plate" style={{ fontSize: `${(cam.f * 0.1) / dz}px` }}>Unit 12</text>;
  }
  return (
    <svg className="art c4-world" viewBox="0 0 1920 1080" role="img" aria-label="A 3D shot.">
      <rect width="1920" height="1080" fill="#05060a" />
      {items.map((it) => it.node)}
      {label}
      {rain && <Rain3D cam={cam} rm={rm} />}
    </svg>
  );
}

// a foreground rail (parallax + the rack-focus partner in the stairs shot)
function Foreground({ pose }) {
  const dx = -(pose.x - 960) * 0.9, dy = -(pose.y - 540) * 0.5;
  return (
    <svg className="art c4-fg" viewBox="0 0 1920 1080" aria-hidden="true" style={{ filter: `blur(${pose.fg}px)` }}>
      <g transform={`translate(${dx} ${dy})`}>
        <rect x="120" y="-200" width="70" height="1500" fill="#0a0c12" />
        <rect x="-200" y="90" width="2400" height="38" fill="#0e1119" />
        <rect x="1780" y="-200" width="90" height="1500" fill="#0a0c12" />
      </g>
    </svg>
  );
}

export default function Cam4({ rm }) {
  const [t] = useClock(SHOTS.total);
  const { shot, local, p } = shotAt(SHOTS, t);
  const pose = poseAt(shot.cam, p, rm);
  useShotSound(shot, local, t, BEDS);

  const arts = useMemo(() => ({
    genkan: <Genkan props={{ insert: true }} rm={rm} />,
    apartment: <ApartmentExt rm={rm} />,
    stairs: <Stairs props={{ door: 'shut' }} rm={rm} />,
  }), [rm]);

  let body;
  if (shot.kind === 'eye') body = <Eye pose={pose} />;
  else if (shot.kind === 'title') body = <Title pose={pose} />;
  else if (shot.kind === 'art') {
    body = (
      <>
        <div className="c4-cam" style={{ transform: camTransform(pose), filter: pose.blur ? `blur(${pose.blur}px)` : 'none' }}>{arts[shot.art]}</div>
        {shot.id === 'stairs' && <Foreground pose={pose} />}
      </>
    );
  } else if (shot.kind === 'walk') body = <World cam={TRACK(pose.u)} faces={WALK_FACES} rm={rm} rain plate />;
  else if (shot.kind === 'dolly') body = <World cam={DOLLY(pose.u)} faces={WALK_FACES} rm={rm} rain plate />;
  else if (shot.kind === 'open') body = <World cam={DOLLY(1)} faces={WALK_OPEN} rm={rm} rain plate />;
  else if (shot.kind === 'genkan3d') body = <World cam={GK(pose.u)} faces={GK_FACES} fog={{ fog: '#0b0a0f', fogNear: 1.5, fogFar: 11 }} rm={rm} her />;
  else body = <div className="c4-black" />;

  return (
    <LabRoot rm={rm} className={`c4 k-${shot.kind} s-${shot.id}`} captions="tl">
      {body}
      <div className="c4-grade" />
      <svg className="c4-grain" viewBox="0 0 1920 1080" aria-hidden="true">
        <filter id="c4-n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" /><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0" /></filter>
        <rect width="1920" height="1080" filter="url(#c4-n)" />
      </svg>
      <Sub text={shot.text} key={shot.id} />
      <p className="c4-slate">cam-4 · {shot.id} · {(t / 1000).toFixed(1)}s</p>
    </LabRoot>
  );
}
