import { makeCard, type Card } from "../game/types/Card";
import Hand from "./Hand";
import Cards from "./simpleCard"
import SingleCard from "./SingleCard";

export function TestUi() {
    let hand: Card[] = []
    hand.push(makeCard('0', 'wild', 'black'));
    hand.push(makeCard('0', 'skip', 'red'));
    //hand.push(makeCard('2', 'eight', 'blue', true));

    return (
        <div>
            <Hand hand={hand} />
            {/* <Cards card={{ id: "", type: "reverse",color:"red"}} /> */}
            {/* <SingleCard card={makeCard('0', 'wild', 'black', true)} onClick={() => console.log("clicked")} /> */}

        </div>
    )
}