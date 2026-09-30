// 1920x1080 shots of the Scene A art via research/sprint-0930/scene-a/preview.html (vite dev server).
// usage: node shots.mjs <base url> <out dir> [name ...]
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const [base, out, ...only] = process.argv.slice(2);
const P = '/research/sprint-0930/scene-a/preview.html';
const enc = (o) => encodeURIComponent(JSON.stringify(o));
export const SHOTS = {
  '01-rooftop-noon': 'bg=rooftop-noon&bare',
  '02-rooftop-noon-staged': 'bg=rooftop-noon&nanda&line=' + encodeURIComponent('SCHOOL ROOFTOP · 12:00 NOON. Her shoes by the fence.'),
  '03-rooftop-warm': 'bg=rooftop-warm&bare',
  '04-rooftop-warm-staged': 'bg=rooftop-warm&nanda&line=' + encodeURIComponent('NANDA: Stay. The sky is pink because of us ♡'),
  '05-bento-whole': 'bg=bento-insert&bare',
  '06-bento-lift-tama': 'bg=bento-lift&bare&props=' + enc({ lift: 'tama' }),
  '07-bento-lift-ume': 'bg=bento-lift&bare&props=' + enc({ lift: 'ume' }),
  '08-bento-pick': 'bg=bento-insert&bare&props=' + enc({ focus: 'both' }),
  '09-bento-staged': 'bg=bento-insert&line=' + encodeURIComponent('NANDA: I made you lunch. Pick one ♡'),
};
const names = only.length ? only : Object.keys(SHOTS);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
for (const n of names) {
  await p.goto(`${base}${P}?${SHOTS[n]}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${out}/${n}.png` });
  console.log('shot', n);
}
if (errs.length) console.log('ERRORS', errs);
await b.close();
