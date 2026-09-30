// Storyboard: walks the CURRENT date-beta game in play order (rooftop -> endings) and shoots every beat + reaction frame.
// usage: npm run build && node research/sprint-0930/sequences/storyboard.mjs [route ...]
// Starts `vite preview` itself (killed by PID), drives ?still with keys (-> = next, 1..3 = pick), plays the lock game
// by clicking pairs (win) or waiting it out (timeout). Output: board/<NN>-<scene>-<beat>[-rK]-<route>.png (256 colours)
// + board/route-<route>.png contact sheets (caption scene:beat). Picks: default = the route's side index.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
const { chromium } = pkg;
const HERE = dirname(new URL(import.meta.url).pathname);
const ROOT = resolve(HERE, '../../..');
const OUT = join(HERE, 'board');
const PORT = 4179;

// side = default pick index on 3-way beats; picks = overrides "scene:beat" -> index; start = ?scene=...
const ROUTES = {
  love: { side: 0, picks: {} }, //                  tamagoyaki, groceries, butter chicken, tea -> steeped
  neutral: { side: 1, picks: { 'cup:3': 2, 'escape:13': 'win' } }, // umeboshi, library, katsu -> unknown -> escape-win
  hate: { side: 2, picks: { 'park:4': 2, 'leave:3': 2 } }, // neither, alone -> errand-shop, not hungry -> leave -> leave-fu
  timeout: { start: 'unknown', side: 0, picks: { 'escape:13': 'lose' } }, // branch tail: lock game timeout
  yeah: { start: 'leave', side: 0, picks: {} }, // branch tail: leave -> leave-yeah
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(ROUTES);
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (want.some((r) => f.endsWith(`-${r}.png`))) rmSync(join(OUT, f));

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'ignore' });
await sleep(2500);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });

const look = (page) => page.evaluate(() => {
  const st = document.querySelector('.stage');
  return {
    beat: document.documentElement.dataset.beat ?? '?',
    choices: [...document.querySelectorAll('.db-choice')].map((b) => b.textContent.trim()),
    lock: document.querySelectorAll('[data-kind]').length,
    end: !!document.querySelector('.hud-end'),
    sig: (document.documentElement.dataset.beat ?? '') + '|' + (st?.innerText ?? '').replace(/\s+/g, ' ').slice(0, 300),
  };
});

async function winLock(page) {
  for (;;) {
    const tiles = await page.$$eval('[data-kind]', (bs) => bs.map((b) => ({ k: b.dataset.kind, i: b.dataset.i, d: b.disabled })));
    const open = tiles.filter((t) => !t.d);
    if (!open.length) return;
    const a = open[0], b = open.find((t) => t !== a && t.k === a.k);
    await page.click(`[data-i="${a.i}"]`); await sleep(120);
    await page.click(`[data-i="${b.i}"]`); await sleep(500);
  }
}

async function run(name) {
  const R = ROUTES[name];
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`http://localhost:${PORT}/date-beta.html?still${R.start ? `&scene=${R.start}` : ''}`);
  await sleep(1500);
  const shots = [];
  let last = '', n = 0, stuck = 0, rk = 0, lastBeat = '';
  for (let step = 0; step < 400; step++) {
    const s = await look(page);
    if (s.sig !== last) {
      last = s.sig; stuck = 0;
      await sleep(600);
      const s2 = await look(page); // settle
      if (s2.sig !== s.sig) { last = ''; continue; }
      rk = s.beat === lastBeat ? rk + 1 : 0; lastBeat = s.beat;
      const [sc, bt] = s.beat.split(':');
      const file = `${String(++n).padStart(3, '0')}-${sc}-${bt}${rk ? `-r${rk}` : ''}-${name}.png`;
      await page.screenshot({ path: join(OUT, file) });
      shots.push({ file, cap: `${s.beat}${rk ? ` r${rk}` : ''}${s.end ? ' END' : ''}` });
      console.log(name, file, s.choices.join(' | '));
    }
    if (s.end || s.choices.some((c) => /Back to start/.test(c))) break;
    if (s.lock) {
      const p = R.picks[s.beat];
      if (p === 'lose') await sleep(43000); else await winLock(page);
      await sleep(1500); continue;
    }
    if (s.choices.length) {
      const p = R.picks[s.beat] ?? Math.min(R.side, s.choices.length - 1);
      await page.keyboard.press(String(p + 1));
    } else await page.keyboard.press('ArrowRight');
    await sleep(250);
    if (++stuck > 60) { console.log(name, 'stuck at', s.beat); break; }
  }
  await page.close();
  return shots;
}

const sheets = {};
for (const r of want) sheets[r] = await run(r);
await browser.close();
server.kill(); // by PID (child handle)
try { process.kill(server.pid); } catch {}

// Quantise to 256 colours + contact sheets (PIL).
const py = `
import json,sys,os
from PIL import Image,ImageDraw,ImageFont
out,sheets=sys.argv[1],json.loads(sys.argv[2])
try: font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',20)
except Exception: font=ImageFont.load_default()
for route,shots in sheets.items():
  tw,th,cols=384,216,5
  rows=(len(shots)+cols-1)//cols
  sheet=Image.new('RGB',(cols*tw,rows*(th+30)),(18,16,24))
  d=ImageDraw.Draw(sheet)
  for i,s in enumerate(shots):
    p=os.path.join(out,s['file']); im=Image.open(p).convert('RGB')
    im.quantize(256).save(p,optimize=True)
    x,y=(i%cols)*tw,(i//cols)*(th+30)
    sheet.paste(im.resize((tw,th)),(x,y)); d.text((x+6,y+th+4),s['cap'],fill=(255,220,235),font=font)
  sheet.quantize(256).save(os.path.join(out,'route-%s.png'%route),optimize=True)
`;
execFileSync('python3', ['-c', py, OUT, JSON.stringify(sheets)], { stdio: 'inherit' });
console.log('done', Object.fromEntries(Object.entries(sheets).map(([k, v]) => [k, v.length])));
process.exit(0);
