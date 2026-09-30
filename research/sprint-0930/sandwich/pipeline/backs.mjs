// the BACK layers alone (the pure traces), 1920x1080 PNGs. usage: node backs.mjs <base> <out dir> id ...
import { mkdirSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';

const [base, out, ...ids] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const id of ids) {
  await p.setContent(`<body style="margin:0"><img src="${base}/date-beta/trace/${id}.svg" style="width:1920px;height:1080px;display:block">`);
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/${id}.png` }); console.log(id);
}
await b.close();
