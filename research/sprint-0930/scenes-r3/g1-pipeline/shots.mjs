// G1 shots: v2-train beats 1-6 in the real player (date-beta.html?scene=v2-train&beat=N&still, 1920x1080), plus the
// bare art of each G1 bg (g1-preview.html?bare) for compare.py. Dumps the dialogue box + Nanda boxes to G1-boxes.json and
// fails if the box covers the departure board (beat 1) / the next-train board + station sign (beat 2) / the IC reader (3).
// usage: node shots.mjs http://localhost:5197 research/sprint-0930/scenes-r3/shots   (then: python3 quant.py <out dir>)
import { mkdirSync, writeFileSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';

const [base = 'http://localhost:5197', out = 'research/sprint-0930/scenes-r3/shots'] = process.argv.slice(2);
mkdirSync(`${out}/compare`, { recursive: true });
const BEATS = { 1: 'station-gate-r3', 2: 'station-ads', 3: 'station-ads-insert', 4: 'train-sun', 5: 'train-rain', 6: 'platform-rain' };
// key props (stage px) the dialogue box must never cover
const KEEP = { 1: [[990, 150, 1444, 290]], 2: [[216, 126, 580, 276], [598, 198, 780, 288]], 3: [[440, 706, 620, 756]], 6: [[540, 300, 688, 352]] };
const hit = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && !/404/.test(m.text()) && errs.push(m.text()));
const boxes = {}, bad = [];
for (const [n, id] of Object.entries(BEATS)) {
  await p.goto(`${base}/date-beta.html?scene=v2-train&beat=${n}&still&seed=7`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/G1-beat${n}-${id}.png` });
  boxes[n] = await p.evaluate(() => {
    const r = (el) => { if (!el) return null; const q = el.getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom].map(Math.round); };
    return { scene: document.querySelector('.stage')?.dataset.scene, art: document.querySelector('.db-bg')?.className ?? document.querySelector('.scene .art')?.className, say: r(document.querySelector('.db-say')), nanda: r(document.querySelector('.db-nanda')), text: document.querySelector('.db-say .line')?.textContent };
  });
  boxes[n].id = id;
  boxes[n].hud = await p.evaluate(() => [...document.querySelectorAll('.hud-a, .hud-b, [class^="hud-"]')].filter((e) => getComputedStyle(e).display !== 'none').map((e) => { const q = e.getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom].map(Math.round); }).filter((r) => r[3] - r[1] < 300));
  for (const k of KEEP[n] ?? []) {
    if (boxes[n].say && hit(boxes[n].say, k)) bad.push(`beat ${n}: box ${boxes[n].say} covers ${k}`);
    for (const h of boxes[n].hud) if (hit(h, k)) bad.push(`beat ${n}: HUD ${h} covers ${k}`);
    if (boxes[n].nanda && hit(boxes[n].nanda, k)) bad.push(`beat ${n}: Nanda ${boxes[n].nanda} covers ${k}`);
  }
  console.log('beat', n, id, JSON.stringify(boxes[n]));
}
for (const id of new Set(Object.values(BEATS))) {
  await p.goto(`${base}/research/sprint-0930/scenes-r3/g1-preview.html?bg=${id}&bare`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${out}/compare/${id}-bare.png` });
}
writeFileSync(`${out}/G1-boxes.json`, JSON.stringify(boxes, null, 1));
if (errs.length) console.log('ERRORS', errs);
if (bad.length) { console.log('COVERED', bad); process.exitCode = 1; } else console.log('key props clear of the dialogue box');
await b.close();
