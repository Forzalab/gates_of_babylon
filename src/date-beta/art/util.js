// Tiny shared helpers for the hand-authored SVG scenes.
import { useEffect, useState } from 'react';

// Deterministic RNG (mulberry32): blossom clusters, rice grains and QR modules look hand-placed but never move.
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The shared stepped clock: 8 fps grid (125 ms), but a pose must hold >= 500 ms, so callers step every `every` ticks.
export const TICK = 125;
export function useStep(poses, every = 4, on = true) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return undefined;
    const t = setInterval(() => setN((k) => k + 1), TICK * Math.max(4, every));
    return () => clearInterval(t);
  }, [every, on]);
  return n % poses;
}

// Wall clock, re-rendered on each real second boundary.
export function useNow(on = true) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!on) return undefined;
    let t;
    const tick = () => { setNow(new Date()); t = setTimeout(tick, 1000 - (Date.now() % 1000) + 5); };
    t = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    return () => clearTimeout(t);
  }, [on]);
  return now;
}

export const HEART = 'M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z';
// A NAND gate glyph (AND body + bubble), origin at the body's top-left, 64 x 40.
export const NAND_BODY = 'M0 0h22a20 20 0 0 1 0 40H0z';
