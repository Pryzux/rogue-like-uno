import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // 👈 added
import type { Game } from "../game/types/Game";
import type { Modifier } from "../game/types/Modifier";
import type RoundOptions from "~/game/types/RoundOptions";
import { GameLogic } from "~/game/gamelogic";
import { Undo2, Hand } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { ModifierCard } from "~/UserInterface/modifierCard";
import { Section } from "~/UserInterface/NextRoundSections";
import Header from "~/UserInterface/Header";

interface GameProps {
    gameState: Game;
    setGameState: React.Dispatch<React.SetStateAction<Game>>;
}

export default function NextRound({ gameState, setGameState }: GameProps) {
    const [options] = useState<RoundOptions>(() => GameLogic.get().getNextRoundOptions());
    const [newMods, setNewMods] = useState<Modifier[]>([]);

    const handleSelectModifier = (modifier: Modifier) => {
        GameLogic.get().addModifier(modifier);
        setGameState(GameLogic.get().getGame());
        setNewMods((prev) => [modifier, ...prev]);
    };

    const handleDeselectModifier = (modifier: Modifier) => {
        GameLogic.get().removeModifier(modifier);
        setGameState(GameLogic.get().getGame());
        setNewMods((prev) => prev.filter((m) => m.name !== modifier.name));
    };

    const toggleModifier = (modifier: Modifier) => {
        const alreadySelected = newMods.find((m) => m.name === modifier.name);
        alreadySelected ? handleDeselectModifier(modifier) : handleSelectModifier(modifier);
    };

    const handleStartNewGame = () => {
        GameLogic.get().startGameAfterModifierSelection();
        setGameState(GameLogic.get().getGame());
    };

    useEffect(() => {
        setGameState(GameLogic.get().getGame());
    }, [setGameState]);

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

            {/* main box */}
            <motion.div
                className="relative z-10 mx-auto w-full max-w-[1100px] px-3 sm:px-6 lg:px-8 py-4 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Header with Next Round title */}
                <div className="mb-2 flex items-center gap-2 sm:gap-4 archivo-black-regular">
                    <div className="inline-flex items-center gap-1 sm:gap-3 border border-white/20 rounded-xl drop-shadow-lg bg-white/40 px-3 sm:px-5 py-2 sm:py-3">
                        <h1 className="text-2xl sm:text-4xl font-extrabold leading-none tracking-tight">
                            <span className="text-neutral-900"> </span>
                            <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
                                Rogue-Like UNO
                            </span>
                        </h1>
                        <span className="ml-1 sm:ml-2 rounded-full bg-neutral-900/90 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white">
                            v0.2
                        </span>
                    </div>
                    <div className='ml-auto inline-flex'>
                        <span className="border border-white/20 rounded-xl drop-shadow-lg bg-white/40 px-2 sm:px-3 py-2 sm:py-3 text-xl sm:text-3xl font-extrabold leading-none tracking-tight whitespace-nowrap">
                            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">Next Round</span>
                        </span>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 w-full">
                    {/* Current Modifiers */}
                    <Section title="Current Modifiers" tone="neutral">
                        {gameState.modifiers?.length ? (
                            <ul className="space-y-2">
                                {gameState.modifiers.map((mod) => (
                                    <li key={mod.name} className="border border-white/20 rounded-xl bg-white/40 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-medium text-neutral-900">{mod.name}</p>
                                                <p className="text-xs text-neutral-700">
                                                    {mod.description}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center gap-2 py-6 text-neutral-600">
                                <Hand className="h-4 w-4" />
                                <p className="text-xs">
                                    No modifiers yet. Pick buffs and debuffs for this round.
                                </p>
                            </div>
                        )}
                    </Section>

                    {/* Modifier Selection Box */}
                    <div className="border border-white/20 rounded-xl bg-white/40 drop-shadow-lg p-4 space-y-4">
                        {/* Status Indicator */}
                        <div className="flex items-center justify-between pb-2 border-b border-white/30">
                            <div className="flex items-center gap-2 text-xs font-medium text-neutral-900">
                                <Undo2 className="h-3.5 w-3.5" />
                                <span>Click again to deselect</span>
                            </div>
                            <div className="text-xs text-neutral-700">
                                {gameState.nextRoundStatus ?? "Select modifiers"}
                            </div>
                        </div>

                        {/* Buffs Section */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-green-700">Buffs</h3>
                            {options.buffs?.length ? (
                                <div className="grid grid-cols-1 gap-2">
                                    {options.buffs.map((mod) => (
                                        <ModifierCard
                                            key={mod.name}
                                            mod={mod}
                                            selected={!!newMods.find((m) => m.name === mod.name)}
                                            onToggle={toggleModifier}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="py-3 text-xs text-neutral-600">No buff options available.</p>
                            )}
                        </div>

                        {/* Debuffs Section */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-red-700">Debuffs</h3>
                            {options.debuffs?.length ? (
                                <div className="grid grid-cols-1 gap-2">
                                    {options.debuffs.map((mod) => (
                                        <ModifierCard
                                            key={mod.name}
                                            mod={mod}
                                            selected={!!newMods.find((m) => m.name === mod.name)}
                                            onToggle={toggleModifier}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="py-3 text-xs text-neutral-600">No debuff options available.</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-white/30 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-end">
                            <Button
                                type="button"
                                className="h-8 px-3 text-xs"
                                onClick={() => {
                                    newMods.forEach((m) => GameLogic.get().removeModifier(m));
                                    setNewMods([]);
                                    setGameState(GameLogic.get().getGame());
                                }}
                            >
                                Clear Selections
                            </Button>
                            <Button
                                type="button"
                                className="h-8 px-3 text-xs"
                                onClick={handleStartNewGame}
                            >
                                Start Game
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}






