import Server from './server';
import { MockSocket } from 'server/core/com/mocks';

describe('Server', function() {
	beforeEach(function() {
		this.server = new Server(4213);
	});

	describe('constructor', function() {
		it('uses time as id if nothing provided', function() {
			var server = new Server();
			var currentTime = (new Date()).getTime();
			expect(server.id).toBeClose(currentTime, 2500);
		});

		it('uses the given id', function() {
			expect(this.server.id).toEqual(4213);
		});
	});

	describe('#connect', function() {
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
			expect(this.message.server).toEqual({ id: 4213, sid: this.socket.id });
		});

		it('adds the client to its players list', function() {
			expect(this.server.users).toHaveKey(this.socket.id);
		});
	});

	describe('#doDisconnect', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.socket = this.client.toSocket();
			this.server.connect(this.socket);

			this.server.doDisconnect(this.socket);
		});

		it('removes client from the list', function() {
			expect(this.server.users).not.toHaveKey(this.socket.id);
		});
	});

	describe('#disconnect', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.socket = this.client.toSocket();
			this.server.connect(this.socket);
		});

		it('removes the player if it does not belong to a game', function() {
			this.server.disconnect(this.socket);
			expect(this.server.users).not.toHaveKey(this.socket.id);
		});

		it('removes the player if it joined an unstarted game', function() {
			var user = this.server.users.get(this.socket.id);
			user.player.game = {
				isStarted: function() { return false; },
				remove: function() {}
			};

			this.server.disconnect(this.socket);
			expect(this.server.users).not.toHaveKey(this.socket.id);
		});

		it('keeps the player if the game has started', function() {
			var user = this.server.users.get(this.socket.id);
			user.player.game = {
				isStarted: function() { return true; },
				remove: function() {}
			};

			this.server.disconnect(this.socket);
			expect(this.server.users).toHaveKey(this.socket.id);
		});

		it('removes the player after the timeout', function(done) {
			var user = this.server.users.get(this.socket.id);
			user.player.game = {
				isStarted: function() { return true; },
				remove: function() {}
			};

			this.server.disconnect(this.socket);
			setTimeout(() => {
				expect(this.server.users).not.toHaveKey(this.socket.id);
				done();
			}, Server.TIME_TO_RECONNECT * 1.5);
		});
	});

	describe('#reconnect', function() {
		beforeEach(function() {
			// Connect for the first time
			this.client = new MockSocket();
			this.socket = this.client.toSocket();
			this.server.connect(this.socket);

			// Simulate a game start
			this.player = this.server.users.get(this.socket.id).player;
			this.player.game = {
				isStarted: function() { return true; },
				remove: function() {}
			};

			// Reconnect
			this.newClient = new MockSocket();
			this.newSocket = this.newClient.toSocket();
			this.server.connect(this.newSocket);
			this.server.reconnect(this.newSocket, this.socket.id);
		});

		it('connects player to the new socket id', function() {
			var user = this.server.users.get(this.newSocket.id);
			expect(user.player.id).toEqual(this.player.id);
		});

		it('removes player from the old connection', function() {
			expect(this.server.users).not.toHaveKey(this.socket.id);
		});

		it('sets the new socket for the player comm', function() {
			var player = this.server.users.get(this.newSocket.id);
			expect(player.socket.id).toEqual(this.newSocket.id);
		});

		it('throws if the socket does not exist', function() {
			expect(() => {
				this.server.reconnect(this.newSocket, -1234567);
			}).toThrowError(/does not exist/i);
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
			expect(this.server.users).toHaveKey(this.socket.id);
		});

		it('contains second socket', function() {
			expect(this.server.users).toHaveKey(this.anotherSocket.id);
		});

		describe('after first disconnects', function() {
			beforeEach(function() {
				this.server.doDisconnect(this.socket);
			});

			it('does not contains first anymore', function() {
				expect(this.server.users).not.toHaveKey(this.socket.id);
			});

			describe('after second disconnects', function() {
				beforeEach(function() {
					this.server.doDisconnect(this.anotherSocket);
				});

				it('does not contains first anymore', function() {
					expect(this.server.users).not.toHaveKey(this.anotherSocket.id);
				});
			});
		});
	});

	describe('->server:reconnect', function() {
		beforeEach(function() {
			// Connect for the first time
			this.client = new MockSocket();
			this.socket = this.client.toSocket();
			this.server.connect(this.socket);

			// Simulate a game start
			this.player = this.server.users.get(this.socket.id).player;
			this.player.game = {
				isStarted: function() { return true; },
				remove: function() {}
			};

			// Reconnect
			this.newClient = new MockSocket();
			this.newSocket = this.newClient.toSocket();
			this.server.connect(this.newSocket);
			this.newClient.receive('server:reconnect', this.socket.id);
		});

		it('performs the reconnection', function() {
			var newPlayer = this.server.users.get(this.newSocket.id).player;
			expect(newPlayer.id).toEqual(this.player.id);
		});

		it('sends back the previous player info', function() {
			var response = this.newClient.lastMessage('server:reconnect');
			expect(response.player).toEqual({ id: this.player.id, name: this.player.name });
		});
	});

});