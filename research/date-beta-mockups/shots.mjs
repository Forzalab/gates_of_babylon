// shots.mjs — Playwright screenshots of every mockup board at 1920x1080 (+ effect states + reduced-motion frames).
// usage:  npx vite --port 5490 &   node research/date-beta-mockups/shots.mjs [A|B|C|all] [page]   (base URL via SHOTS_BASE)
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const DIR = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.SHOTS_BASE || 'http://localhost:5490/research/date-beta-mockups';
const want = process.argv[2] || 'all';
const onlyPage = process.argv[3];
const VARIANTS = want === 'all' ? ['A', 'B', 'C'] : [want];
const PAGES = ['ui', 'sprites', 'sheet', 'scenes', 'fx'];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];

async function open(url, rm = false) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: rm ? 'reduce' : 'no-preference' });
  page.on('pageerror', (e) => errors.push(`${url}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${url}: ${m.type()} ${m.text()}`); });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  return page;
}

for (const v of VARIANTS) {
  const out = path.join(DIR, v, 'shots');
  for (const pg of PAGES) {
    if (onlyPage && pg !== onlyPage) continue;
    const probe = await open(`${BASE}/${v}/${pg}.html`);
    const n = await probe.evaluate(() => document.querySelectorAll('.board').length);
    const extras = await probe.evaluate(() => (window.SHOTS || []).map((s) => ({ ...s, run: undefined })));
    await probe.close();
    for (let b = 1; b <= n; b++) {
      const p = await open(`${BASE}/${v}/${pg}.html?b=${b}`);
      const file = `${pg}-${String(b).padStart(2, '0')}.png`;
      await p.screenshot({ path: path.join(out, file) });
      console.log(v, file);
      await p.close();
    }
    // extra states declared by the page: window.SHOTS = [{name, b, rm, run: 'fnName', wait}]
    for (const s of extras) {
      const p = await open(`${BASE}/${v}/${pg}.html?b=${s.b}${s.rm ? '&still' : ''}`, s.rm);
      if (s.fn) await p.evaluate((fn) => window[fn](), s.fn);
      await p.waitForTimeout(s.wait || 0);
      const file = `${pg}-${s.name}.png`;
      await p.screenshot({ path: path.join(out, file) });
      console.log(v, file);
      await p.close();
    }
  }
}
await browser.close();
if (errors.length) { console.error('ERRORS:\n' + errors.join('\n')); process.exitCode = 1; }
