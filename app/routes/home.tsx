import { useState } from "react";
import { GameLogic } from "~/game/gamelogic";
import type { Game } from "../game/types/Game";
import NextRound from "./nextRoundPage";
import { UnoMatchPage } from "./unoMatchPage";
import { TestUi } from "~/UserInterface/TestUi";
import { MatchPage } from "./MatchPage"; 




//notes: there are two references to UnoMatchPage, which I(Aarti) have disabled in order to re-write it within  

export function UnoTitle({ scheme = "red" }: { scheme?: "red"|"blue"|"green"|"yellow"|"black" }) {
  const stops: Record<string,string> = {
    red:    "from-red-600 via-amber-400 to-orange-500",
    blue:   "from-blue-500 via-cyan-300 to-sky-400",
    green:  "from-green-600 via-lime-300 to-emerald-500",
    yellow: "from-amber-500 via-yellow-300 to-orange-400",
    black:  "from-neutral-900 via-neutral-600 to-neutral-900",
  };

  return (
    <h1 className="text-5xl font-extrabold tracking-tight">
      <span className={`bg-gradient-to-r ${stops[scheme]} bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]`}>
        UNO
      </span>
    </h1>
  );
}




export default function Home(testMode: false) {

  //testing flag to enable testUI.tsx
  const TEST_UI = false;
  if (TEST_UI) return <TestUi />

  // Initialize the game state on first render
  const [gameState, setGameState] = useState<Game>(() => GameLogic.get().getGame());

  // Create new Uno Match
  const handleStartNewGame = () => {
    console.log("Starting New Game..");
    GameLogic.get().initializeUno()
    setGameState(GameLogic.get().getGame())
  };

  if (gameState.status === 'Next Round') {
    console.log(gameState.status)
    return <NextRound gameState={gameState} setGameState={setGameState} />;
  }


  if (gameState.status === 'Match Created') {
    console.log(gameState.status)
    // CHANGE TO UNOMATCHPAGE FOR ORIGINAL DEV MATCH PAGE
    return <MatchPage gameState={gameState} setGameState={setGameState} />; //original return stmt
    // return <UpdatedunoMatchPage gameState={gameState} setGameState={setGameState} />;

  }

  if (gameState.status === 'Lost') {
    console.log(gameState.status)
    setGameState(GameLogic.get().resetGame())
    // CHANGE TO UNOMATCHPAGE FOR ORIGINAL DEV MATCH PAGE
    return <MatchPage gameState={gameState} setGameState={setGameState} />; //original return stmt
    //  return <UpdatedunoMatchPage gameState={gameState} setGameState={setGameState} />;
  }

  else {

    return (

      <div className="relative min-h-dvh overflow-hidden">
    {/* PERFECT TILE WALLPAPER — no fade, no gaps */}
    <div
      className="fixed inset-0 -z-10 bg-left-top bg-repeat"
      style={{
        backgroundImage: "url('unoCard-back.png')",
        backgroundSize: "160px 240px",
      }}
    />

    {/* FOREGROUND CONTENT */}
    <div className="relative z-10 mx-auto max-w-5xl px-6 pt-10 pb-12">
      {/* Masthead */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white/80 px-5 py-3 shadow-lg backdrop-blur-md">
         

          <h1 className="text-4xl font-extrabold leading-none tracking-tight">
            <span className="text-neutral-900">Rogue-Like </span>
            <UnoTitle scheme="red" />
          </h1>

          <span className="ml-2 rounded-full bg-neutral-900/90 px-2 py-0.5 text-xs font-semibold text-white">
            v0.1
          </span>
        </div>
      </div>

      <section className="rounded-2xl border border-neutral-200/70 bg-white/80 p-6 shadow-lg backdrop-blur-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">Status</p>
            <span
              className={[
                "mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ring-1",
                gameState.status === "In Progress"
                  ? "bg-amber-500/15 text-amber-700 ring-amber-500/30"
                  : gameState.status === "Completed"
                  ? "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30"
                  : "bg-sky-500/10 text-sky-700 ring-sky-500/25",
              ].join(" ")}
            >
              <span
                className={[
                  "block h-2 w-2 rounded-full",
                  gameState.status === "In Progress"
                    ? "bg-amber-500"
                    : gameState.status === "Completed"
                    ? "bg-emerald-500"
                    : "bg-sky-500",
                ].join(" ")}
              />
              {gameState.status}
            </span>
          </div>

          <button
            onClick={handleStartNewGame}
            className="group inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            Start Game
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            >
              <path d="M7.5 5l6 5-6 5V5z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

        <div className="mt-6">
          <p className="text-sm font-medium text-neutral-500">Players</p>
          <ul className="mt-3 flex flex-wrap items-center gap-2">
            {gameState.players.map((p: { name: string }, i: number) => (
              <li
                key={p.name + i}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/80 px-3 py-1.5 text-sm shadow-sm"
              >
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-neutral-100 text-xs font-semibold text-neutral-700">
                  {p.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((s) => s[0]!.toUpperCase())
                    .join("")}
                </span>
                <span className="text-neutral-800">{p.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm">
          <a href="#rules" className="text-sky-700 underline-offset-4 hover:underline">
            Read rules
          </a>
          <span className="text-neutral-500">Autosaves between turns</span>
        </div>
      </section>
    </div>
  </div>
);


  }


}

