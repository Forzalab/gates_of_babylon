// React hooks for builder A: a smooth rAF clock (camera, fades), the stepped 8 fps pose clock, the DOOR menu driver.
import { useCallback, useEffect, useRef, useState } from 'react';
import { createMenu, tickMenu, pickMenu, replayMenu, optionForKey } from './menu.js';
import { POSE } from './time.js';

// ms since start (or since restart()). Smooth: rAF. `paused` freezes it. `?t=<ms>` in the URL seeks (for screenshots).
const seek = (() => { try { const v = new URLSearchParams(location.search).get('t'); return v == null ? null : Number(v); } catch { return null; } })();
export function useClock({ paused = false, loop = null } = {}) {
  const [t, setT] = useState(seek ?? 0);
  const base = useRef(null);
  const acc = useRef(seek ?? 0);
  useEffect(() => {
    if (paused || seek != null) { base.current = null; return undefined; }
    let raf;
    const frame = (now) => {
      if (base.current == null) base.current = now - acc.current;
      let v = now - base.current;
      if (loop && v >= loop) { base.current = now; v = 0; }
      acc.current = v;
      setT(v);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); base.current = null; };
  }, [paused, loop]);
  const restart = useCallback(() => { acc.current = 0; base.current = null; setT(0); }, []);
  return [t, restart];
}

// A pose index that steps every `hold` ms (>= 500) on the 8 fps grid. Off (rm) = pose 0 forever.
export function usePose(n, hold = POSE, on = true) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!on || n < 2) return undefined;
    const h = Math.max(POSE, Math.round(hold / 125) * 125);
    const id = setInterval(() => setI((k) => (k + 1) % n), h);
    return () => clearInterval(id);
  }, [n, hold, on]);
  return i;
}

// The DOOR menu, live: ticks the pure machine, hotkeys 1 / 2 pick, R replays. `onPick(state)` fires once per resolve.
// `hold` = ms the menu waits before the timer starts (so the question can be read first).
export function useDoorMenu({ dur = 5000, hold = 0, replayHold = hold, onPick } = {}) {
  const [m, setM] = useState(() => createMenu({ dur }));
  const [armed, setArmed] = useState(hold === 0);
  const wait = m.run > 1 ? replayHold : hold;
  const cb = useRef(onPick); cb.current = onPick;
  const last = useRef(null);
  useEffect(() => {
    if (armed) return undefined;
    const id = setTimeout(() => setArmed(true), wait);
    return () => clearTimeout(id);
  }, [armed, wait, m.run]);
  useEffect(() => {
    if (m.phase !== 'open' || !armed) return undefined;
    let raf, prev = performance.now();
    const frame = (now) => { const dt = now - prev; prev = now; setM((s) => tickMenu(s, dt)); raf = requestAnimationFrame(frame); };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [m.phase, armed, dur]);
  useEffect(() => {
    if (m.phase === 'picked' && last.current !== m) { last.current = m; cb.current?.(m); }
  }, [m]);
  const pick = useCallback((opt) => setM((s) => pickMenu(s, opt)), []);
  const replay = useCallback(() => setM((s) => (s.phase === 'picked' ? replayMenu(s) : s)), []);
  useEffect(() => { if (m.run > 1) setArmed(replayHold === 0); }, [m.run, replayHold]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      const o = optionForKey(e.key);
      if (o) pick(o);
      else if (e.key === 'r' || e.key === 'R') replay();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [pick, replay]);
  return { m, pick, replay, armed };
}

// Temporarily set document.title (4th-wall beats); restores on unmount.
export function useTitle(title) {
  useEffect(() => {
    if (!title) return undefined;
    const old = document.title;
    document.title = title;
    return () => { document.title = old; };
  }, [title]);
}

// A one-shot "after ms" boolean (for staged reveals). Resets when `key` changes.
export function useAfter(ms, key) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(false);
    const id = setTimeout(() => setOn(true), ms);
    return () => clearTimeout(id);
  }, [ms, key]);
  return on;
}

// A tiny beat sequencer: beats = [{ at: ms, ...anything }] -> the latest beat whose `at` has passed. Restarts when `key` changes.
export function useBeats(beats, key) {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
    if (!beats?.length) return undefined;
    const ids = beats.map((b, k) => (k === 0 ? null : setTimeout(() => setI(k), b.at))).filter(Boolean);
    return () => ids.forEach(clearTimeout);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return beats?.[Math.min(i, (beats?.length ?? 1) - 1)] ?? null;
}
