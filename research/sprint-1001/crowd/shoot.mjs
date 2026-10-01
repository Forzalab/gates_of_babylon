// Sprint 1001 crowd-eyes dogfood: shoot every CROWD beat (leave-fu 2-3, leave-yeah 2-3) at 1920x1080 + 390 wide,
// plus the beats around them (the layer must NOT show there) and the leave choice beat played through to the branch.
// node shoot.mjs <round> [port]  ->  shots/<round>-*.png
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const ROUND = process.argv[2] || 'r1';
const PORT = process.argv[3] || '5622';
const BASE = `http://localhost:${PORT}/date-beta.html`;
const OUT = new URL('./shots/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const exe = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium-')).map((d) => `/opt/pw-browsers/${d}/chrome-linux/chrome`).find((p) => fs.existsSync(p));
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
const errs = [];
const look = (page) => page.evaluate(() => {
  const q = (s) => document.querySelector(s);
  const box = (s) => { const r = q(s)?.getBoundingClientRect(); return r ? [r.left, r.top, r.right, r.bottom].map(Math.round) : null; };
  return { beat: document.documentElement.dataset.beat ?? null, who: q('.db-say .who')?.textContent ?? '', line: q('.db-say .line')?.innerText ?? '',
    crowd: !!q('.cw-crowd'), n: document.querySelectorAll('.cw-crowd [data-band]').length,
    bands: [...new Set([...document.querySelectorAll('.cw-crowd [data-band]')].map((e) => e.dataset.band))],
    say: box('.db-say'), tag: box('.db-say .who'), ch: box('.db-choices') };
});
async function at(scene, beat, w = 1920, h = 1080, tag = '') {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(`${BASE}?scene=${scene}&beat=${beat}&seed=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  const s = await look(page);
  const nm = `${ROUND}-${scene}-${beat}${tag ? '-' + tag : ''}.png`;
  await page.screenshot({ path: OUT + nm });
  console.log(nm, JSON.stringify(s));
  await page.close();
  return s;
}
for (const sc of ['leave-fu', 'leave-yeah']) for (const b of [0, 1, 2, 3, 4]) await at(sc, b);
await at('leave-fu', 2, 390, 844, 'mobile');
await at('leave-yeah', 3, 390, 844, 'mobile');
// reduced motion: same frame, no animation
{
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(`${BASE}?scene=leave-fu&beat=3&seed=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const anim = await page.evaluate(() => [...document.querySelectorAll('.cw-crowd *')].filter((e) => getComputedStyle(e).animationName !== 'none').length);
  console.log('reduced-motion animated nodes:', anim);
  await page.screenshot({ path: `${OUT}${ROUND}-leave-fu-3-rm.png` });
  await ctx.close();
}
// play-through: leave 3 (the forever choice) -> pick FU -> click to the crowd beat
{
  const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(`${BASE}?scene=leave&beat=3&seed=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}${ROUND}-play-leave-3-choice.png` });
  await page.locator('.db-choice').nth(1).click();
  for (let i = 0; i < 40; i++) {
    const s = await look(page);
    if (s.who === 'CROWD') { await page.waitForTimeout(1500); console.log('played to', JSON.stringify(await look(page))); await page.screenshot({ path: `${OUT}${ROUND}-play-fu-crowd.png` }); break; }
    const nb = page.locator('.hud-next').first();
    if (await nb.count() && await nb.isVisible()) await nb.click().catch(() => {}); else await page.mouse.click(960, 380);
    await page.waitForTimeout(700);
  }
}
console.log('page errors:', errs.length ? errs : 'none');
await browser.close();
