import { messages } from './messages';
import { MockSocket } from './mocks';

describe('basic messages', function() {

	describe('#ok', function() {
		beforeEach(function() {
			this.socket = new MockSocket();
		});

		it('sends message { success: true }', function() {
			messages.ok(this.socket, 'c');
			expect(this.socket.lastMessage('c')).toEqual({ success: true });
		});
	});

	describe('#ko', function() {
		beforeEach(function() {
			this.socket = new MockSocket();
		});

		it('sends message { success: false, message: ... }', function() {
			messages.ko(this.socket, 'c', 'reason');
			expect(this.socket.lastMessage('c')).toEqual({ success: false, message: 'reason' });
		});
	});

});