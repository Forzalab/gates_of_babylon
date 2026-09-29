import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const base = 'http://localhost:5490/research/date-beta-mockups/HA/engine.html';
const shots = [['rooftop', 1, 'engine-rooftop'], ['train', 0, 'engine-train'], ['naan', 1, 'engine-naan'], ['blackout', 6, 'engine-blackout'], ['rooftop', 1, 'engine-rooftop-1024', 1024], ['splash', 0, 'engine-splash']];
const errs = [];
for (const [sc, bt, name, vw = 1920] of shots) {
  const p = await b.newPage({ viewport: { width: vw, height: Math.round(vw * 9 / 16) } });
  p.on('pageerror', (e) => errs.push(name + ' ' + e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(name + ' ' + m.text()); });
  await p.goto(`${base}?scene=${sc}&beat=${bt}`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1800);
  await p.screenshot({ path: `research/date-beta-mockups/HA/shots/${name}.png` }); console.log(name, await p.evaluate(() => document.documentElement.dataset.beat)); await p.close();
}
await b.close(); if (errs.length) { console.error(errs.join('\n')); process.exitCode = 1; }
