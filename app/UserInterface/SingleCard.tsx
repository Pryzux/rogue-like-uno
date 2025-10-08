import type { Card, CardColor, CardType } from '~/game/types/Card';

//type used to populate a map
type CardKey = `${CardColor}_${CardType}`;

//map of color_cardType pairs
const cardImages: Record<CardKey, string> = {
    red_zero: '/UIResources/unoCard-back.png',
    red_one: '/UIResources/unoCard-back.png',
    red_two: '/UIResources/unoCard-back.png',
    red_three: '/UIResources/unoCard-back.png',
    red_four: '/UIResources/unoCard-back.png',
    red_five: '/UIResources/unoCard-back.png',
    red_six: '/UIResources/unoCard-back.png',
    red_seven: '/UIResources/unoCard-back.png',
    red_eight: '/UIResources/unoCard-back.png',
    red_nine: '/UIResources/unoCard-back.png',
    red_skip: 'public/redskip.png',
    red_reverse: 'public/unoCard-back.png',
    red_draw2: '/UIResources/unoCard-back.png',
    red_wild: '/UIResources/unoCard-back.png', //never used
    red_wildDraw4: '/UIResources/unoCard-back.png', //never used
    blue_zero: '/UIResources/unoCard-back.png',
    blue_one: '/UIResources/unoCard-back.png',
    blue_two: '/UIResources/unoCard-back.png',
    blue_three: '/UIResources/unoCard-back.png',
    blue_four: '/UIResources/unoCard-back.png',
    blue_five: '/UIResources/unoCard-back.png',
    blue_six: '/UIResources/unoCard-back.png',
    blue_seven: '/UIResources/unoCard-back.png',
    blue_eight: '/UIResources/unoCard-back.png',
    blue_nine: '/UIResources/unoCard-back.png',
    blue_skip: '/UIResources/unoCard-back.png',
    blue_reverse: '/UIResources/unoCard-back.png',
    blue_draw2: '/UIResources/unoCard-back.png',
    blue_wild: '/UIResources/unoCard-back.png', //never used
    blue_wildDraw4: '/UIResources/unoCard-back.png', //never used
    yellow_zero: '/UIResources/unoCard-back.png',
    yellow_one: '/UIResources/unoCard-back.png',
    yellow_two: '/UIResources/unoCard-back.png',
    yellow_three: '/UIResources/unoCard-back.png',
    yellow_four: '/UIResources/unoCard-back.png',
    yellow_five: '/UIResources/unoCard-back.png',
    yellow_six: '/UIResources/unoCard-back.png',
    yellow_seven: '/UIResources/unoCard-back.png',
    yellow_eight: '/UIResources/unoCard-back.png',
    yellow_nine: '/UIResources/unoCard-back.png',
    yellow_skip: '/UIResources/unoCard-back.png',
    yellow_reverse: '/UIResources/unoCard-back.png',
    yellow_draw2: '/UIResources/unoCard-back.png',
    yellow_wild: '/UIResources/unoCard-back.png', //never used
    yellow_wildDraw4: '/UIResources/unoCard-back.png', //never used
    green_zero: '/UIResources/unoCard-back.png',
    green_one: '/UIResources/unoCard-back.png',
    green_two: '/UIResources/unoCard-back.png',
    green_three: '/UIResources/unoCard-back.png',
    green_four: '/UIResources/unoCard-back.png',
    green_five: '/UIResources/unoCard-back.png',
    green_six: '/UIResources/unoCard-back.png',
    green_seven: '/UIResources/unoCard-back.png',
    green_eight: '/UIResources/unoCard-back.png',
    green_nine: '/UIResources/unoCard-back.png',
    green_skip: '/UIResources/unoCard-back.png',
    green_reverse: '/UIResources/unoCard-back.png',
    green_draw2: '/UIResources/unoCard-back.png',
    green_wild: '/UIResources/unoCard-back.png', //never used
    green_wildDraw4: '/UIResources/unoCard-back.png', //never used
    //TODO: sunk cost- added png's, later today I will figure out another route to take OR I will painfully add pngs
    black_zero: '/UIResources/unoCard-back.png',
    black_one: '/UIResources/unoCard-back.png',
    black_two: '/UIResources/unoCard-back.png',
    black_three: '/UIResources/unoCard-back.png',
    black_four: '/UIResources/unoCard-back.png',
    black_five: '/UIResources/unoCard-back.png',
    black_six: '/UIResources/unoCard-back.png',
    black_seven: '/UIResources/unoCard-back.png',
    black_eight: '/UIResources/unoCard-back.png',
    black_nine: '/UIResources/unoCard-back.png',
    black_skip: '/UIResources/unoCard-back.png',
    black_reverse: '/UIResources/unoCard-back.png',
    black_draw2: '/UIResources/unoCard-back.png',
    black_wild: 'public/wild.png', //wild card used, since wild card is defined as black within deck creation
    black_wildDraw4: 'public/wildDraw4.png', //wild draw4 used, since wild card is defined as black within deck creation

    black_deck: 'UIResources/unoCard-back.png', // the draw deck

    //throwaway components as a new item has been added to card type:
    red_number: '/UIResources/unoCard-back.png', //never used
    blue_number: '/UIResources/unoCard-back.png', //never used
    yellow_number: '/UIResources/unoCard-back.png', //never used
    black_number: '/UIResources/unoCard-back.png', //never used
    green_number: '/UIResources/unoCard-back.png', //never used



};

const numberToType: Record<number, string> = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
};



//based on the color and type of card provided, the right png path is provided
function determineCardType(color: string, typeOrValue: string | number, id: number | undefined): string {

    //handling card types where type: number could mean zero-nine, so that I don't need to change the structure of the png lookup
    let typeString: string;

    if (typeof typeOrValue === "number") {

        typeString = numberToType[id!];
    }
    else {
        typeString = typeOrValue;
    }
    const key = `${color}_${typeString}` as CardKey;
    const img = cardImages[key];
    return (img)
}

//determineCardType(card.color, card.type)
//takes in a Card type, returns an image 
export default function SingleCard({card, onClick}) {



    return (
        <button onClick={onClick} className="png-box inline-flex w-24 h-36 items-center justify-center overflow-hidden rounded-xl border border-neutral-700 p-0">
            <img src={determineCardType(card.color, card.type, card.value)}
                alt="Standard back of Uno Card"
                className="block w-24 h-36 object-contain" />

        </button>
    );

}