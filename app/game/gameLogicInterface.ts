import type { Game } from "./types/Game";
import type Player from "./types/Player";
import type { UnoMatch } from "./types/UnoMatch";

// Interface for interacting with a game.
export interface GameLogicInterface {
  // Resets the game.
  resetGame(): Game;

  // Gets the current game.
  getGame(): Game;

  // Initializes a new Uno match.
  initializeUno(): Game;

  // Gets the current Uno math.
  getCurrentUnoMatch(): UnoMatch;

  // Plays a card within an Uno match.
  playCard(): Game;

  // Get the Player Information
  getPlayer(): Player;

  // Get all the Players
  getPlayers(): Player[];
}
