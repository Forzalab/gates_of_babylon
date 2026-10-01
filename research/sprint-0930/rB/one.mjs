// one beat, settled: node one.mjs <scene> <beat> <out.png> [port] [wait ms] [clip x,y,w,h]
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;
const [scene, beat, out, port = '5241', wait = '4000', clip] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
await page.goto(`http://localhost:${port}/date-beta.html?seed=1&fx=full&scene=${scene}&beat=${beat}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(+wait);
const c = clip ? clip.split(',').map(Number) : null;
await page.screenshot({ path: out, ...(c ? { clip: { x: c[0], y: c[1], width: c[2], height: c[3] } } : {}) });
console.log(await page.evaluate(() => ({ beat: document.documentElement.dataset.beat, floor: document.querySelector('.db-stage,[data-floor]')?.dataset.floor, ch: [...document.querySelectorAll('.db-choice,.hud-next')].map((e) => e.innerText) })));
await browser.close();
