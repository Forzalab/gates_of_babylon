// shots.mjs: Playwright screenshots of date.html?v=x1..x3 at 1440x810 and 1024x768 (+ a reduced-motion still).
// usage: node research/x/shots.mjs http://localhost:5471
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const BASE = process.argv[2] || 'http://localhost:5471';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];
for (const v of ['x1', 'x2', 'x3']) {
  for (const [w, h] of [[1440, 810], [1024, 768]]) {
    for (const rm of ['no-preference', 'reduce']) {
      if (rm === 'reduce' && w !== 1440) continue;
      const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: rm });
      page.on('pageerror', (e) => errors.push(`${v} ${w}: ${e.message}`));
      await page.goto(`${BASE}/date.html?v=${v}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(rm === 'reduce' ? 400 : 2600);
      const name = `${v}-${w}${rm === 'reduce' ? '-still' : ''}.png`;
      await page.screenshot({ path: path.join(OUT, name) });
      // overflow check: nothing may scroll horizontally, the modal must fit on screen
      const fit = await page.evaluate(() => {
        const m = document.querySelector('.modal')?.getBoundingClientRect();
        return { sw: document.documentElement.scrollWidth, iw: innerWidth, bottom: m && Math.round(m.bottom), top: m && Math.round(m.top) };
      });
      console.log(name, JSON.stringify(fit));
      await page.close();
    }
  }
}
// buttons: "not 18" -> Logic, ENTER -> stub
const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });
await page.goto(`${BASE}/date.html?v=x1`);
await page.click('.btn.hot');
console.log('enter ->', await page.evaluate(() => location.hash), await page.isVisible('text=COMING SOON (STUB)'));
await page.screenshot({ path: path.join(OUT, 'stub-1440.png') });
await page.goto(`${BASE}/date.html?v=x3`);
await page.click('.btn.soft.narrow');
await page.waitForLoadState();
console.log('not 18 ->', new URL(page.url()).pathname, await page.title());
await browser.close();
console.log(errors.length ? 'PAGE ERRORS:\n' + errors.join('\n') : '0 page errors');
