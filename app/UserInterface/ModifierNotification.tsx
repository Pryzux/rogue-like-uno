import { useEffect, useState } from "react";
import type { Game } from "../game/types/Game";
import { motion, AnimatePresence } from "framer-motion";


interface ModifierNotificationProps {
    gameState: Game;
    setGameState: React.Dispatch<React.SetStateAction<Game>>;
}


export function ModifierNotification({ gameState, setGameState }: ModifierNotificationProps) {
    const [alerts, setAlerts] = useState<ModifierNotification[]>([]);

    // push to queue
    useEffect(() => {
        if (gameState.modifierAlert) {
            const newAlert: ModifierNotification = {
                id: Date.now(),
                message: gameState.modifierAlert,
            };
            setAlerts(prev => [...prev, newAlert]);

            // reset the gamestate to null - so can repush
            setGameState(prev => ({ ...prev, modifierAlert: null }));
        }
    }, [gameState.modifierAlert, setGameState]);

    useEffect(() => {
        if (alerts.length === 0) return;

        const timers = alerts.map(alert =>
            setTimeout(() => {
                setAlerts(prev => prev.filter(a => a.id !== alert.id));
            }, 1200)
        );

        return () => timers.forEach(clearTimeout);
    }, [alerts]);

    return (
        <div className=" fixed top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-2 opacity-90">
            <AnimatePresence>
                {alerts.map(alert => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                        exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
                        className="glass-lite bg-amber-100 border border-amber-400 text-amber-900 px-6 py-3 rounded-xl shadow-md font-semibold"
                    >
                        {alert.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
