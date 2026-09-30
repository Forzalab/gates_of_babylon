// extra.mjs: settled end-card / goal-card frames (walk.mjs shoots 350 ms after a beat appears, mid fade-in), plus a check
// of what the scrollHeight > clientHeight flag on .db-say / .db-choice is measuring. Deep links: ?scene=&beat=&love=.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = pkg;
const BASE = process.argv[2] || 'http://localhost:5493';
const OUT = path.dirname(fileURLToPath(import.meta.url));
const RAW = process.env.RAW || path.join(OUT, 'raw');
const dir = path.join(RAW, 'extra');
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const out = {};
async function open(q, w = 1920, h = 1080) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await page.goto(`${BASE}/date-beta.html${q}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  return { ctx, page, errs };
}
for (const [name, q] of [['endcard-win-100', '?scene=steeped&beat=4&love=69'], ['endcard-almost-99', '?scene=steeped&beat=4&love=68'], ['endcard-almost-70', '?scene=steeped&beat=4&love=48'], ['endcard-low-0', '?scene=steeped&beat=4&love=0'], ['goal-card', ''], ['endcard-escape-timeout', '?scene=escape-timeout&beat=7&love=62'], ['endcard-escape-win', '?scene=escape-win&beat=6&love=59'], ['endcard-leave-fu', '?scene=leave-fu&beat=4&love=47']]) {
  const { ctx, page, errs } = await open(q);
  const info = await page.evaluate(() => ({ beat: document.documentElement.dataset.beat, end: document.querySelector('.hud-end')?.innerText.replace(/\s+/g, ' ') ?? null, goal: !!document.querySelector('.hud-card'), pct: document.querySelector('.lv-badge .lv-num')?.textContent }));
  await page.screenshot({ path: path.join(dir, `${name}.png`) });
  out[name] = { q, ...info, errs };
  await ctx.close();
}
// What does the overflow flag measure? rooftop:1 (choice beat) with and without the .pins decorations.
{
  const { ctx, page } = await open('?scene=rooftop&beat=1');
  out.overflowProbe = await page.evaluate(() => {
    const say = document.querySelector('.db-say'), ch = document.querySelector('.db-choice');
    const m = (e) => ({ sh: e.scrollHeight, ch: e.clientHeight, ov: getComputedStyle(e).overflow });
    const before = { say: m(say), choice: m(ch) };
    document.querySelectorAll('.pins, .db-chip, .db-deftag').forEach((p) => { p.style.display = 'none'; });
    const after = { say: m(say), choice: m(ch) };
    const pins = document.querySelector('.pins');
    return { before, after, pinsPos: pins ? getComputedStyle(pins).position : null };
  });
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'extra.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
