// A tiny pinhole camera for flat-shaded SVG 3D (pure; node --test checks the dolly-zoom invariant).
// World: metres. X right, Y up, Z forward (the camera looks down +Z). Screen: 1920x1080, principal point (cx, cy).
// Dolly zoom (Hitchcock/Vertigo): move the camera along Z while scaling the focal length with the subject distance,
// f = f0 * D / D0, so the subject keeps its size on screen and everything else stretches or compresses.
export const W = 1920, H = 1080;

export function project(cam, [x, y, z]) {
  const dz = z - cam.z;
  return [cam.cx + (cam.f * (x - cam.x)) / dz, cam.cy - (cam.f * (y - cam.y)) / dz, dz];
}

// Clip a polygon (list of [x,y,z]) against the near plane z = cam.z + near (Sutherland-Hodgman, one plane).
export function clipNear(poly, zn) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const ain = a[2] >= zn, bin = b[2] >= zn;
    if (ain) out.push(a);
    if (ain !== bin) {
      const t = (zn - a[2]) / (b[2] - a[2]);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, zn]);
    }
  }
  return out;
}

// Focal length that keeps a subject `D0` metres away at the same size when the camera is now `D` away.
export const dollyF = (f0, D0, D) => (f0 * D) / D0;

// Linear fog: mix a hex colour toward `fog` by depth (0 at `near`, 1 at `far`), with an optional floor `min`.
export function hexMix(a, b, t) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b), k = Math.max(0, Math.min(1, t));
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
}

// Render a list of faces {pts: [[x,y,z]...], fill, stroke?, lit?, id?} to screen paths, far to near (painter's).
// lit faces ignore fog (a lamp, a lit door). Returns [{ d, fill, depth, ...face }].
export function renderFaces(cam, faces, { near = 0.12, fog = '#05060a', fogNear = 2, fogFar = 26 } = {}) {
  const zn = cam.z + near, out = [];
  for (const f of faces) {
    const pts = clipNear(f.pts, zn);
    if (pts.length < 3) continue;
    const scr = pts.map((p) => project(cam, p));
    const depth = f.pts.reduce((s, p) => s + p[2], 0) / f.pts.length - cam.z;
    const d = `M${scr.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L')}Z`;
    const t = (depth - fogNear) / (fogFar - fogNear);
    out.push({ ...f, d, depth: f.depthBias ? depth + f.depthBias : depth, fill: f.lit ? f.fill : hexMix(f.fill, fog, t * (f.fogK ?? 1)) });
  }
  return out.sort((a, b) => b.depth - a.depth);
}

// Axis-aligned quads (a wall panel, a floor tile). Helpers keep scene files readable.
export const quadX = (x, y0, y1, z0, z1) => [[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]]; // wall facing +-X
export const quadY = (y, x0, x1, z0, z1) => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]]; // floor / ceiling
export const quadZ = (z, x0, x1, y0, y1) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]]; // facing the camera

// A billboard's screen placement: feet at world (x, y, z), height h metres -> { x, y, px (height in px), dz }.
export function billboard(cam, [x, y, z], h) {
  const [sx, sy, dz] = project(cam, [x, y, z]);
  return { x: sx, y: sy, px: (cam.f * h) / dz, dz };
}
