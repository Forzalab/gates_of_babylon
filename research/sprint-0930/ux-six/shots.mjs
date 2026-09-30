// ux-six shots + control checks. Run: npm run build && npx vite preview --port 5497, then node research/sprint-0930/ux-six/shots.mjs
// Writes research/sprint-0930/ux-six/shots/*.png (1920x1080; quantize to 256 colours after with PIL) + checks.json.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const BASE = process.env.BASE ?? 'http://localhost:5497/date-beta.html';
const OUT = new URL('./shots/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const errors = [];
const checks = {};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(q, ms = 1400) {
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`${q}: ${e.message}`));
  await page.goto(`${BASE}?seed=1&${q}`);
  await wait(ms);
  return page;
}
async function shot(page, name) { await page.screenshot({ path: `${OUT}${name}.png` }); }
const beatOf = (page) => page.evaluate(() => document.documentElement.dataset.beat);

// 1 endings: the lock game played for real (win) -> escape-win -> the ESCAPE card, never GAME OVER
{
  const page = await open('scene=escape&beat=15', 1500);
  await shot(page, '1a-lockgame-hud-offstage');
  const kinds = await page.$$eval('.lg-tile', (ts) => ts.map((t) => t.dataset.kind));
  const by = {};
  kinds.forEach((k, i) => (by[k] ??= []).push(i));
  for (const idx of Object.values(by)) for (let j = 0; j < idx.length; j += 2) {
    await page.click(`.lg-tile[data-i="${idx[j]}"]`); await page.click(`.lg-tile[data-i="${idx[j + 1]}"]`); await wait(80);
  }
  await wait(2200);
  checks.lockWinScene = await beatOf(page);
  await shot(page, '1b-escape-win-stamp-pop');
  for (let i = 0; i < 20 && !(await page.$('.hud-end')); i++) { await page.keyboard.press('Space'); await wait(i === 3 ? 1600 : 700); }
  await wait(900);
  checks.lockWinCard = await page.$eval('.hud-end', (e) => e.dataset.card + ' / ' + e.querySelector('h2').textContent).catch(() => 'none');
  await shot(page, '1c-escape-win-ending-card');
  await page.close();
}
{
  const page = await open('scene=steeped');
  checks.steepedFirst = await page.$eval('.db-say .line', (e) => e.textContent).catch(() => 'none');
  await shot(page, '1d-steeped-first-beat');
  await page.close();
}
// 2 choices: ?? legend once, TIME label, one-button choice = NEXT pill, synonym pair reaction
{
  const page = await open('scene=unknown&beat=4');
  checks.legend = await page.$eval('.db-legend', (e) => e.textContent).catch(() => 'none');
  await shot(page, '2a-hidden-legend');
  await page.keyboard.press('2'); await wait(900);
  await shot(page, '2b-synonym-react-offstage');
  await page.close();
}
{
  const page = await open('scene=v2-curry&beat=1');
  checks.timer = await page.$eval('.db-timer', (e) => e.textContent).catch(() => 'none');
  await shot(page, '2c-timer-label');
  await page.close();
}
{
  const page = await open('scene=v2-library&beat=5');
  checks.soloNext = await page.$eval('.hud-next', (e) => e.textContent).catch(() => 'none');
  checks.soloNoChoices = !(await page.$('.db-choices'));
  await shot(page, '2d-solo-next');
  const b0 = await beatOf(page);
  await page.keyboard.press('Space'); await wait(700);
  checks.soloAdvances = `${b0} -> ${await beatOf(page)}`;
  await page.close();
}
// 3 stamps: once (banner only), kitchen stand-up, clock moves on "Minutes gone"
{
  const page = await open('scene=cup');
  checks.cupLine = await page.$eval('.db-say .line', (e) => e.textContent).catch(() => 'none');
  checks.stampCount = await page.$$eval('.db-stamp, .shot-stamp', (es) => es.filter((e) => getComputedStyle(e).display !== 'none').length);
  await shot(page, '3a-stamp-once');
  await page.close();
}
{ const page = await open('scene=unknown'); await shot(page, '3b-kitchen-stand-stamp'); await page.close(); }
{ const page = await open('scene=escape&beat=12', 6500); await shot(page, '3c-minutes-gone-clock'); await page.close(); }
// 4 presence: offscreen speaker, auto beat line
{ const page = await open('scene=unknown&beat=3'); await shot(page, '4a-offscreen-upstairs'); await page.close(); }
{
  const page = await open('scene=escape&beat=7', 200);
  checks.autoLine = await page.$eval('.db-say .line', (e) => e.textContent).catch(() => 'none');
  await shot(page, '4b-auto-clock-running');
  await page.close();
}
// 5 layering: +N pop over a crit FX, stamp clear; contrast of chips / buttons / top controls
{
  const page = await open('scene=v2-curry&beat=1&pick=1&gacha=crit10', 900);
  await shot(page, '5a-pop-over-fx');
  await page.close();
}
{
  const page = await open('scene=rooftop&beat=3', 1500);
  checks.chrome = await page.$$eval('.chrome > *', (es) => es.map((e) => `${e.textContent.trim()}:${getComputedStyle(e).fontSize}/${e.getBoundingClientRect().height}px`));
  await shot(page, '5b-pink-buttons-controls');
  await page.close();
}
// 6 controls: skip, pause (P), mute (M)
{
  const page = await open('scene=v2-park', 1200);
  const b0 = await beatOf(page);
  await page.click('.chrome button[title^="Skip"]'); await wait(700);
  checks.skipButton = `${b0} -> ${await beatOf(page)}`;
  await page.keyboard.press('s'); await wait(700);
  checks.skipKey = await beatOf(page);
  await page.keyboard.press('p'); await wait(300);
  checks.pauseOn = !!(await page.$('.db-paused'));
  await shot(page, '6a-paused');
  const b1 = await beatOf(page);
  await page.keyboard.press('Space'); await wait(700);
  checks.pauseBlocksNext = (await beatOf(page)) === b1;
  await page.keyboard.press('p'); await wait(300);
  checks.pauseOff = !(await page.$('.db-paused'));
  const m0 = await page.$eval('.chrome button[title^="Voice"]', (e) => e.getAttribute('aria-pressed'));
  await page.keyboard.press('m'); await wait(200);
  const m1 = await page.$eval('.chrome button[title^="Voice"]', (e) => e.getAttribute('aria-pressed'));
  await page.keyboard.press('m'); await wait(200);
  const m2 = await page.$eval('.chrome button[title^="Voice"]', (e) => e.getAttribute('aria-pressed'));
  checks.mute = `${m0} -> ${m1} -> ${m2}`;
  await page.close();
}
checks.errors = errors;
fs.writeFileSync(`${OUT}checks.json`, JSON.stringify(checks, null, 2));
console.log(JSON.stringify(checks, null, 2));
await browser.close();
