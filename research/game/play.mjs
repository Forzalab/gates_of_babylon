// research/game/play.mjs: plays a scripted game of date.html?game=1 with real mouse clicks and saves screenshots.
// Usage: node research/game/play.mjs <port>   (a vite dev server must be running on that port)
// Shots (per width 1440x810 and 1024x768): start, hurt, combo, ending pop-up, and the canvas the circuits land on.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = pkg;
const PORT = process.argv[2] || 5391;
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
const URL = `http://localhost:${PORT}/date.html`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];

async function playAt(browser, w, h, reduced) {
  const tag = `${w}${reduced ? '-still' : ''}`;
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  page.on('pageerror', (e) => errors.push(`${tag}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  // IN: the canvas hands its gates to the game (the same key DateCanvas writes).
  await page.goto(`${URL}?canvas=1`);
  await page.evaluate(() => { sessionStorage.clear(); });
  await page.goto(`${URL}?canvas=1`);
  await page.evaluate(() => sessionStorage.setItem('gob.game.in', JSON.stringify(['AND', 'XOR', 'XOR', 'NOT', 'NOT', 'XOR', 'OR', 'NAND', 'NAND'])));
  await page.goto(`${URL}?game=1&seed=7`);
  await page.waitForSelector('[data-testid=board]');
  await sleep(400);
  const board = await page.locator('[data-testid=board]').boundingBox();
  const cell = board.width / 7;
  const idle = () => page.waitForFunction(() => window.__bag && !window.__bag.state().busy);
  const dropAt = async (c) => {
    await page.mouse.move(board.x + cell * (c + 0.5), board.y + cell * 0.5);
    await sleep(120);
    await page.mouse.down(); await page.mouse.up();
  };
  const hover = async (c) => { await page.mouse.move(board.x + cell * (c + 0.5), board.y + cell * 0.5); await sleep(150); };

  await hover(5);
  await dropAt(6); await idle(); // AND
  await hover(5);
  await page.screenshot({ path: `${OUT}/${tag}-1-start.png` });
  await dropAt(5); // XOR next to AND: 25%, same charge, HURT
  await sleep(reduced ? 300 : 650);
  await page.screenshot({ path: `${OUT}/${tag}-2-hurt.png` });
  await idle(); await sleep(1300);
  await dropAt(3); await idle(); // XOR, alone
  await dropAt(4); await idle(); // NOT between two XORs: opposites, HURT x2
  await sleep(1200);
  await dropAt(3); await idle(); // NOT on the XOR: 3rd HURT in a row -> APPROVAL NEEDED
  await sleep(300);
  await page.screenshot({ path: `${OUT}/${tag}-2b-approval.png` });
  await sleep(1600);
  await dropAt(2); // XOR meets XOR: both vanish, the NOT above falls next to the other NOT: combo x2
  await sleep(reduced ? 420 : 900);
  await page.screenshot({ path: `${OUT}/${tag}-3-combo.png` });
  await idle(); await sleep(2400);
  await dropAt(4); await idle(); // OR next to XOR: meant to be together (a child)
  await sleep(700);
  await page.screenshot({ path: `${OUT}/${tag}-4-card.png` });
  await sleep(2000);
  const st = await page.evaluate(() => window.__bag.state());
  await page.getByRole('button', { name: /CHECK OUT/ }).click();
  await page.waitForSelector('[data-testid=pop]');
  await sleep(reduced ? 200 : 900);
  await page.screenshot({ path: `${OUT}/${tag}-5-ending.png` });
  const pop = await page.locator('[data-testid=pop]').textContent();
  await page.getByTestId('hello').click();
  await page.waitForSelector('[data-testid=imported]');
  await sleep(500);
  await page.screenshot({ path: `${OUT}/${tag}-6-canvas.png` });
  const imported = await page.locator('[data-testid=imported]').count();
  // Round trip: bag the canvas again, the first drop is the canvas's first gate.
  const first = await page.evaluate(() => JSON.parse(sessionStorage.getItem('gob.canvas')));
  console.log(tag, JSON.stringify({ affection: st.affection, counts: st.counts, pop, imported, canvasGates: Object.values(first.nodes).filter((n) => n.kind === 'G').length }));
  await page.close();
}

// Lose path + real drag + swipe: AND/NOR stacked in one column never glow, so the bag overflows with 0 merges.
async function lose(browser, w, h) {
  const tag = `${w}-lose`;
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on('pageerror', (e) => errors.push(`${tag}: ${e.message}`));
  await page.goto(`${URL}?canvas=1`);
  await page.evaluate(() => { sessionStorage.clear(); sessionStorage.setItem('gob.game.in', JSON.stringify(['XOR', 'AND', 'NOR', 'AND', 'NOR', 'AND', 'NOR', 'AND', 'NOR', 'AND', 'NOR', 'AND'])); });
  await page.goto(`${URL}?game=1&seed=3`);
  await page.waitForSelector('[data-testid=board]');
  await page.evaluate(() => document.fonts.ready); await sleep(300);
  const board = await page.locator('[data-testid=board]').boundingBox();
  const cell = board.width / 7;
  const idle = () => page.waitForFunction(() => window.__bag && !window.__bag.state().busy);
  // real drag: press on column 0, drag to column 6, release there
  await page.mouse.move(board.x + cell * 0.5, board.y + cell * 0.5); await page.mouse.down();
  for (let k = 1; k <= 12; k++) await page.mouse.move(board.x + cell * (0.5 + k / 2), board.y + cell * 0.5);
  await page.mouse.up(); await idle(); await sleep(250);
  const st1 = await page.evaluate(() => window.__bag.state().cols.map((c) => c.join(',')));
  // swipe: flick the XOR on column 6 to the left -> it slides into column 5
  const x6 = board.x + cell * 6.5, yb = board.y + board.height - cell * 0.5;
  await page.mouse.move(x6, yb);
  await page.mouse.down(); await page.mouse.move(x6 - cell * 0.8, yb, { steps: 4 }); await page.mouse.up(); await idle();
  const st2 = await page.evaluate(() => window.__bag.state().cols.map((c) => c.join(',')));
  const sw = await page.getByTestId('swipes').textContent();
  for (let k = 0; k < 11; k++) {
    await page.waitForFunction(() => !window.__bag.state().busy && !document.querySelector('.fx.approval'));
    if (await page.locator('[data-testid=pop]').count()) break;
    await page.mouse.move(board.x + cell * 0.5, board.y + cell * 0.5); await page.mouse.down(); await page.mouse.up();
    await sleep(150);
  }
  await page.waitForSelector('[data-testid=pop]');
  await sleep(900);
  const lane = await page.getByTestId('lane').textContent();
  await page.screenshot({ path: `${OUT}/${tag}-ending.png` });
  const pop = await page.locator('[data-testid=pop]').textContent();
  await page.getByTestId('hello').click();
  await page.waitForSelector('[data-testid=imported]');
  await sleep(300);
  await page.screenshot({ path: `${OUT}/${tag}-canvas.png` });
  console.log(tag, JSON.stringify({ dragTo6: st1[6], afterSwipe: [st2[5], st2[6]], swipes: sw, lane, pop, red: await page.locator('.grp.hurt').count() }));
  await page.close();
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
try {
  if (!process.env.ONLY_LOSE) { await playAt(browser, 1440, 810, false); await playAt(browser, 1024, 768, false); await playAt(browser, 1440, 810, true); }
  await lose(browser, 1440, 810);
} finally { await browser.close(); }
if (errors.length) { console.log('ERRORS:\n' + errors.join('\n')); process.exitCode = 1; }
