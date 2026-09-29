// Splash: a fake title "site" built from cards. START = the 4th-wall house of cards: every card drops in
// 4 stepped frames at 2 Hz (each frame holds 500 ms). Reduced motion: one hard cut to the collapsed pile.
// Each card carries its own end pose (--x, --y, --r) so the pile is authored, not random.
import './splash.css';

const HEART = 'M0 -3C-4 -10 -14 -6 -9 2L0 10L9 2C14 -6 4 -10 0 -3Z';
const NandMark = ({ s = 1 }) => (
  <svg className="nandmark" viewBox="0 0 64 40" width={64 * s} height={40 * s} aria-hidden="true">
    <path d="M6 4h22a16 16 0 0 1 0 32H6z" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
    <circle cx="51" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="5" />
  </svg>
);

const card = (x, y, r, delay = 0) => ({ '--x': `${x}px`, '--y': `${y}px`, '--r': `${r}deg`, '--d': `${delay}ms` });

export default function Splash({ props, onStart }) {
  return (
    <div className={`art splash${props.collapsed ? ' collapsed' : ''}`}>
      <div className="void" aria-hidden="true"><span>NO SIGNAL</span></div>

      <header className="card nav" style={card(-40, 890, 9)}>
        <span className="logo"><NandMark s={0.9} /> GoB</span>
        <nav><span>Logic</span><span className="on">Date β</span><span>Credits</span></nav>
        <span className="sponsor">presented by <b>Figur</b></span>
      </header>

      <main className="card hero" style={card(-120, 520, -7, 0)}>
        <p className="kicker">Chapter 1 · Signal</p>
        <h1>Gates of<br />Babylon</h1>
        <p className="sub">a date with a logic gate</p>
        <button type="button" className="start" onClick={(e) => { e.stopPropagation(); onStart(); }} disabled={props.collapsed}>
          <svg viewBox="-12 -12 24 24" width="44" height="44" aria-hidden="true"><path d={HEART} fill="currentColor" /></svg>
          START
        </button>
      </main>

      <aside className="card poll" style={card(-180, 640, 14)}>
        <p className="tag">Figur poll</p>
        <p className="q">Sweet or sour?</p>
        <div className="bars"><span className="sweet">tamagoyaki 51%</span><span className="sour">umeboshi 49%</span></div>
      </aside>

      <aside className="card idol" style={card(120, 470, -18)}>
        <p className="tag">PINKBLACK × Figur</p>
        <p className="q">new single<br /><b>“Universal”</b></p>
        <div className="sil" aria-hidden="true">{[0, 1, 2, 3].map((i) => <i key={i} />)}</div>
      </aside>

      <footer className="strip">
        <div className="card mini" style={card(40, 90, -24)}>cookies? we already ate them</div>
        <div className="card mini" style={card(10, 120, 6)}>build β.0 · render test</div>
        <div className="card mini" style={card(-30, 80, 19)}><NandMark s={0.5} /> 1 player online</div>
      </footer>
    </div>
  );
}
