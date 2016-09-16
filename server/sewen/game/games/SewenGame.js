import _ from 'lodash';

import { logger } from 'libs/log/logger';
import { assert, assertDefined } from 'libs/assertions';

import AGame from 'server/core/game/games/AGame';
import CardLoader from 'server/sewen/elements/cards/CardLoader';
import SewenPlayer from 'server/sewen/game/players/SewenPlayer';
import SewenReferee from 'server/sewen/game/referees/SewenReferee';
import cities from 'server/sewen/elements/cities/cities';

export class SewenGame extends AGame {
	constructor(id) {
		super(id, 3, 7);
	}

	static get name() {
		return 'sewen';
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

	generateCities() {
		const randomFace = () => Math.random() < 0.5 ? 'A' : 'B';
		return _(cities).shuffle().take(this._players.size)
			.map(city => ({ name: city, face: randomFace() }))
			.value();
	}

	initGame() {
		const players = _(Array.from(this._players.values()))
		this._playerOrder = players
			.map(player => player.id)
			.shuffle()
			.value();
		this._droppedCards = [];
		this.players.forEach(player => player.gainCoins(3));
		this._age = 1;

		const cities = this.generateCities();
		this.emit('game:start', {
			players: players.map((player, i) => ({
					id: player.id,
					city: cities[i].name,
					face: cities[i].face
				})).reduce((res, description) => {
					res[this.getPlayerIdx(description)] = description;
					return res;
				}, [])
		});
	}

	initAge() {
		this._deckCursor = 0;
	}

	initTurn() {
		this._turnActions = {};

		const playerStatuses = _.reduce(
			Array.from(this._players.values()),
			(statuses, player) => {
				statuses[player.id] = {
					cards: _(player.cards).values().map(card => card.name).value(),
					coins: player.coins
				};

				return statuses;
			},
			{}
		);
		this.players.forEach(player => {
			const playerDeck = this.getPlayerDeck(player);
			this.emit('play:turn:new', {
				age: this._age,
				players: playerStatuses,
				deck: playerDeck.map(card => card.name)
			});
		});
	}

	playCard(player, cardName, order) {
		const card = this.getCard(cardName);

		// Convert name of order to cards
		for (let usage of order) {
			usage.card = this.getCard(usage.card);
		}

		if (this._turnActions[player.id] !== undefined) {
			throw new Error(`Player ${player.name} already played`);
		}

		const playerDeck = this.getPlayerDeck(player);
		this._referee.playCard(player, playerDeck, card, order);

		this._turnActions[player.id] = {
			card, play: true
		};
		this.endTurnIfComplete();
	}

	dropCard(player, cardName) {
		const card = this.getCard(cardName);
		const playerDeck = this.getPlayerDeck(player);

		this._referee.dropCard(player, playerDeck, card);
		this._turnActions[player.id] = {
			card, play: false
		};
		this.endTurnIfComplete();
	}

	endTurnIfComplete() {
		if (_(this._playerOrder).every(playerId => this._turnActions[playerId])) {
			_.forEach(this._turnActions, ({play, card}, playerId) => {
				const player = Array.from(this.players.values()).find(p => p.id == playerId);
				if (play) {
					player.gainCard(card);
				} else {
					this._droppedCards.push(card);
					player.gainCoins(3);
				}

				// Remove the card from the deck
				const playerDeck = this.getPlayerDeck(player);
				const cardIdx = _.findIndex(playerDeck, { name: card.name }); // It may contain duplicates of the card
				assert(cardIdx >= 0, `Card ${card.name} not in player ${player.name} deck: ${playerDeck}`);
				playerDeck.splice(cardIdx, 1);
			});

			this.moveToNextTurn();
		}
	}

	moveToNextTurn() {
		// TODO code this method
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
