import { useLayoutEffect, useRef, useState } from "react";
import { GameLogic } from "~/game/gamelogic";
import type { Card } from "~/game/types/Card";
import SingleCard from "./SingleCard";

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
            {hand.map((card: Card) => (
                <div key={card.id} className="flex-shrink-0">
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
                    />
                </div>
            ))}
        </div>
    );
}
