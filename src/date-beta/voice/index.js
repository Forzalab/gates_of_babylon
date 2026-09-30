// Voice playback for the player: one line at a time, mute toggle, silent on any miss/error.
// Autoplay rule: nothing plays before the first user click/key; the line showing at that moment then starts.
import manifest from './manifest.json';
import { buildIndex, fileForLine } from './voice.js';

const INDEX = buildIndex(manifest);
const KEY = 'date-beta-voice-muted';

export function createVoice(base = '/', storage = () => localStorage) {
  let muted = false;
  try { muted = storage().getItem(KEY) === '1'; } catch { /* storage blocked: default sound on */ }
  let unlocked = false, cur = null, want = null;
  const subs = new Set();
  const emit = () => subs.forEach((f) => f(muted));

  const stop = () => {
    if (cur) { try { cur.pause(); } catch { /* ignore */ } cur = null; }
  };
  let queued = null; // a second take to play when this one ends (a two-step beat: lead line, then its own line)
  const start = (file, then = null) => {
    stop();
    if (!file && then) { file = then; then = null; }
    if (!file || muted || !unlocked || typeof Audio === 'undefined') return;
    try {
      const a = new Audio(`${base}${file}`);
      a.addEventListener('error', () => { if (cur === a) cur = null; });
      if (then) a.addEventListener('ended', () => { if (cur === a && queued === then) start(then); });
      cur = a;
      a.play()?.catch(() => { if (cur === a) cur = null; });
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
