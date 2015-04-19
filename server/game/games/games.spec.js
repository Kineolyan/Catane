import { MockSocket } from '../../com/mocks';

import Games from './games';
import Player from '../players/player';

describe('Games', function() {
	beforeEach(function() {
		this.games = new Games();
	});

	describe("on creation", function() {
		it('has no games', function() {
			expect(this.games.list()).toBeEmpty(0);
		});
	});

	describe('#register', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.player = new Player(this.client.toSocket(), 0);
			this.games.register(this.player);
		});

		// Channels listened
		[
			'game:create', 'game:list', 'game:join', 'game:start', 'game:quit'
		].forEach(function(channel) {
			it(`makes client listen to "${channel}"`, function() {
				expect(this.client).toBeListeningTo(channel);
			});
		});
	});

	describe('#list', function() {
		beforeEach(function() {
			this.gamesList = [];
			for (let i = 0; i < 3; i+= 1) { this.gamesList.push(this.games.create()); }
		});

		it('returns 3 games', function() {
			var gameIds = Array.from(this.gamesList, (game) => ({ id: game.id }));
			expect(this.games.list()).toEqual(gameIds);
		});
	});

	describe('with a client and games', function() {
		beforeEach(function() {
			this.client = new MockSocket();
			this.player = new Player(this.client.toSocket(), 1);
			this.games.register(this.player);

			let lastGame;
			for (let i = 0; i < 3; i+= 1) {
				lastGame = this.games.create();
			}
			this.lastGameId = lastGame.id;
		});

		describe('->game:create', function() {
			beforeEach(function() {
				this.anotherClient = new MockSocket();
				this.anotherPlayer = new Player(this.anotherClient.toSocket(), 2);
				this.games.register(this.anotherPlayer);

				this.client.receive('game:create', null);
			});

			it('has a new game registered', function() {
				expect(this.games._games).toHaveSize(4);
			});

			it('sends id of the game', function() {
				var message = this.client.lastMessage('game:create');
				expect(message.game.id).toBeAnInteger();
			});

			it('notifies the other players', function() {
				var gameId = this.client.lastMessage('game:create').game.id;
				var message = this.anotherClient.lastMessage('game:list');
				expect(Array.from(message.games, (game) => game.id)).toContain(gameId);
			});
		});

		describe('->game:list', function() {
			beforeEach(function() {
				this.client.receive('game:list', null);
			});

			it('sends the list of games ids', function() {
				var message = this.client.lastMessage('game:list');
				expect(message.games).toEqual(this.games.list());
			});
		});

		describe('->game:join', function() {
			describe('with valid id', function() {
				beforeEach(function() {
					this.client.receive('game:join', this.lastGameId);
				});

				it('receives success on "game:join"', function() {
					var message = this.client.lastMessage('game:join');
					expect(message._success).toEqual(true);
				});

				it('receives the list of players', function() {
					var message = this.client.lastMessage('game:players');
					expect(message.players).toEqual([{ id: this.player.id, name: this.player.name }]);
				});

				describe('with another player', function() {
					beforeEach(function() {
						this.anotherClient = new MockSocket();
						this.anotherPlayer = new Player(this.anotherClient.toSocket(), 2);
						this.games.register(this.anotherPlayer);

						this.anotherClient.receive('game:join', this.lastGameId);
					});

					it('receives the list of players', function() {
						var message = this.anotherClient.lastMessage('game:players');
						expect(message.players).toHaveMembers([
							{ id: this.player.id, name: this.player.name },
							{ id: this.anotherPlayer.id, name: this.anotherPlayer.name }
						]);
					});

					it('sends updated list to other players', function() {
						var message = this.client.lastMessage('game:players');
						expect(message.players).toHaveMembers([
							{ id: this.player.id, name: this.player.name },
							{ id: this.anotherPlayer.id, name: this.anotherPlayer.name }
						]);
					});
				});

				describe('when player already joined a game', function() {
					beforeEach(function() {
						this.leavedClient = new MockSocket();
						var leavedPlayer = new Player(this.leavedClient.toSocket(), 2);
						this.games.register(leavedPlayer);
						this.leavedClient.receive('game:join', this.lastGameId);

						var firstGameId = this.games.list()[0].id;

						this.joinedClient = new MockSocket();
						var joinedPlayer = new Player(this.joinedClient.toSocket(), 3);
						this.games.register(joinedPlayer);
						this.joinedClient.receive('game:join', firstGameId);

						// Already in this.lastGameId, join the new game
						this.client.receive('game:join', firstGameId);
					});

					it('updates list of players of the leaved game', function() {
						var message = this.leavedClient.lastMessage('game:players');
						var players = Array.from(message.players, player => player.id);

						expect(players).not.toContain(this.player.id);
					});

					it('udpate list of players for the new game', function() {
						var message = this.joinedClient.lastMessage('game:players');
						var players = Array.from(message.players, player => player.id);

						expect(players).toContain(this.player.id);
					});
				});

				describe('with duplicates', function() {
					beforeEach(function() {
						this.client.receive('game:join', this.lastGameId);
					});

					it('sends error message', function() {
						var message = this.client.lastMessage('game:join');
						expect(message._success).toBe(false);
						expect(message.message).toMatch(/duplicated player/i);
					});
				});
			});
		});

		describe('->game:quit', function() {
			beforeEach(function() {
				this.client.receive('game:join', this.lastGameId);

				this.anotherClient = new MockSocket();
				var anotherPlayer = new Player(this.anotherClient.toSocket(), 2);
				this.games.register(anotherPlayer);
				this.anotherClient.receive('game:join', this.lastGameId);

				// Quit the game
				this.client.receive('game:quit');
			});

			it('returns a success', function() {
				var message = this.client.lastMessage('game:quit');
				expect(message._success).toBe(true);
			});

			it('update the list of players in the game', function() {
				var message = this.anotherClient.lastMessage('game:players');
				var players = Array.from(message.players, player => player.id);
				expect(players).not.toContain(this.player.id);
			});

			it('sends error if the player does not belong to the game', function() {
				var response = this.client.receive('game:quit');
				expect(response._success).toBe(false);
				expect(response.message).toMatch(/no game/i);
			});
		});

		describe('->game:start', function() {
			beforeEach(function() {
				this.client.receive('game:join', this.lastGameId);
			});

			describe('with enough players', function() {
				beforeEach(function() {
					this.anotherClient = new MockSocket();
					this.anotherPlayer = new Player(this.anotherClient.toSocket(), 2);

					this.games.register(this.anotherPlayer);
					this.anotherClient.receive('game:join', this.lastGameId);

					this.client.receive('game:start', this.lastGameId);
				});

				it('sends ok', function() {
					var message = this.client.lastMessage('game:start');
					expect(message._success).toBe(true);
				});

				it('sends error if started twice', function() {
					this.client.receive('game:start', this.lastGameId);

					var response = this.client.lastMessage('game:start');
					expect(response._success).toBe(false);
					expect(response.message).toMatch(/already started/i);
				});

				describe('board definition', function() {
					beforeEach(function() {
						var message = this.client.lastMessage('game:start');
						this.board = message.board;
					});

					it('contains all board elements', function() {
						expect(this.board).toHaveKeys([ 'tiles', 'cities', 'paths' ]);
					});

					it('describes tiles', function() {
						// TODO test it more intensively
						var tile = this.board.tiles[0];

						if (tile.resource === 'desert') {
							expect(tile).toHaveKeys([ 'x', 'y', 'resource' ]);
						} else {
							expect(tile).toHaveKeys([ 'x', 'y', 'resource', 'diceValue' ]);
						}

						expect(tile.x).toBeAnInteger();
						expect(tile.y).toBeAnInteger();
						expect(tile.resource).toBeIn([ 'desert', 'tuile', 'bois', 'mouton', 'ble', 'caillou' ]);
						if (tile.resource !== 'desert') {
							expect(tile.diceValue).toBeAnInteger();
							expect(tile.diceValue).toBeBetween(2, 12);
						}
					});

					it('describes cities', function() {
						var tile = this.board.cities[0];

						expect(tile).toHaveKeys([ 'x', 'y' ]);
						expect(tile.x).toBeAnInteger();
						expect(tile.y).toBeAnInteger();
					});

					it('describes paths', function() {
						var path = this.board.paths[0];

						expect(path).toHaveKeys([ 'from', 'to' ]);
						expect(path.from.y).toBeAnInteger();
						expect(path.from.x).toBeAnInteger();
						expect(path.to.y).toBeAnInteger();
						expect(path.to.x).toBeAnInteger();
					});
				});

				describe('player order', function() {
					beforeEach(function() {
						var message = this.client.lastMessage('game:start');
						this.board = message.board;
					});

				});
			});

			describe('with wrong id', function() {
				beforeEach(function() {
					this.client.receive('game:start', -1);
				});

				it('sends an error', function() {
					var response = this.client.lastMessage('game:start');
					expect(response._success).toBe(false);
					expect(response.message).toMatch(/unknown game/i);
				});
			});

			describe('without enough players', function() {
				beforeEach(function() {
					this.client.receive('game:start', this.lastGameId);
				});

				it('sends an error', function() {
					var response = this.client.lastMessage('game:start');
					expect(response._success).toBe(false);
					expect(response.message).toMatch(/not enough players/i);
				});
			});
		});

		describe('clean games if empty', function() {
			describe('on game:quit', function() {
				beforeEach(function() {
					// Join the game ...
					this.client.receive('game:join', this.lastGameId);
					// ... to quit it
					this.client.receive('game:quit');
				});

				it('gets updated list without the game', function() {
					var message = this.client.lastMessage('game:list');
					var games = Array.from(message.games, game => game.id);

					expect(games).not.toContain(this.lastGameId);
				});
			});

			describe('on game:join', function() {
				beforeEach(function() {
					// Join the game ...
					this.client.receive('game:join', this.lastGameId);
					// ... to change to another
					this.client.receive('game:join', this.games.list()[0].id);
				});

				it('gets updated list without the game', function() {
					var message = this.client.lastMessage('game:list');
					var games = Array.from(message.games, game => game.id);

					expect(games).not.toContain(this.lastGameId);
				});
			});
		});

	});

});