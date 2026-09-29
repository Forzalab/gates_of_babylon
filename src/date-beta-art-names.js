// Test helper: the art ids = the keys of ART in src/date-beta/art/index.js, parsed from the source (the .jsx art can't
// load under node --test). Keeps the tests' loadScenes(data, { manifest, art }) in step with main.jsx's Object.keys(ART).
import { readFileSync } from 'node:fs';

export const ART_INDEX = readFileSync(new URL('./date-beta/art/index.js', import.meta.url), 'utf8');
export const ART_NAMES = [...ART_INDEX.slice(ART_INDEX.indexOf('export const ART')).matchAll(/'?([\w-]+)'?: [A-Z]\w*/g)].map((m) => m[1]);
