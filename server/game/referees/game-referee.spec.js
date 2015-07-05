import { GameReferee } from './referee';

import { MockSocket } from 'server/com/mocks';
import Player from 'server/game/players/player';
import Board from 'server/elements/boards/board';
import Location from 'server/elements/geo/location.js';
import Path from 'server/elements/geo/path.js';
import { RoundGenerator } from 'server/elements/boards/generators/maps.js';

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
			this.referee.onResourcesDropped();

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

	describe('#convertResources', function() {
		beforeEach(function() {
			this.currentPlayer = this.referee.currentPlayer;

			// Roll dice before action
			this.referee.rollDice(8);

			// Give just enough to the player
			this.currentPlayer.useResources(this.currentPlayer.resources);
			this.currentPlayer.receiveResources({ ble: 3 });
		});

		it('accepts if there are enough resources', function() {
			this.referee.convertResources('ble', 3);
		});

		it('rejects if there are not enough resources', function() {
			expect(() => this.referee.convertResources('ble', 4)).toThrowError(/Not enough resources/i);
			expect(() => this.referee.convertResources('bois', 2)).toThrowError(/Not enough resources/i);
		});

		it('rejects if it is not the correct step', function() {
			// End the turn of the current player to be at the beginning of the next turn
			this.referee.endTurn();

			expect(() => this.referee.convertResources('ble')).toThrowError(/Not the correct step/i);
		});
	});

	describe('#exchangeResources', function() {
		beforeEach(function() {
			this.currentPlayer = this.referee.currentPlayer;
			for (let p of this.players) {
				if (p.id !== this.currentPlayer.id) {
					this.otherPlayer = p;
					break;
				}
			}

			// Roll dice before action
			this.referee.rollDice(8);

			this.currentPlayer.useResources(this.currentPlayer.resources);
			this.currentPlayer.receiveResources({ bois: 6 });
			this.otherPlayer.useResources(this.otherPlayer.resources);
			this.otherPlayer.receiveResources({ ble: 2, mouton: 3 });

			this.exchange = this.referee.exchangeResources.bind(this.referee, this.otherPlayer);
		});

		it('accepts if there are enough resources on both sides', function() {
			this.exchange({ bois: 4}, { ble: 2, mouton: 2 });
		});

		it('rejects if the giver does not have enough resources', function() {
			expect(() => {
				this.exchange({ ble: 3 }, { mouton: 2 });
			}).toThrowError(/Not enough resources to give/i);
		});

		it('rejects if the receiver does not have enough resources', function() {
			expect(() => {
				this.exchange({ bois: 3 }, { mouton: 4 });
			}).toThrowError(/Not enough resources to receive/i);
		});

		it('rejects if there are no resources given', function() {
			expect(() => {
				this.exchange({}, { mouton: 2 });
			}).toThrowError(/Cannot exchange without giving resources/i);
		});

		it('rejects if there are no resources received', function() {
			expect(() => {
				this.exchange({ bois: 3 }, {});
			}).toThrowError(/Cannot exchange without receiving resources/i);
		});

		it('rejects if it is not the correct step', function() {
			// End the turn of the current player to be at the beginning of the next turn
			this.referee.endTurn();

			expect(() => {
				this.exchange({ bois: 4 }, { ble: 2, mouton: 2 });
			}).toThrowError(/Not the correct step/i);
		});
	});
});