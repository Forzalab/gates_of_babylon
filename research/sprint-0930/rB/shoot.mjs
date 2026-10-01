// M1 Route B: library -> katsu -> escape-win / escape-timeout. node shoot.mjs before|after [port]
// ?fx=full, 1920x1080, UI on, seed 1. Four legs, each jumped to with ?scene=&beat= (the shared middle is not route B):
//  A  v2-park 3 (the errand pick: "Return her book") -> v2-library 0..5 -> v2-town 0 (context)
//  B  v2-curry 1 (the lunch pick: katsu) -> v2-curry-katsu 0..11 -> v2-train 0 (context)
//  C  escape 0..15 (bento=umeboshi, the ♡ picks) -> the lock game, solved -> escape-win 0..7
//  D  escape 15 (bento=tamagoyaki) -> the lock game, timer runs out -> escape-timeout 0..7
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const SET = process.argv[2] || 'after';
const PORT = process.argv[3] || '5241';
const ONLY = process.argv[4] || 'ABCD';
const OUT = new URL(`./${SET}/`, import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
const LOOK = () => {
  const d = document.documentElement.dataset, q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  return { beat: d.beat ?? null, who: q('.db-say .who')?.textContent ?? '', line: q('.db-say .line')?.innerText ?? '',
    ch: qa('.db-choice').map((c) => c.querySelector('.line')?.innerText ?? c.innerText),
    end: q('.hud-end')?.innerText?.replace(/\s+/g, ' ') ?? null, game: !!q('.lg-root') };
};
const log = [];
async function leg(L, url, { pick, stop, game }) {
  await page.goto(`http://localhost:${PORT}/date-beta.html?seed=1&fx=full&${url}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.dataset.beat, null, { timeout: 15000 });
  let n = 1, prev = '', t0 = Date.now();
  const shot = async (s, tag) => {
    const nm = `${L}${String(n++).padStart(2, '0')}-${(s.beat || 'x').replace(':', '-')}${tag ? '-' + tag : ''}.png`;
    await page.screenshot({ path: OUT + nm });
    log.push({ nm, beat: s.beat, who: s.who, line: s.line, choices: s.ch, end: s.end });
  };
  while (Date.now() - t0 < 150000) {
    let s = await page.evaluate(LOOK);
    const key = [s.beat, s.line, s.ch.length, s.end, s.game].join('|');
    if (key !== prev) {
      prev = key;
      await page.waitForTimeout(1400); s = await page.evaluate(LOOK);
      await shot(s, s.end ? 'end' : s.game ? 'game' : s.ch.length ? 'choice' : '');
      if (s.end || (stop && stop.test(s.beat || ''))) break;
    }
    if (s.game) {
      if (game === 'win') {
        const tiles = await page.$$eval('.lg-tile:not(.is-open)', (b) => b.map((e) => [+e.dataset.i, e.dataset.kind]));
        const by = {}; for (const [i, k] of tiles) (by[k] ??= []).push(i);
        let k = 0;
        for (const ids of Object.values(by)) for (let j = 0; j + 1 < ids.length; j += 2) {
          await page.click(`.lg-tile[data-i="${ids[j]}"]`); await page.click(`.lg-tile[data-i="${ids[j + 1]}"]`);
          if (++k === 4) { await page.waitForTimeout(300); await shot(await page.evaluate(LOOK), 'game-half'); }
        }
        await page.waitForTimeout(500); await shot(await page.evaluate(LOOK), 'game-won');
        await page.waitForTimeout(2500);
      } else {
        await page.waitForTimeout(30000); await shot(await page.evaluate(LOOK), 'game-low');
        await page.waitForTimeout(12000);
      }
      continue;
    }
    if (s.ch.length) {
      let i = pick ? s.ch.findIndex((t) => pick.test(t)) : -1;
      if (i < 0) i = s.ch.findIndex((t) => /♡/.test(t));
      if (i < 0) i = 0;
      log[log.length - 1].taken = s.ch[i];
      await page.locator('.db-choice').nth(i).click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(700);
      const r = await page.evaluate(LOOK);
      if (r.line && r.line !== s.line && r.beat === s.beat) { await page.waitForTimeout(700); await shot(await page.evaluate(LOOK), 'react'); prev = [r.beat, r.line, r.ch.length, r.end, r.game].join('|'); }
      continue;
    }
    const nb = page.locator('.hud-next').first();
    if (await nb.count()) await nb.click({ timeout: 2000 }).catch(() => {}); else await page.mouse.click(960, 380);
    await page.waitForTimeout(300);
  }
}
if (ONLY.includes('A')) await leg('A', 'scene=v2-park&beat=3', { pick: /book/i, stop: /^v2-town/ });
if (ONLY.includes('B')) await leg('B', 'scene=v2-curry&beat=1', { pick: /katsu/i, stop: /^v2-train/ });
if (ONLY.includes('C')) await leg('C', 'scene=escape&beat=0&bento=umeboshi', { game: 'win' });
if (ONLY.includes('D')) await leg('D', 'scene=escape&beat=15&bento=tamagoyaki', { game: 'lose' });
fs.writeFileSync(OUT + `log-${ONLY}.json`, JSON.stringify({ log, errs }, null, 1));
console.log(log.map((l) => `${l.nm} | ${l.who} ${l.line.replace(/\s+/g, ' ').slice(0, 70)} | ${l.choices.join(' / ')}${l.taken ? ' => ' + l.taken : ''}${l.end ? ' END ' + l.end : ''}`).join('\n'), errs);
await browser.close();
