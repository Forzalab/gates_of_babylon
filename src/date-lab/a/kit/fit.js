// Pure camera helpers (node-tested): parallax planes, scene->screen projection, keep-inside-the-art framing.
import { clamp } from './time.js';

// A plane at `depth` (1 = the scene plane, >1 nearer the lens, <1 farther) under the same camera pose.
export function parallax({ x = 960, y = 540, s = 1, r = 0 }, depth) {
  return { x: 960 + (x - 960) * depth, y: 540 + (y - 540) * depth, s: 1 + (s - 1) * depth, r };
}
// Where does scene point (px, py) land on screen under a pose (no roll)?
export function screen({ x = 960, y = 540, s = 1 }, px, py) {
  return [(px - x) * s + 960, (py - y) * s + 540];
}
// Keep the frame inside the 1920x1080 art (no black edges). Zoomed out (s < 1) = free.
export function fit(pose) {
  const s = pose.s ?? 1;
  if (s < 1) return pose;
  const hw = 960 / s, hh = 540 / s;
  return { ...pose, x: clamp(pose.x ?? 960, hw, 1920 - hw), y: clamp(pose.y ?? 540, hh, 1080 - hh) };
}

// A zoom that behaves like a real lens zoom between two framings: scale moves in log space (constant perceived speed) and the
// frame pivots about the one scene point that sits at the same screen position in both poses (so nothing slides sideways).
export function zoomAbout(p0, p1) {
  const s0 = p0.s, s1 = p1.s;
  const same = Math.abs(s0 - s1) < 1e-9;
  const Px = same ? 0 : (p0.x * s0 - p1.x * s1) / (s0 - s1);
  const Py = same ? 0 : (p0.y * s0 - p1.y * s1) / (s0 - s1);
  return (k) => {
    if (same) return { x: p0.x + (p1.x - p0.x) * k, y: p0.y + (p1.y - p0.y) * k, s: s0 };
    const s = s0 * (s1 / s0) ** k;
    return { x: Px - ((Px - p0.x) * s0) / s, y: Py - ((Py - p0.y) * s0) / s, s };
  };
}
