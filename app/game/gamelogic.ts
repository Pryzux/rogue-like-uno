import { canPlayCard, createDeck, drawOneCard, shuffleDeck } from "./deck";
import type { GameLogicInterface } from "./gameLogicInterface";
import type { CardColor } from "./types/Card";
import type { Game } from "./types/Game";
import type Player from "./types/Player";
import type { UnoMatch } from "./types/UnoMatch";

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

  public drawCards(cardNumber: number, playerIndex: number) {
    const player = this.getPlayerFromIndex(playerIndex);
    const currentMatch = this.getCurrentUnoMatch();
    for (let i = 0; i++; i < cardNumber) {
      // remember drawOneCard updates the current match in place if the deck needs to be shuffled
      const newCard = drawOneCard(currentMatch);
      player.hand.push(newCard);
    }
  }

  // returns null if play is invalid
  public playCard(cardId: string): Boolean {
    // a reference to the current match and current player
    const match = this.getCurrentUnoMatch();
    const currentPlayer = this.getCurrentPlayer();

    const card = currentPlayer.hand.find((card) => card.id === cardId);

    // check if play is valid - maybe this check should happen somewhere else?
    if (card && canPlayCard(card, match.discardPile[0], match.currentColor!)) {
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
        this.drawCards(2, match.currentPlayerIndex);
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
        this.drawCards(4, match.currentPlayerIndex);
        // temporary logic!!!
        const validColors = ["red", "blue", "green", "yellow"];
        const colorPick =
          validColors[Math.floor(Math.random() * validColors.length)];
        match.currentColor = colorPick as CardColor;
      }

      return true;
    } else {
      // play is invalid
      return false;
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
    return this.currentGame!.matches.at(-1)!;
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

  // get a Player instance from the current match given their index in the players array
  public getPlayerFromIndex(index: number): Player {
    const currentMatch = this.getCurrentUnoMatch();
    return currentMatch.players[index];
  }

  public playAITurn(): undefined | Game {
    const match = this.getCurrentUnoMatch();
    const currentPlayer = this.getCurrentPlayer();

    // Make sure it's actually an AI player
    if (currentPlayer.isHuman) {
      console.error("playAITurn called on human player");
      return;
    }

    // Find all playable cards in AI's hand
    const playableCards = currentPlayer.hand.filter((card) =>
      canPlayCard(card, match.discardPile[0], match.currentColor!)
    );

    if (playableCards.length > 0) {
      // Randomly select a playable card
      const cardToPlay =
        playableCards[Math.floor(Math.random() * playableCards.length)];

      // If it's a wild card, choose the best color before playing
      if (cardToPlay.type === "wild" || cardToPlay.type === "wildDraw4") {
        const chosenColor = this.chooseColorForWild(currentPlayer);

        // Remove the card from hand
        currentPlayer.hand = currentPlayer.hand.filter(
          (card) => card.id !== cardToPlay.id
        );

        // Add to discard pile
        match.discardPile = [cardToPlay, ...match.discardPile];

        // Play Wild Card -- Need to pass chosenColor
        // match.currentColor = chosenColor;
        this.playCard(cardToPlay.id)!;

        // Check if AI won
        if (currentPlayer.hand.length === 0) {
          match.status = `${currentPlayer.name} wins!`;
          return;
        }

        // Handle wildDraw4 effect
        if (cardToPlay.type === "wildDraw4") {
          match.currentPlayerIndex = this.getNextPlayerIndex(match);
          this.drawCards(4, match.currentPlayerIndex);
        } else {
          // Regular wild card - just advance turn
          match.currentPlayerIndex = this.getNextPlayerIndex(match);
        }

        return;
      } else {
        // Use the existing playCard method for non-wild cards
        this.playCard(cardToPlay.id)!;
        return this.getGame();
      }
    } else {
      // No playable cards, draw one card
      this.drawCards(1, match.currentPlayerIndex);

      // After drawing, advance to next player's turn
      match.currentPlayerIndex = this.getNextPlayerIndex(match);

      return;
    }
  }

  // AI Choosing Wild Color
  private chooseColorForWild(player: Player): CardColor {
    const colorCounts: Record<string, number> = {
      red: 0,
      blue: 0,
      green: 0,
      yellow: 0,
    };

    // Count colors in AI's hand (excluding black/wild cards)
    player.hand.forEach((card) => {
      if (card.color !== "black") {
        colorCounts[card.color] = (colorCounts[card.color] || 0) + 1;
      }
    });

    // Find the color with the most cards
    let maxCount = 0;
    let bestColor: CardColor = "red";

    (Object.keys(colorCounts) as CardColor[]).forEach((color) => {
      if (colorCounts[color] > maxCount) {
        maxCount = colorCounts[color];
        bestColor = color;
      }
    });

    return bestColor;
  }
} // end of class
