// build2 shots: the live engine (vite preview of dist) at a choice beat with an OR box. Run: npm run build && npx vite preview --port 5491
// then node research/date-beta-shots/build2/shots.mjs
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const base = 'http://localhost:5491/date-beta.html';
const shots = [['rooftop', 2, 'rooftop-choice-or-1024x768', 1024, 768], ['rooftop', 2, 'rooftop-choice-or-1920x1080', 1920, 1080],
  ['blackout', 6, 'blackout-adoreme-1024x768', 1024, 768]];
const errs = [];
for (const [sc, bt, name, w, h] of shots) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', (e) => errs.push(`${name} ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(`${name} ${m.text()}`); });
  await p.goto(`${base}?scene=${sc}&beat=${bt}`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(900);
  const info = await p.evaluate(() => ({
    beat: document.documentElement.dataset.beat,
    orBox: !!document.querySelector('.db-say.has-or'),
    overflow: [...document.querySelectorAll('.db-choice')].some((c) => c.scrollWidth > c.clientWidth + 1),
    adore: getComputedStyle(document.querySelector('.blackout .word') ?? document.body).fontSize,
  }));
  await p.screenshot({ path: `research/date-beta-shots/build2/${name}.png` });
  console.log(name, JSON.stringify(info));
  await p.close();
}
await b.close();
if (errs.length) { console.error(errs.join('\n')); process.exitCode = 1; }
