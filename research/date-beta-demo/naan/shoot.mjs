// shoot.mjs: the naan platform shots, 1920x1080, with the dialogue box on the MC line (beat 1).
// usage: node research/date-beta-demo/naan/shoot.mjs <base-url> <round> [v1 v2 v3]
//   -> research/date-beta-demo/naan/V{n}-r{round}.png. Also checks the layout rule: the ad and the station sign end
//   above the dialogue box (and its speaker chip), and fail loudly if not.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const [BASE = 'http://localhost:5687', ROUND = '1', ...only] = process.argv.slice(2);
const OUT = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const errors = [];
let bad = 0;
for (const v of only.length ? only : ['v1', 'v2', 'v3']) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', (e) => errors.push(`${v}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${v}: console ${m.text()}`); });
  await page.goto(`${BASE}/date-beta.html?scene=naan&beat=1&platform=${v}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('.db-say');
  await page.waitForTimeout(1200);
  const box = await page.evaluate(() => {
    const r = (el) => { const b = el.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, left: b.left, right: b.right }; };
    const say = document.querySelector('.db-say'), who = document.querySelector('.db-say .who');
    const ad = document.querySelector('.naan-platform [data-ad]'), sign = document.querySelector('.naan-platform .np-sign');
    return { say: r(say), who: who ? r(who) : null, ad: ad ? r(ad) : null, sign: sign ? r(sign) : null };
  });
  const zone = Math.min(box.say.top, box.who?.top ?? 1e9);
  for (const k of ['ad', 'sign']) {
    const b = box[k];
    if (!b) { console.log(`  ${v}: no ${k} found`); bad++; continue; }
    const ok = b.bottom <= zone && b.top >= 0 && b.left >= 0 && b.right <= 1920;
    if (!ok) bad++;
    console.log(`  ${v} ${k}: ${Math.round(b.left)},${Math.round(b.top)} -> ${Math.round(b.right)},${Math.round(b.bottom)}  (box zone from y=${Math.round(zone)}) ${ok ? 'ok' : 'VIOLATION'}`);
  }
  const name = `${v.toUpperCase()}-r${ROUND}`;
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log(name);
  await page.close();
}
await browser.close();
if (errors.length) { console.log('ERRORS:\n' + errors.join('\n')); process.exitCode = 1; }
if (bad) { console.log(`${bad} layout violation(s)`); process.exitCode = 1; }
