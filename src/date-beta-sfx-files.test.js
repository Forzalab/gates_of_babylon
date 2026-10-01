// Every sfx cue the game uses (scenes + packs + collapse) resolves to a synthesized file that exists on disk.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import manifest from './date-beta/assets.json' with { type: 'json' };

const used = new Set();
const scan = (f) => { for (const m of readFileSync(f, 'utf8').matchAll(/"sfx"\s*:\s*"([^"]+)"/g)) used.add(m[1]); };
const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = `${d}/${e.name}`; if (e.isDirectory()) walk(p); else if (p.endsWith('.json')) scan(p); } };
walk('src/date-beta');
for (const c of Object.keys(manifest.cues)) if (c.startsWith('collapse-')) used.add(c);

test('every used sfx cue has a file', () => {
  assert.ok(used.size >= 10);
  for (const cue of used) {
    const id = cue in manifest.cues ? manifest.cues[cue] : cue;
    if (id === null) continue; // silence
    const a = manifest.assets[id];
    assert.ok(a?.path, `${cue} -> ${id} has no path`);
    assert.ok(existsSync(`public/${a.path}`), `${cue}: public/${a.path} missing`);
  }
});

test('every sfx asset path exists', () => {
  for (const [id, a] of Object.entries(manifest.assets)) if (a.kind === 'sfx') assert.ok(existsSync(`public/${a.path}`), id);
});
