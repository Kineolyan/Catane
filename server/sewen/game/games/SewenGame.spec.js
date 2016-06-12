import SewenGame from 'server/sewen/game/games/SewenGame';

import _ from 'lodash';
import { MockSocket } from 'server/core/com/mocks';
import BasePlayer from 'server/core/game/players/player';
import SewenPlayer from 'server/sewen/game/players/SewenPlayer';

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

	xdescribe('#start', function() {
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

		it('creates all cards from their definitions', function() {
			expect(this.game._cards).toBeDefined();
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
	});
});
