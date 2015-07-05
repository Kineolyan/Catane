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

	describe('#toJson', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket(), 1342);
			this.player.name = 'Olivier';
		});

		it('returns basic object with name and id', function() {
			expect(this.player.toJson()).toEqual({ id: 1342, name: 'Olivier' });
		});
	});

	describe('#hasResources', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
		});

		it('returns true if there is enough', function() {
			this.player.receiveResources({ bois: 2, mouton: 3, ble: 4});
			expect(this.player.hasResources({ bois: 1, ble: 3})).toBe(true);
		});

		it('returns false if there is not enough', function() {
			this.player.receiveResources({ bois: 2, mouton: 3, ble: 4});
			expect(this.player.hasResources({ caillou: 1, bois: 3})).toBe(false);
		});

		it('supports border cases', function() {
			this.player.receiveResources({ bois: 2, mouton: 3, ble: 4});
			expect(this.player.hasResources({ bois: 2, mouton: 3 })).toBe(true);
		});

		/* jshint loopfunc: true */
		for (let wrongCost of [ 'value', [], {}]) {
			it(`rejects wrong cost such as '${wrongCost}'`, function () {
				expect(() => this.player.hasResources({ bois: wrongCost })).toThrowError(TypeError, /is not a number/i);
			});
		}
	});

	describe('#receiveResources', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
		});

		it('updates the number of resources from an array', function() {
			this.player.receiveResources([ 'ble', 'bois', 'mouton', 'ble' ]);
			expect(this.player.resources).toEqual({ ble: 2, mouton: 1, bois: 1 });
		});

		it('updates the number of resources from a hash', function() {
			this.player.receiveResources({ ble: 2, bois: 1, mouton: 1 });
			expect(this.player.resources).toEqual({ ble: 2, mouton: 1, bois: 1 });
		});
	});

	describe('#useResources', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket());
			this.player.receiveResources({ ble: 3, bois: 2, caillou: 1 });
		});

		it('updates the number of resources from an array', function() {
			this.player.useResources([ 'ble', 'bois', 'caillou', 'ble' ]);
			expect(this.player.resources).toEqual({ ble: 1, caillou: 0, bois: 1 });
		});

		it('updates the number of resources from a hash', function() {
			this.player.useResources({ ble: 2, bois: 1, caillou: 1 });
			expect(this.player.resources).toEqual({ ble: 1, caillou: 0, bois: 1 });
		});
	});

	describe('->player:nickname', function() {
		beforeEach(function() {
			this.player = new Player(this.socket.toSocket(), 1);
			this.another = new MockSocket();

			this.socket.receive('player:nickname', 'Olivier');
		});

		it('sets name to Olivier', function() {
			expect(this.player.name).toEqual('Olivier');
		});

		it('sends success', function() {
			var message = this.socket.lastMessage('player:nickname');
			expect(message._success).toEqual(true);
		});

		it('sends the new name', function() {
			var message = this.socket.lastMessage('player:nickname');
			expect(message.player.name).toEqual('Olivier');
			expect(message.player.id).toEqual(1);
		});

		it('notifies others of the change', function() {
			var message = this.another.lastMessage('player:nickname');
			expect(message.player).toEqual({ id: 1, name: 'Olivier' });
		});
	});

});