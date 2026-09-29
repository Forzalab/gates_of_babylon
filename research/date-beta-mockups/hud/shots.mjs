// HUD mockup shots: every variant x state at 1920x1080 (reduced motion = the static frame) + an overlap check.
// usage:  npx vite --port 5611 &   node research/date-beta-mockups/hud/shots.mjs [A|B|all] [state]   (base via HUD_BASE)
// Also: `node shots.mjs sheet` (contact sheet) and `node shots.mjs emotes` (emote legend).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.HUD_BASE || 'http://localhost:5611/research/date-beta-mockups/hud';
const want = process.argv[2] || 'all';
const only = process.argv[3];
export const STATES = ['goal', 'line', 'choice', 'plus', 'minus', 'none', 'win', 'low'];
const browser = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const errors = [];
const overlap = (a, b) => a && b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

async function open(url, h = 1080) {
  const page = await browser.newPage({ viewport: { width: 1920, height: h }, reducedMotion: 'reduce' });
  page.on('pageerror', (e) => errors.push(`${url}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${url}: ${m.text()}`); });
  page.on('requestfailed', (r) => errors.push(`${url}: failed ${r.url()}`));
  await page.goto(url);
  // a dev-server reload can land just after a file edit: wait it out and retry once
  try { await page.evaluate(() => window.HUD_READY || document.fonts.ready); } catch {
    await page.waitForLoadState('load');
    await page.waitForTimeout(500);
    await page.evaluate(() => window.HUD_READY || document.fonts.ready);
  }
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))));
  await page.waitForTimeout(250);
  return page;
}

if (want === 'sheet' || want === 'emotes') {
  const p = await open(`${BASE}/${want}.html`, want === 'sheet' ? 1200 : 1080);
  const h = await p.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  await p.setViewportSize({ width: 1920, height: h });
  await p.waitForTimeout(300);
  const file = want === 'sheet' ? 'hud-sheet.png' : 'emotes.png';
  await p.screenshot({ path: path.join(DIR, file), fullPage: true });
  console.log(file, h);
} else {
  for (const v of want === 'all' ? ['A', 'B'] : [want]) {
    for (const s of STATES) {
      if (only && s !== only) continue;
      const p = await open(`${BASE}/hud.html?v=${v}&s=${s}`);
      // overlap check: HUD parts vs the chips (outside the stage) and the dialogue chip / choices
      const r = await p.evaluate(() => {
        const box = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
        const all = (sel) => [...document.querySelectorAll(sel)].map(box);
        return { hud: all('.hud-a, .hud-b .lv-goal, .hud-b .lv-tube, .hud-b .lv-bulb, .hud-b-trail, .lv-pop .lv-delta, .lv-tell'),
          chips: all('.chrome a, .chrome button'), say: all('.db-say, .db-say .who'), choices: all('.db-choice'), cards: all('.hud-card, .hud-end') };
      });
      const bad = [];
      r.hud.forEach((h, i) => {
        r.chips.forEach((c) => overlap(h, c) && bad.push(`hud#${i} x chip`));
        r.say.forEach((c) => overlap(h, c) && bad.push(`hud#${i} x dialogue`));
        r.choices.forEach((c) => overlap(h, c) && bad.push(`hud#${i} x choice`));
        r.cards.forEach((c) => overlap(h, c) && bad.push(`hud#${i} x card`));
      });
      const file = `${v}-${s}.png`;
      await p.screenshot({ path: path.join(DIR, file) });
      console.log(file, bad.length ? `OVERLAP: ${bad.join(', ')}` : 'clear');
      if (bad.length) errors.push(`${v}-${s}: ${bad.join(', ')}`);
      await p.close();
    }
  }
}
await browser.close();
if (errors.length) { console.error('ERRORS:\n' + errors.join('\n')); process.exitCode = 1; }
