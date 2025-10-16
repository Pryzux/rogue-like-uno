// Clean AI Player Avatar - centered and simple

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type Player from "~/game/types/Player";
import { uiBus, type PlayerEffectPayload, type PlayerEffect } from "~/UIBus";

interface AIPlayerCleanProps {
  player: Player;
  isCurrentTurn: boolean;
}

type Reaction = { emoji: string; message: string; key: number };

const reactionMap: Record<PlayerEffect, { emoji: string; message: string }> = {
  skip: { emoji: "😠", message: "Hey!" },
  draw2: { emoji: "😤", message: "Not fair!" },
  wild: { emoji: "🎨", message: "Really?" },
  wildDraw4: { emoji: "🤯", message: "why me?" },
};

export function AIPlayerClean({ player, isCurrentTurn }: AIPlayerCleanProps) {
  // Extract AI number from player ID (ai-1, ai-2, ai-3)
  const aiNumber = player.id.split("-")[1];
  const displayName = player.name ?? `AI ${aiNumber}`;

  // Color scheme based on AI number
  const colorSchemes = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-teal-500",
  ];
  const colorIndex = parseInt(aiNumber) - 1;
  const gradientClass = colorSchemes[colorIndex % colorSchemes.length];
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const hideReactionTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const { playerId, effect } = (event as CustomEvent<PlayerEffectPayload>).detail;
      if (playerId !== player.id) return;

      const nextReaction = reactionMap[effect];
      if (!nextReaction) return;

      setReaction({ ...nextReaction, key: Date.now() });

      if (hideReactionTimeout.current) {
        window.clearTimeout(hideReactionTimeout.current);
      }
      hideReactionTimeout.current = window.setTimeout(() => {
        setReaction(null);
        hideReactionTimeout.current = null;
      }, 2000);
    };

    uiBus.addEventListener("playerEffect", handler);
    return () => {
      uiBus.removeEventListener("playerEffect", handler);
      if (hideReactionTimeout.current) {
        window.clearTimeout(hideReactionTimeout.current);
      }
    };
  }, [player.id]);

  useEffect(() => {
    if (player.hand.length !== 1) return;

    setReaction({ emoji: "😏", message: "UNO!", key: Date.now() });

    if (hideReactionTimeout.current) {
      window.clearTimeout(hideReactionTimeout.current);
    }
    hideReactionTimeout.current = window.setTimeout(() => {
      setReaction(null);
      hideReactionTimeout.current = null;
    }, 2000);
  }, [player.hand.length]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar Circle */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <AnimatePresence>
          {reaction && (
            <motion.div
              key={reaction.key}
              className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative bg-white/95 rounded-2xl px-3 py-1.5 shadow-lg border border-white">
                <span className="mr-2 text-lg">{reaction.emoji}</span>
                <span className="text-sm font-medium text-gray-800">{reaction.message}</span>
                <span className="absolute left-1/2 bottom-[-6px] -translate-x-1/2 h-0 w-0 border-t-8 border-t-white border-x-8 border-x-transparent" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow ring for current turn */}
        <motion.div
          className="absolute w-24 h-24 rounded-full pointer-events-none"
          animate={
            isCurrentTurn
              ? {
                scale: [0.9, 1.1, 0.9],
                opacity: [0.2, 0.45, 0.2],
              }
              : { scale: 1, opacity: 0 }
          }
          transition={{
            duration: 1.8,
            repeat: isCurrentTurn ? Infinity : 0,
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(circle, rgba(251,191,36,0.45) 0%, rgba(251,191,36,0.25) 50%, rgba(251,191,36,0) 70%)",
          }}
        />

        {/* Main Avatar */}
        <div
          className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${gradientClass}
            flex flex-col items-center justify-center shadow-lg
            border-4 ${isCurrentTurn ? "border-yellow-400" : "border-white/50"}`}
        >
          {/* AI Name */}
          <span className="text-white font-bold text-sm">{displayName}</span>

          {/* Card Count Badge */}
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-gray-200">
            <span className="text-xs font-bold text-gray-800">{player.hand.length}</span>
          </div>
        </div>
      </div>

      {/* Current Turn Indicator - Always reserve space */}
      <div className="h-6 flex items-center justify-center">
        {isCurrentTurn && (
          <motion.div
            className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full font-medium shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            Current Turn
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
