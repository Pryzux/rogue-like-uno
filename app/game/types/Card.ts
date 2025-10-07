// An Uno card as it exists in the deck or a player's hand
export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'black';
export type CardType = 'zero' | 'one' | 'two' | 'three' | 'four' | 'five' | 'six' | 'seven' | 'eight' | 'nine' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wildDraw4';

export interface Card {
  id: string;
  type: CardType;
  color: CardColor;
  isFaceDown: boolean;
  value?: number;
}
