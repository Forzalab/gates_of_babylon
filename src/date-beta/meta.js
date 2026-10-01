// meta.js (T3 META-LOOP): replay counter, live clock, and text tokens for date-beta.
// Tokens: {RUN} {TIME} {DAYPART} {CLOTHES} {CROWD.1..4}. crowd.json is Tony-editable (CLOTHES, CROWD[4]).
// Run counter: localStorage "date-beta.run", bumped each time play reaches the first scene. ?run=N pins it (no writes).
// Flag `run` (declared by packs/meta.json as ["1","2","3"]) = run bucket 1, 2, 3+ -> drives `vary` / `if`.
// main.jsx hands crowd.json in via setCrowd (keeps this module plain JS for node --test).
import { TOKEN_RE } from './engine.js';

export { TOKEN_RE };
let crowd = { CLOTHES: 'outfit', CROWD: [] };
export const setCrowd = (c) => { if (c && typeof c === 'object') crowd = c; };
const KEY = 'date-beta.run';
const store = () => { try { return globalThis.localStorage ?? null; } catch { return null; } };
const qs = () => { try { return new URLSearchParams(globalThis.location?.search ?? ''); } catch { return new URLSearchParams(); } };

const pinned = (() => { const n = parseInt(qs().get('run'), 10); return n > 0 ? n : null; })();
let run = pinned ?? (() => { try { return parseInt(store()?.getItem(KEY), 10) || 0; } catch { return 0; } })();

export const getRun = () => Math.max(1, run);
export const runBucket = (n = getRun()) => String(Math.min(3, Math.max(1, n)));
// Called when play reaches the first scene (boot, or a loop back). A pinned ?run=N never changes.
export function bumpRun() {
  if (pinned != null) return run;
  run += 1;
  try { store()?.setItem(KEY, String(run)); } catch { /* private window: the counter lives in memory */ }
  return run;
}

export function clock(d = new Date()) {
  const h = d.getHours(), m = d.getMinutes();
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}
// Story clock (Tony, Oct 1): between 12:00 and 14:00 real time, every clock in the game runs on the real time
// (the rooftop's 12:00 = now, every other scene keeps its gap to it); outside that window, clocks show their canonical time.
export function storyOffset(d = new Date()) {
  const t = d.getHours() * 60 + d.getMinutes();
  return t >= 720 && t < 840 ? t - 720 : 0;
}
// [h, m] canonical -> [h, m] shown (h on a 24 h dial, so 12:00 + 37 = 12:37, 3:00 + 37 = 3:37)
export function storyTime(h, m, d = new Date()) {
  const t = (((h * 60 + m + storyOffset(d)) % 1440) + 1440) % 1440;
  return [Math.floor(t / 60), t % 60];
}
// a stamp string ("12:00 NOON", "7:00 PM", "2:45 PM") moved by the same offset; anything else passes through
export function storyStamp(s, d = new Date()) {
  const off = storyOffset(d);
  const mt = typeof s === 'string' && s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|NOON)$/i);
  if (!off || !mt) return s;
  const suf = mt[3].toUpperCase();
  const h12 = +mt[1] % 12, h = suf === 'PM' || suf === 'NOON' ? h12 + 12 : h12;
  const [H, M] = storyTime(h, +mt[2], d);
  return `${H % 12 || 12}:${String(M).padStart(2, '0')} ${H < 12 ? 'AM' : 'PM'}`;
}

export function daypart(d = new Date()) {
  const h = d.getHours();
  return h >= 5 && h < 12 ? 'morning' : h >= 12 && h < 17 ? 'afternoon' : h >= 17 && h < 21 ? 'evening' : 'night';
}

// Fill every token in a display string. Unknown braces are left alone (the loader already rejected them).
export function fill(text, { now = new Date(), n = getRun(), c = crowd } = {}) {
  if (typeof text !== 'string' || !text.includes('{')) return text;
  return text.replace(TOKEN_RE, (m, k, off) => {
    if (k === 'RUN') return String(n);
    if (k === 'TIME') return clock(now);
    if (k === 'DAYPART') return daypart(now);
    if (k === 'CLOTHES') return c.CLOTHES || 'outfit';
    const w = c.CROWD?.[+k.slice(6) - 1] || 'you';
    return /(^|[.!?…]\s+)$/.test(text.slice(0, off)) ? w.charAt(0).toUpperCase() + w.slice(1) : w; // a crowd name opening a sentence gets a capital
  });
}
