import type { Card } from "~/game/types/Card";
import SingleCard from "./SingleCard";

type HandProps = {
    hand: Card[];
    onCardClick?: (card: Card) => void;
    isClickable?: boolean;
    isPlayableFor?: (card: Card) => boolean;
}

//takes in props for a hand of cards (a card array)
//TODO: boolean values are hard coded, will need to add logic elsewhere when calling Hand
export default function Hand({
    hand,
    onCardClick,
    isClickable = true,
    isPlayableFor,
}: HandProps) {

    return (
        <div className="flex gap-2">
            {hand.map((card: Card) => (
                <SingleCard key={card.id} card={card} onClick={isClickable ? () => onCardClick?.(card) : undefined}
                    isClickable={isClickable}
                    isPlayable={isPlayableFor ? isPlayableFor(card) : true} />
            ))}
        </div>
    );
}