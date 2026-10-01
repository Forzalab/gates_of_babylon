// M2 leave audit shooter: plays live from scene 1 (no ?scene jump) at ?fx=full, 1920x1080, UI on, and shoots every beat
// (and every reaction frame) of the leave routes. Usage: node shoot.mjs <route> [outDir]   (PORT env, default 5233)
// routes: roof-fu | roof-yeah | home-fu | home-yeah. Home routes play the whole V2 day but only shoot from v2-home 3 on.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const ROUTE = process.argv[2];
const OUT = (process.argv[3] || new URL('./shots/' + ROUTE + '/', import.meta.url).pathname).replace(/\/?$/, '/');
const PORT = process.env.PORT || 5233;
const PICKS = {
  'roof-fu': [/Leave before the rain/, /Good morning, Nanda/, /FUCK YOU/],
  'roof-yeah': [/Leave before the rain/, /Stop following me/, /yeah ig/],
  'home-fu': [/Say goodnight/, /Who's 'he'/, /FUCK YOU/],
  'home-yeah': [/Say goodnight/, /Good morning, Nanda/, /yeah ig/],
}[ROUTE];
if (!PICKS) throw new Error('route?');
const HOME = ROUTE.startsWith('home');
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
const LOOK = () => {
  const d = document.documentElement.dataset, q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  return { beat: d.beat ?? null, who: q('.db-say .who')?.textContent ?? '', line: q('.db-say .line')?.innerText ?? '', ch: qa('.db-choice').map((c) => ({ text: c.querySelector('.line')?.innerText ?? c.innerText, chip: c.querySelector('.db-chip')?.textContent ?? '' })), card: q('.hud-card')?.innerText?.replace(/\s+/g, ' ') ?? null, end: q('.hud-end')?.innerText?.replace(/\s+/g, ' ') ?? null, game: !!q('.lg-root'), pop: q('.lv-pop')?.innerText?.replace(/\s+/g, ' ') ?? null };
};
await page.goto(`http://localhost:${PORT}/date-beta.html?seed=1&run=1&fx=full`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.dataset.beat || document.querySelector('.hud-card'), null, { timeout: 15000 });
let n = 1, on = !HOME; const log = [];
const shot = async (s, tag) => {
  if (!on) return;
  const nm = `${String(n++).padStart(2, '0')}-${(s.beat || 'x').replace(':', '-')}${tag ? '-' + tag : ''}.png`;
  await page.screenshot({ path: OUT + nm });
  log.push({ nm, beat: s.beat, tag, who: s.who, line: s.line, choices: s.ch.map((c) => c.chip + ' ' + c.text), pop: s.pop, end: s.end });
};
let prev = '', still = Date.now(), picksLeft = [...PICKS], seen = [];
while (Date.now() - still < 60000 && log.length < 80) {
  let s = await page.evaluate(LOOK);
  if (HOME && !on && /^v2-home:3/.test(s.beat || '')) on = true;
  const key = [s.beat, s.line, s.ch.length, s.card, s.end, s.pop].join('|');
  if (key !== prev) {
    await page.waitForTimeout(1400); s = await page.evaluate(LOOK); prev = key; still = Date.now();
    if (s.beat) seen.push(s.beat);
    await shot(s, s.end ? 'end' : s.card ? 'card' : s.ch.length ? 'choice' : '');
    if (s.end) { await page.waitForTimeout(2500); on = true; await page.screenshot({ path: OUT + `${String(n++).padStart(2, '0')}-END-settled.png` }); break; }
  }
  if (s.game) { await page.waitForTimeout(1000); continue; }
  if (s.card) { await page.waitForTimeout(800); await page.locator('.hud-card .hud-next').click().catch(() => {}); await page.waitForTimeout(400); continue; }
  if (s.ch.length) {
    let idx = -1;
    for (const re of picksLeft) { idx = s.ch.findIndex((c) => re.test(c.text)); if (idx >= 0) { picksLeft = picksLeft.filter((r) => r !== re); break; } }
    if (idx < 0) { // the route's own pick is not here: the best-scoring visible option (the chip may be ??), else the first
      const sc = s.ch.map((c, i) => [i, +(c.chip.match(/[+−-]?\d+/)?.[0]?.replace('−', '-') ?? 0)]).sort((a, b) => b[1] - a[1]);
      idx = sc[0][0];
    }
    if (log.length) log[log.length - 1].taken = s.ch[idx].text;
    await page.locator('.db-choice').nth(idx).click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(1300);
    const r = await page.evaluate(LOOK);
    if (!r.ch.length && (r.line !== s.line || r.pop)) { await shot({ ...r, beat: s.beat }, 'react'); prev = [r.beat, r.line, r.ch.length, r.card, r.end, r.pop].join('|'); }
    await page.waitForTimeout(300); continue;
  }
  const nb = page.locator('.hud-next').first();
  if (await nb.count()) await nb.click({ timeout: 2000 }).catch(() => {}); else await page.mouse.click(960, 380);
  await page.waitForTimeout(250);
}
fs.writeFileSync(OUT + 'log.json', JSON.stringify({ route: ROUTE, scenes: [...new Set(seen.map((b) => b.split(':')[0]))], errors, log }, null, 1));
console.log(ROUTE, log.length, 'shots;', [...new Set(seen.map((b) => b.split(':')[0]))].join('>'), '| end:', log.at(-1)?.end, '| errors:', errors.length);
await browser.close();
