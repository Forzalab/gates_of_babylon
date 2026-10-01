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
const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
const LOOK = () => {
  const d = document.documentElement.dataset, q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  const sg = q('.sg-root');
  return { beat: d.beat ?? null, who: q('.db-say .who')?.textContent ?? '', line: q('.db-say .line')?.innerText ?? '',
    ch: qa('.db-choice').map((c) => ({ text: (c.querySelector('.line')?.innerText || (c.getAttribute('aria-label') || '').replace(/^\d+: /, '') || c.innerText), chip: c.querySelector('.db-chip')?.textContent ?? '', def: c.classList.contains('is-default'), dis: c.disabled || c.getAttribute('aria-disabled') === 'true' })),
    card: q('.hud-card')?.innerText?.replace(/\s+/g, ' ') ?? null, end: q('.hud-end')?.innerText?.replace(/\s+/g, ' ') ?? null,
    next: q('.hud-next')?.innerText?.trim() ?? '', pop: q('.lv-pop')?.innerText?.replace(/\s+/g, ' ') ?? null,
    lg: !!q('.lg-root'), sg: sg ? { cls: sg.className, round: sg.dataset.round ?? '', want: q('.sg-chip')?.innerText?.replace(/\s+/g, ' ') ?? '', say: q('.sg-say')?.innerText?.replace(/\s+/g, ' ') ?? '' } : null };
};
const KEY = (s) => [s.beat, s.line, s.ch.map((c) => c.text).join(), s.card, s.end, s.pop, s.lg, s.sg && [s.sg.cls, s.sg.round, s.sg.say].join('~')].join('|');
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
async function play({ pick, stopAfter, game, budget = 300000 }) {
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
  console.log('play() stopped on timeout');
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
fs.writeFileSync(new URL(`./${ROUTE}/log.json`, import.meta.url).pathname, JSON.stringify({ log, errs }, null, 1));
console.log(ROUTE, n - 1, 'shots', errs);
await browser.close();
