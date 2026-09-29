// h1 shots: REDUCED MOTION FIRST (the graded experience), then motion on. Gate, &next=1, &clean=1, plus K7 (NO THANKS
// hovered: teleport + "fine." under reduced motion; 4 hovers with motion) and the >=75% match window docked in the still.
// usage: node research/pit4/pit4-r3-1/shots.mjs http://localhost:PORT
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = pkg;
const BASE = process.argv[2];
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];
const box = (s) => `(() => { const r = document.querySelector('${s}')?.getBoundingClientRect(); return r && [r.left, r.top, r.right, r.bottom].map(Math.round); })()`;
async function page(w, h, rm, q, n) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: rm });
  p.on('pageerror', (e) => errors.push(`${n}: ${e.message}`));
  p.on('console', (m) => m.type() === 'error' && errors.push(`${n} console: ${m.text()}`));
  p.on('response', (r) => r.status() >= 400 && errors.push(`${n} ${r.status()} ${r.url()}`));
  await p.goto(`${BASE}/date-aleph.html?v=h1${q}`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(rm === 'reduce' ? 600 : 3500);
  return p;
}
const shot = async (p, f) => {
  await p.screenshot({ path: path.join(OUT, f) });
  const fit = await p.evaluate(`({ sw: document.documentElement.scrollWidth, iw: innerWidth, m: ${box('.modal')}, plate: ${box('.plate')}, warn: ${box('.w1')}, flee: ${box('.flee')}, anim: document.getAnimations().length })`);
  console.log(f, JSON.stringify(fit));
};
for (const rm of ['reduce', 'no-preference']) for (const [w, h] of [[1440, 810], [1024, 768]]) {
  const sfx = rm === 'reduce' ? '-still' : '';
  for (const [n, q] of [['gate', ''], ['next', '&next=1'], ['gate-clean', '&clean=1']]) {
    if (n === 'gate-clean' && rm !== 'reduce') continue;
    const p = await page(w, h, rm, q, `${n}-${w}${sfx}`);
    await shot(p, `h1-${n}-${w}${sfx}.png`);
    if (n === 'gate') { // K7
      const tries = rm === 'reduce' ? 1 : 4;
      for (let k = 0; k < tries; k++) {
        const r = await p.locator('.flee').boundingBox();
        await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2, { steps: 3 });
        await p.waitForTimeout(rm === 'reduce' ? 50 : 300);
        await p.mouse.move(5, 5);
      }
      await p.waitForTimeout(rm === 'reduce' ? 50 : 700);
      await shot(p, `h1-k7-${w}${sfx}.png`);
    }
    if (n === 'next') { // a >=75% heart opens the docked window
      await p.click('.card:nth-child(1) .like');
      await p.waitForTimeout(rm === 'reduce' ? 100 : 500);
      await shot(p, `h1-next-match-${w}${sfx}.png`);
    }
    await p.close();
  }
}
await b.close();
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : '0 page errors');
