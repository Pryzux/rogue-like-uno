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

    console.log("Initialized Game:", JSON.stringify(game, null, 2));
    this.currentGame = game;
    return game;
  }

  // Runs Initialize Game () Name Wrapper for Readability
  public resetGame(): Game {
    this.currentGame = this.initializeGame();
    return this.currentGame;
  }

  // Initialize Uno Round -- Pushes a new Match to Matches[UnoMatch]
  public initializeUno(): Game {
    // Create a deck
    let deck = shuffleDeck(createDeck());

    // deal cards to all players
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

    console.log("initializeUno(): New Matched added to Matches List");

    return this.currentGame;
  }

  // returns null if play is invalid
  public playCard(cardId: string): (Game | null) {
    // making a copy of the current game 
    const newGame = structuredClone(this.currentGame)
    // a reference to the new current match and new current player
    const newMatch = this.getCurrentUnoMatchFromGame(newGame)
    const currentPlayer = this.getCurrentPlayer(newGame)

    const card = currentPlayer.hand.find(card => card.id === cardId)

    // check if play is valid - maybe this check should happen somewhere else?
    if (card && canPlayCard(card, newMatch.discardPile[0], newMatch.currentColor)) {
      // removing the played card from the player's hand
      currentPlayer.hand = currentPlayer.hand.filter(card => card.id !== cardId)
      // adding the played card to the discard pile
      newMatch.discardPile =[card, ...newMatch.discardPile]
      newMatch.currentColor = card.color

      if (currentPlayer.hand.length === 0) {
        // the current player won!

        //handle this
      }

      // if the card is a reverse card, turn direction must be updated first 
      if (card.type === 'reverse') {
        newMatch.turnDirection = (newMatch.turnDirection === 1) ? -1 : 1
      }
      newMatch.currentPlayerIndex = this.getNextPlayerIndex(newMatch)

      if (card.type === 'skip') {
        // if the card is a skip, we have to run the getNextPlayerIndex logic again to advance the index by another 1
        newMatch.currentPlayerIndex = this.getNextPlayerIndex(newMatch)
      }

      if (card.type === 'draw2') {
        // handle draw 2 effects
      }

      if (card.type === 'wild') {
        // handle wild card effects
      }

      if (card.type === 'wildDraw4') {
        // handle wild draw 4 effects
      }

      return newGame
    } else {
      // play is invalid
      return null
    }
  }

  // returns what the next current player index should be based on match state and the type of card that was played
  private getNextPlayerIndex(match: UnoMatch) {
    let newIndex
    
    if (match.turnDirection === 1) {
      // checking if we're at the last player in the list yet
      if (match.currentPlayerIndex === match.players.length - 1) {
        // if we're at the end of the list, loop back around to the beginning
        newIndex = 0
      } else {
        newIndex = match.currentPlayerIndex + 1
      }
    } else { // turn direction is reversed
      if (match.currentPlayerIndex === 0) {
        // if we're at the beginning of the list, loop back around to the end
        newIndex = match.players.length - 1
      } else {
        newIndex = match.currentPlayerIndex - 1
      }
    }

    return newIndex
  }

  // Get Current Uno Match -- Last Element of the Matches List
  public getCurrentUnoMatch(): UnoMatch {
    return this.currentGame!.matches.at(-1)!;
  }

  // get the current match from a given game, used when making a new copy of the game
  private getCurrentUnoMatchFromGame(game: Game): UnoMatch {
    return game.matches.at(-1)
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
  public getCurrentPlayer(game: Game): Player {
    return game.players[this.getCurrentUnoMatchFromGame(game).currentPlayerIndex]
  }
} // end of class
