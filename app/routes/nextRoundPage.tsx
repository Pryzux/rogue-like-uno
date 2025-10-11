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
            className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 via-red-100 to-red-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* bakground fade */}
            <motion.img
                src="/unobg-cards-side.png"
                alt="UNO background"
                className="absolute inset-0 h-full w-full object-cover object-center"
                style={{
                    opacity: 0.2,
                    minWidth: "100%",
                    minHeight: "100%",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            />

            {/* main box */}
            <motion.div
                className="relative z-10 flex flex-col w-full max-w-4xl items-center justify-center px-6 py-3 space-y-2 glass text-sm leading-snug"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
                <Header nextRoundStatus={gameState.nextRoundStatus} />

                {/* title */}
                <div className="flex items-center w-full mt-2">
                    <h3 className="glass-lite p-2 text-lg font-bold text-amber-900">
                        Next Round Modifier Selection
                    </h3>
                    <div className="ml-auto items-center rounded-xl border border-amber-300 bg-amber-100 px-4 py-2 shadow-sm text-amber-900 text-xs font-medium">
                        {gameState.nextRoundStatus ?? "Preparing next round..."}
                    </div>
                </div>

                {/* big box */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 w-full">
                    {/* Current Modifiers */}
                    <Section title="Current Modifiers" tone="neutral">
                        {gameState.modifiers?.length ? (
                            <ul className="space-y-2">
                                {gameState.modifiers.map((mod) => (
                                    <li key={mod.name} className="glass-lite rounded-2xl border p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-medium">{mod.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {mod.description}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                                <Hand className="h-4 w-4" />
                                <p className="text-xs">
                                    No modifiers yet. Pick buffs and debuffs for this round.
                                </p>
                            </div>
                        )}
                    </Section>

                    {/* buffs/debuffs */}
                    <div className="lg:col-span-2 space-y-5">
                        <Section title="Buffs" tone="buff">
                            {options.buffs?.length ? (
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                                <p className="py-3 text-xs text-muted-foreground">No buff options available.</p>
                            )}
                        </Section>

                        <Section title="Debuffs" tone="debuff">
                            {options.debuffs?.length ? (
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                                <p className="py-3 text-xs text-muted-foreground">No debuff options available.</p>
                            )}
                        </Section>

                        {/* Bottom Section */}
                        <Card className="glass-lite rounded-3xl border border-amber-200">
                            <CardContent className="flex flex-col gap-3 p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Undo2 className="h-3.5 w-3.5" />
                                        <span>Click again to deselect a modifier.</span>
                                    </div>
                                </div>

                                <Separator className="bg-gray-200 h-px w-full" />

                                <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                                    <p className="text-xs text-muted-foreground">
                                        Add or remove modifiers freely before starting the next round.
                                    </p>
                                    <div className="flex gap-2">
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
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}






