// Pure "she edits the text while you read it" frames (menu-3). A script of edits -> time-stamped strings.
// Each keystroke sits on the 8 fps grid (125 ms). Reduced motion: every edit is ONE hard cut (old -> new), held >= 500 ms.
import { TICK, POSE } from './time.js';

// Backspace `from` down to `keep` (a prefix of it), then type `add`. Starts at t0. Returns [{ at, text }] incl. the start frame.
export function retype(from, keep, add, t0 = 0, { tick = TICK, pause = 3 * TICK, rm = false } = {}) {
  if (!from.startsWith(keep)) throw new Error(`retype: "${keep}" is not a prefix of "${from}"`);
  if (rm) return [{ at: t0, text: from }, { at: t0 + POSE, text: keep + add }];
  const out = [{ at: t0, text: from }];
  let t = t0;
  for (let n = from.length - 1; n >= keep.length; n--) { t += tick; out.push({ at: t, text: from.slice(0, n) }); }
  t += pause;
  for (let n = 1; n <= add.length; n++) { t += tick; out.push({ at: t, text: keep + add.slice(0, n) }); }
  return out;
}

// The text on screen at time t for a list of frames (frames sorted by `at`). Before the first frame = the first frame's text.
export function textAt(frames, t) {
  let cur = frames[0]?.text ?? '';
  for (const f of frames) { if (f.at <= t) cur = f.text; else break; }
  return cur;
}

// When does a frame list finish (last keystroke)?
export const endOf = (frames) => frames.at(-1)?.at ?? 0;
