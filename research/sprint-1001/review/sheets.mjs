// Contact sheets (from origin/playtest-1001 research/sprint-1001/playtest/sheets.mjs): node sheets.mjs <route> <outdir> [per=6]
// Reads <outdir>/<route>/log.json + png/, writes <outdir>/<route>/sheet-NN.png (3 columns, 640px tiles so text stays legible).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const [ROUTE, ROOTOUT, PER = '6'] = process.argv.slice(2);
const DIR = `${ROOTOUT}/${ROUTE}/`;
const { log } = JSON.parse(fs.readFileSync(DIR + 'log.json', 'utf8'));
const meta = Object.fromEntries(log.filter((e) => e.nm).map((e) => [e.nm, e]));
const files = fs.readdirSync(DIR + 'png').filter((f) => f.endsWith('.png')).sort();
for (const f of fs.readdirSync(DIR)) if (/^sheet-\d+\.png$/.test(f)) fs.rmSync(DIR + f);
const esc = (t) => String(t ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1940, height: 800 } })).newPage();
let k = 0; const per = +PER;
for (let i = 0; i < files.length; i += per) {
  const tiles = files.slice(i, i + per).map((f) => {
    const m = meta[f] ?? {};
    return `<figure><img src="png/${f}"><figcaption><b>${esc(f)}</b> · ${esc(m.leg)}${m.taken ? ' → ' + esc(m.taken).slice(0, 40) : ''}</figcaption></figure>`;
  }).join('');
  const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#111;color:#ddd;font:14px/1.3 monospace;width:1940px}
  .g{display:grid;grid-template-columns:repeat(3,640px);gap:6px;padding:4px}figure{margin:0}img{width:640px;height:360px;display:block}
  figcaption{padding:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}</style><div class="g">${tiles}</div>`;
  fs.writeFileSync(DIR + '_sheet.html', html);
  await page.goto('file://' + DIR + '_sheet.html'); await page.waitForLoadState('load');
  await page.screenshot({ path: DIR + `sheet-${String(++k).padStart(2, '0')}.png`, fullPage: true });
}
fs.rmSync(DIR + '_sheet.html', { force: true });
console.log(ROUTE, files.length, 'shots', k, 'sheets');
await browser.close();
