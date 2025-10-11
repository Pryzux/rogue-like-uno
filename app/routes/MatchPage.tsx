import { useEffect, useState } from "react";
import { GameLogic } from "../game/gamelogic";
import ColorPicker from "../UserInterface/ColorPicker";
import PlayerPicker from "~/UserInterface/PlayerPicker";
import Hand from "../UserInterface/Hand";
import type { Game } from "../game/types/Game";
import SingleCard from "../UserInterface/SingleCard";
import type Player from "../game/types/Player";
import type { Card, CardColor } from "../game/types/Card";
import { AIPlayer } from "~/UserInterface/AIPlayer";
import Header from "~/UserInterface/Header";
import { ModifierCard } from "~/UserInterface/modifierCard";
import { ModifierNotification } from "~/UserInterface/ModifierNotification";
import type { AlertNotification } from "~/game/types/Alert";
import { RefreshCcw } from "lucide-react";

interface GameProps {
    gameState: Game;
    setGameState: React.Dispatch<React.SetStateAction<Game>>;
}

export function MatchPage({ gameState, setGameState }: GameProps) {
    const [matchState, setMatchState] = useState(gameState.matches.at(-1));
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [pickerCardId, setPickerCardId] = useState("");
    const [showPlayerPicker, setShowPlayerPicker] = useState(false);

    const [notification, setNotification] = useState<AlertNotification[]>([]);

    const drawCard = (cardNumber: number) => {
        const match = GameLogic.get().getCurrentUnoMatch();
        GameLogic.get().drawCards(cardNumber, match.currentPlayerIndex);

        setGameState(GameLogic.get().getGame());
        setMatchState(GameLogic.get().getCurrentUnoMatch());
    };

    const handleColorPickerChoice = (cardId: string, color: CardColor) => {
        GameLogic.get().playCard(cardId, { color });
        setGameState(GameLogic.get().getGame());
        setMatchState(GameLogic.get().getCurrentUnoMatch());
        setShowColorPicker(false);
    };

    const handlePlayerPickerChoice = (cardId: string, targetPlayer: Player) => {
        GameLogic.get().playCard(cardId, { targetPlayer });
        setGameState(GameLogic.get().getGame());
        setMatchState(GameLogic.get().getCurrentUnoMatch());
        setShowPlayerPicker(false);
    };

    const playCard = (card: Card) => {
        if (card.type === "draw2" && gameState.modifiers.find((m) => m.name === "Good Aim")) {
            setPickerCardId(card.id);
            setShowPlayerPicker(true);
        } else if (card.type.includes("wild")) {
            setPickerCardId(card.id);
            setShowColorPicker(true);
        } else {
            const success = GameLogic.get().playCard(card.id);
            if (success) {
                setGameState(GameLogic.get().getGame());
                setMatchState(GameLogic.get().getCurrentUnoMatch());
            }
        }
    };

    useEffect(() => {
        if (!matchState) return;

        const currentPlayer = matchState.players[matchState.currentPlayerIndex];
        if (!currentPlayer) return;

        if (currentPlayer.isHuman) {
            if (currentPlayer.isHuman && GameLogic.get().hasModifier("Sluggish Hands") && (currentPlayer.turns % 3 === 0) && (currentPlayer.turns !== 0)) {
                console.log('Sluggish Hands Activated')
                GameLogic.get().setModifierAlert('Sluggish hands! +1 card every 3rd turn')
                drawCard(1)
            }
        }

        if (!currentPlayer.isHuman) {
            setTimeout(() => {
                GameLogic.get().playAITurn();
                setGameState(GameLogic.get().getGame());
                setMatchState(GameLogic.get().getCurrentUnoMatch());

                const newMatch = GameLogic.get().getCurrentUnoMatch();
                const nextPlayer = newMatch.players[newMatch.currentPlayerIndex];

                if (!nextPlayer.isHuman) {
                    setMatchState({ ...newMatch });
                }

            }, 1500);

        }
    }, [matchState?.currentPlayerIndex]);

    if (!matchState) {
        return <div className="p-6">No active match found.</div>;
    }

    const { players, discardPile, currentPlayerIndex, currentColor, turnDirection, status } =
        matchState;

    const topCard = discardPile.at(0);
    const drawDeckCard: Card = { id: "card-draw-deck", type: "deck", color: "black" };

    const developerMode = false;

    return (
        <div
            className="relative min-h-screen w-full bg-gradient-to-br from-blue-300 via-red-100 to-red-400 overflow-hidden"
        >
            {/* Background UNO cards image */}
            <img
                src="/unobg-cards-side.png"
                alt="UNO background"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                style={{
                    opacity: 0.1,
                    transform: "",
                }}
            />

            {/* Page container with width cap + gutters */}
            <div className="relative z-10 mx-auto w-full max-w-[1100px] px-3 sm:px-6 lg:px-8 py-4 space-y-6">
                <Header currentStatus={status} />

                {/* Game board */}
                <div className="relative glass w-full rounded-2xl p-3 sm:p-5 flex flex-col items-center gap-4 overflow-hidden">
                    {/* Grass background fixed to board */}
                    <img
                        src="/perfect-green-grass.jpg"
                        alt="Grass texture background"
                        className="absolute inset-0 w-full h-full object-cover object-center -z-10 rounded-2xl opacity-40 pointer-events-none"
                        style={{
                            filter: "brightness(0.95) contrast(1.1) saturate(1.1)",
                            transform: "scale(1.05)",
                        }}
                    />

                    {/* AI row: grid on mobile, flex on larger screens */}
                    <div className="sm:-ml-[45px]">
                        <div className="w-full grid grid-cols-3 place-items-center gap-3 sm:flex sm:items-center sm:justify-center sm:gap-16">
                            {players
                                .filter((player) => !player.isHuman)
                                .map((player, index, arr) => {
                                    // Determine gentle offset per position
                                    const isLeft = index === 0;
                                    const isRight = index === arr.length - 1;

                                    return (
                                        <div
                                            key={player.id}
                                            className={`
              flex flex-col items-center justify-center 
              transition-transform duration-500 ease-out
              ${isLeft ? "-translate-x-[24px]" : ""}
              ${isRight ? "translate-x-[24px]" : ""}
            `}
                                        >
                                            <AIPlayer player={player} />
                                            <div
                                                className={`mt-3 text-xs bg-amber-500 text-white px-2 py-1 rounded ${GameLogic.get().getPlayerIndexFromPlayer(player) === currentPlayerIndex
                                                    ? "visible"
                                                    : "invisible"
                                                    }`}
                                            >
                                                Current Turn
                                            </div>

                                            {developerMode ? (
                                                <Hand
                                                    hand={player.hand}
                                                    isHuman={player.isHuman}
                                                    playerIndex={0}
                                                    playCardFn={playCard}
                                                />
                                            ) : null}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>


                    {/* Direction indicator */}
                    {/* <p className="text-3xl sm:text-4xl">{turnDirection === 1 ? "⏩" : "⏪"}</p> */}
                    <div
                        className={`
                            flex items-center justify-center w-14 h-14 rounded-full
                            bg-gradient-to-br from-blue-400 via-yellow-200 to-red-400
                            shadow-md transition-transform duration-500 ease-in-out opacity-75
                            ${turnDirection === 1 ? "rotate-180" : "rotate-0"}
                        `}
                    >
                        <RefreshCcw className="text-white" size={30} strokeWidth={2.5} />
                    </div>

                    {/* Draw/Discard cluster */}
                    <div className="flex items-center justify-center py-2 sm:py-4">
                        <div className="origin-top scale-[0.78] sm:scale-90 md:scale-100">
                            <div className="glass-lite rounded-xl px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-center gap-4 sm:gap-8">
                                {/* DRAW DECK */}
                                <div>
                                    <div className="flex items-center justify-center">
                                        <SingleCard
                                            card={drawDeckCard}
                                            onClick={() => {
                                                const currentPlayer =
                                                    matchState.players[matchState.currentPlayerIndex];
                                                if (!currentPlayer.isHuman) return;
                                                drawCard(1);
                                            }}
                                            isLarge={true}
                                        />
                                    </div>
                                </div>

                                {/* DISCARD PILE */}
                                <div>
                                    <div className="flex flex-col items-center justify-center">
                                        <SingleCard
                                            card={topCard!}
                                            isLarge={true}
                                            currentColor={currentColor}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Human hand */}
                    <div className="w-5/8 glass-lite special-shadow rounded-xl px-2 sm:px-4 py-2 sm:py-3">
                        <div className="max-w-full overflow-x-auto">
                            {players
                                .filter((player) => player.isHuman)
                                .map((player, i) => (
                                    <div
                                        key={player.id}
                                        id={player.id}
                                        className="flex flex-col items-center"
                                    >
                                        <span
                                            className={`text-xs bg-amber-500 text-white px-2 py-0.5 rounded ${GameLogic.get().getPlayerIndexFromPlayer(player) ===
                                                currentPlayerIndex
                                                ? "visible"
                                                : "invisible"
                                                }`}
                                        >
                                            Your turn!
                                        </span>
                                        <Hand
                                            hand={player.hand}
                                            isHuman={player.isHuman}
                                            playerIndex={i}
                                            playCardFn={playCard}
                                        />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Pickers */}
                {showColorPicker && (
                    <ColorPicker
                        cardId={pickerCardId}
                        handleChoice={handleColorPickerChoice}
                    />
                )}
                {showPlayerPicker && (
                    <PlayerPicker
                        gameState={gameState}
                        cardId={pickerCardId}
                        handleChoice={handlePlayerPickerChoice}
                    />
                )}

                {/* Active Modifiers */}
                <div className="glass-lite rounded-2xl p-3 sm:p-4">
                    <h3 className="archivo-black-regular">Active Modifiers</h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                        <div className="flex flex-col space-y-2 archivo-normal">
                            {gameState.modifiers
                                .filter((mod) => mod.modifierType === "buff")
                                .map((mod) => (
                                    <ModifierCard
                                        key={mod.name}
                                        mod={mod}
                                        selected={false}
                                        onToggle={() => null}
                                    />
                                ))}
                        </div>
                        <div className="flex flex-col space-y-2 archivo-normal">
                            {gameState.modifiers
                                .filter((mod) => mod.modifierType === "debuff")
                                .map((mod) => (
                                    <ModifierCard
                                        key={mod.name}
                                        mod={mod}
                                        selected={false}
                                        onToggle={() => null}
                                    />
                                ))}
                        </div>
                    </div>
                </div>

                {/* Dev buttons */}
                <div className="flex gap-2">
                    <button
                        className="border blue-button text-white px-4 py-2 rounded opacity-30"
                        onClick={() => setGameState(GameLogic.get().setWin())}
                    >
                        WIN
                    </button>
                    <button
                        className="border blue-button text-white px-4 py-2 rounded opacity-30"
                        onClick={() => setGameState(GameLogic.get().setLoss())}
                    >
                        LOSE
                    </button>
                </div>

                <ModifierNotification
                    setNotification={setNotification}
                    gameState={gameState}
                />
            </div>
        </div>
    );

}






