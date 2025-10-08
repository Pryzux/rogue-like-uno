import { makeCard, type Card } from "../game/types/Card";
import Hand from "./Hand";

export function TestUi() {
    let hand: Card[] = []
    hand.push(makeCard('0', 'wild', 'black', true));
    //hand.push(makeCard('2', 'eight', 'blue', true));

    return (
        <div>
            <Hand hand={hand} />
            {/* <SingleCard id={""} type={"reverse"} color={"red"} /> */}
        </div>
    )
}