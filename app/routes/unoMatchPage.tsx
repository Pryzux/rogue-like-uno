import { useState } from "react";
import type { Game } from "../game/types/Game";
import { GameLogic } from "../game/gamelogic";
import SimpleCard from "../UserInterface/simpleCard";
import SingleCard from "../UserInterface/SingleCard"
import type Player from "../game/types/Player";
import type { Card } from "../game/types/Card"


export default function UnoMatch() {

    const [gameState, setGameState] = useState<Game>(() => GameLogic.get().getGame());
    const [matchState, setMatchState] = useState(gameState.matches.at(-1))


    const drawCard = (cardNumber: number) => {
        console.log("Drawing Card with currentplayerindex=", matchState?.currentPlayerIndex!);
        GameLogic.get().drawCards(cardNumber, matchState?.currentPlayerIndex!);
        //re-render gameState and matchState
        setGameState(GameLogic.get().getGame())
        setMatchState(GameLogic.get().getCurrentUnoMatch())
    };

    if (!matchState) {
        return <div className="p-6">No active match found.</div>;
    }

    // Extract match data
    const { players, discardPile, currentPlayerIndex, currentColor, turnDirection, status } =
        matchState;

    const topCard = discardPile.at(-1);

    const drawDeckCard: Card = { id: `card-draw-deck`, type: "deck", color: 'black' }
    console.log('game state rerender', gameState)

    return (

        <div className="p-6 space-y-6">

            {/* Header Bar (Match Status, Current Color, Turn Direction, Title) */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-3xl font-bold text-amber-800">Rogue-Like Uno</h1>

                <div className="text-sm text-amber-700">
                    <p>
                        Match Status: <span className="font-medium">{status}</span>
                    </p>
                    <p>
                        Current Color:{" "}
                        <span className={`font-semibold capitalize text-${currentColor}-600`}>
                            {currentColor}
                        </span>
                    </p>
                    <p>Turn Direction: {turnDirection === 1 ? "Clockwise" : "Counter-Clockwise"}</p>
                </div>
            </header>

            <section className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                <div>
                    <h2 className='font-bold text-lg'>Draw deck</h2>
                    <div className="w-24 h-36 flex items-center justify-center"> aaa<SingleCard card={drawDeckCard} onClick={() => drawCard(1)} /> </div>
                </div>
                <h2 className="font-bold text-lg mb-3 text-amber-900">Top of Discard Pile</h2>

                <div className="w-24 h-36 flex items-center justify-center"> <SimpleCard card={topCard!} /> </div>

            </section>

            {/* Players and Hands */}
            <section>
                <h2 className="font-bold text-lg text-amber-900 mb-4">Players</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {players.map((player, i) => (
                        <div
                            key={player.id}
                            className={`p-4 rounded-lg border shadow-sm ${i === currentPlayerIndex}`}>

                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-amber-900">{player.name}</h3>
                                {i === currentPlayerIndex && (
                                    <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded">
                                        Current Turn
                                    </span>
                                )}
                            </div>

                            {/* Render player's hand */}
                            <div className="flex flex-wrap gap-1">

                                {player.hand.map((card) => (<SimpleCard key={card.id} card={card} />))}

                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}





