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
		this.initGame();
		this.initAge();
		this.initTurn();
	}

	generateDecks() {
		this._cardLoader = new CardLoader();
		this._cardLoader.loadCards();
		this._decks = this._cardLoader.generateDecks(this._players.size);
		logger.log(`decks: ${this._decks}`);
	}

	initGame() {
		this._playerOrder = _(Array.from(this._players.values()))
			.map(player => player.id)
			.shuffle()
			.value();
		this._droppedCards = [];
		this._age = 1;
	}

	initAge() {
		this._deckCursor = 0;
	}

	initTurn() {
		this._turnActions = [];
	}

	playCard(player, cardName, order) {
		const card = this.getCard(cardName);

		// Convert name of order to cards
		for (let usage of order) {
			usage.card = this.getCard(usage.card);
		}

		const playerDeck = this.getPlayerDeck(player);
		// TODO !! Can't play twice
		this._referee.playCard(player, playerDeck, card, order);

		this._turnActions[this.getPlayerIdx(player)] = {
			card, play: true
		};

		if (_.every(this._turnActions, choice => choice !== undefined)) { // Not the correct condition
			// Give cards to all players
		}
	}

	dropCard(player, cardName) {
		const card = this.getCard(cardName);
		const playerDeck = this.getPlayerDeck(player);

		this._referee.playCard(player, playerDeck, card, order);
		this._turnActions[this.getPlayerIdx(player)] = {
			card, play: false
		};
	}

	endTurnIfComplete() {
		if (_.every(this._turnActions, action => action !== undefined)) {
			_.forEach(this._turnActions, ({play, card}}, playerId) => {
				const player = null; // Get player
				if (play) {
					player.gainCard(card);
				} else {
					this._droppedCards.push(card);
				}

				// Remove the card from the deck
				const cardIdx = _.findIndex(playerDeck, { name: cardName }); // It may contain duplicates of the card
				assert(cardIdx >= 0, `Card ${cardName} not in player ${player.name} deck: ${playerDeck}`);
				playerDeck.splice(cardIdx, 1);
			});
		}
	}

	getCard(cardName) {
		const card = this._cardLoader.getCard(cardName);
		assertDefined(card, `Card ${cardName} does not exist`);
		return card;
	}

	getPlayerIdx(player) {
		const idx = this._playerOrder.indexOf(player.id);
		assert(idx >= 0, `Player ${player} not found`);
		return idx;
	}

	getPlayerDeck(player) {
		const playerIdx = this.getPlayerIdx(player);
		const deckIdx = (this._deckCursor + playerIdx) % this._players.size;
		return this._decks[this._age][deckIdx];
	}
}

export default SewenGame;
