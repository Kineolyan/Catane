import User from 'server/core/com/user';
import { MockSocket } from 'server/core/com/mocks';
import BasePlayer from 'server/core/game/players/player';

describe('User', function() {
	beforeEach(function() {
		this.socket = (new MockSocket()).toSocket();
		this.player = new BasePlayer(this.socket, 1);
		this.user = new User(this.socket, this.player);
	});

	describe('@player', function() {
		it('gets the player', function() {
			expect(this.user.player).toBe(this.player);
		});

		describe('setter', function() {
			beforeEach(function() {
				this.newSocket = (new MockSocket()).toSocket();
				this.newPlayer = new BasePlayer(this.newSocket, 2);
				this.user.player = this.newPlayer;
			});

			it('updates player and player socket on set', function() {
				expect(this.user.player).toBe(this.newPlayer);
			});

			it('updates the player socket to the user one', function() {
				expect(this.newPlayer.socket).toBe(this.socket);
			});
		});
	});

});