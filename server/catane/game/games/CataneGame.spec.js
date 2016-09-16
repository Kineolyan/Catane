import CataneGame from 'server/catane/game/games/CataneGame';

import { MockSocket } from 'server/core/com/mocks';
import BasePlayer from 'server/core/game/players/player';
import * as starter from './game-spec.starter.js';

describe('CataneGame', function () {
	beforeEach(function () {
		this.game = new CataneGame(1);
	});

	describe('#add', function () {
		beforeEach(function () {
			this.client = new MockSocket();
			this.user = { player: new BasePlayer(this.client.toSocket(), 1) };

			this.result = this.game.add(this.user);
		});

		it('returns true', function () {
			expect(this.result).toBe(true);
		});
	});

	describe('#start', function () {
		beforeEach(function () {
			this.clients = [new MockSocket()];
			this.users = [{ player: new BasePlayer(this.clients[0].toSocket(), 1) }];

			expect(this.game.add(this.users[0])).toBe(true);
		});

		describe('with enough players', function () {
			beforeEach(function () {
				this.clients.push(new MockSocket());
				this.users.push({ player: new BasePlayer(this.clients[1].toSocket(), 2) });

				expect(this.game.add(this.users[1])).toBe(true);
				this.game.start();
			});
		});
	});

	describe('#reload', function () {
		beforeEach(function () {
			this.env = starter.createLocalGame(2);
			this.env.start();
			this.env.randomPick();
			this.p = this.env.players[0];

			this.description = this.env.game.reload();
		});

		it('describes the tiles', function () {
			var tiles = this.description.board.tiles;
			expect(tiles).toHaveLength(19);
			expect(tiles[0]).toHaveKeys(['x', 'y', 'resource', 'diceValue']);
		});

		it('describes the cities', function () {
			var cities = this.description.board.cities;
			expect(cities).toHaveLength(54);
			expect(cities[0]).toContainKeys(['x', 'y']);

			var citiesWithOwner = 0;
			for (let city of cities) {
				citiesWithOwner += city.owner !== undefined ? 1 : 0;
			}
			expect(citiesWithOwner).toEqual(4);
		});

		it('describes the paths', function () {
			var paths = this.description.board.paths;
			expect(paths).toHaveLength(72);
			expect(paths[0]).toContainKeys(['from', 'to']);

			var pathsWithOwner = 0;
			for (let path of paths) {
				pathsWithOwner += path.owner !== undefined ? 1 : 0;
			}
			expect(pathsWithOwner).toEqual(4);
		});

		it('locates the thieves', function () {
			expect(this.description.board.thieves).toEqual({ x: 0, y: 0 });
		});

		it('gives the players in order', function () {
			var orderedPlayers = this.env.players.map(p => ({
				id: p.player.id, name: p.player.name
			}));

			expect(this.description.players).toEqual(orderedPlayers);
		});

		it('indicates the current player', function () {
			expect(this.description.currentPlayer).toBe(this.p.player.id);
		});
	});

	describe('->game:start', function () {
		beforeEach(function () {
      this.env = starter.createLocalGame(3);
      this.env.start();

			this.client = this.env.players[0].client;
		});

		it('sends ok', function () {
			var message = this.client.lastMessage('game:start');
			expect(message._success).toBe(true);
		});

		describe('board definition', function () {
			beforeEach(function () {
				var message = this.client.lastMessage('game:start');
				this.board = message.board;
			});

			it('contains all board elements', function () {
				expect(this.board).toHaveKeys(['tiles', 'cities', 'paths', 'thieves']);
			});

			it('describes tiles', function () {
				// TODO test it more intensively
				var tile = this.board.tiles[0];

				if (tile.resource === 'desert') {
					expect(tile).toHaveKeys(['x', 'y', 'resource']);
				} else {
					expect(tile).toHaveKeys(['x', 'y', 'resource', 'diceValue']);
				}

				expect(tile.x).toBeAnInteger();
				expect(tile.y).toBeAnInteger();
				expect(tile.resource).toBeIn(['desert', 'tuile', 'bois', 'mouton', 'ble', 'caillou']);
				if (tile.resource !== 'desert') {
					expect(tile.diceValue).toBeAnInteger();
					expect(tile.diceValue).toBeBetween(2, 12);
				}
			});

			it('describes cities', function () {
				var tile = this.board.cities[0];

				expect(tile).toHaveKeys(['x', 'y']);
				expect(tile.x).toBeAnInteger();
				expect(tile.y).toBeAnInteger();
			});

			it('describes paths', function () {
				var path = this.board.paths[0];

				expect(path).toHaveKeys(['from', 'to']);
				expect(path.from.y).toBeAnInteger();
				expect(path.from.x).toBeAnInteger();
				expect(path.to.y).toBeAnInteger();
				expect(path.to.x).toBeAnInteger();
			});

			it('gives thieves position', function () {
				// At start, thieves are in the desert, located by default at the center of the map
				expect(this.board.thieves).toEqual({ x: 0, y: 0 });
			});
		});

		describe('player order', function () {
			beforeEach(function () {
				var message = this.client.lastMessage('game:start');
				this.board = message.board;
			});

		});
	});
});
