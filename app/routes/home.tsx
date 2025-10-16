import { useState } from "react";
import { GameLogic } from "~/game/gamelogic";
import type { Game } from "../game/types/Game";
import NextRound from "./nextRoundPage";
import { TestUi } from "~/UserInterface/TestUi";
import { MatchPage } from "./MatchPage";
import { LostSummary } from "./LostSummary";
import Header from "~/UserInterface/Header";
import { motion } from "framer-motion";
import { UnoTitle } from "~/UserInterface/UnoTitle-homepage";


export default function Home(testMode: false) {
  const TEST_UI = false;
  if (TEST_UI) return <TestUi />;

  const [gameState, setGameState] = useState<Game>(() =>
    GameLogic.get().getGame()
  );

  const handleStartNewGame = () => {
    console.log("Starting New Game..");
    GameLogic.get().initializeUno();
    setGameState(GameLogic.get().getGame());
  };

  if (gameState.status === "Next Round")
    return <NextRound gameState={gameState} setGameState={setGameState} />;

  if (gameState.status === "Match Created")
    return <MatchPage gameState={gameState} setGameState={setGameState} />;

  if (gameState.status === "Lost")
    return <LostSummary gameState={gameState} setGameState={setGameState} />;

  return (
    <div className="relative min-h-dvh overflow-hidden flex flex-col items-center justify-center">
      {/* bg */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-b from-amber-50 via-orange-100 to-red-200" />
      <div
        className="absolute inset-0 -z-20 bg-center bg-cover opacity-40"
        style={{
          backgroundImage: "url('/unobg-cards-side.png')",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_60%)]" />

      {/* <div className="absolute top-0 left-0 w-full p-4">
        <Header />
      </div> */}

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 space-y-6">
        <UnoTitle scheme="red" />

        <motion.p
          className="max-w-2xl text-neutral-700 text-base sm:text-lg leading-relaxed font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          A chaotic survival twist on the classic card game. Each round, pick one
          <span className="text-emerald-600 font-semibold"> buff </span>and one
          <span className="text-rose-600 font-semibold"> debuff</span>. Win to
          stack new powers—but beware: every choice brings you closer to your
          downfall. How many rounds can you survive?
        </motion.p>

        <motion.button
          onClick={handleStartNewGame}
          className="mt-4 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Start New Run
        </motion.button>

      </div>

      <motion.img
        src="/unoCard-back.png"
        alt="UNO Card"
        className="absolute bottom-10 left-10 w-24 opacity-55 rotate-[-15deg]"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />
      <motion.img
        src="/unoCard-back.png"
        alt="UNO Card"
        className="absolute top-12 right-12 w-28 opacity-55 rotate-[25deg]"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
    </div>
  );
}
