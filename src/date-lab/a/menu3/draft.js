// menu-h4-r3 "The Draft Folder" (pure, node-tested): the phone's beats, the pour, what the thread shows after a pick.
import { wordEdit } from './chunks.js';
import { ddlcScript } from './script3.js';

export const SHOW = 3000; // the drafts panel replaces MC's composer
export const HOLD = 3400; // the auto-send timer starts
// Cold open: MC's own unsent reply in the composer; her edit, in chunk swaps (<= 2/s), done before the drafts open.
export const MC_FROM = "It's late. I should go home.";
export const MC_KEEP = "It's late. I should ";
export const composer = (rm = false) => wordEdit(MC_FROM, MC_KEEP, 'stay.', 750, { rm });

// The send bar pours into the pink draft: 0..1. RM: whole-second steps (5 held blocks).
export const pourAt = (k, rm = false) => (rm ? Math.floor(Math.min(1, k) * 5) / 5 : Math.min(1, Math.max(0, k)));

// The drafts for a run: the replay edits reuse menu-3-r3's (pink disabled -> she retypes purple into pink; purple disabled -> ♡).
export function draftScript(run, disabled, rm) {
  if (run === 1) return { pink: [{ at: 0, text: 'Just one cup.', sel: 0 }], purple: [{ at: 0, text: "It's late. Goodnight.", sel: 0 }] };
  const s = ddlcScript(run, disabled, rm);
  return { pink: s.pink, purple: s.purple };
}

// After a pick: the bubble MC "sent", its status line over time, and whether her pin goes into the screen.
//  pink / timeout / forced: "Delivered ♡" -> "Read 12:00" (1 s later). purple: "Not delivered" at 500 ms, pin at 1000 ms.
export function sentAt(kind, t) {
  if (!kind) return null;
  if (kind === 'purple') return { text: "It's late. Goodnight.", tone: 'purple', status: t >= 500 ? 'fail' : 'sending', pin: t >= 1000 };
  const text = 'Just one cup.';
  return { text, tone: 'pink', status: t >= 1000 ? 'read' : 'delivered', pin: false };
}
export const STATUS = { sending: 'Sending…', fail: '! Not delivered', delivered: 'Delivered ♡', read: 'Read 12:00' };
