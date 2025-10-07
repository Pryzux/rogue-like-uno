import { useState } from "react";
import { GameLogic } from "~/game/gamelogic";
import { TestUi } from "~/UserInterface/TestUi";
import type { Game } from "../game/types/Game";


export default function Home(testMode: false) {
  //testing flag to enable testUI.tsx
  const TEST_UI = false;
  if (TEST_UI) return <TestUi />

  // Initialize the game state on first render
  const [gameState, setGameState] = useState<Game>(() => GameLogic.get().getGame());

  // Example: reset or start new game
  const handleReset = () => {
    console.log("Game Reset.")
    setGameState(GameLogic.get().resetGame());
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Rogue-Like Uno</h1>

      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
        <p className="font-medium">
          <span className="text-amber-800">Status:</span> {gameState.status}
        </p>
        <p>
          <span className="font-medium text-amber-800">Players:</span>{" "}
          {gameState.matches[0].players.map(p => p.name).join(", ")}
        </p>
        <p>
          <span className="font-medium text-amber-800">Your Cards:</span>{" "}
          {/* Players is a list now, need to add get_player() {gameState.player.hand.map(card => card.value).join(", ") || "(empty)"} */}
        </p>
      </div>

      <button
        onClick={handleReset}
        className="px-4 py-2 bg-amber-200 border border-amber-300 rounded hover:bg-amber-300"
      >
        Reset Game
      </button>
    </div>
  );
}

