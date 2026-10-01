import { synth, SYNTH } from './synth.js';
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
  let ctx = null, master = null, muted = false, ducked = false;
  // ONE sfx bus (master): M mutes it; it sits -8 dB (0.398) under a voice take (voice/index.js onSpeak).
  const DUCK = 0.398;
  const gains = () => {
    if (!master) { master = ctx.createGain(); master.gain.value = muted ? 0 : ducked ? DUCK : 1; master.connect(ctx.destination); }
    const v = muted ? 0 : ducked ? DUCK : 1;
    try { const t = ctx.currentTime; master.gain.cancelScheduledValues(t); master.gain.setTargetAtTime(v, t, ducked ? 0.03 : 0.12); } catch { master.gain.value = v; }
  };
  let pending = null; // the last cue asked for before the context existed (the first beat's sound, red-team R5)
  // Start (or resume) the context inside a user gesture, then play the cue that was asked for before it: the first
  // beat's sfx fires on mount, before any gesture, and would otherwise never be heard.
  const unlock = () => {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume?.().catch(() => {}); return Promise.resolve(); }
    try { ctx = new (globalThis.AudioContext || globalThis.webkitAudioContext)(); } catch { return Promise.resolve(); }
    const decoding = [...bytes].map(([id, ab]) => Promise.resolve(ctx.decodeAudioData(ab)).then((b) => buffers.set(id, b), () => {}));
    bytes.clear();
    return Promise.all(decoding).then(() => { const c = pending; pending = null; if (want) syncBed(); if (c) play(c); });
  };
  const preload = () => {
    for (const id of A.ids()) {
      const u = A.url(id, base);
      if (!u) continue;
      if (A.get(id).kind === 'sfx') {
        fetch(u).then((r) => (r.ok ? r.arrayBuffer() : null)).then((ab) => {
          if (!ab) return;
          if (ctx) ctx.decodeAudioData(ab).then((b) => { buffers.set(id, b); if (want === id) syncBed(); }, () => {});
          else bytes.set(id, ab);
        }, () => {});
      } else { const img = new Image(); img.onload = () => images.set(id, u); img.src = u; }
    }
    for (const ev of ['pointerdown', 'keydown']) addEventListener(ev, unlock, { once: true });
  };
  const beep = (id) => { // placeholder: a short beep, pitched per id so each missing cue is still told apart
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = beepHz(id); g.gain.value = 0.05;
    o.connect(g).connect(master); o.start(); o.stop(ctx.currentTime + 0.08);
  };
  const play = (cue) => {
    try {
      const id = A.cueId(cue);
      if (!id) return;
      if (!ctx) { pending = cue; return; }
      gains();
      let out = master;
      const g = A.get(id)?.gain;
      if (typeof g === 'number' && g !== 1) { out = ctx.createGain(); out.gain.value = g; out.connect(master); } // manifest trim (keeps it under her voice)
      const b = buffers.get(id);
      if (!b) { if (!synth(ctx, id, out)) beep(id); return; } // missing file: the synth stand-in, else the beep
      const s = ctx.createBufferSource(); s.buffer = b; s.connect(out); s.start();
    } catch { /* sound is never fatal */ }
  };
  // Beds (manifest loop: true): one looping ambience at a time, on the same master (mute + voice duck apply).
  // bed(cue) is idempotent: the bed already running keeps running (no second copy); another cue crossfades; null fades
  // it out (BED_FADE). Asked before the context exists, it starts on unlock.
  let want = null, beds = null;
  const bedsNow = () => beds ?? (beds = createBeds(ctx, master, { buffer: (id) => buffers.get(id) ?? null, gainOf: (id) => A.get(id)?.gain ?? BED_GAIN, beep }));
  const syncBed = () => { try { gains(); bedsNow().set(want); } catch { /* sound is never fatal */ } };
  const bed = (cue) => { want = cue ? A.cueId(cue) : null; if (ctx) syncBed(); };
  const isBed = (cue) => !!A.get(A.cueId(cue))?.loop;
  const src = (id) => images.get(id) ?? placeholderImg(id);
  const has = (id) => images.has(id); // true once the real image file has loaded (it then beats any fallback art)
  const setMuted = (v) => { muted = !!v; if (ctx) gains(); };
  const duck = (v) => { ducked = !!v; if (ctx) gains(); };
  return { preload, play, bed, isBed, src, unlock, has, setMuted, duck, get bedId() { return beds?.current() ?? null; } };
}

export const BED_GAIN = 0.4; // a bed with no manifest gain sits ~-8 dB under the one-shots
export const BED_FADE = 0.25; // s: the fade in / out of a bed (scene change <= 300 ms)
// The bed mixer (exported for node tests with a fake context). opts.buffer(id) -> AudioBuffer | null; opts.gainOf(id);
// opts.beep(id) for a bed with no file and no synth stand-in. A missing file with a synth.js recipe loops the recipe
// (re-triggered 1 s before it ends; the recipes have soft ends, so the overlap is the crossfade).
export function createBeds(ctx, out, { buffer = () => null, gainOf = () => BED_GAIN, beep = () => {} } = {}) {
  let cur = null; // { id, g, src, timer }
  const fadeOut = (b) => {
    const t = ctx.currentTime;
    try { b.g.gain.cancelScheduledValues(t); b.g.gain.setValueAtTime(b.g.gain.value, t); b.g.gain.linearRampToValueAtTime(0, t + BED_FADE); } catch { b.g.gain.value = 0; }
    clearTimeout(b.timer);
    try { b.src?.stop(t + BED_FADE + 0.02); } catch { /* already stopped */ }
  };
  const start = (id) => {
    const t = ctx.currentTime, g = ctx.createGain(), level = gainOf(id);
    try { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + BED_FADE); } catch { g.gain.value = level; }
    g.connect(out);
    const b = { id, g, src: null, timer: null, file: false };
    const buf = buffer(id);
    if (buf) {
      const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.connect(g); s.start(t);
      b.src = s; b.file = true;
    } else if (SYNTH[id]) {
      const again = () => { const len = SYNTH[id](ctx, g, ctx.currentTime + 0.01); b.timer = setTimeout(again, Math.max(500, (len - 1) * 1000)); };
      again();
    } else beep(id);
    return b;
  };
  return {
    set(id) {
      id = id || null;
      if (cur && cur.id === id && (cur.file || !buffer(id))) return; // same bed: keep it (a file that arrived late upgrades it)
      if (cur) fadeOut(cur);
      cur = id ? start(id) : null;
    },
    current: () => cur?.id ?? null,
  };
}
