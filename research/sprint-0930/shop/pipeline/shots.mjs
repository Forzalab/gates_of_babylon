// Shots of every v2-shop line in play order (the real player, date-beta.html), with the HER LIST game played through
// every frame kind: shelf, pout, right, OCPD, BPD split + sweet, end card, the scored reaction.
// usage: node shots.mjs http://localhost:5321 research/sprint-0930/shop/shots [rm]
import { mkdirSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';

const [base = 'http://localhost:5321', out = 'research/sprint-0930/shop/shots', mode = ''] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await pkg.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: mode === 'rm' ? 'reduce' : 'no-preference' });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
let n = 0;
const shot = async (tag) => { const f = `${out}/${String(n++).padStart(2, '0')}-${tag}.png`; await p.screenshot({ path: f }); console.log(f); };
const open = async (beat) => {
  await p.goto(`${base}/date-beta.html?seed=2&scene=v2-shop&beat=${beat}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1600);
};
const LINES = 13, GAME = 4;
for (let i = 0; i < LINES; i++) {
  await open(i);
  if (i !== GAME) { await shot(`beat${i}`); continue; }
  await shot('game-r1-shelf');
  await p.keyboard.press('2'); await p.waitForTimeout(400); await shot('game-r1-wrong-pout');
  await p.waitForTimeout(1300); await p.keyboard.press('1'); await p.waitForTimeout(400); await shot('game-r1-right');
  await p.waitForTimeout(1400); await shot('game-r2-shelf');
  await p.keyboard.press('1'); await p.waitForTimeout(400); await shot('game-r2-wrong-ocpd');
  await p.waitForTimeout(1300); await p.keyboard.press('2'); await p.waitForTimeout(400); await shot('game-r2-right');
  await p.waitForTimeout(1400); await shot('game-r3-shelf');
  await p.keyboard.press('2'); await p.waitForTimeout(400); await shot('game-r3-wrong-bpd');
  await p.waitForTimeout(1000); await shot('game-r3-bpd-sweet');
  await p.waitForTimeout(1500); await p.keyboard.press('3'); await p.waitForTimeout(400); await shot('game-r3-right');
  await p.waitForTimeout(1500); await shot('game-end-card');
  await p.waitForTimeout(2300); await shot('game-react');
}
if (errs.length) console.log('ERRORS', [...new Set(errs)]);
await b.close();
