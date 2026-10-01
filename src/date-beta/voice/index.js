// Voice playback for the player: one line at a time, mute toggle, silent on any miss/error.
// Autoplay rule: nothing plays before the first user click/key; the line showing at that moment then starts.
import manifest from './manifest.json';
import timing from './timing.json';
import { buildIndex, fileForLine, planFor } from './voice.js';
// Takes are re-recorded IN PLACE (same paths), so a browser that played the old ones keeps them cached
// (Oct 1: the British Daniel narration kept playing after the v4 re-record to Sean). Bump this on every re-record.
export const VOICE_REV = 'v4';

const INDEX = buildIndex(manifest);
const KEY = 'date-beta-voice-muted';

// onSpeak(true|false): a take started / ended (the sfx bed ducks under it).
export function createVoice(base = '/', storage = () => localStorage, onSpeak = () => {}) {
  let muted = false;
  try { muted = storage().getItem(KEY) === '1'; } catch { /* storage blocked: default sound on */ }
  let unlocked = false, cur = null, want = null;
  const subs = new Set();
  const emit = () => subs.forEach((f) => f(muted));

  // Speech bus: +6 dB then a compressor/limiter so a take never clips (the takes sit near -24 LUFS, quieter than the beds).
  let ctx = null, bus = null;
  const GAIN = 3; // back from 4: the takes carry their own room noise, and +6 dB into the limiter lifted that noise too
  const route = (a) => {
    try {
      if (!ctx) {
        const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        const g = ctx.createGain(); g.gain.value = GAIN;
        const c = ctx.createDynamicsCompressor();
        c.threshold.value = -14; c.knee.value = 6; c.ratio.value = 8; c.attack.value = 0.003; c.release.value = 0.15;
        g.connect(c); c.connect(ctx.destination); bus = g;
      }
      if (ctx.state === 'suspended') ctx.resume?.().catch(() => {});
      ctx.createMediaElementSource(a).connect(bus);
    } catch { /* plain element playback at volume 1 */ }
  };

  let speaking = false;
  const speak = (v) => { if (v !== speaking) { speaking = v; try { onSpeak(v); } catch { /* ignore */ } } };
  const stop = () => {
    if (cur) { try { cur.pause(); } catch { /* ignore */ } cur = null; }
    speak(false);
  };
  let queued = null; // a second take to play when this one ends (a two-step beat: lead line, then its own line)
  const start = (file, then = null) => {
    stop();
    if (!file && then) { file = then; then = null; }
    if (!file || muted || !unlocked || typeof Audio === 'undefined') return;
    try {
      const a = new Audio(`${base}${file}?v=${VOICE_REV}`);
      a.addEventListener('error', () => { if (cur === a) { cur = null; speak(false); } });
      a.addEventListener('ended', () => {
        if (cur !== a) return;
        if (then && queued === then) start(then); else { cur = null; speak(false); }
      });
      route(a);
      cur = a;
      speak(true);
      a.play()?.catch(() => { if (cur === a) { cur = null; speak(false); } });
    } catch { cur = null; }
  };
  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    if ((want || queued) && !muted) start(want, queued);
  };
  if (typeof addEventListener === 'function') for (const ev of ['pointerdown', 'keydown']) addEventListener(ev, unlock, { once: true });

  return {
    // The beat now showing: stops the previous line, plays this one if recorded (scene id + the line's words).
    // then = the words of a second line that follows on the same beat (played after the first take ends).
    show(scene, plain, then = null) { want = fileForLine(INDEX, scene, plain); queued = then ? fileForLine(INDEX, scene, then) : null; start(want, queued); },
    // The same beat in time (voice.js planFor): zero when muted / not yet unlocked, so silent runs keep authored timing.
    plan(scene, plain, then = null) { return planFor(INDEX, timing, scene, plain, then, !muted && unlocked && typeof Audio !== 'undefined'); },
    stop() { want = null; queued = null; stop(); },
    get muted() { return muted; },
    setMuted(v) {
      muted = !!v;
      try { storage().setItem(KEY, muted ? '1' : '0'); } catch { /* ignore */ }
      if (muted) stop(); else start(want, queued);
      emit();
    },
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
  };
}
