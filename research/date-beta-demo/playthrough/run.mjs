// run.mjs: demo playthrough. Fresh context per run, starts on the Logic page (index.html), clicks the Figur wordmark,
// then walks the date-beta story to an ending and back to scene 1. Every ending x both bento picks at 1920x1080,
// plus one path at 1024x768 and one with reducedMotion 'reduce'. Screenshots every beat; writes INDEX.md + results.json.
// usage: npm run build && npx vite preview --port 5481 --strictPort &   node research/date-beta-demo/playthrough/run.mjs http://localhost:5481
// Set LOGIC_QUERY (default '') to append a query to the Logic URL, e.g. '?demo'.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const BASE = process.argv[2] || 'http://localhost:5481';
const LOGIC_QUERY = process.env.LOGIC_QUERY ?? '?demo';
const OUT = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.join(OUT, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });

// Which button to press at each choice beat, per ending. null = let the timer run out.
const ENDINGS = {
  steeped: { 'door:2': 'Just one cup', 'cup:3': 'Drink' },
  'escape-win': { 'door:2': 'Just one cup', 'cup:3': 'Stand up', 'escape:13': 'Leave her house' },
  'escape-timeout': { 'door:2': 'Just one cup', 'cup:3': 'Stand up', 'escape:13': null },
  'leave-fu': { 'door:2': 'Say goodnight', 'leave:3': "FUCK YOU. I'm leaving" },
  'leave-yeah': { 'door:2': 'Say goodnight', 'leave:3': 'uhmmm yeah ig' },
};
const BENTO = { tamagoyaki: 'Take the tamagoyaki', umeboshi: 'Take the umeboshi' };

const runs = [];
for (const end of Object.keys(ENDINGS)) for (const b of Object.keys(BENTO)) runs.push({ name: `${end}__${b}`, end, bento: b, w: 1920, h: 1080 });
runs.push({ name: 'escape-win__tamagoyaki__1024', end: 'escape-win', bento: 'tamagoyaki', w: 1024, h: 768 });
runs.push({ name: 'leave-fu__umeboshi__rm', end: 'leave-fu', bento: 'umeboshi', w: 1920, h: 1080, rm: true });

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--autoplay-policy=user-gesture-required'] });
const results = [];

async function play(run) {
  const ctx = await browser.newContext({ viewport: { width: run.w, height: run.h }, reducedMotion: run.rm ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errs = []; // [{ at, msg }]
  let here = 'logic';
  page.on('pageerror', (e) => errs.push({ at: here, kind: 'pageerror', msg: e.message }));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push({ at: here, kind: m.type(), msg: m.text() }); });
  page.on('requestfailed', (r) => errs.push({ at: here, kind: 'requestfailed', msg: `${r.url()} ${r.failure()?.errorText}` }));
  page.on('response', (r) => { if (r.status() >= 400) errs.push({ at: here, kind: 'http' + r.status(), msg: r.url() }); });
  const beats = [];
  let n = 0;
  const shot = async (label, note = '', extra = {}) => {
    const file = `${run.name}/${String(n++).padStart(2, '0')}-${label.replace(/[^a-z0-9-]+/gi, '_')}.png`;
    fs.mkdirSync(path.join(SHOTS, run.name), { recursive: true });
    await page.screenshot({ path: path.join(SHOTS, file) });
    beats.push({ beat: label, shot: `shots/${file}`, note, ...extra });
  };

  await page.goto(`${BASE}/index.html${LOGIC_QUERY}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const dim = await page.evaluate(() => !!document.querySelector('.coach'));
  await shot('logic', dim ? 'coach tour visible' : '', { fail: dim ? 'intro tour on screen' : null });
  await page.click('h1.wordmark');
  await page.waitForTimeout(700);
  await shot('collapse');
  await page.waitForURL(/date-beta\.html/, { timeout: 15000 });
  here = 'date';
  await page.waitForFunction(() => document.documentElement.dataset.beat, null, { timeout: 10000 });
  const audio = await page.evaluate(() => new Promise((res) => setTimeout(() => res(document.documentElement.dataset.audio ?? 'n/a'), 400)));

  const plan = { 'rooftop:1': BENTO[run.bento], 'rooftop:6': 'Stay a minute', ...ENDINGS[run.end] };
  let prev = null, loops = 0, sawEnding = false;
  const t0 = Date.now();
  while (Date.now() - t0 < 240000) {
    const b = await page.evaluate(() => document.documentElement.dataset.beat);
    if (b !== prev) {
      if (sawEnding && b === 'rooftop:0') { here = b; await page.waitForTimeout(500); await shot('back-to-rooftop:0', 'returned to scene 1'); break; }
      prev = b; here = b; loops = 0;
      await page.waitForTimeout(run.rm ? 250 : 700);
      const check = await page.evaluate(() => {
        const bad = [];
        const vw = innerWidth, vh = innerHeight;
        // Text overflow = the glyphs of a line leave their box (or the screen). Decorations (pins, glow) are ignored.
        for (const box of document.querySelectorAll('.db-say, .db-choice')) {
          const line = box.querySelector('.line'); if (!line) continue;
          const rg = document.createRange(); rg.selectNodeContents(line);
          const t = rg.getBoundingClientRect(), r = box.getBoundingClientRect();
          const name = box.className.split(' ')[0];
          if (t.left < r.left - 1 || t.right > r.right + 1 || t.top < r.top - 1 || t.bottom > r.bottom + 1) bad.push(`${name} text leaves its box`);
          if (t.left < -1 || t.top < -1 || t.right > vw + 1 || t.bottom > vh + 1 || r.right > vw + 1 || r.bottom > vh + 1) bad.push(`${name} offscreen`);
          if (line.getClientRects().length > (name === 'db-say' ? 2 : 1) && rg.getClientRects().length > 0) {
            const rows = new Set([...rg.getClientRects()].map((x) => Math.round(x.top))); if (rows.size > (name === 'db-say' ? 2 : 1)) bad.push(`${name} wraps to ${rows.size} rows`);
          }
        }
        return { bad, text: document.querySelector('.db-say .line')?.textContent ?? '', ch: [...document.querySelectorAll('.db-choice')].map((c) => c.textContent) };
      });
      const beatErrs = errs.filter((e) => e.at === b && e.kind !== 'warning');
      const fail = [...check.bad, ...beatErrs.map((e) => `${e.kind}: ${e.msg}`)].join('; ') || null;
      await shot(b, [check.text, check.ch.length ? `[${check.ch.join(' | ')}]` : ''].filter(Boolean).join(' '), { fail });
      if (b === 'rooftop:0' && audio !== 'n/a') beats[beats.length - 1].note += ` audio=${audio}`;
    }
    const [scene, idx] = b.split(':');
    if (['steeped', 'escape-win', 'escape-timeout', 'leave-fu', 'leave-yeah'].includes(scene)) sawEnding = true;
    const choices = await page.$$('.db-choice');
    if (choices.length) {
      const want = sawEnding ? 'Back to start' : plan[b];
      if (want === null) { await page.waitForTimeout(500); continue; } // let the timer pick
      const btn = page.locator('.db-choice', { hasText: want ?? '' }).first();
      if (want === undefined) { await choices[0].click(); } else { await btn.click(); }
      await page.waitForTimeout(300);
      continue;
    }
    const auto = await page.evaluate(() => !!document.querySelector('.nexthint, .db-say .next'));
    // Click beats: click the stage. Auto beats: just wait (a click does nothing there).
    await page.mouse.click(run.w / 2, run.h * 0.35);
    await page.waitForTimeout(auto ? 400 : 500);
    if (++loops > 60) { beats.push({ beat: b, shot: '', note: 'stuck', fail: 'stuck: beat never advanced' }); break; }
  }
  // Esc-in-fullscreen check: once, on the default run.
  let escNote = null;
  if (run.name === 'steeped__tamagoyaki') {
    const before = await page.evaluate(() => document.documentElement.dataset.beat);
    await page.evaluate(() => document.documentElement.requestFullscreen().catch(() => {}));
    await page.waitForTimeout(400);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => document.documentElement.dataset.beat);
    escNote = `Esc in fullscreen: ${before} -> ${after}`;
  }
  await ctx.close();
  return { ...run, beats, errs, escNote, audio };
}

for (const run of runs) {
  process.stdout.write(`${run.name} ... `);
  try { const r = await play(run); results.push(r); console.log(`${r.beats.length} beats, ${r.beats.filter((x) => x.fail).length} fail, ${r.errs.length} console/net`); }
  catch (e) { console.log('CRASH', e.message); results.push({ ...run, beats: [], errs: [{ kind: 'crash', msg: e.message }] }); }
}
await browser.close();

fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
const md = ['# date-beta demo playthrough', '', `Base: ${BASE}. Entry: index.html${LOGIC_QUERY} -> click Figur -> date-beta. Contact sheet: contact-sheet.png`, '',
  '| run | beats | pass | fail | console/net |', '|---|---|---|---|---|',
  ...results.map((r) => `| ${r.name} | ${r.beats.length} | ${r.beats.filter((b) => !b.fail).length} | ${r.beats.filter((b) => b.fail).length} | ${r.errs.length} |`), ''];
for (const r of results) {
  md.push(`## ${r.name} (${r.w}x${r.h}${r.rm ? ', reduced motion' : ''})`, '');
  if (r.escNote) md.push(r.escNote, '');
  if (r.audio) md.push(`Audio context on arrival: ${r.audio}`, '');
  md.push('| beat | shot | result | note |', '|---|---|---|---|');
  for (const b of r.beats) md.push(`| ${b.beat} | ${b.shot ? `[png](${b.shot})` : ''} | ${b.fail ? 'FAIL' : 'pass'} | ${(b.fail ? b.fail + ' / ' : '') + (b.note || '').replace(/\|/g, '/')} |`);
  if (r.errs.length) { md.push('', 'Console / network:', ''); for (const e of r.errs) md.push(`- [${e.at}] ${e.kind}: ${e.msg}`); }
  md.push('');
}
fs.writeFileSync(path.join(OUT, 'INDEX.md'), md.join('\n'));
console.log('wrote INDEX.md');
