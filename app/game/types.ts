export type CardColor = 'red' | 'blue' | 'green' | 'yellow'| 'black';
export type CardType = 'number' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wildDraw4';

export interface Card {
  id: string;
  color: CardColor;
  type: CardType;
  value?: number;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  calledUno: boolean;
  isHuman: boolean;
  
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  direction: 1 | -1;
  drawPile: Card[];
  discardPile: Card[];
  currentColor: CardColor | null;
  gameStarted: boolean;
  gameOver: boolean;
  winner: Player | null;
  lastAction: string;
  waitingForWildColor: boolean;
}

