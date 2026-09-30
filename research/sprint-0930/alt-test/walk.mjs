// walk.mjs: alt's PR #27 (sprint/obbp) click-through tester. Facts only, no fixes.
// usage: node walk.mjs http://localhost:5493 [runName,runName]   (raw shots go to $RAW, default ./raw; post.py makes shots/)
// Runs are built from the ACTUAL scene graph (graph.json = packs applied in main.jsx PLAY order; see graph.mjs).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const BASE = process.argv[2] || 'http://localhost:5493';
const ONLY = process.argv[3] ? process.argv[3].split(',') : null;
const OUT = path.dirname(fileURLToPath(import.meta.url));
const RAW = process.env.RAW || path.join(OUT, 'raw');
const CONC = +(process.env.CONC || 3);
fs.mkdirSync(RAW, { recursive: true });

const graph = JSON.parse(fs.readFileSync(path.join(OUT, 'graph.json'), 'utf8'));
// Enumerate the choice beats (scene:idx) that route somewhere, from the real graph.
const routing = [];
for (const s of graph.scenes) s.beats.forEach((b, i) => { if (b.choices?.some((c) => c.go)) routing.push(`${s.id}:${i} -> ${b.choices.map((c) => c.go ?? '(next)').join(' / ')}`); });
const endings = graph.scenes.filter((s) => s.beats.some((b) => b.end)).map((s) => s.id);

// Overrides on top of the base strategy (base = highest-love pick, ties first, never the fake).
const ENDINGS = {
  steeped: { 'door:3': 'Just one cup', 'cup:3': 'Drink' },
  'escape-win': { 'door:3': 'Just one cup', 'cup:3': 'Stand up', game: 'win' },
  'escape-timeout': { 'door:3': 'Just one cup', 'cup:3': 'Stand up', game: 'lose' },
  'leave-fu': { 'door:3': 'Say goodnight', 'leave:3': "FUCK YOU. I'm leaving" },
  'leave-yeah': { 'door:3': 'Say goodnight', 'leave:3': 'uhmmm yeah ig' },
};
const BENTO = { tamagoyaki: 'Take the tamagoyaki', umeboshi: 'Take the umeboshi' };
const FOOD = { butter: 'Butter chicken', katsu: 'Katsu curry' };
const ERRAND = { groceries: 'Carry her groceries', library: 'Return her book' };

const runs = [];
for (const end of Object.keys(ENDINGS)) for (const food of Object.keys(FOOD)) {
  runs.push({ name: `${end}__${food}`, end, food, bento: 'tamagoyaki', errand: 'groceries', mode: 'plan', w: 1920, h: 1080 });
}
runs.push({ name: 'errand-groceries__steeped', end: 'steeped', food: 'butter', bento: 'umeboshi', errand: 'groceries', mode: 'plan', w: 1920, h: 1080 });
runs.push({ name: 'errand-library__steeped', end: 'steeped', food: 'katsu', bento: 'umeboshi', errand: 'library', mode: 'plan', w: 1920, h: 1080 });
runs.push({ name: 'all-hate', end: 'leave-fu', mode: 'hate', w: 1920, h: 1080 });
runs.push({ name: 'all-love', end: 'steeped', food: 'butter', bento: 'tamagoyaki', errand: 'library', mode: 'love', w: 1920, h: 1080 });
runs.push({ name: 'reduced-motion__steeped', end: 'steeped', food: 'butter', bento: 'tamagoyaki', errand: 'library', mode: 'plan', w: 1920, h: 1080, rm: true });
runs.push({ name: 'vp1024__escape-win', end: 'escape-win', food: 'katsu', bento: 'tamagoyaki', errand: 'groceries', mode: 'plan', w: 1024, h: 768 });
runs.push({ name: 'loop3__leave-yeah', end: 'leave-yeah', food: 'butter', bento: 'tamagoyaki', errand: 'groceries', mode: 'plan', w: 1920, h: 1080, loops: 3 });

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--autoplay-policy=user-gesture-required'] });

// One atomic look at the page. Everything the report needs comes from here.
const LOOK = () => {
  const d = document.documentElement.dataset;
  const q = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];
  const rect = (e) => { const r = e.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }; };
  const say = q('.db-say');
  const who = say?.querySelector('.who')?.textContent ?? '';
  const line = say?.querySelector('.line')?.innerText ?? '';
  const choices = qa('.db-choice').map((c) => ({
    text: c.querySelector('.line')?.innerText ?? c.innerText, chip: c.querySelector('.db-chip')?.textContent ?? null,
    chipCls: c.querySelector('.db-chip')?.className.replace('db-chip ', '') ?? null, side: (c.className.match(/\b(pink|purple|mid)\b/) || [])[1] ?? '?',
    disabled: c.disabled, deflt: c.classList.contains('is-default'), r: rect(c),
  }));
  const grey = qa('img').filter((i) => { try { const s = i.getAttribute('src') || ''; return s.startsWith('data:image/svg+xml') && decodeURIComponent(s).includes('BG-'); } catch { return false; } }).map((i) => i.getAttribute('src').slice(0, 60));
  const bodyText = document.body.innerText;
  const tokens = [...new Set(bodyText.match(/\{[A-Za-z.0-9]+\}/g) || [])];
  const over = [];
  for (const e of qa('.db-say, .db-say .line, .db-choice, .db-choice .line, .hud-card, .hud-end, .db-chip, .lv-pop, .lv-tell')) {
    if (e.scrollHeight > e.clientHeight + 2 && e.clientHeight > 0) over.push(`${e.className.split(' ')[0]} scrollH ${e.scrollHeight}>${e.clientHeight}`);
    else if (e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0 && getComputedStyle(e).display !== 'inline') over.push(`${e.className.split(' ')[0]} scrollW ${e.scrollWidth}>${e.clientWidth}`);
  }
  const vw = innerWidth, vh = innerHeight;
  const leaves = [];
  for (const box of qa('.db-say, .db-choice')) {
    const ln = box.querySelector('.line'); if (!ln) continue;
    const rg = document.createRange(); rg.selectNodeContents(ln);
    const t = rg.getBoundingClientRect(), r = box.getBoundingClientRect();
    if (t.left < r.left - 1 || t.right > r.right + 1 || t.top < r.top - 1 || t.bottom > r.bottom + 1) leaves.push(`${box.className.split(' ')[0]} glyphs leave box`);
    if (t.left < -1 || t.top < -1 || t.right > vw + 1 || t.bottom > vh + 1) leaves.push(`${box.className.split(' ')[0]} glyphs offscreen`);
  }
  // Nanda overlap: union of her svg's children vs dialogue / choices / pop.
  const nanda = q('svg.db-nanda');
  const ov = [];
  if (nanda) {
    const kids = [...nanda.children].filter((k) => k.getBoundingClientRect().width > 0 && k.tagName !== 'defs');
    let L = 1e9, T = 1e9, R = -1e9, B = -1e9;
    for (const k of kids) { const r = k.getBoundingClientRect(); L = Math.min(L, r.left); T = Math.min(T, r.top); R = Math.max(R, r.right); B = Math.max(B, r.bottom); }
    const nb = { l: L, t: T, r: R, b: B };
    const hit = (name, e) => { const r = e.getBoundingClientRect(); const w = Math.min(nb.r, r.right) - Math.max(nb.l, r.left), h = Math.min(nb.b, r.bottom) - Math.max(nb.t, r.top); if (w > 8 && h > 8) ov.push(`${name} ${Math.round(w)}x${Math.round(h)}`); };
    qa('.db-choice').forEach((e, i) => hit(`choice${i}`, e)); qa('.db-chip').forEach((e, i) => hit(`chip${i}`, e));
    if (say) hit('say', say); const pop = q('.lv-pop'); if (pop) hit('lv-pop', pop);
  }
  const meter = q('.lv-meter');
  const timerEl = q('.db-timer'), lgTime = q('.lg-time');
  return {
    beat: d.beat ?? null, who, line, choices, grey, tokens, over, leaves, nandaOverlap: ov,
    love: meter ? +meter.getAttribute('aria-valuenow') : null, goal: meter ? +meter.getAttribute('aria-valuemax') : null,
    pct: q('.lv-badge .lv-num')?.textContent ?? null, pop: q('.lv-pop')?.innerText.replace(/\s+/g, ' ') ?? null,
    timerBar: !!q('.db-timebar'), timerSecs: timerEl ? timerEl.textContent : (lgTime ? lgTime.textContent : null),
    game: q('.lg-root') ? { title: q('.lg-title')?.textContent, time: q('.lg-time')?.textContent, low: !!q('.lg-time.low'), pins: qa('.lg-pins i.on').length } : null,
    goalCard: !!q('.hud-card'), endCard: q('.hud-end') ? { cls: q('.hud-end').className, h2: q('.hud-end h2')?.textContent, kicker: q('.hud-end .kicker')?.textContent, num: q('.hud-end .lv-num')?.textContent, sub: q('.hud-end .sub')?.textContent, btn: q('.hud-end .hud-next')?.innerText } : null,
    fx: q('.db-fx')?.className.replace('db-fx ', '') ?? null, fxText: q('.db-fx .fx-card')?.innerText.replace(/\s+/g, ' ') ?? null,
    scene: q('.stage')?.dataset.scene ?? null, nextBtn: !!q('.hud-next'), hint: !!q('.db-hint'),
    visible: bodyText.replace(/\s+/g, ' ').slice(0, 400),
  };
};

const keyOf = (s) => [s.beat, s.who, s.line, s.choices.map((c) => c.text).join('~'), s.goalCard, s.endCard?.h2, s.pop, s.game ? `${s.game.title}|${s.game.low}|${s.game.pins}` : '', s.fx].join('|');

async function play(run) {
  const ctx = await browser.newContext({ viewport: { width: run.w, height: run.h }, reducedMotion: run.rm ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errs = [];
  let here = 'logic';
  page.on('pageerror', (e) => errs.push({ at: here, kind: 'pageerror', msg: e.message }));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push({ at: here, kind: m.type(), msg: m.text() }); });
  page.on('requestfailed', (r) => errs.push({ at: here, kind: 'requestfailed', msg: `${r.url()} ${r.failure()?.errorText}` }));
  page.on('response', (r) => { if (r.status() >= 400) errs.push({ at: here, kind: 'http' + r.status(), msg: r.url() }); });
  const dir = path.join(RAW, run.name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const beats = [];
  let n = 0, loopNo = 1;
  const record = async (s) => {
    const label = `${s.scene ?? 'x'}-${(s.beat ?? 'x').replace(/[^a-z0-9]+/gi, '_')}`;
    const file = `${String(n++).padStart(3, '0')}-${loopNo > 1 ? `L${loopNo}-` : ''}${label}.png`;
    await page.screenshot({ path: path.join(dir, file) });
    const beatErrs = errs.filter((e) => e.at === s.beat + '#' + loopNo && !e._used).map((e) => { e._used = true; return `${e.kind}: ${e.msg}`; });
    beats.push({ ...s, loop: loopNo, shot: file, errs: beatErrs });
  };

  if (run.name.startsWith('vp1024') || true) { /* entry identical for all runs */ }
  await page.goto(`${BASE}/index.html?demo`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.click('h1.wordmark');
  await page.waitForURL(/date-beta\.html/, { timeout: 15000 });
  here = 'date';
  await page.waitForFunction(() => document.documentElement.dataset.beat, null, { timeout: 15000 });

  const plan = { ...ENDINGS[run.end] };
  if (run.bento) plan['rooftop:1'] = BENTO[run.bento];
  if (run.food) plan['hungry:0'] = FOOD[run.food];
  if (run.errand) plan['park:4'] = ERRAND[run.errand];
  const loops = run.loops || 1;
  let prevKey = null, sawEnding = false, stillSince = Date.now(), hung = null, gameHandled = false, lastAct = 0;
  const t0 = Date.now();
  while (Date.now() - t0 < 420000) {
    let s = await page.evaluate(LOOK);
    const k = keyOf(s);
    if (k !== prevKey) {
      // settle, then look again (auto beats may have moved on; the second look is what we record)
      await page.waitForTimeout(run.rm ? 200 : 350);
      s = await page.evaluate(LOOK);
      const k2 = keyOf(s);
      prevKey = k2; stillSince = Date.now(); here = s.beat + '#' + loopNo; gameHandled = gameHandled && !!s.game;
      if (sawEnding && s.beat === 'rooftop:0' && !s.goalCard === false) { /* fallthrough to normal record */ }
      await record(s);
      if (s.endCard) sawEnding = true;
      if (sawEnding && s.beat === 'rooftop:0') {
        // came back to the start
        if (loopNo >= loops) break;
        loopNo++; sawEnding = false;
        if (loopNo === 3) { await page.goto(`${BASE}/date-beta.html`, { waitUntil: 'networkidle' }); await page.waitForFunction(() => document.documentElement.dataset.beat, null, { timeout: 15000 }); prevKey = null; }
        continue;
      }
    }
    if (Date.now() - stillSince > (s.game ? 100000 : 60000)) { hung = `${s.beat}`; beats.push({ beat: s.beat, loop: loopNo, hung: true, line: '(no change for a long time)', choices: [], grey: [], tokens: [], over: [], leaves: [], nandaOverlap: [], errs: [], shot: '' }); break; }

    // act
    if (s.game) {
      if (plan.game === 'win' && !gameHandled) {
        gameHandled = true;
        const kinds = await page.$$eval('.lg-grid button', (bs) => bs.map((b) => b.dataset.kind));
        const byKind = {};
        kinds.forEach((kk, i) => (byKind[kk] ??= []).push(i));
        const tiles = await page.$$('.lg-grid button');
        let pairsDone = 0;
        for (const idxs of Object.values(byKind)) for (let j = 0; j < idxs.length; j += 2) {
          await tiles[idxs[j]].click(); await page.waitForTimeout(80); await tiles[idxs[j + 1]].click(); await page.waitForTimeout(120);
          if (++pairsDone === 4) { const m = await page.evaluate(LOOK); prevKey = keyOf(m); await record(m); }
        }
      } else await page.waitForTimeout(400);
      continue;
    }
    if (s.endCard) { await page.waitForTimeout(1500); await page.screenshot({ path: path.join(dir, `zz-settled-endcard-L${loopNo}.png`) }); await page.waitForTimeout(100); const b = page.locator('.hud-end .hud-next'); await b.click().catch(() => {}); await page.waitForTimeout(400); continue; }
    if (s.goalCard) { await page.waitForTimeout(1500); if (loopNo === 1) await page.screenshot({ path: path.join(dir, 'zz-settled-goalcard.png') }); await page.locator('.hud-card .hud-next').click().catch(() => {}); await page.waitForTimeout(400); continue; }
    if (s.choices.length) {
      await page.waitForTimeout(run.rm ? 100 : 250);
      let want = plan[s.beat];
      let idx = -1;
      if (want) idx = s.choices.findIndex((c) => c.text.includes(want));
      if (idx < 0 && run.mode === 'hate') {
        const lv = s.choices.map((c) => (c.chipCls === 'down' ? -1 : 0));
        const fakeIdx = s.choices.findIndex((c) => /Run home alone/.test(c.text));
        idx = fakeIdx >= 0 ? fakeIdx : (lv.includes(-1) ? s.choices.map((c, i) => [Math.min(0, +((c.chip || '').replace(/[^\d]/g, '')) * (c.chipCls === 'down' ? -1 : 1)), i]).sort((a, b) => a[0] - b[0])[0][1] : 0);
      }
      if (idx < 0) { // highest love; the chip text is the sign + magnitude
        const val = (c) => { const m = (c.chip || '').match(/(\d+)/); return m ? (c.chipCls === 'down' ? -1 : 1) * +m[1] : 0; };
        idx = 0; s.choices.forEach((c, i) => { if (val(c) > val(s.choices[idx])) idx = i; });
      }
      await page.locator('.db-choice').nth(idx).click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(300);
      continue;
    }
    // click beat (or auto beat): NEXT pill if any, else a click on the stage
    if (Date.now() - lastAct < 600) { await page.waitForTimeout(150); continue; }
    lastAct = Date.now();
    const nb = page.locator('.hud-next').first();
    if (await nb.count()) await nb.click({ timeout: 2000 }).catch(() => {}); else await page.mouse.click(run.w / 2, run.h * 0.35);
    await page.waitForTimeout(150);
  }
  await ctx.close();
  return { ...run, beats, errs, hung };
}

const todo = runs.filter((r) => !ONLY || ONLY.includes(r.name));
const results = [];
let cursor = 0;
async function worker() {
  while (cursor < todo.length) {
    const run = todo[cursor++];
    const t = Date.now();
    try {
      const r = await play(run);
      results.push(r);
      console.log(`${run.name}: ${r.beats.length} beats, ${r.errs.length} console/net, hung=${r.hung} (${Math.round((Date.now() - t) / 1000)}s)`);
    } catch (e) { console.log(`${run.name}: CRASH ${e.message}`); results.push({ ...run, beats: [], errs: [{ at: 'harness', kind: 'crash', msg: e.message }], hung: 'CRASH' }); }
    fs.writeFileSync(path.join(OUT, `results${ONLY ? '-part' : ''}.json`), JSON.stringify({ routing, endings, results }, null, 1));
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
await browser.close();
console.log('done');
