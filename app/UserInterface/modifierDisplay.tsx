import { useState, useEffect } from "react";
import type { Game } from "../game/types/Game";
import type { Modifier } from "../game/types/Modifier";
import { GameLogic } from "~/game/gamelogic";

interface GameProps {
    gameState: Game;
    setGameState: React.Dispatch<React.SetStateAction<Game>>;
}

export default function ModifierDisplay({ gameState, setGameState }: GameProps) {



    return (<div></div>)

}
