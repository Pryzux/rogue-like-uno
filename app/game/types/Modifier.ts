// Modifier.ts
export interface Modifier {
  name: string;
  description: string;
  modifierType: "buff" | "debuff";
}

export function makeModifier(
  name: string,
  description: string,
  modifierType: "buff" | "debuff"
) {
  return {
    name,
    description,
    modifierType,
  };
}

// Buffs
export const BUFFS: Modifier[] = [
  {
    name: "Lucky Draw",
    description:
      "When you draw a card, you have a 25% chance to draw two and keep the better one.",
    modifierType: "buff",
  },
  {
    name: "Reverse Momentum",
    description: "When you play a Reverse, take an extra turn immediately.",
    modifierType: "buff",
  },
  {
    name: "Wild Surge",
    description: "Playing a Wild automatically skips the next players turn",
    modifierType: "buff",
  },
  {
    name: "Stack Master",
    description: "You can stack +2 or +4 cards regardless of color.",
    modifierType: "buff",
  },
  {
    name: "Reflex UNO",
    description: "You automatically call UNO when down to one card.",
    modifierType: "buff",
  },
  {
    name: "+5 card",
    description:
      "When a Draw 4 card is pulled, this card becomes a Draw 5 card",
    modifierType: "buff",
  },
  {
    name: "+3 card",
    description:
      "When a Draw 2 card is pulled, this card becomes a Draw 3 card",
    modifierType: "buff",
  },
  {
    name: "Good Aim",
    description: "You can choose which player a +2 applies to",
    modifierType: "buff",
  },
  {
    name: "Double Skip",
    description: "Double Skip skips 2 players instead of 1",
    modifierType: "buff",
  },
];

// Debuffs
export const DEBUFFS: Modifier[] = [
  {
    name: "Color Focus",
    description: "AI Players prefer to play cards matching the current color.",
    modifierType: "buff",
  },
  {
    name: "Wild Instinct",
    description:
      "AI Players will pick the best wild card color for themsleves.",
    modifierType: "debuff",
  },
  {
    name: "Sluggish Hands",
    description: "Every 3 turns, you must draw an extra card automatically.",
    modifierType: "debuff",
  },
  {
    name: "Color Blind",
    description: "You can’t play Wilds until you have 3 or fewer cards left.",
    modifierType: "debuff",
  },
  {
    name: "Misfire",
    description:
      "When you play a card, 10% chance it plays a random card instead.",
    modifierType: "debuff",
  },
  {
    name: "Draw Fatigue",
    description:
      "Every Draw 2 or Draw 4 played against you adds one extra card.",
    modifierType: "debuff",
  },
  {
    name: "Uno Delay",
    description: "When you go down to one card, skip your next turn.",
    modifierType: "debuff",
  },
  {
    name: "Lazy Dealer",
    description: "Increase the number of cards in your starting hand by 3",
    modifierType: "debuff",
  },
];

// Utility: pick N random modifiers from a list.
