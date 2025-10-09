import { useState, useEffect } from "react";
import type { Game } from "../game/types/Game";
import type { Modifier } from "../game/types/Modifier";
import { GameLogic } from "~/game/gamelogic";

interface GameProps {
    gameState: Game;
    setGameState: React.Dispatch<React.SetStateAction<Game>>;
}

export default function NextRound({ gameState, setGameState }: GameProps) {

    // Pull the random round modifiers from GameLogic
    const [options] = useState(() => GameLogic.get().getNextRoundOptions());

    // Handle selecting a modifier (buff or debuff)
    const handleSelectModifier = (modifier: Modifier) => {
        GameLogic.get().addModifier(modifier);
        setGameState(GameLogic.get().getGame());
    };

    const handleStartNewGame = () => {
        console.log("Starting New Game..");
        const success = GameLogic.get().startGameAfterModifierSelection()
        setGameState(GameLogic.get().getGame())
    };

    // Refresh current modifiers when component mounts
    useEffect(() => { setGameState(GameLogic.get().getGame()) }, []);

    return (
        <div className="grid grid-cols-3 gap-6 p-6 bg-amber-50 min-h-screen text-amber-900">
            {/* --- Current Modifiers (Left Column) --- */}
            <div className="col-span-1 flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4 text-amber-700">Current Modifiers</h2>
                <div className="w-full max-w-sm border-2 border-amber-300 rounded-xl bg-white p-4 shadow-sm">

                    {gameState.modifiers?.length ? (
                        <ul className="space-y-2">
                            {gameState.modifiers.map((mod: Modifier, i: number) => (
                                <li
                                    key={i}
                                    className={`border p-3 rounded-lg ${mod.modifierType === "buff"
                                        ? "border-green-500 bg-green-100"
                                        : "border-red-500 bg-red-100"
                                        }`}
                                >
                                    <p className="font-semibold">{mod.name}</p>
                                    <p className="text-sm text-amber-700">{mod.description}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="italic text-amber-700 text-center">No modifiers yet</p>
                    )}

                </div>
            </div>

            {/* --- Buffs and Debuffs (Right Column) --- */}
            <div className="col-span-2 flex flex-col items-center space-y-6">
                <h2 className="text-xl font-bold text-amber-700">
                    {gameState.nextRoundStatus}
                </h2>

                <div className="grid grid-cols-2 gap-6 w-full">
                    {/* --- Buffs --- */}
                    <div className="border-2 border-green-500 bg-green-50 rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-green-700 mb-3 text-center">Buffs</h3>
                        <div className="space-y-4">
                            {options.buffs?.length ? (
                                options.buffs.map((mod, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleSelectModifier(mod)}
                                        className="cursor-pointer border border-green-400 bg-white hover:bg-green-100 rounded-lg p-3 transition"
                                    >
                                        <p className="font-semibold">{mod.name}</p>
                                        <p className="text-sm text-amber-700">{mod.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm italic text-center text-green-700">
                                    Loading buffs...
                                </p>
                            )}
                        </div>
                    </div>

                    {/* --- Debuffs --- */}
                    <div className="border-2 border-red-500 bg-red-50 rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-semibold text-red-700 mb-3 text-center">Debuffs</h3>
                        <div className="space-y-4">
                            {options.debuffs?.length ? (
                                options.debuffs.map((mod, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleSelectModifier(mod)}
                                        className="cursor-pointer border border-red-400 bg-white hover:bg-red-100 rounded-lg p-3 transition"
                                    >
                                        <p className="font-semibold">{mod.name}</p>
                                        <p className="text-sm text-amber-700">{mod.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm italic text-center text-red-700">
                                    Loading debuffs...
                                </p>
                            )}
                        </div>

                    </div>
                    <button
                        // Clicking will add a new match to the gameState
                        onClick={handleStartNewGame} className="px-4 py-2 bg-amber-200 border border-amber-300 rounded hover:bg-amber-300">
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );
}



