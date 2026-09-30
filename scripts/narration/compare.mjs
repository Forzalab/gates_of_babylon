// Step 1: render the same 3 lines per voice x model candidate into research/sprint-0930/narration/test/, log latency/size/duration.
import fs from 'node:fs';
import { speak } from './eleven.mjs';
import { alignedMs } from './timing.mjs';

const OUT = new URL('../../research/sprint-0930/narration/test/', import.meta.url);
fs.mkdirSync(OUT, { recursive: true });
const LINES = [
  'Close-up. The lid lifts. One red umeboshi on white rice.',
  'SHOP STREET · 2:00 PM. Sunny. Vending machines hum. Nanda pulls you to a shop.',
  'Technically, rain wasn\'t forecast.',
];
const VOICES = { daniel: 'onwK4e9ZLuTAKqWW03F9', river: 'SAz9YHcvj6GT2YYXdXww', alice: 'Xb7hH8MSUJpSbSDYk0k2' };
const RUNS = (process.argv[2] ?? '').split(',').filter(Boolean); // voice:model pairs
const log = [];
for (const r of RUNS) {
  const [v, model] = r.split(':');
  for (const [i, text] of LINES.entries()) {
    try {
      const { mp3, alignment, ms } = await speak(VOICES[v], text, { model });
      const f = `${v}_${model}_${i + 1}.mp3`;
      fs.writeFileSync(new URL(f, OUT), mp3);
      const row = { voice: v, model, line: i + 1, latencyMs: ms, bytes: mp3.length, audioMs: alignedMs(alignment, mp3), aligned: !!alignment, file: f };
      log.push(row);
      console.log(JSON.stringify(row));
    } catch (e) { console.log(v, model, i + 1, 'ERR', e.message.slice(0, 200)); }
  }
}
const p = new URL('results.json', OUT);
const old = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
fs.writeFileSync(p, JSON.stringify([...old, ...log], null, 1));
