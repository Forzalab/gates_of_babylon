// Shots of art/shots/ via the shots-demo preview pack. usage: npm run build && node research/sprint-0930/sequences/shots.mjs
// Output: shots/<NN>-<bg>-<detail>.png, 1920x1080, 256 colours (+ establish-a/b = first/last pan step).
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
const { chromium } = pkg;
const HERE = dirname(new URL(import.meta.url).pathname);
const ROOT = resolve(HERE, '../../..');
const OUT = join(HERE, 'shots');
const PORT = 4181;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(OUT, { recursive: true });
const beats = JSON.parse(readFileSync(join(ROOT, 'src/date-beta/packs/shots-demo.json'))).scenes[0].beats;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', process.env.DIST ?? 'dist'], { cwd: ROOT, stdio: 'ignore' });
await sleep(2500);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const files = [];
for (const [i, b] of beats.entries()) {
  const detail = b.props.item ?? b.props.emote ?? b.props.of + (b.bg === 'push' ? (b.props.to > b.props.from ? '-in' : '-out') : '');
  const still = !['establish', 'push', 'rack', 'pov', 'timelapse', 'match'].includes(b.bg);
  await page.goto(`http://localhost:${PORT}/date-beta.html?pack=shots-demo&scene=shots-demo&beat=${i}${still ? '&still' : ''}`);
  await sleep(2200);
  const f = `${String(i + 1).padStart(2, '0')}-${b.bg}-${detail}`;
  if (still) { await page.screenshot({ path: join(OUT, `${f}.png`) }); files.push(`${f}.png`); }
  else {
    await page.screenshot({ path: join(OUT, `${f}-a.png`) }); await sleep(3000);
    await page.screenshot({ path: join(OUT, `${f}-b.png`) }); files.push(`${f}-a.png`, `${f}-b.png`);
  }
  console.log(f);
}
await browser.close();
process.kill(server.pid);
execFileSync('python3', ['-c', 'import sys\nfrom PIL import Image\nfor p in sys.argv[1:]: Image.open(p).convert("RGB").quantize(256).save(p,optimize=True)', ...files.map((f) => join(OUT, f))]);
process.exit(0);
