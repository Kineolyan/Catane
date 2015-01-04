import Server from './server';
import { MockSocket } from './com/mocks';

describe('Server', function() {
	beforeEach(function() {
		this.server = new Server();
	});

	describe('connection of new client', function() {
		beforeEach(function() {
			this.client = new MockSocket();

			this.server.connect(this.client);
			this.message = this.client.lastMessage('init');
		});

		it('welcomes the player', function() {
			expect(this.message.message).toEqual('welcome');
		});

		it('gives the player\'s name', function() {
			expect(this.message.name).toMatch(/^Player [0-9]+$/);
		});

		it('gives the player\'s id', function() {
			expect(this.message.id).toMatch(/^[0-9]+$/);
		});

		it('adds the client to its players list', function() {
			expect(this.server.players).toHaveKey(this.client);
		});
	});

	describe('disconnection of a client', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.socket = this.client.toSocket();
			this.server.connect(this.socket);

			this.server.disconnect(this.socket);
		});

		it('removes client from the list', function() {
			expect(this.server.players).not.toHaveKey(this.socket);
		});
	});

});