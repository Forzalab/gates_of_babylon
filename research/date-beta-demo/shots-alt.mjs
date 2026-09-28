// shots-alt.mjs: Playwright screenshots of scenes 6-10 at 1920x1080 (+ reduced motion of scene 6).
// usage: npm run build && npx vite preview --port 5480 &  node research/date-beta-demo/shots-alt.mjs http://localhost:5480
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const BASE = process.argv[2] || 'http://localhost:5480';
const OUT = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];

async function open(scene, { rm = false } = {}) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: rm ? 'reduce' : 'no-preference' });
  page.on('pageerror', (e) => errors.push(`${scene}${rm ? ' rm' : ''}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${scene}: console ${m.text()}`); });
  await page.goto(`${BASE}/date-beta.html?scene=${scene}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1300);
  return page;
}
const shot = async (page, name) => { await page.screenshot({ path: path.join(OUT, `${name}.png`) }); console.log(name); };
const at = (page) => page.evaluate(() => document.documentElement.dataset.beat);
// click, then wait until the beat changes (the hold gate swallows early clicks)
async function click(page, settle = 600) {
  const was = await at(page);
  for (let i = 0; i < 20 && (await at(page)) === was; i++) { await page.mouse.click(960, 400); await page.waitForTimeout(150); }
  await page.waitForTimeout(settle);
}

let p = await open('platform');
await shot(p, 'scene-06-platform');
await click(p, 1800); await shot(p, 'scene-06b-platform-train-gone');
await click(p); await shot(p, 'scene-06c-platform-OR');
await p.close();
p = await open('platform', { rm: true });
await click(p, 100); await shot(p, 'scene-06-rm-platform-hardcut');
await p.close();

p = await open('underpass');
await shot(p, 'scene-07-underpass');
await click(p); await shot(p, 'scene-07b-underpass-line');
await p.close();

p = await open('apartment');
await click(p); await shot(p, 'scene-08-apartment');
await p.close();

p = await open('stairs');
await shot(p, 'scene-09-stairs');
await click(p); await shot(p, 'scene-09b-stairs-just-tea');
await p.close();

p = await open('genkan');
await shot(p, 'scene-10-genkan-wide');
await click(p, 1800); await shot(p, 'scene-10b-genkan-insert-slippers');
await click(p); await shot(p, 'scene-10c-genkan-insert-shrine');
await p.close();

await browser.close();
console.log(errors.length ? `ERRORS:\n${errors.join('\n')}` : 'no page errors');
