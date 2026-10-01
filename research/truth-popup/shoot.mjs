// node shoot.mjs <tag> : shots of the logic truth table (6 switches, 3 lamps: wide AND tall) at 1920x1080 + 1280x800.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const PORT = process.env.PORT || 5240, tag = process.argv[2] || 'x';
const OUT = new URL('./', import.meta.url).pathname;
const nodes = {}, wires = {}, view = [];
for (let i = 1; i <= 6; i++) { nodes['s' + i] = { id: 's' + i, kind: 'S', value: false }; view.push({ id: 's' + i, type: 'S', position: { x: 26, y: 20 + i * 80 }, data: {} }); }
[['g1', 'AND', 's1', 's2'], ['g2', 'OR', 's3', 's4'], ['g3', 'XOR', 's5', 's6']].forEach(([id, type, a, b], k) => {
  nodes[id] = { id, kind: 'G', type }; view.push({ id, type: 'G', position: { x: 300, y: 40 + k * 160 }, data: {} });
  wires['w' + (2 * k + 1)] = { id: 'w' + (2 * k + 1), source: a, target: id, pin: 0 }; wires['w' + (2 * k + 2)] = { id: 'w' + (2 * k + 2), source: b, target: id, pin: 1 };
  nodes['l' + (k + 1)] = { id: 'l' + (k + 1), kind: 'L' }; view.push({ id: 'l' + (k + 1), type: 'L', position: { x: 600, y: 40 + k * 160 }, data: {} });
  wires['w' + (7 + k)] = { id: 'w' + (7 + k), source: id, target: 'l' + (k + 1), pin: 0 };
});
const saved = JSON.stringify({ circuit: { nodes, wires }, view });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'], ignoreDefaultArgs: ['--hide-scrollbars'] });
for (const [w, h] of [[1920, 1080], [1280, 800]]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  await page.addInitScript((s) => { try { sessionStorage.setItem('gob.logic.v1', s); localStorage.setItem('gob.tour', 'done'); localStorage.setItem('gob.paletteHint', '1'); } catch {} }, saved);
  await page.goto(`http://localhost:${PORT}/?demo`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const info = await page.evaluate(() => { const e = document.querySelector('.truth .tt'); return e && { sb: e.style.getPropertyValue('--sb'), off: e.offsetHeight, cl: e.clientHeight, st: e.scrollTop, fd: e.classList.contains('fd') }; });
  console.log(w, JSON.stringify(info));
  await page.screenshot({ path: `${OUT}${tag}-${w}-page.png` });
  const c = await page.locator('.truth').boundingBox();
  await page.screenshot({ path: `${OUT}${tag}-${w}-truth.png`, clip: c });
  if (process.env.POPUP) await (await import(process.env.POPUP)).default(page, OUT, tag, w);
}
await browser.close();
