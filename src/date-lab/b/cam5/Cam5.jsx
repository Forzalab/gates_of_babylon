// cam-5 · JU-ON / FOUND FOOTAGE (horror 5). Central theme: "the frame notices her before you do".
// A camcorder walks the demo path home (platform -> underpass -> her building -> stairs -> genkan). Handheld drift
// (a sum of sines, every component <= 3 Hz), timecode, REC, a date stamp that rolls to 12:00 AM and freezes.
// The camera's face detection keeps finding HER: on the platform, on an ad with no face, at the tunnel mouth after
// you pan away (the box follows her off-frame), in the one lit window (the camera digital-zooms by itself), then at
// the door after a tracking dropout. The camera falls; lying on the genkan floor it counts FACE 1..12 in an empty room.
// Last: she speaks to the lens. Ju-On grammar: she is closer every cut; the throat rattle; no jump flash.
// Reduced motion: no handheld drift, camera moves hard-cut to keyframes, the fall is a cut to the tilted frame,
// the dropout is one held frame, grain holds still.
import { useMemo } from 'react';
import Platform from '../../../date-beta/art/Platform.jsx';
import Underpass from '../../../date-beta/art/Underpass.jsx';
import ApartmentExt from '../../../date-beta/art/ApartmentExt.jsx';
import Stairs from '../../../date-beta/art/Stairs.jsx';
import Genkan from '../../../date-beta/art/Genkan.jsx';
import { LabRoot, Markup, Sub, useClock, useShotSound } from '../shared/ui.jsx';
import { build, shotAt, poseAt, camTransform, handheld } from '../shared/timeline.js';
import { ART } from '../shared/art.js';
import './cam5.css';

// face targets are in ART space (the 1920x1080 scene), converted through the camera each frame
export const SHOTS = build([
  { id: 'platform', art: 'platform', dur: 5200, beds: ['tape', 'rain'], cues: [[0, 'rec'], [2600, 'af']],
    cam: [[0, { x: 1000, y: 560, s: 1.12 }], [1, { x: 1180, y: 560, s: 1.25 }]],
    faces: [{ from: 2600, x: 1342, y: 500, w: 120, label: 'FACE 1' }] },
  { id: 'underpass', art: 'underpass', dur: 5600, beds: ['tape'], cues: [[400, 'steps', { n: 6 }], [1800, 'af'], [4200, 'af'], [4700, 'croak']],
    text: 'Is that… her? At the stairs?', textAt: 4300,
    cam: [[0, { x: 660, y: 560, s: 1.5 }], [0.6, { x: 1180, y: 540, s: 1.5 }, 'inOut'], [1, { x: 1260, y: 540, s: 1.5 }]],
    her: { x: 70, y: 780, s: 0.28, from: 3600 },
    faces: [{ from: 1800, to: 3400, x: 360, y: 400, w: 110, label: 'FACE 1' }, { from: 4200, x: 70, y: 580, w: 60, label: 'FACE 1' }] },
  { id: 'apartment', art: 'apartment', dur: 6000, beds: ['tape', 'rain'], night: true, cues: [[800, 'af'], [2200, 'tick'], [4600, 'croak']],
    cam: [[0, { x: 960, y: 700, s: 1.1 }], [0.3, { x: 1200, y: 420, s: 1.2 }, 'inOut'], [0.45, { x: 1235, y: 310, s: 1.3 }], [0.85, { x: 1235, y: 310, s: 4.2 }, 'inOut'], [1, { x: 1235, y: 312, s: 4.2 }]],
    her: { x: 1238, y: 346, s: 0.1, from: 1800 }, zoomFrom: 2200,
    faces: [{ from: 2000, x: 1238, y: 300, w: 22, label: 'FACE 1' }] },
  { id: 'stairs', art: 'stairs', dur: 6200, beds: ['tape', 'rain'], night: true, cues: [[0, 'steps', { n: 8 }], [3300, 'static'], [4100, 'croak'], [4200, 'thump']],
    cam: [[0, { x: 520, y: 760, s: 1.3 }], [0.55, { x: 1100, y: 520, s: 1.3 }, 'inOut'], [1, { x: 1300, y: 480, s: 1.45 }]],
    walk: true, dropout: [3300, 4000], her: { x: 1330, y: 860, s: 1.1, from: 4000 },
    faces: [{ from: 4300, x: 1330, y: 300, w: 170, label: 'FACE 1', red: true }] },
  { id: 'fall', art: 'genkan', dur: 6400, beds: ['tape'], night: true, cues: [[0, 'thump'], [5200, 'breath']],
    cam: [[0, { x: 960, y: 540, s: 1.15, r: 0 }], [0.07, { x: 960, y: 640, s: 1.15, r: 84 }, 'in'], [1, { x: 980, y: 640, s: 1.2, r: 86 }]],
    fallen: true, count: { from: 900, every: 400, n: 12 } },
  { id: 'lens', art: 'black', dur: 3600, beds: [], cues: [[200, 'static'], [900, 'breath']], text: 'NANDA: You can stop filming now.', textAt: 900 },
]);
const BEDS = ['tape', 'rain'];

// seeded spots where the camera "finds" faces in the empty genkan (art space)
const GHOST_FACES = [[1500, 700], [700, 860], [1180, 620], [960, 300], [1560, 860], [520, 840], [1320, 760], [300, 480], [1720, 520], [860, 520], [1080, 930], [1640, 380]];

function toScreen(pose, j, x, y) {
  const s = pose.s ?? 1, r = ((pose.r ?? 0) + j.r) * Math.PI / 180;
  const dx = (x - pose.x) * s, dy = (y - pose.y) * s;
  return { x: 960 + j.x + dx * Math.cos(r) - dy * Math.sin(r), y: 540 + j.y + dx * Math.sin(r) + dy * Math.cos(r), k: s };
}

function FaceBox({ x, y, w, label, red, edge }) {
  const h = w * 1.15;
  return (
    <div className={`c5-face${red ? ' red' : ''}${edge ? ' edge' : ''}`} style={{ left: x - w / 2, top: y - h / 2, width: w, height: h }}>
      <i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" />
      <b>{edge === 'l' ? '◀ ' : ''}{label}</b>
    </div>
  );
}

const pad = (n, k = 2) => String(Math.floor(n)).padStart(k, '0');
function Osd({ t, night, zoom, count, rm }) {
  const tape = 12 * 60 + 4 + t / 1000;
  const tc = `${pad(tape / 3600)}:${pad((tape / 60) % 60)}:${pad(tape % 60)}:${pad((t / (1000 / 30)) % 30)}`;
  const wall = Math.min(59 * 60 + 40 + t / 1000, 60 * 60); // 11:59:40 PM -> 12:00:00 AM, then it stops
  const stamp = wall >= 3600 ? '12:00:00 AM' : `11:${pad(wall / 60)}:${pad(wall % 60)} PM`;
  const blink = rm || Math.floor(t / 500) % 2 === 0;
  return (
    <div className="c5-osd" aria-hidden="true">
      <p className="rec"><i style={{ opacity: blink ? 1 : 0.15 }} />REC</p>
      <p className="tc">{tc}</p>
      <p className="bat">▮▮▯ <span>SP</span></p>
      {night && <p className="night">NIGHT SHOT</p>}
      {zoom && <p className="zoom">D.ZOOM {zoom}</p>}
      {count && <p className="count">FACES: {count}</p>}
      <p className="stamp">SEP.28.2026<br />{stamp}</p>
      <i className="br tl" /><i className="br tr" /><i className="br bl" /><i className="br bh" />
    </div>
  );
}

const HER = ART.sil('nanda', 0, 0, 1, { slit: true });

export default function Cam5({ rm }) {
  const [t] = useClock(SHOTS.total);
  const { shot, local, p } = shotAt(SHOTS, t);
  const pose = poseAt(shot.cam, p, rm);
  useShotSound(shot, local, t, BEDS);
  const walkK = shot.walk ? 1.8 : 1;
  const j = rm || shot.fallen || shot.art === 'black' ? { x: 0, y: 0, r: 0 } : handheld(t, walkK);
  if (shot.walk && !rm) j.y += Math.sin((t / 1000) * 2 * Math.PI * 1.7) * 6; // footfall bob, 1.7 Hz
  const drop = shot.dropout && local >= shot.dropout[0] && local < shot.dropout[1];

  const trainGone = shot.id === 'platform' && local > 1800;
  const arts = useMemo(() => ({
    platform: <Platform props={{ train: 'here' }} rm={rm} />,
    platformGone: <Platform props={{ train: 'gone' }} rm={rm} />,
    underpass: <Underpass rm={rm} />,
    apartment: <ApartmentExt rm={rm} />,
    stairs: <Stairs props={{ door: 'shut' }} rm={rm} />,
    genkan: <Genkan props={{ insert: false }} rm={rm} />,
  }), [rm]);
  const art = shot.art === 'platform' && trainGone ? arts.platformGone : arts[shot.art];

  // faces: convert to screen; a face that leaves the frame pins to the edge with an arrow (the box follows her)
  const faces = (shot.faces ?? []).filter((f) => local >= f.from && (f.to == null || local < f.to)).map((f) => {
    const q = toScreen(pose, j, f.x, f.y);
    const step = rm ? q : { x: Math.round(q.x / 8) * 8, y: Math.round(q.y / 8) * 8 }; // AF boxes jump, they don't glide
    const w = Math.max(56, f.w * q.k);
    const edge = step.x < 40 ? 'l' : null;
    return { ...f, x: Math.max(70, Math.min(1850, step.x)), y: step.y, w, edge };
  });
  let count = null;
  if (shot.count && local >= shot.count.from) {
    const n = Math.min(shot.count.n, 1 + Math.floor((local - shot.count.from) / shot.count.every));
    count = n;
    GHOST_FACES.slice(0, n).forEach(([x, y], i) => {
      const q = toScreen(pose, j, x, y);
      faces.push({ x: q.x, y: q.y, w: 70 + (i % 3) * 22, label: `FACE ${i + 1}`, red: n === shot.count.n });
    });
  }
  const zoom = shot.zoomFrom != null && local > shot.zoomFrom ? `${Math.max(1, pose.s / 1.3).toFixed(1)}x` : null;

  return (
    <LabRoot rm={rm} className={`c5 s-${shot.id}${shot.night ? ' night' : ''}${drop ? ' drop' : ''}`} captions="bl">
      {shot.art === 'black' ? <div className="c5-black" /> : (
        <div className="c5-cam" style={{ transform: `${camTransform({ ...pose, r: (pose.r ?? 0) + j.r })} translate(${-j.x}px, ${-j.y}px)` }}>
          {art}
          {shot.her && local >= shot.her.from && (
            <svg className="art c5-her" viewBox="0 0 1920 1080" aria-label="A figure. She was not there before.">
              <g transform={`translate(${shot.her.x} ${shot.her.y}) scale(${shot.her.s})`}><Markup html={HER} /></g>
            </svg>
          )}
          {shot.fallen && local > 4600 && (
            <svg className="art c5-her" viewBox="0 0 1920 1080" aria-label="She is standing by the door. The camera is on the floor.">
              <g transform="translate(1560 1040) scale(1.25)"><Markup html={HER} /></g>
            </svg>
          )}
        </div>
      )}
      <div className="c5-tape" />
      <div className={`c5-band${drop ? ' big' : ''}`} />
      {faces.map((f, i) => <FaceBox key={i} {...f} />)}
      <Osd t={t} night={shot.night} zoom={zoom} count={count} rm={rm} />
      {shot.text && local >= (shot.textAt ?? 0) && <Sub text={shot.text} key={shot.id} className="c5-sub" />}
    </LabRoot>
  );
}
