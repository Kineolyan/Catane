import { makeEnum } from 'libs/enum';
import { assert } from 'libs/assertions';

import { BasePlayerDecorator } from 'server/core/game/players/player';

export const Side = makeEnum(['OWN', 'LEFT', 'RIGHT']);

export class SewenPlayer extends BasePlayerDecorator {
	constructor(corePlayer) {
		super(corePlayer);
		this._cards = {};
		this._coins = 0;
	}

	get cards() {
		return this._cards;
	}

	get coins() {
		return this._coins;
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

	gainCoins(nbCoins) {
		assert(nbCoins > 0, `Negative nb of coins: ${nbCoins}`);

		this._coins += nbCoins;
	}
}

export default SewenPlayer;