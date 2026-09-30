// G2/G3 beat shots at 1920x1080 via date-beta.html?scene=&beat= (still = reduced motion).
// usage: node shots.mjs <base url> <out dir> [prefix]   e.g. node shots.mjs http://localhost:5198 ../shots
// (the committed PNGs are quantised to 256 colours afterwards, as the romance / G1 shots are)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const [base, out, pre = ''] = process.argv.slice(2);
const BEATS = [
  ['G2-1-rain-sidewalk', 'v2-rain', 1], ['G2-2-rain-alley', 'v2-rain', 2], ['G2-3-rain-eave', 'v2-rain', 3], ['G2-4-rain-ending', 'v2-rain', 4],
  ['G3-2-street-bluehour', 'v2-street', 2], ['G3-5-her-building', 'v2-street', 5], ['G3-curry5-curry-street', 'v2-curry', 5],
  ['G3-escape6-escape-night', 'escape-win', 6],
];
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
for (const [name, scene, beat] of BEATS) {
  await p.goto(`${base}/date-beta.html?scene=${scene}&beat=${beat}&still&seed=1`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/${pre}${name}.png` });
  console.log('shot', name);
}
if (errs.length) console.log('ERRORS', errs);
await b.close();
