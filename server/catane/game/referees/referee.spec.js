import { AReferee } from './referee';

import { MockSocket } from 'server/core/com/mocks';
import Player from 'server/core/game/players/player';
import Board from 'server/catane/elements/boards/board';
import Location from 'server/catane/elements/geo/location.js';
import Path from 'server/catane/elements/geo/path.js';
import { RoundGenerator } from 'server/catane/elements/boards/generators/maps.js';

class TestReferee extends AReferee {
	constructor(board, players) {
		super(board, players);
		this._turn = 0;
		this._readyToEnd = false;

		this.startTurn();
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
			this.player = this.players[0];
			this.other = this.players[1];
		});

		it('rejects if the road is occupied', function() {
			this.board.getPath(this.path).owner = this.other;

			expect(this.referee.canBuildRoad(this.path)).toBe(false);
		});

		it('rejects if the road is invalid', function() {
			expect(this.referee.canBuildRoad(new Path(
					new Location(3, 0), new Location(0, -3)
			))).toBe(false);
		});

		describe('with no path around', function() {
			it('accepts if one of the cities belongs to player and the other is empty', function() {
				// Give the start to the current player
				this.board.getCity(this.path.from).owner = this.player;

				expect(this.referee.canBuildRoad(this.path)).toBe(true);
			});

			it('accepts if one of the cities belongs to the player and the other to someone else', function() {
				// Give the start to the current player
				this.board.getCity(this.path.from).owner = this.player;
				this.board.getCity(this.path.to).owner = this.other;

				expect(this.referee.canBuildRoad(this.path)).toBe(true);
			});

			it('rejects if none of the cities are occupied', function() {
				expect(this.referee.canBuildRoad(this.path)).toBe(false);
			});

			it('rejects if none of the cities belongs to player', function() {
				this.board.getPath(this.path).owner = this.other;
				// The other has no owner

				expect(this.referee.canBuildRoad(this.path)).toBe(false);
			});
		});

		describe('with previous connected paths', function() {
			beforeEach(function() {
				this.anotherPath = new Path(new Location(1, 0), new Location(2, 0));
			});

			describe('belonging to the player', function() {
				beforeEach(function() {
					this.board.getPath(this.anotherPath).owner = this.player;
				});

				it('accepts if a path leads to it', function() {
					expect(this.referee.canBuildRoad(this.path)).toBe(true);
				});

				it('rejects if the city is owned by someone else', function() {
					this.board.getCity(new Location(1, 0)).owner = this.other;

					expect(this.referee.canBuildRoad(this.path)).toBe(false);
				});
			});

			describe('belonging to someone else', function() {
				beforeEach(function() {
					this.board.getPath(this.anotherPath).owner = this.other;
				});

				it('rejects the build', function() {
					expect(this.referee.canBuildRoad(this.path)).toBe(false);
				});
			});
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
