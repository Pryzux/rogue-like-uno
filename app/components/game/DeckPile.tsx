// Draw deck pile with stacked appearance

import { motion } from "framer-motion";

interface DeckPileProps {
  cardsRemaining: number;
  onDraw: () => void;
  isInteractive?: boolean;
}

export default function DeckPile({
  cardsRemaining,
  onDraw,
  isInteractive = true,
}: DeckPileProps) {
  return (
    <div
      className="relative"
      data-card-zone="deck"
    >
      {/* Stacked cards effect */}
      <div className="relative w-24 h-36 sm:w-28 sm:h-40">
        {[...Array(Math.min(3, Math.ceil(cardsRemaining / 20)))].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-xl shadow-xl bg-gray-800"
            style={{
              transform: `translate(${i * 2}px, ${-i * 2}px)`,
              zIndex: i,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}

        {/* Top card */}
        <motion.button
          className={`absolute inset-0 rounded-xl overflow-hidden shadow-2xl z-10 ${
            isInteractive ? "cursor-pointer" : "cursor-default"
          }`}
          onClick={isInteractive ? onDraw : undefined}
          whileHover={
            isInteractive
              ? { scale: 1.05, y: -5, transition: { duration: 0.2 } }
              : undefined
          }
          whileTap={isInteractive ? { scale: 0.95 } : undefined}
          disabled={!isInteractive}
        >
          <img
            src="/unoCard-back.png"
            alt="Draw deck"
            className="w-full h-full object-cover"
          />

          {/* Glow effect when interactive */}
          {isInteractive && (
            <motion.div
              className="absolute inset-0 bg-blue-400/20"
              animate={{
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.button>
      </div>

      {/* Card counter */}
      <motion.div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-xs font-bold text-gray-800">{cardsRemaining}</span>
      </motion.div>
    </div>
  );
}
