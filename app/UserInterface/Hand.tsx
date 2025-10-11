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

    return (
        <div
            className="
                flex 
                flex-row 
                flex-nowrap 
                gap-2 
                overflow-x-auto 
                overflow-y-hidden 
                w-full 
                justify-center
                scrollbar-thin 
                scrollbar-thumb-amber-500 
                scrollbar-track-transparent
                snap-x 
                snap-mandatory
                px-2
                py-1
            "
        >
            {hand.map((card: Card) => (
                <div key={card.id} className="snap-center flex-shrink-0">
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
