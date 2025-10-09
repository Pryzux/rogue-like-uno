import type { CardColor } from "./Card";
import type Player from "./Player";

export interface PlayCardOptions {
  color?: CardColor | null;
  targetPlayer?: Player | null;
}
