import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "~/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Trophy, Skull, RotateCcw } from "lucide-react";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "../components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { Game } from "../game/types/Game";
import type { Modifier } from "../game/types/Modifier";
import { GameLogic } from "../game/gamelogic";

interface GameProps {
    gameState: Game;
    setGameState: React.Dispatch<React.SetStateAction<Game>>;
}

export function LostSummary({ gameState, setGameState }: GameProps) {
    const totalMatches = gameState.matches?.length ?? 0;
    const totalModifiers = gameState.modifiers?.length ?? 0;

    const buffs =
        gameState.modifiers?.filter((m: Modifier) => m.modifierType === "buff") ??
        [];
    const debuffs =
        gameState.modifiers?.filter((m: Modifier) => m.modifierType === "debuff") ??
        [];


    const handlePlayAgain = () => {
        GameLogic.get().resetGame()
        setGameState(GameLogic.get().getGame())
        console.log("Restarting game...");
    };

    return (
        <div className="relative min-h-screen w-full bg-gradient-to-b from-amber-50 via-orange-100 to-red-200 overflow-hidden">
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

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl text-center space-y-8"
                >
                {/* --- Header --- */}
                <div className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/40 px-5 py-3 shadow-lg backdrop-blur-md">


                    <h1 className="text-4xl font-extrabold leading-none tracking-tight">
                        <span className="text-neutral-900">Rogue-Like </span>
                        <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
                            UNO
                        </span>
                    </h1>

                    <span className="ml-2 rounded-full bg-neutral-900/90 px-2 py-0.5 text-xs font-semibold text-white">
                        v0.1
                    </span>
                </div>
                <div className="space-y-2 bg-white/30 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                    <h1 className="text-4xl font-bold text-neutral-900 flex items-center justify-center gap-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                        <Skull className="h-8 w-8 text-neutral-800" />
                        You Lost the Match
                    </h1>
                    <p className="text-neutral-800 text-lg font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">
                        You survived{" "}
                        <span className="font-semibold">{totalMatches}</span>{" "}
                        match{totalMatches === 1 ? "" : "es"} before falling.
                    </p>
                </div>

                <Separator className="bg-amber-300 my-6" />

                {/* --- Match Summary --- */}
                <Card className="glass-lite bg-red-50 border-red-200 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-amber-900 flex items-center gap-2">
                            <Trophy className="text-amber-700" /> Victory Streak
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 text-left">
                        {totalMatches > 0 ? (
                            <ul className="glass-lite space-y-2">
                                {gameState.matches.map((match, idx) => (
                                    <Collapsible className="" key={idx}>
                                        <div className="flex justify-between items-center rounded-lg  py-2 px-5 text-amber-900">
                                            <span>Match {idx + 1}</span>
                                            <CollapsibleTrigger className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900 transition-colors">
                                                Details
                                                <ChevronDown className="w-4 h-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                                            </CollapsibleTrigger>
                                        </div>

                                        <CollapsibleContent className="mt-2 rounded-lg border px-5 text-sm text-amber-800">

                                            <p className="mb-1"></p>
                                            <p className="mb-1">
                                                Turns taken: {match.players.find(player => player.isHuman === true)?.turns} </p>
                                            <p>
                                                Buff Added:{" "}
                                                {match.modifiersAddedThisRound
                                                    ?.filter((m) => m.modifierType === "buff")
                                                    .map((m) => m.name)
                                                    .join(", ") || "None"}
                                            </p>

                                            <p>
                                                Debuff Added:{" "}
                                                {match.modifiersAddedThisRound
                                                    ?.filter((m) => m.modifierType === "debuff")
                                                    .map((m) => m.name)
                                                    .join(", ") || "None"}
                                            </p>
                                        </CollapsibleContent>

                                    </Collapsible>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-amber-700 italic">You lost on your first match.</p>
                        )}
                    </CardContent>
                </Card>


                {/* --- Modifiers Summary --- */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="glass-lite bg-green-50 border-green-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-green-800">
                                Buffs Collected
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {buffs.length > 0 ? (
                                <ul className="space-y-1">
                                    {buffs.map((buff, i) => (
                                        <li key={i} className="text-green-700">
                                            {buff.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-green-600 italic">None collected.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="glass-lite bg-red-50 border-red-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-red-800">
                                Debuffs Endured
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {debuffs.length > 0 ? (
                                <ul className="space-y-1">
                                    {debuffs.map((debuff, i) => (
                                        <li key={i} className="text-red-700">
                                            {debuff.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-red-600 italic">None collected.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* --- Footer / Restart Button --- */}
                <div className="pt-8 flex justify-center">
                    <Button
                        onClick={handlePlayAgain}
                        size="lg"
                        className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 hover:shadow-xl text-white flex items-center gap-2 px-6 py-3 text-lg transition active:scale-95"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Play Again
                    </Button>
                </div>
            </motion.div>
            </div>
        </div>
    );
}
