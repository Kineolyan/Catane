import * as starter from 'server/game/games/game-spec.starter.js';
import * as maps from '../../util/maps.js';

describe('Placement turn management', function() {
	beforeEach(function() {
		this.game = starter.createGame(2);
		this.players = this.game.players;

		this.startGame = function() {
			this.game.start();

			this.p1 = this.game.players[0];
			this.p2 = this.game.players[1];
		};
	});

	describe('on game started', function() {
		beforeEach(function() {
			this.startGame();
		});

		it('notifies all players of a new turn', function() {
			var firstPlayerId = this.p1.id;
			for (let p of this.players) {
				expect(p.client.lastMessage('play:turn:new')).toEqual({ player: firstPlayerId });
			}
		});

		it('notifies that the players must pick the initial locations', function() {
			for (let p of this.players) {
				expect(p.client.lastMessage('game:prepare')).not.toBeUndefined();
			}
		});
	});

	describe('colony picking', function() {
		beforeEach(function() {
			this.startGame();
		});

		describe('of valid location', function() {
			beforeEach(function() {
				this.pickedLocation = { x: 0, y: 1 };
				this.p1.client.receive('play:pick:colony', { colony: this.pickedLocation });
			});

			it('notifies all players of the selection', function() {
				var firstPlayerId = this.p1.id;

				for (let p of this.players) {
					let message  = p.client.lastMessage('play:pick:colony');
					expect(message.player).toEqual(firstPlayerId);
					expect(message.colony).toEqual(this.pickedLocation);
					if (p.id !== firstPlayerId) { expect(message).not.toHaveKey('resources'); }
				}
			});

			it('provides gained resources to the player', function() {
				var message = this.p1.client.lastMessage('play:pick:colony');
				var totalResources = 0;
				for ( let [, count ] of maps.entries(message.resources)) {
					totalResources += count;
				}
				expect(totalResources).toBeIn([ 2, 3 ]);
			});
		});

		describe('of invalid location', function() {

		});
	});

	describe('road picking', function() {
		beforeEach(function() {
				this.startGame();
		});

		describe('of valid path', function() {
			beforeEach(function() {
				this.pickedLocation = { x: 0, y: 1 };
				this.p1.client.receive('play:pick:colony', { colony: this.pickedLocation });
				this.pickedPath = { from: this.pickedLocation, to: { x: 1, y: 0 } };
				this.p1.client.receive('play:pick:path', { path: this.pickedPath });
			});

			it('notifies all players of the selection', function() {
				var firstPlayerId = this.p1.id;

				for (let p of this.players) {
					let message  = p.client.lastMessage('play:pick:path');
					expect(message.player).toEqual(firstPlayerId);
					expect(message.path).toEqual({ from: { x: 1, y: 0 }, to: this.pickedLocation }); // Correctly ordered path
				}
			});
		});

		describe('of invalid path', function() {
			it('receives error if not existing', function() {
				this.p1.client.receive('play:pick:path', { path: { from: { x: -1, y: 0 }, to: { x: 1, y: 0 } } });
				var message = this.p1.client.lastMessage('play:pick:path');
				expect(message._success).toBe(false);
			});

			it('receives error if not from the picked city', function() {
				this.p1.client.receive('play:pick:path', { path: { from: { x: 1, y: -1 }, to: { x: 1, y: 0 } } });
				var message = this.p1.client.lastMessage('play:pick:path');
				expect(message._success).toBe(false);
			});
		});
	});

	describe('on turn end', function() {
		beforeEach(function() {
			this.startGame();
			// Pick for the player
			this.p1.client.receive('play:pick:colony', { colony: { x: 0, y: 1 } });
			this.p1.client.receive('play:pick:path', { path: { from: { x: 0, y: 1 }, to: { x: 1, y: 0 } } });
			// End turn
			this.p1.client.receive('play:turn:end');
		});

		it('notifies all players of a new turn', function() {
			for (let p of this.players) {
				let message = p.client.lastMessage('play:turn:new');
				expect(message.player).toBe(this.p2.id);
			}
		});

		it('elects the next player', function() {
			let message = this.players[0].client.lastMessage('play:turn:new');
			expect(message.player).not.toBe(this.p1.id);
		});
	});

	describe('on placement completed', function() {
		beforeEach(function() {
			function pick(player, cityX, cityY, toX, toY) {
				player.receive('play:pick:colony', { colony: { x: cityX, y: cityY } });
				player.receive('play:pick:path', { path: { from: { x: cityX, y: cityY }, to: { x: toX, y: toY } } });
				player.receive('play:turn:end');
			}

			this.startGame();
			// Pick twice for the players
			pick(this.p1.client, 0, 2, 1, 2);
			pick(this.p2.client, 2, 0, 3, -1);
			pick(this.p1.client, 0, -2, -1, -2);
			pick(this.p2.client, -2, 0, -3, 1);
		});

		it('notifies the first player of its turn', function() {
			var firstPlayerId = this.p1.id;
			for (let p of this.players) {
				expect(p.client.lastMessage('play:turn:new')).toEqual({ player: firstPlayerId });
			}
		});

		it('notifies that the game has started', function() {
			for (let p of this.players) {
				expect(p.client.lastMessage('game:play')).not.toBeUndefined();
			}
		});
	});

});