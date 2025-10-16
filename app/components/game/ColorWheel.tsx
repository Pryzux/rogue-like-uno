// Modern color picker for wild cards - circular wheel design

import { motion, AnimatePresence } from "framer-motion";
import type { CardColor } from "~/game/types/Card";
import { modalBackdropAnimation, modalContentAnimation } from "~/utils/animations";

interface ColorWheelProps {
  cardId: string;
  onSelectColor: (cardId: string, color: CardColor) => void;
  onClose?: () => void;
}

const colors: Array<{ value: CardColor; label: string; bg: string; hover: string }> = [
  { value: "red", label: "Red", bg: "bg-red-500", hover: "hover:bg-red-600" },
  { value: "yellow", label: "Yellow", bg: "bg-yellow-400", hover: "hover:bg-yellow-500" },
  { value: "green", label: "Green", bg: "bg-green-500", hover: "hover:bg-green-600" },
  { value: "blue", label: "Blue", bg: "bg-blue-500", hover: "hover:bg-blue-600" },
];

export default function ColorWheel({ cardId, onSelectColor, onClose }: ColorWheelProps) {
  const handleSelect = (color: CardColor) => {
    onSelectColor(cardId, color);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        variants={modalBackdropAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={handleBackdropClick}
      >
        <motion.div
          className="relative"
          variants={modalContentAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Main container */}
          <div className="relative flex flex-col items-center justify-center p-8">
            {/* Title */}
            <motion.h2
              className="mb-8 text-2xl font-bold text-white text-center drop-shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Choose a Color
            </motion.h2>

            {/* Color wheel */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96">
              {/* Center wild card */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="w-24 h-36 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl flex items-center justify-center">
                  <img
                    src="/wild.png"
                    alt="Wild card"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </motion.div>

              {/* Color buttons in circular arrangement */}
              {colors.map((color, index) => {
                const angle = (index * Math.PI) / 2 - Math.PI / 4; // Start from top-left
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.button
                    key={color.value}
                    className={`absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full ${color.bg} ${color.hover}
                      shadow-2xl flex items-center justify-center font-bold text-white text-lg
                      transition-all duration-200 transform
                      focus:outline-none focus:ring-4 focus:ring-white/50`}
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      delay: 0.3 + index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(color.value)}
                    aria-label={`Select ${color.label}`}
                  >
                    <span className="drop-shadow-md">{color.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Helper text */}
            <motion.p
              className="mt-8 text-white/70 text-sm text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Click a color or press 1-4 on your keyboard
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
