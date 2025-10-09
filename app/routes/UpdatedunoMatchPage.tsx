import { useEffect, useState } from "react";
import PlayerPicker from "~/UserInterface/PlayerPicker";
import { GameLogic } from "../game/gamelogic";
import type { Card, CardColor } from "../game/types/Card";
import type { Game } from "../game/types/Game";
import type Player from "../game/types/Player";
import ColorPicker from "../UserInterface/ColorPicker";
import SimpleCard from "../UserInterface/deprecatedsimpleCard";
import Hand from "../UserInterface/Hand";
import SingleCard from "~/UserInterface/SingleCard";



interface GameProps {
    gameState: Game;
    setGameState: React.Dispatch<React.SetStateAction<Game>>;
}

export function UpdatedunoMatchPage({ gameState, setGameState }: GameProps) {
    const [matchState, setMatchState] = useState(gameState.matches.at(-1))
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [pickerCardId, setPickerCardId] = useState('')
    const [showPlayerPicker, setShowPlayerPicker] = useState(false)

    const drawCard = (cardNumber: number) => {

        const match = GameLogic.get().getCurrentUnoMatch();
        GameLogic.get().drawCards(cardNumber, match.currentPlayerIndex)

        // Re-render game and match state
        setGameState(GameLogic.get().getGame())
        setMatchState(GameLogic.get().getCurrentUnoMatch())
    }

    const handleColorPickerChoice = (cardId: string, color: CardColor) => {
        GameLogic.get().playCard(cardId, { color: color })
        setGameState(GameLogic.get().getGame())
        setMatchState(GameLogic.get().getCurrentUnoMatch())
        setShowColorPicker(false)
    }

    const handlePlayerPickerChoice = (cardId: string, targetPlayer: Player) => {
        console.log('handle player pickerf choice called')
        GameLogic.get().playCard(cardId, { targetPlayer: targetPlayer })
        setGameState(GameLogic.get().getGame())
        setMatchState(GameLogic.get().getCurrentUnoMatch())
        setShowPlayerPicker(false)
    }

    const playCard = (card: Card) => {
        // Handle Good Aim buff
        if (
            card.type === 'draw2' &&
            gameState.modifiers.find(m => m.name === 'Good Aim')
        ) {
            setPickerCardId(card.id)
            setShowPlayerPicker(true)
        }
        // Handle wild card color picker
        else if (card.type.includes('wild')) {
            setPickerCardId(card.id)
            setShowColorPicker(true)
        } else {
            const success = GameLogic.get().playCard(card.id)
            if (success) {
                setGameState(GameLogic.get().getGame())
                setMatchState(GameLogic.get().getCurrentUnoMatch())
            }
        }
    }

    const modifiers = GameLogic.get().getCurrentModifiers()

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
    //deck calls 
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
                {showColorPicker ? <ColorPicker cardId={pickerCardId} handleChoice={handleColorPickerChoice} /> : null}
                {showPlayerPicker ? <PlayerPicker gameState={gameState} cardId={pickerCardId} handleChoice={handlePlayerPickerChoice} /> : null}
                <div>
                    <h2 className="font-bold text-lg">Draw deck</h2>
                    <div className="w-24 h-36 flex items-center justify-center">
                        <SingleCard
                            card={drawDeckCard}
                            onClick={() => {
                                const currentPlayer = matchState.players[matchState.currentPlayerIndex];
                                if (!currentPlayer.isHuman) {
                                    console.log("Can't draw")
                                    return; // Disable during AI turn
                                }

                                drawCard(1);
                            }}
                        />

                    </div>
                </div>

                <h2 className="font-bold text-lg mb-3 text-amber-900">Top of Discard Pile</h2>
                <div className="w-24 h-36 flex items-center justify-center">
                    <SingleCard card={topCard!} />
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
                            {/* Replaced with Hand.tsx, and it currently works but the cards look kinda shitty- replace with HandV0 if you need to test with organized cards */}
                            {/* <HandV0 hand={player.hand} isHuman={player.isHuman} playerIndex={i} playCardFn={playCard} /> */}
                            <Hand hand={player.hand} isHuman={player.isHuman} playerIndex={i} playCardFn={playCard} />
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