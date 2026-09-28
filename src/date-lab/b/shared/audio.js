// Builder B synth: every sound is built from oscillators + one noise buffer (no audio files).
// Rules: nothing plays before a user click (unlock), a visible mute toggle (SoundChrome), a caption for every cue
// (captions fire even when muted or locked). Import-safe in node: no window access until unlock()/play().
import { CUES } from './cues.js';

let ctx = null, master = null, muffleLP = null, bus = null, noise = null;
let muted = readMuted();
const capSubs = new Set(), stateSubs = new Set();
const beds = new Map(); // id -> { want, stop }

function readMuted() {
  try { return globalThis.localStorage?.getItem('lab-b.muted') === '1'; } catch { return false; }
}
export const soundState = () => (!ctx ? 'locked' : muted ? 'muted' : 'on');
const emitState = () => stateSubs.forEach((f) => f(soundState()));
export function onState(f) { stateSubs.add(f); return () => stateSubs.delete(f); }
export function onCaption(f) { capSubs.add(f); return () => capSubs.delete(f); }
export function caption(text, id = 'line') { capSubs.forEach((f) => f({ text, id, at: Date.now() })); }

export function unlock() {
  if (typeof window === 'undefined') return;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.8;
    muffleLP = ctx.createBiquadFilter();
    muffleLP.type = 'lowpass'; muffleLP.frequency.value = 18000; muffleLP.Q.value = 0.7;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 4;
    bus = ctx.createGain();
    bus.connect(muffleLP).connect(master).connect(comp).connect(ctx.destination);
    const n = ctx.sampleRate * 2;
    noise = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = noise.getChannelData(0);
    let seed = 12345;
    for (let i = 0; i < n; i++) { seed = (seed * 1103515245 + 12345) >>> 0; d[i] = (seed / 4294967296) * 2 - 1; }
    beds.forEach((b, id) => { if (b.want && !b.stop) b.stop = RECIPES[id](ctx, bus, {}); });
  }
  ctx.resume?.();
  emitState();
}

export function setMuted(m) {
  muted = m;
  try { globalThis.localStorage?.setItem('lab-b.muted', m ? '1' : '0'); } catch { /* private mode */ }
  if (ctx) master.gain.setTargetAtTime(m ? 0 : 0.8, ctx.currentTime, 0.05);
  emitState();
}
export const isMuted = () => muted;

// One-shot (or bus change). The caption always fires; the sound only when unlocked and not muted.
export function play(id, opts = {}) {
  const cue = CUES[id];
  if (!cue) return;
  if (!opts.silentCaption) caption(opts.caption ?? cue.caption, id);
  if (cue.kind === 'bus') { setMuffle(id === 'muffle' ? 1 : 0, opts.ramp); return; }
  if (!ctx || cue.kind === 'bed') return;
  try { RECIPES[id](ctx, bus, opts); } catch { /* a failed sound never breaks the scene */ }
}

// Loops: bed('rain', true) ... bed('rain', false). Wanted beds start on unlock.
export function bed(id, on, opts = {}) {
  const b = beds.get(id) ?? { want: false, stop: null };
  beds.set(id, b);
  if (on && !b.want && !opts.silentCaption) caption(CUES[id]?.caption ?? id, id);
  b.want = on;
  if (!ctx) return;
  if (on && !b.stop) b.stop = RECIPES[id](ctx, bus, opts);
  if (!on && b.stop) { b.stop(); b.stop = null; }
}
export function stopAll() {
  beds.forEach((b) => { b.want = false; if (b.stop) { b.stop(); b.stop = null; } });
  setMuffle(0, 0.05);
}

export function setMuffle(x, ramp = 1.2) {
  if (!ctx) return;
  const f = x ? 380 : 18000;
  muffleLP.frequency.cancelScheduledValues(ctx.currentTime);
  muffleLP.frequency.setValueAtTime(muffleLP.frequency.value, ctx.currentTime);
  muffleLP.frequency.exponentialRampToValueAtTime(f, ctx.currentTime + ramp);
}

// ---------- building blocks ----------
function env(g, t, a, peak, d, curve = 'exp') {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + a);
  if (curve === 'exp') g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  else g.gain.linearRampToValueAtTime(0.0001, t + a + d);
}
function osc(c, type, f, t, dur, dest) {
  const o = c.createOscillator();
  o.type = type; o.frequency.setValueAtTime(f, t);
  o.connect(dest); o.start(t); o.stop(t + dur + 0.05);
  return o;
}
function gain(c, dest, v = 0) { const g = c.createGain(); g.gain.value = v; g.connect(dest); return g; }
function filt(c, type, f, q, dest) { const b = c.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; b.connect(dest); return b; }
function noiseSrc(c, t, dur, dest, loop = false) {
  const s = c.createBufferSource();
  s.buffer = noise; s.loop = loop || dur > 1.9;
  s.connect(dest); s.start(t, Math.random() * 1.5);
  if (dur) s.stop(t + dur + 0.05);
  return s;
}
function pan(c, x, dest) { const p = c.createStereoPanner ? c.createStereoPanner() : c.createGain(); if (p.pan) p.pan.value = x; p.connect(dest); return p; }
function bell(c, dest, t, f0, partials, dur, peak) {
  partials.forEach(([r, g], i) => {
    const e = gain(c, dest);
    env(e, t, 0.004, peak * g, dur * (1 - i * 0.07));
    osc(c, 'sine', f0 * r, t, dur, e);
  });
}
// a loop helper: returns stop() that fades then disconnects
function looped(c, g, nodes) {
  return () => {
    const t = c.currentTime;
    g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0.0001, t + 0.5);
    setTimeout(() => { nodes.forEach((n) => { try { n.stop(); } catch { /* already stopped */ } }); g.disconnect(); }, 700);
  };
}

// ---------- recipes: (ctx, dest, opts) ----------
export const RECIPES = {
  tick(c, d) { const t = c.currentTime, g = gain(c, d); env(g, t, 0.002, 0.12, 0.03); osc(c, 'square', 1800, t, 0.05, filt(c, 'bandpass', 1800, 3, g)); },
  pink(c, d) { const t = c.currentTime; bell(c, d, t, 1318.5, [[1, 1], [1.5, 0.5], [2, 0.3]], 1.1, 0.16); },
  purple(c, d) {
    const t = c.currentTime, lp = filt(c, 'lowpass', 900, 0.7, d);
    bell(c, lp, t, 196, [[1, 1], [1.018, 0.9], [1.5, 0.45], [2.03, 0.3]], 1.8, 0.2);
  },
  thump(c, d, o = {}) {
    const t = c.currentTime, k = o.gain ?? 1;
    [[0, 1], [0.24, 0.6]].forEach(([dt, v]) => {
      const g = gain(c, d); env(g, t + dt, 0.006, 0.9 * v * k, 0.2);
      const s = osc(c, 'sine', 120, t + dt, 0.25, g);
      s.frequency.exponentialRampToValueAtTime(42, t + dt + 0.11);
    });
  },
  breath(c, d) {
    const t = c.currentTime, p = pan(c, -0.35, d);
    const g1 = gain(c, p); env(g1, t, 0.45, 0.22, 0.4, 'lin'); noiseSrc(c, t, 0.9, filt(c, 'bandpass', 1500, 0.9, g1));
    const g2 = gain(c, p); env(g2, t + 0.75, 0.12, 0.16, 0.9); noiseSrc(c, t + 0.75, 1.1, filt(c, 'bandpass', 650, 0.8, g2));
  },
  bell(c, d) {
    const t = c.currentTime;
    bell(c, d, t, 262, [[0.5, 0.7], [1, 1], [1.19, 0.5], [1.5, 0.35], [2, 0.45], [2.52, 0.25], [2.99, 0.2], [4.1, 0.12]], 4.5, 0.18);
    const g = gain(c, d); env(g, t, 0.001, 0.2, 0.08); noiseSrc(c, t, 0.1, filt(c, 'highpass', 2500, 0.7, g));
  },
  static(c, d) {
    const t = c.currentTime;
    const g = gain(c, d); env(g, t, 0.002, 0.3, 0.16); noiseSrc(c, t, 0.2, filt(c, 'highpass', 1400, 0.5, g));
    const g2 = gain(c, d); env(g2, t, 0.002, 0.5, 0.06); osc(c, 'square', 70, t, 0.08, filt(c, 'lowpass', 300, 1, g2));
  },
  sour(c, d) {
    const t = c.currentTime, g = gain(c, d); env(g, t, 0.01, 0.12, 0.28);
    const o = osc(c, 'triangle', 700, t, 0.32, filt(c, 'lowpass', 4000, 1, g));
    o.frequency.exponentialRampToValueAtTime(1600, t + 0.16); o.frequency.exponentialRampToValueAtTime(1100, t + 0.3);
    const lfo = osc(c, 'sine', 28, t, 0.32, gain(c, o.frequency, 60)); void lfo;
  },
  bleed(c, d) {
    const t = c.currentTime, g = gain(c, d); env(g, t, 0.03, 0.22, 0.3);
    const f = filt(c, 'bandpass', 3000, 1.2, g); f.frequency.exponentialRampToValueAtTime(260, t + 0.334);
    noiseSrc(c, t, 0.4, f);
  },
  steam(c, d) {
    const t = c.currentTime, g = gain(c, d); env(g, t, 0.6, 0.07, 1.2, 'lin');
    noiseSrc(c, t, 1.9, filt(c, 'highpass', 3200, 0.5, g));
  },
  stab(c, d) {
    const t = c.currentTime, g = gain(c, filt(c, 'lowpass', 2600, 0.8, d)); env(g, t, 0.01, 0.11, 0.9);
    [164.8, 174.6, 207.7, 233.1, 329.6].forEach((f, i) => { const o = osc(c, 'sawtooth', f, t, 1, g); o.detune.value = (i - 2) * 9; });
  },
  wire(c, d) {
    const t = c.currentTime;
    for (let i = 0; i < 9; i++) {
      const at = t + i * 0.035 + Math.random() * 0.02, g = gain(c, d);
      env(g, at, 0.001, 0.12 + Math.random() * 0.1, 0.02); noiseSrc(c, at, 0.04, filt(c, 'highpass', 2600, 0.7, g));
    }
  },
  spark(c, d) {
    const t = c.currentTime, g = gain(c, d); env(g, t, 0.005, 0.1, 0.25);
    const o = osc(c, 'sawtooth', 2400, t, 0.3, filt(c, 'bandpass', 2000, 2, g)); o.frequency.exponentialRampToValueAtTime(300, t + 0.25);
  },
  door(c, d) {
    const t = c.currentTime;
    [0, 0.16].forEach((dt) => { const g = gain(c, d); env(g, t + dt, 0.001, 0.35, 0.05); noiseSrc(c, t + dt, 0.07, filt(c, 'bandpass', 3400, 4, g)); });
    const g = gain(c, d); env(g, t + 0.18, 0.004, 0.4, 0.15); osc(c, 'sine', 90, t + 0.18, 0.2, g);
  },
  steps(c, d, o = {}) {
    const t = c.currentTime, n = o.n ?? 4;
    for (let i = 0; i < n; i++) {
      const at = t + i * 0.46, g = gain(c, d); env(g, at, 0.003, 0.35, 0.12);
      noiseSrc(c, at, 0.15, filt(c, 'bandpass', 900 + (i % 2) * 300, 2.5, g));
    }
  },
  rewind(c, d) {
    const t = c.currentTime, g = gain(c, d); env(g, t, 0.05, 0.05, 0.8, 'lin');
    const o = osc(c, 'sawtooth', 300, t, 0.9, filt(c, 'bandpass', 1800, 1, g)); o.frequency.exponentialRampToValueAtTime(2400, t + 0.85);
    const g2 = gain(c, d); env(g2, t, 0.05, 0.06, 0.8, 'lin'); noiseSrc(c, t, 0.9, filt(c, 'highpass', 4000, 0.5, g2));
  },
  whisper(c, d) {
    const t = c.currentTime, p = pan(c, 0.4, d);
    [[0, 0.18, 2200], [0.28, 0.38, 1500]].forEach(([dt, dur, f]) => {
      const g = gain(c, p); env(g, t + dt, 0.05, 0.2, dur, 'lin');
      const bp = filt(c, 'bandpass', f, 3, g); bp.frequency.linearRampToValueAtTime(f * 0.7, t + dt + dur);
      noiseSrc(c, t + dt, dur + 0.1, bp);
    });
  },
  buzz(c, d) {
    const t = c.currentTime, g = gain(c, filt(c, 'lowpass', 400, 1, d)); env(g, t, 0.01, 0.2, 0.5, 'lin');
    osc(c, 'square', 150, t, 0.55, g);
  },
  rec(c, d) { const t = c.currentTime; [0, 0.14].forEach((dt) => { const g = gain(c, d); env(g, t + dt, 0.002, 0.08, 0.07); osc(c, 'sine', 2093, t + dt, 0.1, g); }); },
  af(c, d) { const t = c.currentTime, g = gain(c, d); env(g, t, 0.002, 0.06, 0.05); osc(c, 'sine', 3136, t, 0.07, g); },
  croak(c, d) {
    const t = c.currentTime, g = gain(c, d); env(g, t, 0.9, 0.35, 0.5, 'lin');
    const am = gain(c, filt(c, 'bandpass', 380, 2.5, g), 0);
    noiseSrc(c, t, 1.6, am);
    const lfo = osc(c, 'square', 19, t, 1.6, am.gain); lfo.frequency.linearRampToValueAtTime(26, t + 1.4);
  },
  lid(c, d) { const t = c.currentTime, g = gain(c, d); env(g, t, 0.05, 0.08, 0.2); noiseSrc(c, t, 0.3, filt(c, 'lowpass', 700, 0.7, g)); },
  creak(c, d) {
    const t = c.currentTime, g = gain(c, filt(c, 'bandpass', 500, 4, d)); env(g, t, 0.05, 0.25, 0.7, 'lin');
    const o = osc(c, 'sawtooth', 70, t, 0.8, g); o.frequency.linearRampToValueAtTime(110, t + 0.3); o.frequency.linearRampToValueAtTime(64, t + 0.75);
  },
  drum(c, d) {
    const t = c.currentTime, g = gain(c, d); env(g, t, 0.003, 0.6, 0.25);
    const o = osc(c, 'sine', 140, t, 0.3, g); o.frequency.exponentialRampToValueAtTime(55, t + 0.2);
  },
  chime(c, d) { const t = c.currentTime; bell(c, d, t, 988, [[1, 1], [2, 0.2]], 0.7, 0.12); bell(c, d, t + 0.35, 784, [[1, 1], [2, 0.2]], 0.9, 0.12); },
  cut() { /* silence is the sound */ },

  // ---------- beds (return stop) ----------
  rain(c, d, o = {}) {
    const g = gain(c, d); g.gain.setValueAtTime(0.0001, c.currentTime); g.gain.linearRampToValueAtTime(o.level ?? 0.09, c.currentTime + 1);
    const s = noiseSrc(c, c.currentTime, 0, filt(c, 'lowpass', 5200, 0.5, filt(c, 'highpass', 500, 0.5, g)), true);
    const g2 = gain(c, d); g2.gain.value = 0.05;
    const s2 = noiseSrc(c, c.currentTime, 0, filt(c, 'lowpass', 300, 0.7, g2), true);
    const stop = looped(c, g, [s]), stop2 = looped(c, g2, [s2]);
    return () => { stop(); stop2(); };
  },
  hum(c, d) {
    const g = gain(c, d); g.gain.setValueAtTime(0.0001, c.currentTime); g.gain.linearRampToValueAtTime(0.06, c.currentTime + 1);
    const lp = filt(c, 'lowpass', 240, 0.8, g);
    const a = osc(c, 'sawtooth', 50, c.currentTime, 3600, lp), b = osc(c, 'sawtooth', 100.4, c.currentTime, 3600, lp);
    const n = noiseSrc(c, c.currentTime, 0, filt(c, 'lowpass', 400, 0.5, g), true);
    return looped(c, g, [a, b, n]);
  },
  drone(c, d) {
    const t = c.currentTime, g = gain(c, d); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.08, t + 4);
    const lp = filt(c, 'lowpass', 220, 1, g); lp.frequency.linearRampToValueAtTime(900, t + 12);
    const a = osc(c, 'sawtooth', 55, t, 3600, lp), b = osc(c, 'sawtooth', 55.6, t, 3600, lp), e = osc(c, 'sine', 36.7, t, 3600, g);
    return looped(c, g, [a, b, e]);
  },
  tape(c, d) {
    const t = c.currentTime, g = gain(c, d); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.03, t + 0.5);
    const n = noiseSrc(c, t, 0, filt(c, 'bandpass', 6500, 0.6, g), true);
    const m = osc(c, 'triangle', 118, t, 3600, gain(c, g, 0.18));
    return looped(c, g, [n, m]);
  },
  cicada(c, d) {
    const t = c.currentTime, g = gain(c, d); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05, t + 1.5);
    const am = gain(c, filt(c, 'bandpass', 5200, 6, g), 0.5);
    const n = noiseSrc(c, t, 0, am, true);
    const lfo = osc(c, 'sine', 48, t, 3600, gain(c, am.gain, 0.5));
    const hum = osc(c, 'sine', 60, t, 3600, gain(c, g, 0.3));
    return looped(c, g, [n, lfo, hum]);
  },
  room(c, d) {
    const t = c.currentTime, g = gain(c, d); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.04, t + 1);
    const a = osc(c, 'sine', 60, t, 3600, g), b = osc(c, 'sine', 120, t, 3600, gain(c, g, 0.3));
    const n = noiseSrc(c, t, 0, filt(c, 'lowpass', 600, 0.5, gain(c, g, 0.6)), true);
    return looped(c, g, [a, b, n]);
  },
  // a music-box march scheduled on the 8 fps grid: 4 steps a beat at 120 bpm
  parade(c, d) {
    const g = gain(c, d); g.gain.value = 0.9;
    const notes = [659, 0, 784, 0, 880, 784, 659, 0, 587, 0, 659, 0, 523, 0, 0, 0];
    let i = 0, alive = true;
    const step = () => {
      if (!alive) return;
      const t = c.currentTime + 0.05, f = notes[i % notes.length];
      if (f) { const e = gain(c, g); env(e, t, 0.003, 0.07, 0.35); osc(c, 'triangle', f, t, 0.4, e); }
      if (i % 4 === 0) { const e = gain(c, g); env(e, t, 0.003, 0.3, 0.18); const o = osc(c, 'sine', 120, t, 0.2, e); o.frequency.exponentialRampToValueAtTime(50, t + 0.15); }
      i += 1;
    };
    const id = setInterval(step, 125);
    return () => { alive = false; clearInterval(id); g.gain.setTargetAtTime(0.0001, c.currentTime, 0.1); setTimeout(() => g.disconnect(), 600); };
  },
};
