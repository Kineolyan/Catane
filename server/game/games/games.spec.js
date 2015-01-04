import { MockSocket } from '../../com/mocks';

import Games from './games';
import Player from '../players/players';

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
			'game:create', 'game:list', 'game:join', 'game:start'
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
				this.client.receive('game:create', null);
			});

			it('has a new game registered', function() {
				expect(this.games._games).toHaveSize(4);
			});

			it('sends id of the game', function() {
				var message = this.client.lastMessage('game:create');
				// TODO Change for .toBeAnInt()
				expect(message.game.id.toString()).toMatch(/^[0-9]+$/);
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


	});

});