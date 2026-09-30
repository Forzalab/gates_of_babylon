// SHOP (research/sprint-0930/shop/SHOTLIST.md): shared parts for the traced shop shots.
// Every shot = a vtracer trace of one of Tony's refs (public/date-beta/trace/shop/<id>.svg, pipeline in
// research/sprint-0930/shop/pipeline) + a hand overlay (clean signs in our own words, one gate-pun gag each, and
// whatever the pre-pass removed: people, watermarks, caption text). One light for the whole scene: 2:00 PM, the
// `afternoon` wash from the G1 set (r3-station/parts.jsx), so neighbouring shots grade the same way. No animation.
import { R3Scene, preloadTrace, pts } from '../r3-station/parts.jsx';
import './shop.css';

export { pts };

export function ShopScene({ id, trace = id, label, cam, over, children }) {
  preloadTrace(`shop/${trace}`);
  return (
    <R3Scene id={`shop-${id}`} trace={`shop/${trace}`} tone="afternoon" label={label} cam={cam} over={over}>
      {children}
    </R3Scene>
  );
}

// A flat sign card: a board with 1..n centred lines. lines = [[text, size, fill?, cls?], ...]
export function Card({ x, y, w, h, fill = '#fffdf6', stroke = '#2b2a33', sw = 5, r = 8, rot = 0, lines = [], cls = 'shop-sign', ink = '#2b2a33' }) {
  let yy = y;
  const total = lines.reduce((a, l) => a + l[1] * 1.08, 0);
  yy = y + (h - total) / 2;
  return (
    <g transform={rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={sw} />
      {lines.map(([t, s, f = ink, c = cls], i) => {
        yy += s * 1.08;
        return <text key={i} x={x + w / 2} y={yy - s * 0.18} textAnchor="middle" fontSize={s} fill={f} className={c}>{t}</text>;
      })}
    </g>
  );
}

// A price card in the ref's supermarket style: white card, small black label, big red price.
export function Price({ x, y, w = 330, h = 150, label, price, rot = 0, note }) {
  return (
    <g transform={rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : undefined}>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="#fffef8" stroke="#3b3a40" strokeWidth="4" />
      <rect x={x} y={y} width={w} height={h * 0.3} rx="6" fill="#e8363c" />
      <text x={x + w / 2} y={y + h * 0.24} textAnchor="middle" fontSize={h * 0.2} fill="#fff" className="shop-jp">{label}</text>
      <text x={x + w - 16} y={y + h * 0.86} textAnchor="end" fontSize={h * 0.5} fill="#d81e2a" className="shop-price">{price}</text>
      {note && <text x={x + 14} y={y + h * 0.84} fontSize={h * 0.16} fill="#3b3a40" className="shop-sign">{note}</text>}
    </g>
  );
}

// A small tea cup (the three-cups gag): white body, pink band, a tiny heart. s = scale, at x,y = the rim centre.
export function Cup({ x, y, s = 1, band = '#ff8fb8' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-50 0 L-40 70 Q0 86 40 70 L50 0 Z" fill="#fbf8f2" stroke="#4a3b40" strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="0" cy="0" rx="50" ry="13" fill="#e9e2da" stroke="#4a3b40" strokeWidth="4" />
      <path d="M-46 26 L46 26 L44 40 L-44 40 Z" fill={band} />
      <path d="M0 58 C-8 50 -14 56 -8 62 L0 68 L8 62 C14 56 8 50 0 58Z" fill="#e0467f" />
    </g>
  );
}

// A hand from the bottom edge (the player's own, on a handle): a sleeve + a mitten-simple cel hand.
// flip = the left hand. sleeve = the player's navy jacket.
export function PlayerHand({ x, y, flip = false, s = 1, sleeve = '#2d3a5a' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-90 140 L-70 40 L70 30 L110 140 Z" fill={sleeve} stroke="#1b2238" strokeWidth="4" />
      <path d="M-70 40 C-80 -10 -60 -40 -20 -44 L60 -40 C90 -36 96 -10 84 12 L70 30 Z" fill="#f6cdb4" stroke="#7a4a3a" strokeWidth="4" strokeLinejoin="round" />
      <path d="M-10 -40 L-8 0 M24 -40 L24 0 M56 -38 L52 2" stroke="#b8806a" strokeWidth="3" />
    </g>
  );
}

// Her hand (Nanda): slimmer, a pink cuff, long pink nails. press = the nail tips dig in (white stress marks).
export function HerHand({ x, y, rot = 0, s = 1, press = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-40 -150 L40 -150 L46 -60 L-46 -60 Z" fill="#ffb3cf" stroke="#7a3050" strokeWidth="4" />
      <path d="M-42 -62 L44 -62 C60 -20 62 20 50 34 L-50 34 C-60 10 -56 -30 -42 -62Z" fill="#fcd8c4" stroke="#7a4a3a" strokeWidth="4" strokeLinejoin="round" />
      {[-36, -12, 12, 36].map((fx) => (
        <g key={fx}>
          <path d={`M${fx - 10} 30 L${fx - 9} 70 Q${fx} 80 ${fx + 9} 70 L${fx + 10} 30 Z`} fill="#fcd8c4" stroke="#7a4a3a" strokeWidth="3.5" />
          <path d={`M${fx - 7} 60 L${fx - 6} 80 Q${fx} 90 ${fx + 6} 80 L${fx + 7} 60 Z`} fill="#e0467f" stroke="#7a1f40" strokeWidth="2.5" />
          {press && <path d={`M${fx - 12} 94 l-6 8 M${fx} 96 l0 10 M${fx + 12} 94 l6 8`} stroke="#fff" strokeWidth="4" strokeLinecap="round" />}
        </g>
      ))}
    </g>
  );
}
