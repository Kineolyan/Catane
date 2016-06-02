import _ from 'lodash';

import { logger } from 'libs/log/logger';
import { assertDefined } from 'libs/assertions';

import AGame from 'server/core/game/games/AGame';
import { makeCard } from 'server/sewen/elements/cards/Card';
import { Cards, Guildes } from 'server/sewen/elements/cards/cards';

const CARDS_BY_AGE = 7;
export class SewenGame extends AGame {
	constructor(id) {
		super(id, 2, 7);
	}

	doStart() {
		this._referee = new SewenReferee();
		this.generateDecks();
		logger.log(this._cards);
		logger.log(this._decks);
	}

	generateDecks() {
		const nbPlayers = this._players.size;

		const guildCards = _.chain(Guildes)
			.map((card, name) => makeCard(name, card))
			.take(nbPlayers)
			.value();
		const cards = _.map(Cards)
			.map((card, name) => makeCard(name, card))
			// FIXME Wrong step, it should generate enough cards wrt nb of players
			.filter(card => card.isForPlayer(nbPlayers))
			.value();
		this._cards = new Map();
		guildCards.forEach(card => this._cards.set(card.name, card));
		cards.forEach(card => this._cards.set(card.name, card));

		const cardsByAge = _.reduce(
			cards,
			(ages, card) => {
				card.ages.forEach(age => ages[age].push(card));
				return ages;
			},
			{ [1]: [], [2]: [], [3]: guildCards }
		);
		this._decks =  _.mapValues(cardsByAge, ageCards => _.chain(ageCards).shuffle().chunk(CARDS_BY_AGE).value());
	}

	playCard(player, cardName, order) {
		const card = this.getCard(cardName);

		// Convert name of order to cards
		for (let usage of order) {
			usage.card = this.getCard(usage.card);
		}

		this._referee.playCard(player, card, order);
		player.gainCard(card);
	}

	getCard(cardName) {
		const card = this._cards.get(cardName);
		assertDefined(card, `Card ${cardName} does not exist`);
		return card;
	}
}

export default SewenGame;