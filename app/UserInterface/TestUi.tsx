import { makeCard, type Card } from "../game/types/Card";
import Hand from "./Hand";
import SingleCard from "./SingleCard";

export function TestUi() {
    let hand: Card[] = []
    hand.push(makeCard('1', 'reverse', 'red', true));
    hand.push(makeCard('2', 'eight', 'blue', true));

    return (
        <div>
            <Hand hand={hand} />
            <SingleCard id={""} type={"reverse"} color={"red"} isFaceDown={true} />
        </div>
    )
}