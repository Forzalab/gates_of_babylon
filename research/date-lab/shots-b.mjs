// Builder B screenshots: 1920x1080 PNGs of every B variant (full motion + reduced motion) into research/date-lab/shots/.
// Run: npm run build && npx vite preview --port 5482 (background), then: node research/date-lab/shots-b.mjs [id-filter]
// Each shot = { id, name, q (extra query), wait (ms), steps: [['click', x, y] | ['key', k] | ['wait', ms] | ['move', x, y]] }.
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:5482/date-lab.html';
const OUT = new URL('./shots/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

export const SHOTS = [
  // menu-4 Bandersnatch
  { id: 'menu-4', name: 'intro', wait: 2600 },
  { id: 'menu-4', name: 'choice-t2s', q: 'state=menu', wait: 2300 },
  { id: 'menu-4', name: 'choice-t4s', q: 'state=menu', wait: 4200 },
  { id: 'menu-4', name: 'purple-bleed', q: 'state=menu', wait: 900, steps: [['key', '2'], ['wait', 120]] },
  { id: 'menu-4', name: 'purple-after', q: 'state=menu', wait: 900, steps: [['key', '2'], ['wait', 2600]] },
  { id: 'menu-4', name: 'rewind', q: 'state=menu', wait: 900, steps: [['key', '2'], ['wait', 4700]] },
  { id: 'menu-4', name: 'replay-disabled', q: 'state=replay', wait: 3000 },
  { id: 'menu-4', name: 'timeout-pink', q: 'state=menu', wait: 6300 },
  { id: 'menu-4', name: 'pink-genkan', q: 'state=menu', wait: 900, steps: [['key', '1'], ['wait', 4200]] },
  { id: 'menu-4', name: 'rm-choice', q: 'state=menu&still', wait: 2300 },
  { id: 'menu-4', name: 'rm-replay', q: 'state=replay&still', wait: 3200 },
  // menu-5 circuit wires (the wire rests at 420,820; pads at 1420,400 pink / 1420,730 purple)
  { id: 'menu-5', name: 'boot', wait: 1600 },
  { id: 'menu-5', name: 'choice-t2s', q: 'state=menu', wait: 2200 },
  { id: 'menu-5', name: 'drag-toward-purple', q: 'state=menu', wait: 1500, steps: [['move', 420, 820], ['down'], ['move', 900, 800], ['move', 1150, 880], ['wait', 200]] },
  { id: 'menu-5', name: 'purple-wired', q: 'state=menu', wait: 1200, steps: [['move', 420, 820], ['down'], ['move', 900, 850], ['move', 1250, 910], ['up'], ['wait', 900]] },
  { id: 'menu-5', name: 'replay-scorched', q: 'state=replay', wait: 2600 },
  { id: 'menu-5', name: 'timeout-pink', q: 'state=menu', wait: 6600 },
  { id: 'menu-5', name: 'rm-choice', q: 'state=menu&still', wait: 2300 },
  // cam-4 Hitchcock (?t=<s>&pause freezes a frame)
  ...[0.9, 3.0, 5.8, 9.5, 12.0, 14.8, 16.6, 19.2, 21.6, 23.4, 24.3, 25.6, 28.0, 30.7, 32.0].map((s) => ({ id: 'cam-4', name: `t${s.toFixed(1).padStart(4, '0')}`, q: `t=${s}&pause`, wait: 900 })),
  { id: 'cam-4', name: 'rm-dolly-mid', q: 't=21.6&pause&still', wait: 900 },
  { id: 'cam-4', name: 'rm-inside-end', q: 't=30.7&pause&still', wait: 900 },
  // cam-5 found footage
  ...[3.4, 9.6, 14.0, 16.6, 20.4, 21.2, 23.6, 28.6, 31.2, 33.9].map((s) => ({ id: 'cam-5', name: `t${s.toFixed(1).padStart(4, '0')}`, q: `t=${s}&pause`, wait: 900 })),
  { id: 'cam-5', name: 'rm-t21.2', q: 't=21.2&pause&still', wait: 900 },
  // cam-6 Anno
  ...[1.5, 5.0, 8.6, 11.0, 14.4, 16.0, 20.0, 22.4, 26.6, 29.4, 32.4, 36.0, 40.0].map((s) => ({ id: 'cam-6', name: `t${s.toFixed(1).padStart(4, '0')}`, q: `t=${s}&pause`, wait: 900 })),
  { id: 'cam-6', name: 'rm-t29.4', q: 't=29.4&pause&still', wait: 900 },
  // fx-1 reel (each beat mid-effect) + RM
  { id: 'fx-1', name: 'rain', q: 'beat=rain', wait: 1400 },
  { id: 'fx-1', name: 'breath', q: 'beat=breath', wait: 900 },
  { id: 'fx-1', name: 'bell', q: 'beat=bell', wait: 1100 },
  { id: 'fx-1', name: 'sour', q: 'beat=sour', wait: 560 },
  { id: 'fx-1', name: 'bleed', q: 'beat=bleed', wait: 600 },
  { id: 'fx-1', name: 'thump', q: 'beat=thump', wait: 560 },
  { id: 'fx-1', name: 'steam', q: 'beat=steam', wait: 1500 },
  { id: 'fx-1', name: 'static', q: 'beat=static', wait: 1500 },
  { id: 'fx-1', name: 'steeped', q: 'beat=steeped', wait: 4000 },
  { id: 'fx-1', name: 'steeped-blink', q: 'beat=steeped', wait: 4300 + 900 },
  { id: 'fx-1', name: 'rm-steam', q: 'beat=steam&still', wait: 900 },
  { id: 'fx-1', name: 'rm-sour', q: 'beat=sour&still', wait: 600 },
  // fx-2 wall
  { id: 'fx-2', name: 'wall', wait: 3500 },
  { id: 'fx-2', name: 'wall-late', wait: 16500 },
  { id: 'fx-2', name: 'rm-wall', q: 'still', wait: 3500 },
  // anim-3 Ito creep: stage 0 vs stage 4 per scene, one blink mid-close, one RM
  ...['rooftop', 'train', 'naan', 'platform', 'underpass', 'apartment', 'stairs', 'genkan'].flatMap((sc) => [
    { id: 'anim-3', name: `${sc}-0`, q: `scene=${sc}&stage=0&pause`, wait: 900 },
    { id: 'anim-3', name: `${sc}-4`, q: `scene=${sc}&stage=4&pause`, wait: 900 },
  ]),
  { id: 'anim-3', name: 'blink', q: 'scene=platform&stage=2&pause', wait: 900, steps: [['move', 1340, 560], ['click', 1340, 560], ['wait', 120]] },
  { id: 'anim-3', name: 'rm-stairs-3', q: 'scene=stairs&stage=3&pause&still', wait: 900 },
  // anim-4 Paprika parade (scene = 4.6 s: hold 2.6 + morph 2.0)
  ...[1.0, 3.2, 3.8, 4.4, 14.0, 17.4, 28.5, 40.2].map((s) => ({ id: 'anim-4', name: `t${s.toFixed(1).padStart(4, '0')}`, q: `t=${s}&pause`, wait: 900 })),
  { id: 'anim-4', name: 'rm-t40.2', q: 't=40.2&pause&still', wait: 900 },
  // ---------------- round 2 ----------------
  // menu-h2-r2 "Her Time, Her Cut" (?mt=<ms> freezes the menu clock)
  { id: 'menu-h2-r2', name: '1-caret-tell-t1s', q: 'state=menu&mt=1000', wait: 1200 },
  { id: 'menu-h2-r2', name: '2-glitch-t3.1s', q: 'state=menu&mt=3100', wait: 1200 },
  { id: 'menu-h2-r2', name: '3-select-t3.6s', q: 'state=menu&mt=3600', wait: 1200 },
  { id: 'menu-h2-r2', name: '4-typing-t4.0s', q: 'state=menu&mt=4000', wait: 1200 },
  { id: 'menu-h2-r2', name: '5-stay-t4.6s', q: 'state=menu&mt=4600', wait: 1200 },
  { id: 'menu-h2-r2', name: '6-live-timeout-pink', q: 'state=menu', wait: 6000 },
  { id: 'menu-h2-r2', name: '7-leave-her-face', q: 'state=menu', wait: 1000, steps: [['key', '2'], ['wait', 2500]] },
  { id: 'menu-h2-r2', name: '8-her-cut', q: 'state=menu', wait: 1000, steps: [['key', '2'], ['wait', 5200]] },
  { id: 'menu-h2-r2', name: '9-take-two-cut', q: 'state=replay&mt=2000', wait: 1400 },
  { id: 'menu-h2-r2', name: 'rm-edit', q: 'state=menu&mt=3200&still', wait: 1200 },
  // menu-4-r2 Bandersnatch improved
  { id: 'menu-4-r2', name: '1-first-frame-lean', q: 'state=menu&mt=0', wait: 1200 },
  { id: 'menu-4-r2', name: '2-t2.5s', q: 'state=menu&mt=2500', wait: 1200 },
  { id: 'menu-4-r2', name: '3-t4.5s', q: 'state=menu&mt=4500', wait: 1200 },
  { id: 'menu-4-r2', name: '4-reaction-real-face', q: 'state=menu', wait: 1000, steps: [['key', '2'], ['wait', 2600]] },
  { id: 'menu-4-r2', name: '5-rewind', q: 'state=menu', wait: 1000, steps: [['key', '2'], ['wait', 4800]] },
  { id: 'menu-4-r2', name: '6-already-seen', q: 'state=menu', wait: 1000, steps: [['key', '2'], ['wait', 6200]] },
  { id: 'menu-4-r2', name: '7-room-chose-pink', q: 'state=replay', wait: 1000, steps: [['key', '1'], ['wait', 1500], ['key', 'r'], ['wait', 2000]] },
  { id: 'menu-4-r2', name: 'rm-first-frame', q: 'state=menu&mt=0&still', wait: 1200 },
  // cam-h-r2-b (train 0-5.6, platform 5.6-10.6, underpass 10.6-19.2, apartment 19.2-24.6, stairs 24.6-30.2, fall 30.2-37.8)
  ...[0.0, 1.8, 4.8, 7.0, 10.55, 10.65, 12.6, 14.8, 16.8, 19.15, 19.25, 21.8, 28.6, 31.4, 35.6, 37.75].map((s) => ({ id: 'cam-h-r2-b', name: `t${s.toFixed(2).padStart(5, '0')}`, q: `t=${s}&pause`, wait: 1000 })),
  // anim-3-r2 crowd mode: the room's eye drains (paused poses), a live hands-off run (no mouse), re-inked stages, hand mode, RM
  ...[0, 1600, 3100, 4600].map((ms, i) => ({ id: 'anim-3-r2', name: `1-room-eye-pose${i}`, q: `scene=platform&stage=1&room=${ms}&pause`, wait: 900 })),
  { id: 'anim-3-r2', name: '2-live-handsoff-6.8s', q: 'scene=platform&stage=0', wait: 6800 },
  { id: 'anim-3-r2', name: '3-live-handsoff-19s', q: 'scene=platform&stage=0', wait: 19000 },
  { id: 'anim-3-r2', name: '4-platform-inked-4', q: 'scene=platform&stage=4&pause', wait: 900 },
  { id: 'anim-3-r2', name: '5-genkan-inked-3', q: 'scene=genkan&stage=3&pause', wait: 900 },
  { id: 'anim-3-r2', name: '6-apartment-inked-4', q: 'scene=apartment&stage=4&pause', wait: 900 },
  { id: 'anim-3-r2', name: '7-hand-mode', q: 'scene=stairs&stage=2', wait: 900, steps: [['move', 400, 700], ['move', 420, 690], ['wait', 300]] },
  { id: 'anim-3-r2', name: 'rm-room-eye', q: 'scene=underpass&stage=3&room=3100&pause&still', wait: 900 },
  { id: 'cam-h-r2-b', name: 'rm-t14.8', q: 't=14.8&pause&still', wait: 1000 },
  { id: 'cam-h-r2-b', name: 'rm-t37.75', q: 't=37.75&pause&still', wait: 1000 },
];

const filter = process.argv[2];
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
for (const s of SHOTS) {
  if (filter && !`${s.id}-${s.name}`.includes(filter)) continue;
  const q = new URLSearchParams(s.q ?? '');
  q.set('v', s.id);
  await page.goto(`${BASE}?${q.toString().replace(/=(&|$)/g, '$1')}`);
  await page.waitForTimeout(s.wait ?? 1000);
  for (const [op, a, b] of s.steps ?? []) {
    if (op === 'click') await page.mouse.click(a, b);
    else if (op === 'move') await page.mouse.move(a, b, { steps: 6 });
    else if (op === 'down') await page.mouse.down();
    else if (op === 'up') await page.mouse.up();
    else if (op === 'key') await page.keyboard.press(a);
    else if (op === 'wait') await page.waitForTimeout(a);
  }
  const file = `${OUT}${s.id}-${s.name}.png`;
  await page.screenshot({ path: file });
  console.log('shot', file);
}
if (errors.length) console.log('PAGE ERRORS:\n' + [...new Set(errors)].join('\n'));
await browser.close();
