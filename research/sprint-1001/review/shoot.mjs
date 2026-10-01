// Reviewer A (Prof. WhatIsThis) driver, built on research/sprint-1001/playtest/shoot.mjs (origin/playtest-1001).
// node shoot.mjs <route> [port] [outdir]. Serve a frozen build (vite build + vite preview). 1920x1080, seed 1, clock 12:20.
// Routes: A (full butter route to STEEPED), branches (every choice once, deep link + ?pick), endings (escape win/timeout,
// leave x3), run2, run3. PNGs -> <outdir>/<route>/png, log.json beside them.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const ROUTE = process.argv[2] || 'A';
const PORT = process.argv[3] || '5633';
const ROOTOUT = process.argv[4] || new URL('./out/', import.meta.url).pathname;
const BASE = `http://localhost:${PORT}/`;
const DIR = `${ROOTOUT}/${ROUTE}/`, OUT = DIR + 'png/';
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
let ctx, page;
const errs = [];
async function fresh() {
  if (ctx) await ctx.close();
  ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  page = await ctx.newPage();
  await page.clock.install({ time: new Date('2026-10-01T12:20:00') });
  page.on('pageerror', (e) => errs.push(String(e)));
}
await fresh();
const LOOK = () => {
  const d = document.documentElement.dataset, q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  const sg = q('.sg-root');
  return { beat: d.beat ?? null, who: q('.db-say .who')?.textContent ?? '', line: q('.db-say .line')?.innerText ?? '',
    ch: qa('.db-choice').map((c) => ({ text: (c.querySelector('.line')?.innerText || (c.getAttribute('aria-label') || '').replace(/^\d+: /, '') || c.innerText), chip: c.querySelector('.db-chip')?.textContent ?? '', def: c.classList.contains('is-default'), dis: c.disabled || c.getAttribute('aria-disabled') === 'true' })),
    card: q('.hud-card')?.innerText?.replace(/\s+/g, ' ') ?? null, end: q('.hud-end')?.innerText?.replace(/\s+/g, ' ') ?? null,
    next: q('.hud-next')?.innerText?.trim() ?? '', pop: q('.lv-pop')?.innerText?.replace(/\s+/g, ' ') ?? null,
    stamp: q('.db-stamp')?.innerText?.replace(/\s+/g, ' ') ?? null, trail: q('.lv-trail')?.getAttribute('aria-label') ?? '',
    lg: !!q('.lg-root'), lgk: q('.lg-root') ? q('.lg-title')?.textContent + qa('.lg-tile.is-open').length : '', sg: sg ? { cls: sg.className, round: sg.dataset.round ?? '', want: q('.sg-chip')?.innerText?.replace(/\s+/g, ' ') ?? '', say: q('.sg-say')?.innerText?.replace(/\s+/g, ' ') ?? '' } : null };
};
const KEY = (s) => [s.beat, s.line, s.ch.map((c) => c.text).join(), s.card, s.end, s.pop, s.lg && s.lgk, s.sg && [s.sg.cls, s.sg.round, s.sg.say].join('~')].join('|');
let n = 1, leg = ROUTE; const log = [];
const shot = async (s, tag, extra = {}) => {
  const nm = `${String(n++).padStart(3, '0')}-${(s.beat || 'menu').replace(':', '-')}${tag ? '-' + tag : ''}.png`;
  await page.screenshot({ path: OUT + nm });
  const text = (s.end ? 'END: ' + s.end : s.card ? 'CARD: ' + s.card : s.sg ? `GAME ${s.sg.cls.replace('sg-root ', '')} ${s.sg.round} ${s.sg.want} ${s.sg.say}` : (s.who ? s.who + ': ' : '') + s.line).replace(/\s+/g, ' ').trim().slice(0, 140);
  log.push({ nm, leg, scene: (s.beat || '').split(':')[0], beat: (s.beat || '').split(':')[1] ?? '', tag, text, stamp: s.stamp, trail: s.trail, choices: s.ch.map((c) => `${c.chip} ${c.text}${c.def ? ' [default]' : ''}${c.dis ? ' [disabled]' : ''}`), pop: s.pop, ...extra });
  console.log(nm, '|', s.trail, '|', s.stamp ?? '', '|', text, s.ch.length ? '| ' + s.ch.map((c) => c.chip + c.text).join(' / ') : '', s.pop ? '| pop ' + s.pop : '');
};
// play(): click through until stopAfter's scene is left, an end card shows, or the budget runs out (10 min per route cap).
async function play({ pick, stopAfter = null, game = async () => false, lock = null, budget = 600000 }) {
  let prev = '', still = Date.now(), seenStop = false; const t0 = Date.now();
  while (Date.now() - still < 30000 && Date.now() - t0 < budget) {
    let s = await page.evaluate(LOOK);
    const sc = (s.beat || '').split(':')[0];
    if (stopAfter && stopAfter.test(sc)) seenStop = true;
    if (KEY(s) !== prev) {
      await page.waitForTimeout(s.sg ? 350 : 1100); s = await page.evaluate(LOOK); prev = KEY(s); still = Date.now();
      const sc2 = (s.beat || '').split(':')[0];
      if (seenStop && sc2 && !stopAfter.test(sc2)) { await shot(s, 'next-scene'); return true; }
      await shot(s, s.end ? 'end' : s.card ? 'card' : s.sg ? 'game-' + s.sg.cls.replace('sg-root ', '').replace(/ /g, '-') : s.lg ? 'lock' : s.ch.length ? 'choice' : s.pop ? 'react' : '');
      if (s.end) return true;
      continue;
    }
    if (s.lg && lock) { if (await lock(s)) await page.waitForTimeout(700); else { await page.clock.runFor(1000).catch(() => {}); await page.waitForTimeout(100); } continue; }
    if (s.sg && !s.pop) { if (await game(s)) await page.waitForTimeout(150); else await page.waitForTimeout(200); continue; }
    if (s.card) { await page.waitForTimeout(500); await page.locator('.hud-card .hud-next, .hud-card button').first().click().catch(() => page.mouse.click(960, 540)); await page.waitForTimeout(400); continue; }
    if (s.ch.length) {
      const idx = pick(s.ch, s);
      log[log.length - 1].taken = s.ch[idx].chip + ' ' + s.ch[idx].text;
      await page.locator('.db-choice').nth(idx).click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(150);
      continue;
    }
    const nb = page.locator('.hud-next').first();
    if (await nb.count() && await nb.isVisible()) {
      if (s.next && s.next !== 'NEXT') log[log.length - 1].taken ||= s.next;
      await nb.click({ timeout: 2000 }).catch(() => {});
    } else { await page.clock.runFor(400).catch(() => {}); await page.mouse.click(960, 380); }
    await page.waitForTimeout(300);
  }
  const at = (await page.evaluate(LOOK)).beat;
  console.log('STUCK', leg, at); log.push({ nm: null, leg, note: `STUCK ${leg} ${at}` });
  return false;
}
const firstPink = (res) => (ch) => { for (const re of res) { const i = ch.findIndex((c) => !c.dis && re.test(c.text)); if (i >= 0) return i; } return ch.findIndex((c) => !c.dis); };
const RIGHT = { produce: 'carrots', eggs: 'eggs', cups: 'three' };
const allRight = async (s) => { if (!/sg-shelf/.test(s.sg.cls)) return false; await page.click(`.sg-item[data-item="${RIGHT[s.sg.round]}"]`).catch(() => {}); return true; };
const go = async (q, wait = 2000) => { await page.goto(`${BASE}date-beta.html?seed=1&fx=full${q}`, { waitUntil: 'networkidle' }); await page.waitForTimeout(wait); };
const solveLock = async () => {
  const tiles = await page.$$eval('.lg-tile:not(.is-open)', (ts) => ts.map((t) => ({ k: t.dataset.kind, i: t.dataset.i })));
  for (const t of tiles) { const m = tiles.find((u) => u.k === t.k && u.i !== t.i); if (m) {
    await page.click(`.lg-tile[data-i="${t.i}"]`).catch(() => {}); await page.waitForTimeout(250);
    await page.click(`.lg-tile[data-i="${m.i}"]`).catch(() => {}); return true; } }
  return false;
};
const waitLock = async () => false; // let the 40 s timer run out (play() fast-forwards the clock 1 s per poll)
const PINK = [/butter/i, /tamagoyaki/i, /best/i, /stay a minute/i, /hold it tight/i, /groceries/i, /step under/i, /walk slower/i, /^sit down/i, /eat it all/i, /^drink/i];

if (ROUTE === 'A') { // the demo path: run 1, pink picks, butter, shelf all right, through to STEEPED
  await go('', 2500);
  await play({ pick: firstPink(PINK), game: allRight, budget: 600000 });
}
if (ROUTE === 'branches') { // every choice of every reachable choice beat once: deep link to the beat, ?pick=k, react + next 2 frames
  const G = JSON.parse(fs.readFileSync(ROOTOUT + '/choices.json', 'utf8'));
  for (const c of G) {
    leg = `${c.scene}:${c.beat}.c${c.k}`;
    await go(`&scene=${c.scene}&beat=${c.beat}&pick=${c.k + 1}${c.bento ? '&bento=' + c.bento : ''}`, 1300);
    let s = await page.evaluate(LOOK); await shot(s, `c${c.k}`, { expect: c });
    for (let i = 0; i < 2; i++) {
      const nb = page.locator('.hud-next').first();
      if (await nb.count() && await nb.isVisible()) await nb.click({ timeout: 2000 }).catch(() => {}); else await page.mouse.click(960, 380);
      await page.waitForTimeout(1100);
      const s2 = await page.evaluate(LOOK); if (KEY(s2) === KEY(s)) break; s = s2; await shot(s, `c${c.k}-after${i + 1}`);
      if (s.ch.length || s.sg || s.lg || s.end) break;
    }
  }
}
if (ROUTE === 'endings') {
  leg = 'escape-win'; await go('&scene=cup&beat=4&pick=3');
  await play({ pick: firstPink([/^open the hatch/i, /^climb down/i, /^look at the shelves/i, /^keep looking$/i, /leave her house/i]), lock: solveLock, budget: 420000 });
  leg = 'escape-timeout'; await fresh(); await go('&scene=escape&beat=13');
  await play({ pick: firstPink([/wait for her/i]), lock: waitLock, budget: 300000 });
  leg = 'leave-yeah'; await fresh(); await go('&scene=v2-home&beat=4&pick=2');
  await play({ pick: firstPink([/good morning/i, /yeah ig/i]), budget: 240000 });
  leg = 'leave-fu'; await fresh(); await go('&scene=rooftop&beat=11&pick=3');
  await play({ pick: firstPink([/stop following/i, /FUCK/i]), budget: 240000 });
  leg = 'leave-long'; await fresh(); await go('&scene=leave&beat=3');
  await play({ pick: firstPink([/forever sounds long/i]), budget: 180000 });
}
if (ROUTE === 'run2' || ROUTE === 'run3') {
  const r = ROUTE.slice(3);
  leg = `${ROUTE}-rooftop`; await go(`&run=${r}`, 2500);
  await play({ pick: firstPink(PINK), stopAfter: /rooftop/ });
  for (const [sc, b] of [['v2-train', 5], ['cup', 4], ['steeped', 0], ['leave-yeah', 0]]) {
    leg = `${ROUTE}-${sc}`; await fresh(); await go(`&run=${r}&scene=${sc}&beat=${b}`);
    await play({ pick: firstPink(PINK), stopAfter: new RegExp(`^${sc}$`), budget: 180000 });
  }
}
fs.writeFileSync(DIR + 'log.json', JSON.stringify({ log, errs }, null, 1));
console.log(ROUTE, n - 1, 'shots', errs);
await browser.close();
