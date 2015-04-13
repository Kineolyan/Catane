import { GameReferee, PlacementReferee } from './referee';

import { MockSocket } from '../../com/mocks';
import Player from '../players/player';
import Board from '../../elements/boards/board';
import Location from '../../elements/geo/location.js';
import { RoundGenerator } from '../../elements/boards/generators/maps.js';

describe('AReferee', function() {
	beforeEach(function() {
		this.socket = new MockSocket();

		this.board = new Board();
		this.board.generate(new RoundGenerator(2));
		this.players = [
			new Player(this.socket.toSocket(), 1),
			new Player(this.socket.toSocket(), 2)
		];
		// We test if with a GameReferee since it is less complicated
		this.referee = new GameReferee(this.board, this.players);
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

	describe('#isTurn', function() {
		it('is only turn of one player', function() {
			for (let player of this.players) {
				let isCurrentPlayer = this.referee.currentPlayer.id === player.id;
				expect(this.referee.isTurn(player)).toBe(isCurrentPlayer);
			}
		});
	});
});

describe('GameReferee', function() {
	beforeEach(function() {
		this.socket = new MockSocket();

		this.board = null;
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
			this.referee.moveThieves();
		});

		it('allows player to end turn', function() {
			expect(() => this.referee.endTurn()).not.toThrow();
		});
	});

});

describe('PlacementReferee', function() {
	beforeEach(function() {
		this.socket = new MockSocket();

		this.board = new Board();
		this.board.generate(new RoundGenerator(2));
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
			this.referee.pickCity(new Location(0, 2));
			expect(this.referee.hasRemainingRequiredActions()).toBe(true);
		});

		it('says false after picking the road', function() {
			var city = new Location(0, 2);
			this.referee.pickCity(city);
			this.referee.pickPath(city, new Location(1, 2));

			expect(this.referee.hasRemainingRequiredActions()).toBe(false);
		});
	});

	describe('#pickCity', function() {
		beforeEach(function() {
			// p1 turn is in progress
			// Give a city to p2
			this.board.getCity(new Location(0, 1)).owner = this.players[1];
		});

		it('accepts picking a city correctly', function() {
			expect(() => this.referee.pickCity(new Location(0, -1))).not.toThrowError();
		});

		it('rejects picking a city near someone else city', function() {
			expect(() => this.referee.pickCity(new Location(0, 2))).toThrowError();
		});

		it('rejects picking someone else city', function() {
			expect(() => this.referee.pickCity(new Location(0, 1))).toThrowError();
		});

		it('rejects picking an invalid location as city', function() {
			expect(() => this.referee.pickCity(new Location(0, 0))).toThrowError();
		});
	});

	describe('#pickCity', function() {
		beforeEach(function() {
			// p1 turn is in progress
			// Give a city to p2
			var cityLocation = new Location(0, 1);
			this.board.getCity(cityLocation).owner = this.players[1];
			this.board.getPath(new Path(cityLocation, cityLocation.shift(1, -1))).owner = this.players[1];
		});
	});
});