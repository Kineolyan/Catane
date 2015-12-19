import ScoreCard from 'server/elements/cards/score';

export class CardGenerator {
	generate() {
		return new ScoreCard();
	}
}

export const cardGenerator = new CardGenerator();

export default CardGenerator;