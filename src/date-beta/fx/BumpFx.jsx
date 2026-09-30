// R5 v2-train 3 (props.bump 'laugh'): the two men bump into her. Two impact stars at her sides + ドンッ, drawn OVER the
// focus blur (the action stays crisp, the bg blurs). Still art, no motion. Stage units (1920x1080).
const STAR = '0,-46 12,-14 44,-20 20,4 38,34 6,20 -6,50 -12,18 -44,26 -22,0 -40,-28 -8,-16';
export function BumpFx() {
  return (
    <svg className="db-bumpfx" viewBox="0 0 1920 1080" aria-hidden="true">
      {[[742, 470, -1], [1160, 480, 1]].map(([x, y, d]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <polygon points={STAR} fill="#fff4b8" stroke="#6b0f45" strokeWidth="5" strokeLinejoin="round" />
          <path d={`M${d * 30},-60 l${d * 26},-14 M${d * 44},-30 l${d * 30},-4 M${d * 40},4 l${d * 28},10`} stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        </g>))}
      <text x="600" y="360" textAnchor="middle" fill="#fff" stroke="#6b0f45" strokeWidth="9" paintOrder="stroke" fontSize="68" fontWeight="900" transform="rotate(-8 600 360)">ドンッ</text>
    </svg>
  );
}
