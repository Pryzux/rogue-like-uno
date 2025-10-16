# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rogue-Like UNO is a progressive survival twist on UNO built with React, TypeScript, and Tailwind CSS. Players must survive increasingly difficult rounds by selecting buffs and debuffs that stack, creating a roguelike experience where each victory makes the next round harder.

## Development Commands

### Setup
```bash
bun install
# or
npm install
```

### Development
```bash
bun dev
# or
npm run dev
```

### Build
```bash
bun run build
# or
npm run build
```

### Production Server
```bash
bun start
# or
npm start
```

## Architecture Overview

### Core Game Logic Pattern

The codebase follows a **Singleton + God Object** pattern centered around `GameLogic` (app/game/gamelogic.ts:13-691):

- **GameLogic Singleton**: Single source of truth for all game state
  - Access via `GameLogic.get()`
  - Maintains `currentGame` (the "God Object") containing all game state
  - All game mutations happen through GameLogic methods
  - Returns deep clones via `getGame()` to prevent external mutation

### State Management Flow

1. **React State**: Components hold local `gameState` copies
2. **Mutations**: Call `GameLogic.get().methodName()`
3. **Sync**: Update React state with `setGameState(GameLogic.get().getGame())`

Example pattern seen throughout:
```typescript
GameLogic.get().playCard(cardId);
setGameState(GameLogic.get().getGame());
setMatchState(GameLogic.get().getCurrentUnoMatch());
```

### Key Type Hierarchy

- **Game** (app/game/types/Game.ts): Top-level game state
  - `players[]`: All players in the game
  - `matches[]`: Array of UnoMatch objects (history of all rounds)
  - `modifiers[]`: Active buffs/debuffs
  - `currentScreen`: UI routing state
  - `status`: Game progression ("Not Started" | "Match Created" | "Next Round" | "Lost")

- **UnoMatch** (app/game/types/UnoMatch.ts): Single round of UNO
  - Snapshot of players at match start
  - `deck`, `discardPile`: Card management
  - `currentPlayerIndex`, `turnDirection`: Turn order
  - `currentColor`: Active color (important for wild cards)
  - `modifiersAddedThisRound[]`: Tracks new modifiers for this round

- **Modifier** (app/game/types/Modifier.ts): Buffs and Debuffs
  - Static lists: `BUFFS` and `DEBUFFS` arrays
  - Applied via `GameLogic.get().addModifier()`
  - Checked via `GameLogic.get().hasModifier(name)`

### Routing Architecture

Uses React Router v7 with programmatic routing via game state:

- **home.tsx**: Main router - renders different pages based on `gameState.status`
  - `"Not Started"` → Homepage
  - `"Match Created"` → MatchPage
  - `"Next Round"` → NextRound (modifier selection)
  - `"Lost"` → LostSummary

No URL-based routes - all routing happens via state.

### Modifier System Implementation

All modifiers are defined in app/game/types/Modifier.ts with static arrays `BUFFS` (6 total) and `DEBUFFS` (6 total). Logic is implemented via `hasModifier()` checks throughout the codebase.

**Core Design**: All modifiers stack - players accumulate 1 buff + 1 debuff per round survived. By round 6, all 12 modifiers are active simultaneously.

#### BUFFS (6 total)

**1. Reverse Momentum** (app/game/gamelogic.ts:236-245)
- **Effect**: When human plays a Reverse card, they get another turn immediately
- **Implementation**: After playing reverse and updating `turnDirection`, check `if (!currentPlayer.isHuman || !this.hasModifier("Reverse Momentum"))`. If false (player has buff AND played reverse), skip the normal `currentPlayerIndex` update
- **Alert**: "Reverse Momentum!!!"

**2. Wild Surge** (app/game/gamelogic.ts:320-324)
- **Effect**: Playing a Wild card automatically skips the next player's turn
- **Implementation**: In `playCard()` when `card.type === "wild"`, check `if (this.hasModifier("Wild Surge") && currentPlayer.isHuman)`. If true, advance `currentPlayerIndex` one additional time
- **Alert**: "WIIIIIIDDD SUUUURGE!!!"

**3. +5 card** (app/game/gamelogic.ts:330-336)
- **Effect**: Wild Draw 4 becomes Wild Draw 5 when human plays it
- **Implementation**: In `playCard()` when `card.type === "wildDraw4"`, check `if (this.hasModifier("+5 card") && currentPlayer.isHuman)`. If true, call `drawCards(5, ...)` instead of `drawCards(4, ...)`
- **Alert**: "+5 buff activated!!!!"

**4. +3 card** (app/game/gamelogic.ts:291-296)
- **Effect**: When human plays Draw 2, target draws 3 cards instead of 2
- **Implementation**: In `playCard()` when `card.type === "draw2"`, check `if (currentPlayer.isHuman && this.hasModifier("+3 card"))`. If true, call `drawCards(3, ...)` instead of `drawCards(2, ...)`
- **Direction**: Human → AI (buff helps player attack AIs)
- **Special case**: Works alongside "Good Aim" - combined alert becomes "Good aim!! +3 buff activated!!!!"
- **Alert**: "+3 buff activated!!!!" (or combined with Good Aim)

**5. Good Aim** (app/game/gamelogic.ts:277-288)
- **Effect**: Human can choose which player receives the Draw 2 penalty
- **Implementation**:
  - In MatchPage.tsx:53, when human plays draw2 and modifier is active, show PlayerPicker UI instead of playing immediately
  - In `playCard()`, check `if (currentPlayer.isHuman && this.hasModifier("Good Aim"))`. Use `options.targetPlayer` instead of `match.currentPlayerIndex` to determine draw2 target
  - Requires `PlayCardOptions` parameter with `targetPlayer?: Player`
- **Alert**: "Good aim!!!!" (unless combined with +3 card)

**6. Double Skip** (app/game/gamelogic.ts:257-261)
- **Effect**: Skip card skips 2 players instead of 1
- **Implementation**: In `playCard()` when `card.type === "skip"`, after advancing once (normal skip behavior), check `if (this.hasModifier("Double Skip") && currentPlayer.isHuman)`. If true, advance `currentPlayerIndex` one additional time
- **Alert**: "Double skip!!!!!"

#### DEBUFFS (6 total)

**1. Color Focus** (app/game/gamelogic.ts:433-442, 466-483)
- **Effect**: AI players prefer playing cards matching the current color
- **Implementation**: In `playAITurn()`, when AI has playable cards, check `if (this.hasModifier("Color Focus"))`. If true, call `chooseCardColorFocus()` instead of random selection
- **Logic**: `chooseCardColorFocus()` filters playable cards for ones matching `currentColor`, picks random from matches. Falls back to random playable card if no color matches
- **No alert** (AI behavior change)

**2. Wild Instinct** (app/game/gamelogic.ts:486-530)
- **Effect**: AI players pick the best wild color for themselves (color they have most of)
- **Implementation**: In `chooseColorForWild()`, check `if (!hasWildInstinct)` for random behavior. If true, count all colors in AI hand, pick color with highest count
- **Logic**: Creates `colorCounts` record, iterates AI hand (excluding black cards), finds color with `maxCount`
- **Alert**: "Wild Instinct!! AI picked the best color for itself"

**3. Sluggish Hands** (app/routes/MatchPage.tsx:75-84)
- **Effect**: Human draws 1 extra card automatically every 3rd turn
- **Implementation**: In MatchPage useEffect (triggers on `currentPlayerIndex` change), check `if (currentPlayer.isHuman && GameLogic.get().hasModifier("Sluggish Hands") && currentPlayer.turns % 3 === 0 && currentPlayer.turns !== 0)`. If true, call `drawCard(1)`
- **Requires**: Player.turns counter (incremented in playCard() at gamelogic.ts:203)
- **Alert**: "Sluggish hands! +1 card every 3rd turn"

**4. Color Blind** (app/game/gamelogic.ts:168-184)
- **Effect**: Human cannot play Wild or Wild Draw 4 until they have 3 or fewer cards
- **Implementation**: `checkForColorBlind()` helper called in `playCard()` before validating play. Checks `if (card.type.includes("wild") && currentPlayer.isHuman && this.hasModifier("Color Blind") && currentPlayer.hand.length > 3)`. Returns false to block the play
- **Alert**: "Cannot Play Wild Card (Color Blind)"

**5. Draw Fatigue** (app/game/gamelogic.ts:299-310)
- **Effect**: When AI plays Draw 2 against human, human draws 3 cards instead of 2
- **Implementation**: In `playCard()` when `card.type === "draw2"` and `!currentPlayer.isHuman && this.hasModifier("Draw Fatigue")`, check if target player is human. If true, call `drawCards(3, ...)` instead of `drawCards(2, ...)`
- **Direction**: AI → Human (debuff makes AI attacks stronger)
- **Alert**: "Draw Fatigue :((( +3 to you"

**6. Lazy Dealer** (app/game/gamelogic.ts:117-120)
- **Effect**: Human starts each match with 3 extra cards (10 instead of 7)
- **Implementation**: In `initializeUno()` during initial card dealing, check `if (player.isHuman && this.hasModifier("Lazy Dealer"))`. If true, set `numberOfStartingCards` to `7 + this.lazyDealerAmount` (where `lazyDealerAmount = 3`)
- **Alert**: "Lazy dealer!! +3 cards to you"

#### Critical: Draw 2 Card Logic Structure (gamelogic.ts:264-316)

The draw2 handler uses a cascading if/else-if structure that handles multiple modifiers:

```typescript
if (card.type === "draw2") {
  let draw2TargetPlayer = match.currentPlayerIndex;

  // Path 1: Human plays draw2 with Good Aim
  if (currentPlayer.isHuman && this.hasModifier("Good Aim")) {
    draw2TargetPlayer = this.getPlayerIndexFromPlayer(options!.targetPlayer!);
    // Also check for +3 card sub-case here
  }

  // Path 2: Human plays draw2 with +3 card (but NOT Good Aim)
  if (currentPlayer.isHuman && this.hasModifier("+3 card")) {
    this.drawCards(3, draw2TargetPlayer);
  }

  // Path 3: AI plays draw2 with Draw Fatigue active
  else if (!currentPlayer.isHuman && this.hasModifier("Draw Fatigue")) {
    const targetIsHuman = this.getPlayerFromIndex(draw2TargetPlayer).isHuman;
    if (targetIsHuman) {
      this.drawCards(3, draw2TargetPlayer);
    } else {
      this.drawCards(2, draw2TargetPlayer);
    }
  }

  // Path 4: Default (no modifiers or AI without Draw Fatigue)
  else {
    this.drawCards(2, draw2TargetPlayer);
  }
}
```

**How it works with all modifiers stacked**:

1. **Good Aim + +3 card + Draw Fatigue all active**:
   - Human plays draw2 → Path 1 (Good Aim) → also checks +3 card inside → draws 3 → ✅ Correct
   - AI plays draw2 → Path 3 (Draw Fatigue) → draws 3 if target is human → ✅ Correct

2. **+3 card + Draw Fatigue (without Good Aim)**:
   - Human plays draw2 → Path 2 (+3 card) → draws 3 → ✅ Correct
   - AI plays draw2 → Path 3 (Draw Fatigue) → draws 3 if target is human → ✅ Correct

3. **Directionality is key**:
   - **+3 card**: Human → Any player (buff enhances player offense)
   - **Draw Fatigue**: AI → Human (debuff enhances AI offense against player)
   - These are opposite directions, so they never conflict

**Important for new modifiers**: The if/else-if structure uses `currentPlayer.isHuman` checks to disambiguate who is playing the card. When adding new modifiers that affect draw2/draw4/skip cards, follow this pattern:
- Human-played modifiers: Check `currentPlayer.isHuman && hasModifier()`
- AI-played modifiers affecting human: Check `!currentPlayer.isHuman && hasModifier()` then verify target is human
- This prevents modifiers from incorrectly triggering on the wrong player type

#### Modifier Stacking Summary

**✅ All 12 modifiers stack correctly** when following these patterns:

1. **Independent triggers**: Different card types (reverse vs wild vs skip vs draw2 vs draw4)
2. **Directional separation**: Human buffs affect human→AI, debuffs affect AI→human
3. **Timing separation**: Match start (Lazy Dealer), turn-based (Sluggish Hands), card play
4. **AI behavior vs human restrictions**: Color Focus/Wild Instinct (AI) vs Color Blind (human)
5. **Explicitly combined**: Good Aim + +3 card designed to work together

**No conflicts exist** - the if/else-if structure in draw2 handling correctly routes based on who played the card and which modifiers are active. This structure should be preserved when adding new modifiers that affect the same card types.

### AI Turn Logic

AI turns execute in `playAITurn()` (app/game/gamelogic.ts:409):
1. Find all playable cards
2. Apply debuff modifiers to card selection (Color Focus)
3. Choose card (random or modifier-influenced)
4. For wilds: use Wild Instinct if active, else random color
5. Play card and return updated game state

AI turns trigger via useEffect in MatchPage when `currentPlayerIndex` changes and current player is not human.

### UI Communication Bus

**UIBus** (app/UIBus.ts): Event-driven system for visual effects
- Used for AI player hit animations (draw2, skip cards)
- Pattern: `uiBus.emitPlayerEffect({ playerId, effect })`
- Components listen via `addEventListener("playerEffect", handler)`

### Deck Management

**deck.ts** (app/game/deck.ts):
- `createDeck()`: Standard UNO deck (108 cards)
- `drawOneCard()`: **MODIFIES MATCH IN PLACE** - auto-reshuffles discard pile when deck empty
- `canPlayCard()`: Core rule validation (color, type, value matching)

### Modifier Alert System

Temporary notifications for modifier activation:
- Set via `GameLogic.get().setModifierAlert(text)`
- Consumed via `GameLogic.get().consumeModifierAlert()` (clears after read)
- Displayed in ModifierNotification component
- Pattern prevents alerts from repeating on state updates

## Important Patterns

### Adding New Modifiers

1. Add to `BUFFS` or `DEBUFFS` array in app/game/types/Modifier.ts
2. Implement logic checks in app/game/gamelogic.ts:
   - Player-triggered: Check in `playCard()`
   - AI-triggered: Check in `playAITurn()`, `chooseColorForWild()`, or `chooseCardColorFocus()`
   - Turn-triggered: Check in MatchPage useEffect
3. Add modifier alert notification where appropriate

### Match Flow

1. `initializeUno()`: Creates new UnoMatch, deals cards, applies "Lazy Dealer"
2. Game loop: Human/AI turns alternate based on `currentPlayerIndex`
3. Win condition: Player hand reaches 0 cards
4. `setWin()` or `setLoss()`: Update match and game status
5. Navigate to NextRound or LostSummary based on winner

### Deep Clone Pattern

GameLogic always returns deep clones via `structuredClone()`:
- Prevents accidental state mutation from components
- Each `getGame()` call returns fresh copy
- Player arrays in matches are snapshots at match start

## Tech Stack Specifics

- **Bun**: Primary runtime (package.json uses `bunx` commands)
- **React Router v7**: Uses new file-based config (react-router.config.ts)
- **Tailwind v4**: Using @tailwindcss/vite plugin
- **shadcn/ui**: Component library (components.json config)
- **Framer Motion**: All page transitions and animations
- **TypeScript**: Strict typing throughout, especially for Card and Game types
