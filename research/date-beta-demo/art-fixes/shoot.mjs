// shoot.mjs: before/after shots for the two art fixes (train ad per bento pick, rooftop sign vs lifted choice box).
// usage: npm run build && npx vite preview --port 5637 --strictPort &   node research/date-beta-demo/art-fixes/shoot.mjs http://localhost:5637 before|after
// Writes <tag>-*.png at 1920x1080, then quantizes them to 256 colours with Pillow (python3).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const BASE = process.argv[2] || 'http://localhost:5637';
const TAG = process.argv[3] || 'after';
const OUT = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const errors = [], files = [];

async function open(scene) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', (e) => errors.push(`${scene}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${scene}: console ${m.text()}`); });
  await page.goto(`${BASE}/date-beta.html?scene=${scene}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
  return page;
}
const at = (page, b) => page.waitForFunction((v) => document.documentElement.dataset.beat === v, b, { timeout: 20000 }).then(() => page.waitForTimeout(700));
const space = async (page) => { await page.waitForTimeout(1300); await page.keyboard.press('Space'); };
const shot = async (page, name) => { const f = path.join(OUT, `${TAG}-${name}.png`); await page.screenshot({ path: f }); files.push(f); console.log(path.basename(f)); };
const box = (page, sel) => page.evaluate((s) => { const r = document.querySelector(s)?.getBoundingClientRect(); return r && [r.x, r.y, r.right, r.bottom].map(Math.round); }, sel);

// rooftop: beat 0 (no box), beat 1 (choice), beat 2 (plain box), beat 6 (choice + timer)
let p = await open('rooftop');
await shot(p, 'rooftop0');
await space(p); await at(p, 'rooftop:1');
await shot(p, 'rooftop1-choice');
console.log('  lifted box', await box(p, '.db-say'), 'sign', await box(p, '.rooftop .sign-head'));
await p.getByRole('button', { name: 'Take the tamagoyaki' }).click(); await at(p, 'rooftop:2');
await shot(p, 'rooftop2-plain');
console.log('  plain box', await box(p, '.db-say'));
for (const b of [3, 4, 5, 6]) { await space(p); await at(p, `rooftop:${b}`); }
await shot(p, 'rooftop6-choice');
// on into the train with the tamagoyaki pick
await p.getByRole('button', { name: 'Stay a minute' }).click(); await at(p, 'train:0');
await shot(p, 'train0-tamagoyaki');
await space(p); await at(p, 'train:1'); await p.waitForTimeout(1600);
await shot(p, 'train1-zoom-tamagoyaki');
await p.close();

// train, default pick (umeboshi)
p = await open('train');
await space(p); await at(p, 'train:1'); await p.waitForTimeout(1600);
await shot(p, 'train1-zoom-umeboshi');
await p.close();

await browser.close();
execFileSync('python3', ['-c', `
import sys
from PIL import Image
for f in sys.argv[1:]:
    Image.open(f).convert('RGB').quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(f, optimize=True)
`, ...files]);
console.log(errors.length ? errors.join('\n') : '0 console errors');
