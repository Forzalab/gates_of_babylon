// shots-genkan-v2.mjs: scene 10 (genkan-in) v2 at 1920x1080: wide, insert (slippers), insert (shrine), RM insert.
// usage: npm run build && npx vite preview --port 5485 &  node research/date-beta-demo/shots-genkan-v2.mjs http://localhost:5485
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const BASE = process.argv[2] || 'http://localhost:5485';
const OUT = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];

async function open(rm = false) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: rm ? 'reduce' : 'no-preference' });
  page.on('pageerror', (e) => errors.push(`${rm ? 'rm ' : ''}${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console ${m.text()}`); });
  await page.goto(`${BASE}/date-beta.html?scene=genkan-in`);
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

let p = await open();
await shot(p, 'scene-10-genkan-v2-wide');
await click(p, 1900); await shot(p, 'scene-10-genkan-v2-insert-slippers');
await click(p); await shot(p, 'scene-10-genkan-v2-insert-shrine');
await p.close();
p = await open(true);
await click(p, 120); await shot(p, 'scene-10-genkan-v2-rm-insert');
await p.close();

await browser.close();
console.log(errors.length ? `ERRORS:\n${errors.join('\n')}` : 'no page errors');
