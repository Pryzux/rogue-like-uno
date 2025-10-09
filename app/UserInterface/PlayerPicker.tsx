import type { Game } from "../game/types/Game";

export default function PlayerPicker({cardId, gameState, handleChoice}: {cardId: string, gameState: Game, handleChoice: any}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Choose a player to use your +2 on</h2>
        <div className="flex gap-2">
          {gameState.players.map(player => {
            if (!player.isHuman) {
              return (
                <button
                  onClick={() => handleChoice(cardId, player)}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  id={player.id}
                >
                  {player.name}
                </button>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}