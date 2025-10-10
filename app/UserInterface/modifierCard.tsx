import { cx } from "class-variance-authority";
import { motion } from "motion/react";
import type { Modifier } from "~/game/types/Modifier";

// ModifierCard Component
interface ModifierCardProps {
    mod: Modifier;
    selected: boolean;
    onToggle: (mod: Modifier) => void;
}

const isBuff = (m: Modifier) => m.modifierType === "buff";

export function ModifierCard({ mod, selected, onToggle }: ModifierCardProps) {
    const isTypeBuff = isBuff(mod);

    // Keep border constant regardless of "selected"
    const border = isTypeBuff ? "border-green-300" : "border-red-300";

    // Make hover obviously visible and resilient
    const hoverBg = isTypeBuff ? "hover:bg-green-100/60" : "hover:bg-red-100/60";
    const hoverRing = isTypeBuff ? "hover:ring-green-200" : "hover:ring-red-200";

    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="button"
            onClick={() => onToggle(mod)}
            className={cx(
                "group w-full text-left rounded-2xl border bg-white p-4 shadow-sm",
                "transition-[background-color,box-shadow,border-color,transform] duration-200",
                "hover:ring-1", // subtle ring on hover only
                border,
                hoverBg,
                hoverRing
            )}
        >
            <div className="space-y-1">
                <p className="font-semibold leading-tight">{mod.name}</p>
                <p className="text-sm text-muted-foreground">{mod.description}</p>
            </div>
        </motion.button>
    );
}

