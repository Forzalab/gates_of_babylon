// Builder B screenshots: 1920x1080 PNGs of every B variant (full motion + reduced motion) into research/date-lab/shots/.
// Run: npm run build && npx vite preview --port 5482 (background), then: node research/date-lab/shots-b.mjs [id-filter]
// Each shot = { id, name, q (extra query), wait (ms), steps: [['click', x, y] | ['key', k] | ['wait', ms] | ['move', x, y]] }.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:5482/date-lab.html';
const OUT = new URL('./shots/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

export const SHOTS = [
  // menu-4 Bandersnatch
  { id: 'menu-4', name: 'intro', wait: 2600 },
  { id: 'menu-4', name: 'choice-t2s', q: 'state=menu', wait: 2300 },
  { id: 'menu-4', name: 'choice-t4s', q: 'state=menu', wait: 4200 },
  { id: 'menu-4', name: 'purple-bleed', q: 'state=menu', wait: 900, steps: [['key', '2'], ['wait', 120]] },
  { id: 'menu-4', name: 'purple-after', q: 'state=menu', wait: 900, steps: [['key', '2'], ['wait', 2600]] },
  { id: 'menu-4', name: 'rewind', q: 'state=menu', wait: 900, steps: [['key', '2'], ['wait', 4700]] },
  { id: 'menu-4', name: 'replay-disabled', q: 'state=replay', wait: 3000 },
  { id: 'menu-4', name: 'timeout-pink', q: 'state=menu', wait: 6300 },
  { id: 'menu-4', name: 'pink-genkan', q: 'state=menu', wait: 900, steps: [['key', '1'], ['wait', 4200]] },
  { id: 'menu-4', name: 'rm-choice', q: 'state=menu&still', wait: 2300 },
  { id: 'menu-4', name: 'rm-replay', q: 'state=replay&still', wait: 3200 },
];

const filter = process.argv[2];
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
for (const s of SHOTS) {
  if (filter && !`${s.id}-${s.name}`.includes(filter)) continue;
  const q = new URLSearchParams(s.q ?? '');
  q.set('v', s.id);
  await page.goto(`${BASE}?${q.toString().replace(/=(&|$)/g, '$1')}`);
  await page.waitForTimeout(s.wait ?? 1000);
  for (const [op, a, b] of s.steps ?? []) {
    if (op === 'click') await page.mouse.click(a, b);
    else if (op === 'move') await page.mouse.move(a, b, { steps: 6 });
    else if (op === 'down') await page.mouse.down();
    else if (op === 'up') await page.mouse.up();
    else if (op === 'key') await page.keyboard.press(a);
    else if (op === 'wait') await page.waitForTimeout(a);
  }
  const file = `${OUT}${s.id}-${s.name}.png`;
  await page.screenshot({ path: file });
  console.log('shot', file);
}
if (errors.length) console.log('PAGE ERRORS:\n' + [...new Set(errors)].join('\n'));
await browser.close();
