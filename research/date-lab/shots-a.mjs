// Builder A screenshots: node research/date-lab/shots-a.mjs [id ...]   (needs `npx vite preview --port 5481` running)
// 1920x1080, one PNG per beat into research/date-lab/shots/<id>-*.png, plus one reduced-motion (?still) shot per variant.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:5481/date-lab.html';
const OUT = new URL('./shots/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Each entry: async (page, snap, open) => ...; open(still?) loads the variant; snap(name) writes <id>-<name>.png.
const SHOTS = {
  'menu-1': async (page, snap, open) => {
    await open();
    await wait(700); await snap('1-door');
    await wait(2600); await snap('2-spread-timer');
    await page.hover('.card.yours'); await wait(500); await snap('3-hover-yours');
    await page.mouse.move(10, 10);
    await wait(4700); await snap('4-timeout-her-hand');
    await wait(2000); await snap('5-timeout-pink');
    await page.keyboard.press('r'); await wait(1900); await snap('6-replay-pink-pinned');
    await open(); await wait(3600); await page.keyboard.press('2'); await wait(150); await snap('7-purple-bleed');
    await wait(1600); await snap('8-purple-reversed');
    await page.keyboard.press('r'); await wait(2400); await snap('9-replay-purple-pinned');
    await open(true); await wait(1500); await snap('rm-spread');
  },
  'menu-2': async (page, snap, open) => {
    await open();
    await wait(800); await snap('1-napkin');
    await wait(3900); await snap('2-tally-3');
    await page.hover('.row-purple'); await wait(300); await snap('3-hover-purple');
    await page.mouse.move(10, 10);
    await wait(2800); await snap('4-timeout-red-tick');
    await page.keyboard.press('r'); await wait(2400); await snap('5-replay-pink-ruled');
    await open(); await wait(2600); await page.keyboard.press('2'); await wait(120); await snap('6-purple-bleed');
    await wait(1400); await snap('7-purple-awake');
    await open(true); await wait(2700); await snap('rm-table');
  },
  'menu-3': async (page, snap, open) => {
    await open();
    await wait(1200); await snap('1-normal-vn');
    await wait(2100); await snap('2-backspacing-goodnight');
    await wait(1600); await snap('3-stay-typed');
    await wait(1600); await snap('4-label-take-your-time');
    await page.waitForSelector('.hercursor.p1'); await wait(100); await snap('5-her-cursor');
    await page.waitForSelector('.opt.pink.chosen'); await wait(200); await snap('6-her-click');
    await wait(2200); await snap('7-lens-the-one-clicking');
    await page.keyboard.press('r'); await wait(3000); await snap('8-replay-pink-disabled-both-agree');
    await open(); await wait(3600); await page.keyboard.press('2'); await wait(120); await snap('9-purple-bleed');
    await wait(3200); await snap('10-purple-lea');
    await page.keyboard.press('r'); await wait(2400); await snap('11-replay-purple-disabled');
    await open(true); await wait(4200); await snap('rm-stay');
  },
};

// camera pieces: freeze the clock at ?t=<ms> and shoot (deterministic frames)
const frames = (list) => async (page, snap, open) => {
  for (const [name, t, still] of list) { await open(!!still, `&t=${t}`); await wait(700); await snap(name); }
};
SHOTS['cam-1'] = frames([['1-tilt-start', 400], ['2-tilt-sky-flare', 5200], ['3-noon', 6900], ['4-dusk', 8600], ['5-night-twelve', 10600],
  ['6-window-match', 11700], ['7-rack-to-strap', 15600], ['8-platform-rain', 20500], ['9-door-flare', 30400], ['rm-window', 14000, true]]);

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SHOTS);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', (e) => console.error('PAGEERROR', e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.error('CONSOLE', m.text()); });
for (const id of ids) {
  const open = async (still = false, extra = '') => { await page.goto(`${BASE}?v=${id}${still ? '&still' : ''}${extra}`); await page.waitForSelector('.lab-stage'); };
  const snap = async (name) => { await page.screenshot({ path: `${OUT}${id}-${name}.png` }); console.log(`${id}-${name}.png`); };
  await SHOTS[id](page, snap, open);
}
await browser.close();
