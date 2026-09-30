// TOWN (research/sprint-0930/town/NOTES.md): art id -> component, spread into ART in art/index.js. Walk order:
// the street (establishing) -> the crossing (her hands on your arm) -> the billboard.
import { TownStreet, TownCrossing, TownBoard } from './Town.jsx';

export const TOWN = {
  'town-street': TownStreet,
  'town-crossing': TownCrossing,
  'town-board': TownBoard,
};
export default TOWN;
