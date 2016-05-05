import { PlacementReferee } from './referee';

import { MockSocket } from 'server/core/com/mocks';
import Player from 'server/core/game/players/player';
import Board from 'server/catane/elements/boards/board';
import Location from 'server/catane/elements/geo/location.js';
import Path from 'server/catane/elements/geo/path.js';
import { RoundGenerator } from 'server/catane/elements/boards/generators/maps.js';

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