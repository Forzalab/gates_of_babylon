// CURRY HOUSE · 3:00 PM (art id `curry-house`; UX fix pack, REPORT-A top 4 / REPORT-B #3). Hand-built SVG, static.
// Not the café: warm ochre plaster, dark wood, an indigo noren (カ・レ・ー) hanging in the sliding door on the left with
// the bright afternoon street behind the glass, a wall clock at exactly 3:00, the open kitchen pass in the centre (a big
// curry pot, rice cooker, spice shelf on white tile), a red chochin, and a hanging wooden-plank curry menu on the right.
// Composition keeps the story props clear of the chrome: noren / clock / menu sit in the top 60% (the dialogue box is
// y >= 773), and the centre (her sprite) is only background kitchen. Foreground = the counter the two of them sit at.
const WOOD = '#3b2414';
const INK = '#2e1a0c';

// One menu plank: item name, chili count (heat), price.
const MENU = [['Butter chicken', 1, '¥980'], ['Katsu curry', 2, '¥880'], ['Beef curry', 2, '¥780'], ['Vegetable curry', 1, '¥680'], ['Naan or rice', 0, '+¥150']];
const CHILI = 'M0 0C6 -2 12 1 15 7C18 13 16 20 11 24C9 18 5 12 0 9Z';

function Plank({ y, name, heat, price }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <rect x="1350" y="0" width="470" height="64" rx="6" fill="url(#ch-plank)" stroke="#6b4322" strokeWidth="2" />
      <path d="M1360 18C1500 14 1640 22 1810 16M1360 44C1520 48 1660 40 1810 46" stroke="#b98a52" strokeWidth="1.5" fill="none" opacity=".6" />
      <circle cx="1362" cy="32" r="3" fill="#6b4322" /><circle cx="1808" cy="32" r="3" fill="#6b4322" />
      <text x="1378" y="44" fontFamily="var(--cond)" fontWeight="800" fontSize="32" fill={INK}>{name}</text>
      {Array.from({ length: heat }, (_, i) => <path key={i} d={CHILI} transform={`translate(${1650 + i * 20} 20)`} fill="#c8231a" />)}
      <text x="1800" y="44" textAnchor="end" fontFamily="var(--cond)" fontWeight="800" fontSize="30" fill="#a3180f">{price}</text>
    </g>
  );
}

export default function CurryHouse() {
  const hour = 3, minute = 0; // the stamp says 3:00 PM
  const hA = (hour % 12) * 30 + minute * 0.5, mA = minute * 6;
  return (
    <svg className="art curry-house" viewBox="0 0 1920 1080" role="img"
      aria-label="A small curry house at 3:00 PM: an indigo noren curtain in the doorway, a wall clock at 3:00, a curry pot in the open kitchen, a wooden curry menu on the wall.">
      <defs>
        <linearGradient id="ch-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4d9a2" /><stop offset="1" stopColor="#e2b772" /></linearGradient>
        <radialGradient id="ch-warm" cx=".5" cy=".3" r=".65"><stop offset="0" stopColor="#fff2c4" stopOpacity=".7" /><stop offset="1" stopColor="#fff2c4" stopOpacity="0" /></radialGradient>
        <linearGradient id="ch-out" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fffaf0" /><stop offset=".6" stopColor="#fbe7bf" /><stop offset="1" stopColor="#efcf95" /></linearGradient>
        <linearGradient id="ch-noren" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a4274" /><stop offset=".75" stopColor="#1f3462" /><stop offset="1" stopColor="#172850" /></linearGradient>
        <linearGradient id="ch-plank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f0d49c" /><stop offset="1" stopColor="#dfb676" /></linearGradient>
        <linearGradient id="ch-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8683a" /><stop offset="1" stopColor="#7a4726" /></linearGradient>
        <linearGradient id="ch-pot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7d858d" /><stop offset=".35" stopColor="#dde2e6" /><stop offset=".6" stopColor="#aab1b8" /><stop offset="1" stopColor="#6d747b" /></linearGradient>
        <radialGradient id="ch-curry" cx=".45" cy=".4" r=".7"><stop offset="0" stopColor="#d99a34" /><stop offset="1" stopColor="#9c5a16" /></radialGradient>
        <radialGradient id="ch-lamp" cx=".5" cy="0" r="1"><stop offset="0" stopColor="#ffd98a" stopOpacity=".55" /><stop offset=".5" stopColor="#ffd98a" stopOpacity=".12" /><stop offset="1" stopColor="#ffd98a" stopOpacity="0" /></radialGradient>
        <radialGradient id="ch-chochin" cx=".38" cy=".38" r=".7"><stop offset="0" stopColor="#ff6a4a" /><stop offset="1" stopColor="#b3201a" /></radialGradient>
        <radialGradient id="ch-vig" cx=".5" cy=".45" r=".75"><stop offset=".62" stopColor="#3a1a08" stopOpacity="0" /><stop offset="1" stopColor="#3a1a08" stopOpacity=".42" /></radialGradient>
        <pattern id="ch-tile" width="34" height="34" patternUnits="userSpaceOnUse"><rect width="34" height="34" fill="#f5efe2" /><path d="M0 .5H34M.5 0V34" stroke="#d6cbb4" strokeWidth="1.5" /></pattern>
        <filter id="ch-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>

      {/* back wall + warm light */}
      <rect width="1920" height="1080" fill="url(#ch-wall)" />
      <rect width="1920" height="1080" fill="url(#ch-warm)" />
      {/* ceiling + beam */}
      <rect width="1920" height="96" fill="#3a2314" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={i * 250 - 10} y="0" width="26" height="96" fill="#2c190d" />)}
      <rect y="90" width="1920" height="16" fill="#26150b" />
      {/* wainscot */}
      <rect y="610" width="1920" height="200" fill="#7b4a28" />
      <rect y="604" width="1920" height="14" fill="#9a6235" />
      {Array.from({ length: 33 }, (_, i) => <path key={i} d={`M${i * 60 + 20} 618V810`} stroke="#5e3519" strokeWidth="3" />)}

      {/* ---- the sliding door (left): bright afternoon street through the glass, the noren in front */}
      <g>
        <rect x="60" y="130" width="480" height="680" fill={WOOD} />
        <rect x="80" y="150" width="440" height="500" fill="url(#ch-out)" />
        {/* the street outside: the shop across, a vending machine, a pole, the pavement in sun */}
        <rect x="80" y="330" width="440" height="230" fill="#ecd3a6" />
        {[120, 220, 320, 420].map((x) => <rect key={x} x={x} y="370" width="56" height="70" fill="#f8ebcf" stroke="#d8b987" strokeWidth="3" />)}
        <rect x="80" y="560" width="440" height="90" fill="#e3c796" />
        <rect x="392" y="440" width="82" height="170" rx="6" fill="#c8323a" /><rect x="402" y="452" width="62" height="70" fill="#fbe3e3" />
        {[0, 1, 2].map((i) => <rect key={i} x={404 + i * 20} y="534" width="14" height="22" rx="3" fill="#fff6d8" />)}
        <rect x="142" y="150" width="14" height="500" fill="#b8a488" />
        <path d="M80 214C230 240 380 230 520 206" stroke="#8d7a64" strokeWidth="3" fill="none" />
        {/* glass lattice: centre stile, two rails, a wood kick panel */}
        <rect x="292" y="150" width="16" height="500" fill={WOOD} />
        <rect x="80" y="468" width="440" height="8" fill={WOOD} />
        <rect x="80" y="640" width="440" height="170" fill="#6b3f22" />
        <path d="M80 690H520M80 750H520" stroke="#54301a" strokeWidth="4" />
        <path d="M110 600L250 330M150 620L270 390M340 610L470 360" stroke="#fff" strokeWidth="10" opacity=".22" strokeLinecap="round" />
        {/* noren: rod, three panels (カ・レ・ー), sleeve at the top, fold shading, hem stripe */}
        <rect x="52" y="146" width="496" height="12" rx="6" fill="#1a0f08" />
        {[0, 1, 2].map((i) => {
          const x = 70 + i * 156;
          return (
            <g key={i}>
              <rect x={x} y="156" width="148" height="290" fill="url(#ch-noren)" />
              <rect x={x} y="156" width="148" height="30" fill="#172850" />
              <path d={`M${x + 50} 190V444M${x + 102} 190V444`} stroke="#15254a" strokeWidth="3" opacity=".6" />
              <path d={`M${x} 426H${x + 148}`} stroke="#f3ead6" strokeWidth="4" />
              <text x={x + 74} y="352" textAnchor="middle" fontFamily="var(--cond)" fontWeight="800" fontSize="112" fill="#f7efdc">{'カレー'[i]}</text>
            </g>
          );
        })}
        {/* the door's sunlight bleeds into the room */}
        <rect x="80" y="150" width="440" height="500" fill="#fff8e4" opacity=".18" />
      </g>

      {/* ---- wall clock at 3:00 */}
      <g transform="translate(668 236)">
        <circle cx="6" cy="9" r="72" fill="#000" opacity=".16" />
        <circle r="72" fill="#5a3418" />
        <circle r="60" fill="#fbf5e6" stroke="#2e1a0c" strokeWidth="3" />
        {Array.from({ length: 12 }, (_, i) => <line key={i} y1="-52" y2={i % 3 ? '-46' : '-40'} stroke={INK} strokeWidth={i % 3 ? 3 : 6} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
        {[['12', 0, -24], ['3', 28, 7], ['6', 0, 38], ['9', -28, 7]].map(([t, x, y]) => <text key={t} x={x} y={y} textAnchor="middle" fontFamily="var(--cond)" fontWeight="800" fontSize="18" fill={INK}>{t}</text>)}
        <line y1="6" y2="-30" stroke={INK} strokeWidth="9" strokeLinecap="round" transform={`rotate(${hA})`} />
        <line y1="8" y2="-48" stroke={INK} strokeWidth="5" strokeLinecap="round" transform={`rotate(${mA})`} />
        <circle r="6" fill="#c8231a" />
      </g>

      {/* ---- the open kitchen pass (centre, behind her) */}
      <g>
        <rect x="770" y="246" width="500" height="372" fill={WOOD} />
        <rect x="788" y="264" width="464" height="336" fill="url(#ch-tile)" />
        <rect x="788" y="264" width="464" height="336" fill="#ffe7a8" opacity=".25" />
        {/* spice shelf */}
        <rect x="812" y="330" width="170" height="10" fill="#8a5530" />
        {['#e6b422', '#c8231a', '#7a4a1e', '#5f8a3a', '#2e2a26'].map((c, i) => (
          <g key={c} transform={`translate(${826 + i * 32} 300)`}>
            <rect width="22" height="30" rx="4" fill={c} /><rect x="-1" y="-6" width="24" height="8" rx="2" fill="#efe5d2" />
          </g>
        ))}
        {/* the big pot, curry in it, the ladle, the steam */}
        <rect x="780" y="520" width="480" height="80" fill="#aab1b8" /><rect x="780" y="520" width="480" height="10" fill="#dfe3e6" />
        <path d="M900 404H1070V512Q1070 524 1058 524H912Q900 524 900 512Z" fill="url(#ch-pot)" stroke="#5c636a" strokeWidth="3" />
        <ellipse cx="985" cy="404" rx="85" ry="16" fill="#8a9098" stroke="#5c636a" strokeWidth="3" />
        <ellipse cx="985" cy="406" rx="74" ry="11" fill="url(#ch-curry)" />
        <path d="M900 426h-18v30h18M1070 426h18v30h-18" fill="none" stroke="#5c636a" strokeWidth="7" strokeLinejoin="round" />
        <path d="M1012 402L1074 318" stroke="#6d747b" strokeWidth="8" strokeLinecap="round" />
        <g stroke="#fff" strokeLinecap="round" fill="none" opacity=".55" filter="url(#ch-soft)">
          <path d="M950 388C930 360 968 338 948 306" strokeWidth="16" />
          <path d="M992 384C1010 352 976 330 998 290" strokeWidth="18" />
          <path d="M1030 390C1046 366 1024 346 1040 318" strokeWidth="12" />
        </g>
        {/* rice cooker */}
        <path d="M1122 520V470Q1122 452 1140 452H1206Q1224 452 1224 470V520Z" fill="#f6f3ee" stroke="#b9b2a6" strokeWidth="3" />
        <path d="M1128 458Q1173 434 1218 458" fill="#e9e4dc" stroke="#b9b2a6" strokeWidth="3" />
        <rect x="1160" y="486" width="26" height="12" rx="4" fill="#d8342c" />
        {/* the pass sill + two waiting bowls */}
        <rect x="760" y="600" width="520" height="22" fill="#9a6235" />
        <path d="M824 600Q846 628 870 600ZM1170 600Q1192 628 1214 600Z" fill="#f7f1e6" stroke="#b9ac96" strokeWidth="2" />
      </g>

      {/* ---- pendant lamps over the counter + their glow */}
      {[872, 1168].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="360" rx="260" ry="300" fill="url(#ch-lamp)" />
          <path d={`M${x} 106V150`} stroke="#1a0f08" strokeWidth="3" />
          <path d={`M${x - 14} 150H${x + 14}L${x + 44} 194H${x - 44}Z`} fill="#b5352a" stroke="#6e1712" strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx={x} cy="196" rx="20" ry="7" fill="#fff4c8" />
        </g>
      ))}

      {/* ---- red chochin between the pass and the menu */}
      <g transform="translate(1302 262)">
        <path d="M0 -60V-40" stroke="#1a0f08" strokeWidth="3" />
        <rect x="-20" y="-42" width="40" height="10" rx="3" fill="#1a0f08" />
        <ellipse rx="34" ry="46" fill="url(#ch-chochin)" />
        {[-30, -15, 0, 15, 30].map((y) => <path key={y} d={`M${-Math.sqrt(1 - (y / 46) ** 2) * 34} ${y}H${Math.sqrt(1 - (y / 46) ** 2) * 34}`} stroke="#7e130e" strokeWidth="2" opacity=".6" />)}
        <rect x="-20" y="34" width="40" height="10" rx="3" fill="#1a0f08" />
        <text y="12" textAnchor="middle" fontFamily="var(--cond)" fontWeight="800" fontSize="30" fill="#fff4dc">カ</text>
      </g>

      {/* ---- the curry menu: hanging wooden planks */}
      <g>
        <path d="M1400 106V140M1770 106V140" stroke="#1a0f08" strokeWidth="3" />
        <rect x="1340" y="132" width="490" height="96" rx="8" fill="#4a2a14" stroke="#2a170a" strokeWidth="3" />
        <text x="1585" y="184" textAnchor="middle" fontFamily="var(--cond)" fontWeight="800" fontSize="44" letterSpacing="3" fill="#fbe7b8">CURRY MENU</text>
        <text x="1585" y="216" textAnchor="middle" fontFamily="var(--cond)" fontWeight="800" fontSize="22" letterSpacing="6" fill="#e9b85a">カレー お品書き</text>
        {MENU.map(([name, heat, price], i) => <Plank key={name} y={244 + i * 74} name={name} heat={heat} price={price} />)}
      </g>

      {/* ---- foreground: the counter they sit at (edges show past the dialogue box) */}
      <rect y="776" width="1920" height="40" fill="url(#ch-top)" />
      <rect y="776" width="1920" height="4" fill="#c88a55" />
      <rect y="816" width="1920" height="264" fill="#4a2a16" />
      {Array.from({ length: 17 }, (_, i) => <path key={i} d={`M${i * 120 + 40} 816V1080`} stroke="#3a2010" strokeWidth="4" />)}
      {/* left: a glass of water; right: the spoon pot + red fukujinzuke */}
      <g transform="translate(150 776)">
        <path d="M-30 -96H30L24 0H-24Z" fill="#dff1f6" opacity=".7" stroke="#9fb9c2" strokeWidth="3" />
        <path d="M-27 -60H27L24 0H-24Z" fill="#bfe3ee" opacity=".6" />
        <path d="M-18 -86L-14 -8" stroke="#fff" strokeWidth="5" opacity=".8" strokeLinecap="round" />
      </g>
      <g transform="translate(1760 776)">
        <path d="M-44 -70H4V-6Q4 0 -2 0H-38Q-44 0 -44 -6Z" fill="#e8e0d0" stroke="#9c8f78" strokeWidth="3" />
        {[-34, -22, -10].map((x, i) => <path key={x} d={`M${x} -70L${x - 6 + i * 6} -128`} stroke="#b9bfc4" strokeWidth="6" strokeLinecap="round" />)}
        <path d="M22 -40H96V-6Q96 0 90 0H28Q22 0 22 -6Z" fill="#f7f1e6" stroke="#b9ac96" strokeWidth="3" />
        <ellipse cx="59" cy="-40" rx="37" ry="8" fill="#c8231a" />
      </g>
      <rect width="1920" height="1080" fill="url(#ch-vig)" />
    </svg>
  );
}
