// Round-3 text edits (pure, node-tested). R2 typed one glyph every 125-250 ms; the R1 rule is <= 2 glyph swaps per second.
// So an edit is now a few WHOLE-CHUNK swaps, each held >= 500 ms (exactly 2 swaps/s at most):
//   from -> [her red selection over the doomed words] -> deleted -> first half typed -> the rest typed.
// A crowd reads each state; nothing strobes. Reduced motion: <= 3 hard cuts, each held >= 1000 ms.
import { POSE } from '../kit/time.js';

export const GAP = POSE; // 500 ms between swaps

// Split an added string into <= 2 chunks at a word boundary near the middle (short adds stay one chunk).
export function halves(add) {
  if (add.length <= 4) return [add];
  const mid = Math.ceil(add.length / 2);
  const sp = add.lastIndexOf(' ', mid);
  const cut = sp > 0 ? sp + 1 : mid;
  return cut >= add.length ? [add] : [add.slice(0, cut), add];
}

// Frames [{ at, text, sel }]: `sel` = how many trailing chars are shown selected (her red highlight).
export function wordEdit(from, keep, add, t0 = 0, { gap = GAP, rm = false } = {}) {
  if (!from.startsWith(keep)) throw new Error(`wordEdit: "${keep}" is not a prefix of "${from}"`);
  const g = Math.max(POSE, gap);
  if (rm) {
    const out = [{ at: t0, text: from, sel: 0 }];
    if (keep !== from) out.push({ at: t0 + 1000, text: keep, sel: 0 });
    if (add) out.push({ at: out.at(-1).at + 1000, text: keep + add, sel: 0 });
    return out;
  }
  const out = [{ at: t0, text: from, sel: 0 }];
  let t = t0;
  if (keep !== from) {
    t += g; out.push({ at: t, text: from, sel: from.length - keep.length });
    t += g; out.push({ at: t, text: keep, sel: 0 });
  }
  for (const c of add ? halves(add) : []) { t += g; out.push({ at: t, text: keep + c, sel: 0 }); }
  return out;
}

export function frameAt(frames, t) {
  let cur = frames[0] ?? { at: 0, text: '', sel: 0 };
  for (const f of frames) { if (f.at <= t) cur = f; else break; }
  return cur;
}
export const textAt = (frames, t) => frameAt(frames, t).text;
export const endOf = (frames) => frames.at(-1)?.at ?? 0;

// Safety audit: the swap times of a set of frame lists (merged). No 1 s window may hold more than `max` swaps.
export function swapsSafe(lists, max = 2) {
  const at = lists.flatMap((fr) => fr.slice(1).map((f) => f.at)).sort((a, b) => a - b);
  for (let i = 0; i < at.length; i++) {
    let n = 0;
    for (let j = i; j < at.length && at[j] < at[i] + 1000; j++) n++;
    if (n > max) return false;
  }
  return true;
}

// How far through an edit (0..1), quantised to the edit's own swaps (each held >= 500 ms).
export function doneAt(frames, t) {
  const n = frames.length - 1;
  if (n < 1) return 0;
  let k = 0;
  for (let i = 1; i <= n; i++) if (t >= frames[i].at) k = i;
  return k / n;
}
