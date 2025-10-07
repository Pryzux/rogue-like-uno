import type { Card } from "~/game/types/Card";
import SingleCard from "./SingleCard";


//take in a card array, call 
export default function Hand({ hand }: { hand: Card[] }) {
    // TODO: Implement Hand
    return (
        hand.map((card: Card) => (
            <SingleCard key={card.id} {...card} />
        ))
    );
}