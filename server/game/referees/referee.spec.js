import { AReferee, GameReferee, PlacementReferee } from './referee';

import { MockSocket } from '../../com/mocks';
import Player from '../players/player';
import Board from '../../elements/boards/board';
import Location from '../../elements/geo/location.js';
import Path from '../../elements/geo/path.js';
import { RoundGenerator } from '../../elements/boards/generators/maps.js';

class TestReferee extends AReferee {
	constructor(board, players) {
		this._turn = 0;
		super(board, players);
		this._readyToEnd = false;
	}

	get turn() {
		return this._turn;
	}

	startTurn() {
		this._turn += 1;
		this._readyToEnd = false;
	}

	completeTurn() {
		this._readyToEnd = true;
	}

	hasRemainingRequiredActions() {
		return !this._readyToEnd;
	}
}

describe('AReferee', function() {
	beforeEach(function() {
		this.socket = new MockSocket();

		this.board = new Board();
		this.board.generate(new RoundGenerator(3));
		this.players = [
			new Player(this.socket.toSocket(), 1),
			new Player(this.socket.toSocket(), 2)
		];
		// We test if with a GameReferee since it is less complicated
		this.referee = new TestReferee(this.board, this.players);
	});

	describe('#canBuildColony', function() {
		beforeEach(function() {
			// p1 is playing
			// Set some cities around
			this.board.getCity(new Location(0, 2)).owner = this.players[1];
		});

		it('cannot build on invalid location', function() {
			expect(this.referee.canBuildColony(new Location(0, 0))).toBe(false);
		});

		it('cannot build on someone else spot', function() {
			expect(this.referee.canBuildColony(new Location(0, 2))).toBe(false);
		});

		it('cannot build too close from other cities', function() {
			expect(this.referee.canBuildColony(new Location(0, 1))).toBe(false);
		});

		it('can build on empty spot', function() {
			expect(this.referee.canBuildColony(new Location(0, -2))).toBe(true);
		});
	});

	describe('#canBuildRoad', function() {
		beforeEach(function() {
			// p1 is playing
			// Set some cities around
			this.path = new Path(new Location(0, 1), new Location(1, 0));
		});

		it('rejects if the road is occupied', function() {
			this.board.getPath(this.path).owner = this.players[1];

			expect(this.referee.canBuildRoad(this.path)).toBe(false);
		});

		it('accepts if one of the cities belongs to player and the other is empty', function() {
			// Give the start to the current player
			this.board.getCity(this.path.from).owner = this.players[0];

			expect(this.referee.canBuildRoad(this.path)).toBe(true);
		});

		it('accepts if one of the cities belongs to the player and the other to someone else', function() {
			// Give the start to the current player
			this.board.getCity(this.path.from).owner = this.players[0];
			this.board.getCity(this.path.to).owner = this.players[1];

			expect(this.referee.canBuildRoad(this.path)).toBe(true);
		});

		it('rejects if none of the cities are occupied', function() {
			expect(this.referee.canBuildRoad(this.path)).toBe(false);
		});

		it('rejects if none of the cities belongs to player', function() {
			this.board.getPath(this.path).owner = this.players[1];
			// The other has no owner

			expect(this.referee.canBuildRoad(this.path)).toBe(false);
		});

		it('rejects if the road is invalid', function() {
			expect(this.referee.canBuildRoad(new Path(
					new Location(3, 0), new Location(0, -3)
			))).toBe(false);
		});
	});

	describe('#canBuildCity', function() {
		beforeEach(function() {
			// p1 is playing
			this.city = new Location(0, 1);
			// Set some cities around
			this.board.getCity(this.city).owner = this.players[0];
		});

		it('can build on one own colony', function() {
			expect(this.referee.canBuildCity(this.city)).toBe(true);
		});

		it('can build on a city', function() {
			this.board.getCity(this.city).evolve();
			expect(this.referee.canBuildCity(this.city)).toBe(false);
		});

		it('cannot build on invalid location', function() {
			expect(this.referee.canBuildCity(new Location(0, 0))).toBe(false);
		});

		it('cannot build on someone else spot', function() {
			var anotherCity = new Location(1, 0);
			this.board.getCity(anotherCity).owner = this.players[1];
			expect(this.referee.canBuildCity(anotherCity)).toBe(false);
		});

		it('cannot build on an empty spot', function() {
			expect(this.referee.canBuildCity(new Location(1, 0))).toBe(false);
		});
	});

	describe('#isTurn', function() {
		it('is only turn of one player', function() {
			for (let player of this.players) {
				let isCurrentPlayer = this.referee.currentPlayer.id === player.id;
				expect(this.referee.isTurn(player)).toBe(isCurrentPlayer);
			}
		});
	});

	describe('#endTurn', function() {
		it('fails if there are remaining required actions', function() {
			// At start, turn is not complete
			expect(() => this.referee.endTurn()).toThrowError();
		});

		it('succeeds when all required tasks are performed', function() {
			this.referee.completeTurn();
			expect(() => this.referee.endTurn()).toChangeBy(() => this.referee.turn, 1);
		});
	});
});

describe('GameReferee', function() {
	beforeEach(function() {
		this.socket = new MockSocket();

		this.board = new Board();
		this.board.generate(new RoundGenerator(3));
		this.players = [
			new Player(this.socket, 1),
			new Player(this.socket, 2),
			new Player(this.socket, 3)
		];
		this.playerIds = this.players.map(player => player.id);

		this.referee = new GameReferee(this.board, this.players);
	});

	describe('constructor', function() {
		it('selects a player as current', function() {
			expect(this.referee.currentPlayer.id).toEqual(this.playerIds[0]);
		});
	});

	describe('#endTurn', function() {
		beforeEach(function() {
			this.firstPlayer = this.referee.currentPlayer;
		});

		describe('without required actions', function() {
			it('requires dice rolling', function() {
				expect(() => this.referee.endTurn()).toThrowError(Error, /pending actions/i);
			});

			it('requires thief move on 7\'s', function() {
				this.referee.rollDice(7); // Need to move thiefs

				expect(() => this.referee.endTurn()).toThrowError(Error, /pending actions/i);
			});
		});

		describe('when ok', function() {
			beforeEach(function() {
				this.referee.rollDice(6);
				this.referee.endTurn();
			});

			it('changes to another player', function() {
				expect(this.referee.currentPlayer.id).not.toBe(this.firstPlayer.id);
				expect(this.referee.currentPlayer.id).toBeIn(this.playerIds);
			});

			it('loops over all the players', function() {
				// After 5 more changes, we return to the first players
				for (let i = 2; i <= 6; i += 1) {
					this.referee.rollDice(8);
					this.referee.endTurn();
					expect(this.referee.currentPlayer.id).toBe(this.playerIds[i % this.playerIds.length]);
				}
			});
		});
	});

	describe('#canRollDice', function() {
		it('can roll dice at first', function() {
			expect(this.referee.canRollDice()).toBe(true);
		});

		it('cannot roll dice more than once', function() {
			this.referee.rollDice(2);
			expect(this.referee.canRollDice()).toBe(false);
		});
	});

	describe('#moveThieves', function() {
		beforeEach(function() {
			this.referee.rollDice(7);

			var tiles = this.board.tiles;
			this.newThievesLocation = tiles[0].resource !== 'desert' ?
					tiles[0].location : tiles[1].location;
		});

		it('rejects move on invalid location', function() {
			expect(() => this.referee.moveThieves(new Location(0, 1))).toThrow();
		});

		it('rejects move on the same location', function() {
			expect(() => this.referee.moveThieves(this.board.thieves)).toThrow();
		});

		it('allows player to end turn', function() {
			this.referee.moveThieves(this.newThievesLocation);
			expect(() => this.referee.endTurn()).not.toThrow();
		});
	});

	describe('#hasEnoughResources', function() {
		beforeEach(function() {
			this.player = this.players[0];
		});

		it('returns true if there is enough', function() {
			this.player.receiveResources({ bois: 2, mouton: 3, ble: 4});
			expect(this.referee.hasEnoughResources(this.player, { bois: 1, ble: 3})).toBe(true);
		});

		it('returns false if there is not enough', function() {
			this.player.receiveResources({ bois: 2, mouton: 3, ble: 4});
			expect(this.referee.hasEnoughResources(this.player, { caillou: 1, bois: 3})).toBe(false);
		});

		it('support border cases', function() {
			this.player.receiveResources({ bois: 2, mouton: 3, ble: 4});
			expect(this.referee.hasEnoughResources(this.player, { bois: 2, mouton: 3 })).toBe(true);
		});
	});

	describe('#settleColony', function() {
		beforeEach(function() {
			this.currentPlayer = this.referee.currentPlayer;

			// Roll dice before action
			this.referee.rollDice(8);

			// Give just enough to the player
			this.currentPlayer.receiveResources({ ble: 1, tuile: 1,  bois: 1, mouton: 1 });
		});

		it('accepts if rules are followed', function() {
			expect(() => this.referee.settleColony(new Location(1, 0))).not.toThrow();
		});

		it('rejects if the player lacks resources', function() {
			// Resets player resources
			this.currentPlayer.useResources(this.currentPlayer.resources);

			expect(() => this.referee.settleColony(new Location(1, 0))).toThrowError(/Not enough resources/i);
		});

		it('rejects if it is not the correct step', function() {
			// End the turn of the current player to be at the beginning of the next turn
			this.referee.endTurn();

			expect(() => this.referee.settleColony(new Location(1, 0))).toThrowError(/Not the correct step/i);
		});

		it('rejects if the location is occupied', function() {
			var location = new Location(1, 0);
			this.board.getCity(location).owner = this.players[1];

			expect(() => this.referee.settleColony(location)).toThrowError(/Cannot build colony/i);
		});

		it('rejects if the location is too close', function() {
			this.board.getCity(new Location(0, 1)).owner = this.players[1];

			expect(() => this.referee.settleColony(new Location(1, 0))).toThrowError(/Cannot build colony/i);
		});

		it('rejects if the location is invalid', function() {
			expect(() => this.referee.settleColony(new Location(0, 0))).toThrowError(/Cannot build colony/i);
		});
	});

	describe('#buildRoad', function() {
		beforeEach(function() {
			this.currentPlayer = this.referee.currentPlayer;

			// Roll dice before action
			this.referee.rollDice(8);
			// Give just enough to the player
			this.currentPlayer.receiveResources({ tuile: 1, bois: 1 });

			this.path = new Path(
				new Location(1, 0), new Location(0, 1)
			);
		});

		it('accepts if rules are followed', function() {
			// Give the start to the current player
			this.board.getCity(this.path.from).owner = this.currentPlayer;

			expect(() => this.referee.buildRoad(this.path)).not.toThrow();
		});

		it('rejects if the player lacks resources', function() {
			// Resets player resources
			this.currentPlayer.useResources(this.currentPlayer.resources);

			expect(() => {
				this.referee.buildRoad(this.path);
			}).toThrowError(/Not enough resources/i);
		});

		it('rejects if it is not the correct step', function() {
			// End the turn of the current player to be at the beginning of the next turn
			this.referee.endTurn();

			expect(() => {
				this.referee.buildRoad(this.path);
			}).toThrowError(/Not the correct step/i);
		});

		it('rejects if the road is occupied', function() {
			this.board.getPath(this.path).owner = this.players[1];

			expect(() => this.referee.buildRoad(this.path)).toThrowError(/Cannot build road/i);
		});

		it('accepts if one of the cities belongs to player and the other is empty', function() {
			// Give the start to the current player
			this.board.getCity(this.path.from).owner = this.currentPlayer;

			// Give just enough to the player
			this.currentPlayer.receiveResources({ tuile: 1, bois: 1 });

			expect(() => this.referee.buildRoad(this.path)).not.toThrow();
		});

		it('accepts if one of the cities belongs to the player and the other to someone else', function() {
			// Give the start to the current player
			this.board.getCity(this.path.from).owner = this.players[0];
			this.board.getCity(this.path.to).owner = this.players[1];

			// Give just enough to the player
			this.currentPlayer.receiveResources({ tuile: 1, bois: 1 });
			expect(() => this.referee.buildRoad(this.path)).not.toThrow();
		});

		it('rejects if none of the cities are occupied', function() {
			expect(() => this.referee.buildRoad(this.path)).toThrowError(/Cannot build road/i);
		});

		it('rejects if none of the cities belongs to player', function() {
			this.board.getPath(this.path).owner = this.players[1];

			expect(() => this.referee.buildRoad(this.path)).toThrowError(/Cannot build road/i);
		});

		it('rejects if the road is invalid', function() {
			expect(() => {
				this.referee.buildRoad(new Path(
					new Location(3, 0), new Location(0, -3)
				));
			}).toThrowError(/Cannot build road/i);
		});
	});

	describe('#buildCity', function() {
		beforeEach(function() {
			this.currentPlayer = this.referee.currentPlayer;

			// Roll dice before action
			this.referee.rollDice(8);

			this.city = new Location(0, 1);
			this.board.getCity(this.city).owner = this.currentPlayer;

			// Give just enough to the player
			this.currentPlayer.receiveResources({ ble: 2, caillou: 3 });
		});

		it('accepts if rules are followed', function() {
			expect(() => this.referee.buildCity(this.city)).not.toThrow();
		});

		it('rejects if the player lacks resources', function() {
			// Resets player resources
			this.currentPlayer.useResources(this.currentPlayer.resources);

			expect(() => this.referee.buildCity(this.city)).toThrowError(/Not enough resources/i);
		});

		it('rejects if it is not the correct step', function() {
			// End the turn of the current player to be at the beginning of the next turn
			this.referee.endTurn();

			expect(() => this.referee.buildCity(this.city)).toThrowError(/Not the correct step/i);
		});

		it('rejects if the location is occupied', function() {
			var anotherCity = new Location(1, 0);
			this.board.getCity(anotherCity).owner = this.players[1];

			expect(() => this.referee.buildCity(anotherCity)).toThrowError(/Cannot build city/i);
		});

		it('rejects if the location is invalid', function() {
			expect(() => this.referee.buildCity(new Location(0, 0))).toThrowError(/Cannot build city/i);
		});

		it('rejects if there is no colony yet', function() {
			expect(() => this.referee.buildCity(new Location(1, 0))).toThrowError(/Cannot build city/i);
		});
	});
});

describe('PlacementReferee', function() {
	beforeEach(function() {
		this.socket = new MockSocket();

		this.board = new Board();
		this.board.generate(new RoundGenerator(3));
		this.players = [
			new Player(this.socket.toSocket(), 1),
			new Player(this.socket.toSocket(), 2)
		];
		this.referee = new PlacementReferee(this.board, this.players);
	});

	it('starts with the first player', function() {
		expect(this.referee.currentPlayer.id).toEqual(this.players[0].id);
	});

	describe('#hasRemainingRequiredActions', function() {
		it('says true at turn start', function() {
			expect(this.referee.hasRemainingRequiredActions()).toBe(true);
		});

		it('says true after placing a city', function() {
			this.referee.pickColony(new Location(0, 2));
			expect(this.referee.hasRemainingRequiredActions()).toBe(true);
		});

		it('says false after picking the road', function() {
			var city = new Location(0, 2);
			this.referee.pickColony(city);
			this.board.getCity(city).owner = this.referee.currentPlayer;
			this.referee.pickPath(city, new Location(1, 2));

			expect(this.referee.hasRemainingRequiredActions()).toBe(false);
		});
	});

	describe('#pickColony', function() {
		beforeEach(function() {
			// p1 turn is in progress
			// Give a city to p2
			this.board.getCity(new Location(0, 1)).owner = this.players[1];
		});

		it('accepts picking a city correctly', function() {
			expect(() => this.referee.pickColony(new Location(0, -1))).not.toThrowError();
		});

		it('rejects picking a city near someone else city', function() {
			expect(() => this.referee.pickColony(new Location(0, 2))).toThrowError();
		});

		it('rejects picking someone else city', function() {
			expect(() => this.referee.pickColony(new Location(0, 1))).toThrowError();
		});

		it('rejects picking an invalid location as city', function() {
			expect(() => this.referee.pickColony(new Location(0, 0))).toThrowError();
		});
	});

	describe('#isPlacementComplete', function() {
		beforeEach(function() {
			this.pick = function(cityX, cityY, toX, toY) {
				var player = this.referee.currentPlayer;

				var city = new Location(cityX, cityY);
				this.referee.pickColony(city);
				this.board.getCity(city).owner = player;

				var path = new Path(new Location(cityX, cityY), new Location(toX, toY));
				this.referee.pickPath(path);
				this.board.getPath(path).owner = player;

				this.referee.endTurn();
			};
		});

		it('is complete after each player pick twice', function() {
			this.pick(0, 2, 1, 2); // for p1
			this.pick(2, 0, 3, -1); // for p2
			this.pick(0, -2, -1, -2); // for p1
			// Last pick
			expect(() => {
				this.pick(-2, 0, -3, 1);  // for p2
			}).toChangeFromTo(() => this.referee.isPlacementComplete(), false, true);
		});

		it('is not complete at start', function() {
			expect(this.referee.isPlacementComplete()).toBe(false);
		});
	});
});