// Restore shooter: one 1920x1080 frame per restored scene (?scene=&beat=), then side-by-sides (sbs.py).
// Usage: npx vite --port 5195 & node research/sprint-0930/restore/shoot.mjs
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const OUT = new URL('./shots/', import.meta.url).pathname;
export const SHOTS = [
  ['park', 'v2-park', 0], ['shop-street', 'v2-shop', 0], ['rail-crossing', 'v2-library', 0], ['crossing-night', 'v2-rain', 0],
  ['street-day', 'v2-street', 0], ['street-dusk', 'v2-street', 4], ['rooftop', 'rooftop', 2], ['apartment', 'apartment', 0],
  ['sitting-room', 'cup', 1], ['cup-stamp', 'cup', 0], ['bedroom', 'steeped', 0], ['cellar', 'escape', 0], ['cellar-jars', 'escape', 1],
  ['genkan-v2', 'v2-home', 1],
];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
for (const [name, scene, beat] of SHOTS) {
  await page.goto(`http://localhost:5195/date-beta.html?seed=1&scene=${scene}&beat=${beat}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.beat, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3200); // establish / match / stamp moves settle
  const info = await page.evaluate(() => ({ beat: document.documentElement.dataset.beat, art: [...document.querySelectorAll('.scene [aria-label]')].map((e) => e.getAttribute('aria-label')).slice(0, 3) }));
  await page.screenshot({ path: `${OUT}${name}.png` });
  console.log(name, info.beat, '|', info.art.join(' / '));
}
console.log('errors:', errs.length ? errs : 'none');
await browser.close();
