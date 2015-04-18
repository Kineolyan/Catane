import Board from './board';

import Location from '../geo/location';
import Path from '../geo/path.js';
import City from '../geo/city';
import { RoundGenerator } from './generators/maps.js';

describe('Board', function () {

	describe('constructor', function () {
		beforeEach(function () {
			this.board = new Board();
		});

		it('has no tiles', function () {
			expect(this.board.tiles).toBeEmpty();
		});

		it('has no cities', function () {
			var cities = this.board.cities.map(city => city);
			expect(cities).toBeEmpty();
		});

		it('has no paths', function () {
			expect(this.board.paths).toBeEmpty();
		});
	});

	describe('#generate', function () {
		beforeEach(function () {
			this.board = new Board();
			this.board.generate({
				forEachTile: function (action) {
					action("tile");
				},
				forEachCity: function (action) {
					action(new City(1, 2));
					action(new City(3, 4));
				},
				forEachPath: function (action) {
					action(new Path(new Location(1, 2), new Location(3, 4)));
					action(new Path(new Location(3, 4), new Location(5, 6)));
					action(new Path(new Location(5, 6), new Location(7, 8)));
				}
			});
		});

		it('has all generated tiles', function () {
			expect(this.board.tiles).toEqual([ "tile" ]);
		});

		it('has all generated cities', function () {
			var cityLocations = this.board.cities.map(city => city.location);
			expect(cityLocations).toHaveMembers([ new Location(1, 2), new Location(3, 4) ]);
		});

		it('has all generated paths', function () {
			expect(this.board.paths).toHaveMembers([
				new Path(new Location(1, 2), new Location(3, 4)),
				new Path(new Location(3, 4), new Location(5, 6)),
				new Path(new Location(5, 6), new Location(7, 8))
			]);
		});
	});

	describe('#getCity', function () {
		beforeEach(function () {
			this.board = new Board();
			this.board.generate(new RoundGenerator(1));
		});

		it('finds existing cities', function () {
			expect(this.board.getCity(new Location(0, 1))).not.toBeUndefined();
		});

		it('returns undefined on unexisting spots', function () {
			expect(this.board.getCity(new Location(1, 1))).toBeUndefined();
		});
	});

	describe('#getSurroundingCities', function() {
		beforeEach(function() {
			this.board = new Board();
			this.board.generate(new RoundGenerator(2));
		});

		it('get correct cities inside the board', function() {
			// Test the two patterns
			var cityLocations = this.board.getSurroundingCities(new Location(0, 1))
					.map(city => city.location);
			expect(cityLocations).toHaveMembers([ new Location(0, 2), new Location(1, 0), new Location(-1, 1)]);

			cityLocations = this.board.getSurroundingCities(new Location(0, -1))
					.map(city => city.location);
			expect(cityLocations).toHaveMembers([ new Location(0, -2), new Location(-1, 0), new Location(1, -1)]);
		});

		it('get correct cities on board border', function() {
			var cityLocations = this.board.getSurroundingCities(new Location(1, 2))
					.map(city => city.location);
			expect(cityLocations).toHaveMembers([ new Location(0, 2), new Location(2, 1)]);
		});
	});

	describe('#getPath', function() {
		beforeEach(function () {
			this.board = new Board();
			this.board.generate(new RoundGenerator(1));
		});

		it('finds existing paths', function () {
			expect(this.board.getPath(new Location(0, 1), new Location(1, 0))).not.toBeUndefined();
		});

		it('returns undefined on unknown paths', function () {
			expect(this.board.getPath(new Location(0, 0), new Location(1, 1))).toBeUndefined();
		});
	});

	describe('#getPathsFrom', function() {
		beforeEach(function() {
			this.board = new Board();
			this.board.generate(new RoundGenerator(2));
		});

		it('get correct cities inside the board', function() {
			// Test the two patterns
			var startLocation = new Location(0,1);
			var paths = this.board.getPathsFrom(startLocation);
			expect(paths).toHaveMembers([
				new Path(startLocation, new Location(0, 2)),
				new Path(startLocation, new Location(1, 0)),
				new Path(startLocation, new Location(-1, 1))
			]);

			startLocation = new Location(0, -1);
			paths = this.board.getPathsFrom(startLocation);
			expect(paths).toHaveMembers([
				new Path(startLocation, new Location(0, -2)),
				new Path(startLocation, new Location(-1, 0)),
				new Path(startLocation, new Location(1, -1))
			]);
		});

		it('get correct cities on board border', function() {
			var startLocation = new Location(1, 2);
			var paths = this.board.getPathsFrom(new Location(1, 2));
			expect(paths).toHaveMembers([
				new Path(startLocation, new Location(0, 2)),
				new Path(startLocation, new Location(2, 1))
			]);
		});
	});

});
