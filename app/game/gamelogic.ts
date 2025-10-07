import type { Game } from "./types/Game";
import type Player from "./types/Player";
import type { UnoMatch } from "./types/UnoMatch";
import { createDeck, shuffleDeck, drawCard } from "./deck";
import type { Card, CardColor } from "./types/Card";

// Initialize High-Level Game State (God State)
export function initializeGame(): Game {

  const players: Player[] = [

    { id: 'player-1', name: 'You', isHuman: true, hand: [] as Card[], calledUno: false, extraCards: [] as Card[] },
    { id: 'ai-1', name: 'AI 1', isHuman: false, hand: [] as Card[], calledUno: false, extraCards: [] as Card[] },
    { id: 'ai-2', name: 'AI 2', isHuman: false, hand: [] as Card[], calledUno: false, extraCards: [] as Card[] },
    { id: 'ai-3', name: 'AI 3', isHuman: false, hand: [] as Card[], calledUno: false, extraCards: [] as Card[] },
  
]

  return {

    player: players[0],
    matches: [initializeUno(players)],
    currentScreen: null,
    modifiers: [],
    winner: null,
    status: 'Not Started'

  }

}

// Initialize Single Uno Match
export function initializeUno(players: Player[]): UnoMatch {
  
    let deck = shuffleDeck(createDeck());

    // 7 cards to each player
    const resetPlayers: Player[] = players.map(p => ({...p, hand: [] as Card[]}));
    
    resetPlayers.forEach(player => {

        for (let i = 0; i < 7 && deck.length > 0; i++) {

            const card = drawCard(deck)!

            if (card) {
                player.hand.push(card)
            }

        }
    
    })

    const firstCard = deck.pop()!;
    const discardPile = [firstCard];
    const startingColor: CardColor = firstCard.color === 'black' ? 'red' : firstCard.color;

    return {
        players: resetPlayers,
        currentPlayerIndex: 0,
        turnDirection: 1,
        deck,
        discardPile,
        currentColor: startingColor,
        status: 'Not Started',
    }
}






