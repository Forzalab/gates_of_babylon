// bare art renders (no chrome, no Nanda sprite) of the train-r4 bgs for compare.py, via the G1 preview page.
// usage: node research/sprint-0930/train-r4/pipeline/bare.mjs http://localhost:5199 research/sprint-0930/train-r4/shots/compare
import { mkdirSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';

const [base = 'http://localhost:5199', out = 'research/sprint-0930/train-r4/shots/compare'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const JOBS = [['station-gate-r3', 'drink=umeboshi'], ['station-ads', 'drink=umeboshi&bump=laugh'], ['station-ads', 'drink=tamagoyaki&bump=named'],
  ['vending-insert', 'drink=umeboshi'], ['vending-insert', 'drink=tamagoyaki'], ['train-rain-sleepy', 'face=dazed-sleepy']];
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const [id, q] of JOBS) {
  await p.goto(`${base}/research/sprint-0930/scenes-r3/g1-preview.html?bg=${id}&bare&${q}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  const name = `${id}-${q.replace(/[=&]/g, '-')}-bare.png`;
  await p.screenshot({ path: `${out}/${name}` });
  console.log(name);
}
await b.close();
