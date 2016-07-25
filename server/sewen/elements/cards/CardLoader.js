import _ from 'lodash';

import * as arrays from 'libs/collections/arrays';
import { makeCard } from 'server/sewen/elements/cards/Card';
import { Cards, Guildes } from 'server/sewen/elements/cards/cards';

export class CardLoader {
	constructor(cardByAge = 7) {
		this._nbCardsByAge = cardByAge;
	}

	/**
	 * Gets a card from its name,
	 * @param {String} name card name
	 * @returns {Card} wanted card or undefined if it does not exist
	 */
	getCard(name) {
		if (this._cards) {
			return this._cards[name];
		} else {
			throw new Error('Cards have never been loaded.');
		}
	}

	/**
	 * Loads the cards into the game
	 */
	loadCards() {
		this._guildCards = _(Guildes)
			.map((card, name) => makeCard(name, card))
			.value();
		const cards = _.map(Cards, (card, name) => makeCard(name, card));

		this._cards = {};
		this._guildCards.forEach(card => this._cards[card.name] = card);
		cards.forEach(card => this._cards[card.name] = card);
	}

	generateDecks(nbPlayers) {
		const cardsByAge = _(this._cards)
			.values()
			.filter(card => !card.isGuild())
			.reduce((ages, card) => {
				card.ages.forEach(age => {
					const ageCount = card.getCountFor(nbPlayers, age);
					if (ageCount > 0) {
						ages[age].push(...arrays.create(ageCount, () => card));
					}
				});

				return ages;
			}, { [1]: [], [2]: [], [3]: _(this._guildCards).shuffle().take(nbPlayers + 2).value() });

		return _.mapValues(cardsByAge, ageCards => _.chain(ageCards).shuffle().chunk(this._nbCardsByAge).value())
	}
}

export default CardLoader;