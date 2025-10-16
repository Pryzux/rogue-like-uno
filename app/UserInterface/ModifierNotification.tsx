import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Game } from "../game/types/Game";
import type { AlertNotification } from "~/game/types/Alert";
import { GameLogic } from "~/game/gamelogic";
import { cn } from "~/lib/utils";

interface ModifierNotificationProps {
    setNotification: React.Dispatch<React.SetStateAction<AlertNotification[]>>;
    gameState: Game;
    className?: string;
}

export function ModifierNotification({
    setNotification,
    gameState,
    className,
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
            }, 1700)
        );

        return () => timers.forEach(clearTimeout);
    }, [alerts, setNotification]);

    return (
        <div
            className={cn(
                "fixed top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-2 opacity-90 pointer-events-none",
                className,
            )}
        >
            <AnimatePresence>
                {alerts.map(alert => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: { duration: 0.25, ease: "easeOut" },
                        }}
                        exit={{
                            opacity: 0,
                            y: -12,
                            scale: 0.96,
                            transition: { duration: 0.2, ease: "easeIn" },
                        }}
                        className="relative flex items-center gap-3 rounded-2xl bg-white/95 px-6 py-3 font-semibold text-amber-900 shadow-[0_8px_30px_rgba(251,191,36,0.35)] backdrop-blur-sm ring-1 ring-amber-400/60"
                    >
                        <motion.span
                            className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-amber-200/60 via-amber-100/0 to-amber-300/40"
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.98, 1.05, 0.98] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <span className="relative z-10 text-sm font-semibold text-amber-900">
                            {alert.message}
                        </span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
