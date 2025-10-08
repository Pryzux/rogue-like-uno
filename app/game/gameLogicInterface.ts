import type { CardColor } from "./types/Card";
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
  playCard(cardId: string, color?: (CardColor | null)): Boolean;

  // draws a number of cards for a given player
  drawCards(cardNumber: number, playerIndex: number): void;

  // Get the Player Information
  getPlayer(): Player;

  // Get all the Players
  getPlayers(): Player[];

  // Get current player in the current match
  getCurrentPlayer(): Player;

  // Get Player from currentPlayerIndex
  getPlayerFromIndex(index: number): Player;

  // Play for the ai
  playAITurn(): undefined | Game;
}
