// 1920x1080 shots of each romance scene (Nanda centre + a line) via romance-preview.html, quantised to 256 colours.
// usage: node shots.mjs <base url> <out dir> [id ...]      (then: python3 quant.py <out dir>)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const [base, out, ...only] = process.argv.slice(2);
const LINES = {
  'street-day': 'NANDA: Walk me home? The long way. I want every minute ♡',
  'street-dusk': 'NANDA: The sky is pink because of us. Say it is because of us.',
  'shop-street': 'NANDA: Carrots, eggs, and you. My whole list ♡',
  'rail-crossing': 'NANDA: If the gate comes down, we stay here. Together. Forever.',
  'crossing-day': 'NANDA: So many people. But I only see you ♡',
  'crossing-night': 'NANDA: Look, the screen says it too. ずっと一緒 ♡',
};
const ids = only.length ? only : Object.keys(LINES);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
for (const id of ids) {
  const u = `${base}/romance-preview.html?bg=${id}&still&line=${encodeURIComponent(LINES[id])}`;
  await p.goto(u, { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${out}/${id}.png` });
  await p.goto(u.replace('&line', '&bare&line'), { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/${id}-bare.png` });
  console.log('shot', id);
}
if (errs.length) console.log('ERRORS', errs);
await b.close();
