// A single game of Uno
import type Player from "./Player";
import type { Card, CardColor } from "./Card";
import type { Modifier } from "./Modifier";

export interface UnoMatch {
  players: Player[];
  currentPlayerIndex: number;
  turnDirection: 1 | -1;
  deck: Card[];
  discardPile: Card[];
  currentColor: CardColor | undefined;
  status: string;
  modifiersAddedThisRound: Modifier[];
}
