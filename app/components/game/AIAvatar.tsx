// AI Player avatar with reactions and animations

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import type Player from "~/game/types/Player";
import { uiBus, type PlayerEffectPayload, type PlayerEffect } from "~/UIBus";
import { shakeAnimation, bounceAnimation } from "~/utils/animations";

interface AIAvatarProps {
  player: Player;
  isCurrentTurn: boolean;
}

const avatarColors = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
];

const reactions: Record<PlayerEffect, { emoji: string; message: string }> = {
  skip: { emoji: "😠", message: "Hey!" },
  draw2: { emoji: "😤", message: "Not fair!" },
  wild: { emoji: "🎨", message: "Switching colors?!" },
  wildDraw4: { emoji: "🤯", message: "Four cards?! Seriously?!" },
};

export default function AIAvatar({ player, isCurrentTurn }: AIAvatarProps) {
  const [reaction, setReaction] = useState<{ emoji: string; message: string } | null>(null);
  const [triggerAnimation, setTriggerAnimation] = useState<"shake" | "bounce" | null>(null);
  const hideTimeout = useRef<number | null>(null);

  // Get consistent color for this player
  const playerIndex = parseInt(player.id.split("-")[1] || "1") - 1;
  const avatarColor = avatarColors[playerIndex % avatarColors.length];

  // Use player-assigned name as the display name
  const displayName = player.name ?? `AI ${playerIndex + 1}`;

  useEffect(() => {
    const handler = (e: Event) => {
      const { playerId, effect } = (e as CustomEvent<PlayerEffectPayload>).detail;
      if (playerId !== player.id) return;

      // Set reaction
      const reactionData = reactions[effect];
      if (reactionData) {
        setReaction(reactionData);
        setTriggerAnimation("shake");

        // Clear after 2 seconds
        if (hideTimeout.current) window.clearTimeout(hideTimeout.current);
        hideTimeout.current = window.setTimeout(() => {
          setReaction(null);
          setTriggerAnimation(null);
        }, 2000);
      }
    };

    uiBus.addEventListener("playerEffect", handler);
    return () => {
      uiBus.removeEventListener("playerEffect", handler);
      if (hideTimeout.current) window.clearTimeout(hideTimeout.current);
    };
  }, [player.id]);

  // Celebration when down to 1 card
  useEffect(() => {
    if (player.hand.length === 1) {
      setTriggerAnimation("bounce");
      setReaction({ emoji: "😏", message: "UNO!" });

      if (hideTimeout.current) window.clearTimeout(hideTimeout.current);
      hideTimeout.current = window.setTimeout(() => {
        setReaction(null);
        setTriggerAnimation(null);
      }, 2000);
    }
  }, [player.hand.length]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Speech bubble */}
      <AnimatePresence>
        {reaction && (
          <motion.div
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative bg-white rounded-2xl px-4 py-2 shadow-xl">
              <span className="text-2xl mr-2">{reaction.emoji}</span>
              <span className="text-sm font-medium text-gray-800">{reaction.message}</span>
              {/* Tail */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar with animations */}
      <motion.div
        className="relative"
        variants={triggerAnimation === "shake" ? shakeAnimation : triggerAnimation === "bounce" ? bounceAnimation : undefined}
        initial="initial"
        animate={triggerAnimation || "initial"}
        onAnimationComplete={() => setTriggerAnimation(null)}
      >
        {/* Turn indicator ring */}
        <AnimatePresence>
          {isCurrentTurn && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                boxShadow: "0 0 20px 4px rgba(251, 191, 36, 0.8)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Avatar circle - smaller */}
        <motion.div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${avatarColor}
            flex items-center justify-center shadow-lg relative overflow-hidden
            border-4 ${isCurrentTurn ? "border-yellow-400" : "border-white/30"}`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {/* Display AI number */}
          <span className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
            {displayName}
          </span>

          {/* Card count badge - smaller */}
          <motion.div
            className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <span className="text-xs font-bold text-gray-800">{player.hand.length}</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
