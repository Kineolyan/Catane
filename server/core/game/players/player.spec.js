import BasePlayer, { BasePlayerDecorator } from './player';
import { MockSocket } from 'server/core/com/mocks';

describe('BasePlayer', function () {
	beforeEach(function () {
		this.socket = new MockSocket();
	});

	describe('on creation', function () {
		beforeEach(function () {
			this.player = new BasePlayer(this.socket.toSocket(), '1');
		});

		it('registers on player:nickname', function () {
			expect(this.socket.isListening('player:nickname')).toBeTruthy();
		});

		it('has a default name', function () {
			expect(this.player.name).toEqual('Player 1');
		});

		it('has an id', function () {
			expect(this.player.id).toEqual('1');
		});

		it('has a null score', function () {
			expect(this.player.score).toEqual(0);
		});
	});

	describe('#name', function () {
		beforeEach(function () {
			this.player = new BasePlayer(this.socket.toSocket());
			this.player.name = 'Olivier';
		});

		it('sets name', function () {
			expect(this.player.name).toEqual('Olivier');
		});
	});

	describe('#toJson', function () {
		beforeEach(function () {
			this.player = new BasePlayer(this.socket.toSocket(), 1342);
			this.player.name = 'Olivier';
		});

		it('returns basic object with name and id', function () {
			expect(this.player.toJson()).toEqual({ id: 1342, name: 'Olivier' });
		});
	});

	describe('#winPoints', function () {
		beforeEach(function () {
			this.player = new BasePlayer(this.socket.toSocket());
		});

		it('increments the score by the number of points', function () {
			expect(() => this.player.winPoints(2)).toChangeBy(() => this.player.score, 2)
		});

		it('fails if the value is negative', function () {
			expect(() => this.player.winPoints(-1)).toThrow();
			expect(() => this.player.winPoints(0)).toThrow();
		})
	});

	describe('->player:nickname', function () {
		beforeEach(function () {
			this.player = new BasePlayer(this.socket.toSocket(), 1);
			this.another = new MockSocket();

			this.socket.receive('player:nickname', 'Olivier');
		});

		it('sets name to Olivier', function () {
			expect(this.player.name).toEqual('Olivier');
		});

		it('sends success', function () {
			var message = this.socket.lastMessage('player:nickname');
			expect(message._success).toEqual(true);
		});

		it('sends the new name', function () {
			var message = this.socket.lastMessage('player:nickname');
			expect(message.player.name).toEqual('Olivier');
			expect(message.player.id).toEqual(1);
		});

		it('notifies others of the change', function () {
			var message = this.another.lastMessage('player:nickname');
			expect(message.player).toEqual({ id: 1, name: 'Olivier' });
		});
	});

});

describe('BasePlayerDecorator', function () {
	beforeEach(function () {
		this.socket = new MockSocket();
		this.player = new BasePlayer(this.socket.toSocket(), '1');
		this.decoPlayer = new BasePlayerDecorator(this.player);
	});

	it('decorates getters', function() {
		expect(this.decoPlayer.id).toEqual(this.player.id);
	});
});