// Rasterise SVGs (the first traces, the hand composites) to 1920x1080 PNGs with the pre-installed Chromium.
// usage: [DIRECT=1] node render.mjs <out dir> <a.svg> [b.svg ...]    -> <out dir>/<name>.png
// DIRECT=1 opens the svg itself (a 1920x1080 hand composite whose <image> links a local file; an <img> would block it).
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const [out, ...files] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const f of files) {
  // a wrapper page next to the svg: the svg is drawn at 1920x1080 whatever its own width/height say
  const html = resolve(f) + '.html';
  writeFileSync(html, `<body style="margin:0"><img src="${basename(f)}" style="display:block;width:1920px;height:1080px"></body>`);
  await p.goto('file://' + (process.env.DIRECT ? resolve(f) : html));
  await p.waitForLoadState('networkidle'); await p.waitForTimeout(500);
  const o = `${out}/${basename(f, '.svg')}.png`; await p.screenshot({ path: o }); rmSync(html); console.log(o);
}
await b.close();
