// Render SVG files to 1920x1080 PNGs (review of raw traces). usage: node render.mjs a.svg [b.svg ...] -> a.png ...
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import { readFileSync } from 'node:fs';
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const f of process.argv.slice(2)) {
  const svg = readFileSync(f, 'utf8').replace(/<svg /, '<svg style="position:fixed;inset:0;width:1920px;height:1080px" ').replace(/viewBox="[^"]*"/, '').replace(/<svg /, `<svg viewBox="0 0 ${/width="(\d+)"/.exec(readFileSync(f, 'utf8'))[1]} ${/height="(\d+)"/.exec(readFileSync(f, 'utf8'))[1]}" preserveAspectRatio="none" `);
  await p.setContent(`<body style="margin:0">${svg}</body>`);
  await p.screenshot({ path: f.replace(/\.svg$/, '.png') });
  console.log('rendered', f);
}
await b.close();
