// Bare 1920x1080 renders of the R3 rain / her-street art via preview.html (still). usage: node bare.mjs <base> <out dir> [id ...]  -> <out dir>/<id>-bare.png
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const [base, out, ...only] = process.argv.slice(2);
const IDS = ['rain-sidewalk', 'rain-alley', 'rain-eave', 'rain-ending', 'street-bluehour', 'her-building', 'curry-street', 'escape-night'];
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
for (const id of only.length ? only : IDS) {
  await p.goto(`${base}/research/sprint-0930/scenes-r3/pipeline-g23/preview.html?bg=${id}&still`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/${id}-bare.png` });
}
if (errs.length) console.log('ERRORS', errs);
await b.close();
