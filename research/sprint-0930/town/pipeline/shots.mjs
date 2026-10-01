// Shots of every v2-town beat in the real player (date-beta.html), 1920x1080, + OCR crops of the dialogue box.
// usage: node shots.mjs http://localhost:5205 research/sprint-0930/town/shots
import { mkdirSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';

const [base = 'http://localhost:5205', out = 'research/sprint-0930/town/shots'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
for (let i = 0; i < 5; i++) {
  await p.goto(`${base}/date-beta.html?seed=2&still&scene=v2-town&beat=${i}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  const f = `${out}/${String(i).padStart(2, '0')}-beat${i}.png`;
  await p.screenshot({ path: f }); console.log(f);
}
if (errs.length) console.log('ERRORS', [...new Set(errs)]);
await b.close();
