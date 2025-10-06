import type Player from './Player'
import type { Card, CardColor } from './Card'

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