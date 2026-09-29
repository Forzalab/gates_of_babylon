// date-beta HUD mockup builder. hud.html?v=A|B&s=<state>[&play] draws one 1920x1080 frame over a real engine plate
// (plates/*.jpg = the live engine with its chrome hidden). Default = the static / reduced-motion frame; &play = stepped motion.
import { nandaSVG } from './nanda-emotes.js';

const q = new URLSearchParams(location.search);
const V = (q.get('v') || 'A').toUpperCase() === 'B' ? 'B' : 'A';
const S = q.get('s') || 'line';
const GOAL = 15; // love points on the best path (see SPEC.txt): 100% = GOAL

const SPINE = ['ROOFTOP', 'TRAIN', 'NAAN', 'DARK', 'DOOR'];
const PATH_TEA = [...SPINE, 'TEA', 'END'];
const PATH_CAFE = [...SPINE, 'CAFÉ', 'END'];

// state table: plate, where on the route, beat of scene, score, delta (reaction frame), Nanda, line, choices, card
const STATES = {
  goal: { plate: 'rooftop-live', path: PATH_TEA, at: 0, beat: 0, beats: 7, score: 0, nanda: { emote: 'heart' }, card: 'goal',
    title: 'Goal card (after the Figur collapse)' },
  line: { plate: 'door', path: PATH_TEA, at: 4, beat: 0, beats: 3, score: 6, nanda: { emote: 'heart' },
    say: { who: 'NANDA', text: "This is me. Unit 12. Obviously you'll remember." }, title: 'Normal Nanda line + NEXT' },
  choice: { plate: 'door', path: PATH_TEA, at: 4, beat: 2, beats: 3, score: 6, scare: 1, nanda: { emote: 'hearts' },
    say: { who: 'NANDA', text: 'I already boiled the water. This morning. Just in case.' },
    choices: [['Just one cup', 'pink'], ['Say goodnight', 'purple']], timer: 5, title: 'Choice beat (NEXT hidden)' },
  plus: { plate: 'rooftop-noon', path: PATH_TEA, at: 0, beat: 2, beats: 7, score: 3, delta: 3, nanda: { emote: 'hearts', big: true },
    say: { who: 'NANDA', text: 'Sweet. Like me. Good input.' }, title: 'Reaction +3 (took the tamagoyaki)' },
  minus: { plate: 'cup', path: PATH_TEA, at: 5, beat: 3, beats: 4, score: 6, delta: -2, scare: 2, nanda: { emote: 'or', big: true },
    say: { who: 'NANDA', text: "Sit. The tea isn't finished." }, title: 'Reaction −2 (stood up from the third cup)' },
  none: { plate: 'train', path: PATH_TEA, at: 1, beat: 0, beats: 2, score: 6, hidden: true,
    say: { text: 'AND Line, local service. Home in twelve stops.' }, title: 'No Nanda on screen = no bar' },
  win: { plate: 'tea', path: PATH_TEA, at: 6, beat: 0, beats: 1, score: 15, scare: 2, nanda: { emote: 'hearts', big: true }, card: 'win',
    title: 'WIN splash (100%)' },
  low: { plate: 'cafe', path: PATH_CAFE, at: 6, beat: 0, beats: 1, score: 4, scare: 2, nanda: { emote: 'crack', big: true }, card: 'low',
    title: 'Low-score ending (27%)' },
};
const st = STATES[S] || STATES.line;
const pct = (n) => `${Math.round((n / GOAL) * 100)}%`;
document.title = `HUD ${V} · ${S}`;

// ---------------------------------------------------------------- small SVG parts
const HEART = 'M50 88C22 66 4 50 4 28C4 13 16 4 29 4C39 4 46 10 50 17C54 10 61 4 71 4C84 4 96 13 96 28C96 50 78 66 50 88Z';
const heartSvg = (cls = '') => `<svg class="lv-heart-svg ${cls}" viewBox="0 0 100 92" aria-hidden="true"><path class="rim" d="${HEART}"/><path class="body" d="${HEART}"/>
  <path class="gloss" d="M24 16C16 17 11 23 11 30C15 25 21 21 29 20C28 18 26 16 24 16Z"/></svg>`;
const heartLine = (cls = '') => `<svg class="${cls}" viewBox="0 0 100 92" aria-hidden="true"><path d="${HEART}"/></svg>`;
const marker = () => `<span class="lv-marker" aria-hidden="true"><svg viewBox="0 0 100 92"><path d="${HEART}"/><path class="in" d="${HEART}" transform="translate(50 46) scale(.56) translate(-50 -46)"/></svg></span>`;
const cracked = `<svg viewBox="0 0 100 92" aria-hidden="true"><path d="${HEART} M50 17L42 36L56 48L45 62L50 88" /></svg>`;
const tri = '<svg viewBox="0 0 26 30" aria-hidden="true"><path d="M3 3L23 15L3 27Z"/></svg>';
const defs = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="lvHeartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f27fc0"/><stop offset=".45" stop-color="#e0409a"/><stop offset="1" stop-color="#b8287a"/></linearGradient>
  <linearGradient id="lvLowFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b7d"/><stop offset="1" stop-color="#b0102c"/></linearGradient></defs></svg>`;

// ---------------------------------------------------------------- the meter cells (1 cell = 1 love point)
function cells(score, delta) {
  const prev = delta ? Math.max(0, Math.min(GOAL, score - delta)) : score;
  let k = 0;
  return Array.from({ length: GOAL }, (_, i) => {
    let c = '';
    if (i < score) c = delta > 0 && i >= prev ? 'new' : 'on';
    else if (delta < 0 && i < prev) c = 'lost';
    const step = c === 'new' || c === 'lost' ? ` style="--i:${k++}"` : '';
    return `<i class="lv-cell ${c}"${step}></i>`;
  });
}

// ---------------------------------------------------------------- the trail (AND Line stations) + beat pips
function trail(s) {
  const out = [];
  s.path.forEach((name, i) => {
    if (i) out.push('<i class="rail"></i>');
    const done = i < s.at ? ' done' : '';
    if (i === s.at) {
      const pips = s.beats > 1 && s.beats <= 8
        ? `<span class="pips">${Array.from({ length: s.beats }, (_, b) => `<i class="pip${b <= s.beat ? ' on' : ''}"></i>`).join('')}</span>` : '';
      out.push(`<span class="here">${name}${pips}</span>`);
    } else if (i === s.path.length - 1) out.push(`<i class="stop end${done}">${heartLine()}</i>`);
    else out.push(`<i class="stop${done}"></i>`);
  });
  return `<div class="lv-trail" role="img" aria-label="Scene ${s.at + 1} of ${s.path.length}: ${s.path[s.at]}">${out.join('')}</div>`;
}

// ---------------------------------------------------------------- the pop: delta pill + Telltale line
function pop(delta) {
  if (!delta) return '';
  const plus = delta > 0;
  const icon = plus ? `<svg viewBox="0 0 100 92" aria-hidden="true"><path d="${HEART}"/></svg>` : cracked;
  return `<div class="lv-pop ${plus ? 'plus' : 'minus'}" role="status"><b class="lv-delta">${icon}${plus ? '+' : '−'}${Math.abs(delta)}</b>
    <span class="lv-tell"><i></i>She'll remember that.</span></div>`;
}

// ---------------------------------------------------------------- variant A: top-edge ribbon
function hudA(s) {
  const full = s.score >= GOAL ? ' full' : '';
  return `<div class="hud-a" style="--goal:${GOAL};--n:${s.score}">
    <div class="lv-badge">${heartSvg()}<b class="lv-num">${pct(s.score)}</b></div>
    <span class="lv-label">LOVE</span>
    <div class="lv-meter" role="meter" aria-label="Her heart" aria-valuemin="0" aria-valuemax="${GOAL}" aria-valuenow="${s.score}">${cells(s.score, s.delta).join('')}${marker()}${pop(s.delta)}</div>
    <span class="lv-goal${full}">${heartLine()}100%</span>
    <i class="lv-sep"></i>${trail(s)}</div>`;
}

// ---------------------------------------------------------------- variant B: thermometer at her side + AND Line sign
function hudB(s) {
  const full = s.score >= GOAL ? ' full' : '';
  return `<div class="hud-b-trail"><span class="lv-label">ROUTE</span>${trail(s)}</div>
    <div class="hud-b" style="--goal:${GOAL};--n:${s.score}">
    <span class="lv-goal${full}">${heartLine()}100%</span>
    <div class="lv-tube"><div class="lv-cells" role="meter" aria-label="Her heart" aria-valuemin="0" aria-valuemax="${GOAL}" aria-valuenow="${s.score}">${cells(s.score, s.delta).reverse().join('')}${marker()}${pop(s.delta)}</div></div>
    <div class="lv-bulb">${heartSvg()}<span class="lv-label">LOVE</span><b class="lv-num">${pct(s.score)}</b></div></div>`;
}

// ---------------------------------------------------------------- dialogue chip (engine markup) + NEXT pill
const nextBtn = (label = 'NEXT') => `<button type="button" class="hud-next" aria-label="${label === 'NEXT' ? 'Next line' : label}">${label} ${tri}</button>`;
function say(s) {
  if (!s.say) return '';
  const who = s.say.who;
  const cls = ['db-say', who ? `who-${who.toLowerCase()}` : 'narration'].join(' ');
  return `<div class="${cls}" role="status"><span class="pins top" aria-hidden="true"></span><span class="pins bot" aria-hidden="true"></span>
    ${who ? `<b class="who">${who}</b>` : ''}<p class="line">${s.say.text}</p>${s.choices ? '' : nextBtn()}</div>`;
}
function choices(s) {
  if (!s.choices) return '';
  return `<div class="db-choices" role="group" aria-label="choose">${s.timer ? `<span class="db-timer">${s.timer}</span>` : ''}
    ${s.choices.map(([t, side], i) => `<button type="button" class="db-choice ${side}" aria-label="${i + 1}: ${t}"><span class="line">${t}</span></button>`).join('')}</div>`;
}
function nanda(s) {
  if (!s.nanda || s.hidden) return '';
  const raised = s.choices ? ' raised' : '';
  return `<svg class="db-nanda${raised}" viewBox="-130 -330 320 345" role="img" aria-label="Nanda">${nandaSVG(s.nanda)}</svg>`;
}

// ---------------------------------------------------------------- cards
function goalCard() {
  const plusChip = `<b class="lv-delta"><svg viewBox="0 0 100 92" aria-hidden="true"><path d="${HEART}"/></svg>+3</b>`;
  const minusChip = `<b class="lv-delta minus">${cracked}−2</b>`;
  const at = V === 'A' ? 'left:250px;top:210px;width:1000px' : 'left:170px;top:250px;width:1000px';
  return `<section class="hud-card to-${V.toLowerCase()}" style="${at}" aria-label="Goal"><i class="notch" aria-hidden="true"></i><b class="tag">GOAL</b>
    <h2>Fill her heart to 100%.</h2>
    <p>Every choice moves her heart.<br><b>Choose carefully.</b>${heartLine()}</p>
    <div class="legend">${plusChip}<span>she loved that</span><i class="gap"></i>${minusChip}<span>she'll remember</span></div>
    ${nextBtn('GOT IT')}</section>`;
}
function endCard(kind, s) {
  const win = kind === 'win';
  const at = V === 'A' ? 'left:210px;top:170px;width:1080px' : 'left:120px;top:150px;width:1060px';
  const heart = win ? heartSvg()
    : `<svg class="low-heart" viewBox="0 0 100 92" aria-hidden="true"><defs><clipPath id="lvLowClip"><rect x="0" y="${92 - (92 * s.score) / GOAL}" width="100" height="92"/></clipPath></defs>
        <path class="shell" d="${HEART}"/><path class="part" d="${HEART}" clip-path="url(#lvLowClip)"/><path class="crack" d="M50 17L44 26L52 31"/></svg>`;
  return `<div class="hud-scrim" aria-hidden="true"></div>
    <section class="hud-end ${kind}" style="${at}" aria-label="${win ? 'You win' : 'Ending'}">
    <p class="kicker">${win ? 'ENDING · STEEPED' : 'ENDING · LEAVE'}</p>
    <div class="bigheart">${heart}<b class="lv-num">${pct(s.score)}</b></div>
    <h2>${win ? "She's yours. Forever." : "She'll try again tomorrow."}</h2>
    <p class="sub">${win ? 'Her heart is full. So is the teapot.' : `Not enough. ${pct(s.score)} of her heart.`}</p>
    ${nextBtn(win ? 'PLAY AGAIN' : 'TRY AGAIN')}</section>`;
}

// ---------------------------------------------------------------- mount
const hud = st.hidden ? '' : V === 'A' ? hudA(st) : hudB(st);
const card = st.card === 'goal' ? goalCard() : st.card ? endCard(st.card, st) : '';
const root = document.getElementById('root');
root.innerHTML = `${defs}<div class="viewport${q.has('play') ? ' play' : ' rm'}">
  <div class="stage${st.card === 'goal' ? ' is-goal' : ''}" data-scare="${st.scare ?? 0}" data-hud="${V}" data-state="${S}">
    <img class="plate" src="plates/${st.plate}.jpg" alt="">
    ${st.card === 'win' || st.card === 'low' ? card : ''}
    ${nanda(st)}${say(st)}${choices(st)}${hud}${st.card === 'goal' ? card : ''}
  </div>
  <div class="chrome"><a href="../../../index.html" title="Back to Logic mode">◂ LOGIC</a><button type="button" title="Fullscreen (F)">⛶ fullscreen</button><button type="button" title="Skip scene (Esc or S)">skip ▸▸</button></div>
</div>`;

// fit the 1920x1080 stage to any window, like the engine
const stage = root.querySelector('.stage');
const fit = () => { stage.style.transform = `translate(-50%, -50%) scale(${Math.min(innerWidth / 1920, innerHeight / 1080)})`; };
fit();
addEventListener('resize', fit);
window.HUD_READY = document.fonts.ready.then(() => true);
