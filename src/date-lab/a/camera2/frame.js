// cam-h-r2-a "The Frame Keeps Finding Her" — pure timeline + camcorder maths (node-tested, no DOM).
// Camera language: cam-3's Kon match cuts / nested pull-backs, but every move is MOTIVATED by the camcorder: the AF box locks
// on a "face", the digital zoom (D.ZOOM, a 1998 Handycam can do 800x) pushes or releases by itself. cam-5's OSD frames it all.
import { clamp, ease } from '../kit/time.js';
import { zoomAbout } from '../kit/fit.js';

// ---- geometry shared with the scenes (stage px, 1920 x 1080 art) ----
export const UME = [837, 288];                  // the umeboshi on main's NOT Sweet train ad
export const AD = { x: 985, y: 74, s: 0.55 };   // her bust pasted over that ad (cam-3 placement)
export const IRIS = [AD.x + 246 * AD.s, AD.y + 356 * AD.s];
export const AD_FACE = [AD.x + 300 * AD.s, AD.y + 330 * AD.s];
export const K6 = 1 / 6; // every nested frame is 1/6 of the stage: poster, phone screen. D.ZOOM 6x on one = the next reality
export const NEST = { x: 200 + (400 - 1920 * K6) / 2, y: 250 + (290 - 1080 * K6) / 2, k: K6 }; // the carriage as a poster in the underpass panel
export const HER_TUNNEL = { x: 70, y: 850, s: 0.55 };                   // her silhouette in the tunnel mouth (stairs up)
export const HER_TUNNEL_FACE = [70, 850 - 476 * 0.55];
// her phone lying on the genkan tataki, turned -86 deg (so a camera lying on its side, rolled 86, sees it upright).
// Its screen is exactly 1920/6 x 1080/6 = 320 x 180: a D.ZOOM of 6x on it = the train at 1:1 = the loop.
export const ROLL = 86;
export const PHONE = { x: 1130, y: 760, k: K6, r: -ROLL };
export const ZOOM0 = 6; // the readout on the very first frame (you were filming her phone all along)

export const HUNT_MS = 500; // AF hunting: each held position >= 500 ms
export const COUNT_EVERY = 500;

const A_PUSH = zoomAbout({ x: 960, y: 540, s: 1 }, { x: UME[0], y: UME[1], s: 15 });
const B_PULL = zoomAbout({ x: IRIS[0], y: IRIS[1], s: 480 / (26 * AD.s) }, { x: 960, y: 540, s: 1 });
const C_PULL = zoomAbout({ x: NEST.x + 960 * NEST.k, y: NEST.y + 540 * NEST.k, s: 1 / NEST.k }, { x: 960, y: 540, s: 1 });
const D_PUSH = zoomAbout({ x: 960, y: 540, s: 1 }, { x: 240, y: 640, s: 4 });
const FLOOR = { x: 1040, y: 560, s: 1.8, r: ROLL };
const E_PUSH = zoomAbout(FLOOR, { x: PHONE.x, y: PHONE.y, s: 1 / PHONE.k });
const seg = (l, a, b, e = ease.inOut) => e(clamp((l - a) / (b - a)));

// genkan floor spots where the camera "finds" faces (empty floor, shoes, the step, the cabinet). FACE 12 = her phone.
export const GHOSTS = [[1180, 300], [900, 760], [1250, 650], [820, 420], [1120, 990], [980, 150], [1300, 790], [860, 930], [1060, 470], [800, 610], [1240, 120]];

export const SHOTS = [
  { id: 'train', dur: 6000, zoomK: ZOOM0, rm: { x: 960, y: 540, s: 1 },
    pose: (l) => A_PUSH(seg(l, 1800, 5700, ease.in)),
    hunt: [[300, 1500, 300], [800, 420, 640], [1300, 1120, 300]], lock: { from: 1800, at: UME, w: 110, label: 'FACE 1' },
    sub: [{ at: 300, text: 'Nobody reads the ads. You read this one.' }, { at: 3600, text: '' }] },
  { id: 'iris', dur: 6500, zoomK: ZOOM0, rm: { x: 960, y: 540, s: 1 },
    pose: (l) => B_PULL(seg(l, 300, 5000, ease.out)),
    lock: { from: 2600, at: AD_FACE, w: 150, label: 'FACE 1' }, slip: 5700,
    sub: [{ at: 4900, text: 'NANDA: You read me instead. Good.' }] },
  { id: 'poster', dur: 6500, zoomK: 1, rm: { x: 960, y: 540, s: 1 },
    pose: (l) => C_PULL(seg(l, 200, 4600, ease.inOut)),
    lock: { from: 0, to: 5000, at: [NEST.x + AD_FACE[0] * NEST.k, NEST.y + AD_FACE[1] * NEST.k], w: 150, label: 'FACE 1' },
    lock2: { from: 5000, at: HER_TUNNEL_FACE, w: 60, label: 'FACE 1', red: true },
    her: 4400, sub: [{ at: 2800, text: "NANDA: Don't read the ads. Read me." }] },
  { id: 'tunnel', dur: 4000, zoomK: 1, night: true, rm: D_PUSH(1),
    pose: (l) => D_PUSH(seg(l, 200, 2600, ease.in)),
    lock: { from: 0, at: HER_TUNNEL_FACE, w: 60, label: 'FACE 1', red: true }, her: 0, dropout: [3200, 4000] },
  { id: 'floor', dur: 9500, zoomK: 1, night: true, free: true, rm: FLOOR,
    pose: (l) => (l < 400 ? { x: 960 + (FLOOR.x - 960) * ease.in(l / 400), y: 540 + (FLOOR.y - 540) * ease.in(l / 400), s: 1.2 + (FLOOR.s - 1.2) * ease.in(l / 400), r: ROLL * ease.in(l / 400) }
      : { ...E_PUSH(seg(l, 7000, 9500, ease.inOut)), r: ROLL }),
    rmLate: { at: 7000, pose: { x: PHONE.x, y: PHONE.y, s: 1 / PHONE.k, r: ROLL } },
    count: { from: 1000, every: COUNT_EVERY, n: 12 }, settle: 8900, // last 600 ms: the screen fills the frame, night shot + AF drop out
 sub: [{ at: 7000, text: "NANDA: Rewind it. I'm on the train." }] },
];

export const total = SHOTS.reduce((s, x) => s + x.dur, 0);
export function shotAt(t) {
  let t0 = 0;
  for (let i = 0; i < SHOTS.length; i++) {
    const s = SHOTS[i];
    if (t < t0 + s.dur || i === SHOTS.length - 1) return { shot: s, i, local: clamp(t - t0, 0, s.dur) };
    t0 += s.dur;
  }
  return null;
}
export function poseOf(shot, local, rm) {
  if (rm) return shot.rmLate && local >= shot.rmLate.at ? shot.rmLate.pose : shot.rm;
  return shot.pose(local);
}

// scene -> screen under a pose with roll (and optional handheld jitter j = {x, y, r} in screen px / deg)
export function toScreen({ x = 960, y = 540, s = 1, r = 0 }, px, py, j = { x: 0, y: 0, r: 0 }) {
  const a = ((r + j.r) * Math.PI) / 180;
  const dx = (px - x) * s, dy = (py - y) * s;
  return [960 + j.x + dx * Math.cos(a) - dy * Math.sin(a), 540 + j.y + dx * Math.sin(a) + dy * Math.cos(a)];
}

// Handheld drift: slow sines, every component <= 3 Hz (copied from builder B's cam-5, same numbers).
export const HANDHELD = Object.freeze([
  { axis: 'x', hz: 0.23, amp: 14, ph: 0.3 }, { axis: 'x', hz: 0.71, amp: 5, ph: 1.9 }, { axis: 'x', hz: 1.9, amp: 1.2, ph: 0.7 },
  { axis: 'y', hz: 0.31, amp: 10, ph: 2.2 }, { axis: 'y', hz: 0.97, amp: 4, ph: 0.4 }, { axis: 'y', hz: 2.6, amp: 0.9, ph: 1.1 },
  { axis: 'r', hz: 0.17, amp: 0.9, ph: 0.8 }, { axis: 'r', hz: 0.53, amp: 0.35, ph: 2.9 },
]);
export function handheld(tMs, k = 1) {
  const o = { x: 0, y: 0, r: 0 }, t = tMs / 1000;
  for (const h of HANDHELD) o[h.axis] += Math.sin(2 * Math.PI * h.hz * t + h.ph) * h.amp * k;
  return o;
}

// The D.ZOOM readout (null under 1.05x). Continuous across the nested cuts because each shot knows its nesting factor.
export const zoomReadout = (shot, pose) => {
  const z = (pose.s ?? 1) * shot.zoomK;
  return z < 1.05 ? null : z >= 100 ? `${Math.round(z)}x` : `${z.toFixed(1)}x`;
};

// how many faces are counted on the floor at local time (held >= 500 ms each)
export const countAt = (shot, local) => (!shot.count || local < shot.count.from ? 0 : Math.min(shot.count.n, 1 + Math.floor((local - shot.count.from) / shot.count.every)));
// the AF hunting box (held positions) at local time, or null
export function huntAt(shot, local) {
  if (!shot.hunt) return null;
  let cur = null;
  for (const h of shot.hunt) if (local >= h[0]) cur = h;
  return cur && local < (shot.lock?.from ?? Infinity) ? cur : null;
}
