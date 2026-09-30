// abtest.mjs: one beat, two shots: as is, and with a CSS rule injected (A/B a layer). node abtest.mjs <port> <scene:beat> <css> <out-prefix>
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const [port, spec, css, out] = process.argv.slice(2);
const [scene, beat, pick] = spec.split(':');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
await page.goto(`http://localhost:${port}/date-beta.html?scene=${scene}&beat=${beat}&seed=1&bento=umeboshi${pick ? `&pick=${pick}` : ''}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1400);
await page.screenshot({ path: `${out}-a.png` });
await page.addStyleTag({ content: css });
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}-b.png` });
await browser.close();
