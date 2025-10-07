// A single run of our rogue-like game, consisting of a series of Uno matches
import type { Modifier } from './Modifier'
import type Player from './Player'
import type { UnoMatch } from './UnoMatch'

export interface Game {
  player: Player
  matches: UnoMatch[]
  currentScreen: 'match' | 'chooseModifier' | 'gameOver' | 'home' | null
  modifiers: Modifier[],
  winner: null,
  status: 'Not Started'
}