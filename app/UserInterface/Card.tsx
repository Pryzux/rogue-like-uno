import cardBack from './UIResources/unoCard-back.png';
//import redTest from './UIResources/redTest.png'
//import blueTest from './UIResources/blueTest.png'





//TODO: a function to take in the color of card and type of card, and show the right card
//TODO: are we comfortable with png files for each type of card? 
function determineCardType(props: { color: string, cardType: string }): string {
    return (cardBack)
}

export default function Card({ color, cardType }: { color: string; cardType: string }) {

    return (
        <div className="png-box">
            <img src={determineCardType({ color, cardType })} alt="Standard back of Uno Card" className="w-full h-full object-contain" />
        </div>
    );

}