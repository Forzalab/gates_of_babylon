// r5-ume cel registry: id -> { Art, front }. Each Art draws in LOCAL coords around its anchor (0, 0); a beat places it
// with { id, x, y, k } (cels.jsx). front = drawn over her sprite (the BOOK plane), else over the bg, under her.
// Human hands (yours, and hers in the object close-ups) reuse the shop 5-finger Hand kit (art/shop/parts.jsx): wrist at
// (0, 0), fingers to -y; 'grip' wraps a bar at y -118. Your sleeve = the navy blazer (SP.player), hers = the pink cuff.
import { Hand, SP } from '../shop/parts.jsx';

// your hand from the right frame edge, holding HER pin nub: the anchor (0, 0) = the nub inside your grip
function McHandHold({ s = 0.55, rot = -90 }) {
  const r = (rot * Math.PI) / 180, gx = -Math.sin(r) * -118 * s, gy = Math.cos(r) * -118 * s;
  return <Hand x={-gx} y={-gy} rot={rot} s={s} pose="grip" thumb="right" sleeve={SP.player} />;
}

export const CEL = {
  'mc-hand-hold': { Art: McHandHold, front: true },
};
