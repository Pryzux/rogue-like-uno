// Custom hook for orchestrating card animations

import { useCallback } from "react";
import { useAnimate } from "framer-motion";

export type CardAnimationTarget =
  | "deck"
  | "discard"
  | "player-hand"
  | `ai-${number}`;

export interface CardAnimationOptions {
  from: CardAnimationTarget;
  to: CardAnimationTarget;
  duration?: number;
  onComplete?: () => void;
}

export function useCardAnimation() {
  const [scope, animate] = useAnimate();

  const animateCard = useCallback(
    async (options: CardAnimationOptions) => {
      const { from, to, duration = 0.3, onComplete } = options;

      // Get start and end positions
      const fromElement = document.querySelector(`[data-card-zone="${from}"]`);
      const toElement = document.querySelector(`[data-card-zone="${to}"]`);

      if (!fromElement || !toElement) {
        console.warn("Animation zones not found", { from, to });
        onComplete?.();
        return;
      }

      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();

      // Calculate delta
      const deltaX = toRect.left - fromRect.left;
      const deltaY = toRect.top - fromRect.top;

      // Create temporary card element for animation
      const tempCard = document.createElement("div");
      tempCard.className = "fixed z-50 pointer-events-none";
      tempCard.style.left = `${fromRect.left}px`;
      tempCard.style.top = `${fromRect.top}px`;
      tempCard.style.width = `${fromRect.width}px`;
      tempCard.style.height = `${fromRect.height}px`;

      // Copy card appearance
      const cardImg = fromElement.querySelector("img");
      if (cardImg) {
        const clonedImg = cardImg.cloneNode(true) as HTMLImageElement;
        tempCard.appendChild(clonedImg);
      }

      document.body.appendChild(tempCard);

      // Animate
      try {
        await animate(
          tempCard,
          {
            x: deltaX,
            y: deltaY,
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1],
          },
          {
            duration,
            ease: [0.16, 1, 0.3, 1],
          }
        );
      } finally {
        tempCard.remove();
        onComplete?.();
      }
    },
    [animate]
  );

  const animateMultipleCards = useCallback(
    async (animations: CardAnimationOptions[]) => {
      const promises = animations.map((anim, index) =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            animateCard({ ...anim, onComplete: resolve });
          }, index * 100); // Stagger by 100ms
        })
      );

      await Promise.all(promises);
    },
    [animateCard]
  );

  return {
    scope,
    animateCard,
    animateMultipleCards,
  };
}
