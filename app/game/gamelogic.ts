import type { Game } from "./types/Game";
import type Player from "./types/Player";
import type { UnoMatch } from "./types/UnoMatch";
import { createDeck, shuffleDeck, drawCard, canPlayCard } from "./deck";
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

  // returns null if play is invalid
  public playCard(cardId: string): (Game | null) {
    // making a copy of the current game 
    const newGame = structuredClone(this.currentGame)
    this.currentGame = newGame
    const newMatch = structuredClone(this.getCurrentUnoMatch())
    const currentPlayer = this.getCurrentPlayer()

    const card = currentPlayer.hand.find(card => card.id === cardId)

    // check if play is valid - maybe this check should happen somewhere else?
    if (card && canPlayCard(card, newMatch.discardPile[0], newMatch.currentColor)) {
      const newHand = currentPlayer.hand.filter(card => card.id !== cardId)
      currentPlayer.hand = newHand
      newMatch.discardPile =[card, ...newMatch.discardPile]

      if (currentPlayer.hand.length === 0) {
        // the current player won!
      }

      // get the index of who the next current player will be

      // see if any game side effects need to happen as a result of the card that was played
      if (card.type === 'reverse') {
        newMatch.turnDirection = (newMatch.turnDirection === 1) ? -1 : 1

      } else if (card.type === 'skip') {

      }


      //return newGame
    } else {
      // play is invalid
      return null
    }
  }

  // increments current player index on the given match and wraps around if the end of the list is reached
  private incrementCurrentPlayerIndex() {
    const match = 
  }

  // Get Current Uno Match -- Last Element of the Matches List
  public getCurrentUnoMatch(): UnoMatch {
    return this.currentGame!.matches.at(-1)!;
  }

  // Get the Player (User)
  public getPlayer(): Player {
    console.log("Player Returned: " + this.currentGame.players[0]);
    return this.currentGame.players[0];
  }

  public getPlayers(): Player[] {
    console.log("All Players Returned: " + this.currentGame.players);
    return this.currentGame.players;
  }

  // takes in a Game and returns the current player 
  public getCurrentPlayer(): Player {
    return this.currentGame.players[this.getCurrentUnoMatch().currentPlayerIndex]
  }
} // end of class
