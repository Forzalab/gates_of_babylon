// Figur collapse mockup shots + checks. Needs a server (npx vite preview --port 4317) and the pre-installed Chromium.
//   node research/figur-collapse/shots.mjs [http://localhost:4317]
// Writes research/figur-collapse/<WxH>/<normal|rm>-<frame>.png and prints PASS/FAIL per check.
// Frames are stepped on Playwright's fake clock, so every shot is exactly one held frame.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const BASE = process.argv[2] ?? 'http://localhost:4317';
const OUT = path.dirname(fileURLToPath(import.meta.url));
const VIEWPORTS = [[1920, 1080], [1024, 768]];
const T0 = new Date('2026-09-29T12:00:00Z');
const results = [];
const check = (name, ok, extra = '') => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ` (${extra})` : ''}`); };

const browser = await chromium.launch({ args: ['--no-sandbox'] });
// The coach tour counts as seen, so Logic shows its normal resting page (as on the demo machine).
const ctxFor = async (w, h, rm) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: rm ? 'reduce' : 'no-preference' });
  await ctx.addInitScript(() => { try { localStorage.setItem('gob.tour', 'done'); localStorage.setItem('gob.paletteHint', '1'); } catch { /* */ } });
  return ctx;
};

async function logicPage(ctx, query = '') {
  const page = await ctx.newPage();
  await page.clock.install({ time: T0 });
  await page.goto(`${BASE}/${query}`);
  await page.waitForSelector('h1.wordmark');
  await page.evaluate(() => document.fonts.ready);
  await page.clock.pauseAt(new Date(T0.getTime() + 30000)); // freeze time; first-paint timers (coach, toasts) run up to here
  return page;
}
const frameOf = (page) => page.evaluate(() => document.documentElement.dataset.frame ?? '-');

for (const [w, h] of VIEWPORTS) {
  const dir = path.join(OUT, `${w}x${h}`);
  fs.mkdirSync(dir, { recursive: true });
  for (const rm of [false, true]) {
    const ctx = await ctxFor(w, h, rm);
    const page = await logicPage(ctx);
    const tag = rm ? 'rm' : 'normal';
    const shot = (f) => page.screenshot({ path: path.join(dir, `${tag}-${f}.png`) });
    await shot('f0-logic');
    await page.click('h1.wordmark', { position: { x: 60, y: 60 } });
    await page.clock.runFor(1);
    const seen = [];
    for (const f of ['f1-tilt', 'f2-slip', 'f3-fall', 'f4-glitch', 'f5-void']) {
      const fr = await frameOf(page);
      seen.push(fr);
      if (fr === 'f1') {
        const tr = await page.evaluate(() => getComputedStyle(document.querySelector('.canvas')).transitionDuration + '|' + getComputedStyle(document.querySelector('.canvas')).animationName);
        check(`${w}x${h} ${tag}: transitions + animations off during the collapse`, tr === '0s|none', tr);
      }
      if (fr === 'f5') {
        const leaks = await page.evaluate(() => [...document.querySelectorAll('.cx-tile *')].filter((e) => e.getClientRects().length).length);
        check(`${w}x${h} ${tag}: the void is empty, the wordmark fell with the rest`, leaks === 0, `${leaks} visible`);
      }
      await shot(f);
      await page.clock.runFor(500);
    }
    check(`${w}x${h} ${tag}: frames in order`, seen.join() === 'f1,f2,f3,f4,f5', seen.join());
    await Promise.all([page.waitForURL(/date-beta\.html/), page.clock.runFor(500)]);
    check(`${w}x${h} ${tag}: hard cut into date-beta after the 1 s void`, page.url().endsWith('/date-beta.html'), page.url());
    // Date lands on scene 1 as if START was pressed: no splash, no title screen, no click needed.
    await page.waitForFunction(() => document.documentElement.dataset.beat);
    await page.waitForTimeout(900); // the rooftop's own 700 ms enter fade (a hard cut under reduced motion)
    await shot('f6-date-rooftop');
    const beat = await page.evaluate(() => document.documentElement.dataset.beat);
    const fake = await page.locator('.splash, .start').count();
    check(`${w}x${h} ${tag}: Date starts at scene 1 (rooftop), no fake-site splash`, beat === 'rooftop:0' && fake === 0, `${beat}, splash ${fake}`);
    const back = await page.getAttribute('.chrome a', 'href');
    check(`${w}x${h} ${tag}: ◂ LOGIC way back is visible`, back === '/' && await page.isVisible('.chrome a'), back);
    await ctx.close();
  }
}

// Behaviour checks (1920x1080).
{
  const ctx = await ctxFor(1920, 1080, false);
  let page = await logicPage(ctx);
  const before = await page.screenshot();
  await page.hover('h1.wordmark', { position: { x: 60, y: 60 } });
  const hovered = await page.screenshot();
  check('hover changes nothing on screen', before.equals(hovered));
  check('cursor is pointer on the wordmark', (await page.evaluate(() => getComputedStyle(document.querySelector('.wordmark')).cursor)) === 'pointer');
  // The g hangs into the canvas: a click just under the row rule must stay on the canvas.
  const under = await page.evaluate(() => {
    const g = document.querySelector('.wordmark .wg').getBoundingClientRect();
    const rule = document.querySelector('.canvas').getBoundingClientRect().top;
    const el = document.elementFromPoint(g.left + g.width / 2, rule + 6);
    return el.closest('.wordmark') ? 'wordmark' : el.closest('.canvas') ? 'canvas' : el.className;
  });
  check('a click on the canvas under the g does not hit the wordmark', under === 'canvas', under);
  await page.mouse.click(5, 5); await page.clock.runFor(600);
  check('nothing else starts it (a click elsewhere)', (await frameOf(page)) === '-');
  await page.focus('h1.wordmark'); await page.keyboard.press('Enter'); await page.clock.runFor(1);
  check('Enter on the focused wordmark starts it', (await frameOf(page)) === 'f1');
  await page.clock.runFor(1000);
  await Promise.all([page.waitForURL(/date-beta/), page.keyboard.press('Escape')]);
  check('Esc during the collapse goes straight to Date', page.url().endsWith('/date-beta.html'), page.url());
  await page.close();
  page = await logicPage(ctx);
  await page.focus('h1.wordmark'); await page.keyboard.press(' '); await page.clock.runFor(1);
  check('Space on the focused wordmark starts it', (await frameOf(page)) === 'f1');
  await page.close();
  page = await logicPage(ctx);
  await page.dblclick('.canvas', { position: { x: 400, y: 300 } }); await page.clock.runFor(600);
  check('double-click on the canvas does not open Date', (await frameOf(page)) === '-' && !page.url().includes('date'));
  await ctx.close();
}

await browser.close();
const fails = results.filter((r) => !r).length;
console.log(`${results.length - fails}/${results.length} checks passed`);
process.exit(fails ? 1 : 0);
