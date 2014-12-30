import Player from './players';
import { MockSocket } from './../../com/mocks';

describe('Player', function() {
	beforeEach(function() {
		this.socket = new MockSocket();
	});

	describe('on creation', function() {
		beforeEach(function() {
			this.player = new Player(this.socket, '1');
		});

		it('registers on player:nickname', function () {
			expect(this.socket.isListening('player:nickname')).toBeTruthy();
		});

		it('has a default name', function() {
			expect(this.player.name).toEqual('Player 1');
		});

		it('has an id', function() {
			expect(this.player.id).toEqual('1');
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

	describe('->player:nickname', function() {
		beforeEach(function() {
			this.player = new Player(this.socket);
			this.socket.receive('player:nickname', 'Olivier');
		});

		it('sets name to Olivier', function() {
			expect(this.player.name).toEqual('Olivier');
		});

		it('sends success', function() {
			expect(this.socket.lastMessage('player:nickname')).toEqual({ success: true });
		});
	});

});