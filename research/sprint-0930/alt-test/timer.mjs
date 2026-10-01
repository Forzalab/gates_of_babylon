// timer.mjs: let the 12 s timer run out on rooftop:1 (3 choices, default = umeboshi) and door:3, check what it picks.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const BASE = process.argv[2] || 'http://localhost:5493';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const out = [];
for (const [scene, beat] of [['rooftop', 1], ['door', 3], ['leave', 3]]) {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/date-beta.html?scene=${scene}&beat=${beat}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const look = () => page.evaluate(() => ({ beat: document.documentElement.dataset.beat, secs: document.querySelector('.db-timer')?.textContent, def: document.querySelector('.db-choice.is-default .line')?.innerText, line: document.querySelector('.db-say .line')?.innerText, pop: document.querySelector('.lv-pop')?.innerText.replace(/\s+/g, ' ') }));
  const a = await look();
  await page.waitForTimeout(6000);
  const mid = await look();
  await page.waitForTimeout(6800);
  const b = await look();
  out.push({ scene, beat, start: a, at7s: mid, after13s: b });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
