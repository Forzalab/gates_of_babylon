// packs/index.js: merge content packs into the base scenes.json data (raw JSON in, raw JSON out; loadScenes validates after).
// pack = { scenes?: [scene], insert?: [{ after, ids: [sceneId] }], patch?: [{ scene, beat, set: {beatFields} }], flags?: {flag:[values]} }
// gacha: the gacha rules object (gacha.js / research/sprint-0930/emotion-fx/SCHEMA.md), copied to the root `gacha`; a later pack replaces it.
// notes: ignored. patch with `beats:[...]` inserts those beats before index `beat` (no `set`). drop: [sceneId] removes scenes last.
// patch with `props: {...}` shallow-merges into that beat's props. patch with `choice: i` (and `set`) merges into choices[i] of that beat (e.g. a love value).
// Order: add scenes (appended), insert (move named scenes to sit right after `after`), patch (shallow-merge fields into a beat).
const fail = (m) => { throw new Error(`date-beta packs: ${m}`); };

export function applyPacks(base, packs = []) {
  const data = structuredClone(base);
  for (const [n, pack] of packs.entries()) {
    const at = `pack[${pack?.name ?? n}]`;
    if (!pack || typeof pack !== 'object') fail(`${at}: must be an object`);
    for (const k of Object.keys(pack)) if (!['name', 'note', 'notes', 'scenes', 'insert', 'patch', 'flags', 'drop', 'gacha', 'sceneSet'].includes(k)) fail(`${at}: unknown key "${k}"`);
    for (const s of pack.scenes ?? []) {
      if (data.scenes.some((x) => x.id === s.id)) fail(`${at}: scene "${s.id}" already exists`);
      data.scenes.push(structuredClone(s));
    }
    if (pack.gacha !== undefined) data.gacha = structuredClone(pack.gacha);
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
      if (p.beats) { if (p.beat < 0 || p.beat > sc.beats.length) fail(`${at}: patch: ${p.scene} has no slot ${p.beat}`); sc.beats.splice(p.beat, 0, ...structuredClone(p.beats)); continue; }
      const beat = sc.beats[p.beat];
      if (!beat) fail(`${at}: patch: ${p.scene} has no beat ${p.beat}`);
      if (p.remove) { sc.beats.splice(p.beat, 1); continue; } // remove: true drops that beat (later patches see the new indexes)
      // `choice: i` merges `set` into that one choice of the beat instead of the beat itself.
      let target = beat;
      if (p.choice != null) { target = beat.choices?.[p.choice]; if (!target) fail(`${at}: patch: ${p.scene}[${p.beat}] has no choice ${p.choice}`); }
      for (const [k, v] of Object.entries(p.set ?? {})) { if (v === null) delete target[k]; else target[k] = structuredClone(v); }
      // `props` shallow-merges into the beat's props (keeps the ones it has; a null value is kept, to stop a carry).
      if (p.props) target.props = { ...(target.props ?? {}), ...structuredClone(p.props) };
    }
    // sceneSet: [{ scene, set: {sceneFields} }] shallow-merges scene-level fields (e.g. offstage), null deletes.
    for (const p of pack.sceneSet ?? []) {
      const sc = data.scenes.find((s) => s.id === p.scene);
      if (!sc) fail(`${at}: sceneSet: unknown scene "${p.scene}"`);
      for (const [k, v] of Object.entries(p.set ?? {})) { if (v === null) delete sc[k]; else sc[k] = structuredClone(v); }
    }
    for (const id of pack.drop ?? []) {
      const i = data.scenes.findIndex((s) => s.id === id);
      if (i < 0) fail(`${at}: drop: unknown scene "${id}"`);
      data.scenes.splice(i, 1);
    }
  }
  return data;
}
