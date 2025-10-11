import type Player from "~/game/types/Player"
import { PlayerHeader } from "./Animation";

interface AIPlayerProps {
  player: Player
}

export function AIPlayer({ player }: { player: Player }) {
  return (
    <div className='flex flex-col'>
      <div className="flex flex-col items-center justify-center">
        <PlayerHeader playerId={player.id} playerName={player.name} />
        <div className=" text-sm bg-lime-500 text-white p-2 m-0.5 rounded shadow-sm">
          <span className='text-xl'>{player.hand.length}</span> cards</div>
      </div>
    </div>
  );
}