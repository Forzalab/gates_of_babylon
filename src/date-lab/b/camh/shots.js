// cam-h-r2-b "The Frame Keeps Finding Her" (cam-3 Kon x cam-5 found footage), Builder B's take. Pure timeline + lens maths.
// The camcorder OSD (REC, frozen 12:00:00 AM, scanlines) frames every shot. Inside it, Kon's reveals are motivated by the
// camcorder itself: the AF box finds a face, then the D.ZOOM moves by itself.
//   train     : NIGHT SHOT, rolled 86 deg, tight on a face in the window (the loop seam) -> the camera is lifted upright and
//               zooms out: a sunny carriage, empty seat. Her face was a reflection.
//   platform  : her under the umbrella, FACE 1. The OSD already reads D.ZOOM 4.8x while the frame looks 1:1 (the tell).
//   underpass : the D.ZOOM pulls back BY ITSELF: the platform was a poster in the underpass (seamless nested pull-back).
//               "That one's a poster." FACE 2 at the tunnel mouth; the zoom pushes into her face ->
//   apartment : MATCH CUT (same face, same box, same size): her silhouette in the one lit window, NIGHT SHOT; zoom out.
//   stairs    : footfall bob, tracking dropout, she is at the door (red box).
//   fall      : the camera drops and lies on the genkan floor, counting FACES 1..11 on shoes; FACE 12 is her by the door;
//               the zoom pushes into her face until it is the train-window face at the same size and roll -> loop.
// Reduced motion: each shot hard-cuts between held key poses (same framings, same seams), no handheld, no drift.
import { lerp, clamp, ease } from '../shared/timeline.js';

// A real lens zoom between two framings (log-space scale about the fixed point), after Builder A's kit/fit.js zoomAbout.
export function zoomAbout(p0, p1) {
  const s0 = p0.s, s1 = p1.s;
  const same = Math.abs(s0 - s1) < 1e-9;
  const Px = same ? 0 : (p0.x * s0 - p1.x * s1) / (s0 - s1);
  const Py = same ? 0 : (p0.y * s0 - p1.y * s1) / (s0 - s1);
  return (k) => {
    const r = lerp(p0.r ?? 0, p1.r ?? 0, k);
    if (same) return { x: lerp(p0.x, p1.x, k), y: lerp(p0.y, p1.y, k), s: s0, r };
    const s = s0 * (s1 / s0) ** k;
    return { x: Px - ((Px - p0.x) * s0) / s, y: Py - ((Py - p0.y) * s0) / s, s, r };
  };
}
const seg = (l, a, b, e = ease.inOut) => e(clamp((l - a) / (b - a)));

// Her silhouette (shared/art.js sil 'nanda': origin = feet, eye line at -476 local). HEAD = eye line at 3.2 screen px / local.
export const EYE_Y = -476, HEAD = 3.2;
export const headFrame = (f, r = 0) => ({ x: f.x, y: f.y + EYE_Y * f.s, s: HEAD / f.s, r });
export const eyeOf = (f) => ({ x: f.x, y: f.y + EYE_Y * f.s });

// where she stands in each scene (art px)
export const HER = {
  train: { x: 700, y: 1000, s: 1 },        // a reflection in the big window
  tunnel: { x: 92, y: 800, s: 0.3 },       // the underpass tunnel mouth
  window: { x: 1238, y: 346, s: 0.1 },     // the one lit window
  door: { x: 1330, y: 860, s: 1.1 },       // her door, after the dropout
  genkan: { x: 1560, y: 1040, s: 1.25 },   // by the door, seen from the floor
};
// the platform-as-poster: Platform (1920x1080) scaled into the first underpass panel (200,250 400x290), centred vertically
export const NEST = { x: 200, y: 250 + (290 - 225) / 2, k: 400 / 1920 };
const NEST_POSE = { x: NEST.x + 200, y: NEST.y + 112.5, s: 1 / NEST.k, r: 0 };
const ID = { x: 960, y: 540, s: 1, r: 0 };
export const PLATFORM_FACE = { x: 1342, y: 500, w: 120 };

const TRAIN_START = headFrame(HER.train, 86);
const TRAIN_END = { x: 960, y: 540, s: 1.08, r: 0 };
const trainZoom = zoomAbout(TRAIN_START, TRAIN_END);
const underPull = zoomAbout(NEST_POSE, ID);
const UNDER_PAN = { x: 330, y: 600, s: 1.6, r: 0 };
const underPan = zoomAbout(ID, UNDER_PAN);
const underPush = zoomAbout(UNDER_PAN, headFrame(HER.tunnel));
const APT_END = { x: 1200, y: 440, s: 1.15, r: 0 };
const aptPull = zoomAbout(headFrame(HER.window), APT_END);
const FALL_REST = { x: 1200, y: 640, s: 1.0, r: 86 };
const fallPush = zoomAbout(FALL_REST, headFrame(HER.genkan, 86));
const STAIRS = [[0, { x: 520, y: 760, s: 1.3, r: 0 }], [0.55, { x: 1100, y: 520, s: 1.3, r: 0 }], [1, { x: 1300, y: 480, s: 1.45, r: 0 }]];

function keyed(keys, p) {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [p1, b] = keys[i], [p0, a] = keys[i - 1];
    if (p <= p1) { const q = ease.inOut((p - p0) / (p1 - p0)); return { x: lerp(a.x, b.x, q), y: lerp(a.y, b.y, q), s: lerp(a.s, b.s, q), r: lerp(a.r, b.r, q) }; }
  }
  return keys.at(-1)[1];
}

// Each shot: pose(local) in art space; rm = [[from, evalAt]] held key poses; jit(local) = handheld amount 0..1(+walk).
export const SHOTS = [
  { id: 'train', art: 'train', dur: 5600, night: [0, 1500], beds: ['tape'],
    pose: (l) => trainZoom(seg(l, 700, 4600)),
    rm: [[0, 0], [1500, 4600]], jit: (l) => seg(l, 700, 2200, ease.linear),
    her: { ...HER.train, refl: true },
    cues: [[0, 'rec'], [1500, 'af'], [2600, 'tick', { caption: '[camera lifted off the floor]' }]],
    text: 'Someone in the window. Nobody in the seat.', textAt: 2600,
    faces: (l) => [{ ...eyeOf(HER.train), w: 110, label: l < 1500 ? 'FACE 12' : 'FACE 1', red: l < 1500 }],
    count: (l) => (l < 1500 ? 12 : 1),
    dzoom: (l, pose) => pose.s / (headFrame(HER.train).s / (headFrame(HER.genkan).s / FALL_REST.s)) },
  { id: 'platform', art: 'platform', dur: 5000, beds: ['tape', 'rain'],
    pose: (l) => keyed([[0, { x: 1180, y: 540, s: 1.25, r: 0 }], [1400, { x: 1180, y: 540, s: 1.25, r: 0 }], [4200, ID], [5000, ID]], l),
    rm: [[0, 0], [2800, 5000]], jit: () => 1,
    cues: [[600, 'af'], [3400, 'tick', { caption: '[zoom motor whirs]' }]],
    faces: (l) => (l >= 600 ? [{ ...PLATFORM_FACE, label: 'FACE 1' }] : []),
    dzoom: (l) => (l >= 3400 ? 1 / NEST.k : null) },
  { id: 'underpass', art: 'underpass', dur: 8600, beds: ['tape'],
    pose: (l) => (l < 4200 ? underPull(seg(l, 0, 4200)) : l < 5000 ? ID : l < 6600 ? underPan(seg(l, 5000, 6600)) : underPush(seg(l, 6600, 8600, ease.in))),
    rm: [[0, 0], [2100, 4200], [5000, 6600], [7400, 8600]], jit: () => 1,
    her: { ...HER.tunnel, from: 4600 },
    cues: [[4600, 'croak'], [5000, 'af'], [6800, 'tick', { caption: '[D.ZOOM motor]' }]],
    lines: [[3800, "NANDA: That one's a poster."], [5800, "NANDA: This one's me."]],
    faces: (l) => [
      ...(l < 5000 ? [{ x: NEST.x + PLATFORM_FACE.x * NEST.k, y: NEST.y + PLATFORM_FACE.y * NEST.k, w: PLATFORM_FACE.w * NEST.k, label: 'FACE 1' }] : []),
      ...(l >= 5000 ? [{ ...eyeOf(HER.tunnel), w: 110 * HER.tunnel.s, label: 'FACE 2', red: l >= 7200 }] : []),
    ],
    dzoom: (l, pose) => (l < 4200 ? pose.s : l >= 6600 ? pose.s / UNDER_PAN.s : null) },
  { id: 'apartment', art: 'apartment', dur: 5400, night: [0, 5400], beds: ['tape', 'rain'],
    pose: (l) => aptPull(seg(l, 600, 4000)),
    rm: [[0, 0], [2000, 4000]], jit: (l) => 0.4 + 0.6 * seg(l, 0, 2000, ease.linear),
    her: HER.window,
    cues: [[1200, 'af'], [3400, 'croak']],
    faces: () => [{ ...eyeOf(HER.window), w: 110 * HER.window.s, label: 'FACE 2', red: true }],
    // the readout carries over the match cut: same number as the underpass push ended on
    dzoom: (l, pose) => (l < 4000 ? pose.s / (headFrame(HER.window).s / (headFrame(HER.tunnel).s / UNDER_PAN.s)) : null) },
  { id: 'stairs', art: 'stairs', dur: 5600, night: [0, 5600], beds: ['tape', 'rain'], walk: true, dropout: [3000, 3700],
    pose: (l) => keyed(STAIRS.map(([p, q]) => [p * 5600, q]), l),
    rm: [[0, 0], [2000, 3080], [3700, 5600]], jit: () => 1.8,
    her: { ...HER.door, from: 3700 },
    cues: [[0, 'steps', { n: 8 }], [3000, 'static'], [3800, 'croak'], [3900, 'thump']],
    faces: (l) => (l >= 3900 ? [{ ...eyeOf(HER.door), w: 150, label: 'FACE 3', red: true }] : []) },
  { id: 'fall', art: 'genkan', dur: 7600, night: [0, 7600], beds: ['tape'], fallen: true,
    pose: (l) => (l < 450 ? zoomAbout({ x: 960, y: 540, s: 1.15, r: 0 }, { x: 960, y: 640, s: 1.15, r: 86 })(seg(l, 0, 450, ease.in))
      // on the floor it holds still; at 4.4 s something nudges it round toward the door (her)
      : l < 5600 ? keyed([[450, { x: 960, y: 640, s: 1.15, r: 86 }], [4400, { x: 960, y: 640, s: 1.15, r: 86 }], [5400, FALL_REST], [5600, FALL_REST]], l) : fallPush(seg(l, 5600, 7600, ease.in))),
    rm: [[0, 0], [450, 1000], [4900, 5400], [6600, 7600]], jit: () => 0,
    her: { ...HER.genkan, from: 4600 },
    cues: [[0, 'thump'], [5200, 'af'], [5400, 'breath']],
    lines: [[5400, 'NANDA: Twelve. Keep filming.']],
    faces: (l) => {
      const n = l < 900 ? 0 : Math.min(11, 1 + Math.floor((l - 900) / 400));
      const out = l >= 5600 ? [] : GHOST.slice(0, n).map(([x, y], i) => ({ x, y, w: 70 + (i % 3) * 22, label: `FACE ${i + 1}`, red: l >= 5200 }));
      if (l >= 5200) out.push({ ...eyeOf(HER.genkan), w: 110 * HER.genkan.s, label: 'FACE 12', red: true });
      return out;
    },
    count: (l) => (l < 900 ? null : l >= 5200 ? 12 : Math.min(11, 1 + Math.floor((l - 900) / 400))),
    dzoom: (l, pose) => (l >= 5600 ? pose.s / FALL_REST.s : null) },
];
// seeded spots on the genkan floor where the camera "finds" faces (art px)
// (the camera lies rolled 86 deg, so only art x ~500..1420 is in frame)
export const GHOST = [[1300, 700], [700, 860], [1180, 560], [960, 300], [1120, 900], [620, 480], [800, 180], [1360, 360], [860, 620], [1040, 1000], [1240, 160]];

let t0 = 0;
for (const s of SHOTS) { s.start = t0; t0 += s.dur; s.end = t0; }
export const TOTAL = t0;

export function at(t) {
  const tt = ((t % TOTAL) + TOTAL) % TOTAL;
  const shot = SHOTS.find((s) => tt >= s.start && tt < s.end) ?? SHOTS.at(-1);
  return { shot, local: tt - shot.start };
}
// the pose to draw: full motion = the curve; reduced motion = the held key pose
export function poseFor(shot, local, rm) {
  if (!rm) return shot.pose(local);
  let k = shot.rm[0];
  for (const key of shot.rm) if (key[0] <= local) k = key;
  return shot.pose(k[1]);
}
// art point -> screen (look-at x,y at 960,540, zoom s, roll r)
export function toScreen(pose, x, y, j = { x: 0, y: 0, r: 0 }) {
  const s = pose.s ?? 1, r = ((pose.r ?? 0) + j.r) * Math.PI / 180;
  const dx = (x - pose.x) * s, dy = (y - pose.y) * s;
  return { x: 960 + j.x + dx * Math.cos(r) - dy * Math.sin(r), y: 540 + j.y + dx * Math.sin(r) + dy * Math.cos(r), k: s };
}
