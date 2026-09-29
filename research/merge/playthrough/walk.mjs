// walk.mjs: derived from research/date-beta-demo/playthrough/run.mjs (main). Two threads in parallel:
// T1 main (argv[2], default :5491) -> ./main/, T2 merge preview (argv[3], default :5492) -> ./merge/.
// usage: node research/merge/playthrough/walk.mjs [mainURL] [mergeURL]
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const THREADS = [
  { name: 'main', base: process.argv[2] || 'http://localhost:5491' },
  { name: 'merge', base: process.argv[3] || 'http://localhost:5492' },
];
const LOGIC_QUERY = process.env.LOGIC_QUERY ?? '?demo';
const OUT = path.dirname(fileURLToPath(import.meta.url));
const HUNG_MS = 180000;

// Choice button TEXT per ending (matched by text, so an extra beat in front does not matter). null = let the timer run out.
const ENDINGS = {
  steeped: { door: 'Just one cup', cup: 'Drink' },
  'escape-win': { door: 'Just one cup', cup: 'Stand up', escape: 'Leave her house' },
  'escape-timeout': { door: 'Just one cup', cup: 'Stand up', escape: null },
  'leave-fu': { door: 'Say goodnight', leave: "FUCK YOU. I'm leaving" },
  'leave-yeah': { door: 'Say goodnight', leave: 'uhmmm yeah ig' },
};
const BENTO = { tamagoyaki: 'Take the tamagoyaki', umeboshi: 'Take the umeboshi' };
const RUNS = [
  ...Object.keys(ENDINGS).map((end) => ({ name: `${end}__tamagoyaki`, end, bento: 'tamagoyaki', w: 1920, h: 1080 })),
  { name: 'leave-fu__umeboshi__rm', end: 'leave-fu', bento: 'umeboshi', w: 1920, h: 1080, rm: true },
];

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--autoplay-policy=user-gesture-required'] });

async function play(th, run) {
  const SHOTS = path.join(OUT, th.name);
  const ctx = await browser.newContext({ viewport: { width: run.w, height: run.h }, reducedMotion: run.rm ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errs = [];
  let here = 'logic';
  page.on('pageerror', (e) => errs.push({ at: here, kind: 'pageerror', msg: e.message }));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push({ at: here, kind: m.type(), msg: m.text() }); });
  page.on('requestfailed', (r) => errs.push({ at: here, kind: 'requestfailed', msg: `${r.url()} ${r.failure()?.errorText}` }));
  page.on('response', (r) => { if (r.status() >= 400) errs.push({ at: here, kind: 'http' + r.status(), msg: r.url() }); });
  const beats = [];
  let n = 0, hung = null;
  const shot = async (label, extra = {}) => {
    const file = `${run.name}/${String(n++).padStart(2, '0')}-${label.replace(/[^a-z0-9-]+/gi, '-')}.png`;
    fs.mkdirSync(path.join(SHOTS, run.name), { recursive: true });
    await page.screenshot({ path: path.join(SHOTS, file) });
    const st = await page.evaluate(() => ({
      greybox: [...document.querySelectorAll('img')].some((i) => (i.getAttribute('src') || '').startsWith('data:image/svg+xml') && /BG-/.test(decodeURIComponent(i.getAttribute('src') || ''))),
      sfx: document.documentElement.dataset.sfx ?? null,
      text: document.querySelector('.db-say .line')?.textContent ?? '',
      ch: [...document.querySelectorAll('.db-choice')].map((c) => c.textContent),
    }));
    beats.push({ beat: label, shot: `${th.name}/${file}`, ...st, ...extra });
  };

  await page.goto(`${th.base}/index.html${LOGIC_QUERY}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  await page.click('h1.wordmark');
  await page.waitForTimeout(700);
  await page.waitForURL(/date-beta\.html/, { timeout: 15000 });
  here = 'date';
  await page.waitForFunction(() => document.documentElement.dataset.beat, null, { timeout: 10000 });

  let prev = null, loops = 0, sawEnding = false;
  const t0 = Date.now();
  while (true) {
    if (Date.now() - t0 > HUNG_MS) { hung = `HUNG at ${prev}`; break; }
    const b = await page.evaluate(() => document.documentElement.dataset.beat);
    if (b !== prev) {
      if (sawEnding && b === 'rooftop:0') { here = b; await page.waitForTimeout(500); await shot('back-to-rooftop:0'); break; }
      prev = b; here = b; loops = 0;
      await page.waitForTimeout(run.rm ? 250 : 700);
      const beatErrs = errs.filter((e) => e.at === b);
      await shot(b.replace(':', '-'), { scene: b.split(':')[0], idx: b.split(':')[1], id: b, errs: beatErrs.length });
    }
    const [scene] = b.split(':');
    if (['steeped', 'escape-win', 'escape-timeout', 'leave-fu', 'leave-yeah'].includes(scene)) sawEnding = true;
    const choices = await page.$$('.db-choice');
    if (choices.length) {
      const texts = await page.$$eval('.db-choice', (els) => els.map((e) => e.textContent));
      let want;
      if (sawEnding) want = 'Back to start';
      else if (texts.some((t) => t.includes('Take the'))) want = BENTO[run.bento];
      else if (texts.some((t) => t.includes('Stay a minute'))) want = 'Stay a minute';
      else want = ENDINGS[run.end][scene]; // undefined -> first button
      if (want === null && !texts.some((t) => t.includes('Leave her house'))) want = undefined; // timer only at the final escape choice
      if (want === null) { await page.waitForTimeout(500); continue; }
      if (want === undefined || !texts.some((t) => t.includes(want))) await choices[0].click();
      else await page.locator('.db-choice', { hasText: want }).first().click();
      await page.waitForTimeout(300);
      continue;
    }
    const auto = await page.evaluate(() => !!document.querySelector('.nexthint, .db-say .next'));
    await page.mouse.click(run.w / 2, run.h * 0.35);
    await page.waitForTimeout(auto ? 400 : 500);
    if (++loops > 60) { hung = `HUNG at ${b} (stuck: beat never advanced)`; break; }
  }
  await ctx.close();
  return { ...run, thread: th.name, beats, errs, hung };
}

async function thread(th) {
  const results = [];
  for (const run of RUNS) {
    process.stdout.write(`[${th.name}] ${run.name} start\n`);
    try { const r = await play(th, run); results.push(r); console.log(`[${th.name}] ${run.name}: ${r.beats.length} beats, ${r.errs.length} errs${r.hung ? ', ' + r.hung : ''}`); }
    catch (e) { console.log(`[${th.name}] ${run.name} CRASH ${e.message}`); results.push({ ...run, thread: th.name, beats: [], errs: [{ at: '-', kind: 'crash', msg: e.message }], hung: null }); }
  }
  fs.mkdirSync(path.join(OUT, th.name), { recursive: true });
  fs.writeFileSync(path.join(OUT, `results-${th.name}.json`), JSON.stringify(results, null, 1));
  return results;
}

await Promise.all(THREADS.map(thread));
await browser.close();
console.log('done');
