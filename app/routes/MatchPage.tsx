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

export function MatchPage({ gameState, setGameState }: GameProps) {
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
        GameLogic.get().playCard(cardId, {color: color})
        setGameState(GameLogic.get().getGame())
        setMatchState(GameLogic.get().getCurrentUnoMatch())
        setShowColorPicker(false)
    }

    const handlePlayerPickerChoice = (cardId: string, targetPlayer: Player) => {
        console.log('handle player pickerf choice called')
        GameLogic.get().playCard(cardId, {targetPlayer: targetPlayer})
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
    const drawDeckCard: Card = { id: "card-draw-deck", type: "deck", color: "black" };

    // this is the flag to show all AI hands!!!!!!!
    const developerMode = true

    return (

        <div className="p-6 space-y-6">
            {/* HEADER BAR */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-3xl font-bold text-amber-800">Rogue-Like Uno NEW</h1>

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

            {/* new game board */}
            <div className='flex flex-col bg-amber-100 border-lime-400 rounded-lg p-4'>
                {showColorPicker ? <ColorPicker cardId={pickerCardId} handleChoice={handleColorPickerChoice} /> : null}
                {showPlayerPicker ? <PlayerPicker gameState={gameState} cardId={pickerCardId} handleChoice={handlePlayerPickerChoice} /> : null}
                {/* Top row with AI players */}
                <div className='flex-none p-4 items-center'>
                    <h2 className="font-bold text-lg text-amber-900 mb-4">Opponents</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 content-center">
                        {players.filter(player => !player.isHuman).map((player, i) => (
                            <div
                                key={player.id}
                                className={`p-4 rounded-lg border shadow-sm ${GameLogic.get().getPlayerIndexFromPlayer(player) === currentPlayerIndex ? "border-amber-500 bg-amber-50" : "border-gray-300 bg-white"
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-amber-900">{player.name}</h3>
                                    {GameLogic.get().getPlayerIndexFromPlayer(player) === currentPlayerIndex && (
                                        <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded">
                                            Current Turn
                                        </span>
                                    )}
                                </div>
                                <AIPlayer player={player} />
                                {/* DEVELOPER MODE TO SHOW ALL AI HANDS */}
                                {developerMode ? <Hand hand={player.hand} isHuman={player.isHuman} playerIndex={i} playCardFn={playCard} /> : null}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle row with draw deck and discard */}
                <div className='flex flex-none items-center justify-center p-4'>
                    <div className="m-4">
                        <h2 className="font-bold text-lg mb-3 text-amber-900">Draw deck</h2>
                        <div className="flex items-center justify-center">
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
                    <div className="m-4">
                        <h2 className="font-bold text-lg mb-3 text-amber-900">Top of Discard Pile</h2>
                        <div className="flex items-center justify-center">
                            <SingleCard card={topCard!} />
                        </div>
                    </div>
                </div>

                {/* Bottom row with the user's hand */}
                <div className='flex-none p-4'>
                    
                    {players.filter(player => player.isHuman).map((player, i) => (
                        <div>
                            {GameLogic.get().getPlayerIndexFromPlayer(player) === currentPlayerIndex && (
                            <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded">
                                Current Turn
                            </span>
                        )}
                        <Hand hand={player.hand} isHuman={player.isHuman} playerIndex={i} playCardFn={playCard} />
                        </div>
                    ))}
                    
                </div>
            </div>
            <button className="border" onClick={() => {
                setGameState(GameLogic.get().setWin())
            }}>
                WIN
            </button>
        </div>
    )
}





