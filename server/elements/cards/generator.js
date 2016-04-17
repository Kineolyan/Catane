import ScoreCard from 'server/elements/cards/score';
import { idGenerator } from 'server/game/util';

export class CardGenerator {
	constructor() {
		this._generateId = idGenerator();
	}

	generate() {
		const id = this._generateId().toString();
		return new ScoreCard(id);
	}
}

export default CardGenerator;