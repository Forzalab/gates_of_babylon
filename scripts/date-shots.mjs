// Screenshots of the Date gate variants (Builder Y). Needs a server: DATE_URL (default http://localhost:5472).
// node scripts/date-shots.mjs [outDir] [filter]
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const BASE = process.env.DATE_URL || 'http://localhost:5472';
const OUT = process.argv[2] || 'research/y/shots';
const ONLY = process.argv[3] || '';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let errs = 0;
const CLEAN = process.env.CLEAN === '1';
for (const reduce of [false, true]) for (const [w, h] of [[1440, 810], [1024, 768]]) for (const v of ['y1', 'y2', 'y3']) {
  if (reduce && w === 1024) continue;
  const name = `${OUT}/${v}-${w}${reduce ? '-still' : ''}${CLEAN ? '-clean' : ''}.png`;
  if (ONLY && !name.includes(ONLY)) continue;
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: reduce ? 'reduce' : 'no-preference' });
  p.on('pageerror', (e) => { errs++; console.log('PAGE ERROR', v, e.message); });
  await p.goto(`${BASE}/date.html?v=${v}${CLEAN ? '&clean=1' : ''}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(reduce ? 300 : 8000);
  await p.screenshot({ path: name });
  console.log(name, 'fonts:', await p.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family).join(',')));
  await p.close();
}
await b.close();
console.log('page errors', errs);
