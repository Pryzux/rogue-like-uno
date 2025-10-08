import type { Card } from "../game/types/Card";

export default function Cards({ card, onClick }: { card: Card, onClick }) {

    const colorMap: Record<string, string> = {

        red: "bg-red-600 text-amber-50",
        yellow: "bg-yellow-400 text-amber-900",
        green: "bg-green-600 text-amber-50",
        blue: "bg-blue-600 text-amber-50",
        black: "bg-neutral-800 text-amber-50",

    };

    const label = card.type === "number" ? card.value : card.type;

    const colorClass = colorMap[card.color] ?? "bg-gray-400 text-white";

    return (

        <button
            onClick={onClick}
            className={`w-10 h-14 rounded-md flex items-center justify-center border border-amber-200 shadow-sm font-bold text-xs capitalize ${colorClass}`}
            title={`${card.color} ${label}`}
        >

            {label}

        </button>

    );
}
