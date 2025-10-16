// Animation presets and configuration for the UNO game

import type { Transition, Variants } from "framer-motion";

// ============= TIMING =============
export const timing = {
  fast: 0.15,
  medium: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

// ============= EASING =============
export const easing = {
  easeOut: [0.16, 1, 0.3, 1],
  easeIn: [0.9, 0, 0.8, 0.2],
  bounce: [0.68, -0.55, 0.265, 1.55],
  spring: { type: "spring", stiffness: 300, damping: 30 },
  softSpring: { type: "spring", stiffness: 100, damping: 20 },
} as const;

// ============= CARD ANIMATIONS =============

// Card being drawn from deck to hand
export const cardDrawAnimation: Variants = {
  initial: { scale: 0.8, opacity: 0, rotateY: 180 },
  animate: {
    scale: 1,
    opacity: 1,
    rotateY: 0,
    transition: { duration: timing.medium, ease: easing.easeOut }
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: timing.fast }
  }
};

// Card being played from hand to discard
export const cardPlayAnimation: Variants = {
  initial: { scale: 1, y: 0, rotate: 0 },
  animate: {
    scale: [1, 1.1, 1],
    y: [0, -10, 0],
    rotate: [0, 5, 0],
    transition: { duration: timing.medium, ease: easing.easeOut }
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: { duration: timing.fast }
  }
};

// Card hover effect
export const cardHoverAnimation = {
  initial: { y: 0, scale: 1 },
  hover: {
    y: -12,
    scale: 1.05,
    transition: { duration: timing.fast, ease: easing.easeOut }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

// ============= UI ANIMATIONS =============

// Fade in/out
export const fadeAnimation: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: timing.medium } },
  exit: { opacity: 0, transition: { duration: timing.fast } }
};

// Slide from bottom
export const slideUpAnimation: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: timing.medium, ease: easing.easeOut }
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { duration: timing.fast }
  }
};

// Scale pop-in
export const scaleAnimation: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: timing.medium, ease: easing.bounce }
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: { duration: timing.fast }
  }
};

// ============= PLAYER ANIMATIONS =============

// Player turn indicator pulse
export const pulseAnimation: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Shake animation (for reactions)
export const shakeAnimation: Variants = {
  initial: { x: 0 },
  shake: {
    x: [-10, 10, -10, 10, -5, 5, 0],
    transition: { duration: 0.5 }
  }
};

// Bounce animation (for celebrations)
export const bounceAnimation: Variants = {
  initial: { y: 0, scale: 1 },
  bounce: {
    y: [0, -20, 0, -10, 0],
    scale: [1, 1.1, 1, 1.05, 1],
    transition: { duration: 0.6, ease: easing.easeOut }
  }
};

// ============= MODAL ANIMATIONS =============

export const modalBackdropAnimation: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: timing.fast } },
  exit: { opacity: 0, transition: { duration: timing.fast } }
};

export const modalContentAnimation: Variants = {
  initial: { scale: 0.9, opacity: 0, y: 20 },
  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { duration: timing.medium, ease: easing.easeOut }
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    y: 20,
    transition: { duration: timing.fast }
  }
};

// ============= STAGGER ANIMATIONS =============

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: timing.medium, ease: easing.easeOut }
  }
};

// ============= LOADING ANIMATIONS =============

export const spinnerAnimation: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// ============= HELPER FUNCTIONS =============

// Generate random rotation for cards
export const randomRotation = () => Math.random() * 10 - 5;

// Calculate arc position for cards in hand
export function calculateArcPosition(index: number, total: number, radius: number = 800) {
  const angle = (Math.PI / 3) * ((index / (total - 1 || 1)) - 0.5);
  const x = Math.sin(angle) * radius;
  const y = Math.cos(angle) * radius - radius;
  const rotation = (angle * 180) / Math.PI;

  return { x, y, rotation };
}

// Calculate position for circular player arrangement
export function calculateCircularPosition(
  index: number,
  total: number,
  radius: number = 250,
  offsetAngle: number = -90 // Start at top
) {
  const angle = (2 * Math.PI * index) / total + (offsetAngle * Math.PI / 180);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return { x, y };
}
