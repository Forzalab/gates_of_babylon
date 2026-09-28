// The DOOR choice as a pure state machine (node --test drives it). Script v5 3.1 + DEMO PATH v1 + TONY EDITS 2:
//   5 s timer, no pick = her side (pink). Replay: the option you picked last time is disabled, the timer still runs,
//   so only the other option is left. A click needs the 500 ms hold (HARD RULES) before it counts.
export const PINK = '#FF5FA2', PURPLE = '#8A5CF6', HER = '#F0243F';

export const DOOR = Object.freeze({
  id: 'door',
  prompt: 'NANDA: Come in? Just for tea.',
  timeout: 5000,
  hold: 500,
  defaultId: 'pink',
  options: Object.freeze([
    Object.freeze({ id: 'pink', label: 'Just one cup.', key: '1', cue: 'pink', color: PINK }),
    Object.freeze({ id: 'purple', label: "It's late. Goodnight.", key: '2', cue: 'purple', color: PURPLE }),
  ]),
});

export function openMenu(menu = DOOR, { disabled = [] } = {}) {
  return { menu, t: 0, disabled: [...disabled], picked: null, via: null, done: false };
}

export const enabled = (s) => s.menu.options.filter((o) => !s.disabled.includes(o.id));
export const isDisabled = (s, id) => s.disabled.includes(id);
// What the timeout will pick: her default, unless that one is disabled; then whatever is left.
export function fallback(s) {
  const left = enabled(s);
  return (left.find((o) => o.id === s.menu.defaultId) ?? left[0])?.id ?? null;
}
const settle = (s, id, via, t) => ({ ...s, t, picked: id, via, done: true });

export function tick(s, dt) {
  if (s.done) return s;
  const t = s.t + dt;
  return t >= s.menu.timeout ? settle(s, fallback(s), 'timeout', s.menu.timeout) : { ...s, t };
}

export function choose(s, id) {
  if (s.done || s.t < s.menu.hold) return s;
  if (!s.menu.options.some((o) => o.id === id) || isDisabled(s, id)) return s;
  return settle(s, id, 'click', s.t);
}

// 1 -> 0 over the timer. The bar drains toward her side (pink) in menu-4.
export const remaining = (s) => Math.max(0, 1 - s.t / s.menu.timeout);
// Whole seconds left (reduced motion shows the timer as 5 blocks that drop out one per second).
export const secondsLeft = (s) => Math.ceil((s.menu.timeout - s.t) / 1000 - 1e-9);

// After a pick: the same menu again with that option disabled (the timer still runs).
export const replay = (s) => openMenu(s.menu, { disabled: s.picked ? [s.picked] : [] });

export const optionById = (s, id) => s.menu.options.find((o) => o.id === id) ?? null;
