// Discard pile with top card prominently displayed

import { motion, AnimatePresence } from "framer-motion";
import type { Card, CardColor } from "~/game/types/Card";
import SingleCard from "~/UserInterface/SingleCard";

interface DiscardPileProps {
  discardPile: Card[];
  currentColor?: CardColor;
}

export default function DiscardPile({ discardPile, currentColor }: DiscardPileProps) {
  const topCard = discardPile[0];
  const previousCards = discardPile.slice(1, 4); // Show up to 3 previous cards

  return (
    <div className="relative" data-card-zone="discard">
      <div className="relative w-24 h-36 sm:w-28 sm:h-40">
        {/* Previous cards (stacked below) */}
        {previousCards.map((card, index) => (
          <motion.div
            key={card.id}
            className="absolute inset-0 rounded-xl overflow-hidden shadow-lg"
            style={{
              transform: `translate(${-index * 2}px, ${index * 2}px) rotate(${index * 2}deg)`,
              zIndex: index,
              opacity: 0.7 - index * 0.2,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 - index * 0.2 }}
          >
            <SingleCard card={card} isClickable={false} isLarge />
          </motion.div>
        ))}

        {/* Top card with animation */}
        <AnimatePresence mode="wait">
          {topCard && (
            <motion.div
              key={topCard.id}
              className="absolute inset-0 z-10"
              initial={{ scale: 1.3, rotate: 15, opacity: 0, y: -50 }}
              animate={{
                scale: 1,
                rotate: 0,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
                transition: { duration: 0.2 },
              }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="relative">
                <SingleCard
                  card={topCard}
                  isClickable={false}
                  isLarge
                  currentColor={currentColor}
                />

                {/* Drop shadow */}
                <div className="absolute inset-0 rounded-xl shadow-2xl -z-10" />

                {/* Wild card color indicator ring */}
                {topCard.type.includes("wild") && currentColor && (
                  <motion.div
                    className="absolute inset-0 rounded-xl -z-20"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      boxShadow: `0 0 30px 8px ${getColorShadow(currentColor)}`,
                    }}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getColorShadow(color: CardColor): string {
  const shadowColors: Record<CardColor, string> = {
    red: "rgba(239, 68, 68, 0.8)",
    yellow: "rgba(250, 204, 21, 0.8)",
    green: "rgba(34, 197, 94, 0.8)",
    blue: "rgba(59, 130, 246, 0.8)",
    black: "rgba(0, 0, 0, 0.5)",
  };

  return shadowColors[color] || shadowColors.black;
}
