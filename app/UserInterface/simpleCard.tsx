import type { Card } from "~/game/types/Card";


export default function SimpleCard({
    card,
    onClick,
    isPlayable = true,
    isClickable = false,
}: {
    card: Card;
    onClick?: () => void;
    isPlayable?: boolean;
    isClickable?: boolean;
}) {
    const colorMap: Record<string, string> = {
        red: "bg-red-600 text-amber-50",
        yellow: "bg-yellow-400 text-amber-900",
        green: "bg-green-600 text-amber-50",
        blue: "bg-blue-600 text-amber-50",
        black: "bg-neutral-800 text-amber-50",
    };

    const label = card.type === "number" ? card.value : card.type;
    const colorClass = colorMap[card.color] ?? "bg-gray-400 text-white";

    const classes = [
        "w-10 h-14 rounded-md flex items-center justify-center border shadow-sm font-bold text-xs capitalize",
        colorClass,
        isClickable && "cursor-pointer hover:scale-110 transition-transform",
        isClickable && isPlayable && "ring-2 ring-green-400",
        isClickable && !isPlayable && "opacity-50 cursor-not-allowed",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={classes}
            title={`${card.color} ${label}`}
            onClick={isClickable && isPlayable ? onClick : undefined}
        >
            {label}
        </div>
    );
}
