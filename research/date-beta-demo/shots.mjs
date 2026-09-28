// shots.mjs: Playwright screenshots of date-beta.html, every scene at 1920x1080, plus reduced-motion scenes 1 and 5.
// usage: npm run build && npx vite preview --port 5480 &  node research/date-beta-demo/shots.mjs http://localhost:5480
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const BASE = process.argv[2] || 'http://localhost:5480';
const OUT = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];

async function open(scene, { rm = false, w = 1920, h = 1080 } = {}) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: rm ? 'reduce' : 'no-preference' });
  page.on('pageerror', (e) => errors.push(`${scene}${rm ? ' rm' : ''}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${scene}: console ${m.text()}`); });
  await page.goto(`${BASE}/date-beta.html?scene=${scene}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  return page;
}
const shot = async (page, name) => { await page.screenshot({ path: path.join(OUT, `${name}.png`) }); console.log(name); };
const beat = (page, b, extra = 0) => page.waitForFunction((v) => document.documentElement.dataset.beat === v, b, { timeout: 20000 }).then(() => page.waitForTimeout(extra));
const glitch = (page, v) => page.waitForFunction((g) => document.querySelector('.hl')?.dataset.glitch === g, v, { timeout: 10000 });

// 1 splash
let p = await open('splash');
await shot(p, '01-splash');
await p.click('.start');
await p.waitForTimeout(1150); await shot(p, '01b-splash-collapse-frame2');
await p.waitForTimeout(1300); await shot(p, '01c-splash-collapsed');
await p.close();
p = await open('splash', { rm: true });
await p.click('.start'); await p.waitForTimeout(150);
await shot(p, '01-rm-splash-collapsed-hardcut');
await p.close();

// 2 rooftop
p = await open('rooftop');
await shot(p, '02-rooftop-live-clock');
console.log('  clock reads', await p.getAttribute('.rooftop', 'data-time'));
await p.waitForTimeout(500); await p.mouse.click(960, 400); await p.waitForTimeout(600);
await shot(p, '02b-rooftop-noon');
await p.close();

// 3 train
p = await open('train');
await shot(p, '03-train-window');
await p.mouse.click(960, 400); await p.waitForTimeout(2000);
await shot(p, '03b-train-ad-zoom');
await p.close();

// 4 naan billboard: the three glitch frames
p = await open('naan');
await glitch(p, 'NAAN'); await shot(p, '04-naan-billboard');
await glitch(p, 'NAND'); await shot(p, '04b-naan-glitch-NAND');
await glitch(p, 'NANDA'); await shot(p, '04c-naan-glitch-NANDA');
await p.mouse.click(960, 400); await p.waitForTimeout(600);
await shot(p, '04d-naan-line');
await p.close();

// 5 blackout
p = await open('blackout');
await beat(p, 'blackout:1', 1500); await shot(p, '05-blackout-forecast');
await beat(p, 'blackout:2', 2000); await shot(p, '05b-blackout-OR');
await beat(p, 'blackout:4', 1400); await shot(p, '05c-blackout-ADOR');
await beat(p, 'blackout:6', 1800); await shot(p, '05d-blackout-ADORE-ME');
await beat(p, 'blackout:8', 300); await shot(p, '05e-blackout-hard-cut');
await p.close();
p = await open('blackout', { rm: true });
await beat(p, 'blackout:2', 100); await shot(p, '05-rm-blackout-OR');
await beat(p, 'blackout:4', 100); await shot(p, '05-rm-blackout-ADOR');
await beat(p, 'blackout:6', 100); await shot(p, '05-rm-blackout-ADORE-ME');
await p.close();

p = await open('naan', { rm: true });
await shot(p, '04-rm-naan-static');
console.log('  rm glitch', await p.getAttribute('.hl', 'data-glitch'));
await p.close();

// behaviour checks: Esc / S skip a scene, a click inside the 500 ms+ hold is ignored, F is wired, no fullscreen errors
p = await open('splash');
const at = () => p.evaluate(() => document.documentElement.dataset.beat);
await p.keyboard.press('Escape'); await p.waitForTimeout(100); const esc = await at();
await p.mouse.click(960, 300); await p.waitForTimeout(50); const early = await at();
await p.keyboard.press('s'); await p.waitForTimeout(100); const sk = await at();
console.log(`  checks: Esc on splash -> ${esc}; click inside hold -> ${early}; S -> ${sk}`);
if (esc !== 'rooftop:0' || early !== 'rooftop:0' || sk !== 'train:0') errors.push('behaviour check failed');
await p.close();

// projector sanity: a 4:3 screen letterboxes the 16:9 stage, no scroll
p = await open('naan', { w: 1024, h: 768 });
await shot(p, '06-letterbox-1024x768');
console.log('  scroll', await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth, document.documentElement.scrollHeight, innerHeight].join(' ')));
await p.close();

await browser.close();
console.log(errors.length ? `ERRORS:\n${errors.join('\n')}` : 'no page errors');
