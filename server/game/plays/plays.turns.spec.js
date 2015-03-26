import * as starter from '../games/game-spec.starter.js';

describe('Play turn management', function() {
	beforeEach(function() {
		this.game = starter.createGame(2);
		this.players = this.game.players;
	});

	describe('on game started', function() {
		beforeEach(function() {
			this.game.start();

			var firstPlayer = this.players[0].client.lastMessage('play:turn:new').player;
			for (let p of this.players) {
				if (p.id === firstPlayer) {
					this.p1 = p;
				} else {
					this.p2 = p;
				}
			}
		});

		it('notifies all players of a new turn', function() {
			var firstPlayerId = this.p1.id;
			for (let p of this.players) {
				expect(p.client.lastMessage('play:turn:new')).toEqual({ player: firstPlayerId });
			}
		})
	});

	describe('on a turn end', function() {
		beforeEach(function() {
			this.game.start();

			var firstPlayer = this.players[0].client.lastMessage('play:turn:new').player;
			for (let p of this.players) {
				if (p.id === firstPlayer) {
					this.p1 = p;
				} else {
					this.p2 = p;
				}
			}

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

});