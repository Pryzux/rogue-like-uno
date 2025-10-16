// Animated turn direction indicator - shows which way play is moving

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TurnIndicatorProps {
  direction: 1 | -1; // 1 = clockwise, -1 = counterclockwise
  playerCount: number;
}

export default function TurnIndicator({ direction, playerCount }: TurnIndicatorProps) {
  const [dots, setDots] = useState<number[]>([]);

  useEffect(() => {
    // Generate dots based on player count
    setDots(Array.from({ length: playerCount * 3 }, (_, i) => i));
  }, [playerCount]);

  const radius = 100; // Circle radius
  const circumference = 2 * Math.PI * radius;
  const dotSpacing = circumference / (playerCount * 3);

  return (
    <div className="relative w-52 h-52 flex items-center justify-center">
      {/* Center label */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          className="text-white drop-shadow-lg"
        >
          <motion.path
            d={direction === 1
              ? "M12 4l0 16m0 -16l4 4m-4 -4l-4 4" // Clockwise arrow
              : "M12 20l0 -16m0 16l4 -4m-4 4l-4 -4" // Counter-clockwise arrow
            }
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <span className="mt-2 text-xs text-white/70 font-medium">
          {direction === 1 ? "Clockwise" : "Counter"}
        </span>
      </motion.div>

      {/* Animated dots circle */}
      <svg
        width="220"
        height="220"
        viewBox="0 0 220 220"
        className="absolute"
      >
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: direction === 1 ? 360 : -360 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "110px 110px" }}
        >
          {dots.map((_, index) => {
            const angle = (index / dots.length) * 2 * Math.PI - Math.PI / 2;
            const x = 110 + radius * Math.cos(angle);
            const y = 110 + radius * Math.sin(angle);

            // Create cycling colors
            const colorIndex = index % 4;
            const colors = [
              "#ef4444", // red
              "#facc15", // yellow
              "#22c55e", // green
              "#3b82f6", // blue
            ];

            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={colors[colorIndex]}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </motion.g>
      </svg>

      {/* Direction change indicator */}
      <motion.div
        key={direction}
        className="absolute inset-0 rounded-full border-4 border-white/20"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}
