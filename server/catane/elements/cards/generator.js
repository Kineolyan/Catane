import ScoreCard from 'server/catane/elements/cards/score';
import { idGenerator } from 'server/core/game/util';

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