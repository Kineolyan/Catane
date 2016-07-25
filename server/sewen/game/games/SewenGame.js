import _ from 'lodash';

import { logger } from 'libs/log/logger';
import { assert, assertDefined } from 'libs/assertions';

import AGame from 'server/core/game/games/AGame';
import CardLoader from 'server/sewen/elements/cards/CardLoader';
import SewenPlayer from 'server/sewen/game/players/SewenPlayer';
import SewenReferee from 'server/sewen/game/referees/SewenReferee';

export class SewenGame extends AGame {
	constructor(id) {
		super(id, 3, 7);
	}

	createGamePlayer(corePlayer) {
		return new SewenPlayer(corePlayer);
	}

	doStart() {
		this._referee = new SewenReferee();
		this.generateDecks();
		logger.log(`decks: ${this._decks}`);
	}

	generateDecks() {
		this._cardLoader = new CardLoader();
		this._cardLoader.loadCards();
		this._decks = this._cardLoader.generateDecks(this._players.size);
		this._playerOrder = _(Array.from(this._players.values()))
			.map(player => player.id)
			.shuffle()
			.value();
		this._age = 1;
		this._deckCursor = 0;
	}

	playCard(player, cardName, order) {
		const card = this.getCard(cardName);

		// Convert name of order to cards
		for (let usage of order) {
			usage.card = this.getCard(usage.card);
		}

		const playerDeck = this.getPlayerDeck(player);
		this._referee.playCard(player, playerDeck, card, order);
		player.gainCard(card);

		// Remove the card from the deck
		const cardIdx = _.findIndex(playerDeck, { name: cardName }); // It may contain duplicates of the card
		assert(cardIdx >= 0, `Card ${cardName} not in player ${player.name} deck: ${playerDeck}`);
		playerDeck.splice(cardIdx, 1);
	}

	getCard(cardName) {
		const card = this._cardLoader.getCard(cardName);
		assertDefined(card, `Card ${cardName} does not exist`);
		return card;
	}

	getPlayerDeck(player) {
		const playerIdx = this._playerOrder.indexOf(player.id);
		assert(playerIdx >= 0, `Player ${player} not found`);

		const deckIdx = (this._deckCursor + playerIdx) % this._players.size;
		return this._decks[this._age][deckIdx];
	}
}

export default SewenGame;