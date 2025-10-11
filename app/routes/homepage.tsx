import { useState } from "react";

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type Status = "Not Started" | "In Progress" | "Completed";

function RogueLikeUnoHome({
  status,
  players,
  onStart,
}: {
  status: Status;
  players: string[];
  onStart: () => void;
}) {
  const statusColor =
    status === "In Progress"
      ? "bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/30"
      : status === "Completed"
        ? "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30"
        : "bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/25";

  return (
    <div className="min-h-dvh bg-gradient-to-b from-neutral-50 to-neutral-200 dark:from-neutral-900 dark:to-neutral-950 flex flex-col items-center justify-center">
      <section className="rounded-2xl border border-neutral-200/70 bg-white/60 p-6 shadow-lg shadow-neutral-900/5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/50 w-[28rem]">
        <h1 className="text-2xl font-semibold mb-6 text-center">Rogue-Like Uno</h1>

        {/* Status */}
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Status
          </p>
          <span
            className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${statusColor}`}
          >
            <span
              className={`block h-2 w-2 rounded-full ${status === "In Progress"
                ? "bg-amber-500"
                : status === "Completed"
                  ? "bg-emerald-500"
                  : "bg-sky-500"
                }`}
            />
            {status}
          </span>
        </div>

        {/* Players */}
        <div className="mb-6">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Players
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {players.map((p, i) => (
              <li
                key={p + i}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/70 px-3 py-1.5 text-sm shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-neutral-100 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                  {initials(p)}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="group relative w-full rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-neutral-900/10 transition active:scale-[0.99] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-neutral-100 dark:text-neutral-900 dark:ring-neutral-50/10"
        >
          Start Game →
        </button>
      </section>
    </div>
  );
}


export default function RogueLikeUnoGame() {
  const [status, setStatus] = useState<Status>("Not Started");
  const players = ["You", "AI 1", "AI 2", "AI 3"];

  function handleStart() {
    setStatus("In Progress");

    console.log("Game started!");
  }

  return (
    <RogueLikeUnoHome
      status={status}
      players={players}
      onStart={handleStart}
    />
  );
}