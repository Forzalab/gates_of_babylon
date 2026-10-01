// Contact sheets: node sheets.mjs <route>. Reads <route>/log.json + <route>/png/*.png, writes <route>/sheet-NN.png
// (4x3 grid, 12 shots each, 1920px wide; caption = filename + scene:beat + leg). Rendered with Playwright (no PIL here).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const ROUTE = process.argv[2];
const DIR = new URL(`./out/${ROUTE}/`, import.meta.url).pathname;
const { log } = JSON.parse(fs.readFileSync(DIR + 'log.json', 'utf8'));
const meta = Object.fromEntries(log.filter((e) => e.nm).map((e) => [e.nm, e]));
const files = fs.readdirSync(DIR + 'png').filter((f) => f.endsWith('.png')).sort();
for (const f of fs.readdirSync(DIR)) if (/^sheet-\d+\.png$/.test(f)) fs.rmSync(DIR + f);
const esc = (t) => String(t ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 800 } })).newPage();
let k = 0;
for (let i = 0; i < files.length; i += 12) {
  const tiles = files.slice(i, i + 12).map((f) => {
    const m = meta[f] ?? {};
    return `<figure><img src="png/${f}"><figcaption><b>${esc(f)}</b><br>${esc((m.scene || 'menu') + ':' + (m.beat ?? ''))} · ${esc(m.leg)}${m.taken ? ' → ' + esc(m.taken).slice(0, 40) : ''}</figcaption></figure>`;
  }).join('');
  const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#111;color:#ddd;font:13px/1.3 monospace;width:1920px}
  .g{display:grid;grid-template-columns:repeat(4,472px);gap:8px;padding:8px}figure{margin:0}img{width:472px;height:266px;display:block;object-fit:cover}
  figcaption{padding:3px 2px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}h1{font-size:15px;margin:8px 10px 0}</style>
  <h1>${esc(ROUTE)} · sheet ${k + 1} · shots ${i + 1}-${Math.min(i + 12, files.length)} of ${files.length}</h1><div class="g">${tiles}</div>`;
  const tmp = DIR + `_sheet.html`;
  fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp); await page.waitForLoadState('load');
  await page.screenshot({ path: DIR + `sheet-${String(++k).padStart(2, '0')}.png`, fullPage: true });
  fs.rmSync(tmp);
}
console.log(ROUTE, files.length, 'shots', k, 'sheets');
await browser.close();
