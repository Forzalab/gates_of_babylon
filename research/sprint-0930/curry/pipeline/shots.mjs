// Every CURRY beat in play order at 1920x1080 via date-beta.html?scene=&beat= (still = reduced motion), plus the two chain
// sheets (street -> door -> inside -> table -> dish -> eating -> exit). usage: node shots.mjs <base url> <out dir>
// (the committed PNGs are quantised to 256 colours afterwards: sheet.py)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const [base, out] = process.argv.slice(2);
const n = (s, k) => Array.from({ length: k }, (_, i) => [s, i]);
export const CHAINS = {
  butter: n('v2-curry', 13),
  katsu: [['v2-curry', 0], ['v2-curry', 1], ...n('v2-curry-katsu', 7)],
  alone: [['v2-curry', 0], ['v2-curry', 1], ...n('v2-curry-alone', 3)],
};
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
const done = new Set();
for (const [chain, beats] of Object.entries(CHAINS)) {
  for (const [i, [scene, beat]] of beats.entries()) {
    const name = `${chain}-${String(i).padStart(2, '0')}-${scene}-${beat}`;
    await p.goto(`${base}/date-beta.html?scene=${scene}&beat=${beat}&still&seed=1`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    await p.screenshot({ path: `${out}/${name}.png` });
    done.add(name);
    console.log('shot', name);
  }
}
if (errs.length) console.log('ERRORS', [...new Set(errs)]);
await b.close();
