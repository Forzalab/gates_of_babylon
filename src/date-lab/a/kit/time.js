// Pure timeline maths for builder A's camera / animation pieces. No DOM: node --test drives it.
// A timeline = shots [{ id, dur, ... }] played back to back. Camera moves = keyframes [{ t, ...numbers }] eased between.
// Drawn things step on the 8 fps grid (TICK 125 ms) and every pose holds >= 500 ms (POSE); camera + fades stay smooth.
export const TICK = 125;
export const POSE = 500;
export const FLASH_MIN = 334; // any "1-frame" flash holds at least this long

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = {
  linear: (t) => t,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2), // cubic in-out: camera "operator" feel
  out: (t) => 1 - (1 - t) ** 3,
  in: (t) => t * t * t,
  sine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
};

// Total length of a shot list.
export const total = (shots) => shots.reduce((s, x) => s + x.dur, 0);

// Which shot is on screen at time t (ms)? Returns { shot, i, t0, local, k } (k = 0..1 through the shot). Clamps to the last shot.
export function shotAt(shots, t) {
  let t0 = 0;
  for (let i = 0; i < shots.length; i++) {
    const s = shots[i];
    if (t < t0 + s.dur || i === shots.length - 1) {
      const local = clamp(t - t0, 0, s.dur);
      return { shot: s, i, t0, local, k: s.dur ? local / s.dur : 1 };
    }
    t0 += s.dur;
  }
  throw new Error('shotAt: empty timeline');
}

// Keyframes [{ t: ms, x, y, s, ... , e?: easing name for the segment that ENDS here }] -> the interpolated pose at time t.
// Every numeric key present in the first keyframe is interpolated.
export function keyAt(keys, t) {
  if (!keys.length) return {};
  if (t <= keys[0].t) return strip(keys[0]);
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t <= b.t) {
      const k = (ease[b.e ?? 'inOut'])(clamp((t - a.t) / (b.t - a.t || 1)));
      const out = {};
      for (const key of Object.keys(a)) if (key !== 't' && key !== 'e' && typeof a[key] === 'number') out[key] = lerp(a[key], b[key] ?? a[key], k);
      return out;
    }
  }
  return strip(keys.at(-1));
}
function strip(k) { const o = { ...k }; delete o.t; delete o.e; return o; }

// Reduced motion: a camera move becomes ONE held frame (the move's end pose), cut in hard. Same meaning, no motion.
export const rmPose = (keys) => strip(keys.at(-1));

// Stepped value: which pose index (0..n-1) at time t when each pose holds `hold` ms (>= POSE). Loops.
export function stepAt(t, n, hold = POSE) {
  const h = Math.max(POSE, hold);
  return Math.floor(Math.max(0, t) / h) % n;
}
// Quantise a smooth time to the 8 fps grid (for drawn motion that must read "on threes").
export const onGrid = (t) => Math.floor(t / TICK) * TICK;

// Transform string for a camera pose { x, y, s, r } (x/y = the stage point that sits at frame centre).
export function camTransform({ x = 960, y = 540, s = 1, r = 0 }) {
  return `translate(960px, 540px) rotate(${r}deg) scale(${s}) translate(${-x}px, ${-y}px)`;
}

// Safety audit for a list of flash/glitch events [{ at, dur }]: no more than `max` changes in any 1 s window, each held >= FLASH_MIN.
export function flashSafe(events, max = 3) {
  for (const e of events) if (e.dur < FLASH_MIN) return false;
  const starts = events.map((e) => e.at).sort((a, b) => a - b);
  for (let i = 0; i < starts.length; i++) {
    let n = 0;
    for (let j = i; j < starts.length && starts[j] < starts[i] + 1000; j++) n++;
    if (n > max) return false;
  }
  return true;
}

// Word count for the <= 12 words per click rule (same rule as date-beta engine.words).
export const words = (text) => (text.trim() ? text.trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length : 0);
