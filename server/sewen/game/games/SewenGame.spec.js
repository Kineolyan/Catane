import SewenGame from 'server/sewen/game/games/SewenGame';

import _ from 'lodash';
import { MockSocket } from 'server/core/com/mocks';
import BasePlayer from 'server/core/game/players/player';
import SewenPlayer from 'server/sewen/game/players/SewenPlayer';

fdescribe('SewenGame', function() {
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
			this.clients = [];
			this.users = [];

			_.times(3, i => {
				this.clients.push(new MockSocket());
				this.users.push({ player: new BasePlayer(this.clients[i].toSocket(), 1 + i) });

				expect(this.game.add(this.users[i])).toBe(true);
			});
			this.game.start();
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
			expect(this.game._playerOrder).toHaveMembers([1, 2, 3]);
		});

		it('initializes age and deck cursors', function() {
			expect(this.game._age).toEqual(1);
			expect(this.game._deckCursor).toEqual(0);
		});
	});

	describe('#playCard', function() {
		beforeEach(function() {
			this.clients = [];
			this.users = [];

			_.times(3, i => {
				this.clients.push(new MockSocket());
				this.users.push({ player: new BasePlayer(this.clients[i].toSocket(), 1 + i) });

				expect(this.game.add(this.users[i])).toBe(true);
			});
			this.game.start();
		});

		describe('for valid player and card', function() {
			beforeEach(function() {
				this.player = this.users[0].player;
				this.initialDeck = this.game.getPlayerDeck(this.player).slice();
				this.card = this.initialDeck[0];
				this.game.playCard(this.player, this.card.name, []);
			});

			it('adds the named card to the player', function() {
				expect(this.player.cards[this.card.name]).toEqual(this.card);
			});

			it('removes the card from the player deck', function() {
				const countCard = deck => _(deck)
					.filter(card => card.name === this.card.name)
					.size();
				expect(countCard(this.game.getPlayerDeck(this.player))).toEqual(countCard(this.initialDeck) - 1);
			});
		});
	});
});
