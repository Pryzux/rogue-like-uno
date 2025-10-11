import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Game } from "../game/types/Game";
import type { AlertNotification } from "~/game/types/Alert";
import { GameLogic } from "~/game/gamelogic";

interface ModifierNotificationProps {
    setNotification: React.Dispatch<React.SetStateAction<AlertNotification[]>>;
    gameState: Game;
}

export function ModifierNotification({
    setNotification,
    gameState,
}: ModifierNotificationProps) {
    const [alerts, setAlerts] = useState<AlertNotification[]>([]);

    useEffect(() => {
        const alert = GameLogic.get().consumeModifierAlert();
        if (alert) {
            const newAlert: AlertNotification = {
                id: Date.now(),
                message: alert,
            };

            setAlerts(prev => [...prev, newAlert]);
            setNotification(prev => [...prev, newAlert]);
        }
    }, [gameState]);


    useEffect(() => {
        if (alerts.length === 0) return;

        const timers = alerts.map(alert =>
            setTimeout(() => {
                setAlerts(prev => prev.filter(a => a.id !== alert.id));
                setNotification(prev => prev.filter(a => a.id !== alert.id));
            }, 1200)
        );

        return () => timers.forEach(clearTimeout);
    }, [alerts, setNotification]);

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-2 opacity-90 pointer-events-none">
            <AnimatePresence>
                {alerts.map(alert => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.3 },
                        }}
                        exit={{
                            opacity: 0,
                            y: -10,
                            transition: { duration: 0.3 },
                        }}
                        className="glass-lite bg-amber-100 border border-amber-400 text-amber-900 px-6 py-3 rounded-xl shadow-md font-semibold"
                    >
                        {alert.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

