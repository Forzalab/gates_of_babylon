// beat.mjs: screenshot single beats by URL jump (iteration helper for the r5-ume fix pass).
// node research/sprint-0930/r5-ume/beat.mjs <port> <outdir> scene:beat[:pick][:name] ...   (pick = 1-based choice -> the react frame)
// extra URL params: env BEAT_Q (e.g. "still"), default adds &bento=umeboshi&seed=1. Waits 1500 ms per shot (stepped beats settle).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const [port, out, ...specs] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
for (const spec of specs) {
  const [scene, beat, pick, name] = spec.split(':');
  const q = `scene=${scene}&beat=${beat}&seed=1&bento=umeboshi${pick ? `&pick=${pick}` : ''}${process.env.BEAT_Q ? '&' + process.env.BEAT_Q : ''}`;
  await page.goto(`http://localhost:${port}/date-beta.html?${q}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(Number(process.env.BEAT_WAIT ?? 1600));
  const f = `${out}/${name || `${scene}-${beat}${pick ? '-p' + pick : ''}`}.png`;
  await page.screenshot({ path: f });
  console.log(f);
}
await browser.close();
