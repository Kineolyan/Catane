import Server from './server';
import { MockSocket } from './com/mocks';

describe('Server', function() {
	beforeEach(function() {
		this.server = new Server(4213);
	});

	describe('constructor', function() {
		it('uses time as id if nothing provided', function() {
			var server = new Server();
			var currentTime = (new Date()).getTime();
			expect(server.id).toBeClose(currentTime, 2500)
		});

		it('uses the given id', function() {
			expect(this.server.id).toEqual(4213);
		});
	});

	describe('connection of new client', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.socket = this.client.toSocket();

			this.server.connect(this.socket);
			this.message = this.client.lastMessage('init');
		});

		it('welcomes the player', function() {
			expect(this.message.message).toEqual('welcome');
		});

		it('gives the player\'s name', function() {
			expect(this.message.player.name).toMatch(/^Player [0-9]+$/);
		});

		it('gives the player\'s id', function() {
			expect(this.message.player.id).toMatch(/^[0-9]+$/);
		});

		it('sends server info', function() {
			expect(this.message.server).toEqual({ id: 4213 });
		});

		it('adds the client to its players list', function() {
			expect(this.server.players).toHaveKey(this.socket.id);
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
			expect(this.server.players).not.toHaveKey(this.socket.id);
		});
	});

	describe('with many clients', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.socket = this.client.toSocket();
			this.server.connect(this.socket);

			this.anotherClient = new MockSocket();
			this.anotherSocket = this.anotherClient.toSocket();
			this.server.connect(this.anotherSocket);
		});

		it('contains first socket', function() {
			expect(this.server.players).toHaveKey(this.socket.id);
		});

		it('contains second socket', function() {
			expect(this.server.players).toHaveKey(this.anotherSocket.id);
		});

		describe('after first disconnects', function() {
			beforeEach(function() {
				this.server.disconnect(this.socket);
			});

			it('does not contains first anymore', function() {
				expect(this.server.players).not.toHaveKey(this.socket.id);
			});

			describe('after second disconnects', function() {
				beforeEach(function() {
					this.server.disconnect(this.anotherSocket);
				});

				it('does not contains first anymore', function() {
					expect(this.server.players).not.toHaveKey(this.anotherSocket.id);
				});
			});
		});
	});

});