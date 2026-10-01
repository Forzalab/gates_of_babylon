// Crop helper: node crop.mjs <src.png> <out.png> x y w h [scale]. Renders the crop with Playwright (no PIL here).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import fs from 'node:fs';
const { chromium } = pkg;
const [src, out, x, y, w, h, sc = '1'] = process.argv.slice(2);
const s = +sc, b64 = fs.readFileSync(src).toString('base64');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: Math.round(w * s), height: Math.round(h * s) } })).newPage();
await page.setContent(`<body style="margin:0;overflow:hidden"><div style="width:${w * s}px;height:${h * s}px;background:url(data:image/png;base64,${b64}) -${x * s}px -${y * s}px / ${1920 * s}px ${1080 * s}px no-repeat"></div></body>`);
await page.screenshot({ path: out, type: out.endsWith('.jpg') ? 'jpeg' : 'png', ...(out.endsWith('.jpg') ? { quality: 82 } : {}) });
await browser.close();
