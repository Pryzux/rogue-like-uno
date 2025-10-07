import type { Game } from "./types/Game";
import type Player from "./types/Player";
import type { UnoMatch } from "./types/UnoMatch";
import { createDeck, shuffleDeck, drawOneCard, canPlayCard } from "./deck";
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
    return structuredClone(this.currentGame);
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

    console.log("Initialized Game");
    // console.log("Initialized Game:", JSON.stringify(game, null, 2));
    this.currentGame = game;
    return structuredClone(game);
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
        const card = deck.pop();
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
      status: "Match 1",
    };

    this.currentGame.matches.push(newMatch);
    this.currentGame.status = "Match Created";

    console.log("initializeUno(): New Matched added to Matches List");
    // console.log("Match Details: " + this.currentGame.matches[-1]);
    console.log(
      "Match Details:",
      JSON.stringify(this.currentGame.matches),
      null,
      2
    );

    return this.currentGame;
  }

  public drawCards(cardNumber: number, player: Player) {
    const currentMatch = this.getCurrentUnoMatch();
    for (let i = 0; i++; i < cardNumber) {
      // remember drawOneCard updates the current match in place if the deck needs to be shuffled
      const newCard = drawOneCard(currentMatch);
      player.hand.push(newCard);
    }
  }

  // returns null if play is invalid
  public playCard(cardId: string): Game | null {
    // a reference to the current match and current player
    const match = this.getCurrentUnoMatch();
    const currentPlayer = this.getCurrentPlayer();

    const card = currentPlayer.hand.find((card) => card.id === cardId);

    // check if play is valid - maybe this check should happen somewhere else?
    if (
      card &&
      canPlayCard(card, match.discardPile[0], match.currentColor!)
    ) {
      // removing the played card from the player's hand
      currentPlayer.hand = currentPlayer.hand.filter(
        (card) => card.id !== cardId
      );
      // adding the played card to the discard pile
      match.discardPile = [card, ...match.discardPile];
      match.currentColor = card.color;

      if (currentPlayer.hand.length === 0) {
        // the current player won!
        //handle this
      }

      // if the card is a reverse card, turn direction must be updated first
      if (card.type === "reverse") {
        match.turnDirection = match.turnDirection === 1 ? -1 : 1;
      }

      // Updating the current player!
      match.currentPlayerIndex = this.getNextPlayerIndex(match);

      if (card.type === "skip") {
        // if the card is a skip, we have to run the getNextPlayerIndex logic again to advance the index by another 1
        match.currentPlayerIndex = this.getNextPlayerIndex(match);
      }

      if (card.type === "draw2") {
        // the current player was updated above to the next player, so they have to draw
        this.drawCards(2, match.players[match.currentPlayerIndex]);
      }

      if (card.type === "wild") {
        // handle wild card effects
        // temporary logic!!!
        const validColors = ["red", "blue", "green", "yellow"];
        const colorPick =
          validColors[Math.floor(Math.random() * validColors.length)];
        match.currentColor = colorPick as CardColor;
      }

      if (card.type === "wildDraw4") {
        this.drawCards(4, match.players[match.currentPlayerIndex]);
        // temporary logic!!!
        const validColors = ["red", "blue", "green", "yellow"];
        const colorPick =
          validColors[Math.floor(Math.random() * validColors.length)];
        match.currentColor = colorPick as CardColor;
      }

      return this.getGame()
    } else {
      // play is invalid
      return null;
    }
  }

  // returns what the next current player index should be based on match state and the type of card that was played
  private getNextPlayerIndex(match: UnoMatch) {
    let newIndex;

    if (match.turnDirection === 1) {
      // checking if we're at the last player in the list yet
      if (match.currentPlayerIndex === match.players.length - 1) {
        // if we're at the end of the list, loop back around to the beginning
        newIndex = 0;
      } else {
        newIndex = match.currentPlayerIndex + 1;
      }
    } else {
      // turn direction is reversed
      if (match.currentPlayerIndex === 0) {
        // if we're at the beginning of the list, loop back around to the end
        newIndex = match.players.length - 1;
      } else {
        newIndex = match.currentPlayerIndex - 1;
      }
    }

    return newIndex;
  }

  // Get Current Uno Match -- Last Element of the Matches List
  public getCurrentUnoMatch(): UnoMatch {
    return structuredClone(this.currentGame!.matches.at(-1)!);
  }

  // get the current match from a given game, used when making a new copy of the game
  private getCurrentUnoMatchFromGame(game: Game): UnoMatch {
    return game.matches.at(-1)!;
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

  // returns the current player of the current match
  public getCurrentPlayer(): Player {
    return this.getCurrentUnoMatch().players[
      this.getCurrentUnoMatch().currentPlayerIndex
    ];
  }
} // end of class
