// build4 shots: the DOOR choice and the third-cup choice. Run: npm run build && npx vite preview --port 5491
// then node research/date-beta-shots/build4/shots.mjs
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const base = 'http://localhost:5491/date-beta.html';
const shots = [['door', 2, 'door-choice-1920x1080'], ['cup', 2, 'third-cup-choice-1920x1080']];
const errs = [];
for (const [sc, bt, name] of shots) {
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', (e) => errs.push(`${name} ${e.message}`));
  await p.goto(`${base}?scene=${sc}&beat=${bt}`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(900);
  const info = await p.evaluate(() => ({
    beat: document.documentElement.dataset.beat,
    choices: [...document.querySelectorAll('.db-choice')].map((c) => c.textContent.trim()),
  }));
  await p.screenshot({ path: `research/date-beta-shots/build4/${name}.png` });
  console.log(name, JSON.stringify(info));
  await p.close();
}
await b.close();
if (errs.length) { console.error(errs.join('\n')); process.exitCode = 1; }
