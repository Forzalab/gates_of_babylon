// node research/sprint-0930/alt-test/fixes/verify-pr27-items.mjs  (vite preview on 5496; writes chip-hidden / chip-shown / blackout-trim .png)
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright/index.js');
const OUT = new URL('./', import.meta.url).pathname;
const BASE = 'http://localhost:5496/date-beta.html';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium/chrome-linux/chrome', args: ['--no-sandbox'] }).catch(() => chromium.launch({ args: ['--no-sandbox'] }));
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });

const chips = async () => page.$$eval('.db-chip', (els) => els.map((e) => e.textContent.trim()));
async function shot(url, name, wait = 1500) {
  await page.goto(url);
  await page.waitForTimeout(wait);
  const c = await chips();
  await page.screenshot({ path: `${OUT}${name}.png` });
  console.log(name, JSON.stringify(c));
  return c;
}
const hid = await shot(`${BASE}?scene=v2-park&beat=4`, 'chip-hidden');
const shown = await shot(`${BASE}?scene=rooftop&beat=2`, 'chip-shown');
if (!hid.every((t) => t.includes('??'))) throw new Error('hidden chip beat shows a number: ' + hid);
if (shown.some((t) => t.includes('??')) || !shown.length) throw new Error('shown chip beat wrong: ' + shown);

// blackout: frames along the trimmed timeline, then a contact sheet
await page.goto(`${BASE}?scene=blackout`);
const t0 = Date.now();
const marks = [200, 900, 1900, 3000, 3700, 4500, 5300, 6100, 6800, 7200];
const frames = [];
for (const m of marks) {
  await page.waitForTimeout(Math.max(0, m - (Date.now() - t0)));
  const phase = await page.$eval('.blackout', (e) => e.className).catch(() => 'gone');
  frames.push({ t: Date.now() - t0, phase, png: (await page.screenshot({ scale: 'css', clip: { x: 0, y: 0, width: 1920, height: 1080 } })).toString('base64') });
}
console.log(frames.map((f) => `${f.t}ms ${f.phase}`).join('\n'));
const sheet = await ctx.newPage();
await sheet.setViewportSize({ width: 1920, height: 1080 });
await sheet.setContent(`<body style="margin:0;background:#111;color:#fff;font:20px monospace;display:grid;grid-template-columns:repeat(5,1fr);gap:6px;padding:6px">${frames.map((f) => `<figure style="margin:0"><img style="width:100%;display:block" src="data:image/png;base64,${f.png}"><figcaption>${f.t} ms ${f.phase.replace('art blackout ', '')}</figcaption></figure>`).join('')}</body>`);
await sheet.waitForTimeout(500);
await sheet.screenshot({ path: `${OUT}blackout-trim.png` });
console.log('errors:', JSON.stringify(errs));
await browser.close();
