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
			expect(this.server.players).toHaveKey(this.socket.id);
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
			expect(this.server.players).not.toHaveKey(this.socket.id);
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
			expect(this.server.players).not.toHaveKey(this.socket.id);
		});

		it('removes the player if it joined an unstarted game', function() {
			var player = this.server.players[this.socket.id];
			player.game = {
				isStarted: function() { return false; },
				remove: function() {}
			};

			this.server.disconnect(this.socket);
			expect(this.server.players).not.toHaveKey(this.socket.id);
		});

		it('keeps the player if the game has started', function() {
			var player = this.server.players[this.socket.id];
			player.game = {
				isStarted: function() { return true; },
				remove: function() {}
			};

			this.server.disconnect(this.socket);
			expect(this.server.players).toHaveKey(this.socket.id);
		});

		it('removes the player after the timeout', function(done) {
			var player = this.server.players[this.socket.id];
			player.game = {
				isStarted: function() { return true; },
				remove: function() {}
			};

			this.server.disconnect(this.socket);
			setTimeout(() => {
				expect(this.server.players).not.toHaveKey(this.socket.id);
				done();
			}, global.TIME_TO_RECONNECT * 1.5);
		});
	});

	describe('#reconnect', function() {
		beforeEach(function() {
			// Connect for the first time
			this.client = new MockSocket();
			this.socket = this.client.toSocket();
			this.server.connect(this.socket);

			// Simulate a game start
			this.player = this.server.players[this.socket.id];
			this.player.game = {
				isStarted: function() { return true; },
				remove: function() {}
			};

			// Reconnect
			this.newClient = new MockSocket();
			this.newSocket = this.newClient.toSocket();
			this.server.reconnect(this.newSocket, this.socket.id);
		});

		it('connects player to the new socket id', function() {
			var newPlayer = this.server.players[this.newSocket.id];
			expect(newPlayer.id).toEqual(this.player.id);
		});

		it('removes player from the old connection', function() {
			var players = this.server.players;
			expect(players).not.toHaveKey(this.socket.id);
		});

		it('sets the new socket for the player comm', function() {
			var player = this.server.players[this.newSocket.id];
			expect(player.socket.id).toEqual(this.newSocket.id);
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
				this.server.doDisconnect(this.socket);
			});

			it('does not contains first anymore', function() {
				expect(this.server.players).not.toHaveKey(this.socket.id);
			});

			describe('after second disconnects', function() {
				beforeEach(function() {
					this.server.doDisconnect(this.anotherSocket);
				});

				it('does not contains first anymore', function() {
					expect(this.server.players).not.toHaveKey(this.anotherSocket.id);
				});
			});
		});
	});

});