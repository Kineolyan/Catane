import { MockSocket } from '../../com/mocks';

import Games from './games';
import Player from '../players/players';

describe('Games', function() {
	beforeEach(function() {
		this.games = new Games();
	});

	describe("on creation", function() {
		it('has no games', function() {
			expect(this.games.list()).toBeEmpty(0);
		});
	});

	describe('#register', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.player = new Player(this.client);
			this.games.register(this.player);
		});

		it('makes client listen to "game:create"', function() {
			expect(this.client).toBeListeningTo('game:create');
		});

		it('makes client listen to "game:list"', function() {
			expect(this.client).toBeListeningTo('game:list');
		});
	});

	describe('#list', function() {
		beforeEach(function() {
			this.gamesList = [];
			for (let i = 0; i < 3; i+= 1) { this.gamesList.push(this.games.create()); }
		});

		it('lists 3 games', function() {
			var gameIds = Array.from(this.gamesList, (game) => game.id);
			expect(this.games.list()).toEqual(gameIds);
		});
	});

	describe('with a client and games', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.player = new Player(this.client);
			this.games.register(this.player);

			for (let i = 0; i < 3; i+= 1) { this.games.create(); }
		});

		describe('->game:create', function() {
			beforeEach(function() {
				this.client.receive('game:create', null);
			});

			it('has a new game registered', function() {
				expect(this.games._games).toHaveSize(4);
			});

			it('sends id of the game', function() {
				var message = this.client.lastMessage('game:create');
				expect(message.game.toString()).toMatch(/^[0-9]+$/);
			});
		});

		describe('->game:list', function() {
			beforeEach(function() {
				this.client.receive('game:list', null);
			});

			it('sends the list of games ids', function() {
				var message = this.client.lastMessage('game:list');
				expect(message.games).toEqual(this.games.list());
			});
		});
	});

});