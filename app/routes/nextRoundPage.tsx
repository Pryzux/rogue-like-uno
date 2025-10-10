import { useState, useEffect } from "react";
import type { Game } from "../game/types/Game";
import type { Modifier } from "../game/types/Modifier";
import type RoundOptions from "~/game/types/RoundOptions";
import { GameLogic } from "~/game/gamelogic";
import { Undo2, Hand } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
        if (alreadySelected) {
            handleDeselectModifier(modifier);
        } else {
            handleSelectModifier(modifier);
        }
    };

    const handleStartNewGame = () => {
        GameLogic.get().startGameAfterModifierSelection();
        setGameState(GameLogic.get().getGame());
    };

    useEffect(() => {
        setGameState(GameLogic.get().getGame());
    }, [setGameState]);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <img
                src="/unobg-cards-side.png"
                alt="UNO background"
                className="absolute inset-0 h-full w-full object-cover object-center"
                style={{
                    opacity: 0.8,
                    minWidth: "100%",
                    minHeight: "100%",
                }}

            />

            <div className="glass mx-auto max-w-6xl px-6 py-10 space-y-2">
                {/* Header */}
                <Header nextRoundStatus={gameState.nextRoundStatus} />
                <div className="flex items-center m-2 mt-3">
                    <h3 className="glass-lite p-2 text-xl font-bold text-amber-900">
                        Next Round Modifier Selection
                    </h3>
                    <div className="ml-auto items-center rounded-xl border border-amber-300 bg-amber-100 px-4 py-2 shadow-sm text-amber-900 text-sm font-medium">
                        {gameState.nextRoundStatus ?? "Preparing next round..."}
                    </div>
                </div>
                
                {/* Main Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Current Modifiers */}
                    <Section title="Current Modifiers" tone="neutral">
                        {gameState.modifiers?.length ? (
                            <ul className="space-y-3">
                                {gameState.modifiers.map((mod) => (
                                    <li key={mod.name} className="glass-lite rounded-2xl border p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-medium">{mod.name}</p>
                                                <p className="text-sm text-muted-foreground">{mod.description}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                                <Hand className="h-5 w-5" />
                                <p className="text-sm">
                                    No modifiers yet. Pick buffs and debuffs for this round.
                                </p>
                            </div>
                        )}
                    </Section>

                    {/* Buffs & Debuffs */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Buffs */}
                        <Section title="Buffs" tone="buff">
                            {options.buffs?.length ? (
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                                <p className="py-4 text-sm text-muted-foreground">
                                    No buff options available.
                                </p>
                            )}
                        </Section>

                        {/* Debuffs */}
                        <Section title="Debuffs" tone="debuff">
                            {options.debuffs?.length ? (
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                                <p className="py-4 text-sm text-muted-foreground">
                                    No debuff options available.
                                </p>
                            )}
                        </Section>

                        {/* Bottom Section */}
                        <Card className="glass-lite rounded-3xl border border-amber-200">
                            <CardContent className="flex flex-col gap-4 p-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Undo2 className="h-4 w-4" />
                                        <span>Click again to deselect a modifier.</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                                    <p className="text-sm text-muted-foreground">
                                        Add or remove modifiers freely before starting the next round.
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                newMods.forEach((m) => GameLogic.get().removeModifier(m));
                                                setNewMods([]);
                                                setGameState(GameLogic.get().getGame());
                                            }}
                                        >
                                            Clear Selections
                                        </Button>
                                        <Button type="button" onClick={handleStartNewGame}>
                                            Start Game
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}




