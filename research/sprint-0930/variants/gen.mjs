// node research/sprint-0930/variants/gen.mjs v1  -> writes packs/variant-v1.json + the tables block for V1.md (stdout)
// Validates the full play list + the variant with loadScenes (assets manifest), then prints the time budget.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, '../../../src/date-beta/');
const { applyPacks } = await import(SRC + 'packs/index.js');
const { loadScenes } = await import(SRC + 'engine.js');
const j = (f) => JSON.parse(fs.readFileSync(SRC + f));
const v = process.argv[2];
const V = (await import(path.join(HERE, `${v}.data.mjs`))).default;
const P = (id) => `${v}-${id}`;

const BASE = ['story', 'meta', 'mech', 'lockgame', 'obbp', 'sequences'];
const base = applyPacks(j('scenes.json'), BASE.map((n) => ({ name: n, ...j(`packs/${n}.json`) })));

const SPK = { N: 'NANDA', Y: 'MC', '-': false };
const WHO = { N: 'Nanda → you', Y: 'you → Nanda', '-': 'narrator' };
function choice(c) {
  const [text, love, emote, react, set = {}, go] = c.a;
  const o = { text, side: c.side };
  if (c.side === 'mid') o.default = true;
  o.set = { cold: c.side === 'purple' ? 'yes' : 'no', ...set };
  o.love = love; o.emote = emote; o.fx = c.side === 'pink' ? 'love-burst' : c.side === 'purple' ? 'hate-quake' : 'none'; o.react = react;
  if (go) o.go = P(go);
  return o;
}
const goOf = (g) => (typeof g === 'string' ? (g.startsWith('!') ? g.slice(1) : P(g)) : g.map((x) => ({ ...(x.if ? { if: x.if } : {}), to: x.to.startsWith('!') ? x.to.slice(1) : P(x.to) })));
function beatJson(b) {
  const o = {};
  if (b.bg) o.bg = b.bg;
  o.speaker = SPK[b.spk ?? '-'];
  o.text = b.text;
  if (b.cue) o.sfx = b.cue;
  o.props = { shot: b.id, ...(b.stamp ? { place: b.stamp[0], time: b.stamp[1] } : {}), ...(b.props ?? {}) };
  if (b.vary) o.vary = b.vary;
  if (b.pick) { o.timer = 12; o.choices = [{ side: 'pink', a: b.pick[0] }, { side: 'mid', a: b.pick[1] }, { side: 'purple', a: b.pick[2] }].map(choice); }
  if (b.move) o.choices = [{ text: b.move[0], go: goOf(b.move[1]) }];
  return o;
}
const pack = {
  name: `variant-${v}`,
  notes: [`${V.title}. Play: ?pack=${BASE.join(',')},variant-${v}. Design doc: research/sprint-0930/variants/${v.toUpperCase()}.md`,
    'props.shot = shot id from SHOTS-SCHEMA.md (sprint/seq-visual); stamp beats carry props.place/time. bg stays the fallback art.'],
  scenes: V.scenes.map((s) => ({ id: P(s.id), title: s.title, short: s.short, bg: s.bg, nanda: true, beats: s.beats.map(beatJson) })),
  insert: [{ after: 'rooftop', ids: V.scenes.map((s) => P(s.id)) }],
  patch: [],
};
// rooftop: route the last pick into the variant, then add the opening stamp after the goal card.
const roof = base.scenes.find((s) => s.id === 'rooftop');
const last = roof.beats.length - 1;
pack.patch.push({ scene: 'rooftop', beat: last, set: { choices: roof.beats[last].choices.map((c) => ({ ...c, go: P(V.scenes[0].id) })) } });
pack.patch.push({ scene: 'rooftop', beat: 1, beats: [beatJson(V.roofStamp)] });
for (const p of V.patch ?? []) pack.patch.push(p);
fs.writeFileSync(SRC + `packs/variant-${v}.json`, JSON.stringify(pack, null, 1) + '\n');

const full = applyPacks(j('scenes.json'), [...BASE, `variant-${v}`].map((n) => ({ name: n, ...(n === `variant-${v}` ? pack : j(`packs/${n}.json`)) })));
loadScenes(full, { manifest: j('assets.json') });

// time budget: worst path. 3 s per line, 5 s per pick, +30 s for the lock game.
const sec = (s) => s.beats.reduce((t, b) => t + (b.choices ? 5 : 3), 0);
const byId = (id) => full.scenes.find((s) => s.id === id);
const rows = [];
rows.push(['rooftop (patched)', sec(byId('rooftop'))]);
for (const s of V.path) {
  if (Array.isArray(s)) { const [a, b] = s.map((x) => byId(P(x))); const w = sec(a) >= sec(b) ? a : b; rows.push([`${w.id} (longer branch of ${s.map(P).join(' / ')})`, sec(w)]); }
  else rows.push([P(s), sec(byId(P(s)))]);
}
for (const id of ['cup', 'unknown', 'escape', 'escape-win']) rows.push([id + ' (kept)', sec(byId(id))]);
rows.push(['lock game play (estimate)', 30]);
const total = rows.reduce((t, r) => t + r[1], 0);
const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
let out = `## Time budget (worst path: longer errand branch, basement escape ending; 3 s/line, 5 s/pick)\n| scene | s |\n|---|---|\n`;
for (const [n, s] of rows) out += `| ${n} | ${s} |\n`;
out += `| **total** | **${total} s = ${mmss(total)}** |\n\n`;
out += 'Legend: N = Nanda → you (the player). narr = narrator text. PICK = a 3-way choice (♥ / = / 💔), 12 s timer.\n\n';
const EMO = { hearts: '♥♥', heart: '♥', sweat: 'sweat', hate: '💔 hate', or: 'or', pout: 'pout', crack: 'crack' };
for (const s of [{ ...V.roofHead, beats: [V.roofStamp] }, ...V.scenes]) {
  out += `### ${s.head ?? s.title}\n| # | shot | place / time | line (speaker → listener) | SFX / silence | emote / fx |\n|---|---|---|---|---|---|\n`;
  s.beats.forEach((b, i) => {
    let line = `${b.spk === 'N' ? 'N' : b.spk === 'Y' ? 'You' : 'narr'}: ${b.text}`;
    if (b.vary) { const [f, m] = Object.entries(b.vary)[0]; line = `${b.spk === 'N' ? 'N' : 'narr'} (by ${f}): ` + Object.entries(m).map(([k, x]) => `[${k}] ${x.text}`).join(' '); }
    let emo = b.emo ?? '';
    if (b.pick) { line += ` ▸ PICK: ${b.pick.map((c) => c[0]).join(' / ')}`; emo = b.pick.map((c) => `${EMO[c[2]] ?? c[2]}: "${c[3]}"`).join(' · '); }
    if (b.move) line += ` ▸ [${b.move[0]}]`;
    out += `| ${i + 1} | ${b.shot} | ${b.stamp ? b.stamp.join(' · ') : ''} | ${line} | ${b.sfx ?? b.cue ?? ''} | ${emo} |\n`;
  });
  if (s.why) out += `*Arc:* ${s.why}\n`;
  out += '\n';
}
const head = fs.readFileSync(path.join(HERE, `${v}.head.md`), 'utf8');
fs.writeFileSync(path.join(HERE, `${v.toUpperCase()}.md`), head + '\n' + out.trimEnd() + '\n');
console.error(`ok ${v}: ${full.scenes.length} scenes, worst path ${mmss(total)}`);
