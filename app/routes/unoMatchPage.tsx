import { useState, useEffect } from "react";
import type { Game } from "../game/types/Game";
import { GameLogic } from "../game/gamelogic";
import SimpleCard from "../UserInterface/simpleCard";
import SingleCard from "../UserInterface/SingleCard"
import type Player from "../game/types/Player"; 
import type { Card, CardColor } from "../game/types/Card"
import ColorPicker from "~/UserInterface/ColorPicker";


interface GameProps {
    gameState: Game;
    setGameState: React.Dispatch<React.SetStateAction<Game>>;
}

export function UnoMatchPage({ gameState, setGameState }: GameProps) { 
    const [matchState, setMatchState] = useState(gameState.matches.at(-1))
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [colorPickerCardId, setColorPickerCardId] = useState('') 

    const drawCard = (cardNumber: number) => {

        const match = GameLogic.get().getCurrentUnoMatch();
        console.log("Drawing Card with currentPlayerIndex=", match.currentPlayerIndex)
        GameLogic.get().drawCards(cardNumber, match.currentPlayerIndex)

        // Re-render game and match state
        setGameState(GameLogic.get().getGame())
        setMatchState(GameLogic.get().getCurrentUnoMatch())

    }

    const handleColorPickerChoice = (cardId: string, color: CardColor) => {
        GameLogic.get().playCard(cardId, color)
        setGameState(GameLogic.get().getGame())
        setMatchState(GameLogic.get().getCurrentUnoMatch())
        setShowColorPicker(false)
    }

    const playCard = (card: Card) => {
        if (card.type.includes('wild')) {
            setColorPickerCardId(card.id)
            setShowColorPicker(true)
        } else {
            const success = GameLogic.get().playCard(card.id)
        if (success) {
            setGameState(GameLogic.get().getGame())
            setMatchState(GameLogic.get().getCurrentUnoMatch())
        }
    }
    }

    useEffect(() => {

        if (!matchState) return

        const currentPlayer = matchState.players[matchState.currentPlayerIndex]

        if (!currentPlayer) return

        if (!currentPlayer.isHuman) {

            // 'delay' the ai's turn
            setTimeout(() => {

                GameLogic.get().playAITurn();
                setGameState(GameLogic.get().getGame());
                setMatchState(GameLogic.get().getCurrentUnoMatch());

                const newMatch = GameLogic.get().getCurrentUnoMatch();
                const nextPlayer = newMatch.players[newMatch.currentPlayerIndex];

                if (!nextPlayer.isHuman) {
                    setMatchState({ ...newMatch });
                }

            }, 2000);

        }

    }, [matchState?.currentPlayerIndex])


    if (!matchState) {
        return <div className="p-6">No active match found.</div>;
    }

    const { players, discardPile, currentPlayerIndex, currentColor, turnDirection, status } =
        matchState;

    const topCard = discardPile.at(0);
    const drawDeckCard: Card = { id: "card-draw-deck", type: "deck", color: "black" };

    return (

        <div className="p-6 space-y-6">
            {/* HEADER BAR */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-3xl font-bold text-amber-800">Rogue-Like Uno</h1>

                <div className="text-sm text-amber-700">
                    <p>
                        Match Status: <span className="font-medium">{status}</span>
                    </p>
                    <p>
                        Current Color:{" "}
                        <span
                            className={`font-semibold capitalize`}
                            style={{ color: currentColor === "yellow" ? "#ca8a04" : currentColor }}
                        >
                            {currentColor}
                        </span>
                    </p>
                    <p>Turn Direction: {turnDirection === 1 ? "Clockwise" : "Counter-Clockwise"}</p>
                </div>
            </header>

            {/* DRAW + DISCARD */}
            <section className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                {showColorPicker ? <ColorPicker cardId={colorPickerCardId} handleChoice={handleColorPickerChoice}/> : null}
                <div>
                    <h2 className="font-bold text-lg">Draw deck</h2>
                    <div className="w-24 h-36 flex items-center justify-center">
                        <SimpleCard card={drawDeckCard} onClick={() => drawCard(1)} />
                    </div>
                </div>

                <h2 className="font-bold text-lg mb-3 text-amber-900">Top of Discard Pile</h2>
                <div className="w-24 h-36 flex items-center justify-center">
                    <SimpleCard card={topCard!} />
                </div>
            </section>

            {/* PLAYERS */}
            <section>
                <h2 className="font-bold text-lg text-amber-900 mb-4">Players</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {players.map((player, i) => (
                        <div
                            key={player.id}
                            className={`p-4 rounded-lg border shadow-sm ${i === currentPlayerIndex ? "border-amber-500 bg-amber-50" : "border-gray-300 bg-white"
                                }`}
                        >
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
                                {player.hand.map((card) => (
                                    <SimpleCard
                                        key={card.id}
                                        card={card}
                                        onClick={() => {
                                            if (player.isHuman && i === currentPlayerIndex) playCard(card);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <button className="border" onClick={() => {

                setGameState(GameLogic.get().setWin())

            }}>WIN</button>
        </div>

    )

}





