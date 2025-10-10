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
import Header from "~/UserInterface/Header";
import { ModifierCard } from "~/UserInterface/modifierCard";
import { ModifierNotification } from "~/UserInterface/ModifierNotification";


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
        GameLogic.get().playCard(cardId, { color: color })
        setGameState(GameLogic.get().getGame())
        setMatchState(GameLogic.get().getCurrentUnoMatch())
        setShowColorPicker(false)
    }

    const handlePlayerPickerChoice = (cardId: string, targetPlayer: Player) => {
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

        if (currentPlayer.isHuman) {
            if (currentPlayer.isHuman && GameLogic.get().hasModifier("Sluggish Hands") && (currentPlayer.turns % 3 === 0)) {
                console.log('Sluggish Hands Activated')
                drawCard(1)
            }
        }

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
    const developerMode = false

    return (
        <div className="p-6 space-y-6 " style={{
            background: "var(--gradient-1)",
            minHeight: "100vh",
        }}>
            <Header currentStatus={status} />


            {/* new game board */}
            <div className='glass flex flex-col items-center rounded-lg p-2'>

                {/* Top row with AI players */}
                {/* Holds the AI player icons */}
                <div className='flex-none flex gap-30 p-1 items-center justify-center'>
                    {/* Holds individual AI player icon */}
                    {players.filter(player => !player.isHuman).map((player, i) => (
                        <div
                            key={player.id}
                            className={`p-4 flex-lg flex flex-col items-center justify-center}`}
                        >
                            <span
                                className={`text-xs bg-amber-500 text-white p-1 m-1 rounded ${GameLogic.get().getPlayerIndexFromPlayer(player) === currentPlayerIndex
                                    ? "visible"
                                    : "invisible"
                                    }`}
                            >
                                Current Turn
                            </span>
                            <AIPlayer player={player} />

                            {/* DEVELOPER MODE TO SHOW ALL AI HANDS */}
                            {developerMode ? <Hand hand={player.hand} isHuman={player.isHuman} playerIndex={i} playCardFn={playCard} /> : null}
                        </div>
                    ))}

                </div>
                <p className="text-4xl">{turnDirection === 1 ? "⏩" : "⏪"}</p>
                {/* Middle row with draw deck and discard */}
                <div className='flex flex-none items-center justify-center p-4'>
                    <div className='flex items-center justify-center glass-lite'>
                        {/* DRAW DECK */}
                        <div className="m-4">
                            <div className="flex items-center justify-center">
                                <SingleCard
                                    card={drawDeckCard}
                                    onClick={() => {
                                        const currentPlayer = matchState.players[matchState.currentPlayerIndex];
                                        if (!currentPlayer.isHuman) {
                                            console.log("Can't draw")
                                            return; // Disable during AI turn
                                        }
                                        drawCard(1)
                                    }}
                                    isLarge={true}
                                />
                            </div>
                        </div>
                        {/* DISCARD PILE */}
                        <div className="m-4">
                            <div className="flex flex-col items-center justify-center">
                                <SingleCard card={topCard!} isLarge={true} currentColor={currentColor} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bottom row with the user's hand */}
                <div className='flex-none pr-4 pl-4 pt-2 pb-4 glass-lite special-shadow'>

                    {players.filter(player => player.isHuman).map((player, i) => (
                        <div id={player.id} className="flex flex-col items-center">
                            <span
                                className={`text-xs bg-amber-500 text-white p-0.5 m-0.5 rounded ${GameLogic.get().getPlayerIndexFromPlayer(player) === currentPlayerIndex
                                    ? "visible"
                                    : "invisible"
                                    }`}
                            >Your turn!</span>
                            <Hand hand={player.hand} isHuman={player.isHuman} playerIndex={i} playCardFn={playCard} />
                        </div>
                    ))}

                </div>
            </div>
            {showColorPicker ? <ColorPicker cardId={pickerCardId} handleChoice={handleColorPickerChoice} /> : null}
            {showPlayerPicker ? <PlayerPicker gameState={gameState} cardId={pickerCardId} handleChoice={handlePlayerPickerChoice} /> : null}
            
            {/* CURRENT MODIFIERS */}
            <div className='flex flex-col glass p-2 '>
                <h3 className='archivo-black-regular'>Active Modifiers</h3>
                <div className='flex gap-5 '>
                    <div className="flex flex-col space-y-2 archivo-normal">
                        {gameState.modifiers.filter(mod => mod.modifierType === 'buff').map(mod => (
                            <ModifierCard mod={mod} selected={false} onToggle={() => null}/>
                        ))}
                    </div>
                    <div className="flex flex-col space-y-2 archivo-normal">
                        {gameState.modifiers.filter(mod => mod.modifierType === 'debuff').map(mod => (
                            <ModifierCard mod={mod} selected={false} onToggle={() => null}/>
                        ))}
                    </div>
                </div>
            </div>

            <button className="border blue-button text-white p-4" onClick={() => {
                setGameState(GameLogic.get().setWin())
            }}>
                WIN
            </button>
            <button className="border blue-button text-white p-4" onClick={() => {
                setGameState(GameLogic.get().setLoss())
            }}>
                LOSE
            </button>
            <ModifierNotification gameState={gameState} setGameState={setGameState} />;
        </div>
    )
}





