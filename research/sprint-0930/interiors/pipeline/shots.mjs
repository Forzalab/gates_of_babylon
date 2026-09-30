// 1920x1080 stage shots via research/sprint-0930/interiors/preview.html (vite dev on :5494), then quantised to
// 256 colours by quant.py. usage: node shots.mjs <base url> <out dir> [name ...]
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const [base, out, ...only] = process.argv.slice(2);
const SHOTS = {
  'cellar': { bg: 'cellar' },
  'cellar-line': { bg: 'cellar', line: 'Concrete. One bulb. Rain at a high window.' },
  'cellar-jars': { bg: 'cellar', props: { shelf: 'jars' } },
  'cellar-newest': { bg: 'cellar', props: { shelf: 'newest', jar: 'umeboshi' } },
  'cellar-usu': { bg: 'cellar', props: { shelf: 'usu' } },
  'cellar-nanda': { bg: 'cellar', nanda: 1, line: 'NANDA: You found my collection. Do you like it? ♡' },
  'park': { bg: 'park' },
  'park-nanda': { bg: 'park', nanda: 1, line: 'NANDA: Sakura only last a week. Then they fall. I don\'t let things fall.' },
};
const names = only.length ? only : Object.keys(SHOTS);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
for (const n of names) {
  const s = SHOTS[n];
  const q = new URLSearchParams({ bg: s.bg, still: '' });
  if (s.line) q.set('line', s.line);
  if (s.props) q.set('props', JSON.stringify(s.props));
  if (s.nanda) q.set('nanda', '');
  await p.goto(`${base}/research/sprint-0930/interiors/preview.html?${q}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${out}/${n}.png` });
  console.log('shot', n);
}
if (errs.length) console.log('ERRORS', errs);
await b.close();
