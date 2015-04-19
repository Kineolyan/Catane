import Player from './player';
import { MockSocket } from './../../com/mocks';

describe('Player', function() {
	beforeEach(function() {
		this.socket = new MockSocket();
	});

	describe('on creation', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket(), '1');
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

		it('does not have any resources', function() {
			expect(this.player.resources).toEqual({});
		});
	});

	describe('#name', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
			this.player.name = 'Olivier';
		});

		it('sets name', function() {
			expect(this.player.name).toEqual('Olivier');
		});
	});

	describe('#receiveResources', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
		});

		it('updates the number of resources', function() {
			this.player.receiveResources([ 'ble', 'bois', 'mouton', 'ble' ]);
			expect(this.player.resources).toEqual({ ble: 2, mouton: 1, bois: 1 });
		});
	});

	describe('->player:nickname', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
			this.socket.receive('player:nickname', 'Olivier');
		});

		it('sets name to Olivier', function() {
			expect(this.player.name).toEqual('Olivier');
		});

		it('sends success', function() {
			var message = this.socket.lastMessage('player:nickname');
			expect(message._success).toEqual(true);
		});
	});

});