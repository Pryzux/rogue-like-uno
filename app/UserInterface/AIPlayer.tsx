import type Player from "~/game/types/Player"
import { PlayerHeader } from "./Animation";

interface AIPlayerProps {
  player: Player
}

export function AIPlayer({ player }: { player: Player }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <PlayerHeader playerId={player.id} playerName={player.name} />
      <span className='text-xs bg-lime-300 text-white p-0.5 m-0.5 rounded'>{player.hand.length} cards</span>
    </div>
  );
}