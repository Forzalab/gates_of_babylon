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
  'menu-h1-r2': async (page, snap, open) => {
    await open();
    await wait(1500); await snap('1-deal-her-cursor-parked');
    await wait(2000); await snap('2-backspacing-your-card');
    await wait(1500); await snap('3-stay-card-warm');
    await wait(2200); await snap('4-timeout-her-hand');
    await wait(1800); await snap('5-timeout-pink');
    await page.keyboard.press('r'); await wait(5100); await snap('6-replay-pink-pinned-she-retypes-yours');
    await open(); await wait(4500); await page.keyboard.press('2'); await wait(120); await snap('7-purple-bleed');
    await wait(2700); await snap('8-purple-reversed-lea');
    await page.keyboard.press('r'); await wait(2500); await snap('9-replay-purple-pinned-struck');
    await open(true); await wait(3600); await snap('rm-stay');
  },
  'menu-3-r2': async (page, snap, open) => {
    await open();
    await wait(300); await snap('0-cold-open-mc-line');
    await wait(1100); await snap('1-her-caret-in-mc-line');
    await wait(900); await snap('2-mc-line-says-stay');
    await wait(2300); await snap('3-backspacing-goodnight');
    await wait(2000); await snap('4-label-take-your-time');
    await page.waitForSelector('.hercursor.p1'); await wait(100); await snap('5-her-cursor');
    await page.waitForSelector('.ecu'); await wait(300); await snap('6-ecu-eyes-on-mc');
    await wait(1300); await snap('7-ecu-eyes-on-you');
    await page.keyboard.press('r'); await wait(3000); await snap('8-replay-pink-disabled-both-agree');
    await open(); await wait(5600); await page.keyboard.press('2'); await wait(120); await snap('9-purple-bleed');
    await wait(3200); await snap('10-purple-lea');
    await page.keyboard.press('r'); await wait(2400); await snap('11-replay-purple-disabled');
    await open(true); await wait(1500); await snap('rm-mc-line-emptied');
    await page.waitForSelector('.ecu', { timeout: 15000 }); await wait(300); await snap('rm-ecu');
  },
  'menu-1-r2': async (page, snap, open) => {
    await open();
    await wait(700); await snap('1-door');
    await wait(2300); await snap('2-her-hand-on-your-card');
    await page.hover('.card.her'); await wait(500); await snap('3-hover-hers-lifts');
    await page.hover('.card.yours'); await wait(500); await snap('4-hover-yours-held-warm');
    await page.mouse.move(10, 10);
    await wait(2600); await snap('5-timeout-her-hand');
    await wait(1800); await snap('6-timeout-pink');
    await page.keyboard.press('r'); await wait(2200); await snap('7-replay-pink-nailed');
    await open(); await wait(4000); await page.keyboard.press('2'); await wait(150); await snap('8-purple-bleed');
    await wait(1600); await snap('9-purple-reversed');
    await page.keyboard.press('r'); await wait(2400); await snap('10-replay-purple-nailed');
    await open(true); await wait(2600); await snap('rm-table');
  },
  'menu-h1-r3': async (page, snap, open) => {
    await open();
    await wait(1500); await snap('1-deal-her-hand-parked');
    await page.waitForSelector('.card.yours mark.hsel'); await wait(100); await snap('2-her-red-selection');
    await wait(1750); await snap('3-sta-typed');
    await wait(1000); await snap('4-stay-card-warm');
    await wait(2500); await snap('5-timeout-her-hand');
    await wait(1800); await snap('6-timeout-pink');
    await page.keyboard.press('r'); await wait(4000); await snap('7-replay-pink-pinned-she-retypes-yours');
    await open(); await wait(4500); await page.keyboard.press('2'); await wait(120); await snap('8-purple-bleed');
    await wait(2700); await snap('9-purple-reversed-lea');
    await page.keyboard.press('r'); await wait(2500); await snap('10-replay-purple-pinned-struck');
    await open(true); await wait(3600); await snap('rm-stay');
  },
  'menu-3-r3': async (page, snap, open) => {
    await open();
    await page.waitForSelector('.mcline mark.hsel'); await wait(100); await snap('1-her-red-selection-in-mc-line');
    await wait(1400); await snap('2-mc-line-says-stay');
    await page.waitForSelector('.opt.purple mark.hsel'); await wait(100); await snap('3-purple-goodnight-selected');
    await wait(2600); await snap('4-label-take-your-time');
    await page.waitForSelector('.hercursor.p1'); await wait(100); await snap('5-her-cursor');
    await page.waitForSelector('.ecu'); await wait(300); await snap('6-ecu-menu-readable-eyes-on-mc');
    await wait(1300); await snap('7-ecu-eyes-on-you');
    await page.keyboard.press('r'); await wait(3000); await snap('8-replay-pink-disabled-both-agree');
    await open(); await wait(5600); await page.keyboard.press('2'); await wait(120); await snap('9-purple-bleed');
    await wait(1400); await snap('10-purple-lea');
    await page.keyboard.press('r'); await wait(2400); await snap('11-replay-purple-disabled');
    await open(true); await wait(1700); await snap('rm-mc-line-emptied');
    await page.waitForSelector('.ecu', { timeout: 15000 }); await wait(300); await snap('rm-ecu');
  },
  'menu-h4-r3': async (page, snap, open) => {
    await open();
    await wait(600); await snap('1-cold-open-mc-draft');
    await page.waitForSelector('.composer mark.hsel'); await wait(100); await snap('2-her-red-selection-in-his-draft');
    await page.waitForSelector('.composer .hers:not(:empty)'); await wait(700); await snap('3-stay-in-her-red');
    await page.waitForSelector('.drafts'); await wait(2600); await snap('4-drafts-pour-into-pink');
    await page.waitForSelector('.st.delivered'); await wait(200); await snap('5-timeout-delivered');
    await page.waitForSelector('.st.read'); await wait(1500); await snap('6-read-12');
    await page.keyboard.press('r'); await wait(2500); await snap('7-replay-pink-sent-nailed');
    await open(); await wait(4800); await page.keyboard.press('2'); await wait(120); await snap('8-purple-bleed');
    await page.waitForSelector('.inscreen'); await wait(600); await snap('9-not-delivered-pin-in-screen');
    await page.keyboard.press('r'); await wait(2400); await snap('10-replay-purple-sent-nailed');
    await open(true); await wait(1300); await snap('rm-cold-open');
    await wait(4000); await snap('rm-drafts');
  },
};

// camera pieces: freeze the clock at ?t=<ms> and shoot (deterministic frames)
const frames = (list) => async (page, snap, open) => {
  for (const [name, t, still] of list) { await open(!!still, `&t=${t}`); await wait(700); await snap(name); }
};
SHOTS['cam-1'] = frames([['1-tilt-start', 400], ['2-tilt-sky-flare', 5200], ['3-noon', 6900], ['4-dusk', 8600], ['5-night-twelve', 10600],
  ['6-window-match', 11700], ['7-rack-to-strap', 15600], ['8-platform-rain', 20500], ['9-door-flare', 30400], ['rm-window', 14000, true]]);
SHOTS['cam-2'] = frames([['1-intertitle', 1200], ['2-dolly-lit', 4200], ['3-dolly-tubes-dying', 11000], ['4-dolly-she-is-near', 15200],
  ['5-intertitle-12', 16500], ['6-genkan-dolly', 20000], ['7-stare', 26800], ['rm-dolly-dark', 13000, true]]);
SHOTS['cam-3'] = frames([['1-train', 800], ['2-push-umeboshi', 5200], ['3-match-iris', 6300], ['4-pull-her-face', 9400], ['5-her-ad-slip', 12700],
  ['6-poster-pull', 15000], ['7-underpass-reveal', 19500], ['8-tunnel', 21400], ['9-phone-face-down', 23200], ['10-phone-train', 25500], ['11-into-screen', 29800], ['rm-her-ad', 8000, true]]);
SHOTS['cam-h-r2-a'] = frames([['01-train-af-hunt', 900], ['02-train-lock-umeboshi', 2400], ['03-dzoom-red', 5800], ['04-match-iris', 6300], ['05-her-ad', 11000],
  ['06-slip-wide', 12300], ['07-poster-pull', 15000], ['08-af-jumps-to-tunnel', 17800], ['09-night-dzoom-her', 21300], ['10-dropout', 22600], ['11-floor-counting', 27000],
  ['12-face-12-phone', 30000], ['13-push-into-screen', 31800], ['14-loop-frame', 32490], ['rm-floor', 27000, true], ['rm-her-ad', 9000, true]]);
SHOTS['closeup-1'] = frames([['1-hover-tamago', 1800], ['2-over-umeboshi', 3700], ['3-pucker-tint', 4300], ['4-sour-sfx', 5200], ['5-smile-anyway', 7500], ['6-echo-two-plums', 10500], ['rm-pucker', 4600, true]]);
SHOTS['closeup-2'] = frames([['1-buzz-lockscreen', 1200], ['2-flip-edge', 2200], ['3-face-down', 3000], ['4-kuleshov-blank', 5000], ['5-nobody', 6400], ['6-buzz-again-leak', 8200], ['7-only-you', 10800], ['rm-lockscreen', 1200, true]]);
SHOTS['closeup-3'] = frames([['1-table', 1800], ['2-rack-before', 3800], ['3-rack-third-sharp', 6600], ['4-steam-or', 7900], ['5-who', 10300], ['6-toward-you', 12800], ['7-three-of-us', 15000], ['rm-steam-or', 8800, true]]);
SHOTS['closeup-3-r2'] = frames([['1-rack-ripples', 6600], ['2-steam-or', 7900], ['3-fingertips-on-saucer', 12000], ['4-slid-to-lens', 13300], ['5-palm-up-three-of-us', 15000], ['rm-palm-up', 13000, true], ['rm-steam-or', 8800, true]]);
SHOTS['closeup-4'] = frames([['1-shoes', 2000], ['2-shrine-push', 7000], ['3-your-circuit', 10500], ['4-offering', 14500], ['rm-circuit', 10500, true]]);
SHOTS['closeup-5'] = frames([['1-hum', 1300], ['2-flicker', 3900], ['3-red', 6500], ['4-off', 9100], ['rm-flicker', 3900, true]]);
SHOTS['nanda-1'] = frames([['1-platform-rim-reflection', 3000], ['2-door-lit', 8500], ['3-genkan-backlit', 14200], ['4-third-cup-behind-table', 20000], ['rm-door', 8000, true]]);
SHOTS['nanda-2'] = frames([['1-bench', 500], ['2-bench-settled', 2500], ['rm-bench', 1000, true]]);
SHOTS['anim-1'] = frames([['1-rooftop-petals', 6000], ['2-train-pole', 10500], ['3-platform-rings', 24000], ['4-genkan-candle-dust', 41500], ['5-her-idle', 45500], ['6-her-blink', 46800], ['rm-platform', 24000, true]]);
SHOTS['anim-2'] = frames([['1-train-anticipation', 300], ['2-train-smear', 750], ['3-train-impact-frame', 1100], ['4-train-hold', 2200], ['5-naan-hold', 5600], ['6-door-hold', 9000], ['7-kira-hold', 12400], ['8-slippers-hold', 15800], ['rm-kira', 12400, true]]);

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
