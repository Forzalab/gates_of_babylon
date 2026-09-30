// Game art ids (merged into ART by main.jsx). Each takes { props, rm, onPick }; onPick(i) plays the beat's choice i.
import LockGame from './LockGame.jsx';
import ShopGame from './ShopGame.jsx';

export const GAME = { 'lock-game': LockGame, 'shop-game': ShopGame };
export default GAME;
