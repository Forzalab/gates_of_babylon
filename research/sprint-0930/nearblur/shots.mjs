// shots.mjs: near-lens foreground shots. node research/sprint-0930/nearblur/shots.mjs <prefix> [base]  (vite preview on 5217)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = pkg;
const PRE = process.argv[2] || 'after', BASE = process.argv[3] || 'http://localhost:5217';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
for (const [scene, beat, extra] of [['v2-train', 2, ''], ['v2-train', 3, ''], ['v2-train', 4, ''], ['v2-train', 5, ''], ['escape', 0, ''], ['escape', 8, ''], ['escape', 12, '&still'],
  ['v2-train', 7, ''], ['rooftop', 0, ''], ['rooftop', 2, ''], ['rooftop', 3, ''], ['v2-home', 0, '']].filter(([s, b]) => !process.argv[4] || process.argv[4].split(',').includes(`${s}-${b}`))) {
  const page = await (await b.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
  await page.goto(`${BASE}/date-beta.html?scene=${scene}&beat=${beat}&seed=7${extra}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  const near = await page.evaluate(() => document.querySelector('.nl-near')?.dataset.near ?? null);
  console.log(scene, beat, extra, near);
  await page.screenshot({ path: path.join(OUT, `${PRE}-${scene}-${beat}${extra ? '-rm' : ''}.png`) });
}
await b.close();
