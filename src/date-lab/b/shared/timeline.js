// Builder B shot timelines (pure; node --test reads them).
// A shot = { id, dur (ms), cam: [[p, pose], ...], text?, cue? }. pose = { x, y, s, r, blur, ... } (stage px, look-at centre).
// Full motion: the camera eases between keyframes (smooth, 60 fps). Reduced motion: the camera HARD-CUTS to each
// keyframe at its time (same framing, same meaning, no travel).
import { words } from '../../../date-beta/engine.js';

export const MAX_WORDS = 12;
export const MIN_SHOT = 500;

export function build(shots) {
  let t = 0;
  const out = shots.map((s, i) => {
    const o = { ...s, i, start: t, end: t + s.dur };
    t += s.dur;
    return o;
  });
  return { shots: out, total: t };
}

export function shotAt(tl, t) {
  const tt = Math.max(0, Math.min(t, tl.total - 1e-6));
  const shot = tl.shots.find((s) => tt >= s.start && tt < s.end) ?? tl.shots.at(-1);
  const local = tt - shot.start;
  return { shot, local, p: shot.dur ? local / shot.dur : 1 };
}

export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const ease = {
  linear: (p) => p,
  inOut: (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2),
  out: (p) => 1 - (1 - p) ** 3,
  in: (p) => p ** 3,
};

// keyframes [[p, pose, easeName?], ...] sorted by p. Returns the pose at p.
export function poseAt(keys, p, rm = false) {
  if (!keys?.length) return {};
  if (p <= keys[0][0]) return { ...keys[0][1] };
  if (rm) {
    let k = keys[0];
    for (const key of keys) if (key[0] <= p) k = key;
    return { ...k[1] };
  }
  for (let i = 1; i < keys.length; i++) {
    const [p1, b, e] = keys[i], [p0, a] = keys[i - 1];
    if (p <= p1) {
      const q = (ease[e] ?? ease.inOut)(clamp((p - p0) / (p1 - p0 || 1)));
      const o = { ...a };
      for (const k of Object.keys(b)) o[k] = typeof b[k] === 'number' && typeof a[k] === 'number' ? lerp(a[k], b[k], q) : (q < 0.5 ? a[k] : b[k]);
      return o;
    }
  }
  return { ...keys.at(-1)[1] };
}

// CSS transform for a camera pose on a 1920x1080 stage: look at (x, y), zoom s, roll r (deg).
export function camTransform({ x = 960, y = 540, s = 1, r = 0 } = {}) {
  return `translate(960px, 540px) rotate(${r}deg) scale(${s}) translate(${-x}px, ${-y}px)`;
}

// Handheld drift (cam-5): a sum of slow sines. Every frequency is <= 3 Hz (shake cap), amplitudes in stage px / deg.
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

// Rules check used by the tests: every shot holds >= 500 ms, every line <= 12 words, keyframes in order.
export function lint(tl) {
  const errs = [];
  for (const s of tl.shots) {
    if (s.dur < MIN_SHOT) errs.push(`${s.id}: ${s.dur} ms < ${MIN_SHOT}`);
    if (s.text && words(s.text) > MAX_WORDS) errs.push(`${s.id}: ${words(s.text)} words`);
    const ps = (s.cam ?? []).map((k) => k[0]);
    if (ps.some((p, i) => p < 0 || p > 1 || (i && p < ps[i - 1]))) errs.push(`${s.id}: keyframes out of order`);
  }
  return errs;
}
