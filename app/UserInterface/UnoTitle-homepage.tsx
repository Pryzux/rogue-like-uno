import { motion } from "motion/react";

export function UnoTitle({
    scheme = "red",
}: {
    scheme?: "red" | "blue" | "green" | "yellow" | "black";
}) {
    const stops: Record<string, string> = {
        red: "from-red-600 via-amber-400 to-orange-500",
        blue: "from-blue-500 via-cyan-300 to-sky-400",
        green: "from-green-600 via-lime-300 to-emerald-500",
        yellow: "from-amber-500 via-yellow-300 to-orange-400",
        black: "from-neutral-900 via-neutral-600 to-neutral-900",
    };

    return (
        <motion.h1
            className="text-7xl sm:text-8xl font-extrabold tracking-tight text-center select-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
        >
            <span
                className={`bg-gradient-to-r ${stops[scheme]} bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]`}
            >
                Rogue-Like UNO
            </span>
        </motion.h1>
    );
}