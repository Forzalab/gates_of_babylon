// stage2 shots: the debug branch map. Run: npm run build && npx vite preview --port 5492
// then node research/date-beta-shots/stage2/shots.mjs
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const base = 'http://localhost:5492/date-beta.html';
const out = 'research/date-beta-shots/stage2';
const errs = [];
const page = async (w, h, q = '?debug') => {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(base + q);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(600);
  return p;
};
const ok = (c, m) => { if (!c) errs.push(m); else console.log('ok', m); };

for (const [w, h] of [[1920, 1080], [1024, 768]]) {
  const p = await page(w, h);
  await p.screenshot({ path: `${out}/tree-${w}x${h}.png` });
  await p.close();
}

const p = await page(1920, 1080, '');
ok(!(await p.$('.db-tree')), 'plain boot: no map');
await p.keyboard.press('Shift+Backquote');
ok(!!(await p.$('.db-tree')), '~ opens the map');
await p.keyboard.press('Escape');
ok(!(await p.$('.db-tree')), 'Esc closes the map');
await p.keyboard.press('Shift+Backquote');
await p.click('[data-edge="escape.2.1"]');
await p.waitForSelector('.db-ask');
await p.waitForTimeout(300);
await p.screenshot({ path: `${out}/ask-bento-1920x1080.png` });
await p.click('.db-ask .db-choice.pink');
ok(!(await p.$('.db-tree')), 'map closes after the jump');
const beat = () => p.evaluate(() => document.documentElement.dataset.beat);
const text = () => p.evaluate(() => document.querySelector('.db-say .line')?.textContent ?? '');
ok((await beat()) === 'escape-timeout:0', `landed on escape-timeout:0 (${await beat()})`);
const seen = [];
for (let i = 0; i < 12 && !seen.join('|').includes('then sleep'); i++) {
  await p.waitForTimeout(1400);
  seen.push(await text());
  await p.mouse.click(960, 300);
}
console.log(seen.join(' | '));
ok(seen.includes('One sweet bite…') && seen.some((t) => t.includes("…then sleep. You're mine to keep.")), 'sweet couplet shows');
await b.close();
if (errs.length) { console.error(errs.join('\n')); process.exitCode = 1; }
