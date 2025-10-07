import type { Game } from "./types/Game";
import type Player from "./types/Player";
import type { UnoMatch } from "./types/UnoMatch";
import { createDeck, shuffleDeck, drawCard } from "./deck";
import type { CardColor } from "./types/Card";
import type { GameLogicInterface } from "./gameLogicInterface";

// Singleton implementation of GameLogicInterface.
export class GameLogic implements GameLogicInterface {
  private currentGame: Game;

  private static instance: GameLogicInterface = new GameLogic();

  public static get(): GameLogicInterface {
    return this.instance;
  }

  private constructor() {
    this.currentGame = this.initializeGame();
  }

  // gets God Object 'gameState'
  public getGame(): Game {
    return this.currentGame;
  }

  // Initialize High-Level Game State (God State)
  private initializeGame(): Game {
    const players: Player[] = [
      {
        id: "player-1",
        name: "You",
        isHuman: true,
        hand: [],
        calledUno: false,
        extraCards: [],
      },
      {
        id: "ai-1",
        name: "AI 1",
        isHuman: false,
        hand: [],
        calledUno: false,
        extraCards: [],
      },
      {
        id: "ai-2",
        name: "AI 2",
        isHuman: false,
        hand: [],
        calledUno: false,
        extraCards: [],
      },
      {
        id: "ai-3",
        name: "AI 3",
        isHuman: false,
        hand: [],
        calledUno: false,
        extraCards: [],
      },
    ];

    const game: Game = {
      players: players,
      matches: [],
      currentScreen: null,
      modifiers: [],
      winner: null,
      status: "Not Started",
    };

    //   // Start the first match
    //   initializeUno(game);

    //   console.log("Initialized Game:", JSON.stringify(game, null, 2));
    this.currentGame = game;
    return game;
  }

  // Runs Initialize Game () Name Wrapper for Readability
  public resetGame(): Game {
    this.currentGame = this.initializeGame();
    return this.currentGame;
  }

  // Initialize Uno Round (A)
  public initializeUno(): Game {
    let deck = shuffleDeck(createDeck());

    // Reset and deal cards
    this.currentGame.players.forEach((player) => {
      player.hand = [];
      for (let i = 0; i < 7 && deck.length > 0; i++) {
        const card = drawCard(deck);
        if (card) player.hand.push(card);
      }
    });

    // Flip first card
    const firstCard = deck.pop()!;
    const discardPile = [firstCard];
    const startingColor: CardColor =
      firstCard.color === "black" ? "red" : firstCard.color;

    const newMatch: UnoMatch = {
      players: structuredClone(this.currentGame.players), // snapshot for the match
      currentPlayerIndex: 0,
      turnDirection: 1,
      deck,
      discardPile,
      currentColor: startingColor,
      status: "In Progress",
    };

    this.currentGame.matches.push(newMatch);
    this.currentGame.status = "Match 1";

    return this.currentGame;
  }

  public playCard(): Game {
    const match = this.getCurrentUnoMatch();

    // do play card logic
    // modify it
    //modiffy winner -> should redirect to home -- ui needs this from bool outside matches

    return structuredClone(this.currentGame);
  }

  public getCurrentUnoMatch(): UnoMatch {
    return this.currentGame!.matches.at(-1)!;
  }
}
