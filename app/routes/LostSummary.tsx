import { useEffect, useState } from "react";
import { GameLogic } from "../game/gamelogic";
import ColorPicker from "../UserInterface/ColorPicker";
import PlayerPicker from "~/UserInterface/PlayerPicker";
import Hand from "../UserInterface/Hand";
import type { Game } from "../game/types/Game";
import SingleCard from "../UserInterface/SingleCard"
import type Player from "../game/types/Player";
import type { Card, CardColor } from "../game/types/Card"
import { AIPlayer } from "~/UserInterface/AIPlayer";



interface GameProps {
    gameState: Game;
    setGameState: React.Dispatch<React.SetStateAction<Game>>;
}

export function LostSummary({ gameState, setGameState }: GameProps) {





    return (<div>unfinished</div>)


}