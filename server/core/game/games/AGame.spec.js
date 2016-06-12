import AGame from 'server/core/game/games/AGame';

import _ from 'lodash';
import { MockSocket } from 'server/core/com/mocks';
import BasePlayer, { BasePlayerDecorator } from 'server/core/game/players/player';

class TestGame extends AGame {

	createGamePlayer(corePlayer) {
		return new BasePlayerDecorator(corePlayer);
	}

	doStart() {
		this.startCalled = true;
	}

}

describe('AGame', function () {
	beforeEach(function () {
		this.game = new TestGame(1, 2, 2);
	});

	describe('after creation', function () {
		it('has id', function () {
			expect(this.game.id).toEqual(1);
		});

		it('has no players', function () {
			var players = Array.from(this.game.players, (player) => player);
			expect(players).toBeEmpty();
		});

		it('is not marked as started', function () {
			expect(this.game.isStarted()).toBe(false);
		});
	});

	describe('#add', function () {
		beforeEach(function () {
			this.client = new MockSocket();
			this.basePlayer = new BasePlayer(this.client.toSocket(), 1);
			this.user = { player: this.basePlayer };

			this.result = this.game.add(this.user);
		});

		it('returns true', function () {
			expect(this.result).toBe(true);
		});

		it('has player among game\'s player', function () {
			var players = Array.from(this.game.players, (player) => player);
			expect(players).toContain(this.user.player);
		});

		it('prevents from duplicates', function () {
			expect(this.game.add(this.user)).toBe(false);

			var players = Array.from(this.game.players, (player) => player);
			expect(players).toEqual([this.user.player]);
		});

		it('sets the player game to itself', function () {
			expect(this.user.player.game).toBe(this.game);
		});

		it('wraps the player to support game feature', function() {
			expect(this.user.player).toBeA(BasePlayerDecorator);
			expect(this.user.player._player).toBe(this.basePlayer);
		});
	});

	describe('#remove', function () {
		beforeEach(function () {
			this.client = new MockSocket();
			this.basePlayer = new BasePlayer(this.client.toSocket(), 1);
			this.user = { player: this.basePlayer };

			expect(this.game.add(this.user)).toBe(true);
			this.result = this.game.remove(this.user);
		});

		it('returns true', function () {
			expect(this.result).toBe(true);
		});

		it('has no more players anymore', function () {
			expect(this.game.players).toHaveSize(0);
		});

		it('resets the player game to null', function () {
			expect(this.user.player.game).toBeUndefined();
		});

		it('returns false when removing unexisting item', function () {
			expect(this.game.remove(1)).toBe(false);
		});

		it('unwraps the player from game feature', function() {
			expect(this.user.player).toBe(this.basePlayer);
		});
	});

	describe('#start', function () {
		beforeEach(function () {
			this.clients = [new MockSocket()];
			this.users = [{ player: new BasePlayer(this.clients[0].toSocket(), 1) }];

			expect(this.game.add(this.users[0])).toBe(true);
		});

		describe('with enough players', function () {
			beforeEach(function () {
				this.clients.push(new MockSocket());
				this.users.push({ player: new BasePlayer(this.clients[1].toSocket(), 2) });

				expect(this.game.add(this.users[1])).toBe(true);
				this.game.start();
			});

			it('is marked as started', function () {
				expect(this.game.isStarted()).toBe(true);
			});

			it('calls game start', function() {
				expect(this.game.startCalled).toBe(true);
			});

			describe('started multiple times', function () {
				it('throws an Error', function () {
					expect(() => this.game.start()).toThrowError(/already started/i);
				});
			});

		});

		describe('with not enough players', function () {
			it('fails with Error', function () {
				expect(() => this.game.start()).toThrowError(/not enough players/i);
			});
		});

		describe('with too many players', function () {
			beforeEach(function() {
				_.times(2, i => {
					this.clients.push(new MockSocket());
					this.users.push({ player: new BasePlayer(this.clients[1 + i].toSocket(), 10 + i) });

					expect(this.game.add(this.users[1 + i])).toBe(true);
				});
				expect(this.clients).toHaveLength(3);
			});

			it('fails with Error', function () {
				expect(() => this.game.start()).toThrowError(/too many players/i);
			});
		});
	});

	describe('#emit', function () {
		beforeEach(function () {
			this.clients = [new MockSocket(), new MockSocket()];
			this.users = this.clients.map((client, i) => ({ player: new BasePlayer(client.toSocket(), i + 1) }));
			for (let user of this.users) {
				this.game.add(user);
			}
		});

		it('broadcast to all players if none specified', function () {
			this.game.emit('test', 1);
			for (let client of this.clients) {
				expect(client.lastMessage('test')).toEqual(1);
			}
		});

		it('broadcast to all players but the one specified', function () {
			this.game.emit(this.users[0].player, 'test', 2);
			expect(this.clients[0].lastMessage('test')).toBeUndefined();
			expect(this.clients[1].lastMessage('test')).toEqual(2);
		});
	});
});