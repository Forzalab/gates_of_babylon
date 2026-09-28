// research/game/dogfood.mjs: re-runs the two blind-tester scenarios, seeded so before/after are comparable.
// node research/game/dogfood.mjs <port> <before|after>
//  baby:    1440x810, 120 random clicks/double-clicks/drags (some off-screen) on ?game=1 and ?canvas=1
//  grandpa: 1024x768, first look at ?game=1, a few deliberate taps, a HURT, the canvas
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const [PORT = 5391, TAG = 'after'] = process.argv.slice(2);
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dogfood', TAG);
fs.mkdirSync(OUT, { recursive: true });
const URL = `http://localhost:${PORT}/date-aleph.html`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let s = 12345; const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
const errs = [];
const RM = TAG === 'before' ? 'no-preference' : 'reduce'; // the graded mode is reduced motion
const br = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const report = {};

for (const q of ['game=1', 'canvas=1']) { // baby
  const p = await br.newPage({ viewport: { width: 1440, height: 810 }, reducedMotion: RM });
  p.on('pageerror', (e) => errs.push(`baby ${q}: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(`baby ${q} console: ${m.text()}`); });
  await p.goto(`${URL}?${q}&seed=5`); await sleep(1500);
  await p.screenshot({ path: `${OUT}/baby-${q}-0.png` });
  for (let i = 0; i < 120; i++) {
    const x = rnd() * 1440, y = rnd() * 810, k = i % 4;
    if (k === 0) await p.mouse.click(x, y);
    else if (k === 1) await p.mouse.dblclick(x, y);
    else { await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(k === 3 ? -50 : rnd() * 1440, k === 3 ? 900 : rnd() * 810, { steps: 6 }); await p.mouse.up(); }
    if (i % 30 === 29) await p.screenshot({ path: `${OUT}/baby-${q}-${i + 1}.png` });
  }
  report[`baby ${q}`] = { notices: await p.locator('[data-testid=notice]').count(), overGrid: await p.locator('.fx.approval, .fx.bag, .fx.hurtcap, .fx.toast').count(), url: p.url().replace(/^.*\//, ''), text: (await p.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 160) };
  await p.close();
}

{ // grandpa
  const p = await br.newPage({ viewport: { width: 1024, height: 768 }, reducedMotion: RM });
  p.on('pageerror', (e) => errs.push(`grandpa: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(`grandpa console: ${m.text()}`); });
  await p.goto(`${URL}?game=1&seed=11`); await sleep(1500);
  report.grandpaStart = { howto: await p.locator('[data-testid=howto]').count(), demo: await p.locator('.demo').count(), bagFull: await p.locator('.fullline').count() };
  await p.screenshot({ path: `${OUT}/grandpa-game-0.png` });
  const bb = await p.locator('[data-testid=board]').boundingBox(); const cell = bb.width / 7;
  const tap = async (c) => { await p.mouse.click(bb.x + cell * (c + 0.5), bb.y + bb.height * 0.6); await sleep(1400); };
  await tap(0); await p.screenshot({ path: `${OUT}/grandpa-game-1.png` });
  await tap(1); await tap(2); await tap(1); await p.screenshot({ path: `${OUT}/grandpa-game-2.png` });
  await tap(5); await tap(6); await tap(5); await sleep(300); await p.screenshot({ path: `${OUT}/grandpa-game-3.png` });
  // drag off the board: should shake + refuse
  await p.mouse.move(bb.x + cell, bb.y + 30); await p.mouse.down(); await p.mouse.move(20, 400, { steps: 5 }); await p.mouse.up(); await sleep(120);
  await p.screenshot({ path: `${OUT}/grandpa-game-4-offboard.png` });
  report.grandpaHowto = await p.locator('[data-testid=howto]').count();
  report.grandpa = JSON.stringify(await p.evaluate(() => window.__bag?.state().counts));
  await p.goto(`${URL}?canvas=1`); await sleep(800);
  await p.screenshot({ path: `${OUT}/grandpa-canvas-0.png` });
  await p.close();
}
console.log(JSON.stringify(report, null, 1));
console.log('errors:', errs.length ? errs.join('\n') : 'none');
await br.close();
