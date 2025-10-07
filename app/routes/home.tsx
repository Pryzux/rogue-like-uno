import { useState } from "react";
import { TestUi } from "~/UserInterface/TestUi";
import type { Game } from "../game/types/Game";
import UnoMatchPage from "./unoMatchPage";

export default function Home(testMode: false) {
  //testing flag to enable testUI.tsx
  const TEST_UI = true;
  if (TEST_UI) return <TestUi />

  // Initialize the game state on first render
  const [gameState, setGameState] = useState<Game>(() => GameLogic.get().getGame());

  // Create new Uno Match
  const handleStartNewGame = () => {
    console.log("Starting New Game..");
    GameLogic.get().initializeUno()
    setGameState(GameLogic.get().getGame())
  };


  if (gameState.status === 'Match Created') {
    console.log(gameState.status)
    return <UnoMatchPage />;
  }
  else {

    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Rogue-Like Uno</h1>

        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
          <p className="font-medium">
            <span className="text-amber-800">Status:</span> {gameState.status}
          </p>
          <p>
            <span className="font-medium text-amber-800">Players:</span>{" "}
            {gameState.players.map(p => p.name).join(", ")}
          </p>
        </div>

        <button
          // Clicking will add a new match to the gameState
          onClick={handleStartNewGame} className="px-4 py-2 bg-amber-200 border border-amber-300 rounded hover:bg-amber-300">
          Start Game
        </button>
      </div>
    );


  }


}

