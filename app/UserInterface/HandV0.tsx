import { GameLogic } from "~/game/gamelogic";
import type { Card } from "~/game/types/Card";
import SimpleCard from "./deprecatedsimpleCard";

type HandV0Props = {
    hand: Card[];
    isHuman: boolean;
    playerIndex: number
    playCardFn: (card: Card) => void;
}

export default function HandV0({ hand, isHuman, playerIndex, playCardFn }: HandV0Props) {
    const gameLogic = GameLogic.get();

    return (
        <div className="flex flex-wrap gap-1">
            {hand.map((card) => (
                <SimpleCard
                    key={card.id}
                    card={card}
                    onClick={() => {
                        if (isHuman && playerIndex === gameLogic.getCurrentUnoMatch().currentPlayerIndex) {
                            playCardFn(card)
                        };
                    }}
                />
            ))}
        </div>
    );
}