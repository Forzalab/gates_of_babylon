// shots.mjs: f3 gate + &next=1 at 1440x810 and 1024x768, reduced-motion stills, &clean=1, page errors, h-scroll.
// usage: node research/pit4/pit4-r1-3/shots.mjs http://localhost:PORT [only]
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const BASE = process.argv[2];
const ONLY = process.argv[3];
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];
const jobs = [];
for (const [w, h] of [[1440, 810], [1024, 768]]) {
  jobs.push({ name: `gate-${w}`, url: '/date.html?v=f3', w, h, wait: 3500 });
  jobs.push({ name: `gate-${w}-still`, url: '/date.html?v=f3', w, h, rm: 'reduce', wait: 600 });
  jobs.push({ name: `next-${w}`, url: '/date.html?v=f3&next=1', w, h, wait: 2500 });
  jobs.push({ name: `next-${w}-match`, url: '/date.html?v=f3&next=1', w, h, wait: 1500, match: true });
}
jobs.push({ name: 'gate-1440-clean', url: '/date.html?v=f3&clean=1', w: 1440, h: 810, wait: 3500 });
jobs.push({ name: 'gate-1440-t0', url: '/date.html?v=f3', w: 1440, h: 810, wait: 700 });
for (const j of jobs) {
  if (ONLY && !j.name.startsWith(ONLY)) continue;
  const page = await browser.newPage({ viewport: { width: j.w, height: j.h }, reducedMotion: j.rm ?? 'no-preference' });
  page.on('pageerror', (e) => errors.push(`${j.name}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${j.name} console: ${m.text()}`); });
  page.on('requestfailed', (r) => errors.push(`${j.name} reqfail: ${r.url()}`));
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`${j.name} ${r.status()}: ${r.url()}`); });
  await page.goto(BASE + j.url);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(j.wait);
  if (j.match) {
    // wire gate A's output to gate B's input 0 by a real drag
    const src = await page.locator('.react-flow__node[data-id="g1"] .react-flow__handle.source').first().boundingBox();
    const dst = await page.locator('.react-flow__node[data-id="g2"] .react-flow__handle.target').first().boundingBox();
    await page.mouse.move(src.x + src.width / 2, src.y + src.height / 2);
    await page.mouse.down();
    await page.mouse.move((src.x + dst.x) / 2, dst.y + 5, { steps: 8 });
    await page.mouse.move(dst.x + dst.width / 2, dst.y + dst.height / 2, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(1200);
  }
  await page.screenshot({ path: path.join(OUT, j.name + '.png') });
  const fit = await page.evaluate(() => {
    const r = (s) => { const b = document.querySelector(s)?.getBoundingClientRect(); return b && [b.left, b.top, b.right, b.bottom].map(Math.round); };
    return { sw: document.documentElement.scrollWidth, iw: innerWidth, modal: r('.modal'), plate: r('.plate'), neon: r('.neon'), warn: r('.warn'), adv: r('.adv'), grid: r('.grid'), bar: r('.bar'), match: !!document.querySelector('.itsmatch') };
  });
  console.log(j.name, JSON.stringify(fit));
  await page.close();
}
await browser.close();
console.log(errors.length ? 'PAGE ERRORS:\n' + errors.join('\n') : '0 page errors');
