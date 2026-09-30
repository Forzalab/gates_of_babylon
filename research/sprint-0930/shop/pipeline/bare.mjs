// Bare art shots of every SHOP art id (research/sprint-0930/shop/preview.html?bare), for the hand pass.
// usage: node bare.mjs http://localhost:5311 <out dir> [id ...]
import { mkdirSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';

const [base = 'http://localhost:5311', out = '/tmp/shop-bare', ...only] = process.argv.slice(2);
const IDS = ['shop-vending', 'shop-doors', 'shop-list', 'shop-cart', 'shop-aisle-produce', 'shop-carrots', 'shop-aisle-eggs', 'shop-eggs-rack',
  'shop-aisle-cups', 'shop-cups-front', 'shop-tea-tins', 'shop-basket-cups', 'shop-snacks', 'shop-checkout', 'shop-register',
  'shop-basket-handle', 'shop-self-checkout', 'shop-self-close', 'shop-way-out', 'shop-cart-full'];
mkdirSync(out, { recursive: true });
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
for (const id of only.length ? only : IDS) {
  await p.goto(`${base}/research/sprint-0930/shop/preview.html?bg=${id}&bare`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/${id}.png` });
}
if (errs.length) console.log('ERRORS', errs);
await b.close();
