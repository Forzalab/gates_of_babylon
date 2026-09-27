// DateCanvas: date.html?canvas=1. The Date-mode canvas the minigame wraps around: its gates go INTO the bag
// (sessionStorage gob.game.in) and the game's circuits come BACK as real wired nodes (gob.game.out), imported on load
// through addGate/addWire (checked by sim.canConnect) and evaluated live by sim.evaluate. Logic mode is not touched.
import { useEffect, useReducer, useState } from 'react';
import { canConnect } from '../../sim.js';
import { IDENTITIES } from './rules.js';
import { CircuitView } from './CircuitView.jsx';
import { GateTile } from './Bagging.jsx';
import { play, useMute } from '../sfx.js';
import './game.css';
import './canvas.css';

const params = new URLSearchParams(location.search);
const STILL = params.has('still') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const KEY = 'gob.canvas';

// ---------- reducer actions (pure) ----------
export function addGate(state, node, group) {
  if (state.nodes[node.id]) return state;
  return { ...state, nodes: { ...state.nodes, [node.id]: { ...node, group } } };
}
export function addWire(state, wire) {
  const ok = canConnect(state, wire.source, wire.target, wire.pin);
  if (!ok.ok) return state;
  return { ...state, wires: { ...state.wires, [wire.id]: wire } };
}
function reducer(state, a) {
  switch (a.type) {
    case 'addGate': return addGate(state, a.node, a.group);
    case 'addWire': return addWire(state, a.wire);
    case 'addGroup': return state.groups.some((g) => g.id === a.group.id) ? state : { ...state, groups: [a.group, ...state.groups] };
    case 'toggle': { const n = state.nodes[a.id]; return { ...state, nodes: { ...state.nodes, [a.id]: { ...n, value: !n.value } } }; }
    case 'reset': return a.state;
    default: return state;
  }
}
const EMPTY = { nodes: {}, wires: {}, groups: [] };

// A fresh canvas has something to bag: a little chain plus two loose gates ("your exes").
function starter() {
  let s = EMPTY;
  const add = (circuit, group) => {
    s = { ...s, groups: [...s.groups, group] };
    for (const n of Object.values(circuit.nodes)) s = addGate(s, { ...n, id: `${group.id}:${n.id}` }, group.id);
    for (const w of Object.values(circuit.wires)) s = addWire(s, { ...w, id: `${group.id}:${w.id}`, source: `${group.id}:${w.source}`, target: `${group.id}:${w.target}` });
  };
  add({ nodes: { a: { id: 'a', kind: 'S', value: true }, b: { id: 'b', kind: 'S', value: true }, g1: { id: 'g1', kind: 'G', type: 'NAND' }, g2: { id: 'g2', kind: 'G', type: 'NOT' }, L: { id: 'L', kind: 'L' } },
    wires: { w0: { id: 'w0', source: 'a', target: 'g1', pin: 0 }, w1: { id: 'w1', source: 'b', target: 'g1', pin: 1 }, w2: { id: 'w2', source: 'g1', target: 'g2', pin: 0 }, w3: { id: 'w3', source: 'g2', target: 'L', pin: 0 } } },
  { id: 'ex1', label: 'NAND → NOT', name: 'An ex who says yes twice' });
  add({ nodes: { g1: { id: 'g1', kind: 'G', type: 'XOR' }, g2: { id: 'g2', kind: 'G', type: 'OR' } }, wires: {} }, { id: 'ex2', label: 'XOR, OR', name: 'Loose ends', loose: true });
  return s;
}

// Import the game's hand-off: each circuit becomes a group of real nodes + wires, added through the reducer actions.
export function importOut(state, out, stamp = Date.now()) {
  let s = state;
  out.circuits.forEach((c, k) => {
    const gid = `run${stamp}-${k}`;
    s = reducer(s, { type: 'addGroup', group: { id: gid, label: c.label, name: c.name, ending: !!c.ending, hurt: !!c.hurt, bonded: !!c.bonded, proof: c.proof, identity: c.identity, match: out.match } });
    for (const n of Object.values(c.nodes)) s = reducer(s, { type: 'addGate', node: { ...n, id: `${gid}:${n.id}` }, group: gid });
    for (const w of Object.values(c.wires)) s = reducer(s, { type: 'addWire', wire: { ...w, id: `${gid}:${w.id}`, source: `${gid}:${w.source}`, target: `${gid}:${w.target}` } });
  });
  return s;
}

function load() {
  let s;
  try { s = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { s = null; }
  s = s?.nodes ? s : starter();
  let imported = null;
  try {
    const out = JSON.parse(sessionStorage.getItem('gob.game.out') || 'null');
    if (out?.circuits) { s = importOut(s, out); imported = out; }
    sessionStorage.removeItem('gob.game.out');
  } catch { /* storage blocked or bad JSON: keep the canvas as it is */ }
  return { s, imported };
}

const sub = (state, gid) => {
  const nodes = Object.fromEntries(Object.entries(state.nodes).filter(([, n]) => n.group === gid));
  const wires = Object.fromEntries(Object.entries(state.wires).filter(([, w]) => nodes[w.source] && nodes[w.target]));
  return { nodes, wires };
};

export default function DateCanvas() {
  const [boot] = useState(load);
  const [state, dispatch] = useReducer(reducer, boot.s);
  const [muted, toggleMute] = useMute();
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }, [state]);
  const imp = boot.imported;
  const hello = params.has('hello') && imp;
  const endingGroup = imp && state.groups.find((g) => g.ending && g.match);
  const talk = hello && imp.match ? { who: IDENTITIES[imp.ending].formula, text: `Hi. ${IDENTITIES[imp.ending].line} Tap my x. I’ll prove it.` }
    : imp ? (imp.match ? { who: 'GATEXX', text: `${imp.circuits.length} circuit${imp.circuits.length > 1 ? 's' : ''} arrived from the bagging area, wired and bonded. Toggle the switches: it’s the real simulator.` }
      : { who: 'GATEXX', text: 'Not a match. The last HURT pair came home in red: same inputs, two lamps, different answers.' })
      : { who: 'GATEXX', text: 'Your Date canvas. Bag these gates and they become the first drops of the minigame.' };
  const gates = Object.values(state.nodes).filter((n) => n.kind === 'G');
  const bag = () => {
    try { sessionStorage.setItem('gob.game.in', JSON.stringify(gates.map((n) => n.type))); } catch { /* ignore */ }
    play('click');
    location.href = `${location.pathname}?game=1`;
  };
  return (
    <div className={`game canvas-page${STILL ? ' still' : ''}`}>
      <header className="bar gbar">
        <a className="logo neonlogo" href="?canvas=1"><span className="neon small dj">Dejting</span><b>GATEXX</b></a>
        <div className="lcd">DATE CANVAS {'·'} {gates.length} GATES</div>
        <div className="stat"><small>COUPLES YOU MADE</small><b data-testid="bonded">{state.groups.filter((g) => g.bonded).length}</b></div>
        <button className="mute" onClick={toggleMute} aria-pressed={muted} aria-label={muted ? 'Unmute sound' : 'Mute sound'}><svg viewBox="0 0 24 24" aria-hidden="true" className="spk"><path d="M3 9h4l5-4v14l-5-4H3z" />{muted ? <path className="cut" d="M16 9l6 6M22 9l-6 6" /> : <path className="wave" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}</svg><span>{muted ? 'SOUND OFF' : 'SOUND ON'}</span></button>
      </header>
      <main className="cmain">
        <div className="cbar">
          <button className="btn hot" onClick={bag} data-testid="bag">{'▶'} BAG MY {gates.length} GATES</button>
          <button className="btn soft" onClick={() => { dispatch({ type: 'reset', state: starter() }); play('click'); }}>CLEAR CANVAS</button>
          <span className="order"><b className="tip">Tap a 0/1 switch to flip it; the round lamp lights up when the answer is 1.</b> First drops: {gates.slice(0, 8).map((n) => n.type).join(' → ')}{gates.length > 8 ? ' …' : ''}</span>
        </div>
        <div className="canvas" data-testid="canvas">
          {state.groups.map((gr) => {
            const c = sub(state, gr.id);
            const hot = hello && gr === endingGroup;
            return (
              <section key={gr.id} className={`grp${gr.hurt ? ' hurt' : ''}${gr.bonded ? ' bonded' : ''}${hot ? ' hello' : ''}`} data-testid={gr.id.startsWith('run') ? 'imported' : 'group'}>
                <header><b>{gr.label}</b><span>{gr.name}</span>{gr.bonded && <i title="a couple you made in the bagging area">COUPLE {'♥'}</i>}{gr.hurt && <i className="red">NOT A MATCH</i>}{gr.ending && <i className="end">ENDING</i>}</header>
                {gr.loose ? <div className="loose">{Object.values(c.nodes).map((n) => <div key={n.id} className="lt"><GateTile t={n.type} /></div>)}</div>
                  : <CircuitView circuit={c} hurt={gr.hurt} onToggle={(id) => { dispatch({ type: 'toggle', id }); play('click', { rate: 1.3 }); }} label={gr.label} />}
                {gr.proof && <p className="proof">{gr.proof}</p>}
              </section>
            );
          })}
        </div>
      </main>
      <footer className="vn">
        <div className="nameplate">{talk.who}</div>
        <div className="portrait-s">{endingGroup ? <GateTile t={Object.values(sub(state, endingGroup.id).nodes).find((n) => n.kind === 'G')?.type ?? 'NOT'} /> : <GateTile t="AND" />}</div>
        <p className="line">{talk.text}</p>
      </footer>
    </div>
  );
}
