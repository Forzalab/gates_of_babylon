import { synth } from './synth.js';
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

// Beds: the looping sounds. They run until the scene changes (or a 'silence' beat), one at a time (see createLoader).
// Files are made to loop (synth.py: 0.5 s crossfaded ends). Every other sfx is a one-shot.
export const BEDS = Object.freeze(['SX-20', 'SX-15', 'SX-21', 'SX-27', 'SX-06', 'umbrella-rain']);
export const BED_LEVEL = 0.125; // Tony Oct 1: background beds -20 dB, well under the voice
export const BED_FADE = 0.5; // seconds: a bed's fade in / out, and the crossfade when one bed replaces another
export const isBedId = (id) => BEDS.includes(id);

// Music: one looping mood track under everything (assets.json "music"), sweet by default, dark on the darkScenes.
// It survives scene changes (same track = no-op) and crossfades over MUSIC_FADE when the track changes.
// MUSIC_GAIN is the knob: the files sit at -30 LUFS, so 0.35 (~-9 dB) lands near -39 LUFS, far under a voice take.
export const MUSIC_GAIN = 0.15;
export const MUSIC_FADE = 2.5; // seconds
export function musicFor(manifest, sceneId) {
  const m = manifest?.music;
  if (!m || sceneId == null) return null; // null = keep whatever is playing
  return (m.darkScenes ?? []).includes(sceneId) ? m.dark ?? null : m.default ?? null;
}

// Love chimes + emotion hits for a scored pick (pop = the engine's reaction { love, gacha?, emote }, fx = pos.fx).
// Returns [{ cue, at }] (at = ms after the pop shows). A gacha tier or the pick's own hate-quake REPLACES the plain chime.
export const HEART_POP_AT = 334; // the HUD's first step (beta.css lv-pop / lv-step) lands the heart + number
export function popCues(pop, fx = null) {
  if (!pop || !pop.love) return [];
  const g = pop.gacha?.fx;
  if (pop.love > 0) {
    return [{ cue: g === 'love-bomb' ? 'love-bomb' : g === 'love-crit' ? 'gacha-crit' : 'love-up', at: 0 }, { cue: 'heart-pop', at: HEART_POP_AT }];
  }
  const hate = fx?.kind === 'hate-quake' || pop.emote === 'hate';
  return [{ cue: g === 'rage' ? 'rage-thunder' : g === 'anger' ? 'anger-pop' : hate ? 'hate-quake' : 'love-down', at: 0 }];
}

// props.sfx on a beat: extra cue(s) laid over beat.sfx on the same cut. A name, or a list of names / { cue, at } (at = ms
// from the cut; none = with beat.sfx, so props.sfxAt moves it too). Props carry to the next beat in the engine, so a one-shot
// equal to one on the previous beat is inherited, not authored: it does not fire again (props.sfx: null ends a carried bed).
const norm = (v) => (v == null ? [] : (Array.isArray(v) ? v : [v])).map((e) => (typeof e === 'string' ? { cue: e } : e)).filter((e) => e && typeof e.cue === 'string');
export const propSfx = (props) => norm(props?.sfx);
export function beatCues(beat, prev = null, bed = () => false) {
  if (!beat) return [];
  const seen = new Set(propSfx(prev?.props).map((e) => JSON.stringify(e)));
  // beds are idempotent (the same bed asked again is a no-op), so only the one-shots need the inherited check
  const mine = beat.react ? [] : propSfx(beat.props).filter((e) => bed(e.cue) || !seen.has(JSON.stringify(e)));
  const out = beat.sfx && !(bed(beat.sfx) && mine.some((e) => bed(e.cue))) ? [{ cue: beat.sfx }] : []; // one bed per beat: props.sfx wins
  return out.concat(mine);
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
  // ONE sfx bus (master): M mutes it; it sits -14 dB (0.2) under a voice take (voice/index.js onSpeak).
  const DUCK = 0.1; // Tony Oct 1: sfx bus -20 dB under a voice take
  const gains = () => {
    if (!master) { master = ctx.createGain(); master.gain.value = muted ? 0 : ducked ? DUCK : 1; master.connect(ctx.destination); }
    const v = muted ? 0 : ducked ? DUCK : 1;
    try { const t = ctx.currentTime; master.gain.cancelScheduledValues(t); master.gain.setTargetAtTime(v, t, ducked ? 0.03 : 0.12); } catch { master.gain.value = v; }
  };
  // The last cue (and last bed) asked for before the context existed (the first beat's sound, red-team R5)
  let pend = { shot: null, bed: null, music: null };
  let bed = null, want = null, curScene; // bed = { id, src, g } looping now; want = a bed whose file has not decoded yet
  const failed = new Set(); // sfx whose file would not load
  // Start (or resume) the context inside a user gesture, then play the cue that was asked for before it: the first
  // beat's sfx fires on mount, before any gesture, and would otherwise never be heard.
  const unlock = () => {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume?.().catch(() => {}); return Promise.resolve(); }
    try { ctx = new (globalThis.AudioContext || globalThis.webkitAudioContext)(); } catch { return Promise.resolve(); }
    const decoding = [...bytes].map(([id, ab]) => Promise.resolve(ctx.decodeAudioData(ab)).then((b) => buffers.set(id, b), () => {}));
    bytes.clear();
    return Promise.all(decoding).then(() => { const p = pend; pend = { shot: null, bed: null, music: null }; if (p.music) music(p.music); if (p.bed) play(p.bed); if (p.shot) play(p.shot); });
  };
  const preload = () => {
    for (const id of A.ids()) {
      const u = A.url(id, base);
      if (!u) continue;
      if (A.get(id).kind === 'sfx') {
        fetch(u).then((r) => (r.ok ? r.arrayBuffer() : null)).then((ab) => {
          if (!ab) { failed.add(id); return; }
          if (ctx) ctx.decodeAudioData(ab).then((b) => { buffers.set(id, b); if (want === id) startBed(id); }, () => {});
          else bytes.set(id, ab);
        }, () => { failed.add(id); });
      } else if (A.get(id).kind !== 'music') { const img = new Image(); img.onload = () => images.set(id, u); img.src = u; } // music streams on demand
    }
    for (const ev of ['pointerdown', 'keydown']) addEventListener(ev, unlock, { once: true });
  };
  const beep = (id) => { // placeholder: a short beep, pitched per id so each missing cue is still told apart
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = beepHz(id); g.gain.value = 0.05;
    o.connect(g).connect(master); o.start(); o.stop(ctx.currentTime + 0.08);
  };
  // ---- beds: one looping source at a time. The same bed asked for again is a no-op (no doubling, no gap); a different
  // one crossfades over BED_FADE; stopBeds fades out. The scene changing stops them (scene()).
  const fadeOut = (b, s = BED_FADE) => {
    try {
      const t = ctx.currentTime;
      b.g.gain.cancelScheduledValues(t); b.g.gain.setValueAtTime(b.g.gain.value, t); b.g.gain.linearRampToValueAtTime(0, t + s);
      b.src.stop(t + s + 0.05);
    } catch { /* already stopped */ }
  };
  const startBed = (id) => {
    if (bed?.id === id) { want = null; return; }
    gains();
    const b = buffers.get(id);
    if (!b) {
      if (failed.has(id)) { want = null; if (bed) { fadeOut(bed); bed = null; } if (!synth(ctx, id, master)) beep(id); } else want = id; // no file: the stand-in once; else wait for the decode
      return;
    }
    want = null;
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = b; src.loop = true; g.gain.value = 0; src.connect(g); g.connect(master); src.start();
    g.gain.linearRampToValueAtTime(BED_LEVEL, ctx.currentTime + BED_FADE);
    if (bed) fadeOut(bed);
    bed = { id, src, g };
  };
  const stopBeds = (fade = BED_FADE) => {
    want = null; pend.bed = null;
    if (bed && ctx) fadeOut(bed, fade);
    bed = null;
  };
  // ---- music: a streamed <audio> per track (not decoded to PCM: phone memory) -> its own gain -> master,
  // so M (mute) and the -14 dB duck under a voice take apply to it too.
  const tracks = new Map();
  let song = null;
  const ramp = (g, v, s) => { const t = ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(v, t + s); };
  const music = (id) => {
    try {
      if (!id || song?.id === id) return;
      if (!ctx) { pend.music = id; return; }
      const u = A.url(id, base);
      if (!u) return;
      gains();
      let t = tracks.get(id);
      if (!t) {
        const el = new Audio(u); el.loop = true; el.preload = 'auto';
        const g = ctx.createGain(); g.gain.value = 0;
        ctx.createMediaElementSource(el).connect(g); g.connect(master);
        t = { id, el, g }; tracks.set(id, t);
      }
      const old = song;
      if (old) { ramp(old.g, 0, MUSIC_FADE); setTimeout(() => { if (song !== old) old.el.pause(); }, MUSIC_FADE * 1000 + 100); }
      t.el.play()?.catch?.(() => {});
      ramp(t.g, MUSIC_GAIN, MUSIC_FADE);
      song = t;
    } catch { /* music is never fatal */ }
  };
  // The beat's scene: a change of scene stops the beds (the new scene's first beat starts its own).
  const scene = (id) => { if (id !== curScene) { curScene = id; stopBeds(); } };
  const play = (cue) => {
    try {
      if (cue === 'silence') { stopBeds(1); return; } // the authored silence also ends a bed
      const id = A.cueId(cue);
      if (!id) return;
      const isBed = isBedId(id);
      if (!ctx) { if (isBed) pend.bed = cue; else pend.shot = cue; return; }
      if (isBed) { startBed(id); return; }
      gains();
      const out = master;
      const b = buffers.get(id);
      if (!b) { if (!synth(ctx, id, out)) beep(id); return; } // missing file: the synth stand-in, else the beep
      const s = ctx.createBufferSource(); s.buffer = b; s.connect(out); s.start();
    } catch { /* sound is never fatal */ }
  };
  const src = (id) => images.get(id) ?? placeholderImg(id);
  const has = (id) => images.has(id); // true once the real image file has loaded (it then beats any fallback art)
  const setMuted = (v) => { muted = !!v; if (ctx) gains(); };
  const duck = (v) => { ducked = !!v; if (ctx) gains(); };
  return { preload, play, music, src, unlock, has, setMuted, duck, scene, stopBeds, musicId: () => song?.id ?? null, isBed: (c) => isBedId(A.cueId(c)), bedId: () => bed?.id ?? null };
}
