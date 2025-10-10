import type Player from "~/game/types/Player"
import { PlayerHeader } from "./Animation";

interface AIPlayerProps {
  player: Player
}

export function AIPlayer({ player }: { player: Player }) {
  return (
    <div className="flex items-center justify-center">
      <PlayerHeader playerId={player.id} playerName={player.name} />
    </div>
  );
}