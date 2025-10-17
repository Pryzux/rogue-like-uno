import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GameLogic } from "../game/gamelogic";
import ColorPicker from "../UserInterface/ColorPicker";
import PlayerPicker from "~/UserInterface/PlayerPicker";
import Hand from "../UserInterface/Hand";
import type { Game } from "../game/types/Game";
import SingleCard from "../UserInterface/SingleCard";
import type Player from "../game/types/Player";
import type { Card, CardColor } from "../game/types/Card";
import { AIPlayerClean } from "~/UserInterface/AIPlayerClean";
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
    const [isLoaded, setIsLoaded] = useState(false);

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
            if (
                currentPlayer.isHuman &&
                GameLogic.get().hasModifier("Sluggish Hands") &&
                currentPlayer.turns % 3 === 0 &&
                currentPlayer.turns !== 0
            ) {
                GameLogic.get().setModifierAlert("Sluggish hands! +1 card every 3rd turn");
                drawCard(1);
            }
        }

        if (!currentPlayer.isHuman) {
            setTimeout(() => {
                GameLogic.get().playAITurn();
                setGameState(GameLogic.get().getGame());
                setMatchState(GameLogic.get().getCurrentUnoMatch());
            }, 1500);
        }
    }, [matchState?.currentPlayerIndex]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 400);
        return () => clearTimeout(timer);
    }, []);

    if (!matchState) {
        return <div className="p-6">No active match found.</div>;
    }

    const { players, discardPile, currentPlayerIndex, currentColor, turnDirection, status } =
        matchState;

    const topCard = discardPile.at(0);
    const drawDeckCard: Card = { id: "card-draw-deck", type: "deck", color: "black" };
    const developerMode = false;

    return (
        <motion.div
            className="relative min-h-screen w-full bg-gradient-to-b from-amber-50 via-orange-100 to-red-200 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Subtle animated card background */}
            <motion.img
                src="/unobg-cards-side.png"
                alt="UNO background"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                style={{ opacity: 0.12 }}
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.60 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            />

            {!isLoaded && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{
                        background: "linear-gradient(to bottom, rgb(254 243 199), rgb(254 215 170), rgb(254 202 202))"
                    }}
                >
                    <motion.div
                        className="w-12 h-12 border-4 rounded-full"
                        style={{
                            borderTopColor: "#f87171",
                            borderRightColor: "#facc15",
                            borderBottomColor: "#22c55e",
                            borderLeftColor: "#3b82f6",
                            borderStyle: "solid",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                </motion.div>
            )}

            {isLoaded && (
                <motion.div
                    className="relative z-10 mx-auto w-full max-w-[1100px] px-3 sm:px-6 lg:px-8 py-4 space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Header currentStatus={`Round ${gameState.matches.length}`} />

                    {/* Game */}
                    <motion.div
                        className="relative glass w-full rounded-2xl p-3 sm:p-5 flex flex-col items-center gap-4 overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {/* === UNO Board === */}
                        <div className="absolute inset-0 -z-10 rounded-2xl pointer-events-none overflow-hidden opacity-80">
                            {/* Felt-like dark table */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        "radial-gradient(120% 80% at 50% 50%, rgba(15,20,25,0.95) 0%, rgba(3,5,7,1) 80%)",
                                }}
                            />


                            {/* UNO color ring */}
                            <motion.svg
                                className="absolute inset-0 w-full h-full opacity-60"
                                viewBox="0 0 1200 800"
                                initial={{ rotate: -15, scale: 1 }}
                                animate={{ rotate: [-15, -18, -15], scale: [1, 1.02, 1] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <g transform="translate(600,400)">
                                    <path
                                        d="M-410 0A410 260 0 0 1 0 -260A370 230 0 0 0 -370 0Z"
                                        fill="#ef4444"
                                        opacity="0.9"
                                    />
                                    <path
                                        d="M0 -260A410 260 0 0 1 410 0A370 230 0 0 0 0 -230Z"
                                        fill="#facc15"
                                        opacity="0.9"
                                    />
                                    <path
                                        d="M410 0A410 260 0 0 1 0 260A370 230 0 0 0 370 0Z"
                                        fill="#22c55e"
                                        opacity="0.9"
                                    />
                                    <path
                                        d="M0 260A410 260 0 0 1 -410 0A370 230 0 0 0 0 230Z"
                                        fill="#3b82f6"
                                        opacity="0.9"
                                    />
                                    <ellipse rx="340" ry="210" fill="rgba(0,0,0,0.85)" />
                                </g>
                            </motion.svg>
                            {/* Vignette shadow */}
                            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_120px_80px_rgba(0,0,0,0.7)] pointer-events-none" />
                        </div>
                        {/* === End Board === */}

                        {/* AI Players Row */}
                        <div className="w-full flex items-center justify-center gap-6 sm:gap-12 lg:gap-20 pt-8 pb-4">
                            {players
                                .filter((player) => !player.isHuman)
                                .map((player) => {
                                    const playerIndex = GameLogic.get().getPlayerIndexFromPlayer(player);
                                    const isCurrentTurn = playerIndex === currentPlayerIndex;
                                    return (
                                        <AIPlayerClean
                                            key={player.id}
                                            player={player}
                                            isCurrentTurn={isCurrentTurn}
                                        />
                                    );
                                })}
                        </div>

                        <ModifierNotification
                            setNotification={setNotification}
                            gameState={gameState}
                            className="top-16 sm:top-20"
                        />

                        {/* draw/discard */}
                        <motion.div
                            className="flex items-center justify-center py-2 sm:py-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="origin-top scale-[0.78] sm:scale-90 md:scale-100">
                                <div
                                    className="glass-lite rounded-xl px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-center gap-4 sm:gap-8"
                                    style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                                >
                                    <div>
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
                                    <div>
                                        <SingleCard
                                            card={topCard!}
                                            isLarge={true}
                                            currentColor={currentColor}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Human hand */}
                        <div
                            className="w-5/8 glass-lite special-shadow rounded-xl px-2 sm:px-4 py-2 sm:py-3"
                            style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                        >
                            <div className="max-w-full">
                                {players
                                    .filter((player) => player.isHuman)
                                    .map((player, i) => (
                                        <div key={player.id} className="flex flex-col items-center">
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

                        {showColorPicker && (
                            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                                <div className="absolute inset-0 rounded-2xl bg-[rgba(67,31,11,0.20)] backdrop-blur-xs pointer-events-auto" />
                                <div className="relative z-10 px-4 pointer-events-auto">
                                    <ColorPicker
                                        cardId={pickerCardId}
                                        handleChoice={handleColorPickerChoice}
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {showPlayerPicker && (
                        <PlayerPicker
                            gameState={gameState}
                            cardId={pickerCardId}
                            handleChoice={handlePlayerPickerChoice}
                        />
                    )}

                    {/* Modifiers section */}
                    {gameState.modifiers.length > 0 && (
                        <div className="border border-white/20 rounded-xl drop-shadow-lg bg-white/40 p-3 sm:p-4">
                            <h3 className="archivo-black-regular text-3xl font-extrabold leading-none tracking-tight mb-4 ml-2">
                                <span className="bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
                                    Modifiers
                                </span>
                            </h3>
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
                    )}

                    {/* Dev buttons */}
                    <div className="flex gap-3">
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 opacity-60 hover:opacity-80"
                            onClick={() => setGameState(GameLogic.get().setWin())}
                        >
                            WIN
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 opacity-60 hover:opacity-80"
                            onClick={() => setGameState(GameLogic.get().setLoss())}
                        >
                            LOSE
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
