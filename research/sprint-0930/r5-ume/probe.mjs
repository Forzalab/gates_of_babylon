// probe.mjs: evaluate a JS expression on one beat (debug helper). node probe.mjs <port> <scene:beat[:pick]> "<expr>"
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const [port, spec, expr] = process.argv.slice(2);
const [scene, beat, pick] = spec.split(':');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('CONSOLE', m.text().slice(0, 300)); });
await page.goto(`http://localhost:${port}/date-beta.html?scene=${scene}&beat=${beat}&seed=1&bento=umeboshi${pick ? `&pick=${pick}` : ''}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
console.log(JSON.stringify(await page.evaluate(expr), null, 1));
await browser.close();
