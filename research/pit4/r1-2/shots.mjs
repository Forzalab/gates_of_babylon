// shots.mjs: f2 gate + &next=1 at 1440x810 and 1024x768, reduced-motion stills, &clean=1, a match state, and metrics.
// usage: node research/pit4/r1-2/shots.mjs http://localhost:PORT
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const BASE = process.argv[2];
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];
const open = async (w, h, q, rm = 'no-preference') => {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: rm });
  page.on('pageerror', (e) => errors.push(`${q} ${w}: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && errors.push(`${q} ${w} console: ${m.text()}`));
  page.on('requestfailed', (r) => errors.push(`${q} ${w} failed: ${r.url()}`));
  page.on('response', (r) => r.status() >= 400 && errors.push(`${q} ${w} ${r.status()}: ${r.url()}`));
  await page.goto(`${BASE}/date.html?${q}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(rm === 'reduce' ? 500 : 3500);
  return page;
};
const metrics = (page) => page.evaluate(() => {
  const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; };
  // text/button overflow check
  const over = [...document.querySelectorAll('.f2-btn, .f2-chat p, .f2-fine, .f2-meter span, .f2-card')].filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.className + ':' + e.textContent.slice(0, 20));
  return { W: innerWidth, H: innerHeight, sw: document.documentElement.scrollWidth, modal: r('.f2-modal'), sign: r('.f2-sign'), warn: r('.f2-warn'), chat: r('.f2-slot'),
    btns: r('.f2-btns'), tile0: r('.grid .tile'), tile11: r('.grid .tile:nth-child(12)'), pile: r('.pile'), deck: r('.f2-deck'), over };
});
for (const [w, h] of [[1440, 810], [1024, 768]]) {
  for (const [name, q] of [['gate', 'v=f2'], ['next', 'v=f2&next=1']]) {
    const page = await open(w, h, q);
    await page.screenshot({ path: path.join(OUT, `f2-${name}-${w}.png`) });
    console.log(name, w, JSON.stringify(await metrics(page)));
    await page.close();
  }
}
for (const [name, q] of [['gate', 'v=f2'], ['next', 'v=f2&next=1']]) {
  let page = await open(1440, 810, q, 'reduce');
  await page.screenshot({ path: path.join(OUT, `f2-${name}-1440-still.png`) }); await page.close();
  page = await open(1440, 810, q + '&clean=1&still=1');
  await page.screenshot({ path: path.join(OUT, `f2-${name}-1440-clean.png`) }); await page.close();
}
// interactions: hover OR (bar 75%), click AND -> next; swipe: right on OR (match), then right on NAND via keys
let page = await open(1440, 810, 'v=f2');
await page.hover('.f2-btn:nth-child(2)'); await page.waitForTimeout(600);
console.log('hover OR ->', await page.textContent('.f2-meter span'));
await page.screenshot({ path: path.join(OUT, 'f2-gate-1440-hoverOR.png') });
await page.click('.f2-btn:nth-child(3)'); await page.waitForURL(/next=1/);
console.log('XOR:ENTER ->', page.url());
await page.close();
page = await open(1440, 810, 'v=f2&next=1&you=AND');
const card = await page.$('.f2-card.top'); const b = await card.boundingBox();
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down();
await page.mouse.move(b.x + b.width / 2 + 90, b.y + b.height / 2, { steps: 5 });
await page.screenshot({ path: path.join(OUT, 'f2-next-1440-drag.png') });
await page.mouse.move(b.x + b.width / 2 - 200, b.y + b.height / 2, { steps: 5 }); await page.mouse.up(); // NOPE on NAND
await page.waitForTimeout(700);
console.log('after nope:', await page.textContent('.f2-card.top h2'));
await page.keyboard.press('ArrowRight'); await page.waitForTimeout(900); // OR vs AND = 50% -> match
console.log('result:', await page.textContent('.f2-result h1'), await page.textContent('.f2-result .f2-fine'));
await page.screenshot({ path: path.join(OUT, 'f2-next-1440-match.png') });
await page.click('.f2-result .f2-btn.hot'); await page.waitForTimeout(500);
await page.screenshot({ path: path.join(OUT, 'f2-next-1440-after.png') });
await page.close();
await browser.close();
console.log(errors.length ? 'PAGE ERRORS:\n' + errors.join('\n') : '0 page errors');
