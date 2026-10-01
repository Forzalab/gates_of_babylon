// Emotion-FX shots: node research/sprint-0930/emotion-fx/shots.mjs research/sprint-0930/emotion-fx/shots (vite dev on :3000), then quantise to 256 colours (PIL, see SCHEMA.md).
// One per FX + one per face layer (a 2.2x close-up of her face, still 1920x1080).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const out = process.argv[2];
const B = 'http://localhost:3000/date-beta.html?scene=rooftop&beat=2&still&seed=1';
const FX = { 'fx-love-crit': 'gacha=crit10&pick=1&love=10', 'fx-love-bomb': 'gacha=pity&pick=1&love=10', 'fx-anger': 'gacha=anger&pick=3&love=24', 'fx-rage': 'gacha=rage&pick=3&love=24' };
const FACE = { 'face-vein': 'fx-anger', 'face-puff': 'fx-anger', 'face-shadow-eyes': 'fx-rage', 'face-sparkle': 'fx-love-crit' };
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
for (const [name, q] of Object.entries(FX)) {
  await p.goto(`${B}&${q}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  console.log(name, await p.$eval('.emo-fx', (e) => e.dataset.gacha).catch(() => 'NO FX'), await p.$eval('.db-nanda', (e) => e.dataset.layers).catch(() => '-'));
  await p.screenshot({ path: `${out}/${name}.png` });
}
// face layers: a 2x close-up of her face (the stage is scaled up so the crop is still 1920x1080 of real pixels)
const p2 = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
for (const [name, fx] of Object.entries(FACE)) {
  const layer = name.slice(5);
  await p2.goto(`${B}&${FX[fx]}&layers=${layer}`, { waitUntil: 'networkidle' });
  await p2.waitForTimeout(900);
  const box = await p2.$eval('.db-nanda', (e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  // zoom 2.2x on her head via CSS transform on the viewport (a still screenshot, nothing animates)
  await p2.evaluate(({ box }) => {
    const k = 2.2, cx = box.x + box.w * 0.47, cy = box.y + box.h * 0.5;
    document.body.style.transformOrigin = `${cx}px ${cy}px`;
    document.body.style.transform = `translate(${960 - cx}px, ${540 - cy}px) scale(${k})`;
    document.body.style.overflow = 'hidden';
  }, { box });
  await p2.waitForTimeout(300);
  await p2.screenshot({ path: `${out}/${name}.png` });
  console.log(name);
}
if (errs.length) console.log('ERRORS', errs.slice(0, 5));
await b.close();
