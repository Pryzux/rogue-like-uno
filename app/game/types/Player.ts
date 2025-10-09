// An Uno player, either human or AI
import { type Card } from "./Card";

export default interface Player {
  id: string;
  name: string;
  hand: Card[];
  calledUno: boolean;
  isHuman: boolean;
  // cards added to the player's draw pile from modifiers
  extraCards: Card[];
  turns: number;
}
