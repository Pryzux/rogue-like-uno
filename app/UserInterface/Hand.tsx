import { GameLogic } from "~/game/gamelogic";
import type { Card } from "~/game/types/Card";
import SingleCard from "./SingleCard";

type HandProps = {
    hand: Card[];
    onCardClick?: (card: Card) => void;
    isHuman?: boolean;
    playerIndex: number;
    //isClickable?: boolean;
    //isPlayableFor?: (card: Card) => boolean;
    playCardFn: (card: Card) => void;
}

//takes in props for a hand of cards (a card array)
//TODO: boolean values are hard coded, will need to add logic elsewhere when calling Hand
export default function Hand({
    hand,
    onCardClick,
    isHuman,
    playerIndex,
    playCardFn
}: HandProps) {

    const gameLogic = GameLogic.get();

    return (
        <div className="flex flex-wrap gap-1">
            {hand.map((card: Card) => (
                <SingleCard key={card.id} card={card} onClick={() => {
                    if (isHuman && playerIndex === gameLogic.getCurrentUnoMatch().currentPlayerIndex) {
                        playCardFn(card)
                    };
                }} />
            ))}
        </div>
    );
}