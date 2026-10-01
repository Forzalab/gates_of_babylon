// shots.mjs: rain-fx shots of every affected beat (+ one reduced-motion shot) and the text checks (DOM text, mark/text overlap).
// node research/sprint-0930/rain-fx/shots.mjs [base]   (dev server on 5211)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = pkg;
const BASE = process.argv[2] || 'http://localhost:5211';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
fs.mkdirSync(OUT, { recursive: true });
const SHOTS = [['v2-rain-0-crossing', 'v2-rain', 0], ['v2-rain-1-umbrella', 'v2-rain', 1], ['v2-rain-2-alley', 'v2-rain', 2], ['v2-rain-3-eave', 'v2-rain', 3],
  ['v2-rain-4-stopping', 'v2-rain', 4], ['v2-train-8-platform', 'v2-train', 8], ['escape-win-6-night', 'escape-win', 6], ['v2-rain-1-umbrella-rm', 'v2-rain', 1, '&still']];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const out = [];
for (const [name, scene, beat, extra = ''] of (process.env.ONLY ? SHOTS.filter((s) => s[0].includes(process.env.ONLY)) : SHOTS)) {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(`${BASE}/date-beta.html?scene=${scene}&beat=${beat}&seed=7${extra}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const info = await page.evaluate(() => {
    const ov = document.querySelector('.rn-overlay'), wet = document.querySelector('.rn-wet');
    return { rain: ov?.dataset.rain ?? null, frames: ov?.dataset.frames ?? null, marks: wet?.dataset.marks ?? null, umbrella: !!document.querySelector('.rn-umb'),
      // every wet mark's box vs every text box (screen px): must be 0
      overlap: (() => {
        const T = [...document.querySelectorAll('.db-say .line, .db-say .who, .db-choice .line, .db-chip, .hud-next, .db-deftag')].map((e) => e.getBoundingClientRect());
        const M = [...document.querySelectorAll('.rn-wet > g')].map((e) => e.getBoundingClientRect());
        return M.filter((m) => T.some((t) => m.left < t.right && m.right > t.left && m.top < t.bottom && m.bottom > t.top)).length;
      })(),
      boxes: [...document.querySelectorAll('.db-say, .db-choice')].map((e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round); }),
      text: [...document.querySelectorAll('.db-say .line, .db-choice .line')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean) };
  });
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  out.push({ name, scene, beat, ...info, errs });
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
