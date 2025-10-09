import { canPlayCard, createDeck, drawOneCard, shuffleDeck } from "./deck";
import type { GameLogicInterface } from "./gameLogicInterface";
import type { Card, CardColor } from "./types/Card";
import type { Game } from "./types/Game";
import { BUFFS, DEBUFFS, type Modifier } from "./types/Modifier";
import type Player from "./types/Player";
import type { UnoMatch } from "./types/UnoMatch";

// the number of cards added to the user's starting hand from the Lazy Dealer debuff
export const LAZY_DEALER_AMOUNT = 3;

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
      modifiers: [BUFFS.find(b => b.name === 'Good Aim')],
      status: "Not Started",
      nextRoundStatus:
        "Please Select 1 buff and 1 debuff, before starting the next round",
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
      let numberOfStartingCards = 7;

      // Handle Lazy Dealer debuff
      // If the current player is human and they have the Lazy Dealer debuff
      if (
        player.isHuman &&
        this.currentGame.modifiers.find((m) => m.name === "Lazy Dealer")
      ) {
        numberOfStartingCards += LAZY_DEALER_AMOUNT;
      }

      for (let i = 0; i < numberOfStartingCards && deck.length > 0; i++) {
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

    return this.currentGame;
  }

  public drawCards(cardNumber: number, playerIndex: number) {
    const player = this.getPlayerFromIndex(playerIndex);
    const currentMatch = this.getCurrentUnoMatch();
    for (let i = 0; i < cardNumber; i++) {
      // remember drawOneCard updates the current match in place if the deck needs to be shuffled
      const newCard = drawOneCard(currentMatch);
      player.hand.push(newCard);
    }
  }

  // Handle the Color Blind debuff
  private checkForColorBlind(card: Card, currentPlayer: Player): Boolean {
    // The current player is the user, and they have the Color Blind debuff, AND they have more than 3 cards in their hand
    // AND the card played is a wild type
    if (
      card.type.includes("wild") &&
      currentPlayer.isHuman &&
      this.currentGame.modifiers.find(
        (modifier) => modifier.name === "Color Blind"
      ) &&
      currentPlayer.hand.length > 3
    ) {
      return false;
    }
    return true;
  }

  // returns null if play is invalid
  public playCard(cardId: string, 
     { color = null, targetPlayer = null }: { color?: CardColor | null; targetPlayer?: Player | null } = {}
  ): Boolean {
    // a reference to the current match and current player
    const match = this.getCurrentUnoMatch();
    const currentPlayer = this.getCurrentPlayer();

    const card = currentPlayer.hand.find((card) => card.id === cardId);

    // check if play is valid
    if (
      card &&
      canPlayCard(card, match.discardPile[0], match.currentColor!) &&
      this.checkForColorBlind(card, currentPlayer)
    ) {
      // removing the played card from the player's hand
      currentPlayer.hand = currentPlayer.hand.filter(
        (card) => card.id !== cardId
      );
      // adding the played card to the discard pile
      match.discardPile = [card, ...match.discardPile];
      match.currentColor = card.color;

      if (currentPlayer.hand.length === 0) {
        // someone won!
        if (!currentPlayer.isHuman) {
          // the AI won
          match.status = "Loss";
          this.currentGame.status = "Lost";
        } else {
          // human won!
          match.status = "Won";
          this.currentGame.status = "Next Round";
        }
        return true;
      }

      // if the card is a reverse card, turn direction must be updated first
      if (card.type === "reverse") {
        match.turnDirection = match.turnDirection === 1 ? -1 : 1;
      }

      // Handle Reverse Momentum buff
      // If the player does NOT have Reverse Momentum, update the current player as normal
      // If the player has Reverse Momentum, the current player doesn't get updated because the player gets another turn
      if (
        !currentPlayer.isHuman ||
        !this.currentGame.modifiers.find(
          (modifier) => modifier.name === "Reverse Momentum"
        )
      ) {
        // The current player is AI OR the user does not have Reverse Momentum
        match.currentPlayerIndex = this.getNextPlayerIndex(match); // THIS IS THE NORMAL LOGIC FOR GOING TO THE NEXT PLAYER WITHOUT MODIFIERS
      } else if (card.type !== "reverse") {
        // The player has Reverse Momentum, but the card played was not a reverse
        match.currentPlayerIndex = this.getNextPlayerIndex(match);
      }

      if (card.type === "skip") {
        // if the card is a skip, we have to run the getNextPlayerIndex logic again to advance the index by another 1
        match.currentPlayerIndex = this.getNextPlayerIndex(match);
        //if there
        this.getCurrentModifiers().some((m) => m.name === "Double Skip")
          ? (match.currentPlayerIndex = this.getNextPlayerIndex(match))
          : undefined;
      }

      if (card.type === "draw2") {
        // the current player was updated above to the next player, so they have to draw
        let draw2TargetPlayer = match.currentPlayerIndex
        // Handling Good Aim buff
        // Note: the current player index has been updated, but currentPlayer is still the player who played this card
        if (currentPlayer.isHuman && this.getCurrentModifiers().find(m => m.name === 'Good Aim')) {
          draw2TargetPlayer = this.getPlayerIndexFromPlayer(targetPlayer)
        }
        //adding logic to handle a Buff, where a draw2 card becomes a draw3 card
        this.getCurrentModifiers().some(m => m.name === "+3 card") ? this.drawCards(3, draw2TargetPlayer) : this.drawCards(2, draw2TargetPlayer);

      }

      if (card.type === "wild") {
        match.currentColor = color! as CardColor;
      }

      if (card.type === "wildDraw4") {
        //adding logic to handle a Buff, where a draw4 card becomes a draw5 card
        this.getCurrentModifiers().some((m) => m.name === "+5 card")
          ? this.drawCards(5, match.currentPlayerIndex)
          : this.drawCards(4, match.currentPlayerIndex);
        console.log("chosen color is", color);
        match.currentColor = color! as CardColor;
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

  // get a Player's index from their player index
  public getPlayerIndexFromPlayer(player: Player): number {
    return this.currentGame.players.findIndex(p => p.id === player.id)
  }

  public playAITurn(): undefined | Game {
    const match = this.getCurrentUnoMatch();
    const currentPlayer = this.getCurrentPlayer();

    // Make sure it's actually an AI player
    if (currentPlayer.isHuman) {
      console.error("playAITurn called on human player");
      return;
    }

    let turnIsOver = false;

    while (!turnIsOver) {
      // Find all playable cards in AI's hand
      const playableCards = currentPlayer.hand.filter((card) =>
        canPlayCard(card, match.discardPile[0], match.currentColor!)
      );

      if (playableCards.length > 0) {
        // there's at least one playable card, so we won't have to draw any more
        turnIsOver = true;

        // Randomly select a playable card
        const cardToPlay =
          playableCards[Math.floor(Math.random() * playableCards.length)];

        // If it's a wild card, choose the best color before playing
        if (cardToPlay.type === "wild" || cardToPlay.type === "wildDraw4") {
          const chosenColor = this.chooseColorForWild(currentPlayer);

          // Play Wild Card, passing in the chosen color
          this.playCard(cardToPlay.id, {color: chosenColor})!;
          return this.getGame();
        } else {
          // playing a non-wild card
          this.playCard(cardToPlay.id)!;
          return this.getGame();
        }
      } else {
        // No playable cards, draw one card and go back to beginning of while loop
        this.drawCards(1, match.currentPlayerIndex);
      }
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

  public setWin(): Game {
    this.currentGame.status = "Next Round";
    this.getCurrentUnoMatch().status = "Won";
    console.log("Set Win");

    return this.getGame();
  }

  // ----- Buffs and Debuffs Logic ----

  // Random Buff/Debuffs for nextRoundPage (Picks 2 of Each) - Helper
  private getRandomModifiers(list: Modifier[]): Modifier[] {
    // Get current modifiers the player already has
    const currentModifiers = this.getCurrentModifiers();

    // Filter out
    const available = list.filter(
      (modifier) =>
        !currentModifiers.some((owned) => owned.name === modifier.name)
    );
    console.log(JSON.stringify(available));
    // Shuffle the remaining options
    const shuffled = [...available].sort(() => Math.random() - 0.5);

    // Return up to `count` modifiers (ex: 2 = 2 buffs and 2 debuffs)

    return shuffled.slice(0, 2);
  }

  // Return a fresh selection of 2 buffs and 2 debuffs.
  public getNextRoundOptions(): {} {
    return {
      buffs: this.getRandomModifiers(BUFFS),
      debuffs: this.getRandomModifiers(DEBUFFS),
    };
  }

  public getCurrentModifiers(): Modifier[] {
    // Get Modifiers [ Modifier ]
    if (!this.currentGame || !Array.isArray(this.currentGame.modifiers)) {
      this.currentGame = { ...this.currentGame, modifiers: [] };
    }
    return this.currentGame.modifiers;
  }

  public addModifier(modifier: Modifier): void {
    // 1 modifier of each type for every match in matches
    const chosenOfType = this.currentGame.modifiers.filter(
      (m) => m.modifierType === modifier.modifierType
    ).length;

    const maxForType = this.currentGame.matches.length; // one per match
    const canChooseOfType = chosenOfType < maxForType;
    // Block exact duplicate by name (clicking multiple times)
    const alreadyChosen = this.currentGame.modifiers.some(
      (m) => m.name === modifier.name
    );

    // this shouldn't matter if I got around to implementing removing modifier from buff/debuff list
    if (this.canStartNextMatch()) {
      this.currentGame.nextRoundStatus =
        "You have selected enough modifiers, Ready to Play!";
      return;
    }
    if (alreadyChosen) {
      this.currentGame.nextRoundStatus = `You already Selected "${modifier.name}".`;
      return;
    } else if (!canChooseOfType) {
      this.currentGame.nextRoundStatus = `You have already Selected a ${modifier.modifierType}.`;
      return;
    }

    // Add modifier
    this.currentGame.modifiers.push(modifier);
    this.currentGame.nextRoundStatus = `Selected the ${modifier.name} ${modifier.modifierType}`;
  }

  public resetModifiers(): Game {
    this.currentGame.modifiers = [];
    return this.getGame();
  }

  // Helper for startGameAfterModifier Selction -- number of current modifiers (buff or debuff)
  private countModifiersOfType(type: "buff" | "debuff"): number {
    return this.currentGame.modifiers.filter((m) => m.modifierType === type)
      .length;
  }
  // Helper for startGameAfterModifier Selction -- checks if chosen 1 new buff & debuff by comparing required amount (length of matches = we want 1 extra per match)
  private canStartNextMatch(): boolean {
    const requiredPerType = this.currentGame.matches.length; // one per past match
    const buffCount = this.countModifiersOfType("buff");
    const debuffCount = this.countModifiersOfType("debuff");
    return buffCount === requiredPerType && debuffCount === requiredPerType;
  }

  // Wrapper for readability
  public startGameAfterModifierSelection(): boolean {
    // if player chosen buffs
    if (!this.canStartNextMatch()) {
      const required = this.currentGame.matches.length;
      const haveB = this.countModifiersOfType("buff");
      const haveD = this.countModifiersOfType("debuff");

      // Determine missing modifier types
      const missing: string[] = [];
      if (haveB < required) missing.push("buff");
      if (haveD < required) missing.push("debuff");

      // Build message based on what's missing
      let message = "";

      if (missing.length === 2) {
        message = `You still need to choose One buff and debuff before starting`;
      } else if (missing.length === 1) {
        message = `You still need to choose a ${missing[0]} before starting the next round`;
      }

      this.currentGame.nextRoundStatus = message;

      console.warn(message);
      return false;
    }
    // pushes a new match
    this.initializeUno();
    return true;
  }
} // end of class
