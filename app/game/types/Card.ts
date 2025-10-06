// An Uno card as it exists in the deck or a player's hand
export type CardColor = 'red' | 'blue' | 'green' | 'yellow'| 'black';
export type CardType = 'number' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wildDraw4';

export interface Card {
  id: string;
  color: CardColor;
  type: CardType;
  value?: number;
}
