import type { Game } from "../game/types/Game";

export default function PlayerPicker({cardId, gameState, handleChoice}: {cardId: string, gameState: Game, handleChoice: any}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Choose an option</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleChoice(cardId, 'green')}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            green
          </button>
          <button
            onClick={() => handleChoice(cardId, 'red')}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            red
          </button>
          <button
            onClick={() => handleChoice(cardId, 'blue')}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            blue
          </button>
        </div>
      </div>
    </div>
  )
}