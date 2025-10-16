import { cn } from "~/lib/utils";

const COLOR_OPTIONS = [
  { id: "red", label: "Red", gradient: "from-rose-500 via-red-500 to-orange-500", ring: "ring-amber-200" },
  { id: "yellow", label: "Yellow", gradient: "from-amber-400 via-yellow-300 to-amber-500", ring: "ring-amber-200" },
  { id: "green", label: "Green", gradient: "from-emerald-500 via-green-400 to-emerald-600", ring: "ring-lime-200" },
  { id: "blue", label: "Blue", gradient: "from-sky-500 via-blue-500 to-indigo-500", ring: "ring-sky-300" },
] as const;

interface ColorPickerProps {
  cardId: string;
  handleChoice: (cardId: string, color: string) => void;
  className?: string;
}

export default function ColorPicker({ cardId, handleChoice, className }: ColorPickerProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-[rgba(41,20,8,0.77)] shadow-[0_20px_35px_rgba(67,20,7,0.4)] ",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-300/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-amber-200/10 " />
      <div className="relative px-5 py-6 sm:px-6 sm:py-7 ">
        <header className="mb-5 space-y-2 text-center text-white">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-wider text-white/80 shadow-sm ring-1 ring-white/20">
            Choose Your Color
          </span>

          <p className="text-sm text-white/70">
            Select the hue that gives you the advantage. Your foes will play by your rules next turn.
          </p>
        </header>
        <div className="grid grid-cols-2 gap-3">
          {COLOR_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleChoice(cardId, option.id)}
              className="group relative flex flex-col items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white transition hover:border-white/40 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              aria-label={`Pick ${option.label}`}
            >
              <span
                className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${option.gradient} shadow-lg transition group-hover:scale-110 group-hover:shadow-xl`}
              >
                <span
                  className={`pointer-events-none absolute inset-0 rounded-full opacity-0 transition group-hover:opacity-100 ${option.ring} ring ring-4`}
                />
                <span className="relative h-5 w-5 rounded-full border border-white/40 bg-white/20 shadow-inner" />
              </span>
              <span className="text-xs font-semibold tracking-wide text-white/90">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
