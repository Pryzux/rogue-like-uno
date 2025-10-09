import type Player from "~/game/types/Player"

interface AIPlayerProps {
  player: Player
}

export function AIPlayer({player}: AIPlayerProps) {
  return (
    <div className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-full">
      hi I'm {player.name}
    </div>
  )
}