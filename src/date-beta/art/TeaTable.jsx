// BG-D2 fallback: her sitting room, the low tea table. props.cups (default 3): the last cup is never poured.
// props.plate / props.feed (umeboshi | tamagoyaki): what sits on the extra saucer. Kitchen and kettle behind.
const Cup = ({ x, full }) => (
  <g transform={`translate(${x} 700)`}>
    <ellipse cx="0" cy="40" rx="78" ry="18" fill="#e8e2da" />
    <path d="M-52 -40 H52 L42 34 Q0 46 -42 34 Z" fill="#f4eef6" stroke="#b8aca4" strokeWidth="3" />
    <ellipse cx="0" cy="-40" rx="52" ry="12" fill={full ? '#9c8a3a' : '#e6ded6'} stroke="#b8aca4" strokeWidth="3" />
    {full && <path d="M-10 -60 Q-20 -90 -4 -110 M14 -64 Q4 -94 20 -118" fill="none" stroke="#fff" strokeWidth="4" opacity=".55" strokeLinecap="round" />}
  </g>
);

const Treat = ({ kind }) => (kind === 'tamagoyaki'
  ? <g><rect x="-44" y="-28" width="88" height="34" rx="8" fill="#f2c94c" /><path d="M-30 -28 V6 M-10 -28 V6 M10 -28 V6 M30 -28 V6" stroke="#d9a92a" strokeWidth="3" /></g>
  : <g><circle cx="0" cy="-12" r="22" fill="#b0102c" /><circle cx="-7" cy="-19" r="6" fill="#e8546a" /></g>);

export default function TeaTable({ props = {} }) {
  const n = Math.max(3, Math.min(5, props.cups ?? 3));
  const treat = props.feed || props.plate;
  const step = 1300 / (n - 1 || 1);
  return (
    <svg className="art teatable" viewBox="0 0 1920 1080" role="img" aria-label={`A low tea table with ${n} cups. The last one is empty.`}>
      <rect width="1920" height="1080" fill="#e9dcc8" />
      {/* shoji wall + kitchen pass */}
      <rect width="1920" height="520" fill="#f3ead8" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 170} y1="0" x2={i * 170} y2="520" stroke="#cdbf9e" strokeWidth="6" />)}
      {[130, 260, 390].map((y) => <line key={y} x1="0" y1={y} x2="1920" y2={y} stroke="#cdbf9e" strokeWidth="4" />)}
      <rect x="1260" y="120" width="560" height="330" fill="#6a5a4a" /><rect x="1280" y="140" width="520" height="290" fill="#3a3230" />
      {/* kettle on the stove */}
      <rect x="1360" y="380" width="360" height="50" fill="#2a2426" />
      <path d="M1470 380 Q1470 300 1540 290 Q1610 300 1610 380 Z" fill="#b8b0a8" /><path d="M1610 340 L1680 310" stroke="#b8b0a8" strokeWidth="14" strokeLinecap="round" />
      <path d="M1490 300 Q1540 240 1590 300" fill="none" stroke="#2a2426" strokeWidth="8" />
      {/* tatami */}
      <rect y="520" width="1920" height="560" fill="#cbbf7a" />
      {[760, 1000].map((y) => <line key={y} x1="0" y1={y} x2="1920" y2={y} stroke="#6a5a3a" strokeWidth="10" />)}
      {/* table */}
      <path d="M160 640 H1760 L1840 800 H80 Z" fill="#5a3226" />
      <rect x="80" y="800" width="1760" height="40" fill="#3e2018" />
      <rect x="160" y="840" width="40" height="160" fill="#3e2018" /><rect x="1720" y="840" width="40" height="160" fill="#3e2018" />
      {Array.from({ length: n }, (_, i) => <Cup key={i} x={310 + i * step} full={i < 2} />)}
      {treat && (
        <g transform={`translate(${310 + (n - 1) * step - 140} 760)`}>
          <ellipse cx="0" cy="0" rx="60" ry="14" fill="#e8e2da" /><Treat kind={treat} />
        </g>
      )}
    </svg>
  );
}
