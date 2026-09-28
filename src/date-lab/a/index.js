// Builder A: export every variant as { id, track, title, theme, horror (0-5), builder: 'A', Component }.
// Component gets { rm } and draws on a 1920x1080 stage. Shared kit: ./kit (timeline + menu state machine are pure, node-tested).
import Tarot from './menu/Tarot.jsx';

const A = (id, track, title, theme, horror, Component) => ({ id, track, title, theme, horror, builder: 'A', Component });

export const VARIANTS = [
  A('menu-1', 'menu', 'Tarot: her card face-up, yours face-down', 'CLAMP arcana x Suspiria candlelight: fate is dealt by her', 2, Tarot),
];
