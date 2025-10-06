// A single run of our rogue-like game, consisting of a series of Uno matches
import type { Modifier } from './Modifier'
import type Player from './Player'
import type { UnoMatch } from './UnoMatch'

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  turnDirection: 1 | -1;
  drawPile: Card[];
  discardPile: Card[];
  currentColor: CardColor | null;
  gameStarted: boolean;
  gameOver: boolean;
  winner: Player | null;
  lastAction: string;
  waitingForWildColor: boolean;
}