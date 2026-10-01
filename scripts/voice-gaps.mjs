// voice-gaps.mjs: which Nanda lines the player can reach play silent (no take), without walking play paths.
// Reach = the engine's own scene graph (routeTo, a BFS over scenes): O(scenes + edges), never choices x vary x flags.
// Per reachable scene: each beat line (who NANDA), each choice react, each vary overlay -> voice.js fileForLine. A miss is
// sorted against the recorded-but-unwired appendix takes (research/sprint-0930/voice/appendix-manifest.json):
//   A wired-able  same scene, same words (norm) as an appendix take: wire it, no recording
//   B drift       same scene, a take with nearly the same words (ね vs Neee, tokens): re-record or revert the text
//   C unrecorded  no take anywhere
// Usage: node scripts/voice-gaps.mjs            -> research/sprint-1001/voice/GAPS.md + gaps.json, summary on stdout
//        node scripts/voice-gaps.mjs --wire     -> also appends the A takes to both manifests + voice/timing.json
import fs from 'node:fs';
import { applyPacks } from '../src/date-beta/packs/index.js';
import { loadScenes, routeTo } from '../src/date-beta/engine.js';
import { buildIndex, fileForLine, norm, PAD } from '../src/date-beta/voice/voice.js';
import { mp3Ms } from './narration/timing.mjs';

const ROOT = new URL('../', import.meta.url);
const P = (p) => new URL(p, ROOT);
const read = (p) => JSON.parse(fs.readFileSync(P(p), 'utf8'));
const SLIM = 'src/date-beta/voice/manifest.json', FULL = 'research/sprint-0930/voice/audio-manifest.json';
const TIMING = 'src/date-beta/voice/timing.json', APPX = 'research/sprint-0930/voice/appendix-manifest.json';

// Never shown: the base text of a beat whose vary covers every run (v2-train 6 "loop").
const IGNORE = new Set(['v2-train|loop']);
// Same spoken words, different digits: the take says "seven", the caption "7:00". Wired with the caption's text.
const ALIAS = { 'leave|He wakes at 7:00.': 'public/date-beta/voice/30-leave/213_2.mp3' };

export function liveLines() {
  const main = fs.readFileSync(P('src/date-beta/main.jsx'), 'utf8');
  const PLAY = /const PLAY = \[([^\]]+)\]/.exec(main)[1].match(/'([\w-]+)'/g).map((s) => s.slice(1, -1));
  const data = applyPacks(read('src/date-beta/scenes.json'), PLAY.map((n) => ({ name: n, ...read(`src/date-beta/packs/${n}.json`) })));
  const sc = loadScenes(data), out = [];
  const her = (t) => /^\s*NANDA\s*:/.test(t ?? '');
  sc.forEach((s, i) => {
    if (i && !routeTo(sc, i).length) return; // unreachable scene: nobody hears it
    s.beats.forEach((b, j) => {
      if (b.line?.who === 'NANDA' && b.line.plain) out.push({ scene: s.id, beat: `${j}`, kind: 'line', text: b.line.plain });
      (b.choices ?? []).forEach((c, k) => {
        const r = c.react?.plain ?? c.react;
        if (typeof r === 'string' && r) out.push({ scene: s.id, beat: `${j}.c${k}`, kind: 'react', text: r });
      });
      for (const [f, vals] of Object.entries(b.vary ?? {})) for (const [v, ov] of Object.entries(vals)) {
        const t = ov.line?.who === 'NANDA' ? ov.line.plain : her(ov.text) ? ov.text.replace(/^\s*NANDA\s*:\s*/, '') : null;
        if (t) out.push({ scene: s.id, beat: `${j} ${f}=${v}`, kind: 'vary', text: t });
      }
    });
  });
  return out;
}

// edit distance on norm() strings, as a 0..1 likeness
function like(a, b) {
  const m = a.length, n = b.length;
  if (!m || !n) return 0;
  let prev = Array.from({ length: n + 1 }, (_, k) => k);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let k = 1; k <= n; k++) cur[k] = Math.min(prev[k] + 1, cur[k - 1] + 1, prev[k - 1] + (a[i - 1] === b[k - 1] ? 0 : 1));
    prev = cur;
  }
  return 1 - prev[n] / Math.max(m, n);
}

export function gaps() {
  const slim = read(SLIM), appx = read(APPX), idx = buildIndex(slim);
  const wired = new Set(slim.map((e) => e.file));
  const pool = [...read(FULL), ...appx]; // every take on disk, wired or not
  const lines = liveLines(), miss = [];
  const seen = new Set();
  for (const l of lines) {
    if (fileForLine(idx, l.scene, l.text) || IGNORE.has(`${l.scene}|${l.text}`)) continue;
    const key = `${l.scene}|${norm(l.text)}`;
    if (seen.has(key)) continue; // two picks sharing one react line
    seen.add(key);
    const k = norm(l.text), same = pool.filter((e) => e.scene === l.scene);
    const alias = ALIAS[`${l.scene}|${l.text}`] && same.find((e) => e.file === ALIAS[`${l.scene}|${l.text}`]);
    if (alias) { miss.push({ ...l, cls: 'A', take: { ...alias, text: l.text } }); continue; }
    const hit = same.find((e) => norm(e.text) === k && !wired.has(e.file.replace(/^public\//, '')));
    if (hit) { miss.push({ ...l, cls: 'A', take: hit }); continue; }
    const near = same.map((e) => [e, like(k, norm(e.text))]).sort((x, y) => y[1] - x[1])[0];
    if (near && near[1] >= 0.75) miss.push({ ...l, cls: 'B', take: near[0], like: +near[1].toFixed(2) });
    else miss.push({ ...l, cls: 'C' });
  }
  return { lines: lines.length, miss };
}

function wire(A) {
  const slim = read(SLIM), full = read(FULL), timing = read(TIMING);
  const have = new Set(full.map((e) => e.file));
  let n = 0;
  for (const { take } of A) {
    if (have.has(take.file)) continue;
    have.add(take.file);
    const e = { scene: take.scene, beat: take.beat, file: take.file, text: take.text };
    full.push(take.n != null ? { n: take.n, ...e } : e);
    const rel = take.file.replace(/^public\//, '');
    slim.push({ scene: take.scene, beat: take.beat, file: rel, text: take.text });
    const ms = mp3Ms(fs.readFileSync(P(take.file)));
    timing.files[rel] = { audioMs: ms, holdMs: ms + (timing.pad ?? PAD) };
    n++;
  }
  const put = (p, v) => fs.writeFileSync(P(p), JSON.stringify(v, null, 1) + '\n');
  put(SLIM, slim); put(FULL, full); put(TIMING, timing);
  return n;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { lines, miss } = gaps();
  const by = (c) => miss.filter((m) => m.cls === c);
  const row = (m) => `| ${m.scene} | ${m.beat} | ${m.kind} | ${m.text.replace(/\|/g, '/')} | ${m.take ? `\`${m.take.file.replace(/^public\/date-beta\/voice\//, '')}\`${m.like ? ` (${m.like})` : ''}<br>${m.take.text.replace(/\|/g, '/')}` : ''} |`;
  const sec = (c, h) => [`## ${c}. ${h} (${by(c).length})`, '', '| scene | beat | kind | line | take |', '|---|---|---|---|---|', ...by(c).map(row), ''];
  fs.mkdirSync(P('research/sprint-1001/voice/'), { recursive: true });
  fs.writeFileSync(P('research/sprint-1001/voice/GAPS.md'), [
    '# Voice gaps: reachable Nanda lines with no wired take', '',
    `Made by \`node scripts/voice-gaps.mjs\`. ${lines} reachable Nanda lines (beat lines, reacts, vary overlays), ${miss.length} silent.`, '',
    ...sec('A', 'recorded, not wired (wire it)'), ...sec('B', 'drift: a take with nearly the same words (re-record or revert the text)'), ...sec('C', 'unrecorded'),
  ].join('\n'));
  fs.writeFileSync(P('research/sprint-1001/voice/gaps.json'), JSON.stringify(miss.map(({ scene, beat, kind, text, cls }) => ({ scene, beat, kind, text, cls })), null, 1) + '\n');
  console.log(`${lines} live lines, ${miss.length} silent: A ${by('A').length}, B ${by('B').length}, C ${by('C').length}`);
  if (process.argv.includes('--wire')) console.log('wired', wire(by('A')));
}
