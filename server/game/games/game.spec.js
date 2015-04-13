import Game from './game';

import { MockSocket } from '../../com/mocks';
import Player from '../players/player';

describe('Game', function() {
	beforeEach(function() {
		this.game = new Game(1);
	});

	describe('after creation', function() {
		it('has id', function() {
			expect(this.game.id).toEqual(1);
		});

		it('has no players', function() {
			var players = Array.from(this.game.players, (player) => player);
			expect(players).toBeEmpty();
		});
	});

	describe('#add', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.player = new Player(this.client, 1);

			this.result = this.game.add(this.player);
		});

		it('returns true', function() {
			expect(this.result).toBe(true);
		});

		it('has player among game\'s player', function() {
			var players = Array.from(this.game.players, (player) => player);
			expect(players).toContain(this.player);
		});

		it('prevents from duplicates', function() {
			expect(this.game.add(this.player)).toBe(false);

			var players = Array.from(this.game.players, (player) => player);
			expect(players).toEqual([ this.player ]);
		});

		it('sets the player game to itself', function() {
			expect(this.player.game).toBe(this.game);
		});
	});

	describe('#remove', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.player = new Player(this.client, 1);

			expect(this.game.add(this.player)).toBe(true);
			this.result = this.game.remove(this.player);
		});

		it('returns true', function() {
			expect(this.result).toBe(true);
		});

		it('has no more players anymore', function() {
			expect(this.game.players).toHaveSize(0);
		});

		it('resets the player game to null', function() {
			expect(this.player.game).toBeUndefined();
		});

		it('returns false when removing unexisting item', function() {
			expect(this.game.remove(1)).toBe(false);
		});
	});

	describe('#start', function() {
		beforeEach(function() {
			this.clients = [ new MockSocket() ];
			this.players = [ new Player(this.clients[0], 1) ];

			expect(this.game.add(this.players[0])).toBe(true);
		});

		describe('with enough players', function() {
			beforeEach(function() {
				this.clients.push(new MockSocket());
				this.players.push(new Player(this.clients[1], 2));

				expect(this.game.add(this.players[1])).toBe(true);
				this.game.start();
			});

			describe('started multiple times', function() {
				it('throws an Error', function() {
					expect(() => this.game.start()).toThrowError(/already started/i);
				});
			});

		});

		describe('with not enough players', function() {
			it('fails with Error', function() {
				expect(() => this.game.start()).toThrowError(/not enough players/i);
			});
		});
	});
});
