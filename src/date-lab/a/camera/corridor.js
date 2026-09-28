// Pure one-point perspective for the Kubrick corridor (cam-2). World: x across (walls at +-HALF_W), y up (floor -EYE, ceiling
// CEIL-EYE... simplified: eye at y = 0, floor at FLOOR, ceiling at CEIL), z forward. Camera on the centre line at camZ.
// A true dolly: every depth scales by F / (z - camZ), so near things grow faster than far ones (a zoom would scale all alike).
export const F = 760;          // focal length in px
export const HALF_W = 2.2;     // half corridor width
export const FLOOR = -1.55, CEIL = 1.45;
export const NEAR = 0.35;      // clip: nothing drawn closer than this to the lens

export function project(x, y, z, camZ) {
  const d = Math.max(NEAR, z - camZ);
  const k = F / d;
  return [960 + x * k, 540 - y * k, k];
}
export const pt = (x, y, z, camZ) => { const [sx, sy] = project(x, y, z, camZ); return `${sx.toFixed(1)},${sy.toFixed(1)}`; };
export const quad = (a, b, c, d, camZ) => [a, b, c, d].map((p) => pt(...p, camZ)).join(' ');

// Tubes on the ceiling every 3 units; which are dark at time t (ms into the dolly)? They die far -> near, one per `step` ms, held.
export const TUBES = Array.from({ length: 12 }, (_, i) => 3 + i * 3);
export function tubesOut(t, { start = 5200, step = 600 } = {}) {
  if (t < start) return 0;
  return Math.min(TUBES.length, 1 + Math.floor((t - start) / Math.max(500, step)));
}
// Her depth: she only moves when a tube dies (a hard cut nearer, never a walk). The last tube out = the big jump.
export const HER_FAR = 34, HER_LAST = 25;
export function herZ(out) {
  if (out >= TUBES.length) return HER_LAST;
  return HER_FAR - out * 0.55;
}
