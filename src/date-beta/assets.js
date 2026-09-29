// assets.js: date-beta asset slots. One manifest (assets.json): id -> { kind: sfx|bg|sprite, path under public/ }.
// Pure lookups (node --test drives them) + a tiny browser loader. Never throws: a missing file becomes
// a short WebAudio beep (sfx) or a grey box labelled with the id (images). Audio waits for the first gesture.
export function makeAssets(manifest = {}) {
  const assets = manifest?.assets ?? {}, cues = manifest?.cues ?? {};
  const get = (id) => (id && assets[id]) || null;
  // A cue name from scenes.json -> asset id. Ids pass through; unknown names stay as-is (they beep).
  const cueId = (name) => (name == null ? null : name in cues ? cues[name] : name);
  const url = (id, base = '/') => (get(id)?.path ? base + get(id).path : null);
  return { get, cueId, url, ids: () => Object.keys(assets) };
}

export const placeholderImg = (id, w = 320, h = 180) => `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#888"/>`
  + `<text x="50%" y="50%" fill="#fff" font-family="monospace" font-size="24" text-anchor="middle" dominant-baseline="middle">${String(id).replace(/[<&>]/g, '')}</text></svg>`)}`;

// Placeholder pitch: 440..880 Hz in 55 Hz steps, fixed per id.
export const beepHz = (id) => 440 + ([...String(id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % 9) * 55;

// Browser side: preload everything once, play by cue or id, image src by id.
export function createLoader(manifest, base = '/') {
  const A = makeAssets(manifest);
  const bytes = new Map(), buffers = new Map(), images = new Map();
  let ctx = null;
  let pending = null; // the last cue asked for before the context existed (the first beat's sound, red-team R5)
  // Start (or resume) the context inside a user gesture, then play the cue that was asked for before it: the first
  // beat's sfx fires on mount, before any gesture, and would otherwise never be heard.
  const unlock = () => {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume?.().catch(() => {}); return Promise.resolve(); }
    try { ctx = new (globalThis.AudioContext || globalThis.webkitAudioContext)(); } catch { return Promise.resolve(); }
    const decoding = [...bytes].map(([id, ab]) => Promise.resolve(ctx.decodeAudioData(ab)).then((b) => buffers.set(id, b), () => {}));
    bytes.clear();
    return Promise.all(decoding).then(() => { const c = pending; pending = null; if (c) play(c); });
  };
  const preload = () => {
    for (const id of A.ids()) {
      const u = A.url(id, base);
      if (!u) continue;
      if (A.get(id).kind === 'sfx') {
        fetch(u).then((r) => (r.ok ? r.arrayBuffer() : null)).then((ab) => {
          if (!ab) return;
          if (ctx) ctx.decodeAudioData(ab).then((b) => buffers.set(id, b), () => {});
          else bytes.set(id, ab);
        }, () => {});
      } else { const img = new Image(); img.onload = () => images.set(id, u); img.src = u; }
    }
    for (const ev of ['pointerdown', 'keydown']) addEventListener(ev, unlock, { once: true });
  };
  const beep = (id) => { // placeholder: a short beep, pitched per id so each missing cue is still told apart
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = beepHz(id); g.gain.value = 0.05;
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.08);
  };
  const play = (cue) => {
    try {
      const id = A.cueId(cue);
      if (!id) return;
      if (!ctx) { pending = cue; return; }
      const b = buffers.get(id);
      if (!b) { beep(id); return; }
      const s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start();
    } catch { /* sound is never fatal */ }
  };
  const src = (id) => images.get(id) ?? placeholderImg(id);
  return { preload, play, src, unlock };
}
