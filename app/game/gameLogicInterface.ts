import type { Game } from "./types/Game";
import type { UnoMatch } from "./types/UnoMatch";

// Interface for interacting with a game.
export interface GameLogicInterface {
  // Resets the game.
  resetGame(): Game;

  // Gets the current game.
  getGame(): Game;

  // Initializes a new Uno match.
  initializeUno(): void;

  // Gets the current Uno math.
  getCurrentUnoMatch(): UnoMatch;

  // Plays a card within an Uno match.
  playCard(): Game;
}
