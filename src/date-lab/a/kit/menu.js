// The DOOR choice as a pure state machine, shared by every builder-A menu variant (menu-1 tarot, menu-2 truth table, menu-3 DDLC).
// Rules (script v5 + TONY EDITS 2):
//   - 5 s timer. No pick = HER side: the default is PINK on timeout (silence = consent = the theme).
//   - Replay: the option you picked last time is DISABLED for you, but the timer still runs.
//   - Her default is never disabled for HER: if you picked pink last run and let the timer lapse, she still picks pink (forced).
//   - Purple picks bleed purple into the frame for one 334 ms step (a hold, not a flicker).
export const DUR = 5000;
export const BLEED = 334;
export const OPTIONS = Object.freeze({
  pink: Object.freeze({ id: 'pink', text: 'Just one cup.', key: '1', colour: '#FF5FA2', sfx: 'pink' }),
  purple: Object.freeze({ id: 'purple', text: "It's late. Goodnight.", key: '2', colour: '#8A5CF6', sfx: 'purple' }),
});
export const ORDER = ['pink', 'purple'];
export const DEFAULT = 'pink';

export function createMenu({ dur = DUR, disabled = [], run = 1, history = [] } = {}) {
  return Object.freeze({ phase: 'open', t: 0, dur, picked: null, how: null, forced: false, disabled: Object.freeze([...disabled]), run, history: Object.freeze([...history]) });
}

export const isDisabled = (m, opt) => m.disabled.includes(opt);
export const remaining = (m) => Math.max(0, m.dur - m.t);
export const progress = (m) => Math.min(1, m.t / m.dur); // 0 -> 1 as the timer runs out
export const secondsLeft = (m) => Math.ceil(remaining(m) / 1000);

function resolve(m, opt, how) {
  return Object.freeze({ ...m, phase: 'picked', picked: opt, how, forced: how === 'timeout' && isDisabled(m, opt),
    history: Object.freeze([...m.history, opt]) });
}

// Advance the clock by dt ms. Timeout resolves to her default (pink), even when pink is disabled for YOU.
export function tickMenu(m, dt) {
  if (m.phase !== 'open') return m;
  const t = m.t + Math.max(0, dt);
  if (t >= m.dur) return resolve({ ...m, t: m.dur }, DEFAULT, 'timeout');
  return Object.freeze({ ...m, t });
}

// A player pick. Ignored when the menu is closed, the option is unknown, or it is disabled (the illusion: it looks clickable-ish, it isn't).
export function pickMenu(m, opt) {
  if (m.phase !== 'open' || !OPTIONS[opt] || isDisabled(m, opt)) return m;
  return resolve(m, opt, 'click');
}

// Replay (the game rewinds, not the player): the option picked last run is disabled, the timer starts again from full.
export function replayMenu(m) {
  const last = m.picked ?? m.history.at(-1);
  return createMenu({ dur: m.dur, disabled: last ? [last] : [], run: m.run + 1, history: m.history });
}

// Keyboard hotkeys for the presenter: 1 = pink, 2 = purple.
export const optionForKey = (key) => ORDER.find((o) => OPTIONS[o].key === key) ?? null;
