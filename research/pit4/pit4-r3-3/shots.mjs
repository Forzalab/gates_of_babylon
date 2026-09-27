// usage: node research/pit4/pit4-r3-3/shots.mjs http://localhost:PORT
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = pkg;
const BASE = process.argv[2];
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];
const shots = [['gate', ''], ['next', '&next=1'], ['gate-clean', '&clean=1']];
for (const [n, q] of shots) for (const [w, h] of [[1440, 810], [1024, 768]]) for (const rm of ['no-preference', 'reduce']) {
  if (n === 'gate-clean' && rm !== 'reduce') continue;
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: rm });
  p.on('pageerror', (e) => errors.push(`${n} ${w}: ${e.message}`));
  p.on('console', (m) => m.type() === 'error' && errors.push(`${n} ${w} console: ${m.text()}`));
  p.on('response', (r) => r.status() >= 400 && errors.push(`${n} ${w} ${r.status()} ${r.url()}`));
  await p.goto(`${BASE}/date.html?v=h3${q}`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(rm === 'reduce' ? 500 : 3500);
  const f = `h3-${n}-${w}${rm === 'reduce' ? '-still' : ''}.png`;
  await p.screenshot({ path: path.join(OUT, f) });
  const fit = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth,
    m: (() => { const r = document.querySelector('.modal')?.getBoundingClientRect(); return r && [r.left, r.top, r.right, r.bottom].map(Math.round); })() }));
  console.log(f, JSON.stringify(fit));
  await p.close();
}
for (const rm of ['reduce', 'no-preference']) { // reduced motion is the graded default
  const p = await b.newPage({ viewport: { width: 1440, height: 810 }, reducedMotion: rm });
  await p.goto(`${BASE}/date.html?v=h3`); await p.waitForTimeout(1200);
  await p.click('.btn.hot.wide'); await p.waitForURL(/next=1/); console.log(rm, 'enter ->', p.url());
  await p.waitForTimeout(800);
  await p.click('.card:nth-child(1) .like'); await p.waitForSelector('.learned'); await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(OUT, `h3-next-match-1440${rm === 'reduce' ? '-still' : ''}.png`) });
  await p.click('.lw');
  await p.click('text=BACK TO GATE'); await p.waitForURL(/v=h3$/); console.log(rm, 'back ->', p.url());
  await p.close();
}
await b.close();
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : '0 page errors');
