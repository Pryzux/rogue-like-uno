import type { Game } from "../game/types/Game";

interface GameProps {
    gameState: Game;
    setGameState: React.Dispatch<React.SetStateAction<Game>>;
}


export default function NextRound({ gameState, setGameState }: GameProps) {



    return (

        <div>Next Round Page</div>
    )
}

