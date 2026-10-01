// near.mjs: near-lens umbrella shots, v2-rain 1-4 (+ HUD ribbon contrast). node research/sprint-0930/rain-fx/near.mjs [base]  (vite preview on 5215)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = pkg;
const BASE = process.argv[2] || 'http://localhost:5215';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
for (const [beat, extra] of [[1, ''], [2, ''], [3, ''], [4, ''], [2, '&still']]) {
  const page = await (await b.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
  await page.goto(`${BASE}/date-beta.html?scene=v2-rain&beat=${beat}&seed=7${extra}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => ({ near: !!document.querySelector('.rn-near'), frames: document.querySelector('.rn-overlay')?.dataset.frames,
    hud: (() => { const h = document.querySelector('.hud-a'); if (!h) return null; const s = getComputedStyle(h); return [s.backgroundColor, s.color, s.zIndex]; })() }));
  console.log(beat, extra, JSON.stringify(info));
  await page.screenshot({ path: path.join(OUT, `near-${beat}${extra ? '-rm' : ''}.png`) });
}
await b.close();
