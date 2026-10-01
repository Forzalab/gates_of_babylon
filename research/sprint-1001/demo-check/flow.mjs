// C2 flow tester: node flow.mjs <case> <run> ; case = rooftop3 | train | shop | timer. Fresh context per page load. Clock 12:20, 1920x1080, seed 1.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const CASE = process.argv[2], RUN = process.argv[3], PORT = process.argv[4] || '5611';
const OUT = new URL('./', import.meta.url).pathname;
const SPEC = { rooftop3: '&scene=rooftop&beat=3', train: '&scene=station-talk&beat=0', timer: '&scene=hungry&beat=0', shop: '&scene=v2-shop&beat=4' }[CASE];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const LOOK = () => {
  const q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)];
  const R = (e) => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; };
  return { beat: document.documentElement.dataset.beat, love: q('[role=meter]')?.getAttribute('aria-valuenow'), pop: q('.lv-pop')?.innerText?.replace(/\s+/g, ' ') ?? null,
    say: q('.db-say')?.innerText?.replace(/\s+/g, ' ') ?? '', sayBox: q('.db-say') ? R(q('.db-say')) : null, choiceBox: q('.db-choices') ? R(q('.db-choices')) : null,
    timebar: !!q('.db-timebar'), timer: q('.db-timer')?.textContent ?? null,
    ch: qa('.db-choice').map((c) => ({ text: c.querySelector('.line')?.innerText ?? '', label: c.getAttribute('aria-label'), chip: c.querySelector('.db-chip')?.textContent ?? null, def: c.classList.contains('is-default') })),
    legend: !!q('.db-legend') };
};
async function open() {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date('2026-10-01T12:20:00') });
  page.on('pageerror', (e) => console.log('PAGEERR', String(e)));
  await page.goto(`http://localhost:${PORT}/date-beta.html?seed=1&fx=full&still&run=${RUN}${SPEC}`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.clock.runFor(2500);
  return { ctx, page };
}
const res = { case: CASE, run: RUN };
const settle = async (page) => { await page.clock.runFor(900); await page.clock.runFor(900); };
if (CASE === 'shop') {
  const RIGHT = ['carrots', 'eggs', 'three'];
  for (const mode of ['perfect', 'onewrong']) {
    const { ctx, page } = await open();
    const l0 = await page.evaluate(LOOK);
    res.start = l0.love;
    let n = 0;
    const WRONG = { produce: 'jar', eggs: 'milk', cups: 'pair' };
    let first = true; const seen = [];
    for (let i = 0; i < 60; i++) {
      const s = await page.evaluate(() => { const r = document.querySelector('.sg-root'); return r ? { cls: r.className, round: r.dataset.round } : null; });
      const b = await page.evaluate(LOOK);
      if (!s && b.beat && !/shop-game/.test(await page.evaluate(() => document.documentElement.dataset.bg ?? ''))) { if (i > 3) break; }
      if (s && /sg-shelf/.test(s.cls)) {
        if (n === 0 && mode === 'perfect') await page.screenshot({ path: `${OUT}shop-run${RUN}-shelf.png` });
        const want = await page.evaluate(() => ({ chip: document.querySelector('.sg-chip')?.innerText, items: [...document.querySelectorAll('.sg-item')].map((x) => x.dataset.item) , chips: document.querySelectorAll('.db-chip').length, choices: document.querySelectorAll('.db-choice').length }));
        if (n === 0) res.shelf = want;
        const rid = s.round; const idx = RIGHT.indexOf(rid === 'produce' ? 'carrots' : rid === 'eggs' ? 'eggs' : 'three');
        let item = RIGHT[['produce', 'eggs', 'cups'].indexOf(rid)];
        if (mode === 'onewrong' && first) { item = WRONG[rid]; first = false; }
        seen.push(rid + ':' + item);
        await page.click(`.sg-item[data-item="${item}"]`, { timeout: 5000 }).catch((e) => seen.push('clickfail ' + item));
        n++;
      }
      await page.clock.runFor(700);
    }
    const end = await page.evaluate(LOOK);
    await settle(page);
    const end2 = await page.evaluate(LOOK);
    res[mode] = { seen, startLove: l0.love, endLove: end2.love, endBeat: end2.beat, pop: end.pop || end2.pop };
    if (mode === 'perfect') await page.screenshot({ path: `${OUT}shop-run${RUN}-after.png` });
    await ctx.close();
  }
  console.log(JSON.stringify(res, null, 1)); await browser.close(); process.exit(0);
}
// choice cases
const { ctx, page } = await open();
const base = await page.evaluate(LOOK);
await page.screenshot({ path: `${OUT}${CASE}-run${RUN}.png` });
res.beat = base.beat; res.love0 = base.love; res.say = base.say; res.sayBox = base.sayBox; res.choiceBox = base.choiceBox; res.legend = base.legend;
res.shown = base.ch.map((c, i) => `${i + 1}:${c.text}|chip=${c.chip}|def=${c.def}`);
res.timebar = base.timebar;
await ctx.close();
res.clicks = {};
for (let k = 0; k < base.ch.length; k++) {
  const { ctx, page } = await open();
  const b = await page.evaluate(LOOK);
  const text = b.ch[k].text;
  await page.locator('.db-choice').nth(k).click({ timeout: 5000 });
  await settle(page);
  const a = await page.evaluate(LOOK);
  res.clicks[text] = { slot: k + 1, loveAfter: a.love, pop: a.pop, nextBeat: a.beat, say: a.say.slice(0, 70) };
  if (k === 0) await page.screenshot({ path: `${OUT}${CASE}-run${RUN}-after-pick.png` });
  await ctx.close();
}
res.keys = {};
for (let k = 0; k < base.ch.length; k++) {
  const { ctx, page } = await open();
  const b = await page.evaluate(LOOK);
  await page.keyboard.press(String(k + 1));
  await settle(page);
  const a = await page.evaluate(LOOK);
  const hit = Object.entries(res.clicks).find(([, v]) => v.say === a.say.slice(0, 70))?.[0];
  res.keys[k + 1] = { labelOfKey: b.ch[k]?.label, routedTo: hit ?? '?', say: a.say.slice(0, 50) };
  await ctx.close();
}
if (CASE === 'timer') {
  const { ctx, page } = await open();
  const b = await page.evaluate(LOOK);
  await page.clock.runFor(5000);
  const mid = await page.evaluate(LOOK);
  res.midTimer = mid.timer; await page.screenshot({ path: `${OUT}${CASE}-run${RUN}-mid.png` });
  await page.clock.runFor(8500);
  await settle(page);
  const a = await page.evaluate(LOOK);
  res.timeout = { defaultText: b.ch.find((c) => c.def)?.text, loveAfter: a.love, pop: a.pop, nextBeat: a.beat, say: a.say.slice(0, 70) };
  await page.screenshot({ path: `${OUT}${CASE}-run${RUN}-timeout.png` });
  await ctx.close();
}
console.log(JSON.stringify(res, null, 1));
await browser.close();
