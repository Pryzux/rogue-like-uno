import type { JSX } from 'react';
import type { Card, CardColor, CardType } from '~/game/types/Card';

//type used to populate a map
type CardKey = `${CardColor}_${CardType}`;

//map of color_cardType pairs
const cardImages: Partial<Record<CardKey, string>> = {
    red_zero: 'redzero.png',
    red_one: 'redone.png',
    red_two: 'redtwo.png',
    red_three: 'redthree.png',
    red_four: 'redfour.png',
    red_five: 'redfive.png',
    red_six: 'redsix.png',
    red_seven: 'redseven.png',
    red_eight: 'redeight.png',
    red_nine: 'rednine.png',
    red_skip: 'redskip.png',
    red_reverse: 'redreverse.png',
    red_draw2: 'reddraw2.png',
    red_wild: 'public/unoCard-back.png',  //never used
    red_wildDraw4: 'public/unoCard-back.png',  //never used
    blue_zero: 'bluezero.png',
    blue_one: 'blueone.png',
    blue_two: 'bluetwo.png',
    blue_three: 'bluethree.png',
    blue_four: 'bluefour.png',
    blue_five: 'bluefive.png',
    blue_six: 'bluesix.png',
    blue_seven: 'blueseven.png',
    blue_eight: 'blueeight.png',
    blue_nine: 'bluenine.png',
    blue_skip: 'blueskip.png',
    blue_reverse: 'bluereverse.png',
    blue_draw2: 'bluedraw2.png',
    blue_wild: 'unoCard-back.png', //never used
    blue_wildDraw4: 'unoCard-back.png', //never used
    yellow_zero: 'yellowzero.png',
    yellow_one: 'yellowone.png',
    yellow_two: 'yellowtwo.png',
    yellow_three: 'yellowthree.png',
    yellow_four: 'yellowfour.png',
    yellow_five: 'yellowfive.png',
    yellow_six: 'yellowsix.png',
    yellow_seven: 'yellowseven.png',
    yellow_eight: 'yelloweight.png',
    yellow_nine: 'yellownine.png',
    yellow_skip: 'yellowskip.png',
    yellow_reverse: 'yellowreverse.png',
    yellow_draw2: 'yellowdraw2.png',
    yellow_wild: 'unoCard-back.png', //never used
    yellow_wildDraw4: 'unoCard-back.png', //never used
    green_zero: 'greenzero.png',
    green_one: 'greenone.png',
    green_two: 'greentwo.png',
    green_three: 'greenthree.png',
    green_four: 'greenfour.png',
    green_five: 'greenfive.png',
    green_six: 'greensix.png',
    green_seven: 'greenseven.png',
    green_eight: 'greeneight.png',
    green_nine: 'greennine.png',
    green_skip: 'greenskip.png',
    green_reverse: 'greenreverse.png',
    green_draw2: 'greendraw2.png',

    black_wild: 'public/wild.png', //wild card used, since wild card is defined as black within deck creation
    black_wildDraw4: 'public/wildDraw4.png', //wild draw4 used, since wild card is defined as black within deck creation

    black_deck: 'unoCard-back.png', // the draw deck
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
export function determineCardType(color: string, typeOrValue: string, value: number | undefined): string {
    //handling card types where type: number could mean zero-nine, so that I don't need to change the structure of the png lookup
    let typeString: string;

    if (typeOrValue === "number") {
        if (value !== undefined) {
            typeString = numberToType[value];
        }
    }
    else {
        typeString = typeOrValue;
    }

    const key = `${color}_${typeString!}` as CardKey;
    const img = cardImages[key]!;
    return (img)
}

type SingleCardProps = {
    card: Card;
    onClick?: () => void;
    isPlayable?: boolean;
    isClickable?: boolean;
    isLarge?: boolean
    currentColor?: string
}

//takes in a Card type, onClick, whether a card is playable and whether the card  returns an image 
//TODO: remove pre-set boolean values when using this- but values must be set somewhere 
export default function SingleCard({ card, onClick, isPlayable = false, isClickable = true, isLarge = false, currentColor = '' }: SingleCardProps): JSX.Element {

    //if a card is not clickable, nothing happens to the image
    //if a card is clickable, depending on whether it can be played(isPlayable as filter), the image will move when the cursor navigates to it or the images is faded
    const classes = [
        isClickable && "cursor-pointer hover:scale-110 transition-transform",
        isClickable && isPlayable && "ring-2 ring-green-400",
        isClickable && !isPlayable && "cursor-not-allowed",
    ]
        //turns the classes array into a usable CSS class string
        .filter(Boolean)
        .join(" ");

    let sizeClasses = ''
    if (isLarge) {
        sizeClasses += 'w-26 h-auto'
    } else {
        sizeClasses += 'w-16 h-24'
    }

    let wildColorOverlay = ''
    let wildImageOverlay = ''

    const colorClasses: Record<CardColor, string> = {
        red: "bg-red-500/60",
        blue: "bg-blue-500/70",
        green: "bg-green-500/60",
        yellow: "bg-yellow-500/60",
        black: ""
    };

    // CurrentColor should only be set if the card is a wild card (to show the color the player picked)
    if (card.type.includes('wild') && isLarge && currentColor) {
        wildColorOverlay = colorClasses[currentColor as CardColor]
        wildImageOverlay = 'mix-blend-overlay'
    }

    return (
        <div className={`${wildColorOverlay}`}>
            <img
                src={determineCardType(card.color, card.type, card.value)}
                alt="Standard back of Uno Card"
                className={`${classes} ${sizeClasses} object-contain ${wildImageOverlay}`}
                onClick={isClickable ? onClick : undefined}
            />
        </div>
    );
}