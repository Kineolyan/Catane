import { makeEnum } from 'libs/enum';

import { BasePlayerDecorator } from 'server/core/game/players/player';

export const Side = makeEnum(['OWN', 'LEFT', 'RIGHT']);

export class SewenPlayer extends BasePlayerDecorator {
	constructor(corePlayer) {
		super(corePlayer);
		this._cards = {};
	}

	get cards() {
		return this._cards;
	}

	hasCard(card) {
		return card.name in this._cards;
	}

	canGain(card) {
		return card.requires.some(cardName => cardName in this._cards);
	}

	gainCard(card) {
		this._cards[card.name] = card;
	}
}

export default SewenPlayer;