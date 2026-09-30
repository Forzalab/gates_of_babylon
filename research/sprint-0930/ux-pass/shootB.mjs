// Agent B shooter: route B (library errand, katsu, lock game win, then timeout). Read-only on app code.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const BASE = 'http://localhost:5191/date-beta.html?seed=2';
const OUT = new URL('./B/', import.meta.url).pathname;
const MODE = process.argv[2] || 'main'; // main | timeout | rm
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const SHOOT = (b) => MODE !== 'pity' && MODE !== 'react' && ( /^(v2-library:|unknown:|escape:|escape-win:|escape-timeout:)/.test(b) || b === 'v2-curry:2');
const LOOK = () => {
  const d = document.documentElement.dataset, q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  const ch = qa('.db-choice').map((c) => ({ text: c.querySelector('.line')?.innerText ?? c.innerText, chip: c.querySelector('.db-chip')?.textContent ?? '', cls: c.querySelector('.db-chip')?.className ?? '' }));
  return { beat: d.beat ?? null, who: q('.db-say .who')?.textContent ?? '', line: q('.db-say .line')?.innerText ?? '', ch, card: !!q('.hud-card'), end: q('.hud-end h2')?.textContent ?? null, game: !!q('.lg-root'), fx: q('.db-fx')?.className ?? null, fxText: q('.db-fx')?.innerText?.replace(/\s+/g,' ') ?? null, love: q('.lv-meter')?.getAttribute('aria-valuenow') ?? null, pop: q('.lv-pop')?.innerText?.replace(/\s+/g,' ') ?? null };
};
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: MODE === 'rm' ? 'reduce' : 'no-preference' });
const page = await ctx.newPage();
const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
const start = MODE === 'pity' ? '&scene=rooftop&beat=2' : MODE === 'timeout' ? '&scene=escape&beat=5' : '&scene=v2-park&beat=4';
await page.goto(BASE + start, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.dataset.beat || document.querySelector('.hud-card'), null, { timeout: 15000 });
let n = MODE === 'react' ? 20 : MODE === 'pity' ? 40 : MODE === 'timeout' ? 60 : MODE === 'rm' ? 90 : 0;
const log = [];
const shot = async (s, tag = '') => { const nm = `${String(n++).padStart(2, '0')}-${(s.beat || 'x').replace(':', '-')}${tag}${MODE === 'rm' ? '-RM' : ''}.png`; await page.screenshot({ path: OUT + nm }); log.push({ nm, ...s }); console.log(nm, s.who, '|', s.line.slice(0, 60), '|', s.ch.map((c) => c.chip + c.text).join(' / '), s.fx ? 'FX:' + s.fx + ' ' + s.fxText : '', s.love ?? ''); };
const PLAN = { 'v2-park:4': 'Return her book', 'v2-curry:1': 'Katsu', 'cup:4': 'Stand up' };
let prev = '', downs = 0, picks = 0, still = Date.now(), gameDone = false, fxSeen = new Set(), shotsRM = 0;
const t0 = Date.now();
while (Date.now() - t0 < 400000) {
  let s = await page.evaluate(LOOK);
  const key = [s.beat, s.line, s.ch.length, s.card, s.end, s.game].join('|');
  if (key !== prev) {
    await page.waitForTimeout(MODE === 'rm' ? 250 : 900); s = await page.evaluate(LOOK);
    prev = key; still = Date.now();
    if (MODE === 'rm') { if (shotsRM < 3 && s.beat) { await shot(s); shotsRM++; } if (shotsRM >= 3) break; }
    else if (s.end) { await shot(s, '-end'); await page.waitForTimeout(1500); await page.screenshot({ path: OUT + `${String(n++).padStart(2,'0')}-END-settled.png` }); break; }
    else if (s.game) { if (!gameDone || MODE === 'timeout') await shot({ ...s, beat: 'lockgame-start' }); }
    else if (s.beat && SHOOT(s.beat) && !s.card) await shot(s);
    else if (s.fx && !fxSeen.has(s.fx + s.beat)) { fxSeen.add(s.fx + s.beat); await shot(s, '-fx'); }
  }
  if (Date.now() - still > 90000) { console.log('HUNG', s.beat); await shot(s, '-HUNG'); break; }
  if (s.game) {
    if (MODE === 'timeout') { await page.waitForTimeout(1500); const lo = await page.evaluate(() => !!document.querySelector('.lg-time.low')); if (lo && !global.lowShot) { global.lowShot = 1; await shot({ ...(await page.evaluate(LOOK)), beat: 'lockgame-lowtime' }); } continue; }
    if (!gameDone) {
      gameDone = true;
      const kinds = await page.$$eval('.lg-grid button', (bs) => bs.map((b) => b.dataset.kind)); const by = {}; kinds.forEach((k, i) => (by[k] ??= []).push(i));
      const tiles = await page.$$('.lg-grid button'); let pd = 0;
      for (const ix of Object.values(by)) for (let j = 0; j < ix.length; j += 2) { await tiles[ix[j]].click(); await page.waitForTimeout(100); await tiles[ix[j + 1]].click(); await page.waitForTimeout(200); if (++pd === 4) { const m = await page.evaluate(LOOK); await shot({ ...m, beat: 'lockgame-mid' }); } }
    } else await page.waitForTimeout(400);
    continue;
  }
  if (s.card) { await page.waitForTimeout(1200); await page.locator('.hud-card .hud-next').click().catch(() => {}); await page.waitForTimeout(400); continue; }
  if (s.ch.length) {
    await page.waitForTimeout(300);
    let idx = -1; const want = MODE === 'pity' ? null : PLAN[s.beat]; if (want) idx = s.ch.findIndex((c) => c.text.includes(want));
    if (idx < 0) { // D,D,U pattern: two 💔 in a row, then a ♥ (pity love-bomb check)
      const down = s.ch.findIndex((c) => /down/.test(c.cls)), up = s.ch.map((c, i) => [i, +(c.chip.match(/\d+/) || [0])[0]]).filter(([i]) => !/down/.test(s.ch[i].cls)).sort((a, b) => b[1] - a[1])[0];
      if (downs < 2 && down >= 0 && !/Run home alone/.test(s.ch[down].text)) { idx = down; downs++; } else { idx = up ? up[0] : 0; downs = 0; }
      if (!/^(errand|hungry|door|cup)/.test(s.beat || '') ) {}
    }
    if (MODE !== 'timeout' && /^escape:14/.test(s.beat)) idx = s.ch.findIndex((c) => /Leave her house/.test(c.text));
    if (MODE === 'timeout' && /^escape:14/.test(s.beat)) idx = s.ch.findIndex((c) => /Wait for her/.test(c.text));
    if (idx < 0) idx = 0;
    if (MODE === 'pity') { await shot({ ...s, beat: s.beat + '-choices' }, '-pick' + (++picks)); if (picks > 5) break; }
    await page.locator('.db-choice').nth(idx).click({ timeout: 4000 }).catch(() => {});
    if (MODE === 'react' && PLAN[s.beat]) { await page.waitForTimeout(700); const r = await page.evaluate(LOOK); await shot({ ...r, beat: s.beat + '-react' }, ''); if (s.beat === 'v2-curry:1') break; }
    if (MODE === 'pity') { for (let t = 0; t < 14; t++) { await page.waitForTimeout(90); const q = await page.evaluate(LOOK); if (q.fx || q.pop) { await shot({ ...q, beat: s.beat + '-flash' }, '-pick' + picks + '-flash'); break; } } }
    await page.waitForTimeout(MODE === 'pity' ? 900 : 500);
    const a = await page.evaluate(LOOK); if (MODE === 'pity') await shot({ ...a, beat: s.beat + '-result' }, '-pick' + picks + '-result'); else if (a.fx && !fxSeen.has(a.fx + '@' + s.beat)) { fxSeen.add(a.fx + '@' + s.beat); await shot({ ...a, beat: s.beat + '-after' }, '-pick-fx'); }
    continue;
  }
  const nb = page.locator('.hud-next').first();
  if (await nb.count()) await nb.click({ timeout: 2000 }).catch(() => {}); else await page.mouse.click(960, 380);
  await page.waitForTimeout(250);
}
fs.writeFileSync(OUT + `log-${MODE}.json`, JSON.stringify({ log, errs }, null, 1));
await browser.close();
