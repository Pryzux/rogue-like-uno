import { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameLogic } from "~/game/gamelogic";
import type { Card } from "~/game/types/Card";
import SingleCard from "./SingleCard";
import { canPlayCard } from "~/game/deck";

type HandProps = {
    hand: Card[];
    onCardClick?: (card: Card) => void;
    isHuman?: boolean;
    playerIndex: number;
    playCardFn: (card: Card) => void;
};

export default function Hand({
    hand,
    onCardClick,
    isHuman,
    playerIndex,
    playCardFn,
}: HandProps) {
    const gameLogic = GameLogic.get();
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const previousHandSizeRef = useRef(hand.length);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const match = gameLogic.getCurrentUnoMatch();
    const topCard = match?.discardPile?.[0];
    const currentColor = match?.currentColor;
    const isCurrentPlayerTurn = match && playerIndex === match.currentPlayerIndex;

    useLayoutEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const previousSize = previousHandSizeRef.current;
        previousHandSizeRef.current = hand.length;

        if (hand.length <= previousSize) return;

        requestAnimationFrame(() => {
            if (!scrollContainerRef.current) return;
            const node = scrollContainerRef.current;
            const maxScrollLeft = Math.max(node.scrollWidth - node.clientWidth, 0);
            node.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
        });
    }, [hand.length]);

    useLayoutEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const updateOverflowState = () => {
            const node = scrollContainerRef.current;
            if (!node) return;
            const isContentOverflowing = node.scrollWidth > node.clientWidth + 1;
            setIsOverflowing(isContentOverflowing);
        };

        updateOverflowState();

        if (typeof ResizeObserver === "undefined") {
            return undefined;
        }

        const resizeObserver = new ResizeObserver(() => {
            updateOverflowState();
        });
        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }, [hand.length]);

    return (
            <div
                ref={scrollContainerRef}
                className="
                flex
                flex-row
                flex-nowrap
                gap-2
                overflow-x-auto
                overflow-y-hidden
                w-full
                h-28
                scrollbar-thin
                scrollbar-thumb-amber-500/30
                scrollbar-track-transparent
                px-2
                py-1
            "
                style={{
                    justifyContent: isOverflowing ? "flex-start" : "center",
                }}
        >
            <AnimatePresence mode="popLayout">
                {hand.map((card: Card, index: number) => (
                    <motion.div
                        key={card.id}
                        className="flex-shrink-0"
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                            y: -20
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.8,
                            x: 5,
                            y: -10,
                            transition: { duration: 0.1 }
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeOut"
                        }}
                        layout
                    >
                        <SingleCard
                            card={card}
                            onClick={() => {
                                if (
                                    isHuman &&
                                    playerIndex ===
                                    gameLogic.getCurrentUnoMatch().currentPlayerIndex
                                ) {
                                    playCardFn(card);
                                }
                            }}
                            isPlayable={
                                isHuman &&
                                isCurrentPlayerTurn &&
                                topCard &&
                                currentColor ?
                                    canPlayCard(card, topCard, currentColor) :
                                    false
                            }
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
