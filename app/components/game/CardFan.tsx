// Card fan display for player's hand - curved arc layout

import { motion } from "framer-motion";
import type { Card } from "~/game/types/Card";
import AnimatedCard from "./AnimatedCard";
import { calculateArcPosition } from "~/utils/animations";
import { canPlayCard } from "~/game/deck";

interface CardFanProps {
  hand: Card[];
  onCardClick: (card: Card) => void;
  isInteractive?: boolean;
  topCard?: Card;
  currentColor?: string;
}

export default function CardFan({
  hand,
  onCardClick,
  isInteractive = true,
  topCard,
  currentColor,
}: CardFanProps) {
  const cardCount = hand.length;

  return (
    <div className="relative w-full h-48 sm:h-56 flex items-end justify-center">
      <div className="relative w-full max-w-4xl h-full">
        {hand.map((card, index) => {
          // Calculate arc position
          const { x, y, rotation } = calculateArcPosition(index, cardCount, 600);

          // Check if card is playable
          const isPlayable =
            topCard && currentColor
              ? canPlayCard(card, topCard, currentColor)
              : false;

          return (
            <motion.div
              key={card.id}
              className="absolute bottom-0 left-1/2"
              style={{
                transform: `translate(calc(-50% + ${x}px), ${y}px) rotate(${rotation}deg)`,
                zIndex: index,
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                delay: index * 0.05,
                duration: 0.3,
                ease: "easeOut",
              }}
              whileHover={
                isInteractive && isPlayable
                  ? {
                      y: -20,
                      zIndex: 1000,
                      transition: { duration: 0.2 },
                    }
                  : undefined
              }
            >
              <AnimatedCard
                card={card}
                onClick={() => isInteractive && onCardClick(card)}
                isPlayable={isPlayable}
                isClickable={isInteractive}
                currentColor={currentColor}
                index={index}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Helper text when no playable cards */}
      {hand.length > 0 &&
        isInteractive &&
        topCard &&
        currentColor &&
        !hand.some((card) => canPlayCard(card, topCard, currentColor)) && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            No playable cards - draw from deck
          </motion.div>
        )}
    </div>
  );
}
