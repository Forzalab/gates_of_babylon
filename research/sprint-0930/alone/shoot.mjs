// M3 not-hungry path: v2-curry 1 (the pick) -> "not hungry" -> v2-curry-alone 0..3 -> v2-train 0.
// node shoot.mjs before|after [port]   (?fx=full, 1920x1080, UI on)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const SET = process.argv[2] || 'after';
const PORT = process.argv[3] || '5234';
const OUT = new URL(`./${SET}/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
const LOOK = () => {
  const d = document.documentElement.dataset, q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  return { beat: d.beat ?? null, who: q('.db-say .who')?.textContent ?? '', line: q('.db-say .line')?.innerText ?? '', ch: qa('.db-choice').map((c) => c.querySelector('.line')?.innerText ?? c.innerText), card: q('.hud-card')?.innerText?.replace(/\s+/g, ' ') ?? null };
};
await page.goto(`http://localhost:${PORT}/date-beta.html?seed=1&fx=full&scene=v2-curry&beat=1`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.dataset.beat, null, { timeout: 15000 });
let n = 1; const log = [];
const shot = async (tag) => {
  await page.waitForTimeout(1400);
  const s = await page.evaluate(LOOK);
  const nm = `${String(n++).padStart(2, '0')}-${(s.beat || 'x').replace(':', '-')}${tag ? '-' + tag : ''}.png`;
  await page.screenshot({ path: OUT + nm });
  log.push({ nm, beat: s.beat, who: s.who, line: s.line, choices: s.ch });
  return s;
};
let s = await shot('choice');
const idx = s.ch.findIndex((t) => /hungry/i.test(t));
await page.locator('.db-choice').nth(idx).click();
await page.waitForTimeout(600);
s = await page.evaluate(LOOK);
if (!/v2-curry-alone/.test(s.beat || '')) await shot('react');
for (let k = 0; k < 12; k++) {
  s = await page.evaluate(LOOK);
  if (/v2-curry-alone/.test(s.beat || '') && !log.some((l) => l.beat === s.beat)) s = await shot(s.ch.length ? 'choice' : '');
  if (/v2-train/.test(s.beat || '')) { await shot(''); break; }
  if (s.ch.length) { await page.locator('.db-choice').first().click().catch(() => {}); await page.waitForTimeout(700); continue; }
  const nb = page.locator('.hud-next').first();
  if (await nb.count()) await nb.click({ timeout: 2000 }).catch(() => {}); else await page.mouse.click(960, 380);
  await page.waitForTimeout(700);
}
fs.writeFileSync(OUT + 'log.json', JSON.stringify({ log, errs }, null, 1));
console.log(JSON.stringify(log.map((l) => [l.nm, l.who, l.line, l.choices])), errs);
await browser.close();
