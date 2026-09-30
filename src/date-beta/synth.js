// synth.js: WebAudio stand-ins for the sfx slots whose file is missing (a real file always wins, see assets.js).
// Built for ceiling speakers on a projector: everything sits in 300 Hz..4 kHz (no bass, no fizz), peaks ~0.18.
// Each recipe schedules onto (ctx, out, t) and returns its length in seconds. Loops (rain, wind, hum, drone) run
// several seconds with soft ends so back-to-back cues overlap instead of clicking.
export const LO = 300, HI = 4000;
const clampHz = (f) => Math.min(HI, Math.max(LO, f));
const noiseBuf = new WeakMap();
function noise(ctx) {
  let b = noiseBuf.get(ctx);
  if (!b) {
    b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = b.getChannelData(0);
    let s = 7;
    for (let i = 0; i < d.length; i++) { s = (s * 1103515245 + 12345) >>> 0; d[i] = (s / 2147483648) - 1; }
    noiseBuf.set(ctx, b);
  }
  const n = ctx.createBufferSource(); n.buffer = b; n.loop = true;
  return n;
}
// band-limited chain: src -> highpass(LO) -> bandpass(f, q) -> lowpass(HI) -> gain (starts silent)
function band(ctx, src, f, q = 1) {
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = LO;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = clampHz(f); bp.Q.value = q;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = HI;
  const g = ctx.createGain(); g.gain.value = 0;
  src.connect(hp).connect(bp).connect(lp).connect(g);
  return { bp, g };
}
const env = (p, t, a, peak, hold, r) => {
  p.setValueAtTime(0, t); p.linearRampToValueAtTime(peak, t + a); p.setValueAtTime(peak, t + a + hold); p.linearRampToValueAtTime(0, t + a + hold + r);
};
function burst(ctx, out, t, f, q, peak, dur) { // a noise hit: clicks, taps, drops, crackle
  const n = noise(ctx), { g } = band(ctx, n, f, q); g.connect(out);
  env(g.gain, t, 0.003, peak, 0, dur); n.start(t, Math.random()); n.stop(t + dur + 0.05);
}
function tone(ctx, out, t, f, peak, dur, type = 'sine', f2) {
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type;
  o.frequency.setValueAtTime(clampHz(f), t); if (f2) o.frequency.exponentialRampToValueAtTime(clampHz(f2), t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
  o.connect(g).connect(out); o.start(t); o.stop(t + dur + 0.02);
}
function wash(ctx, out, t, dur, f0, f1, q, peak, fadeIn = 0.6, fadeOut = 0.8) { // filtered noise bed
  const n = noise(ctx), { bp, g } = band(ctx, n, f0, q); g.connect(out);
  bp.frequency.setValueAtTime(clampHz(f0), t); bp.frequency.linearRampToValueAtTime(clampHz(f1), t + dur);
  env(g.gain, t, fadeIn, peak, Math.max(0, dur - fadeIn - fadeOut), fadeOut); n.start(t); n.stop(t + dur + 0.05);
  return bp;
}

export const SYNTH = {
  // kettle hiss: filtered noise rising in pitch and level, a whistle edge at the top
  'SX-37': (ctx, out, t) => { wash(ctx, out, t, 3.2, 900, 3600, 3, 0.14, 2.4, 0.4); tone(ctx, out, t + 2.4, 2600, 0.03, 0.8, 'sine', 2900); return 3.2; },
  // rain loop: a soft noise bed plus random drops
  'SX-20': (ctx, out, t) => {
    wash(ctx, out, t, 5, 2400, 2200, 0.6, 0.09, 0.8, 1.2);
    for (let i = 0; i < 40; i++) burst(ctx, out, t + 0.3 + Math.random() * 4.2, 1500 + Math.random() * 2200, 6, 0.05, 0.03);
    return 5;
  },
  // heartbeat: lub-dub twice, pitched up out of the bass into a chest-knock range
  'SX-04': (ctx, out, t) => {
    for (const s of [0, 0.9]) {
      tone(ctx, out, t + s, 420, 0.2, 0.16, 'triangle', 320); burst(ctx, out, t + s, 500, 2, 0.08, 0.06);
      tone(ctx, out, t + s + 0.24, 380, 0.14, 0.13, 'triangle', 310);
    }
    return 1.8;
  },
  // static click: a hard crackle, then a short hiss
  'SX-06': (ctx, out, t) => {
    burst(ctx, out, t, 2500, 1, 0.16, 0.03); wash(ctx, out, t + 0.02, 0.5, 3000, 2000, 0.5, 0.07, 0.02, 0.3);
    for (let i = 0; i < 6; i++) burst(ctx, out, t + Math.random() * 0.45, 3200, 4, 0.08, 0.01);
    return 0.55;
  },
  // wind loop: noise with a slow wandering band
  'SX-15': (ctx, out, t) => {
    const bp = wash(ctx, out, t, 5, 500, 700, 4, 0.12, 1, 1.4);
    [900, 600, 1200, 700].forEach((f, i) => bp.frequency.linearRampToValueAtTime(f, t + 1 + i));
    return 5;
  },
  // train hum: motor whine + rail clicks every 0.6 s
  'SX-21': (ctx, out, t) => {
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
    o.type = 'sawtooth'; o.frequency.value = 330; o2.type = 'sine'; o2.frequency.value = 495; lp.type = 'lowpass'; lp.frequency.value = 1200;
    o.connect(lp); o2.connect(lp); lp.connect(g).connect(out); env(g.gain, t, 0.8, 0.05, 3, 1);
    o.start(t); o2.start(t); o.stop(t + 5); o2.stop(t + 5);
    for (let s = 0.4; s < 4.6; s += 0.6) { burst(ctx, out, t + s, 900, 3, 0.07, 0.05); burst(ctx, out, t + s + 0.12, 800, 3, 0.05, 0.05); }
    return 5;
  },
  // door chime: two bell tones, down a third
  'SX-23': (ctx, out, t) => { for (const [s, f] of [[0, 1319], [0.45, 1047]]) { tone(ctx, out, t + s, f, 0.12, 1.4); tone(ctx, out, t + s, f * 2.76, 0.02, 0.5); } return 1.9; },
  // drone: detuned saws beating slowly, band-limited
  'SX-27': (ctx, out, t) => {
    const bp = ctx.createBiquadFilter(), g = ctx.createGain(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 1.2; bp.connect(g).connect(out);
    for (const f of [330, 332.5, 495]) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.connect(bp); o.start(t); o.stop(t + 5); }
    env(g.gain, t, 1.2, 0.05, 2.4, 1.4); return 5;
  },
  // breath: in (band rises), out (band falls, longer)
  'SX-28': (ctx, out, t) => { wash(ctx, out, t, 1.1, 700, 1300, 2, 0.1, 0.6, 0.4); wash(ctx, out, t + 1.2, 1.5, 1200, 600, 2, 0.09, 0.2, 1.1); return 2.7; },
  // tick: one dry clock tick
  'SX-45': (ctx, out, t) => { tone(ctx, out, t, 2200, 0.1, 0.03, 'square'); burst(ctx, out, t, 3000, 5, 0.1, 0.015); return 0.1; },
  // collapse f1 tilt: dry card crack
  'SX-C1': (ctx, out, t) => { burst(ctx, out, t, 1800, 2, 0.18, 0.05); burst(ctx, out, t + 0.03, 1100, 3, 0.1, 0.08); return 0.2; },
  // collapse f2 slip: plastic clack + scrape
  'SX-C2': (ctx, out, t) => { tone(ctx, out, t, 1400, 0.12, 0.05, 'square', 900); wash(ctx, out, t + 0.05, 0.35, 2000, 900, 4, 0.08, 0.02, 0.2); return 0.45; },
  // collapse f3 fall: card pile clatter, one hit
  'SX-C3': (ctx, out, t) => { for (let i = 0; i < 9; i++) burst(ctx, out, t + i * 0.025 + Math.random() * 0.02, 900 + Math.random() * 2000, 3, 0.14 - i * 0.012, 0.05); return 0.35; },
  // collapse f4 glitch: bit-crushed stepping square
  'SX-C4': (ctx, out, t) => {
    for (let i = 0; i < 10; i++) tone(ctx, out, t + i * 0.03, 400 + ((i * 7919) % 11) * 300, 0.06, 0.028, 'square');
    burst(ctx, out, t + 0.3, 3500, 1, 0.1, 0.04); return 0.4;
  },
};
export const synthIds = () => Object.keys(SYNTH);

// Play one recipe now. Returns false when there is no recipe (the caller beeps).
export function synth(ctx, id, dest = ctx.destination) {
  const r = SYNTH[id];
  if (!r) return false;
  r(ctx, dest, ctx.currentTime + 0.01);
  return true;
}
