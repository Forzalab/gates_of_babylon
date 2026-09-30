// packs/index.js: merge content packs into the base scenes.json data (raw JSON in, raw JSON out; loadScenes validates after).
// pack = { scenes?: [scene], insert?: [{ after, ids: [sceneId] }], patch?: [{ scene, beat, set: {beatFields} }], flags?: {flag:[values]} }
// Order: add scenes (appended), insert (move named scenes to sit right after `after`), patch (shallow-merge fields into a beat).
const fail = (m) => { throw new Error(`date-beta packs: ${m}`); };

export function applyPacks(base, packs = []) {
  const data = structuredClone(base);
  for (const [n, pack] of packs.entries()) {
    const at = `pack[${pack?.name ?? n}]`;
    if (!pack || typeof pack !== 'object') fail(`${at}: must be an object`);
    for (const k of Object.keys(pack)) if (!['name', 'note', 'scenes', 'insert', 'patch', 'flags'].includes(k)) fail(`${at}: unknown key "${k}"`);
    for (const s of pack.scenes ?? []) {
      if (data.scenes.some((x) => x.id === s.id)) fail(`${at}: scene "${s.id}" already exists`);
      data.scenes.push(structuredClone(s));
    }
    for (const [f, vals] of Object.entries(pack.flags ?? {})) data.flags = { ...data.flags, [f]: vals };
    for (const ins of pack.insert ?? []) {
      let anchor = ins.after;
      if (!data.scenes.some((s) => s.id === anchor)) fail(`${at}: insert: unknown anchor "${anchor}"`);
      for (const id of ins.ids ?? []) {
        const from = data.scenes.findIndex((s) => s.id === id);
        if (from < 0) fail(`${at}: insert: unknown scene "${id}"`);
        const [sc] = data.scenes.splice(from, 1);
        const to = data.scenes.findIndex((s) => s.id === anchor);
        data.scenes.splice(to + 1, 0, sc);
        anchor = id;
      }
    }
    for (const p of pack.patch ?? []) {
      const sc = data.scenes.find((s) => s.id === p.scene);
      if (!sc) fail(`${at}: patch: unknown scene "${p.scene}"`);
      const beat = sc.beats[p.beat];
      if (!beat) fail(`${at}: patch: ${p.scene} has no beat ${p.beat}`);
      for (const [k, v] of Object.entries(p.set ?? {})) { if (v === null) delete beat[k]; else beat[k] = structuredClone(v); }
    }
  }
  return data;
}
