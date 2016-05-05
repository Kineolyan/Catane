import * as starter from 'server/catane/game/games//game-spec.starter.js';

/**
 * This contains tests that simulates scenari on the board.
 */
describe('Game operations', function() {
	beforeEach(function() {
		this.game = starter.createGame(2);
		this.game.start();

		this.p1 = this.game.players[0];
		this.p2 = this.game.players[1];
	});

	describe('game reconnection', function() {
		beforeEach(function() {
			// Disconnect and reconnect with another user
			// this.p1.client.receive('disconnect');
			this.reconnectedPlayer = starter.createPlayer();
			this.reconnectedPlayer.client.receive('server:reconnect', this.p1.server.sid);
			this.reconnectedPlayer.client.receive('game:reload');
		});

		it('receives the board again', function() {
			var message = this.reconnectedPlayer.client.lastMessage('game:reload');
			expect(message).toHaveKey('board');
		});
	});
});