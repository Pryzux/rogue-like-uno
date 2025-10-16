// Animated wrapper for SingleCard component

import { motion } from "framer-motion";
import type { Card } from "~/game/types/Card";
import SingleCard from "~/UserInterface/SingleCard";
import { cardHoverAnimation } from "~/utils/animations";

interface AnimatedCardProps {
  card: Card;
  onClick?: () => void;
  isPlayable?: boolean;
  isClickable?: boolean;
  currentColor?: string;
  index?: number;
  style?: React.CSSProperties;
}

export default function AnimatedCard({
  card,
  onClick,
  isPlayable = false,
  isClickable = true,
  currentColor,
  index = 0,
  style,
}: AnimatedCardProps) {
  return (
    <motion.div
      className="relative"
      initial="initial"
      whileHover={isClickable && isPlayable ? "hover" : undefined}
      whileTap={isClickable && isPlayable ? "tap" : undefined}
      variants={cardHoverAnimation}
      style={style}
      layout
      transition={{
        layout: { duration: 0.3, ease: "easeOut" },
      }}
    >
      {/* Playable indicator glow */}
      {isPlayable && isClickable && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-green-400/30 blur-md -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      <SingleCard
        card={card}
        onClick={onClick}
        isPlayable={isPlayable}
        isClickable={isClickable}
        currentColor={currentColor}
      />
    </motion.div>
  );
}
