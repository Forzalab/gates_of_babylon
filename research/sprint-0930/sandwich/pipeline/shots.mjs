// SANDWICH shots: each faraway establishing beat in the real player, 1920x1080. usage: node shots.mjs <base> <out dir> [key ...]
import { mkdirSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';

const SHOTS = {
  'town-0': 'v2-town&beat=0', 'town-1': 'v2-town&beat=1', 'town-2': 'v2-town&beat=2', 'town-3': 'v2-town&beat=3', 'town-4': 'v2-town&beat=4',
  'rooftop-noon': 'rooftop&beat=2', 'station-gate-r3': 'v2-train&beat=1', 'crossing-night': 'v2-rain&beat=0',
  'street-bluehour': 'v2-street&beat=2', 'escape-night': 'escape-win&beat=6', 'curry-street': 'v2-curry-alone&beat=2',
};
const [base, out, ...only] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
for (const [k, q] of Object.entries(SHOTS)) {
  if (only.length && !only.includes(k)) continue;
  await p.goto(`${base}/date-beta.html?seed=2&still&scene=${q}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${out}/${k}.png` }); console.log(k);
}
if (errs.length) console.log('ERRORS', [...new Set(errs)]);
await b.close();
