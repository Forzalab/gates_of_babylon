// Replay shot driver: node shoot.mjs <name> "<query>" [choiceIdx|first|last] [maxShots]
// ROOT=<dir> writes to <dir>/<name>/ instead of shots/<name>/ (the M4 fix pass: ROOT=after).
// Opens date-beta.html?<query>, clicks through the scene (stops when the scene id changes / an end card), one PNG per new state.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const [name, query, pol = '0', max = '14'] = process.argv.slice(2);
const PORT = process.env.PORT || 5231;
const OUT = new URL(`./${process.env.ROOT || 'shots'}/${name}/`, import.meta.url).pathname; // ROOT=after for the fix pass
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
const LOOK = () => {
  const d = document.documentElement.dataset, q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  return { beat: d.beat ?? null, who: q('.db-say .who')?.textContent ?? '', line: q('.db-say .line')?.innerText ?? '', ch: qa('.db-choice').map((c) => c.querySelector('.line')?.innerText ?? c.innerText), card: q('.hud-card')?.innerText?.replace(/\s+/g, ' ') ?? null, end: q('.hud-end')?.innerText?.replace(/\s+/g, ' ') ?? null, pop: q('.lv-pop')?.innerText?.replace(/\s+/g, ' ') ?? null };
};
await page.goto(`http://localhost:${PORT}/date-beta.html?${query}`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.dataset.beat || document.querySelector('.hud-card'), null, { timeout: 15000 });
const log = []; let prev = '', n = 1, still = Date.now(), startScene = null;
while (n <= +max && Date.now() - still < 20000) {
  let s = await page.evaluate(LOOK);
  const key = [s.beat, s.line, s.ch.join(), s.card, s.end, s.pop].join('|');
  if (key !== prev) {
    await page.waitForTimeout(1100); s = await page.evaluate(LOOK); prev = key; still = Date.now();
    const sc = (s.beat || '').split(':')[0]; startScene ??= sc;
    if (sc && sc !== startScene && !s.end) break;
    const nm = `${String(n++).padStart(2, '0')}-${(s.beat || 'x').replace(':', '-')}${s.end ? '-end' : s.ch.length ? '-choice' : s.pop ? '-react' : ''}.png`;
    await page.screenshot({ path: OUT + nm });
    log.push({ nm, beat: s.beat, text: (s.end ? 'END: ' + s.end : s.card ? 'CARD: ' + s.card : (s.who ? s.who + ': ' : '') + s.line).replace(/\s+/g, ' ').slice(0, 160), choices: s.ch, pop: s.pop });
    if (s.end) break;
  }
  if (s.card) { await page.locator('.hud-card .hud-next').click().catch(() => {}); await page.waitForTimeout(400); continue; }
  if (s.ch.length) {
    const i = pol === 'last' ? s.ch.length - 1 : pol === 'first' ? 0 : Math.min(+pol, s.ch.length - 1);
    await page.waitForTimeout(500);
    await page.locator('.db-choice').nth(i).click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(800);
    const r = await page.evaluate(LOOK);
    if (r.line !== s.line) { prev = ''; }
    continue;
  }
  const nb = page.locator('.hud-next').first();
  if (await nb.count()) await nb.click({ timeout: 2000 }).catch(() => {}); else await page.mouse.click(960, 380);
  await page.waitForTimeout(300);
}
fs.writeFileSync(OUT + 'log.json', JSON.stringify(log, null, 1));
console.log(name, log.length, 'shots;', log.map((l) => l.beat).join(' '));
await browser.close();
