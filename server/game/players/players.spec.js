import Player from './players';
import { MockSocket } from './../../com/mocks';

describe('Player', function() {
	beforeEach(function() {
		this.socket = new MockSocket();
	});

	describe('on creation', function() {
		beforeEach(function() {
			this.player = new Player(this.socket);
		});

		it('registers on player:register', function () {
			expect(this.socket.isListening('player:register')).toBeTruthy();
		});
	});

	describe('#register', function() {
		beforeEach(function() {
			this.player = new Player(this.socket);
			this.player.register('Olivier');
		});

		it('sets name', function() {
			expect(this.player.name).toEqual('Olivier');
		});
	});

	describe('->player:register', function() {
		beforeEach(function() {
			this.player = new Player(this.socket);
			this.socket.receive('player:register', 'Olivier');
		});

		it('sets name to Olivier', function() {
			expect(this.player.name).toEqual('Olivier');
		});

		it('sends success', function() {
			expect(this.socket.lastMessage('player:register')).toEqual({ success: true });
		});
	});

});