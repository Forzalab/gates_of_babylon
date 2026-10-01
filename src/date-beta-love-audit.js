// Shared by the love audit tests: which choice beats exist in the shipped graph, in play order, and which are consequential.
// Consequential = the options lead to different places (`go` / fall-through differ), or a pick sets a flag that routes
// (read by a choice `if` or a `go` `if`), or the beat ends the run. Text-only flags (`vary`) do not count.
import { FINAL } from './date-beta-final.js';
import { resolveGo, enabled } from './date-beta/engine.js';

const goTargets = (go) => (go == null ? [] : typeof go === 'string' ? [go] : go.map((g) => (typeof g === 'string' ? g : g.to)));
const goFlags = (go) => (Array.isArray(go) ? go.flatMap((g) => (typeof g === 'string' ? [] : Object.keys(g.if ?? {}))) : []);

export function routeFlags(S = FINAL) {
  const out = new Set();
  for (const sc of S) for (const b of sc.beats) for (const c of b.choices ?? []) {
    for (const f of Object.keys(c.if ?? {})) out.add(f);
    for (const f of goFlags(c.go)) out.add(f);
  }
  return out;
}

export const isConsequential = (beat, S = FINAL, flags = routeFlags(S)) => {
  const cs = beat.choices;
  const lands = new Set(cs.map((c) => (c.go == null ? '' : JSON.stringify(c.go))));
  const split = lands.size > 1;
  const routes = cs.some((c) => Object.keys(c.set ?? {}).some((f) => flags.has(f)));
  return split || routes;
};

// Play order = depth-first walk from scene 1 (first option first), each beat once; then any scene the walk never reaches.
export function playOrder(S = FINAL) {
  const idx = new Map(S.map((s, i) => [s.id, i]));
  const seen = new Set(), order = [];
  const visit = (s, b, flags) => {
    for (;;) {
      while (s < S.length && b >= S[s].beats.length) { s += 1; b = 0; }
      if (s >= S.length) return;
      const key = `${s}/${b}/${JSON.stringify(flags)}`;
      if (seen.has(key)) return;
      seen.add(key);
      const beat = S[s].beats[b];
      const id = `${S[s].id}:${b}`;
      if (!order.includes(id)) order.push(id);
      if (beat.set) flags = { ...flags, ...beat.set };
      if (beat.end) return;
      if (!beat.choices) { b += 1; continue; }
      for (const c of beat.choices) {
        if (!enabled(c, flags)) continue;
        const f = c.set ? { ...flags, ...c.set } : flags, go = resolveGo(c.go, f);
        if (go === S[0].id) continue;
        if (go) visit(idx.get(go), 0, f); else visit(s, b + 1, f);
      }
      return;
    }
  };
  visit(0, 0, {});
  for (const sc of S) sc.beats.forEach((_, i) => { const id = `${sc.id}:${i}`; if (!order.includes(id)) order.push(id); });
  return order;
}

// Every beat with 2+ options, in play order: { id, scene, index, beat, consequential, live }.
export function choiceBeats(S = FINAL) {
  const at = (id) => { const [sc, i] = id.split(':'); return S.find((s) => s.id === sc).beats[+i]; };
  const flags = routeFlags(S);
  const order = playOrder(S);
  const live = new Set();
  // "live" = reached by the walk from scene 1 (not one of the old off-path scenes)
  const idx = new Map(S.map((s, i) => [s.id, i]));
  const seen = new Set();
  const walk = (s, b, fl) => {
    for (;;) {
      while (s < S.length && b >= S[s].beats.length) { s += 1; b = 0; }
      if (s >= S.length) return;
      const key = `${s}/${b}/${JSON.stringify(fl)}`;
      if (seen.has(key)) return;
      seen.add(key);
      const beat = S[s].beats[b];
      live.add(`${S[s].id}:${b}`);
      if (beat.set) fl = { ...fl, ...beat.set };
      if (beat.end) return;
      if (!beat.choices) { b += 1; continue; }
      for (const c of beat.choices) {
        if (!enabled(c, fl)) continue;
        const f2 = c.set ? { ...fl, ...c.set } : fl, go = resolveGo(c.go, f2);
        if (go === S[0].id) continue;
        if (go) walk(idx.get(go), 0, f2); else walk(s, b + 1, f2);
      }
      return;
    }
  };
  walk(0, 0, {});
  return order.map((id) => ({ id, beat: at(id) })).filter((x) => x.beat.choices?.length >= 2)
    .map((x) => ({ ...x, consequential: isConsequential(x.beat, S, flags), live: live.has(x.id) }));
}
