// puddle beat shots: v2-rain 2 at 1920x1080 still + live (the stepped clock on) + a phone landscape, via
// date-beta.html?scene=&beat= (still = reduced motion).  usage: node shots.mjs <base url> <out dir> <prefix>
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const [base, out, pre = ''] = process.argv.slice(2);
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const errs = [];
for (const [tag, w, h, q] of [['', 1920, 1080, '&still'], ['-live', 1920, 1080, ''], ['-phone', 844, 390, '&still']]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(`${base}/date-beta.html?scene=v2-rain&beat=2${q}&seed=1`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${out}/${pre}v2-rain-2${tag}.png` });
  await p.close();
}
if (errs.length) console.log('ERRORS', errs);
await b.close();
