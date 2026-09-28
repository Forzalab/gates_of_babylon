// Round-2 menu scripts (pure, node-tested): what her cursor types, when, and how warm your card gets.
// Keystrokes sit on the 8 fps grid; "slow" = one key every 2 ticks (250 ms) so a crowd can watch each letter go.
// Reduced motion: an edit is at most 3 hard cuts (old -> emptied -> new), each held >= 1000 ms.
import { TICK } from '../kit/time.js';
import { retype, textAt, endOf } from '../kit/retype.js';
import { OPTIONS } from '../kit/menu.js';

export { textAt, endOf };
export const SLOW = 2 * TICK;

// Backspace `from` to `keep`, then type `add`. rm: 3 held cuts instead of keystrokes.
export function slowRetype(from, keep, add, t0 = 0, { tick = SLOW, rm = false } = {}) {
  if (!rm) return retype(from, keep, add, t0, { tick, pause: 2 * tick });
  const out = [{ at: t0, text: from }];
  if (keep !== from) out.push({ at: t0 + 1000, text: keep });
  out.push({ at: out.at(-1).at + 1000, text: keep + add });
  return out;
}

// How far through an edit (0..1) at time t, quantised to `steps` held steps (for the card's warm-up colour).
export function warmAt(frames, t, steps = 4) {
  if (frames.length < 2) return 0;
  const a = frames[0].at, b = endOf(frames);
  const k = Math.min(1, Math.max(0, (t - a) / (b - a || 1)));
  return k >= 1 ? 1 : Math.floor(k * steps) / steps;
}

// "The Cup That Types" (menu-h1-r2): the slips on the two cards for a given run.
//  run 1           : her cursor retypes YOUR slip "It's late. Goodnight." -> "It's late. Stay." (purple still MEANS leave)
//  purple disabled : your card is pinned, its slip = her retyped text struck through; she adds a heart to hers
//  pink disabled   : her card is pinned + struck; she retypes your whole slip into "Just one cup." (both cards agree)
export const STAY = "It's late. Stay.";
export function cupScript(run, disabled = [], rm = false) {
  if (run > 1 && disabled.includes('purple')) {
    return { purple: [{ at: 0, text: STAY }], pink: slowRetype(OPTIONS.pink.text, OPTIONS.pink.text, ' ♡', 1000, { rm }), typing: 'pink', warmFrom: 1 };
  }
  if (run > 1 && disabled.includes('pink')) {
    return { pink: [{ at: 0, text: OPTIONS.pink.text }], purple: slowRetype(OPTIONS.purple.text, '', OPTIONS.pink.text, 250, { rm, tick: TICK }), typing: 'purple', warmFrom: 0 };
  }
  return { pink: [{ at: 0, text: OPTIONS.pink.text }], purple: slowRetype(OPTIONS.purple.text, "It's late. ", 'Stay.', 250, { rm }), typing: 'purple', warmFrom: 0 };
}
