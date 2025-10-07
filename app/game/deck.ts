// deck.ts
import type { Card, CardColor } from "./types/Card";

export function createDeck(): Card[] {

  const deck: Card[] = [];
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
  let cardId = 0;

  for (const color of colors) {

    // 0 card (1 copy)
    deck.push({ id: `card-${cardId++}`, type: 'number', color, value: 0 });

    // 1–9 (2 copies each)
    for (let i = 1; i <= 9; i++) {
      deck.push({ id: `card-${cardId++}`, type: 'number', color, value: i });
      deck.push({ id: `card-${cardId++}`, type: 'number', color, value: i });
    }

    // Action cards (2 copies each)
    for (let i = 0; i < 2; i++) {
      deck.push({ id: `card-${cardId++}`, type: 'skip', color });
      deck.push({ id: `card-${cardId++}`, type: 'reverse', color });
      deck.push({ id: `card-${cardId++}`, type: 'draw2', color });
    }

  }

  // Wilds
  for (let i = 0; i < 4; i++) {
    deck.push({ id: `card-${cardId++}`, type: 'wild', color: 'black' });
    deck.push({ id: `card-${cardId++}`, type: 'wildDraw4', color: 'black' });
  }

  return deck

}

export function shuffleDeck(deck: Card[]): Card[] {

  const shuffled = [...deck]

  for (let i = shuffled.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1)); 
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]

  }

  return shuffled

}

export function drawCard(deck: Card[]): Card {

  if (deck.length === 0) {
    throw new Error("Tried to draw from an empty deck");
  }

  return deck.pop()!

}

export function canPlayCard(card: Card, topCard: Card, currentColor: string): boolean {
  
  if (card.type === 'wild' || card.type === 'wildDraw4') {
    return true;
  }

  if (card.color === currentColor) {
    return true;
  }

  if (card.type === topCard.type && card.type === 'number' && card.value === topCard.value) {
    return true;
  }

  if (card.type === topCard.type && card.type !== 'number') {
    return true;
  }

  return false;
}
