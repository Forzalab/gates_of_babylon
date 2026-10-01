// Sprint 1001 full playtest driver (built on sprint-0930 paths/rB/replay shoot.mjs).
// node shoot.mjs <route> [port]. Serve a frozen build (vite build + vite preview), not the dev server:
// another agent edits the checkout and HMR reloads drop the run back to the rooftop.
// One PNG per new state (beat, line, choice set, card, pop, minigame frame), 1920x1080, UI on, seed 1, fx=full.
// PNGs go to <route>/png/ (scratch, not committed); sheets.py makes <route>/shots/*.jpg + <route>/sheet-NN.png.
// ROUTE A: main menu (Logic index) -> date-beta boot -> rooftop (goal card, bento, every pick + react) -> park -> shop
//   (shelf game, all right) -> town -> butter curry -> first beat of the next scene. Then leg A2: the shelf game again
//   from ?scene=v2-shop&beat=4 with wrong picks + a timeout, so every wrong / aside / timeout frame is shot too.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const ROUTE = process.argv[2] || 'A';
const PORT = process.argv[3] || '5300';
const BASE = `http://localhost:${PORT}/`;
const OUT = new URL(`./${ROUTE}/png/`, import.meta.url).pathname;
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
await page.clock.install({ time: new Date('2026-10-01T12:20:00') }); // deterministic story clock (sprint 1001)
const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
const LOOK = () => {
  const d = document.documentElement.dataset, q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  const sg = q('.sg-root');
  return { beat: d.beat ?? null, who: q('.db-say .who')?.textContent ?? '', line: q('.db-say .line')?.innerText ?? '',
    ch: qa('.db-choice').map((c) => ({ text: (c.querySelector('.line')?.innerText || (c.getAttribute('aria-label') || '').replace(/^\d+: /, '') || c.innerText), chip: c.querySelector('.db-chip')?.textContent ?? '', def: c.classList.contains('is-default'), dis: c.disabled || c.getAttribute('aria-disabled') === 'true' })),
    card: q('.hud-card')?.innerText?.replace(/\s+/g, ' ') ?? null, end: q('.hud-end')?.innerText?.replace(/\s+/g, ' ') ?? null,
    next: q('.hud-next')?.innerText?.trim() ?? '', pop: q('.lv-pop')?.innerText?.replace(/\s+/g, ' ') ?? null,
    lg: !!q('.lg-root'), lgk: q('.lg-root') ? q('.lg-title')?.textContent + qa('.lg-tile.is-open').length : '', sg: sg ? { cls: sg.className, round: sg.dataset.round ?? '', want: q('.sg-chip')?.innerText?.replace(/\s+/g, ' ') ?? '', say: q('.sg-say')?.innerText?.replace(/\s+/g, ' ') ?? '' } : null };
};
const KEY = (s) => [s.beat, s.line, s.ch.map((c) => c.text).join(), s.card, s.end, s.pop, s.lg && s.lgk, s.sg && [s.sg.cls, s.sg.round, s.sg.say].join('~')].join('|');
let n = 1, leg = ROUTE; const log = [];
const shot = async (s, tag, extra = {}) => {
  const nm = `${String(n++).padStart(3, '0')}-${(s.beat || 'menu').replace(':', '-')}${tag ? '-' + tag : ''}.png`;
  await page.screenshot({ path: OUT + nm });
  const text = (s.end ? 'END: ' + s.end : s.card ? 'CARD: ' + s.card : s.sg ? `GAME ${s.sg.cls.replace('sg-root ', '')} ${s.sg.round} ${s.sg.want} ${s.sg.say}` : (s.who ? s.who + ': ' : '') + s.line).replace(/\s+/g, ' ').trim().slice(0, 110);
  log.push({ nm, leg, scene: (s.beat || '').split(':')[0], beat: (s.beat || '').split(':')[1] ?? '', tag, text, choices: s.ch.map((c) => `${c.chip} ${c.text}${c.def ? ' [default]' : ''}${c.dis ? ' [disabled]' : ''}`), pop: s.pop, ...extra });
  console.log(nm, '|', text, s.ch.length ? '| ' + s.ch.map((c) => c.chip + c.text).join(' / ') : '', s.pop ? '| pop ' + s.pop : '');
};

// Main menu = the Logic-mode front page (index.html), the game's landing page.
await page.goto(BASE, { waitUntil: 'networkidle' }); await page.waitForTimeout(2000);
await shot({ beat: null, ch: [], who: '', line: 'Logic mode front page (index.html)' }, 'index');

// play(): click through from the current page until stop(scene) says so. pick(choices) -> index. game(s) -> handles the shelf.
async function play({ pick, stopAfter, game = async () => false, lock = null, budget = 300000 }) {
  let prev = '', still = Date.now(), seenStop = false; const t0 = Date.now();
  while (Date.now() - still < 45000 && Date.now() - t0 < budget) {
    let s = await page.evaluate(LOOK);
    const sc = (s.beat || '').split(':')[0];
    if (stopAfter && stopAfter.test(sc)) seenStop = true;
    if (KEY(s) !== prev) {
      await page.waitForTimeout(s.sg ? 350 : 1100); s = await page.evaluate(LOOK); prev = KEY(s); still = Date.now();
      const sc2 = (s.beat || '').split(':')[0];
      if (seenStop && sc2 && !stopAfter.test(sc2)) { await shot(s, 'next-scene'); return; }
      await shot(s, s.end ? 'end' : s.card ? 'card' : s.sg ? 'game-' + s.sg.cls.replace('sg-root ', '').replace(/ /g, '-') : s.lg ? 'lock' : s.ch.length ? 'choice' : s.pop ? 'react' : '');
      if (s.end) return;
      continue;
    }
    if (s.lg && lock) { if (await lock(s)) { await page.waitForTimeout(700); } else await page.waitForTimeout(250); continue; }
    if (s.sg && !s.pop) { if (await game(s)) { await page.waitForTimeout(150); } else await page.waitForTimeout(200); continue; }
    if (s.card) { await page.waitForTimeout(500); await page.locator('.hud-card .hud-next, .hud-card button').first().click().catch(() => page.mouse.click(960, 540)); await page.waitForTimeout(400); continue; }
    if (s.ch.length) {
      const idx = pick(s.ch);
      log[log.length - 1].taken = s.ch[idx].chip + ' ' + s.ch[idx].text;
      await page.locator('.db-choice').nth(idx).click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(150);
      continue;
    }
    const nb = page.locator('.hud-next').first();
    if (await nb.count() && await nb.isVisible()) {
      if (s.next && s.next !== 'NEXT') log[log.length - 1].taken ||= s.next;
      await nb.click({ timeout: 2000 }).catch(() => {});
    } else await page.mouse.click(960, 380);
    await page.waitForTimeout(300);
  }
  console.log('play() stopped on timeout'); log.push({ nm: null, leg, note: 'STUCK: play() stopped on timeout/stall', at: (await page.evaluate(LOOK)).beat });
}
const firstPink = (res) => (ch) => { for (const re of res) { const i = ch.findIndex((c) => !c.dis && re.test(c.text)); if (i >= 0) return i; } return ch.findIndex((c) => !c.dis); };
const RIGHT = { produce: 'carrots', eggs: 'eggs', cups: 'three' };
const allRight = async (s) => {
  if (!/sg-shelf/.test(s.sg.cls)) return false;
  await page.click(`.sg-item[data-item="${RIGHT[s.sg.round]}"]`).catch(() => {}); return true;
};

if (ROUTE === 'A') {
  await page.goto(`${BASE}date-beta.html?seed=1&fx=full`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await play({ pick: firstPink([/butter/i, /grocer/i]), stopAfter: /curry/, game: allRight });
  // Leg A2: the shelf game with wrong picks. Plan per round: produce jar -> carrots; eggs milk -> natto -> eggs; cups pair -> timeout.
  leg = 'A2';
  const plan = { produce: ['jar', 'carrots'], eggs: ['milk', 'natto', 'eggs'], cups: ['pair', null] };
  const wrongs = async (s) => {
    if (!/sg-shelf/.test(s.sg.cls)) return false;
    const it = plan[s.sg.round].shift();
    if (it === undefined || it === null) { plan[s.sg.round].unshift(null); return false; } // let the timer run out
    await page.click(`.sg-item[data-item="${it}"]`).catch(() => {}); return true;
  };
  await page.goto(`${BASE}date-beta.html?seed=1&fx=full&scene=v2-shop&beat=4`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await play({ pick: firstPink([]), stopAfter: /v2-shop/, game: wrongs });
}
// ---- Sprint 1001 routes (deep links, seed 1, clock pinned 2026-10-01 12:20). ----
const go = async (q, wait = 2000) => { await page.goto(`${BASE}date-beta.html?seed=1&fx=full${q}`, { waitUntil: 'networkidle' }); await page.waitForTimeout(wait); };
// Lock game: match the first unopened pair of a kind (one pair per call), so each tumbler gets its own shot.
const solveLock = async () => {
  const tiles = await page.$$eval('.lg-tile:not(.is-open)', (ts) => ts.map((t) => ({ k: t.dataset.kind, i: t.dataset.i })));
  for (const t of tiles) { const m = tiles.find((u) => u.k === t.k && u.i !== t.i); if (m) {
    await page.click(`.lg-tile[data-i="${t.i}"]`).catch(() => {}); await page.waitForTimeout(250);
    await page.click(`.lg-tile[data-i="${m.i}"]`).catch(() => {}); return true; } }
  return false;
};
const waitLock = async () => false; // let the 40s timer run out
const firstOk = firstPink([]);
if (ROUTE === 'B') { // katsu: v2-curry pick -> v2-curry-katsu -> train -> rain -> street -> home -> cup -> ending
  await go('&scene=v2-curry&beat=1');
  await play({ pick: firstPink([/katsu/i, /^drink/i, /just one cup/i]), budget: 600000 });
}
if (ROUTE === 'alone') { // not hungry: v2-curry pick 3 -> v2-curry-alone -> first beat of v2-train
  await go('&scene=v2-curry&beat=1');
  await play({ pick: firstPink([/not hungry/i]), stopAfter: /v2-curry/ });
}
if (ROUTE === 'leave') { // door "say goodnight" -> leave -> leave-yeah (c0); leave -> leave-fu (c2); leave -> leave-yeah (c1)
  leg = 'leave-yeah'; await go('&scene=door&beat=0');
  await play({ pick: firstPink([/goodnight/i, /yeah ig/i]) });
  leg = 'leave-fu'; await go('&scene=leave&beat=0');
  await play({ pick: firstPink([/FUCK/i]) });
  leg = 'leave-long'; await go('&scene=leave&beat=3');
  await play({ pick: firstPink([/forever sounds long/i]) });
}
if (ROUTE === 'escape') { // cup "stand up" -> unknown -> escape (lock game won) -> escape-win; leg 2: lock game timeout
  leg = 'escape-win'; await go('&scene=cup&beat=0');
  await play({ pick: firstPink([/stand up/i, /leave her house/i]), lock: solveLock, budget: 600000 });
  leg = 'escape-timeout'; await go('&scene=escape&beat=13');
  await play({ pick: firstPink([/wait for her/i]), lock: waitLock, budget: 400000 });
}
if (ROUTE === 'run2' || ROUTE === 'run3') { // replays: rooftop with ?run=N, then the meta beats (station-talk 0-3, v2-train 6)
  const r = ROUTE.slice(3);
  leg = `${ROUTE}-rooftop`; await go(`&run=${r}`, 2500);
  await play({ pick: firstPink([/butter/i]), stopAfter: /rooftop/ });
  leg = `${ROUTE}-station-talk`; await go(`&run=${r}&scene=station-talk&beat=0`);
  await play({ pick: firstOk, stopAfter: /station-talk/ });
  leg = `${ROUTE}-v2-train`; await go(`&run=${r}&scene=v2-train&beat=6`);
  await play({ pick: firstOk, stopAfter: /v2-train/ });
}
if (ROUTE === 'gacha') { // forced pops on the rooftop bento pick: every tier, pick 1 (+3) via ?gacha=&pick=
  for (const [tier, pk] of [['crit10', 1], ['crit5', 1], ['pity', 1], ['anger', 1], ['rage', 1], ['anger', 3], ['rage', 3]]) {
    leg = `gacha-${tier}-p${pk}`;
    await page.goto(`${BASE}date-beta.html?seed=1&fx=full&scene=rooftop&beat=3&gacha=${tier}&pick=${pk}`, { waitUntil: 'networkidle' });
    for (const [i, t] of [[0, 250], [1, 700], [2, 1500]]) { await page.waitForTimeout(t); await shot(await page.evaluate(LOOK), `${tier}-p${pk}-t${i}`); }
  }
  leg = 'gacha-natural'; await go('&scene=rooftop&beat=3'); // seed 1, no force: whatever the seed rolls
  await play({ pick: firstPink([/tamagoyaki/i, /best/i]), stopAfter: /rooftop/ });
}
fs.writeFileSync(new URL(`./${ROUTE}/log.json`, import.meta.url).pathname, JSON.stringify({ log, errs }, null, 1));
console.log(ROUTE, n - 1, 'shots', errs);
await browser.close();
