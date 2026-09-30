// bgshot.mjs: a beat's art alone (no UI, no sprite, no focus blur), for drawing cels over it.
// node bgshot.mjs <port> <outdir> scene:beat[:name] ...
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const [port, out, ...specs] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
const HIDE = '.db-nanda,.db-plant,.db-plane,.db-say,.db-choices,.hud-a,.db-hint,.chrome,.db-stamp,.hud-next,.rn-overlay,.db-wet,.r5-cels{display:none!important}.stage.focus .scene{filter:none!important}.db-focus{opacity:0!important}';
for (const spec of specs) {
  const [scene, beat, name] = spec.split(':');
  await page.goto(`http://localhost:${port}/date-beta.html?scene=${scene}&beat=${beat}&seed=1&bento=umeboshi&still`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: HIDE });
  await page.waitForTimeout(900);
  const f = `${out}/${name || `${scene}-${beat}`}.png`;
  await page.screenshot({ path: f });
  console.log(f);
}
await browser.close();
