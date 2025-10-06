import { type Card } from './Card'

export default interface Player {
  id: string;
  name: string;
  hand: Card[];
  calledUno: boolean;
  isHuman: boolean;
}
