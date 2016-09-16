import SewenGame from 'server/sewen/game/games/SewenGame';

import _ from 'lodash';
import { MockSocket } from 'server/core/com/mocks';
import BasePlayer from 'server/core/game/players/player';
import SewenPlayer from 'server/sewen/game/players/SewenPlayer';
import {GameEnv} from 'server/sewen/game/games/game-spec.starter';
import cities from 'server/sewen/elements/cities/cities';

describe('SewenGame', function() {
	beforeEach(function() {
		this.game = new SewenGame(1);
	});

	describe('#constructor', function() {
		it('has a unique id', function() {
			expect(this.game.id).toEqual(1);
		});

		it('requires 2 players minimum', function() {
			expect(this.game._options.minPlayers).toEqual(3);
		});

		it('accepts a maximum of 7 players', function() {
			expect(this.game._options.maxPlayers).toEqual(7);
		});
	});

	describe('#createGamePlayer', function() {
		it('creates SewenPlayers', function() {
			const p = {};
			const player = this.game.createGamePlayer(p);
			expect(player).toBeA(SewenPlayer);
		});
	});

	describe('#start', function() {
		beforeEach(function() {
      this.env = new GameEnv();
      this.env.createLocalGame(3);
      this.env.start();
			this.game = this.env.game;
		});

		it('generates the deck sets for each age', function() {
			const ages = Object.keys(this.game._decks).map(v => parseInt(v, 10));
			expect(ages).toHaveLength(3);
			expect(ages).toHaveMembers([1, 2, 3]);
		});

		it('generates decks at each age for each player', function() {
			_.forEach(this.game._decks, decks => expect(decks).toHaveLength(3)); // Two players in the game
		});

		it('creates decks that all have 7 cards', function() {
			_(this.game._decks)
				.values()
				.flatten()
				.forEach(deck => expect(deck).toHaveLength(7))
				.run();
		});

		it('places the players on a map', function() {
			const playerIds = this.env.players.map(p => p.id);
			expect(this.game._playerOrder).toHaveMembers(playerIds);
		});

		it('initializes age and deck cursors', function() {
			expect(this.game._age).toEqual(1);
			expect(this.game._deckCursor).toEqual(0);
		});

		it('gives 3 coins to each player', function() {
			this.env.players.forEach(p => {
				expect(p.player.coins).toEqual(3);
			});
		});
	});

	describe('->game:start', function() {
		beforeEach(function() {
      this.env = new GameEnv();
      this.env.createLocalGame(3);
      this.env.start();

			const p = this.env.players[0];
			this.player = p.player;
			this.message = p.client.lastMessage('game:start');
		});

		it('sends a message to each player', function() {
			this.env.players.forEach(p => {
				const message = p.client.lastMessage('game:start');
				expect(message).not.toBeUndefined();
			});
		});

		it('sends player order and cities', function() {
			expect(this.message.players.map(desc => desc.id)).toHaveMembers([1, 2, 3]);
			expect(cities).toIncludeMembers(this.message.players.map(desc => desc.city));
			this.message.players.map(desc => desc.face).forEach(face => {
				expect(face).toBeIn(['A', 'B']);
			});
		});
	});

	describe('->play:turn:new', function() {
		beforeEach(function() {
      this.env = new GameEnv();
      this.env.createLocalGame(3);
      this.env.start();

			const p = this.env.players[0];
			this.player = p.player;
			this.message = p.client.lastMessage('play:turn:new');
		});

		it('sends a message to each player', function() {
			this.env.players.forEach(p => {
				const message = p.client.lastMessage('play:turn:new');
				expect(message).not.toBeUndefined();
			});
		});

		it('sends the current age', function() {
			expect(this.message.age).toEqual(1);
		});

		it('sends player deck', function() {
			const playerDeck = this.env.game.getPlayerDeck(this.player);
			expect(this.message.deck).toHaveMembers(playerDeck.map(card => card.name));
		});

		it('sends statuses for all players', function() {
			const playerIds = this.env.players.map(p => p.id);
			expect(_.keys(this.message.players)).toHaveMembers(playerIds);

			// At start, all have empty cards and 3 coins
			_.forEach(this.message.players, status => {
				expect(status).toEqual({
					coins: 3,
					cards: []
				});
			});
		});
	});

	describe('#playCard', function() {
		beforeEach(function() {
      this.env = new GameEnv();
      this.env.createLocalGame(3);
      this.env.start();
		});

		describe('for valid player and card', function() {
			beforeEach(function() {
				this.player = this.env.players[0].player;
				this.playerDeck = this.env.game.getPlayerDeck(this.player);
				this.initialDeck = this.playerDeck.slice();
				this.card = this.initialDeck.find(card => _.isEmpty(card.cost)); // OK for age I
				expect(this.card).not.toBe(undefined);
				this.env.game.playCard(this.player, this.card.name, []);
			});

			it('does not change the player', function() {
				expect(this.player.cards).not.toHaveKey(this.card.name);
			});

			it('stores player action for end of turn', function() {
				const actions = _(this.env.game._turnActions).values().map('card').value();
				expect(actions).toContain(this.card);
			});

			describe('when all players played', function() {
				beforeEach(function() {
					[1, 2].forEach(i => {
						const player = this.env.players[i].player;
						const card = _.find(this.env.game.getPlayerDeck(player), card => _.isEmpty(card.cost));
						this.env.game.playCard(player, card.name, []);
					});
				});

				it('adds the named card to the player', function() {
					expect(this.player.cards[this.card.name]).toEqual(this.card);
				});

				it('removes the card from the player deck', function() {
					const countCard = deck => _(deck)
						.filter(card => card.name === this.card.name)
						.size();
					expect(countCard(this.playerDeck)).toEqual(countCard(this.initialDeck) - 1);
				});

				it('has no dropped cards', function() {
					expect(this.env.game._droppedCards).toBeEmpty();
				});
			});
		});
	});

	describe('#dropCard', function() {
		beforeEach(function() {
      this.env = new GameEnv();
      this.env.createLocalGame(3);
      this.env.start();
		});

		describe('for valid player and card', function() {
			beforeEach(function() {
				this.player = this.env.players[0].player;
				this.playerDeck = this.env.game.getPlayerDeck(this.player);
				this.initialDeck = this.playerDeck.slice();
				this.card = this.initialDeck[0];
				this.env.game.dropCard(this.player, this.card.name);
			});

			it('does not change the player', function() {
				expect(this.player.cards).not.toHaveKey(this.card.name);
			});

			it('stores player action for end of turn', function() {
				const actions = _(this.env.game._turnActions).values().map('card').value();
				expect(actions).toContain(this.card);
			});

			describe('when all players played', function() {
				beforeEach(function() {
					[1, 2].forEach(i => {
						const player = this.env.players[i].player;
						const card = _.find(
							this.env.game.getPlayerDeck(player),
							card => card.name !== this.card.name
						); // Use a different card to ease final test
						this.env.game.dropCard(player, card.name);
					});
				});

				it('does not give the card to the player', function() {
					expect(this.player.cards).not.toHaveKey(this.card.name);
				});

				it('gives 3 coins to the player', function() {
					expect(this.player.coins).toEqual(6); // initial 3 + 3 gained for the card
				});

				it('removes the card from the player deck', function() {
					const countCard = deck => _(deck)
						.filter(card => card.name === this.card.name)
						.size();
					expect(countCard(this.playerDeck)).toEqual(countCard(this.initialDeck) - 1);
				});

				it('contains player card among dropped cards', function() {
					expect(this.env.game._droppedCards).toContain(this.card);
				});
			});
		});

	});
});
